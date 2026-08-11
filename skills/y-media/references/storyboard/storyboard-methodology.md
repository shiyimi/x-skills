# Storyboard Methodology — Creative Layer

This reference defines the Skill-owned creative layer: how to turn a collected brief into a concrete storyboard document and a submission-ready video prompt. It is a generic, category-agnostic methodology for short-form video (selling, seeding, brand storytelling, product demos, tutorials, ASMR, emotional narratives, and similar). It is inspired by the shopping-video planning method used in the `ecom-video-generation` plugin; it is rewritten and simplified for the y-media workflow, its registered Providers, and its non-commerce uses.

Core never consumes this file. The Skill reads it during Step 3 (Plan), produces a storyboard document, then extracts the prompt and submits through the CLI.

## 0. Companion References

This methodology defines the rules; companion references supply concrete parameters, factor thresholds, scene templates, and tools. Read the relevant companion before filling any column.

### 0.1 Top-level (通用,跨模块)

| Companion | Purpose | When to read |
| --- | --- | --- |
| [../cinematography-reference.md](../cinematography-reference.md) | 影视要素词典:景别/运镜/光影/色彩/声音/剪辑/构图/焦段的具体术语与数值 | 填写分镜表每一列时取词 |
| [../influence-factors.md](../influence-factors.md) | 视频生成影响因子 F1-F12(带权重评分卡):每个因子的有效填写阈值与失控修复 | 判断"填到什么程度才有效"时查 |
| [../t2v-model-capability.md](../t2v-model-capability.md) | t2v 模型能力边界 M1-M6 + 展示层vs执行层对照表 + 时间表达方式 | 写 prompt 前必读,决定哪些参数进 prompt、哪些移出 |

### 0.2 storyboard/ (分镜模块)

| Companion | Purpose | When to read |
| --- | --- | --- |
| [granularity-scale.md](granularity-scale.md) | 颗粒度标尺:展示层/执行层分工 + 12字段抽象→具体对照 | 判断"填到什么颗粒度"时查 |
| [prompt-structure-formula.md](prompt-structure-formula.md) | prompt 写作骨架:八要素+五定法+角色四层+场景三层+拼接顺序模板 | 拼接 prompt 时按此结构 |
| [cinematic-shot-library.md](cinematic-shot-library.md) | 14 镜头库(6 运镜组合+4 高级术语+4 构图技法)+ 镜头选择决策表 | 选运镜时查 |
| [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md) | 避坑三陷阱(物理互斥/静止动词/光影缺失)+ 5 铁律 | 写完后自检 |
| [storyboard-reality-calculator.md](storyboard-reality-calculator.md) | 镜头现实性决策 + Python 帧数校验 + Provider 能力速查 | 提交前用 |
| [storyboard-example.md](storyboard-example.md) | 完整填好示例(晨雾森林雄鹿与幼鹿) | 颗粒度校准锚,写新分镜前必读 |

### 0.3 storyboard/scenes/ (场景矩阵)

| Companion | Subject type |
| --- | --- |
| [scenes/scene-nature-animal.md](scenes/scene-nature-animal.md) | 自然/动物/治愈 |
| [scenes/scene-lifestyle-aesthetic.md](scenes/scene-lifestyle-aesthetic.md) | 生活/质感/氛围 |
| [scenes/scene-portrait-fashion.md](scenes/scene-portrait-fashion.md) | 人像/穿搭/时尚(强 i2v) |
| [scenes/scene-food-asmr.md](scenes/scene-food-asmr.md) | 美食/ASMR(声音密集) |

### 0.4 storyboard/templates/ (模板与速配)

| Companion | Purpose |
| --- | --- |
| [templates/templates-3-sets.md](templates/templates-3-sets.md) | 3 套即用 prompt 模板(人像/风景/i2v)+ 多镜头示例 |
| [templates/scene-quick-match.md](templates/scene-quick-match.md) | 场景速配表 + 主体描述速查 + 钩子速查 |

## 1. Brief And Storyboard Document

Parse the brief into three slots and fill gaps with stated defaults (record them under a `默认假设` line in the document header):

| Slot | What to determine | Default when unknown |
| --- | --- | --- |
| 主题/产品 | subject, 1-3 key points or selling points, materials available | from the request; ask once if truly missing |
| 人群/受众 | audience, their pain point or interest | common audience for the subject type |
| 目标 | 认知(brand) / 兴趣(seeding) / 转化(conversion) | decide from the request, no fixed default |

The goal drives tone, pacing, and subtitle route. All three goals are equal choices; nothing here assumes commerce.

Produce one Markdown file per video segment, saved next to the intended output:

```text
<name>.storyboard.md
```

where `<name>` matches the video's `output.filename` stem. The document doubles as the delivery sidecar: it starts as the creative plan and gains a `Generation` section after the video is delivered. A complete, spec-conformant example is [storyboard-example.md](storyboard-example.md) — review it before producing a new storyboard. It contains exactly three sections:

1. **视频主要目标** — one line: `产品/主题 × 人群 × 目标(认知/兴趣/转化) × 骨架(A/B/C) × 时长 × 画幅(默认9:16竖屏)`.
2. **分镜表格** — one row per shot, columns defined in §3. Lock the following decisions in the header before the table:
   - `默认假设`: filled defaults the user did not provide (no real person on camera, no existing footage → pure generation, etc.).
   - `音频策略`: one line derived from §4.
   - `美学母体`: the palette/material/lighting basis that every shot anchors to (e.g. 冰蓝冷调 → 暖色烹饪光 → 品牌红白).
   - `视听路线`: subtitle route, `含字幕` or `无字幕`, locked for the whole segment (§5).
3. **视频 prompt** — the full multi-shot prompt in one block plus BGM notes (§6).

## 2. Narrative Skeleton

Pick one skeleton first; the skeleton determines shot count, pacing, and subtitle route.

| Skeleton | Use | Shots | Shot length | Subtitle |
| --- | --- | --- | --- | --- |
| **A: showcase** (测评/利益/ASMR/变装/演示) | dense information, fast rhythm | 9-12 | 1.0-2.5s | 含字幕 |
| **B: narrative** (情感/故事/溯源/品牌) | emotional arc, slower pace | 5-8 | 2.0-5.0s | 无字幕或极简 |
| **C: 共鸣叙事** (共情/自嘲/治愈/打工人式) | emotional resonance; 共情→自嘲→转折→金句 | 6-10 | 2.0-4.0s | 含字幕 |

Rules that apply to all skeletons:

- Keep **1-3 key points per 15s**; more requires splitting segments (§7).
- **Recover the hook within the first 7 seconds** (visual burst or emotional burst) or completion rate drops.
- Mark `★` on cover-grade shots; a 15s segment should have at least 5, one every 3s at minimum.

### 2.0 Shot Count: Planning vs Execution (⚠️ critical)

The shot counts above (5-12) are **planning-layer** numbers for the storyboard table and human review. The **execution-layer** shot count — what the t2v model can actually render in a single straight-out generation — is much smaller. See [t2v-model-capability.md](t2v-model-capability.md) M1.

| Generation mode | Max shots in 15s | Min shot length | Time expression |
| --- | --- | --- | --- |
| **Single straight-out t2v** (default for y-media) | 3-4 | ≥4s | Precise time anchors (`0.0-5.0s`) |
| **Multi-segment + edit** (split + concat) | per segment ≤3 | per segment ≥4s | Each segment independent |
| **Clip-style dense cut** (骨架A 带货) | 9-12 (planning only) | 1.0-2.5s | Requires multi-segment generation + manual edit |

**Rule**: For a 15s single straight-out generation, write 5-8 shots in the storyboard table (planning), but **merge them into 3 time-anchored segments in the prompt** (execution). Writing 6 shots directly into the prompt causes shot collapse (M1) — the model renders only 1-2 shot sizes.

Three time-expression modes (see [t2v-model-capability.md](t2v-model-capability.md) §3):

| Mode | Strength | Writing | Use when |
| --- | --- | --- | --- |
| Precise time anchor | Strongest | `0.0-5.0s: ...` | 10-15s, 3-4 shots |
| Scene numbering | Medium | `Scene 1: ...` | 5-10s, 2-3 shots |
| Action-flow connectors | Weak/natural | `then` / `suddenly` / `as` | ≤5s, 1-2 shots |

Hook templates (mirror on the top of the shot table):

| Scene | Opening visual | Text/SFX |
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

## 3. Shot Table Columns

Fill every column for every shot. Precision beats prose; each column answers one question.

| Column | Rule | Example |
| --- | --- | --- |
| 镜号 | `S01-01` onwards | S01-03 |
| 时长 | exact to 0.1s; the segment total matches the target duration | 1.8s |
| 景别与视角 | 景别 + 机位角度 | 微距特写,低角度仰拍 |
| 运镜 | 运镜 + 速度 + 方向; one shot, at most 2 moves | 缓推,跟随虾仁滑落 |
| 光影 | 方向 + 色温 + 光比 + 光质 | 45°侧光,6000K,柔光高对比 |
| 色彩 | 主色 + 辅色 + 色调 | 青白+冰蓝,冷调 |
| 主体动作 | concrete, single action | 手撕开冷冻包装袋,冰块碎粒滑落 |
| 道具/环境 | 前景/中景/背景 三层; ≥3 可命名元素; 1 个光源; 背景加 1-2 个低速动态元素 | 前景冰块碎粒/中景包装袋/背景厨房台面虚化+水珠 |
| 音频三层 | ① 人声(有对白/OS心声/无对白) ② 环境音+关键音效点(镜次+时机+音效名) ③ BGM 节点 | (环境)撕包装"嘶啦"+冰块碰撞"咔啦"/(BGM)木吉他扫弦淡入 |
| 屏显字幕 | §5; empty only on the 无字幕 route | ①"这虾仁,也太鲜了!"·上1/3·弹入放大 |
| 视觉重点 | `★` = cover-grade | ★ |

Environment realism (`3+1` rule for any on-camera environment): `[具体场所] + [3 个可命名道具/纹理] + [1 个光源方向色温]`. Avoid pure-gradient or studio-empty backgrounds; add life traces so the frame does not freeze. Pick **1-2 slow, local dynamic elements** per scene from four kinds:

| Dynamic kind | Examples |
| --- | --- |
| 人物动态 | 背景虚化人流走动 / 邻桌客人交谈 |
| 自然动态 | 纱帘轻飘 · 树影摇曳 · 水面波光 |
| 光影动态 | 光斑缓移 · 明暗呼吸 · 屏幕微闪 |
| 粒子动态 | 蒸汽升腾 · 尘埃浮动 · 水汽 |

### 3.1 Granularity Scale (颗粒度标尺)

Each column must be filled to the level below. Abstract adjectives ("暖光""柔和""自然") fail because the model has no parameter to lock onto. Concrete values ("4500K""光比2:1""-18dB") succeed because they pin the model's output. When unsure how具体 a field should be, cross-check [granularity-scale.md](granularity-scale.md) for the full scale and [../influence-factors.md](../influence-factors.md) for the threshold.

| Field | Abstract (reject) | Concrete (accept) | Threshold source |
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

#### 3.1.1 Shot Table In-Line Example (11 列填好的参考行)

下面是分镜表一行填好后的样子(完整 6 镜见 [storyboard-example.md](storyboard-example.md) §2):

```
| S01-03 | 3.0s | 中近景·平视(机位与雄鹿肩同高) | 固定+微推(static + micro push,推程0.2m) | 顶光+侧补光·5000K·光比2.5:1 | 暖金+苔绿 | 雄鹿突然停下,回头凝望幼鹿,幼鹿抬头回应 | 前景:虚化蕨类/中景:雄鹿回头+幼鹿抬头/背景:虚化雾气+光柱 | (环境)树叶"窸窣"-26dB+鸟鸣-30dB·(BGM)钟琴轻入,-16dB,70BPM | — | ★ |
```

每一列都填了具体值:时长 0.1s 精度、景别+机位+角度、运镜英文+速度、光影四要素(光位+色温+光比+光质)、主色+辅色、慢动作连续动作、前/中/背景三层、音频三层+dB+BPM、无字幕(—)、视觉重点(★)。

Rule of thumb: if a field can be replaced by "etc." without losing information, it is too abstract. Rewrite it with a number or a named term.

### 3.2 Scene Routing

After filling the brief (§1), route to a scene template before writing the shot table. Scene templates supply pre-built lighting palettes, audio skins, 7s climax patterns, and AI generation禁区 for common non-commerce subjects. If no template matches, fall back to the generic §2-§6 flow.

| Subject type | Template | Key takeaway |
| --- | --- | --- |
| 自然 / 动物 / 治愈系 | [scenes/scene-nature-animal.md](scenes/scene-nature-animal.md) | 骨架B慢切 + 无字幕 + 黄金时刻光 + 清新民谣BGM |
| 生活 / 质感 / 氛围 | [scenes/scene-lifestyle-aesthetic.md](scenes/scene-lifestyle-aesthetic.md) | 骨架B慢切 + 暖光系 + 暖民谣/钢琴 |
| 人像 / 穿搭 / 时尚 | [scenes/scene-portrait-fashion.md](scenes/scene-portrait-fashion.md) | **强 i2v** + 杂志/街头 + i2v 必填 |
| 美食 / ASMR | [scenes/scene-food-asmr.md](scenes/scene-food-asmr.md) | 微距+顶光+蒸汽 + 声音密集(进 Notes) |
| 其他(科技/产品/抽象) | — | 按本文件通用流程,未来可扩展 |

## 4. Audio Design

Design all three layers; never rely on the model default background track alone.

**Voice** — pick one: 有对白 (talent speaks), 纯 OS 心声 (inner voice, low/slow), or 无对白 (thicken ambient + physiological sounds such as 呼吸/衣物摩擦 instead). When there is dialogue, write a natural-delivery line: 每 8-12 字一次换气, 关键词前微停, 尾字自然下沉, 避免播音腔.

**Ambient/SFX** — 2-3 recognizable sound words per scene; mark key SFX beats explicitly: `音效点(镜3·2.5s): 裙摆"沙沙"加重 3dB`.

**BGM** — always specify 4 fields: 风格(乐器/参考+BPM) + 情绪 + 入点/淡出时点 + 关键节点. Map goal and query mood to a skin, never a generic "轻音乐":

| Goal | Serving | Tempo |
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

Levers worth one line each in the table header when applicable: 开场 3s 音频钩子, 音画卡点, 静音留白→爆点炸开, 声音记忆点, 情绪音量曲线. Silence is a tool: 情感反转前全断 0.5-1s, 数据字幕前 BGM 降 6dB+"叮", 质感片末镜 BGM 淡出只留环境音.

### 4.1 BGM 4-Field Inline Example (写入 `音频策略` 行)

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

## 5. Subtitle Route

Decide once and lock it in the header.

- 信息流投放/转化 or information-dense content → **含字幕** (many plays are muted; subtitles carry the message).
- 质感/情感/ASMR/品牌 → **无字幕或极简 (≤2 条)**. When the picture already carries 70% of the information, subtitles are noise.

Six subtitle types (a segment need not use all):

| Type | Position | Content |
| --- | --- | --- |
| ① 钩子 | 0-2s | 痛点问句 / 悬念 / 反常识数据 |
| ② 数据/卖点 | 核心镜 3-7 | 具体数字+单位, avoid vague claims |
| ③ 信任背书 | 中后段 | 品牌/成分/资质/产地/销量 |
| ④ 行动号召/slogan | 末镜 | A: 指令+利益+紧迫 / B: slogan 或情感 tag / C: 互动设问(骨架C 收尾) |
| ⑤ 氛围/口播同步 | 全片 | 口播关键词高亮 |
| ⑥ 金句/治愈收尾 | 末镜或黑屏 | 情绪总结句, 骨架C 合拍必用; 黑底白字+关键词黄底高亮 |

Lock 5 style items across the whole segment: 字体族 (one family), 色板 (≤2 colors; 数据卖点常金黄加粗; 金句黑底白字+关键词黄底高亮), 位置 (per type), 动画 (1-2 kinds), 描边/阴影 (uniform). Design motion in three phases — 入场 (0.2-0.4s: 弹入放大/上滑淡入/逐字打字) · 停留 (1-2s) · 出场 (缓淡出/下滑). Key subtitles (hook/data/CTA) get one short SFX, e.g. `"叮",前0.1s背景降6dB反衬`.

Copy rules: 品牌名/型号/成分名零容错 — verbatim from the user or confirm; ≤12 字 per line, split longer ones; wrap numbers/units/brand names in English quotes so the model keeps them verbatim; avoid absolute claims; 行动号召 carries urgency when the goal is conversion (仅限今日/前100名).

## 6. Video Prompt

Write the whole segment as **one prompt** with `Shot 1: … Shot 2: …`, not separate short prompts:

```text
[主体] + [详细动作] + [场景/环境] + [光线/色调] + [镜头运动] + [视觉风格/画质] + [约束条件]
```

Mapping: 景别/视角 + 运镜 → 镜头运动; 光影/色彩 → 光线色调; 主体动作 → 详细动作; 道具/环境 → 场景环境; 字幕 per §5 rendered inline per shot; 视觉基因 → 风格/画质 + 约束.

Close every prompt with a constraint block: `全片约束: 避免纯色渐变背景,避免棚拍空盒子感; 色调从X自然过渡到Y,过渡流畅不跳戏; 所有中文字幕按引号内文字渲染,零错字`. For vertical delivery also state `竖屏9:16` explicitly in the prompt header.

### 6.1 Input Binding Syntax

When the capability uses reference inputs (`image-to-video`, `keyframes-to-video`), bind them explicitly in the prompt:

| Purpose | Write |
| --- | --- |
| 主体一致 | `以 <图片1> 为主体,保持产品外观/logo/配色一致` |
| 首帧引导 | `以 <图片1> 作为起始画面` |
| 风格参考 | `参考 <图片1> 的色调与光影` |
| 分段接续 | `以 <前段> 末帧作首帧,光线/色调/风格一致` |

For `keyframes-to-video`, describe the transition between the start and end frames in the prompt; the inputs themselves pin the endpoints.

### 6.2 Anti-Patterns

避免: 抽象堆砌 ("高级感" without concrete parameters), 冲突指令/一镜 >2 种运动, splitting 15s into multiple short generations then stitching, burning SRT instead of letting the model render subtitles, reusing one BGM across segments with different goals, forgetting the constraint block.

### 6.3 Prompt Assembly Example (八要素 + 角色四层 + 场景三层 + 约束块)

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

完整对照表(12 字段)见 [granularity-scale.md](granularity-scale.md) §2;模型为什么读不懂数字的边界,见 [../t2v-model-capability.md](../t2v-model-capability.md) M4。

## 7. Duration And Segment Strategy

- **Single-segment default**: prefer one segment. Two reference points on the planning scale:
  - **15s @ 24fps → 361 帧** (8×45+1):默认规划刻度,留 3.4s 安全裕量到硬上限。
  - **18s @ 24fps → 433 帧** (8×54+1):Agnes video v2.0 硬上限 441 帧以下的封顶档,需要在 storyboard 阶段就承诺"每段 ≥4s、3 镜以内",否则 M1 塌缩。
  - If the target is 19-22s, **split into `15 + (X-15)`**; for >22s, split into `18 + (X-18)` to keep each segment under the hard cap.
- **Multi-segment (>15s, or Provider cap)**: every segment satisfies §2-§5 independently. Segment consistency comes from: 美学母体照抄, 后段以前段末帧作首帧 (§6.1), and one locked subtitle/audio style set across all segments.
- **Frame mapping**: `num_frames = round(duration_seconds * frame_rate)`. Frames must be at most **441** and satisfy `8n + 1`. Reference values: 5s @ 24fps → 121; 10s @ 24fps → 241; **15s → 361**; **18s → 433 (封顶档,接近 441 上限)**; 18.375s → 441 (理论极限,实际取 18s). `frame_rate` 1-60.
- **Multi-segment submission (no ffmpeg dependency)**: when the video must exceed 15s, prefer `keyframes-to-video` with the previous segment's last frame as the new segment's first frame — the Provider stitches internally, the skill delivers N adjacent files. See §6.1 binding syntax and [t2v-model-capability.md](../t2v-model-capability.md) §5.
- **When you need hard cuts / crossfade / dissolve between segments**: the skill does **not** ship a video merger (the runtime is not guaranteed to have ffmpeg). Deliver N segment files and document the merge recipe in the storyboard's `Generation` section (e.g. `CapCut 时间线对齐` / `iMovie 拖拽` / `ffmpeg -f concat -i list.txt -c copy`), then let the user pick their own tool.
- Default to **vertical 9:16** unless the user asks otherwise. Express it through `parameters.width/height` (e.g. 720x1280) when the Provider supports it.
- Keep duration, frame count, and the shot-table total consistent with each other.

## 8. Image Prompts

The same creative discipline applies to still images; only the timeline, audio, and motion dimensions disappear. Write **one final prompt per image**. Reuse the video skeleton, environment realism, subtitle zero-tolerance, and constraint rules where they apply. A complete spec-conformant example is [image-prompt-example.md](image-prompt-example.md) — review it before writing an image prompt with layered layout or typography.

### 8.1 Seven Dimensions For Images

Begin with one sentence locking the style type, aspect ratio, and aesthetic basis (e.g. `Lifestyle collage poster, vertical 3:4, warm indie zine aesthetic`), then expand:

```text
[风格总领句] + [主体] + [动作/状态] + [场景/环境] + [光线/色调] + [视角/构图] + [视觉风格/画质] + [约束条件]
```

| Dimension | Rule | Example |
| --- | --- | --- |
| 风格总领句 | style type + ratio + aesthetic basis in one line | Lifestyle collage poster, vertical 3:4, warm indie zine aesthetic |
| 主体 | concrete, single subject with material/state | 一只大号南美白虾仁,表面冷凝水珠 |
| 动作/状态 | one static pose or frozen instant | 从冰水中捞起的瞬间,水珠滑落 |
| 场景/环境 | §3 `3+1` element rule, front/mid/back layers | 大理石台面+木铲+几片绿叶,背景虚化 |
| 光线/色调 | direction + color temperature + contrast + quality | 45°侧光,6000K,柔光高对比,青白+冰蓝冷调 |
| 视角/构图 | 景别 + 机位 + composition (中心/三分法/留白) | 微距特写,低角度仰拍,主体居中 |
| 视觉风格/画质 | photography style + fidelity cues | 食物摄影,浅景深,超清细节 |
| 约束 | anti-AI-synthetic, text, negative | 避免纯色渐变背景,避免过度AI合成感 |

### 8.2 Text-to-Image vs Image-to-Image

- **text-to-image**: describe the full scene; no reference exists.
- **image-to-image**: state what to preserve and what to change explicitly. Format: `保持<保留项>,把<修改项>替换为<新内容>`. For localized edits: `仅修改<区域>,其余保持不变`.
- **Element-level binding** for photo-to-poster work: list exactly which elements must come from the reference and which must not change, e.g. `Use the uploaded photo as the exact source for the cup, straw, table, street, and sunlight. Do not replace the cup or change the real-life scene.` Without this list the model may redraw or restyle the reference subject.

### 8.3 Aspect Ratio As A Creative Decision

Pick the ratio by intended use, not by default: 竖 9:16 封面/信息流素材, 方 1:1 商品图/头像, 横 16:9 横幅/社媒头图. Put the ratio and resolution into `parameters` (e.g. `size`, `ratio`) and verify them against the selected Provider reference. State the composition direction in the prompt when the ratio is unusual.

### 8.4 Layered Typography

Text is a design layer, not an afterthought. Specify every text layer: content (in quotes), position, font family and style, visual size, letter spacing, color, and readability. For layered layouts (collage/poster/editorial) distinguish:

- **主标题** (primary): large and distinctive — e.g. 中文手写衬线/宋体, elegant, readable.
- **副标题** (secondary): smaller, uppercase English with wide letter spacing, e.g. `AFTERNOON · COFFEE · GREEN`.
- **角标** (corner/date): smallest and quiet, e.g. `2026.08` in the upper-right corner.

Zero-tolerance: brand names, numbers, and slogans go in English quotes with an explicit `按引号内文字原样渲染` instruction; avoid long sentences — short labels render reliably.

### 8.5 Structured Layouts (Collage And Multi-Zone)

For collage / poster / editorial split compositions, treat zones as explicit regions:

- **Zone allocation**: give each zone a percentage or share (upper 38% / lower 62%) and one responsibility.
- **Zone material**: describe texture, color range, and content per zone (kraft paper with fiber texture, hand-torn edge).
- **Boundary transition**: name the edge treatment between zones (irregular hand-torn edge / hard line / natural fade).
- **Full bleed**: state whether a photo zone extends to all edges with full bleed.
- **Zone editing**: state what to remove from the source and what replaces it: `The upper sky of the original photo is removed and replaced by kraft paper.`

### 8.6 Accent Elements

One or two restrained decoration elements anchor a layout: give visual size (约 1.5cm 或画面占比), color, position (near the title, slightly offset), and style (flat solid block). Do not stack accents.

### 8.7 Mood And Style Close

Close the prompt with a mood line and/or a negative-style list:

- **MOOD**: emotion + a concrete metaphor (`Like a WeChat Moments life record meets an independent coffee magazine`) + texture details (scanned-paper grain, natural aging).
- **STYLE**: a flat `no` list (`flat, no 3D, no neon, no gradients, no commercial buttons, no extra people, no extra cups`) + an overall feel (quiet, warm, diary-like, indie editorial).

This mirrors the video constraint block in §6.

### 8.8 Consistency For A Series

For a set of images sharing one subject, lock the subject descriptor and the 美学母体 from §1 once, then vary only 场景/动作/视角 per image. Change the descriptor between images and the subject will drift.

### 8.9 Images As Video Inputs

Generated images can feed `image-to-video` and `keyframes-to-video` directly. Compose them with video constraints in mind: full subject within the frame, room for the intended camera move, and a first frame or keyframes that match the segment goal. Reuse the §6.1 input-binding syntax to anchor the subject in the video prompt.

### 8.10 Image Anti-Patterns

避免: 抽象堆砌 ("高级感" without parameters), 多主体混淆 (one subject per image), 一图多个冲突动作, 文字错字或文字层缺位置/字体规范, 空盒子背景 (add §3 life traces), 过度AI合成感, 区域拼贴无边界过渡 (zones without edge/transition), over-压缩 detail (state the fidelity you want).
