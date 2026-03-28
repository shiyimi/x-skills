# x-skills

个人 Agent Skills 集合，面向 Claude Code / Codex 的可复用技能仓库。

## 仓库目标

- 集中管理个人常用技能（Skill）与配套资料。
- 保持技能定义、示例、脚本、测试在同一仓库可追踪。
- 支持按需拷贝到本地 skills 目录或直接在当前仓库维护迭代。

## 技能总览

| Skill | 主要用途 | 入口文件 | 关键资产 |
| --- | --- | --- | --- |
| `interview` | 基于 plan 文件做深度追问并产出规格文档 | `skills/interview/SKILL.md` | 轻量定义，适合需求澄清阶段 |
| `lowcode-event-generator` | 从自然语言需求生成低代码平台 `EventConfig` 与 JS `script` | `skills/lowcode-event-generator/SKILL.md` | `references/`、`source/`、`examples/`、`scripts/` |
| `frontend-excellence` | 面向实现、重构、评审、调试、性能与界面打磨的高标准前端 skill | `skills/frontend-excellence/SKILL.md` | `references/`、`examples/`、`evals/` |

## 目录结构

```text
x-skills/
├─ README.md
├─ prompts/
│  ├─ ai-engineering-partner.md
│  ├─ ai-engineering-partner.backup.md
│  └─ riper5/
└─ skills/
   ├─ interview/
   │  └─ SKILL.md
   ├─ lowcode-event-generator/
   │  ├─ SKILL.md
   │  ├─ references/
   │  ├─ source/
   │  ├─ examples/
   │  └─ scripts/
   └─ frontend-excellence/
      ├─ SKILL.md
      ├─ references/
      ├─ examples/
      └─ evals/
```

## 快速上手

### 1) 查看 Skill 定义

```powershell
Get-Content .\skills\interview\SKILL.md -Encoding UTF8
Get-Content .\skills\lowcode-event-generator\SKILL.md -Encoding UTF8
Get-Content .\skills\frontend-excellence\SKILL.md -Encoding UTF8
Get-Content .\prompts\ai-engineering-partner.md -Encoding UTF8
```

### 2) 运行 lowcode 辅助脚本（可选）

批量规范化 JSON 中的 `eventList`，统一为 `eventMode: "code"` 且 `actions: []`：

```powershell
python .\skills\lowcode-event-generator\scripts\convert_event_configs.py .\skills\lowcode-event-generator\examples
```

### 3) 查看 frontend-excellence 的核心参考（可选）

```powershell
Get-Content .\skills\frontend-excellence\references\00-core-principles.md -Encoding UTF8
Get-Content .\skills\frontend-excellence\references\03-simplification-discipline.md -Encoding UTF8
```

### 4) 查看 frontend-excellence 的评估素材（可选）

```powershell
Get-Content .\skills\frontend-excellence\evals\README.md -Encoding UTF8
Get-Content .\skills\frontend-excellence\evals\evals.json -Encoding UTF8
Get-Content .\skills\frontend-excellence\evals\trigger-evals.json -Encoding UTF8
```

## Prompt 与 Skill 关系

- `prompts/ai-engineering-partner.md`
  - 通用工作流主 prompt，也是领域启用总开关。
  - 负责任务分级、三步工作流、通用工程判断、真实性表达，以及在命中前端场景时自动启用 `frontend-excellence`。
- `prompts/ai-engineering-partner.backup.md`
  - 旧版 `ai-engineering-partner.md` 的保存副本。
  - 用于历史参考，不作为当前主 prompt 继续维护。
- `skills/frontend-excellence/`
  - 负责前端领域细则，包括复杂度治理、质量门禁、任务模式路由与专题规则。

## 各 Skill 使用建议

### interview

- 输入：一个 plan 文件路径。
- 产出：持续追问后的规格文档（写回文件）。
- 适用：方案澄清、技术评审前置访谈。

### lowcode-event-generator

- 输入：`schema` 或 `componentList` + 触发意图描述。
- 产出：可直接落地的 code 模式 `EventConfig`。
- 依赖参考：
  - `skills/lowcode-event-generator/references/types.ts`
  - `skills/lowcode-event-generator/references/meta-definitions.md`
  - `skills/lowcode-event-generator/references/script-templates.md`

### frontend-excellence

- 输入：前端实现、重构、评审、调试、性能优化、界面打磨或架构设计任务。
- 产出：按任务模式路由后的高标准前端判断与规则约束，强调复杂度治理、质量门禁与可验证性。
- 关键参考：
  - `skills/frontend-excellence/references/00-core-principles.md`
  - `skills/frontend-excellence/references/01-quality-gates.md`
  - `skills/frontend-excellence/references/02-task-routing.md`
  - `skills/frontend-excellence/references/03-simplification-discipline.md`
  - `skills/frontend-excellence/references/30-react-next-adapter.md`
  - `skills/frontend-excellence/evals/README.md`
  - `skills/frontend-excellence/evals/evals.json`
  - `skills/frontend-excellence/evals/trigger-evals.json`

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
