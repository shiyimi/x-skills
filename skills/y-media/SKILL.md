---
name: y-media
description: Use when generating or editing images, generating videos, using Agnes AI or another registered media Provider, spending a Provider's free media quota, checking or resuming an existing media task, or downloading generated media. 不适用于:纯文字 brief 无媒体产物 / 离线模型训练或微调场景。
---

# 媒体工作流

每个媒体任务都按以下固定工作流执行。

## 运行时

需要 Node.js 18 或更高版本，并定位相对于本文件的 `core/orchestrator.cjs`。阅读 [core/provider-contract.md](core/provider-contract.md) 了解请求/结果结构与错误。仅当需要某个 Provider 的凭证、模型与参数时才阅读其随附参考，如 [providers/agnes/api.md](providers/agnes/api.md)。

Agnes 优先解析 `AGNES_API_KEY`，其次读取 `~/.config/agnes/api_key`。永远不要把凭证、提示词或请求 JSON 放进参数、日志或对话输出中。

## 1. 分类（Classify）

| 工作类型 | 路由 |
| --- | --- |
| 已有任务（带原始 Provider 与任务 ID） | 跳到第 6 步 |
| 新图片或图片编辑 | 使用步骤 2-5 的图片分支 |
| 新视频 | 使用步骤 2-5 的视频分支 |

永远不要从不透明的任务 ID 推断 Provider。既有工作固定在其原始 Provider，绝不重新进入优先级选择。

### 1.1 模式检测（电商 vs 通用）

分类工作之后，**还要在收集细节之前**对模式进行分类。模式从 brief 内容中读取，而不是仅凭用户的措辞判断——Skill 应同时识别显式与隐式的电商信号，并按结果路由。

| brief 中的信号 | 模式 | 应用 |
| --- | --- | --- |
| 出现品牌/产品名 + 价格/优惠/CTA(产品名 + "99元"/"前1000名"/"点击购买"等) | **commerce（电商）** | §1.1 电商流程 |
| 出现美妆/服饰/家居/数码/母婴/食品 + 测评/开箱/演示/种草 | **commerce（电商）** | §1.1 电商流程 |
| 出现"我要卖货"/"带货"/"挂车"/"挂链接"/"投流"/"完播转化"/"主图"/"详情页" | **commerce（电商）** | §1.1 电商流程 |
| 仅出现 风景/动物/治愈/故事/品牌形象/情感/ASMR/概念演示(无具体产品) | **general（通用）** | 默认走 §2-§7 通用流程 |
| 模糊(出现"产品"但无价格/优惠/CTA 信号) | **ambiguous（模糊）** | **§2 收集阶段必问 1 轮**(R1 + 电商信号),按用户选择路由 |

**电商模式 × 工作类型的差异化强制项**:

| 强制项 | 视频电商 | 图片电商 | 说明 |
| --- | --- | --- | --- |
| 1. 路径决策 | §1.2 (G/E/H) | [references/image/image-methodology.md](references/image/image-methodology.md) §1.2 (G/E/H) | 概念相同,图片三选一 |
| 2. 场景模板 | [scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) 6 大品类 | 共享同一模板,取"产品摄影"相关列 | 图片与视频同源 |
| 3. 视听路线 | **默认含字幕** + 6 类字幕全用 | **默认含文字** + 4 件套(字体/色板/位置/描边) | 视频 6 类 → 图片 4 件套 |
| 4. 音频策略 | §4.0 商业目标定风格 3 步法 + §4.4 静音法则 | 不适用(单图无音频) | 跳过 |
| 5. R5 零错字铁律 | 品牌/型号/成分/SPF/价格/资质/限量 逐字 | 同(视频列) | R5 跨模块通用 |
| 6. 合规清单 | [scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) §9 | 同 §9(广告法/品牌/价格/资质/版权 BGM/母婴伦理;图片路径跳过"版权 BGM"那行) | 共享清单 |
| 7. 生成路径标注 | `<name>.video-brief.md` 表头 `生成路径: G | E | H` | `<name>.image-brief.md` 表头 `生成路径: G | E | H` | 侧车文件名不同 |

> 简言之:**图片电商 = 视频电商去掉音频/字幕相关,加上"文字版式 4 件套"**。两个路径共享 R5 铁律和合规清单(广告法部分)。

> **通用模式不强制这些动作**——仅在用户明确表达商业意图时才加载电商流程。这种"模式分流"避免了给风景/治愈类视频/海报强行塞价格字幕或品牌强制项,保持了 y-media 对非商业创作者的中性。

**为什么不在 description 写死电商触发**:电商 vs 通用的边界依赖 brief 内容(产品名 + 价格 vs 风景名 + 故事),description 阶段无 brief 信息可读,只能在运行时分类。

## 2. 收集（Collect）

复用已有信息;**至多问一轮**澄清问题,且只问会实质改变结果的项目(主体、产物类型、硬约束、输入资产)。不要循环——如果还需要第二轮,就把该槽位标上既定默认值并继续。

会实质改变结果的项目: 主体 / 产物类型 / 硬约束 / 输入资产。不值得追问的项目: 美学形容词偏好、次要运镜/色调、字幕文案微调——这些使用 §1 和 §3 的既定默认值,不再多问一轮。

**多段流程（动态上限）**: 单段上限是所选 Provider 的 `capability_limits[<capability>].maxSingleSegmentDuration`(通过 `capabilities` 读取,不硬编码)。当目标时长超出上限时,**在 §2 收集门槛处停下来问用户**,在 ① 拆分(交付 N 个独立文件,无菜谱)与 ② 合并(交付 N 段 + 侧车中的外部合并菜谱)之间二选一。不要自动决策、不要自动合并、也不要硬编码 `18s/441`。确认模板见 [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) §7.1。

所有新工作都收集: 目的、主体、风格、要求/禁止内容、输入资产、输出目录与可读文件名。图片还要确定尺寸与是否需要输入图片。视频还要确定时长、画幅比、节奏、镜头数、镜头语言、连续性、参考图与关键帧。

## 3. 规划（Plan）— 创意层

Skill 拥有创意层:在提交之前把收集到的 brief 变成具体的分镜文档。core 从不规划或生成分镜。创意决策一律遵循 [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md)。

图片:按 [references/image/image-methodology.md](references/image/image-methodology.md) §6 产出一条最终 prompt,并选择 `text-to-image` 或 `image-to-image`(分层布局用 `H` 多分区)。写带分层布局或文字的图片 prompt 之前,先看完整示例 [references/image/image-example.md](references/image/image-example.md)——它是 `<name>.image-brief.md` 侧车的颗粒度校准锚。`image-to-image` 要明确声明保留什么、改什么(元素级绑定)。按预期用途选择画幅比,把 `size`/`ratio` 放进 `parameters`。图片侧车是 `<输出文件名主干>.image-brief.md`(与视频的 `<name>.video-brief.md` 平级)。

视频:按方法论 §1-§3 与 §6 生成分镜文档,保存到目标输出旁的 `<输出文件名主干>.video-brief.md`。写文档前先看完整示例 [references/video/storyboard-example.md](references/video/storyboard-example.md)——它是颗粒度校准锚;没有填好示例的规则会产生模糊输出。文档携带 brief、分镜表与完整视频 prompt,同时充当交付侧车:第 7 步追加 `Generation` 元数据,而不是另写一个文件。

三个配套参考提供与规则配套的具体参数。填写任何列之前先读相关文件:
- [references/cinematography-reference.md](references/cinematography-reference.md) — 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值. 填写分镜表任何列时取精确术语.
- [references/influence-factors.md](references/influence-factors.md) — 视频生成影响因子 F1-F12(带权重评分卡):每个因子的有效填写阈值与失控修复. 判断字段要填多具体、修复生成失败时查.
- [references/video/t2v-model-capability.md](references/video/t2v-model-capability.md) — t2v 模型能力边界 M1-M6 + 展示层vs执行层对照表 + 时间表达方式. **写任何 prompt 之前必读** — 决定哪些参数进 prompt(语义层)、哪些移出(数值/音频).
- [references/video/prompt-structure-formula.md](references/video/prompt-structure-formula.md) — prompt 写作骨架:八要素+五定法+角色四层+场景三层+14镜头库+避坑三陷阱+5铁律. 拼装 prompt 块时查.
- [references/video/cinematic-shot-library.md](references/video/cinematic-shot-library.md) — 14 镜头库(6 运镜组合+4 高级术语+4 构图技法)+ 镜头选择决策表. 选择运镜时查.
- [references/video/granularity-scale.md](references/video/granularity-scale.md) — 颗粒度标尺:展示层/执行层分工 + 12 字段抽象→具体对照. 不确定字段该多具体时查.
- [references/video/pitfalls-and-iron-rules.md](references/video/pitfalls-and-iron-rules.md) — 避坑三陷阱(物理互斥/静止动词/光影缺失)+ 5 铁律. 提交前做最终自检.
- [references/video/negative-prompt-methodology.md](references/video/negative-prompt-methodology.md) — 视频路径 `negative_prompt` 字段方法论:与 Hard Constraints 的分工、何时必填、内容来源、提交前自检. **当 work = 视频且侧车有 Negative Prompt 区块时必读**;图片路径不适用.
- [references/video/storyboard-reality-calculator.md](references/video/storyboard-reality-calculator.md) — 镜头现实性决策 + Node 帧数校验 + Provider 能力速查. 提交前校验帧数与单段/多段可行性.
- [references/video/templates/templates-3-sets.md](references/video/templates/templates-3-sets.md) + [references/video/templates/scene-quick-match.md](references/video/templates/scene-quick-match.md) — 3 套即用模板 + 场景速配表 + 主体描述速查 + 钩子速查. 简单需求或快速场景路由时查.
- [references/video/scenes/scene-nature-animal.md](references/video/scenes/scene-nature-animal.md) / [scene-lifestyle-aesthetic.md](references/video/scenes/scene-lifestyle-aesthetic.md) / [scene-portrait-fashion.md](references/video/scenes/scene-portrait-fashion.md) / [scene-food-asmr.md](references/video/scenes/scene-food-asmr.md) — 4 类场景参考(自然/生活/时尚/美食)的光影/音频/骨架/7秒高潮点模板. 主体匹配已知类型时查.
- [references/video/scenes/scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) — **电商模式专属** 6 大品类(美妆/服饰/家居/数码/母婴/通用)的产品演示模板;含光影/音频/高潮点/反模式/合规清单/R5 零错字铁律. **当 mode = 电商(§1.1)时必读**;否则跳过.
- [references/image/image-methodology.md](references/image/image-methodology.md) — **图片路径方法论主文件**(平级于 storyboard-methodology.md). 完整 R1-R5 单帧降维 + 路径判定(G/E/H) + 视觉骨架 + 视觉规范表 + 文字版式 + 七维度 prompt + 系列图一致性 + i2v 桥接 + 反模式. **当 work = 图片时必读**.
- [references/image/image-example.md](references/image/image-example.md) — image-brief.md 完整示例(3 套:G 路径产品图 / H 路径海报拼贴 / E 骨架 Logo)+ 反例对照表. 图片侧车的颗粒度校准锚.

把规划转换为能力支持的形态:

| 输入规划 | 能力 |
| --- | --- |
| 仅 prompt | `text-to-video` |
| 一张参考图 | `image-to-video` |
| 起止帧 | `keyframes-to-video` |

默认竖屏 9:16,把时长映射为 Provider 帧数: `num_frames = round(duration_seconds * frame_rate)`。硬上限是 `capability_limits[<capability>].maxFrames` 与 `capability_limits[<capability>].maxSingleSegmentDuration`(通过 `capabilities` 读取,不要硬编码 18s/441)。两者都必须满足 `frameCountRule`(如 8n+1)。**在任何 prompt 或分镜中不要硬编码 18s/441** — 不同 Provider 上限不同。超过上限的时长,规划 N 段、各自独立提交,然后问用户是否合并。见 [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) §7。画幅比通过 `parameters.width/height` 表达。

提交前校验分镜:11 列全部填满、镜头时长总和等于目标、每 15s `★` ≥ 5、字幕文案零错字且品牌名逐字、帧数满足 `8n + 1` 规则。

按 [core/provider-contract.md](core/provider-contract.md) 构建公共请求。Provider 专属控制放在 `parameters` 中,并与所选 Provider 参考核对。

## 4. 路由（Route）

新工作之前先运行 `capabilities`。core 按能力、配置与详细支持过滤启用的注册项,然后选择唯一优先级最低的合格 Provider。除非用户显式选择了某个 Provider,否则省略 `provider`。

额度视为未知,除非 Provider 返回权威信息。不要编造免费额度,也不要添加投机性的额度调用。只有权威的提交前拒绝(带 `accepted: false`)之后才允许回退。

## 5. 提交（Submit）

### 5.0 提交前确认门（视频任务）

视频生成成本远高于图片，提交前先征询用户确认，避免白烧额度。构建好最终 prompt 后、调用 `generateMedia` 之前，用 AskUserQuestion 展示：

- 最终 prompt 摘要（主体 / 场景 / 动作 / 镜头语言 / 约束）
- 时长与帧数（含 `frameCountRule` 合规性）、画幅比
- 所选 Provider 与模型

用户选择：
- **确认提交** → 继续 §5.1；
- **修改** → 按反馈调整 prompt 后再次征询（至多 2 轮，仍不一致则以用户最终指示为准）；
- 用户事先已明确"直接生成 / 不用确认" → 跳过本门。

图片任务不强制确认门（成本低），但电商模式（§1.1）或 `image-to-image` 涉及原图修改时，建议同样展示 prompt 摘要。

> 本门与 §2 收集阶段"至多问一轮"相互独立：§2 澄清 brief 缺失项，5.0 确认最终 prompt 成品。

### 5.1 提交

默认使用 `generateMedia`;只有请求"提交不等待"时才使用 `createMedia`。只提交一次。在接受变为 true 或未知之后,绝不重试生成 POST,也不切换 Provider。

## 6. 等待或恢复（Wait Or Resume）

`status` 与 `wait` 需要确切的原始 `provider`、`capability` 与 `task.id`。它们绝不按优先级路由。

绝不用 `generate` 或 `create` 恢复工作。`wait_timeout` 时,保留 Provider 与任务 ID;远端任务仍然活跃。只有被要求时才继续另一次有界 `wait`。远端成功后的 `download_failed`,对同一任务使用 `wait` 重试状态与下载,不要重新创建媒体。

## 7. 保存（Save）

成功的 `generate` 与 `wait` 操作通过 core 保存产物来源（Artifact Sources）。使用一个可读的 `output.filename`(至多 120 字符);同一个主干命名视频与其侧车。core 保证任务 ID 不进入本地路径、应用真实媒体扩展名、多产物自动编号、避免覆盖,并返回绝对路径。

一次成功的视频交付两个同 basename 的相邻文件:

```text
<name>.mp4            (core 媒体产物)
<name>.video-brief.md  (第 3 步创意文档 + Generation)
```

一次成功的图片交付两个同 basename 的相邻文件:

```text
<name>.<ext>          (core 媒体产物, .png/.jpg/.webp 依 Provider)
<name>.image-brief.md (第 3 步创意文档 + Generation)
```

侧车(video-brief.md 或 image-brief.md)是第 3 步产生的创意文档,已携带 `Brief`、视觉规范表(视频为 `Storyboard` / 图片为 `视觉规范表`)、`Final Prompt`、`Negative Prompt` 与 `Inputs`。交付后追加 `Generation` 区块,记录 Provider、模型、固定的任务 ID、生效参数与警告。不要重写创意内容。绝不要包含凭证、授权头或原始外部响应。

恢复的任务复用原始分镜与 prompt。如果侧车不可用,不要凭空捏造;在这些区块写 `Unavailable from recovered task`,并保留可用的任务与生成元数据。如果视频成功后追加 `Generation` 失败,报告视频路径与侧车失败,不要重新生成视频。

不要声称 core 未执行的媒体完整性检查。

### 7.1 交付前质检（纯净度检测）

成功保存产物后、写入最终报告前，读图/读帧核对每个产物：

- 无 "AI 生成" / "AI generated" 字样
- 无水印、平台签名、作者签名
- 无叠加文字（品牌文字类场景除外——依 brief 确认是否为预期内容）

发现残留：

- **图片**：成本可接受时重新生成（加强 Hard Constraints 或改换表述）；重生成仍不过则如实报告残留，绝不直接交付。
- **视频**：如实报告残留，不自动重生成（视频重生成成本高）。

本检测是 Skill 层质检（配合 §3 的 "No text, no logo, no watermark" 约束焊死），不改变 core 的产物行为。

## 8. 报告（Report）

每个最终结论报告只呈现有证据支撑的事实:

- 生成信息: `provider`、`capability`、规范化 `status`、固定的 `task.id`、返回或选中的 model、生效参数、警告与耗时。
- 每个产物: 绝对路径、媒体类型(`image` 或 `video`)、检测到的格式或 MIME 类型、字节大小与可用尺寸。视频还要报告可用的时长、画幅比与帧率。

不要从文件名或 Provider 默认值推断缺失的尺寸、时长、画幅比、帧率、model 或 MIME 类型。不可用字段标记为 `unknown` 或省略。视频成功时,报告两个绝对交付路径:视频与其 `.video-brief.md` 侧车。

| 结果 | 动作 |
| --- | --- |
| `wait_timeout` | 保留任务并提供另一次有界等待 |
| `download_failed` | 保留远端成功并用 `wait` 重试 |
| 完成但无产物 URL | 报告脱敏诊断;绝不重提 |
| 认证、权限或额度失败 | 报告错误;不重试 |
| 未知的 POST 接受状态 | 停止;不重试也不回退 |
