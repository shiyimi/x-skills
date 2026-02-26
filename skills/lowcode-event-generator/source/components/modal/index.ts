import { CopyOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import PropertyConfig, { ModalConfigProp } from './property-config';

const events = [
  {
    name: 'afterOpen',
    label: '打开后',
    description: '打开后触发',
  },
];

const methods = [
  {
    name: 'show',
    label: '显示弹窗',
    description: '显示弹窗',
  },
  {
    name: 'hide',
    label: '隐藏弹窗',
    description: '隐藏弹窗',
  },
];

export const modalConfig: WidgetConfig<ModalConfigProp> = {
  type: 'KModal',
  label: '弹窗',
  description: '通过配置弹窗内容，实现弹窗的快速渲染',
  category: [EnumControlCategory.HIDDEN],
  propertyForm: PropertyConfig,
  icon: CopyOutlined,
  componentProps: {
    width: 600,
    height: 400,
  },
  dynamicEventOrigin: [
    {
      key: 'buttons',
      label: '操作按钮',
      fieldNames: { label: 'label', action: 'click', description: '点击' },
    },
  ],
  methods,
  events,
};
