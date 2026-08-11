const fs = require('node:fs');

const { ProviderError, exitCodeFor } = require('./contract.cjs');
const {
  createMedia,
  generateMedia,
  listCapabilities,
  statusMedia,
  waitMedia
} = require('./orchestrator.cjs');

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
    status: 'failed',
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
  parseCli,
  readRequest,
  runCli
};

if (require.main === module) {
  runCli().then((exitCode) => { process.exitCode = exitCode; });
}
