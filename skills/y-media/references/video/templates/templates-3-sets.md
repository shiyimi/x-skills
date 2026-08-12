# 3 套即用模板 · 3 Ready-to-use Templates

> 本文件提供**可直接套用的 prompt 模板**,需求简单时替换占位符即可生成。复杂需求用 [scene-quick-match.md](scene-quick-match.md) 路由后回到本文件套模板。
>
> 与 [../prompt-craft.md](../prompt-craft.md) 配合:那里讲规则,这里给现成模板。

---

## 1. 唯美人像短视频(适合小红书/抖音)

```text
Vertical 9:16, [时长] seconds. Cinematic lifestyle style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A [年龄]-year-old [性别] with [发型/外貌], wearing [服装], [气质] temperament — keep consistent in every frame.

★ Scene: A [场景类型,如 forest path / seaside / cafe] in [时代风格], with [环境细节] — [光线天气,如 soft warm afternoon light].

★ Action: [主体] walks slowly, [micro-action: hair swaying gently, soft breathing, occasional blinks], smiling naturally toward camera.

★ Camera: Slow dolly-in, [or lateral tracking]. No shaky-cam.

★ Lighting: Soft directional light from [方向], warm tone.

★ Style: Healing fresh, cinematic, [mood arc: calm → warm → serene].

★ Quality: 4K, shallow depth of field.

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no mutation, no text, no watermark.
```

**适合**: 小红书/抖音美女人像、生活方式博主、品牌形象短片。

---

## 2. 氛围感风景(空镜转场必备)

```text
Vertical 9:16, [时长] seconds. Cinematic landscape style, in the spirit of BBC Earth, shot on ARRI Alexa.

★ Scene: [场景,如 seaside at sunset / mountain meadow at dawn], with [环境细节,如 gentle waves lapping the sand / dew on grass] — [光线,如 warm orange golden hour light].

★ Action: [自然动态,如 waves gently rolling / wind sweeping the grass / clouds drifting slowly].

★ Camera: Slow lateral pan [or slow dolly-out to wide]. Smooth, stable.

★ Lighting: [光线,如 warm golden hour glow / soft diffused overcast light].

★ Style: Healing, serene, [mood arc: calm → immersive → tranquil].

★ Quality: 4K ultra-HD, smooth motion, no flicker, no ghosting.

★ Hard constraints:
— Stable frame, no flicker, natural physics, no text, no watermark.
```

**适合**: 视频片头/片尾空镜、转场插画、城市宣传片、风光 Vlog。

---

## 3. 图生视频专用(让照片动起来)

```text
Vertical 9:16, [时长] seconds. Based on <图片1> as the first frame, keep the person's appearance and clothing consistent.

★ Main subject: Same person as <图片1> — [补充角色四层特征以加固].

★ Action: [主体] slowly [动作,如 raises hand and turns], natural and fluid, not stiff. [micro-action: hair movement, breathing, gentle expression shift].

★ Camera: Stable, [slow push-in or static with micro movement].

★ Lighting: Match the reference image lighting, [补充光源方向].

★ Style: Cinematic, natural, consistent with reference.

★ Quality: HD detail, cinematic texture.

★ Hard constraints:
— Keep identity consistent with <图片1>, no deformation, no stiffness, stable frame, natural anatomy, no text.
```

**适合**: 朋友圈照片动起来、摄影作品活化、产品图 360° 展示。

---

## 4. 多镜头示例(古风少女舞剑,5s)

```text
Vertical 9:16, 5 seconds. Wuxia cinematic style, shot on ARRI Alexa with shallow depth of field.

★ Main subject: A young woman in ancient Chinese style, in white robes with flowing long hair, holding a green steel sword, resolute temperament — keep consistent in every frame.

★ Scene: A bamboo forest in early morning mist, with bamboo leaves and soft light filtering through — soft backlight with green bamboo shadows.

★ Action:
- 0.0–2.0s: The woman stands still, slowly raising her wrist to bring the sword to her chest (slow continuous motion), bamboo leaves falling lightly.
- 2.0–3.5s: Close-up of her eyes lowering then lifting (emotion progression), backlight outlining her silhouette, resolute gaze.
- 3.5–5.0s: She spins lightly and swings the sword in an arc (slow motion), bamboo leaves and sword gleam passing through frame.

★ Camera: Smooth dolly forward in segment 1; intimate dolly-in in segment 2; slow pan + zoom-in in segment 3. No shaky-cam.

★ Lighting: Morning mist, soft backlight, green bamboo shadows, cold white sword gleam.

★ Style: Wuxia cinematic, healing fresh + warm diffused light.

★ Quality: 4K, stable frame.

★ Hard constraints:
— Stable frame, no flicker, natural anatomy, no deformation, no text, no watermark.
```

Notes for downstream audio: 古风琴瑟 + 剑气破空声。

---

## 5. 钩子速查(前 3 秒,提升完播率)

| 钩子类型 | 写法(填到 ★ Action 第一段) | 适用 |
| --- | --- | --- |
| **运动钩子** | `the [subject] trots in from the distance` | 通用 |
| **光影钩子** | `backlight silhouette` / `volumetric light beams` | 治愈/氛围 |
| **动作钩子** | `suddenly breaks into a gallop` | 动物/运动 |
| **表情钩子** | `close-up of [subject] tilting head` | 人像/宠物 |
| **悬念钩子** | `starts with a close-up of [detail], then reveals the full scene` | 叙事 |

---

## 6. 模板使用工作流

```
1. 选模板(本文件)         → 1/2/3/4 任一
2. 替换占位符 [xxx]         → 用 brief + scene 路由结果
3. 加钩子(本文件 §5)        → ★ Action 第一段填入
4. 加 Notes for downstream audio(展示层音频) → 模板末尾
5. 校验(见 media-rules.md §5) → 单段直出/多段拼接/帧数合规
6. 提交
```
