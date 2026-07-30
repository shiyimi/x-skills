# Agnes AI Media Skill Design

**Date:** 2026-07-30  
**Status:** Approved for implementation

## Goal

Create a Codex skill that uses the current `agnes-ai.cn` API to generate and edit images and to generate videos. The skill must download generated artifacts locally and expose a small provider contract that future media-provider skills can follow without introducing a shared runtime before a second provider exists.

## Scope

The first release supports:

- text-to-image;
- image-to-image, including multiple input images;
- text-to-video;
- image-to-video using a public HTTPS image URL;
- keyframes-to-video using public HTTPS image URLs;
- video task creation, one-time status queries, resumable waiting, and result download.

It does not support text chat, audio, automatic cross-provider routing, automatic quota discovery, or local-file inputs for video. The current Agnes video documentation only guarantees URL inputs, so local video reference images must be rejected at the boundary.

## Sources Of Truth

Use the current Markdown documentation under `https://agnes-ai.cn/en/docs/*.md` as the API contract. The public `AgnesAI-Labs/Agnes-AI` GitHub repository is a useful workflow and error-handling reference, but its README still uses older `.com` API hosts. Runtime constants must therefore use the current `.cn` documentation:

- API root: `https://api.agnes-ai.cn`
- Image generation: `POST /v1/images/generations`
- Video creation: `POST /v1/videos`
- Video polling: `GET /agnesapi?video_id=<VIDEO_ID>`
- Authentication: `Authorization: Bearer <API_KEY>`

## Structure

```text
skills/agnes-ai/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   └── agnes_api.cjs
└── references/
    ├── api.md
    └── provider-contract.md
```

`SKILL.md` owns intent routing and agent workflow. `scripts/agnes_api.cjs` is the only execution entry point and owns credentials, request mapping, HTTP calls, polling, response normalization, and downloads. Detailed Agnes fields live in `references/api.md`. The stable request/result vocabulary lives in `references/provider-contract.md`.

Do not create a shared package, `_shared` directory, router, or generic HTTP client in this release. When a second real provider is added, compare both implementations and extract only proven duplication.

## CLI

Use Node.js 18+, CommonJS, and no third-party runtime dependencies. The single CLI exposes:

```text
agnes_api.cjs capabilities
agnes_api.cjs image generate
agnes_api.cjs video create
agnes_api.cjs video status
agnes_api.cjs video wait
agnes_api.cjs video generate
```

Commands read one JSON request from `--request <path>` or stdin. Avoid putting prompts or JSON in shell arguments because quoting differs across PowerShell and POSIX shells. All machine-readable results go to stdout as one JSON object. Diagnostics go to stderr and never include credentials. Exit codes are stable:

| Code | Meaning |
| ---: | --- |
| `0` | completed successfully |
| `2` | invalid request or configuration |
| `3` | authentication or permission failure |
| `4` | quota or rate limit |
| `5` | provider or remote task failure |
| `6` | network, wait timeout, or download failure |

## Credentials

Resolve credentials in this order:

1. non-empty `AGNES_API_KEY` environment variable;
2. non-empty `~/.config/agnes/api_key` file.

Do not support `--api-key` or automatically load project `.env` files. Resolve `~` with `os.homedir()`. Trim surrounding whitespace and reject empty values. On POSIX, reject a credential file readable or writable by group/other and instruct the user to set mode `0600`. On Windows, rely on the user-profile ACL and document that only the current user should be able to read the file.

Never log, serialize, snapshot, or echo the key. Only send it to `https://api.agnes-ai.cn` in the bearer header. Artifact downloads use a separate unauthenticated request, so redirects or storage hosts never receive the Agnes credential.

## Provider Request

The stable request shape is:

```json
{
  "capability": "image-to-image",
  "prompt": "Make the object matte black while preserving composition",
  "inputs": [
    {
      "type": "image",
      "source": { "kind": "path", "value": "assets/source.png" }
    }
  ],
  "parameters": {
    "model": "agnes-image-2.1-flash",
    "size": "2K",
    "ratio": "16:9"
  },
  "output": { "directory": "outputs" }
}
```

Stable fields are `capability`, `prompt`, `inputs`, `parameters`, and `output.directory`. The contents of `parameters` remain provider-owned in this release. Do not pretend that Agnes-specific controls are already portable.

Image defaults are `agnes-image-2.1-flash`, `1K`, and `1:1`. Video defaults are `agnes-video-v2.0`, `1152x768`, `121` frames, and `24` FPS. For video, enforce `num_frames <= 441`, `num_frames = 8n + 1`, and `frame_rate` between `1` and `60`.

Local PNG, JPEG, and WEBP image inputs are converted to Data URIs for image workflows. Public HTTPS URLs pass through. Image input and `response_format` must be mapped under `extra_body`; do not emit obsolete `tags` fields. Video and keyframe inputs must be public HTTPS URLs.

## Provider Result

Return a normalized envelope:

```json
{
  "ok": true,
  "provider": "agnes",
  "capability": "text-to-video",
  "status": "succeeded",
  "task": {
    "id": "video_xxx",
    "provider_status": "completed",
    "progress": 100
  },
  "artifacts": [
    {
      "type": "video",
      "path": "outputs/agnes/20260730T073012Z-video_xxx/result-01.mp4",
      "source_url": "https://platform-outputs.agnes-ai.space/videos/result.mp4",
      "mime_type": "video/mp4",
      "bytes": 4839201
    }
  ],
  "effective_parameters": {
    "size": "1280x768",
    "seconds": 5,
    "size_mapping": { "adjusted": true }
  },
  "warnings": [],
  "timing": {
    "started_at": "2026-07-30T07:30:12.000Z",
    "completed_at": "2026-07-30T07:31:04.000Z",
    "duration_ms": 52000
  }
}
```

Map Agnes `queued`, `in_progress`, `completed`, and `failed` to `queued`, `running`, `succeeded`, and `failed`. An exhausted local wait is not a remote failure: return `ok: false`, retain the normalized running state and `video_id`, and use `error.kind: wait_timeout` so the caller can resume with `video wait`.

Use these stable error kinds: `configuration`, `invalid_request`, `authentication`, `permission`, `quota_exhausted`, `rate_limited`, `provider_unavailable`, `network`, `task_failed`, `wait_timeout`, `download_failed`, and `invalid_response`. Include a sanitized message, `retryable`, and optional HTTP/provider codes.

Do not include fabricated usage or remaining-quota values. Agnes image/video responses do not provide an authoritative quota balance.

## Retry And Polling

Never automatically retry image-generation or video-creation POST requests. A lost response makes acceptance ambiguous; repeating the request could consume free quota and produce duplicates.

Status GET requests may retry transient network errors, `429`, and temporary `5xx` responses with jittered exponential backoff. Artifact GET requests may retry because downloads are idempotent. Do not retry `400`, `401`, `402`, `403`, or `422`.

Poll video status starting around five seconds and grow to at most twenty seconds with jitter. The default total wait is twenty minutes and is configurable by a wait option. A timeout does not cancel or resubmit the task.

## Artifact Storage

Store artifacts under:

```text
<output-directory>/agnes/<UTC timestamp>-<sanitized task id>/result-01.<ext>
```

Use streamed downloads for videos and write to a `.part` file before an atomic rename. Validate HTTPS, HTTP status, content type, and non-empty content. Derive extensions from supported media types rather than trusting URL paths. Sanitize task IDs to prevent path traversal. Never silently overwrite a complete file. On a partial multi-artifact failure, preserve and report artifacts already downloaded.

## Testing

Use Node's built-in `node:test` with no third-party test dependencies. Export focused functions from the CLI module and inject fetch, clock, and filesystem boundaries in tests. Cover:

- credential precedence, empty credentials, POSIX permissions, and redaction;
- image request mapping, local Data URIs, and nested `extra_body.response_format`;
- video defaults and parameter boundaries;
- queued/running/completed/failed state transitions and resumable timeout;
- no automatic POST retries;
- retry classification for polling and downloads;
- URL and Base64 artifacts, streamed `.part` files, and partial failures;
- HTTP error normalization, stdout JSON, stderr redaction, and exit codes.

Default verification is offline. A real Agnes smoke test requires an explicit user decision because it consumes quota. Report offline contract verification and live-service verification separately.

## Future Providers

Each future provider receives its own skill and owns its authentication, request mapping, task semantics, and downloads. Create a `media-router` only after at least two real provider implementations exist.

The future router should prefer an explicitly selected provider, filter by capability, and only use authoritative quota/health information. Automatic fallback is allowed only when the original provider definitively rejected the request before accepting work. An ambiguous generation POST must never trigger automatic fallback.

## Acceptance Criteria

- The skill is discoverable and routes image/video intents correctly.
- All six CLI command forms return the documented JSON envelope and exit codes.
- Image generation/editing and video create/status/wait/generate mappings match current `.cn` documentation.
- Generated URL and Base64 images and generated video URLs are downloaded locally without leaking credentials.
- Waiting can be resumed by `video_id`, and no non-idempotent generation POST is automatically retried.
- Offline tests cover request mapping, state transitions, errors, downloads, credentials, and CLI behavior.
- Skill metadata and folder structure pass the repository's available skill validator.
