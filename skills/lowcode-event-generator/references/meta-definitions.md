# 低代码组件元数据定义 (Meta Definitions)

本文件定义了低代码平台中各个组件的元数据，包括支持的事件 (Events)、方法 (Methods) 以及动态事件源 (Dynamic Events)。Agent 在生成事件脚本时，**必须** 严格遵守本文件定义的 API 规范，特别是方法名和参数结构。

## 目录

- [MainPage (主页面)](#mainpage-主页面)
- [KButton (按钮)](#kbutton-按钮)
- [KInput (输入框)](#kinput-输入框)
- [KInputNumber (数字输入框)](#kinputnumber-数字输入框)
- [KInputPassword (密码输入框)](#kinputpassword-密码输入框)
- [KCheckbox (复选框)](#kcheckbox-复选框)
- [KSelect (下拉选择器)](#kselect-下拉选择器)
- [KTreeSelect (树形选择器)](#ktreeselect-树形选择器)
- [KUserSelector (用户选择器)](#kuserselector-用户选择器)
- [KPersonSelector (人员选择器)](#kpersonselector-人员选择器)
- [KOrgSelector (组织选择器)](#korgselector-组织选择器)
- [KObjectSelector (对象选择器)](#kobjectselector-对象选择器)
- [KDatePicker (日期选择器)](#kdatepicker-日期选择器)
- [DynamicForm (表单Form)](#dynamicform-表单form)
- [KFilterTable (筛选表格)](#kfiltertable-筛选表格)
- [KObjectTableWrapper (对象表格)](#kobjecttablewrapper-对象表格)
- [KCreateFormModal (对象表单)](#kcreateformmodal-对象表单)
- [KModal (弹窗)](#kmodal-弹窗)
- [DynamicToolStrip (工具栏)](#dynamictoolstrip-工具栏)
- [KTree (树)](#ktree-树)

---

## MainPage (主页面)

- **Type**: `MainPage`
- **Label**: 主页面
- **Description**: 页面主容器

### Events (事件)

| Name      | Label    | Description  | Params |
| :-------- | :------- | :----------- | :----- |
| `mounted` | 挂载完成 | 页面加载完成 | -      |

### Methods (方法)

(无)

---

## KButton (按钮)

- **Type**: `KButton`
- **Label**: 按钮
- **Description**: 通过配置按钮，实现按钮的快速渲染

### Events (事件)

| Name    | Label        | Description  | Params |
| :------ | :----------- | :----------- | :----- |
| `click` | 按钮点击事件 | 按钮点击事件 | -      |

### Methods (方法)

| Name          | Label        | Description      | Params                                     |
| :------------ | :----------- | :--------------- | :----------------------------------------- |
| `click`       | 按钮点击     | 按钮点击事件     | -                                          |
| `setDisabled` | 设置是否禁用 | 设置组件是否禁用 | `disabled` (BOOLEAN): 是否禁用 [Required]  |
| `setLoading`  | 设置加载状态 | 设置组件加载状态 | `loading` (BOOLEAN): 是否加载中 [Required] |

---

## KInput (输入框)

- **Type**: `KInput`
- **Label**: 输入框
- **Description**: 通过配置输入框，实现输入框的快速渲染

### Events (事件)

| Name     | Label          | Description        | Params                     |
| :------- | :------------- | :----------------- | :------------------------- |
| `change` | 输入框变化     | 输入框变化事件     | `value` (string): 输入框值 |
| `focus`  | 输入框聚焦     | 输入框聚焦事件     | `value` (string): 输入框值 |
| `blur`   | 输入框失去焦点 | 输入框失去焦点事件 | `value` (string): 输入框值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置输入框值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取输入框值 | - |
| `setReadonly` | 设置只读 | 设置输入框只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KInputNumber (数字输入框)

- **Type**: `KInputNumber`
- **Label**: 数字输入框
- **Description**: 通过配置数字输入框，实现数字输入框的快速渲染

### Events (事件)

| Name     | Label          | Description        | Params                     |
| :------- | :------------- | :----------------- | :------------------------- |
| `change` | 输入框变化     | 输入框变化事件     | `value` (string): 输入框值 |
| `focus`  | 输入框聚焦     | 输入框聚焦事件     | `value` (string): 输入框值 |
| `blur`   | 输入框失去焦点 | 输入框失去焦点事件 | `value` (string): 输入框值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置输入框值 | `value` (NUMBER): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取输入框值 | - |
| `setReadonly` | 设置只读 | 设置输入框只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KInputPassword (密码输入框)

- **Type**: `KInputPassword`
- **Label**: 密码输入框
- **Description**: 通过配置密码输入框，实现密码输入框的快速渲染

### Events (事件)

| Name     | Label          | Description        | Params                     |
| :------- | :------------- | :----------------- | :------------------------- |
| `change` | 输入框变化     | 输入框变化事件     | `value` (string): 输入框值 |
| `focus`  | 输入框聚焦     | 输入框聚焦事件     | `value` (string): 输入框值 |
| `blur`   | 输入框失去焦点 | 输入框失去焦点事件 | `value` (string): 输入框值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置输入框值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取输入框值 | - |
| `setReadonly` | 设置只读 | 设置输入框只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KCheckbox (复选框)

- **Type**: `KCheckbox`
- **Label**: 复选框
- **Description**: 通过配置复选框，实现复选框的快速渲染

### Events (事件)

| Name     | Label      | Description    | Params                     |
| :------- | :--------- | :------------- | :------------------------- |
| `change` | 值变化事件 | 复选框变化事件 | `value` (string): 复选框值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置复选框值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |

---

## KSelect (下拉选择器)

- **Type**: `KSelect`
- **Label**: 下拉选择器
- **Description**: 通过配置下拉选择器，实现下拉选择器的快速渲染

### Events (事件)

| Name     | Label          | Description        | Params                     |
| :------- | :------------- | :----------------- | :------------------------- |
| `change` | 下拉框变化     | 下拉框变化事件     | `value` (string): 下拉框值 |
| `focus`  | 下拉框聚焦     | 下拉框聚焦事件     | `value` (string): 下拉框值 |
| `blur`   | 下拉框失去焦点 | 下拉框失去焦点事件 | `value` (string): 下拉框值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置下拉框值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取下拉框值 | - |
| `setReadonly` | 设置只读 | 设置下拉框只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置下拉框禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KTreeSelect (树形选择器)

- **Type**: `KTreeSelect`
- **Label**: 树形选择器
- **Description**: 通过配置树形选择器，实现树形选择器的快速渲染

### Events (事件)

| Name     | Label            | Description          | Params                       |
| :------- | :--------------- | :------------------- | :--------------------------- |
| `change` | 树形选择变化     | 树形选择变化事件     | `value` (string): 树形选择值 |
| `focus`  | 树形选择聚焦     | 树形选择聚焦事件     | `value` (string): 树形选择值 |
| `blur`   | 树形选择失去焦点 | 树形选择失去焦点事件 | `value` (string): 树形选择值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置树形选择值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取树形选择值 | - |
| `setReadonly` | 设置只读 | 设置树形选择只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置树形选择禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KUserSelector (用户选择器)

- **Type**: `KUserSelector`
- **Label**: 用户选择器
- **Description**: 通过配置用户选择器，实现用户选择器的快速渲染

### Events (事件)

| Name     | Label            | Description          | Params                       |
| :------- | :--------------- | :------------------- | :--------------------------- |
| `change` | 用户选择变化     | 用户选择变化事件     | `value` (string): 用户选择值 |
| `focus`  | 用户选择聚焦     | 用户选择聚焦事件     | `value` (string): 用户选择值 |
| `blur`   | 用户选择失去焦点 | 用户选择失去焦点事件 | `value` (string): 用户选择值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置用户选择值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取用户选择值 | - |
| `setReadonly` | 设置只读 | 设置用户选择只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置用户选择禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KPersonSelector (人员选择器)

- **Type**: `KPersonSelector`
- **Label**: 人员选择器
- **Description**: 通过配置人员选择器，实现人员选择器的快速渲染

### Events (事件)

| Name     | Label            | Description          | Params                       |
| :------- | :--------------- | :------------------- | :--------------------------- |
| `change` | 人员选择变化     | 人员选择变化事件     | `value` (string): 人员选择值 |
| `focus`  | 人员选择聚焦     | 人员选择聚焦事件     | `value` (string): 人员选择值 |
| `blur`   | 人员选择失去焦点 | 人员选择失去焦点事件 | `value` (string): 人员选择值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置人员选择值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取人员选择值 | - |
| `setReadonly` | 设置只读 | 设置人员选择只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置人员选择禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KOrgSelector (组织选择器)

- **Type**: `KOrgSelector`
- **Label**: 组织选择器
- **Description**: 通过配置组织选择器，实现组织选择器的快速渲染

### Events (事件)

| Name     | Label            | Description          | Params                       |
| :------- | :--------------- | :------------------- | :--------------------------- |
| `change` | 组织选择变化     | 组织选择变化事件     | `value` (string): 组织选择值 |
| `focus`  | 组织选择聚焦     | 组织选择聚焦事件     | `value` (string): 组织选择值 |
| `blur`   | 组织选择失去焦点 | 组织选择失去焦点事件 | `value` (string): 组织选择值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置组织选择值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取组织选择值 | - |
| `setReadonly` | 设置只读 | 设置组织选择只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置组织选择禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KObjectSelector (对象选择器)

- **Type**: `KObjectSelector`
- **Label**: 对象选择器
- **Description**: 通过配置对象选择器，实现对象选择器的快速渲染

### Events (事件)

| Name     | Label            | Description          | Params                       |
| :------- | :--------------- | :------------------- | :--------------------------- |
| `change` | 对象选择变化     | 对象选择变化事件     | `value` (string): 对象选择值 |
| `focus`  | 对象选择聚焦     | 对象选择聚焦事件     | `value` (string): 对象选择值 |
| `blur`   | 对象选择失去焦点 | 对象选择失去焦点事件 | `value` (string): 对象选择值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置对象选择值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取对象选择值 | - |
| `setReadonly` | 设置只读 | 设置对象选择只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置对象选择禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## KDatePicker (日期选择器)

- **Type**: `KDatePicker`
- **Label**: 日期选择器
- **Description**: 通过配置日期选择器，实现日期选择器的快速渲染

### Events (事件)

| Name     | Label              | Description            | Params                         |
| :------- | :----------------- | :--------------------- | :----------------------------- |
| `change` | 日期选择器变化     | 日期选择器变化事件     | `value` (string): 日期选择器值 |
| `focus`  | 日期选择器聚焦     | 日期选择器聚焦事件     | `value` (string): 日期选择器值 |
| `blur`   | 日期选择器失去焦点 | 日期选择器失去焦点事件 | `value` (string): 日期选择器值 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `setValue` | 设置值 | 设置日期选择器值 | `value` (STRING): 值 [Required]<br>`refreshDefaultValue` (BOOLEAN): 是否刷新默认值 [Optional] |
| `getValue` | 获取值 | 获取日期选择器值 | - |
| `setReadonly` | 设置只读 | 设置日期选择器只读 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setDisabled` | 设置禁用 | 设置日期选择器禁用 | `disabled` (BOOLEAN): 是否禁用 [Required] |

---

## DynamicForm (表单Form)

- **Type**: `DynamicForm`
- **Label**: 表单Form
- **Description**: 通过传入json，实现表单的动态渲染

### Events (事件)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `fieldValueChange` | 字段值变更 | 字段值变更 | `fieldName` (string): 表单项name<br>`value` (any): 表单项值<br>`getInstanceByFieldName` (function): 获取当前form表单其他字段实例的方法，参数为其他字段name |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `getValue` | 获取表单值 | 获取表单的所有值 | - |
| `setValue` | 设置表单值 | 设置表单的值 | `value` (OBJECT): 值 [Required] |
| `reset` | 重置表单 | 重置表单到初始状态 | - |
| `getModifiedValues` | 获取修改的值 | 获取表单中已修改的值 | - |
| `setReadonly` | 设置只读状态 | 设置表单的只读状态 | `readonly` (BOOLEAN): 是否只读 [Required] |
| `setVisible` | 设置字段是否可见 | 设置表单字段的可见性 | `visible` (BOOLEAN): 是否可见 [Required] |
| `validateFields` | 验证字段 | 验证表单字段 | - |
| `resetFields` | 重置字段 | 重置表单字段 | - |
| `toggleCollapse` | 切换折叠状态 | 切换表单的折叠状态 | `value` (BOOLEAN): 是否折叠 [Required] |
| `updateFieldStates` | 更新字段状态 | 更新表单项的状态 | `fieldStates` (ARRAY): 字段状态 [Required] |

### Dynamic Events (动态事件源)

- **Key**: `body`
- **Label**: 表单项
- **Action**: `change` (值变化)

---

## KFilterTable (筛选表格)

- **Type**: `KFilterTable`
- **Label**: 筛选表格
- **Description**: 通过配置筛选表格，实现筛选表格的快速渲染

### Events (事件)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `select` | 行选择事件 | 选择表格行时触发 | `record` (object): 选择行数据<br>`selectedRows` (array): 所有选中行数据<br>`selected` (boolean): 选中/取消选中 |
| `change` | 行选择变化事件 | 表格行选择状态变化时触发 | `selectedRows` (array): 所有选中行数据<br>`selectedRowKeys` (array): 选中行键值 |
| `rowClick` | 行点击事件 | 点击表格行时触发 | `record` (object): 点击行数据 |
| `cellValueChange` | 单元格值变化 | 编辑模式下单元格值变化时触发 | `value` (any): 当前单元格值<br>`column` (object): 当前列配置信息<br>`record` (object): 当前行数据 |

### Methods (方法)

| Name | Label | Description | Params |
| :-- | :-- | :-- | :-- |
| `reload` | 刷新数据 | 重新加载表格数据 | `isReset` (BOOLEAN): 是否重置查询条件 |
| `getValue` | 获取数据 | 获取表格当前的数据源 | - |
| `setValue` | 设置数据 | 设置表格数据源 | `data` (ARRAY): 数据源 [Required] |
| `clear` | 清空数据 | 清空表格数据和选中行 | - |
| `getSelectedRows` | 获取选中行 | 获取当前选中的行数据 | - |
| `setSelectedRows` | 设置选中行 | 设置指定行的选中状态 | `rowKeys` (ARRAY): 行主键数组 [Required] |
| `clearSelectedRows` | 清空选中行 | 清空所有选中行 | - |

### Dynamic Events (动态事件源)

- **Key**: `operationButtons`
- **Label**: 操作列按钮
- **Action**: `click` (点击(行按钮))
- **Params**: `record` (object): 当前行数据

---

## KObjectTableWrapper (对象表格)

- **Type**: `KObjectTableWrapper`
- **Label**: 对象表格
- **Description**: 通过配置对象模型，实现表格的快速渲染

### Events (事件)

(无)

### Methods (方法)

| Name               | Label      | Description | Params                                  |
| :----------------- | :--------- | :---------- | :-------------------------------------- |
| `refresh`          | 刷新       | 刷新表格    | -                                       |
| `getSelectedRows`  | 获取选中行 | 获取选中行  | -                                       |
| `setConditionItem` | 设置条件项 | 设置条件项  | `conditions` (ARRAY): 条件项 [Required] |

### Dynamic Events (动态事件源)

- **Key**: `customButtons`
- **Label**: 自定义操作按钮
- **Action**: `click` (点击)

---

## KCreateFormModal (对象表单)

- **Type**: `KCreateFormModal`
- **Label**: 对象表单
- **Description**: 通过配置对象模型，实现对象表单的快速渲染

### Events (事件)

| Name   | Label        | Description  | Params                          |
| :----- | :----------- | :----------- | :------------------------------ |
| `onOk` | 对象表单提交 | 对象表单提交 | `formValues` (object): 表单数据 |

### Methods (方法)

(无)

### Dynamic Events (动态事件源)

- **Key**: `formItems`
- **Label**: 表单项
- **Action**: `change` (值变化)

---

## KModal (弹窗)

- **Type**: `KModal`
- **Label**: 弹窗
- **Description**: 通过配置弹窗内容，实现弹窗的快速渲染

### Events (事件)

| Name        | Label  | Description | Params |
| :---------- | :----- | :---------- | :----- |
| `afterOpen` | 打开后 | 打开后触发  | -      |

### Methods (方法)

| Name   | Label    | Description | Params |
| :----- | :------- | :---------- | :----- |
| `show` | 显示弹窗 | 显示弹窗    | -      |
| `hide` | 隐藏弹窗 | 隐藏弹窗    | -      |

### Dynamic Events (动态事件源)

- **Key**: `buttons`
- **Label**: 操作按钮
- **Action**: `click` (点击)

---

## DynamicToolStrip (工具栏)

- **Type**: `DynamicToolStrip`
- **Label**: 工具栏
- **Description**: 通过配置工具栏，实现工具栏的快速渲染

### Events (事件)

(无)

### Methods (方法)

(无)

### Dynamic Events (动态事件源)

- **Key**: `body`
- **Label**: 工具栏项
- **Action**: `click` (点击)

---

## KTree (树)

- **Type**: `KTree`
- **Label**: 树
- **Description**: 通过配置树，实现树的快速渲染

### Events (事件)

| Name     | Label    | Description  | Params                      |
| :------- | :------- | :----------- | :-------------------------- |
| `select` | 节点选中 | 节点选中事件 | `keys` (array): 选中key列表 |
| `check`  | 节点勾选 | 节点勾选事件 | `keys` (array): 勾选key列表 |

### Methods (方法)

| Name              | Label        | Description  | Params                              |
| :---------------- | :----------- | :----------- | :---------------------------------- |
| `setSelectedKeys` | 设置选中节点 | 设置选中节点 | `keys` (ARRAY): 选中节点 [Required] |
| `getSelectedKeys` | 获取选中节点 | 获取选中节点 | -                                   |
