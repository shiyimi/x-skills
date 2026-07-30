const CAPABILITIES = Object.freeze([
  'text-to-image',
  'image-to-image',
  'text-to-video',
  'image-to-video',
  'keyframes-to-video'
]);

const CAPABILITY_SET = new Set(CAPABILITIES);
const OUTCOME_STATUSES = new Set(['succeeded', 'queued', 'running', 'failed']);

class ProviderError extends Error {
  constructor(kind, message, options = {}) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    for (const key of [
      'accepted',
      'retryable',
      'httpStatus',
      'providerCode',
      'details',
      'provider',
      'task'
    ]) {
      if (options[key] !== undefined) this[key] = options[key];
    }
  }
}

function configurationError(message) {
  return new ProviderError('configuration_error', message);
}

function validateManifest(manifest) {
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw configurationError('Provider manifest must be a non-empty array.');
  }

  const ids = new Set();
  const enabledPriorities = new Set();
  for (const entry of manifest) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw configurationError('Every Provider manifest entry must be an object.');
    }
    if (typeof entry.id !== 'string' || entry.id.trim() === '') {
      throw configurationError('Every Provider manifest entry requires a non-empty id.');
    }
    if (ids.has(entry.id)) {
      throw configurationError(`Provider id must be unique: ${entry.id}.`);
    }
    ids.add(entry.id);
    if (typeof entry.enabled !== 'boolean') {
      throw configurationError(`Provider ${entry.id} enabled must be boolean.`);
    }
    if (!Number.isFinite(entry.priority) || !Number.isInteger(entry.priority)) {
      throw configurationError(`Provider ${entry.id} priority must be a finite integer.`);
    }
    if (entry.enabled && enabledPriorities.has(entry.priority)) {
      throw configurationError(`Enabled Provider priority must be unique: ${entry.priority}.`);
    }
    if (entry.enabled) enabledPriorities.add(entry.priority);

    if (!Array.isArray(entry.capabilities) || entry.capabilities.length === 0) {
      throw configurationError(`Provider ${entry.id} capabilities must be a non-empty array.`);
    }
    const capabilities = new Set();
    for (const capability of entry.capabilities) {
      if (!CAPABILITY_SET.has(capability) || capabilities.has(capability)) {
        throw configurationError(`Provider ${entry.id} capabilities contain an unknown or duplicate value.`);
      }
      capabilities.add(capability);
    }

    if (!entry.provider || typeof entry.provider !== 'object') {
      throw configurationError(`Provider ${entry.id} implementation must be an object.`);
    }
    for (const method of ['isConfigured', 'supports', 'create']) {
      if (typeof entry.provider[method] !== 'function') {
        throw configurationError(`Provider ${entry.id} must implement ${method}().`);
      }
    }
    if (entry.provider.status !== undefined && typeof entry.provider.status !== 'function') {
      throw configurationError(`Provider ${entry.id} status must be a function when provided.`);
    }
  }

  return [...manifest].sort((left, right) => left.priority - right.priority);
}

function assertPlainObject(value, label, { optional = false } = {}) {
  if (value === undefined && optional) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ProviderError('invalid_request', `${label} must be an object.`);
  }
}

function assertOptionalString(value, label) {
  if (value !== undefined && (typeof value !== 'string' || value.trim() === '')) {
    throw new ProviderError('invalid_request', `${label} must be a non-empty string.`);
  }
}

function validateRequest(command, request) {
  assertPlainObject(request, 'Request');
  if (!CAPABILITY_SET.has(request.capability)) {
    throw new ProviderError('invalid_request', `Unsupported capability: ${String(request.capability)}.`);
  }
  assertOptionalString(request.provider, 'provider');
  assertPlainObject(request.output, 'output', { optional: true });
  assertPlainObject(request.wait, 'wait', { optional: true });

  if (request.output?.directory !== undefined) {
    assertOptionalString(request.output.directory, 'output.directory');
    if (request.output.directory.includes('\0')) {
      throw new ProviderError('invalid_request', 'output.directory must be a valid path string.');
    }
  }
  if (request.wait?.timeout_seconds !== undefined && (
    !Number.isFinite(request.wait.timeout_seconds)
    || request.wait.timeout_seconds <= 0
  )) {
    throw new ProviderError('invalid_request', 'wait.timeout_seconds must be a positive number.');
  }

  if (command === 'status' || command === 'wait') {
    if (request.provider === undefined) {
      throw new ProviderError('invalid_request', `${command} requires provider.`);
    }
    assertPlainObject(request.task, 'task');
    assertOptionalString(request.task.id, 'task.id');
    if (request.task.id === undefined) {
      throw new ProviderError('invalid_request', `${command} requires task.id.`);
    }
    return request;
  }

  if (command !== 'create' && command !== 'generate') {
    throw new ProviderError('invalid_request', `Unsupported media command: ${String(command)}.`);
  }
  if (typeof request.prompt !== 'string' || request.prompt.trim() === '') {
    throw new ProviderError('invalid_request', 'A non-empty prompt is required.');
  }
  if (request.inputs !== undefined && !Array.isArray(request.inputs)) {
    throw new ProviderError('invalid_request', 'inputs must be an array.');
  }
  assertPlainObject(request.parameters, 'parameters', { optional: true });
  return request;
}

function normalizeOutcome(outcome) {
  if (!outcome || typeof outcome !== 'object' || Array.isArray(outcome)) {
    throw new ProviderError('invalid_response', 'Provider outcome must be an object.');
  }
  if (!OUTCOME_STATUSES.has(outcome.status)) {
    throw new ProviderError('invalid_response', `Unknown Provider outcome status: ${String(outcome.status)}.`);
  }
  if (outcome.task !== undefined) assertPlainObject(outcome.task, 'Provider outcome task');
  if (outcome.artifact_sources !== undefined && !Array.isArray(outcome.artifact_sources)) {
    throw new ProviderError('invalid_response', 'Provider artifact_sources must be an array.');
  }
  if (outcome.effective_parameters !== undefined) {
    assertPlainObject(outcome.effective_parameters, 'Provider effective_parameters');
  }
  if (outcome.warnings !== undefined && !Array.isArray(outcome.warnings)) {
    throw new ProviderError('invalid_response', 'Provider warnings must be an array.');
  }

  const normalized = {
    status: outcome.status,
    artifact_sources: outcome.artifact_sources ?? [],
    effective_parameters: outcome.effective_parameters ?? {},
    warnings: outcome.warnings ?? []
  };
  if (outcome.task !== undefined) normalized.task = outcome.task;
  if (outcome.poll_after_ms !== undefined) normalized.poll_after_ms = outcome.poll_after_ms;
  return normalized;
}

function exitCodeFor(error) {
  const mappings = {
    configuration: 2,
    configuration_error: 2,
    invalid_request: 2,
    no_provider_available: 2,
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

module.exports = {
  CAPABILITIES,
  ProviderError,
  exitCodeFor,
  normalizeOutcome,
  validateManifest,
  validateRequest
};
