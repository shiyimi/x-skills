# Media Provider Contract

This is the minimal contract implemented by the Agnes skill. Keep provider-specific parameters inside `parameters` until another real provider demonstrates stable shared semantics.

## Request

```json
{
  "capability": "image-to-image",
  "prompt": "Make the object matte black",
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

Stable fields:

| Field | Contract |
| --- | --- |
| `capability` | `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video`, or `keyframes-to-video` |
| `prompt` | Required for a new generation request |
| `inputs[]` | Typed input artifacts; Agnes currently accepts images |
| `inputs[].source.kind` | `path` or `url` for image workflows; `url` only for video workflows |
| `parameters` | Provider-owned model controls |
| `output.directory` | Optional output root; defaults to `outputs`; relative paths resolve from the CLI process working directory |
| `video_id` | Required for `video status` and `video wait` |
| `wait.timeout_seconds` | Optional non-negative video wait timeout; defaults to 1200 |

For status or wait requests, preserve the original video capability when it is known. A missing capability defaults to `text-to-video` only for normalized result labeling and does not change the remote Agnes task.

Examples:

```json
{"capability":"text-to-image","prompt":"A clean studio product photo"}
```

```json
{
  "capability":"image-to-video",
  "prompt":"Slowly orbit the subject",
  "inputs":[{"type":"image","source":{"kind":"url","value":"https://example.com/input.png"}}]
}
```

```json
{"capability":"text-to-video","video_id":"video_xxx","wait":{"timeout_seconds":1200}}
```

## Success Result

```json
{
  "ok": true,
  "provider": "agnes",
  "capability": "text-to-video",
  "status": "succeeded",
  "task": {
    "id": "video_xxx",
    "task_id": "task_xxx",
    "provider_status": "completed",
    "progress": 100
  },
  "artifacts": [
    {
      "type": "video",
      "path": "outputs/agnes/20260730T073012Z-video_xxx/result-01.mp4",
      "source_url": "https://platform-outputs.agnes-ai.space/videos/task_xxx.mp4",
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

Normalized task states are `queued`, `running`, `succeeded`, and `failed`.

## Error Result

```json
{
  "ok": false,
  "provider": "agnes",
  "status": "running",
  "task": {
    "id": "video_xxx",
    "provider_status": "in_progress",
    "progress": 63
  },
  "error": {
    "kind": "wait_timeout",
    "message": "Waiting timed out while the task remains active.",
    "retryable": true
  }
}
```

Stable error kinds:

| Kind | Meaning |
| --- | --- |
| `configuration` | Missing or insecure credential configuration |
| `invalid_request` | Invalid request, media, or parameters |
| `authentication` | HTTP 401 |
| `permission` | HTTP 403 |
| `quota_exhausted` | HTTP 402 |
| `rate_limited` | HTTP 429 |
| `provider_unavailable` | Temporary Agnes 5xx failure |
| `network` | API network/TLS/timeout failure; a POST failure is non-retryable and carries `details.acceptance_unknown: true` |
| `task_failed` | Remote video status is failed |
| `wait_timeout` | Local waiting ended while remote task remains active |
| `download_failed` | Generated output could not be saved locally |
| `invalid_response` | Success response violates the documented contract |

Do not add a fabricated quota balance. Do not automatically retry non-idempotent generation requests. A future router may fall back only after a provider definitively rejects work before accepting it.

A `wait_timeout` result is a bounded local stop, not remote cancellation. Repeat `video wait` only when continued waiting is requested; otherwise return the reusable `task.id`. Running `video wait` again for an already completed task is also the supported way to retry a failed artifact download without recreating media.

Artifact paths are absolute in CLI results. URL validation rejects embedded credentials, localhost names, and loopback/private/link-local IP literals and validates every redirect. DNS names are not resolved before fetch, so callers must still trust the hostname against DNS rebinding.
