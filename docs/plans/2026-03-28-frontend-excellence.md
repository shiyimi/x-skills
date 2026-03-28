# Frontend Excellence Implementation Plan

> **执行要求：** 必须使用 `superpowers:executing-plans` 按任务逐步执行本计划。

**目标：** 为仓库新增 `frontend-excellence` 前端 skill 与 `frontend-excellence-shell` 薄 prompt 壳，形成一套中文化、可扩展、以复杂度治理为核心的前端能力体系。

**架构：** 采用“核心 skill + 分专题 references + 薄 prompt shell”的结构。先落四个核心文件建立哲学、门禁、路由与复杂度制度，再补评审 / 重构 / 调试专题与 React / Next.js 适配层，最后补其余专题、示例与 README 登记。

**技术栈：** Markdown、Codex Skill 目录结构、仓库内 `prompts/` 与 `skills/` 双轨组织方式。

---

### 任务 1：搭建目录骨架并落主 skill 文件

**文件：**
- 创建：`skills/frontend-excellence/SKILL.md`
- 创建：`skills/frontend-excellence/references/`
- 创建：`skills/frontend-excellence/examples/`

**步骤 1：创建目录骨架**

执行：

```powershell
New-Item -ItemType Directory -Force 'e:\workspace\x-skills\skills\frontend-excellence\references' | Out-Null
New-Item -ItemType Directory -Force 'e:\workspace\x-skills\skills\frontend-excellence\examples' | Out-Null
```

预期：

- 两个目录成功创建
- 不影响其他 skill 目录

**步骤 2：编写 `SKILL.md` 初稿**

写入以下核心部分：

- frontmatter：`name`、中文 `description`
- 目标说明
- 核心工作流
- 必读核心 references
- 任务分类
- 按任务加载 reference 的规则
- 必过门禁摘要
- 输出契约
- React / Next.js 适配声明

**步骤 3：自检 `SKILL.md` 是否越权**

检查：

- 是否把自己写成了百科全书
- 是否重复展开了专题 reference 的细节
- 是否明确把具体规则分发给 `references/*.md`

**步骤 4：记录阶段性提交点**

准备提交范围：

```powershell
git add 'skills/frontend-excellence/SKILL.md'
```

建议提交信息：

```text
feat: scaffold frontend-excellence skill
```

### 任务 2：落核心哲学与门禁层

**文件：**
- 创建：`skills/frontend-excellence/references/00-core-principles.md`
- 创建：`skills/frontend-excellence/references/01-quality-gates.md`

**步骤 1：编写 `00-core-principles.md`**

至少覆盖以下内容：

- 使命定义
- 默认优先级顺序
- 对“完美主义”的边界说明
- 不能被优化掉的底线
- 默认工程方向：简单优于聪明、显式优于隐式、删除优于堆叠、证据优于感觉

**步骤 2：编写 `01-quality-gates.md`**

至少覆盖以下内容：

- 宣称完成前的硬性要求
- 结构门禁
- 体验门禁
- 性能门禁
- 验证门禁
- 风险与回滚门禁
- 评审、重构、调试的补充门禁
- 明确失败条件

**步骤 3：检查两份文件是否职责混淆**

检查：

- `00-core-principles.md` 是否过度展开执行细节
- `01-quality-gates.md` 是否在重复讲哲学

**步骤 4：运行最小存在性检查**

执行：

```powershell
Get-Item 'e:\workspace\x-skills\skills\frontend-excellence\references\00-core-principles.md'
Get-Item 'e:\workspace\x-skills\skills\frontend-excellence\references\01-quality-gates.md'
```

预期：

- 两个文件存在

### 任务 3：落任务路由与复杂度制度层

**文件：**
- 创建：`skills/frontend-excellence/references/02-task-routing.md`
- 创建：`skills/frontend-excellence/references/03-simplification-discipline.md`

**步骤 1：编写 `02-task-routing.md`**

至少覆盖以下内容：

- 七类主要任务模式
- 每类模式的典型触发语句
- 每类模式的前置判断
- 每类模式要读取的附加 references
- 二级关注点处理方式
- 常见路由误判

**步骤 2：编写 `03-simplification-discipline.md`**

至少覆盖以下内容：

- 默认决策顺序
- 抽象准入规则
- 复杂度触发器
- 简化操作顺序
- 前端反模式黑名单
- 最终输出必须说明的简化结果

**步骤 3：检查两份文件是否形成闭环**

检查：

- `02-task-routing.md` 是否定义了何时进入简化优先
- `03-simplification-discipline.md` 是否能被所有任务模式复用

**步骤 4：运行文本检查**

执行：

```powershell
Get-Content -Raw 'e:\workspace\x-skills\skills\frontend-excellence\references\02-task-routing.md'
Get-Content -Raw 'e:\workspace\x-skills\skills\frontend-excellence\references\03-simplification-discipline.md'
```

预期：

- 文案完整输出
- 中文显示正常

### 任务 4：补评审 / 重构 / 调试专题

**文件：**
- 创建：`skills/frontend-excellence/references/16-review-refactor-debug.md`

**步骤 1：编写评审模式规则**

至少覆盖以下内容：

- findings-first 输出
- 严重级别排序
- 结构问题视为真实问题而非样式建议
- 缺少测试、缺少状态处理、复杂度堆叠的判定方式

**步骤 2：编写重构模式规则**

至少覆盖以下内容：

- 先减复杂度，再做美化
- 先删旧路径，再留新路径
- 明确行为保持与行为变化边界
- 明确回滚点

**步骤 3：编写调试模式规则**

至少覆盖以下内容：

- 现象与假设分离
- 证据优先于猜测
- 根因未证实时不得装作已确认
- 修复建议与止血方案区分

**步骤 4：执行存在性检查**

执行：

```powershell
Get-Item 'e:\workspace\x-skills\skills\frontend-excellence\references\16-review-refactor-debug.md'
```

预期：

- 文件创建成功

### 任务 5：补 React / Next.js 适配层

**文件：**
- 创建：`skills/frontend-excellence/references/30-react-next-adapter.md`

**步骤 1：编写 React / Next.js 适配规则**

至少覆盖以下内容：

- 组件、Hook、事件命名约定
- `useEffect` 的误用边界
- 派生状态与冗余状态边界
- `memo`、`useMemo`、`useCallback` 只在有证据时使用
- 客户端与服务端边界意识
- 在不污染核心哲学前提下承接 React / Next.js 细则

**步骤 2：检查适配层是否越权**

检查：

- 是否把 React 专项规则写回核心哲学
- 是否把所有前端都硬套成 React 问题

**步骤 3：运行文本检查**

执行：

```powershell
Get-Content -Raw 'e:\workspace\x-skills\skills\frontend-excellence\references\30-react-next-adapter.md'
```

预期：

- 中文正文正常
- 关键技术术语保留英文

### 任务 6：补组件、状态、性能、交互、视觉、验证专题

**文件：**
- 创建：`skills/frontend-excellence/references/10-component-architecture.md`
- 创建：`skills/frontend-excellence/references/11-state-data-effects.md`
- 创建：`skills/frontend-excellence/references/12-rendering-performance.md`
- 创建：`skills/frontend-excellence/references/13-accessibility-interaction.md`
- 创建：`skills/frontend-excellence/references/14-styling-visual-quality.md`
- 创建：`skills/frontend-excellence/references/15-testing-verification-rollbacks.md`

**步骤 1：先写组件与状态两份**

优先完成：

- 组件边界、组合、责任归属、props 设计
- 服务端状态、本地状态、URL 状态、派生状态、副作用

**步骤 2：再写性能与交互两份**

至少覆盖：

- 渲染成本、虚拟化、惰性加载、证据驱动优化
- 语义、键盘、焦点、反馈、部分完成态

**步骤 3：最后写视觉与验证两份**

至少覆盖：

- 信息层级、布局、响应式、交互质感、避免平庸 AI 风格
- 验证策略、未执行项披露、最小可回滚说明

**步骤 4：运行批量存在性检查**

执行：

```powershell
Get-ChildItem 'e:\workspace\x-skills\skills\frontend-excellence\references'
```

预期：

- `00` 到 `16` 与 `30` 系列文件齐全

### 任务 7：编写薄 prompt shell

**文件：**
- 创建：`prompts/frontend-excellence-shell.md`

**步骤 1：编写 prompt shell**

仅保留以下内容：

- 角色人格
- 触发场景
- 极少数不可协商原则
- 把具体规则交给 `frontend-excellence`

**步骤 2：检查 shell 是否变厚**

检查：

- 是否重复展开了 skill 正文
- 是否写成了第二份规范
- 是否保留了“默认先删减、收拢、归位逻辑”的总原则

**步骤 3：运行文本检查**

执行：

```powershell
Get-Content -Raw 'e:\workspace\x-skills\prompts\frontend-excellence-shell.md'
```

预期：

- 正文为中文
- 技术标识保留必要英文

### 任务 8：补 examples 并更新 README

**文件：**
- 创建：`skills/frontend-excellence/examples/build-page.md`
- 创建：`skills/frontend-excellence/examples/refactor-component.md`
- 创建：`skills/frontend-excellence/examples/review-performance.md`
- 创建：`skills/frontend-excellence/examples/polish-ui.md`
- 修改：`README.md`

**步骤 1：补四个触发示例**

示例应覆盖：

- 页面实现
- 组件重构
- 性能评审
- UI 打磨

**步骤 2：更新 README**

至少补充：

- 新 skill 的用途
- 入口文件
- 关键 references
- 维护方式

**步骤 3：执行最终存在性检查**

执行：

```powershell
Get-ChildItem -Recurse 'e:\workspace\x-skills\skills\frontend-excellence'
Get-Content -Raw 'e:\workspace\x-skills\README.md'
```

预期：

- skill 目录结构完整
- README 已登记 `frontend-excellence`

### 任务 9：执行最终校验与收尾

**文件：**
- 检查：`skills/frontend-excellence/**`
- 检查：`prompts/frontend-excellence-shell.md`
- 检查：`README.md`

**步骤 1：做中文完整性检查**

检查：

- 正文是否全部为正常中文
- 是否存在乱码或 Unicode 转义中文
- 是否出现大段不必要英文正文

**步骤 2：做结构一致性检查**

检查：

- shell 是否仍然保持薄壳定位
- `SKILL.md` 是否仍然只做调度
- `00-03` 是否构成核心层
- `10-16` 与 `30` 是否职责清晰

**步骤 3：做最终 git 检查**

执行：

```powershell
git status --short
```

预期：

- 只看到与 `frontend-excellence` 相关的新增或修改
- 不误碰不相干文件

**步骤 4：准备提交**

建议暂存：

```powershell
git add 'skills/frontend-excellence' 'prompts/frontend-excellence-shell.md' 'docs/plans/2026-03-28-frontend-excellence-design.md' 'docs/plans/2026-03-28-frontend-excellence.md' 'README.md'
```

建议提交信息：

```text
feat: add frontend-excellence skill and shell prompt
```
