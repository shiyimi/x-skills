---
name: y-media
description: Use when generating or editing images, generating videos, using Agnes AI or another registered media Provider, spending a Provider's free media quota, checking or resuming an existing media task, or downloading generated media. 不适用于:纯文字 brief 无媒体产物 / 离线模型训练或微调场景。
---

# 媒体工作流

每个媒体任务都按以下固定工作流执行。**先读 §0 五条核心原则,再按 §1-§5 推进。**

---

## §0 五条核心原则(R1-R5)

| #      | 原则                                                                                                                        | 展开                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **R1** | **一次判定,一路走到底**:开头判定"纯剪辑"还是"纯生成",判定后尽量不切换(生→剪→生 = 主体漂移 + 成本翻倍)                       | §1.1                                                                                                        |
| **R2** | **故事驱动,而非清单罗列**:把参数装进骨架 A/B/C,以叙事方式交付;1 段 ≤ 1-3 个关键点                                           | §3 / [storyboard.md §4](references/video/storyboard.md)                                                     |
| **R3** | **视听双轨**:① 字幕可选(若画面承载 70% 信息,质感/ASMR/情感可省);若使用,锁定一套风格;② 三层音频(人声·环境音·BGM)必须全部设计 | [subtitle-spec.md](references/video/subtitle-spec.md) + [audio-design.md](references/video/audio-design.md) |
| **R4** | **7 秒前回收钩子**:视觉爆发或情绪爆发,二选一;7 秒后完播率下降                                                               | [storyboard.md §4.5](references/video/storyboard.md)                                                        |
| **R5** | **零错字、品牌名逐字**:品牌名/型号/成分名逐字核对;若用户给了官方拼写,必须原样使用                                           | [subtitle-spec.md §7](references/video/subtitle-spec.md)                                                    |

---

## §1 运行时与分类

### 1.0 运行时

需要 Node.js 18 或更高版本,并定位相对于本文件的 `core/orchestrator.cjs`。阅读 [core/provider-contract.md](core/provider-contract.md) 了解请求/结果结构与错误。仅当需要某个 Provider 的凭证、模型与参数时才阅读其随附参考,如 [providers/agnes/api.md](providers/agnes/api.md)。

Agnes 优先解析 `AGNES_API_KEY`,其次读取 `~/.config/agnes/api_key`。永远不要把凭证、提示词或请求 JSON 放进参数、日志或对话输出中。

### 1.1 路径判定(R1)

| 工作类型                            | 路由             |
| ----------------------------------- | ---------------- |
| 已有任务(带原始 Provider 与任务 ID) | 跳到 §4          |
| 新图片或图片编辑                    | §2-§5 的图片分支 |
| 新视频                              | §2-§5 的视频分支 |

**视频路径判定一次,后续不再切换(R1)**:

| 情况                                          | 路径         | 动作                |
| --------------------------------------------- | ------------ | ------------------- |
| 已有素材,只需重排+字幕+BGM                    | 纯剪辑       | ffmpeg/剪映一次剪完 |
| 素材来自不同拍摄源需拼接                      | 纯剪辑       | ffmpeg 无缝拼接     |
| 需要 AI 新画面(表演/产品动态/场景/静图动态化) | 纯生成(默认) | 视频模型 + 字幕直出 |

**生成路径"一次到位"三条(R2)**:

1. 单段时长顶格 —— 目标 15s 就 `duration=15`,不拆 3×5s。
2. 一条 prompt 多镜头 —— 7-12 镜写进同一条,用 `Shot 1: … Shot 2: …`。
3. 字幕写进 prompt —— 见 [subtitle-spec.md](references/video/subtitle-spec.md)。

**时长-分段**:

- ≤15s → 按 R2 一次到位。
- 16-22s → 先压到 15s,压不下再拆 15+(X-15)。
- \>22s → 顶格拆(15+15+…),避免均分。段间一致性靠:同一参考图作主体锚点、后段以前段末帧作首帧、美学母体(配色/材质/光比/风格词)照抄。

永远不要从不透明的任务 ID 推断 Provider。既有工作固定在其原始 Provider,绝不重新进入优先级选择。

### 1.2 模式检测(电商 vs 通用)

分类工作之后,**还要在收集细节之前**对模式进行分类。模式从 brief 内容中读取,而不是仅凭用户的措辞判断——Skill 应同时识别显式与隐式的电商信号,并按结果路由。

| brief 中的信号                                                           | 模式                | 应用                                    |
| ------------------------------------------------------------------------ | ------------------- | --------------------------------------- |
| 出现品牌/产品名 + 价格/优惠/CTA(产品名 + "99元"/"前1000名"/"点击购买"等) | **commerce(电商)**  | 电商流程                                |
| 出现美妆/服饰/家居/数码/母婴/食品 + 测评/开箱/演示/种草                  | **commerce(电商)**  | 电商流程                                |
| 出现"我要卖货"/"带货"/"挂车"/"挂链接"/"投流"/"完播转化"/"主图"/"详情页"  | **commerce(电商)**  | 电商流程                                |
| 仅出现 风景/动物/治愈/故事/品牌形象/情感/ASMR/概念演示(无具体产品)       | **general(通用)**   | 默认通用流程                            |
| 模糊(出现"产品"但无价格/优惠/CTA 信号)                                   | **ambiguous(模糊)** | **§2 收集阶段必问 1 轮**,按用户选择路由 |

**电商模式 × 工作类型的差异化强制项**:

| 强制项           | 视频电商                                                                                       | 图片电商                                                                            | 说明                    |
| ---------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| 1. 路径决策      | §1.1 (剪辑/生成/混合)                                                                          | [references/image/image-methodology.md](references/image/image-methodology.md) §1.1 | 概念相同,各自走对应路径 |
| 2. 场景模板      | [scenes/scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) 6 大品类 | 共享同一模板,取"产品摄影"相关列                                                     | 图片与视频同源          |
| 3. 视听路线      | **默认含字幕** + 6 类字幕全用                                                                  | **默认含文字** + 4 件套(字体/色板/位置/描边)                                        | 视频 6 类 → 图片 4 件套 |
| 4. 音频策略      | 商业目标定风格 3 步法 + 静音法则                                                               | 不适用(单图无音频)                                                                  | 跳过                    |
| 5. R5 零错字铁律 | 品牌/型号/成分/SPF/价格/资质/限量 逐字                                                         | 同(视频列)                                                                          | R5 跨模块通用           |
| 6. 合规清单      | [scenes/scene-commerce-product.md](references/video/scenes/scene-commerce-product.md) §9       | 同 §9(广告法/品牌/价格/资质/版权 BGM/母婴伦理;图片路径跳过"版权 BGM"那行)           | 共享清单                |
| 7. 生成路径标注  | `<name>.video-brief.md` 表头 `生成路径`                                                        | `<name>.image-brief.md` 表头 `生成路径`                                             | 侧车文件名不同          |

> **通用模式不强制这些动作**——仅在用户明确表达商业意图时才加载电商流程。

---

## §2 收集(Collect)

复用已有信息;**至多问一轮**澄清问题,且只问会实质改变结果的项目(主体、产物类型、硬约束、输入资产)。不要循环——如果还需要第二轮,就把该槽位标上既定默认值并继续。

会实质改变结果的项目: 主体 / 产物类型 / 硬约束 / 输入资产。不值得追问的项目: 美学形容词偏好、次要运镜/色调、字幕文案微调——这些使用 §1 和 §3 的既定默认值,不再多问一轮。

**多段流程(动态上限)**: 单段上限是所选 Provider 的 `capability_limits[<capability>].maxSingleSegmentDuration`(通过 `capabilities` 读取,不硬编码)。当目标时长超出上限时,**在 §2 收集门槛处停下来问用户**,在 ① 拆分(交付 N 个独立文件,无菜谱)与 ② 合并(交付 N 段 + 侧车中的外部合并菜谱)之间二选一。不要自动决策、不要自动合并、也不要硬编码 `18s/441`。

所有新工作都收集: 目的、主体、风格、要求/禁止内容、输入资产、输出目录与可读文件名。图片还要确定尺寸与是否需要输入图片。视频还要确定时长、画幅比、节奏、镜头数、镜头语言、连续性、参考图与关键帧。

---

## §3 规划(Plan)— 创意层

Skill 拥有创意层:在提交之前把收集到的 brief 变成具体的分镜文档。core 从不规划或生成分镜。

### 3.0 4 步流程(写故事 → 定人物 → 定场景 → 写脚本)+ 评审过审过门

短视频构建的直觉是**先有事和主题,再定人物,环境用以衬托,最后写成 prompt 并自检**——像拍电影一样,**写电影故事 → 定人物方案 → 定场景方案 → 写剧本/分镜 → 评审过审**。每个环节有明确的"产出物"和"参考标准(DoD)",每步主引一个文件,避免在多步之间反复跳读同一个文档。

> **本节 4 步是"创意规划"层——产出物是一份 `<name>.video-brief.md`**。提交前的"评审过审"在 §3.4(过门),只检模型/格式/规则,不复看创意内容。

| #   | 环节       | 产出物                             | 参考标准(DoD)                                                                                                       | 主引文件                                                                                                                                         | 辅引 |
| --- | ---------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| 1   | **写故事** | 骨架(A/B/C) + 主题母体 + 镜头结构  | 骨架选定 + 主题一句话可讲清 + 镜头 1:1 对应(无主动合并) + [§5.6 事件逻辑 4 问](references/video/storyboard.md) 全过 | [storyboard.md](references/video/storyboard.md)(§4 骨架 + §5 镜头结构 + §5.6 事件逻辑)                                                           | —    |
| 2   | **定人物** | 角色四层(身份/外貌/服装/气质)      | 四层齐全 + 关键特征锁定 + [§4 人物-事件一致性](references/video/character.md) 全过                                  | [character.md](references/video/character.md)(§1 角色四层 + §3 micro-action + §4 人物-事件一致性)                                                | —    |
| 3   | **定场景** | 场景三层 + 时间/天气/光线 + 风格锚 | 场景三层齐全 + 单一光源 + 风格锚 1 个 + [§6 场景内部一致性](references/video/scene.md) 全过                         | [scene.md](references/video/scene.md)(§1 场景三层 + §2 降级 + §3 单一光源 + §4 竖屏 + §5 风格锚 + §6 场景内部一致性)                             | —    |
| 4   | **写脚本** | Final Prompt(执行层)               | 八要素齐全 + 1:1 镜号对应 + 14 镜头库术语选对 + 5 铁律同步遵守 + Negative Prompt(若必填档)                          | [prompt-craft.md](references/video/prompt-craft.md)(§1 八要素 + §3 14 镜头库 + §4 避坑 + §5 5 铁律 + §7 拼接模板 + §8 分镜列映射 + §10 Negative) | —    |

**过门(不在 4 步内)**:

| 阶段     | 性质                                                                  | 文档                                                                          |
| -------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 评审过审 | 模型/格式/规则自检(M1-M6 + Provider + 侧车结构 + 1:1 镜号),不复看创意 | [§3.4](#34-提交前校验) + [media-rules.md §4](references/video/media-rules.md) |

**流程关系**(每个文件的主战场唯一):

- `storyboard.md` = 创意层入口(事/骨架/镜头/事件逻辑),**只在 step 1 出现 1 次**
- `character.md` = 人物层,**只在 step 2 出现 1 次**
- `scene.md` = 场景层,**只在 step 3 出现 1 次**
- `prompt-craft.md` = 写作层,只在 step 4 出现 1 次
- `media-rules.md` = 评审层,只在过门出现 1 次
- 任何文件不跨多步被打开——消除交叉耦合

**R6 事件逻辑自洽的分散执行**(横切每步的不变量,不是某一步的):

| 环节          | R6 在该步的检查项                                            | 文档                                                            |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| step 1 写故事 | 5 维组合不出现反例(场景/时间/天气/服装/动作)                 | [storyboard.md §5.6](references/video/storyboard.md)            |
| step 2 定人物 | 服装-场景匹配;身份-动作匹配;气质-情绪匹配;年龄-场景安全性    | [character.md §4](references/video/character.md)                |
| step 3 定场景 | 场景类型内部一致;时代-光线匹配;天气-场景匹配;风格锚-场景匹配 | [scene.md §6](references/video/scene.md)                        |
| step 4 写脚本 | Final Prompt 继承前 3 步的 R6 结论,不漂移                    | [prompt-craft.md §1 八要素表](references/video/prompt-craft.md) |
| 评审过审      | **不复看 R6**——只检模型/格式/规则                            | [media-rules.md §4](references/video/media-rules.md)            |

### 3.0.1 自动推进策略(Brief → 产物,不暂停确认)

> **本 Skill 默认在 brief 写完后不向用户索要确认**,直接进入 §4 路由与 §4.2 提交。

- §3 产出的 brief(`<name>.video-brief.md` / `<name>.image-brief.md`)只作为最终交付物的一部分,不充当"等待用户 review"的卡点。
- §4.1 提交前确认门在本 Skill 默认策略下被**整体跳过**(参见 §4.1 第 1 段)。
- 完整 brief 内容在 §5.2 报告阶段与产物路径一起呈现给用户;用户对结果不满意时,通过追加 prompt 重新发起新一轮任务来迭代,而非在原任务中途打断。
- 例外:若用户在当前消息里**显式声明**"先给我看 brief 再决定"或"不要直接生成",则按其指示走,跳过本自动推进策略,先停在 §3 末尾等待确认。

### 3.1 视频:产出 3 段侧车

视频侧车文件名:`<输出文件名主干>.video-brief.md`,与最终 mp4 同行。**侧车结构固定 3 段**(`## 3-5` 顺序按 brief 需要可灵活,但 `Final Prompt` 一定在最后):

| #   | 区块                                       | 必填                | 说明                                                                                                |
| --- | ------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | **视频主要目标**                           | 必填                | 一行:`产品/主题 × 人群 × 目标(认知/兴趣/转化) × 骨架(A/B/C) × 时长 × 画幅(默认9:16竖屏)`            |
| 2   | **分镜表格**                               | 必填                | 每镜一行,列定义见 [storyboard.md §7](references/video/storyboard.md)                                |
| 3   | **Final Prompt(执行层 · 提交给 t2v 模型)** | 必填,**始终放最后** | 一个代码块中的完整多镜 prompt,外加 BGM 备注;`Action` 与 `Camera language` 段按 §2 表格镜号 1:1 对应 |

> **§2 表格下可选的扩展项**(不破坏 3 段结构):
>
> - **Negative Prompt**:进 §3 `Final Prompt` 内的 `Negative constraints:` 块(见 [prompt-craft.md §11](references/video/prompt-craft.md));commerce/人像/品牌必填
> - **Inputs**(i2v/kf2v 参考图/起止帧):进 §1 表头的 `默认假设` 行或 §2 表头注释
> - **Generation** 元数据(Provider/model/task.id/参数/warnings/timing):由 §5 追加到 §3 之后,作为「## Generation」段

完整可工作的示例见 [example.md](references/video/example.md)。

### 3.2 图片

按 [references/image/image-methodology.md](references/image/image-methodology.md) §6 产出一条最终 prompt,并选择 `text-to-image` 或 `image-to-image`(分层布局用 `H` 多分区)。写带分层布局或文字的图片 prompt 之前,先看完整示例 [references/image/image-example.md](references/image/image-example.md)——它是 `<name>.image-brief.md` 侧车的颗粒度校准锚。`image-to-image` 要明确声明保留什么、改什么(元素级绑定)。按预期用途选择画幅比,把 `size`/`ratio` 放进 `parameters`。图片侧车是 `<输出文件名主干>.image-brief.md`(与视频的 `<name>.video-brief.md` 平级)。

### 3.3 把规划转换为能力支持的形态

| 输入规划   | 能力                 |
| ---------- | -------------------- |
| 仅 prompt  | `text-to-video`      |
| 一张参考图 | `image-to-video`     |
| 起止帧     | `keyframes-to-video` |

默认竖屏 9:16,把时长映射为 Provider 帧数: `num_frames = round(duration_seconds * frame_rate)`。硬上限是 `capability_limits[<capability>].maxFrames` 与 `capability_limits[<capability>].maxSingleSegmentDuration`(通过 `capabilities` 读取,不要硬编码 18s/441)。两者都必须满足 `frameCountRule`(如 8n+1)。**在任何 prompt 或分镜中不要硬编码 18s/441** — 不同 Provider 上限不同。超过上限的时长,规划 N 段、各自独立提交,然后问用户是否合并。画幅比通过 `parameters.width/height` 表达。

### 3.4 提交前校验

- 11 列全部填满、镜头时长总和等于目标
- 每 15s `★` ≥ 5(视觉重点)
- 字幕文案零错字且品牌名逐字(R5)
- 帧数满足所选 Provider `capabilities` 的 `frameCountRule`(Agnes 为 `8n + 1`)
- 视频侧车 `Action` 与 `Camera language` 段按 §2 表格镜号 1:1 对应、**不主动合并相邻镜头**(见 [storyboard.md §5](references/video/storyboard.md))

按 [core/provider-contract.md](core/provider-contract.md) 构建公共请求。视频路径把侧车 `Negative Prompt` 区块并入最终提交的 `prompt` 约束段;不要把负面提示词作为主要行为依赖独立 Provider 字段。Provider 专属控制放在 `parameters` 中,并与所选 Provider 参考核对。

### 3.5 视频路径配套参考(按需读)

> 5 步流程的"主引"已经在 §3.0 锁定(每步 1 个文件)。本表是**辅引**和补充参考,按需打开。

| 文档                                                                                                                                                                                                                                                                                                                                        | 何时读                                                                                                                              | 与 5 步流程的关系               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [references/video/storyboard.md](references/video/storyboard.md)                                                                                                                                                                                                                                                                            | **主方法论** — 骨架(A/B/C) + 镜头结构 + 1:1 镜号对应 + 事件逻辑反例库 + 时间分段策略。**写任何分镜前必读**                          | step 1 主引                     |
| [references/video/character.md](references/video/character.md)                                                                                                                                                                                                                                                                              | **角色设计** — 角色四层 + micro-action + 人物-事件一致性                                                                            | step 2 主引                     |
| [references/video/scene.md](references/video/scene.md)                                                                                                                                                                                                                                                                                      | **场景设计** — 场景三层 + 展示层→执行层降级 + 单一光源 + 竖屏约束 + 风格锚 + 场景内部一致性                                         | step 3 主引                     |
| [references/video/prompt-craft.md](references/video/prompt-craft.md)                                                                                                                                                                                                                                                                        | **Prompt 写作** — 八要素 + 14 镜头库(唯一版) + 避坑三陷阱 + 5 铁律(唯一版) + 钩子 + 拼接模板 + 分镜列映射 + Negative Prompt 方法论  | step 4 主引                     |
| [references/video/media-rules.md](references/video/media-rules.md)                                                                                                                                                                                                                                                                          | **模型能力边界 + 提交前自检** — M1-M6 + 时间表达 + Provider 关键参数 + 提交前自检清单。**评审过审过门必读**                         | 评审过审主引                    |
| [references/video/audio-design.md](references/video/audio-design.md)                                                                                                                                                                                                                                                                        | **音频三层** — 人声/环境音/BGM + 情绪杠杆 + 静音法则。Final Prompt 的 `Notes for downstream audio` 段填什么由本文件决定             | step 4 辅引(在 Notes 段)        |
| [references/video/subtitle-spec.md](references/video/subtitle-spec.md)                                                                                                                                                                                                                                                                      | **字幕规范** — 用不用判定 + 6 类字幕 + 风格 + 动效 + 文案原则。分镜表的"屏显字幕"列填什么由本文件决定                               | step 1 辅引(分镜表"屏显字幕"列) |
| [references/video/example.md](references/video/example.md)                                                                                                                                                                                                                                                                                  | **完整示例** — 晨雾森林雄鹿与幼鹿 6 镜完整填好示例                                                                                  | 5 步全流程实例参考              |
| [references/video/templates/templates-3-sets.md](references/video/templates/templates-3-sets.md) + [references/video/templates/scene-quick-match.md](references/video/templates/scene-quick-match.md)                                                                                                                                       | 3 套即用模板 + 场景速配表 + 主体描述速查 + 钩子速查                                                                                 | step 1 辅引(钩子速查)           |
| [references/video/scenes/scene-nature-animal.md](references/video/scenes/scene-nature-animal.md) / [scene-lifestyle-aesthetic.md](references/video/scenes/scene-lifestyle-aesthetic.md) / [scene-portrait-fashion.md](references/video/scenes/scene-portrait-fashion.md) / [scene-food-asmr.md](references/video/scenes/scene-food-asmr.md) | 4 类场景参考的光影/音频/骨架/7秒高潮点模板                                                                                          | step 1 辅引(场景路由)           |
| [references/video/scenes/scene-commerce-product.md](references/video/scenes/scene-commerce-product.md)                                                                                                                                                                                                                                      | **电商模式专属** 6 大品类(美妆/服饰/家居/数码/母婴/通用);含光影/音频/高潮点/反模式/合规清单/R5 零错字铁律。**当 mode = 电商时必读** | step 1 辅引(电商强制)           |
| [references/cinematography-reference.md](references/cinematography-reference.md)                                                                                                                                                                                                                                                            | 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值                                                                | step 4 辅引(术语转换)           |
| [references/influence-factors.md](references/influence-factors.md)                                                                                                                                                                                                                                                                          | 视频生成影响因子 F1-F12(带权重评分卡)                                                                                               | step 4 / 评审过审辅引           |

---

## §4 路由与提交

### 4.0 路由(Route)

新工作之前先运行 `capabilities`。core 按能力、配置与详细支持过滤启用的注册项,然后选择唯一优先级最低的合格 Provider。除非用户显式选择了某个 Provider,否则省略 `provider`。

额度视为未知,除非 Provider 返回权威信息。不要编造免费额度,也不要添加投机性的额度调用。只有权威的提交前拒绝(带 `accepted: false`)之后才允许回退。

### 4.1 提交前确认门(视频任务)

> **本 Skill 默认跳过本确认门**(由 §3.0.1 自动推进策略决定)。构建好最终 prompt 后直接调用 `generateMedia`,不在此处向用户索要确认。Brief 的可见性通过 §5.2 报告 + brief 文件交付保证,而不是中途暂停。
>
> 如下内容仅在用户**显式要求先看 prompt 再生成**时才生效。

视频生成成本远高于图片,如确需确认,提交前先征询用户确认,避免白烧额度。构建好最终 prompt 后、调用 `generateMedia` 之前,用 AskUserQuestion 展示:

- 最终 prompt 摘要(主体 / 场景 / 动作 / 镜头语言 / 约束)
- 时长与帧数(含 `frameCountRule` 合规性)、画幅比
- 所选 Provider 与模型

用户选择:

- **确认提交** → 继续 §4.2;
- **修改** → 按反馈调整 prompt 后再次征询(至多 2 轮,仍不一致则以用户最终指示为准);
- 用户事先已明确"直接生成 / 不用确认" → 跳过本门(默认状态)。

图片任务不强制确认门(成本低),但电商模式(§1.2)或 `image-to-image` 涉及原图修改时,建议同样展示 prompt 摘要。

> 本门与 §2 收集阶段"至多问一轮"相互独立:§2 澄清 brief 缺失项,§4.1 确认最终 prompt 成品。

### 4.2 提交(Submit)

默认使用 `generateMedia`;只有请求"提交不等待"时才使用 `createMedia`。只提交一次。在接受变为 true 或未知之后,绝不重试生成 POST,也不切换 Provider。

### 4.3 等待或恢复(Wait Or Resume)

`status` 与 `wait` 需要确切的原始 `provider`、`capability` 与 `task.id`。它们绝不按优先级路由。

绝不用 `generate` 或 `create` 恢复工作。`wait_timeout` 时,保留 Provider 与任务 ID;远端任务仍然活跃。只有被要求时才继续另一次有界 `wait`。远端成功后的 `download_failed`,对同一任务使用 `wait` 重试状态与下载,不要重新创建媒体。

---

## §5 保存与报告

### 5.0 保存(Save)

成功的 `generate` 与 `wait` 操作通过 core 保存产物来源(Artifact Sources)。使用一个可读的 `output.filename`(至多 120 字符);同一个主干命名视频与其侧车。core 保证任务 ID 不进入本地路径、应用真实媒体扩展名、多产物自动编号、避免覆盖,并返回绝对路径。

一次成功的视频交付两个同 basename 的相邻文件:

```text
<name>.mp4            (core 媒体产物)
<name>.video-brief.md  (§3 创意文档 + Generation)
```

一次成功的图片交付两个同 basename 的相邻文件:

```text
<name>.<ext>          (core 媒体产物, .png/.jpg/.webp 依 Provider)
<name>.image-brief.md (§3 创意文档 + Generation)
```

侧车(video-brief.md 或 image-brief.md)是 §3 产生的创意文档,已携带 `Brief`、视觉规范表(视频为 `Storyboard` / 图片为 `视觉规范表`)、`Final Prompt`、`Negative Prompt` 与 `Inputs`。**视频侧车顺序固定**:`视频主要目标` → `分镜表格` → `Generation` → `Final Prompt(放最后)`,便于把 `Final Prompt` 作为单段独立可复制的产物提交。交付后把 `Generation` 区块(原本就是 §3 占位)就地填实,记录 Provider、模型、固定的任务 ID、生效参数与警告。不要重写创意内容。绝不要包含凭证、授权头或原始外部响应。

恢复的任务复用原始分镜与 prompt。如果侧车不可用,不要凭空捏造;在这些区块写 `Unavailable from recovered task`,并保留可用的任务与生成元数据。如果视频成功后追加 `Generation` 失败,报告视频路径与侧车失败,不要重新生成视频。

不要声称 core 未执行的媒体完整性检查。

### 5.1 质检(仅在用户明确要求时执行)

默认不质检——视频/图片一旦生成,内容就锁死,机械核对没有修复手段,反而增加延迟;短视频用户一眼即知,Skill 不替用户做这件事。

仅当用户**明确要求质检**("帮我看看图/视频有没有问题")时才执行一次:

- 读图/读帧核对"无 AI 残留 / 无水印 / 无叠加文字"(品牌文字类场景按 brief 确认)
- 核完如实报告,失败时不再重生成

> 不与 §3.4 提交前校验混用:§3.4 是提交前的 prompt/分镜/帧数合规,Skill 自检;本节是产物出图后的内容核对,按需触发。

### 5.2 报告(Report)

每个最终结论报告只呈现有证据支撑的事实:

- 生成信息: `provider`、`capability`、规范化 `status`、固定的 `task.id`、返回或选中的 model、生效参数、警告与耗时。
- 每个产物: 绝对路径、媒体类型(`image` 或 `video`)、检测到的格式或 MIME 类型、字节大小与可用尺寸。视频还要报告可用的时长、画幅比与帧率。

**双文件交付(必报)**:

- 视频成功 → 必报两条绝对路径:`<name>.mp4`(产物) + `<name>.video-brief.md`(侧车 brief)。
- 图片成功 → 必报两条绝对路径:`<name>.<ext>`(产物) + `<name>.image-brief.md`(侧车 brief)。
- brief 文件不存在或追加 Generation 失败 → 报告缺失/失败原因,**不**重新生成视频/图片。
- 用户必须能直接定位到 brief 与产物两份文件;若只能给出一个,说明侧车失败的事实。

不要从文件名或 Provider 默认值推断缺失的尺寸、时长、画幅比、帧率、model 或 MIME 类型。不可用字段标记为 `unknown` 或省略。

| 结果                 | 动作                         |
| -------------------- | ---------------------------- |
| `wait_timeout`       | 保留任务并提供另一次有界等待 |
| `download_failed`    | 保留远端成功并用 `wait` 重试 |
| 完成但无产物 URL     | 报告脱敏诊断;绝不重提        |
| 认证、权限或额度失败 | 报告错误;不重试              |
| 未知的 POST 接受状态 | 停止;不重试也不回退          |
