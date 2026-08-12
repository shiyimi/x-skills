#﻿# M8. prompt-craft · Prompt 写作与拼接(执行)

> **模型擅长度**:基础 prompt 结构(高) / 八要素映射(中) / 约束焊死+品牌锁(低)

> 本文件是 **5 步流程的 step 4 · 写脚本** 的主文档。负责把 step 1-3 的成果拼接成最终可提交的 prompt。

---

## §1 八要素万能公式(写作骨架)

提示词严格按八个要素拼接,顺序固定,不可省略:

```
主体 + 动作 + 场景 + 光影 + 镜头语言 + 风格 + 画质 + 约束
```

| 要素 | 来自哪步 | 来源文件 | 写法要求 |
| --- | --- | --- | --- |
| 主体 | step 2 角色四层 | [M3-character.md](M3-character.md) | 身份 + 外貌 + 服装 + 气质(本步只锁关键特征) |
| 动作 | step 1 镜头结构 + micro-action | [M1-methodology.md](M1-methodology.md) + [M3-character.md §3](M3-character.md) | 慢、连续、单动作 + micro-action |
| 场景 | step 3 场景三层 | [M4-scene.md](M4-scene.md) | 场景类型 + 时代/风格 + 细节 + 光线天气 |
| 光影 | step 3 单一光源 | [M4-scene.md §3](M4-scene.md) | 整段只写一次,语义化,非数字 |
| 镜头语言 | step 1 镜头结构 | [M1-methodology.md](M1-methodology.md) + 本文件 §3 14 镜头库 | ≤2 组合,连接词分开 |
| 风格 | step 3 风格锚 | [M4-scene.md §5](M4-scene.md) | 整段 1 个标签 |
| 画质 | 本步定 | — | 后置,4K / shallow depth of field / [光质] |
| 约束 | 本步定 | — | 末尾焊死:`no flicker / no mutation / no text` |

### 1.1 满分作业实例

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

### 1.2 通用反例

| 反例 | 错在哪 |
| --- | --- |
| 漏"光影"要素 | 模型默认给漫反射平光 = 廉价 3D 感 |
| 漏"约束"要素 | 主角变脸/肢体扭曲高频 |
| 风格写"好看/震撼" | 模型自由发挥,不可执行 |
| 镜头写"超高速 + 极度稳定" | AI 逻辑死锁(M7 物理互斥陷阱) |

---

## §2 动作写法的关键约束

完整动作规则见 [M1-methodology.md §5 镜头结构](M1-methodology.md) + [M3-character.md §3 micro-action](M3-character.md)。本文件只列**prompt 层的执行摘要**:

1. **每镜单动作 + 至少 1 个 micro-action**(头发/呼吸/眼睛/衣角/尾巴)
2. **写慢写连续**: "轻抬手腕" 优于 "挥手";"缓步转身" 优于 "走动"
3. **不与光影/风格矛盾**: "微距" 不写 "大远景";"治愈" 不写 "手持抖动"
4. **micro-action 短语按主体类型选**(见 [M3-character.md §3](M3-character.md) 速查表)

---

## §3 14 镜头库(导演级技法)— 唯一版本

> 本节是 y-media 中**唯一一份**14 镜头库。其他文件如需引用,链本节即可。

### 3.1 六种运镜组合(成功率最高)

| # | 运镜组合 | 写法 | 适用场景 | 警告 |
| --- | --- | --- | --- | --- |
| 1 | 跟拍 + 环绕 | `lateral tracking then slowly orbiting to face` | 人物登场万金油 | 360° 全环绕易晕,限 45-90° 弧 |
| 2 | 升降 + 横摇 | `crane up while slowly panning right` | 宏大叙事开场 | 速度太快=玩具感 |
| 3 | 手持摄影风格 | `handheld style, slight shake` | 动作追逐/街头纪实 | **治愈系禁用**;抖动幅度要控 |
| 4 | 主观视角 POV | `first-person POV shot` | 代入感无敌,一镜到底 | 慎用,易致动晕 |
| 5 | 低角度仰拍 | `low-angle hero shot` | Seedance 2.0 识别精准,初次亮相首选 | 仰角 >30° 易变形 |
| 6 | 推拉结合 | `push in to close-up, then pull out to wide` | 叙事法:先聚焦细节,后揭示真相 | 推拉速度不一致=割裂 |

### 3.2 四种高级电影术语

| # | 术语 | 写法 | 效果 | 适用 |
| --- | --- | --- | --- | --- |
| 1 | 希区柯克变焦 | `dolly zoom` | 主体大小不变,背景剧烈拉伸 → 震惊/空间扭曲 | 心理冲击、转场 |
| 2 | 匹配剪辑 | `match cut` | 最高级转场,动作相似性跨时空丝滑过渡 | 多段拼接转场 |
| 3 | 升格慢动作 | `slow motion` | 仪式感,雨滴/火星/细腻情绪 | 高潮时刻、特写 |
| 4 | 荷兰角 | `Dutch angle` | 不安/心理阴暗/疯狂情绪 | 悬疑、惊悚 |

### 3.3 四种构图与镜头进阶技法

| # | 技法 | 写法 | 适用 | 注意 |
| --- | --- | --- | --- | --- |
| 1 | 微距镜头 | `macro lens, 1:1 close-up` | 材质纹理细节,露珠穿透光线 | 浅景深极浅,主体必须清晰 |
| 2 | 框景构图 | `framing through window/door/tree branch` | 窥视感、层次 | 框不能太大抢主体 |
| 3 | 超广角镜头 | `ultra-wide angle, edge distortion` | 极大空间包容度,边缘畸变冲击力 | 边缘畸变会拉变形主体,慎用于人像 |
| 4 | 延时摄影 | `time-lapse` | 压缩极慢变化(日落/结晶/云涌) | t2v 模型支持有限,优先短段 |

### 3.4 镜头选择决策表

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

### 3.5 镜头使用铁律

1. **单段 ≤2 个组合运镜**;超过 2 个模型会"运动不接戏"
2. **治愈/温情/广告片禁用手持抖动**;治愈系 = 平滑稳定
3. **多个运镜用连接词分开**:`slowly tracking, then orbiting to face` / `dolly in, then rack focus`
4. **360° 全环绕慎用**;限 45-90° 弧,避免观感晕眩
5. **仰角不超过 30°**;过大导致主体变形
6. **运镜速度在 prompt 中用 slow/moderate/fast 描述**(语义化,非 m/s)

### 3.6 跨段运镜接续规则(多段时)

| 上段运镜末 | 下段运镜起 | 接续方式 |
| --- | --- | --- |
| dolly-in | dolly-out | 推拉反转 = 强调(慎用) |
| tracking | static | 运动→静止 = 聚焦 |
| low-angle | eye-level | 仰→平 = 权力转移 |
| wide | close-up | 远→近 = 揭示 |
| close-up | wide | 近→远 = 释放 |
| slow motion | normal speed | 慢→常 = 现实回归 |

---

## §4 避坑三陷阱(写作时遵守)

### 4.1 物理逻辑互斥(物理层)

**禁令**: 不要在同一提示词里写矛盾指令。

| 反例 | 矛盾点 | 修复 |
| --- | --- | --- |
| "大远景" + "背景虚化" | 大远景景深必深,与虚化互斥 | 删"背景虚化"或改中景 |
| "大晴天" + "阴沉感" | 光线调性互斥 | 选一种光线 |
| "超高速" + "极度稳定" | AI 逻辑死锁 | 选快/稳其一 |
| "流畅" + "抖动风格" | 描述互斥 | 删"流畅"或"抖动" |
| "微距特写" + "全景观看" | 景别矛盾 | 选一种景别 |
| "正面光" + "逆光剪影" | 光位矛盾 | 选一种光位 |

### 4.2 静止动词陷阱(动作层)

**禁令**: 避免只用"站立"、"看着"等静止词。

**修复**: 主体内部必须有微观动作(micro-action),否则画面呈"3D 模型平移感"。完整 micro-action 短语速查见 [M3-character.md §3](M3-character.md)。

### 4.3 光影指令缺失(光影层)

**禁令**: 如果不写光,AI 默认给漫反射平光 → 廉价 3D 感。

**保底二选一必须出现**:
- `soft directional lighting`
- `volumetric morning backlight`

**完整写法**: 光位 + 光质 + 光源 + 填充,如 `single light source — low golden morning sun behind the subject, soft fill from the sky`。完整单一光源规范见 [scene.md §3](M4-scene.md)。

---

## §5 5 条铁律(最终校验)— 唯一版本

> 本节是 y-media 中**唯一一份**5 铁律。其他文件如需引用,链本节即可。

1. **动作写慢写连续**: 写"轻抬手腕"而非"挥手",写"缓步转身"而非"走动"
2. **运镜写稳写简单**: 单视频 ≤2 个组合运镜
3. **强制约束焊死结尾**: `stable frame / no flicker / natural anatomy / no mutation / no text`
4. **术语转换**: 把形容词换成摄影参数和风格标签。"好看" → `healing fresh + warm diffused light`;"震撼" → `dolly zoom / slow motion / wide-angle distortion`
5. **风格锚定**: 每个镜头绑定 1 个明确风格标签(赛博朋克 / 日系治愈 / 武侠电影感 / BBC Earth)

**有效 vs 无效约束**:

| 有效(可执行) | 无效(抽象) |
| --- | --- |
| `no mutation, no deformed horse` | `要有高级感` |
| `no text, no logo, no watermark` | `画质要好` |
| `stable frame, no flicker` | `自然一点` |
| `same identity across all frames` | `保持一致` |

---

## §6 钩子类型(前 3 秒防流失)

| 钩子类型 | 写法 | 适用 |
| --- | --- | --- |
| 运动钩子 | 主体入画 / 运镜推入 | 通用 |
| 光影钩子 | 逆光剪影 / 体积光 / 光束穿透 | 治愈/氛围 |
| 动作钩子 | 突然动作(跃起/甩头/冲刺) | 动物/运动 |
| 表情钩子 | 特写表情(歪头/凝视/微笑) | 人像/宠物 |
| 悬念钩子 | 局部特写先出现,后揭示全貌 | 叙事 |

---

## §7 Final Prompt 拼接顺序模板

```text
[画幅/时长/质感总述] Vertical 9:16, 15 seconds. [风格锚] style, shot on [摄影机] with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
[角色四层描述] — keep the same [关键特征] across all frames (no character drift).
(完整角色四层见 [M3-character.md](M3-character.md))

★ Scene (three layers + atmosphere):
[场景三层 + 光线天气].
(完整场景三层 + 层分离 + 竖屏见 [M4-scene.md](M4-scene.md))

★ Action (slow, continuous, single motion per beat; with micro-actions; 1:1 mirror of storyboard — N shots → N time anchors, do not merge adjacent shots):
- 0.0–Xs (S01-01): [动作1 + micro-action].
- Xs–Ys (S01-02): [动作2 + micro-action].
- ...
- ...–15s (S01-NN): [动作N + micro-action].

★ Camera language (≤ 2 moves per segment, from cinematic shot library; 1:1 mirror of storyboard, same time anchors as Action):
- 0.0–Xs: [运镜1].
- Xs–Ys: [运镜2].
- ...–15s: [运镜N].
[运镜禁令: No whip pans, no shaky-cam.]

★ Lighting (mandatory, single source):
[单一光源语义化描述 + 配色锚 — 来自 scene.md §3].

★ Audio (downstream soundscape — written into the prompt for audio engineers and audio-capable models; 1:1 mirror of storyboard, same time anchors as Action; 数字 BPM/dB 留在 §4 声场设计稿,执行层走语义化):
- Ambient sound design (1:1 mirror, micro-actions provide sonic cues):
  - 0.0–Xs (S01-01): [环境音 1 + 拟声].
  - Xs–Ys (S01-02): [环境音 2 + 拟声].
  - ...
  - ...–15s (S01-NN): [环境音 N + 拟声].
- BGM (1:1 mirror): [风格 + 情绪弧线,与分镜表关键节点对齐].
- [对白/字幕策略:无对白 / 纯 OS / 配音解说]

★ Style anchor:
[风格标签 + 情绪弧线: "starts calmly → peaks with X → ends quietly"]。
(风格锚规范见 [M4-scene.md §5](M4-scene.md);**导演风格预设一键套用**见 [M2-director-presets.md](M2-director-presets.md),8 个预设 P1-P8 含摄影机/光影/调色/反模式)

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, [光质].

★ Hard constraints (weld to end):
— Stable frame, no flicker, natural [物种] anatomy, no mutation, no deformed [主体].
— Same [主体] identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.

★ Negative constraints:
[侧车 Negative Prompt 区块内容,与 Hard Constraints 去重后并入;见 §10]
```

---

## §7.1 §4 声场设计稿(展示层副本)

> 音频描述**主要**写进 prompt `★ Audio` 段;`§4 声场设计稿` 是**数字完整版结构化副本**,供音频师快速查阅 BPM/dB 数字、关键音效时间码等参考信息,以及未来音画同出 Provider 直接读取。**两份内容必须保持一致**——`★ Audio` 段是语义化版本,`§4 声场设计稿` 是数字完整版。

```
§4 声场设计稿(数字完整版;**与 ★ Audio 段保持一致**):
- BGM: [风格 + BPM + 入点/淡出时点 + 关键节点(镜号),见 audio.md §1.4 4 字段]。
- 环境音优先级: [每镜 2-3 个可辨识环境音词,见 audio.md §2.2]。
- 关键音效点: [镜号·时机·音效名·dB,如"镜3·2.5s: 鼓点 -14dB"]。
- 对白/口播: [有/无;若有,口条节奏见 audio.md §4.5]。
- 静音规则: [M1-M3 触发位置,见 audio.md §5]。
```

---

## §8 分镜列 → Prompt 位置映射表(1:1 锁定)

> **核心规则**: 分镜表格的每行(每个镜号)必须在 Final Prompt 的 `Action` 段和 `Camera language` 段各对应一个时间锚点,使用**同一组时间区间**。这是 [M1-methodology.md §5.1](M1-methodology.md) "1:1 镜号对应"在 prompt 层的执行版。

| 分镜列(规划层) | 写入 Final Prompt 的位置 | 写法 | 不允许 |
| --- | --- | --- | --- |
| **镜号 `S01-NN`** | Action 段每条行首 `(S01-NN)` + Camera 段每条行首时间区间 | `(S01-01)` / `(S01-02)` / ...;时间锚点用 `- Xs–Ys -` | 镜号脱锚(段里提了但表里没有) |
| **时间区间** | Action 段和 Camera 段**用同一组** `0.0–Xs / Xs–Ys / ...` | 一一对应,顺序与镜号升序一致 | 两段时间不同;Camera 段合并 Action 没合并 |
| **主体** | 仅在 Main subject 段首次定义 | 角色四层 + 关键特征锁定(完整四层见 [M3-character.md](M3-character.md)) | 每镜重复写完整主体(只锁关键特征即可) |
| **动作** | Action 段每条 | 慢、连续、单动作 + micro-action | "动作 A 后动作 B"复合(拆两镜) |
| **镜头语言** | Camera language 段每条 | ≤2 组合运镜,从 [§3 14 镜头库](#3-14-镜头库导演级技法) 选 | Action 段写运镜;Camera 段写动作 |
| **光影/光线** | Lighting 段(整段只写一次) | 单一光源语义化描述 + 配色锚(完整规范见 [scene.md §3](M4-scene.md)) | 每镜重写光线(用单一光源) |
| **视觉重点 ★** | 隐含在 Action 段(★对应那镜的 micro-action) | ★镜的 micro-action 写得更显眼(特写/光斑/质感放大) | ★标记丢失或与镜号不匹配 |
| **字幕/口播** | **不进 prompt**,写到侧车 Inputs 或 Notes | 字幕由生成后的剪辑/Burn-in 阶段加 | 在 prompt 里写 "字幕:..." 让模型直接生成文字 |
| **音频/音效** | **进 prompt**(`★ Audio` 段,语义化版本,无 BPM/dB 数字),**§4 声场设计稿** 保留数字完整版(见 §7.1) | BGM / 环境音 / 人声由 prompt 段或后期音频层处理 | 完全不放音频,导致声场意图丢失 |

**校验清单**(提交前):
- [ ] Action 段的镜号数 = Camera 段的镜号数 = 分镜表格的镜号数
- [ ] Action 段和 Camera 段时间锚点完全一致
- [ ] 没有任何相邻镜被合并(除非显式标 `MERGED` 并满足 [M1-methodology.md §5.2](M1-methodology.md) 三项合并条件)
- [ ] 镜号升序连续(中间不跳号)
- [ ] `★ Audio` 段与 Action / Camera 段时间锚点 1:1 一致,语义化,无 BPM/dB 数字
- [ ] `§4 声场设计稿` 与 `★ Audio` 段保持一致(数字完整版)
- [ ] 字幕相关 token 没有进入 prompt 正文(字幕仍走侧车)

---

## §9 五定法速查(决策维度索引)

| 维度 | 解决什么 | 关键控制点 | 来源 |
| --- | --- | --- | --- |
| 定人 | 角色长什么样 | 外貌 + 服装 + 气质 | [M3-character.md](M3-character.md) |
| 定景 | 故事发生在哪里 | 环境 + 时代 + 天气 + 光线 | [M4-scene.md](M4-scene.md) |
| 定调 | 整体什么风格 | 片型 + 画面质感 + 情绪基调 | [M4-scene.md §5 风格锚](M4-scene.md) |
| 定音 | 声音怎么处理 | 对白 + 音效 + 配乐 + 语种(**移出 prompt,进 §4 声场设计稿**) | [M6-audio.md](M6-audio.md) |
| 定拍 | 怎么动、怎么拍 | 角色动作 + 镜头运动 + 节奏 | 本文件 §3 14 镜头库 |

五定解决"拍什么",时间解决"什么时候拍"。

---

## §10 Negative Prompt 方法论(视频路径)

> 本节定义 `<name>.video-brief.md` 侧车里 **Negative Prompt 区块** 的填写方法。该区块与 `Final Prompt` 平级,用于编辑清晰度与交付归档;提交 Provider 时,Skill 将其内容并入最终 `prompt` 的约束段,作为同一条提交指令的一部分。
>
> **作用域**: 仅 video capability(`text-to-video` / `image-to-video` / `keyframes-to-video`)。image capability 不独立维护 Negative Prompt 区块,见 image 路径侧声明。

### 10.1 分工

`Final Prompt` 描述要生成什么;`Negative Prompt` 描述稳定要避免什么。两者在侧车中分开写,提交时合并为一个 effective prompt。

| 区块 | 作用 | 提交行为 | 内容类型 |
| --- | --- | --- | --- |
| `Final Prompt` | 正向描述主体、环境、动作、镜头、风格与硬约束 | 作为 submitted prompt 主体 | 主题相关的完整生成指令 |
| `Negative Prompt` | 收拢不该出现的通用退化和明确禁项 | 追加为 submitted prompt 的 `Negative constraints:` 段 | 模糊、变形、水印、乱码、错字、无关 logo 等 |

**判断口诀**: 侧车分开写是为了人类编辑;提交合并写是为了让 Provider 收到一条完整 prompt。

### 10.2 何时该填这个区块

按 Negative Prompt 的边际收益判断,分三档:

| 档位 | 触发条件 | 是否填写 | 理由 |
| --- | --- | --- | --- |
| **必填** | commerce 视频 / 人像视频 / 品牌露出 / 涉及人物动作 | 是 | 退化、人物变形、文字污染和品牌污染是高频失败模式 |
| **推荐填** | 含文字/字幕预期 / 商业 logo / 多个产品 SKU 入境 | 是 | 错字、虚构 logo、无关标签需要在最终 prompt 里明确约束 |
| **可选** | 风景/自然/动物(无品牌 / 无人脸) | 可不填 | 若 `Final Prompt` 已含完整 Hard Constraints,可省略额外约束 |

> **不要为了"显得专业"硬填一份与 Final Prompt 重复的负面词**。重复 = 噪声,会稀释正向指令的清晰度。

### 10.3 区块在侧车里的位置与命名

`Negative Prompt` 是侧车里 **与 Final Prompt 平级** 的独立区块,不嵌入 Final Prompt 块内。侧车结构(顺序固定,见 [SKILL.md §3.1](../../SKILL.md)):

```text
# <name>.video-brief.md

## 1. 视频主要目标
...

## 2. 分镜表格
...

## 3. Negative Prompt   ← 本节定义的内容(可选,见 §10.2 档位)
[独立填写,见 §10.4]

## 4. Inputs
[图片/参考帧/起止帧/其他外部资产,可选]

## 5. Generation
[交付后由 Skill 填实:Provider / model / task.id / effective parameters / warnings / timing]

## 6. Final Prompt   ← 放在文档最后
[完整的八要素 + 约束焊死块;Action 与 Camera language 段按 §2 表格镜号 1:1 对应]
```

> **空区块处理**: 若本档为"可选"且判断不必填,在区块下写一行 `— (本视频无需额外 Negative Prompt,见 M7-prompt-craft.md §10.2)`,而不是删掉区块。删区块会让侧车结构与其他 brief 不一致,影响后续模板解析。
>
> **Final Prompt 始终在文档最后**(`## 6` 或最后一个小节),便于 reviewer 整段复制提交;`## 3-5` 之间的小节顺序可按 brief 实际需要调整(Negative Prompt / Inputs / Generation 的相对顺序不固定),但 **Final Prompt 一定是终点**。

### 10.4 内容来源与拆分原则

不要凭空写负面词。按以下三源拼装,确保每一项都有明确意图:

| 来源 | 适用 | 写法 |
| --- | --- | --- |
| **通用退化**(几乎所有视频都要) | 模糊、低分辨率、闪烁、抖动、压缩痕迹、过度饱和、卡通化 | 需要时加入,见 §10.5 |
| **主题专属** | 人物 → 变形/多指/多肢;商业 → 错字/虚构 logo/虚构价格;风景 → 城市污染/电线;美食 → 苍蝇/塑料感 | 按 brief 主题加 |
| **场景专属** | i2v → 主体突变/参考图漂移;kf2v → 起止帧不连贯;长镜头 → 镜头漂移 | 按 capability 加 |

> **与 Hard Constraints 的去重**: 若某条负面已经在 Final Prompt 末尾焊死(如"no text, no logo"),不要在 Negative Prompt 里再写一遍。重复 = 噪声。

### 10.5 通用退化基线(只列类型,不给具体词表)

> 本节按设计**不预写词表**。Negative Prompt 的具体词取决于模型版本、Provider 接口规范与目标语种;模型升级时旧的负面词可能反过来损伤画质(例如"low quality"在某些 v2 模型上反而降低整体清晰度)。每次新模型上线时,由运行 §10.6 的自检流程决定具体词。

通用退化基线**应该覆盖的负面类型**:

- 画质退化(模糊 / 压缩 / 噪点 / 过锐)
- 时间退化(闪烁 / 抖动 / 跳帧 / 镜头漂移)
- 解剖退化(人物/动物的肢体异常)
- 语义污染(虚构文字 / 虚构品牌 / 虚构标签)
- 美学污染(过度 AI 感 / 3D 渲染塑料感 / 色彩过艳)

具体词汇由 Skill 在每次新 Provider / 新模型接入时按官方负面词库与实际生成失败样本决定,**不沉淀到本文件**。

### 10.6 提交前自检

逐条回答,任一为否就回头改:

- [ ] **必要性**: 本档是否真的需要填?(§10.2)
- [ ] **去重**: 与 Final Prompt 末尾的 Hard Constraints 没有重复 token?
- [ ] **类型覆盖**: 画质 / 时间 / 解剖 / 语义 / 美学 五类负面是否都至少有一条?(除非有理由排除)
- [ ] **可执行**: 每条都是可被模型理解的 token,不是"高级感要好"这种抽象词?
- [ ] **与 capability 对齐**: i2v / kf2v 加了对应的参考图相关负面?
- [ ] **提交合并**: 最终提交的 prompt 中包含 `Negative constraints:` 段,且额外约束已经并入同一条提交指令?
- [ ] **没有删除区块**: 判断为"无需填"时写 `—` 占位,而不是删区块

### 10.7 反模式

| 反模式 | 症状 | 修复 |
| --- | --- | --- |
| 抄一份与 Final Prompt 重复的负面词 | prompt 变长且约束噪声增加 | §10.6 去重自检 |
| 把所有负面词都写进 Negative Prompt,不写 Hard Constraints | 主题强相关禁项没有贴在生成指令末尾 | Hard Constraints 写"主题相关"的负面,Negative Prompt 写额外通用退化 |
| 抄一份 Stable Diffusion 经典负面词 | 部分词与当前模型语义不匹配(甚至反向生效) | §10.5 不预写词表;新模型上线时再校准 |
| 区块位置嵌入 Final Prompt 块内 | 侧车结构不统一,模板解析失败 | §10.3 区块平级独立 |
| commerce 视频不填 | 错字/虚构 logo 频发 | §10.2 commerce 必填 |

---

## §11 上下游

→ [SKILL.md §4.0 编号索引](../../SKILL.md#40-编号索引快速定位)
