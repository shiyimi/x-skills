# 分镜示例 · 铸铁锅嗞啦煎制(food · 烹饪过程)

> 题材:铸铁锅煎制牛排嗞啦声向快切,蒸汽+油花+嗞啦声。对应 [recipes/food.md §2.1 烹饪过程](references/recipes/food.md)。
> **关键点**:9 镜快切(嗞啦声向)全微动作;纯烹饪音无 BGM;3+1=铸铁锅+木铲+蒸汽+嗞啦。
>
> **本例标注**(L5 分层示例,见 [SKILL.md §4.2 钩子速查](../../SKILL.md)):
> - [MUST-KEEP]: ① 9 镜 1:1 快切 ② 无 BGM 纯烹饪音 ③ 微距 ④ 拟声词必填
> - [CAN-ROTATE]: ① 主菜(牛排/面/鱼/蔬菜) ② 锅具(铸铁/不粘/砂锅) ③ 配料 ④ 镜头速度

---

## 1. 视频主要目标

`铸铁锅煎牛排 × 嗞啦声 × 食欲 × 兴趣-种草(食物) × 骨架A快切(9 镜,1.0-2.0s) × 15s × 竖屏9:16`

- **默认假设**: 纯生成;无对白;无字幕;9:16。
- **音频策略**: 目标=兴趣 · query="食欲/嗞啦" → **无 BGM**,纯烹饪音(嗞啦/切面/蒸汽);环境音=油嗞+刀切+蒸汽"噗"+火苗"呼呼"。**音频进 prompt + 伴生文档 Notes 副本**。
- **美学母体**: 暖金+焦糖+深棕+嫩绿;色温 3000-4000K;近景/特写。
- **视听路线**: 无字幕(画面+烹饪音承担 100%)。

## 2. 分镜表格(展示层)

| 镜号 | 时长 | 景别/视角 | 运镜 | 光影 | 主体动作 | 视觉重点 |
| --- | --- | --- | --- | --- | --- | --- |
| S01-01 | 1.5s | 中景·俯角 60° | 缓推 0.2m/s | 顶光 4000K 柔光 | 木砧板,整块生牛排,刀影 | — |
| S01-02 | 1.5s | 特写·刀 | 固定 | 顶光 4000K | 刀切下,切面展开,肉汁渗出 | ★ |
| S01-03 | 1.5s | 中景·俯角 60° | 固定 | 顶光 4000K | 生牛排放入铸铁锅,"嗞"一声蒸汽冲起 | ★ |
| S01-04 | 1.5s | 特写·锅内 | 固定 | 顶光 4000K | 油花四溅,嗞啦声加大,焦化纹理形成 | ★ |
| S01-05 | 1.5s | 中近景·平视 | 固定 | 顶光 4000K | 木铲翻面,油嗞二次响,焦面金黄 | ★ |
| S01-06 | 1.5s | 特写·黄油 | 固定 | 顶光 4000K | 黄油块入锅,化开,泡沫包裹肉面 | ★ |
| S01-07 | 1.5s | 中景·俯角 60° | 缓推 0.1m/s | 顶光 4000K | 蒜瓣入锅,香气升腾,蒸汽浓郁 | — |
| S01-08 | 2.0s | 特写·锅内 | 固定 | 顶光 4000K | 迷迭香入锅,蒸汽"噗"冲起,焦化完美 | ★ |
| S01-09 | 2.0s | 中景·平视 | 缓拉镜 0.2m/s | 顶光 4000K | 装盘,切开内部粉红,肉汁流下,摆盘完美 | ★ |

**合计**: 14.5s ≈ 15.0s / 9 镜 / ★ 7/9 / 字幕 0 / 帧数 361。

**3+1 真实环境**: 铸铁锅+木铲+木砧板+黄油+蒜+迷迭香+蒸汽+油光。

## 3. Generation

(交付后由 Step 7 追加。)

## 4. Audio(声场设计稿 · 数字完整版 + 语义化版本对照,与 §5 `★ Audio` 段对应)

- BGM: 无 BGM(纯环境音 ASMR) · 全程无音乐 · 仅背景环境音 -40dB · 无渐入渐出。
- 环境音优先级(按镜号 1:1 对应): 见 §5 `★ Audio` 段(语义化描述)。
- 原 prompt 描述: NONE — pure cooking ASMR. Background kitchen hum only at -40dB.
- 数字完整版(供参考): 0.0–1.5s knife on board soft tap; 1.5–3.0s knife cut + juice drip; 3.0–4.5s loud...

## 5. 视频 prompt(执行层)

```text
Vertical 9:16, 15 seconds. Food ASMR cooking style, ultra-close-up, shot on Sony A7III with macro lens f/2.8, warm appetite-inducing mood.

★ Main subject:
A thick-cut prime ribeye steak being seared in a black cast-iron skillet, with butter, garlic cloves, and fresh rosemary sprigs. Wooden cutting board and wooden spatula as supporting props. No readable text on any packaging.

★ Scene:
A bright modern kitchen in the late morning, warm overhead key light, slight steam haze in the air, dark wood countertop.

★ Action (1:1 mirror, fast cuts with intense micro-actions):
- 0.0–1.5s (S01-01): overhead medium shot of a whole raw ribeye steak on a wooden cutting board, knife hovers above.
- 1.5–3.0s (S01-02): close-up — knife slices cleanly through the steak, the cut face reveals marbling, juices start to seep.
- 3.0–4.5s (S01-03): the seasoned steak hits the hot cast-iron skillet with a loud sizzle, steam bursts up violently.
- 4.5–6.0s (S01-04): extreme close-up of the pan surface, oil spits and crackles, the Maillard browning forms across the steak surface.
- 6.0–7.5s (S01-05): a wooden spatula flips the steak, a second loud sizzle, the seared side shows perfect golden-brown crust.
- 7.5–9.0s (S01-06): a pat of butter drops into the pan, melts and foams, foamy butter coats the steak surface.
- 9.0–10.5s (S01-07): overhead medium — smashed garlic cloves added to the pan, aromatic steam rises thickly.
- 10.5–12.5s (S01-08): a fresh rosemary sprig added to the bubbling butter, a final steam burst ("puff") rises, perfect caramelization visible.
- 12.5–15.0s (S01-09): the steak is plated on a rustic ceramic plate, sliced open to reveal a pink medium-rare interior, juices flow, garnish of fresh rosemary.

★ Camera language (1:1 mirror, ≤ 2 moves, mostly static close-ups for ASMR):
- 0.0–1.5s: slow dolly-in overhead, medium to medium-close.
- 1.5–3.0s: static macro close-up of the knife and meat.
- 3.0–4.5s: static overhead medium-close.
- 4.5–6.0s: static extreme close-up on the pan.
- 6.0–7.5s: static medium-close on the flip.
- 7.5–9.0s: static macro on the butter foam.
- 9.0–10.5s: static overhead medium-close.
- 10.5–12.5s: static extreme close-up on the rosemary steam burst.
- 12.5–15.0s: slow pull-out overhead from close to medium.
No whip pans, no shaky-cam.

★ Lighting (mandatory, single source):
Single light source — warm overhead key light at 30° from camera, 4000K soft, gentle ambient fill from the kitchen. No hard shadows. Warm gold + caramel brown + butter cream + herb green throughout.

★ Audio (downstream soundscape, 1:1 mirror — cooking ASMR):
- Ambient: 0.0–1.5s knife on board soft tap; 1.5–3.0s knife cut + juice drip; 3.0–4.5s loud sizzle + steam burst; 4.5–6.0s oil crackle intensifies; 6.0–7.5s spatula flip + second sizzle; 7.5–9.0s butter melt hiss + foam pop; 9.0–10.5s garlic sizzle + steam whoosh; 10.5–12.5s rosemary crackle + final steam puff; 12.5–15.0s slice through meat + juice drip + soft settle.
- BGM: NONE — pure cooking ASMR. Background kitchen hum only at -40dB.
- No dialogue, no captions.

★ Style anchor:
Cooking ASMR appetite, "starts with raw anticipation → peaks with the loud sizzle and steam → ends with the perfect slice reveal".

★ Quality:
4K ultra-high definition, macro shallow depth of field, warm soft light, slight steam haze.

★ Hard constraints:
— Food keeps natural shape, no deformation, no floating ingredients.
— Natural meat color and texture, no plastic shine, no over-saturated red.
— One continuous feel across 9 beats; cuts are intentional but flow.
— No text, no logo, no watermark.
— Stable frame, no flicker, no fire/flame visible (steam only — fire is risky in t2v).
```


