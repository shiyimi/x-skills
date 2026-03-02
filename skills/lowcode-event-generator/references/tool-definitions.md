# 脚本工具类型定义 (Tool Definitions)

该文档用于约束 EventConfig `script` 中可直接使用的运行时工具，目标是让 AI 优先复用平台能力，生成更短、更稳定的脚本。

## 1. 运行时工具总览

- 组件实例：`renderEngine.getInstance(XXXId)`
- 接口调用：`requestHostApi`（兼容别名：`requestApi`）
- 顶部消息：`message.info/success/warning/error`
- 右侧通知：`showNotification`
- 路由跳转：`history.push`
- 通用工具：`lodash.isEmpty`
- 模态确认：`KModal.confirm`

## 2. 类型定义（可直接复制给模型作为上下文）

```ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestHostApiConfig {
  url: string;
  method?: HttpMethod | Lowercase<HttpMethod>;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HostApiResponse<TData = unknown> {
  code?: number;
  msg?: string;
  message?: string;
  ok?: boolean;
  data?: TData;
  [key: string]: unknown;
}

export type RequestHostApi = <TData = unknown>(
  config: RequestHostApiConfig
) => Promise<HostApiResponse<TData>>;

export interface MessageApi {
  info(content: string, duration?: number): void;
  success(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  error(content: string, duration?: number): void;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  content: string;
  detailContent?: string;
  duration?: number;
}

export type ShowNotification = (payload: NotificationPayload) => void;

export interface HistoryApi {
  push(path: string): void;
  replace?(path: string): void;
  goBack?(): void;
}

export interface ModalConfirmOptions {
  title: string;
  content: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface KModalApi {
  confirm(options: ModalConfirmOptions): void;
}

export interface LodashApi {
  isEmpty(value: unknown): boolean;
  [methodName: string]: unknown;
}

export type RowKey = string | number;

export interface ComponentInstance {
  setValue?(value: unknown, refreshDefaultValue?: boolean): void;
  getValue?(): unknown;
  setReadonly?(readonly: boolean): void;
  setDisabled?(disabled: boolean): void;
  setLoading?(loading: boolean): void;
  refresh?(): void;
  reload?(isReset: boolean): void;
  show?(): void;
  hide?(): void;
  setVisible?(visible: boolean): void;
  getSelectedRows?(): Array<Record<string, unknown>>;
  clearSelectedRows?(): void;
  getSelectedKeys?(): RowKey[];
  setSelectedKeys?(keys: RowKey[]): void;
  setSelectedRows?(rowKeys: RowKey[]): void;
  validateFields?():
    | Record<string, unknown>
    | Promise<Record<string, unknown>>;
  resetFields?(): void;
  reset?(): void;
  clear?(): void;
  setConditionItem?(conditions: Array<Record<string, unknown>>): void;
  updateFieldStates?(fieldStates: Array<Record<string, unknown>>): void;
  getModifiedValues?(): Record<string, unknown>;
  toggleCollapse?(value: boolean): void;
  [methodName: string]: unknown;
}

export interface RenderEngine {
  getInstance<T extends ComponentInstance = ComponentInstance>(xxxId: string): T;
}

export interface ScriptContext {
  KModal?: KModalApi;
  requestApi?: RequestHostApi;
  requestHostApi?: RequestHostApi;
  lodash: LodashApi;
  userInfo?: Record<string, unknown>;
  history?: HistoryApi;
  message: MessageApi;
  showNotification: ShowNotification;
  React?: unknown;
  getExpandModal?: (...args: unknown[]) => unknown;
  KUploadModal?: unknown;
  useRef?: <T>(initialValue: T | null) => { current: T | null };
}
```

## 3. 命名兼容规则（重点）

`references/util-definitions.md` 中出现的是 `requestApi`，而模板与样例脚本主要使用 `requestHostApi`。生成脚本时统一按以下兼容写法，避免重复封装请求函数：

```javascript
const http =
  typeof requestHostApi === 'function'
    ? requestHostApi
    : typeof requestApi === 'function'
      ? requestApi
      : undefined;
```

## 4. 推荐最简脚本骨架

```javascript
const http =
  typeof requestHostApi === 'function'
    ? requestHostApi
    : typeof requestApi === 'function'
      ? requestApi
      : undefined;

if (!http) {
  message.error('未注入请求工具', 3);
  return;
}

const table = renderEngine.getInstance('KObjectTableWrapper-1');
const selectedRows = table.getSelectedRows?.() ?? [];

if (lodash.isEmpty(selectedRows)) {
  message.warning('请先选择数据', 3);
  return;
}

http({
  url: '#{dev_runtime_api_host}/v1/demo/batchUpdate',
  method: 'POST',
  data: { object: selectedRows },
})
  .then((res) => {
    if (res.code === 0 || res.ok) {
      message.success('操作成功', 3);
      table.refresh?.();
      return;
    }

    showNotification({
      type: 'error',
      title: '操作失败',
      content: String(res.msg ?? res.message ?? '未知错误'),
      detailContent: '',
      duration: 3,
    });
  })
  .catch((error) => {
    showNotification({
      type: 'error',
      title: '请求异常',
      content: String(error),
      detailContent: '',
      duration: 3,
    });
  });
```

## 5. 生成约束（给 AI）

- 优先复用 `message` / `showNotification`，不要自写提示封装。
- 优先复用 `requestHostApi`/`requestApi`，不要自写 `fetch/axios` 封装。
- 组件方法必须来自 `references/meta-definitions.md`；不确定时用可选调用（如 `instance.refresh?.()`）。
- 判空优先 `lodash.isEmpty`，避免重复实现通用工具函数。
- 涉及用户、手机号、邮箱、地址、token 等字段时使用脱敏占位：`[name]`、`[phone_number]`、`[email]`、`[address]`、`[token]`。
