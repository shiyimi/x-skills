---
name: y-media
description: Use when generating or editing images, generating videos, using Agnes AI or another registered media Provider, spending a Provider's free media quota, checking an existing media task, resuming a task, or downloading generated media.
---

# Media Generation

Use the bundled Node.js CLI for image and video work. Let the manifest choose new work by fixed Provider priority unless the user explicitly names a Provider. Keep every existing task pinned to its original Provider.

## Prepare

Require Node.js 18 or newer. Locate `core/media.cjs` relative to this file.

Read [references/provider-contract.md](references/provider-contract.md) when constructing requests, interpreting errors, or adding a Provider. Read [references/agnes-api.md](references/agnes-api.md) only for Agnes credentials, models, or parameters.

For Agnes, let the Provider resolve credentials in this order:

1. `AGNES_API_KEY`.
2. `~/.config/agnes/api_key`.

Never put credentials, prompts, or JSON blobs in command arguments, logs, or chat output.

## Execute

Pass one JSON object through stdin or `--request <path>`:

```text
node <skill-dir>/core/media.cjs capabilities
node <skill-dir>/core/media.cjs generate
node <skill-dir>/core/media.cjs create
node <skill-dir>/core/media.cjs status
node <skill-dir>/core/media.cjs wait
```

Use `generate` for a complete create/wait/download workflow. Use `create` when the user wants submission without waiting. Use `status` for one check. Use `wait` for one bounded wait on an existing task.

Omit `provider` only for new `generate` or `create` work:

```json
{
  "capability": "text-to-image",
  "prompt": "A clean studio product photo",
  "inputs": [],
  "parameters": {},
  "output": { "directory": "outputs" }
}
```

Include the exact original Provider and task ID for `status` and `wait`:

```json
{
  "provider": "agnes",
  "capability": "image-to-video",
  "task": { "id": "video_xxx" },
  "output": { "directory": "outputs" },
  "wait": { "timeout_seconds": 1200 }
}
```

Never infer a Provider from an opaque task ID. Never call `generate` again to resume work.

## Handle Results

Parse the single stdout JSON object. Report `provider`, normalized `status`, `task.id`, warnings, effective parameters, and absolute `artifacts[].path` values.

On `wait_timeout`, retain the Provider and task ID. The task remains remote and active; do not claim cancellation, resubmit, or switch Provider. Run another bounded `wait` only after the user asks to continue.

On `download_failed` after remote success, retain the successful remote status and task. Resume with `wait` on the same Provider and task to retry status/download without recreating media.

Do not retry a generation POST outside the CLI. Do not switch Provider after unknown acceptance, HTTP 408/ambiguous 5xx, task creation, polling, or download failure. Do not claim live verification unless a quota-consuming request was explicitly run.

Treat exit codes as categories: `2` request/configuration, `3` authentication/permission, `4` quota/rate limit, `5` Provider/task/response, and `6` network/wait/download.

## Add Providers

Register a Provider only in `providers/manifest.cjs`. Give it one unique enabled integer priority shared by all capabilities; lower numbers run first. Implement the minimal contract in [references/provider-contract.md](references/provider-contract.md). Do not add another CLI, discovery layer, base class, or capability-specific priority.
