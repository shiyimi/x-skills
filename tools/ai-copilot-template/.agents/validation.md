# Validation

本文件定义验证原则、项目验证矩阵和已知基线。复制模板后，应根据项目实际情况填写。

## 基本纪律

- 验证强度必须匹配任务风险。
- 未执行验证前，不宣称开发完成或修复完成。
- 验证失败时，必须区分目标改动导致的问题和项目既有基线问题。
- 如果验证命令不可用、环境缺失或耗时不可接受，必须说明原因和替代验证方式。

## 验证矩阵

| 改动类型 | 最低验证 | 说明 |
| --- | --- | --- |
| 文案 / 样式小改 | `<FORMAT_OR_DIFF_CHECK>` | 验证格式和目标文件差异即可 |
| 单页面 / 单模块逻辑 | `<TYPECHECK_COMMAND>` + `<TARGETED_TEST_COMMAND>` | 重点验证状态流、条件分支和接口参数 |
| 共享组件 / 共享工具 | `<TYPECHECK_COMMAND>` + `<AFFECTED_TEST_COMMAND>` | 必须关注调用方影响 |
| API Client / 外部请求 | `<TYPECHECK_COMMAND>` + `<CONTRACT_CHECK>` | 不得臆造字段或响应结构 |
| 权限 / 鉴权 | `<FULL_TEST_OR_BUILD_COMMAND>` + 人工风险审查 | 默认至少 M 级 |
| 数据一致性 / 金额 / 状态机 | `<TARGETED_TEST_COMMAND>` + 边界用例 | 默认至少 M 级 |
| 构建 / 工程配置 | `<BUILD_COMMAND>` + 启动检查 | 记录环境差异 |
| 删除 / 迁移 / 批量改写 | 用户确认 + `<FULL_VALIDATION_COMMAND>` | 默认 L 级 |

## 测试文件位置

- 测试文件不放在业务源码同级目录，不在业务 `src/` 下新增 `*.test.*`、`*.spec.*` 或 `__tests__/`。
- 管理项目可按源文件路径镜像到对应 workspace 的 `tests/src/` 下。
- 跨多个业务文件或偏集成回归的测试，放入对应 workspace 的 `tests/features/` 下。
- 测试基础设施、mock、fixtures、helpers、setup 文件集中放在 workspace 的 `tests/` 下。

## 已知基线问题

| 命令 | 已知失败 | 是否阻断当前任务 |
| --- | --- | --- |
| `<COMMAND>` | `<KNOWN_BASELINE_FAILURE>` | `<YES_OR_NO_AND_REASON>` |

## 验收说明

交付时必须说明：

- 修改了什么。
- 验证了什么。
- 哪些验证未执行以及原因。
- 是否存在残余风险。
