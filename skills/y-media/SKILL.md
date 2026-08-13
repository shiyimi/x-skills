---
name: y-media
description: 生成或编辑图片、生成视频、使用 Agnes AI 或其他已注册媒体 Provider、消耗 Provider 免费配额、查询或恢复已有媒体任务、下载已生成媒体时使用。不适用于:纯文字 brief 无媒体产物 / 离线模型训练或微调场景。
---

# y-media · 媒体工作流

**打开本文件 → 按 §0 路由命中 recipe → 按 §1 铁律 + §2 工作流推进 → 生成阶段把质量写进 prompt(字幕/音频/背景直出)，不依赖后期补救**。

> **加载规则**:每个 brief 只读路由命中的 1 个 recipe + 共享 library。未命中不读。文件小、加载少，质量杠杆全在 prompt，不在流程。

---

## §0 路由(第一屏)

按 brief 关键词匹配，只读 ✓ 列出的文件。视频和图片走两套 library。

| brief 关键词 | 路径 | recipe / library |
| --- | --- | --- |
| 美妆/服饰/家居/数码/母婴/带货/转化/测评/开箱/卖点/价格/通用产品 | 视频 | [commerce](references/recipes/commerce.md) + 核心 library(M1·M2·M3·M5·M6·A1) |
| 风景/动物/宠物/治愈/慢生活/自然/田园 | 视频 | [nature](references/recipes/nature.md) + 核心 library |
| 咖啡/家居/阅读/旅行/节日/仪式感/圣诞/vlog | 视频 | [lifestyle](references/recipes/lifestyle.md) + 核心 library |
| 杂志/街拍/人像/古风/国风/穿搭/模特 | 视频 | [portrait](references/recipes/portrait.md) + 核心 library |
| 烹饪/成品/食物/鲜食/ASMR/食欲 | 视频 | [food](references/recipes/food.md) + 核心 library |
| 海报/广告KV/封面/小红书/公众号/电商主图/品牌VI | 图片 | [I1](references/image/I1-image-methodology.md) |

> **匹配规则**:命中多个关键词 → 取最强信号(如"美食带货"优先 commerce)。命中 0 个 → 默认走 `nature` 骨架 B(慢节奏治愈，视频最稳)。含明确商业意图(带货/价格/卖点)但未命中 → 按 commerce。

## §0.1 路径判定(决策一次，后续不切换)

| 情况 | 路径 | 动作 |
| --- | --- | --- |
| 已有任务(带 Provider + task.id) | 查询/下载 | 直接恢复 |
| 已有素材，重排+字幕+BGM | 纯剪辑 | ffmpeg/剪映一次剪完 |
| AI 新画面 · 人像/产品/多人/品牌(需外观保真) | **锚定生成(默认)** | 先出/指定锚定参考图 → image-to-video，锁定外观+环境 |
| AI 新画面 · 纯氛围/风景/抽象(无保真诉求) | 纯 t2v | 视频模型 + 字幕直出 |

判定一次，生→剪→生 = 主体漂移 + 成本翻倍。

---

## §1 铁律(R1-R6)

| # | 铁律 | 含义 |
| --- | --- | --- |
| R1 | 一次判定，一路走到底 | 开头判定剪辑/生成，后续不切换 |
| R2 | 单段顶格，一次到位 | 目标 15s 就 `duration=15`，多镜写同一条 prompt，不拆 3×5s |
| R3 | 视听双轨，字幕直出 | 字幕写进 prompt 让模型直出(不后期烧录)；三层音频(人声·环境音·BGM)全进 prompt |
| R4 | 7 秒前回收钩子 | 视觉或情绪爆点二选一，7 秒后完播率下降 |
| R5 | 零错字、品牌名逐字 | 品牌/型号/成分/数字逐字核对，官方拼写原样使用 |
| R6 | 事件逻辑自洽 | 场景/动作/时间/天气/服装相互一致(解剖/物理/连续性) |

---

## §2 工作流(创意 → 执行 → 交付)

```
① 路由(§0) → ② 写故事 → ③ 定人物 → ④ 定场景 → ⑤ 写脚本 → ⑥ 生成 → ⑦ 验证
命中 recipe     骨架+镜头  角色四层  场景3+1+i2v  八要素prompt   模型直出    质检门
+ 核心 library  1:1对应   i2v绑定   环境动态层    字幕/音频直出  锚定/顶格   抽帧人工审
```

| Step | 内容 | 必过项 | 主文档 |
| --- | --- | --- | --- |
| 0 路由 | 命中 1 recipe + 核心 library | 关键词命中 1 类 | SKILL §0 |
| 1 写故事 | 骨架(A/B) + 镜头结构 | 骨架选定 + 镜头 1:1 + 事件逻辑 4 问 | recipe |
| 2 定人物 | 角色四层(身份/外貌/服装/气质) | 四层齐全 + 关键特征锁定 | M2 |
| 3 定场景 | 场景 3+1 元素 + 动态层 + 风格锚 | 3 可辨识元素 + 1 光源 + 背景不空盒、不冻住 | M3 |
| 4 写脚本 | Final Prompt(执行层) | 八要素齐全 + 字幕直出 + 音频进 prompt + 单段顶格 | M6 |
| 5 生成 | 锚定 i2v 或 t2v，多镜一条 prompt 顶格 | 外观/环境锁定(i2v) + 字幕/音频直出 | SKILL §0.1 |
| 6 验证 | 质检门 | 客观校验(时长/宽高/帧率) + 抽帧人工审「违背常理」 | SKILL §3.4 |

---

## §3 输出与交付

### 3.1 视频输出文件

1. **分镜表格**(必填):每镜一行，见 recipe 内模板
2. **`<name>.video-brief.md`**(创意文档):brief / 分镜表 / Final Prompt / 字幕(直出文案) / 音频三层
3. **锚定参考图**:进 brief 的 references / image_paths，供 image-to-video 使用

> **字幕直出**:字幕文案写进 Final Prompt(见 M6 §字幕)，让模型直接渲染；不后期烧录。模型直出不稳时，才降级为 SRT 烧录(见 M6 §字幕降级)。
> **音频直出**:人声/环境音/BGM 三层语义化写进 prompt `★ Audio` 段，不写 BPM/dB 数字。

### 3.2 图片输出文件

`<filename>.image-brief.md`，含 brief / 五段 / Final Prompt。参考 [I2](references/image/I2-image-example.md)。

### 3.3 生成与提交

```bash
# 通过编排引擎提交(路径判定为锚定生成时先出参考图)
node core/orchestrator.cjs submit <name>.video-brief.md
node core/orchestrator.cjs status <task_id>
node core/orchestrator.cjs download <task_id> --out ./out/
```

生成阶段优先让模型**直出**字幕/音频/背景；编排引擎负责提交与取回，不负责画面质量。

### 3.4 质检门(验证成片)

下载后跑一遍客观校验 + 抽帧人工审，决定接受/重生成：

| 检查 | 方法 | 不达标时 |
| --- | --- | --- |
| 时长/宽高/帧率 | ffprobe 客观校验 | 参数不符 → 重生成 |
| 文件完整性 | 存在 + 大小 > 0 + 是 mp4 | 异常 → 重提任务 |
| 违背常理(解剖/物理/连续性) | 抽逐秒帧人工审 | 漂移 → 修正后重生成 |

只有客观校验通过 + 人工审帧无问题才接受(R6 兜底)。

> 能力缺口不伪造:本机缺 ffmpeg/ffprobe 时如实报告并给降级路径，不从文件名/默认值推断。

---

## §4 视频 reference 体系

| 编号 | 文件 | 何时读 |
| --- | --- | --- |
| M1 | [M1-methodology.md](references/library/M1-methodology.md) | 制片+导演 · 路径+骨架+镜头结构+制片决策 |
| M2 | [M2-character.md](references/library/M2-character.md) | 选角·角色四层 |
| M3 | [M3-scene.md](references/library/M3-scene.md) | 美术·场景3+1+动态层 |
| M4 | [M4-cinematography.md](references/library/M4-cinematography.md) | 摄影 · 景别+机位+运镜+构图 |
| M5 | [M5-audio.md](references/library/M5-audio.md) | 录音·音频三层(进prompt) |
| M6 | [M6-prompt-craft.md](references/library/M6-prompt-craft.md) | 剪辑 · 八要素+套用模板+prompt拼接 |
| A1 | [A1-subtitle.md](references/library/A1-subtitle.md) | 字幕·直出文案+降级烧录 |
| recipes | [commerce](references/recipes/commerce.md) · [nature](references/recipes/nature.md) · [lifestyle](references/recipes/lifestyle.md) · [portrait](references/recipes/portrait.md) · [food](references/recipes/food.md) | 命中 §0 后只读 1 个 |
| examples | [examples/](examples/) | 默认入口 [nature-fog-forest](examples/nature-fog-forest.md)(骨架 B 完整示范) |

---

## §5 图片 reference 体系

图片独立于视频，只读 I1-I2。

| 编号 | 文件 | 何时读 |
| --- | --- | --- |
| I1 | [I1-image-methodology.md](references/image/I1-image-methodology.md) | 图片方法论 |
| I2 | [I2-image-example.md](references/image/I2-image-example.md) | 图片实例 |