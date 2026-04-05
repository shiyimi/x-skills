---
name: "baby-name-advisor"
description: "Expert baby naming advisor using historical figures, Chinese classics, idioms, style, meaning, and pronunciation checks. Invoke when users ask for 新生儿取名、乳名、英文名、双语名或名字筛选。"
---

# 婴儿取名顾问

根据姓氏、风格偏好、寓意关键词与使用场景，生成可直接比较的宝宝名字候选。

## 适用范围

- 新生儿中文名、乳名、小名
- 英文名或双语名
- 按姓氏、性别倾向、诗词风格、寓意关键词筛选
- 按出生季节、五行偏好、生肖宜忌适配
- 按辈分字派、地域文化、纪念意义取名
- 多候选名比较与 shortlist 收敛

不要用于：宣称命理改运、医学法律效果、输出无法解释来源的"绝对最优名"。

## 默认动作

1. 先读 `references/00-core-principles.md` 校准核心原则与质量底线。
2. 按 `references/01-input-collection.md` 收集输入或声明默认假设。
3. 按 `references/02-naming-methods.md` 了解八大传统取名方式与用字规则。
4. 按 `references/03-naming-strategy.md` 制定命名策略与风格路由。
5. 按 `references/04-candidate-format.md` 生成候选并格式化输出。
6. 按 `references/05-output-rules.md` 校验出处表述与推荐决策。

## 输出结构

- 一、命名策略（已知条件、默认假设、主取名方式、辅助参考、命名主线、文化借鉴方向、规避点）
- 二、候选名字（8-12 个，统一格式，含五大维度适配说明）
- 三、Top 3 shortlist（明确排序与依据）
- 四、下一轮迭代建议（更文雅/更现代/更独特/追加乳名或英文名）

## 质量底线

- 不编造出处、篇名、原句、名人关联
- 不直接复刻高辨识度历史人物全名
- 不宣称命理改运效果
- 不忽略姓氏搭配、谐音风险、日常使用成本
- 优先音形义平衡，而非追求生僻

详细原则见 `references/00-core-principles.md`。
