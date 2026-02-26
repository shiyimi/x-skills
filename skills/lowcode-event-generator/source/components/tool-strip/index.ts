import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import PropertyConfig from './PropertyConfig';

export type ToolStripConfigProp = {
  body: {
    XXXId: string;
    label: string;
    action: 'click';
  }[];
};

export const toolStripConfig: WidgetConfig<ToolStripConfigProp> = {
  type: 'DynamicToolStrip',
  label: '工具栏',
  description: '通过配置工具栏，实现工具栏的快速渲染',
  category: [EnumControlCategory.BASIC],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    body: [],
  },
  defaultGridSize: {
    width: 24,
    height: 3,
  },
  dynamicEventOrigin: [
    {
      key: 'body',
      label: '工具栏项',
      fieldNames: { label: 'label', action: 'click', description: '点击' },
    },
  ],
};
