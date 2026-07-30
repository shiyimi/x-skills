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
