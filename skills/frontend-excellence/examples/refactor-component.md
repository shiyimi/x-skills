# 示例：组件重构

## 用户请求示例

“这个表格筛选组件越来越乱了，帮我重构，但尽量不要改行为。”

## 主任务模式

重构

## 建议优先读取

- `references/00-core-principles.md`
- `references/01-quality-gates.md`
- `references/02-task-routing.md`
- `references/03-simplification-discipline.md`
- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/15-testing-verification-rollbacks.md`
- `references/16-review-refactor-debug.md`
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
