import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import PropertyConfig from './PropertyConfig';

// 事件
const events = [
  {
    name: 'select',
    label: '节点选中',
    description: '节点选中事件',
    params: [{ name: 'keys', remark: '选中key列表', valueType: 'array' }],
  },
  {
    name: 'check',
    label: '节点勾选',
    description: '节点勾选事件',
    params: [{ name: 'keys', remark: '勾选key列表', valueType: 'array' }],
  },
];

const methods = [
  {
    name: 'setSelectedKeys',
    label: '设置选中节点',
    description: '设置选中节点',
    params: [
      {
        name: 'keys',
        label: '选中节点',
        valueSourceType: ValueSourceType.ARRAY,
        required: true,
      },
    ],
  },
  {
    name: 'getSelectedKeys',
    label: '获取选中节点',
    description: '获取选中节点',
  },
];

export const treeConfig: WidgetConfig = {
  type: 'KTree',
  label: '树',
  description: '通过配置树，实现树的快速渲染',
  category: [EnumControlCategory.BASIC],
  icon: BorderOuterOutlined,
  propertyForm: PropertyConfig,
  componentProps: {
    size: 'middle',
    dataSource: [],
    showSearch: false,
    showCheckBox: false,
    showLine: false,
    checkable: false,
    treeData: [],
    fieldNames: {
      title: 'name',
      key: 'code',
      children: 'childCategories',
    },
  },
  defaultGridSize: {
    width: 5,
    height: 10,
  },
  events,
  methods,
};
