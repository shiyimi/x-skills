# Scene · 场景与执行层降级

> 本文件是 **5 步流程的 step 3 · 定场景** 的主文档。负责场景三层写法、展示层/执行层降级、竖屏约束、场景内部一致性检查。
>
> **何时用**: step 2(定人物)完成后,本步确定"在哪演、什么光、什么时间、什么天气";Final Prompt 的 `Scene` 段按本文件输出。
>
> **不负责**: 角色四层([character.md](character.md))、动作与镜头语言([prompt-craft.md](prompt-craft.md))、模型能力与 Provider 参数([media-rules.md](media-rules.md))。

---

## §1 场景三层结构(定景)

```
[场景类型] + [时代/风格修饰] + [环境细节] + [光线/天气]
```

| 层级 | 实例 |
| --- | --- |
| 第一层 场景类型 | "街头 / 酒吧 / 海边 / 林间 / meadow / 车间 / 厨房" |
| 第二层 时代/风格修饰 | "赛博朋克风格的街道" / "early-morning countryside style" / "现代工业风车间" |
| 第三层 环境细节 | "墙角堆着几个纸箱" / "dew-drenched clover, pink wildflowers, thin drifting mist" |
| 第四层 光线/天气 | "黄昏 / 晨雾 / 雨水" / "soft golden sunrise backlight, gentle wind" |

**重要**: 四层缺一不可,缺第三层 → 画面空洞,缺第四层 → 模型默认给漫反射平光 = 廉价 3D 感。

---

## §2 展示层 vs 执行层降级表

分镜表(展示层)记录人可理解的具体数字;**prompt(执行层)用 t2v 模型能理解的语义化描述**。两层不可混用——混用 = 数字变噪声(M4,见 [media-rules.md](media-rules.md))。

| 字段 | 展示层(分镜表,人读) | 执行层(prompt,模型读) |
| --- | --- | --- |
| 色温 | 4500K | `soft golden morning backlight` / `cool blue hour diffused light` |
| 光比 | 3:1 | 删除,模型不理解数字光比;用光源方向替代: `rim/backlight with soft sky fill` |
| 光质 | 柔光 / 硬光 | `soft diffused light` / `hard direct light` |
| 光位 | 45°侧光 / 150°逆光 | `side light from the left` / `backlight from behind` |
| 饱和度 | 饱和度+10 | 删除;用风格标签替代: `vibrant colors` / `muted tones` |
| 焦段 | 16mm-85mm | 作为风格参考保留: `shot on ARRI Alexa with shallow depth of field` |
| 时间/天气 | 黄昏/雨/雪 | `soft golden hour backlight` / `overcast misty daylight` / `snow with overcast sky` |

### 2.1 降级规则速查

1. **K 值 → 光源描述**: 4500K → `soft golden morning light`; 6500K → `cool overcast daylight`; 3200K → `warm golden hour glow`
2. **光比 → 光源方向**: 光比大 → 强调单一主光源方向;光比小 → `soft diffused fill from all directions`
3. **饱和度 → 删除**: 模型不理解数字,用风格标签
4. **焦段 → 摄影机/风格标签**: `shot on ARRI Alexa` / `shot on 16mm Bolex` / `shot on iPhone`

### 2.2 不在降级表的字段(保持原样)

| 字段 | 原因 |
| --- | --- |
| 物种月龄 | 模型理解年龄描述,`a 6-month-old ... foal` 有效 |
| 主体外观特征 | 颜色/品种模型都能执行 |
| 风格标签 | `BBC Earth` / `cinematic` / `healing fresh` 都在训练语料中 |

---

## §3 单一光源原则

Final Prompt 中**整段只写一次光源**,不每镜重写。

| 写法 | 含义 |
| --- | --- |
| `single light source — low golden morning sun behind the subject, soft fill from the sky` | 推荐,信息全 |
| `volumetric morning backlight` | 简写,够用 |
| `soft directional lighting` | 保底,光位模糊但有方向 |
| `room with mixed ambient lighting`(不推荐) | 多光源=模型随机混,反不如单一 |

---

## §4 竖屏特有约束(9:16)

竖屏 9:16 与横屏 16:9 模型行为不同,**默认竖屏**(见 [SKILL.md §1.1](../../SKILL.md)):

| 约束 | 原因 | 修复 |
| --- | --- | --- |
| 避极远景 + 远山 | 竖屏纵向压缩,远景信息密度不够 | 改中远景起步,远景只用于收尾 |
| 主体必须居中或三分线下 | 竖屏横向空间少,偏移=出画 | 显式写 `subject centered` / `subject on lower-third line` |
| 前景虚焦必写 | 竖屏无前景=扁平 | 每段写 `with foreground blurred [具体物体]` |
| 运镜少用大范围横摇 | 竖屏横向窄,大范围 pan 画面空洞 | 用 dolly-in/out 替代 |

---

## §5 风格锚(整片一个)

每个镜头绑定 1 个明确风格标签,**整段只锚 1 个**,不要风格混搭:

| 层级 | 示例 | 效果 |
| --- | --- | --- |
| 抽象 | "好看" / "震撼" | 模型自由发挥,不可取 |
| 中等 | "治愈清新" / "赛博朋克" | 风格基本对 |
| 具体 | "BBC Earth + ARRI Alexa" | 质感锁定 |
| 影视级 | "in the spirit of BBC Earth, shot on ARRI Alexa with shallow depth of field" | 锁定度最高 |

**风格锚与场景三层的接口**: 风格锚写在 Final Prompt 末尾 `★ Style anchor:` 段,场景三层写在 `★ Scene` 段;两者协同,不要把风格词塞进场景描述。

---

## §6 场景内部一致性检查(R6 在本步的应用)

**核心问题**: 场景三层填完后,检查场景类型/时代/细节/光线/天气彼此是否一致。**这是 R6 事件逻辑自洽在本步的具体执行**。

### 6.1 检查项

逐项回答,任一为否就回头改:

| # | 问题 | 反例 |
| --- | --- | --- |
| 1 | **场景类型内部一致吗?** | 沙漠里出现常绿阔叶林;海里有大型乔木 |
| 2 | **时代/季节与光线匹配吗?** | 黄昏 + 雪地;雪夜 + 短袖;冬季 + 雨林植被 |
| 3 | **天气与场景类型匹配吗?** | 露天无遮挡 + 雨天;室内 + "露天风" |
| 4 | **环境细节与场景类型匹配吗?** | 海边 + 雪山;厨房 + 沙发;车间 + 餐桌 |
| 5 | **风格锚与场景类型匹配吗?** | "治愈清新" + "赛博朋克"两种风格词混用 |

### 6.2 时间-天气-光线组合速查

| 时间 | 季节 | 推荐光线 | 不推荐 |
| --- | --- | --- | --- |
| 清晨 | 春/夏 | `soft golden morning backlight` | 强烈侧光(中午才出) |
| 清晨 | 冬 | `cold blue morning haze` | 暖金光(违反季节) |
| 黄昏 | 全年 | `warm golden hour backlight` | 冷色 |
| 夜晚 | 城市 | `neon fill + warm street lamp rim` | 自然光 |
| 夜晚 | 户外 | `moonlight + soft starlight fill` | 强光 |
| 雨天 | 全年 | `overcast diffused daylight` | 强直射阳光 |
| 雪天 | 全年 | `cool overcast + snow reflection` | 暖色主调 |

### 6.3 天气-场景冲突速查

| 场景类型 | 安全天气 | 需遮挡才安全的天气 |
| --- | --- | --- |
| 室内 | 任意 | 无 |
| 半露台/有顶棚 | 雨/雪(需挡风) | 大风 |
| 露天户外 | 晴/多云/阴 | 雨/雪(需加雨棚/伞/改室内) |
| 水边/海边 | 晴/多云 | 大风天(浪) |

---

## §7 反例(本步常见翻车点)

| 反例 | 错在哪 | 修正 |
| --- | --- | --- |
| 场景三层只写两层 | 模型自由发挥,出图不稳 | 完整 4 层都写,缺第三层=画面空洞,缺第四层=平光 |
| 在 prompt 里写"4500K" | M4 数字变噪声 | 降级为 `soft golden morning backlight` |
| 一段多个光源方向 | 模型随机混合 | 单一光源,显式写 `single light source — ...` |
| 风格锚写 2-3 个标签 | 风格漂移,质感混乱 | 整段 1 个风格锚 |
| 雪夜 + 短袖 + 露天 | 6.2 时间-季节-服装三重错 | 改"雪夜厚外套 + 路灯暖光",或改"夏夜短袖" |
| 海边场景 + 雪山背景 | 场景类型内部不一致 | 选海或雪,二选一 |

---

## §8 与其他文件的关系

| 文件 | 与本文件的关系 |
| --- | --- |
| [storyboard.md](storyboard.md) | §4 骨架决定场景的"基调"(A 展示 vs B 剧情 vs C 共情);§5.6 5 维矩阵的"场景/时间/天气"行 |
| [character.md](character.md) | 服装颜色决定光照反差;人物气质与场景情绪匹配 |
| [prompt-craft.md](prompt-craft.md) | §1 八要素 `场景` 段来自本文件;§1.2 风格锚与本文件 §5 风格锚一致 |
| [media-rules.md](media-rules.md) | M1-M6 模型能力边界,降级表的来源是 M4;Provider 关键参数不在本文件 |
| [example.md](example.md) | 完整 4 步流程的 step 3 实例参考 |
