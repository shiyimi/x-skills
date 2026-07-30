---
name: agnes-ai
description: Generate or edit images and generate, inspect, resume, and download videos through the Agnes AI API at agnes-ai.cn. Use whenever the user mentions Agnes or Agnes AI, names an Agnes image/video model, wants to use Agnes free media quota, provides an Agnes video_id, or explicitly asks for Agnes image or video generation. Do not trigger for a generic media request when the user has not selected Agnes.
---

# Agnes AI Media

Use the bundled Node.js CLI for every Agnes operation. Do not reconstruct requests with ad hoc `curl` commands. The CLI owns credential handling, current `.cn` endpoints, request mapping, polling, error normalization, and local artifact downloads.

## Requirements

- Require Node.js 18 or newer.
- Locate `scripts/agnes_api.cjs` relative to this `SKILL.md`.
- Read [references/api.md](references/api.md) when selecting model-specific parameters.
- Read [references/provider-contract.md](references/provider-contract.md) when constructing request JSON or interpreting a result.

## Credentials

Let the CLI resolve credentials in this order:

1. `AGNES_API_KEY` environment variable.
2. `~/.config/agnes/api_key`.

Never put an API key in command arguments, request JSON, logs, or chat output. Never create a project `.env` for this skill.

When credentials are missing, direct the user to obtain a key from the Agnes API platform and configure one of the supported sources. For a POSIX config file, require permissions `0600`:

```bash
umask 077
mkdir -p ~/.config/agnes
printf '%s' 'YOUR_API_KEY' > ~/.config/agnes/api_key
chmod 600 ~/.config/agnes/api_key
```

Warn that placing a literal key in a shell command can leave it in shell history. Prefer an environment variable supplied by the user's secret manager or an interactive hidden-input setup.

## Route The Request

| User intent | Capability | Command |
| --- | --- | --- |
| Create an image from text | `text-to-image` | `image generate` |
| Edit or compose local/remote images | `image-to-image` | `image generate` |
| Create a video from text and wait for it | `text-to-video` | `video generate` |
| Animate one public image URL | `image-to-video` | `video generate` |
| Transition between public keyframe URLs | `keyframes-to-video` | `video generate` |
| Submit video work without waiting | video capability | `video create` |
| Inspect one known `video_id` | video capability | `video status` |
| Resume waiting for one known `video_id` | video capability | `video wait` |

Use `agnes-image-2.1-flash` by default for images and `agnes-video-v2.0` for videos. Use `agnes-image-2.0-flash` only when the user explicitly prefers the faster 2.0 image model.

For image workflows, accept local PNG, JPEG, and WEBP files or public HTTPS URLs. For video workflows, accept only public HTTPS image URLs; the current Agnes video contract does not guarantee local files or Data URIs. Explain this boundary instead of uploading a local file to an unrelated host.

## Execute

Create one UTF-8 JSON request file or pipe one JSON object through stdin. Prefer a request file for long prompts and paths so PowerShell and POSIX quoting cannot corrupt JSON.

```text
node <skill-dir>/scripts/agnes_api.cjs image generate --request <request.json>
node <skill-dir>/scripts/agnes_api.cjs video create --request <request.json>
node <skill-dir>/scripts/agnes_api.cjs video status --request <request.json>
node <skill-dir>/scripts/agnes_api.cjs video wait --request <request.json>
node <skill-dir>/scripts/agnes_api.cjs video generate --request <request.json>
node <skill-dir>/scripts/agnes_api.cjs capabilities
```

Do not pass prompts, image data, or keys as CLI arguments. The only supported option is `--request <path>`.

For a new image or video generation, include `capability` and `prompt`. For `video status` and `video wait`, include the existing `video_id`; do not submit another generation request.

Default all downloaded outputs to `<current-directory>/outputs/agnes/...` unless the user names an output directory. Report the final local artifact paths from `artifacts[].path`, not only the temporary source URLs.

## Handle Results

Parse the single JSON object printed to stdout.

- On `ok: true`, report the normalized status, task ID when present, effective dimensions/duration, warnings, and local artifact paths.
- On `wait_timeout`, state that the remote task is still active and retain `task.id`. Resume with `video wait`; never call `video generate` again for the same work.
- On `rate_limited` or a retryable provider error, explain the returned state. Do not wrap generation POSTs in another retry loop.
- On `quota_exhausted`, report the authoritative Agnes error. Do not infer a remaining balance from local call counts.
- On `download_failed`, preserve and report any completed artifacts found in `error.details.artifacts`.
- On an ambiguous network failure during image generation or video creation, do not automatically resubmit; the service may have accepted the original request.

Treat exit codes as categories: `2` input/configuration, `3` authentication/permission, `4` quota/rate limit, `5` provider/task/response failure, and `6` network/wait/download failure.

## Boundaries

- Send the bearer credential only to `https://api.agnes-ai.cn`.
- Do not claim that a task was cancelled when local waiting stops.
- Do not claim live API verification unless a real quota-consuming request was explicitly run.
- Do not add text chat, audio, provider routing, fallback, quota estimation, or shared runtime code to this skill.
- When another real media provider is added, implement it independently against [references/provider-contract.md](references/provider-contract.md) before extracting shared code.
