# 脚本生成参考模板

生成脚本时，请参考以下模板。这些模板定义了常用功能的标准写法。

## 目录

- [1. 消息提示 (message)](#1-消息提示-message)
- [2. 接口调用 (requestHostApi)](#2-接口调用-requesthostapi)
- [3. 组件操作 (component)](#3-组件操作-component)
- [4. 页面跳转 (navigate)](#4-页面跳转-navigate)
- [5. 条件判断 (condition)](#5-条件判断-condition)
- [6. 循环 (loop)](#6-循环-loop)
- [7. 延时执行 (delay)](#7-延时执行-delay)
- [8. 变量 (variable)](#8-变量-variable)
- [9. 返回值 (return)](#9-返回值-return)

## 1. 消息提示 (message)

```javascript
// 显示顶部提示信息
// duration: 延时关闭时间（秒），0 表示不自动关闭
message.info('提示内容', 3);
message.success('成功内容', 3);
message.warning('警告内容', 3);
message.error('错误内容', 3);

// 通知提醒 (notification)
// 显示右侧通知框
showNotification({
  type: 'info', // info | success | warning | error
  title: '通知标题',
  content: '通知内容',
  detailContent: '详细内容（可选）',
  duration: 3 // 延时关闭时间（秒）
});
```

## 2. 接口调用 (requestHostApi)

```javascript
// requestHostApi 是 RenderEngine 注入的 API 请求函数

// 1. 基本调用 (GET/POST)
// url: 接口地址
// method: GET | POST | PUT | DELETE
// data: 请求体数据
// params: 查询参数
requestHostApi({
  url: '/api/v1/resource',
  method: 'GET',
  params: { id: 123 }
}).then(response => {
  // 成功回调
  // response 为接口返回的数据
  const data = response.data;
  // TODO: 处理成功逻辑
}).catch(error => {
  // 失败回调
  // error 为错误对象
  // TODO: 处理失败逻辑
}).finally(() => {
  // 完成回调
  // TODO: 处理完成逻辑
});

// 2. 链式调用示例
// 可以在 then/catch 中继续执行其他操作
requestHostApi({
  url: '/api/v1/update',
  method: 'POST',
  data: { status: 'active' }
}).then(res => {
  message.success('更新成功');
  renderEngine.getInstance('ObjectTable-1').refresh(); // 刷新表格
}).catch(err => {
  message.error('更新失败: ' + err.message);
});
```

## 3. 组件操作 (component)

```javascript
// 常用组件操作：设置表单值，同步表格值，禁用按钮，设置树选中

// 1. 获取组件实例
// 使用 renderEngine.getInstance(xxxId) 获取组件实例
const formInstance = renderEngine.getInstance('DynamicForm-1');

// 2. 调用组件方法
// 具体方法请参考 references/meta-definitions.md 中的 methods 定义

// 设置表单值
formInstance.setValue({ status: 'ready' });

// 获取表单值
const formValue = formInstance.getValue();

// 将表单值设置给表格（例如筛选）
renderEngine.getInstance('KFilterTable-1').setValue(formValue);

// 设置按钮禁用
const disabled = true;
renderEngine.getInstance('KButton-1').setDisabled(disabled);

// 设置树选中节点
const selectedRows = renderEngine.getInstance('KFilterTable-1').getSelectedRows();
renderEngine.getInstance('KTree-1').setSelectedKeys(selectedRows);
```

## 4. 页面跳转 (navigate)

```javascript
// 1. 内部路由跳转 (React Router)
// 使用 history.push 跳转到内部页面
history.push("/other-page");
history.push("/other-page?id=123"); // 带参数

// 2. 外部链接跳转
// 新窗口打开
window.open("https://www.example.com");

// 当前窗口打开
window.location.href = "https://www.example.com";
```

## 5. 条件判断 (condition)

```javascript
// 使用标准的 if-else if-else 结构
// 支持的操作符: ==, !=, >, <, >=, <=, .includes, !.includes, lodash.isEmpty, !lodash.isEmpty

// 1. 简单判断
if (value > 100) {
  // TODO: 处理逻辑
}

// 2. 复杂判断
if (value > 100 && status === 'active') {
  // TODO: 处理逻辑
} else if (value < 0) {
  // TODO: 处理逻辑
} else {
  // TODO: 处理逻辑
}

// 3. 判空 (使用 lodash)
// 为空
if (typeof value === 'object' ? lodash.isEmpty(value) : !value) {
  // TODO: 处理逻辑
}
// 不为空
if (typeof value === 'object' ? !lodash.isEmpty(value) : !!value) {
  // TODO: 处理逻辑
}

// 4. 包含判断
if (list.includes(item)) {
  // TODO: 处理逻辑
}
```

## 6. 循环 (loop)

```javascript
// 使用 for...of 结构遍历数组

// 1. 基本循环
const loopDataSource = [1, 2, 3];
for (const item of loopDataSource) {
  // TODO: 循环体逻辑
  console.log(item);
}

// 2. 遍历组件数据
const tableData = renderEngine.getInstance('ObjectTable-1').getValue();
for (const row of tableData) {
  // 每一行数据的处理逻辑
  if (row.status === 'active') {
    // TODO: 处理激活状态的数据
  }
}
```

## 7. 延时执行 (delay)

```javascript
// 1. 延时执行 (setTimeout)
// delay: 延时时间（毫秒）
setTimeout(() => {
  // TODO: 延时后执行的逻辑
  message.info('延时结束');
}, 1000);

// 2. 定时重复执行 (setInterval)
// 无次数限制
setInterval(() => {
  // TODO: 定时执行的逻辑
  console.log('定时执行');
}, 3000);

// 3. 定时重复执行 (带次数限制)
// maxExecutions: 最大执行次数
let executionCount = 0;
const intervalId = setInterval(() => {
  executionCount++;
  // TODO: 定时执行的逻辑
  console.log(`执行第 ${executionCount} 次`);
  
  if (executionCount >= 5) {
    clearInterval(intervalId);
  }
}, 1000);
```

## 8. 变量 (variable)

```javascript
// 1. 定义变量
const count = 10;
const status = 'active';
const user = { name: 'Admin', role: 'admin' };

// 2. 变量赋值 (需要使用 let 声明的变量)
let total = 0;
total = total + 1;

// 3. 从组件获取值赋给变量
const formValues = renderEngine.getInstance('DynamicForm-1').getValue();
const tableSelection = renderEngine.getInstance('ObjectTable-1').getSelectedRows();
```

## 9. 返回值 (return)

```javascript
// 1. 返回变量
// variableName: 要返回的变量名
return someVariable;

// 2. 提前退出
// 如果满足条件则提前退出函数
if (value === 0) {
  return;
}
```
