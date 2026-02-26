import { BorderOuterOutlined } from '@ant-design/icons';
import { EnumControlCategory, WidgetConfig } from '../../../../types';

export const MAIN_PAGE_ID = '__MAIN_PAGE__';

const events = [
  {
    name: 'mounted',
    label: '挂载完成',
    description: '页面加载完成',
  },
];

export const mainPageConfig: WidgetConfig = {
  XXXId: MAIN_PAGE_ID,
  type: 'MainPage',
  label: '主页面',
  description: '页面主容器',
  category: [EnumControlCategory.HIDDEN],
  icon: BorderOuterOutlined,
  componentProps: {},
  events,
};
