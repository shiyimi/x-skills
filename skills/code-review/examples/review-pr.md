# 评审示例：PR #123 - 支付流程重构

## 评审场景

用户请求评审 PR #123，改动为重构支付流程，涉及 3 个文件：
- `payment.ts`：新增退款逻辑
- `order.ts`：修改订单状态处理
- `api/payment.ts`：新增退款 API

---

## 评审输出

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）

🔴 payment.ts:89 Think Before Coding - 隐藏假设

**证据**：`await fetchUser(userId)` 直接使用 userId
**假设**：userId 存在且有效
**风险场景**：userId 为空时行为不确定，可能导致崩溃或异常
**建议**：添加 userId 有效性检查，或明确标注假设并处理边界

🔴 api/payment.ts:45 Think Before Coding - 隐藏假设

**证据**：`refundAmount = req.body.amount` 直接使用用户输入
**假设**：用户输入的退款金额合法
**风险场景**：恶意请求可能申请超出原订单金额的退款
**建议**：添加金额校验，确保退款金额不超过原订单实付金额

🔴 payment.ts:89 Simplicity First - 过度工程影响验证

**证据**：processRefund() 200 行，引入 Strategy、Factory、Observer 模式
**问题**：核心退款逻辑被多层抽象包裹，无法追踪数据流
**影响**：无法验证退款处理各步骤的行为正确性
**建议**：删除抽象层，直接实现核心退款逻辑，待场景复杂后再抽象

**数量**：3 个（Think Before Coding 2，Simplicity First 1）
**阻塞原因**：隐藏假设可能导致行为异常或安全漏洞，过度工程导致无法验证行为正确性

---

### 🟡 建议修复（Recommended）

🟡 payment.ts:120 Simplicity First - 臃肿抽象

**证据**：引入 abstract class RefundStrategy + 2 个实现类
**问题**：每种退款逻辑仅 10-20 行，且当前只有 1 种退款类型
**影响**：抽象比实现更复杂，为单一场景引入多态
**建议**：用条件分支代替，待退款类型超过 2 种后再抽象

**测试**：Would a senior engineer say this is overcomplicated? Yes → simplify.

🟡 order.ts:67 Think Before Coding - 权衡缺失

**证据**：并发退款时使用乐观锁但未说明为何选择乐观锁
**问题**：存在悲观锁等替代方案但未呈现权衡
**建议**：补充权衡分析：乐观锁适合读多写少场景，悲观锁适合写多场景

🟡 api/payment.ts:89 Surgical Changes - 越界改动

**证据**：修改了 signup.ts 的命名风格（文件不在改动列表中）
**问题**：signup.ts 与退款功能无关，属于越界改动
**影响**：引入了无关改动
**建议**：回退 signup.ts 改动

**测试**：Every changed line should trace directly to the user's request. signup.ts 改动无法追溯到"退款功能"请求 → revert.

🟡 payment.ts Goal-Driven Execution - 无验证

**证据**：PR 描述"新增退款功能"但无验证证据
**问题**：宣称完成但未验证退款流程是否正常
**影响**：无法确认退款功能有效
**建议**：补充退款流程测试，覆盖正常退款、并发退款、边界金额等场景

**数量**：4 个（Simplicity First 1，Think Before Coding 1，Surgical Changes 1，Goal-Driven Execution 1）
**处理建议**：建议本次处理 #3 越界改动，其余可后置

---

### 🔵 可选改进（Optional）

🔵 payment.ts Goal-Driven Execution - 验证可自动化

**现状**：建议手动验证退款流程
**优化方向**：添加自动化测试覆盖退款流程
**建议**：补充自动化测试覆盖退款场景

**数量**：1 个
**处理建议**：建议后续迭代处理

---

### ✅ 良好实践

✅ payment.ts:45 良好实践 - Think Before Coding

**做法**：添加了 `// Assumption: order.status is not 'refunded'` 注释
**体现原则**：Think Before Coding - 假设明确陈述
**值得学习**：所有有隐含假设的场景

✅ api/payment.ts:89 良好实践 - Surgical Changes

**做法**：只修改了 payment 相关代码，未改动其他模块
**体现原则**：Surgical Changes - 只触碰必须的
**值得学习**：所有新增功能任务

---

### ❓ 不确定点

❓ payment.ts:78 需确认 - Think Before Coding

**观察**：退款超时设为 30s
**疑问**：是否有隐藏假设？
**需要**：确认上游支付系统超时配置
**建议**：查阅支付 API 文档或咨询支付团队

---

### 📝 总结

**四原则评估**：
- Think Before Coding：❌ 存在隐藏假设，合并前必须处理
- Simplicity First：❌ 过度工程影响验证，合并前必须简化
- Surgical Changes：⚠️ 存在越界改动，建议回退
- Goal-Driven Execution：⚠️ 缺少验证，建议补充

**合并建议**：❌ 不建议合并，需先处理 3 个 Blocking 问题

**残余风险**：
- Simplicity First 臃肿抽象未处理，后续维护成本较高（🟡）
- Goal-Driven Execution 无验证未处理，无法确认退款功能有效（🟡）

**未评审区域**：
- tests/*.test.ts（Think Before Coding 已扫查关键假设）
- docs/*.md（Surgical Changes 已确认无越界改动）
```

---

# 评审示例：PR #124 - 登录 bug 修复

## 评审场景

用户请求评审 PR #124，改动为修复登录 bug，涉及 2 个文件：
- `login.ts`：修复登录验证逻辑
- `signup.ts`：被修改但不在任务范围

---

## 评审输出

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）

🔴 signup.ts:89 Surgical Changes - 越界改动导致行为变化

**证据**：修改了 signup.ts 的验证逻辑，增加了邮箱格式检查
**任务范围**：修复登录 bug
**越界改动**：signup.ts 与登录无关，邮箱格式检查属于注册逻辑
**行为变化**：注册流程验证规则变化，可能导致现有用户无法注册
**建议**：回退 signup.ts 改动，只保留 login.ts 相关修改

**数量**：1 个（Surgical Changes 1）
**阻塞原因**：越界改动导致行为变化，引入了未预期的注册流程变化

---

### 🟡 建议修复（Recommended）

🟡 login.ts:89 Think Before Coding - 权衡缺失

**证据**：使用 localStorage 存储登录状态但未说明为何选择 localStorage
**问题**：存在 sessionStorage、cookie 等替代方案但未呈现权衡
**建议**：补充权衡分析：localStorage 持久化登录状态，sessionStorage 仅会话内有效

🟡 login.ts Goal-Driven Execution - 无验证

**证据**：PR 描述"修复了登录 bug"但无验证证据
**问题**：无测试覆盖登录流程或边界场景
**影响**：无法确认 bug 已修复
**建议**：补充测试覆盖登录流程和原 bug 场景

**数量**：2 个（Think Before Coding 1，Goal-Driven Execution 1）
**处理建议**：建议本次处理 #2 无验证，#1 权衡缺失可后置

---

### 🔵 可选改进（Optional）

无

---

### ✅ 良好实践

✅ login.ts:89 良好实践 - Surgical Changes

**做法**：login.ts 只修改了登录验证相关代码
**体现原则**：Surgical Changes - 只触碰必须的
**值得学习**：所有 bug 修复任务

---

### ❓ 不确定点

无

---

### 📝 总结

**四原则评估**：
- Think Before Coding：⚠️ 存在权衡缺失，可后置
- Simplicity First：✅ 无过度工程
- Surgical Changes：❌ 存在越界改动导致行为变化，合并前必须回退
- Goal-Driven Execution：⚠️ 缺少验证，建议补充

**合并建议**：❌ 不建议合并，需先回退 signup.ts 越界改动

**残余风险**：
- Think Before Coding 权衡缺失未处理，后续可能需要重新选择存储方案（🟡）
- Goal-Driven Execution 无验证未处理，无法确认 bug 已修复（🟡）

**未评审区域**：无（改动规模较小，完整评审）

---

## 合并确认

### Blocking
- [ ] 🔴 Surgical Changes - 越界改动导致行为变化：未回退

### 四原则门禁
- [ ] Think Before Coding：权衡缺失可后置
- [ ] Simplicity First：✅ 无问题
- [x] Surgical Changes：越界改动导致行为变化需回退 → 未回退
- [ ] Goal-Driven Execution：无验证建议处理后再合并

### CI
- [x] 测试通过
- [x] 构建成功

### 结论
- [ ] 合并 ✅
- [ ] 有条件合并 ⚠️
- [x] 不合并 ❌（需回退 signup.ts 越界改动）
```

---

# 评审示例：PR #125 - UI 组件优化

## 评审场景

用户请求评审 PR #125，改动为优化列表组件渲染性能，涉及 2 个文件：
- `components/List.tsx`：添加虚拟化
- `hooks/useListData.ts`：优化数据获取

---

## 评审输出

```markdown
## 📋 评审结论

### 🔴 必须修复（Blocking）

无

---

### 🟡 建议修复（Recommended）

🟡 hooks/useListData.ts:34 Think Before Coding - 隐藏假设

**证据**：`useEffect(() => { fetchData() }, [filters])` 串行发起请求
**假设**：filters 不会快速连续变化
**风险场景**：用户快速切换筛选条件时，前几次请求结果可能被覆盖
**影响**：浪费资源，可能显示过时数据
**建议**：添加 debounce 或取消上次请求

🟡 components/List.tsx:89 Simplicity First - 推测性设计

**证据**：添加了 `locale`、`theme` 配置选项
**问题**：用户未请求国际化或主题配置功能
**推测场景**：假设未来可能国际化
**建议**：删除未请求功能，待实际需求出现后再添加

🟡 components/List.tsx Goal-Driven Execution - 无验证

**证据**：PR 描述"优化了渲染性能"但无性能验证证据
**问题**：宣称完成但未验证渲染性能是否改善
**影响**：无法确认优化有效
**建议**：补充性能基准对比，或添加性能测试

**数量**：3 个（Think Before Coding 1，Simplicity First 1，Goal-Driven Execution 1）
**处理建议**：建议本次处理，风险可控但影响用户体验

---

### 🔵 可选改进（Optional）

🔵 components/List.tsx:120 Goal-Driven Execution - 验证可自动化

**现状**：建议手动验证渲染流畅度
**优化方向**：添加性能测试覆盖大数据量场景
**建议**：补充自动化性能测试

**数量**：1 个
**处理建议**：建议后续迭代处理

---

### ✅ 良好实践

✅ components/List.tsx:89 良好实践 - Simplicity First

**做法**：虚拟化只对超过 50 条数据启用，小列表保持原生渲染
**体现原则**：Simplicity First - 最小代码解决问题，不过度优化简单场景
**值得学习**：性能优化场景

✅ hooks/useListData.ts:89 良好实践 - Goal-Driven Execution

**做法**：有明确的 `[Step] → verify: [check]` 计划
**体现原则**：Goal-Driven Execution - 明确计划与验证
**值得学习**：所有多步骤任务

✅ components/List.tsx Surgical Changes - 良好实践

**做法**：只修改了 List.tsx 和 useListData.ts，未改动其他组件
**体现原则**：Surgical Changes - 只触碰必须的
**值得学习**：所有优化任务

---

### ❓ 不确定点

无

---

### 📝 总结

**四原则评估**：
- Think Before Coding：⚠️ 存在隐藏假设，建议处理
- Simplicity First：⚠️ 存在推测性设计，建议删除未请求功能
- Surgical Changes：✅ 无越界改动
- Goal-Driven Execution：⚠️ 缺少验证，建议补充

**合并建议**：⚠️ 有条件合并，建议处理 Recommended 问题后再合并

**残余风险**：无

**未评审区域**：无（改动规模较小，完整评审）

---

## 合并确认

### Blocking
- [x] 无 🔴 Blocking

### 四原则门禁
- [x] Think Before Coding：隐藏假设可控，建议处理
- [x] Simplicity First：推测性设计可控，建议处理
- [x] Surgical Changes：✅ 无问题
- [ ] Goal-Driven Execution：无验证建议处理后再合并

### CI
- [x] 测试通过
- [x] 构建成功
- [x] TypeScript 类型检查通过

### 验证
- [x] 已在 staging 环境验证 1000+ 条列表渲染流畅

### Recommended
- [ ] 🟡 Recommended 建议处理后再合并

### 结论
- [ ] 合并 ✅
- [x] 有条件合并 ⚠️（建议处理 Recommended）
- [ ] 不合并 ❌
```