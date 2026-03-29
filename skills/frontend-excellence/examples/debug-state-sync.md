# 示例：状态漂移调试

## 用户请求示例

“这个 React 筛选页经常状态不同步，我怀疑是 effect 写坏了，但还没有稳定复现，帮我按前端调试方式缩小范围。”

## 主任务模式

调试

## 建议优先读取

- 必读入口：`references/00-core-principles.md`、`references/01-quality-gates.md`、`references/03-simplification-discipline.md`
- `references/11-state-data-effects.md`
- `references/16-review-refactor-debug.md`
- `references/15-testing-verification-rollbacks.md`
- 牵涉渲染卡顿或抖动时：`references/12-rendering-performance.md`
- 若使用 React / Next.js：`references/30-react-next-adapter.md`
- 主模式不清或同时混有重构 / 实现时：`references/02-task-routing.md`

## 应重点关注

- 现象、证据、假设和已验证根因是否分开
- 是否优先排查多事实源、派生值被存储或 effect 链式同步
- 最小重现边界、日志点和隔离顺序是否清楚
- 修复路径是否回到单一事实源，而不是继续堆 effect

## 推荐输出骨架

1. 先分开现象、现有证据和仍未验证的假设
2. 再给最小重现边界、日志 / 埋点位置和隔离顺序
3. 再说明最可信的修复方向，而不是直接承诺已经定位根因
4. 最后披露哪些结论仍未验证，以及后续回滚边界
