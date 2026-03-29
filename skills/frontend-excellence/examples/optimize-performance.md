# 示例：性能优化

## 用户请求示例

“这个 Next.js 列表页已经确认真的慢了，别只帮我评审，按前端优化顺序给我一套改造方案。”

## 主任务模式

性能优化

## 建议优先读取

- 必读入口：`references/00-core-principles.md`、`references/01-quality-gates.md`、`references/03-simplification-discipline.md`
- `references/12-rendering-performance.md`
- `references/11-state-data-effects.md`
- `references/10-component-architecture.md`
- `references/15-testing-verification-rollbacks.md`
- `references/30-react-next-adapter.md`
- 主模式不清或混有评审 / 调试时：`references/02-task-routing.md`

## 应重点关注

- 是否先锁定了高杠杆瓶颈，而不是先做局部 memo 化
- async waterfall、客户端边界、bundle 体积和 serialization 成本谁是第一优先级
- 状态影响范围、重复转换或大面积重渲染是否仍是根因
- 优化顺序、验证指标和局部回滚边界是否清楚

## 推荐输出骨架

1. 先交代基线症状、已有指标和最高优先级瓶颈
2. 再按顺序给改造路径，而不是平铺十几条建议
3. 每一步都尽量带上验证指标或观察点
4. 最后说明尚未验证的收益、潜在回归点和局部回滚边界
