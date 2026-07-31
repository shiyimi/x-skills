const fs = require('node:fs');

const {
  ProviderError,
  exitCodeFor,
  normalizeOutcome,
  validateManifest,
  validateRequest
} = require('./contract.cjs');

function runtimeContext(context = {}) {
  return {
    ...context,
    manifest: context.manifest ?? require('../providers/manifest.cjs'),
    now: context.now ?? Date.now,
    sleep: context.sleep ?? ((delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs)))
  };
}

function annotateError(error, provider) {
  const normalized = error instanceof ProviderError
    ? error
    : new ProviderError('invalid_response', 'Provider failed without a normalized error.');
  if (normalized.provider === undefined) normalized.provider = provider;
  return normalized;
}

function resultFromOutcome(entry, capability, outcome, startedAt, completedAt) {
  const result = {
    ok: outcome.status !== 'failed',
    provider: entry.id,
    capability,
    status: outcome.status,
    artifacts: [],
    effective_parameters: outcome.effective_parameters,
    warnings: outcome.warnings,
    timing: {
      started_at_ms: startedAt,
      completed_at_ms: completedAt,
      duration_ms: Math.max(0, completedAt - startedAt)
    }
  };
  if (outcome.task !== undefined) result.task = outcome.task;
  if (outcome.artifact_sources.length > 0) result.artifact_sources = outcome.artifact_sources;
  if (outcome.status === 'failed') {
    result.error = {
      kind: 'task_failed',
      message: `${entry.id} reported that the media task failed.`,
      retryable: false
    };
  }
  return result;
}

function selectExistingProvider(entries, request) {
  const entry = entries.find((candidate) => candidate.id === request.provider);
  if (!entry || !entry.enabled) {
    throw new ProviderError('provider_unavailable', `Provider is not enabled: ${request.provider}.`, {
      provider: request.provider,
      accepted: false
    });
  }
  if (!entry.capabilities.includes(request.capability)) {
    throw new ProviderError(
      'invalid_request',
      `Provider ${entry.id} does not register capability ${request.capability}.`,
      { provider: entry.id, accepted: false }
    );
  }
  return entry;
}

function configurationState(entry, request, context) {
  if (!entry.provider.isConfigured(context)) {
    return { eligible: false, reason: 'not configured' };
  }
  const support = entry.provider.supports(request);
  if (!support || typeof support !== 'object' || typeof support.supported !== 'boolean') {
    throw new ProviderError('invalid_response', `Provider ${entry.id} returned an invalid supports() result.`, {
      provider: entry.id
    });
  }
  if (!support.supported) {
    return { eligible: false, reason: support.reason || 'request is not supported' };
  }
  return { eligible: true };
}

async function selectAndCreate(request, context = {}) {
  const runtime = runtimeContext(context);
  const entries = validateManifest(runtime.manifest);
  const explicit = request.provider !== undefined;
  const candidates = explicit
    ? [selectExistingProvider(entries, request)]
    : entries.filter((entry) => entry.enabled && entry.capabilities.includes(request.capability));
  const skipped = [];

  for (const entry of candidates) {
    let state;
    try {
      state = configurationState(entry, request, runtime);
    } catch (error) {
      throw annotateError(error, entry.id);
    }
    if (!state.eligible) {
      if (explicit) {
        throw new ProviderError('provider_unavailable', `Provider ${entry.id} ${state.reason}.`, {
          provider: entry.id,
          accepted: false
        });
      }
      skipped.push({ provider: entry.id, reason: state.reason });
      continue;
    }

    try {
      if (typeof runtime.beforeCreate === 'function') {
        await runtime.beforeCreate(entry);
      }
      return {
        entry,
        outcome: normalizeOutcome(await entry.provider.create(request, runtime))
      };
    } catch (error) {
      const normalized = annotateError(error, entry.id);
      if (!explicit && normalized.accepted === false) {
        skipped.push({ provider: entry.id, reason: normalized.message });
        continue;
      }
      throw normalized;
    }
  }

  throw new ProviderError(
    'no_provider_available',
    'No configured Provider can handle this media request.',
    { accepted: false, details: { skipped } }
  );
}

async function createMedia(request, context = {}) {
  validateRequest('create', request);
  const runtime = runtimeContext(context);
  const preflightOutput = runtime.preflightOutput ?? require('./artifacts.cjs').preflightOutput;
  runtime.beforeCreate = async (entry) => preflightOutput(request, {
    ...runtime,
    provider: entry.id
  });
  const startedAt = runtime.now();
  const { entry, outcome } = await selectAndCreate(request, runtime);
  return resultFromOutcome(entry, request.capability, outcome, startedAt, runtime.now());
}

async function queryStatus(request, context = {}) {
  const runtime = runtimeContext(context);
  const entries = validateManifest(runtime.manifest);
  const entry = selectExistingProvider(entries, request);
  if (typeof entry.provider.status !== 'function') {
    throw new ProviderError('invalid_request', `Provider ${entry.id} does not support asynchronous tasks.`, {
      provider: entry.id
    });
  }
  let outcome;
  try {
    outcome = normalizeOutcome(await entry.provider.status(request.task, {
      ...runtime,
      capability: request.capability,
      request
    }));
  } catch (error) {
    const normalized = annotateError(error, entry.id);
    if (normalized.task === undefined) normalized.task = request.task;
    if (normalized.capability === undefined) normalized.capability = request.capability;
    throw normalized;
  }
  if (outcome.task === undefined || outcome.task.id === undefined) {
    outcome.task = { ...(outcome.task ?? {}), id: request.task.id };
  } else if (outcome.task.id !== request.task.id) {
    throw new ProviderError(
      'invalid_response',
      `Provider ${entry.id} returned a different task.id for pinned work.`,
      {
        provider: entry.id,
        capability: request.capability,
        task: request.task
      }
    );
  }
  return { entry, outcome, runtime };
}

async function statusMedia(request, context = {}) {
  validateRequest('status', request);
  const runtime = runtimeContext(context);
  const startedAt = runtime.now();
  const result = await queryStatus(request, runtime);
  return resultFromOutcome(
    result.entry,
    request.capability,
    result.outcome,
    startedAt,
    runtime.now()
  );
}

function timeoutResult(entry, request, outcome, startedAt, completedAt) {
  const result = resultFromOutcome(entry, request.capability, outcome, startedAt, completedAt);
  result.ok = false;
  result.error = {
    kind: 'wait_timeout',
    message: `Waiting timed out while the ${entry.id} task remains active.`,
    retryable: true
  };
  return result;
}

async function materialize(result, outcome, request, runtime) {
  if (outcome.artifact_sources.length === 0) {
    delete result.artifact_sources;
    return result;
  }
  const saveArtifacts = runtime.saveArtifacts ?? require('./artifacts.cjs').saveArtifacts;
  try {
    result.artifacts = await saveArtifacts(outcome.artifact_sources, {
      provider: result.provider,
      capability: result.capability,
      task: result.task,
      output: request.output,
      startedAt: result.timing.started_at_ms
    }, runtime);
    delete result.artifact_sources;
    return result;
  } catch (error) {
    const normalized = annotateError(error, result.provider);
    result.ok = false;
    result.error = {
      kind: 'download_failed',
      message: normalized.message,
      retryable: Boolean(normalized.retryable)
    };
    if (normalized.details !== undefined) result.error.details = normalized.details;
    delete result.artifact_sources;
    return result;
  }
}

async function waitMedia(request, context = {}) {
  validateRequest('wait', request);
  const runtime = runtimeContext(context);
  const entries = validateManifest(runtime.manifest);
  const entry = selectExistingProvider(entries, request);
  const startedAt = runtime.now();
  const timeoutMs = (request.wait?.timeout_seconds ?? 1_200) * 1_000;
  const deadline = startedAt + timeoutMs;
  let latest = normalizeOutcome({ status: 'running', task: request.task });

  while (runtime.now() < deadline) {
    const remainingBeforeStatus = Math.max(0, deadline - runtime.now());
    const controller = new AbortController();
    const abortFromParent = () => controller.abort();
    if (runtime.signal?.aborted) controller.abort();
    else runtime.signal?.addEventListener('abort', abortFromParent, { once: true });
    const abortTimer = setTimeout(() => controller.abort(), remainingBeforeStatus);
    let queried;
    try {
      queried = await queryStatus(request, {
        ...runtime,
        signal: controller.signal,
        retryOptions: {
          ...(runtime.retryOptions ?? {}),
          deadlineMs: deadline,
          nowMs: runtime.now,
          sleep: runtime.sleep
        }
      });
    } catch (error) {
      if (controller.signal.aborted || error.kind === 'wait_timeout') {
        return timeoutResult(entry, request, latest, startedAt, runtime.now());
      }
      throw error;
    } finally {
      clearTimeout(abortTimer);
      runtime.signal?.removeEventListener('abort', abortFromParent);
    }
    latest = queried.outcome;
    const completedAt = runtime.now();
    const result = resultFromOutcome(entry, request.capability, latest, startedAt, completedAt);
    if (latest.status === 'succeeded') return materialize(result, latest, request, runtime);
    if (latest.status === 'failed') return result;

    const remainingMs = deadline - completedAt;
    if (remainingMs <= 0) break;
    const requestedDelay = Number.isFinite(latest.poll_after_ms) && latest.poll_after_ms > 0
      ? latest.poll_after_ms
      : 5_000;
    await runtime.sleep(Math.min(requestedDelay, remainingMs));
  }

  return timeoutResult(entry, request, latest, startedAt, runtime.now());
}

async function generateMedia(request, context = {}) {
  validateRequest('generate', request);
  const runtime = runtimeContext(context);
  const preflightOutput = runtime.preflightOutput ?? require('./artifacts.cjs').preflightOutput;
  runtime.beforeCreate = async (entry) => preflightOutput(request, {
    ...runtime,
    provider: entry.id
  });

  const startedAt = runtime.now();
  const { entry, outcome } = await selectAndCreate(request, runtime);
  if (outcome.status === 'queued' || outcome.status === 'running') {
    if (!outcome.task?.id) {
      throw new ProviderError('invalid_response', `Provider ${entry.id} returned an asynchronous outcome without task.id.`, {
        provider: entry.id
      });
    }
    return waitMedia({
      provider: entry.id,
      capability: request.capability,
      task: outcome.task,
      output: request.output,
      wait: request.wait
    }, runtime);
  }
  const result = resultFromOutcome(entry, request.capability, outcome, startedAt, runtime.now());
  if (outcome.status === 'succeeded') return materialize(result, outcome, request, runtime);
  return result;
}

function listCapabilities(manifest) {
  const entries = validateManifest(manifest);
  const capabilities = [];
  for (const entry of entries) {
    if (!entry.enabled) continue;
    for (const capability of entry.capabilities) {
      if (!capabilities.includes(capability)) capabilities.push(capability);
    }
  }
  return {
    ok: true,
    providers: entries.map(({ id, enabled, priority, capabilities: registered }) => ({
      id,
      enabled,
      priority,
      capabilities: [...registered]
    })),
    capabilities
  };
}

function parseCli(argv) {
  if (!Array.isArray(argv) || !['capabilities', 'generate', 'create', 'status', 'wait'].includes(argv[0])) {
    throw new ProviderError('invalid_request', 'Command must be capabilities, generate, create, status, or wait.');
  }
  if (argv[0] === 'capabilities') {
    if (argv.length !== 1) throw new ProviderError('invalid_request', 'capabilities accepts no options.');
    return { command: argv[0] };
  }
  if (argv.length === 1) return { command: argv[0] };
  if (argv.length === 3 && argv[1] === '--request' && argv[2]) {
    return { command: argv[0], requestPath: argv[2] };
  }
  throw new ProviderError('invalid_request', 'Use stdin JSON or exactly --request <path>.');
}

async function readStdin(stdin, maxBytes) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of stdin) {
    bytes += Buffer.byteLength(chunk);
    if (bytes > maxBytes) throw new ProviderError('invalid_request', `Request JSON exceeds ${maxBytes} bytes.`);
    chunks.push(chunk);
  }
  return chunks.join('');
}

async function readRequest(command, io) {
  const maxBytes = io.maxRequestBytes ?? 1_048_576;
  let text;
  try {
    if (command.requestPath) {
      const stat = await io.fsApi.promises.stat(command.requestPath);
      if (stat.size > maxBytes) throw new ProviderError('invalid_request', `Request JSON exceeds ${maxBytes} bytes.`);
      text = await io.fsApi.promises.readFile(command.requestPath, 'utf8');
    } else {
      text = await readStdin(io.stdin, maxBytes);
    }
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    throw new ProviderError('invalid_request', `Unable to read request JSON: ${error.message}`);
  }
  if (!text.trim()) throw new ProviderError('invalid_request', 'Request JSON is empty.');
  try {
    const request = JSON.parse(text);
    if (!request || typeof request !== 'object' || Array.isArray(request)) throw new Error('object required');
    return request;
  } catch {
    throw new ProviderError('invalid_request', 'Request input is not valid JSON object.');
  }
}

function redactValue(value, secrets) {
  if (typeof value === 'string') {
    let redacted = value.replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]');
    for (const secret of secrets.filter(Boolean)) {
      redacted = redacted.split(secret).join('[REDACTED]');
    }
    return redacted;
  }
  if (Array.isArray(value)) return value.map((item) => redactValue(item, secrets));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactValue(item, secrets)])
    );
  }
  return value;
}

function errorResult(error, secrets = []) {
  const normalized = error instanceof ProviderError
    ? error
    : new ProviderError('invalid_response', 'Unexpected media workflow failure.');
  const result = {
    ok: false,
    status: normalized.task?.provider_status ? 'failed' : 'failed',
    error: {
      kind: normalized.kind,
      message: redactValue(normalized.message, secrets),
      retryable: Boolean(normalized.retryable)
    }
  };
  if (normalized.provider !== undefined) result.provider = normalized.provider;
  if (normalized.capability !== undefined) result.capability = normalized.capability;
  if (normalized.task !== undefined) result.task = normalized.task;
  if (normalized.details !== undefined) result.error.details = redactValue(normalized.details, secrets);
  return result;
}

async function runCli(argv = process.argv.slice(2), io = {}) {
  const runtime = {
    stdout: io.stdout ?? process.stdout,
    stdin: io.stdin ?? process.stdin,
    fsApi: io.fsApi ?? fs,
    env: io.env ?? process.env,
    ...io
  };
  try {
    const parsed = parseCli(argv);
    const result = parsed.command === 'capabilities'
      ? listCapabilities(runtime.manifest ?? require('../providers/manifest.cjs'))
      : await ({
        create: createMedia,
        generate: generateMedia,
        status: statusMedia,
        wait: waitMedia
      })[parsed.command](await readRequest(parsed, runtime), runtime);
    runtime.stdout.write(`${JSON.stringify(result)}\n`);
    return result.ok === false && result.error ? exitCodeFor(result.error) : 0;
  } catch (error) {
    const result = errorResult(error, [
      runtime.env?.AGNES_API_KEY,
      ...(runtime.redactSecrets ?? [])
    ]);
    runtime.stdout.write(`${JSON.stringify(result)}\n`);
    return exitCodeFor(result.error);
  }
}

module.exports = {
  createMedia,
  generateMedia,
  listCapabilities,
  parseCli,
  readRequest,
  runCli,
  statusMedia,
  waitMedia
};

if (require.main === module) {
  runCli().then((exitCode) => { process.exitCode = exitCode; });
}
