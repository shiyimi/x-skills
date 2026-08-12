---
name: y-media
description: Use when generating or editing images, generating videos, using Agnes AI or another registered media Provider, spending a Provider's free media quota, checking or resuming an existing media task, or downloading generated media. 不适用于:纯文字 brief 无媒体产物 / 离线模型训练或微调场景。
---

# Media Workflow

Follow the fixed workflow below for every media task.

## Runtime

Require Node.js 18 or newer and locate `core/media.cjs` relative to this file. Read [core/provider-contract.md](core/provider-contract.md) for request/result shapes and errors. Read a Provider's colocated reference, such as [providers/agnes/api.md](providers/agnes/api.md), only for its credentials, models, and parameters.

Agnes resolves `AGNES_API_KEY` before `~/.config/agnes/api_key`. Never put credentials, prompts, or request JSON in arguments, logs, or chat output.

## 1. Classify

| Work | Route |
| --- | --- |
| Existing task with original Provider and task ID | Skip to step 6 |
| New image or image edit | Use the image branch in steps 2-5 |
| New video | Use the video branch in steps 2-5 |

Never infer a Provider from an opaque task ID. Existing work stays pinned to its original Provider and never re-enters priority selection.

### 1.1 Mode Detection (commerce vs general)

After classifying the work, **also classify the mode** before collecting details. The mode is read from the brief, not from the user's wording alone — the Skill should detect both explicit and implicit commerce signals and route accordingly.

| Signal in brief | Mode | Apply |
| --- | --- | --- |
| 出现品牌/产品名 + 价格/优惠/CTA(产品名 + "99元"/"前1000名"/"点击购买"等) | **commerce** | §1.1 commerce flow |
| 出现美妆/服饰/家居/数码/母婴/食品 + 测评/开箱/演示/种草 | **commerce** | §1.1 commerce flow |
| 出现"我要卖货"/"带货"/"挂车"/"挂链接"/"投流"/"完播转化"/"主图"/"详情页" | **commerce** | §1.1 commerce flow |
| 仅出现 风景/动物/治愈/故事/品牌形象/情感/ASMR/概念演示(无具体产品) | **general** | 默认 §2-§7 通用流程 |
| 模糊(出现"产品"但无价格/优惠/CTA 信号) | **ambiguous** | **§2 Collect 阶段必问 1 轮**(R1 + commerce 信号),按用户选择路由 |

**commerce mode × work 类型的差异化强制项**:

| 强制项 | video commerce | image commerce | 说明 |
| --- | --- | --- | --- |
| 1. 路径决策 | §1.2 (G/E/H) | [references/image/image-methodology.md](references/image/image-methodology.md) §1.2 (G/E/H) | 概念相同,image 三选一 |
| 2. 场景模板 | [scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) 6 大品类 | 共享同一模板,取"产品摄影"相关列 | image 与 video 同源 |
| 3. 视听路线 | **默认含字幕** + 6 类字幕全用 | **默认含文字** + 4 件套(字体/色板/位置/描边) | video 6 类 → image 4 件套 |
| 4. 音频策略 | §4.0 商业目标定风格 3 步法 + §4.4 静音法则 | 不适用(单图无音频) | 跳过 |
| 5. R5 零错字铁律 | 品牌/型号/成分/SPF/价格/资质/限量 逐字 | 同(video 列)| R5 跨模块通用 |
| 6. 合规清单 | [scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) §9 | 同 §9(广告法/品牌/价格/资质/版权 BGM/母婴伦理;image 路径跳过"版权 BGM"那行) | 共享清单 |
| 7. 生成路径标注 | `<name>.video-brief.md` 表头 `生成路径: G | E | H` | `<name>.image-brief.md` 表头 `生成路径: G | E | H` | sidecar 文件名不同 |

> 简言之:**image commerce = video commerce 去掉音频/字幕相关,加上"文字版式 4 件套"**。两个路径共享 R5 铁律和合规清单(广告法部分)。

> **general mode 不强制这些动作**——仅在用户明确表达商业意图时才加载 commerce flow。这种"模式分流"避免了给风景/治愈类视频/海报强行塞价格字幕或品牌强制项,保持了 y-media 对非商业创作者的中性。

**为什么不在 description 写死 commerce 触发**:commerce vs general 的边界依赖 brief 内容(产品名 + 价格 vs 风景名 + 故事),description 阶段无 brief 信息可读,只能在运行时分类。

## 2. Collect

Reuse supplied information; ask **at most one round** of clarifying questions and only for items that materially change the result (subject, output kind, hard constraints, input assets). Do not loop — if a second round would be needed, mark the slot with a stated default and proceed.

Items that materially change the result: 主体 / 产物类型 / 硬约束 / 输入资产. Items that do NOT justify a follow-up: 美学形容词偏好、次要运镜/色调、字幕文案微调 — these go to the stated defaults in §1 and §3, not another round of questions.

**Multi-segment flow (dynamic cap)**: the single-segment cap is the selected Provider's `capability_limits[<capability>].maxSingleSegmentDuration` (read via `capabilities`, not hardcoded). When the target exceeds it, **stop at the §2 Collect gate and ask the user** to choose between ① split (deliver N segments as separate files, no recipe) and ② merge (deliver N segments + external merge recipe in the sidecar). Do not auto-decide, do not auto-merge, and do not hardcode `18s/441`. See [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) §7.1 for the confirmation template.

For all new work collect purpose, subject, style, required/forbidden content, input assets, output directory, and readable filename. For images also determine dimensions and whether an input image is required. For videos also determine duration, aspect ratio, pacing, shot count, camera language, continuity, reference images, and keyframes.

## 3. Plan — Creative Layer

The Skill owns the creative layer: turn the collected brief into a concrete storyboard document before any submission. Core never plans or generates storyboards. Follow [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) for every creative decision below.

For images, produce one final prompt per §6 of [references/image/image-methodology.md](references/image/image-methodology.md) and select `text-to-image` or `image-to-image` (or `H` multi-zone for layered layouts). Review the complete example in [references/image/image-example.md](references/image/image-example.md) before writing an image prompt with layered layout or typography — it is the granularity calibration anchor for the `<name>.image-brief.md` sidecar. For `image-to-image`, state explicitly what to preserve and what to change (element-level binding). Pick the aspect ratio by intended use and put `size`/`ratio` in `parameters`. The image sidecar is `<output filename stem>.image-brief.md` (parallel to `<name>.video-brief.md` for video).

For videos, generate a storyboard document per §1-§3 and §6 of the methodology and save it next to the intended output as `<output filename stem>.video-brief.md`. Review the complete example in [references/video/storyboard-example.md](references/video/storyboard-example.md) before writing the document — it is the granularity calibration anchor; rules without a filled example produce vague output. The document carries the brief, the shot table, and the full video prompt, and it doubles as the delivery sidecar: Step 7 appends `Generation` metadata instead of writing a second file.

Three companion references supply concrete parameters alongside the methodology rules. Read the relevant one before filling any column:
- [references/cinematography-reference.md](references/cinematography-reference.md) — 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值. Consult when filling any shot-table column to pick the exact term.
- [references/influence-factors.md](references/influence-factors.md) — 视频生成影响因子 F1-F12(带权重评分卡):每个因子的有效填写阈值与失控修复. Consult to decide how具体 a field must be and to fix generation failures.
- [references/video/t2v-model-capability.md](references/video/t2v-model-capability.md) — t2v 模型能力边界 M1-M6 + 展示层vs执行层对照表 + 时间表达方式. **Read before writing any prompt** — decides which parameters enter the prompt (semantic) vs which leave (numeric/audio).
- [references/video/prompt-structure-formula.md](references/video/prompt-structure-formula.md) — prompt 写作骨架:八要素+五定法+角色四层+场景三层+14镜头库+避坑三陷阱+5铁律. Consult when assembling the prompt block.
- [references/video/cinematic-shot-library.md](references/video/cinematic-shot-library.md) — 14 镜头库(6 运镜组合+4 高级术语+4 构图技法)+ 镜头选择决策表. Consult when picking camera moves.
- [references/video/granularity-scale.md](references/video/granularity-scale.md) — 颗粒度标尺:展示层/执行层分工 + 12 字段抽象→具体对照. Consult when unsure how具体 a column should be.
- [references/video/pitfalls-and-iron-rules.md](references/video/pitfalls-and-iron-rules.md) — 避坑三陷阱(物理互斥/静止动词/光影缺失)+ 5 铁律. Run as final self-check before submission.
- [references/video/negative-prompt-methodology.md](references/video/negative-prompt-methodology.md) — 视频路径 `negative_prompt` 字段方法论:与 Hard Constraints 的分工、何时必填、内容来源、提交前自检. **mandatory when work = video and the sidecar has a Negative Prompt section**;image 路径不适用.
- [references/video/storyboard-reality-calculator.md](references/video/storyboard-reality-calculator.md) — 镜头现实性决策 + Python 帧数校验 + Provider 能力速查. Run before submission to verify frame count and single-shot vs multi-segment feasibility.
- [references/video/templates/templates-3-sets.md](references/video/templates/templates-3-sets.md) + [references/video/templates/scene-quick-match.md](references/video/templates/scene-quick-match.md) — 3 套即用模板 + 场景速配表 + 主体描述速查 + 钩子速查. Consult for simple needs or quick scene routing.
- [references/video/scenes/scene-nature-animal.md](references/video/scenes/scene-nature-animal.md) / [scene-lifestyle-aesthetic.md](references/video/scenes/scene-lifestyle-aesthetic.md) / [scene-portrait-fashion.md](references/video/scenes/scene-portrait-fashion.md) / [scene-food-asmr.md](references/video/scenes/scene-food-asmr.md) — 4 类场景参考(自然/生活/时尚/美食)的光影/音频/骨架/高潮点模板. Consult when the subject matches a known type.
- [references/video/scenes/scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) — **commerce mode 专属** 6 大品类(美妆/服饰/家居/数码/母婴/通用)的产品演示模板;含光影/音频/高潮点/反模式/合规清单/R5 零错字铁律. **mandatory when mode = commerce (§1.1)**;otherwise skip.
- [references/image/image-methodology.md](references/image/image-methodology.md) — **image 路径方法论主文件**(平级于 storyboard-methodology.md). 完整 R1-R5 单帧降维 + 路径判定(G/E/H) + 视觉骨架 + 视觉规范表 + 文字版式 + 七维度 prompt + 系列图一致性 + i2v 桥接 + 反模式. **mandatory when work = image**.
- [references/image/image-example.md](references/image/image-example.md) — image-brief.md 完整示例(3 套:G 路径产品图 / H 路径海报拼贴 / E 骨架 Logo)+ 反例对照表. Granularity calibration anchor for image sidecars.

Convert the plan into the form supported by the capability:

| Input plan | Capability |
| --- | --- |
| Prompt only | `text-to-video` |
| One reference image | `image-to-video` |
| Start and end frames | `keyframes-to-video` |

Default to vertical 9:16 and map duration to Provider frames: `num_frames = round(duration_seconds * frame_rate)`. The hard caps are `capability_limits[<capability>].maxFrames` and `capability_limits[<capability>].maxSingleSegmentDuration` (read via `capabilities`, do not hardcode 18s/441). Both must satisfy the `frameCountRule` (e.g. 8n+1). **Do not hardcode 18s/441** in any prompt or storyboard — different Providers have different caps. For durations that exceed the cap, plan N segments, submit each independently, then ask the user about merging. See [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) §7. Express aspect ratio through `parameters.width/height`.

Before submitting, verify the storyboard: all 11 columns filled, shot durations sum to the target, `★` ≥ 5 per 15s, subtitle copy free of typos with brand names verbatim, and the frame count satisfies the `8n + 1` rule.

Build the public request defined in [core/provider-contract.md](core/provider-contract.md). Keep Provider-specific controls in `parameters` and verify them against the selected Provider reference.

## 4. Route

Run `capabilities` before new work. Core filters enabled registrations by capability, configuration, and detailed support, then selects the eligible Provider with the lowest unique priority. Omit `provider` unless the user explicitly selected one.

Treat quota as unknown unless the Provider returns authoritative information. Do not invent free usage or add speculative quota calls. Fallback is allowed only after an authoritative pre-acceptance rejection with `accepted: false`.

## 5. Submit

Use `generateMedia` by default and `createMedia` only when submission without waiting is requested. Submit exactly once. Never retry a generation POST or switch Provider after acceptance becomes true or unknown.

## 6. Wait Or Resume

`status` and `wait` require the exact original `provider`, `capability`, and `task.id`. They never route by priority.

Never use `generate` or `create` to resume work. On `wait_timeout`, retain the Provider and task ID; the remote task remains active. Continue with another bounded `wait` only when requested. On `download_failed` after remote success, use `wait` on the same task to retry status and download without recreating media.

## 7. Save

Successful `generate` and `wait` operations save Artifact Sources through core. Use one readable `output.filename` of at most 120 characters; the same stem names the video and its sidecar. Core keeps task IDs out of local paths, applies the actual media extension, numbers multiple artifacts, avoids overwrites, and returns absolute paths.

A successful video delivers two adjacent files with the same basename:

```text
<name>.mp4            (core media artifact)
<name>.video-brief.md  (Step 3 creative document + Generation)
```

A successful image delivers two adjacent files with the same basename:

```text
<name>.<ext>          (core media artifact, .png/.jpg/.webp per Provider)
<name>.image-brief.md (Step 3 creative document + Generation)
```

The sidecar (video-brief.md for video, image-brief.md for image) is the creative document produced in Step 3, which already carries `Brief`, the visual spec table (`Storyboard` for video / `视觉规范表` for image), `Final Prompt`, `Negative Prompt`, and `Inputs`. After delivery, append a `Generation` section recording the Provider, model, pinned task ID, effective parameters, and warnings. Do not rewrite the creative content. Never include credentials, authorization headers, or raw external responses.

For a resumed task, reuse the original storyboard and prompts. If the sidecar is unavailable, do not invent them; write `Unavailable from recovered task` in those sections and preserve the available task and generation metadata. If appending `Generation` fails after video success, report the video path and the sidecar failure without regenerating the video.

Do not claim media integrity checks that core does not perform.

## 8. Report

In every final conclusion report only evidence-backed facts:

- Generation: `provider`, `capability`, normalized `status`, pinned `task.id`, model when returned or selected, effective parameters, warnings, and timing.
- Every artifact: absolute path, media kind (`image` or `video`), detected format or MIME type, byte size, and available dimensions. For video also report available duration, aspect ratio, and frame rate.

Do not infer missing dimensions, duration, aspect ratio, frame rate, model, or MIME type from a filename or Provider default. Mark an unavailable field as `unknown` or omit it. For successful video work, report both absolute deliverable paths: the video and its `.video-brief.md` sidecar.

| Result | Action |
| --- | --- |
| `wait_timeout` | Preserve the task and offer another bounded wait |
| `download_failed` | Preserve remote success and retry with `wait` |
| Completed without an artifact URL | Report sanitized diagnostics; never resubmit |
| Authentication, permission, or quota failure | Report the error; do not retry |
| Unknown POST acceptance | Stop; do not retry or fall back |
