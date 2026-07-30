# Media Provider Orchestration Design

**Date:** 2026-07-30
**Status:** Draft for user review

## Goal

Refactor the existing Agnes-only media skill into one global media skill that owns request flow, fixed-priority Provider selection, safe fallback, normalized results, asynchronous waiting, and artifact storage. Each Provider owns only its credentials, capability-specific validation, API mapping, remote task semantics, and response normalization.

The design must make a second real image or video Provider easy to add without introducing a plugin framework, dynamic policy engine, dependency-injection container, or duplicated CLI workflow.

## Decisions

- Use one `media` skill as the only execution and intent-routing entry point.
- Move Agnes under `providers/agnes.cjs`; do not keep a parallel Agnes CLI or compatibility wrapper.
- Register every Provider explicitly in `providers/manifest.cjs`.
- Give each Provider one global integer `priority`; lower numbers run first.
- Require every enabled Provider to have a unique priority.
- Use the manifest as the only source for Provider IDs, enabled state, priorities, and capability lists.
- Let the global workflow fall back only before remote acceptance is certain.
- Pin every created task to its original Provider; status and wait never reselect a Provider.
- Keep Node.js 18+, CommonJS, and zero third-party runtime dependencies.
- Continue using current `agnes-ai.cn` endpoints and preserve the existing Agnes safety behavior.

## Scope

The first refactored release registers only Agnes but implements and tests the multi-Provider selection contract with injected fixture Providers. It supports the current capabilities:

- `text-to-image`
- `image-to-image`
- `text-to-video`
- `image-to-video`
- `keyframes-to-video`

It supports generation, asynchronous task creation, one-time status checks, bounded waiting, resumable waiting, and local artifact downloads.

## Non-Goals

- Dynamic quota-based ranking
- Provider health scoring
- Runtime priority overrides
- Capability-specific priorities
- Duplicate priorities resolved by array order
- Automatic Provider discovery or directory scanning
- Provider base classes or inheritance
- Generic HTTP client framework
- Provider lifecycle hooks
- Database-backed task persistence
- Audio, chat, cancellation, or cross-machine workers
- Compatibility wrappers for the old Agnes CLI
- Guessing quota from local request counts

## Minimal Structure

```text
skills/media/
├── SKILL.md
├── core/
│   ├── media.cjs
│   ├── contract.cjs
│   └── artifacts.cjs
├── providers/
│   ├── manifest.cjs
│   └── agnes.cjs
├── references/
│   ├── provider-contract.md
│   └── agnes-api.md
└── tests/
    └── media.test.cjs
```

Runtime code has only two responsibility directories: `core/` and `providers/`. `references/` and `tests/` are documentation and verification artifacts, not runtime layers.

Do not create `agents/`, `scripts/`, or `orchestration/`. `agents/openai.yaml` is optional UI metadata and will be omitted. If a Provider later becomes too large for one cohesive file, split that Provider only after the file demonstrates a real independent responsibility.

## Responsibilities

### `core/media.cjs`

Act as both the CLI entry point and global workflow coordinator:

- parse commands and read one JSON request;
- validate the manifest at startup;
- select fixed-priority Provider candidates;
- apply explicit-provider and fallback rules;
- execute create, status, wait, and combined generation flows;
- enforce polling deadlines and idempotent retry boundaries;
- pass returned Artifact Sources to the shared artifact saver;
- print one normalized JSON result and set the stable exit code.

Keep selection and execution as local functions in this file. Do not extract `select-provider.cjs` or `execute-media.cjs` until a second selection strategy or materially different global workflow exists.

### `core/contract.cjs`

Own only stable cross-Provider vocabulary:

- capability constants;
- public request validation;
- manifest and Provider-interface validation;
- normalized statuses;
- `ProviderError` and stable error kinds;
- normalized result helpers;
- CLI error-to-exit-code mapping.

Do not create an error hierarchy or Provider base class.

### `core/artifacts.cjs`

Own shared local artifact materialization:

- output-root preflight;
- credential-free public HTTPS URL validation;
- localhost, embedded credential, and private/link-local literal rejection;
- manual redirect validation;
- transient idempotent download retry;
- Base64 and byte decoding;
- streamed `.part` writes and atomic rename;
- MIME-to-extension mapping;
- non-overwriting unique paths;
- normalized local Artifact metadata.

The artifact layer never reads Provider credentials or attaches Provider authorization headers. A future Provider whose artifacts require private authentication must fetch or decode them inside the Provider and return bytes; do not pass credentials into the shared downloader.

### `providers/manifest.cjs`

Be the single explicit registry:

```js
module.exports = [
  {
    id: 'agnes',
    enabled: true,
    priority: 100,
    capabilities: [
      'text-to-image',
      'image-to-image',
      'text-to-video',
      'image-to-video',
      'keyframes-to-video'
    ],
    provider: require('./agnes.cjs')
  }
];
```

Validate these invariants before handling a request:

- manifest is a non-empty array;
- `id` is a non-empty unique string;
- `enabled` is boolean;
- `priority` is a finite integer;
- priorities are unique across enabled Providers;
- `capabilities` is non-empty, contains no duplicates, and uses known capability values;
- `provider` satisfies the minimal interface.

Manifest order has no routing meaning. Do not put secrets, API roots, model names, or detailed request constraints in the manifest.

### `providers/agnes.cjs`

Keep all Agnes-owned concerns cohesive in one Provider unit:

- credential resolution and POSIX permission checks;
- current `.cn` API endpoints;
- image and video request mapping;
- Agnes-specific model and parameter validation;
- one-shot POST execution without automatic retry;
- video task status GET and Agnes state mapping;
- Agnes HTTP and response error classification;
- conversion of Agnes results into normalized Provider outcomes and Artifact Sources.

Do not duplicate the manifest capability list in this file. `supports()` handles detailed request constraints, not coarse capability registration.

## Public Request Contract

New generation requests use:

```json
{
  "provider": "agnes",
  "capability": "text-to-image",
  "prompt": "A clean studio product photo",
  "inputs": [],
  "parameters": {},
  "output": { "directory": "outputs" },
  "wait": { "timeout_seconds": 1200 }
}
```

Stable fields:

| Field | Contract |
| --- | --- |
| `provider` | Optional for new work; when present, select only that Provider |
| `capability` | Required stable media capability |
| `prompt` | Required for new generation |
| `inputs` | Typed Provider-independent media inputs |
| `parameters` | Provider-owned parameters; not normalized prematurely |
| `output.directory` | Optional output root, resolved from process working directory |
| `wait.timeout_seconds` | Optional bounded wait duration |

Status and wait requests must identify the original Provider because task IDs are opaque and may collide:

```json
{
  "provider": "agnes",
  "capability": "image-to-video",
  "task": { "id": "video_xxx" },
  "output": { "directory": "outputs" },
  "wait": { "timeout_seconds": 1200 }
}
```

For `status` and `wait`, `provider` and `task.id` are required. The dispatcher never tries to infer a Provider from a task ID and never applies priority selection to existing work.

## Minimal Provider Contract

A Provider exports an object with these functions:

```js
module.exports = {
  isConfigured,
  supports,
  create,
  status
};
```

### `isConfigured(context)`

Return a boolean without returning or logging credential contents. It may inspect environment variables and Provider-specific config files.

### `supports(request)`

Perform detailed, side-effect-free validation after the manifest capability filter:

```js
{ supported: true }
```

or:

```js
{
  supported: false,
  reason: "Agnes video inputs require public HTTPS URLs"
}
```

Use `supports()` for model, format, dimension, input-count, and Provider-specific constraints. It must not make quota-consuming requests.

### `create(request, context)`

Submit new work once and return a normalized Provider outcome:

```js
{
  status: "succeeded" | "queued" | "running" | "failed",
  task: { "id": "provider-task-id", "provider_status": "...", "progress": 0 },
  artifact_sources: [],
  effective_parameters: {},
  warnings: []
}
```

Synchronous image generation may return `succeeded` and Artifact Sources immediately. Asynchronous video creation returns a task. `create()` never saves files locally.

### `status(task, context)`

Query an existing asynchronous task and return the same normalized outcome shape. It is optional only for a Provider that can never return an asynchronous task. Manifest validation does not require empty methods for synchronous-only Providers.

## Artifact Source Contract

Provider outcomes may return:

```js
{
  kind: 'url' | 'base64' | 'bytes',
  mime_type: 'image/png',
  value: '...'
}
```

Only these three proven source kinds are supported initially. Do not predefine streams, signed request objects, callbacks, or Provider-specific download hooks. URL sources must be credential-free public HTTPS URLs. Providers must convert privately authenticated results to bytes before returning them.

The shared artifact layer converts sources to normalized artifacts:

```json
{
  "type": "image",
  "path": "C:/work/outputs/agnes/.../result-01.png",
  "source_url": "https://...",
  "mime_type": "image/png",
  "bytes": 1234
}
```

## Selection Algorithm

For new work without an explicit Provider:

1. Validate the public request and manifest.
2. Filter to enabled entries containing the requested capability.
3. Sort ascending by the globally unique priority.
4. Skip a Provider when `isConfigured()` is false.
5. Skip a Provider when `supports()` returns `supported: false`.
6. Call `create()` on the first eligible Provider.
7. Apply the accepted-before-fallback rule if `create()` fails.
8. Return `no_provider_available` with sanitized skip reasons if no candidate can run.

For new work with an explicit Provider:

1. Find exactly that enabled manifest entry.
2. Validate its capability, configuration, and `supports()` result.
3. Call it once.
4. Return its result or error without trying another Provider.

## Safe Fallback

Fallback is allowed only when no remote acceptance occurred or the Provider authoritatively reports rejection before acceptance:

- Provider disabled;
- credential not configured;
- manifest capability does not match;
- `supports()` rejects the request;
- Provider throws a normalized error with `accepted: false`.

Fallback is forbidden when:

- `accepted` is `true`, missing, or unknown;
- a POST transport error occurs;
- HTTP 408 or ambiguous 5xx occurs;
- a response cannot be parsed well enough to prove rejection;
- an asynchronous task has been created;
- status, wait, or artifact saving fails;
- the user explicitly selected the Provider.

`accepted: false` is the only post-call signal that permits fallback. Provider implementations must never infer it from a missing response. Agnes POST transport failures and ambiguous HTTP responses remain non-retryable and block fallback.

## Asynchronous Flow

`generate` performs:

```text
select Provider
  → create once
  → if succeeded, save Artifact Sources
  → if queued/running, poll the same Provider
  → if succeeded, save Artifact Sources
  → if local deadline expires, return wait_timeout with provider + task.id
```

`create` stops after the normalized create outcome. `status` performs one idempotent status workflow. `wait` polls one already-pinned Provider and task.

The core owns the deadline and polling loop. The Provider owns each status request and may return a bounded `poll_after_ms` hint; the core clamps hints to the remaining deadline. Generation POSTs are never wrapped in retry. Idempotent status calls and public artifact downloads may use bounded transient retries.

Run at most one bounded wait invocation per user request. A timeout does not cancel, resubmit, or switch the task.

## CLI

Use one entry point:

```text
node <skill-dir>/core/media.cjs capabilities
node <skill-dir>/core/media.cjs generate
node <skill-dir>/core/media.cjs create
node <skill-dir>/core/media.cjs status
node <skill-dir>/core/media.cjs wait
```

Accept only `--request <path>` or stdin JSON. Do not accept keys, prompts, or JSON blobs as command arguments. Print one JSON object to stdout and preserve the existing exit-code categories.

`capabilities` returns the manifest-derived Provider list, priorities, enabled state, and capability union. It must not require credentials or make network calls.

## Result And Error Contract

Results retain:

- `ok`
- `provider`
- `capability`
- normalized `status`
- pinned `task`
- local `artifacts`
- `effective_parameters`
- `warnings`
- `timing`
- optional normalized `error`

Add the stable error kind `no_provider_available` for automatic selection that exhausts all candidates before remote acceptance. Return sanitized per-Provider skip reasons, never credential paths containing secrets or raw Provider responses.

A completed remote task followed by local download failure returns `ok: false`, remote `status: "succeeded"`, the pinned Provider and task, and `error.kind: "download_failed"`.

## Migration

Perform one intentional contract migration:

1. Create `skills/media` in the minimal structure.
2. Move stable validation, error, and artifact behavior from Agnes into `core`.
3. Move all remaining Agnes behavior into `providers/agnes.cjs`.
4. Register Agnes at unique priority `100` in `providers/manifest.cjs`.
5. Replace Agnes-specific CLI commands with the global media commands.
6. Change status and wait requests from bare `video_id` to pinned `provider` plus `task.id`.
7. Update the Skill instructions, references, evals, and tests.
8. Remove `skills/agnes-ai`; do not retain a forwarding wrapper.

No production API call is required for the migration. Live smoke testing remains an explicit quota-consuming user decision.

## Testing

Continue with `node:test`, real temporary files, and injected external boundaries. Keep one test file initially. Cover:

- manifest IDs, priorities, capabilities, and interface validation;
- duplicate enabled priority rejection;
- deterministic global priority ordering;
- explicit Provider selection without fallback;
- skipping unconfigured and unsupported Providers;
- fallback only on `accepted: false`;
- blocking fallback on unknown acceptance, transport errors, and created tasks;
- task pinning for status and wait;
- deadline-aware retries and abort signals;
- public URL, redirect, Base64, bytes, streamed write, and partial artifact failures;
- Agnes credential precedence and permissions;
- current `.cn` Agnes request mapping and response normalization;
- no repeated generation POST;
- stdout JSON, secret redaction, exit codes, and manifest-derived capabilities;
- output preflight before quota-consuming requests.

Fixture Providers test orchestration behavior without pretending that another production Provider already exists.

## Acceptance Criteria

- Runtime structure contains only the agreed `core` and `providers` responsibility layers.
- `providers/manifest.cjs` is the only Provider registration and coarse capability source.
- Enabled Provider IDs and priorities are unique and validated before request execution.
- Automatic selection is deterministic and uses one global priority per Provider.
- Explicit Provider requests never switch Providers.
- Automatic fallback occurs only before acceptance or on explicit `accepted: false`.
- Existing tasks remain pinned to their original Provider across status and wait.
- Common request, result, error, and artifact storage behavior is Provider-independent.
- Agnes retains all existing image/video behavior and `.cn` security guarantees.
- No old Agnes CLI wrapper or duplicated workflow remains.
- Offline tests and the repository Skill validator pass.
- No unrelated working-tree changes are staged or committed.
