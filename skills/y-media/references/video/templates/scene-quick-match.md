# 场景速配表 · Scene Quick Match

> 本文件与 [templates-3-sets.md](templates-3-sets.md) 配合:那里给可套用的完整 prompt 模板,这里给**按场景类型选运镜/光影/风格锚的决策表**,用于快速路由。
>
> 与场景模板文件配合:
> - [../scenes/scene-nature-animal.md](../scenes/scene-nature-animal.md) — 自然/动物/治愈
> - [../scenes/scene-lifestyle-aesthetic.md](../scenes/scene-lifestyle-aesthetic.md) — 生活/质感/氛围
> - [../scenes/scene-portrait-fashion.md](../scenes/scene-portrait-fashion.md) — 人像/穿搭
> - [../scenes/scene-food-asmr.md](../scenes/scene-food-asmr.md) — 美食/ASMR

---

## 1. 场景速配主表

| 场景类型 | 推荐运镜 | 推荐光影 | 风格锚 | 警示 |
| --- | --- | --- | --- | --- |
| **人物特写** | Intimate Dolly In | 柔光 | 治愈清新 / 杂志风 | 主体占画面 80%+ |
| **产品展示** | Subtle Orbit (45°弧) | 纯色背景 + 三点光 | 商业 / 极简 | 数字产品避"虚化背景" |
| **城市夜景** | Dutch Angle Pan | 霓虹光污染 | 赛博朋克 / 黑紫橙 | 避免过曝 |
| **梦境片段** | Dolly Zoom | 高斯模糊 | 迷幻 / 超现实 | 慎用,易致观感晕 |
| **自然/治愈** | Lateral Tracking + Pull-out | 侧逆光 + 拉镜收尾 | BBC Earth / National Geographic | 禁用手持抖动 |
| **武侠/国风** | Smooth Dolly Forward | 柔光逆光 | 武侠电影感 | 冷暖对比强烈 |
| **街头纪实** | Handheld Style | 现场光 | 真实 / 躁动 | 治愈系禁用 |
| **美食 ASMR** | Macro + 顶光 | 暖食欲光 + 蒸汽粒子 | 暖食欲 / ASMR | 声音-视觉同源 |
| **宠物治愈** | Low-angle + 跟拍 | 窗光 | 暖民谣 / Vlog感 | 自然互动,避免拟人 |
| **抽象艺术** | Time-lapse | 超广角 + 强逆光 | 史诗 / 哲理 | t2v 支持有限,优先短段 |
| **风光转场** | Slow pan / Crane | 黄金时刻 | 治愈 / 电影感 | 竖屏避极远景 |
| **古风舞剑** | Dolly forward + Slow pan | 逆光薄雾 | 武侠电影感 | 慢动作+冷光剑 |

---

## 2. 主体描述速查(角色四层)

| 主体 | 角色四层模板(执行层) |
| --- | --- |
| **马/pony** | `A [age]-month-old [color] pinto foal with a fluffy mane and a flowing tail, [temperament] temperament` |
| **鹿** | `A [age]-year-old [species] deer with [antler/feature] and [coat pattern], [temperament] temperament` |
| **猫** | `A [age]-year-old [breed] cat with [coat color/pattern], [eye color] eyes, [temperament]` |
| **狗** | `A [age]-year-old [breed] with [coat] fur, [ear type] ears, [temperament]` |
| **人像女** | `A [age]-year-old [ethnicity] woman with [hair], [face feature], wearing [clothing], [temperament]` |
| **人像男** | `A [age]-year-old [ethnicity] man with [hair], [face feature], wearing [clothing], [temperament]` |
| **食物** | `A [size] [dish name] with [topping/garnish], [texture description], on [plate/table]` |
| **产品** | `A [size] [product] with [material/color], [brand mark in quotes], [detail]` |
| **风景** | `A [type] landscape in [time/style], with [environment details], [lighting/weather]` |

---

## 3. 钩子速查(前 3 秒防流失)

| 钩子类型 | 写法 | 适用 |
| --- | --- | --- |
| **运动钩子** | `the [subject] trots in from the distance` / `camera slowly pushes in` | 通用 |
| **光影钩子** | `backlight silhouette` / `volumetric light beams` / `light shafts through mist` | 治愈/氛围 |
| **动作钩子** | `suddenly breaks into a gallop` / `leaps up` / `shakes head` | 动物/运动 |
| **表情钩子** | `close-up of [subject] tilting head` / `gazing at camera` | 人像/宠物 |
| **悬念钩子** | `starts with a close-up of [detail], then reveals the full scene` | 叙事 |
| **声音钩子** | (仅展示层,执行层移出) | 不进 prompt |

---

## 4. 场景路由决策树

```
输入: brief 主体 + 场景
  │
  ├─ 动物/自然/风景/治愈? → scenes/scene-nature-animal.md
  ├─ 日常生活/质感/氛围/慢生活? → scenes/scene-lifestyle-aesthetic.md
  ├─ 人物/穿搭/美妆/时尚? → scenes/scene-portrait-fashion.md
  └─ 食物/烹饪/ASMR? → scenes/scene-food-asmr.md
         │
         └─ 选完后,用本表选运镜+光影+风格锚
              │
              └─ 用 templates-3-sets.md 套 prompt 模板
```

---

## 5. 跨场景通用 5 配

| 维度 | 默认值(改场景时优先调) |
| --- | --- |
| 画幅 | 9:16 (竖屏) |
| 时长 | 15s |
| 帧率 | 24 fps,快门 180° |
| 帧数 | 361 (= 8×45+1) |
| 镜头数 | 与 §2 表格镜号 1:1 对应,N 镜 → N 个时间锚点(执行层;不主动合并,见 [../storyboard.md §2.0](../storyboard.md)) |
