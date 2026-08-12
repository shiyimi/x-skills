---
name: y-media
description: 生成或编辑图片、生成视频、使用 Agnes AI 或其他已注册媒体 Provider、消耗 Provider 免费配额、查询或恢复已有媒体任务、下载已生成媒体时使用。不适用于:纯文字 brief 无媒体产物 / 离线模型训练或微调场景。
---

# y-media · 媒体工作流

**打开本文件第一屏 → 命中 §0 路由表 → 判定 §0.5 复杂度模式 → 按模式加载对应文件集 → 严格按 §1 铁律 + §2 5 步工作流推进**。

> **加载规则**:每次 brief 只读路由命中的 1 个 recipe + 共享 library 集。未命中文件**不读**。文件小、加载少、成本低。

### 0.5 复杂度模式(先判模式,再决定加载深度)

按 brief 信号判定模式,不同模式走不同的加载路径:

| 模式         | 信号                                              | 加载路径                                | 估计加载量 |
| ------------ | ------------------------------------------------- | --------------------------------------- | ---------- |
| **快速模式** | 一句话需求"帮我生成XXX" / 无分镜要求 / 纯模板套用 | recipe + template(3-sets.md),跳过 M1-M9 | ~15KB      |
| **标准模式** | 需要分镜脚本 / 有明确场景描述 / 15s 以内          | recipe + 核心 M1-M3 + M6-M7(~50KB)      | ~50KB      |
| **完整模式** | 多段需求 / 商业带货 / 品牌年度片 / 复杂场景       | recipe + 全部 M1-M9(~95KB)              | ~95KB      |

> **判定规则**:默认走标准模式。brief 含"简单""模板""套用"等词 → 快速模式。
> brief 含"多段""系列""品牌""大片""多镜"等词 → 完整模式。
> 不确定时 = 标准模式。

#### 各模式加载路径说明

**快速模式**:读 recipe 头部(获取视觉锚+场景速配)+ template(3-sets.md)→直接套模板生成。跳过 M1-M9 全部 library。

**标准模式**:读 recipe + 核心 6 个(M1+M5+M2+M3+M6+M7)+ L0 视觉参考。辅助文件(M4+M8+M9)仅在 recipe 头部声明时读。

**完整模式**:读 recipe + 全部 M1-M9(含 M4+M8+M9 辅助)+ L0 视觉参考。

---

## §0 路由表(必读 · 第一屏)

按 brief 关键词匹配,只读 ✓ 列出的文件。**视频和图片走两套互不重叠的 library**。

### 0.1 视频路由(共享 1 份 library · 4 阶段编号)

所有视频 recipe **统一读同一份核心 library**(M1-M9 共 9 个,按 **创意 → 执行 → 检查** 顺序编号;M10 交付层在提交阶段按需)。各 recipe 自身独有的额外文件(A1-A3)由 recipe 头部"与其他文件关系"声明,不再写在路由表里。

**视频 library 分层**:核心 6 个(M1+M5+M2+M3+M6+M7)必读;辅助 3 个(M4+M8+M9)由 recipe 头部声明后按需加载,默认不读。

**视频核心 library · M1-M9**(核心 6 个必读 + 辅助 3 个按需):

```
M1 creative-method · M5 director-presets · M2 character · M3 scene · M4 cinematography
· M6 audio · M9 drift-prevention · M7 prompt-craft · M8 media-rules
```

**视频交付层 · M10**(提交阶段按需):

```
M10 delivery · Provider 参数 + 调用流程 + 结果验证
```

**视频按需辅助 · A1-A3**(由 recipe 头部声明):

```
A1 subtitle · A2 multimodal-syntax · A3 emotional-levers
```

| brief 关键词                                                        | recipe                                       | 额外文件(由 recipe 声明)                        | examples                                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 风景/动物/宠物/治愈/慢生活/自然纪录片/山水/风光/野外/田园           | [nature](references/recipes/nature.md)       | A1(若 OS 解说)· A2(若有参考图)                  | [nature-fog-forest](examples/nature-fog-forest.md) · [nature-pet](examples/nature-pet.md)               |
| 早安/咖啡/家居/阅读/旅行/节日/仪式感/圣诞/新年/生日/vlog            | [lifestyle](references/recipes/lifestyle.md) | A1(若 OS)· A2(若有参考图)                       | [lifestyle-coffee](examples/lifestyle-coffee.md) · [lifestyle-festival](examples/lifestyle-festival.md) |
| 杂志/街拍/美妆展示/古风/国风/人像/穿搭/时尚/模特                    | [portrait](references/recipes/portrait.md)   | A2(若参考图)· A3(若商用)· A1                    | [portrait-magazine](examples/portrait-magazine.md) · [portrait-ancient](examples/portrait-ancient.md)   |
| 烹饪/成品/摆盘/拉花/饮品/鲜食/ASMR/食欲/食物                        | [food](references/recipes/food.md)           | A2(若有参考图)                                  | [food-cooking](examples/food-cooking.md) · [food-asmr](examples/food-asmr.md)                           |
| **美妆/服饰/家居/数码/母婴/带货/转化/测评/开箱/卖点/价格/通用产品** | [commerce](references/recipes/commerce.md)   | **A1(必)** · **A3(必)** · A2 · M4(若需具体焦段) | [commerce-phone](examples/commerce-phone.md) · [commerce-beauty](examples/commerce-beauty.md)           |

> **路由匹配规则**:
>
> - 一个 brief **命中多个关键词** → 取最强信号(如 "美食带货" 优先 commerce,"宠物圣诞" 优先 lifestyle)
> - **命中 0 个** → 走 §0.3 兜底

### 0.2 图片路由(独立 library 集)

图片走**专属 library**(I1-I2 共 2 个),不读视频的 M1-M9。

| brief 关键词                                          | library(必)                                                               | examples |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | -------- |
| 海报/广告 KV/封面/小红书/公众号/电商主图/品牌 VI/招贴 | I1                                                                        | I2       |
| 商业带货(图片路径)                                    | I1 + [commerce recipe](references/recipes/commerce.md) 头部声明的额外文件 | —        |
| 静物/产品摄影                                         | I1                                                                        | I2       |

> 图片路径**不读**视频 M1-M9。仅在"商业带货(图片)"分支读 commerce recipe。

### 0.3 视频兜底(未命中关键词时)

**触发条件**:brief 含视频/动态/分镜/t2v/图生视频 等信号,但 0.1 关键词全部未命中。

**兜底动作**:

1. **library**:读视频核心 library 全套(M1-M9)
2. **recipe**:读全部 5 个 recipe 头部 30 行(只读"板块共性"段,作为通用场景知识)
3. **路径**:默认走 `nature` 骨架 B(5-8 镜,慢节奏,无字幕,治愈)—— 视频兜底最稳的形态
4. **若 brief 含明确商业意图**(带货/转化/价格/卖点)→ 即便未命中关键词,优先按 commerce 处理

### 0.4 路径判定(决策一次,后续不切换)

| 情况                                              | 路径             | 动作                |
| ------------------------------------------------- | ---------------- | ------------------- |
| 已有任务(带 Provider + task.id)                   | 跳到 §3          | 查询/下载           |
| 已有素材,只需重排+字幕+BGM                        | 纯剪辑           | ffmpeg/剪映一次剪完 |
| 素材来自不同拍摄源需拼接                          | 纯剪辑           | ffmpeg 无缝拼接     |
| **需要 AI 新画面(表演/产品动态/场景/静图动态化)** | **纯生成(默认)** | 视频模型 + 字幕直出 |

判定一次,后续不再切换。生→剪→生 = 主体漂移 + 成本翻倍。

---

## §1 六条铁律(R1-R6)

> **铁律本身是抽象的,具体落点由对应 recipe + library 负责**。不内联文件路径,避免交叉引用混乱。

| #      | 铁律                      | 含义(一行)                                                                  |
| ------ | ------------------------- | --------------------------------------------------------------------------- |
| **R1** | **一次判定,一路走到底**   | 开头判定"纯剪辑"还是"纯生成",后续不切换                                     |
| **R2** | **故事驱动,而非清单罗列** | 把参数装进骨架 A/B/C,叙事方式交付,1 段 ≤ 1-3 个关键点                       |
| **R3** | **视听双轨**              | ① 字幕可选(若画面承载 70% 信息可省);② 三层音频(人声·环境音·BGM)必须全部设计 |
| **R4** | **7 秒前回收钩子**        | 视觉爆发或情绪爆发,二选一;7 秒后完播率下降                                  |
| **R5** | **零错字、品牌名逐字**    | 品牌名/型号/成分名逐字核对,用户给了官方拼写必须原样使用                     |
| **R6** | **事件逻辑自洽**          | 场景/动作/时间/天气/服装必须相互一致                                        |

> 铁律落点由 recipe 自己声明(每个 recipe 顶部"与其他文件关系" + 各小节约束)。不重复引用文件路径,避免与 recipe 自身引用链缠绕。

---

## §2 5 步工作流(创意 → 执行 → 检查 → 交付)

```
① 路由(§0) → ② 写故事 → ③ 定人物 → ④ 定场景 → ⑤ 写脚本 → ⑥ 评审+提交
匹配 1 recipe     骨架+镜头  角色四层  场景三层   八要素+侧车  M8 过审 → M10 交付
+ 共享 library    1:1 对应   i2v绑定   3+1 环境   Final Prompt  Provider 提交
                                                                 结果下载验证
```

### 2.1 视频步骤

| Step     | 内容                                         | 必过项                                                                                     | 主文档      |
| -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| 0 路由   | 读 §0 路由表,命中 1 recipe + 共享 library 集 | brief 关键词命中 1 类;commerce 必带 A1                                                     | 本文件 §0   |
| 1 写故事 | 骨架(A/B/C) + 主题母体 + 镜头结构            | 骨架选定 + 主题一句话可讲清 + 镜头 1:1 对应(无主动合并) + 事件逻辑 4 问全过                | recipe 内置 |
| 2 定人物 | 角色四层(身份/外貌/服装/气质)                | 四层齐全 + 关键特征锁定 + 人物-事件一致性全过                                              | M2          |
| 3 定场景 | 场景三层 + 时间/天气/光线 + 风格锚           | 场景三层齐全 + 单一光源 + 风格锚 1 个 + 场景内部一致性全过                                 | M3          |
| 4 写脚本 | Final Prompt(执行层)                         | 八要素齐全 + 1:1 镜号对应 + 14 镜头库术语选对 + 5 铁律同步遵守 + Negative Prompt(若必填档) | M7          |
| 5 提交   | 评审过门 + Provider 提交 + 收尾              | 模型/格式/规则自检(M1-M6 + Provider + 侧车结构 + 1:1 镜号),不复看创意;提交流程见 M10       | M8 + M10    |

### 2.2 图片步骤

图片无时间轴,合并"写故事+定人物+定场景"为"写 brief"一步。

| Step       | 内容                             | 必过项                                                                        | 主文档    |
| ---------- | -------------------------------- | ----------------------------------------------------------------------------- | --------- |
| 0 路由     | 读 §0.2 路由表                   | 命中图片路径                                                                  | 本文件 §0 |
| 1 写 brief | 主体 + 场景 + 构图 + 风格 + 文字 | 五段短句齐全(场景/主体/风格总纲/配色/文字) + 硬约束(安全边距/艺术字/同源媒介) | I1        |
| 2 自检     | 五段检查 + 反模式                | 主标不被裁/艺术字带材质/文字不贴边/同源媒介                                   | I1        |

### 2.3 反例快速对照

| 步骤          | 反例检查                                                     |
| ------------- | ------------------------------------------------------------ |
| step 1 写故事 | 5 维组合不出现反例(场景/时间/天气/服装/动作)                 |
| step 2 定人物 | 服装-场景匹配;身份-动作匹配;气质-情绪匹配;年龄-场景安全性    |
| step 3 定场景 | 场景类型内部一致;时代-光线匹配;天气-场景匹配;风格锚-场景匹配 |
| step 4 写脚本 | Final Prompt 继承前 3 步的 R6 结论,不漂移                    |
| 评审过审      | **不复看 R6**——只检模型/格式/规则                            |

---

## §3 输出格式与提交

### 3.1 视频输出文件

1. **分镜表格**(必填):每镜一行,见 recipe 内的分镜模板
2. **`<name>.video-brief.md`**(创意文档):含 brief / 分镜表 / Final Prompt(执行层)
3. **侧车字段**:进 `core/orchestrator.cjs` 解析;**音频进 prompt 正文 ★ Audio 段(语义化,无数字) + 侧车 §4 声场设计稿 保留数字完整版**;**字幕仍不进 prompt**,进侧车 Inputs/Notes

> - **Negative Prompt**:进 §3 `Final Prompt` 内的 `Negative constraints:` 块;commerce/人像/品牌必填

完整可工作的示例见 [examples/](examples/),从骨架 A/B/ASMR/commerce 5 类各取典型——**默认入口** [examples/nature-fog-forest.md](examples/nature-fog-forest.md)(骨架 B 完整填好示范)。

### 3.2 图片输出文件

`<filename>.image-brief.md` 文档,含 brief / 五段 / Final Prompt(执行层)。参考 [I2](references/image/I2-image-example.md)。

### 3.3 提交前校验(自检)

- 视频侧车 `Action` 与 `Camera language` 段按 §2 表格镜号 1:1 对应、**不主动合并相邻镜头**
- 视频侧车字段在 [core/provider-contract.md](core/provider-contract.md) §2 表格中,**不**直接 `image` 字段复用
- 提交前自检 M1-M6 + Provider 速查表

### 3.4 提交命令

```bash
# 通过 core/orchestrator.cjs 提交
node core/orchestrator.cjs submit <name>.video-brief.md

# 查询/下载
node core/orchestrator.cjs status <task_id>
node core/orchestrator.cjs download <task_id> --out ./out/
```

详见 [core/orchestrator.cjs](core/orchestrator.cjs) 与 [core/provider-contract.md](core/provider-contract.md)。

---

### 3.5 输出交付约束(硬性)

> 每次任务结束后,**必须提供以下两项**,缺一不可:

1. **生成的媒体产物**(image / video 文件):确保文件已生成并可访问。
2. **`<name>.brief.md`**(创意文档):含 brief / 分镜 / Final Prompt,附带媒体产物的**可预览或可下载链接**。优先使用可预览链接(如 Markdown 图片/视频嵌入),其次才是纯下载链接。

> 不可仅交付文本描述而不提供实际产物文件或链接。

---

## §4 视频 reference 体系(命中 §0.1 后按需读)

视频的所有 reference 集中在本节。**先看 §4.0 编号索引**定位要读哪几个文件,再按编号打开。

### 4.0 编号索引(快速定位)

> 编号按 **创意 → 执行 → 检查 → 交付** 排序:M1+M5 导演(主方法论 + 风格预设)· M2 选角(角色)· M3 美术(场景)· M4 摄影(镜头词典)· M6 录音(音频)· M9 场记(漂移预防)· M7 剪辑(Prompt 拼接)· M8 检查(模型能力)· M10 交付(Provider + 提交流程)。A1-A3 为按需辅助。

| 编号      | 文件                                                                                                                                                                                                                 | 何时读                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **M1**    | [M1-methodology.md](references/library/M1-methodology.md)                                                                                                                                                            | 导演·创意方法论:路径判定+骨架+镜头结构+侧车                                                                   |
| L0        | [L0-lookbook.md](references/library/L0-lookbook.md)                                                                                                                                                                  | 视觉参考速配(6 核心×4 维),替代 M4+M5+M6 大部                                                                  |
| **M2**    | [M2-director-presets.md](references/library/M2-director-presets.md)                                                                                                                                                  | 导演·8 风格预设 P1-P8,一键套用                                                                                |
| M3        | [M3-character.md](references/library/M3-character.md)                                                                                                                                                                | 选角·角色四层 + 人物-事件一致性                                                                               |
| M4        | [M4-scene.md](references/library/M4-scene.md)                                                                                                                                                                        | 美术·场景三层 + 展示/执行层分离                                                                               |
| M5        | [M5-cinematography.md](references/library/M5-cinematography.md)                                                                                                                                                      | 摄影·景别/光影/焦段 词典 [AUXILIARY]                                                                          |
| M6        | [M6-audio.md](references/library/M6-audio.md)                                                                                                                                                                        | 录音·音频三层 + 5 杠杆 + 静音                                                                                 |
| M7        | [M7-drift-prevention.md](references/library/M7-drift-prevention.md)                                                                                                                                                  | 场记·4 类漂移 + 5 招实战 [AUXILIARY]                                                                          |
| M8        | [M8-prompt-craft.md](references/library/M8-prompt-craft.md)                                                                                                                                                          | 剪辑·八要素 + 14 镜头库 + Final Prompt 拼接                                                                   |
| M9        | [M9-media-rules.md](references/library/M9-media-rules.md)                                                                                                                                                            | M1-M6 模型能力 + 提交前自检清单 [AUXILIARY]                                                                   |
| M10       | [M10-delivery.md](references/library/M10-delivery.md)                                                                                                                                                                | 交付·Provider 参数 + 调用流程 + 结果验证                                                                      |
| A1        | [A1-subtitle.md](references/library/A1-subtitle.md)                                                                                                                                                                  | commerce(必)/人像/口语视频                                                                                    |
| A2        | [A2-multimodal-syntax.md](references/library/A2-multimodal-syntax.md)                                                                                                                                                | brief 含参考图/视频/音频                                                                                      |
| A3        | [A3-emotional-levers.md](references/library/A3-emotional-levers.md)                                                                                                                                                  | commerce(必)/转化类视频                                                                                       |
| recipes   | [nature](references/recipes/nature.md) · [lifestyle](references/recipes/lifestyle.md) · [portrait](references/recipes/portrait.md) · [food](references/recipes/food.md) · [commerce](references/recipes/commerce.md) | 命中 §0.1 后只读 1 个                                                                                         |
| templates | [3-sets.md](references/templates/3-sets.md)                                                                                                                                                                          | 简单需求直接套 prompt 模板                                                                                    |
| examples  | [examples/](examples/)                                                                                                                                                                                               | L5 分层策略:每例顶部标 [MUST-KEEP] / [CAN-ROTATE];默认入口 [nature-fog-forest](examples/nature-fog-forest.md) |

> **数量策略**:每 recipe 保留 **2 个典型 example**,anchor 互斥或跨度大;其他 anchor 由 recipe §1.5 调色板驱动,AI 自主生成。**17 → 10,降载 41%**。

### 4.1 视频场景速配表(12 类 × 4 维)

> §0.1 路由表告诉你"是哪个 recipe" → **本表**(执行层速配)告诉你"这个场景用哪个运镜+光影+钩子"。完整 prompt 模板 → [4.2 templates](#42-templates视频即用模板按需)

| 场景类型      | 推荐运镜                    | 推荐光影            | 风格锚                          | 警示                  |
| ------------- | --------------------------- | ------------------- | ------------------------------- | --------------------- |
| **人物特写**  | Intimate Dolly In           | 柔光                | 治愈清新 / 杂志风               | 主体占画面 80%+       |
| **产品展示**  | Subtle Orbit (45°弧)        | 纯色背景 + 三点光   | 商业 / 极简                     | 数字产品避"虚化背景"  |
| **城市夜景**  | Dutch Angle Pan             | 霓虹光污染          | 赛博朋克 / 黑紫橙               | 避免过曝              |
| **梦境片段**  | Dolly Zoom                  | 高斯模糊            | 迷幻 / 超现实                   | 慎用,易致观感晕       |
| **自然/治愈** | Lateral Tracking + Pull-out | 侧逆光 + 拉镜收尾   | BBC Earth / National Geographic | 禁用手持抖动          |
| **武侠/国风** | Smooth Dolly Forward        | 柔光逆光            | 武侠电影感                      | 冷暖对比强烈          |
| **街头纪实**  | Handheld Style              | 现场光              | 真实 / 躁动                     | 治愈系禁用            |
| **美食 ASMR** | Macro + 顶光                | 暖食欲光 + 蒸汽粒子 | 暖食欲 / ASMR                   | 声音-视觉同源         |
| **宠物治愈**  | Low-angle + 跟拍            | 窗光                | 暖民谣 / Vlog感                 | 自然互动,避免拟人     |
| **抽象艺术**  | Time-lapse                  | 超广角 + 强逆光     | 史诗 / 哲理                     | t2v 支持有限,优先短段 |
| **风光转场**  | Slow pan / Crane            | 黄金时刻            | 治愈 / 电影感                   | 竖屏避极远景          |
| **古风舞剑**  | Dolly forward + Slow pan    | 逆光薄雾            | 武侠电影感                      | 慢动作+冷光剑         |

**用法**:

1. §0.1 路由表确定"是哪个 recipe"
2. 本表第 1 列找到对应"场景类型"行 → 直接抄"运镜+光影+风格锚"到 prompt
3. 配 [M2-director-presets.md](references/library/M2-director-presets.md) 的 P1-P8 一键套用

### 4.2 钩子速查(前 3 秒防流失)

| 钩子类型     | 写法                                                                            | 适用      |
| ------------ | ------------------------------------------------------------------------------- | --------- |
| **运动钩子** | `the [subject] trots in from the distance` / `camera slowly pushes in`          | 通用      |
| **光影钩子** | `backlight silhouette` / `volumetric light beams` / `light shafts through mist` | 治愈/氛围 |
| **动作钩子** | `suddenly breaks into a gallop` / `leaps up` / `shakes head`                    | 动物/运动 |
| **表情钩子** | `close-up of [subject] tilting head` / `gazing at camera`                       | 人像/宠物 |
| **悬念钩子** | `starts with a close-up of [detail], then reveals the full scene`               | 叙事      |

> 声音钩子**进 prompt** `★ Audio` 段(语义化,无 BPM/dB)。
> 钩子时间锚点必须落在 0.0-Xs 第 1 镜(1:1 镜号对应)。

---

## §5 图片 reference 体系(命中 §0.2 后按需读)

图片独立于视频,只读 I1-I2。

| 编号 | 文件                                                                | 何时读                                  |
| ---- | ------------------------------------------------------------------- | --------------------------------------- |
| I1   | [I1-image-methodology.md](references/image/I1-image-methodology.md) | 图片方法论入口(创意层 + 风格层 2 文件)  |
| I2   | [I2-image-example.md](references/image/I2-image-example.md)         | 图片实例(产品图 + 海报拼贴完整填好示范) |
