# Negative Prompt Methodology — 视频路径

> 本文件定义 `<name>.video-brief.md` 侧车里 **Negative Prompt 字段** 的填写方法。规则在 [storyboard-methodology.md](storyboard-methodology.md) 与 [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md);`negative_prompt` 在 [influence-factors.md](../../influence-factors.md) F9 的旧定义是"写在主 prompt 里的负向约束",**本文件定义的是它的孪生概念**——作为独立字段透传到 Provider 的 `parameters.negative_prompt`。
>
> **作用域**:仅 video capability(`text-to-video` / `image-to-video` / `keyframes-to-video`)。image capability 不独立维护 Negative Prompt 字段,见 [image-methodology.md §A](../image/image-methodology.md) 的图像侧声明。

---

## 1. 为什么是孪生字段而不是重复

`negative_prompt` 与"主 prompt 末尾的约束焊死"指向同一类意图(避免模型产生已知缺陷),但分工不同:

| 字段 | 作用层 | 模型行为 | 适用内容 |
| --- | --- | --- | --- |
| **主 prompt 末尾的 Hard Constraints** | 引导"该是什么" | 影响整体生成方向,与正向描述一起被加权 | 主体身份/风格/构图相关的负向(如"no text, no logo, no watermark") |
| **`negative_prompt` 独立字段** | 显式抑制"不该出现" | 模型以更高权重远离这些 token | 通用退化/缺陷/高频失败模式(如模糊、变形、水印、闪烁) |

**判断口诀**:主 prompt 末尾焊死的是"这张图/这段视频不该出现什么具体元素";`negative_prompt` 写的是"任何视频都要避免的通用病"。前者随主题变,后者基本是常量。

---

## 2. 何时该填这个字段

按 `negative_prompt` 的边际收益判断,分三档:

| 档位 | 触发条件 | 是否必填 | 理由 |
| --- | --- | --- | --- |
| **必填** | commerce 视频 / 人像视频 / 品牌露出 / 涉及人物动作 | 是 | 退化与人物变形是高频失败模式,独立字段抑制率显著高于主 prompt 拼接 |
| **推荐填** | 含文字/字幕预期 / 商业 logo / 多个产品 SKU 入境 | 是 | 文字错乱与品牌污染在主 prompt 末尾焊死的成功率不稳定,独立字段更可靠 |
| **可选** | 风景/自然/动物(无品牌 / 无人脸) | 可不填 | 模型默认退化较少;若主 prompt 已含完整 Hard Constraints,可省 |

> **不要为了"显得专业"硬填一份与主 prompt 重复的负面词**。重复 = 噪声,稀释主 prompt 的正向权重,得不偿失。

---

## 3. 字段在侧车里的位置与命名

`negative_prompt` 是侧车里 **与 Final Prompt 平级** 的独立字段,不嵌入 Final Prompt 块内。侧车结构示意:

```text
# <name>.video-brief.md

## 1. 视频主要目标
...

## 2. 分镜表格
...

## 3. Final Prompt
[完整的八要素 + 约束焊死块]

## 4. Negative Prompt   ← 本文件定义的内容
[独立填写,见 §4]

## 5. Inputs
...
```

> **空字段处理**:若本档为"可选"且判断不必填,在字段下写一行 `— (本视频无需独立 negative_prompt,见 negative-prompt-methodology.md §2)`,而不是删掉字段。删字段会让侧车结构与其他 brief 不一致,影响后续模板解析。

---

## 4. 内容来源与拆分原则

不要凭空写负面词。按以下三源拼装,确保每一项都有明确意图:

| 来源 | 适用 | 写法 |
| --- | --- | --- |
| **通用退化**(几乎所有视频都要) | 模糊、低分辨率、闪烁、抖动、压缩痕迹、过度饱和、卡通化 | 必加,见 §5 |
| **主题专属** | 人物 → 变形/多指/多肢;商业 → 错字/虚构 logo/虚构价格;风景 → 城市污染/电线;美食 → 苍蝇/塑料感 | 按 brief 主题加 |
| **场景专属** | i2v → 主体突变/参考图漂移;kf2v → 起止帧不连贯;长镜头 → 镜头漂移 | 按 capability 加 |

> **与 Hard Constraints 的去重**:若某条负面已经在主 prompt 末尾焊死(如"no text, no logo"),**不要在 `negative_prompt` 里再写一遍**。重复 = 噪声。

---

## 5. 通用退化基线(只列类型,不给具体词表)

> 本文件按设计**不预写词表**。`negative_prompt` 的具体词取决于模型版本、Provider 接口规范与目标语种;模型升级时旧的负面词可能反过来损伤画质(例如"low quality"在某些 v2 模型上反而降低整体清晰度)。每次新模型上线时,由运行 §6 的自检流程决定具体词。

通用退化基线**应该覆盖的负面类型**:

- 画质退化(模糊 / 压缩 / 噪点 / 过锐)
- 时间退化(闪烁 / 抖动 / 跳帧 / 镜头漂移)
- 解剖退化(人物/动物的肢体异常)
- 语义污染(虚构文字 / 虚构品牌 / 虚构标签)
- 美学污染(过度 AI 感 / 3D 渲染塑料感 / 色彩过艳)

具体词汇由 Skill 在每次新 Provider / 新模型接入时按官方负面词库与实际生成失败样本决定,**不沉淀到本文件**。

---

## 6. 提交前自检

逐条回答,任一为否就回头改:

- [ ] **必要性**:本档是否真的需要填?(§2)
- [ ] **去重**:与主 prompt 末尾的 Hard Constraints 没有重复 token?
- [ ] **类型覆盖**:画质 / 时间 / 解剖 / 语义 / 美学 五类负面是否都至少有一条?(除非有理由排除)
- [ ] **可执行**:每条都是可被模型理解的 token,不是"高级感要好"这种抽象词?
- [ ] **与 capability 对齐**:i2v / kf2v 加了对应的参考图相关负面?
- [ ] **没有删除字段**:判断为"无需填"时写 `—` 占位,而不是删字段

---

## 7. 与其他文件的关系

| 文件 | 与本文件的关系 |
| --- | --- |
| [influence-factors.md](../../influence-factors.md) F9 | F9 定义"主 prompt 末尾的负面约束"语义;本文件定义"独立 `negative_prompt` 字段"语义。两者互补,不是替代 |
| [pitfalls-and-iron-rules.md](pitfalls-and-iron-rules.md) §2.3 | 5 铁律之"约束焊死"是 F9 的执行版;本文件不重写它,只把可以独立出去的 token 抽出到 `negative_prompt` |
| [prompt-structure-formula.md](prompt-structure-formula.md) §9 拼接模板 | 拼接模板里 Hard Constraints 块保持原样,不变;`negative_prompt` 作为新独立字段附在 Final Prompt 之后 |
| [../image/image-methodology.md](../image/image-methodology.md) §A | 图像路径不独立维护 Negative Prompt;本文件不适用,不要把视频的负面词表照搬到 image-brief |

---

## 8. 反模式

| 反模式 | 症状 | 修复 |
| --- | --- | --- |
| 抄一份与主 prompt 重复的负面词 | 主 prompt 正向权重被稀释,画质下降 | §6 去重自检 |
| 把所有负面词都塞进 `negative_prompt` 不写 Hard Constraints | 模型不抑制与主题强相关的元素(品牌/字幕/具体道具) | Hard Constraints 写"主题相关"的负面,`negative_prompt` 写"通用退化" |
| 抄一份 Stable Diffusion 经典负面词 | 部分词与当前模型语义不匹配(甚至反向生效) | §5 不预写词表;新模型上线时再校准 |
| 字段位置嵌入 Final Prompt 块内 | 侧车结构不统一,模板解析失败 | §3 字段平级独立 |
| commerce 视频不填 | 错字/虚构 logo 频发 | §2 commerce 必填 |
