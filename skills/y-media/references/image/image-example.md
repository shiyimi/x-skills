# Image Brief 示例 · 产品图 + 海报拼贴

> 本文件是 [image-methodology.md](image-methodology.md) 的完整示例。每条示例都按"image-brief.md"结构填写:1. 图片主要目标 / 2. 视觉规范表 / 3. 图片 prompt。
>
> 写新 image-brief 前必读,作为颗粒度校准锚。

---

## 示例 1 · 蓝牙耳机产品图(纯生成,G 路径)

**用途**:电商详情页主图;白底+产品;**转化为主**

### 1. 图片主要目标

```
品牌 BlackBeats × 25-35 岁男性通勤族 × 转化(转化) × 骨架A(主体居中) × 画幅 1:1(方图) × 用途:电商详情页主图
```

**默认假设**:
- 无真人出镜(产品图),无实拍参考图 → G 纯生成
- 主体颜色:哑光黑(品牌色)
- 文字策略:无文字(详情页主图,文字在详情页内单独设计)

**美学母体**:
```
主色 哑光黑(#1A1A1A) + 辅色 冷灰金属 + 暖金高光反射 + 浅米背景
灯光 顶光 + 后侧补光,5000K,光比 3:1,半硬光
质感 Apple 极简产品摄影,无过度装饰
```

**生成路径**: G(纯生成,默认推荐)

### 2. 视觉规范表

| 字段 | 内容 |
| --- | --- |
| 区域 ID | Z01 |
| 用途 | 产品主体(详情页主图) |
| 主体 | 哑光黑色蓝牙耳机,金属铰链,USB-C 充电口,品牌 logo `BlackBeats` 在充电盒顶部居中(逐字) |
| 景别与视角 | 中近景,平视,中心构图,产品占画面 60% |
| 光影 | 顶光 45° + 后侧补光,5000K,光比 3:1,半硬光 |
| 色彩 | 哑光黑+冷灰金属+暖金高光,中低饱和冷调 |
| 前景/中景/背景 | 前景:耳机主体/中景:充电盒+1 颗备用耳塞/背景:浅米窗帘虚化+侧窗光 |
| 文字层 | —(无文字) |
| 视觉重点 | ★ |
| 视觉重点 2 | — |
| 风格 | 产品摄影,Apple 极简,no reflections on metal, no extra accessories, no people |

### 3. 图片 prompt(七维度 + 约束块)

```text
Product photography, square 1:1, minimalist tech aesthetic.

★ Main subject(主体 · ≥3 特征 + 材质/状态):
A pair of matte-black Bluetooth earphones, magnetic charging case, USB-C port, "BlackBeats" brand logo engraved on the top center of the case. Both earphones are seated in the case, lid open at 90 degrees.

★ Scene(场景三层 · 3+1 规则):
Front: a single pair of spare ear tips in matte black
Mid: the open charging case with the two earphones seated
Back: blurred cream-colored sheer curtain with a soft side window light

★ Action / state(静态瞬间):
Frozen instant — the case is stationary, lid open, no motion, no people.

★ Lighting(光影 · 方向+色温+光比+光质):
Single key light from top 45°, 5000K, soft fill from back-side window, ratio 3:1, semi-hard light, subtle warm highlight on metal hinge.

★ Color(色彩 · 主色+辅色+色调):
Matte black (#1A1A1A) + cool gray metal + warm gold highlight on metal edges, low-saturation cool palette overall.

★ Camera / composition(视角/构图):
Eye-level shot, product centered, occupies 60% of the frame, 1:1 square ratio, shallow depth of field.

★ Style anchor(1 个标签):
Product photography, Apple-minimalist, premium consumer electronics, no people, no clutter.

★ Quality(后置强化):
4K ultra-high definition, sharp product detail, micro-texture on matte surface visible, no over-sharpening.

★ Hard constraints(焊死 · 必加):
— "BlackBeats" brand logo on the case top must be rendered exactly as written in quotes.
— No reflections on the matte surface that obscure the product.
— No people, no extra accessories, no brand stickers, no price tags, no watermark, no background text.
— Clean minimalist composition, single subject focus.
```

**逐项对照 §3 视觉规范表**:

| 规范表字段 | 本 prompt 写法 | 降级/保留 |
| --- | --- | --- |
| 主体 | 哑光黑色蓝牙耳机,金属铰链,USB-C 充电口 | ≥3 特征 + 材质保留 |
| 景别与视角 | 中近景,平视,中心构图 | 完整保留 |
| 光影·色温 | `5000K` | K 值保留(image 不必降级) |
| 光影·光比 | `3:1` | 数字保留 |
| 色彩 | `#1A1A1A` 哑光黑 | 16 进制 + 命名 |
| 文字 | `"BlackBeats"`(引号) | R5 铁律逐字 |

---

## 示例 2 · 咖啡海报拼贴(多图分区,H 路径)

**用途**:社媒活动封面/品牌海报;**品牌+种草**

### 1. 图片主要目标

```
品牌 一杯咖啡的午后 × 25-35 文艺女性 × 兴趣(种草) × 骨架B(分区拼贴) × 画幅 3:4(竖版海报) × 用途:小红书/微博 活动封面
```

**默认假设**:
- 用户提供了实拍咖啡杯照片作为参考图 → H 路径(分区拼贴 + 元素级绑定)
- 主体颜色:暖棕(牛皮纸)+ 透明塑料杯 + 阳光
- 文字策略:含文字(主标题"一杯咖啡的午后" + 副标题英文 + 角标日期)

**美学母体**:
```
主色 暖棕牛皮纸 + 透明咖啡杯 + 阳光街道
材质 牛皮纸(可见纤维纹理) + 木桌 + 透明塑料
灯光 暖午阳光 45°侧光,4000K,光比 2:1,柔光
质感 独立杂志剪贴风,WeChat Moments + 独立咖啡杂志
```

**生成路径**: H(多图分区拼贴)

### 2. 视觉规范表(多区)

**Z01 · 牛皮纸区(上 38%)**

| 字段 | 内容 |
| --- | --- |
| 区域 ID | Z01 |
| 区域占比 | 上 38% |
| 区域材质 | 暖棕牛皮纸,可见天然纤维纹理,轻微褶皱,浅棕到中棕自然色变 |
| 边界过渡 | 不规则手撕水平边,粗糙纤维向下 |
| 主体 | 中文主标题 `"一杯咖啡的午后"`(手写衬线/宋体,黑墨水) |
| 文字层 | 主标题 + 副标题 `AFTERNOON · COFFEE · GREEN`(小字宽字距) + 角标 `"2026.08"`(右上角) |

**Z02 · 咖啡照片区(下 62%)**

| 字段 | 内容 |
| --- | --- |
| 区域 ID | Z02 |
| 区域占比 | 下 62% |
| 区域材质 | 真实街景照片,透明塑料冰咖啡杯+木桌+阳光街道+斑马线 |
| 边界过渡 | 上边界与牛皮纸手撕边自然融合(无硬接缝) |
| 主体 | 透明塑料杯(满冰咖啡)+ 透明吸管 + 木桌 + 阳光街道(虚化背景) |
| 文字层 | — |
| 视觉重点 | ★(透明杯+冰咖啡+阳光) |

**点缀(Accent)**:
```
1.5cm 见方 实心焦糖棕方块,放在主标题旁略偏移,作为拼贴装饰
```

**视觉规范·共同列**:

| 字段 | 内容 |
| --- | --- |
| 景别与视角 | 静帧,平视,主体居中偏下,full bleed 照片延伸至所有边缘 |
| 光影 | 暖午阳光 45°侧光,4000K,光比 2:1,柔光 |
| 色彩 | 暖棕 + 透明 + 阳光街道,低饱和暖调 |
| 风格 | Lifestyle collage poster, indie zine, WeChat Moments × 独立咖啡杂志 |

### 3. 图片 prompt(七维度 + 约束块 + 分区写法)

```text
Lifestyle collage poster, vertical 3:4 ratio, warm indie zine aesthetic.

★ Composition(分区拼贴 · 38% + 62%):
The poster is split into two zones.
- Z01 (upper 38%): a warm brown kraft paper layer with visible natural fiber texture, subtle creases, and gentle color variation from light tan to medium brown. The bottom edge of the kraft paper has an irregular hand-torn horizontal edge with rough fibrous fibers, naturally transitioning into the photo below.
- Z02 (lower 62%): the actual street-side coffee photo — a transparent plastic iced coffee cup with a clear straw, sitting on a wooden table by a window. Through the window: a sunlit street with zebra crossing stripes, warm afternoon sunlight casting soft shadows. The coffee cup sits at the lower visual center. The photo extends to all edges with full bleed. The upper sky and cluttered background of the original photo are removed and replaced by the kraft paper.

★ Main subject(主体 · ≥3 特征 + 材质/状态):
A transparent plastic iced coffee cup with a clear straw, sitting on a wooden table by a sunlit window. The cup is full of light-brown iced coffee with a few ice cubes, subtle condensation on the cup wall.

★ Scene(场景三层 · 3+1 规则):
Front: hand-torn kraft paper edge with rough fibrous fibers
Mid: the coffee cup at lower visual center
Back: blurred sunlit street with zebra crossing stripes, warm afternoon sunlight

★ Action / state(静态瞬间):
Frozen instant — the cup sits still, no liquid motion, no splash, no people movement.

★ Lighting(光影 · 方向+色温+光比+光质):
Single natural light source — warm afternoon sunlight from the window, side-lit 45°, 4000K, soft fill, ratio 2:1, soft light.

★ Color(色彩 · 主色+辅色+色调):
Warm brown kraft paper + transparent cup + sunlit street, low-saturation warm indie zine palette.

★ Camera / composition(视角/构图):
Static shot, eye-level, lower visual center placement, full-bleed photo extends to all edges, paper has a slight off-axis tilt.

★ Typography(主/副/角标三层):
- Primary (主标题): centered on the kraft paper, slightly below the middle of the kraft zone, a large Chinese title "一杯咖啡的午后" in black ink, using a vintage Song/serif typeface with a handwritten feel — elegant, slightly calligraphic, clear and readable.
- Secondary (副标题): below the Chinese title, in much smaller uppercase English letters with wide letter-spacing: "AFTERNOON · COFFEE · GREEN".
- Corner (角标): in the upper-right corner of the kraft paper area, small black text "2026.08".

★ Accent(点缀元素):
A small solid caramel-brown square block (about 1.5cm visual size) placed near the title as a collage decoration element, slightly offset from the text.

★ Style anchor(1 个标签 + 情绪):
Lifestyle collage poster, indie zine, "WeChat Moments life record meets independent coffee magazine", warm and relaxed sun-drenched afternoon feeling.

★ Quality(后置强化):
4K ultra-high definition, scanned-paper grain texture with slight grain, natural aging, slight crease lines on kraft paper.

★ REFERENCE(元素级绑定 · H 路径必填):
Use the uploaded photo as the exact source for the coffee cup, straw, wooden table, street scene, zebra crossing, and sunlight in the lower portion. Do not replace the cup or change the real-life scene.

★ Hard constraints(焊死 · 必加):
— All Chinese and English text must be rendered exactly as written in quotes, zero typos: "一杯咖啡的午后" / "AFTERNOON · COFFEE · GREEN" / "2026.08".
— The hand-torn edge between kraft paper and photo must be natural and fibrous, no hard cut line.
— No extra coffee cups, no extra people, no additional tables, no commercial buttons, no neon, no gradients, no 3D, no AI-synthetic look.
— Flat, collage-style, quiet, warm, diary-like, indie editorial aesthetic.
```

**逐项对照 §3 + §4 视觉规范表**:

| 规范表字段 | 本 prompt 写法 | 降级/保留 |
| --- | --- | --- |
| 区域 ID | Z01(38%) / Z02(62%) | 显式分区 |
| 区域材质 | 牛皮纸 + 透明塑料杯 | 完整保留 |
| 边界过渡 | 不规则手撕水平边,粗糙纤维 | 显式说明 |
| 文字 | `"一杯咖啡的午后"` / `"AFTERNOON · COFFEE · GREEN"` / `"2026.08"` | 引号 + verbatim |
| Accent | 1.5cm 见方实心焦糖棕 | 4 字段全 |
| 参考绑定 | `REFERENCE:` 段 | 元素级绑定清单 |

---

## 示例 3 · Logo/极简符号(骨架 E,G 路径,简版)

**用途**:品牌标识/水印/icon;**认知为主**

### 1. 图片主要目标

```
品牌 MindfulStudio × 25-40 都市白领 × 认知(品牌) × 骨架E(极简符号) × 画幅 1:1(方图) × 用途:品牌 icon
```

### 2. 视觉规范表(简版)

| 字段 | 内容 |
| --- | --- |
| 区域 ID | Z01 |
| 用途 | 品牌符号 |
| 主体 | 几何符号"圆环 + 内嵌 M"(品牌主图形) + 品牌名 `"MindfulStudio"` 居中下方 |
| 景别与视角 | 中心,符号占 40%,品牌名占 10% |
| 光影 | 无(扁平设计) |
| 色彩 | 主色 `#2C3E50`(深蓝灰) + 辅色 `#ECF0F1`(浅灰) |
| 前景/中景/背景 | 单一主体,纯色背景 `#FFFFFF` |
| 文字层 | 1 层(品牌名,小字宽字距) |
| 视觉重点 | ★ |
| 风格 | Flat, no 3D, no neon, no gradients, no shadows, no textures, minimalist corporate icon |

### 3. 图片 prompt(简版)

```text
Minimalist corporate brand icon, square 1:1, flat design.

★ Main subject:
A geometric mark — a thin ring with an embedded stylized "M" inside, centered in the upper 50% of the frame. Below the mark, the brand name "MindfulStudio" in small uppercase English with wide letter-spacing, centered, in dark blue-gray #2C3E50.

★ Scene:
Pure white #FFFFFF background, no texture, no shadow, no gradient.

★ Lighting:
None — flat 2D design.

★ Color:
Primary: deep blue-gray #2C3E50
Secondary: light gray #ECF0F1
Background: white #FFFFFF

★ Camera / composition:
Centered, 1:1 square, mark in upper 50%, name in lower 50% with comfortable margins on all four sides.

★ Hard constraints:
— Brand name "MindfulStudio" must be rendered exactly as written in quotes.
— Flat 2D, no 3D, no shadows, no gradients, no textures, no AI-synthetic look, no extra elements.
— Pure white background, no off-white tint.
```

---

## 反例对照(自检前看 1 分钟)

| ❌ 反例 | ✓ 修复 |
| --- | --- |
| 抽象主体:"一个耳机" | ≥3 特征:"哑光黑色蓝牙耳机,金属铰链,USB-C 充电口" |
| 抽象光影:"柔和光" | 具体光影:"顶光 45°,5000K,光比 3:1,半硬光" |
| 数字乱跳:"¥199"(未核对) | 逐字核对 + 引号:"`199`" 或 "RMB 199" |
| 文字未指定字体:"写上'咖啡'" | 字体/位置/大小/色板全锁:"中文手写衬线/宋体,黑色墨水,主标题居中,主标题下方 1/3" |
| 拼贴无边界:"上牛皮纸下照片" | 显式手撕边:"不规则手撕水平边,粗糙纤维" |
| i2i 漂移:"基于照片改背景" | 元素级绑定:"Use the uploaded photo as the exact source for the cup, straw, table, street, and sunlight. Do not replace the cup." |
| 商业类缺 R5:品牌名错字/数字错 | R5 铁律 + 合规清单(广告法)逐条查 |
| 比例异常:9:16 但构图横 | 显式说明"主体居左,右侧留白"或换画幅 |
