---
name: "lowcode-event-generator"
description: "根据自然语言交互需求生成低代码平台 code 模式 EventConfig 与 JavaScript 脚本。Use when users need to bind component events, complete or repair eventList, or generate triggerId/eventName/containerId/script from schema 或 componentList。"
---

# 低代码 EventConfig 生成

## 目标

- 生成符合平台约束的 `EventConfig`（仅 `eventMode: "code"`）。
- 生成可直接执行的 `script` 字符串，覆盖校验、组件联动、接口调用、跳转、提示等常见逻辑。
- 确保字段与 API 调用符合 `references/types.ts` 和 `references/meta-definitions.md`。

## 执行流程

### 1) 收集输入

- 收集 `schema` 或 `componentList`（至少包含 `XXXId`、`label`、`type`、`componentProps`）。
- 收集触发组件、触发时机、目标动作（调用接口/更新组件/跳转/提示等）。
- 若信息不完整，先做最小合理假设，并在输出中明确披露。

### 2) 按需读取参考

- 先读取 `references/types.ts`，锁定 `EventConfig` 结构。
- 再读取 `references/meta-definitions.md`，匹配事件、参数和可用方法。
- 需要具体写法时读取 `references/script-templates.md`。

### 3) 定位触发事件

- 从自然语言识别触发对象与事件语义。
- 在组件索引中定位触发组件。
- 从元数据中匹配 `eventName` 与事件参数。
- 遇到动态事件时，解析 `componentProps.dynamicEventOrigin`。

### 4) 生成脚本

- 按动作顺序拆解为：组件操作、服务调用、条件、循环、提示、跳转、变量。
- 统一通过 `renderEngine.getInstance(XXXId)` 获取组件实例。
- 方法与参数必须可追溯到 `meta-definitions.md` 的定义。
- 需要返回值时在末尾追加 `return`。

### 5) 组装 EventConfig

- `eventMode` 固定为 `"code"`。
- 填充 `triggerId`、`containerId`、`eventName`、`eventLabel`。
- `actions` 固定为空数组 `[]`。
- `script` 写入完整 JS 逻辑字符串。

## 输出约束

- 仅输出 code 模式 EventConfig。
- `script` 必须是完整 JS 字符串，不输出伪代码。
- 事件参数需显式声明变量，可使用占位符注入：`const value = '${value}';`。
- 优先复用 `references/script-templates.md` 中的片段。

## 事件匹配规则

### 默认事件

- `triggerId`: 组件 `XXXId`
- `containerId`: 默认等于 `triggerId`
- `eventName`: 来自组件类型定义的 `events`
- `eventLabel`:
  - 主页面事件：`#${事件label}`
  - 普通组件事件：`${组件label}#${事件label}`

### 动态事件

- 触发项来源：`dynamicEventOrigin.key` 指向的数据列表
- `triggerId`: 触发项 `XXXId`
- `containerId`: 父组件 `XXXId`
- `eventName`: `dynamicEventOrigin.fieldNames.action`
- `eventLabel`: `${父组件label}#${触发项label}${fieldNames.description}`

## 可复用脚本

- `scripts/convert_event_configs.py`
- 用途：批量规范化 JSON 中 `eventList` 的 `eventMode` 与 `actions`。
- 用法：`python scripts/convert_event_configs.py <json文件或目录...>`
- 未传路径时默认处理 `examples/`。

## 参考资源

- `references/types.ts`：核心类型定义
- `references/meta-definitions.md`：组件事件与方法定义
- `references/script-templates.md`：脚本模板片段
- `examples/`：示例输入
- `source/components/`：组件源码参考
- `source/scripts/`：脚本片段源码参考

## 最小输出模板

```json
{
  "eventMode": "code",
  "triggerId": "<trigger-xxxId>",
  "containerId": "<container-xxxId>",
  "eventName": "<event-name>",
  "eventLabel": "<label>",
  "actions": [],
  "script": "// 完整 JS 逻辑字符串"
}
```
