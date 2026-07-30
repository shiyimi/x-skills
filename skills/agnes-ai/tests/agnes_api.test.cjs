const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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
