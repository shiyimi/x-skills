# 核心原则：Karpathy Four Principles

Andrej Karpathy 针对 LLM 编码问题的四原则，按违背风险排序评审。

---

## 问题背景

From Karpathy:

> "The models make wrong assumptions on your behalf and just run along with them without checking. They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."

> "They really like to overcomplicate code and APIs, bloat abstractions, don't clean up dead code... implement a bloated construction over 1000 lines when 100 would do."

> "They still sometimes change/remove comments and code they don't sufficiently understand as side effects, even if orthogonal to the task."

---

## Principle 1: Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs. Push back when warranted.**

### LLM 典型问题

- 静默选择一种解释并执行，不确定时不问
- 隐藏困惑，假装理解
- 缺失权衡分析，只给一个方案
- 应该阻止时不阻止，顺着用户错误假设走

### 评审信号

```markdown
🔴 Blocking 信号：
- 隐藏假设导致行为风险
  → 代码基于未确认的假设，假设错误会导致严重问题
- 未解决的困惑被隐藏
  → 代码有明显的理解缺口但被假装理解
- 缺失权衡分析导致错误选择
  → 存在更好的方案但未被呈现

🟡 Recommended 信号：
- 假设未明确陈述
  → 代码有隐含假设，但假设本身足够安全
- 权衡分析不完整
  → 呈现了方案但未说明为何选择此方案

🔵 Optional 信号：
- 可以补充假设说明
  → 假设已足够明确但可以更好陈述
```

### 原则违背示例

```markdown
🔴 Think Before Coding - 隐藏假设导致行为风险

**证据**：`await fetchUser(userId)` 直接使用 userId
**假设**：userId 存在且有效
**风险**：userId 为空或不存在时，行为不确定
**场景**：新用户首次访问、缓存失效、并发删除
**建议**：明确假设边界，添加 userId 有效性检查或明确标注假设
```

```markdown
🟡 Think Before Coding - 权衡分析缺失

**证据**：引入 Redis 缓存，但未说明为何选择 Redis
**问题**：存在本地缓存、IndexedDB 等替代方案
**缺失**：未呈现替代方案和选择理由
**建议**：补充权衡分析，说明为何 Redis 优于替代方案
```

---

## Principle 2: Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

### LLM 典型问题

- 过度工程，1000 行代码做 100 行能做的事
- 臃肿抽象，单一用途引入复杂模式
- 推测性设计，为假设场景添加功能
- 不必要的配置性和灵活性

### 评审信号

```markdown
🔴 Blocking 信号：
- 过度工程导致行为难以验证
  → 代码复杂度已无法验证行为正确性
- 臃肿抽象掩盖行为问题
  → 抽象层过多，核心逻辑被隐藏

🟡 Recommended 信号：
- 过度工程：1000 行做 100 行的事
  → 解决方案比问题更复杂
- 臃肿抽象：单一用途引入复杂模式
  → 只有一个使用者的抽象
- 推测性设计：为假设场景添加功能
  → 未被要求的功能或扩展点
- 不必要的配置性
  → 未被要求的配置选项

🔵 Optional 信号：
- 可以简化但影响可控
  → 复杂度增加但未影响验证或维护
```

### 原则违背示例

```markdown
🔴 Simplicity First - 过度工程导致无法验证

**证据**：processOrder() 500 行，引入 Strategy、Factory、Observer 模式
**问题**：核心逻辑被多层抽象包裹，无法追踪数据流
**影响**：无法验证订单处理各步骤的行为正确性
**建议**：删除抽象层，直接实现核心逻辑，待场景复杂后再抽象
```

```markdown
🟡 Simplicity First - 臃肿抽象

**证据**：引入 abstract class PaymentStrategy + 3 个实现类
**问题**：每种支付逻辑仅 10-20 行，且只有当前一种支付方式
**复杂度**：抽象比实现更复杂，为单一场景引入多态
**建议**：直接用条件分支，待支付方式复杂后再抽象

**测试**：Would a senior engineer say this is overcomplicated? Yes → simplify.
```

```markdown
🟡 Simplicity First - 推测性设计

**证据**：添加了 `locale`、`theme`、`currency` 配置选项
**问题**：用户未要求这些功能
**推测场景**：假设未来可能国际化
**建议**：删除未请求的功能，待实际需求出现后再添加
```

---

## Principle 3: Surgical Changes

**Touch only what you must. Clean up only your own mess.**

### LLM 典型问题

- 越界改动：改动了与任务无关的代码
- 驱离重构："顺便改进"相邻代码
- 删除不理解的代码或注释
- 不匹配现有风格

### 评审信号

```markdown
🔴 Blocking 信号：
- 删除不理解的代码导致风险
  → 删除了代码/注释，可能影响后续理解或维护
- 越界改动导致行为变化
  → 改动与任务无关的代码，且影响了行为

🟡 Recommended 信号：
- 越界改动：改动了与任务无关的代码
  → "顺便改进"了相邻代码或格式
- 不匹配现有风格
  → 引入了与项目不一致的风格
- 预存在的死代码未删除
  → 改动前已存在的死代码不应删除（除非被要求）

🔵 Optional 信号：
- 改动风格可匹配
  → 可以匹配现有风格但未匹配
```

### 原则违背示例

```markdown
🔴 Surgical Changes - 删除不理解的代码导致风险

**证据**：删除了 `// TODO: handle edge case when user is null` 注释
**问题**：删除了关键边界提示，可能影响后续维护
**风险**：后续开发者可能忽略该边界条件
**建议**：恢复注释，或明确处理该边界并删除注释
```

```markdown
🟡 Surgical Changes - 越界改动

**证据**：任务为"修复登录 bug"，但改动了 signup.ts 的命名和格式
**问题**：signup.ts 与登录 bug 无关，属于越界改动
**原则违背**：Touch only what you must
**建议**：回退 signup.ts 改动，只保留登录相关修改

**测试**：Every changed line should trace directly to the user's request.
signup.ts 改动无法追溯到"修复登录 bug"请求 → revert.
```

```markdown
🟡 Surgical Changes - 不匹配现有风格

**证据**：新增代码使用 async/await，但项目使用 Promise chain
**问题**：引入了与项目不一致的风格
**建议**：匹配现有风格，使用 Promise chain
```

### 边界判断

```markdown
✅ 允许清理：
- YOUR changes 导致的 orphan imports/variables/functions
- YOUR changes 导致的 unused code

❌ 不允许删除：
- 预存在的死代码（除非被明确要求）
- 不理解的注释或代码
- 与任务无关的代码
```

---

## Principle 4: Goal-Driven Execution

**Define success criteria. Loop until verified.**

### LLM 典型问题

- 无验证：代码写完就宣布完成
- 无成功标准：不知道什么是"完成"
- 计划缺失：多步骤任务无明确步骤和验证

### 评审信号

```markdown
🟡 Recommended 信号：
- 多步骤任务无明确计划
  → 应有 `[Step] → verify: [check]` 结构
- 无验证或验证不足
  → 宣称完成但未验证关键路径

🔵 Optional 信号：
- 成功标准可以更明确
  → 有验证但可以更强
- 验证可以自动化
  → 手动验证可以改为测试验证
```

### 原则违背示例

```markdown
🟡 Goal-Driven Execution - 无验证

**证据**：PR 描述"修复了登录 bug"但无验证证据
**问题**：宣称完成但未验证登录流程是否正常
**缺失**：应先写测试复现 bug，再让测试通过
**建议**：补充验证证据或测试
```

```markdown
🟡 Goal-Driven Execution - 多步骤任务无计划

**证据**：改动涉及 5 个步骤但无明确步骤陈述
**问题**：多步骤任务应有明确计划和验证点
**建议**：补充步骤计划：
1. [添加验证] → verify: [测试覆盖空值场景]
2. [修复计算] → verify: [测试通过]
3. [更新文档] → verify: [文档描述与行为一致]
```

### 目标驱动转换

```markdown
Instead of... | Transform to...
"Add validation" | "Write tests for invalid inputs, then make them pass"
"Fix the bug" | "Write a test that reproduces it, then make it pass"
"Refactor X" | "Ensure tests pass before and after"
```

---

## 四原则优先级总结

```markdown
评审优先级：

1. Think Before Coding
   → 隐藏假设、未解决困惑 → 🔴 Blocking（导致行为风险）
   → 权衡缺失 → 🟡 Recommended

2. Simplicity First
   → 过度工程导致无法验证 → 🔴 Blocking
   → 臃肿抽象、推测性设计 → 🟡 Recommended

3. Surgical Changes
   → 删除不理解的代码 → 🔴 Blocking（可能导致风险）
   → 越界改动 → 🟡 Recommended

4. Goal-Driven Execution
   → 无验证、无计划 → 🟡 Recommended
   → 验证可优化 → 🔵 Optional
```

---

## 评审顺序

按四原则顺序评审：

```markdown
Step 1: Think Before Coding
   → 是否有隐藏假设
   → 是否有未解决的困惑
   → 是否有缺失的权衡分析

Step 2: Simplicity First
   → 是否过度工程（1000 行做 100 行的事）
   → 是否臃肿抽象（单一用途引入复杂模式）
   → 是否推测性设计（未请求的功能）

Step 3: Surgical Changes
   → 是否越界改动
   → 是否删除不理解的代码/注释
   → 是否不匹配现有风格

Step 4: Goal-Driven Execution
   → 是否有验证
   → 是否有成功标准
   → 是否有明确计划
```

---

## 如何判断原则有效

如果评审中发现：

- **隐藏假设导致回退** → Think Before Coding 有效
- **过度工程导致重写** → Simplicity First 有效
- **越界改动导致争议** → Surgical Changes 有效
- **无验证导致返工** → Goal-Driven Execution 有效