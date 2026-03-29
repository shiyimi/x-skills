# Frontend Excellence Evals

这组评估素材分为两类：

- `evals.json`：前向任务评估，判断 skill 真正介入任务后，是否把任务路由到正确模式，并给出符合该模式的高质量输出。
- `trigger-evals.json`：触发边界评估，判断 skill 该触发时能触发，不该触发时不会被前端关键词误吸引。

## 使用顺序

建议先看 `trigger-evals.json`，确认触发边界没有明显过宽或过窄，再跑 `evals.json` 做真实任务质量评估。

如果触发边界本身已经失真，后续前向评估的结果会被污染。

## 前向评估的判分口径

`evals.json` 中每条用例包含三层信息：

- `prompt`：真实用户会说的话
- `expected_output`：这条用例希望看到的总体表现
- `expectations`：更适合 grader 使用的离散检查点

这里的 `expectations` 不是要求逐字命中，而是要求输出在判断、结构、模式路由和验证意识上满足这些条件。

对于 `frontend-excellence`，最值得区分的不是“有没有提到 React”，而是：

- 是否选对主任务模式
- 是否区分“性能评审”和“性能优化”
- 是否把复杂度治理放到足够高优先级
- 是否避免无证据优化和过度抽象
- 在 React / Next.js 任务里，是否优先抓高杠杆问题，例如 async waterfall、服务端 / 客户端边界、bundle / serialization 成本和 effect 驱动的状态漂移
- 是否覆盖用户真实会遇到的状态与体验问题
- 是否披露验证、未执行项、风险与回滚边界

同样要看 examples 与默认路由是否一致。优秀的同类 skill 往往把主入口写得很轻，把高杠杆细节下沉到按需读取的 reference / example / eval，而不是让 example 反过来变成第二套强制流程。

## Benchmark 分层

如果要把 `frontend-excellence` 往第一梯队推进，评估最好逐步覆盖四层：

- `L0 Trigger`：只测触发边界是否过宽 / 过窄，对应 `trigger-evals.json`
- `L1 Prompt`：只给用户请求，测模式路由、输出契约和验证意识，对应当前 `evals.json` 主体
- `L2 Code Context`：给真实文件、diff、PR 片段或组件树上下文，测它是否仍能保持 findings-first、复杂度治理和边界判断
- `L3 Browser / Preview`：给部署预览、浏览器症状、截图 / 录屏或运行时证据，测它是否会正确升级验证策略，而不是只靠代码阅读签字

当前仓库已经覆盖 `L0` 和 `L1`；后续最值得补的是 `L2` 与 `L3`。

## Trigger Eval 的设计原则

`trigger-evals.json` 的正例应覆盖：

- 实现
- 重构
- 评审
- 调试
- 性能优化
- UI / 交互打磨
- 架构 / 方案

负例不要只放明显无关任务，而要优先放“看起来像前端，实际上不该由本 skill 主导”的近邻场景，例如：

- 构建配置
- 包管理 / 发布
- 埋点口径 / analytics schema
- 通用执行人格或流程型 skill
- 纯后端与纯基础设施问题

## 后续扩展建议

如果后面开始做真实 benchmark，优先补以下几类用例：

- 带现有代码上下文的重构 / 评审用例
- 带 hydration 闪烁、客户端边界过大或 async waterfall 的 React / Next.js 用例
- 带明显状态同步问题的调试用例
- 带真实视觉目标和设计约束的 UI 打磨用例

这样更容易测出 skill 是不是真的在复杂任务里提供了稳定增益。
