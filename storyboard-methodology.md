# Storyboard Methodology — Creative Layer

This reference defines the Skill-owned creative layer: how to turn a collected brief into a concrete storyboard document that IS the video prompt. It is a generic, category-agnostic methodology for short-form video (selling, seeding, brand storytelling, product demos, tutorials, ASMR, emotional narratives, and similar). It is inspired by the shopping-video planning method used in the `ecom-video-generation` plugin; it is rewritten and simplified for the y-media workflow, its registered Providers, and its non-commerce uses.

Core never consumes this file. The Skill reads it during Step 3 (Plan), produces a storyboard document, then submits the document content as the `prompt` field through the CLI.

The workflow follows a film production pipeline: **剧本(Story) → 导演(Direction) → 后期(Post-production)**. Each phase produces one layer of the final storyboard document.

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

where `<name>` matches the video's `output.filename` stem. The document doubles as the delivery sidecar: it starts as the creative plan and gains a `Generation` section after the video is delivered. The document content IS the prompt submitted to the Provider — nothing is extracted or compressed. A complete, spec-conformant example is [storyboard-example.md](storyboard-example.md) — review it before producing a new storyboard. The document has three sections (defined in §5):

1. **视频主要目标** — one line: `产品/主题 × 人群 × 目标(认知/兴趣/转化) × 骨架(A/B/C) × 时长 × 画幅(默认9:16竖屏)`.
2. **分镜表格** — one row per shot, columns defined in §3. Lock the following decisions in the header before the table:
   - `默认假设`: filled defaults the user did not provide
   - `音频策略`: one line derived from §4.1
   - `美学母体`: the palette/material/lighting basis that every shot anchors to
   - `视听路线`: subtitle route, `含字幕` or `无字幕`, locked for the whole segment (§4.2)
3. **全片约束与负面提示词** — constraint block + negative prompt, as defined in §5.3.

## 2. 剧本 (Script) — Story & Narrative

The script phase defines **what story to tell**: the subject, audience, goal, narrative structure, and hook strategy. This phase answers the question "what are we saying?"

### 2.1 Narrative Skeleton

Pick one skeleton first; the skeleton determines shot count, pacing, and subtitle route.

| Skeleton | Use | Shots | Shot length | Subtitle |
| --- | --- | --- | --- | --- |
| **A: showcase** (测评/利益/ASMR/变装/演示) | dense information, fast rhythm | 9-12 | 1.0-2.5s | 含字幕 |
| **B: narrative** (情感/故事/溯源/品牌) | emotional arc, slower pace | 5-8 | 2.0-5.0s | 无字幕或极简 |
| **C: 共鸣叙事** (共情/自嘲/治愈/打工人式) | emotional resonance; 共情→自嘲→转折→金句 | 6-10 | 2.0-4.0s | 含字幕 |

Rules that apply to all skeletons:

- Keep **1-3 key points per 15s**; more requires splitting segments (§6).
- **Recover the hook within the first 7 seconds** (visual burst or emotional burst) or completion rate drops.
- Mark `★` on cover-grade shots; a 15s segment should have at least 5, one every 3s at minimum.

### 2.2 Hook Templates

Hook templates (mirror on the top of the shot table):

| Scene | Opening visual | Text/SFX |
| --- | --- | --- |
| 测评/演示 | 疑问前置字幕 + 产品全景 | "这个很火的到底好不好用?" |
| 利益/转化 | 价格锚点 + 产品硬切 | 大字幕 "3.9元包邮" |
| ASMR/感官 | 感官特写 + 撕包装/切开音效 | 无口播,全声音 |
| 溯源/故事 | 场景直入 + 人物出镜 | "刚下火车来看娃" |
| 品牌/形象 | 氛围场景 + 品牌元素 | slogan 前置 |
| 共情/自嘲 | 疲惫日常直入 + 内心 OS 字幕 | "上辈子到底造了什么孽" |

### 2.3 骨架C 起承转合与情绪色温对撞

共鸣叙事(骨架C)在表头锁定四条情绪拍, 即起承转合; 每拍决定节奏、美学母体与音频节点:

| 拍 | 情绪 | 时长占比 | 职责 | 音频 |
| --- | --- | --- | --- | --- |
| 起 | 共情/痛点 | ~25% | 真实疲惫细节直入, 7s 内出钩子 | 环境音 + 纯OS心声 |
| 承 | 自嘲/吐槽 | ~35% | 荒诞细节堆叠, 节奏渐快 | BGM 鼓点渐重, 音画卡点 |
| 转 | 治愈/温柔 | ~25% | 情绪软着陆, 画面转亮 | BGM 切换, 前 0.5-1s 静音留白 |
| 合 | 金句/收尾 | ~15% | 黑底金句字幕收束 + 互动设问 CTA | BGM 淡出只留环境音 |

**情绪色温对撞** 是骨架C 的美学母体默认: 压抑段用冷灰蓝+荧光白(现实感), 治愈段用暖黄橙(反差治愈); 换色点正好落在转折拍, 光影同步从硬冷光过渡到柔暖光。每镜锚定所属拍的色板, 过渡只做一次有意的转场, 不做逐镜漂移。多段交付(30s 拆 15+15, 60s 拆四段)按拍分界, 段间用 §5.4 接续, 每段仍独立满足 §2-§4。

## 3. 导演 (Director) — Visual Direction & Shot Execution

The director phase designs **how each shot looks and moves**. This phase answers the question "how do we show it?" Fill every column for every shot. Precision beats prose; each column answers one question.

### 3.1 Shot Table Columns

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
| 屏显字幕 | §4.2; empty only on the 无字幕 route | ①"这虾仁,也太鲜了!"·上1/3·弹入放大 |
| 视觉重点 | `★` = cover-grade | ★ |

### 3.2 Environment Realism

Environment realism (`3+1` rule for any on-camera environment): `[具体场所] + [3 个可命名道具/纹理] + [1 个光源方向色温]`. Avoid pure-gradient or studio-empty backgrounds; add life traces so the frame does not freeze. Pick **1-2 slow, local dynamic elements** per scene from four kinds:

| Dynamic kind | Examples |
| --- | --- |
| 人物动态 | 背景虚化人流走动 / 邻桌客人交谈 |
| 自然动态 | 纱帘轻飘 · 树影摇曳 · 水面波光 |
| 光影动态 | 光斑缓移 · 明暗呼吸 · 屏幕微闪 |
| 粒子动态 | 蒸汽升腾 · 尘埃浮动 · 水汽 |

## 4. 后期 (Post-production) — Audio, Subtitles & Technical Parameters

The post-production phase locks **how the video sounds, reads, and conforms to technical constraints**. This phase answers the question "how do we finish it?"

### 4.1 Audio Design

Design all three audio layers; never rely on the model default background track alone. Full audio design reference in [references/audio-design.md](references/audio-design.md). At minimum, lock the following in the document header as a one-line `音频策略`:

- **人声**: 有对白 / 纯OS心声 / 无对白
- **BGM**: 风格(乐器+参考) + BPM
- **关键音效**: 2-3 recognizable sound words per scene

**Voice** — pick one: 有对白 (talent speaks), 纯 OS 心声 (inner voice, low/slow), or 无对白 (thicken ambient + physiological sounds such as 呼吸/衣物摩擦 instead). When there is dialogue, write a natural-delivery line: 每 8-12 字一次换气, 关键词前微停, 尾字自然下沉, 避免播音腔.

**Ambient/SFX** — 2-3 recognizable sound words per scene; mark key SFX beats explicitly in the shot table: `音效点(镜3·2.5s): 裙摆"沙沙"加重 3dB`.

**BGM** — always specify 4 fields in the audio strategy: 风格(乐器/参考+BPM) + 情绪 + 入点/淡出时点 + 关键节点. Map goal and query mood to a skin, never a generic "轻音乐":

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

### 4.2 Subtitle Route

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

## 5. 分镜文档结构 (Document Structure, The Prompt)

The storyboard document content IS the `prompt` field sent to the Provider. The Provider's `prompt` is a free-form text field — it can hold structured markdown. **Send the complete document as-is.** Do not flatten, compress, or extract a subset.

The document has three sections, in order, producing the complete prompt:

### 5.1 Section A — Brief Header

```text
产品/主题 × 人群 × 目标(认知/兴趣/转化) × 骨架(A/B/C) × 总时长 × 画幅
默认假设: …
音频策略: …
美学母体: …
视听路线: 含字幕/无字幕
```

### 5.2 Section B — Full Shot Table

All 11 columns from §3, rendered as a markdown table. Every row preserves every column; no column is dropped:

```text
| 镜号 | 时长 | 景别与视角 | 运镜 | 光影 | 色彩 | 主体动作 | 道具/环境 | 音频三层 | 屏显字幕 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 1.8s | 微距特写,低角度仰拍 | 缓推,跟随虾仁滑落 | 45°侧光,6000K,柔光高对比 | 青白+冰蓝,冷调 | 手撕开冷冻包装袋,冰块碎粒滑落 | 前景冰块碎粒/中景包装袋/背景厨房台面虚化+水珠 | (环境)撕包装"嘶啦"+冰块碰撞"咔啦"/(BGM)木吉他扫弦淡入 | ①"这虾仁,也太鲜了!"·上1/3·弹入放大 | ★ |
| … | … | … | … | … | … | … | … | … | … | … |
```

### 5.3 Section C — Constraint Block + Negative Prompt

In one block at the end. **Must include an explicit `美学母体锚定` line** derived from the Section A header — this makes the aesthetic framework a binding constraint, not just a header annotation:

```text
全片约束: 美学母体锚定: {从 Section A 抄写}; 竖屏9:16; 避免纯色渐变背景,避免棚拍空盒子感; 色调从X自然过渡到Y,过渡流畅不跳戏; 所有中文字幕按引号内文字渲染,零错字
负面提示词: 纯色渐变背景,棚拍感,过度AI合成感,拉丁字体,乱码,画面抖动,主体畸变,多帧闪烁
```

The negative prompt is part of the `prompt` text, not a separate parameter. Do not rely on `parameters.negative_prompt` — some Providers may not support it.

### 5.4 Input Binding Syntax

When the capability uses reference inputs (`image-to-video`, `keyframes-to-video`), bind them explicitly in the prompt:

| Purpose | Write |
| --- | --- |
| 主体一致 | `以 <图片1> 为主体,保持产品外观/logo/配色一致` |
| 首帧引导 | `以 <图片1> 作为起始画面` |
| 风格参考 | `参考 <图片1> 的色调与光影` |
| 分段接续 | `以 <前段> 末帧作首帧,光线/色调/风格一致` |

For `keyframes-to-video`, describe the transition between the start and end frames in the prompt; the inputs themselves pin the endpoints.

### 5.5 Anti-Patterns

避免: 将分镜表压扁为 `Shot N: …` 导致信息丢失, 依赖 `parameters.negative_prompt` 而非写入文档 §5.3, 抽象堆砌 ("高级感" without concrete parameters), 分镜表缺少列或列内容不完整, 冲突指令/一镜 >2 种运动, splitting 15s into multiple short generations then stitching, burning SRT instead of letting the model render subtitles, reusing one BGM across segments with different goals, 遗漏 §5.3 的约束或负面提示词.

## 6. Duration And Segment Strategy

- Prefer one top-cap segment. Reference: 15s @ 24fps. If the target is 16-22s, first compress to 15s; if it cannot compress, split into `15 + (X-15)`.
- When splitting (>22s or Provider cap), every segment satisfies §2-§4 independently. Segment consistency comes from: 美学母体照抄, 后段以前段末帧作首帧 (§5.4), and one locked subtitle/audio style set across all segments.
- Frame mapping: `num_frames = round(duration_seconds * frame_rate)`. Frames must be at most 441 and satisfy `8n + 1`. Reference values: 15s @ 24fps → 361; 10s @ 24fps → 241; 18s @ 24fps → 433 → exceeds the cap, split or reduce. `frame_rate` 1-60.
- Default to **vertical 9:16** unless the user asks otherwise. Express it through `parameters.width/height` (e.g. 720x1280) when the Provider supports it.
- Keep duration, frame count, and the shot-table total consistent with each other.

## 7. Image Prompts

The same creative discipline applies to still images; only the timeline, audio, and motion dimensions disappear. Write **one final prompt per image**. Reuse the video skeleton, environment realism, subtitle zero-tolerance, and constraint rules where they apply. A complete spec-conformant example is [image-prompt-example.md](image-prompt-example.md) — review it before writing an image prompt with layered layout or typography.

### 7.1 Seven Dimensions For Images

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

### 7.2 Text-to-Image vs Image-to-Image

- **text-to-image**: describe the full scene; no reference exists.
- **image-to-image**: state what to preserve and what to change explicitly. Format: `保持<保留项>,把<修改项>替换为<新内容>`. For localized edits: `仅修改<区域>,其余保持不变`.
- **Element-level binding** for photo-to-poster work: list exactly which elements must come from the reference and which must not change, e.g. `Use the uploaded photo as the exact source for the cup, straw, table, street, and sunlight. Do not replace the cup or change the real-life scene.` Without this list the model may redraw or restyle the reference subject.

### 7.3 Aspect Ratio As A Creative Decision

Pick the ratio by intended use, not by default: 竖 9:16 封面/信息流素材, 方 1:1 商品图/头像, 横 16:9 横幅/社媒头图. Put the ratio and resolution into `parameters` (e.g. `size`, `ratio`) and verify them against the selected Provider reference. State the composition direction in the prompt when the ratio is unusual.

### 7.4 Layered Typography

Text is a design layer, not an afterthought. Specify every text layer: content (in quotes), position, font family and style, visual size, letter spacing, color, and readability. For layered layouts (collage/poster/editorial) distinguish:

- **主标题** (primary): large and distinctive — e.g. 中文手写衬线/宋体, elegant, readable.
- **副标题** (secondary): smaller, uppercase English with wide letter spacing, e.g. `AFTERNOON · COFFEE · GREEN`.
- **角标** (corner/date): smallest and quiet, e.g. `2026.08` in the upper-right corner.

Zero-tolerance: brand names, numbers, and slogans go in English quotes with an explicit `按引号内文字原样渲染` instruction; avoid long sentences — short labels render reliably.

### 7.5 Structured Layouts (Collage And Multi-Zone)

For collage / poster / editorial split compositions, treat zones as explicit regions:

- **Zone allocation**: give each zone a percentage or share (upper 38% / lower 62%) and one responsibility.
- **Zone material**: describe texture, color range, and content per zone (kraft paper with fiber texture, hand-torn edge).
- **Boundary transition**: name the edge treatment between zones (irregular hand-torn edge / hard line / natural fade).
- **Full bleed**: state whether a photo zone extends to all edges with full bleed.
- **Zone editing**: state what to remove from the source and what replaces it: `The upper sky of the original photo is removed and replaced by kraft paper.`

### 7.6 Accent Elements

One or two restrained decoration elements anchor a layout: give visual size (约 1.5cm 或画面占比), color, position (near the title, slightly offset), and style (flat solid block). Do not stack accents.

### 7.7 Mood And Style Close

Close the prompt with a mood line and/or a negative-style list:

- **MOOD**: emotion + a concrete metaphor (`Like a WeChat Moments life record meets an independent coffee magazine`) + texture details (scanned-paper grain, natural aging).
- **STYLE**: a flat `no` list (`flat, no 3D, no neon, no gradients, no commercial buttons, no extra people, no extra cups`) + an overall feel (quiet, warm, diary-like, indie editorial).

This mirrors the video constraint block in §5.3.

### 7.8 Consistency For A Series

For a set of images sharing one subject, lock the subject descriptor and the 美学母体 from §1 once, then vary only 场景/动作/视角 per image. Change the descriptor between images and the subject will drift.

### 7.9 Images As Video Inputs

Generated images can feed `image-to-video` and `keyframes-to-video` directly. Compose them with video constraints in mind: full subject within the frame, room for the intended camera move, and a first frame or keyframes that match the segment goal. Reuse the §5.4 input-binding syntax to anchor the subject in the video prompt.

### 7.10 Image Anti-Patterns

避免: 抽象堆砌 ("高级感" without parameters), 多主体混淆 (one subject per image), 一图多个冲突动作, 文字错字或文字层缺位置/字体规范, 空盒子背景 (add §3 life traces), 过度AI合成感, 区域拼贴无边界过渡 (zones without edge/transition), over-压缩 detail (state the fidelity you want).