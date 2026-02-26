// 循环 (loop)
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
