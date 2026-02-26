import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

const events = [
  {
    name: 'click',
    label: '按钮点击事件',
    description: '按钮点击事件',
  },
];

const methods = [
  {
    name: 'click',
    label: '按钮点击',
    description: '按钮点击事件',
  },
  {
    name: 'setDisabled',
    label: '设置是否禁用',
    description: '设置组件是否禁用',
    params: [
      {
        name: 'disabled',
        label: '是否禁用',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
  {
    name: 'setLoading',
    label: '设置加载状态',
    description: '设置组件加载状态',
    params: [
      {
        name: 'loading',
        label: '是否加载中',
        valueSourceType: ValueSourceType.BOOLEAN,
        required: true,
      },
    ],
  },
];

const buttonConfig: WidgetConfig = {
  type: 'KButton',
  label: '按钮',
  description: '通过配置按钮，实现按钮的快速渲染',
  category: [EnumControlCategory.BASIC, EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    children: '按钮',
    type: 'default',
    size: 'middle',
    shape: 'default',
  },
  defaultGridSize: {
    width: 4,
    height: 3,
  },
  events,
  methods,
};

export default buttonConfig;
