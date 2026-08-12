# 分镜示例 · 圣诞礼物拆开(lifestyle · 节日仪式感)

> 题材:圣诞夜暖灯串下拆开牛皮纸包裹的小礼物。对应 [recipes/lifestyle.md §2.4 节日/仪式感](references/recipes/lifestyle.md)。
> **关键点**:5 镜全微动作+暖光+暖灯串+木桌+蜡烛+牛皮纸。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 5 镜 1:1 ② 暖灯串+钢琴钟琴 ③ 无真人只露手 ④ 仪式微动作
> - [CAN-ROTATE]: ① 节日(圣诞/生日/新年) ② 礼物类型 ③ 装饰物 ④ 蜡烛数量

---

## 1. 视频主要目标

`圣诞拆礼物 × 仪式感 × 治愈 × 兴趣-种草(节日氛围) × 骨架B(5 镜,2.5-3.0s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;无真人(只露手部);无对白;9:16。
- **音频策略**: 目标=兴趣 · query="仪式感/治愈" → 钢琴+钟琴 75BPM;环境音=牛皮纸"窸窣"+蜡烛"噼啪"+暖灯串"微响"。**音频进 prompt + 侧车 Notes 副本**。
- **美学母体**: 暖金+原木+苔绿+朱红;色温 2500-3500K;胶片质感。
- **视听路线**: 无字幕(画面+BGM+环境音承担 100%)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 3.0s | 中景·俯角 45° | 缓推 0.2m/s | 暖灯串 3000K 光比 1.5:1 | 木桌上牛皮纸礼盒,暖灯串光斑闪烁,蜡烛微摇 | ★ |
| S01-02 | 3.0s | 特写·手 | 固定 | 暖灯串 3000K | 手指解开麻绳,绳圈"叮"地落桌,麻绳质感清晰 | ★ |
| S01-03 | 3.0s | 中近景·平视 | 缓推 0.1m/s | 暖灯串 3000K | 揭开牛皮纸,内层丝绒布反光,手部慢动作 | ★ |
| S01-04 | 3.0s | 特写·盒内 | 固定 + 微推 0.05m | 烛光 2700K | 盒内玻璃球挂件,内部雪花粉缓缓飘动,烛光透过 | ★ |
| S01-05 | 3.0s | 中景·俯角 45° | 缓拉镜 0.2m/s | 暖灯串 3000K | 双手捧起玻璃球,暖灯串光斑洒在球面,满桌圣诞元素 | ★ |

**合计**: 15.0s / 5 镜 / ★ 5/5 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 木质长桌 + 牛皮纸礼盒 + 麻绳 + 暖灯串 + 蜡烛 + 雪松枝。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴 60-80BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: piano + glockenspiel, slow and tender with a hint of "Silent Night" theme, singl...
- 数字完整版(供参考): 0.0–3.0s string-light soft hum + candle crackle; 3.0–6.0s rope fiber friction + ...

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Holiday ritual style, warm and intimate, soft cinematic with film grain, shot on ARRI Alexa with 50mm f/1.2.

★ Main subject:
A medium-sized gift wrapped in kraft paper and tied with natural hemp rope, sitting on a wooden table. Inside, a small glass snow-globe ornament with slowly drifting fake snow. Two weathered hands carefully unwrap the gift. No text on the wrapping.

★ Scene:
A wooden dining table on Christmas Eve, lit only by warm string lights and a single beeswax candle, with a few sprigs of fresh pine, dried orange slices, and a small wooden star. Cozy, intimate, indoor night.

★ Action (1:1 mirror):
- 0.0–3.0s (S01-01): the kraft-paper gift sits on the table, warm string lights cast soft moving bokeh in the background, candle flame flickers gently.
- 3.0–6.0s (S01-02): two weathered hands untie the hemp rope slowly, rope loop "clinks" softly on the wood, hemp fibers clearly visible.
- 6.0–9.0s (S01-03): hands lift the kraft paper, reveal velvet lining inside catching warm light, slow motion lift.
- 9.0–12.0s (S01-04): close-up of the glass snow-globe, fake snow drifts slowly inside, candle light passes through the glass casting warm reflections.
- 12.0–15.0s (S01-05): both hands cradle the snow-globe, string lights bokeh dances on the glass surface, full table view with all Christmas elements.

★ Camera language (1:1 mirror):
- 0.0–3.0s: slow dolly-in from medium to medium-close, overhead angle.
- 3.0–6.0s: static close-up of the hands and rope.
- 6.0–9.0s: slow push-in from medium-close to close.
- 9.0–12.0s: static macro with very gentle push-in.
- 12.0–15.0s: slow pull-out overhead from close to wide.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — warm string lights from above as key (2700K), single beeswax candle from the right as warm fill. No hard shadows. Warm gold + cream kraft + pine green + soft red berry throughout.

★ Audio (downstream soundscape, 1:1 mirror):
- Ambient: 0.0–3.0s string-light soft hum + candle crackle; 3.0–6.0s rope fiber friction + "clink" on wood; 6.0–9.0s paper crinkle + soft exhale; 9.0–12.0s glass faint tone + slow settling snow; 12.0–15.0s gentle table surface hum + distant muffled music box.
- BGM: piano + glockenspiel, slow and tender with a hint of "Silent Night" theme, single-note cold start, swell through the reveal (S01-04), soft fade in the last 2s.
- No dialogue, no captions.

★ Style anchor:
Holiday ritual, "starts with quiet anticipation → peaks with the reveal → ends with quiet wonder".

★ Quality:
4K ultra-high definition, shallow depth of field, soft warm light, gentle film grain.

★ Hard constraints:
— No text, no logo, no watermark, no readable writing on the wrapping.
— One continuous feel across the 5 beats; no editorial cuts.
— Stable frame, no flicker, no modern elements (no plastic ornaments, no synthetic textures).
```


