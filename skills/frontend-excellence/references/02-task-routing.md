# 任务路由

在行动之前先判断任务属于哪一种前端工作模式。

正确的路由不是形式主义，而是为了避免用错误标准处理任务。例如，把结构问题误判成性能问题，把重构问题误判成普通实现问题，都会直接拉低结果质量。

## 主路由规则

每个前端任务都必须先归入一个主模式：

- 实现
- 重构
- 评审
- 调试
- 性能优化
- UI / 交互打磨
- 架构 / 方案

如果任务横跨多个方面，选择最能代表主交付物的模式，其他方面作为次级关注点。除非主交付物发生变化，否则不要轻易切换主模式。

## 核心层必读

任何前端任务都先读：

- `references/00-core-principles.md`
- `references/01-quality-gates.md`
- `references/02-task-routing.md`
- `references/03-simplification-discipline.md`

这四份文件不是可选项。

## 模式一：实现

当主交付物是新增或修改前端行为时，使用此模式。

典型触发语句：

- 做一个页面
- 新增组件
- 接入一个交互流程
- 绑定表单行为
- 把 UI 接到数据流上

进入实现模式前，先判断：

- 当前结构是否稳定到足以继续扩展
- 是否需要先做局部简化再继续实现
- 状态、渲染与副作用分别归谁负责

通常追加读取：

- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/13-accessibility-interaction.md`
- `references/14-styling-visual-quality.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

不要把“实现”理解成“可以无视结构直接堆功能”。

## 模式二：重构

当主交付物是简化结构、减少耦合、澄清边界时，使用此模式。

典型触发语句：

- 重构这个组件
- 降低重复
- 理顺状态流
- 提升可维护性
- 清理这个混乱页面

进入重构模式前，先判断：

- 哪些复杂度是意外复杂度
- 哪些行为必须保持不变
- 哪些路径可以安全删除
- 回滚边界在哪里

通常追加读取：

- `references/16-review-refactor-debug.md`
- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

重构模式的目标是减少复杂度，而不是把复杂度搬到别处。

## 模式三：评审

当主交付物是问题清单、风险判断或质量结论时，使用此模式。

典型触发语句：

- 评审这个 PR
- 看看这个组件有什么问题
- 找回归风险
- 审一下这个前端实现

进入评审模式前，先判断：

- 预期行为应该是什么
- 哪些区域最容易出现回归
- 结构弱点和隐藏复杂度是否应视为真实问题
- 发现应如何按严重度排序

通常追加读取：

- `references/16-review-refactor-debug.md`
- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/12-rendering-performance.md`
- `references/13-accessibility-interaction.md`
- `references/14-styling-visual-quality.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

不要让“整体看起来还行”覆盖掉具体而真实的风险。

## 模式四：调试

当主交付物是定位根因、缩小范围或给出正确修复路径时，使用此模式。

典型触发语句：

- 为什么这里坏了
- 为什么会重复渲染
- 为什么状态是旧的
- 为什么交互不稳定
- 为什么弹窗闪烁

进入调试模式前，先判断：

- 现象与假设是否分开
- 证据是否完整可信
- 最小可重现边界在哪里
- 是否还无法确认根因

通常追加读取：

- `references/16-review-refactor-debug.md`
- `references/11-state-data-effects.md`
- `references/12-rendering-performance.md`
- `references/13-accessibility-interaction.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

不要把调试写成充满自信的猜谜游戏。

## 模式五：性能优化

当主交付物是明确的前端性能改善时，使用此模式。

典型触发语句：

- 减少重渲染
- 让表格更快
- 降低交互延迟
- 提高页面响应性
- 优化首屏或滚动体验

进入性能模式前，先判断：

- 是否存在真实症状、证据或明确风险
- 问题本质是性能问题，还是结构问题伪装成性能问题
- 瓶颈更接近渲染、数据流、网络、包体还是交互设计

通常追加读取：

- `references/12-rendering-performance.md`
- `references/11-state-data-effects.md`
- `references/10-component-architecture.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

不要靠性能迷信做优化。

## 模式六：UI / 交互打磨

当主交付物是提升界面完成度、层级清晰度、可信感或交互质感时，使用此模式。

典型触发语句：

- 把这个页面打磨一下
- 让它更专业
- 提升布局清晰度
- 让交互更顺
- 优化这个 UI 的感觉

进入此模式前，先判断：

- 问题本质是视觉、交互、信息层级还是结构问题
- 是否在保持正确性的前提下提升完成度
- 是否把装饰误当成质量
- 是否仍然把可访问性与响应式纳入范围

通常追加读取：

- `references/14-styling-visual-quality.md`
- `references/13-accessibility-interaction.md`
- 结构影响体验时读取 `references/10-component-architecture.md`
- `references/15-testing-verification-rollbacks.md`

好的打磨提升的是信任感与可用性，而不仅仅是“更花哨”。

## 模式七：架构 / 方案

当主交付物是边界设计、实现方案、组件模型或前端结构判断时，使用此模式。

典型触发语句：

- 这个功能应该怎么设计
- 给一个前端方案
- 组件边界怎么拆
- 两种实现怎么选
- 仪表盘结构应该怎么搭

进入此模式前，先判断：

- 所有权边界如何划分
- 状态和数据流怎么流动
- 风险、复杂度和回滚成本在哪
- 最简单可行架构是什么

通常追加读取：

- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- 性能是关键驱动时读取 `references/12-rendering-performance.md`
- `references/13-accessibility-interaction.md`
- `references/14-styling-visual-quality.md`
- `references/15-testing-verification-rollbacks.md`
- 需要框架细节时读取 `references/30-react-next-adapter.md`

不要为了假想中的未来规模而设计过度复杂的架构。

## 升级到“简化优先”

无论主模式是什么，只要出现复杂度触发器，就应切换到“简化优先”的工作方式。

典型触发器包括：

- 重复状态
- effect 驱动的状态同步
- 包装层不断增加
- 所有权混乱
- 抽象先于问题稳定
- 性能技巧被拿来掩盖结构问题

此时主模式不一定改变，但处理方式必须服从 `references/03-simplification-discipline.md`。

## 次级关注点处理

一个任务可以有次级关注点，但不要让次级关注点篡改主交付物。

例如：

- 实现任务可能需要性能意识
- 评审任务可能顺带发现可访问性问题
- 调试任务最后可能指向重构建议
- UI 打磨任务可能要求先做结构清理

先守住主模式，再处理次级问题。

## 常见路由误判

避免以下误判：

- 把结构问题误当成调试问题
- 把所有性能抱怨都当成优化问题，而忽略结构本质
- 把所有视觉问题都当成样式问题，而忽略信息层级与交互逻辑
- 把实现任务理解成“只要写出来就行”
- 把重构当成默认允许行为变化的借口

正确路由会在写任何代码之前提升最终结果。
