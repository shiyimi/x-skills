# 分镜示例 · 室内窗光猫咪歪头(nature · 宠物治愈 Vlog)

> 题材:布偶猫室内窗光下眨眼/歪头/打哈欠微动作。对应 [recipes/nature.md §2.2 宠物治愈 Vlog](references/recipes/nature.md)。
> **关键点**:8 镜(超 6 镜上限)—— 宠物微表情镜需密集,否则观众看不到细节;3+1 真实环境=窗+沙发+猫爬架+阳光斑。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 8 镜 1:1(超上限) ② 强 i2v 猫脸锚定 ③ 室内窗光+暖民谣
> - [CAN-ROTATE]: ① 主体(猫/狗/鸟/兔) ② 微表情(歪头/打哈欠/摇尾) ③ 3+1 环境细节

---

## 1. 视频主要目标

`布偶猫微动作 × 室内窗光 × 治愈 × 兴趣-种草(萌系) × 骨架A快切(8 镜,1.0-2.5s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;**强 i2v**(猫脸必须参考图锚定,避免 t2v 猫脸畸变);无对白;9:16 @ 720×1280。
- **音频策略**: 目标=兴趣 · query="治愈" → 暖民谣(木吉他+钟琴,80BPM),钢琴冷启渐入;环境音=猫咪呼噜+舔毛+鸟鸣+风铃。**音频进 prompt ★ Audio 段 + 侧车 Notes 副本**。
- **美学母体**: 奶白+原木+暖金+嫩绿;色温 3500-4500K;浅景深 50mm。
- **视听路线**: 无字幕(画面+BGM+环境音承担 100% 信息)。

## 2. 分镜表格(展示层 · 创作规划)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影(展示层) | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 2.0s | 中景·平视 | 固定 | 窗侧光 4000K 光比 2:1 | 猫咪蹲窗台打哈欠,粉舌卷出,胡须轻颤 | ★ |
| S01-02 | 1.5s | 特写·眼部 | 微推 0.1m | 暖窗光 4200K | 猫咪眨眼两次,瞳孔收缩,长睫毛清晰 | ★ |
| S01-03 | 2.0s | 中景·平视 | 固定 | 暖窗光 4000K | 猫咪甩尾,跳下窗台,爪子触地一声轻响 | — |
| S01-04 | 2.0s | 中近景·仰角 15° | 缓推 dolly-in 0.15m/s | 顶光+窗侧光 3800K | 猫咪抬头看镜头,歪头,耳朵轻抖 | ★ |
| S01-05 | 1.5s | 特写·爪子 | 固定 | 窗光 4000K | 猫咪伸爪抓阳光斑,肉垫清晰,微动 | — |
| S01-06 | 2.0s | 中景·平视 | 横移跟拍 0.4m/s | 暖窗光 4000K | 猫咪蹭主人手,呼噜声加重,眯眼 | ★ |
| S01-07 | 2.0s | 中近景·俯角 30° | 固定 + 微拉 0.1m | 顶光 3800K | 猫咪蜷成球,尾巴盖鼻,闭眼 | — |
| S01-08 | 2.0s | 远景·平视 | 缓拉镜 0.2m/s | 暮色暖光 3500K | 猫咪在沙发依窗而眠,光斑缓缓移动 | — |

**展示层合计**: 15.0s / 8 镜 / ★ 5/8 / 字幕 0 / 帧数 15×24=360 → 361(8n+1)。

**3+1 真实环境**: 浅木色地板 + 米白布艺沙发 + 藤编猫爬架 + 暖窗光斑。

## 3. Generation

(交付后由 Step 7 追加:Provider / model / task.id / effective parameters / warnings / timing。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴+弦乐 70-90BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: warm folk (acoustic guitar + glockenspiel), slow and tender — cold start single-note entry, gentle swell through the nuzzle moment (S01-06), soft fade in the last 2s.
- 数字完整版(供参考): 0.0–2.0s soft yawn + chest breath; 2.0–3.5s single soft blink; 3.5–5.5s paw-soft-landing + tail-flick; 5.5–7.5s inquisitive meow; 7.5–9.0s gentle paw-pad press; 9.0–11.0s loud purr intensifies + soft nuzzle; 11.0–13.0s breath slows, sleeping rhythm; 13.0–15.0s distant wind chimes + birdsong.

## 5. 视频 prompt(执行层 · 提交给 t2v 模型)

```text
Vertical 9:16, 15 seconds. Healing pet vlog style, shot on Sony A7III with 50mm f/1.4 shallow depth of field, warm cottagecore mood.

★ Main subject (four layers, keep consistent in every frame):
A 2-year-old female Ragdoll cat with cream-white fur, blue almond eyes, fluffy medium-length coat, and a pink nose. Gentle curious temperament. Same fur pattern, eye color, and facial proportions across all frames (no character drift).

★ Scene (three layers + atmosphere):
A cozy sunlit living room in the late morning with cream linen sofa, woven rattan cat tree, light-oak floor, and a soft warm window light casting moving sun patches. Subtle dust motes drift in the sunbeams.

★ Action (1:1 mirror of §2 storyboard, slow micro-actions, no whip):
- 0.0–2.0s (S01-01): the cat sits on the windowsill, yawns slowly with pink tongue curling, whiskers trembling, soft chest rise and fall.
- 2.0–3.5s (S01-02): close-up of the cat's eye — blinks twice slowly, pupils contract, long lashes clearly visible.
- 3.5–5.5s (S01-03): the cat flicks its tail, hops down from the windowsill, paws softly touch the wooden floor.
- 5.5–7.5s (S01-04): the cat looks up at camera, tilts head to the right, ears twitch slightly.
- 7.5–9.0s (S01-05): the cat extends a paw toward a sun patch, pink toe beans visible, gentle pressing motion.
- 9.0–11.0s (S01-06): the cat nuzzles against a hand, purring intensifies, eyes half-closed in contentment.
- 11.0–13.0s (S01-07): the cat curls into a ball, tail wraps over the nose, eyes slowly close, soft breath.
- 13.0–15.0s (S01-08): the cat sleeps on the sofa by the window, a sun patch slowly drifts across its back.

★ Camera language (1:1 mirror, ≤ 2 moves per segment, no whip):
- 0.0–2.0s: static medium shot, gentle focus on the yawn.
- 2.0–3.5s: slow micro push-in on the eye close-up.
- 3.5–5.5s: static, follow the cat's hop-down with a gentle tilt.
- 5.5–7.5s: slow dolly-in from 0.6m to 0.3m.
- 7.5–9.0s: static macro close-up, shallow focus on the paw.
- 9.0–11.0s: static medium-close shot.
- 11.0–13.0s: static with very gentle pull-back as the cat curls up.
- 13.0–15.0s: slow pull-out from medium to wide, rack focus from cat to the window.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — soft warm window light from the left at 30° angle, golden-amber key, gentle ambient fill from the room. Volumetric dust motes visible in the sunbeams. Cream white + warm gold + oak brown + sage green throughout.

★ Audio (downstream soundscape, 1:1 mirror, no BPM/dB numbers):
- Ambient: 0.0–2.0s soft yawn + chest breath; 2.0–3.5s single soft blink; 3.5–5.5s paw-soft-landing + tail-flick; 5.5–7.5s inquisitive meow; 7.5–9.0s gentle paw-pad press; 9.0–11.0s loud purr intensifies + soft nuzzle; 11.0–13.0s breath slows, sleeping rhythm; 13.0–15.0s distant wind chimes + birdsong.
- BGM: warm folk (acoustic guitar + glockenspiel), slow and tender — cold start single-note entry, gentle swell through the nuzzle moment (S01-06), soft fade in the last 2s.
- No dialogue, no captions.

★ Style anchor:
Healing pet vlog, "starts with a yawn → peaks with the nuzzle → ends with peaceful sleep".

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, soft warm light.

★ Hard constraints (weld to end):
— Same cat identity across all frames (no character drift, no tail-length change, no eye-color shift).
— One continuous single take; do not cut or stitch.
— Stable frame, no flicker, natural feline anatomy, no mutation, no extra toes, no deformed cat, no text, no logo, no watermark.
```


