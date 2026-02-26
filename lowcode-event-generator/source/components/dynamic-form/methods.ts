import { ValueSourceType } from '../../value-types';

export const methods = [
  {
    name: 'getValue',
    label: '获取表单值',
    description: '获取表单的所有值',
  },
  {
    name: 'setValue',
    label: '设置表单值',
    description: '设置表单的值，可选择是否刷新字段默认值',
    params: [
      {
        name: 'value',
        label: '值',
        valueSourceType: ValueSourceType.OBJECT,
        required: true,
      },
      {
        name: 'refreshFieldDefaultValue',
        label: '是否刷新字段默认值',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
      },
    ],
  },
  {
    name: 'reset',
    label: '重置表单',
    description: '重置表单到初始状态',
  },
  {
    name: 'getModifiedValues',
    label: '获取修改的值',
    description: '获取表单中已修改的值',
  },
  {
    name: 'setReadonly',
    label: '设置只读状态',
    description: '设置表单的只读状态',
    params: [
      {
        name: 'readonly',
        label: '是否只读',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
  {
    name: 'setVisible',
    label: '设置字段是否可见',
    description: '设置表单字段的可见性',
    params: [
      {
        name: 'visible',
        label: '是否可见',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
  {
    name: 'validateFields',
    label: '验证字段',
    description: '验证表单字段',
  },
  {
    name: 'resetFields',
    label: '重置字段',
    description: '重置表单字段',
  },
  {
    name: 'toggleCollapse',
    label: '切换折叠状态',
    description: '切换表单的折叠状态',
    params: [
      {
        name: 'value',
        label: '是否折叠',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
  {
    name: 'updateFieldStates',
    label: '更新字段状态',
    description: '更新表单项的状态（可见性、必填、禁用等）',
    params: [
      {
        name: 'fieldStates',
        label: '字段状态',
        valueSourceType: ValueSourceType.ARRAY,
        required: true,
        example: `[{
            name: string;
            status: { visible?: boolean; required?: boolean; disabled?: boolean };
        }];`,
      },
    ],
  },
  {
    name: 'getFieldItemInstance',
    label: '获取表单项实例',
    description: '获取表单项的实例，通过字段name',
    params: [
      {
        name: 'fieldName',
        label: '字段名称',
        valueSourceType: ValueSourceType.STRING,
        required: true,
      },
    ],
  },
];
