# M6. prompt-craft · Prompt 写作与拼接(执行)

> 本文件是 **5 步流程的 step 4 · 写脚本** 的主文档。负责把前几步的成果拼接成最终可提交的 prompt。
>
> **源头写对**:字幕/音频/背景(3+1+动态层)全写进 prompt 让模型直出，不后期补救。

---

## §1 八要素万能公式(写作骨架)

提示词严格按八个要素拼接，顺序固定，不可省略:

```
主体 + 动作 + 场景 + 光影 + 镜头语言 + 风格 + 画质 + 约束
```

| 要素 | 来自哪步 | 来源文件 | 写法要求 |
| --- | --- | --- | --- |
| 主体 | step 2 角色四层 | [M2-character.md](M2-character.md) | 身份 + 外貌 + 服装 + 气质(本步只锁关键特征) |
| 动作 | step 1 镜头结构 + micro-action | [M1-methodology.md](M1-methodology.md) | 慢、连续、单动作 + micro-action |
| 场景 | step 3 场景三层 + 3+1 + 动态层 | [M3-scene.md](M3-scene.md) | 3 可辨识元素 + 1 光源 + 1-2 动态元素 |
| 光影 | step 3 单一光源 | [M3-scene.md §5](M3-scene.md) | 整段只写一次，语义化，非数字 |
| 镜头语言 | step 1 镜头结构 | [M1-methodology.md](M1-methodology.md) | ≤2 组合，连接词分开 |
| 风格 | step 3 风格锚 | [M3-scene.md §6](M3-scene.md) | 整段 1 个标签 |
| 画质 | 本步定 | — | 后置，4K / shallow depth of field |
| 约束 | 本步定 | — | 末尾焊死:`no flicker / no mutation / no text` |

### 1.1 满分作业实例

```
(主体)一位年轻女生
(场景)在海边，木栈道 + 躺椅 + 遮阳伞，黄昏暖光
(动作)慢走，微风拂动头发，微笑看向镜头
(光影)黄昏暖光，单一光源
(画质)4K 高清
(风格)电影感
(镜头)稳定运镜
(约束)画面流畅不抖动，细节清晰。
```

### 1.2 通用反例

| 反例 | 错在哪 |
| --- | --- |
| 漏"光影"要素 | 模型默认给漫反射平光 = 廉价 3D 感 |
| 漏"约束"要素 | 主角变脸/肢体扭曲高频 |
| 风格写"好看/震撼" | 模型自由发挥，不可执行 |
| 镜头写"超高速 + 极度稳定" | AI 逻辑死锁 |

---

## §2 动作写法的关键约束

完整动作规则见 [M1-methodology.md §5](M1-methodology.md) + [M2-character.md §3](M2-character.md)。本文件只列**prompt 层的执行摘要**:

1. **每镜单动作 + 至少 1 个 micro-action**(头发/呼吸/眼睛/衣角/尾巴)
2. **写慢写连续**: "轻抬手腕" 优于 "挥手"；"缓步转身" 优于 "走动"
3. **不与光影/风格矛盾**: "微距" 不写 "大远景"；"治愈" 不写 "手持抖动"

---

## §3 镜头语言(引用 M4)

景别 / 机位 / 运镜 / 焦段景深 / 构图，以及镜头选择决策表，全部在 **[M4-cinematography.md](M4-cinematography.md)** 一处维护(职责收敛，本文件不重复)。

**prompt 层执行摘要**(完整取词见 M4):
- 景别 5 级:远景 / 全景 / 中景 / 近景 / 特写
- 运镜 8 种:推 / 拉 / 横移 / 环绕 / 升降 / 手持 / POV / 推拉结合
- 三条铁律(L1-L3):单段 ≤2 个组合运镜；治愈/广告禁手持；数字分级写 prompt(技术参数不写，剧情爆点数字必须写)

---

## §4 字幕直出(核心)

> **R3**:字幕写进 prompt 让模型直接渲染，不后期烧录。

### 4.1 字幕直出写法

字幕文案 + 位置 + 样式，语义化写进 prompt。文案用英文引号包裹，声明"按引号内文字渲染":

```
Text overlay: "这虾仁，也太鲜了!" top-third, white bold text with thin black outline, popping in at 1.5s
```

### 4.2 字幕直出要求

- 文案**零错字**(R5)，品牌名/型号/成分名逐字核对，官方拼写原样使用
- 单句 ≤12 字，超了拆两屏
- 位置/样式全片锁一套(见 [A1-subtitle.md](A1-subtitle.md))
- 出现时机比口播提前半拍，让静音用户先看到

### 4.3 字幕降级(模型直出不稳时)

> 模型直出水印/错字/乱码时，才降级为 SRT 烧录(见 [A1-subtitle.md](A1-subtitle.md) §8)。**直出是默认，降级是兜底**。

### 4.4 三合一同帧(字幕+对白+音效同段描述)

> 关键爆点(数字/名称/转折)处，把**字幕文案 + 对白/配音 + 音效**写进**同一段 prompt 描述**，天然同步，避免模型各自为政导致对不上。

```
Shot 4: ...实习生凑近低声报出数字，同时屏幕正中弹出大字幕"9000"(黄色加粗，弹入放大，配一声"叮")，师傅表情瞬间僵住。音频:BGM 骤停留白 0.3s，"叮"与"9000"弹出同帧。
```

- 三合一仅用于**爆点/关键对白**；普通镜仍按字幕/音频分栏写
- 时间词用"同帧 / 骤停 / 弹出时"这类事件锚点，不写秒数差异
- 对白口条(换气/尾音/避免播音腔)与字幕文案必须逐字一致

---

## §5 音频进 prompt(核心)

> **R3**:三层音频(人声·环境音·BGM)用语义化描述写进 `★ Audio` 段，让模型直出。

```
★ Audio:
- Voice: 女声旁白 "这虾仁也太鲜了" (自然口条，关键词前微停)
- Ambient: 撕包装"嘶啦" + 冰块碰撞"咔啦" + 厨房背景环境音
- BGM: 清新民谣(木吉他+钟琴)，轻快治愈，开头淡入，末镜淡出只留环境音
```

- 三层每镜都设计，不写 BPM/dB 数字(展示层才写)
- 环境音换场景就换；无对白时写生理音(呼吸/衣物摩擦)
- 关键音效点标镜次+时机

---

## §6 Final Prompt 拼接顺序模板

```
[画幅/时长/质感总述] Vertical 9:16, 15 seconds. Cinematic, shot on ARRI Alexa with shallow depth of field.

★ Main subject (角色四层，关键特征锁定):
[from M2]

★ Scene (场景三层 + 3+1 + 动态层):
[场景类型 + 时代/风格 + 3 个可辨识元素 + 1 个光源 + 1-2 个动态元素]

★ Action (按镜号 1:1，每镜单动作 + micro-action):
Shot 1 (0.0-2.5s): [动作 + micro-action]
Shot 2 (2.5-5.0s): ...
...

★ Camera language (按镜号 1:1，≤2 个运镜):
Shot 1: ...
Shot 2: ...
...

★ Text overlay (字幕直出，文案用引号包裹):
0.0-2.5s: "..." top-third, white bold, black outline

★ Audio (三层，语义化):
Voice / Ambient / BGM

★ Style anchor (整段 1 个):
[风格标签]

Negative constraints: no flicker, no mutation, no wrong text, no watermark
```

---

## §7 套用模板(需求简单时直接填)

> 上面 §6 讲拼接规则，这里给 4 套**可直接套用的现成模板**。复杂需求用 SKILL 路由后回到这里套模板。每套含:① 主 prompt(执行层,语义化) ② §4 声场设计稿(展示层,数字完整版)——两份保持一致。

### 7.1 唯美人像(小红书/抖音)

```text
Vertical 9:16, 15 seconds. Cinematic lifestyle style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A [年龄]-year-old [性别] with [发型/外貌], wearing [服装], [气质] temperament — keep consistent in every frame.

★ Scene: A [场景类型,如 forest path / seaside / cafe] in [时代风格], with [环境细节] — [soft warm afternoon light].

★ Action: [主体] walks slowly, [micro-action: hair swaying gently, soft breathing, occasional blinks], smiling naturally toward camera.

★ Camera: Slow dolly-in, [or lateral tracking]. No shaky-cam.

★ Lighting: Soft directional light from [方向], warm tone.

★ Style: Healing fresh, cinematic, [mood arc: calm → warm → serene].

★ Quality: 4K, shallow depth of field.

★ Audio:
- BGM: 清新木吉他 + 钟琴,慢节奏治愈系,0s 渐入,镜3 推满,末 2s 淡出
- 环境音: 远处鸟鸣 + 微风 + 脚步落叶
- 人声: 无对白,保留呼吸/衣物摩擦

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no mutation, no text, no watermark.
```

**§4 声场设计稿(数字完整版)**: BGM 清新民谣(木吉他+钟琴) 95 BPM 无歌词 · 0s 渐入 3s 到 -18dB · 镜3 推满 · 末 2s 淡出至 -30dB；环境音优先级 镜1 鸟鸣 -22dB / 镜2 风声 -20dB / 镜3-4 脚步 -24dB / 镜5 鸟鸣 -22dB；关键音效 镜3·2.5s 脚步加重 3dB；对白无；静音 无强制。

### 7.2 氛围感风景(空镜转场)

```text
Vertical 9:16, 15 seconds. Cinematic landscape style, in the spirit of BBC Earth, shot on ARRI Alexa.

★ Scene: [场景,如 seaside at sunset / mountain meadow at dawn], with [环境细节,如 gentle waves / dew on grass] — [warm orange golden hour light].

★ Action: [自然动态,如 waves gently rolling / wind sweeping the grass / clouds drifting].

★ Camera: Slow lateral pan [or slow dolly-out to wide]. Smooth, stable.

★ Lighting: [warm golden hour glow / soft diffused overcast light].

★ Style: Healing, serene, [mood arc: calm → immersive → tranquil].

★ Quality: 4K ultra-HD, smooth motion, no flicker, no ghosting.

★ Audio:
- BGM: 氛围 pad 弦乐 + 钢琴,极慢,纯环境音主导
- 环境音: 风声 / 水声 / 鸟鸣,层次清晰
- 人声: 无

★ Hard constraints:
— Stable frame, no flicker, natural physics, no text, no watermark.
```

### 7.3 图生视频专用(让照片动起来)

```text
Vertical 9:16, 15 seconds. Based on <图片1> as the first frame, keep the person's appearance and clothing consistent.

★ Main subject: Same person as <图片1> — [补充角色四层特征以加固].

★ Action: [主体] slowly [动作,如 raises hand and turns], natural and fluid, not stiff. [micro-action: hair movement, breathing, gentle expression shift].

★ Camera: Stable, [slow push-in or static with micro movement].

★ Lighting: Match the reference image lighting, [补充光源方向].

★ Style: Cinematic, natural, consistent with reference.

★ Quality: HD detail, cinematic texture.

★ Audio:
- BGM: 钢琴 + 大提琴,慢情绪弧
- 环境音: 微环境音(轻呼吸/衣料摩擦)
- 人声: 无对白,保留生理音

★ Hard constraints:
— Keep identity consistent with <图片1>, no deformation, no stiffness, stable frame, natural anatomy, no text.
```

### 7.4 多镜头示例(古风少女舞剑)

```text
Vertical 9:16, 15 seconds. Wuxia cinematic style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A young woman in ancient Chinese style, in white robes with flowing long hair, holding a green steel sword, resolute temperament — keep consistent in every frame.

★ Scene: A bamboo forest in early morning mist, with bamboo leaves and soft light filtering through — soft backlight with green bamboo shadows.

★ Action:
- 0.0–5.0s: The woman stands still, slowly raising her wrist to bring the sword to her chest, bamboo leaves falling lightly.
- 5.0–9.0s: Close-up of her eyes lowering then lifting, backlight outlining her silhouette, resolute gaze.
- 9.0–15.0s: She spins lightly and swings the sword in an arc (slow motion), bamboo leaves and sword gleam passing through frame.

★ Camera: Smooth dolly forward in segment 1; intimate dolly-in in segment 2; slow pan + zoom-in in segment 3. No shaky-cam.

★ Lighting: Morning mist, soft backlight, green bamboo shadows, cold white sword gleam.

★ Style: Wuxia cinematic, healing fresh + warm diffused light.

★ Quality: 4K, stable frame.

★ Audio:
- BGM: 古琴 + 尺八,极慢,纯古风情绪
- 环境音: 竹叶沙沙 + 远处鸟鸣 + 剑鸣
- 人声: 无对白,保留衣袖飘动摩擦

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no deformation, no text, no watermark.
```

### 7.5 模板使用工作流

```
1. 选模板(7.1-7.4 任一) → 2. 替换占位符 [xxx] → 3. 加钩子(SKILL §4.2) → 4. §4 声场设计稿(数字完整版) → 5. 校验(media-rules §5) → 6. 提交
```

---

## §8 自检(提交前)

- [ ] 八要素齐全
- [ ] 字幕文案零错字，品牌名逐字核对
- [ ] 字幕/音频语义化写进 prompt，无技术参数数字(BPM/dB/K)；**剧情爆点数字例外**(金额/名称/年龄)
- [ ] 场景 3+1 + 动态层写全，无空盒子/冻住
- [ ] 镜头 1:1 对应，单段 ≤2 个运镜(取词 M4)
- [ ] 单段顶格(15s 就 duration=15)；剧情类信息量大时分段(每段顶格)

任一不达标则修复后再提交。

---

→ [SKILL.md §4 编号索引](../../SKILL.md#§4-视频-reference-体系)