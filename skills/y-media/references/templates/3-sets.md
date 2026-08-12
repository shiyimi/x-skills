# 4 套即用模板 · 4 Ready-to-use Templates

> 本文件提供**可直接套用的 prompt 模板**,需求简单时替换占位符即可生成。复杂需求用 [SKILL.md §4.1 场景速配表](../../SKILL.md) 路由后回到本文件套模板。
>
> 与 [../library/M8-prompt-craft.md](../library/M8-prompt-craft.md) 配合:那里讲规则,这里给现成模板。
>
> **每套模板**包含:① 主 prompt(执行层,语义化) ② §4 声场设计稿(展示层,数字完整版)——两份保持一致。
>
> **钩子速查**:见 [SKILL.md §4.2](../../SKILL.md)(本文件不重复)。

---

## 1. 唯美人像短视频(适合小红书/抖音)

```text
Vertical 9:16, 15 seconds. Cinematic lifestyle style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A [年龄]-year-old [性别] with [发型/外貌], wearing [服装], [气质] temperament — keep consistent in every frame.

★ Scene: A [场景类型,如 forest path / seaside / cafe] in [时代风格], with [环境细节] — [soft warm afternoon light].

★ Action: [主体] walks slowly, [micro-action: hair swaying gently, soft breathing, occasional blinks], smiling naturally toward camera.

★ Camera: Slow dolly-in, [or lateral tracking]. No shaky-cam.

★ Lighting: Soft directional light from [方向], warm tone, [no K number in prompt — goes to §4 below].

★ Style: Healing fresh, cinematic, [mood arc: calm → warm → serene].

★ Quality: 4K, shallow depth of field.

★ Audio: [语义化,无 BPM/dB 数字;见 audio.md §2.2], e.g.
- BGM: 清新木吉他 + 钟琴,慢节奏治愈系,0s 渐入,镜3 推满,末 2s 淡出
- 环境音: 远处鸟鸣 + 微风 + 脚步落叶
- 人声: 无对白,保留呼吸/衣物摩擦

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no mutation, no text, no watermark.
```

**§4 声场设计稿(数字完整版;与 ★ Audio 段保持一致)**:
- BGM: 清新民谣(木吉他 + 钟琴),95 BPM,无歌词 · 0s 渐入,3s 到 -18dB · 镜3 推满 · 末 2s 淡出至 -30dB
- 环境音优先级(按镜号 1:1 对应):镜1 鸟鸣 -22dB / 镜2 风声 -20dB / 镜3-4 脚步 -24dB / 镜5 鸟鸣 -22dB
- 关键音效点: 镜3·2.5s 脚步加重 3dB
- 对白/口播: 无
- 静音规则: 无强制静音

**适合**: 小红书/抖音美女人像、生活方式博主、品牌形象短片。

---

## 2. 氛围感风景(空镜转场必备)

```text
Vertical 9:16, 15 seconds. Cinematic landscape style, in the spirit of BBC Earth, shot on ARRI Alexa.

★ Scene: [场景,如 seaside at sunset / mountain meadow at dawn], with [环境细节,如 gentle waves lapping the sand / dew on grass] — [warm orange golden hour light].

★ Action: [自然动态,如 waves gently rolling / wind sweeping the grass / clouds drifting slowly].

★ Camera: Slow lateral pan [or slow dolly-out to wide]. Smooth, stable.

★ Lighting: [光线,如 warm golden hour glow / soft diffused overcast light], [no K number in prompt — goes to §4 below].

★ Style: Healing, serene, [mood arc: calm → immersive → tranquil].

★ Quality: 4K ultra-HD, smooth motion, no flicker, no ghosting.

★ Audio: [语义化], e.g.
- BGM: 氛围 pad 弦乐 + 钢琴,极慢,纯环境音主导
- 环境音: 风声 / 水声 / 鸟鸣,层次清晰
- 人声: 无

★ Hard constraints:
— Stable frame, no flicker, natural physics, no text, no watermark.
```

**§4 声场设计稿(数字完整版;与 ★ Audio 段保持一致)**:
- BGM: 氛围 pad 弦乐 + 钢琴,70 BPM,无歌词 · 0s 入4s 到 -20dB · 镜3 推满 · 末 3s 淡出至 -32dB
- 环境音优先级: 镜1 风声 -18dB / 镜2 流水 -20dB / 镜3-4 鸟鸣 -22dB / 镜5 风声 -18dB
- 关键音效点: 镜2·3.0s 鸟鸣高潮 -16dB
- 对白/口播: 无
- 静音规则: 镜5 末 0.5s 静音(给自然余韵)

**适合**: 视频片头/片尾空镜、转场插画、城市宣传片、风光 Vlog。

---

## 3. 图生视频专用(让照片动起来)

```text
Vertical 9:16, 15 seconds. Based on <图片1> as the first frame, keep the person's appearance and clothing consistent.

★ Main subject: Same person as <图片1> — [补充角色四层特征以加固].

★ Action: [主体] slowly [动作,如 raises hand and turns], natural and fluid, not stiff. [micro-action: hair movement, breathing, gentle expression shift].

★ Camera: Stable, [slow push-in or static with micro movement].

★ Lighting: Match the reference image lighting, [补充光源方向]. [no K number in prompt — goes to §4 below].

★ Style: Cinematic, natural, consistent with reference.

★ Quality: HD detail, cinematic texture.

★ Audio: [语义化], e.g.
- BGM: 钢琴 + 大提琴,慢情绪弧
- 环境音: 微环境音(轻呼吸/衣料摩擦)
- 人声: 无对白,保留生理音

★ Hard constraints:
— Keep identity consistent with <图片1>, no deformation, no stiffness, stable frame, natural anatomy, no text.
```

**§4 声场设计稿(数字完整版;与 ★ Audio 段保持一致)**:
- BGM: 钢琴 + 大提琴,75 BPM,无歌词 · 0s 渐入,3s 到 -18dB · 镜3 推满 · 末 2s 淡出至 -30dB
- 环境音优先级: 镜1 静态 -28dB / 镜2 衣物摩擦 -22dB / 镜3 呼吸 -24dB / 镜4 衣物 -22dB / 镜5 静态 -28dB
- 关键音效点: 镜2·1.5s 衣料摩擦加重 3dB
- 对白/口播: 无
- 静音规则: 镜1 / 镜5 末 0.5s 静音

**适合**: 朋友圈照片动起来、摄影作品活化、产品图 360° 展示。

---

## 4. 多镜头示例(古风少女舞剑)

```text
Vertical 9:16, 15 seconds. Wuxia cinematic style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A young woman in ancient Chinese style, in white robes with flowing long hair, holding a green steel sword, resolute temperament — keep consistent in every frame.

★ Scene: A bamboo forest in early morning mist, with bamboo leaves and soft light filtering through — soft backlight with green bamboo shadows.

★ Action:
- 0.0–5.0s: The woman stands still, slowly raising her wrist to bring the sword to her chest (slow continuous motion), bamboo leaves falling lightly.
- 5.0–9.0s: Close-up of her eyes lowering then lifting (emotion progression), backlight outlining her silhouette, resolute gaze.
- 9.0–15.0s: She spins lightly and swings the sword in an arc (slow motion), bamboo leaves and sword gleam passing through frame.

★ Camera: Smooth dolly forward in segment 1; intimate dolly-in in segment 2; slow pan + zoom-in in segment 3. No shaky-cam.

★ Lighting: Morning mist, soft backlight, green bamboo shadows, cold white sword gleam. [no K number in prompt — goes to §4 below].

★ Style: Wuxia cinematic, healing fresh + warm diffused light.

★ Quality: 4K, stable frame.

★ Audio: [语义化], e.g.
- BGM: 古琴 + 尺八,极慢,纯古风情绪
- 环境音: 竹叶沙沙 + 远处鸟鸣 + 剑鸣
- 人声: 无对白,保留衣袖飘动摩擦

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no deformation, no text, no watermark.
```

**§4 声场设计稿(数字完整版;与 ★ Audio 段保持一致)**:
- BGM: 古琴 + 尺八,70 BPM,无歌词 · 0s 入5s 到 -22dB · 镜2 推满 · 末 3s 淡出至 -32dB
- 环境音优先级: 镜1 竹叶沙沙 -20dB / 镜2 静态 -28dB / 镜3 剑鸣 -18dB
- 关键音效点: 镜3·12.0s 剑鸣高潮 -14dB
- 对白/口播: 无
- 静音规则: 镜2 末 0.5s 静音(给情绪)

**适合**: 古风武侠、品牌形象片、抖音古风挑战。

---

## 5. 模板使用工作流

```
1. 选模板(本文件)         → 1/2/3/4 任一
2. 替换占位符 [xxx]         → 用 brief + scene 路由结果
3. 加钩子(见 SKILL.md §4.2) → ★ Action 第一段填入
4. §4 声场设计稿(本文件每套模板已含)→ 数字完整版与 ★ Audio 段保持一致
5. 校验(见 media-rules.md §5) → 单段直出/多段拼接/帧数合规
6. 提交
```
