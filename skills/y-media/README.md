# y-media

`y-media` 是一个轻量媒体工作流 Skill。它通过显式注册的 Provider 支持图片与视频生成，同时保证确定性路由、任务恢复与本地产物处理。

运行时指令见 [SKILL.md](SKILL.md)。共享的请求、结果、错误与 Provider 契约见 [core/provider-contract.md](core/provider-contract.md)。Provider 相关的 API 事实紧邻各自的实现存放，例如 [providers/agnes/api.md](providers/agnes/api.md)。

## 架构

```text
SKILL.md
  意图收集与创意规划
        |
        v
core/orchestrator.cjs
  校验、路由、创建、状态查询、等待、恢复
        |
        +--> providers/manifest.cjs --> providers/<id>/provider.cjs
        |
        +--> core/artifacts.cjs --> 本地文件
        +--> core/post.cjs --> 质检(probe/frames) + 字幕烧录兜底
```

各边界是刻意划分的：

| 区域         | 职责                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Skill        | 收集意图，按 [references/library/M1-methodology.md](references/library/M1-methodology.md) 规划分镜，编写创意文档，并构建公共请求 |
| Orchestrator | 选择 Provider、只提交一次、固定任务、轮询、协调保存                                                                              |
| Contract     | 校验 manifest、公共请求、结果与稳定错误分类                                                                                      |
| Artifacts    | 校验公共 URL，并原子保存下载内容、Base64 或字节                                                                                  |
| Post         | 产物级质检(ffprobe 客观校验 + 抽帧人工审) + 字幕烧录兜底                                                                         |
| Provider     | 解析凭证、映射参数、调用一个外部 API、规范化结果                                                                                 |

创意 brief 的收集与分镜生成不属于 core。Skill 拥有创意层:[references/library/M1-methodology.md](references/library/M1-methodology.md) 定义了通用的分镜、音频、字幕与镜头语言方法;一个视频 brief 会落地为具体的 `<name>.video-brief.md` 文档,其提示词随后通过 core 提交。Provider 专属的模型、端点、凭证与响应兼容性不属于编排层。

## 目录结构

```text
skills/y-media/
|-- SKILL.md                                (路由表 §0 + 5 步工作流 + reference 索引)
|-- README.md                               (本文件:架构 + 设计说明 + 公共 API)
|-- references/
|   |-- library/                            (视频横切原语,按剧组角色分层,命中 recipe 后按需加载)
|   |   |-- M1-methodology.md               (制片+导演 · 路径+骨架+镜头结构+制片决策)
|   |   |-- M2-character.md                 (选角 · 角色四层+人物-事件一致性)
|   |   |-- M3-scene.md                     (美术 · 场景3+1+动态层+单一光源)
|   |   |-- M4-cinematography.md            (摄影 · 景别+机位+运镜+焦段+构图)
|   |   |-- M5-audio.md                     (录音 · 音频三层进prompt)
|   |   |-- M6-prompt-craft.md              (剪辑 · 八要素+套用模板+prompt拼接+字幕直出)
|   |   `-- A1-subtitle.md                  (字幕 · 直出文案+降级烧录)
|   |-- recipes/                            (品类配方,按 brief 关键词只读 1 个)
|   |   |-- nature.md                       (自然/动物/治愈)
|   |   |-- lifestyle.md                    (生活/质感/氛围/节日)
|   |   |-- portrait.md                     (人像/穿搭/时尚,强 i2v)
|   |   |-- food.md                         (美食/ASMR/饮品)
|   |   `-- commerce.md                     (商业带货)
|   `-- image/                              (图片专属,独立于视频)
|       |-- I1-image-core.md
|       |-- I1-image-methodology.md
|       |-- I1-image-style.md
|       `-- I2-image-example.md
|-- examples/                               (成品示范,每类 1 个 MUST-KEEP)
|   |-- nature-fog-forest.md                (自然·骨架 B,默认入口)
|   |-- lifestyle-coffee.md                 (生活·晨光咖啡)
|   |-- portrait-magazine.md                (人像·杂志,强 i2v)
|   |-- food-cooking.md                     (美食·烹饪)
|   `-- commerce-beauty.md                  (商业·美妆)
|-- core/
|   |-- orchestrator.cjs
|   |-- contract.cjs
|   |-- artifacts.cjs
|   |-- post.cjs
|   `-- provider-contract.md
|-- providers/
|   |-- manifest.cjs
|   `-- agnes/
|       |-- provider.cjs
|       `-- api.md
`-- tests/
    |-- media.test.cjs
    `-- post.test.cjs
```

## 设计说明(Why this shape)

> 本节回答"为什么这个 skill 长这样"。新成员看 §0 路由表 5 分钟就能跑流程;深入优化或扩展前,先读本节理解设计取舍。

### 路由哲学:文件小 ≠ 加载少

**核心**:skill 是 Agent 按需加载的——**加载量 = token 成本,不是文件体积**。

合并 N 个文件看似体积小,但每次 brief 都会把 N 个文件全读进上下文;**拆 N 个 + 路由 = 每次只读匹配的 1 个**。文件小,加载少,成本低。

### 视频与图片两路独立 library

视频和图片走两套互不重叠的 library:

- **视频核心 library(7 个,按剧组角色分层)**:M1 制片+导演、M2 选角、M3 美术、M4 摄影、M5 录音、M6 剪辑、A1 字幕。命中 recipe 后按需加载,镜头语言只归 M4 一处。
- **图片 library(独立)**:不读视频 7 个原语,只读 I1 image-core/methodology/style + I2 image-example + 必要的 recipe 头。

**为什么分开**:图片无时间轴/分镜/音频,视频的 7 个原语对图片 0 价值;硬塞进图片加载路径 = 平白增加 token 成本。

### recipe 共享 1 份 library(不按 recipe 重复列)

**所有 video recipe 共享同一份 7 个原语**;各 recipe 只在头部"与其他文件关系"声明自身独有的额外文件。这样:

- 路由表只列 1 次 library,简洁
- recipe 不重复声明共享文件
- 跨 recipe 知识自动同步(改一个 library 文件,所有 recipe 受益)

### 镜头语言收敛在 M4 一处

景别/机位/运镜/焦段/构图只维护在 [M4-cinematography.md](references/library/M4-cinematography.md),M1/M6/recipes 只引用不重复。避免同一主题多个说法。

### 套用模板并入 M6

即用 prompt 模板(人像/风景/i2v/古风)并入 [M6-prompt-craft.md §7](references/library/M6-prompt-craft.md),不单独设 `templates/` 目录。模板是 M6 拼接规则的现成实例,职责不拆分。

### example 只留 MUST-KEEP

examples 每类 1 个典型(差异最大),recipe 提供规则,AI 读完 recipe §1.5 后可自主生成其余品类,不靠 example 堆数量。

### R1-R6 铁律不内联 library 路径

R1-R6 只列**铁律本身**(一句话含义)。**落点由对应 recipe + library 自行声明**。这样:

- 铁律是抽象的、可读的、不会过期
- 路径真相只在每个文件自己的"与其他文件关系"段里,单一来源
- 增删 library 文件,不需要回头改铁律表

### M1 制片+导演合一(按工作流阶段)

`M1-methodology.md` 是创意方法论单一文件,覆盖规划到交付:
- **§0-§7**(规划+脚本):路径判定 / 骨架 / 镜头结构 / 分镜表 11 列 / 展示层 vs 执行层 / 场景路由
- **§8-§9**(交付):时长分段 / Provider 能力速查 / 制片决策(P1-P5)/ 自检

---

## 公共 API

`core/orchestrator.cjs` 导出可复用的工作流函数：

| 函数                              | 职责                                               |
| --------------------------------- | -------------------------------------------------- |
| `listCapabilities(manifest)`      | 不检查凭证，返回已启用注册项与能力                 |
| `generateMedia(request, context)` | 为新工作执行选择、创建、等待与保存                 |
| `createMedia(request, context)`   | 校验并只提交一个新任务，不等待                     |
| `statusMedia(request, context)`   | 在其固定 Provider 上查询一个既有任务               |
| `waitMedia(request, context)`     | 在本地截止时间内轮询一个固定任务，并保存成功的产物 |

`core/post.cjs` 导出质检与字幕兜底函数：`probe` / `frames` / `burn` / `verify` / `runtimeCapabilities`。

它们精确的请求与结果形状定义在 [core/provider-contract.md](core/provider-contract.md)。

## 视频交付物

一次成功的视频工作流会产出两个同名（相同 basename）的相邻文件：

```text
<name>.mp4
<name>.video-brief.md
```

`.video-brief.md` 伴生文档是 Skill 创意层（Step 3）产出的创意文档：包含 brief、分镜表、最终与负向提示词。交付后追加 `Generation` 节，记录 Provider、模型、固定任务 ID、生效参数与警告，不包含密钥或原始外部响应。Skill 拥有伴生文档，因为 brief 收集与分镜属于创意规划关注点；core 只拥有媒体产物。

恢复的任务复用其原始规划数据。当规划数据不可用时，伴生文档将相关节标记为不可用，而不是重建未经证实的事实。伴生文档写入失败永远不会触发新的生成请求。

## 免费额度 Provider 候选

免费额度是商业条款，不是路由数据。它们因账户、区域、模型与日期而异，因此只有在确认当前 API 条款、并以其权威响应作为额度决策依据后，才注册 Provider。

| Provider                         | 适配能力                           | 免费额度现状                                     | 注册决策                                                  |
| -------------------------------- | ---------------------------------- | ------------------------------------------------ | --------------------------------------------------------- |
| Agnes                            | 图片与视频                         | 已配置的现有 Provider；仅使用其返回的额度信息    | 保持注册，固定优先级                                      |
| Hugging Face Inference Providers | 主要为图片；视频取决于所选路由模型 | 小额账户额度与 Provider 可用性可能变化           | 在验证当前条款与模型支持后，作为下一个面向 API 的图片候选 |
| Cloudflare Workers AI            | 主要为图片与图像处理模型           | 包含受账户套餐约束的有限免费分配                 | 已有 Workers 账户时可作为图片工作负载的候选               |
| Google AI Studio / Gemini API    | 所选模型提供免费层时的图片生成     | 按模型提供免费层；不要假设视频访问免费           | 仅在确认具体模型与区域资格后作为图片候选                  |
| fal.ai 或 Replicate              | 图片与视频模型                     | 可能提供试用或促销额度，但不是稳定的免费额度契约 | 仅当目标账户已验证额度且有合适模型时添加                  |
| Pollinations                     | 主要为图片                         | 可能有公共访问，但容量、条款与生产保障可能变化   | 仅在条款评审后作为显式选择的、非关键的图片 Provider       |

有免费额度但无稳定文档化 API 契约的浏览器产品不应进入 manifest。特别是 Kling、Pika、Runway、Luma 等产品，在将其视为 Provider 前，需单独核实官方 API 可用性。

## 最终报告数据

Skill 的最终结论报告有证据支撑的生成与产物信息，而不仅是本地路径：

- 生成信息：Provider、能力、规范化状态、固定任务 ID、所选或返回的模型、生效参数、警告与耗时。
- 每个图片/视频产物：绝对路径、媒体类型、检测到的格式或 MIME 类型、字节大小，以及可用的尺寸。
- 视频专属字段：可用的时长、宽高比与帧率。

未知值保持 `unknown` 或被省略；Skill 不得从文件名、默认值或不完整的 Provider 响应中推断这些值。

## 路由规则

- `providers/manifest.cjs` 是唯一的 Provider 注册表。
- 每个启用的 Provider 有一个所有能力共享的唯一整数优先级。
- 数值越小越先执行；manifest 数组顺序没有路由含义。
- 新工作可使用优先级路由。既有工作始终固定在其原始 Provider 与不透明任务 ID 上。
- 只有在拒绝是权威的且 `accepted: false` 时，`create()` 之后才允许回退。
- 未知接受状态、已创建的任务、轮询错误与产物错误会阻止切换 Provider。
- 除非 Provider 返回权威信息，否则额度始终视为未知。不存在投机性的额度抽象。

## 添加 Provider

1. 创建 `providers/<id>/provider.cjs`，并在 `providers/<id>/api.md` 中随附其已验证的 API 说明。
2. 当 Provider 能返回异步工作时，实现 `isConfigured`、`supports`、`create` 与 `status`。
3. 在 `providers/manifest.cjs` 中注册一次，使用唯一 ID、唯一启用优先级与受支持的能力。
4. 不要将模型、格式、尺寸、凭证与端点的细节放入 manifest。
5. 在错误跨入 core 之前，规范化所有响应并脱敏 Provider 持有的凭证。
6. 添加契约、路由、任务身份、回退、响应映射与凭证边界的测试。

不要新增自动发现、Provider 基类、按能力区分的优先级，或 Provider 专属工作流。只有在至少两个真实 Provider 需要相同稳定行为后，才添加共享的 core 行为。

## 开发

测试通过 `core/orchestrator.cjs` 和 `core/contract.cjs` 等内部模块实现。测试不得发起真实生成请求或消耗 Provider 额度。Provider 与产物行为应使用注入的传输层与临时输出目录。