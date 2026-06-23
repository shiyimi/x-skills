# 合并门禁：四原则确认清单

合并前必须确认四原则关键违背已处理。

---

## 基础门禁

### 1. 🔴 Blocking 已处理

所有 Blocking 问题必须：
- 已修复并验证
- 或有明确理由暂时接受风险（需记录）

```markdown
✅ 所有 Blocking 已处理
   - #1 Think Before Coding - 隐藏假设：已添加 userId 检查
   - #2 Surgical Changes - 删除不理解代码：已恢复注释
   - #3 Simplicity First - 过度工程影响验证：已简化核心逻辑

❌ Blocking 未处理
   - #1 Think Before Coding - 隐藏假设：未处理
   → 不建议合并，假设错误可能导致行为异常
```

### 2. CI 状态通过

- 测试通过
- 构建成功
- 类型检查通过（如有）
- 代码质量检查通过（如有）

```markdown
✅ CI 状态
   - 单元测试：✅ 42 passed
   - 构建检查：✅ 无报错
   - TypeScript：✅ 类型检查通过

❌ CI 状态
   - 单元测试：❌ 2 failed
   → 不建议合并
```

### 3. 关键路径验证

高风险改动必须有验证证据：

```markdown
✅ 关键路径验证
   - 支付流程：已在 staging 环境验证完整流程
   - Think Before Coding 假设：已确认 userId 存在性假设处理正确
   - Simplicity First 简化：已验证简化后行为与之前一致

❌ 关键路径验证
   - 支付流程：未在 staging 环境验证
   - Goal-Driven Execution 违背：无验证证据
   → 需补充验证
```

---

## 四原则门禁

### Think Before Coding 门禁

```markdown
✅ Think Before Coding 门禁
   - 隐藏假设：已明确陈述或添加检查
   - 未解决困惑：已恢复不理解但有价值的代码
   - 权衡分析：已有明确选择理由（如有重要选择）

❌ Think Before Coding 门禁
   - 隐藏假设：未处理
   → 不建议合并，假设错误可能导致行为异常
```

### Simplicity First 门禁

```markdown
✅ Simplicity First 门禁
   - 过度工程影响验证：已简化
   - 臃肿抽象掩盖问题：已简化
   - 过度工程（规模不匹配）：可后置或已处理
   - 推测性设计：可后置或已删除

❌ Simplicity First 门禁
   - 过度工程影响验证：未处理
   → 不建议合并，无法验证行为正确性
```

### Surgical Changes 门禁

```markdown
✅ Surgical Changes 门禁
   - 删除不理解代码导致风险：已恢复
   - 越界改动导致行为变化：已回退
   - 越界改动：已回退或可接受
   - 风格不匹配：已匹配或可接受

❌ Surgical Changes 门禁
   - 删除不理解代码导致风险：未恢复
   → 不建议合并，可能导致后续维护风险
   - 越界改动导致行为变化：未回退
   → 不建议合并，引入了未预期的行为变化
```

### Goal-Driven Execution 门禁

```markdown
✅ Goal-Driven Execution 门禁
   - 无验证：已补充验证或测试
   - 无计划（多步骤任务）：已有明确计划或可后置

❌ Goal-Driven Execution 门禁
   - 无验证：未补充
   → 建议处理后再合并，无法确认改动有效
```

---

## Recommended 问题处理

🟡 Recommended 问题可酌情后置，但需满足：

### 可后置条件

1. 风险可控：不会导致行为异常或维护风险
2. 有明确计划：已记录到 backlog 或 issue
3. 影响范围明确：知道不处理会带来什么后果

```markdown
✅ Recommended 可后置
   - #1 Simplicity First - 推测性设计：风险可控，计划下个迭代删除
   - #2 Goal-Driven Execution - 无验证（低风险改动）：可后置，已记录 issue

❌ Recommended 需本次处理
   - #3 Surgical Changes - 越界改动：可能影响后续评审，需本次回退
```

---

## 评审者确认清单

合并前评审者应确认：

```markdown
## 合并确认

### Blocking
- [ ] 所有 🔴 Blocking 已处理或有明确风险接受记录

### 四原则门禁
- [ ] Think Before Coding：隐藏假设已处理
- [ ] Simplicity First：影响验证的过度工程已处理
- [ ] Surgical Changes：删除不理解代码已恢复，越界改动已回退
- [ ] Goal-Driven Execution：高风险改动有验证

### CI
- [ ] 测试通过
- [ ] 构建成功
- [ ] 类型检查通过（如有）

### Recommended
- [ ] 🟡 Recommended 已处理或有明确后置计划

### 文档
- [ ] PR 描述完整准确
- [ ] 重要假设或权衡有说明

### 结论
- [ ] 合并 ✅
- [ ] 有条件合并 ⚠️（需确认）
- [ ] 不合并 ❌（需处理）
```

---

## 合并后责任

合并不代表评审结束。评审者应：

1. 跟踪 Recommended 问题是否按计划处理
2. 关注合并后是否有异常反馈
3. 发现回归时及时回滚或修复

合并是开始，不是结束。

---

## 门禁优先级总结

```markdown
门禁优先级：

1. Think Before Coding
   → 隐藏假设导致行为风险 → 必须处理
   → 未解决困惑导致风险 → 必须处理

2. Simplicity First
   → 过度工程导致无法验证 → 必须处理
   → 臃肿抽象掩盖行为问题 → 必须处理

3. Surgical Changes
   → 删除不理解代码导致风险 → 必须处理
   → 越界改动导致行为变化 → 必须处理

4. Goal-Driven Execution
   → 无验证（高风险改动） → 建议处理后再合并
```