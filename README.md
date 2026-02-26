# x-skills

个人 Agent Skills 集合，面向 Claude Code / Codex 的可复用技能仓库。

## 仓库目标

- 集中管理个人常用技能（Skill）与配套资料。
- 保持技能定义、示例、脚本、测试在同一仓库可追踪。
- 支持按需拷贝到本地 skills 目录或直接在当前仓库维护迭代。

## 技能总览

| Skill | 主要用途 | 入口文件 | 关键资产 |
| --- | --- | --- | --- |
| `interview` | 基于 plan 文件做深度追问并产出规格文档 | `interview/SKILL.md` | 轻量定义，适合需求澄清阶段 |
| `lowcode-event-generator` | 从自然语言需求生成低代码平台 `EventConfig` 与 JS `script` | `lowcode-event-generator/SKILL.md` | `references/`、`source/`、`examples/`、`scripts/` |
| `planning-with-agents` | 多 Agent 协作规划、DAG 依赖调度与观测 | `planning-with-agents/SKILL.md` | `src/`、`templates/`、`tests/`、`docs/` |

## 目录结构

```text
x-skills/
├─ README.md
├─ interview/
│  └─ SKILL.md
├─ lowcode-event-generator/
│  ├─ SKILL.md
│  ├─ references/
│  ├─ source/
│  ├─ examples/
│  └─ scripts/
└─ planning-with-agents/
   ├─ SKILL.md
   ├─ src/
   ├─ templates/
   ├─ tests/
   ├─ docs/
   └─ README.md
```

## 快速上手

### 1) 查看 Skill 定义

```powershell
Get-Content .\interview\SKILL.md -Encoding UTF8
Get-Content .\lowcode-event-generator\SKILL.md -Encoding UTF8
Get-Content .\planning-with-agents\SKILL.md -Encoding UTF8
```

### 2) 运行 lowcode 辅助脚本（可选）

批量规范化 JSON 中的 `eventList`，统一为 `eventMode: "code"` 且 `actions: []`：

```powershell
python .\lowcode-event-generator\scripts\convert_event_configs.py .\lowcode-event-generator\examples
```

### 3) 运行 planning-with-agents 测试（可选）

```powershell
Set-Location .\planning-with-agents
python -m pip install -r .\requirements-test.txt
pytest
```

## 各 Skill 使用建议

### interview

- 输入：一个 plan 文件路径。
- 产出：持续追问后的规格文档（写回文件）。
- 适用：方案澄清、技术评审前置访谈。

### lowcode-event-generator

- 输入：`schema` 或 `componentList` + 触发意图描述。
- 产出：可直接落地的 code 模式 `EventConfig`。
- 依赖参考：
  - `lowcode-event-generator/references/types.ts`
  - `lowcode-event-generator/references/meta-definitions.md`
  - `lowcode-event-generator/references/script-templates.md`

### planning-with-agents

- 输入：复杂任务描述（可包含 `#use-subagent` / `#parallel` 等触发词）。
- 产出：任务拆解、依赖图、子 Agent 状态与聚合交付。
- 适用：多模块并行、上下文超长、需多角色协同的任务。

## 维护规范

- 文档编码统一使用 `UTF-8`（避免中文乱码）。
- 新增/修改 Skill 时，至少同步更新：
  - 对应目录 `SKILL.md`
  - 本 `README.md` 的“技能总览”
  - 必要示例或脚本说明
- 对可执行脚本补充最小运行说明（依赖、命令、输入输出）。

## 新增 Skill Checklist

1. 新建 `<skill-name>/SKILL.md` 并写清触发条件与输出约束。
2. 补齐最少一个 `examples/` 示例（如适用）。
3. 若有自动化逻辑，提供 `scripts/` 并附运行命令。
4. 在本 README 的“技能总览”登记该 Skill。

## License

当前仓库未单独声明许可证；如需开源发布，建议补充 `LICENSE` 文件并在此处标注。
