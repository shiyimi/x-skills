# 示例：页面实现

## 用户请求示例

“帮我做一个设置页，包含基础资料表单、保存按钮、保存中状态、错误提示和移动端适配。”

## 主任务模式

实现

## 建议优先读取

- 必读入口：`references/00-core-principles.md`、`references/01-quality-gates.md`、`references/03-simplification-discipline.md`
- `references/10-component-architecture.md`
- `references/11-state-data-effects.md`
- `references/13-accessibility-interaction.md`
- `references/14-styling-visual-quality.md`
- `references/15-testing-verification-rollbacks.md`
- 主模式不清或任务混杂时：`references/02-task-routing.md`
- 若使用 React / Next.js：`references/30-react-next-adapter.md`

## 应重点关注

- 页面与表单边界是否清楚
- 状态是否单一、可派生、不过度提升
- 保存中、成功、失败和部分完成态是否齐全
- 移动端布局与交互是否成立
- 最终说明是否披露了验证和未执行项

## 推荐输出骨架

1. 先交代页面边界、组件分工和状态归属
2. 再交代保存中 / 成功 / 失败 / 部分完成等用户状态
3. 再给实施顺序，而不是一口气把所有逻辑塞进一个组件
4. 最后披露已执行验证、未执行项、风险和回滚边界
