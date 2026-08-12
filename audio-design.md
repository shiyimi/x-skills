# Audio Design Reference

This reference defines the audio design methodology for the y-media skill's video storyboard workflow. It is referenced from §4.1 (后期 — Audio Design) of the [storyboard-methodology.md](storyboard-methodology.md). Read it during Step 3c (定后期) when designing the audio layer of a video storyboard.

## Three-Layer Audio Framework

Every video has three audio layers. Never rely on the model default background track alone. Design all three explicitly:

| Layer | What | When |
| --- | --- | --- |
| ① 人声 (Voice) | Dialogue, inner monologue, or silence | Decide first; determines the other two layers |
| ② 环境音+音效 (Ambient/SFX) | Scene-specific sounds, key sound effects | Every shot has at least 1 ambient cue |
| ③ BGM (Background Music) | Musical score, tempo, emotional arc | Map to goal and mood, never generic |

## 1. Voice Layer

### 1.1 Voice Modes

Pick one mode for the entire segment:

| Mode | Use | Delivery |
| --- | --- | --- |
| 有对白 | Talent speaks on camera; information-dense content | 每 8-12 字一次换气, 关键词前微停, 尾字自然下沉, 避免播音腔 |
| 纯 OS 心声 | Inner voice, low/slow; emotional, ASMR, narrative | 气声+弱混响, 语速 60-70% 正常, 尾字拖长 0.2s |
| 无对白 | Thicken ambient + physiological sounds; ASMR, visual-first | 放大环境音细节, 加入呼吸/衣物摩擦等生理音 |

### 1.2 Dialogue Writing Rules

- 每 8-12 字一次换气, 关键词前微停, 尾字自然下沉
- 避免播音腔: 用自然口语节奏, 可加入填充词(嗯, 就是, 说实话)
- 品牌名/数字/型号: 用引号包裹, 标注"按引号内文字原样渲染"
- 每句不超过 15 字, 长句按语义自然断句

## 2. Ambient & SFX Layer

### 2.1 Per-Scene Requirements

Every scene must have at least:
- **1 ambient bed**: continuous background sound (room tone, kitchen sizzle, street murmur, wind)
- **1-3 key SFX beats**: marked explicitly in the shot table with shot number, timing, and sound word

### 2.2 SFX Annotation Format

In the shot table's `音频三层` column, mark key SFX beats explicitly:

```text
音效点(镜3·2.5s): 裙摆"沙沙"加重 3dB
```

Format: `音效点(镜{N}·{time}s): {description}"{onomatopoeia}"{optional: gain change}`

### 2.3 Sound Word Library (Examples)

| Category | Sound words |
| --- | --- |
| 厨房 | 滋啦(煎炸), 嘶啦(撕包装), 咕嘟(煮), 咔啦(冰块碰撞), 噗(落碗) |
| 自然 | 沙沙(风/树叶), 淅沥(雨), 哗啦(水), 嗡嗡(昆虫) |
| 日常 | 咔嚓(快门), 叮(微波炉), 咚咚(敲门), 窸窣(衣物摩擦) |
| 人体 | 哈(呼气), 吞咽声, 脚步声, 呼吸声 |
| 电子 | 滴(提示音), 嗡(机器运转), 咔哒(开关) |

## 3. BGM Layer

### 3.1 BGM Specification

Always specify 4 fields in the audio strategy:

1. **风格**: 乐器/参考曲风 + BPM
2. **情绪**: 对应场景情绪
3. **入点/淡出时点**: 从哪一镜开始, 何时淡出
4. **关键节点**: 音画卡点, 情绪转换点

### 3.2 Goal-to-Tempo Mapping

| Goal | Serving | Tempo |
| --- | --- | --- |
| 转化 | 抓人→证明→催单 | 快, 90-130 BPM, 音画卡点 |
| 兴趣(种草) | 沉浸→共鸣 | 中, 75-100 BPM |
| 认知(品牌) | 审美→记忆 | 慢, 60-85 BPM, 情绪弧 |

### 3.3 Mood-to-Skin Mapping

| Query/场景情绪信号 | 风格皮肤 (示例) | BPM |
| --- | --- | --- |
| 食欲/鲜/香/爆汁 | 环境音为主,BGM 极淡 | ASMR 逻辑 |
| 燃/爽/开箱/真香 | 鼓点 build-up + drop | 110-140 |
| 甜/少女/约会/治愈 | 清新流行·木吉他·钟琴 | 90-110 |
| 高级/质感/氛围 | 钢琴独奏·氛围 pad | 60-80 |
| 温情/亲子/礼物 | 弦乐·钢琴·暖民谣 | 65-90 |
| 科技/参数/性能 | 合成器电子·脉冲音效 | 115-130 |

Never use a generic "轻音乐" or "background music" without specifying instrument, BPM, and emotional arc.

## 4. Audio Levers

Levers worth one line each in the storyboard header when applicable:

| Lever | Effect |
| --- | --- |
| 开场 3s 音频钩子 | First sound grabs attention (SFX burst / voice hook / BGM hard cut) |
| 音画卡点 | BGM beat aligns with visual cut or action peak |
| 静音留白→爆点炸开 | 0.5-1s full silence before emotional reveal or data punch |
| 声音记忆点 | A recurring short sound (brand jingle, notification tone) |
| 情绪音量曲线 | Volume rises with emotional arc, drops at quiet moments |

Silence is a tool:
- 情感反转前全断 0.5-1s — the silence makes the transition hit harder
- 数据字幕前 BGM 降 6dB+"叮" — audio focus shifts to the text
- 质感片末镜 BGM 淡出只留环境音 — natural, grounded ending

## 5. Audio In The Storyboard Document

### 5.1 Header Audio Strategy

One-line `音频策略` in the storyboard header, derived from the three layers:

```text
音频策略: 无口播 / 环境音(煎炸声+碗筷碰撞) / 轻快BGM 100BPM 木吉他
```

### 5.2 Shot Table Audio Column

The `音频三层` column in the shot table captures all three layers per shot:

```text
(环境)撕包装"嘶啦"+冰块碰撞"咔啦"/(BGM)木吉他扫弦淡入
```

Format: `(环境){sounds}/(BGM){bgm_description}` or `(人声){dialogue}/(环境){sounds}/(BGM){bgm_description}`

## 6. Audio Anti-Patterns

避免:
- 依赖模型默认背景音而不设计三层音频
- 全片只用一条 BGM 不做变化 (不同目标/情绪段应换曲)
- 音画脱节 (BGM 情绪与画面情绪冲突)
- 关键音效不标注时机和位置
- 有对白场景不写自然口语节奏
- 过度使用音效 (每镜超过 3 个 SFX 造成听觉疲劳)
- BGM 全程满音量不做淡入淡出和音量曲线
- 忽略静音留白这个最强的情感工具