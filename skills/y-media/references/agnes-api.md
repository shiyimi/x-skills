# Agnes AI Image And Video API

This reference records the `.cn` API contract verified from `https://agnes-ai.cn/en/docs/` on 2026-07-30. Prefer it over older examples that use `.com` hosts.

## Credentials And Host

```text
API root: https://api.agnes-ai.cn
Authentication: Authorization: Bearer <AGNES_API_KEY>
Content-Type: application/json
```

Resolve `AGNES_API_KEY` before `~/.config/agnes/api_key`. Require mode `0600` for the file on POSIX. Never send the bearer header to returned artifact URLs.

POSIX setup:

```bash
umask 077
mkdir -p ~/.config/agnes
printf '%s' 'YOUR_API_KEY' > ~/.config/agnes/api_key
chmod 600 ~/.config/agnes/api_key
```

Avoid literal keys in shell history. On Windows, prefer a secret manager or a session environment variable; restrict the config file ACL to the current account.

## Images

```text
POST https://api.agnes-ai.cn/v1/images/generations
```

| Model | Use |
| --- | --- |
| `agnes-image-2.1-flash` | Default; tier sizes and ratios |
| `agnes-image-2.0-flash` | Faster model and documented exact sizes |

Use `extra_body.image` for image editing and `extra_body.response_format` for `url`/`b64_json`. Do not send obsolete `tags: ["img2img"]`.

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "Make the object matte black",
  "size": "1K",
  "ratio": "1:1",
  "extra_body": {
    "image": ["data:image/png;base64,..."],
    "response_format": "url"
  }
}
```

Handle each `data[]` entry as either `url` or `b64_json`. Image inputs may be public HTTPS URLs or local PNG/JPEG/WEBP files; the Provider converts local files to Data URIs.

## Videos

```text
POST https://api.agnes-ai.cn/v1/videos
Model: agnes-video-v2.0
```

Defaults are `1152x768`, `121` frames, and `24` fps. `num_frames` must be at most `441` and satisfy `8n + 1`; `frame_rate` must be `1-60`.

For `image-to-video`, send one public HTTPS URL as `image`. For `keyframes-to-video`, send at least two public HTTPS URLs as `extra_body.image` and set `extra_body.mode` to `keyframes`. Agnes video input does not support local paths or Data URIs.

```json
{
  "model": "agnes-video-v2.0",
  "prompt": "A cinematic product reveal",
  "width": 1152,
  "height": 768,
  "num_frames": 121,
  "frame_rate": 24
}
```

Use `video_id`, not `task_id`, as the normalized task ID.

## Video Status

```text
GET https://api.agnes-ai.cn/agnesapi?video_id=<VIDEO_ID>
```

| Agnes | Normalized |
| --- | --- |
| `queued` | `queued` |
| `in_progress` | `running` |
| `completed` | `succeeded` |
| `failed` | `failed` |

Read the completed artifact from the current official `metadata.url` field. For responses from
legacy Agnes routes, also accept `video_url`, `url`, `output_url`, and `data[].url`, in that order
after `metadata.url`; validate every candidate as a public HTTPS URL. Report a warning when a
legacy field is used.

Keep the `video_id` returned at creation as the normalized task ID. A later status response may
return a different `video_id`, `task_id`, or `id`; retain those values as Provider diagnostics but
never let them replace the pinned task ID. If a completed response contains no supported artifact
URL, return `invalid_response` with a credential-redacted summary of response keys, metadata keys,
and identifier changes rather than the raw response.

## Error Boundaries

| HTTP | Kind | Generation fallback |
| ---: | --- | --- |
| `400`, `404`, `405`, `409`, `413`, `415`, `422` | `invalid_request` | allowed only with `accepted: false` |
| `401` | `authentication` | allowed only with `accepted: false` |
| `402` | `quota_exhausted` | allowed only with `accepted: false` |
| `403` | `permission` | allowed only with `accepted: false` |
| `429` | `rate_limited` | allowed only when rejection is authoritative |
| `408`, ambiguous `5xx` | `network` / `provider_unavailable` | forbidden; acceptance is unknown |

Never retry a generation POST. Idempotent status GET and public artifact downloads may use bounded transient retry. Preserve `video_id` across local timeout or download failure.

URL validation rejects embedded credentials, localhost names, and private/link-local IP literals and validates each redirect. DNS names are not resolved before fetch, so trusted hostnames remain required against DNS rebinding.
