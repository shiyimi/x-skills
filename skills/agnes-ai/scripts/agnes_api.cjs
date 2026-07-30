const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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

module.exports = {
  API_ROOT,
  resolveCredentials,
  buildImageRequest,
  buildVideoRequest,
  normalizeStatus
};
