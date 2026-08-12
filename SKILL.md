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

## 3. Plan — Creative Layer

The Skill owns the creative layer: turn the collected brief into a concrete storyboard document before any submission. Core never plans or generates storyboards. Follow [references/storyboard-methodology.md](references/storyboard-methodology.md) for every creative decision below.

The workflow follows a film production pipeline: **写剧本 → 执导筒 → 定后期**. Each phase produces one layer of the final storyboard document.

### 3a. 写剧本 — Story & Narrative

Define what story to tell. Follow §2 (剧本) of the methodology to pick the narrative skeleton (A/B/C), define the brief (subject × audience × goal), and lock the hook strategy. Select 1-3 key points per 15s.

For images, this step is simplified: determine the subject, style, and purpose of the image per §7 of the methodology.

### 3b. 执导筒 — Visual Direction & Shot Execution

Design how each shot looks and moves. Follow §3 (导演) of the methodology to fill all 12 columns of the shot table: shot type, perspective, camera movement, lighting, color, subject action, environment, audio, subtitles, and transitions. Lock the segment's default transition strategy in the header; override per-shot in the table. Every shot answers one visual question.

For images, this produces the visual composition: subject, scene, lighting, color, perspective, and composition per §7.

### 3c. 定后期 — Audio, Subtitles & Technical Parameters

Lock the post-production layer. Follow §4 (后期) of the methodology to design audio (all three layers per [references/audio-design.md](references/audio-design.md)), choose the subtitle route and style per §4.2, and define the constraint block + negative prompt per §5.3.

Also determine duration, frame mapping, and aspect ratio:
- Default to vertical 9:16 and map duration to Provider frames: `num_frames = round(duration_seconds * frame_rate)`, at most 441 and satisfying `8n + 1` (15s @ 24fps = 361). Express aspect ratio through `parameters.width/height`.
- Convert the plan into the capability form:

| Input plan | Capability |
| --- | --- |
| Prompt only | `text-to-video` |
| One reference image | `image-to-video` |
| Start and end frames | `keyframes-to-video` |

### Output

For videos, generate a storyboard document per §5 (分镜文档结构) of the methodology and save it next to the intended output as `<output filename stem>.storyboard.md`. The document content IS the `prompt` field — nothing is extracted or compressed. Review the complete example in [references/storyboard-example.md](references/storyboard-example.md) before writing the document. The document doubles as the delivery sidecar: Step 7 appends `Generation` metadata instead of writing a second file.

For images, produce one final prompt per §7 of the methodology and select `text-to-image` or `image-to-image`. Review the complete example in [references/image-prompt-example.md](references/image-prompt-example.md) before writing an image prompt with layered layout or typography. For `image-to-image`, state explicitly what to preserve and what to change. Pick the aspect ratio by intended use and put `size`/`ratio` in `parameters`.

Before submitting, verify the storyboard: all 12 columns filled, shot durations sum to the target, `★` ≥ 5 per 15s, transitions logically consistent (no conflict with camera movement), subtitle copy free of typos with brand names verbatim, and the frame count satisfies the `8n + 1` rule.

Build the public request defined in [core/provider-contract.md](core/provider-contract.md). Set `prompt` to the storyboard document content (per §5). The negative prompt is inside the `prompt` text, not in `parameters`. Keep other Provider-specific controls in `parameters` and verify them against the selected Provider reference.

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

Successful `generate` and `wait` operations save Artifact Sources through core. Use one readable `output.filename` of at most 120 characters; the same stem names the video and its sidecar. Core keeps task IDs out of local paths, applies the actual media extension, numbers multiple artifacts, avoids overwrites, and returns absolute paths.

A successful video delivers two adjacent files with the same basename:

```text
<name>.mp4            (core media artifact)
<name>.storyboard.md  (Step 3 creative document + Generation)
```

The sidecar is the storyboard document produced in Step 3, which already carries `Brief`, `Storyboard`, `Constraints & Negative Prompt`, and `Inputs`. The document content IS the prompt, so there is no separate `Final Prompt` section. After delivery, append a `Generation` section recording the Provider, model, pinned task ID, effective parameters, and warnings. Do not rewrite the creative content. Never include credentials, authorization headers, or raw external responses.

For a resumed task, reuse the original storyboard document. If the sidecar is unavailable, do not invent it; write `Unavailable from recovered task` in the document sections and preserve the available task and generation metadata. If appending `Generation` fails after video success, report the video path and the sidecar failure without regenerating the video.

Do not claim media integrity checks that core does not perform.

## 8. Report

Parse the single stdout JSON object. In every final conclusion report only evidence-backed facts:

- Generation: `provider`, `capability`, normalized `status`, pinned `task.id`, model when returned or selected, effective parameters, warnings, and timing.
- Every artifact: absolute path, media kind (`image` or `video`), detected format or MIME type, byte size, and available dimensions. For video also report available duration, aspect ratio, and frame rate.

Do not infer missing dimensions, duration, aspect ratio, frame rate, model, or MIME type from a filename or Provider default. Mark an unavailable field as `unknown` or omit it. For successful video work, report both absolute deliverable paths: the video and its `.storyboard.md` sidecar.

| Result | Action |
| --- | --- |
| `wait_timeout` | Preserve the task and offer another bounded wait |
| `download_failed` | Preserve remote success and retry with `wait` |
| Completed without an artifact URL | Report sanitized diagnostics; never resubmit |
| Authentication, permission, or quota failure | Report the error; do not retry outside the CLI |
| Unknown POST acceptance | Stop; do not retry or fall back |

Exit codes: `2` request/configuration, `3` authentication/permission, `4` quota/rate limit, `5` Provider/task/response, `6` network/wait/download.
