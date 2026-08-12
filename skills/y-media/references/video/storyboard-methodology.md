# 分镜方法论 · Storyboard Methodology — Creative Layer

本参考文档定义 Skill 自有的创作层:如何把收集到的 brief 变成一份具体的分镜文档和可直接提交的视频 prompt。它是一套通用的、与品类无关的短视频方法论(带货、种草、品牌故事、产品演示、教程、ASMR、情感叙事等)。它受 `ecom-video-generation` 插件所用的带货视频规划方法启发;针对 y-media 工作流、其已注册的 Providers 及其非商业用途做了重写和简化。

Core 永远不会消费本文件。Skill 在 Step 3(Plan,规划)读取它,产出分镜文档,然后抽取 prompt 并通过 core 提交。

## 五条核心原则 (R1-R5) — 先读

这五条原则把电商短视频规划的经验浓缩成锋利的决策规则。它们适用于 y-media 产出的**每一支**视频,无论是否商业 — 这就是 Skill 避开最常见失败模式的方式。

| # | 原则 | 展开 |
| --- | --- | --- |
| **R1** | **一次定路径,然后坚定执行**:尽早选剪辑 vs 生成;不要在段中切换(生→剪→生 = 主体漂移 + 成本翻倍) | §1.2 |
| **R2** | **故事驱动,而非清单罗列**:把参数装进骨架 A/B/C,以叙事方式交付;1 段 ≤ 1-3 个关键点 | §2, §6 |
| **R3** | **视听双轨**:① 字幕可选(若画面承载 70% 的信息,质感/ASMR/情感类可省略);若使用,锁定一套风格;② 三层音频(人声 · 环境音 · BGM)必须全部设计,绝不依赖模型的默认背景 | §4, §5 |
| **R4** | **7 秒内回收钩子**:视觉爆发或情绪爆发,二选一;7 秒后完播率下降 | §2 |
| **R5** | **零错字、品牌名逐字**:品牌名/型号/成分名逐字核对;若用户给了官方拼写,必须原样使用(大小写·空格·标点) | §5 文案规则 |

> **为什么是这五条**:它们是把泛泛的 视频生成 变成 有人看完、有人下单 的视频 的规则。每一条都是 Skill 必须显式做出的单一二元决策,而不是顺带吸收的默认行为。

## 0. 配套参考

本方法论定义规则;配套参考提供具体参数、因子阈值、场景模板和工具。填写任何一列之前,先读相关的配套参考。

### 0.1 顶层(通用,跨模块)

| 配套参考 | 用途 | 何时读 |
| --- | --- | --- |
| [../cinematography-reference.md](../cinematography-reference.md) | 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值 | 填写分镜表每一列时取词 |
| [../influence-factors.md](../influence-factors.md) | 视频生成影响因子 F1-F12(带权重评分卡):每个因子的有效填写阈值与失控修复 | 判断"填到什么程度才有效"时查 |
| [t2v-model-capability.md](t2v-model-capability.md) | t2v 模型能力边界 M1-M6 + 展示层vs执行层对照表 + 时间表达方式 | 写 prompt 前必读,决定哪些参数进 prompt、哪些移出 |

### 0.2 video/(分镜模块)

| 配套参考 | 用途 | 何时读 |
| --- | --- | --- |
| [granularity-scale.md](granularity-scale.md) | 颗粒度标尺:展示层/执行层分工 + 12字段抽象→具体对照 | 判断"填到什么颗粒度"时查 |
| [prompt-structure-formula.md](prompt-structure-formula.md) | prompt 写作骨架:八要素+五定法+角色四层+场景三层+拼接顺序模板 | 拼接 prompt 时按此结构 |
| [cinematic-shot-library.md](cinematic-shot-library.md) | 14 镜头库(6 运镜组合+4 高级术语+4 构图技法)+ 镜头选择决策表 | 选运镜时查 |
| [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md) | 避坑三陷阱(物理互斥/静止动词/光影缺失)+ 5 铁律 | 写完后自检 |
| [negative-prompt-methodology.md](negative-prompt-methodology.md) | `negative_prompt` 字段方法论:与 Hard Constraints 的分工、何时必填、内容来源、提交前自检 | 视频侧车有 `## Negative Prompt` 字段时查 |
| [storyboard-reality-calculator.md](storyboard-reality-calculator.md) | 镜头现实性决策 + Node 帧数校验 + Provider 能力速查 | 提交前用 |
| [storyboard-example.md](storyboard-example.md) | 完整填好示例(晨雾森林雄鹿与幼鹿) | 颗粒度校准锚,写新分镜前必读 |

### 0.3 video/scenes/(场景矩阵)

| 配套参考 | 主体类型 |
| --- | --- |
| [scenes/scene-nature-animal.md](scenes/scene-nature-animal.md) | 自然/动物/治愈 |
| [scenes/scene-lifestyle-aesthetic.md](scenes/scene-lifestyle-aesthetic.md) | 生活/质感/氛围 |
| [scenes/scene-portrait-fashion.md](scenes/scene-portrait-fashion.md) | 人像/穿搭/时尚(强 i2v) |
| [scenes/scene-food-asmr.md](scenes/scene-food-asmr.md) | 美食/ASMR(声音密集) |
| [scenes/scene-commerce-product.md](scenes/scene-commerce-product.md) | 商业带货/产品演示(6 大品类) |

### 0.4 video/templates/(模板与速配)

| 配套参考 | 用途 |
| --- | --- |
| [templates/templates-3-sets.md](templates/templates-3-sets.md) | 3 套即用 prompt 模板(人像/风景/i2v)+ 多镜头示例 |
| [templates/scene-quick-match.md](templates/scene-quick-match.md) | 场景速配表 + 主体描述速查 + 钩子速查 |

## 1. Brief 与分镜文档

把 brief 解析为三个槽位,并用明确的默认值补缺(在文档表头的 `默认假设` 行记录):

| 槽位 | 需要确定什么 | 未知时的默认值 |
| --- | --- | --- |
| 主题/产品 | 主体,1-3 个关键点或卖点,可用的素材 | 取自请求;确实缺失时问一次 |
| 人群/受众 | 受众,他们的痛点或兴趣 | 该主体类型的常见受众 |
| 目标 | 认知(brand) / 兴趣(seeding) / 转化(conversion) | 根据请求决定,无固定默认值 |

目标决定基调、节奏和字幕路线。三种目标地位平等;这里不预设商业场景。

每段视频产出一个 Markdown 文件,保存在预期输出旁边:

```text
<name>.video-brief.md
```

其中 `<name>` 与视频的 `output.filename` 主干一致。该文档兼作交付侧车:它从创作计划开始,视频交付后追加 `Generation` 段。完整的、符合规范的示例见 [storyboard-example.md](storyboard-example.md) — 产出新分镜前先复习它。它恰好包含三个部分:

1. **视频主要目标** — 一行:`产品/主题 × 人群 × 目标(认知/兴趣/转化) × 骨架(A/B/C) × 时长 × 画幅(默认9:16竖屏)`。
2. **分镜表格** — 每镜一行,列定义见 §3。表格前在表头锁定以下决策:
   - `默认假设`:用户未提供时填写的默认值(无人出镜、无现有素材 → 纯生成,等等)。
   - `音频策略`:按 §4 推导出的一行。
   - `美学母体`:每镜都锚定的色彩/材质/光影基底(例如 冰蓝冷调 → 暖色烹饪光 → 品牌红白)。
   - `视听路线`:字幕路线,`含字幕` 或 `无字幕`,整段锁定(§5)。
3. **视频 prompt** — 一个代码块中的完整多镜 prompt,外加 BGM 备注(§6)。

### 1.2 路径判定:剪辑 vs 生成(规划阶段必做 · 决策一次后贯穿整片)

R1 要求"早定路径,生剪不混",这里给出**二元决策表**。在填写分镜表前**先回答两个问题**:

| 判定问题 | 是 → 路径 | 否 → 路径 |
| --- | --- | --- |
| Q1. 主体是否需要真实人出镜(主播/演员/客户本人) 或 是否已有可用的实拍素材(产品 demo / 工厂线 / 仓库 / 街拍) | **剪辑路径(edit)** — 走 CapCut / iMovie / Premiere / ffmpeg,加字幕 + BGM + 调色;**y-media 不生成视频**,只产 storyboard + 剪辑菜谱 | 进入 Q2 |
| Q2. 主体是产品/概念/角色/场景(无实拍可用),且接受 AI 生成美学 | **生成路径(generate)** — 走 t2v / i2v / kf2v,§2-§6 完整流程 | — |

> **决策一次后,整条视频全程不混用**。禁止:同一段前 5s 走 t2v、后 5s 走实拍拼接;若必须拼,按"分段路径"标记,每段独立决策、独立走 Provider 路由、独立 sidecar 记录。

#### 1.2.1 三条路径详解

| 路径 | 触发 | 主体保真度 | 成本 | 输出 | y-media 内部动作 |
| --- | --- | --- | --- | --- | --- |
| **G 纯生成** | 无实拍/无真人/IP 角色/概念演示 | 取决于 i2v 一致性 + prompt 锁定 | 1 段 1 调用 | 视频 mp4 | §2-§6 完整 storyboard + prompt → Provider |
| **E 纯剪辑** | 已有实拍素材/真人出镜/产品 demo 实拍 | 与素材完全一致(无漂移) | 0 调用,1 剪辑工程 | 视频 mp4 + 工程文件 | storyboard 只含 §3 镜头表 + §6.1 接续菜谱;prompt 段标 `clip-edit` 跳过 Provider |
| **H 分段混合**(谨慎) | 既有实拍(产品特写)又有 AI 段(场景氛围/概念演示) | 段内一致即可 | 多段多调用 | N 段 mp4 + 拼接菜谱 | 每段独立决策 G 或 E,sidecar 标注 `段-1/段-2/...` 各自路径,§7.1 split-or-merge 走全流程 |

#### 1.2.2 路径判定反模式(抢决策 / 漂移 / 成本翻倍)

- ❌ **生 → 剪 → 生** 中段切换:主体漂移(同一角色脸/手/颜色变),且每个切换点都会破坏 §3 audio 节点;R1 显式禁止。
- ❌ **默认走 G 不问用户**:Q1 是的(用户已有 demo 实拍)但 Skill 没问就硬生成,既费额度又丢失实拍质感。
- ❌ **默认走 E 不问用户**:Q1 否的(用户没有素材)但 Skill 假设有,直接给空菜谱。
- ❌ **"剪辑工具里我也能拼"** 作为理由抢 H 决策:用户在 Brief 阶段已声明"全 AI 出片",H 路径就不该出现。
- ❌ **路径不写进 sidecar**:后续追溯时无法判断某段是生成的还是实拍,re-edit 时易错。

#### 1.2.3 路径结果写入 storyboard 表头

Brief header 必填一行 `生成路径`,三选一:

```
生成路径: G (纯生成,默认推荐)  |  E (纯剪辑)  |  H (分段混合,需分段子路径)
```

H 路径额外在分镜表前加 `段-1/段-2/...` 分组,每组标子路径;拼接菜谱按 §7.1 split-or-merge 流程走。

## 2. 叙事骨架(Narrative Skeleton)

先选一个骨架;骨架决定镜头数、节奏和字幕路线。

| 骨架 | 用途 | 镜头数 | 单镜时长 | 字幕 |
| --- | --- | --- | --- | --- |
| **A: showcase** (测评/利益/ASMR/变装/演示) | 信息密集、节奏快 | 9-12 | 1.0-2.5s | 含字幕 |
| **B: narrative** (情感/故事/溯源/品牌) | 情绪弧线、节奏较慢 | 5-8 | 2.0-5.0s | 无字幕或极简 |
| **C: 共鸣叙事** (共情/自嘲/治愈/打工人式) | 情绪共鸣;共情→自嘲→转折→金句 | 6-10 | 2.0-4.0s | 含字幕 |

适用于所有骨架的规则:

- 每 15s 保持 **1-3 个关键点**;再多就需要拆段(§7)。
- **前 7 秒内回收钩子**(视觉爆发或情绪爆发),否则完播率下降。
- 在封面级镜头上标 `★`;一个 15s 段至少 5 颗,最少每 3s 一颗。

### 2.0 镜头数:规划层 vs 执行层(⚠️ 关键)

上面的镜头数(5-12)是**规划层**数字,用于分镜表和人工评审。**执行层**镜头数 — t2v 模型在一次直出生成中实际能渲染的镜头数 — 要小得多。见 [t2v-model-capability.md](t2v-model-capability.md) M1。

| 生成模式 | 15s 内最大镜头数 | 最短单镜时长 | 时间表达 |
| --- | --- | --- | --- |
| **单段直出 t2v**(y-media 默认) | 3-4 | ≥4s | 精确时间锚点(`0.0-5.0s`) |
| **多段生成 + 剪辑**(拆段 + 拼接) | 每段 ≤3 | 每段 ≥4s | 每段独立 |
| **剪辑式密集切**(骨架A 带货) | 9-12(仅规划层) | 1.0-2.5s | 需要多段生成 + 人工剪辑 |

**规则**:对 15s 单段直出,在分镜表里写 5-8 镜(规划层),但在 prompt 中**把它们合并为 3 个时间锚段**(执行层)。直接把 6 镜写进 prompt 会导致镜头塌缩(M1)— 模型只渲染 1-2 个景别。

三种时间表达方式(见 [t2v-model-capability.md](t2v-model-capability.md) §3):

| 方式 | 强度 | 写法 | 适用 |
| --- | --- | --- | --- |
| 精确时间锚点 | 最强 | `0.0-5.0s: ...` | 10-15s,3-4 镜 |
| 画面编号 | 中等 | `Scene 1: ...` | 5-10s,2-3 镜 |
| 动作流连接词 | 弱/自然 | `then` / `suddenly` / `as` | ≤5s,1-2 镜 |

钩子模板(置于镜头表顶部作对照):

| 场景 | 开场视觉 | 文字/音效 |
| --- | --- | --- |
| 测评/演示 | 疑问前置字幕 + 产品全景 | "这个很火的到底好不好用?" |
| 利益/转化 | 价格锚点 + 产品硬切 | 大字幕 "3.9元包邮" |
| ASMR/感官 | 感官特写 + 撕包装/切开音效 | 无口播,全声音 |
| 溯源/故事 | 场景直入 + 人物出镜 | "刚下火车来看娃" |
| 品牌/形象 | 氛围场景 + 品牌元素 | slogan 前置 |
| 共情/自嘲 | 疲惫日常直入 + 内心 OS 字幕 | "上辈子到底造了什么孽" |

### 2.1 骨架C 起承转合与情绪色温对撞

共鸣叙事(骨架C)在表头锁定四条情绪拍, 即起承转合; 每拍决定节奏、美学母体与音频节点:

| 拍 | 情绪 | 时长占比 | 职责 | 音频 |
| --- | --- | --- | --- | --- |
| 起 | 共情/痛点 | ~25% | 真实疲惫细节直入, 7s 内出钩子 | 环境音 + 纯OS心声 |
| 承 | 自嘲/吐槽 | ~35% | 荒诞细节堆叠, 节奏渐快 | BGM 鼓点渐重, 音画卡点 |
| 转 | 治愈/温柔 | ~25% | 情绪软着陆, 画面转亮 | BGM 切换, 前 0.5-1s 静音留白 |
| 合 | 金句/收尾 | ~15% | 黑底金句字幕收束 + 互动设问 CTA | BGM 淡出只留环境音 |

**情绪色温对撞** 是骨架C 的美学母体默认: 压抑段用冷灰蓝+荧光白(现实感), 治愈段用暖黄橙(反差治愈); 换色点正好落在转折拍, 光影同步从硬冷光过渡到柔暖光。每镜锚定所属拍的色板, 过渡只做一次有意的转场, 不做逐镜漂移。多段交付(30s 拆 15+15, 60s 拆四段)按拍分界, 段间用 §6.1 接续, 每段仍独立满足 §2-§5。

### 2.2 骨架速选(决策树,2 步定位)

当不确定 A/B/C 用哪个时,按这个决策树走:

```
Step 1: 目标是否是"转化/带货/强信息"?
   是 → 骨架A (showcase · 密信息快节奏)
   否 → 进入 Step 2

Step 2: 主体是否有"人物/故事/情绪弧"?
   是 → 骨架B (narrative · 慢切) 或 骨架C (共鸣叙事 · 起承转合)
        —— 情绪以"克制/美感"为主 → 骨架B
        —— 情绪以"共情/自嘲/金句"为主 → 骨架C
   否 → 骨架A (美学导向的 showcase 同样适用)
```

> **判断口诀**:看文案里的情绪词。"高性价比/爆款/必入"是 A;"治愈/静谧/品牌感"是 B;"上辈子/破防/家人们"是 C。**先定骨架,再填表**。

### 2.3 15s 段落规划指标(per-skeleton 速查)

> 这是 §2 骨架表的**规划层浓缩版**,填表前 30 秒对一遍,填完后 1 分钟自检。**展示层数字,执行层语义化降级**(见 [granularity-scale.md](granularity-scale.md))。

#### 2.3.1 per-skeleton 速查表(15s 默认段;非 15s 按比例)

| 指标 | 骨架A (showcase · 密信息) | 骨架B (narrative · 慢切) | 骨架C (共鸣 · 起承转合) |
| --- | --- | --- | --- |
| **镜头数(规划层)** | 9-12 镜 | 5-8 镜 | 6-10 镜 |
| **单镜时长** | 1.0-2.5s(密) | 2.0-5.0s(慢) | 2.0-4.0s(中) |
| **★ 密度(15s 段)** | ≥5 ★,每 3s 一颗 | ≥4 ★,首镜/中点/末镜必 ★ | ≥5 ★,四拍各 1 |
| **★ 分布** | 钩子镜 + 卖点镜 + 价格镜 + CTA 镜 + 1 个转场 | 钩子镜 + 关系镜 + 高潮镜 + 收尾镜 | 起/承/转/合 各 1 ★ |
| **7s 钩子位置** | 0-2s 钩子镜(疑问/价格/感官) | 0-3s 钩子镜(氛围/人物出场) | 起拍 0-2s(疲惫细节直入) |
| **7s 钩子形式** | 视觉钩(硬切) 或 字幕钩(疑问前置) | 视觉钩(氛围) 或 情绪钩(人物回头) | 视觉钩(疲惫日常) 或 情绪钩(OS 心声) |
| **段均运镜变化** | 4-5 种(快切需要) | 2-3 种(慢切克制) | 2-3 种(每拍 ≤1 种) |
| **段均字幕数** | 4-6 条(钩/卖点/数据/CTA) | 0-2 条(无字幕或极简) | 3-5 条(钩/转/合拍金句) |
| **音频节点** | 3-5 个(钩子音效+卡点+CTA) | 1-2 个(起/收) | 4 个(每拍 1 个情绪节点) |
| **主线 KPI** | 完播 + 点击转化 | 完播 + 互动(评论) | 完播 + 收藏 + 转发 |

> **注**:镜头数是**规划层**上限,执行层(prompt)需合并到 Provider 单段上限内的 3-4 个时间锚(见 [t2v-model-capability.md](t2v-model-capability.md) M1)。

#### 2.3.2 自检 4 问(填完表后逐条过)

1. **★ 密度达标了吗?** 15s 段 < 4 颗 = 信息密度不够,补一颗"卖点镜 ★"或"价格镜 ★"。
2. **7s 钩子是真的"钩"吗?** 钩子镜的视觉/字幕要能在 0.5s 内抓住注意力,不是"产品缓缓入画";不达标就重写钩子镜。
3. **每条 ★ 镜都有 ★ 应有的内容吗?** 一颗 ★ 至少包含 ① 主体清晰 ② 视觉重点 ③ 美学母体 ④ 可裁切为竖版封面。
4. **时长加和 == 目标时长?** 每镜时长 0.1s 精度,段总和 = 目标(15.0s / 18.0s / 30.0s);不匹配就调整最短或最长镜,不动骨架。

#### 2.3.3 非 15s 段的比例换算

| 目标时长 | 镜头数(规划层) | ★ 数 | 7s 钩子数 |
| --- | --- | --- | --- |
| 5s | 3-4 镜 | ≥2 | 1 |
| 10s | 5-8 镜 | ≥3 | 1 |
| 15s(默认) | 6-12 镜 | ≥4-5 | 1 |
| 20s | 8-14 镜 | ≥6 | 1-2(7s+14s) |
| 30s | 12-20 镜 | ≥8 | 2(7s+20s) |
| 60s | 24-40 镜 | ≥15 | 4(7s+20s+35s+50s) |

> 超过 Provider 单段硬上限时(查 `capability_limits[<capability>].maxSingleSegmentDuration`),走 §7.1 split-or-merge 流程,不要靠堆 30s 段实现。

## 3. 分镜表列(Shot Table Columns)

每一镜都要填满每一列。精确胜过散文;每列回答一个问题。

| 列 | 规则 | 示例 |
| --- | --- | --- |
| 镜号 | 从 `S01-01` 起 | S01-03 |
| 时长 | 精确到 0.1s;段总和与目标时长一致 | 1.8s |
| 景别与视角 | 景别 + 机位角度 | 微距特写,低角度仰拍 |
| 运镜 | 运镜 + 速度 + 方向;一镜至多 2 个动作 | 缓推,跟随虾仁滑落 |
| 光影 | 方向 + 色温 + 光比 + 光质 | 45°侧光,6000K,柔光高对比 |
| 色彩 | 主色 + 辅色 + 色调 | 青白+冰蓝,冷调 |
| 主体动作 | 具体、单一的动作 | 手撕开冷冻包装袋,冰块碎粒滑落 |
| 道具/环境 | 前景/中景/背景 三层; ≥3 可命名元素; 1 个光源; 背景加 1-2 个低速动态元素 | 前景冰块碎粒/中景包装袋/背景厨房台面虚化+水珠 |
| 音频三层 | ① 人声(有对白/OS心声/无对白) ② 环境音+关键音效点(镜次+时机+音效名) ③ BGM 节点 | (环境)撕包装"嘶啦"+冰块碰撞"咔啦"/(BGM)木吉他扫弦淡入 |
| 屏显字幕 | §5;仅在无字幕路线留空 | ①"这虾仁,也太鲜了!"·上1/3·弹入放大 |
| 视觉重点 | `★` = 封面级 | ★ |

环境真实感(任何上镜环境都适用 `3+1` 规则):`[具体场所] + [3 个可命名道具/纹理] + [1 个光源方向色温]`。避免纯渐变或空棚背景;加入生活痕迹,画面才不会冻住。每个场景从四种动态中选 **1-2 个缓慢的局部动态元素**:

| 动态类型 | 示例 |
| --- | --- |
| 人物动态 | 背景虚化人流走动 / 邻桌客人交谈 |
| 自然动态 | 纱帘轻飘 · 树影摇曳 · 水面波光 |
| 光影动态 | 光斑缓移 · 明暗呼吸 · 屏幕微闪 |
| 粒子动态 | 蒸汽升腾 · 尘埃浮动 · 水汽 |

### 3.1 颗粒度标尺(Granularity Scale)

每一列都必须填到下面的颗粒度。抽象形容词("暖光""柔和""自然")会失败,因为模型没有可锁定的参数。具体数值("4500K""光比2:1""-18dB")会成功,因为它们钉住了模型的输出。拿不准字段该多具体时,对照 [granularity-scale.md](granularity-scale.md) 看完整标尺,[../influence-factors.md](../influence-factors.md) 看阈值。

| 字段 | 抽象(拒绝) | 具体(接受) | 阈值来源 |
| --- | --- | --- | --- |
| 光影·色温 | "暖光" | `4500K` (具体K值) | F3 |
| 光影·光比 | "柔和" | `2:1` (数字比) | F3 |
| 光影·光质 | "好看的光" | `柔光` / `硬光` / `半硬` | F3 |
| 光影·光位 | "侧光" | `45°侧光` / `150°逆光` (角度) | F3 |
| 色彩·饱和 | "鲜艳" | `饱和度+10` (±数值) | F4 |
| 音频·音量 | "轻柔" | `-18dB` (具体dB) | F6 |
| 音频·BPM | "中速" | `95BPM` (数字) | F6 |
| 音频·音效 | "蹄声" | `嗒嗒` (拟声词) | F6 |
| 运镜·速度 | "缓慢" | `0.3m/s` (量化速度) | F2 |
| 主体 | "一匹小马" | `约6个月大的小马驹,棕白相间,鬃毛蓬松,四肢修长` (≥3特征) | F1 |
| 焦段 | "广角" | `16mm广角` / `85mm中焦` (等效mm) | F5 |
| 约束 | "要有高级感" | `24fps,快门180°,禁止文字` (可执行) | F10 |

#### 3.1.1 分镜表行内示例(11 列填好的参考行)

下面是分镜表一行填好后的样子(完整 6 镜见 [storyboard-example.md](storyboard-example.md) §2):

```
| S01-03 | 3.0s | 中近景·平视(机位与雄鹿肩同高) | 固定+微推(static + micro push,推程0.2m) | 顶光+侧补光·5000K·光比2.5:1 | 暖金+苔绿 | 雄鹿突然停下,回头凝望幼鹿,幼鹿抬头回应 | 前景:虚化蕨类/中景:雄鹿回头+幼鹿抬头/背景:虚化雾气+光柱 | (环境)树叶"窸窣"-26dB+鸟鸣-30dB·(BGM)钟琴轻入,-16dB,70BPM | — | ★ |
```

每一列都填了具体值:时长 0.1s 精度、景别+机位+角度、运镜英文+速度、光影四要素(光位+色温+光比+光质)、主色+辅色、慢动作连续动作、前/中/背景三层、音频三层+dB+BPM、无字幕(—)、视觉重点(★)。

经验法则:如果一个字段换成"等等"也不丢失信息,那它就太抽象了。用数字或具名术语重写。

#### 3.1.2 展示层 vs 执行层(Display layer vs Execution layer)

| 字段 | 展示层(分镜表,人读) | 执行层(prompt,模型读) | 降级规则 |
| --- | --- | --- | --- |
| **色温** | 4500K | `soft golden morning backlight` / `cool blue hour diffused light` | K值 → 光源描述 |
| **光比** | 3:1 | (删除)用光源方向替代: `rim/backlight with soft sky fill` | 数字 → 方向 |
| **光质** | 柔光 / 硬光 | `soft diffused light` / `hard direct light` | 保留语义词 |
| **光位** | 45°侧光 / 150°逆光 | `side light from the left` / `backlight from behind` | 角度 → 方位词 |
| **饱和度** | 饱和度+10 | (删除)用风格标签替代: `vibrant colors` / `muted tones` | 数字 → 风格词 |
| **音量** | -18dB | (移出 prompt,进 `Notes for downstream audio`) | 数字 → 删除 |
| **BPM** | 95 BPM | (移出 prompt,进 `Notes for downstream audio`) | 数字 → 删除 |
| **音效拟声** | 嗒嗒/唰/噗噗 | (移出 prompt,进 `Notes for downstream audio`) | 拟声词 → 删除 |
| **主体月龄** | 约6个月大 | `a 6-month-old ... foal` (保留,模型理解) | 数字描述保留 |
| **焦段** | 16mm-85mm | (作为风格参考保留) `shot on ARRI Alexa with shallow depth of field` | 焦段 → 摄影机 |
| **运镜速度** | 0.3m/s | (删除)用运镜语义替代: `slow` / `moderate` / `fast` | 数值 → 形容词 |
| **帧数** | 361 (8n+1,默认 15s) / 433 (8n+1,封顶 18s) | (不写进 prompt,进 API 参数) | 数字 → API参数 |
| **镜头数** | 6镜(规划) | 3时间段(执行) | 合并压缩 |

#### 3.1.3 执行层降级范例

| 展示层(分镜表) | 执行层(prompt) |
| --- | --- |
| `4500K` 清晨侧逆光 | `soft golden morning backlight from a low sun` |
| `光比 3:1` | (删,光源方向自带对比) `rim/backlight with soft sky fill` |
| `4800K 强逆光 发丝光勾边` | `strong backlight with rim light on hair, soft fill from sky` |
| `95 BPM 清新民谣吉他+钟琴` | (移出 prompt,进 `Notes for downstream audio`) |
| `-18dB BGM` | (移出 prompt,进 `Notes for downstream audio`) |
| `0.3m/s 缓推` | `slow dolly-in` |
| `16mm-85mm 焦段切换` | `shot on ARRI Alexa with shallow depth of field` |
| `约6个月大,棕白相间,鬃毛蓬松` | `a 6-month-old brown-and-white pinto foal with a fluffy mane` (保留) |

#### 3.1.4 三层划分总结

| 层 | 用途 | 读者 | 关键字段 |
| --- | --- | --- | --- |
| **展示层** | 分镜表 + 创作规划 | 人(导演/客户/归档) | 具体数字(K/dB/BPM/月龄/焦段/拟声词) |
| **执行层** | 提交给 t2v 模型的 prompt | 模型 | 语义化描述(soft golden / BBC Earth / slow dolly-in) |
| **音频笔记层** | 供下游音频制作 | 人(后期) | BPM/dB/拟声词/环境音优先级 |

**铁律**: 展示层的数字不写进 prompt(模型忽略 M4);执行层不写 dB/BPM(模型无效 M6)。

#### 3.1.5 自检(提交前)

- [ ] 展示层每列都填了具体数字或具名术语?
- [ ] prompt 中没有 K/dB/BPM/光比/拟声词数字?
- [ ] 音频信息在 `Notes for downstream audio` 段?
- [ ] 主体月龄/数字描述在 prompt 中保留?
- [ ] 焦段/速度数字已降级为语义词?

### 3.2 场景路由(Scene Routing)

填写完 brief(§1)后,在写分镜表之前先路由到场景模板。场景模板为常见非商业主体提供预制光影色板、音频皮肤、7s 高潮模式和 AI 生成禁区。若没有模板匹配,回退到通用 §2-§6 流程。

| 主体类型 | 模板 | 关键要点 |
| --- | --- | --- |
| 自然 / 动物 / 治愈系 | [scenes/scene-nature-animal.md](scenes/scene-nature-animal.md) | 骨架B慢切 + 无字幕 + 黄金时刻光 + 清新民谣BGM |
| 生活 / 质感 / 氛围 | [scenes/scene-lifestyle-aesthetic.md](scenes/scene-lifestyle-aesthetic.md) | 骨架B慢切 + 暖光系 + 暖民谣/钢琴 |
| 人像 / 穿搭 / 时尚 | [scenes/scene-portrait-fashion.md](scenes/scene-portrait-fashion.md) | **强 i2v** + 杂志/街头 + i2v 必填 |
| 美食 / ASMR | [scenes/scene-food-asmr.md](scenes/scene-food-asmr.md) | 微距+顶光+蒸汽 + 声音密集(进 Notes) |
| **商业带货 / 产品演示(6 大品类)** | [scenes/scene-commerce-product.md](scenes/scene-commerce-product.md) | **骨架A showcase + 含字幕 6 类全用 + R5 零错字铁律 + 合规清单**;美妆个护/服饰/家居/数码/母婴/通用 |
| 其他(科技/产品/抽象) | — | 按本文件通用流程,未来可扩展 |

## 4. 音频设计(Audio Design)

三层都要设计;绝不只依赖模型的默认背景音轨。

**人声** — 三选一:有对白(真人说话)、纯 OS 心声(内心独白,低沉/缓慢)、或无对白(改为加厚环境音 + 生理声,如 呼吸/衣物摩擦)。有对白时,写自然的台词:每 8-12 字一次换气, 关键词前微停, 尾字自然下沉, 避免播音腔。

**环境音/音效** — 每场景 2-3 个可识别的拟声词;明确标注关键音效点:`音效点(镜3·2.5s): 裙摆"沙沙"加重 3dB`。

**BGM** — 始终写明 4 个字段:风格(乐器/参考+BPM) + 情绪 + 入点/淡出时点 + 关键节点。把目标和 query 情绪映射为一种皮肤,绝不写通用的"轻音乐":

| 目标 | 服务 | 节奏 |
| --- | --- | --- |
| 转化 | 抓人→证明→催单 | 快, 90-130 BPM, 音画卡点 |
| 兴趣(种草) | 沉浸→共鸣 | 中, 75-100 BPM |
| 认知(品牌) | 审美→记忆 | 慢, 60-85 BPM, 情绪弧 |

| Query/场景情绪信号 | 风格皮肤 (示例) | BPM |
| --- | --- | --- |
| 食欲/鲜/香/爆汁 | 环境音为主,BGM 极淡 | ASMR 逻辑 |
| 燃/爽/开箱/真香 | 鼓点 build-up + drop | 110-140 |
| 甜/少女/约会/治愈 | 清新流行·木吉他·钟琴 | 90-110 |
| 高级/质感/氛围 | 钢琴独奏·氛围 pad | 60-80 |
| 温情/亲子/礼物 | 弦乐·钢琴·暖民谣 | 65-90 |
| 科技/参数/性能 | 合成器电子·脉冲音效 | 115-130 |

适用时,表头中每个杠杆各占一行:开场 3s 音频钩子, 音画卡点, 静音留白→爆点炸开, 声音记忆点, 情绪音量曲线。沉默是一种工具:情感反转前全断 0.5-1s, 数据字幕前 BGM 降 6dB+"叮", 质感片末镜 BGM 淡出只留环境音。

### 4.1 BGM 四字段行内示例(写入 `音频策略` 行)

BGM 行必须**只填 4 个字段**,缺一不可,顺序固定:`风格(乐器/参考+BPM) + 情绪 + 入点/淡出时点 + 关键节点`。详细反例见 [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md) §1.2 静止动词陷阱。下面是 [storyboard-example.md](storyboard-example.md) 的写法:

```
清新民谣(木吉他+钟琴,95BPM,无歌词) · 轻快治愈 · 0s入3s到-16dB · 镜3副歌推满·镜6淡出至-30dB
```

| 字段 | 本例写法 | 为什么这样写 |
| --- | --- | --- |
| 风格(乐器/参考+BPM) | `清新民谣(木吉他+钟琴,95BPM,无歌词)` | 乐器 + 参考曲风 + 数字 BPM,无歌词声明,模型/音频师都能立刻定位 |
| 情绪 | `轻快治愈` | 一个情绪标签,不要堆叠多个("悲壮+燃+治愈"会自相矛盾) |
| 入点/淡出时点 | `0s入3s到-16dB` | 入点 + ramp 时长 + 目标 dB;淡出对称写在末尾,留可执行余量 |
| 关键节点 | `镜3副歌推满·镜6淡出至-30dB` | 写明 BGM 在哪一镜推满/哪一镜淡出,与分镜表镜号一一对应 |

**常见错误写法**(直接对位修):
- "轻音乐" → 缺风格 + BPM + 情绪,无法执行。
- "治愈系钢琴曲" → 缺 BPM、入点、关键节点,信息密度不足。
- "开头慢慢进来,然后在副歌推满" → "进来""推满"是**静止动词**,模型/音频师都不知道具体多少秒/多少 dB;必须改 `0s入3s到-16dB`。
- "用《Faded》那种风格" → 引用了但没写 BPM,且《Faded》有版权,生产环境禁用;改 `合成器电子·脉冲(类似《Faded》但无版权),120BPM`。

### 4.0 商业目标定风格(3 步从"我要卖货"到 BGM 4 字段)

> 写音频策略前,先把"目标"翻译成"BGM 皮肤"。下面这套是从 e-commerce 实战里浓缩的**目标→风格决策流**,任何商业类视频(无论是 ai 出片还是人工剪辑)都按这 3 步走。

**Step 1 · 锁定商业目标(三选一,只选一个主目标)**

| 目标 | 含义 | 关键动作 | 主线 KPI |
| --- | --- | --- | --- |
| **认知(品牌)** | 让用户记住"是谁" | 审美/记忆/品牌资产 | 完播 + 关注 |
| **兴趣(种草)** | 让用户觉得"我想要" | 沉浸/共鸣/向往 | 收藏 + 互动 |
| **转化(带货)** | 让用户立刻"买它" | 抓人→证明→催单 | 点击 + 转化 |

**Step 2 · 锁定情绪信号(把 query 转成皮肤关键词)**

| 情绪信号词 | 皮肤 | BPM | 适用 |
| --- | --- | --- | --- |
| 食欲 / 鲜 / 香 / 爆汁 / 烫 | ASMR · 环境音为主,BGM 极淡 | — | 美食/烹饪 |
| 燃 / 爽 / 开箱 / 真香 / 低价 | 鼓点 build-up + drop | 110-140 | 测评/开箱 |
| 甜 / 少女 / 约会 / 治愈 | 清新流行·木吉他·钟琴 | 90-110 | 美妆/穿搭 |
| 高级 / 质感 / 氛围 / 静谧 | 钢琴独奏·氛围 pad | 60-80 | 品牌/形象 |
| 温情 / 亲子 / 礼物 / 陪伴 | 弦乐·钢琴·暖民谣 | 65-90 | 母婴/节日 |
| 科技 / 参数 / 性能 / 硬核 | 合成器电子·脉冲音效 | 115-130 | 3C/科技 |
| 共情 / 自嘲 / 治愈 / 破防 | 弱起钢琴 + 中段弦乐推进 + 末段鼓 | 70-90 | 情感/故事 |

**Step 3 · 输出 BGM 4 字段(填入 `音频策略` 行)**

按 §4.1 的固定顺序:`风格(乐器/参考+BPM) + 情绪 + 入点/淡出时点 + 关键节点`。3 步合起来的工作流:

```
目标: 转化(带货)
情绪信号: 燃 + 真香 + 低价
↓ BGM 皮肤: 鼓点 build-up + drop
↓ Step 3 翻译成 4 字段:
电子鼓点(底鼓+军鼓+hat,120BPM,无歌词) · 抓耳/快节奏 · 0s入2s到-14dB · 镜2 buildup·镜5 drop·镜8 末拍卡点
```

> **自检 3 问**:① 4 字段都填了?② 没有任何静止动词("慢慢""推满""进来")?③ 关键节点是否对齐分镜表的镜号?

### 4.2 五情绪杠杆(让视频从"看"到"记住"的 5 个开关)

> 这 5 个杠杆是 §4 表格底部"Levers worth one line each"的具体化。每条杠杆都是**单条规则**+**触发条件**+**使用样例**。Brief 阶段判断哪些杠杆对当前视频有效,选 1-3 个写入音频策略。

| # | 杠杆 | 触发条件 | 写法 | 样例(转化) |
| --- | --- | --- | --- | --- |
| **L1** | **开场 3s 音频钩** | 需要在静音外放场景下抓住耳朵 | 0-3s 出现"叮""嗒"等高识别音效 + BGM 同步淡入 | 镜1 开篇"叮" + 鼓点同步-14dB 推满 |
| **L2** | **音画卡点** | 节奏密集 / 卖点镜 / CTA 镜 | BGM 鼓点/重音与镜头切换严格对齐(同帧 ±0.1s) | 价格镜"99元"字幕与底鼓同帧闪入 |
| **L3** | **静音留白 → 爆点炸开** | 情绪反转 / 数据高能 / 卖点爆点 | 爆点前 0.5-1s 全断(BGM + 环境音),爆点镜全频推满 | 价格"3.9元"前 0.8s 全断 → "叮"+"3.9元"闪入 |
| **L4** | **声音记忆点** | 需要复播/收藏/品牌联想 | 1-2 个高频出现的"声音 logo"(短音效/旋律片段) | 每次价格出现都配"叮"+"嗒嗒"两连击 |
| **L5** | **情绪音量曲线** | 多段情绪 / 骨架C 必备 | BGM dB 随拍次变化:起-20dB → 承-16dB → 转-22dB(回落)→ 合-14dB(推满) | 骨架C 四拍音量曲线如上 |

**速选流程**(避免堆 5 个全用):
1. 目标 = 转化 → L1 + L3 + L4 优先
2. 目标 = 兴趣 → L2 + L4 优先
3. 目标 = 认知 → L1 + L5 优先
4. 骨架C → L5 必用(情绪曲线)
5. 留 1-2 镜空白(不放杠杆),让画面说话

### 4.3 自然口条对照(避免播音腔,让对白"像人在说话")

> 当视频选"有对白"路径(主播/演员/客户),口条的设计直接决定可信度。播音腔会立刻让用户跳戏,本节给出 4 条**自然口条规则 + 反例对照**。

**规则 1 · 每 8-12 字一次换气(避免"念稿感")**

| ❌ 播音腔 | ✓ 自然口条 |
| --- | --- |
| "今天给大家推荐一款我们家的明星单品" (16字不换气) | "今天给大家推荐一款, / 嗯,就是我们家的明星单品" (9字换气) |
| "这个价格真的是全网最低" (12字) | "这个价格, / 嗯,真的 / 是全网最低" (5字一次停顿) |

**规则 2 · 关键词前微停(让关键词被听到)**

| ❌ 平铺直叙 | ✓ 关键词前置停顿 |
| --- | --- |
| "三块九包邮到家" | "三块九, / 包邮到家" ("三块九"前停 0.3s) |
| "这个材质是纯棉的" | "这个材质, / 是纯棉的" ("纯棉"前轻顿) |

**规则 3 · 尾字自然下沉(避免上扬的"问号腔")**

| ❌ 上扬尾字 | ✓ 下沉尾字 |
| --- | --- |
| "你觉得怎么样?" (尾字上挑) | "你觉得怎么样~?" (尾字下沉 + 语气词) |
| "家人们冲不冲?" | "家人们,冲不冲?" (尾字下沉 + 短逗号) |

**规则 4 · 拟声词+语气词(让对白有"人味")**

| ❌ 无情绪修饰 | ✓ 有情绪修饰 |
| --- | --- |
| "这个味道很好" | "这个味道,啧~真的 / 是绝了" (拟声+停顿) |
| "我不知道怎么形容" | "哎呀,这个怎么形容呢~" (起手"哎呀"+反问) |

**口条节奏参考(8-12s 镜头容量)**:

| 镜头时长 | 字数 | 节奏 | 适用 |
| --- | --- | --- | --- |
| 2.0s | 5-7 字 | 快切速说 | 卖点镜/价格镜 |
| 3.0s | 8-12 字 | 中速带停顿 | 主体介绍/利益点 |
| 4.0s | 13-18 字 | 慢速带情绪 | 故事/共情 |
| 5.0s | 20-25 字 | 慢速 + 拟声 | 暖场/口播头部 |

> **提示词里的口条**:口条节奏建议写进 storyboard 的`音频策略` 注释行(不写进 t2v prompt,因为视频生成模型对口型的支持因 Provider 而异);真人出镜时由主播/演员按此执行。

### 4.4 静音法则(沉默是一种工具,不是"忘了加音频")

> 静音不是"漏 BGM",而是刻意的音频设计动作。**3 种静音 + 1 个反模式**。

**M1 · 情绪反转前全断(0.5-1s)**

用途:情感/数据/价格爆点前的张力堆积。

写法:在 storyboard 音频策略行追加 `镜N 前 0.5-1s 全断`。

样例:`镜3 前 0.8s 全断 → 镜4 价格"3.9元"推满`。

**M2 · 数据字幕前 BGM 降 6dB + 短音效**

用途:数据/卖点/规格前要让字幕被"看到 + 听到"。

写法:`BGM 降 6dB + "叮"`。

样例:`镜5 数据字幕 "1mm 超薄"前 BGM 降 6dB + 短"叮"`。

**M3 · 质感片末镜只留环境音**

用途:品牌/形象/情感类末镜,BGM 淡出只留环境音,留余韵。

写法:`末镜 BGM 淡出至 -∞,只留环境音 -30dB`。

样例:`末镜 钟琴淡出,只留鸟鸣 -30dB`。

**反模式 · 全片无静音(从第一秒到最后一秒 BGM 不停)**

- ❌ 看完后观众"听不见"任何情绪节点,信息密度被 BGM 抹平
- ❌ 价格/数据/CTA 等关键信息被 BGM 盖住
- ❌ 完播率掉 30-50%(典型症状:开头 5s 留存高,但 7-15s 留存断崖)

**自检**:15s 段至少 1 处静音/降 BGM;30s 段至少 2 处;质感片至少 1 处末镜静音。

## 5. 字幕路线(Subtitle Route)

决策一次,并在表头锁定。

- 信息流投放/转化 或信息密集型内容 → **含字幕**(很多播放是静音的;字幕承载信息)。
- 质感/情感/ASMR/品牌 → **无字幕或极简 (≤2 条)**。当画面已承载 70% 的信息时,字幕就是噪音。

六种字幕类型(一段不必全用):

| 类型 | 位置 | 内容 |
| --- | --- | --- |
| ① 钩子 | 0-2s | 痛点问句 / 悬念 / 反常识数据 |
| ② 数据/卖点 | 核心镜 3-7 | 具体数字+单位,避免模糊表述 |
| ③ 信任背书 | 中后段 | 品牌/成分/资质/产地/销量 |
| ④ 行动号召/slogan | 末镜 | A: 指令+利益+紧迫 / B: slogan 或情感 tag / C: 互动设问(骨架C 收尾) |
| ⑤ 氛围/口播同步 | 全片 | 口播关键词高亮 |
| ⑥ 金句/治愈收尾 | 末镜或黑屏 | 情绪总结句, 骨架C 合拍必用; 黑底白字+关键词黄底高亮 |

整段锁定 5 项样式:字体族(一个家族)、色板(≤2 色;数据卖点常金黄加粗;金句黑底白字+关键词黄底高亮)、位置(按类型)、动画(1-2 种)、描边/阴影(统一)。动效按三阶段设计 — 入场 (0.2-0.4s: 弹入放大/上滑淡入/逐字打字) · 停留 (1-2s) · 出场 (缓淡出/下滑)。关键字幕(钩子/数据/CTA)配一个短音效,例如 `"叮",前0.1s背景降6dB反衬`。

文案规则:品牌名/型号/成分名零容错 — 逐字取自用户或向用户确认;每行 ≤12 字,超长拆分;数字/单位/品牌名用英文引号包裹,让模型逐字保留;避免绝对化表述;目标为转化时,行动号召要带紧迫感(仅限今日/前100名)。

### 5.0 动效设计规范(三阶段 + 6 种入场 + 3 类节奏)

> 字幕**不只是字**,动效决定了字幕的"被注意到度"。同一句字幕,弹入放大 vs 缓慢淡入,完播率能差 30%。

**三阶段时间分配**(默认 1.5-2.0s 总寿命):

| 阶段 | 时长 | 职责 | 反例 |
| --- | --- | --- | --- |
| **入场** | 0.2-0.4s | 抓住注意力,让用户"看见" | 入场>0.6s = 慢吞吞,丢钩子 |
| **停留** | 1.0-1.8s | 让用户"读懂" | 停留<0.8s = 没看清;停留>2.5s = 占画面 |
| **出场** | 0.2-0.4s | 干净离场,不抢下一镜 | 出场>0.6s = 拖泥带水 |

**6 种入场动效速查**(挑 1-2 种,全段统一):

| 动效 | 视觉感受 | 适合字幕类型 | 风险 |
| --- | --- | --- | --- |
| **弹入放大** (scale 0.7→1.0) | 强注意力,适合钩子/CTA | ① 钩子 ④ CTA | 频繁用会审美疲劳 |
| **上滑淡入** (translateY +20px→0, opacity 0→1) | 自然,适合卖点/数据 | ② 数据 ③ 背书 | 视觉冲击力弱 |
| **逐字打字** (typewriter, 一字一字出) | 节奏感,适合口播同步/金句 | ⑤ 口播 ⑥ 金句 | 不适合长句(>12字) |
| **硬切闪入** (瞬时出现,无渐变) | 强冲击力,适合价格/数字 | ② 价格(转化类) | 用多会"吵" |
| **左滑飞入** (translateX -100%→0) | 横向节奏,适合横向排版 | ② 数据/横向排版 | 竖屏慎用 |
| **黑底白字闪出** (背景淡入+字) | 强对比,适合金句/合拍 | ⑥ 金句(骨架C 合) | 仅末镜或合拍用 |

**3 类出场**(默认统一,不要混):

| 出场 | 适用 | 反例 |
| --- | --- | --- |
| **缓淡出** (opacity 1→0) | 通用默认 | — |
| **下滑淡出** (translateY 0→+20px, opacity 1→0) | 与"上滑淡入"对称 | 钩子镜慎用,会冲淡钩子 |
| **直接消失** (无渐变,瞬间移除) | 黑底金句/数据卡片 | 普通字幕禁用,太突兀 |

### 5.1 音效设计规范(让字幕"被听到")

> 字幕的核心功能之一是"抢静音播放的耳朵"。下面 5 条规则来自 e-commerce 实战,直接给可执行清单。

**S1 · 关键字幕配短音效**——为"被看到"+"被听到"双通道刺激。

| 字幕类型 | 配音效 | 写法 | 时机 |
| --- | --- | --- | --- |
| ① 钩子 | "叮"(短促) | 前 0.1s 响 | 入场同帧 |
| ② 数据/卖点 | "嗒"(清脆) | 前 0.1s 响 | 入场同帧 |
| ③ 信任背书 | "叮"低八度 | 与"背书"对齐 | 入场后 0.1s |
| ④ CTA | "叮"+"嗒"两连击 | 与"CTA"对齐 | 入场前 0.05s |
| ⑥ 金句 | 无(留白) | — | 静音法则 §4.4 M3 |

**S2 · 音效与画面/字幕同帧**(±0.1s 内)——不然后期剪辑对不上。

写法:在 storyboard 音频策略行写 `镜N 数据字幕"1mm"前 0.1s "叮"`。

**S3 · 同一字幕不要重复音效**——重复=廉价,只给关键字幕(L1+L3+L4 杠杆)配音效,普通字幕走默认 BGM 节奏。

**S4 · 价格/数据爆点**——必配音效,且要"先断后响"。

写法:`价格"3.9元"前 0.5-1s 全断 → "叮"+"3.9元"同帧`。(即 §4.4 M1 + 本节 S1 联动)

**S5 · BGM 降 6dB 反衬**——音效响起时,同步把 BGM 音量降 6dB(约一半),让音效凸显;0.3-0.5s 后 BGM 自动恢复。

写法:在音频策略行写 `镜N 字幕"叮"前 0.1s BGM 降 6dB,0.3s 后恢复`。

### 5.2 commerce 增强版(转化类视频的 5 项强制)

> commerce mode(§1.1)在 §5 的基础上有 5 项强制动作,确保转化类视频"字幕+音效"配齐。

| # | 强制项 | 含义 | 反例 |
| --- | --- | --- | --- |
| **C1** | **6 类字幕全用** | 钩/数据/背书/CTA/口播/金句(口播类用⑤) 全部上场 | 只用钩子+CTA = 信息不足 |
| **C2** | **卖点字幕配音效** | ② ③ 类字幕 100% 配 "叮"/"嗒" | 卖点字幕无声 = 转化率掉 20%+ |
| **C3** | **价格爆点前全断** | ④ CTA 类含价格时,前 0.5-1s 全断(M1) | 平铺直叙的价格 = 不被听到 |
| **C4** | **品牌名逐字渲染** | 品牌名/型号/成分/SPF 用引号 `"ESTĒE LAUDER 雅诗兰黛"` 写入 prompt | 品牌错字 = 信任崩盘 |
| **C5** | **字幕节奏与 BGM 鼓点同帧** | 卖点镜/价格镜字幕入场与 BGM 鼓点同帧(±0.1s) | 字幕比鼓点晚 = 不抓人 |

**commerce 字幕 5 风格锁定**(scene-commerce-product.md §7 的简化版):

| 字段 | 锁定值 | 适用 |
| --- | --- | --- |
| 字体 | 思源黑体 Bold / 阿里巴巴普惠体 | 通用商业 |
| 色板 | 主白 `#FFFFFF` + 卖点金 `#FFD700` | ≤2 色 |
| 位置 | 钩子/CTA 居中,数据卖点下 1/3 | per type |
| 描边 | 黑边 2px(亮/暗背景都可读) | 通用 |
| 动画 | 弹入放大 0.3s + 停留 1.5s + 缓淡出 0.3s | 通用 |

### 5.3 自检 3 问(填完后 30 秒过)

1. **6 类字幕该用的都用了?** commerce 必查 6 类全用(① ② ③ ④ 必用,⑤ ⑥ 选);general 按骨架选 2-4 类。
2. **关键字幕都配音效了?** ① ② ④ 必配音效(§5.1 S1),价格爆点必带 S4 静音法则。
3. **品牌名逐字核对了吗?** R5 铁律:长品牌名/型号/成分/SPF/价格/资质/限量数字逐字核对,引号包裹,prompt 加 `verbatim` 指令。

## 6. 视频 Prompt

把整段写成**一个 prompt**,用 `Shot 1: … Shot 2: …` 连接,而不是多个独立的短 prompt:

```text
[主体] + [详细动作] + [场景/环境] + [光线/色调] + [镜头运动] + [视觉风格/画质] + [约束条件]
```

对应关系:景别/视角 + 运镜 → 镜头运动; 光影/色彩 → 光线色调; 主体动作 → 详细动作; 道具/环境 → 场景环境; 字幕按 §5 每镜内联渲染; 视觉基因 → 风格/画质 + 约束。

每个 prompt 都用约束块收尾:`全片约束: 避免纯色渐变背景,避免棚拍空盒子感; 色调从X自然过渡到Y,过渡流畅不跳戏; 所有中文字幕按引号内文字渲染,零错字`。竖屏交付时,还要在 prompt 头部显式写明 `竖屏9:16`。

### 6.1 输入绑定语法(Input Binding Syntax)

当 capability 使用参考输入(`image-to-video`, `keyframes-to-video`)时,在 prompt 中显式绑定它们:

| 用途 | 写法 |
| --- | --- |
| 主体一致 | `以 <图片1> 为主体,保持产品外观/logo/配色一致` |
| 首帧引导 | `以 <图片1> 作为起始画面` |
| 风格参考 | `参考 <图片1> 的色调与光影` |
| 分段接续 | `以 <前段> 末帧作首帧,光线/色调/风格一致` |

对于 `keyframes-to-video`,在 prompt 中描述起始帧与结束帧之间的过渡;输入本身钉住两端。

### 6.2 反模式(Anti-Patterns)

避免: 抽象堆砌(没有具体参数的"高级感"), 冲突指令/一镜 >2 种运动, 把 15s 拆成多段短生成再拼接, 烧录 SRT 而不是让模型渲染字幕, 目标不同的段落复用同一首 BGM, 忘记约束块。

### 6.3 Prompt 拼装示例(八要素 + 角色四层 + 场景三层 + 约束块)

下面是一段**完整 prompt 拼装示例**,对应 [storyboard-example.md](storyboard-example.md) 的雄鹿与幼鹿。读者应能逐项对应到 §3 分镜表的列,并看出**数字已全部语义化降级**(展示层 → 执行层):

```text
Vertical 9:16, 15 seconds. Cinematic nature documentary style, in the spirit of BBC Earth and National Geographic, shot on ARRI Alexa with shallow depth of field.

★ Main subject (角色四层 · 身份+外貌+服装/形态+气质):
A mature 5-year-old male red deer with a 9-point antler rack, deep-brown coat, calm protective temperament; and a 3-month-old fawn with light-brown fur marked by white spots, large dark eyes, curious innocent temperament. Keep the same proportions, antler count, and coat patterns across all frames (no character drift).

★ Scene (场景三层 · 时代+具体场所+环境细节+光线天气):
A misty coniferous forest in the early-morning countryside style, with fern understory, moss-covered fallen logs, and thin drifting mist — soft golden sunrise backlight from a low sun filtering through tree trunks as light shafts (Tyndall effect), with gentle wind in the canopy.

★ Action (写慢·写连续·加 micro-action;用精确时间锚):
- 0.0–5.0s:  the stag steps slowly out of the distant mist, the fawn follows half a step behind, the stag occasionally glances back. Subtle ear twitches on the fawn, soft breathing visible, light tail sway.
- 5.0–11.0s: the stag pauses, turns its head to look down at the fawn, the fawn looks up to meet its gaze (a tender moment of eye contact). A few fireflies drift in the foreground bokeh.
- 11.0–15.0s: the stag lowers its head and gently touches the fawn's forehead with its nose; then both walk slowly into the deeper forest. Camera racks focus from the pair to the mist, then slowly pulls out to a wide shot. The two deer become small warm dots in the vast forest.

★ Camera language (≤2 运镜/段 · 取自 cinematic-shot-library):
Segment 1: low-angle slow dolly-in as the deer approach.
Segment 2: static with micro push-in on the eye-contact moment.
Segment 3: soft rack focus + slow pull-out to wide.
No whip pans, no shaky-cam.

★ Lighting (光影 · 单光源 · 色板锚定):
Single light source — low golden morning sun behind the subjects (rim/backlight), soft fill from the mist and sky. Light shafts (Tyndall effect) filter through tree trunks. Color stays in mist white + warm gold + moss green + deep brown throughout.

★ Style anchor (1 个标签 + 情绪曲线):
Cinematic, BBC Earth, healing and tender mood, "starts calmly → peaks with the forehead touch → ends quietly in the distance".

★ Quality (后置强化):
4K ultra-high definition, shallow depth of field, soft warm light.

★ Hard constraints (焊死 · 必加):
— Stable frame, no flicker, natural cervid anatomy, no mutation, no deformed deer, no extra legs.
— Same deer identities across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

**逐项对照 §3 分镜表**(展示层 → 执行层的降级路径):

| 分镜表列 | 展示层写法 | 本 prompt 写法 | 降级规则(见 [granularity-scale.md](granularity-scale.md)) |
| --- | --- | --- | --- |
| 光影·色温 | `4500K / 5000K` | `soft golden morning backlight` | K值 → 光源描述 |
| 光影·光比 | `3:1 / 2.5:1` | (删除)用光源方向替代 | 数字 → 方向 |
| 音频·dB/BPM | `-16dB / 95BPM` | (整体移出 prompt) | 音频 → 放 Notes,见 §4.1 |
| 运镜·速度 | `0.2m/s` | `slow dolly-in` | m/s → 副词(slow/medium/fast) |
| 焦段 | `16mm 广角 → 85mm 中焦` | `low-angle` + `wide shot` | mm → 景别词 |
| 主体 | 雄鹿+幼鹿(完整四层) | 完整四层(保留) | 主信息保留,术语化 |

完整对照表(12 字段)见 §3.1 颗粒度标尺;模型为什么读不懂数字的边界,见 [t2v-model-capability.md](t2v-model-capability.md) M4。

### 6.4 Prompt 结构公式(八要素 + 五定法 + 角色四层 + 场景三层)

> 提示词的**写作骨架**。本节定义"一段 prompt 应该按什么顺序、什么结构拼接";规则在 §6 整体,术语在 [../cinematography-reference.md](../cinematography-reference.md),模型限制在 [t2v-model-capability.md](t2v-model-capability.md)。
>
> **核心原则**:八要素不可省略,五定法定维度,角色四层/场景三层定颗粒度,14 镜头库选运镜,避坑三陷阱防翻车,5 铁律做最终校验。

#### 6.4.1 八要素万能公式(写作骨架)

提示词严格按八个要素拼接,顺序固定,不可省略:

```
主体 + 动作 + 场景 + 光影 + 镜头语言 + 风格 + 画质 + 约束
```

**满分作业实例**:

```
(主体)一位年轻女生
(场景)在海边
(动作)慢走,微风拂动头发,微笑看向镜头
(光影)黄昏暖光
(画质)4K 高清
(风格)电影感
(镜头)稳定运镜
(约束)画面流畅不抖动,细节清晰。
```

**八要素写法要点**:

| 要素 | 写法规则 | 反例 |
| --- | --- | --- |
| 主体 | 身份 + 外貌 + 服装 + 气质(角色四层) | "一个女生" |
| 动作 | 写慢、写具体、写连续,加 micro-action | "跳舞" → "微微低头、回眸微笑、发丝随风摆动" |
| 场景 | 场景类型 + 时代风格 + 环境细节 + 光线天气(场景三层) | "街上" |
| 光影 | 必加,缺则给廉价漫反射光 | "漂亮的光" → "黄昏暖光 / 体积光 / 侧逆光" |
| 镜头语言 | 至少 1 个运镜词,建议 ≤2 个组合 | 混用"超高速"+"极度稳定"等矛盾指令 |
| 风格 | 1 个明确标签:治愈清新 / 赛博朋克 / 日系 / 武侠电影感 / BBC Earth | "好看" / "很美" / "震撼" |
| 画质 | 后置强化:4K / 超清 / 电影质感 / shallow depth of field | 写得太靠前会喧宾夺主 |
| 约束 | 必加:画面稳定 / 无闪烁 / 人体结构正常 / 不变形 | 漏了 = 主角变脸、肢体扭曲 |

#### 6.4.2 五定法(写作维度索引)

| 维度 | 解决什么 | 关键控制点 |
| --- | --- | --- |
| 定人 | 角色长什么样 | 外貌 + 服装 + 气质 |
| 定景 | 故事发生在哪里 | 环境 + 时代 + 天气 + 光线 |
| 定调 | 整体什么风格 | 片型 + 画面质感 + 情绪基调 |
| 定音 | 声音怎么处理 | 对白 + 音效 + 配乐 + 语种(**移出 prompt,进 Notes**) |
| 定拍 | 怎么动、怎么拍 | 角色动作 + 镜头运动 + 节奏 |

五定解决"拍什么",时间解决"什么时候拍"。

#### 6.4.3 角色四层结构(定人)

从粗到细四层,主角才写满三层以上:

```
[身份标签] + [外貌特征] + [服装描写] + [气质/状态修饰]
```

| 层级 | 作用 | 实例 |
| --- | --- | --- |
| 第一层 身份标签 | 调用模型已有形象模板 | "赛博朋克深海潜员" / "古风少女" / "a 6-month-old pinto foal" |
| 第二层 外貌特征 | 模型可画面化的特征 | "短发的中年男人" / "brown-and-white with a fluffy mane" |
| 第三层 服装描写 | 信息密度最高,颜色最易执行 | "穿黑色长风衣的" / "一袭白衣" |
| 第四层 气质/状态 | "看起来什么感觉" | "气质冷峻的" / "joyful temperament" |

**锁定原则**: 主体描述词全片/全系列锁同一套,改一个词模型就漂移。

#### 6.4.4 场景三层结构(定景)

```
[场景类型] + [时代/风格修饰] + [环境细节] + [光线/天气]
```

| 层级 | 实例 |
| --- | --- |
| 第一层 场景类型 | "街头 / 酒吧 / 海边 / 林间 / meadow" |
| 第二层 时代/风格修饰 | "赛博朋克风格的街道" / "early-morning countryside style" |
| 第三层 环境细节 | "墙角堆着几个纸箱" / "dew-drenched clover, pink wildflowers, thin drifting mist" |
| 第四层 光线/天气 | "黄昏 / 晨雾 / 雨水" / "soft golden sunrise backlight, gentle wind" |

### 6.5 14 镜头库(Cinematic Shot Library)

> 导演级速查表。6 种运镜组合 + 4 种高级电影术语 + 4 种构图/镜头进阶技法 = 14 个技法,供写 prompt 时按场景选用。
>
> **铁律**: 单段 ≤2 个组合运镜(治愈/温情/广告片禁用手持抖动);多个运镜必须用连接词分开:`slowly tracking, then orbiting to face`。

#### 6.5.1 六种运镜组合(成功率最高)

| # | 运镜组合 | 写法(执行层) | 适用场景 | 警告 |
| --- | --- | --- | --- | --- |
| 1 | 跟拍 + 环绕 | `lateral tracking then slowly orbiting to face` | 人物登场万金油,侧后方起绕到正面 | 360° 全环绕易晕,限 45-90° 弧 |
| 2 | 升降 + 横摇 | `crane up while slowly panning right` | 宏大叙事开场,低位→全景揭示 | 速度太快=玩具感 |
| 3 | 手持摄影风格 | `handheld style, slight shake` | 动作追逐/街头纪实 | **治愈系禁用**;抖动幅度要控 |
| 4 | 主观视角 POV | `first-person POV shot` | 代入感无敌,配合一镜到底 | 慎用,易致动晕 |
| 5 | 低角度仰拍 | `low-angle hero shot` | Seedance 2.0 识别极精准,初次亮相首选 | 仰角 >30° 易变形 |
| 6 | 推拉结合 | `push in to close-up, then pull out to wide` | 叙事法:先聚焦细节,后揭示真相 | 推拉速度不一致=割裂 |

#### 6.5.2 四种高级电影术语

| # | 术语 | 写法 | 效果 | 适用 |
| --- | --- | --- | --- | --- |
| 1 | 希区柯克变焦 | `dolly zoom` | 主体大小不变,背景剧烈拉伸 → 震惊/空间扭曲 | 心理冲击、转场 |
| 2 | 匹配剪辑 | `match cut` | 最高级转场,动作相似性跨时空丝滑过渡 | 多段拼接转场 |
| 3 | 升格慢动作 | `slow motion` | 仪式感,雨滴/火星/细腻情绪 | 高潮时刻、特写 |
| 4 | 荷兰角 | `Dutch angle` | 不安/心理阴暗/疯狂情绪 | 悬疑、惊悚 |

#### 6.5.3 四种构图与镜头进阶技法

| # | 技法 | 写法 | 适用 | 注意 |
| --- | --- | --- | --- | --- |
| 1 | 微距镜头 | `macro lens, 1:1 close-up` | 材质纹理细节,露珠穿透光线 | 浅景深极浅,主体必须清晰 |
| 2 | 框景构图 | `framing through window/door/tree branch` | 窥视感、层次 | 框不能太大抢主体 |
| 3 | 超广角镜头 | `ultra-wide angle, edge distortion` | 极大空间包容度,边缘畸变冲击力 | 边缘畸变会拉变形主体,慎用于人像 |
| 4 | 延时摄影 | `time-lapse` | 压缩极慢变化(日落/结晶/云涌),哲理性史诗感 | t2v 模型支持有限,优先短段 |

#### 6.5.4 镜头选择决策表

| 场景意图 | 首选 | 次选 | 禁用 |
| --- | --- | --- | --- |
| 人物登场亮相 | 低角度仰拍(#5) | 跟拍+环绕(#1) | 手持抖动(#3) |
| 自然/治愈 | 横移跟拍 + 缓推 | 推拉结合(#6) | 手持抖动(#3) / 荷兰角(#4) |
| 产品展示 | 环绕小角度(#1 改) | 固定+微推 | 推拉快速 |
| 武侠/古风 | 缓推 dolly forward | 升降+横摇(#2) | 手持抖动 |
| 街头纪实 | 手持风格(#3) | 跟拍+环绕(#1) | 固定机位长镜 |
| 食物/ASMR | 俯拍 + 微距(#1+#4) | 固定+微推 | 运镜>1 个组合 |
| 梦境/超现实 | 希区柯克变焦(#1) | 荷兰角(#4) | 平实跟拍 |
| 城市夜景 | 横移+霓虹 | 低角度仰拍 | 慢动作 |

#### 6.5.5 镜头使用铁律

1. **单段 ≤2 个组合运镜**;超过 2 个模型会"运动不接戏"
2. **治愈/温情/广告片禁用手持抖动**;治愈系 = 平滑稳定
3. **多个运镜用连接词分开**:`slowly tracking, then orbiting to face` / `dolly in, then rack focus`
4. **360° 全环绕慎用**;限 45-90° 弧,避免观感晕眩
5. **仰角不超过 30°**;过大导致主体变形(M3)
6. **运镜速度在 prompt 中用 slow/moderate/fast 描述**(语义化,非 m/s,见 [t2v-model-capability.md](t2v-model-capability.md) M4)

#### 6.5.6 跨段运镜接续规则

| 上段运镜末 | 下段运镜起 | 接续方式 |
| --- | --- | --- |
| dolly-in | dolly-out | 推拉反转 = 强调(慎用) |
| tracking | static | 运动→静止 = 聚焦 |
| low-angle | eye-level | 仰→平 = 权力转移 |
| wide | close-up | 远→近 = 揭示 |
| close-up | wide | 近→远 = 释放 |
| slow motion | normal speed | 慢→常 = 现实回归 |

### 6.6 避坑三陷阱(物理互斥 / 静止动词 / 光影缺失)

> 写 prompt 前**必读**。从原方法论拆出,便于写 prompt 时翻阅,避免跳读。

#### 6.6.1 物理逻辑互斥(物理层)

**禁令**: 不要在同一提示词里写矛盾指令。

| 反例 | 矛盾点 | 修复 |
| --- | --- | --- |
| "大远景" + "背景虚化" | 大远景景深必深,与虚化互斥 | 删"背景虚化"或改中景 |
| "大晴天" + "阴沉感" | 光线调性互斥 | 选一种光线 |
| "超高速" + "极度稳定" | AI 逻辑死锁 | 选快/稳其一 |
| "流畅" + "抖动风格" | 描述互斥 | 删"流畅"或"抖动" |
| "微距特写" + "全景观看" | 景别矛盾 | 选一种景别 |
| "正面光" + "逆光剪影" | 光位矛盾 | 选一种光位 |

#### 6.6.2 静止动词陷阱(动作层)

**禁令**: 避免只用"站立"、"看着"等静止词。

**正确做法**: 主体内部必须有微观动作(micro-action):
- 动物: `with subtle ear twitches, light tail sway, occasional eye blinks`
- 人像: `with soft breathing visible, hair lightly swaying, gentle eye movement`
- 食物/产品: `with steam rising slowly, surface texture shifting`

**为什么**: 否则画面呈"3D 模型平移感",缺乏生命感。

#### 6.6.3 光影指令缺失(光影层)

**禁令**: 如果不写光,AI 默认给漫反射平光 → 廉价 3D 感。

**保底二选一必须出现**:
- `soft directional lighting`
- `volumetric morning backlight`

**完整写法**: 光位 + 光质 + 光源 + 填充,如 `single light source — low golden morning sun behind the subject, soft fill from the sky`。

详见 [../cinematography-reference.md](../cinematography-reference.md) §3 光影与 [t2v-model-capability.md](t2v-model-capability.md) M4 数字参数被忽略。

### 6.7 5 铁律(Iron Rules,最终校验)

> 提交 prompt 前**必过**。与 §6.6 配合:那里讲"不要用什么",这里讲"必须做什么"。

#### 6.7.1 动作写慢写连续

- 写"轻抬手腕"而非"挥手"
- 写"缓步转身"而非"走动"
- 写"mane and tail lifting lightly"而非"running"

**为什么**: t2v 模型对快动作渲染差(帧间跳跃),慢动作给模型更多时间生成连续姿态。

#### 6.7.2 运镜写稳写简单

- 单段 ≤2 个组合运镜
- 多个运镜用连接词分开:`slowly tracking, then orbiting to face`
- 治愈/温情/广告片禁用手持抖动

详见 §6.5.5。

#### 6.7.3 强制约束焊死结尾

末尾必加,缺则 = 主角变脸、肢体扭曲:

```
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

**有效 vs 无效约束**:

| 有效(可执行) | 无效(抽象) |
| --- | --- |
| `no mutation, no deformed horse` | `要有高级感` |
| `no text, no logo, no watermark` | `画质要好` |
| `stable frame, no flicker` | `自然一点` |
| `same identity across all frames` | `保持一致` |

#### 6.7.4 术语转换:形容词 → 摄影参数和风格标签

| 抽象词(拒绝) | 摄影参数化 |
| --- | --- |
| "好看" | `healing fresh + warm diffused light` |
| "震撼" | `dolly zoom / slow motion / wide-angle distortion` |
| "电影感" | `shot on ARRI Alexa with shallow depth of field` |
| "高级" | `BBC Earth style + backlight rim` |
| "真实" | `natural motion + real-world physics + no CGI look` |
| "梦幻" | `volumetric light + soft bokeh + low saturation` |

#### 6.7.5 风格锚定:每个镜头绑定 1 个明确风格标签

每段写 1 个,不要堆叠:
- 治愈清新 / 赛博朋克 / 日系 / 武侠电影感 / BBC Earth / National Geographic / Pixar / ARRI Alexa / iPhone 15 Pro Cinematic Mode / 16mm Bolex ...

**风格锚层级**(越具体模型越能锁定):

| 层级 | 示例 | 效果 |
| --- | --- | --- |
| 抽象 | "好看" / "震撼" | 模型自由发挥 |
| 中等 | "治愈清新" / "赛博朋克" | 风格基本对 |
| 具体 | "BBC Earth + ARRI Alexa" | 质感锁定 |
| 影视级 | "in the spirit of BBC Earth, shot on ARRI Alexa with shallow depth of field" | 锁定 |

### 6.8 钩子类型(前 3 秒防流失)

| 钩子类型 | 写法 | 适用 |
| --- | --- | --- |
| 运动钩子 | 主体入画 / 运镜推入 | 通用 |
| 光影钩子 | 逆光剪影 / 体积光 / 光束穿透 | 治愈/氛围 |
| 动作钩子 | 突然动作(跃起/甩头/冲刺) | 动物/运动 |
| 表情钩子 | 特写表情(歪头/凝视/微笑) | 人像/宠物 |
| 悬念钩子 | 局部特写先出现,后揭示全貌 | 叙事 |

### 6.9 Prompt 拼接模板

```text
[画幅/时长/质感总述] Vertical 9:16, 15 seconds. [风格锚] style, shot on [摄影机] with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
[角色四层描述] — keep the same [关键特征] across all frames (no character drift).

★ Scene (three layers + atmosphere):
[场景三层 + 光线天气].

★ Action (slow, continuous, single motion per beat; with micro-actions):
- 0.0–Xs: [动作1 + micro-action].
- Xs–Ys: [动作2 + micro-action].
- Ys–15s: [动作3 + micro-action].

★ Camera language (≤ 2 moves per segment, from cinematic shot library):
- Segment 1: [运镜1].
- Segment 2: [运镜2].
- Segment 3: [运镜3].
[运镜禁令: No whip pans, no shaky-cam.]

★ Lighting (mandatory, single source):
[单一光源语义化描述 + 配色锚].

★ Style anchor:
[风格标签 + 情绪弧线: "starts calmly → peaks with X → ends quietly"].

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, [光质].

★ Hard constraints (weld to end):
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

Notes for downstream audio(下游音频备注,不要写进视频 prompt):
- BGM 皮肤: [音频皮肤]。
- 环境音优先级: [环境音优先级]。

### 6.10 自检(提交 prompt 前)

- [ ] 物理逻辑:无矛盾指令(光位/景别/速度)?
- [ ] 动作:无纯静止动词,有 micro-action?
- [ ] 光影:已写 soft directional / volumetric,非空?
- [ ] 动作:写慢写连续,无"挥手/走动"等快词?
- [ ] 运镜:≤2 组合,连接词分开,治愈系无手持?
- [ ] 约束:焊死结尾,无抽象词?
- [ ] 术语转换:形容词已换摄影参数?
- [ ] 风格锚:每段 1 个明确风格标签?
- [ ] 八要素全填(主体/动作/场景/光影/镜头/风格/画质/约束)?

详见 [../influence-factors.md](../influence-factors.md) F9 负面约束精炼。

## 7. 时长与分段策略(Duration And Segment Strategy)

- **单段默认**:优先一段。硬上限是**动态的**,不是固定的 — 见 §7.1。
- **帧数映射**:`num_frames = round(duration_seconds * frame_rate)`。帧数必须满足所选 Provider 的 `maxFrames` 规则和 8n+1 规则。从 `capability_limits` 读取当前 Provider 的 `maxFrames` 和 `maxSingleSegmentDuration`;**不要在任何 prompt 或 storyboard 中硬编码 18s/441**。

### 7.1 动态封顶 + 拆分或合并确认(生成前问,按用户选择执行)

**硬上限是动态的,不是固定 18s**。每个 Provider 的单段上限不同,取自 `capability_limits` 中的 `providers[].capability_limits[<capability>]`:

| 字段 | 来源 |
| --- | --- |
| `maxSingleSegmentDuration` | `capability_limits[<capability>].maxSingleSegmentDuration` |
| `maxFrames` | `capability_limits[<capability>].maxFrames` |
| `frameCountRule` | `capability_limits[<capability>].frameCountRule` |

这些字段由各 Provider 的 [providers/manifest.cjs](../../providers/manifest.cjs) 的 `capability_limits` 段在注册时声明。**禁止在 prompt / storyboard / 决策树里硬编码 18s/441**。

未来 Provider 的注册参考值(以 `capability_limits` 声明为准,不是文档数字):

| Provider | maxSingleSegmentDuration | maxFrames | 备注 |
| --- | --- | --- | --- |
| Agnes video v2.0 | 18s | 441 | y-media 默认注册 |
| Seedance 2.0 | 15s | 361 | 强 i2v |
| Sora 1.0 | 20s | 481 | 长段支持好 |
| Veo 2.0 | 8s | 193 | 短段细节好 |

**触发条件**: `target_duration > providers[].capability_limits[<capability>].maxSingleSegmentDuration`。

**流程:生成前问,按用户选择执行**

1. **规划** 时检测到目标 > 封顶,**暂停** §3 Plan
2. **确认门** — 给出二选一(用 AskUserQuestion 工具):
   - **① 分开 (默认推荐)** — 拆成 N 段独立交付,每段都是有效产物;sidecar 不附拼接菜谱
   - **② 合并** — 拆成 N 段独立生成 + sidecar `Generation` 段附外部工具拼接菜谱(CapCut 时间线对齐 / iMovie 拖拽 / ffmpeg `-f concat -i list.txt -c copy` 三选一);**由用户自拼**
3. **执行** 用户选择后,提交 N 段(每段独立走 Provider 路由)
4. **禁止 skill 内部合并** — 运行时无 ffmpeg 假设

**确认模板**(向用户提问时直接用):

```
目标时长 X 秒 > Provider 封顶 Y 秒(读自 capability_limits)。需要您选:
  ① 分开 (默认) — N 段独立交付,各段都是有效产物,不再合并
  ② 合并 — N 段 + sidecar 附 CapCut/iMovie/ffmpeg 拼接菜谱,您自己拼
```

**禁止的反模式**:
- ❌ 把 18s / 441 硬编码到 §7 或 prompt — 不同 Provider 不同
- ❌ 不问用户就默默拆段 — 抢决策
- ❌ 默认走 ① 不问 — 剥夺用户选 ② 的机会
- ❌ skill 内部尝试合并 — 运行时无 ffmpeg 假设
- ❌ 拆完 N 段后才问"要不要拆/怎么拼" — 生成已花额度,且 N 段已交付,"分 vs 合"已隐含决定

### 7.2 多段一致性(N 段规划阶段必做)

- 每段独立满足 §2-§5(独立 brief、独立钩子、独立 audio 节点)。
- 段间一致性: 美学母体照抄,后段以前段末帧作首帧 (§6.1),一套锁定的字幕/音频风格。
- 默认**竖屏 9:16**,除非用户另有要求。Provider 支持时,通过 `parameters.width/height`(例如 720x1280)表达。
- 保持时长、帧数与分镜表总和彼此一致。

## 8. Image 模块 — 交叉参考

> image 路径是**独立模块**,有完整的方法论、companion references、scene 路由与 sidecar 模板。本文件(视频版)不重复内容,只给跨模块衔接。
>
> **完整 image 方法论见 [../image/image-methodology.md](../image/image-methodology.md)**。它包含:R1-R5 单帧降维、§1.2 路径判定(G 纯生成 / E 二次编辑 / H 多图分区)、§2 视觉骨架(5 种)、§3 视觉规范表(11 列单行模板)、§4 文字版式、§5 约束收尾、§6 七维度 prompt、§7 画幅、§8 系列图一致性、§9 与 i2v 桥接、§10 反模式、§11 自检。
>
> **image sidecar 模板**: `<name>.image-brief.md`(平级于 `<name>.video-brief.md`),结构为 1. 图片主要目标 / 2. 视觉规范表 / 3. 图片 prompt。
>
> **示例**: [../image/image-example.md](../image/image-example.md) — 含 3 套完整 image-brief(蓝牙耳机产品图 G 路径 / 咖啡海报拼贴 H 路径 / Logo 极简 E 骨架)+ 反例对照表。
>
> **本文件(video)与 image 的协同点**:
> - image 路径**借用**本文件:① R2 叙事驱动(简化为 R2 视觉驱动)、② R3 视听双轨(简化为 R3 图层纪律)、④ R5 零错字铁律、⑤ 颗粒度标尺(去掉运镜/音频字段)。
> - i2v / kf2v 场景:image prompt 与 video prompt 共享 `§6.1 Input Binding Syntax` 语法;image 路径的 §9 给出"准备给 video 的图"自检清单。
> - commerce mode(§1.1):image 与 video 同源,共享 `scene-commerce-product.md` 的产品摄影部分 + R5 + 合规清单。
