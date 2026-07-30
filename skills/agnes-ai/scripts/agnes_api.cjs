const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const API_ROOT = 'https://api.agnes-ai.cn';
const IMAGE_MODELS = new Set(['agnes-image-2.0-flash', 'agnes-image-2.1-flash']);
const VIDEO_MODEL = 'agnes-video-v2.0';
const IMAGE_MIME_TYPES = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp']
]);
const ARTIFACT_TYPES = new Map([
  ['image/png', { type: 'image', extension: '.png' }],
  ['image/jpeg', { type: 'image', extension: '.jpg' }],
  ['image/webp', { type: 'image', extension: '.webp' }],
  ['video/mp4', { type: 'video', extension: '.mp4' }]
]);

class ProviderError extends Error {
  constructor(kind, message, { retryable = false, httpStatus, providerCode, details } = {}) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    this.retryable = retryable;
    if (httpStatus !== undefined) this.httpStatus = httpStatus;
    if (providerCode !== undefined) this.providerCode = providerCode;
    if (details !== undefined) this.details = details;
  }
}

function resolveCredentials({
  env = process.env,
  homeDir = os.homedir(),
  platform = process.platform,
  fsApi = fs
} = {}) {
  const envValue = env.AGNES_API_KEY?.trim();
  if (envValue) {
    return envValue;
  }

  const credentialPath = path.join(homeDir, '.config', 'agnes', 'api_key');
  try {
    const stat = fsApi.statSync(credentialPath);
    if (platform !== 'win32' && (stat.mode & 0o077) !== 0) {
      throw new ProviderError(
        'configuration',
        `Agnes credential file must use permissions 0600: ${credentialPath}`
      );
    }
    const fileValue = fsApi.readFileSync(credentialPath, 'utf8').trim();
    if (fileValue) {
      return fileValue;
    }
  } catch (error) {
    if (error.message.includes('permissions 0600')) {
      throw error;
    }
    if (error.code !== 'ENOENT') {
      throw new ProviderError(
        'configuration',
        `Unable to read the Agnes credential file: ${error.message}`
      );
    }
  }

  throw new ProviderError(
    'configuration',
    'Agnes API key is missing. Set AGNES_API_KEY or create ~/.config/agnes/api_key.'
  );
}

function assertRequest(request, capabilities) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new ProviderError('invalid_request', 'Request must be a JSON object.');
  }
  if (!capabilities.includes(request.capability)) {
    throw new ProviderError('invalid_request', `Unsupported capability: ${String(request.capability)}`);
  }
  if (typeof request.prompt !== 'string' || request.prompt.trim() === '') {
    throw new ProviderError('invalid_request', 'A non-empty prompt is required.');
  }
}

function isNonPublicIpAddress(hostname) {
  const host = hostname.startsWith('[') && hostname.endsWith(']')
    ? hostname.slice(1, -1)
    : hostname;
  const ipVersion = net.isIP(host);
  if (ipVersion === 4) {
    const [first, second] = host.split('.').map(Number);
    return first === 0
      || first === 10
      || first === 127
      || (first === 100 && second >= 64 && second <= 127)
      || (first === 169 && second === 254)
      || (first === 172 && second >= 16 && second <= 31)
      || (first === 192 && second === 168)
      || first >= 224;
  }
  if (ipVersion === 6) {
    const normalized = host.toLowerCase();
    const firstGroup = Number.parseInt(normalized.split(':', 1)[0] || '0', 16);
    return normalized === '::'
      || normalized === '::1'
      || normalized.startsWith('::ffff:')
      || (firstGroup & 0xfe00) === 0xfc00
      || (firstGroup & 0xffc0) === 0xfe80
      || (firstGroup & 0xff00) === 0xff00;
  }
  return false;
}

function assertHttpsUrl(value, label, { kind = 'invalid_request' } = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ProviderError(kind, `${label} must be a public HTTPS URL.`);
  }
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (
    url.protocol !== 'https:'
    || url.username !== ''
    || url.password !== ''
    || hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || isNonPublicIpAddress(hostname)
  ) {
    throw new ProviderError(kind, `${label} must be a public HTTPS URL without embedded credentials.`);
  }
  return url.toString();
}

async function mapImageInput(input, { readFile = fs.promises.readFile } = {}) {
  if (!input || input.type !== 'image' || !input.source) {
    throw new ProviderError('invalid_request', 'Each image input must contain an image source.');
  }
  if (input.source.kind === 'url') {
    return assertHttpsUrl(input.source.value, 'Image input');
  }
  if (input.source.kind !== 'path' || typeof input.source.value !== 'string') {
    throw new ProviderError('invalid_request', 'Image input source kind must be path or url.');
  }

  const extension = path.extname(input.source.value).toLowerCase();
  const mimeType = IMAGE_MIME_TYPES.get(extension);
  if (!mimeType) {
    throw new ProviderError('invalid_request', 'Local image input must be PNG, JPEG, or WEBP.');
  }
  let data;
  try {
    data = await readFile(input.source.value);
  } catch {
    throw new ProviderError(
      'invalid_request',
      `Unable to read local image input: ${input.source.value}`
    );
  }
  if (data.length === 0) {
    throw new ProviderError('invalid_request', 'Local image input cannot be empty.');
  }
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

async function buildImageRequest(request, deps = {}) {
  assertRequest(request, ['text-to-image', 'image-to-image']);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? 'agnes-image-2.1-flash';
  if (!IMAGE_MODELS.has(model)) {
    throw new ProviderError('invalid_request', `Unsupported Agnes image model: ${model}`);
  }

  const result = {
    model,
    prompt: request.prompt.trim(),
    size: parameters.size ?? '1K'
  };
  if (model === 'agnes-image-2.1-flash') {
    result.ratio = parameters.ratio ?? '1:1';
  } else if (parameters.ratio !== undefined) {
    result.ratio = parameters.ratio;
  }

  result.extra_body = { response_format: 'url' };
  if (request.capability === 'image-to-image') {
    if (!Array.isArray(request.inputs) || request.inputs.length === 0) {
      throw new ProviderError('invalid_request', 'image-to-image requires at least one image input.');
    }
    result.extra_body.image = await Promise.all(
      request.inputs.map((input) => mapImageInput(input, deps))
    );
  }
  return result;
}

function videoInputUrls(request, minimum) {
  if (!Array.isArray(request.inputs) || request.inputs.length < minimum) {
    throw new ProviderError(
      'invalid_request',
      `This video capability requires at least ${minimum} image input(s).`
    );
  }
  return request.inputs.map((input) => {
    if (!input || input.type !== 'image' || input.source?.kind !== 'url') {
      throw new ProviderError(
        'invalid_request',
        'Agnes video image inputs must use a public HTTPS URL.'
      );
    }
    return assertHttpsUrl(input.source.value, 'Agnes video image input');
  });
}

function buildVideoRequest(request) {
  assertRequest(request, ['text-to-video', 'image-to-video', 'keyframes-to-video']);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? VIDEO_MODEL;
  if (model !== VIDEO_MODEL) {
    throw new ProviderError('invalid_request', `Unsupported Agnes video model: ${model}`);
  }

  const numFrames = parameters.num_frames ?? 121;
  const frameRate = parameters.frame_rate ?? 24;
  if (!Number.isInteger(numFrames) || numFrames < 1 || numFrames > 441 || (numFrames - 1) % 8 !== 0) {
    throw new ProviderError(
      'invalid_request',
      'num_frames must be an integer <= 441 that satisfies the 8n + 1 rule.'
    );
  }
  if (typeof frameRate !== 'number' || frameRate < 1 || frameRate > 60) {
    throw new ProviderError('invalid_request', 'frame_rate must be a number between 1 and 60.');
  }

  const result = {
    model,
    prompt: request.prompt.trim(),
    width: parameters.width ?? 1152,
    height: parameters.height ?? 768,
    num_frames: numFrames,
    frame_rate: frameRate
  };
  for (const key of ['num_inference_steps', 'seed', 'negative_prompt']) {
    if (parameters[key] !== undefined) {
      result[key] = parameters[key];
    }
  }

  if (request.capability === 'image-to-video') {
    result.image = videoInputUrls(request, 1)[0];
  }
  if (request.capability === 'keyframes-to-video') {
    result.extra_body = {
      image: videoInputUrls(request, 2),
      mode: 'keyframes'
    };
  }
  return result;
}

function normalizeStatus(status) {
  const states = {
    queued: 'queued',
    in_progress: 'running',
    completed: 'succeeded',
    failed: 'failed'
  };
  const normalized = states[String(status).toLowerCase()];
  if (!normalized) {
    throw new ProviderError(
      'invalid_response',
      `Unknown Agnes video status: ${String(status)}`
    );
  }
  return normalized;
}

function providerMessage(body, fallback) {
  if (typeof body?.error?.message === 'string' && body.error.message.trim()) {
    return body.error.message.trim();
  }
  if (typeof body?.message === 'string' && body.message.trim()) {
    return body.message.trim();
  }
  if (typeof body?.msg === 'string' && body.msg.trim()) {
    return body.msg.trim();
  }
  return fallback;
}

function classifyHttpError(status, body = {}) {
  const mappings = {
    400: ['invalid_request', false],
    401: ['authentication', false],
    402: ['quota_exhausted', false],
    403: ['permission', false],
    404: ['invalid_request', false],
    405: ['invalid_request', false],
    408: ['network', true],
    409: ['invalid_request', false],
    413: ['invalid_request', false],
    415: ['invalid_request', false],
    422: ['invalid_request', false],
    429: ['rate_limited', true]
  };
  const [kind, retryable] = mappings[status]
    ?? (status >= 500
      ? ['provider_unavailable', true]
      : ['invalid_response', false]);
  const providerCode = body?.error?.code ?? body?.code;
  return new ProviderError(kind, providerMessage(body, `Agnes API request failed with HTTP ${status}.`), {
    retryable,
    httpStatus: status,
    providerCode
  });
}

async function requestJson({
  method,
  path: apiPath,
  apiKey,
  body,
  fetchImpl = globalThis.fetch,
  signal
}) {
  if (typeof fetchImpl !== 'function') {
    throw new ProviderError('configuration', 'Node.js 18 or newer is required for fetch support.');
  }
  const url = new URL(apiPath, `${API_ROOT}/`);
  if (url.origin !== API_ROOT) {
    throw new ProviderError('invalid_request', 'Agnes API path must remain on api.agnes-ai.cn.');
  }
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);
  if (signal !== undefined) options.signal = signal;

  let response;
  try {
    response = await fetchImpl(url.toString(), options);
  } catch {
    throw new ProviderError(
      'network',
      'The Agnes API network request failed; a generation request may have been accepted.',
      { retryable: true }
    );
  }

  const text = await response.text();
  let parsed;
  if (text.trim()) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
  } else {
    parsed = {};
  }

  if (!response.ok) {
    const errorBody = parsed ?? { message: text.slice(0, 500) };
    throw classifyHttpError(response.status, errorBody);
  }
  if (parsed === undefined || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ProviderError('invalid_response', 'Agnes returned a non-JSON success response.');
  }
  return parsed;
}

async function defaultSleep(delayMs) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function withTransientRetry(operation, {
  maxAttempts = 4,
  baseDelayMs = 1_000,
  maxDelayMs = 20_000,
  random = Math.random,
  sleep = defaultSleep,
  deadlineMs = Number.POSITIVE_INFINITY,
  nowMs = Date.now,
  signal
} = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (attempt > 1 && (signal?.aborted || nowMs() >= deadlineMs)) {
      throw new ProviderError('wait_timeout', 'The Agnes polling deadline was reached.', {
        retryable: true
      });
    }
    try {
      return await operation();
    } catch (error) {
      if (signal?.aborted || nowMs() >= deadlineMs) {
        throw new ProviderError('wait_timeout', 'The Agnes polling deadline was reached.', {
          retryable: true
        });
      }
      if (!error.retryable || attempt === maxAttempts) {
        throw error;
      }
      const exponential = Math.min(maxDelayMs, baseDelayMs * (2 ** (attempt - 1)));
      const jitter = Math.floor(random() * Math.min(baseDelayMs, exponential));
      const remainingMs = deadlineMs - nowMs();
      await sleep(Math.min(exponential + jitter, remainingMs));
      if (signal?.aborted || nowMs() >= deadlineMs) {
        throw new ProviderError('wait_timeout', 'The Agnes polling deadline was reached.', {
          retryable: true
        });
      }
    }
  }
  throw new ProviderError('invalid_response', 'Retry loop ended unexpectedly.');
}

function artifactType(contentType) {
  const normalized = String(contentType ?? '').split(';', 1)[0].trim().toLowerCase();
  const type = ARTIFACT_TYPES.get(normalized);
  if (!type) {
    throw new ProviderError('download_failed', `Unsupported artifact content type: ${normalized || 'missing'}.`);
  }
  return { ...type, mimeType: normalized };
}

async function uniqueArtifactPath(destinationBase, extension, fsPromises = fs.promises) {
  for (let suffix = 1; suffix < 10_000; suffix += 1) {
    const candidate = suffix === 1
      ? `${destinationBase}${extension}`
      : `${destinationBase}-${suffix}${extension}`;
    try {
      await fsPromises.access(candidate);
    } catch (error) {
      if (error.code === 'ENOENT') return candidate;
      throw error;
    }
  }
  throw new ProviderError('download_failed', 'Unable to allocate a unique artifact filename.');
}

async function downloadArtifact(sourceUrl, destinationBase, {
  fetchImpl = globalThis.fetch,
  fsApi = fs,
  retryOptions = {}
} = {}) {
  const normalizedSource = assertHttpsUrl(sourceUrl, 'Artifact URL', { kind: 'download_failed' });
  const response = await withTransientRetry(async () => {
    let currentUrl = normalizedSource;
    for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
      let candidate;
      try {
        candidate = await fetchImpl(currentUrl, { method: 'GET', redirect: 'manual' });
      } catch {
        throw new ProviderError('download_failed', 'Artifact download failed because of a network error.', {
          retryable: true
        });
      }
      if ([301, 302, 303, 307, 308].includes(candidate.status)) {
        const location = candidate.headers.get('location');
        if (!location) {
          throw new ProviderError('download_failed', 'Artifact redirect did not include a Location header.');
        }
        if (redirectCount === 5) {
          throw new ProviderError('download_failed', 'Artifact download exceeded 5 redirects.');
        }
        currentUrl = assertHttpsUrl(
          new URL(location, currentUrl).toString(),
          'Artifact redirect URL',
          { kind: 'download_failed' }
        );
        continue;
      }
      if (!candidate.ok) {
        throw new ProviderError('download_failed', `Artifact download failed with HTTP ${candidate.status}.`, {
          retryable: candidate.status === 408 || candidate.status === 429 || candidate.status >= 500,
          httpStatus: candidate.status
        });
      }
      if (candidate.url) {
        assertHttpsUrl(candidate.url, 'Final artifact URL', { kind: 'download_failed' });
      }
      return candidate;
    }
    throw new ProviderError('download_failed', 'Artifact redirect handling ended unexpectedly.');
  }, retryOptions);

  const media = artifactType(response.headers.get('content-type'));
  if (!response.body) {
    throw new ProviderError('download_failed', 'Artifact response body is empty.');
  }
  await fsApi.promises.mkdir(path.dirname(destinationBase), { recursive: true });
  const finalPath = await uniqueArtifactPath(destinationBase, media.extension, fsApi.promises);
  const partPath = `${finalPath}.part`;
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      fsApi.createWriteStream(partPath, { flags: 'wx' })
    );
    const stat = await fsApi.promises.stat(partPath);
    if (stat.size === 0) {
      throw new ProviderError('download_failed', 'Downloaded artifact is empty.');
    }
    await fsApi.promises.rename(partPath, finalPath);
    return {
      type: media.type,
      path: finalPath,
      source_url: normalizedSource,
      mime_type: media.mimeType,
      bytes: stat.size
    };
  } catch (error) {
    await fsApi.promises.rm(partPath, { force: true }).catch(() => {});
    if (error instanceof ProviderError) throw error;
    throw new ProviderError('download_failed', `Unable to save artifact: ${error.message}`, {
      retryable: true
    });
  }
}

async function saveBase64Artifact(base64, destinationBase, mimeType = 'image/png', {
  fsApi = fs
} = {}) {
  const media = artifactType(mimeType);
  const normalized = String(base64 ?? '').replace(/\s/g, '');
  if (!normalized || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized) || normalized.length % 4 !== 0) {
    throw new ProviderError('download_failed', 'Agnes returned invalid Base64 artifact data.');
  }
  const data = Buffer.from(normalized, 'base64');
  if (data.length === 0) {
    throw new ProviderError('download_failed', 'Agnes returned empty Base64 artifact data.');
  }

  await fsApi.promises.mkdir(path.dirname(destinationBase), { recursive: true });
  const finalPath = await uniqueArtifactPath(destinationBase, media.extension, fsApi.promises);
  const partPath = `${finalPath}.part`;
  try {
    await fsApi.promises.writeFile(partPath, data, { flag: 'wx' });
    await fsApi.promises.rename(partPath, finalPath);
  } catch (error) {
    await fsApi.promises.rm(partPath, { force: true }).catch(() => {});
    throw new ProviderError('download_failed', `Unable to save Base64 artifact: ${error.message}`, {
      retryable: true
    });
  }
  return {
    type: media.type,
    path: finalPath,
    source_url: null,
    mime_type: media.mimeType,
    bytes: data.length
  };
}

function timestampForPath(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function safeIdentifier(value) {
  const safe = String(value).replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '');
  return safe || 'result';
}

async function createArtifactDirectory(outputRoot, identifier, now, fsApi = fs) {
  const providerRoot = path.resolve(outputRoot, 'agnes');
  await fsApi.promises.mkdir(providerRoot, { recursive: true });
  const base = `${timestampForPath(now)}-${safeIdentifier(identifier)}`;
  for (let suffix = 1; suffix < 10_000; suffix += 1) {
    const directory = path.join(providerRoot, suffix === 1 ? base : `${base}-${suffix}`);
    try {
      await fsApi.promises.mkdir(directory);
      return directory;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  throw new ProviderError('download_failed', 'Unable to allocate an artifact output directory.');
}

function timingResult(startedAt, completedAt) {
  return {
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
    duration_ms: Math.max(0, completedAt.getTime() - startedAt.getTime())
  };
}

async function runImage(request, {
  apiKey,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  fsApi = fs
} = {}) {
  const startedAt = now();
  const requestBody = await buildImageRequest(request);
  const response = await requestJson({
    method: 'POST',
    path: '/v1/images/generations',
    apiKey,
    body: requestBody,
    fetchImpl
  });
  if (!Array.isArray(response.data) || response.data.length === 0) {
    throw new ProviderError('invalid_response', 'Agnes image response did not include any artifacts.');
  }

  const outputRoot = request.output?.directory ?? path.resolve('outputs');
  const directory = await createArtifactDirectory(
    outputRoot,
    `image-${response.created ?? 'result'}`,
    startedAt,
    fsApi
  );
  const artifacts = [];
  try {
    for (let index = 0; index < response.data.length; index += 1) {
      const item = response.data[index];
      const destination = path.join(directory, `result-${String(index + 1).padStart(2, '0')}`);
      if (typeof item?.url === 'string' && item.url) {
        artifacts.push(await downloadArtifact(item.url, destination, { fetchImpl, fsApi }));
      } else if (typeof item?.b64_json === 'string' && item.b64_json) {
        artifacts.push(await saveBase64Artifact(item.b64_json, destination, 'image/png', { fsApi }));
      } else {
        throw new ProviderError('invalid_response', `Agnes image result ${index + 1} has no URL or Base64 data.`);
      }
    }
  } catch (error) {
    if (error.kind === 'download_failed') {
      error.details = { ...(error.details ?? {}), artifacts };
    }
    throw error;
  }
  const completedAt = now();
  return {
    ok: true,
    provider: 'agnes',
    capability: request.capability,
    status: 'succeeded',
    artifacts,
    effective_parameters: {},
    warnings: [],
    timing: timingResult(startedAt, completedAt)
  };
}

function taskFromVideoResponse(response, fallbackVideoId) {
  let status;
  try {
    status = normalizeStatus(response?.status);
  } catch {
    throw new ProviderError(
      'invalid_response',
      `Agnes returned an unknown video status: ${String(response?.status)}.`
    );
  }
  const videoId = response.video_id ?? fallbackVideoId;
  if (typeof videoId !== 'string' || videoId.trim() === '') {
    throw new ProviderError('invalid_response', 'Agnes video response did not include video_id.');
  }
  return {
    status,
    task: {
      id: videoId,
      task_id: response.task_id ?? response.id ?? null,
      provider_status: response.status,
      progress: response.progress ?? null
    }
  };
}

function videoEffectiveParameters(response) {
  const seconds = Number(response.seconds);
  return {
    size: response.size ?? null,
    seconds: Number.isFinite(seconds) ? seconds : response.seconds ?? null,
    size_mapping: response.metadata?.size_mapping ?? null
  };
}

function videoWarnings(response) {
  const mapping = response.metadata?.size_mapping;
  if (!mapping?.adjusted) return [];
  const size = response.size ?? (
    mapping.width && mapping.height ? `${mapping.width}x${mapping.height}` : 'a supported size'
  );
  return [`Agnes normalized the requested dimensions to ${size}.`];
}

function videoEnvelope(
  response,
  capability,
  startedAt,
  completedAt,
  artifacts = [],
  fallbackVideoId
) {
  const normalized = taskFromVideoResponse(response, fallbackVideoId);
  const result = {
    ok: normalized.status !== 'failed',
    provider: 'agnes',
    capability,
    status: normalized.status,
    task: normalized.task,
    artifacts,
    effective_parameters: videoEffectiveParameters(response),
    warnings: videoWarnings(response),
    timing: timingResult(startedAt, completedAt)
  };
  if (normalized.status === 'failed') {
    result.error = {
      kind: 'task_failed',
      message: 'Agnes video generation failed.',
      retryable: false
    };
  }
  return result;
}

async function createVideo(request, {
  apiKey,
  fetchImpl = globalThis.fetch,
  now = () => new Date()
} = {}) {
  const startedAt = now();
  const body = buildVideoRequest(request);
  const response = await requestJson({
    method: 'POST',
    path: '/v1/videos',
    apiKey,
    body,
    fetchImpl
  });
  return videoEnvelope(response, request.capability, startedAt, now());
}

function assertVideoId(videoId) {
  if (typeof videoId !== 'string' || videoId.trim() === '') {
    throw new ProviderError('invalid_request', 'A non-empty video_id is required.');
  }
  return videoId.trim();
}

async function fetchVideoStatus(videoId, {
  apiKey,
  fetchImpl = globalThis.fetch,
  retryOptions = {},
  signal
} = {}) {
  const normalizedId = assertVideoId(videoId);
  const query = new URLSearchParams({ video_id: normalizedId });
  return withTransientRetry(
    () => requestJson({
      method: 'GET',
      path: `/agnesapi?${query.toString()}`,
      apiKey,
      fetchImpl,
      signal
    }),
    { ...retryOptions, signal }
  );
}

async function getVideoStatus(videoId, {
  apiKey,
  fetchImpl = globalThis.fetch,
  retryOptions = {},
  capability = 'text-to-video',
  now = () => new Date()
} = {}) {
  const startedAt = now();
  const response = await fetchVideoStatus(videoId, { apiKey, fetchImpl, retryOptions });
  return videoEnvelope(response, capability, startedAt, now(), [], assertVideoId(videoId));
}

async function waitForVideo(request, {
  apiKey,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  sleep = defaultSleep,
  random = Math.random,
  fsApi = fs,
  retryOptions = {}
} = {}) {
  const capability = request?.capability;
  if (!['text-to-video', 'image-to-video', 'keyframes-to-video'].includes(capability)) {
    throw new ProviderError('invalid_request', `Unsupported video capability: ${String(capability)}.`);
  }
  const videoId = assertVideoId(request.video_id);
  const timeoutSeconds = request.wait?.timeout_seconds ?? 1_200;
  if (typeof timeoutSeconds !== 'number' || !Number.isFinite(timeoutSeconds) || timeoutSeconds < 0) {
    throw new ProviderError('invalid_request', 'wait.timeout_seconds must be a non-negative number.');
  }

  const startedAt = now();
  const deadline = startedAt.getTime() + timeoutSeconds * 1_000;
  let latestResponse;
  let latestNormalized;
  let intervalMs = 5_000;

  const timeoutResult = () => {
    const currentTime = now();
    const completedAt = currentTime.getTime() >= deadline ? currentTime : new Date(deadline);
    const normalized = latestNormalized ?? {
      status: 'running',
      task: {
        id: videoId,
        task_id: null,
        provider_status: null,
        progress: null
      }
    };
    return {
      ok: false,
      provider: 'agnes',
      capability,
      status: normalized.status,
      task: normalized.task,
      artifacts: [],
      effective_parameters: videoEffectiveParameters(latestResponse ?? {}),
      warnings: videoWarnings(latestResponse ?? {}),
      timing: timingResult(startedAt, completedAt),
      error: {
        kind: 'wait_timeout',
        message: 'Waiting timed out while the Agnes task is still active; resume with video wait.',
        retryable: true
      }
    };
  };

  while (true) {
    const remainingMs = Math.max(0, deadline - now().getTime());
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), remainingMs);
    let response;
    try {
      response = await fetchVideoStatus(videoId, {
        apiKey,
        fetchImpl,
        signal: controller.signal,
        retryOptions: {
          sleep,
          random,
          ...retryOptions,
          deadlineMs: deadline,
          nowMs: () => now().getTime()
        }
      });
    } catch (error) {
      if (error.kind === 'wait_timeout' || controller.signal.aborted) {
        return timeoutResult();
      }
      throw error;
    } finally {
      clearTimeout(abortTimer);
    }
    latestResponse = response;
    const normalized = taskFromVideoResponse(response, videoId);
    latestNormalized = normalized;
    if (normalized.status === 'failed') {
      throw new ProviderError('task_failed', 'Agnes video generation failed.', {
        details: { task: normalized.task }
      });
    }
    if (normalized.status === 'succeeded') {
      const sourceUrl = response.metadata?.url;
      if (typeof sourceUrl !== 'string' || sourceUrl === '') {
        throw new ProviderError('invalid_response', 'Completed Agnes video response has no metadata.url.');
      }
      const directory = await createArtifactDirectory(
        request.output?.directory ?? path.resolve('outputs'),
        videoId,
        startedAt,
        fsApi
      );
      const artifact = await downloadArtifact(sourceUrl, path.join(directory, 'result-01'), {
        fetchImpl,
        fsApi,
        retryOptions: { sleep, random, ...retryOptions }
      });
      return videoEnvelope(response, capability, startedAt, now(), [artifact]);
    }

    const currentTime = now();
    if (currentTime.getTime() >= deadline) {
      return timeoutResult();
    }

    const jitter = Math.floor(random() * 1_000);
    await sleep(Math.min(intervalMs + jitter, Math.max(0, deadline - currentTime.getTime())));
    intervalMs = Math.min(20_000, intervalMs * 2);
  }
}

async function runVideo(request, deps = {}) {
  const created = await createVideo(request, deps);
  return waitForVideo({
    capability: request.capability,
    video_id: created.task.id,
    output: request.output,
    wait: request.wait
  }, deps);
}

function parseCli(argv) {
  if (!Array.isArray(argv)) {
    throw new ProviderError('invalid_request', 'CLI arguments must be an array.');
  }
  if (argv[0] === 'capabilities') {
    if (argv.length !== 1) {
      throw new ProviderError('invalid_request', 'The capabilities command does not accept options.');
    }
    return { domain: 'capabilities', action: null, requestPath: null };
  }

  const domain = argv[0];
  const action = argv[1];
  const allowed = {
    image: new Set(['generate']),
    video: new Set(['create', 'status', 'wait', 'generate'])
  };
  if (!allowed[domain]?.has(action)) {
    throw new ProviderError(
      'invalid_request',
      `Unsupported command: ${[domain, action].filter(Boolean).join(' ') || '(empty)'}.`
    );
  }

  const rest = argv.slice(2);
  if (rest.length === 0) {
    return { domain, action, requestPath: null };
  }
  if (rest.length === 2 && rest[0] === '--request' && rest[1]) {
    return { domain, action, requestPath: rest[1] };
  }
  const option = rest.find((value) => value.startsWith('--'));
  if (option) {
    throw new ProviderError('invalid_request', `Unsupported option: ${option}.`);
  }
  throw new ProviderError('invalid_request', 'Unexpected CLI arguments.');
}

async function readStdin(stdin, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of stdin) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > maxBytes) {
      throw new ProviderError('invalid_request', `Request JSON exceeds ${maxBytes} bytes.`);
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function readRequest({
  requestPath,
  stdin = process.stdin,
  fsApi = fs,
  maxBytes = 10 * 1024 * 1024
} = {}) {
  let text;
  try {
    if (requestPath) {
      const stat = await fsApi.promises.stat(requestPath);
      if (stat.size > maxBytes) {
        throw new ProviderError('invalid_request', `Request JSON exceeds ${maxBytes} bytes.`);
      }
      text = await fsApi.promises.readFile(requestPath, 'utf8');
    } else {
      text = await readStdin(stdin, maxBytes);
    }
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    throw new ProviderError('invalid_request', `Unable to read request JSON: ${error.message}`);
  }

  if (!text.trim()) {
    throw new ProviderError('invalid_request', 'Request JSON is empty.');
  }
  let request;
  try {
    request = JSON.parse(text);
  } catch {
    throw new ProviderError('invalid_request', 'Request input is not valid JSON.');
  }
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new ProviderError('invalid_request', 'Request JSON must contain one object.');
  }
  return request;
}

function exitCodeForError(error) {
  const mappings = {
    configuration: 2,
    invalid_request: 2,
    authentication: 3,
    permission: 3,
    quota_exhausted: 4,
    rate_limited: 4,
    provider_unavailable: 5,
    task_failed: 5,
    invalid_response: 5,
    network: 6,
    wait_timeout: 6,
    download_failed: 6
  };
  return mappings[error?.kind] ?? 5;
}

function redactString(value, secrets) {
  let result = String(value);
  for (const secret of secrets.filter(Boolean)) {
    result = result.split(secret).join('[REDACTED]');
  }
  return result.replace(/Bearer\s+[A-Za-z0-9._~+\/-]+=*/gi, 'Bearer [REDACTED]');
}

function redactValue(value, secrets) {
  if (typeof value === 'string') return redactString(value, secrets);
  if (Array.isArray(value)) return value.map((item) => redactValue(item, secrets));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactValue(item, secrets)])
    );
  }
  return value;
}

function errorEnvelope(error, secrets = []) {
  const kind = error?.kind ?? 'invalid_response';
  const normalized = {
    ok: false,
    provider: 'agnes',
    status: error?.details?.task?.provider_status
      ? (() => {
        try { return normalizeStatus(error.details.task.provider_status); } catch { return 'failed'; }
      })()
      : 'failed',
    error: {
      kind,
      message: redactString(error?.message ?? 'Unexpected Agnes skill failure.', secrets),
      retryable: Boolean(error?.retryable)
    }
  };
  if (error?.httpStatus !== undefined) normalized.error.http_status = error.httpStatus;
  if (error?.providerCode !== undefined) normalized.error.provider_code = error.providerCode;
  if (error?.details !== undefined) normalized.error.details = redactValue(error.details, secrets);
  return normalized;
}

function capabilitiesResult() {
  return {
    ok: true,
    provider: 'agnes',
    capabilities: [
      'text-to-image',
      'image-to-image',
      'text-to-video',
      'image-to-video',
      'keyframes-to-video'
    ]
  };
}

async function main(argv = process.argv.slice(2), {
  stdout = process.stdout,
  stdin = process.stdin,
  env = process.env,
  homeDir = os.homedir(),
  platform = process.platform,
  fsApi = fs,
  fetchImpl = globalThis.fetch
} = {}) {
  let apiKey;
  try {
    const command = parseCli(argv);
    if (command.domain === 'capabilities') {
      stdout.write(`${JSON.stringify(capabilitiesResult())}\n`);
      process.exitCode = 0;
      return;
    }

    const request = await readRequest({
      requestPath: command.requestPath,
      stdin,
      fsApi
    });
    apiKey = resolveCredentials({ env, homeDir, platform, fsApi });
    const deps = { apiKey, fetchImpl, fsApi };
    let result;
    if (command.domain === 'image') {
      result = await runImage(request, deps);
    } else if (command.action === 'create') {
      result = await createVideo(request, deps);
    } else if (command.action === 'status') {
      result = await getVideoStatus(request.video_id, {
        ...deps,
        capability: request.capability ?? 'text-to-video'
      });
    } else if (command.action === 'wait') {
      result = await waitForVideo({ capability: 'text-to-video', ...request }, deps);
    } else {
      result = await runVideo(request, deps);
    }

    stdout.write(`${JSON.stringify(redactValue(result, [apiKey]))}\n`);
    process.exitCode = result.ok === false && result.error
      ? exitCodeForError(result.error)
      : 0;
  } catch (error) {
    const result = errorEnvelope(error, [apiKey]);
    stdout.write(`${JSON.stringify(result)}\n`);
    process.exitCode = exitCodeForError(result.error);
  }
}

module.exports = {
  API_ROOT,
  ProviderError,
  resolveCredentials,
  buildImageRequest,
  buildVideoRequest,
  normalizeStatus,
  classifyHttpError,
  requestJson,
  withTransientRetry,
  downloadArtifact,
  saveBase64Artifact,
  runImage,
  createVideo,
  getVideoStatus,
  waitForVideo,
  runVideo,
  parseCli,
  readRequest,
  exitCodeForError,
  errorEnvelope,
  capabilitiesResult,
  main
};

if (require.main === module) {
  main();
}
