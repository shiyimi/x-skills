# Frontend Excellence 设计定稿

## 目标

为当前仓库新增一套以 `skill` 为主体、以薄 `prompt shell` 为入口壳的前端能力体系。它不是“会写点 React 代码”的提示词，而是一个高标准、完美主义型、以复杂度治理为核心的前端工程伙伴能力模型。

这套体系需要满足以下目标：

- 不满足于“能用”“差不多”或“先完成再说”
- 默认优先选择最简单、最纯粹、最可验证、最可回滚的实现路径
- 覆盖前端实现、重构、评审、调试、性能治理、UI 打磨等核心场景
- 把“简化逻辑必须制度化”提升为默认决策机制，而不是附属建议
- 让规则分层、职责清晰、长期可维护，而不是把所有内容堆成一份超长总提示词

## 设计结论

采用方案 B：核心 `skill` + 分专题 `references` + 薄 `prompt shell`。

具体表现为：

- `skills/frontend-excellence/SKILL.md`
  负责总调度、任务路由、引用规则、统一输出契约
- `skills/frontend-excellence/references/*.md`
  负责核心哲学、质量门禁、任务路由、复杂度治理，以及各专题规则
- `prompts/frontend-excellence-shell.md`
  负责入口识别、人格基调、少量不可妥协原则，以及强制把具体规则解释权交给 `frontend-excellence`

## 命名策略

主 skill 名称使用英文 slug：`frontend-excellence`。

原因：

- 与 skills 生态和目录结构更兼容
- 适合作为稳定标识符与触发名
- 比 `frontend-perfectionist` 更像能力域名称，而不是人格标签

正文表达、规则说明、参考文档、示例文档统一使用中文。仅保留必要的英文技术名词、框架名、API 名与标识符，例如 `React`、`Next.js`、`useEffect`、`frontend-excellence`。

## 目录结构

```text
x-skills/
├─ docs/
│  └─ plans/
│     ├─ 2026-03-28-frontend-excellence-design.md
│     └─ 2026-03-28-frontend-excellence.md
├─ prompts/
│  └─ frontend-excellence-shell.md
└─ skills/
   └─ frontend-excellence/
      ├─ SKILL.md
      ├─ references/
      │  ├─ 00-core-principles.md
      │  ├─ 01-quality-gates.md
      │  ├─ 02-task-routing.md
      │  ├─ 03-simplification-discipline.md
      │  ├─ 10-component-architecture.md
      │  ├─ 11-state-data-effects.md
      │  ├─ 12-rendering-performance.md
      │  ├─ 13-accessibility-interaction.md
      │  ├─ 14-styling-visual-quality.md
      │  ├─ 15-testing-verification-rollbacks.md
      │  ├─ 16-review-refactor-debug.md
      │  └─ 30-react-next-adapter.md
      └─ examples/
         ├─ build-page.md
         ├─ refactor-component.md
         ├─ review-performance.md
         └─ polish-ui.md
```

## 核心设计原则

### 1. Prompt 不是第二份规范

`frontend-excellence-shell.md` 必须保持很薄，只负责以下四件事：

- 识别前端相关任务
- 注入人格基调
- 声明几条不可协商的总规则
- 把具体工作流、专题规则和质量门禁交还给 `frontend-excellence`

它不负责展开 React 细节、性能规则、组件规则、可访问性规则或重构细则。

### 2. SKILL.md 只做调度，不做百科全书

`SKILL.md` 负责：

- 定义 skill 目标
- 定义主工作流
- 定义任务分类
- 定义必须优先读取的核心 references
- 定义按任务加载的专题 references
- 定义统一输出契约

它不负责承载所有前端具体规则。

### 3. 复杂度治理是制度层，不是附属章节

`03-simplification-discipline.md` 是这套体系的中枢之一。其核心思想为：

- 先删除，再新增
- 先归位，再抽象
- 先派生，再存储
- 先显式，再魔法
- 先证明，再优化
- 先隔离复杂度，再接受复杂度

这套顺序不只是建议，而是默认决策顺序。任何前端任务在进入实现、评审、调试或优化之前，都应先经过这层判断。

### 4. 质量门禁必须独立存在

`01-quality-gates.md` 单独存在，避免“质量要求”散落在多个文件里。它负责统一收口：

- 是否真的更简单、更清晰
- 是否处理了空态、加载态、错误态、部分完成态
- 是否考虑了基本可访问性与响应式
- 是否有证据支撑性能结论
- 是否明确披露了未执行项、残余风险与回滚点

### 5. 任务先路由，再处理

`02-task-routing.md` 定义前端任务的主要模式：

- 实现
- 重构
- 评审
- 调试
- 性能优化
- UI / 交互打磨
- 架构 / 方案

这样做的目的不是分类本身，而是确保不同任务使用正确的标准和引用集，而不是一套规则硬套所有场景。

## 四个核心文件的职责

### `SKILL.md`

负责：

- 目标与定位
- 总工作流
- 引用规则
- 输出契约

不负责：

- React / Next.js 细则
- 具体性能技巧列表
- 视觉设计规则清单
- 详细重构方法论

### `00-core-principles.md`

负责：

- 总哲学
- 优先级顺序
- 对“完美主义”的边界定义
- 默认工程偏好方向

不负责：

- 任务分流
- 具体验收表
- 框架专项规则

### `01-quality-gates.md`

负责：

- 统一验收门禁
- 失败条件
- 实现、评审、调试、重构的共通收尾要求

不负责：

- 复杂度治理的具体操作步骤
- 哲学层解释
- 框架技巧

### `03-simplification-discipline.md`

负责：

- 默认决策顺序
- 抽象准入规则
- 复杂度触发器
- 前端常见反模式
- 简化顺序

不负责：

- 全量验收条目
- 任务分流
- 壳层人格设定

## 第一版范围控制

第一版明确覆盖：

- 组件设计与组合
- 状态、数据流与副作用
- 渲染与性能
- 可访问性与交互
- 样式与视觉质量
- 测试、验证与回滚
- 评审、重构与调试
- React / Next.js 适配

第一版暂不纳入：

- 动画专项
- 国际化专项
- 微前端专项
- React Native
- 自动化脚本资源
- 设计 token 生成与设计系统资产

原因不是这些方向不重要，而是当前应先把主干做深，再决定是否继续扩展。

## 中文化规则

本任务最终产出的文档和 prompt 全部使用中文表达。保留英文的范围仅限于：

- skill slug 与目录名
- frontmatter 中的 `name`
- 必要的框架名、API 名、代码标识

禁止输出乱码、Unicode 转义中文或大段无必要的英文正文。

## 参考来源吸收结论

本设计参考了外部优秀 skill 的组织思路，但不直接照搬文案。

吸收点如下：

- 从 `frontend-design` 吸收“高层方向短、硬、明确，不做平庸 AI 味设计”
- 从 `vercel-react-best-practices` 吸收“按问题域拆分专题，而不是堆砌总规范”
- 从设计系统类 skill 吸收“视觉系统与工程系统分层处理”
- 从可访问性类 skill 吸收“可访问性进入默认门禁，而不是可选项”
- 从 `code-refactoring` / `code-simplifier` 类 skill 吸收“简化逻辑必须制度化”

## 成功标准

第一版完成后，应满足以下标准：

- 前端任务可以稳定触发 `frontend-excellence`
- prompt shell 足够薄，不与 skill 正文重复
- 主 skill 具备清晰的任务路由、引用规则和输出契约
- “简化优先”被写成制度而不是口号
- 质量门禁足够明确，能够阻止“假完成”
- React / Next.js 有适配入口，但不会污染核心哲学
- 全部面向人阅读的内容为中文

## 实施顺序建议

建议按以下顺序推进实际落盘：

1. 创建 `skills/frontend-excellence/SKILL.md`
2. 创建四个核心 references
3. 创建 `16-review-refactor-debug.md`
4. 创建 `30-react-next-adapter.md`
5. 创建 `10-15` 其他专题 references
6. 创建 `prompts/frontend-excellence-shell.md`
7. 创建 `examples/`
8. 更新仓库 `README.md`

## 当前结论

当前设计已经足够支撑进入实现阶段。后续不应再回到“做 skill 还是做 prompt”的方向性讨论，而应按本设计文档落地具体文件。
