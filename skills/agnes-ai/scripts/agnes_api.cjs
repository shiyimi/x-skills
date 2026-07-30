const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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
      throw new Error(`Agnes credential file must use permissions 0600: ${credentialPath}`);
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
      throw new Error(`Unable to read the Agnes credential file: ${error.message}`);
    }
  }

  throw new Error(
    'Agnes API key is missing. Set AGNES_API_KEY or create ~/.config/agnes/api_key.'
  );
}

function assertRequest(request, capabilities) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new Error('Request must be a JSON object.');
  }
  if (!capabilities.includes(request.capability)) {
    throw new Error(`Unsupported capability: ${String(request.capability)}`);
  }
  if (typeof request.prompt !== 'string' || request.prompt.trim() === '') {
    throw new Error('A non-empty prompt is required.');
  }
}

function assertHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a public HTTPS URL.`);
  }
  if (url.protocol !== 'https:') {
    throw new Error(`${label} must be a public HTTPS URL.`);
  }
  return url.toString();
}

async function mapImageInput(input, { readFile = fs.promises.readFile } = {}) {
  if (!input || input.type !== 'image' || !input.source) {
    throw new Error('Each image input must contain an image source.');
  }
  if (input.source.kind === 'url') {
    return assertHttpsUrl(input.source.value, 'Image input');
  }
  if (input.source.kind !== 'path' || typeof input.source.value !== 'string') {
    throw new Error('Image input source kind must be path or url.');
  }

  const extension = path.extname(input.source.value).toLowerCase();
  const mimeType = IMAGE_MIME_TYPES.get(extension);
  if (!mimeType) {
    throw new Error('Local image input must be PNG, JPEG, or WEBP.');
  }
  const data = await readFile(input.source.value);
  if (data.length === 0) {
    throw new Error('Local image input cannot be empty.');
  }
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

async function buildImageRequest(request, deps = {}) {
  assertRequest(request, ['text-to-image', 'image-to-image']);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? 'agnes-image-2.1-flash';
  if (!IMAGE_MODELS.has(model)) {
    throw new Error(`Unsupported Agnes image model: ${model}`);
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
      throw new Error('image-to-image requires at least one image input.');
    }
    result.extra_body.image = await Promise.all(
      request.inputs.map((input) => mapImageInput(input, deps))
    );
  }
  return result;
}

function videoInputUrls(request, minimum) {
  if (!Array.isArray(request.inputs) || request.inputs.length < minimum) {
    throw new Error(`This video capability requires at least ${minimum} image input(s).`);
  }
  return request.inputs.map((input) => {
    if (!input || input.type !== 'image' || input.source?.kind !== 'url') {
      throw new Error('Agnes video image inputs must use a public HTTPS URL.');
    }
    return assertHttpsUrl(input.source.value, 'Agnes video image input');
  });
}

function buildVideoRequest(request) {
  assertRequest(request, ['text-to-video', 'image-to-video', 'keyframes-to-video']);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? VIDEO_MODEL;
  if (model !== VIDEO_MODEL) {
    throw new Error(`Unsupported Agnes video model: ${model}`);
  }

  const numFrames = parameters.num_frames ?? 121;
  const frameRate = parameters.frame_rate ?? 24;
  if (!Number.isInteger(numFrames) || numFrames < 1 || numFrames > 441 || (numFrames - 1) % 8 !== 0) {
    throw new Error('num_frames must be an integer <= 441 that satisfies the 8n + 1 rule.');
  }
  if (typeof frameRate !== 'number' || frameRate < 1 || frameRate > 60) {
    throw new Error('frame_rate must be a number between 1 and 60.');
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
    throw new Error(`Unknown Agnes video status: ${String(status)}`);
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
  sleep = defaultSleep
} = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!error.retryable || attempt === maxAttempts) {
        throw error;
      }
      const exponential = Math.min(maxDelayMs, baseDelayMs * (2 ** (attempt - 1)));
      const jitter = Math.floor(random() * Math.min(baseDelayMs, exponential));
      await sleep(exponential + jitter);
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
  const normalizedSource = assertHttpsUrl(sourceUrl, 'Artifact URL');
  const response = await withTransientRetry(async () => {
    let candidate;
    try {
      candidate = await fetchImpl(normalizedSource, { method: 'GET', redirect: 'follow' });
    } catch {
      throw new ProviderError('download_failed', 'Artifact download failed because of a network error.', {
        retryable: true
      });
    }
    if (!candidate.ok) {
      throw new ProviderError('download_failed', `Artifact download failed with HTTP ${candidate.status}.`, {
        retryable: candidate.status === 429 || candidate.status >= 500,
        httpStatus: candidate.status
      });
    }
    if (candidate.url) assertHttpsUrl(candidate.url, 'Final artifact URL');
    return candidate;
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
  runImage
};
