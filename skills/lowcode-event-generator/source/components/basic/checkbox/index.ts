import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'change',
    label: '值变化事件',
    description: '复选框变化事件',
    params: [{ name: 'value', remark: '复选框值', valueType: 'string' }],
  },
];

const methods = [
  {
    name: 'setValue',
    label: '设置值',
    description: '设置复选框值',
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
];

const checkboxConfig: WidgetConfig = {
  type: 'KCheckbox',
  label: '复选框',
  description: '通过配置复选框，实现复选框的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    children: '',
    disabled: false,
  },
  defaultGridSize: {
    width: 12,
    height: 3,
  },
  events,
  methods,
};

export default checkboxConfig;
