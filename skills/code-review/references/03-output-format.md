# 输出格式：四原则结构化输出

按 Karpathy 四原则输出评审结论，而非碎片化评论。

## 标准输出结构

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）

[列出所有原则违背导致实际风险的问题]

**数量**：X 个
**阻塞原因**：[说明违背了哪些原则导致何种风险]

---

### 🟡 建议修复（Recommended）

[列出所有原则违背但风险可控的问题]

**数量**：X 个
**处理建议**：[说明是否可后置，按原则优先级]

---

### 🔵 可选改进（Optional）

[列出所有原则可以更好遵循但非必须的问题]

**数量**：X 个
**处理建议**：建议后续迭代处理

---

### ✅ 良好实践

[列出符合四原则的良好做法]

---

### ❓ 不确定点

[列出需要确认的假设或困惑]

---

### 📝 总结

**四原则评估**：
- Think Before Coding：[整体判断]
- Simplicity First：[整体判断]
- Surgical Changes：[整体判断]
- Goal-Driven Execution：[整体判断]

**合并建议**：
- ✅ 可以合并：无 Blocking，Recommended 已处理或有明确后置计划
- ⚠️ 有条件合并：Blocking 已处理，Recommended 建议处理后再合并
- ❌ 不建议合并：存在未处理的 Blocking 问题

**残余风险**：[已知但本次不处理的风险]

**未评审区域**：[如有大改动，标注未完整评审的区域]
```

---

## 问题格式：原则标注

每个问题必须标注违背的原则：

```markdown
[严重度标记] [文件路径:行号] [原则名称] - [问题类型]

**证据**：[具体代码片段或行为描述]
**问题**：[违背原则的具体点]
**影响/风险**：[实际影响]
**建议**：[修复方向]

示例：
🔴 payment.ts:89 Think Before Coding - 隐藏假设

**证据**：`await fetchUser(userId)` 直接使用 userId
**问题**：假设 userId 存在且有效，但未明确陈述或检查
**风险**：userId 为空时行为不确定
**建议**：添加 userId 有效性检查或明确标注假设

🟡 processor.ts:89-150 Simplicity First - 过度工程

**证据**：100 行代码实现 20 行能做的事
**问题**：解决方案比问题更复杂
**影响**：维护成本增加
**建议**：删除抽象，直接实现

🟡 signup.ts:89 Surgical Changes - 越界改动

**证据**：修改了 signup.ts 命名风格
**问题**：改动无法追溯到"修复登录 bug"请求
**影响**：引入了无关改动
**建议**：回退 signup.ts 改动

🟡 payment.ts Goal-Driven Execution - 无验证

**证据**：宣称"修复了支付 bug"但无验证证据
**问题**：无验证或成功标准
**影响**：无法确认修复有效
**建议**：补充测试或验证证据
```

---

## 输出要求

### 原则标注必须

每个问题必须标注违背的原则：

```markdown
❌ 🔴 order.ts:89 行为错误
   → 缺少原则标注，无法判断违背了什么原则

✅ 🔴 order.ts:89 Think Before Coding - 隐藏假设
   → 标注原则，明确违背了 Think Before Coding
```

### 证据具体

```markdown
❌ "代码有点复杂" → 无证据
✅ "processOrder() 500 行，引入 Strategy、Factory、Observer 模式" → 具体证据

❌ "改动了不该改的" → 无证据
✅ "signup.ts 命名改动无法追溯到'修复登录 bug'请求" → 具体证据
```

### 追溯测试

```markdown
Surgical Changes 问题必须说明：
"Every changed line should trace directly to the user's request."

✅ signup.ts 改动无法追溯到请求 → Surgical Changes 违背

Simplicity First 问题必须说明：
"Would a senior engineer say this is overcomplicated?"

✅ 抽象比实现更复杂，senior engineer 会说过度复杂 → Simplicity First 违背
```

### 建议方向明确

```markdown
❌ "应该优化" → 无方向
✅ "删除抽象层，直接实现核心逻辑" → 明确方向

❌ "应该检查" → 无方向
✅ "添加 userId 有效性检查" → 明确方向
```

---

## 数量说明：按原则分组

每个类别结尾应说明数量和原则分布：

```markdown
### 🔴 必须修复（Blocking）

1. 🔴 payment.ts:89 Think Before Coding - 隐藏假设
2. 🔴 utils.ts:89 Surgical Changes - 删除不理解代码
3. 🔴 processor.ts:89 Simplicity First - 过度工程影响验证

**数量**：3 个（Think Before Coding 1，Simplicity First 1，Surgical Changes 1）
**阻塞原因**：隐藏假设可能导致行为异常，删除不理解代码可能导致风险，过度工程导致无法验证
```

```markdown
### 🟡 建议修复（Recommended）

1. 🟡 config.ts:89 Simplicity First - 推测性设计
2. 🟡 signup.ts:89 Surgical Changes - 越界改动
3. 🟡 payment.ts Goal-Driven Execution - 无验证

**数量**：3 个（Simplicity First 1，Surgical Changes 1，Goal-Driven Execution 1）
**处理建议**：建议本次处理 #2 越界改动，其余可后置
```

---

## 总结格式：四原则评估

总结必须包含四原则整体评估：

```markdown
### 📝 总结

**四原则评估**：
- Think Before Coding：❌ 存在隐藏假设，合并前必须明确处理
- Simplicity First：⚠️ 存在过度工程，建议简化
- Surgical Changes：⚠️ 存在越界改动，建议回退
- Goal-Driven Execution：⚠️ 缺少验证，建议补充

**合并建议**：❌ 不建议合并，需先处理 3 个 Blocking 问题

**残余风险**：
- Simplicity First 推测性设计未处理，后续可能增加维护成本（🟡）
- Goal-Driven Execution 无验证未处理，无法确认修复有效（🟡）

**未评审区域**：
- tests/*.test.ts（Think Before Coding 已扫查关键假设）
- docs/*.md（Surgical Changes 已确认无越界改动）
```

---

## 快速输出模板

小改动（< 50 行）可使用简化模板：

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）
[无 / 列出原则违背问题]

### 🟡 建议修复（Recommended）
[无 / 列出原则违背问题]

### 🔵 可选改进（Optional）
[列出原则优化建议]

### 📝 总结

**四原则评估**：Think Before Coding ✅ / Simplicity First ✅ / Surgical Changes ✅ / Goal-Driven Execution ✅
**合并建议**：✅ 可以合并
```

---

## 输出时机

评审过程中可输出中间发现，但最终结论必须完整输出标准结构。

不要只输出部分发现就结束，必须给出完整分类和四原则评估总结。