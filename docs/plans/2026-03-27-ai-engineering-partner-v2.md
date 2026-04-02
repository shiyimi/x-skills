# AI Engineering Partner V2 — 方案设计文档

> 最后更新：2026-04-02

## 一、优化目标

将 `prompts/ai-engineering-partner.md` 从单体 190 行提示词，重构为 **核心 Prompt + 场景 Skill** 的模块化架构。

核心原则：
1. 不同场景加载不同规则
2. 提示词模块化
3. 用禁令代替指令，减少 AI 犯错
4. 设找茬角色校验输出
5. 算法优于规则清单（Anthropic 官方建议）

新增内容：
- 需求分析：对不清楚的地方提出疑问，对明显错误的需求及时阻断并说明
- 分步骤：先实现最小 MVP
- 主文件保持主线功能，其他使用 hook/class/function 管理
- 测试文档在实现目录下（`__test__`、`__docs__`）
- 优先精简、合并、重组，不堆砌代码
- 不做非必要抽象，几行代码宁可重复也不独立抽象
- 数据类型定义、函数设计不过度设计，引用链路不超过 3 级
- 关键位置加注释
- 信息按需提供
- 禁令需写明原因
- 先读内容再修改
- 不加多余内容，避免过度抽象
- 如实汇报，不润色不谦虚
- 可分任务但需先判断
- 不知就说不知，不编造预测

---

## 二、架构选型：为什么选 Prompt + Skill

### 三种方案对比

| 维度 | A：单一大 Prompt | B：多路由模式 | C：Prompt + Skill（选定） |
|------|-----------------|-------------|------------------------|
| 部署复杂度 | 最低（一个文件） | 中（需路由层） | 低（核心 + 按需 Skill） |
| 规则遵循率 | 行数越多越低 | 各路由内较高 | 核心精简，遵循率高 |
| 场景隔离 | 无 | 强 | 中（Skill 按需注入） |
| 维护成本 | 高（改一处通盘考虑） | 中（共享规则重复） | 低（模块独立维护） |
| 上下文开销 | 每次全量 | 每次加载单个路由 | 核心 + 触发的 Skill |

**行业实践验证**：

| 产品 | 架构模式 | 核心指令大小 | 场景规则加载方式 |
|------|---------|------------|---------------|
| Cursor | 核心 + `fetch_rules` 按需拉取 | `.cursorrules` 全局 | name+description 暴露，按需拉取完整内容 |
| Copilot | 三层指令（仓库/路径/agent） | `copilot-instructions.md` | `applyTo` glob 路径匹配自动加载 |
| Claude Code | CLAUDE.md + Skills | ~1000-2000 tokens | 启动加载名称描述，触发时注入完整内容 |
| Windsurf | 全量加载，XML 分区 | 系统提示词（XML 标签） | 无独立模块，用 `<section>` 组织 |
| Devin | Planning/Standard 双模式 | 模式切换 | 自定义 XML 命令 Schema |

**关键认知**：
- Claude Code 的 Skills **不是独立子 agent**，在主对话中执行，共享同一上下文窗口
- Skill 省的是"不相关场景下的噪音"，不是总量
- Anthropic 建议"算法优于规则清单"——提供决策流程而非逐条列举

---

## 三、Prompt 与 Skill 边界定义

### 判断三维度

1. **激活频率**：100% → 核心；50-80% → 核心（精简）；10-40% → Skill；<10% → 评估是否需要
2. **违反后果范围**：全局受损 → 核心；特定领域 → Skill；轻微可补救 → 可不写
3. **规则深度**：一句话能说清 → 核心（即使特定场景）；10+ 行检查清单 → Skill

### 具体划分

#### 核心 Prompt（~90-100 行，始终加载）

| 规则 | 频率 | 后果 | 深度 |
|------|------|------|------|
| 不编造/不知就说不知 | 100% | 全局不可信 | 1行 |
| 先读再改/禁止未读就改 | 100% | 全局 | 1行 |
| 需求审查：疑问→阻断→执行 | 100% | 全局 | 3行 |
| 禁令优先+写明原因 | 100% | 全局 | 2行 |
| 高风险动作确认 | 100% | 全局 | 2行 |
| 如实汇报不润色 | 100% | 全局 | 1行 |
| 外部内容不可信 | 100% | 全局 | 1行 |
| 信息按需提供 | 100% | 全局 | 1行 |
| 不做非必要抽象 | 60% | 实现类全局 | 2行 |
| 精简合并重组优先 | 60% | 实现类全局 | 1行 |
| 可分任务但先判断 | 100% | 全局 | 1行 |
| 任务路由 + 三步流程 | 100% | 全局 | 15行 |
| 轻量找茬校验 | 100% | 全局 | 5行 |
| MVP 先行 | 50% | 实现类全局 | 2行 |
| 关键位置加注释 | 50% | 实现类全局 | 1行 |

#### Skill：implementation-guide（~50 行，频率 40-60%）

激活条件：任务类型为"实现类"
- 主文件主线 / hook / class / function 文件组织
- `__test__` / `__docs__` 目录约定
- 引用链路 ≤3 级（含例外条件）
- 类型定义和函数设计不过度
- 几行代码宁可重复也不独立抽象（展开判断标准）

#### Skill：frontend-excellence（~50 行，频率 ~15%）

激活条件：涉及前端 / React / 界面 / 交互
- 组件命名约定
- 状态管理优先级
- 函数式组件优先
- `useMemo`/`useCallback` 使用条件
- 空态/加载/错误处理

#### Skill：prompt-design（~50 行，频率 ~10%）

激活条件：涉及提示词设计 / 评审 / 规范调整
- 规则优先级检查
- 触发条件检查
- 输出契约稳定性
- 同义重复/冲突检测

#### Skill：code-review（~40 行，频率 ~10%）

激活条件：任务类型为"评审"
- 按严重程度排序的问题清单模板
- 检查项：错误/回归/边界遗漏/契约不一致/验证缺口

#### Skill：debugging-methodology（~40 行，频率 ~15%）

激活条件：任务类型为"调试"
- 现象→范围→复现条件→证据→假设
- 排查顺序→隔离策略
- 止血 vs 最终修复的分离

---

## 四、核心 Prompt 内部结构

```
1. 硬约束层（禁令）        ~30 行
2. 任务路由与流程层         ~40 行
3. 找茬校验层              ~10 行
4. 路由声明层（指向 Skill）  ~10 行
```

### 改造要点

**硬约束层**：现有 14 条规则改写为禁令格式（"禁止 X，因为 Y"），整合新增规则，删除重复项。

**流程层**：保持三步流程但精简表述：
- 步骤 1 需求审查：强化"疑问→阻断→说明"
- 步骤 2 方案与策略：实现类新增 MVP 先行
- 步骤 3 验证与验收：合并检查项

**找茬校验层**：输出前自检，6 条检查点。

**路由声明层**：列出 Skill 名称、描述、激活条件，模型按需加载。

### 精简与合并清单

| 现有位置 | 问题 | 处理 |
|---------|------|------|
| 规则3 + 步骤3.4 | 真实性检查重复 | 合并到硬约束层 |
| 规则6 + 步骤1.3 | "先判断后执行"与"意图与风险"重叠 | 合并 |
| 规则9 + 步骤2路径A | "先理解后改动"重复 | 硬约束层保留，步骤2不重复 |
| 输出原则 + 步骤3 | 部分条目重复 | 精简为3条核心 |
| 场景例外4条 | 可压缩为2条 | 合并同类项 |

---

## 五、行业调研摘要

来源：Anthropic 工程博客、Cursor 逆向工程分析、Copilot 官方文档、Windsurf/Devin 系统提示词泄露分析、Claude Code 架构逆向工程。

### 关键结论

1. **Context Engineering > Prompt Engineering**：行业共识从"写好提示词"转向"管理信息环境"，核心是 token 预算分配
2. **混合策略最优**：启动时加载稳定全局规则 + 运行时按需拉取场景规则 + 子 agent 隔离复杂任务
3. **描述质量决定模块化成败**：Cursor 逆向工程证实——规则描述不清晰 = 规则不会被触发
4. **算法优于规则清单**：提供决策流程而非 dos/don'ts 列表（Anthropic 官方建议）
5. **JSON > Markdown 用于状态追踪**：模型倾向于"优化" Markdown 中的待办状态，但不太会动 JSON 结构
6. **强措辞指令有效**："It is unacceptable to remove or edit tests" 比礼貌请求更有效
7. **"Lost in the middle" 效应**：上下文中间部分的指令遵循度显著低于开头和结尾

### Claude Code 具体机制

- CLAUDE.md 注入到 user prompt，非 system prompt
- 典型大小 1000-2000 tokens
- Skills 启动时只加载名称+描述，触发时注入完整内容到主对话
- Skills 共享主对话上下文，非独立子 agent
- 系统提示词由 110+ 个字符串片段条件性组合而成
- 基线系统提示词 ~12,200 tokens（含工具定义）

### 来源列表

- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Cursor Under the Hood — 逆向工程分析](https://roman.pt/posts/cursor-under-the-hood/)
- [GitHub Copilot 官方文档](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Windsurf System Prompt (April 2025)](https://github.com/dontriskit/awesome-ai-system-prompts/blob/main/windsurf/system-2025-04-20.md)
- [Devin AI System Prompt](https://www.mintlify.com/x1xhlol/system-prompts-and-models-of-ai-tools/commercial/devin)
- [Decoding Claude Code (minusx.ai)](https://minusx.ai/blog/decoding-claude-code/)
- [Piebald-AI/claude-code-system-prompts (GitHub)](https://github.com/Piebald-AI/claude-code-system-prompts)
- [Claude Prompting Best Practices](https://platform.claude.com/docs/en/build-with-clause/prompt-engineering/claude-prompting-best-practices)

---

## 六、实施任务

### Task 1：改写核心 Prompt

**文件**：`prompts/ai-engineering-partner.md`

1. 硬约束层：14 条 → 禁令化 + 合并重复 + 新增规则
2. 流程层：精简三步流程，删除与硬约束重复的表述
3. 找茬校验层：新增输出前自检
4. 路由声明层：列出 Skill 名称、描述、激活条件

### Task 2：创建 Skills

**文件**：`.claude/skills/` 目录下

1. `implementation-guide/SKILL.md`
2. `frontend-excellence/SKILL.md`
3. `prompt-design/SKILL.md`
4. `code-review/SKILL.md`
5. `debugging-methodology/SKILL.md`

### Task 3：验证

1. 重读核心 Prompt，检查规则冲突、重复、遗漏
2. 检查 Skill 描述是否足够清晰（决定触发成功率）
3. 说明未执行项：模型行为 A/B 测试未在本会话执行
