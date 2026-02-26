import { FormOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { methods } from './methods';
import PropertyConfig from './property-config';

const events: any[] = [
  {
    name: 'fieldValueChange',
    label: '字段值变更',
    description: '字段值变更',
    params: [
      { name: 'fieldName', remark: '表单项name', valueType: 'string' },
      { name: 'value', remark: '表单项值', valueType: 'any' },
      {
        name: 'getInstanceByFieldName',
        remark: '获取当前form表单其他字段实例的方法，参数为其他字段name',
        valueType: '(fieldName: string) => ref',
      },
    ],
  },
];

export const dynamicFormConfig: WidgetConfig = {
  type: 'DynamicForm',
  label: '表单Form',
  description: '通过传入json，实现表单的动态渲染',
  category: [EnumControlCategory.BASIC],
  icon: FormOutlined,
  componentProps: {
    responsive: true,
    columnCount: 2,
    size: 'middle',
    layout: 'horizontal',
    labelAlign: 'left',
    labelWidth: 120,
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  },
  propertyForm: PropertyConfig,
  events,
  methods,
  dynamicEventOrigin: [
    {
      key: 'body',
      label: '表单项',
      fieldNames: { label: 'label', action: 'change', description: '值变化' },
    },
  ],
};
