# 分镜示例 · 晨雾森林雄鹿与幼鹿(自然治愈系,骨架B)

> 本文件是 [storyboard-methodology.md](storyboard-methodology.md) §1-§3、§6 的**完整填好示例**,对应一次 15s 视频生成的最终交付。题材选**晨雾森林雄鹿与幼鹿**,展示**成兽+幼兽+关系**类主体类型的写法。
>
> **⚠️ 关键区分(展示层 vs 执行层)**:分镜表用具体数字(K/dB/BPM/焦段)做**展示层**记录,便于人理解与归档;但**提交给 t2v 模型的 prompt 必须降级为执行层语义化**——模型读不懂 4500K/-18dB/95BPM,会直接忽略(M4),且音频描述对 t2v 模型无效(M6)。详见 [t2v-model-capability.md](t2v-model-capability.md) 与 [prompt-structure-formula.md](prompt-structure-formula.md)。
>
> **⚠️ 镜头数修正(M1)**:t2v 模型在 15s 内塞 6 镜会塌缩成 1-2 景别,应 ≤3 镜、单镜 ≥4s。本示例分镜表保留 6 镜做**创作规划展示**,但 prompt 合并为 3 个时间段执行。

---

## 1. 视频主要目标

`成年雄鹿 + 幼鹿 × 全龄(自然/治愈/亲子观众) × 兴趣-种草(情绪治愈,温情守护) × 骨架B(情感叙事·线性起承转合) × 15s × 竖屏9:16`

- 默认假设: 纯生成(无实拍素材);无真人出镜;无对白;单段直出(不走剪辑拼接);画幅竖屏 9:16 @ 720×1280。
- 音频策略: 目标=兴趣/种草[情绪治愈] · query="温情守护" → 钢琴+大提琴+钟琴 70 BPM,钢琴冷启渐入,无对白,环境音(蹄声/雾气/鸟鸣/树叶沙沙/小鹿鸣)为信息主体。**⚠️ 此行仅供下游音频制作参考,t2v 模型不生成分时音频(M6),不写进 prompt。**
- 美学母体: 雾白+暖金+苔绿+深棕,自然治愈自然纪录片质感;色温全程 4500-5200K 区间(展示层);浅景深,16mm 广角→85mm 中焦自然切换。
- 视听路线: 无字幕(画面+BGM+环境音承担 100% 信息)。

## 2. 分镜表格(展示层 · 创作规划)

> 以下 6 镜为**创作规划与归档用途**,记录完整视听意图。实际提交 prompt 按 §3 执行层合并为 3 个时间段。

| 镜号 | 时长 | 景别与视角 | 运镜 | 光影(展示层) | 色彩 | 主体动作 | 道具/环境 | 音频三层(展示层,不入prompt) | 屏显字幕 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 2.5s | 远景·平视(机位约1.5m高) | 缓推(dolly-in),由远及近,速度0.2m/s | 晨雾侧逆光·4500K·柔光·光比3:1 | 雾白主+暖金辅,苔绿点缀 | 雄鹿从晨雾森林远处缓步走出,幼鹿紧跟半步后,雄鹿不时回头 | 前景:带露珠的蕨类(虚焦)/中景:雄鹿(约5岁成年,9枝鹿角,深棕毛色)与幼鹿(约3个月,浅棕带白斑)/背景:高大针叶林+流动晨雾+丁达尔光束 | (环境)晨雾流动+远处鸟鸣(-28dB)·(BGM)钢琴单音冷启,3s内从-30dB渐入到-22dB,70BPM | — | ★ |
| S01-02 | 2.5s | 中景·低角度仰拍(机位贴地约40°) | 横移跟拍(tracking),自左向右,速度约0.8m/s | 侧光·4800K·光比2:1·柔光 | 深棕雄鹿 vs 苔绿蕨类对比鲜明,白斑幼鹿吸睛 | 雄鹿缓步前行,幼鹿蹦跳跟随,偶尔用鼻子蹭雄鹿前腿 | 前景:苔藓覆盖的倒木(虚焦)/中景:雄鹿+幼鹿/背景:零星光斑+雾气 | (环境)四蹄踏落叶"沙沙"(-22dB)+小鹿轻哼"唧"(-28dB)·(BGM)大提琴加入,70BPM,-18dB | — | ★ |
| S01-03 | 3.0s | 中近景·平视(机位与雄鹿肩同高) | 固定+微推(static + micro push,推程0.2m) | 顶光+侧补光·5000K·光比2.5:1 | 暖金+苔绿 | 雄鹿突然停下,回头凝望幼鹿,幼鹿抬头回应,父子(父子/母女)温情对望 | 前景:虚化的低矮蕨类/中景:雄鹿回头+幼鹿抬头/背景:虚化雾气+光柱 | (人声)无对白·(环境)树叶轻晃"窸窣"(-26dB)+远处鸟鸣-30dB·(BGM)钟琴轻入,情绪上扬,-16dB,70BPM | — | ★ |
| S01-04 | 2.5s | 特写·平视(机位对准小鹿面部) | 固定(static) | 柔顺光·5200K·光比1.5:1·柔光箱质感 | 大地色(浅棕+白)+柔焦背景 | 幼鹿睁大眼睛,耳朵竖起轻抖,小嘴微动像在轻哼,眼神天真 | 前景:虚化的狗尾巴草/中景:小鹿面部+耳朵+鹿角小茸/背景:大光斑(bokeh) | (人声)无对白·(环境)小鹿耳朵微动"扑"(-26dB)+雄鹿呼吸"呼"(-30dB)·(BGM)钢琴分解,留出环境音空间,-20dB,70BPM | — | ★ |
| S01-05 | 2.5s | 近景·侧逆光(机位绕雄鹿3/4位) | 环绕小角度(arc shot,约45°弧),速度0.3m/s | 强逆光·4800K·光比4:1·发丝光勾边 | 暖金轮廓+苔绿森林,小鹿白斑发光 | 雄鹿低下头,鼻子轻触幼鹿额头(温情瞬间),幼鹿眯眼 | 前景:飞舞的萤火虫(2-3只,粒子动态)/中景:雄鹿低头+幼鹿受触/背景:逆光雾气+光晕 | (环境)雄鹿鼻息"呼"(-22dB)+小鹿轻哼"唧"(-26dB)+萤火虫"嗡"(-30dB)·(BGM)副歌短句,钢琴+大提琴齐响,情绪顶点,-12dB,70BPM | — | ★ |
| S01-06 | 2.0s | 极远景·俯拍(机位高角度约60°俯视) | 缓拉镜(dolly-out/zoom-out),速度0.3m/s | 黄金时段光·4800K·光比3:1·暖光 | 暖金通体+雾白+天蓝 | 雄鹿带着幼鹿渐走渐远,变成林间两个温情小点,幼鹿仍紧跟 | 前景:整片针叶林+蕨类地被/中景:远去的雄鹿+幼鹿/背景:远山+晨雾渐散+暖阳 | (环境)风过林冠"沙沙"持续(-24dB)+鸟鸣渐弱(-30dB)·(BGM)钢琴尾音渐弱,2s淡出至-30dB,留环境音收尾 | — | ★ |

合计(展示层): 15.0s / 6 镜(创作规划) / ★ 6/6 / 字幕 0 / 帧数 15×24=360 → 调整为 361 满足 8n+1。

## 3. 视频 prompt(执行层 · 提交给 t2v 模型)

> **执行层规则**(见 [t2v-model-capability.md](t2v-model-capability.md) §2):
> 1. 6 镜合并为 3 个时间段(M1 防塌缩,单段 ≥4s)
> 2. 数字参数语义化降级:4500K → `soft golden morning backlight`;光比 → 删除;dB/BPM 移出(M4)
> 3. 音频移出 prompt,放 Notes for downstream audio(M6)
> 4. 套用八要素骨架 + 角色四层 + 场景三层(见 [prompt-structure-formula.md](prompt-structure-formula.md))
> 5. 约束块焊死(M3 防变形)

```text
Vertical 9:16, 15 seconds. Cinematic nature documentary style, in the spirit of BBC Earth and National Geographic, shot on ARRI Alexa with shallow depth of field.

★ Main subject (four layers, keep consistent in every frame):
A mature 5-year-old male red deer with a 9-point antler rack, deep-brown coat, calm protective temperament; and a 3-month-old fawn with light-brown fur marked by white spots, large dark eyes, curious innocent temperament. Keep the same proportions, antler count, and coat patterns across all frames (no character drift).

★ Scene (three layers + atmosphere):
A misty coniferous forest in the early-morning countryside style, with fern understory, moss-covered fallen logs, and thin drifting mist — soft golden sunrise backlight from a low sun filtering through tree trunks as light shafts (Tyndall effect), with gentle wind in the canopy.

★ Action (slow, continuous, single motion per beat; with micro-actions):
- 0.0–5.0s: the mature stag steps slowly out of the distant mist, the fawn follows half a step behind, the stag occasionally glances back. Subtle ear twitches on the fawn, soft breathing visible, light tail sway.
- 5.0–11.0s: the stag pauses, turns its head to look down at the fawn, the fawn looks up to meet its gaze (a tender moment of eye contact). A few fireflies drift in the foreground bokeh.
- 11.0–15.0s: the stag lowers its head and gently touches the fawn's forehead with its nose; then both walk slowly into the deeper forest. Camera racks focus from the pair to the mist, then slowly pulls out to a wide shot. The two deer become small warm dots in the vast forest.

★ Camera language (≤ 2 moves per segment, from cinematic shot library):
- Segment 1: low-angle slow dolly-in as the deer approach.
- Segment 2: static with micro push-in on the eye-contact moment.
- Segment 3: soft rack focus + slow pull-out to wide.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — low golden morning sun behind the subjects (rim/backlight), soft fill from the mist and sky. Light shafts (Tyndall effect) filter through tree trunks. Color stays in mist white + warm gold + moss green + deep brown throughout.

★ Style anchor:
Cinematic, BBC Earth, healing and tender mood, "starts calmly → peaks with the forehead touch → ends quietly in the distance".

★ Quality (post-positioned):
4K ultra-high definition, shallow depth of field, soft warm light.

★ Hard constraints (weld to end):
— Stable frame, no flicker, natural cervid anatomy, no mutation, no deformed deer, no extra legs.
— Same deer identities across all frames (no character drift).
— No text, no logo, no watermark, no on-screen caption.
```

Notes for downstream audio(下游音频备注;不要写进视频 prompt — t2v 模型不生成分时音频):
- BGM 皮肤:温暖钢琴 + 大提琴 + 钟琴,70 BPM,冷启的单个钢琴音符 3s 内渐入,在额头触碰(第 2 段)推到顶点,最后 2s 淡出。
- 环境音优先级:蹄子踩在软苔上"沙沙",幼鹿轻柔的"唧"哼声,雄鹿平稳的"呼"呼吸声,树冠风声,远处的鸟鸣,以及眼神接触瞬间一声清亮的幼鹿鸣叫。

## 4. Generation

(交付后由 Step 7 追加:Provider / model / task.id / effective parameters / warnings / timing。此处为示例占位,不预填。)
