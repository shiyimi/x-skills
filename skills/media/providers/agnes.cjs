const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { ProviderError } = require('../core/contract.cjs');
const { assertPublicHttpsUrl, withTransientRetry } = require('../core/artifacts.cjs');

const API_ROOT = 'https://api.agnes-ai.cn';
const IMAGE_MODELS = new Set(['agnes-image-2.0-flash', 'agnes-image-2.1-flash']);
const VIDEO_MODEL = 'agnes-video-v2.0';
const IMAGE_MIME_TYPES = new Map([
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp']
]);

function resolveCredentials({
  env = process.env,
  homeDir = os.homedir(),
  platform = process.platform,
  fsApi = fs
} = {}) {
  const environmentKey = env.AGNES_API_KEY?.trim();
  if (environmentKey) return environmentKey;

  const credentialPath = path.join(homeDir, '.config', 'agnes', 'api_key');
  try {
    const stat = fsApi.statSync(credentialPath);
    if (platform !== 'win32' && (stat.mode & 0o077) !== 0) {
      throw new ProviderError(
        'configuration',
        `Agnes credential file must use permissions 0600: ${credentialPath}`
      );
    }
    const fileKey = fsApi.readFileSync(credentialPath, 'utf8').trim();
    if (fileKey) return fileKey;
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    if (error.code !== 'ENOENT') {
      throw new ProviderError('configuration', `Unable to read the Agnes credential file: ${error.message}`);
    }
  }
  throw new ProviderError(
    'configuration',
    'Agnes API key is missing. Set AGNES_API_KEY or create ~/.config/agnes/api_key.'
  );
}

function isConfigured(context = {}) {
  try {
    resolveCredentials(context);
    return true;
  } catch {
    return false;
  }
}

function assertPrompt(request) {
  if (!request || typeof request !== 'object' || typeof request.prompt !== 'string' || !request.prompt.trim()) {
    throw new ProviderError('invalid_request', 'A non-empty prompt is required.');
  }
}

function imageInputShape(input) {
  if (!input || input.type !== 'image' || !input.source) {
    throw new ProviderError('invalid_request', 'Each image input must contain an image source.');
  }
  if (input.source.kind === 'url') {
    return assertPublicHttpsUrl(input.source.value, 'Image input', 'invalid_request');
  }
  if (input.source.kind !== 'path' || typeof input.source.value !== 'string') {
    throw new ProviderError('invalid_request', 'Image input source kind must be path or url.');
  }
  const mimeType = IMAGE_MIME_TYPES.get(path.extname(input.source.value).toLowerCase());
  if (!mimeType) throw new ProviderError('invalid_request', 'Local image input must be PNG, JPEG, or WEBP.');
  return { path: input.source.value, mimeType };
}

function videoInputUrls(request, minimum) {
  if (!Array.isArray(request.inputs) || request.inputs.length < minimum) {
    throw new ProviderError('invalid_request', `This video capability requires at least ${minimum} image input(s).`);
  }
  return request.inputs.map((input) => {
    if (!input || input.type !== 'image' || input.source?.kind !== 'url') {
      throw new ProviderError('invalid_request', 'Agnes video image inputs must use a public HTTPS URL.');
    }
    return assertPublicHttpsUrl(input.source.value, 'Agnes video image input', 'invalid_request');
  });
}

function validateImageShape(request) {
  assertPrompt(request);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? 'agnes-image-2.1-flash';
  if (!IMAGE_MODELS.has(model)) {
    throw new ProviderError('invalid_request', `Unsupported Agnes image model: ${model}.`);
  }
  if (request.capability === 'image-to-image') {
    if (!Array.isArray(request.inputs) || request.inputs.length === 0) {
      throw new ProviderError('invalid_request', 'image-to-image requires at least one image input.');
    }
    request.inputs.forEach(imageInputShape);
  } else if (request.capability !== 'text-to-image') {
    throw new ProviderError('invalid_request', `Unsupported Agnes image capability: ${String(request.capability)}.`);
  }
}

function buildVideoRequest(request) {
  assertPrompt(request);
  if (!['text-to-video', 'image-to-video', 'keyframes-to-video'].includes(request.capability)) {
    throw new ProviderError('invalid_request', `Unsupported Agnes video capability: ${String(request.capability)}.`);
  }
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? VIDEO_MODEL;
  if (model !== VIDEO_MODEL) {
    throw new ProviderError('invalid_request', `Unsupported Agnes video model: ${model}.`);
  }
  const numFrames = parameters.num_frames ?? 121;
  const frameRate = parameters.frame_rate ?? 24;
  if (!Number.isInteger(numFrames) || numFrames < 1 || numFrames > 441 || (numFrames - 1) % 8 !== 0) {
    throw new ProviderError('invalid_request', 'num_frames must be an integer <= 441 that satisfies the 8n + 1 rule.');
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
    if (parameters[key] !== undefined) result[key] = parameters[key];
  }
  if (request.capability === 'image-to-video') result.image = videoInputUrls(request, 1)[0];
  if (request.capability === 'keyframes-to-video') {
    result.extra_body = { image: videoInputUrls(request, 2), mode: 'keyframes' };
  }
  return result;
}

function supports(request) {
  try {
    if (request.capability === 'text-to-image' || request.capability === 'image-to-image') {
      validateImageShape(request);
    } else {
      buildVideoRequest(request);
    }
    return { supported: true };
  } catch (error) {
    return { supported: false, reason: error.message };
  }
}

async function buildImageRequest(request, { readFile = fs.promises.readFile } = {}) {
  validateImageShape(request);
  const parameters = request.parameters ?? {};
  const model = parameters.model ?? 'agnes-image-2.1-flash';
  const result = {
    model,
    prompt: request.prompt.trim(),
    size: parameters.size ?? '1K'
  };
  if (model === 'agnes-image-2.1-flash') result.ratio = parameters.ratio ?? '1:1';
  else if (parameters.ratio !== undefined) result.ratio = parameters.ratio;
  result.extra_body = { response_format: 'url' };
  if (request.capability === 'image-to-image') {
    result.extra_body.image = await Promise.all(request.inputs.map(async (input) => {
      const shape = imageInputShape(input);
      if (typeof shape === 'string') return shape;
      let data;
      try {
        data = await readFile(shape.path);
      } catch {
        throw new ProviderError('invalid_request', `Unable to read local image input: ${shape.path}`);
      }
      if (data.length === 0) throw new ProviderError('invalid_request', 'Local image input cannot be empty.');
      return `data:${shape.mimeType};base64,${data.toString('base64')}`;
    }));
  }
  return result;
}

function providerMessage(body, fallback) {
  for (const value of [body?.error?.message, body?.message, body?.msg]) {
    if (typeof value === 'string' && value.trim()) return value.trim();
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
    ?? (status >= 500 ? ['provider_unavailable', true] : ['invalid_response', false]);
  return new ProviderError(kind, providerMessage(body, `Agnes API request failed with HTTP ${status}.`), {
    retryable,
    httpStatus: status,
    providerCode: body?.error?.code ?? body?.code
  });
}

async function requestJson({ method, apiPath, apiKey, body, fetchImpl = globalThis.fetch, signal }) {
  if (typeof fetchImpl !== 'function') {
    throw new ProviderError('configuration', 'Node.js 18 or newer is required for fetch support.');
  }
  const url = new URL(apiPath, `${API_ROOT}/`);
  if (url.origin !== API_ROOT) {
    throw new ProviderError('invalid_request', 'Agnes API path must remain on api.agnes-ai.cn.');
  }
  const options = {
    method,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  };
  if (body !== undefined) options.body = JSON.stringify(body);
  if (signal !== undefined) options.signal = signal;
  let response;
  try {
    response = await fetchImpl(url.toString(), options);
  } catch {
    const post = String(method).toUpperCase() === 'POST';
    throw new ProviderError('network', post
      ? 'The Agnes API network request failed; the generation request may have been accepted.'
      : 'The Agnes API network request failed.', {
      retryable: !post,
      details: post ? { acceptance_unknown: true } : undefined
    });
  }
  const text = await response.text();
  let parsed;
  if (!text.trim()) parsed = {};
  else {
    try { parsed = JSON.parse(text); } catch { parsed = undefined; }
  }
  if (!response.ok) {
    const error = classifyHttpError(response.status, parsed ?? { message: text.slice(0, 500) });
    if (String(method).toUpperCase() === 'POST') {
      error.retryable = false;
      if (response.status === 408 || response.status >= 500) {
        error.details = { ...(error.details ?? {}), acceptance_unknown: true };
      } else {
        error.accepted = false;
      }
    }
    throw error;
  }
  if (parsed === undefined || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ProviderError('invalid_response', 'Agnes returned a non-JSON success response.');
  }
  return parsed;
}

function normalizeStatus(status) {
  const normalized = {
    queued: 'queued',
    in_progress: 'running',
    completed: 'succeeded',
    failed: 'failed'
  }[String(status).toLowerCase()];
  if (!normalized) throw new ProviderError('invalid_response', `Unknown Agnes video status: ${String(status)}.`);
  return normalized;
}

function videoOutcome(response, fallbackId) {
  const status = normalizeStatus(response?.status);
  const id = response?.video_id ?? fallbackId;
  if (typeof id !== 'string' || !id.trim()) {
    throw new ProviderError('invalid_response', 'Agnes video response did not include video_id.');
  }
  const outcome = {
    status,
    task: {
      id,
      task_id: response.task_id ?? response.id ?? null,
      provider_status: response.status,
      progress: response.progress ?? null
    },
    artifact_sources: [],
    effective_parameters: {
      size: response.size ?? null,
      seconds: Number.isFinite(Number(response.seconds)) ? Number(response.seconds) : response.seconds ?? null,
      size_mapping: response.metadata?.size_mapping ?? null
    },
    warnings: [],
    poll_after_ms: 5_000
  };
  if (response.metadata?.size_mapping?.adjusted) {
    outcome.warnings.push(`Agnes normalized the requested dimensions to ${response.size ?? 'a supported size'}.`);
  }
  if (status === 'succeeded') {
    if (typeof response.metadata?.url !== 'string' || !response.metadata.url) {
      throw new ProviderError('invalid_response', 'Completed Agnes video response has no metadata.url.');
    }
    outcome.artifact_sources.push({
      kind: 'url',
      mime_type: 'video/mp4',
      value: assertPublicHttpsUrl(response.metadata.url, 'Agnes video artifact', 'invalid_response')
    });
  }
  return outcome;
}

async function create(request, context = {}) {
  const apiKey = resolveCredentials(context);
  if (request.capability === 'text-to-image' || request.capability === 'image-to-image') {
    const body = await buildImageRequest(request, {
      readFile: context.fsApi?.promises?.readFile ?? fs.promises.readFile
    });
    const response = await requestJson({
      method: 'POST',
      apiPath: '/v1/images/generations',
      apiKey,
      body,
      fetchImpl: context.fetchImpl,
      signal: context.signal
    });
    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new ProviderError('invalid_response', 'Agnes image response did not include any artifacts.');
    }
    return {
      status: 'succeeded',
      artifact_sources: response.data.map((item, index) => {
        if (typeof item?.url === 'string' && item.url) {
          return {
            kind: 'url',
            mime_type: item.mime_type ?? 'image/png',
            value: assertPublicHttpsUrl(item.url, `Agnes image result ${index + 1}`, 'invalid_response')
          };
        }
        if (typeof item?.b64_json === 'string' && item.b64_json) {
          return { kind: 'base64', mime_type: item.mime_type ?? 'image/png', value: item.b64_json };
        }
        throw new ProviderError('invalid_response', `Agnes image result ${index + 1} has no URL or Base64 data.`);
      }),
      effective_parameters: {},
      warnings: []
    };
  }
  const body = buildVideoRequest(request);
  const response = await requestJson({
    method: 'POST',
    apiPath: '/v1/videos',
    apiKey,
    body,
    fetchImpl: context.fetchImpl,
    signal: context.signal
  });
  return videoOutcome(response);
}

async function status(task, context = {}) {
  if (!task || typeof task.id !== 'string' || !task.id.trim()) {
    throw new ProviderError('invalid_request', 'Agnes status requires task.id.');
  }
  if (!['text-to-video', 'image-to-video', 'keyframes-to-video'].includes(context.capability)) {
    throw new ProviderError('invalid_request', 'Agnes status is available only for video capabilities.');
  }
  const apiKey = resolveCredentials(context);
  const query = new URLSearchParams({ video_id: task.id.trim() });
  const response = await withTransientRetry(() => requestJson({
    method: 'GET',
    apiPath: `/agnesapi?${query.toString()}`,
    apiKey,
    fetchImpl: context.fetchImpl,
    signal: context.signal
  }), { ...(context.retryOptions ?? {}), signal: context.signal });
  return videoOutcome(response, task.id.trim());
}

module.exports = {
  API_ROOT,
  buildImageRequest,
  buildVideoRequest,
  classifyHttpError,
  create,
  isConfigured,
  normalizeStatus,
  requestJson,
  resolveCredentials,
  status,
  supports
};
