# 分镜示例 · 巧克力敲碎 ASMR(food · ASMR 极慢感官)

> 题材:巧克力块敲碎+碎屑飞溅+微距极慢,无 BGM 纯 ASMR。对应 [recipes/food.md §2.3 ASMR/极慢感官](references/recipes/food.md)。
> **关键点**:5 镜极慢+无 BGM+纯 ASMR;3+1=暗背景+单束顶光+主体+微距。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 5 镜 1/4x 极慢 ② 无 BGM 纯拟声 ③ 暗背景+单束顶光 ④ 微距主体对焦明确
> - [CAN-ROTATE]: ① 主体(巧克力/冰块/水果/糖) ② 拟声词(敲碎/切开/撕开) ③ 碎屑形态 ④ 镜头角度

---

## 1. 视频主要目标

`巧克力敲碎 × ASMR × 微距 × 兴趣-种草(感官) × ASMR 极慢(5 镜,2.5-3.5s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;无对白;无字幕;9:16。
- **音频策略**: **无 BGM**,纯 ASMR 微距音效(敲碎"咔"+"沙"+"叮")。**音频进 prompt + 侧车 Notes 副本**。
- **美学母体**: 深棕+奶白+焦糖;色温 4500K 单束顶光;暗背景。
- **视听路线**: 无字幕,纯 ASMR 极慢。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 3.0s | 特写·俯角 60° | 缓推 0.1m/s | 顶光 4500K 单束 | 整块黑巧克力,表面光泽流转,极慢微距 | ★ |
| S01-02 | 3.0s | 特写·侧面 | 固定 | 顶光 4500K | 小锤悬停,即将落下,微距 1:1 | ★ |
| S01-03 | 3.0s | 微距·击中瞬间 | 固定 | 顶光 4500K | 锤子击中,慢动作 1/4x,巧克力裂开,碎屑飞溅 | ★ |
| S01-04 | 3.0s | 微距·碎屑 | 缓推 0.05m/s | 顶光 4500K | 碎屑在光中飘落,慢动作 1/4x,光斑闪烁 | ★ |
| S01-05 | 3.0s | 特写·断面 | 固定 + 微推 0.05m | 顶光 4500K | 断面纹理微距,内层气孔,焦糖"叮"回响 | ★ |

**合计**: 15.0s / 5 镜 / ★ 5/5 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 暗色石板+单束顶光+主体+飞溅碎屑。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 无 BGM(纯环境音 ASMR) · 全程无音乐 · 仅背景环境音 -45dB · 无渐入渐出。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: NONE — pure ASMR. Background room tone at -45dB.
- 数字完整版(供参考): 0.0–3.0s soft surface tone + room hum; 3.0–6.0s hammer descent soft whoosh + bre...

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Food ASMR macro style, dark background, shot on macro lens 1:1 ratio, ultra-slow-motion, focused on texture and sound.

★ Main subject:
A single rectangular block of dark chocolate (70% cacao) on a dark slate surface, with a small silver hammer. The chocolate has a glossy surface and visible micro-texture.

★ Scene:
A dark minimal setting with a single overhead spotlight cone illuminating only the chocolate and hammer, everything else fades to deep black. The light catches every detail of the chocolate's surface.

★ Action (1:1 mirror, ultra-slow micro-actions, all in 1/4x or 1/2x slow motion):
- 0.0–3.0s (S01-01): close-up of the whole chocolate block, surface highlights slowly shift as the light drifts, micro-texture visible.
- 3.0–6.0s (S01-02): side view macro, a small silver hammer hovers above the chocolate at frame center, slowly descending, extreme tension.
- 6.0–9.0s (S01-03): the moment of impact, captured in 1/4x slow motion, the chocolate cracks cleanly, fragments burst outward in all directions, micro-shards catch the light.
- 9.0–12.0s (S01-04): extreme close-up on the flying fragments, 1/4x slow motion, each shard glints as it tumbles through the spotlight beam, dust motes drift among them.
- 12.0–15.0s (S01-05): macro close-up of the broken cross-section, internal air pockets and texture clearly visible, a final small fragment tumbles into focus.

★ Camera language (1:1 mirror, mostly static macro):
- 0.0–3.0s: slow dolly-in overhead from close to macro close.
- 3.0–6.0s: static side macro.
- 6.0–9.0s: static macro, capturing the impact.
- 9.0–12.0s: slow push-in to extreme macro on the flying fragments.
- 12.0–15.0s: static macro on the cross-section with very gentle push-in.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — single overhead spotlight cone at 60° angle, 4500K cool-neutral, hard edge, deep black background. Strong specular highlights on the chocolate surface. Deep brown + cream cocoa + silver hammer + soft black throughout.

★ Audio (downstream soundscape, 1:1 mirror — pure ASMR):
- Ambient: 0.0–3.0s soft surface tone + room hum; 3.0–6.0s hammer descent soft whoosh + breath; 6.0–9.0s loud "CRACK" on impact + splinter burst; 9.0–12.0s fragment tinkles + dust mote drift; 12.5–15.0s settling "tink" + final fragment micro-sound.
- BGM: NONE — pure ASMR. Background room tone at -45dB.
- No dialogue, no captions.

★ Style anchor:
ASMR macro sensory, "starts with quiet tension → peaks with the loud crack → ends with delicate fragment settling".

★ Quality:
4K ultra-high definition, extreme macro, hard spotlight, deep contrast.

★ Hard constraints:
— Chocolate keeps natural shape, no floating fragments, no impossible physics.
— Natural chocolate color and texture, no plastic shine, no over-saturated brown.
— Fragments fall with gravity, no upward float.
— One continuous feel; the slow-motion beats are intentional, not jumps.
— No text, no logo, no watermark.
— Stable frame, no flicker.
```


