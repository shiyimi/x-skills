# 示例：组件重构

## 用户请求示例

“这个表格筛选组件越来越乱了，帮我重构，但尽量不要改行为。”

## 主任务模式

重构

## 建议优先读取

- 必读入口：`references/00-core-principles.md`、`references/01-quality-gates.md`、`references/03-simplification-discipline.md`
- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/16-review-refactor-debug.md`
- `references/15-testing-verification-rollbacks.md`
- 主模式不清或任务混杂时：`references/02-task-routing.md`
- 若使用 React / Next.js：`references/30-react-next-adapter.md`

## 应重点关注

- 是否先删掉冗余状态、重复分支和旧路径
- 是否把逻辑归还给真正拥有它的边界
- 是否把行为保持与行为变化分开说明
- 是否明确回滚边界

## 不应做的事

- 把复杂度只是搬到别的文件
- 一上来就抽“通用 hook”
- 不说明行为变化却大改结构

## 推荐输出骨架

1. 先说明哪些行为必须保持不变
2. 再列当前复杂度来源和优先删除顺序
3. 再给重构路径、旧路径退出条件和回滚边界
4. 最后说明哪些复杂度暂时保留，以及为什么
