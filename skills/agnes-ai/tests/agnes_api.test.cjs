const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Readable } = require('node:stream');
const { spawnSync } = require('node:child_process');

function loadSubject() {
  try {
    return require('../scripts/agnes_api.cjs');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('agnes_api.cjs')) {
      return {};
    }
    throw error;
  }
}

const subject = loadSubject();

function makeCredentialDeps({ envValue, fileValue, mode = 0o100600, platform = 'linux' }) {
  let reads = 0;
  return {
    env: envValue === undefined ? {} : { AGNES_API_KEY: envValue },
    homeDir: '/home/tester',
    platform,
    fsApi: {
      readFileSync(filePath, encoding) {
        reads += 1;
        assert.equal(filePath, path.join('/home/tester', '.config', 'agnes', 'api_key'));
        assert.equal(encoding, 'utf8');
        if (fileValue === undefined) {
          const error = new Error('missing');
          error.code = 'ENOENT';
          throw error;
        }
        return fileValue;
      },
      statSync() {
        return { mode };
      }
    },
    get reads() {
      return reads;
    }
  };
}

test('environment credential wins without reading the credential file', () => {
  assert.equal(typeof subject.resolveCredentials, 'function');
  const deps = makeCredentialDeps({ envValue: ' env-key ', fileValue: 'file-key' });

  assert.equal(subject.resolveCredentials(deps), 'env-key');
  assert.equal(deps.reads, 0);
});

test('credential falls back to a private config file', () => {
  assert.equal(typeof subject.resolveCredentials, 'function');
  const deps = makeCredentialDeps({ envValue: undefined, fileValue: ' file-key\n' });

  assert.equal(subject.resolveCredentials(deps), 'file-key');
  assert.equal(deps.reads, 1);
});

test('credential rejects a config file readable by other POSIX users', () => {
  assert.equal(typeof subject.resolveCredentials, 'function');
  const deps = makeCredentialDeps({ envValue: undefined, fileValue: 'file-key', mode: 0o100644 });

  assert.throws(() => subject.resolveCredentials(deps), /0600/);
});

test('text-to-image request uses current Agnes defaults and nested response format', async () => {
  assert.equal(typeof subject.buildImageRequest, 'function');
  const result = await subject.buildImageRequest({
    capability: 'text-to-image',
    prompt: 'A glass cube in a white studio'
  });

  assert.deepEqual(result, {
    model: 'agnes-image-2.1-flash',
    prompt: 'A glass cube in a white studio',
    size: '1K',
    ratio: '1:1',
    extra_body: { response_format: 'url' }
  });
});

test('image-to-image converts a local PNG to an Agnes Data URI', async (t) => {
  assert.equal(typeof subject.buildImageRequest, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-image-map-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const inputPath = path.join(tempDir, 'input.png');
  fs.writeFileSync(inputPath, Buffer.from([0x89, 0x50, 0x4e, 0x47]));

  const result = await subject.buildImageRequest({
    capability: 'image-to-image',
    prompt: 'Make the object matte black',
    inputs: [{ type: 'image', source: { kind: 'path', value: inputPath } }]
  });

  assert.deepEqual(result.extra_body.image, ['data:image/png;base64,iVBORw==']);
  assert.equal(Object.hasOwn(result, 'image'), false);
  assert.equal(Object.hasOwn(result, 'response_format'), false);
});

test('image-to-image rejects unsupported local image types', async (t) => {
  assert.equal(typeof subject.buildImageRequest, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-image-type-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const inputPath = path.join(tempDir, 'input.gif');
  fs.writeFileSync(inputPath, 'GIF89a');

  await assert.rejects(
    subject.buildImageRequest({
      capability: 'image-to-image',
      prompt: 'Edit this image',
      inputs: [{ type: 'image', source: { kind: 'path', value: inputPath } }]
    }),
    /PNG, JPEG, or WEBP/
  );
});

test('video request applies documented defaults', () => {
  assert.equal(typeof subject.buildVideoRequest, 'function');
  const result = subject.buildVideoRequest({
    capability: 'text-to-video',
    prompt: 'A camera glides through a neon city'
  });

  assert.deepEqual(result, {
    model: 'agnes-video-v2.0',
    prompt: 'A camera glides through a neon city',
    width: 1152,
    height: 768,
    num_frames: 121,
    frame_rate: 24
  });
});

test('video request rejects a frame count that does not satisfy 8n + 1', () => {
  assert.equal(typeof subject.buildVideoRequest, 'function');

  assert.throws(
    () => subject.buildVideoRequest({
      capability: 'text-to-video',
      prompt: 'A short product animation',
      parameters: { num_frames: 120 }
    }),
    /8n \+ 1/
  );
});

test('image-to-video rejects local paths because Agnes documents URL input only', () => {
  assert.equal(typeof subject.buildVideoRequest, 'function');

  assert.throws(
    () => subject.buildVideoRequest({
      capability: 'image-to-video',
      prompt: 'Slowly orbit the subject',
      inputs: [{ type: 'image', source: { kind: 'path', value: 'input.png' } }]
    }),
    /public HTTPS URL/
  );
});

test('provider inputs reject credentials and non-public HTTPS hosts', async () => {
  const blockedUrls = [
    'https://user:pass@example.com/input.png',
    'https://localhost/input.png',
    'https://media.localhost/input.png',
    'https://127.0.0.1/input.png',
    'https://10.0.0.1/input.png',
    'https://172.16.0.1/input.png',
    'https://192.168.1.1/input.png',
    'https://169.254.1.1/input.png',
    'https://[::1]/input.png',
    'https://[fc00::1]/input.png',
    'https://[fe80::1]/input.png'
  ];

  for (const value of blockedUrls) {
    await assert.rejects(subject.buildImageRequest({
      capability: 'image-to-image',
      prompt: 'Edit this image',
      inputs: [{ type: 'image', source: { kind: 'url', value } }]
    }), (error) => error.kind === 'invalid_request' && /public HTTPS URL/.test(error.message), value);
  }
});

test('Agnes task states normalize to provider states', () => {
  assert.equal(typeof subject.normalizeStatus, 'function');

  assert.equal(subject.normalizeStatus('queued'), 'queued');
  assert.equal(subject.normalizeStatus('in_progress'), 'running');
  assert.equal(subject.normalizeStatus('completed'), 'succeeded');
  assert.equal(subject.normalizeStatus('failed'), 'failed');
  assert.throws(() => subject.normalizeStatus('mystery'), /Unknown Agnes video status/);
});

test('HTTP status codes map to stable provider error kinds', () => {
  assert.equal(typeof subject.classifyHttpError, 'function');
  const cases = [
    [400, 'invalid_request', false],
    [401, 'authentication', false],
    [402, 'quota_exhausted', false],
    [403, 'permission', false],
    [422, 'invalid_request', false],
    [429, 'rate_limited', true],
    [503, 'provider_unavailable', true]
  ];

  for (const [status, kind, retryable] of cases) {
    const error = subject.classifyHttpError(status, { error: { message: `status ${status}` } });
    assert.equal(error.kind, kind);
    assert.equal(error.retryable, retryable);
    assert.equal(error.httpStatus, status);
  }
});

test('HTTP JSON request uses the fixed Agnes host and bearer authentication', async () => {
  assert.equal(typeof subject.requestJson, 'function');
  let captured;
  const fetchImpl = async (url, options) => {
    captured = { url, options };
    return new Response(JSON.stringify({ created: 1, data: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const result = await subject.requestJson({
    method: 'POST',
    path: '/v1/images/generations',
    apiKey: 'test-secret',
    body: { model: 'agnes-image-2.1-flash' },
    fetchImpl
  });

  assert.deepEqual(result, { created: 1, data: [] });
  assert.equal(captured.url, 'https://api.agnes-ai.cn/v1/images/generations');
  assert.equal(captured.options.method, 'POST');
  assert.equal(captured.options.headers.Authorization, 'Bearer test-secret');
  assert.equal(captured.options.headers['Content-Type'], 'application/json');
  assert.equal(captured.options.body, '{"model":"agnes-image-2.1-flash"}');
});

test('generation POST is attempted once when the network response is lost', async () => {
  assert.equal(typeof subject.requestJson, 'function');
  let attempts = 0;

  await assert.rejects(
    subject.requestJson({
      method: 'POST',
      path: '/v1/videos',
      apiKey: 'test-secret',
      body: { model: 'agnes-video-v2.0' },
      fetchImpl: async () => {
        attempts += 1;
        throw new TypeError('connection reset');
      }
    }),
    (error) => error.kind === 'network' && error.retryable === true
  );

  assert.equal(attempts, 1);
});

test('malformed successful response becomes invalid_response', async () => {
  assert.equal(typeof subject.requestJson, 'function');

  await assert.rejects(
    subject.requestJson({
      method: 'GET',
      path: '/agnesapi?video_id=video_1',
      apiKey: 'test-secret',
      fetchImpl: async () => new Response('<html>bad gateway</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }),
    (error) => error.kind === 'invalid_response' && error.retryable === false
  );
});

test('transient retry stops after an idempotent operation succeeds', async () => {
  assert.equal(typeof subject.withTransientRetry, 'function');
  let attempts = 0;
  const delays = [];

  const result = await subject.withTransientRetry(async () => {
    attempts += 1;
    if (attempts < 3) {
      const error = new Error('temporarily unavailable');
      error.retryable = true;
      throw error;
    }
    return 'done';
  }, {
    maxAttempts: 4,
    baseDelayMs: 100,
    maxDelayMs: 1_000,
    random: () => 0,
    sleep: async (delay) => delays.push(delay)
  });

  assert.equal(result, 'done');
  assert.equal(attempts, 3);
  assert.deepEqual(delays, [100, 200]);
});

test('transient retry does not repeat a non-retryable error', async () => {
  assert.equal(typeof subject.withTransientRetry, 'function');
  let attempts = 0;

  await assert.rejects(subject.withTransientRetry(async () => {
    attempts += 1;
    const error = new Error('invalid request');
    error.retryable = false;
    throw error;
  }, { sleep: async () => {} }), /invalid request/);

  assert.equal(attempts, 1);
});

test('artifact download is unauthenticated and atomically saves media', async (t) => {
  assert.equal(typeof subject.downloadArtifact, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-download-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const destination = path.join(tempDir, 'result-01');
  let capturedOptions;

  const artifact = await subject.downloadArtifact(
    'https://platform-outputs.agnes-ai.space/result.png',
    destination,
    {
      fetchImpl: async (_url, options) => {
        capturedOptions = options;
        return new Response(Buffer.from([1, 2, 3, 4]), {
          status: 200,
          headers: { 'Content-Type': 'image/png' }
        });
      }
    }
  );

  assert.equal(capturedOptions?.headers?.Authorization, undefined);
  assert.equal(artifact.type, 'image');
  assert.equal(artifact.path, `${destination}.png`);
  assert.equal(artifact.source_url, 'https://platform-outputs.agnes-ai.space/result.png');
  assert.equal(artifact.mime_type, 'image/png');
  assert.equal(artifact.bytes, 4);
  assert.deepEqual(fs.readFileSync(artifact.path), Buffer.from([1, 2, 3, 4]));
  assert.equal(fs.existsSync(`${artifact.path}.part`), false);
});

test('artifact download rejects an HTML error page without leaving a partial file', async (t) => {
  assert.equal(typeof subject.downloadArtifact, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-download-html-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const destination = path.join(tempDir, 'result-01');

  await assert.rejects(subject.downloadArtifact(
    'https://platform-outputs.agnes-ai.space/result.png',
    destination,
    {
      fetchImpl: async () => new Response('<html>expired</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    }
  ), (error) => error.kind === 'download_failed');

  assert.deepEqual(fs.readdirSync(tempDir), []);
});

test('artifact download rejects private URLs and embedded credentials before requesting', async (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-private-artifact-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  let calls = 0;

  for (const value of [
    'https://127.0.0.1/result.png',
    'https://user:pass@cdn.example.com/result.png'
  ]) {
    await assert.rejects(subject.downloadArtifact(
      value,
      path.join(tempDir, 'result'),
      { fetchImpl: async () => { calls += 1; } }
    ), (error) => error.kind === 'download_failed' && /public HTTPS URL/.test(error.message));
  }

  assert.equal(calls, 0);
});

test('artifact download validates every redirect before following it', async (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-artifact-redirect-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const calls = [];

  await assert.rejects(subject.downloadArtifact(
    'https://cdn.example.com/result.png',
    path.join(tempDir, 'result'),
    {
      fetchImpl: async (url, options) => {
        calls.push({ url, options });
        return new Response(null, {
          status: 302,
          headers: { Location: 'https://192.168.1.20/internal.png' }
        });
      }
    }
  ), (error) => error.kind === 'download_failed' && /public HTTPS URL/.test(error.message));

  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.redirect, 'manual');
});

test('artifact download retries HTTP 408', async (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-artifact-408-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  let calls = 0;

  const artifact = await subject.downloadArtifact(
    'https://cdn.example.com/result.png',
    path.join(tempDir, 'result'),
    {
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) return new Response('timeout', { status: 408 });
        return new Response(Buffer.from([1, 2, 3]), {
          status: 200,
          headers: { 'Content-Type': 'image/png' }
        });
      },
      retryOptions: { sleep: async () => {}, random: () => 0 }
    }
  );

  assert.equal(calls, 2);
  assert.equal(artifact.bytes, 3);
});

test('Base64 artifact is decoded and atomically saved', async (t) => {
  assert.equal(typeof subject.saveBase64Artifact, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-base64-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const destination = path.join(tempDir, 'result-01');

  const artifact = await subject.saveBase64Artifact('AQIDBA==', destination, 'image/png');

  assert.equal(artifact.path, `${destination}.png`);
  assert.equal(artifact.source_url, null);
  assert.equal(artifact.bytes, 4);
  assert.deepEqual(fs.readFileSync(artifact.path), Buffer.from([1, 2, 3, 4]));
});

test('image workflow maps the request and downloads every result', async (t) => {
  assert.equal(typeof subject.runImage, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-image-run-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (url === 'https://api.agnes-ai.cn/v1/images/generations') {
      return new Response(JSON.stringify({
        created: 1780000000,
        data: [
          { url: 'https://cdn.example.com/one.png', b64_json: null, revised_prompt: null },
          { url: null, b64_json: 'BQYH', revised_prompt: null }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(Buffer.from([1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  };

  const result = await subject.runImage({
    capability: 'text-to-image',
    prompt: 'A luminous floating city',
    output: { directory: tempDir }
  }, {
    apiKey: 'test-secret',
    fetchImpl,
    now: () => new Date('2026-07-30T07:30:12.000Z')
  });

  assert.equal(result.ok, true);
  assert.equal(result.provider, 'agnes');
  assert.equal(result.capability, 'text-to-image');
  assert.equal(result.status, 'succeeded');
  assert.equal(result.artifacts.length, 2);
  assert.equal(result.artifacts.every((artifact) => fs.existsSync(artifact.path)), true);
  assert.equal(calls.length, 2);
  const apiBody = JSON.parse(calls[0].options.body);
  assert.deepEqual(apiBody.extra_body, { response_format: 'url' });
  assert.equal(calls[1].options.headers?.Authorization, undefined);
});

test('image workflow preserves completed artifacts when a later download fails', async (t) => {
  assert.equal(typeof subject.runImage, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-image-partial-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const fetchImpl = async (url) => {
    if (url === 'https://api.agnes-ai.cn/v1/images/generations') {
      return new Response(JSON.stringify({
        created: 1780000000,
        data: [
          { url: 'https://cdn.example.com/one.png', b64_json: null },
          { url: 'https://cdn.example.com/two.png', b64_json: null }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.endsWith('/one.png')) {
      return new Response(Buffer.from([1]), {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      });
    }
    return new Response('expired', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  };

  await assert.rejects(subject.runImage({
    capability: 'text-to-image',
    prompt: 'Two product variants',
    output: { directory: tempDir }
  }, {
    apiKey: 'test-secret',
    fetchImpl,
    now: () => new Date('2026-07-30T07:30:12.000Z')
  }), (error) => {
    assert.equal(error.kind, 'download_failed');
    assert.equal(error.details.artifacts.length, 1);
    assert.equal(fs.existsSync(error.details.artifacts[0].path), true);
    return true;
  });
});

test('video creation returns a resumable video_id after one POST', async () => {
  assert.equal(typeof subject.createVideo, 'function');
  const calls = [];
  const result = await subject.createVideo({
    capability: 'text-to-video',
    prompt: 'A cat walking on a beach at sunset'
  }, {
    apiKey: 'test-secret',
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({
        id: 'task_1',
        task_id: 'task_1',
        video_id: 'video_1',
        object: 'video',
        model: 'agnes-video-v2.0',
        status: 'queued',
        progress: 0,
        created_at: 1780457477,
        seconds: '5.0',
        size: '1152x768'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    },
    now: () => new Date('2026-07-30T07:30:12.000Z')
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.agnes-ai.cn/v1/videos');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(result.ok, true);
  assert.equal(result.status, 'queued');
  assert.deepEqual(result.task, {
    id: 'video_1',
    task_id: 'task_1',
    provider_status: 'queued',
    progress: 0
  });
});

test('video creation rejects a response without video_id', async () => {
  assert.equal(typeof subject.createVideo, 'function');

  await assert.rejects(subject.createVideo({
    capability: 'text-to-video',
    prompt: 'A short animation'
  }, {
    apiKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1',
      status: 'queued'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }), (error) => error.kind === 'invalid_response' && /video_id/.test(error.message));
});

test('video creation reports a provider failed state as task_failed', async () => {
  const result = await subject.createVideo({
    capability: 'text-to-video',
    prompt: 'A short animation'
  }, {
    apiKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1',
      video_id: 'video_1',
      status: 'failed',
      progress: 12
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 'failed');
  assert.equal(result.task.id, 'video_1');
  assert.deepEqual(result.error, {
    kind: 'task_failed',
    message: 'Agnes video generation failed.',
    retryable: false
  });
});

test('video status uses video_id and retries only the idempotent GET', async () => {
  assert.equal(typeof subject.getVideoStatus, 'function');
  let attempts = 0;
  const result = await subject.getVideoStatus('video id/1', {
    apiKey: 'test-secret',
    fetchImpl: async (url, options) => {
      attempts += 1;
      assert.equal(url, 'https://api.agnes-ai.cn/agnesapi?video_id=video+id%2F1');
      assert.equal(options.method, 'GET');
      if (attempts === 1) throw new TypeError('temporary reset');
      return new Response(JSON.stringify({
        id: 'task_1',
        task_id: 'task_1',
        video_id: 'video id/1',
        status: 'completed',
        progress: 100,
        seconds: '5.0',
        size: '1280x768',
        metadata: {
          size_mapping: { adjusted: true, width: 1280, height: 768 },
          url: 'https://platform-outputs.agnes-ai.space/videos/task_1.mp4'
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    },
    retryOptions: { sleep: async () => {}, random: () => 0 }
  });

  assert.equal(attempts, 2);
  assert.equal(result.status, 'succeeded');
  assert.equal(result.task.id, 'video id/1');
});

test('video status reports a provider failed state as task_failed', async () => {
  const result = await subject.getVideoStatus('video_1', {
    apiKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1',
      video_id: 'video_1',
      status: 'failed',
      progress: 35
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 'failed');
  assert.equal(result.task.id, 'video_1');
  assert.deepEqual(result.error, {
    kind: 'task_failed',
    message: 'Agnes video generation failed.',
    retryable: false
  });
});

test('video status CLI exits 5 when the provider task failed', async (t) => {
  const previousExitCode = process.exitCode;
  t.after(() => { process.exitCode = previousExitCode; });
  let stdout = '';

  await subject.main(['video', 'status'], {
    stdout: { write(value) { stdout += value; } },
    stdin: Readable.from(['{"video_id":"video_1"}']),
    env: { AGNES_API_KEY: 'test-secret' },
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1',
      video_id: 'video_1',
      status: 'failed',
      progress: 35
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  });

  assert.equal(process.exitCode, 5);
  const result = JSON.parse(stdout);
  assert.equal(result.ok, false);
  assert.equal(result.error.kind, 'task_failed');
  assert.equal(result.task.id, 'video_1');
});

test('combined video workflow creates once, polls, and downloads the completed video', async (t) => {
  assert.equal(typeof subject.runVideo, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-video-run-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  let postCount = 0;
  let pollCount = 0;
  let clockMs = Date.parse('2026-07-30T07:30:12.000Z');
  const fetchImpl = async (url, options = {}) => {
    if (url === 'https://api.agnes-ai.cn/v1/videos') {
      postCount += 1;
      return new Response(JSON.stringify({
        task_id: 'task_1', video_id: 'video_1', status: 'queued', progress: 0
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url === 'https://api.agnes-ai.cn/agnesapi?video_id=video_1') {
      pollCount += 1;
      const states = [
        { task_id: 'task_1', video_id: 'video_1', status: 'queued', progress: 0 },
        { task_id: 'task_1', video_id: 'video_1', status: 'in_progress', progress: 60 },
        {
          task_id: 'task_1',
          video_id: 'video_1',
          status: 'completed',
          progress: 100,
          seconds: '5.0',
          size: '1280x768',
          metadata: {
            size_mapping: { adjusted: true, requested_width: 1152, width: 1280 },
            url: 'https://platform-outputs.agnes-ai.space/videos/task_1.mp4'
          }
        }
      ];
      return new Response(JSON.stringify(states[pollCount - 1]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    assert.equal(url, 'https://platform-outputs.agnes-ai.space/videos/task_1.mp4');
    assert.equal(options.headers?.Authorization, undefined);
    return new Response(Buffer.from([0, 0, 0, 24]), {
      status: 200,
      headers: { 'Content-Type': 'video/mp4' }
    });
  };

  const result = await subject.runVideo({
    capability: 'text-to-video',
    prompt: 'A cinematic product reveal',
    output: { directory: tempDir }
  }, {
    apiKey: 'test-secret',
    fetchImpl,
    now: () => new Date(clockMs),
    sleep: async (delay) => { clockMs += delay; },
    random: () => 0
  });

  assert.equal(postCount, 1);
  assert.equal(pollCount, 3);
  assert.equal(result.ok, true);
  assert.equal(result.status, 'succeeded');
  assert.equal(result.task.id, 'video_1');
  assert.equal(result.artifacts.length, 1);
  assert.equal(result.artifacts[0].mime_type, 'video/mp4');
  assert.equal(fs.existsSync(result.artifacts[0].path), true);
  assert.deepEqual(result.effective_parameters, {
    size: '1280x768',
    seconds: 5,
    size_mapping: { adjusted: true, requested_width: 1152, width: 1280 }
  });
});

test('video wait returns a resumable timeout result instead of failing the remote task', async () => {
  assert.equal(typeof subject.waitForVideo, 'function');
  const result = await subject.waitForVideo({
    capability: 'text-to-video',
    video_id: 'video_1',
    wait: { timeout_seconds: 0 }
  }, {
    apiKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1', video_id: 'video_1', status: 'in_progress', progress: 63
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    now: () => new Date('2026-07-30T07:30:12.000Z'),
    sleep: async () => { throw new Error('timeout must not sleep'); }
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 'running');
  assert.equal(result.task.id, 'video_1');
  assert.equal(result.task.progress, 63);
  assert.equal(result.error.kind, 'wait_timeout');
  assert.equal(result.error.retryable, true);
});

test('video wait bounds transient status retries and preserves the latest task state', async (t) => {
  const cases = [
    ['HTTP 429', () => new Response('{"message":"slow down"}', {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })],
    ['HTTP 503', () => new Response('{"message":"unavailable"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })],
    ['network failure', () => { throw new TypeError('connection reset'); }]
  ];

  for (const [label, transientResponse] of cases) {
    await t.test(label, async () => {
      let clockMs = Date.parse('2026-07-30T07:30:12.000Z');
      let calls = 0;
      const result = await subject.waitForVideo({
        capability: 'text-to-video',
        video_id: 'video_1',
        wait: { timeout_seconds: 6 }
      }, {
        apiKey: 'test-secret',
        fetchImpl: async () => {
          calls += 1;
          if (calls === 1) {
            return new Response(JSON.stringify({
              task_id: 'task_1',
              video_id: 'video_1',
              status: 'in_progress',
              progress: 42
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
          return transientResponse();
        },
        now: () => new Date(clockMs),
        sleep: async (delay) => { clockMs += delay; },
        random: () => 0
      });

      assert.equal(calls, 2);
      assert.equal(clockMs, Date.parse('2026-07-30T07:30:18.000Z'));
      assert.equal(result.ok, false);
      assert.equal(result.status, 'running');
      assert.equal(result.task.id, 'video_1');
      assert.equal(result.task.progress, 42);
      assert.equal(result.error.kind, 'wait_timeout');
    });
  }
});

test('video wait aborts a hanging status request at its deadline', async () => {
  let receivedSignal;
  const startedAt = Date.now();
  const result = await subject.waitForVideo({
    capability: 'text-to-video',
    video_id: 'video_hanging',
    wait: { timeout_seconds: 0.02 }
  }, {
    apiKey: 'test-secret',
    fetchImpl: async (url, options) => {
      receivedSignal = options.signal;
      await new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
      });
    }
  });

  assert.equal(receivedSignal instanceof AbortSignal, true);
  assert.equal(receivedSignal.aborted, true);
  assert.equal(Date.now() - startedAt < 1_000, true);
  assert.equal(result.ok, false);
  assert.equal(result.status, 'running');
  assert.equal(result.task.id, 'video_hanging');
  assert.equal(result.error.kind, 'wait_timeout');
});

test('video wait maps a provider failed state to task_failed', async () => {
  assert.equal(typeof subject.waitForVideo, 'function');

  await assert.rejects(subject.waitForVideo({
    capability: 'text-to-video',
    video_id: 'video_1'
  }, {
    apiKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      task_id: 'task_1', video_id: 'video_1', status: 'failed', progress: 35
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }), (error) => error.kind === 'task_failed');
});

test('CLI parser accepts only the documented command and request-file shape', () => {
  assert.equal(typeof subject.parseCli, 'function');

  assert.deepEqual(subject.parseCli(['image', 'generate', '--request', 'request.json']), {
    domain: 'image', action: 'generate', requestPath: 'request.json'
  });
  assert.deepEqual(subject.parseCli(['video', 'wait']), {
    domain: 'video', action: 'wait', requestPath: null
  });
  assert.deepEqual(subject.parseCli(['capabilities']), {
    domain: 'capabilities', action: null, requestPath: null
  });
  assert.throws(() => subject.parseCli(['image', 'generate', '--api-key', 'secret']), /Unsupported option/);
  assert.throws(() => subject.parseCli(['video', 'delete']), /Unsupported command/);
});

test('request reader parses a JSON file or stdin without shell JSON arguments', async (t) => {
  assert.equal(typeof subject.readRequest, 'function');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-cli-request-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const requestPath = path.join(tempDir, 'request.json');
  fs.writeFileSync(requestPath, '{"video_id":"video_file"}', 'utf8');

  assert.deepEqual(await subject.readRequest({ requestPath }), { video_id: 'video_file' });
  assert.deepEqual(await subject.readRequest({
    requestPath: null,
    stdin: Readable.from(['{"video_id":', '"video_stdin"}'])
  }), { video_id: 'video_stdin' });
});

test('error kinds map to the documented CLI exit codes', () => {
  assert.equal(typeof subject.exitCodeForError, 'function');
  const cases = [
    ['configuration', 2],
    ['invalid_request', 2],
    ['authentication', 3],
    ['permission', 3],
    ['quota_exhausted', 4],
    ['rate_limited', 4],
    ['provider_unavailable', 5],
    ['task_failed', 5],
    ['invalid_response', 5],
    ['network', 6],
    ['wait_timeout', 6],
    ['download_failed', 6]
  ];

  for (const [kind, code] of cases) {
    assert.equal(subject.exitCodeForError({ kind }), code);
  }
});

test('capabilities CLI prints one JSON object without requiring credentials', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/agnes_api.cjs');
  const child = spawnSync(process.execPath, [scriptPath, 'capabilities'], {
    encoding: 'utf8',
    env: { ...process.env, AGNES_API_KEY: '' }
  });

  assert.equal(child.status, 0);
  assert.equal(child.stderr, '');
  const lines = child.stdout.trim().split(/\r?\n/);
  assert.equal(lines.length, 1);
  const result = JSON.parse(lines[0]);
  assert.equal(result.ok, true);
  assert.equal(result.provider, 'agnes');
  assert.deepEqual(result.capabilities, [
    'text-to-image',
    'image-to-image',
    'text-to-video',
    'image-to-video',
    'keyframes-to-video'
  ]);
});

test('invalid CLI command returns normalized JSON and exit code 2', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/agnes_api.cjs');
  const child = spawnSync(process.execPath, [scriptPath, 'video', 'delete'], {
    encoding: 'utf8'
  });

  assert.equal(child.status, 2);
  assert.equal(child.stderr, '');
  const result = JSON.parse(child.stdout);
  assert.equal(result.ok, false);
  assert.equal(result.error.kind, 'invalid_request');
});

test('CLI errors never echo the API key or invalid JSON input', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/agnes_api.cjs');
  const secret = 'super-secret-agnes-key';
  const invalidInput = `{not-json-${secret}}`;
  const child = spawnSync(process.execPath, [scriptPath, 'image', 'generate'], {
    encoding: 'utf8',
    input: invalidInput,
    env: { ...process.env, AGNES_API_KEY: secret }
  });

  assert.equal(child.status, 2);
  assert.doesNotMatch(child.stdout, /super-secret-agnes-key/);
  assert.doesNotMatch(child.stderr, /super-secret-agnes-key/);
  const result = JSON.parse(child.stdout);
  assert.equal(result.error.kind, 'invalid_request');
});

test('request boundary failures are invalid_request errors', async (t) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agnes-invalid-input-'));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  assert.throws(() => subject.buildVideoRequest({
    capability: 'text-to-video',
    prompt: 'A short clip',
    parameters: { num_frames: 120 }
  }), (error) => error.kind === 'invalid_request');

  await assert.rejects(subject.buildImageRequest({
    capability: 'image-to-image',
    prompt: 'Edit this image',
    inputs: [{
      type: 'image',
      source: { kind: 'path', value: path.join(tempDir, 'missing.png') }
    }]
  }), (error) => error.kind === 'invalid_request' && /Unable to read local image input/.test(error.message));
});

test('invalid generation request exits 2 instead of reporting a provider response failure', () => {
  const scriptPath = path.resolve(__dirname, '../scripts/agnes_api.cjs');
  const child = spawnSync(process.execPath, [scriptPath, 'image', 'generate'], {
    encoding: 'utf8',
    input: '{"capability":"text-to-image","prompt":""}',
    env: { ...process.env, AGNES_API_KEY: 'test-secret' }
  });

  assert.equal(child.status, 2);
  const result = JSON.parse(child.stdout);
  assert.equal(result.error.kind, 'invalid_request');
});
