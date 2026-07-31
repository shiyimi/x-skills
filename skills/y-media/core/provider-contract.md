# Media Provider Contract

## Public Requests

New `generate` and `create` requests require `capability` and `prompt`. `provider` is optional:

```json
{
  "provider": "agnes",
  "capability": "image-to-image",
  "prompt": "Make the object matte black",
  "inputs": [
    {
      "type": "image",
      "source": { "kind": "path", "value": "assets/source.png" }
    }
  ],
  "parameters": { "model": "agnes-image-2.1-flash" },
  "output": {
    "directory": "outputs",
    "filename": "matte-black-product.png"
  },
  "wait": { "timeout_seconds": 1200 }
}
```

Capabilities are:

- `text-to-image`
- `image-to-image`
- `text-to-video`
- `image-to-video`
- `keyframes-to-video`

Keep Provider-owned controls inside `parameters`. Resolve relative output directories from the CLI process working directory. Optional `output.filename` is one safe file name of at most 120 characters, not a path. Core keeps task IDs out of local paths, adds sequence numbers for multiple artifacts, and replaces the requested extension with the actual media extension.

Existing `status` and `wait` requests require the original `provider`, `capability`, and `task.id`:

```json
{
  "provider": "agnes",
  "capability": "text-to-video",
  "task": { "id": "video_xxx" },
  "output": { "directory": "outputs" },
  "wait": { "timeout_seconds": 1200 }
}
```

Task IDs are opaque and may collide across Providers. Never probe Providers or route an existing task by priority.

## Manifest

Register Providers explicitly in `providers/manifest.cjs`:

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
    provider: require('./agnes/provider.cjs')
  }
];
```

Lower priority numbers run first. Enabled IDs and priorities must be unique. Manifest order has no routing meaning. Keep credentials, endpoints, models, and detailed constraints out of the manifest.

The manifest is the only source for Provider IDs, enabled state, priority, and coarse capability lists. Do not duplicate the capability list inside a Provider.

## Provider API

Export one object:

```js
module.exports = {
  isConfigured,
  supports,
  create,
  status
};
```

`isConfigured(context)` returns a boolean without returning or logging secrets.

Redact Provider credentials from every external error message, code, and detail before constructing a `ProviderError`. Core applies secondary CLI redaction but cannot know secrets loaded from Provider-owned files.

`supports(request)` is synchronous and side-effect-free. Return:

```js
{ supported: true }
```

or:

```js
{ supported: false, reason: 'Provider requires a public HTTPS image URL' }
```

Use it for detailed model, format, dimension, input-count, and Provider-specific constraints. Do not make network or quota-consuming calls.

`create(request, context)` submits new work exactly once and returns:

```js
{
  status: 'succeeded' | 'queued' | 'running' | 'failed',
  task: {
    id: 'provider-task-id',
    provider_status: 'queued',
    progress: 0
  },
  artifact_sources: [],
  effective_parameters: {},
  warnings: []
}
```

Synchronous Providers may omit `task`. `create()` never saves local files.

`status(task, context)` performs one idempotent status query and returns the same outcome. It may return a positive `poll_after_ms` hint. Omit `status` only when the Provider can never return asynchronous work.

## Artifact Sources

Return only these source kinds:

```js
{ kind: 'url', mime_type: 'image/png', value: 'https://cdn.example/result.png' }
{ kind: 'base64', mime_type: 'image/png', value: '...' }
{ kind: 'bytes', mime_type: 'video/mp4', value: buffer }
```

URL sources must be credential-free public HTTPS URLs. The shared artifact layer never receives Provider credentials. Convert private authenticated artifacts to bytes inside the Provider.

## Selection And Fallback

For automatic new work, core filters enabled capability registrations, sorts by ascending priority, skips unconfigured/unsupported Providers, and calls the first eligible Provider once.

Fallback after `create()` is allowed only when a `ProviderError` explicitly has `accepted: false`. Missing, `true`, or unknown acceptance blocks fallback. Transport failures, HTTP 408, ambiguous 5xx, malformed acceptance responses, created tasks, status/wait failures, and artifact failures block fallback.

Explicit Provider requests never fall back. Exhausted automatic candidates return `no_provider_available` with sanitized skip reasons.

## Public Results

Results contain `ok`, `provider`, `capability`, normalized `status`, optional pinned `task`, local `artifacts`, `effective_parameters`, `warnings`, `timing`, and optional `error`.

Normalized statuses are `queued`, `running`, `succeeded`, and `failed`. Stable error kinds include:

| Kind | Meaning |
| --- | --- |
| `configuration`, `configuration_error` | Credential or manifest configuration failed |
| `invalid_request` | Public or Provider-specific request is invalid |
| `no_provider_available` | Automatic selection exhausted safe candidates |
| `authentication`, `permission` | Provider rejected credentials or access |
| `quota_exhausted`, `rate_limited` | Provider quota/rate boundary |
| `provider_unavailable`, `network` | Provider or transport failure |
| `task_failed`, `wait_timeout` | Remote failure or bounded local wait ended |
| `download_failed` | Remote success could not be materialized locally |
| `invalid_response` | Provider violated the normalized contract |

A local timeout never cancels or resubmits a remote task. A download failure after remote completion retains `status: "succeeded"`, Provider, and task.
