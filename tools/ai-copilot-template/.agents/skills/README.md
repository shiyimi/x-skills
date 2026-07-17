# Skills

本目录存放项目级 AI 工作流程。

只有稳定、可重复、可验证的流程才应沉淀为 skill。不要把一次性提示词、临时经验或项目事实放入 skill。

## 内置基础 skill

- `requirement-review`：用于需求审查、风险分级、前提校验和阻断错误目标。
- `code-review`：用于代码审查、变更风险识别、验证缺口识别和输出统一评审结果。

## 编写要求

- 每个 skill 使用独立目录。
- 每个目录必须包含 `SKILL.md`。
- `SKILL.md` 必须说明触发场景、输入、执行步骤和输出格式。
- 项目事实不要写入 skill，应写入 `.agents/project-profile.md` 或 `.agents/project-notes.md`。
