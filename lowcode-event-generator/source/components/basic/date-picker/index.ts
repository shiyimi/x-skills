import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'change',
    label: '日期选择器变化',
    description: '日期选择器变化事件',
    params: [{ name: 'value', remark: '日期选择器值', valueType: 'string' }],
  },
  {
    name: 'focus',
    label: '日期选择器聚焦',
    description: '日期选择器聚焦事件',
    params: [{ name: 'value', remark: '日期选择器值', valueType: 'string' }],
  },
  {
    name: 'blur',
    label: '日期选择器失去焦点',
    description: '日期选择器失去焦点事件',
    params: [{ name: 'value', remark: '日期选择器值', valueType: 'string' }],
  },
];

const methods = [
  {
    name: 'setValue',
    label: '设置值',
    description: '设置日期选择器值',
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
    description: '获取日期选择器值',
  },
  {
    name: 'setReadonly',
    label: '设置只读',
    description: '设置日期选择器只读',
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
    description: '设置日期选择器禁用',
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

const datePickerConfig: WidgetConfig = {
  type: 'KDatePicker',
  label: '日期选择器',
  description: '通过配置日期选择器，实现日期选择器的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    placeholder: '请选择日期',
    allowClear: true,
    disabled: false,
    picker: undefined,
    format: 'YYYY-MM-DD',
  },
  defaultGridSize: {
    width: 12,
    height: 3,
  },
  events,
  methods,
};

export default datePickerConfig;
