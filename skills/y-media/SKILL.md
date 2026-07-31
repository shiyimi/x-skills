---
name: y-media
description: Use when generating or editing images, generating videos, using Agnes AI or another registered media Provider, spending a Provider's free media quota, checking or resuming an existing media task, or downloading generated media.
---

# Media Workflow

Follow the fixed workflow below for every media task.

## Runtime

Require Node.js 18 or newer and locate `core/media.cjs` relative to this file. Read [core/provider-contract.md](core/provider-contract.md) for request/result shapes and errors. Read a Provider's colocated reference, such as [providers/agnes/api.md](providers/agnes/api.md), only for its credentials, models, and parameters.

Agnes resolves `AGNES_API_KEY` before `~/.config/agnes/api_key`. Never put credentials, prompts, or request JSON in arguments, logs, or chat output. Send JSON through stdin or `--request <path>`.

## 1. Classify

| Work | Route |
| --- | --- |
| Existing task with original Provider and task ID | Skip to step 6 |
| New image or image edit | Use the image branch in steps 2-5 |
| New video | Use the video branch in steps 2-5 |

Never infer a Provider from an opaque task ID. Existing work stays pinned to its original Provider and never re-enters priority selection.

## 2. Collect

Reuse supplied information and ask only for missing details that materially change the result.

For all new work collect purpose, subject, style, required/forbidden content, input assets, output directory, and readable filename. For images also determine dimensions and whether an input image is required. For videos also determine duration, aspect ratio, pacing, shot count, camera language, continuity, reference images, and keyframes.

## 3. Plan

For images, produce one final prompt and select `text-to-image` or `image-to-image`.

For videos, prepare a concise storyboard. Each shot contains a time range, subject/action, scene, camera, continuity notes, and prompt. The storyboard is Skill planning data, not a core contract. Convert it into the form supported by the capability:

| Input plan | Capability |
| --- | --- |
| Prompt only | `text-to-video` |
| One reference image | `image-to-video` |
| Start and end frames | `keyframes-to-video` |

Build the public request defined in [core/provider-contract.md](core/provider-contract.md). Keep Provider-specific controls in `parameters` and verify them against the selected Provider reference.

## 4. Route

Run `capabilities` before new work. Core filters enabled registrations by capability, configuration, and detailed support, then selects the eligible Provider with the lowest unique priority. Omit `provider` unless the user explicitly selected one.

Treat quota as unknown unless the Provider returns authoritative information. Do not invent free usage or add speculative quota calls. Fallback is allowed only after an authoritative pre-acceptance rejection with `accepted: false`.

## 5. Submit

| Command | Use |
| --- | --- |
| `node <skill-dir>/core/media.cjs capabilities` | Inspect registrations without credentials or quota use |
| `node <skill-dir>/core/media.cjs generate` | Run select, create, wait, and save for new work |
| `node <skill-dir>/core/media.cjs create` | Submit once without waiting |
| `node <skill-dir>/core/media.cjs status` | Check one existing task |
| `node <skill-dir>/core/media.cjs wait` | Wait on and save one existing task |

Use `generate` by default and `create` only when submission without waiting is requested. Submit exactly once. Never retry a generation POST outside the CLI or switch Provider after acceptance becomes true or unknown.

## 6. Wait Or Resume

`status` and `wait` require the exact original `provider`, `capability`, and `task.id`. They never route by priority.

Never use `generate` or `create` to resume work. On `wait_timeout`, retain the Provider and task ID; the remote task remains active. Continue with another bounded `wait` only when requested. On `download_failed` after remote success, use `wait` on the same task to retry status and download without recreating media.

## 7. Save

Successful `generate` and `wait` operations save Artifact Sources through core. Use one readable `output.filename` of at most 120 characters. Core keeps task IDs out of local paths, applies the actual media extension, numbers multiple artifacts, avoids overwrites, and returns absolute paths.

Do not claim media integrity checks that core does not perform.

## 8. Report

Parse the single stdout JSON object. Report `provider`, normalized `status`, pinned `task.id`, diagnostic Provider IDs, warnings, effective parameters, timing, and absolute `artifacts[].path` values when present.

| Result | Action |
| --- | --- |
| `wait_timeout` | Preserve the task and offer another bounded wait |
| `download_failed` | Preserve remote success and retry with `wait` |
| Completed without an artifact URL | Report sanitized diagnostics; never resubmit |
| Authentication, permission, or quota failure | Report the error; do not retry outside the CLI |
| Unknown POST acceptance | Stop; do not retry or fall back |

Exit codes: `2` request/configuration, `3` authentication/permission, `4` quota/rate limit, `5` Provider/task/response, `6` network/wait/download.
