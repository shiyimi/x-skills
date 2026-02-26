import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'change',
    label: '输入框变化',
    description: '输入框变化事件',
    params: [{ name: 'value', remark: '输入框值', valueType: 'string' }],
  },
  {
    name: 'focus',
    label: '输入框聚焦',
    description: '输入框聚焦事件',
    params: [{ name: 'value', remark: '输入框值', valueType: 'string' }],
  },
  {
    name: 'blur',
    label: '输入框失去焦点',
    description: '输入框失去焦点事件',
    params: [{ name: 'value', remark: '输入框值', valueType: 'string' }],
  },
];

const methods = [
  {
    name: 'setValue',
    label: '设置值',
    description: '设置输入框值',
    params: [
      {
        valueSourceType: ValueSourceType.STRING,
        name: 'value',
        label: '值',
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
    description: '获取输入框值',
  },
  {
    name: 'setReadonly',
    label: '设置只读',
    description: '设置输入框只读',
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
    description: '设置禁用',
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

const inputConfig: WidgetConfig = {
  type: 'KInput',
  label: '输入框',
  description: '通过配置输入框，实现输入框的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    placeholder: '请输入...',
    allowClear: true,
    disabled: false,
    showCount: false,
    size: 'middle',
    variant: 'outlined',
  },
  defaultGridSize: {
    width: 12,
    height: 3,
  },
  events,
  methods,
};

export default inputConfig;
