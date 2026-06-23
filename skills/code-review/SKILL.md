---
name: code-review
description: Use when receiving code review requests, reviewing pull requests, evaluating implementation quality, or before merging changes. Invoke when user says 代码评审、review、评审代码、检查代码质量、review PR or wants to verify work meets requirements.
---

# 代码评审（Karpathy 四原则）

基于 Andrej Karpathy 的 LLM 编码实践四原则评审代码质量。

评审目标是发现四原则违背问题，而非风格争论。

## 四原则

| 原则 | 核心要求 | 评审重点 |
|-----|---------|---------|
| **Think Before Coding** | 不假设、不隐藏困惑、呈现权衡、必要时阻止 | 隐藏假设、未解决的困惑、缺失权衡分析 |
| **Simplicity First** | 最小代码、无推测性设计、无过度抽象 | 过度工程、臃肿抽象、超出需求的功能 |
| **Surgical Changes** | 只触碰必须的、只清理自己的问题、匹配现有风格 | 越界改动、驱离重构、删除不理解的代码 |
| **Goal-Driven Execution** | 定义成功标准、验证循环、计划明确 | 无验证、无成功标准、计划缺失 |

## 适用范围

- Pull Request 评审
- 实现质量验证（尤其 AI 生成的代码）
- 重构方案评审
- 合并前质量门禁

不要用于：纯风格争论、个人偏好讨论、无具体代码的泛泛建议。

## 默认动作

1. 先读 `references/00-core-principles.md` 理解四原则定义。
2. 按四原则顺序评审改动。
3. 按 `references/01-review-checklist.md` 扫查违背信号。
4. 按 `references/02-issue-classification.md` 分类问题严重度。
5. 按 `references/03-output-format.md` 输出结构化结论。
6. 合并前过 `references/04-merge-gates.md` 确认门禁。

## 输出结构

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）
[违背 Think Before Coding 或 Simplicity First 导致行为风险]

### 🟡 建议修复（Recommended）
[Simplicity First 或 Surgical Changes 问题]

### 🔵 可选改进（Optional）
[Goal-Driven Execution 优化建议]

### ✅ 良好实践
[符合四原则的做法]

### ❓ 不确定点
[需要确认的假设或困惑]

### 📝 总结
[四原则评估、合并建议、残余风险]
```

## 快速判断校准

| 信号 | 原则 | 严重度 |
|-----|-----|--------|
| 隐藏假设导致行为风险 | Think Before Coding | 🔴 Blocking |
| 过度工程导致难以验证 | Simplicity First | 🔴/🟡 |
| 越界改动删除不理解的代码 | Surgical Changes | 🔴 Blocking |
| 臃肿抽象（1000行做100行的事） | Simplicity First | 🟡 Recommended |
| 驱离重构"顺便改进" | Surgical Changes | 🟡 Recommended |
| 无验证或成功标准缺失 | Goal-Driven Execution | 🔵 Optional |

## 评审反模式

### ❌ 把 Optional 写成 Blocking

```markdown
❌ 🔴 命名应该用 camelCase
   → 这是风格问题，不是原则违背

❌ 🔴 这个函数需要加注释
   → 这是 Readability，Karpathy 四原则不覆盖

✅ 🔴 删除了不理解的注释，可能导致后续维护困难
   → 这是 Surgical Changes 违背，Blocking
```

### ❌ 忽略驱离改动

```markdown
❌ "顺便重构了相邻代码"
   → Surgical Changes 违背，必须标注

✅ 🟡 Surgical Changes - 越界改动
   → 改动了与任务无关的相邻代码
```

## 质量底线

- 不忽略隐藏假设问题
- 不忽略越界改动问题
- 不忽略过度工程问题
- 不把风格问题写成 Blocking