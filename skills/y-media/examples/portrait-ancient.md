# 分镜示例 · 竹林古风长袖舞剑(portrait · 古风国风)

> 题材:竹林薄雾中女性古风长袖舞剑,侧逆光体积光束。对应 [recipes/portrait.md §2.4 古风/国风人像](references/recipes/portrait.md)。
> **关键点**:**必走 i2v**;5 镜全慢动作;古琴+尺八 BGM;竹叶飘落+薄雾+灯笼。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 强 i2v ② 侧逆光+薄雾+体积光 ③ 古琴+尺八 ④ 5 镜慢动作无字幕
> - [CAN-ROTATE]: ① 题材(舞剑/弹琴/品茶/吹笛) ② 服装(汉服/旗袍/襦裙) ③ 道具(剑/琴/书) ④ 场景(竹林/亭台/古道)

---

## 1. 视频主要目标

`竹林古风长袖 × 侧逆光薄雾 × 古风 × 兴趣-种草(国风) × 骨架B慢切(5 镜,2.5-3.0s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成 + **强 i2v**(人脸);无对白;无字幕;9:16。
- **音频策略**: 目标=兴趣 · query="古风/意境" → 古琴+尺八 70BPM 极淡;环境音=剑"嗡"+竹叶"窸窣"+风+泉水。**音频进 prompt + 侧车 Notes 副本**。
- **美学母体**: 留白+青绿+朱红+素白;色温 4500K;浅景深 50mm。
- **视听路线**: 无字幕(古风留白,字幕破坏意境)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 3.0s | 远景·平视 | 缓推 0.2m/s | 侧逆光 4500K 薄雾 | 竹林中女性背对,长袖自然垂落,竹叶飘落 | ★ |
| S01-02 | 3.0s | 中近景·平视 | 固定 | 侧逆光 4500K 薄雾 | 慢动作拔剑,剑"嗡"响,薄雾被剑身划开 | ★ |
| S01-03 | 3.0s | 中景·平视 | 横移跟拍 0.4m/s | 侧逆光 4500K 薄雾 | 长袖飞舞,慢动作 1/2x,衣袂飘动如云 | ★ |
| S01-04 | 3.0s | 特写·面部侧颜 | 固定 | 侧逆光 4500K | 侧颜 3/4 位,眼神坚定,发丝勾边,灯笼暖光 | ★ |
| S01-05 | 3.0s | 远景·低角 | 缓拉镜 0.3m/s | 侧逆光 4500K | 收剑转身,长袖回落,薄雾中渐远,灯笼亮起 | ★ |

**合计**: 15.0s / 5 镜 / ★ 5/5 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 翠竹+薄雾+古道+远山+暖纸灯笼。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴+弦乐 70-90BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: guqin + shakuhachi, slow and meditative, cold start single-note, gentle swell th...
- 数字完整版(供参考): 0.0–3.0s bamboo leaf rustle + distant guqin fade-in; 3.0–6.0s sword metallic hum...

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Chinese wuxia ancient style, cinematic, in the spirit of "Crouching Tiger Hidden Dragon", shot on ARRI Alexa with 50mm anamorphic shallow depth of field, misty and elegant.

★ Main subject (four layers, lock all features):
Same person as <图片1> — A 22-year-old East Asian woman with long flowing black hair in a half-up bun, high cheekbones, small red lips, wearing a flowing white hanfu with wide silk sleeves, a jade pendant at the waist, and a soft silk sash. Serene focused martial temperament. Keep the same face, hair, body proportions, and clothing details across all frames (no character drift).

★ Scene:
A misty bamboo grove in the early morning, with thin drifting mist, scattered falling bamboo leaves, a stone path, distant warm paper lanterns glowing faintly, mountains barely visible through the mist. Cool-overall with warm lantern accents.

★ Action (1:1 mirror, all slow motion or contemplative pace):
- 0.0–3.0s (S01-02): the woman stands with her back to camera in the bamboo grove, wide silk sleeves hang naturally, a single bamboo leaf drifts down in front of her.
- 3.0–6.0s (S01-02): she draws a slender silver jian sword in slow motion (1/2x speed), the sword blade parts the thin mist, a faint metallic hum rings out.
- 6.0–9.0s (S01-03): lateral tracking shot as she performs a flowing sword movement, wide sleeves billow in slow motion like clouds, bamboo leaves scatter.
- 9.0–12.0s (S01-04): close-up of her face in 3/4 profile, eyes focused and calm, hair strands catch the rim light, a warm lantern glow from the right side lights her cheek.
- 12.0–15.0s (S01-05): she sheathes the sword with a final slow turn, the wide sleeves fall back to rest, she walks slowly into the deeper mist, a distant lantern brightens as she passes.

★ Camera language (1:1 mirror, ≤ 2 moves):
- 0.0–3.0s: slow dolly-in from wide to medium, frontal.
- 3.0–6.0s: static medium shot, capturing the sword draw.
- 6.0–9.0s: lateral tracking right-to-left, slow motion.
- 9.0–12.0s: static close-up profile, shallow focus.
- 12.0–15.0s: slow pull-out overhead angle from medium to wide.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — soft side-backlight from the upper left at 30° low angle, 4500K cool key, warm lantern glow as gentle fill from the right. Volumetric light shafts (Tyndall effect) through the bamboo and mist. Soft white + bamboo green + jade pale + warm lantern orange throughout.

★ Audio (downstream soundscape, 1:1 mirror):
- Ambient: 0.0–3.0s bamboo leaf rustle + distant guqin fade-in; 3.0–6.0s sword metallic hum + mist parting; 6.0–9.0s silk sleeve whoosh + bamboo sway; 9.0–12.0s single breath + lantern wind flicker; 12.5–15.0s sword sheath "clink" + footsteps fading in mist + distant bamboo wind.
- BGM: guqin + shakuhachi, slow and meditative, cold start single-note, gentle swell through the sword-draw moment (S01-02), soft fade in the last 2s.
- No dialogue, no captions.

★ Style anchor:
Chinese wuxia aesthetic, "starts with quiet mist → peaks with the sword draw → ends with serene retreat into the bamboo".

★ Quality:
4K ultra-high definition, anamorphic shallow depth of field, soft misty light, gentle film grain.

★ Hard constraints:
— Same person identity across all frames (no face-shape change, no hair-drift change).
— Anatomically correct hands, five fingers, no extra fingers.
— Natural silk-fabric flow, no stiff plastic movement.
— One continuous feel; transitions should not feel like hard cuts.
— No text, no logo, no watermark, no readable characters on the sword or sash.
```


