# Agnes AI Image And Video API

This reference records the contract verified from the current English Markdown documentation under `https://agnes-ai.cn/en/docs/` on 2026-07-30. Prefer the `.cn` documentation over older GitHub examples that use `.com` API hosts.

## Common

```text
API root: https://api.agnes-ai.cn
Authentication: Authorization: Bearer <AGNES_API_KEY>
Content-Type: application/json
```

Never send the bearer header when downloading a URL returned by the API.

## Image Generation And Editing

```text
POST https://api.agnes-ai.cn/v1/images/generations
```

Models:

| Model | Use |
| --- | --- |
| `agnes-image-2.1-flash` | Default; detailed generation/editing, tier sizes and ratios |
| `agnes-image-2.0-flash` | Faster generation/editing with exact pixel sizes |

Common request fields:

| Field | Required | Notes |
| --- | --- | --- |
| `model` | yes | One of the two image models above |
| `prompt` | yes | Generation or editing instruction |
| `size` | yes | 2.1 supports `1K`, `2K`, `3K`, `4K`; both accept documented exact sizes |
| `ratio` | no | 2.1 supports `1:1`, `3:4`, `4:3`, `16:9`, `9:16`, `2:3`, `3:2`, `21:9` |
| `extra_body.image` | image editing | Array of public URLs or Data URI Base64 images |
| `extra_body.response_format` | no | Use `url` or `b64_json`; do not place at the top level |
| `return_base64` | no | Alternative text-to-image Base64 control |

Text-to-image example:

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "A luminous floating city above a misty canyon at sunrise",
  "size": "2K",
  "ratio": "16:9",
  "extra_body": { "response_format": "url" }
}
```

Image-to-image example:

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "Make the object matte black while preserving composition",
  "size": "1K",
  "ratio": "1:1",
  "extra_body": {
    "image": ["data:image/png;base64,..."],
    "response_format": "url"
  }
}
```

Do not send obsolete `tags: ["img2img"]`. Image editing is selected by `extra_body.image`.

Successful responses contain one or more entries:

```json
{
  "created": 1780000000,
  "data": [
    {
      "url": "https://storage.example/result.png",
      "b64_json": null,
      "revised_prompt": null
    }
  ]
}
```

Handle either `data[].url` or `data[].b64_json`.

## Video Creation

```text
POST https://api.agnes-ai.cn/v1/videos
Model: agnes-video-v2.0
```

Fields:

| Field | Required | Notes |
| --- | --- | --- |
| `model` | yes | `agnes-video-v2.0` |
| `prompt` | yes | Video description |
| `image` | image-to-video | One public HTTPS image URL |
| `width`, `height` | no | Defaults are `1152x768`; Agnes may normalize them |
| `num_frames` | no | `<= 441` and must satisfy `8n + 1`; default `121` |
| `frame_rate` | no | `1-60`; default `24` |
| `num_inference_steps` | no | Model inference control |
| `seed` | no | Reproducibility control |
| `negative_prompt` | no | Content to avoid |
| `extra_body.image` | keyframes | Array of public HTTPS keyframe URLs |
| `extra_body.mode` | keyframes | Set to `keyframes` |

Text-to-video example:

```json
{
  "model": "agnes-video-v2.0",
  "prompt": "A cinematic product reveal with smooth camera motion",
  "width": 1152,
  "height": 768,
  "num_frames": 121,
  "frame_rate": 24
}
```

The create response includes both IDs; use `video_id` for current polling:

```json
{
  "task_id": "task_xxx",
  "video_id": "video_xxx",
  "status": "queued",
  "progress": 0,
  "seconds": "5.0",
  "size": "1152x768"
}
```

## Video Status

```text
GET https://api.agnes-ai.cn/agnesapi?video_id=<VIDEO_ID>
```

Do not use the legacy `task_id` route for a new integration. Statuses are:

| Agnes | Meaning |
| --- | --- |
| `queued` | Waiting for capacity |
| `in_progress` | Generating |
| `completed` | Ready for download |
| `failed` | Remote generation failed |

Read the completed video URL from `metadata.url`:

```json
{
  "task_id": "task_xxx",
  "video_id": "video_xxx",
  "status": "completed",
  "progress": 100,
  "seconds": "5.0",
  "size": "1280x768",
  "metadata": {
    "size_mapping": {
      "adjusted": true,
      "requested_width": 1152,
      "requested_height": 768,
      "width": 1280,
      "height": 768
    },
    "url": "https://platform-outputs.agnes-ai.space/videos/task_xxx.mp4"
  }
}
```

Use returned `size`, `seconds`, and `metadata.size_mapping` as the effective output, not the original requested values.

## Error And Retry Guidance

| HTTP | Meaning | Retry generation POST? |
| ---: | --- | --- |
| `400`, `422` | Invalid parameters or inaccessible media | no |
| `401` | Invalid/missing key | no |
| `402` | Quota or balance exhausted | no |
| `403` | Access denied | no |
| `408` | Request timeout | never repeat an ambiguous generation POST; status/download GET may back off |
| `429` | Rate limited | never repeat an ambiguous generation POST; status/download GET may back off |
| `5xx` | Temporary provider failure | never repeat an ambiguous generation POST; status/download GET may back off |

Image generation may take seconds to minutes. Video generation is asynchronous. A local wait timeout does not imply cancellation; preserve the `video_id` and resume polling.

The bundled CLI bounds each status request and retry sequence by the local wait deadline. Re-run `video wait` with the same `video_id` to continue waiting or to retry downloading a video whose completed status was already returned.
