
// 变量定义与赋值 (variable)

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
