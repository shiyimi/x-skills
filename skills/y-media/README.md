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
| Skill        | 收集意图，按 [references/library/M1-methodology.md](references/library/M1-methodology.md) 规划分镜，编写创意文档，并构建公共请求 |
| Orchestrator | 选择 Provider、只提交一次、固定任务、轮询、协调保存                                                                              |
| Contract     | 校验 manifest、公共请求、结果与稳定错误分类                                                                                      |
| Artifacts    | 校验公共 URL，并原子保存下载内容、Base64 或字节                                                                                  |
| Provider     | 解析凭证、映射参数、调用一个外部 API、规范化结果                                                                                 |

创意 brief 的收集与分镜生成不属于 core。Skill 拥有创意层:[references/library/M1-methodology.md](references/library/M1-methodology.md) 定义了通用的分镜、音频、字幕与提示词方法;一个视频 brief 会落地为具体的 `<name>.video-brief.md` 文档,其提示词随后通过 core 提交。Provider 专属的模型、端点、凭证与响应兼容性不属于编排层。

## 设计说明(Why this shape)

> 本节回答"为什么这个 skill 长这样"。新成员看 §0 路由表 5 分钟就能跑流程;深入优化或扩展前,先读本节理解设计取舍。

### 路由哲学:文件小 ≠ 加载少

**核心**:skill 是 Agent 按需加载的——**加载量 = token 成本,不是文件体积**。

合并 N 个文件看似体积小,但每次 brief 都会把 N 个文件全读进上下文;**拆 N 个 + 路由 = 每次只读匹配的 1 个**。文件小,加载少,成本低。

实测收益:5 个 scenes 文件 → 1 个 scenes.md 看似体积小,但每次都全读;拆 5 + 路由 = 只读匹配 1 个 ~3-5KB,实际加载量降 50%+。

### 视频与图片两路独立 library

视频和图片走两套互不重叠的 library:

- **视频核心 library(9 个横切原语,分层按需)**:命中任意视频 recipe 读核心 6 个(M1+M2+M3+M4+M6+M8),辅助 3 个(M5+M9+M7)由 recipe 头部声明后按需加载 — M1 creative-method · M2 director-presets · M3 character · M4 scene · M5 cinematography[AUX] · M6 audio · M7 drift-prevention[AUX] · M8 prompt-craft · M9 media-rules[AUX]
- **视频交付层(1 个)**:提交阶段按需 — M10 delivery(Provider 参数 + 调用流程 + 结果验证)
- **视频按需 library(3 个)**:recipe 头部声明 — A1 subtitle · A2 multimodal-syntax · A3 emotional-levers
- **图片 library(独立)**:不读视频 9 个横切原语,只读 I1 image-methodology + I2 image-example + 必要的 commerce recipe 头

**为什么分开**:图片无时间轴/分镜/音频,视频的 9 个横切原语对图片 0 价值;硬塞进图片加载路径 = 平白增加 token 成本。

### recipe 共享 1 份 library(不按 recipe 重复列)

**所有 video recipe 共享同一份 9 个横切原语**;各 recipe 只在头部"与其他文件关系"声明自身独有的额外文件(2-3 个)。这样:

- 路由表只列 1 次 library,简洁
- recipe 不重复声明共享文件
- 跨 recipe 知识自动同步(改一个 library 文件,所有 recipe 受益)

### R1-R6 铁律不内联 library 路径

R1-R6 只列**铁律本身**(一句话含义)。**落点由对应 recipe + library 自行声明**。这样:

- 铁律是抽象的、可读的、不会过期
- 路径真相只在每个文件自己的"与其他文件关系"段里,单一来源
- 增删 library 文件,不需要回头改铁律表

### templates/ 独立于 library/

`templates/3-sets.md` 独立目录。它**不是横切原语**——不需要每次视频 brief 都读;只在需求简单、要直接套模板时按需加载。

### 路由表在 §0 第一屏

打开 SKILL.md 必先看到路由表,Agent 第一件事就是匹配 → 决定读哪几个 reference,不再"先读完全部再判断"。

### 兜底路由(§0.3)

当 brief 是视频但 0.1 关键词全未命中时:

1. 读视频核心 library(核心 6 个 + 辅助 3 个)
2. 读全部 5 个 recipe 头部 30 行(只读"板块共性"段)
3. 默认走 nature 骨架 B(5-8 镜,慢节奏,无字幕,治愈)—— 视频兜底最稳的形态
4. 若 brief 含明确商业意图(带货/转化/价格/卖点)→ 即便未命中关键词,优先按 commerce 处理

### M1-methodology 合并(按工作流阶段合一)

`M1-methodology.md` 是创意方法论单一文件,覆盖所有 3 个阶段:
- **§0-§5**(规划阶段):路径判定 / 骨架 A·B·C / 镜头结构 / 1:1 镜号 / R6 5 维矩阵
- **§6-§7**(脚本阶段):15s 段落指标 / 分镜表 11 列 / 颗粒度 / 展示层 vs 执行层 / 场景路由
- **§8-§9**(交付阶段):时长分段 / 帧数 8n+1 / Provider 能力速查 / 自检 11 项

**合并收益**:原 4 个文件 41.8KB → 1 个文件 34KB,减少 19% 加载量,消除跨文件引用开销。

### I1 轻量化(创意层 + 风格层合并)

`I1-image-methodology.md` 是图片方法论的唯一文件,覆盖创意层与风格层:

**精简收益**:31KB → 14.5KB,对比 visual-image-generator 的 SKILL.md(6.8KB)差距缩小 50%。

### 库文件"上下游"段去重

M3/M4/M6/A1/M8 等库文件原本各自维护"与其他文件的关系"段,内容重复、维护成本高。统一为单行指针 → [SKILL.md §4.0 编号索引](SKILL.md#40-编号索引快速定位),重复内容上移至 SKILL.md 单一来源,各库文件只在自身内容里维护本文件专属引用。

### 加载量与单文件体积目标

| 类别          | 目标上限 | 说明                                        |
| ------------- | -------- | ------------------------------------------- |
| SKILL.md      | ≤ 30KB   | 路由表 + 工作流 + 复杂度模式 + reference 索引 |
| library 核心文件 | ≤ 20KB | M1/M2/M3/M4/M6/M8 必读,单次按需加载 |
| library 辅助文件 | ≤ 15KB | M5/M9/M7 仅在 recipe 声明时按需加载 |
| recipe 文件   | ≤ 10KB   | 只放场景差异,不重复 library 内容            |
| example 文件  | ≤ 5KB    | 每 recipe 2 个典型例,anchor 互斥或跨度大   |
| 快速模式加载量 | ≤ 15KB  | recipe + template,跳过 M1-M9 |
| 标准模式加载量 | ≤ 50KB  | recipe + 核心 6 个 + L0 |
| 完整模式加载量 | ≤ 95KB  | recipe + 全部 M1-M9 + L0 |

实测:典型 brief 单次加载量约 22-28KB,较 v1 合并版(45KB+)降 38-51%。

---

## 目录结构

```text
y-media/
|-- SKILL.md                                (路由表 §0 + 5 步工作流 + 场景速配表 §4,~10KB)
|-- README.md                               (本文件:架构 + 设计说明 + 公共 API)
|-- references/
|   |-- library/                            (视频横切原语,核心 6 + 辅助 3 + 交付 1 个,按需加载;按 导演→选角→美术→摄影→录音→场记→剪辑→检查→交付 排序)
|   |   |-- L0-lookbook.md                  (视觉参考速配:6 核心×4 维,替代 M4+M5+M6 大部)
|   |   |-- M1-methodology.md               (导演·创意方法论:路径判定+骨架+镜头结构+侧车)
|   |   |-- M2-director-presets.md          (导演·8 个风格预设 P1-P8,一键套用)
|   |   |-- M3-character.md                 (选角·角色四层+人物-事件一致性)
|   |   |-- M4-scene.md                     (美术·场景三层+展示/执行层分离)
|   |   |-- M5-cinematography.md            [AUX] (摄影·影视要素词典:景别/光影/焦段)
|   |   |-- M6-audio.md                     (录音·音频三层+5 杠杆+静音)
|   |   |-- M7-drift-prevention.md          [AUX] (场记·分镜漂移预防,4 类漂移+5 招实战)
|   |   |-- M8-prompt-craft.md              (剪辑·八要素+14 镜头库+Final Prompt 拼接+Negative)
|   |   |-- M9-media-rules.md               [AUX] (检查·M1-M6 模型能力+反查清单)
|   |   |-- M10-delivery.md                 (交付·Provider 参数+提交流程+结果验证)
|   |   |-- A1-subtitle.md                  (字幕设计,recipe 声明后按需读)
|   |   |-- A2-multimodal-syntax.md         (多模态参考语法,recipe 声明后按需读)
|   |   `-- A3-emotional-levers.md          (5 情绪杠杆,recipe 声明后按需读)
|   |-- recipes/                            (场景配方,按 brief 关键词只读 1 个)
|   |   |-- nature.md                       (自然/动物/治愈,~4KB)
|   |   |-- lifestyle.md                    (生活/质感/氛围/节日,~4KB)
|   |   |-- portrait.md                     (人像/穿搭/时尚,~4KB)
|   |   |-- food.md                         (美食/ASMR/饮品,~4KB)
|   |   `-- commerce.md                     (商业带货 6 大品类,~10KB)
|   |-- templates/                          (即用模板,按需;非横切原语)
|   |   `-- 3-sets.md                       (4 套可套 prompt 模板:人像/风景/i2v/古风)
|   `-- image/                              (图片专属,独立于视频)
|       |-- I1-image-methodology.md         (图片方法论:创意层+风格层,14.5KB)
|       `-- I2-image-example.md             (图片实例)
|-- examples/                               (实例,按需;按 brief 关键词只读 1-3 个)
|   |-- nature-fog-forest.md                (自然·骨架 B,默认入口)
|   |-- nature-pet.md                       (宠物·骨架 A)
|   |-- lifestyle-coffee.md                 (晨光·骨架 B)
|   |-- lifestyle-festival.md               (节日·骨架 B)
|   |-- portrait-magazine.md                (杂志·骨架 B,强 i2v)
|   |-- portrait-ancient.md                 (古风·骨架 B)
|   |-- food-cooking.md                     (烹饪·骨架 A,无 BGM)
|   |-- food-asmr.md                        (ASMR·极慢,1/4x)
|   |-- commerce-phone.md                   (数码带货·骨架 A,合成器电子)
|   `-- commerce-beauty.md                  (美妆带货·骨架 A,环形灯)
|-- core/
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

