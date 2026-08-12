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
```

各边界是刻意划分的：

| 区域         | 职责                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Skill        | 收集意图，按 [references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) 规划分镜，编写创意文档，并构建公共请求 |
| Orchestrator | 选择 Provider、只提交一次、固定任务、轮询、协调保存                                                                              |
| Contract     | 校验 manifest、公共请求、结果与稳定错误分类                                                                                      |
| Artifacts    | 校验公共 URL，并原子保存下载内容、Base64 或字节                                                                                  |
| Provider     | 解析凭证、映射参数、调用一个外部 API、规范化结果                                                                                 |

创意 brief 的收集与分镜生成不属于 core。Skill 拥有创意层：[references/video/storyboard-methodology.md](references/video/storyboard-methodology.md) 定义了通用的分镜、音频、字幕与提示词方法；一个视频 brief 会落地为具体的 `<name>.video-brief.md` 文档，其提示词随后通过 core 提交。Provider 专属的模型、端点、凭证与响应兼容性不属于编排层。

## 目录结构

```text
y-media/
|-- SKILL.md
|-- README.md
|-- references/
|   |-- video/
|   |   |-- storyboard-methodology.md        (方法论主文件)
|   |   |-- storyboard-example.md            (完整填好示例:雄鹿与幼鹿)
|   |   |-- granularity-scale.md             (颗粒度标尺:展示层/执行层)
|   |   |-- prompt-structure-formula.md      (八要素+五定法骨架)
|   |   |-- cinematic-shot-library.md        (14 镜头库)
|   |   |-- pitfalls-and-iron-rules.md       (避坑+铁律)
|   |   |-- storyboard-reality-calculator.md (镜头现实性+帧数校验)
|   |   |-- t2v-model-capability.md        (模型能力边界 M1-M6)
|   |   |-- scenes/                          (4 类场景模板)
|   |   `-- templates/                       (3 套模板+速配表)
|   |-- cinematography-reference.md
|   |-- influence-factors.md
|   `-- image-prompt-example.md
|-- core/
|   |-- media.cjs
|   |-- orchestrator.cjs
|   |-- contract.cjs
|   |-- artifacts.cjs
|   `-- provider-contract.md
|-- providers/
|   |-- manifest.cjs
|   `-- agnes/
|       |-- provider.cjs
|       `-- api.md
`-- tests/
    `-- media.test.cjs
```

## 公共 API

`core/orchestrator.cjs` 导出可复用的工作流函数：

| 函数                              | 职责                                               |
| --------------------------------- | -------------------------------------------------- |
| `listCapabilities(manifest)`      | 不检查凭证，返回已启用注册项与能力                 |
| `generateMedia(request, context)` | 为新工作执行选择、创建、等待与保存                 |
| `createMedia(request, context)`   | 校验并只提交一个新任务，不等待                     |
| `statusMedia(request, context)`   | 在其固定 Provider 上查询一个既有任务               |
| `waitMedia(request, context)`     | 在本地截止时间内轮询一个固定任务，并保存成功的产物 |

它们精确的请求与结果形状定义在 [core/provider-contract.md](core/provider-contract.md)。

## 视频交付物

一次成功的视频工作流会产出两个同名（相同 basename）的相邻文件：

```text
<name>.mp4
<name>.video-brief.md
```

`.video-brief.md` 侧车是 Skill 创意层（Step 3）产出的创意文档：包含 brief、分镜表、最终与负向提示词。交付后追加 `Generation` 节，记录 Provider、模型、固定任务 ID、生效参数与警告，不包含密钥或原始外部响应。Skill 拥有侧车，因为 brief 收集与分镜属于创意规划关注点；core 只拥有媒体产物。

恢复的任务复用其原始规划数据。当规划数据不可用时，侧车将相关节标记为不可用，而不是重建未经证实的事实。侧车写入失败永远不会触发新的生成请求。

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

