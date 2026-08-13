# 分镜示例 · 晨雾森林雄鹿与幼鹿(自然治愈系,骨架B)

> 本文件是 [M1-methodology.md](../references/library/M1-methodology.md) 的**完整填好示例**,对应一次 15s 视频生成的最终交付。题材选**晨雾森林雄鹿与幼鹿**(成兽+幼兽+关系类)。
>
> **关键区分(展示层 vs 执行层)**:分镜表用具体数字(K/dB/BPM/焦段)做**展示层**记录,便于归档;**提交给 t2v 模型的 prompt 走执行层语义化路线**——模型层分离无效(M3,K/dB/BPM 留在展示层与 `§4 声场设计稿`),且音频对**不支持音频的模型**(当前 Agnes)无效(M5)。详见 [M1-methodology.md §7.1](../references/library/M1-methodology.md) 与 [M6-prompt-craft.md](../references/library/M6-prompt-craft.md)。
>
> **镜头结构**:`Final Prompt` 按 §2 表格镜号 **1:1 对应**——每镜一个时间锚点,`Action` 与 `Camera language` 两段都用同一组时间锚点,**不主动合并**。本例 6 镜 → 6 个时间段(0.0–2.5s/2.5–5.0s/5.0–8.0s/8.0–10.5s/10.5–13.0s/13.0–15.0s)。
>
> **文档顺序**:`## 1 视频主要目标` → `## 2 分镜表格(展示层)` → `## 3 Generation` → `## 4 视频 prompt(执行层,放最后)`。`Final Prompt` 一定在最后,便于整段复制提交。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 6 镜 1:1 时间锚点对应 ② 黄金时刻+晨雾+侧逆光 ③ BBC Earth 风格锚 ④ 拟声词(草/水/呼吸)进 prompt
> - [CAN-ROTATE]: ① 主体(鹿/兔/狼+幼崽) ② 具体地理(雾林/雪原/草原) ③ 主体配色 ④ 镜头细节(平视/仰拍)

---

## 1. 视频主要目标

`成年雄鹿 + 幼鹿 × 全龄(自然/治愈/亲子) × 兴趣-种草(情绪治愈,温情守护) × 骨架B(情感叙事·线性起承转合) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;无真人;无对白;单段直出;9:16 @ 720×1280。
- **音频策略**: 目标=兴趣/种草 · query="温情守护" → 钢琴+大提琴+钟琴 70 BPM,钢琴冷启渐入,无对白,环境音(蹄声/雾气/鸟鸣/树叶/小鹿鸣)为信息主体。**音频描述也写进 prompt 正文(★ Audio 段,见 §4)**,便于未来音画同出 Provider 直接读取 + 后期音频师拿到完整声场。
- **美学母体**: 雾白+暖金+苔绿+深棕,BBC Earth 自然纪录片质感;色温 4500-5200K;浅景深,16mm→85mm 自然切换。
- **视听路线**: 无字幕(画面+BGM+环境音承担 100% 信息)。

## 2. 分镜表格(展示层 · 创作规划)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影(展示层) | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 2.5s | 远景·平视 | 缓推 dolly-in 0.2m/s | 晨雾侧逆光·4500K·光比3:1 | 雄鹿从晨雾远处缓步走出,幼鹿紧跟半步后,雄鹿不时回头 | ★ |
| S01-02 | 2.5s | 中景·低角度仰拍 40° | 横移跟拍 0.8m/s | 侧光·4800K·光比2:1 | 雄鹿缓步前行,幼鹿蹦跳跟随,偶尔蹭雄鹿前腿 | ★ |
| S01-03 | 3.0s | 中近景·平视 | 固定 + 微推 0.2m | 顶光+侧补光·5000K·光比2.5:1 | 雄鹿突然停下回头凝望,幼鹿抬头回应,父子温情对望 | ★ |
| S01-04 | 2.5s | 特写·平视(小鹿面部) | 固定 | 柔顺光·5200K·光比1.5:1 | 幼鹿睁大眼睛,耳朵竖起轻抖,小嘴微动,眼神天真 | ★ |
| S01-05 | 2.5s | 近景·侧逆光 3/4位 | 环绕小角度 45° 弧 0.3m/s | 强逆光·4800K·光比4:1·发丝光勾边 | 雄鹿低头鼻子轻触幼鹿额头,幼鹿眯眼;2-3 只萤火虫飞舞 | ★ |
| S01-06 | 2.0s | 极远景·俯拍 60° | 缓拉镜 0.3m/s | 黄金时段光·4800K·光比3:1 | 雄鹿带幼鹿渐走渐远,变成林间两个温情小点,幼鹿仍紧跟 | ★ |

**展示层合计**: 15.0s / 6 镜 / ★ 6/6 / 字幕 0 / 帧数 15×24=360 → 调整为 361(8n+1)。

**道具/环境(3+1 真实感)**: 前景:蕨类/倒木/狗尾巴草 · 中景:雄鹿(5岁,9 枝鹿角,深棕) + 幼鹿(3 月,浅棕白斑) · 背景:针叶林+晨雾+丁达尔光束+远山;1 个主光源(晨雾侧逆光)。

**音频三层(展示层,仅供下游参考)**: BGM 70BPM 钢琴+大提琴+钟琴,S01-05 推满,S01-06 末 2s 淡出至 -30dB;环境音:晨雾流动+蹄踩落叶+小鹿"唧"+树叶"窸窣"+鸟鸣+鼻息"呼";**无对白,无字幕**。

## 3. Generation

(交付后由 Step 7 追加:Provider / model / task.id / effective parameters / warnings / timing。此处占位,不预填。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴 60-80BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: soft piano + cello + glockenspiel, slow emotional arc — quiet cold start, swelling gently through the eye-contact moment, peak at the forehead touch (S01-05), soft fade in the last 2 seconds of S01-06.
- 数字完整版(供参考): 0.0–2.5s low-frequency forest hush + distant birdsong + soft hoof-fall on damp leaves; 2.5–5.0s gentle rustle of undergrowth + soft fawn bleat; 5.0–8.0s silence swells + faint exhale + mist drifting whoosh; 8.0–10.5s single clear fawn bleat (chime-like) + soft ear-twitch micro-rustle; 10.5–13.0s brief tender exhale + firefly hum; 13.0–15.0s ambient forest hush + duo hoof-falls fading.

## 5. 视频 prompt(执行层 · 提交给 t2v 模型)

> **执行层规则**(见 [M1-methodology.md §7.1](../references/library/M1-methodology.md) 与 [M6-prompt-craft.md](../references/library/M6-prompt-craft.md)):
> 1. `Action` 与 `Camera language` **按 §2 表格镜号 1:1 对应**;禁止主动合并相邻镜头
> 2. 数字参数语义化转换(层分离):4500K → `soft golden morning backlight`;光比/dB/BPM 移出(M3)
> 3. 音频进 prompt 正文(`★ Audio`)——即便是 Agnes 不生成分时音频,音频描述也要写进 prompt,便于未来音画同出 Provider 与后期音频师拿到完整声场。
> 4. 套用八要素骨架 + 角色四层 + 场景三层([M6-prompt-craft.md §1 八要素表](../references/library/M6-prompt-craft.md))
> 5. 约束块焊死(M2 防变形)
> 6. 伴生文档 `Negative Prompt` 作为 `Negative constraints:` 段并入最终 prompt,并与 Hard Constraints 去重

```text
Vertical 9:16, 15 seconds. Cinematic nature documentary style, in the spirit of BBC Earth and National Geographic, shot on ARRI Alexa with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
A mature 5-year-old male red deer with a 9-point antler rack, deep-brown coat, calm protective temperament; and a 3-month-old fawn with light-brown fur marked by white spots, large dark eyes, curious innocent temperament. Keep the same proportions, antler count, and coat patterns across all frames (no character drift).

★ Scene (three layers + atmosphere):
A misty coniferous forest in early-morning countryside style, with fern understory, moss-covered fallen logs, and thin drifting mist — soft golden sunrise backlight from a low sun filtering through tree trunks as light shafts (Tyndall effect), with gentle wind in the canopy.

★ Action (1:1 mirror of §2 storyboard — slow, continuous, single motion per beat; with micro-actions):
- 0.0–2.5s (S01-01): the mature stag steps slowly out of the distant mist, the fawn follows half a step behind, the stag occasionally glances back. Subtle ear twitches on the fawn, soft breathing visible, light tail sway.
- 2.5–5.0s (S01-02): the stag and fawn continue forward at a steady pace, the fawn occasionally nuzzles the stag's front leg, hooves rustle softly through the undergrowth.
- 5.0–8.0s (S01-03): the stag suddenly pauses, turns its head to look down at the fawn, the fawn looks up to meet its gaze — a tender moment of eye contact. Soft breathing visible, mist drifting between them.
- 8.0–10.5s (S01-04): close-up of the fawn — eyes widen, ears perk up and tremble slightly, small mouth opens as if softly bleating, an innocent gaze. Soft bokeh and light flecks drift in the background.
- 10.5–13.0s (S01-05): the stag lowers its head and gently touches the fawn's forehead with its nose; the fawn squints softly. A few fireflies drift in the foreground bokeh.
- 13.0–15.0s (S01-06): the stag leads the fawn slowly into the deeper forest, becoming two small warm dots in the vast misty forest. Golden sunrise light wraps the canopy.

★ Camera language (1:1 mirror of §2 storyboard — ≤ 2 moves per segment):
- 0.0–2.5s: wide establishing shot, slow dolly-in as the deer approach out of the mist.
- 2.5–5.0s: low-angle lateral tracking from left to right, following the deer.
- 5.0–8.0s: static + micro push-in on the eye-contact moment.
- 8.0–10.5s: static close-up, shallow depth of field isolating the fawn.
- 10.5–13.0s: slow arc shot orbiting the stag from 3/4 rear to side-rear.
- 13.0–15.0s: high-angle slow pull-out, rack focus from the deer to the misty distance.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — low golden morning sun behind the subjects (rim/backlight), soft fill from the mist and sky. Light shafts (Tyndall effect) filter through tree trunks. Mist white + warm gold + moss green + deep brown throughout.

★ Audio (downstream soundscape — written into the prompt so audio engineers and audio-capable models have the full soundscape; BPM/dB are excluded as in M3):
- Ambient sound design (1:1 mirror of storyboard, micro-actions provide sonic cues):
  - 0.0–2.5s (S01-01): low-frequency forest hush, distant birdsong, soft hoof-fall on damp leaves as the stag emerges.
  - 2.5–5.0s (S01-02): gentle rustle of undergrowth, occasional soft fawn bleat, light tail-fur swish.
  - 5.0–8.0s (S01-03): silence swells into the moment of eye contact, faint exhale from the stag, mist drifting whoosh.
  - 8.0–10.5s (S01-04): single clear fawn bleat (a small chime-like tone), soft ear-twitch micro-rustle.
  - 10.5–13.0s (S01-05): a brief tender exhale from the stag as its nose touches the fawn's forehead; firefly hum softly layered in.
  - 13.0–15.0s (S01-06): return to ambient forest hush, the duo's hoof-falls fading into the distance.
- BGM (1:1 mirror): soft piano + cello + glockenspiel, slow emotional arc — quiet cold start, swelling gently through the eye-contact moment, peak at the forehead touch (S01-05), soft fade in the last 2 seconds of S01-06.
- No dialogue, no on-screen captions.

★ Style anchor:
Cinematic, BBC Earth, healing and tender mood, "starts calmly → peaks with the forehead touch → ends quietly in the distance".

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, soft warm light.

★ Hard constraints (weld to end):
— Same deer identities across all frames (no character drift).
— One continuous single take; do not cut or stitch multiple segments (the 6 mirror segments above are action beats, not editorial cuts).
— Stable frame, no flicker, natural cervid anatomy, no mutation, no deformed deer, no extra legs, no text, no logo, no watermark.
```


