const assert = require('node:assert/strict');
const test = require('node:test');

const {
  CAPABILITIES,
  ProviderError,
  exitCodeFor,
  normalizeOutcome,
  validateManifest,
  validateRequest
} = require('../core/contract.cjs');
const {
  createMedia,
  generateMedia,
  listCapabilities,
  statusMedia,
  waitMedia
} = require('../core/media.cjs');

function provider(overrides = {}) {
  return {
    isConfigured: () => true,
    supports: () => ({ supported: true }),
    create: async () => ({ status: 'succeeded', artifact_sources: [] }),
    ...overrides
  };
}

function entry(id, priority, overrides = {}) {
  return {
    id,
    enabled: true,
    priority,
    capabilities: ['text-to-image'],
    provider: provider(),
    ...overrides
  };
}

test('manifest rejects duplicate priorities between enabled providers', () => {
  assert.throws(
    () => validateManifest([entry('first', 10), entry('second', 10)]),
    (error) => error instanceof ProviderError
      && error.kind === 'configuration_error'
      && /priority/i.test(error.message)
  );
});

test('manifest priority order is deterministic and independent of array order', () => {
  const sorted = validateManifest([
    entry('third', 30),
    entry('first', 10),
    entry('second', 20)
  ]);

  assert.deepEqual(sorted.map(({ id }) => id), ['first', 'second', 'third']);
});

test('disabled providers do not reserve a priority', () => {
  const sorted = validateManifest([
    entry('disabled', 10, { enabled: false }),
    entry('enabled', 10)
  ]);

  assert.deepEqual(sorted.map(({ id }) => id), ['disabled', 'enabled']);
});

test('manifest rejects duplicate ids, invalid capabilities, and incomplete providers', async (t) => {
  await t.test('duplicate id', () => {
    assert.throws(
      () => validateManifest([entry('same', 10), entry('same', 20)]),
      (error) => error.kind === 'configuration_error' && /id/i.test(error.message)
    );
  });

  await t.test('duplicate capability', () => {
    assert.throws(
      () => validateManifest([
        entry('duplicate-capability', 10, {
          capabilities: ['text-to-image', 'text-to-image']
        })
      ]),
      (error) => error.kind === 'configuration_error' && /capabilit/i.test(error.message)
    );
  });

  await t.test('unknown capability', () => {
    assert.throws(
      () => validateManifest([
        entry('unknown-capability', 10, { capabilities: ['speech-to-text'] })
      ]),
      (error) => error.kind === 'configuration_error' && /capabilit/i.test(error.message)
    );
  });

  await t.test('missing create function', () => {
    const incomplete = provider();
    delete incomplete.create;
    assert.throws(
      () => validateManifest([entry('incomplete', 10, { provider: incomplete })]),
      (error) => error.kind === 'configuration_error' && /create/i.test(error.message)
    );
  });
});

test('new work accepts an optional provider but requires capability and prompt', () => {
  const request = validateRequest('create', {
    provider: 'agnes',
    capability: 'text-to-image',
    prompt: 'A clean studio product photo',
    inputs: [],
    parameters: {},
    output: { directory: 'outputs' }
  });

  assert.equal(request.provider, 'agnes');
  assert.throws(
    () => validateRequest('generate', { capability: 'text-to-image', prompt: ' ' }),
    (error) => error.kind === 'invalid_request' && /prompt/i.test(error.message)
  );
});

test('status and wait require the original provider and opaque task id', async (t) => {
  const valid = {
    provider: 'agnes',
    capability: 'image-to-video',
    task: { id: 'video_123' }
  };

  assert.equal(validateRequest('status', valid).task.id, 'video_123');
  assert.equal(validateRequest('wait', valid).provider, 'agnes');

  await t.test('missing provider', () => {
    assert.throws(
      () => validateRequest('status', { ...valid, provider: undefined }),
      (error) => error.kind === 'invalid_request' && /provider/i.test(error.message)
    );
  });

  await t.test('missing task id', () => {
    assert.throws(
      () => validateRequest('wait', { ...valid, task: {} }),
      (error) => error.kind === 'invalid_request' && /task\.id/i.test(error.message)
    );
  });
});

test('provider outcomes normalize optional collections and reject unknown states', () => {
  assert.deepEqual(normalizeOutcome({ status: 'queued', task: { id: 'task-1' } }), {
    status: 'queued',
    task: { id: 'task-1' },
    artifact_sources: [],
    effective_parameters: {},
    warnings: []
  });

  assert.throws(
    () => normalizeOutcome({ status: 'finished' }),
    (error) => error.kind === 'invalid_response'
  );
});

test('stable error categories map to CLI exit codes', () => {
  assert.equal(exitCodeFor(new ProviderError('invalid_request', 'bad input')), 2);
  assert.equal(exitCodeFor(new ProviderError('authentication', 'bad key')), 3);
  assert.equal(exitCodeFor(new ProviderError('quota_exhausted', 'no quota')), 4);
  assert.equal(exitCodeFor(new ProviderError('task_failed', 'failed')), 5);
  assert.equal(exitCodeFor(new ProviderError('wait_timeout', 'still running')), 6);
  assert.equal(exitCodeFor(new Error('unknown')), 5);
});

test('automatic creation uses ascending priority instead of manifest order', async () => {
  const calls = [];
  const first = provider({
    create: async () => {
      calls.push('first');
      return { status: 'succeeded', artifact_sources: [] };
    }
  });
  const second = provider({
    create: async () => {
      calls.push('second');
      return { status: 'succeeded', artifact_sources: [] };
    }
  });

  const result = await createMedia({
    capability: 'text-to-image',
    prompt: 'studio product'
  }, {
    manifest: [entry('second', 20, { provider: second }), entry('first', 10, { provider: first })]
  });

  assert.equal(result.provider, 'first');
  assert.deepEqual(calls, ['first']);
});

test('automatic creation skips unconfigured and unsupported providers', async () => {
  const calls = [];
  const unconfigured = provider({
    isConfigured: () => false,
    create: async () => calls.push('unconfigured')
  });
  const unsupported = provider({
    supports: () => ({ supported: false, reason: 'model mismatch' }),
    create: async () => calls.push('unsupported')
  });
  const eligible = provider({
    create: async () => {
      calls.push('eligible');
      return { status: 'queued', task: { id: 'task-1' } };
    }
  });

  const result = await createMedia({
    capability: 'text-to-image',
    prompt: 'studio product'
  }, {
    manifest: [
      entry('unconfigured', 10, { provider: unconfigured }),
      entry('unsupported', 20, { provider: unsupported }),
      entry('eligible', 30, { provider: eligible })
    ]
  });

  assert.equal(result.provider, 'eligible');
  assert.deepEqual(calls, ['eligible']);
});

test('automatic creation falls back only after authoritative pre-acceptance rejection', async () => {
  const calls = [];
  const rejected = provider({
    create: async () => {
      calls.push('rejected');
      throw new ProviderError('provider_unavailable', 'rejected before acceptance', {
        accepted: false
      });
    }
  });
  const fallback = provider({
    create: async () => {
      calls.push('fallback');
      return { status: 'succeeded' };
    }
  });

  const result = await createMedia({
    capability: 'text-to-image',
    prompt: 'studio product'
  }, {
    manifest: [
      entry('rejected', 10, { provider: rejected }),
      entry('fallback', 20, { provider: fallback })
    ]
  });

  assert.equal(result.provider, 'fallback');
  assert.deepEqual(calls, ['rejected', 'fallback']);
});

test('automatic creation blocks fallback when acceptance is unknown', async () => {
  const calls = [];
  const ambiguous = provider({
    create: async () => {
      calls.push('ambiguous');
      throw new ProviderError('network', 'response lost');
    }
  });
  const fallback = provider({
    create: async () => {
      calls.push('fallback');
      return { status: 'succeeded' };
    }
  });

  await assert.rejects(
    createMedia({ capability: 'text-to-image', prompt: 'studio product' }, {
      manifest: [
        entry('ambiguous', 10, { provider: ambiguous }),
        entry('fallback', 20, { provider: fallback })
      ]
    }),
    (error) => error.kind === 'network' && error.provider === 'ambiguous'
  );
  assert.deepEqual(calls, ['ambiguous']);
});

test('explicit provider selection never calls a fallback provider', async () => {
  const calls = [];
  const selected = provider({
    create: async () => {
      calls.push('selected');
      throw new ProviderError('provider_unavailable', 'not accepted', { accepted: false });
    }
  });
  const other = provider({
    create: async () => {
      calls.push('other');
      return { status: 'succeeded' };
    }
  });

  await assert.rejects(
    createMedia({
      provider: 'selected',
      capability: 'text-to-image',
      prompt: 'studio product'
    }, {
      manifest: [
        entry('other', 10, { provider: other }),
        entry('selected', 20, { provider: selected })
      ]
    }),
    (error) => error.provider === 'selected'
  );
  assert.deepEqual(calls, ['selected']);
});

test('status and wait stay pinned to the named provider', async () => {
  const calls = [];
  const pinned = provider({
    status: async (task) => {
      calls.push(`pinned:${task.id}`);
      return { status: 'succeeded', task: { id: task.id }, artifact_sources: [] };
    }
  });
  const higherPriority = provider({
    status: async () => {
      calls.push('higher-priority');
      return { status: 'succeeded' };
    }
  });
  const context = {
    manifest: [
      entry('higher-priority', 10, { provider: higherPriority }),
      entry('pinned', 20, { provider: pinned })
    ]
  };
  const request = {
    provider: 'pinned',
    capability: 'text-to-image',
    task: { id: 'opaque-id' }
  };

  assert.equal((await statusMedia(request, context)).provider, 'pinned');
  assert.equal((await waitMedia(request, context)).provider, 'pinned');
  assert.deepEqual(calls, ['pinned:opaque-id', 'pinned:opaque-id']);
});

test('wait timeout preserves the pinned task without resubmitting work', async () => {
  let currentMs = 0;
  let statusCalls = 0;
  const pinned = provider({
    status: async (task) => {
      statusCalls += 1;
      return { status: 'running', task: { id: task.id, progress: 20 }, poll_after_ms: 800 };
    }
  });

  const result = await waitMedia({
    provider: 'pinned',
    capability: 'text-to-video',
    task: { id: 'video-1' },
    wait: { timeout_seconds: 1 }
  }, {
    manifest: [entry('pinned', 10, {
      provider: pinned,
      capabilities: ['text-to-video']
    })],
    now: () => currentMs,
    sleep: async (delayMs) => { currentMs += delayMs; }
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.kind, 'wait_timeout');
  assert.equal(result.provider, 'pinned');
  assert.equal(result.task.id, 'video-1');
  assert.equal(statusCalls, 2);
});

test('generate preflights output before create and materializes successful sources', async () => {
  const events = [];
  const selected = provider({
    create: async () => {
      events.push('create');
      return {
        status: 'succeeded',
        artifact_sources: [{ kind: 'base64', mime_type: 'image/png', value: 'aGVsbG8=' }]
      };
    }
  });

  const result = await generateMedia({
    capability: 'text-to-image',
    prompt: 'studio product'
  }, {
    manifest: [entry('selected', 10, { provider: selected })],
    preflightOutput: async () => { events.push('preflight'); },
    saveArtifacts: async (sources) => {
      events.push(`save:${sources.length}`);
      return [{ type: 'image', path: 'C:/outputs/result-01.png', bytes: 5 }];
    }
  });

  assert.deepEqual(events, ['preflight', 'create', 'save:1']);
  assert.equal(result.ok, true);
  assert.deepEqual(result.artifacts, [
    { type: 'image', path: 'C:/outputs/result-01.png', bytes: 5 }
  ]);
});

test('capabilities are derived from the manifest without checking credentials', () => {
  let configuredChecks = 0;
  const manifest = [
    entry('video', 20, {
      capabilities: ['text-to-video'],
      provider: provider({ isConfigured: () => { configuredChecks += 1; return true; } })
    }),
    entry('image', 10, {
      capabilities: ['text-to-image', 'image-to-image'],
      provider: provider({ isConfigured: () => { configuredChecks += 1; return true; } })
    })
  ];

  assert.deepEqual(listCapabilities(manifest), {
    ok: true,
    providers: [
      { id: 'image', enabled: true, priority: 10, capabilities: ['text-to-image', 'image-to-image'] },
      { id: 'video', enabled: true, priority: 20, capabilities: ['text-to-video'] }
    ],
    capabilities: ['text-to-image', 'image-to-image', 'text-to-video']
  });
  assert.equal(configuredChecks, 0);
});
