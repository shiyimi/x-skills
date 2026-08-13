# 分镜示例 · 杂志封面柔光人像(portrait · 高级感)

> 题材:柔光箱下女性杂志封面式人像,慢动作甩发+服装细节。对应 [recipes/portrait.md §2.1 杂志人像](references/recipes/portrait.md)。
> **关键点**:**必走 i2v**(人脸必须参考图锚定,防恐怖谷);5 镜全微动作+柔光+素背景+慢动作。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 强 i2v ② 柔光箱+慢动作甩发 ③ 5 镜无字幕(高级感) ④ 钢琴独奏
> - [CAN-ROTATE]: ① 服装 ② 模特特征(年龄/发型) ③ 背景(纯色/极简家居) ④ 道具

---

## 1. 视频主要目标

`杂志封面女性人像 × 柔光 × 高级感 × 兴趣-种草(形象) × 骨架B(5 镜,2.5-3.5s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成 + **强 i2v**(人脸参考图必填);无对白;无字幕;9:16 @ 720×1280。
- **音频策略**: 目标=兴趣 · query="高级/质感" → 钢琴独奏 70BPM;环境音=布料"沙沙"+呼吸+微弱环境。**音频进 prompt + 伴生文档 Notes 副本**。
- **美学母体**: 米白+高级灰+浅金;色温 5000K;浅景深 85mm。
- **视听路线**: 无字幕(高级感,字幕会污染画面)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 3.0s | 中景·平视 | 缓推 0.15m/s | 柔光箱 5000K 光比 1.5:1 | 女性背对镜头,慢转身,头发随转身轻扬 | ★ |
| S01-02 | 3.0s | 特写·眼部 | 固定 | 柔光箱 5000K | 眼神流转,睫毛轻扇,鼻梁高光清晰 | ★ |
| S01-03 | 3.0s | 中近景·平视 | 横移跟拍 0.3m/s | 柔光箱 5000K | 慢动作甩发,发丝在光带中飘动,慢镜头 | ★ |
| S01-04 | 3.0s | 特写·服装 | 缓推 0.1m/s | 柔光箱 5000K | 手指轻触锁骨链,链子反光,服装面料质感清晰 | ★ |
| S01-05 | 3.0s | 中景·平视 | 缓拉镜 0.2m/s | 柔光箱 5000K | 双手交叉胸前,微侧头,光影渐变,杂志感定格 | ★ |

**合计**: 15.0s / 5 镜 / ★ 5/5 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 极简米白背景墙 + 一束顶光 + 软反射板 + 单人主体。

## 3. Generation

(交付后由 Step 7 追加:Provider / model / 参考图 URL / effective parameters / warnings / timing。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴 60-80BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: solo piano, slow and elegant, single-note cold start, gentle swell through the s...
- 数字完整版(供参考): 0.0–3.0s soft fabric rustle + gentle breath; 3.0–6.0s single soft blink + micro-...

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. High-end magazine cover style, soft studio cinematic, shot on Hasselblad H6D with 85mm f/1.2 shallow depth of field.

★ Main subject (four layers, lock all features across all frames):
Same person as <图片1> — A 26-year-old East Asian woman with long straight black hair, high cheekbones, small nose, soft lips, wearing a cream-white silk blouse and a delicate gold collarbone chain. Calm confident temperament, soft contemplative gaze. Keep the same face, hair, body proportions, and clothing details across all frames (no character drift).

★ Scene:
A minimalist photo studio with a soft cream-white seamless background, single large softbox key light at 45° front-right, gentle fill reflector on the left. No other props, no environment clutter.

★ Action (1:1 mirror, slow, micro-actions):
- 0.0–3.0s (S01-01): the woman has her back to camera, slowly turns to face front, hair softly lifts with the turn, eyes downcast.
- 3.0–6.0s (S01-02): extreme close-up of her eyes — slow gaze lift to camera, single slow blink, lashes clearly visible, nose-bridge highlight soft.
- 6.0–9.0s (S01-03): the woman slowly shakes her head side-to-side, hair flows in a light wind (off-screen fan), slow motion 1/2x speed, individual hair strands visible in the light.
- 9.0–12.0s (S01-04): close-up of her right hand gently touching the gold collarbone chain, chain catches light, fabric texture of the silk blouse clearly visible.
- 12.0–15.0s (S01-05): she crosses both arms in front of her chest, tilts head slightly to the right, soft magazine-cover freeze-frame, gentle light falloff.

★ Camera language (1:1 mirror, ≤ 2 moves):
- 0.0–3.0s: slow dolly-in from medium to medium-close, frontal.
- 3.0–6.0s: static macro close-up on the eyes.
- 6.0–9.0s: lateral tracking right-to-left, slow motion, isolating hair.
- 9.0–12.0s: slow push-in overhead-angled close-up on the hand and chain.
- 12.0–15.0s: slow pull-out from medium-close to medium, frontal.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — large 5000K softbox at 45° front-right, low contrast 1.5:1, gentle white fill from a soft reflector on the left. No hard shadows, no rim light needed (clean magazine look). Cream white + soft gold + warm pearl throughout.

★ Audio (downstream soundscape, 1:1 mirror):
- Ambient: 0.0–3.0s soft fabric rustle + gentle breath; 3.0–6.0s single soft blink + micro-movement of hair; 6.0–9.0s soft wind from off-screen fan + hair-flow whoosh; 9.0–12.0s chain micro-clink + silk fabric friction; 12.0–15.0s gentle settling breath + studio silence.
- BGM: solo piano, slow and elegant, single-note cold start, gentle swell through the slow-motion hair-flip (S01-03), soft fade in the last 2s.
- No dialogue, no captions.

★ Style anchor:
High-end magazine cover, "starts with quiet back view → peaks with the hair flip in slow motion → ends with a contemplative freeze-frame".

★ Quality:
4K ultra-high definition, ultra-shallow depth of field, soft diffused light.

★ Hard constraints:
— Same person identity across all frames (no face-shape change, no eye-color shift, no body proportion drift).
— Anatomically correct hands, five fingers each, no extra fingers.
— Natural silk-fabric texture, no plastic shine.
— One continuous feel across the 5 beats.
— No text, no logo, no watermark, no on-screen caption.
```


