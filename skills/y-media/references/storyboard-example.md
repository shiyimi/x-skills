# 分镜示例 · 小马驹晨光草甸(自然治愈系,骨架B)

> 本文件是 [storyboard-methodology.md](storyboard-methodology.md) §1-§3、§6 的**完整填好示例**,对应一次 15s 视频生成的最终交付。
>
> **⚠️ 关键区分(展示层 vs 执行层)**:分镜表用具体数字(K/dB/BPM/焦段)做**展示层**记录,便于人理解与归档;但**提交给 t2v 模型的 prompt 必须降级为执行层语义化**——模型读不懂 4500K/-18dB/95BPM,会直接忽略(M4),且音频描述对 t2v 模型无效(M6)。详见 [t2v-model-capability.md](t2v-model-capability.md) 与 [prompt-structure-formula.md](prompt-structure-formula.md)。
>
> **⚠️ 镜头数修正**:t2v 模型在 15s 内塞 6 镜会塌缩成 1-2 景别(M1),应 ≤3 镜、单镜 ≥4s。本示例分镜表保留 6 镜做**创作规划展示**,但 prompt 合并为 3 个时间段执行。

---

## 1. 视频主要目标

`小马驹 × 全龄(儿童/少女心/治愈系观众) × 兴趣-种草(情绪治愈,欢快无忧) × 骨架B(情感叙事·线性起承转合) × 15s × 竖屏9:16`

- 默认假设: 纯生成(无实拍素材);无真人出镜;无对白;单段直出(不走剪辑拼接);画幅竖屏 9:16 @ 720×1280。
- 音频策略: 目标=兴趣/种草[情绪治愈] · query="欢快无忧" → 清新民谣吉他+钟琴 95 BPM,木吉他扫弦冷启,无对白,环境音(蹄声/风声/鸟鸣/蝴蝶/嘶鸣)为信息主体。**⚠️ 此行仅供下游音频制作参考,t2v 模型不生成分时音频(M6),不写进 prompt。**
- 美学母体: 嫩绿+暖金+柔粉,清新治愈自然纪录片质感;色温全程 4500-5200K 区间(展示层);浅景深,16mm 广角→85mm 中焦自然切换。
- 视听路线: 无字幕(画面+BGM+环境音承担 100% 信息)。

## 2. 分镜表格(展示层 · 创作规划)

> 以下 6 镜为**创作规划与归档用途**,记录完整视听意图。实际提交 prompt 按 §3 执行层合并为 3 个时间段。

| 镜号 | 时长 | 景别与视角 | 运镜 | 光影(展示层) | 色彩 | 主体动作 | 道具/环境 | 音频三层(展示层,不入prompt) | 屏显字幕 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 2.5s | 极远景·低角度仰拍(机位贴地约30°) | 缓推(dolly-in),由远及近,速度0.3m/s | 清晨侧逆光·4500K·柔光·光比3:1 | 嫩绿主+暖金辅,天空淡橙→淡蓝渐变 | 小马驹从晨雾草甸远处小跑入画,四蹄轻扬,鬃毛尾巴随风微扬 | 前景:带露珠的草尖(虚焦)/中景:小马驹(约6个月大,棕白相间,鬃毛蓬松,四肢修长)/背景:远山+流动晨雾 | (人声)无对白,镜尾一声清脆幼马嘶鸣(-22dB)·(环境)晨风过草尖"沙沙"+远处鸟鸣(-26dB)·(BGM)木吉他扫弦冷启,3s内从-28dB渐入到-18dB,95BPM | — | ★ |
| S01-02 | 2.5s | 中景·平视(机位与马背同高) | 横移跟拍(tracking),自左向右,速度约1.2m/s | 侧光·4800K·光比2:1·柔光 | 棕白小马 vs 绿草对比鲜明 | 小马驹欢快小跑,鬃毛与尾巴随风轻扬,耳朵前竖 | 前景:三叶草与蒲公英(虚焦)/中景:小马驹/背景:零星野花坡地+斑驳光斑 | (环境)四蹄踏草"嗒嗒"(-20dB)+鬃毛拂风"呼"(-28dB)·(BGM)钟琴加入,95BPM,-16dB | — | ★ |
| S01-03 | 3.0s | 中近景·略低角度(仰10°) | 缓推+微仰(dolly-in + slight tilt-up) | 顶光+侧补光·5000K·光比2.5:1 | 暖金+嫩绿 | 小马驹突然加速冲刺,四蹄短暂离地(慢动作感,约0.8x速),耳朵竖起,眼神明亮 | 前景:被踏起的小草碎屑(粒子动态)/中景:小马驹/背景:虚化花海 | (人声)镜中段一声更明亮的欢快嘶鸣(-20dB)·(环境)踏草声加重"嗒嗒嗒"(-18dB)+风声加强(-22dB)·(BGM)鼓点轻进,-14dB,95BPM | — | ★ |
| S01-04 | 2.5s | 特写·平视(机位对准马头) | 固定+微推(static + micro push,推程0.2m) | 柔顺光·5200K·光比1.5:1·柔光箱质感 | 大地色(棕+米)+柔焦背景 | 小马驹停下甩头,鬃毛甩出弧线,大眼睛闪烁,嘴唇微动像在轻哼 | 前景:虚化的狗尾巴草/中景:小马驹面部+鬃毛/背景:大光斑(bokeh) | (人声)镜尾一声满足感轻哼(-24dB)·(环境)鬃毛甩动"唰"(-22dB)·(BGM)木吉他分解,-20dB,95BPM | — | ★ |
| S01-05 | 2.5s | 近景·侧逆光(机位绕马身3/4位) | 环绕小角度(arc shot,约45°弧),速度0.5m/s | 强逆光·4800K·光比4:1·发丝光勾边 | 暖金轮廓+柔粉野花 | 小马驹蹦跳式小跑,蹄下惊起一对白蝶,蝴蝶绕蹄飞舞 | 前景:飞舞的白蝶(粒子动态,2只)/中景:小马驹/背景:逆光花海,远处淡光晕 | (环境)蝴蝶振翅"噗噗"(-26dB)+轻快蹄声"嗒嗒"(-22dB)·(BGM)副歌短句,-12dB,95BPM推满 | — | ★ |
| S01-06 | 2.0s | 极远景·俯拍(机位高角度约70°俯视) | 缓拉镜(dolly-out/zoom-out),速度0.4m/s | 黄金时段光·4800K·光比3:1·暖光 | 暖金通体+天蓝 | 小马驹渐跑渐远,变成草甸上的一个活泼小点,尾巴还欢快地扬着 | 前景:整片野花草甸/中景:远去的小马驹/背景:远山+淡云+暖阳 | (人声)尾镜一声远去的清亮嘶鸣(带回响,-24dB)·(环境)风过草甸"沙沙"持续(-24dB)+鸟鸣渐弱(-30dB)·(BGM)吉他尾音渐弱,2s淡出至-30dB | — | ★ |

合计(展示层): 15.0s / 6 镜(创作规划) / ★ 6/6 / 字幕 0 / 帧数 15×24=360 → 调整为 361 满足 8n+1。

## 3. 视频 prompt(执行层 · 提交给 t2v 模型)

> **执行层规则**(见 [t2v-model-capability.md](t2v-model-capability.md)):
> 1. 6 镜合并为 3 个时间段(M1 防塌缩,单段 ≥4s)
> 2. 数字参数语义化降级:4500K → `soft golden morning backlight`;光比 → 删除;dB/BPM 移出(M4)
> 3. 音频移出 prompt,放 Notes for downstream audio(M6)
> 4. 套用八要素骨架 + 角色四层 + 场景三层(见 [prompt-structure-formula.md](prompt-structure-formula.md))
> 5. 约束块焊死(M3 防变形)

```text
Vertical 9:16, 15 seconds. Cinematic nature documentary style, in the spirit of BBC Earth and National Geographic, shot on ARRI Alexa with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
A single 6-month-old brown-and-white pinto foal with a fluffy mane and a flowing tail, joyful temperament — keep the same proportions, coat pattern, and mane volume across all frames (no character drift).

★ Scene (three layers + atmosphere):
A fresh green meadow in the early-morning countryside style, with dew-drenched clover, pink wildflowers, and a thin drifting mist — soft golden sunrise backlight from a low sun, with gentle wind in the grass.

★ Action (slow, continuous, single motion per beat; with micro-actions):
- 0.0–5.0s: the foal trots in from the distant mist, mane and tail lifting lightly. Subtle ear twitches, occasional blinks, soft breathing visible.
- 5.0–11.0s: the foal breaks into a joyful gallop, all four hooves briefly leaving the ground, body silhouette clean. A pair of white butterflies rises around its hooves.
- 11.0–15.0s: the foal runs into the distance; camera racks focus from the foal to the meadow, then slowly pulls out to a wide shot. The foal becomes a small lively dot on the meadow, tail still cheerfully raised.

★ Camera language (≤ 2 moves per segment, from cinematic shot library):
- Segment 1: low-angle slow dolly-in as the foal approaches.
- Segment 2: lateral tracking + soft push-in from medium to medium-close-up.
- Segment 3: soft rack focus + slow pull-out to wide.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — low golden morning sun behind the subject (rim/backlight), soft fill from the sky. Color stays in fresh grass green + warm gold + soft pink wildflower accent throughout.

★ Style anchor:
Cinematic, BBC Earth, healing and cheerful mood, "starts calmly → peaks with joyful gallop → ends quietly".

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, soft warm light.

★ Hard constraints (weld to end):
— Stable frame, no flicker, natural equine anatomy, no mutation, no deformed horse.
— Same foal identity across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

Notes for downstream audio (do NOT include in the video prompt — t2v models do not generate timed audio):
- BGM skin: cheerful indie folk acoustic guitar + glockenspiel, 95 BPM, cold-start guitar strum fades up over 2.5s, peaks at the gallop, fades out over the last 2s.
- Ambient priorities: hooves on soft grass "tah-tah", mane and tail swishing "shua", wind over meadow, distant birds, a single bright young neigh near the gallop peak and one soft fading neigh at the end.

## 4. Generation

(交付后由 Step 7 追加:Provider / model / task.id / effective parameters / warnings / timing。此处为示例占位,不预填。)
