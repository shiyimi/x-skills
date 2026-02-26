import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'change',
    label: '人员选择变化',
    description: '人员选择变化事件',
    params: [{ name: 'value', remark: '人员选择值', valueType: 'string' }],
  },
  {
    name: 'focus',
    label: '人员选择聚焦',
    description: '人员选择聚焦事件',
    params: [{ name: 'value', remark: '人员选择值', valueType: 'string' }],
  },
  {
    name: 'blur',
    label: '人员选择失去焦点',
    description: '人员选择失去焦点事件',
    params: [{ name: 'value', remark: '人员选择值', valueType: 'string' }],
  },
];

const methods = [
  {
    name: 'setValue',
    label: '设置值',
    description: '设置人员选择值',
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
    description: '获取人员选择值',
  },
  {
    name: 'setReadonly',
    label: '设置只读',
    description: '设置人员选择只读',
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
    description: '设置人员选择禁用',
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

const personSelectConfig: WidgetConfig = {
  type: 'KPersonSelector',
  label: '人员选择器',
  description: '通过配置人员选择器，实现人员选择器的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    placeholder: '请选择人员',
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

export default personSelectConfig;
