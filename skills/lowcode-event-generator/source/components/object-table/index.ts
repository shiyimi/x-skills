import { TableOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import { ValueSourceType } from '../../../../value-types/types';
import DropInfoForm from './drop-in-form';
import PropertyConfig, { ObjectTableProp } from './property-config';

const events = [] as any[];

const methods = [
  {
    name: 'refresh',
    label: '刷新',
    description: '刷新表格',
  },
  {
    name: 'getSelectedRows',
    label: '获取选中行',
    description: '获取选中行',
  },
  {
    name: 'setConditionItem',
    label: '设置条件项',
    description: '设置条件项',
    params: [
      {
        name: 'conditions',
        label: '条件项',
        description: '条件项',
        valueSourceType: ValueSourceType.ARRAY,
        required: true,
        example: `[{var:string,values:Array[string],compare:string}];`,
      },
    ],
  },
];

export const objectTableConfig: WidgetConfig<ObjectTableProp> = {
  type: 'KObjectTableWrapper',
  label: '对象表格',
  description: '通过配置对象模型，实现表格的快速渲染',
  category: [EnumControlCategory.DATA_MODEL],
  dropInfoForm: DropInfoForm,
  propertyForm: PropertyConfig,
  icon: TableOutlined,
  componentProps: {
    selectionType: 'checkbox',
    renderType: 'SCHEMA',
  },
  events,
  dynamicEventOrigin: [
    {
      key: 'customButtons',
      label: '自定义操作按钮',
      fieldNames: { label: 'label', action: 'click', description: '点击' },
    },
  ],
  methods,
};
