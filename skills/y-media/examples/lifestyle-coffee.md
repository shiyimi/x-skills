# 分镜示例 · 晨光咖啡慢注(lifestyle · 晨间日常)

> 题材:晨光木桌上注入咖啡的微动作 + 蒸汽升腾 + 阳光斑移动。对应 [recipes/lifestyle.md §2.1 晨间日常](references/recipes/lifestyle.md)。
> **关键点**:6 镜全微动作,治愈系无对白;3+1 环境=木桌+陶瓷杯+棉麻布+晨光斑。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 6 镜 1:1 ② 钢琴独奏+蒸汽光束 ③ 治愈无对白
> - [CAN-ROTATE]: ① 主体(咖啡/茶/果汁/麦片) ② 杯型 ③ 3+1 环境细节 ④ 注入速度(慢/特慢)

---

## 1. 视频主要目标

`晨光咖啡慢注 × 治愈 × 兴趣-种草(生活美学) × 骨架B慢切(6 镜,2.0-3.0s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;无对白;无字幕;9:16 @ 720×1280。
- **音频策略**: 目标=兴趣 · query="治愈/晨光" → 钢琴独奏 70BPM 冷启单音渐入;环境音=咖啡注入"汩汩"+勺搅"叮"+鸟鸣+风声。**音频进 prompt ★ Audio 段 + 侧车 Notes 副本**。
- **美学母体**: 暖白+原木+奶咖+嫩绿;色温 3000-4000K;胶片颗粒质感。
- **视听路线**: 无字幕(画面+BGM+环境音承担 100%)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 2.5s | 中景·俯角 30° | 缓推 0.15m/s | 侧窗光 3800K 光比 2:1 | 木桌上陶瓷杯空,晨光斑缓缓移入画面 | ★ |
| S01-02 | 2.5s | 特写·杯口 | 固定 | 侧窗光 3800K | 手持细嘴壶注入深棕咖啡,蒸汽缓缓升起 | ★ |
| S01-03 | 2.5s | 中近景·平视 | 固定 | 侧窗光 4000K | 勺子轻搅,奶泡画圈,小涟漪从中心散开 | ★ |
| S01-04 | 2.5s | 特写·手 | 微推 0.1m | 暖窗光 4000K | 手把杯移到阳光斑下,光斑在杯身移动 | — |
| S01-05 | 2.5s | 中景·平视 | 缓拉镜 0.15m/s | 暖窗光 3800K | 双手捧杯,蒸汽升腾,光线穿透蒸汽显光束 | ★ |
| S01-06 | 2.5s | 远景·平视 | 固定 | 暖光 3500K | 整桌全景,书+面包屑+绿植,光斑移到书页上 | — |

**合计**: 15.0s / 6 镜 / ★ 4/6 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 浅木色餐桌 + 米白棉麻桌旗 + 陶瓷杯(无品牌)+ 一束嫩绿尤加利叶。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 钢琴+弦乐 70-90BPM,无歌词 · 0s 渐入,3s 到 -18dB · 中段推满 · 末 2s 淡出至 -30dB。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: solo piano, slow and tender, single-note cold start, gentle melody through the steam moment (S01-05), soft fade in the last 2s.
- 数字完整版(供参考): 0.0–2.5s soft fabric rustle + distant birdsong; 2.5–5.0s gentle pour "gurgle" + steam hiss; 5.0–7.5s spoon clink on ceramic + liquid swirl; 7.5–10.0s cup-slide on wood + soft breath; 10.0–12.5s hands-cradle-cup + steam rise; 12.5–15.0s distant wind + soft page-turn.

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Healing slow-living style, soft cinematic, shot on ARRI Alexa Mini with 35mm f/1.4 shallow depth of field, gentle film grain.

★ Main subject:
A handmade ceramic coffee cup in matte cream-white with no logo or text, on a light-oak dining table. A thin-spout copper kettle pours dark-roast coffee. A linen napkin and a small eucalyptus sprig sit beside the cup.

★ Scene:
A bright minimalist dining corner in the early morning, with a window on the left casting warm low-angle sun across the wooden table. Soft dust motes drift in the sunbeams.

★ Action (1:1 mirror, slow, micro-actions):
- 0.0–2.5s (S01-01): the empty ceramic cup sits on the table, a soft sun patch slowly slides in from the left.
- 2.5–5.0s (S01-02): a hand holding a thin-spout copper kettle pours dark-roast coffee into the cup, steam rises gently in slow motion.
- 5.0–7.5s (S01-03): a silver spoon stirs the coffee slowly in a circular motion, milk foam swirls and small ripples spread from the center.
- 7.5–10.0s (S01-04): a hand slides the cup into the sun patch, light shifts across the cup's surface, finger pads gently visible on the handle.
- 10.0–12.5s (S01-05): both hands cradle the cup, steam rises, light beams visible through the steam.
- 12.5–15.0s (S01-06): wide view of the table — open book, bread crumbs, eucalyptus — sun patch drifts onto the book page.

★ Camera language (1:1 mirror, ≤ 2 moves):
- 0.0–2.5s: slow dolly-in from medium to medium-close.
- 2.5–5.0s: static macro close-up of the cup rim and pour.
- 5.0–7.5s: static overhead close-up.
- 7.5–10.0s: very slow push-in on the hand and cup.
- 10.0–12.5s: static medium shot, gentle rack focus between hands and steam.
- 12.5–15.0s: static wide shot.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — soft warm window light from the left at 30° angle, low contrast, gentle diffusion through linen curtains. Volumetric light beams through the steam. Cream white + oak brown + eucalyptus green + warm gold throughout.

★ Audio (downstream soundscape, 1:1 mirror, no numbers):
- Ambient: 0.0–2.5s soft fabric rustle + distant birdsong; 2.5–5.0s gentle pour "gurgle" + steam hiss; 5.0–7.5s spoon clink on ceramic + liquid swirl; 7.5–10.0s cup-slide on wood + soft breath; 10.0–12.5s hands-cradle-cup + steam rise; 12.5–15.0s distant wind + soft page-turn.
- BGM: solo piano, slow and tender, single-note cold start, gentle melody through the steam moment (S01-05), soft fade in the last 2s.
- No dialogue, no captions.

★ Style anchor:
Slow living healing, "starts with morning light → peaks with steam through beams → ends quietly with a full table".

★ Quality:
4K ultra-high definition, shallow depth of field, soft warm light, gentle film grain.

★ Hard constraints:
— No text, no logo, no watermark, no on-screen caption.
— One continuous single take; do not cut or stitch.
— Stable frame, no flicker, natural liquid physics (no floating drops, no impossible splashes).
```


