import { TableOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { methods } from './methods';
import PropertyConfig from './property-config';
import { FilterTableProp } from './types';

const events = [
  {
    name: 'select',
    label: '行选择事件',
    description: '选择表格行时触发',
    params: [
      { name: 'record', remark: '选择行数据', valueType: 'object' },
      { name: 'selectedRows', remark: '所有选中行数据', valueType: 'array' },
      { name: 'selected', remark: '选中/取消选中', valueType: 'boolean' },
    ],
  },
  {
    name: 'change',
    label: '行选择变化事件',
    description: '表格行选择状态变化时触发',
    params: [
      { name: 'selectedRows', remark: '所有选中行数据', valueType: 'array' },
      { name: 'selectedRowKeys', remark: '选中行键值', valueType: 'array' },
    ],
  },
  {
    name: 'rowClick',
    label: '行点击事件',
    description: '点击表格行时触发',
    params: [{ name: 'record', remark: '点击行数据', valueType: 'object' }],
  },
  {
    name: 'cellValueChange',
    label: '单元格值变化',
    description: '编辑模式下单元格值变化时触发',
    params: [
      { name: 'value', remark: '当前单元格值', valueType: 'any' },
      { name: 'column', remark: '当前列配置信息', valueType: 'object' },
      { name: 'record', remark: '当前行数据', valueType: 'object' },
    ],
  },
];

export const filterTableConfig: WidgetConfig<FilterTableProp> = {
  type: 'KFilterTable',
  label: '筛选表格',
  description: '通过配置筛选表格，实现筛选表格的快速渲染',
  category: [EnumControlCategory.DATA_MODEL],
  propertyForm: PropertyConfig,
  icon: TableOutlined,
  componentProps: {
    columns: [],
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
    rowButtons: [],
    isEditing: false,
    selectionType: 'checkbox',
    operationButtons: [],
  },
  methods,
  events,
  dynamicEventOrigin: [
    {
      key: 'operationButtons',
      label: '操作列按钮',
      fieldNames: {
        label: 'label',
        action: 'click',
        description: '点击(行按钮)',
        params: [{ name: 'record', remark: '当前行数据', valueType: 'object' }],
      },
    },
  ],
};
