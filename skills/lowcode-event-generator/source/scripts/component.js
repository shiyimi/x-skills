const explainInfo = '组件操作：设置表单值，同步表格值，禁用按钮，设置树选中';

const formInstance = renderEngine.getInstance('DynamicForm-1');
formInstance.setValue({ status: 'ready' });

const formValue = formInstance.getValue();
renderEngine.getInstance('KFilterTable-1').setValue(formValue);

const disabled = true;
renderEngine.getInstance('KButton-1').setDisabled(disabled);

const selectedRows = renderEngine.getInstance('KFilterTable-1').getSelectedRows();
renderEngine.getInstance('KTree-1').setSelectedKeys(selectedRows);
