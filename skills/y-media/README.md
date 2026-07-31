# y-media

`y-media` is a thin media workflow Skill with a Node.js CLI. It supports image and video generation through explicitly registered Providers while preserving deterministic routing, task recovery, and local artifact handling.

Runtime instructions live in [SKILL.md](SKILL.md). Shared request, result, error, and Provider contracts live in [core/provider-contract.md](core/provider-contract.md). Provider-specific API facts stay beside each implementation, for example [providers/agnes/api.md](providers/agnes/api.md).

## Architecture

```text
SKILL.md
  intent collection and creative planning
        |
        v
core/media.cjs
  stdin/file JSON and stdout JSON CLI adapter
        |
        v
core/orchestrator.cjs
  validation, routing, create, status, wait, recovery
        |
        +--> providers/manifest.cjs --> providers/<id>/provider.cjs
        |
        +--> core/artifacts.cjs --> local files
```

The boundaries are deliberate:

| Area | Responsibility |
| --- | --- |
| Skill | Collect intent, plan images or video storyboards, and build public requests |
| CLI | Parse commands and JSON, redact errors, print one JSON result, and map exit codes |
| Orchestrator | Select Providers, submit once, pin tasks, poll, and coordinate saving |
| Contract | Validate manifests, public requests, outcomes, and stable error categories |
| Artifacts | Validate public URLs and save downloads, Base64, or bytes atomically |
| Provider | Resolve credentials, map parameters, call one external API, and normalize outcomes |

Creative brief collection and storyboard generation do not belong in core. Provider-specific models, endpoints, credentials, and response compatibility do not belong in orchestration.

## Layout

```text
y-media/
|-- SKILL.md
|-- README.md
|-- core/
|   |-- media.cjs
|   |-- orchestrator.cjs
|   |-- contract.cjs
|   |-- artifacts.cjs
|   `-- provider-contract.md
|-- providers/
|   |-- manifest.cjs
|   `-- agnes/
|       |-- provider.cjs
|       `-- api.md
`-- tests/
    `-- media.test.cjs
```

## Public API

The CLI exposes `capabilities`, `generate`, `create`, `status`, and `wait` through `core/media.cjs`.

`core/orchestrator.cjs` exports the reusable workflow functions:

| Function | Responsibility |
| --- | --- |
| `listCapabilities(manifest)` | Return enabled registrations and capabilities without checking credentials |
| `generateMedia(request, context)` | Select, create, wait, and save new work |
| `createMedia(request, context)` | Validate and submit one new task without waiting |
| `statusMedia(request, context)` | Query one existing task on its pinned Provider |
| `waitMedia(request, context)` | Poll one pinned task within a local deadline and save successful artifacts |

Their exact request and result shapes are defined in [core/provider-contract.md](core/provider-contract.md). `core/media.cjs` intentionally exports only CLI-facing helpers.

## Routing Rules

- `providers/manifest.cjs` is the only Provider registry.
- Every enabled Provider has one unique integer priority shared by all capabilities.
- Lower priority numbers run first; manifest array order has no routing meaning.
- New work may use priority routing. Existing work is always pinned to its original Provider and opaque task ID.
- Fallback after `create()` is allowed only when rejection is authoritative and `accepted: false`.
- Unknown acceptance, created tasks, polling errors, and artifact errors block Provider switching.
- Quota remains unknown unless a Provider returns authoritative information. There is no speculative quota abstraction.

## Add A Provider

1. Create `providers/<id>/provider.cjs` and colocate its verified API notes in `providers/<id>/api.md`.
2. Implement `isConfigured`, `supports`, `create`, and `status` when the Provider can return asynchronous work.
3. Register the Provider once in `providers/manifest.cjs` with a unique ID, unique enabled priority, and supported capabilities.
4. Keep detailed models, formats, dimensions, credentials, and endpoints out of the manifest.
5. Normalize all responses and redact Provider-owned credentials before errors cross into core.
6. Add contract, routing, task identity, fallback, response mapping, and credential-boundary tests.

Do not add another CLI, automatic discovery, a Provider base class, capability-specific priorities, or a Provider-specific workflow. Add shared core behavior only after at least two real Providers require the same stable behavior.

## Development

Run the complete regression suite:

```text
node --test skills/y-media/tests/media.test.cjs
```

Check the executable modules:

```text
node --check skills/y-media/core/contract.cjs
node --check skills/y-media/core/artifacts.cjs
node --check skills/y-media/core/orchestrator.cjs
node --check skills/y-media/core/media.cjs
node --check skills/y-media/providers/manifest.cjs
node --check skills/y-media/providers/agnes/provider.cjs
```

Validate the Skill metadata and links from the repository root:

```text
uv run --no-project --with pyyaml python <skill-creator-dir>/scripts/quick_validate.py skills/y-media
```

Tests must not make live generation requests or consume Provider quota. Use injected transports and temporary output directories for Provider and artifact behavior.
