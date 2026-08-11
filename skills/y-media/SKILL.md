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

The Skill owns the creative layer: turn the collected brief into a concrete storyboard document before any submission. Core never plans or generates storyboards. Follow [references/storyboard/storyboard-methodology.md](references/storyboard/storyboard-methodology.md) for every creative decision below.

For images, produce one final prompt per §8 of the methodology and select `text-to-image` or `image-to-image`. Review the complete example in [references/image-prompt-example.md](references/image-prompt-example.md) before writing an image prompt with layered layout or typography. For `image-to-image`, state explicitly what to preserve and what to change. Pick the aspect ratio by intended use and put `size`/`ratio` in `parameters`.

For videos, generate a storyboard document per §1-§3 and §6 of the methodology and save it next to the intended output as `<output filename stem>.storyboard.md`. Review the complete example in [references/storyboard/storyboard-example.md](references/storyboard/storyboard-example.md) before writing the document — it is the granularity calibration anchor; rules without a filled example produce vague output. The document carries the brief, the shot table, and the full video prompt, and it doubles as the delivery sidecar: Step 7 appends `Generation` metadata instead of writing a second file.

Three companion references supply concrete parameters alongside the methodology rules. Read the relevant one before filling any column:
- [references/cinematography-reference.md](references/cinematography-reference.md) — 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值. Consult when filling any shot-table column to pick the exact term.
- [references/influence-factors.md](references/influence-factors.md) — 视频生成影响因子 F1-F12(带权重评分卡):每个因子的有效填写阈值与失控修复. Consult to decide how具体 a field must be and to fix generation failures.
- [references/t2v-model-capability.md](references/t2v-model-capability.md) — t2v 模型能力边界 M1-M6 + 展示层vs执行层对照表 + 时间表达方式. **Read before writing any prompt** — decides which parameters enter the prompt (semantic) vs which leave (numeric/audio).
- [references/storyboard/prompt-structure-formula.md](references/storyboard/prompt-structure-formula.md) — prompt 写作骨架:八要素+五定法+角色四层+场景三层+14镜头库+避坑三陷阱+5铁律. Consult when assembling the prompt block.
- [references/storyboard/cinematic-shot-library.md](references/storyboard/cinematic-shot-library.md) — 14 镜头库(6 运镜组合+4 高级术语+4 构图技法)+ 镜头选择决策表. Consult when picking camera moves.
- [references/storyboard/granularity-scale.md](references/storyboard/granularity-scale.md) — 颗粒度标尺:展示层/执行层分工 + 12 字段抽象→具体对照. Consult when unsure how具体 a column should be.
- [references/storyboard/pitfalls-and-iron-rules.md](references/storyboard/pitfalls-and-iron-rules.md) — 避坑三陷阱(物理互斥/静止动词/光影缺失)+ 5 铁律. Run as final self-check before submission.
- [references/storyboard/storyboard-reality-calculator.md](references/storyboard/storyboard-reality-calculator.md) — 镜头现实性决策 + Python 帧数校验 + Provider 能力速查. Run before submission to verify frame count and single-shot vs multi-segment feasibility.
- [references/storyboard/templates/templates-3-sets.md](references/storyboard/templates/templates-3-sets.md) + [references/storyboard/templates/scene-quick-match.md](references/storyboard/templates/scene-quick-match.md) — 3 套即用模板 + 场景速配表 + 主体描述速查 + 钩子速查. Consult for simple needs or quick scene routing.
- [references/storyboard/scenes/scene-nature-animal.md](references/storyboard/scenes/scene-nature-animal.md) / [scene-lifestyle-aesthetic.md](references/storyboard/scenes/scene-lifestyle-aesthetic.md) / [scene-portrait-fashion.md](references/storyboard/scenes/scene-portrait-fashion.md) / [scene-food-asmr.md](references/storyboard/scenes/scene-food-asmr.md) — 4 类场景参考(自然/生活/时尚/美食)的光影/音频/骨架/高潮点模板. Consult when the subject matches a known type.

Convert the plan into the form supported by the capability:

| Input plan | Capability |
| --- | --- |
| Prompt only | `text-to-video` |
| One reference image | `image-to-video` |
| Start and end frames | `keyframes-to-video` |

Default to vertical 9:16 and map duration to Provider frames: `num_frames = round(duration_seconds * frame_rate)`, at most 441 and satisfying `8n + 1` (15s @ 24fps = 361). Express aspect ratio through `parameters.width/height`.

Before submitting, verify the storyboard: all 11 columns filled, shot durations sum to the target, `★` ≥ 5 per 15s, subtitle copy free of typos with brand names verbatim, and the frame count satisfies the `8n + 1` rule.

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

Successful `generate` and `wait` operations save Artifact Sources through core. Use one readable `output.filename` of at most 120 characters; the same stem names the video and its sidecar. Core keeps task IDs out of local paths, applies the actual media extension, numbers multiple artifacts, avoids overwrites, and returns absolute paths.

A successful video delivers two adjacent files with the same basename:

```text
<name>.mp4            (core media artifact)
<name>.storyboard.md  (Step 3 creative document + Generation)
```

The sidecar is the storyboard document produced in Step 3, which already carries `Brief`, `Storyboard`, `Final Prompt`, `Negative Prompt`, and `Inputs`. After delivery, append a `Generation` section recording the Provider, model, pinned task ID, effective parameters, and warnings. Do not rewrite the creative content. Never include credentials, authorization headers, or raw external responses.

For a resumed task, reuse the original storyboard and prompts. If the sidecar is unavailable, do not invent them; write `Unavailable from recovered task` in those sections and preserve the available task and generation metadata. If appending `Generation` fails after video success, report the video path and the sidecar failure without regenerating the video.

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
