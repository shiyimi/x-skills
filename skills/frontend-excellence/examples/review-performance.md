# 示例：性能评审

## 用户请求示例

“帮我评审这个表格页面为什么这么卡，并指出最关键的问题。”

## 主任务模式

评审

## 建议优先读取

- 必读入口：`references/00-core-principles.md`、`references/01-quality-gates.md`、`references/03-simplification-discipline.md`
- `references/11-state-data-effects.md`
- `references/12-rendering-performance.md`
- `references/16-review-refactor-debug.md`
- `references/15-testing-verification-rollbacks.md`
- 主模式不清或混有调试 / 优化时：`references/02-task-routing.md`
- 若使用 React / Next.js：`references/30-react-next-adapter.md`

## 应重点关注

- 问题是否真的是性能问题，还是结构问题伪装成性能问题
- 是否存在 async waterfall、客户端边界过宽或 bundle 过重
- 是否存在重复状态、重复转换、整树重渲染
- 是否有无证据 memo 化或缓存
- 输出是否按 findings-first 排序，并区分已验证与推断

## 推荐输出骨架

1. 先按严重度给 findings-first 问题清单
2. 每条问题至少带上依据、影响和验证缺口
3. 再给建议的排查 / 修复优先级，而不是一股脑罗列优化点
4. 总结只放在最后，且不要稀释真正的问题
