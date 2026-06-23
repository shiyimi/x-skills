# 问题分类：按四原则违背程度

按 Karpathy 四原则违背程度分类问题严重度。

---

## 四原则与严重度映射

```markdown
Think Before Coding 违背：
- 隐藏假设导致行为风险 → 🔴 Blocking
- 未解决困惑导致风险 → 🔴 Blocking
- 权衡缺失 → 🟡 Recommended

Simplicity First 违背：
- 过度工程导致无法验证 → 🔴 Blocking
- 臃肿抽象导致无法理解 → 🔴 Blocking
- 过度工程（1000行做100行的事） → 🟡 Recommended
- 臃肿抽象（单一用途复杂模式） → 🟡 Recommended
- 推测性设计（未请求功能） → 🟡 Recommended

Surgical Changes 违背：
- 删除不理解的代码导致风险 → 🔴 Blocking
- 越界改动导致行为变化 → 🔴 Blocking
- 越界改动 → 🟡 Recommended
- 不匹配现有风格 → 🟡 Recommended

Goal-Driven Execution 违背：
- 无验证 → 🟡 Recommended
- 无成功标准 → 🔵 Optional
- 无计划（多步骤任务） → 🟡 Recommended
```

---

## 🔴 必须修复（Blocking）

**来源：原则违背导致实际风险**

### Think Before Coding：隐藏假设导致行为风险

```markdown
🔴 [文件:行号] Think Before Coding - 隐藏假设

**证据**：[具体代码片段]
**假设**：[隐藏的假设]
**风险场景**：[假设不成立时的后果]
**建议**：[明确假设或添加检查]

示例：
🔴 payment.ts:89 Think Before Coding - 隐藏假设

**证据**：`await fetchUser(userId)` 直接使用 userId
**假设**：userId 存在且有效
**风险场景**：userId 为空时，行为不确定或崩溃
**建议**：添加 userId 有效性检查，或明确标注假设并处理边界
```

### Think Before Coding：未解决困惑导致风险

```markdown
🔴 [文件:行号] Think Before Coding - 未解决困惑

**证据**：[删除或修改了不理解但有价值的代码]
**困惑点**：[不理解的部分]
**风险**：[可能导致的问题]
**建议**：[恢复代码或明确理解后再修改]

示例：
🔴 order.ts:89 Think Before Coding - 未解决困惑

**证据**：删除了 `// TODO: handle edge case when user is null`
**困惑点**：不理解该注释的价值
**风险**：后续开发者可能忽略边界条件
**建议**：恢复注释，或明确处理该边界后删除
```

### Simplicity First：过度工程导致无法验证

```markdown
🔴 [文件:行号] Simplicity First - 过度工程影响验证

**证据**：[具体代码片段]
**复杂度来源**：[抽象层过多/逻辑嵌套过深/模式过复杂]
**影响**：[无法验证行为正确性]
**建议**：[简化方向]

示例：
🔴 processor.ts:89-500 Simplicity First - 过度工程影响验证

**证据**：processOrder() 500 行，引入 Strategy、Factory、Observer 模式
**复杂度来源**：多层抽象包裹核心逻辑
**影响**：无法追踪数据流和验证各步骤行为
**建议**：删除抽象层，直接实现核心逻辑，待场景复杂后再抽象
```

### Simplicity First：臃肿抽象掩盖行为问题

```markdown
🔴 [文件:行号] Simplicity First - 臃肿抽象掩盖问题

**证据**：[抽象层过多，核心逻辑被隐藏]
**问题**：[无法定位核心行为]
**影响**：[调试和验证困难]
**建议**：[简化抽象]

示例：
🔴 payment.ts:89-200 Simplicity First - 臃肿抽象掩盖问题

**证据**：支付逻辑分散在 5 个抽象层中
**问题**：无法定位支付失败的根本原因
**影响**：调试困难，无法验证支付流程完整性
**建议**：合并抽象层，核心逻辑可见
```

### Surgical Changes：删除不理解的代码导致风险

```markdown
🔴 [文件:行号] Surgical Changes - 删除不理解代码

**证据**：[删除的具体代码或注释]
**不理解点**：[为什么删除了不理解的代码]
**风险**：[可能导致的问题]
**建议**：[恢复代码]

示例：
🔴 utils.ts:89 Surgical Changes - 删除不理解代码

**证据**：删除了 `// Handles edge case: first login with empty cart`
**不理解点**：不理解该注释记录的边界场景
**风险**：后续可能忽略该边界处理
**建议**：恢复注释，或明确处理该边界后删除
```

### Surgical Changes：越界改动导致行为变化

```markdown
🔴 [文件:行号] Surgical Changes - 越界改动导致行为变化

**证据**：[改动与任务无关的代码]
**任务范围**：[原本的任务]
**越界改动**：[改动了什么]
**行为变化**：[导致了什么行为变化]
**建议**：[回退改动]

示例：
🔴 signup.ts:89 Surgical Changes - 越界改动导致行为变化

**证据**：修改了 signup.ts 的验证逻辑
**任务范围**：修复登录 bug
**越界改动**：signup.ts 与登录无关
**行为变化**：注册流程验证规则变化
**建议**：回退 signup.ts 改动
```

---

## 🟡 建议修复（Recommended）

**来源：原则违背但风险可控**

### Think Before Coding：权衡缺失

```markdown
🟡 [文件:行号] Think Before Coding - 权衡缺失

**证据**：[引入重要选择但未说明理由]
**缺失**：[未呈现的替代方案或选择理由]
**建议**：[补充权衡分析]

示例：
🟡 api.ts:89 Think Before Coding - 权衡缺失

**证据**：引入 Redis 缓存但未说明为何选择 Redis
**缺失**：未呈现本地缓存等替代方案
**建议**：补充权衡分析：为何 Redis 优于本地缓存或 IndexedDB
```

### Simplicity First：过度工程（规模不匹配）

```markdown
🟡 [文件:行号] Simplicity First - 过度工程

**证据**：[代码规模 vs 问题规模]
**问题规模**：[实际需求复杂度]
**代码规模**：[实现复杂度]
**建议**：[简化方向]

示例：
🟡 processor.ts:89-150 Simplicity First - 过度工程

**证据**：100 行代码实现 20 行能做的事
**问题规模**：简单数据处理
**代码规模**：引入 3 层抽象 + 2 个工厂类
**建议**：删除抽象，直接实现，100 行简化为 20 行
```

### Simplicity First：臃肿抽象（单一用途）

```markdown
🟡 [文件:行号] Simplicity First - 臃肿抽象

**证据**：[抽象只有单一使用者]
**抽象复杂度**：[抽象本身复杂度]
**使用场景**：[实际使用场景数量]
**建议**：[删除抽象或待场景复杂后再抽象]

示例：
🟡 payment.ts:89 Simplicity First - 臃肿抽象

**证据**：引入 abstract class PaymentStrategy + 3 个实现类
**抽象复杂度**：Strategy 模式 + Factory
**使用场景**：当前只有 1 种支付方式
**建议**：用条件分支代替，待支付方式超过 2 种后再抽象

**测试**：Would a senior engineer say this is overcomplicated? Yes → simplify.
```

### Simplicity First：推测性设计

```markdown
🟡 [文件:行号] Simplicity First - 推测性设计

**证据**：[添加了未请求的功能或配置]
**未请求功能**：[具体功能]
**推测场景**：[假设的未来需求]
**建议**：[删除未请求功能]

示例：
🟡 config.ts:89 Simplicity First - 推测性设计

**证据**：添加了 locale、theme、currency 配置选项
**未请求功能**：国际化配置
**推测场景**：未来可能国际化
**建议**：删除未请求功能，待实际需求出现后再添加
```

### Surgical Changes：越界改动

```markdown
🟡 [文件:行号] Surgical Changes - 越界改动

**证据**：[改动无法追溯到请求]
**任务范围**：[原本的任务]
**越界改动**：[改动了什么]
**建议**：[回退改动]

示例：
🟡 signup.ts:89 Surgical Changes - 越界改动

**证据**：修改了 signup.ts 的命名风格
**任务范围**：修复登录 bug
**越界改动**：signup.ts 命名改动与登录无关
**建议**：回退 signup.ts 改动

**测试**：Every changed line should trace directly to the user's request.
signup.ts 改动无法追溯到"修复登录 bug" → revert.
```

### Surgical Changes：不匹配现有风格

```markdown
🟡 [文件:行号] Surgical Changes - 风格不匹配

**现状**：[新增代码风格]
**项目风格**：[项目现有风格]
**建议**：[匹配现有风格]

示例：
🟡 api.ts:89 Surgical Changes - 风格不匹配

**现状**：新增代码使用 async/await
**项目风格**：项目使用 Promise chain
**建议**：匹配现有风格，使用 Promise chain
```

### Goal-Driven Execution：无验证

```markdown
🟡 [文件:行号] Goal-Driven Execution - 无验证

**证据**：[宣称完成但无验证证据]
**改动类型**：[改动涉及什么]
**缺失验证**：[应有什么验证]
**建议**：[补充验证]

示例：
🟡 payment.ts Goal-Driven Execution - 无验证

**证据**：PR 描述"修复了支付 bug"但无验证证据
**改动类型**：支付逻辑修改
**缺失验证**：支付流程测试或手动验证
**建议**：补充测试覆盖支付流程，或提供手动验证证据
```

### Goal-Driven Execution：无计划（多步骤任务）

```markdown
🟡 [文件] Goal-Driven Execution - 无计划

**证据**：[多步骤任务无步骤陈述]
**任务规模**：[涉及多少步骤]
**缺失计划**：[应有什么计划结构]
**建议**：[补充计划]

示例：
🟡 refactoring Goal-Driven Execution - 无计划

**证据**：改动涉及验证、计算、持久化、通知 4 步骤但无计划
**任务规模**：多步骤重构
**缺失计划**：应有 `[Step] → verify: [check]` 结构
**建议**：补充步骤计划：
1. [拆分验证逻辑] → verify: [测试覆盖验证场景]
2. [拆分计算逻辑] → verify: [测试覆盖计算场景]
3. [拆分持久化逻辑] → verify: [数据一致性测试]
```

---

## 🔵 可选改进（Optional）

**来源：原则可以更好遵循但非必须**

### Goal-Driven Execution：成功标准可更明确

```markdown
🔵 [文件] Goal-Driven Execution - 成功标准可更明确

**现状**：[当前验证方式]
**优化方向**：[如何更明确]
**建议**：[补充成功标准]

示例：
🔵 api.ts Goal-Driven Execution - 成功标准可更明确

**现状**：手动测试验证了基本流程
**优化方向**：自动化测试覆盖边界场景
**建议**：补充测试覆盖空值、超时等边界
```

### Goal-Driven Execution：验证可自动化

```markdown
🔵 [文件] Goal-Driven Execution - 验证可自动化

**现状**：[手动验证]
**自动化方向**：[如何自动化]
**建议**：[添加自动化验证]

示例：
🔵 payment.ts Goal-Driven Execution - 验证可自动化

**现状**：手动验证支付流程
**自动化方向**：添加支付流程测试
**建议**：添加自动化测试覆盖支付流程
```

---

## ❓ 不确定点

需要更多上下文才能判断的问题。

```markdown
❓ [文件:行号] 需确认 - [原则名称]

**观察**：[代码行为]
**疑问**：[不确定的问题]
**需要**：[确认内容]
**建议**：[确认方式]

示例：
❓ config.ts:89 需确认 - Think Before Coding

**观察**：timeout 设为 5s
**疑问**：是否有隐藏假设？
**需要**：确认上游服务超时配置
**建议**：查阅 API 文档或咨询下游负责人
```

---

## ✅ 良好实践

符合四原则的做法。

```markdown
✅ [文件:行号] 良好实践 - [原则名称]

**做法**：[具体设计或实现]
**体现原则**：[如何体现四原则]
**值得学习**：[适用场景]

示例：
✅ payment.ts:89 良好实践 - Think Before Coding

**做法**：添加了 `// Assumption: userId exists and is valid` 注释
**体现原则**：Think Before Coding - 假设明确陈述
**值得学习**：所有有隐含假设的场景

示例：
✅ order.ts:89 良好实践 - Simplicity First

**做法**：用 20 行直接实现订单处理，无抽象层
**体现原则**：Simplicity First - 最小代码解决问题
**值得学习**：简单场景保持简单

示例：
✅ login.ts:89 良好实践 - Surgical Changes

**做法**：只修改了 login.ts 相关代码，未改动 signup.ts
**体现原则**：Surgical Changes - 只触碰必须的
**值得学习**：所有修复任务

示例：
✅ payment.ts 良好实践 - Goal-Driven Execution

**做法**：有明确的 `[Step] → verify: [check]` 计划
**体现原则**：Goal-Driven Execution - 明确计划与验证
**值得学习**：所有多步骤任务
```

---

## 升级边界判断

### Think Before Coding 问题何时升级

```markdown
判断标准：
"假设未明确陈述但足够安全" → Recommended
"隐藏假设可能导致行为风险" → Blocking
"未解决困惑可能导致风险" → Blocking
```

### Simplicity First 问题何时升级

```markdown
判断标准：
"过度工程（规模不匹配）" → Recommended
"过度工程导致无法验证" → Blocking
"臃肿抽象（单一用途）" → Recommended
"臃肿抽象掩盖行为问题" → Blocking
"推测性设计" → Recommended（通常不升级）
```

### Surgical Changes 问题何时升级

```markdown
判断标准：
"越界改动无行为变化" → Recommended
"越界改动导致行为变化" → Blocking
"删除不理解代码可能导致风险" → Blocking
"风格不匹配" → Recommended（通常不升级）
```

### Goal-Driven Execution 问题何时升级

```markdown
判断标准：
"无验证" → Recommended（通常不升级）
"无成功标准" → Optional
"无计划（多步骤任务）" → Recommended
```