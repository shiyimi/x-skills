import { FormOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';
import DropInfoForm from './drop-in-form';
import PropertyConfig from './property-config';

const events = [
  {
    name: 'onOk',
    label: '对象表单提交',
    description: '对象表单提交',
    params: [{ name: 'formValues', remark: '表单数据', valueType: 'object' }],
  },
];

export const objectFormConfig: WidgetConfig = {
  type: 'KCreateFormModal',
  label: '对象表单',
  description: '通过配置对象模型，实现对象表单的快速渲染',
  category: [EnumControlCategory.DATA_MODEL],
  icon: FormOutlined,
  componentProps: {
    formItems: [],
    responsive: true,
    columnCount: 2,
    modalConfig: {
      isNotModal: true,
    },
  },
  propertyForm: PropertyConfig,
  events,
  dropInfoForm: DropInfoForm,
  dynamicEventOrigin: [
    {
      key: 'formItems',
      label: '表单项',
      fieldNames: { label: 'label', action: 'change', description: '值变化' },
    },
  ],
};
