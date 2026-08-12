# 分镜示例 · 精华液质地特写(commerce · 美妆)

> 题材:精华液质地+上脸+前后对比,环形灯+清新流行+6 类字幕。对应 [recipes/commerce.md §2.1 美妆个护](references/recipes/commerce.md)。
> **关键点**:**6 类字幕全用**;**强 i2v**(模特局部);9 镜;环形灯柔和;品牌名零错字。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 6 类字幕全用(钩/数据/背书/CTA) ② 强 i2v ③ 9 镜快切 ④ 环形灯+清新流行 ⑤ 品牌名零错字 R5
> - [CAN-ROTATE]: ① 产品(精华/面霜/口红) ② 模特特征 ③ 字幕文案 ④ 颜色(粉/香槟/品牌色)

---

## 1. 视频主要目标

`精华液带货 × 环形灯 × 转化-带货 × 清新流行 × 骨架A快切(9 镜,1.0-2.5s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成 + **强 i2v**(模特参考图);有字幕(6 类全用);9:16。
- **音频策略**: 目标=转化 · query="清新/护肤" → 清新流行(木吉他+钟琴,100BPM);环境音=开盖"叮"+滴管"嗒"+涂抹"沙"。**音频进 prompt + 侧车 Notes 副本**。
- **美学母体**: 粉白+香槟+奶白+品牌色;色温 5000K 环形灯;浅景深。
- **视听路线**:**含字幕**(6 类全用)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 | 字幕类型 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 1.5s | 远景·平视 | 缓推 0.2m/s | 环形灯 5000K | 精华液瓶身全景,大理石台面,绿植+镜子 | ★ | ① 钩子 |
| S01-02 | 1.5s | 特写·瓶身 | 固定 | 环形灯 5000K | 旋转瓶身,品牌 LOGO + 文字清晰 | ★ | — |
| S01-03 | 1.5s | 中近景·俯角 30° | 固定 | 环形灯 5000K | 开盖瞬间,"叮" | — | — |
| S01-04 | 1.5s | 特写·滴管 | 缓推 0.1m/s | 环形灯 5000K | 滴管提起,透明精华液滴落,慢动作 1/2x | ★ | ② 数据 |
| S01-05 | 1.5s | 中近景·平视 | 固定 | 环形灯 5000K | 模特半脸特写,涂抹,微距光泽流转 | ★ | — |
| S01-06 | 1.5s | 中景·平视 | 固定 | 环形灯 5000K | 前后对比同框,左用前右用后,光泽差异 | ★ | ③ 背书 |
| S01-07 | 1.5s | 特写·质地 | 缓推 0.1m/s | 环形灯 5000K | 质地纹理微距,流动性+吸收感 | — | — |
| S01-08 | 1.5s | 中近景·平视 | 缓推 0.15m/s | 环形灯 5000K | 模特微笑,光泽自然,品牌色配饰 | ★ | ⑥ 金句 |
| S01-09 | 2.0s | 远景·平视 | 缓拉镜 0.2m/s | 环形灯 5000K | 全身定格,价格+CTA | ★ | ④ CTA |

**合计**: 14.5s ≈ 15.0s / 9 镜 / ★ 7/9 / 字幕 5/6 类 / 帧数 361。

**3+1 真实环境**: 浅色大理石台面+化妆镜+绿植+顶光柔光。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 鼓点 build-up + drop 110-140BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: fresh folk (acoustic guitar + glockenspiel), 100 BPM, soft and catchy, beat drop...
- 数字完整版(供参考): 0.0–1.5s marble surface tone + room hum; 1.5–3.0s glass rotation soft whoosh; 3....

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Beauty e-commerce product showcase, ring-light, beat-synced hard cuts, shot on Sony A7RV with 100mm macro f/2.8, soft and luminous commercial color grade.

★ Main subject:
A glass bottle of facial essence serum with a dropper top, in soft champagne-gold color, sitting on a light marble surface. The brand label is clearly visible: [品牌名] 玻色因精华液. A small green plant and a round makeup mirror sit in the soft background. No additional text or QR code visible.

★ Scene:
A bright clean beauty counter in a well-lit studio, single ring-light at the front-center for soft shadowless lighting, light marble surface, soft sage-green plant accent.

★ Action (1:1 mirror, hard-hitting micro-actions synced to folk beat):
- 0.0–1.5s (S01-01): wide shot, the serum bottle stands elegantly on the marble surface, the ring-light creates a soft halo around it, the green plant and mirror in soft focus.
- 1.5–3.0s (S01-02): close-up of the bottle slowly rotating, the brand label and ingredient name clearly visible, light catches the glass.
- 3.0–4.5s (S01-03): overhead medium-close, a hand gently unscrews the dropper top, a soft "ding" tone, the cap placed on the marble.
- 4.5–6.0s (S01-04): extreme close-up of the dropper lifting, a single transparent serum drop falls in slow motion (1/2x speed), the drop catches light with a clear amber tint.
- 6.0–7.5s (S01-05): medium close-up of a model's half-face (right side), the serum is gently patted into the cheek, the skin catches a soft luminous glow.
- 7.5–9.0s (S01-06): medium shot of a before/after split composition — left side shows dull skin, right side shows luminous glowing skin, the same model, the contrast is clear.
- 9.0–10.5s (S01-07): extreme close-up of the serum texture on the back of a hand, the gel-like texture slowly absorbs into the skin.
- 10.5–12.0s (S01-08): medium close-up of the model smiling naturally, her skin looks dewy and luminous, a soft brand-color accessory in her hair.
- 12.0–14.0s (S01-09): full bottle freeze-frame with all elements composed, ready for the price card overlay.
- 14.0–15.0s (S01-09): static hold on the price-card composition, leaving room for the CTA.

★ Camera language (1:1 mirror, ≤ 2 moves):
- 0.0–1.5s: slow dolly-in from wide to medium, frontal.
- 1.5–3.0s: static close-up on the rotating bottle.
- 3.0–4.5s: static overhead medium-close.
- 4.5–6.0s: slow push-in to extreme close-up on the falling drop, slow motion.
- 6.0–7.5s: static medium close-up of the model's face.
- 7.5–9.0s: static split-screen composition.
- 9.0–10.5s: slow push-in to extreme close-up on the texture.
- 10.5–12.0s: slow push-in from medium to close on the model's smile.
- 12.0–15.0s: static wide, hold for the price card.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — large soft ring-light at the front-center, 5000K neutral, soft shadowless illumination, gentle catchlight in the model's eyes. Champagne gold + soft cream + sage green + clear glass throughout.

★ Audio (downstream soundscape, 1:1 mirror, hard cuts synced):
- Ambient: 0.0–1.5s marble surface tone + room hum; 1.5–3.0s glass rotation soft whoosh; 3.0–4.5s cap unscrew + marble "ding"; 4.5–6.0s dropper lift + drop "tap" + slow fall; 6.0–7.5s skin pat soft tone + breathing; 7.5–9.0s split-frame soft whoosh; 9.0–10.5s texture absorption soft sound; 10.5–12.0s soft smile + breath; 12.0–15.0s settle + hold room tone.
- BGM: fresh folk (acoustic guitar + glockenspiel), 100 BPM, soft and catchy, beat drop at S01-04 drop fall, sustained through S01-05/S01-07, fade in last 2s.
- No dialogue (visuals + subtitles carry info), no voiceover.

★ Style anchor:
Beauty e-commerce showcase, "starts with bottle elegance → peaks with the drop falling and skin glow → ends with model smile + price card".

★ Quality:
4K ultra-high definition, macro shallow depth of field, soft ring-light, luminous skin tone.

★ Hard constraints:
— Bottle keeps natural shape, no floating, no deformation.
— Drop falls naturally, no upward float, obeys gravity.
— All brand/ingredient text in overlays must be exact: [品牌名] 玻色因精华液 · 1.5% 玻色因 · 30ml (R5 zero-typo, must match the actual product).
— No text, no logo on the bottle other than the brand name, no watermark.
— Stable frame, no flicker, hand and fingers anatomically correct, no extra fingers, no deformed face.
```


