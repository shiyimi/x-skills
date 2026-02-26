import { ValueSourceType } from '../../value-types';

export const methods = [
  {
    name: 'reload',
    label: '刷新数据',
    description: '重新加载表格数据',
    params: [
      {
        name: 'isReset',
        label: '是否重置查询条件',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
        valueConfig: {
          type: ValueSourceType.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        name: 'keepPageIndex',
        label: '是否保持当前页码',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
        valueConfig: {
          type: ValueSourceType.BOOLEAN,
          defaultValue: false,
        },
      },
    ],
  },
  {
    name: 'getValue',
    label: '获取数据',
    description: '获取表格当前的数据源',
    params: [],
  },
  {
    name: 'setValue',
    label: '设置数据',
    description: '设置表格数据源',
    params: [
      {
        name: 'data',
        label: '数据源',
        valueSourceType: ValueSourceType.ARRAY,
        required: true,
        valueConfig: {},
      },
    ],
  },
  {
    name: 'clear',
    label: '清空数据',
    description: '清空表格数据和选中行',
    params: [],
  },
  {
    name: 'getSelectedRows',
    label: '获取选中行',
    description: '获取当前选中的行数据',
    params: [],
  },
  {
    name: 'setSelectedRows',
    label: '设置选中行',
    description: '设置指定行的选中状态',
    params: [
      {
        name: 'rowKeys',
        label: '行主键数组',
        valueSourceType: ValueSourceType.ARRAY,
        required: true,
        valueConfig: {
          type: ValueSourceType.ARRAY,
        },
      },
      {
        name: 'isSelected',
        label: '是否选中',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
        valueConfig: {
          type: ValueSourceType.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        name: 'clearPrevious',
        label: '是否清除之前的选中',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
        valueConfig: {
          type: ValueSourceType.BOOLEAN,
          defaultValue: false,
        },
      },
    ],
  },
  {
    name: 'clearSelectedRows',
    label: '清空选中行',
    description: '清空所有选中的行',
    params: [],
  },
  {
    name: 'beginEdit',
    label: '开始编辑',
    description: '开启表格编辑模式',
    params: [
      {
        name: 'rowKey',
        label: '行主键（可选）',
        valueSourceType: ValueSourceType.STRING,
        required: false,
        description: '指定行主键则只编辑该行，不指定则编辑所有行',
        valueConfig: {
          type: ValueSourceType.STRING,
        },
      },
    ],
  },
  {
    name: 'endEdit',
    label: '结束编辑',
    description: '结束表格编辑模式',
    params: [],
  },
];
