
// 接口调用 (requestHostApi)
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
