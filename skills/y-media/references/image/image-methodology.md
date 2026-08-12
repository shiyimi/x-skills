# 图片方法论 — 创意层

> Image 路径的方法论主文件。**平级于** [../video/storyboard-methodology.md](../video/storyboard-methodology.md),但完全独立:没有时间轴/音频/字幕的复杂度,聚焦**单帧的视觉/构图/文字版式/产品摄影**。视频方法论中的 R1-R5、五定法、影响因子、颗粒度标尺在 image 路径同样适用,但要做"单帧降维"(去掉时间相关维度)。
>
> Core 永不消费本文件。Skill 在 Step 3 (Plan) 时为图片工作读取本文件,产出 `<name>.image-brief.md`,再抽取 prompt 通过 core 提交。

## 五条核心原则 (R1-R5) — 先读

这五条原则是 R1-R5 视频版的**单帧降维版**。R2/R3/R5 直接沿用;R1/R4 重写以适配单帧。

| # | 原则 | 展开说明 |
| --- | --- | --- |
| **R1** | **一次定路径,坚持到底**:尽早选择路线 (text-to-image / image-to-image / 多图拼贴);prompt 中途不要切换。一次性写完一种路线,不要"既要从头生成又要保留参考图";若必须混合,按"路线分段"标记,每段独立决策 | §1.2 |
| **R2** | **视觉驱动,而非罗列要点**:把参数打包进一帧的设计骨架;1 张图 ≤ 1-3 个视觉重点(★),不要塞 5 个产品 + 3 段文字 | §3, §6 |
| **R3** | **图层纪律 (前景/中景/背景 + 文字层)**: ① 视觉三层(前景/中景/背景)必须有可命名元素,1 个光源;② 文字层如有,锁定字体/色板/位置/动画四件套;③ 不依赖模型随机补细节 | §3, §4 |
| **R4** | **1 秒内首眼钩子**: 用户扫图平均 < 1s 决定是否停留,首屏视觉冲击(对比/构图/色彩锚)必须在前 1/3 画面 | §2.3 |
| **R5** | **零错字,品牌名逐字照搬**: 品牌名/型号/成分名/数字/日期逐字核对;若用户给了官方写法,大小写·空格·标点全部照搬 | §4, §6 |

> **为什么这五条**:图片任务和视频一样,90% 的失败源自"丢锚点"。R1 防止路线漂移;R2 防止元素过载;R3 防止图层混乱;R4 防止首屏没冲击力;R5 防止品牌错字。

## 0. 配套参考文档

本方法论定义规则;配套参考文档给出具体参数、场景模板、prompt 模板、工具。

### 0.1 顶层(cross-cutting,跨模块通用)

| 配套参考 | 用途 |
| --- | --- |
| [../cinematography-reference.md](../cinematography-reference.md) | 影视要素词典:景别/光影/色彩/焦段/构图;image 路径**只取静态部分**(光影/色彩/焦段/构图),不取运镜/剪辑 |
| [../influence-factors.md](../influence-factors.md) | 视频生成影响因子 F1-F12;image 路径**降维**为 F1(主体)/F3(光影)/F4(色彩)/F5(焦段)/F10(约束),其余维度(time/audio/motion)不适用 |

### 0.2 image/ (image 模块)

| 配套参考 | 用途 |
| --- | --- |
| [image-example.md](image-example.md) | 完整填好示例(咖啡海报),image-brief.md 写作的颗粒度校准锚 |
| (本文件 §6) | 七维度写作骨架 + t2i / i2i / 多图分区的写法差异 |

### 0.3 image/scenes/ (场景矩阵 · 预留)

> 当前为预留;按需扩展。起步路由见本文件 §3.2。

| 配套参考 | 主体类型 |
| --- | --- |
| scene-product-shot.md (未来) | 产品图/商业摄影 |
| scene-poster-collage.md (未来) | 海报/拼贴/编辑设计 |
| scene-portrait.md (未来) | 人像/穿搭 |
| scene-food-asmr.md (未来,可与 storyboard 共享) | 美食/ASMR 静态 |
| scene-aesthetic.md (未来) | 生活/质感/氛围 |

### 0.4 image/templates/ (模板与速配 · 预留)

| 配套参考 | 用途 |
| --- | --- |
| templates-3-sets.md (未来) | 3 套即用 prompt 模板(产品图/海报/人像) |

## 1. Brief 与图片文档

把 brief 解析为 3 个槽位,缺位用既定默认值(stated defaults)填(在表头标 `默认假设`):

| 槽位 | 必填字段 | 缺位默认 |
| --- | --- | --- |
| 主题/产品 | subject, 1-3 个视觉重点/卖点, 素材(参考图/品牌色) | 来自 request; 真缺失就 1 轮追问 |
| 人群/受众 | 目标用户,使用场景(头像/朋友圈/详情页/广告) | 通用 9:16 信息流素材 |
| 目标 | 认知(品牌)/ 兴趣(种草)/ 转化(带货)/ 实用(教程/标识) | 按 request 判断,无固定默认 |

**核心原则**:目标驱动色调/构图/文字策略。

产出 1 份 Markdown sidecar,放在图片产物旁:

```text
<name>.image-brief.md
```

`<name>` 与 `output.filename` 的文件名主干一致。文档同时是创意计划 + 交付 sidecar:开始是创意方案,生成后追加 `Generation` 部分(由 Step 7 完成)。一份完整、符合规范的示例见 [image-example.md](image-example.md),写新 brief 之前先看。

一份 image-brief 至少含 3 个部分:

1. **图片主要目标** — 一行: `产品/主题 × 人群 × 目标(认知/兴趣/转化/实用) × 视觉骨架(见 §2) × 画幅 × 用途`.
2. **视觉规范表** — 一行(或多行,如果图层复杂),列定义见 §3;表头锁定:
   - `默认假设`:填了用户没给的默认值
   - `美学母体`:整张图锚定的色板/材质/光线基调
   - `文字策略`:含文字 / 无文字;锁 5 风格
   - `生成路径`:G 纯生成 / E 二次编辑 / H 多图拼贴(见 §1.2)
3. **图片 prompt** — 一段完整 prompt,见 §6。

### 1.2 路径判定:text-to-image / image-to-image / 多图分区(规划阶段必做)

R1 要求"早定路径,不混线"。image 路径有三个选项,选前先问两个问题:

| 判定问题 | 是 → 路径 | 否 → 路径 |
| --- | --- | --- |
| Q1. 用户是否提供了**实拍参考图**(产品照/自拍/真实场景) 且 需要**保留主体/构图/部分细节** | **E 二次编辑(image-to-image) / 分区(zone inpainting)** — 走 image-to-image 或分区替换,只改指定区域,保留原图 | 进入 Q2 |
| Q2. 用户需要**从头生成一张新图**(产品图/海报/概念图/插画) | **G 纯生成(text-to-image)** — 完整 prompt → Provider | — |

> **决策一次后,整图全程不混用**。禁止:上半区纯生成 + 下半区 i2i 拼接;若必须拼,按"路线分段"标记,每段独立决策、独立 sidecar 记录。

#### 1.2.1 三条路径详解

| 路径 | 触发 | 主体保真度 | 成本 | y-media 内部动作 |
| --- | --- | --- | --- | --- |
| **G 纯生成** | 无参考图/从 0 设计 | 取决于 prompt 锁定(无漂移,只有一致性问题) | 1 调用 | §3 视觉规范表 + §6 prompt → Provider |
| **E 二次编辑** | 有实拍参考图,需保留主体 | 与原图完全一致(无漂移) | 1 调用 | §6 写法:`保持<保留项>,把<修改项>替换为<新内容>`;**列明**哪些必须保留,哪些必须改 |
| **H 多图分区** | 海报/拼贴/编辑设计(多图层多区域) | 每区域独立 | 多调用或多 Provider | §4 多区结构 + §6 prompt 显式列区(zone allocation/材质/边界过渡) |

#### 1.2.2 路径判定反模式

- ❌ 同一张图"既要 t2i 又要 i2i":R1 显式禁止,锁定一条路。
- ❌ 默认走 G 不问用户:Q1 是的(用户给了产品实拍)但 Skill 没问就硬生成,既费额度又丢失实拍质感。
- ❌ 默认走 E 不问用户:Q1 否的(用户没素材)但 Skill 假设有,直接给空 prompt。
- ❌ 路径不写进 sidecar:后续追溯无法判断本图是 t2i 还是 i2i,re-edit 时易错。

#### 1.2.3 路径结果写入 sidecar 表头

```
生成路径: G (纯生成,默认推荐)  |  E (image-to-image 二次编辑)  |  H (多图分区拼贴)
```

H 路径额外在视觉规范表前加 `区域-1/区域-2/...` 分组,每组标子路径;拼接菜谱按分区写法 §4。

## 2. 视觉骨架 (Composition Skeleton)

> image 的"骨架"对应 video 的"叙事骨架":锁结构、锁元素位置、锁视觉重点。

### 2.1 视觉骨架速选(决策树)

按 brief 关键信号选一个骨架:

| 信号 | 骨架 | 元素数 | 文字层 | 用途 |
| --- | --- | --- | --- | --- |
| "产品图"/"白底图"/"商品图" | **A 主体居中** | 1 主体 + 3+1 道具 | 无或 ≤1 | 电商/产品详情/广告 |
| "海报"/"封面"/"推广" | **B 分区拼贴** | 1-2 主体 + 多区域 | 1-3 层(主/副/角标) | 品牌/活动/社媒 |
| "人像"/"穿搭"/"lookbook" | **C 人物构图** | 1 人物 + 场景 | 无或 ≤1 | 时尚/形象/社交 |
| "概念图"/"插画"/"氛围" | **D 场景叙事** | 1-2 主体 + 场景 | 无 | 故事/治愈/概念 |
| "标识"/"icon"/"logo" | **E 极简符号** | 1 主体 | 1 层(品牌名) | 品牌/UI/水印 |

> **判断口诀**:brief 里出现"白底/商品/详情"是 A;"海报/封面/宣传"是 B;"穿搭/形象/lookbook"是 C;"氛围/故事/治愈"是 D;"logo/icon/标识"是 E。**先定骨架,再填表**。

### 2.2 视觉重点 ★ 密度(单图适用)

| 骨架 | ★ 数 | 分布 | 自检 |
| --- | --- | --- | --- |
| A 主体居中 | 1 ★(主体本身) | 中心 50% | 1 主体是不是"一眼看清"? |
| B 分区拼贴 | 1-2 ★(主标题区 + 主体区) | 上下或左右各 1 | 信息分层是不是"扫一眼抓重点"? |
| C 人物构图 | 1 ★(人物) | 1/3 构图点 | 表情/姿态是不是"有故事感"? |
| D 场景叙事 | 1-2 ★(主体 + 氛围锚) | 1 主体 + 1 锚点(光斑/远景) | 氛围是不是"一秒入戏"? |
| E 极简符号 | 1 ★(符号本体) | 中心 | 是不是"高识别度"? |

### 2.3 R4 · 首眼钩子(单图 1 秒钩子)

单图无时间轴,钩子必须**首屏视觉冲击**。三种钩子任选一种:

| 钩子类型 | 范式 | 适合 |
| --- | --- | --- |
| **对比钩** | 强对比(冷暖/明暗/大小)放在前 1/3 画面 | A 产品图 / B 海报 |
| **构图钩** | 1/3 构图点 + 引导线(视线/光路/动势) | C 人物 / D 场景 |
| **色彩钩** | 主色占画面 60%+,主色在色环上极端(高饱和/极低饱) | B 海报 / E 符号 |

> **自检**:把图缩到 200x200,眯眼扫 1s,能不能立刻看到主体?不能 = 钩子没起作用。

## 3. 视觉规范表(Visual Spec Table)

> image 的"分镜表"——单图只需 1 行(或 H 路径下的多行)。11 列沿用视频分镜表但去掉时间/运镜/音频/字幕列。

### 3.0 单行模板(基础单图)

| 字段 | 规则 | 示例(产品图) |
| --- | --- | --- |
| 区域 ID | `Z01`(分区时用 Z01/Z02/...) | Z01 |
| 用途 | 该区域在本图中的功能 | 产品主体 |
| 主体 | ≥3 特征 + 材质/状态 | 哑光黑色蓝牙耳机,充电盒,金属铰链 |
| 景别与视角 | 景别 + 机位 + 构图 | 中近景,平视,中心构图 |
| 光影 | 方向 + 色温 + 光比 + 光质 | 顶光 45°,5000K,光比 2:1,柔光 |
| 色彩 | 主色 + 辅色 + 色调 | 哑光黑+冷灰,中低饱和冷调 |
| 前景/中景/背景 | 3+1 规则(可命名道具 + 光源) | 前景:耳机/中景:充电盒/背景:米白窗帘虚化+侧窗光 |
| 文字层 | §4(无文字则 —) | 主标题"BlackBeats X1"中下,黑字白边 |
| 视觉重点 | ★ = 封面级(cover-grade) | ★ |
| 视觉重点 2 | 二级 ★(可选) | — |
| 风格 | 摄影类型 + 美学基调 + 负向 | 产品摄影,Apple 极简,no reflections on metal,no extra accessories |

### 3.1 颗粒度标尺(image 降维版)

> 视频的颗粒度标尺见 [../video/granularity-scale.md](../video/granularity-scale.md);image 路径只取**静态**字段(光影/色彩/焦段/约束),去掉运镜/速度/音频相关字段。

| 字段 | 抽象(reject) | 具体(accept) | 阈值源 |
| --- | --- | --- | --- |
| 光影·色温 | "暖光" | `4500K`(具体 K 值) | F3 |
| 光影·光比 | "柔和" | `2:1`(数字比) | F3 |
| 光影·光质 | "好看的光" | `柔光`/`硬光`/`半硬` | F3 |
| 光影·光位 | "侧光" | `45°侧光`/`150°逆光`(角度) | F3 |
| 色彩·饱和 | "鲜艳" | `饱和度+10`(±数值) | F4 |
| 焦段 | "广角" | `16mm 广角`/`85mm 中焦`(等效 mm) | F5 |
| 主体 | "一个耳机" | `哑光黑色蓝牙耳机,充电盒,金属铰链`(≥3 特征) | F1 |
| 约束 | "要有高级感" | `24fps,快门 180°,禁止文字`(可执行) | F10 |

> **不适用字段**(image 路径直接删):运镜·速度、音频·音量、音频·BPM、音频·音效、时间锚——单图无这些维度。

### 3.2 场景路由(image 版)

填完 brief(§1)后,根据主体类型路由到 image 场景模板。当前 image/scenes/ 目录为预留,默认走以下通用路由:

| 主体类型 | 默认配置 | 关键点 |
| --- | --- | --- |
| 产品/商品(无实拍) | 骨架A + 中近景 + 顶光 5000K + 白/浅色背景 + 主体居中 | 强 i2v 推荐(若有产品实拍图) |
| 产品/商品(有实拍) | 路径E(image-to-image) + 仅修改背景/光影 | 列明保留项(主体/材质/品牌) |
| 海报/拼贴/编辑 | 骨架B + 分区 + 多字体/多色板 + 角标 | §4 多区结构 + §6 H 路径写法 |
| 人像/穿搭/时尚 | 骨架C + 1/3 构图 + 自然光 + 真实质感 | **强 i2v**(若有人物实拍) |
| 美食/ASMR 静态 | 骨架A + 微距 + 顶光 4500K + 蒸汽/反光 | 路径 G;声音不进 prompt |
| 风景/治愈/氛围 | 骨架D + 广角 + 黄金时刻光 + 1-2 慢动态元素 | 添加 1-2 动态元素避免空盒子感 |
| 标识/logo/icon | 骨架E + 极简 + 主色占 60%+ + 中心 | 锁品牌色,逐字渲染品牌名 |
| 抽象/科技/参数 | 骨架A/D + 暗背景 + 顶光 + 数字/几何元素 | 数据逐字核对(R5) |
| **商业带货/产品演示** | 走 [../video/scenes/scene-commerce-product.md](../video/scenes/scene-commerce-product.md) 的 6 大品类配置(取其中"产品摄影"相关列) + R5 零错字 + 合规清单 | 与视频同源;**i2i 优先**(实拍) |

> **未来扩展**:image/scenes/ 目录会按需补充独立 image 场景模板(产品图/海报/人像/美食静态/质感)。当前借用 video 场景模板的产品摄影部分,够用。

## 4. 图层与文字版式 (Layer And Typography)

> 文字是**设计层**,不是事后补的。从一开始就规划主标题/副标题/角标三层。

### 4.1 文字层定义

| 层 | 视觉大小 | 用途 | 范式 |
| --- | --- | --- | --- |
| **主标题** (primary) | 画面占比 5-15% | 核心信息(产品名/slogan/日期) | 中文手写衬线/宋体,大且清晰,易读;英文可选大写宽字距 |
| **副标题** (secondary) | 画面占比 1-3% | 辅助信息(场景/特征/英文译注) | 较小,英文大写宽字距,例如 `AFTERNOON · COFFEE · GREEN` |
| **角标** (corner) | 画面占比 0.5-1% | 日期/编号/小标识 | 最小最安静,例如 `2026.08` 在右上角 |

> **锁 4 件套**:字体族(一个族)/ 色板(≤2 色)/ 位置(按类型)/ 描边或阴影(统一)。

### 4.2 R5 · 文字零错字铁律

- **品牌名/型号/成分/数字/日期** 用引号包裹: `"ESTĒE LAUDER 雅诗兰黛"`
- 在 prompt 末尾加 `按引号内文字原样渲染` 指令
- **绝对化用语禁用**: "最/第一/国家级/销量冠军"(广告法)
- 长句禁用,短标签渲染更可靠

### 4.3 拼贴/分区(zone)的边界与材质

> 适用于骨架B(分区拼贴)和路径H(多图分区)。

每个 zone 必填 4 字段:

| 字段 | 含义 | 示例 |
| --- | --- | --- |
| **区域占比** | 百分比或分数 | 上 38% / 下 62% |
| **区域材质** | 纹理 + 颜色范围 + 内容 | 牛皮纸,可见天然纤维纹理,浅棕到中棕自然过渡 |
| **边界过渡** | 边缘处理 | 不规则手撕水平边,粗糙纤维;硬线;自然渐隐 |
| **区域编辑** | i2i 路径下说明 | "原图上半天空被移除,替换为牛皮纸" |

完整出血(bleed):声明"照片区域是否延伸到所有边缘"(full bleed / 有 margin)。

### 4.4 点缀元素(accent)

1-2 个克制的装饰元素,各填 4 字段:视觉大小(约 1.5cm 或画面占比)/ 颜色 / 位置(标题旁,略偏移)/ 风格(扁平实心块)。

> ❌ 不要堆多个 accent,会显廉价。

## 5. 约束块 (Constraint Block)

每个 prompt 必须以约束块收尾,确保模型不漏不漂:

```
约束(必加):
— 避免纯色渐变背景,避免棚拍空盒子感(无主体无道具的"白底图"感)
— 色调从 X 自然过渡到 Y,过渡流畅不跳戏
— 所有中文/英文文字按引号内文字原样渲染,零错字
— R5 铁律:品牌名/型号/成分/数字逐字核对
— 如有实拍参考:<列明保留项>必须与原图一致;<列明修改项>替换为<新内容>
```

- 海报/拼贴类额外加 `分区边界自然过渡,不要有硬接缝`
- 商业类额外加 `品牌元素真实可信,符合产品品类常识,无虚构资质`

## 6. 图片 Prompt

### 6.1 七维度写作骨架

以一句话锁定风格类型 + 画幅 + 美学基调(如 `Lifestyle collage poster, vertical 3:4, warm indie zine aesthetic`),然后展开七维度:

```text
[风格总领句] + [主体] + [动作/状态] + [场景/环境] + [光线/色调] + [视角/构图] + [视觉风格/画质] + [约束条件]
```

| 维度 | 规则 | 示例 |
| --- | --- | --- |
| 风格总领句 | 一行内给出风格类型 + 画幅比例 + 美学基调 | Lifestyle collage poster, vertical 3:4, warm indie zine aesthetic |
| 主体 | 具体、单一主体,带材质/状态 | 一只大号南美白虾仁,表面冷凝水珠 |
| 动作/状态 | 一个静态姿势或冻结瞬间 | 从冰水中捞起的瞬间,水珠滑落 |
| 场景/环境 | §3 的 `3+1` 元素规则,前景/中景/背景三层 | 大理石台面+木铲+几片绿叶,背景虚化 |
| 光线/色调 | 方向 + 色温 + 对比度 + 光质 | 45°侧光,6000K,柔光高对比,青白+冰蓝冷调 |
| 视角/构图 | 景别 + 机位 + 构图(中心/三分法/留白) | 微距特写,低角度仰拍,主体居中 |
| 视觉风格/画质 | 摄影风格 + 保真线索 | 食物摄影,浅景深,超清细节 |
| 约束 | 防 AI 合成感 / 文字 / 负向 | 避免纯色渐变背景,避免过度 AI 合成感 |

### 6.2 text-to-image vs image-to-image 写法差异

**G 纯生成(t2i)**:描述完整场景,无参考存在。完整七维度全填。

**E 二次编辑(i2i)**:列明保留/修改项,格式 `保持<保留项>,把<修改项>替换为<新内容>`。

对于局部编辑:`仅修改<区域>,其余保持不变`。

**元素级绑定**(参考图转海报/拼贴):显式列元素清单——哪些必须从参考图来,哪些不能改,例如:
```
Use the uploaded photo as the exact source for the cup, straw, table, street, and sunlight.
Do not replace the cup or change the real-life scene.
```

> 不列清单的 i2i,模型会重画/重塑参考主体,失去"参考"意义。

### 6.3 画幅比作为创意决策

按用途选画幅,不要默认:

| 画幅 | 用途 | 参数 |
| --- | --- | --- |
| 竖 9:16 | 封面/信息流素材/小红书 | `parameters.size` 或 `ratio: '9:16'` |
| 竖 2:3 / 3:4 | 详情页/海报/朋友圈 | `ratio: '3:4'` |
| 方 1:1 | 商品图/头像/Instagram | `ratio: '1:1'` |
| 横 16:9 | 横幅/社媒头图 | `ratio: '16:9'` |
| 横 4:3 | 传统印刷/Banner | `ratio: '4:3'` |
| 特殊(21:9 等) | 电影感横屏/特殊印刷 | 显式说明构图方向 |

> 在 `parameters` 中显式给 ratio,验证所选 Provider 是否支持;若比例特殊,在 prompt 中加构图方向说明(如"主体居左,右侧留白")。

### 6.4 Prompt 拼装示例(七维度 + 约束块)

下面是 [image-example.md](image-example.md) 的完整 prompt 拼装示例,逐项对应 §3 视觉规范表:

```text
Lifestyle collage poster, vertical 3:4 ratio, warm indie zine aesthetic.

★ Main subject(主体 · ≥3 特征 + 材质/状态):
A transparent plastic iced coffee cup with a clear straw, sitting on a wooden table by a sunlit window. Cup is full of light-brown iced coffee with a few ice cubes, subtle condensation on the cup wall.

★ Scene(场景三层 · 3+1 规则):
Front: hand-torn kraft paper edge with rough fibrous fibers
Mid: the coffee cup at lower visual center
Back: blurred sunlit street with zebra crossing stripes, warm afternoon sunlight

★ Action / state(静态瞬间):
Frozen instant — the cup sits still, no liquid motion; subtle sunlight on cup wall, no splash, no movement.

★ Lighting(光影 · 方向+色温+光比+光质):
Single natural light source — warm afternoon sunlight from the window, side-lit 45°, 4000K, soft fill, ratio 2:1.

★ Color(色彩 · 主色+辅色+色调):
Warm brown kraft paper + transparent cup + sunlit street, low-saturation warm indie zine palette.

★ Camera / composition(视角/构图):
Static shot, eye-level, lower visual center placement, full-bleed photo extends to all edges, paper has a slight off-axis tilt.

★ Style anchor(1 个标签):
Lifestyle collage poster, indie zine, WeChat-Moments-meets-coffee-magazine.

★ Quality(后置强化):
4K ultra-high definition, scanned-paper grain texture, natural aging, slight crease lines on kraft paper.

★ Hard constraints(焊死 · 必加):
— All text must be rendered exactly as written in quotes, zero typos.
— Upper 38% is kraft paper, lower 62% is full-bleed photo, hand-torn edge between.
— No extra coffee cups, no extra people, no extra tables, no commercial buttons, no neon, no gradients, no 3D.
```

**逐项对照 §3 视觉规范表**:

| 规范表字段 | 本 prompt 写法 | 降级规则(沿用 video granularity-scale) |
| --- | --- | --- |
| 主体 | 透明塑料杯 + 木桌 + 阳光 | ≥3 特征 + 材质保留 |
| 光影·色温 | `4000K` | K 值(展示层)在本 prompt 中保留(image 不必语义化降级,因为单图,无时间轴) |
| 光影·光比 | `2:1` | 同上(单图保留) |
| 焦段 | 无明确 mm | 单图无运镜,可不写 |
| 文字 | 引号 `"一杯咖啡的午后"` | 逐字 |

> **image 与 video 的关键差异**:image 路径**不必做"数字 → 方向"的语义化降级**(K 值/光比保留),因为单图无时间轴压力,模型对单帧数字参数有更高遵从度。但 audio/速度/dB/BPM 仍不进 prompt。

## 7. 画幅与分辨率

按 §6.3 选画幅,通过 `parameters.size` / `parameters.ratio` 显式给,验证所选 Provider 支持。`size` 优先选 Provider 默认推荐分辨率(如 1024x1024 / 2048x2048),避免触发再缩放损失。

**对应不同画幅的 size 速查**(以 t2i 主流 Provider 为参考):

| 画幅 | 推荐的 size(1:1 像素基准) | 高清档 |
| --- | --- | --- |
| 1:1 | 1024x1024 | 2048x2048 |
| 3:4 | 864x1152 | 1728x2304 |
| 4:3 | 1152x864 | 2304x1728 |
| 9:16 | 720x1280 | 1440x2560 |
| 16:9 | 1280x720 | 2560x1440 |

> 表中数字仅作参考,实际值以 Provider 的 `capability_limits[capability].supportedAspectRatios` 为准。

## 8. 系列图一致性 (Image Series Consistency)

> 当一次出 3 张以上共享同一主体的图(详情页主图/sku 系列/品牌系列),**必须先锁主体描述符 + 美学母体**,再变化场景/动作/视角。

| 字段 | 锁 | 变 |
| --- | --- | --- |
| 主体描述符 | ≥3 特征(品牌/颜色/材质/工艺) | — |
| 美学母体 | 主色 + 辅色 + 灯光风格 | — |
| 焦段/景别 | — | 1 远 / 1 中 / 1 近 |
| 场景/道具 | — | 每次换 1-2 个可命名道具 |
| 文字层 | 字体/色板/位置/描边 | 文字内容可改 |
| 视觉重点 ★ | 每张图 ≥1 ★ | ★ 位置/主体可改 |

> **变体法则**:每张图只换 ≤3 个变量(场景/动作/视角/文字);**一次换太多 = 主体漂移**。

## 9. 图片作为视频输入

生成的图可作为 `image-to-video` / `keyframes-to-video` 的输入。**image 路径的 prompt 与 video 路径的 prompt 在 i2v 场景下要协同**:

- **首帧引导**: `以 <图片1> 作为起始画面`
- **风格参考**: `参考 <图片1> 的色调与光影`
- **主体一致**: `以 <图片1> 为主体,保持产品外观/logo/配色一致`

复用 [../video/storyboard-methodology.md](../video/storyboard-methodology.md) §6.1 的输入绑定(input binding)语法。

> **i2v 的 image 准备自检**:① 主体在画面内完整(留出运镜空间)?② 第一帧/末帧的构图与 video 段的运镜匹配?③ 主体与背景对比度足够,运镜不会丢焦?

## 10. 图片反模式

| 反模式 | 症状 | 修复 |
| --- | --- | --- |
| 抽象堆砌 | "高级感" 但没有参数 | 给具体数字/术语(光比/饱和度/材质) |
| 多主体混淆 | 1 图 >1 主体 | 锁 1 主体,1 动作/状态 |
| 一图多个冲突动作 | 主体既"飞"又"坐" | 1 图 1 静态动作 |
| 文字错字 | 品牌/数字写错 | R5 铁律,引号 + verbatim |
| 文字层缺位置/字体 | 字在哪/什么字体未明 | §4 锁 4 件套 |
| 空盒子背景 | 主体居中,四周纯白 | 加 3+1 道具/纹理,加 1-2 慢动态元素 |
| 过度 AI 合成感 | 颜色过艳/边缘发虚/构图诡异 | 加 `natural photograph feel, no AI artifacts` |
| 拼贴无边界过渡 | 上/下区域硬接 | 显式说明手撕/硬线/渐变 |
| i2i 漂移 | 参考图主体被重画 | 列元素级绑定清单 |
| 比例异常 | 选 9:16 但构图是横构图 | 显式说明"主体居左,右侧留白"或换画幅 |
| 商业类缺 R5 | 品牌错字/数字错 | R5 铁律 + 合规清单(见 [../video/scenes/scene-commerce-product.md](../video/scenes/scene-commerce-product.md) §9) |
| 系列图漂移 | 3 张图主体不像同一物 | §8 锁主体描述符 + 美学母体 |

## 11. 自检 4 问(填完 brief 后 30 秒过)

1. **生成路径写了吗?** sidecar 表头 `生成路径: G | E | H` 是否填了?(§1.2.3)
2. **视觉规范表 11 列都填了?** 至少 1 行;分区图多行(§3.0)
3. **R5 铁律查了?** 品牌名/型号/成分/数字是否引号 + verbatim?(§4.2)
4. **首屏 1 秒钩子有吗?** 缩到 200x200 眯眼扫 1s,能不能立刻看到主体?(§2.3)

## A. Negative Prompt 字段说明(图像路径不独立维护)

`SKILL.md` §7 描述的 sidecar 结构里包含 `Negative Prompt` 字段,但**该字段仅视频路径使用**。图像路径不独立维护 `negative_prompt`,所有负面约束统一用 §5 约束块里的 `no X, no Y, no Z` 正向写法焊死在主 prompt 末尾。

**为什么图像不独立维护**:
- 当前 Provider(Agnes `agnes-image-2.0-flash` / `agnes-image-2.1-flash`)的 `/v1/images/generations` 接口不接受 `negative_prompt` 参数,即使填了也不会生效
- 现代 t2i 模型(DALL·E、GPT-image、Agnes flash 系列)对独立 `negative_prompt` 遵从度低,`no X` 写在主 prompt 末尾比独立字段更可靠
- 独立字段会增加侧车维护成本,但不会带来实际质量收益

**侧车字段处理**:即便不填,image-brief.md 也要保留 `## Negative Prompt` 部分,内容写一行占位:

```text
## Negative Prompt
— (图像路径不独立维护 negative_prompt,所有负面约束在 §3 Final Prompt 的 Hard Constraints 块内。详见 image-methodology.md §A 与 providers/agnes/api.md)
```

**与视频方法的差异**:视频路径有独立 `negative_prompt` 字段方法论,见 [../video/negative-prompt-methodology.md](../video/negative-prompt-methodology.md)。**不要把视频的负面词表照搬到 image-brief**。
