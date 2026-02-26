import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'change',
    label: '树形选择变化',
    description: '树形选择变化事件',
    params: [{ name: 'value', remark: '树形选择值', valueType: 'string' }],
  },
  {
    name: 'focus',
    label: '树形选择聚焦',
    description: '树形选择聚焦事件',
    params: [{ name: 'value', remark: '树形选择值', valueType: 'string' }],
  },
  {
    name: 'blur',
    label: '树形选择失去焦点',
    description: '树形选择失去焦点事件',
    params: [{ name: 'value', remark: '树形选择值', valueType: 'string' }],
  },
];

const methods = [
  {
    name: 'setValue',
    label: '设置值',
    description: '设置树形选择值',
    params: [
      {
        name: 'value',
        label: '值',
        valueSourceType: ValueSourceType.STRING,
        required: true,
      },
      {
        name: 'refreshDefaultValue',
        label: '是否刷新默认值',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: false,
      },
    ],
  },
  {
    name: 'getValue',
    label: '获取值',
    description: '获取树形选择值',
  },
  {
    name: 'setReadonly',
    label: '设置只读',
    description: '设置树形选择只读',
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
    name: 'setDisabled',
    label: '设置禁用',
    description: '设置树形选择禁用',
    params: [
      {
        name: 'disabled',
        label: '是否禁用',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
];

const treeSelectConfig: WidgetConfig = {
  type: 'KTreeSelect',
  label: '树形选择器',
  description: '通过配置树形选择器，实现树形选择器的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    placeholder: '请选择',
    allowClear: true,
    disabled: false,
  },
  defaultGridSize: {
    width: 12,
    height: 3,
  },
  events,
  methods,
};

export default treeSelectConfig;
