import KButtonConfig from './basic/button';
import KCheckboxConfig from './basic/checkbox';
import KDatePickerConfig from './basic/date-picker';
import KInputConfig from './basic/input';
import KInputNumberConfig from './basic/input-number';
import KInputPasswordConfig from './basic/input-password';
import KObjectSelectConfig from './basic/object-selector';
import KOrgSelectConfig from './basic/org-selector';
import KPersonSelectConfig from './basic/person-selector';
import KSelectConfig from './basic/select';
import KTreeSelectConfig from './basic/tree-select';
import KUserSelectConfig from './basic/user-selector';
import { dynamicFormConfig } from './dynamic-form';
import { filterTableConfig } from './filter-table';
import { mainPageConfig } from './main-page';
import { modalConfig } from './modal';
import { objectFormConfig } from './object-form';
import { objectTableConfig } from './object-table';
import { toolStripConfig } from './tool-strip';
import { treeConfig } from './tree';

export { MAIN_PAGE_ID } from './main-page';

export const DEFAULT_WIDGETS = [
  mainPageConfig,
  objectTableConfig,
  filterTableConfig,
  objectFormConfig,
  dynamicFormConfig,
  modalConfig,
  toolStripConfig,
  KSelectConfig,
  KDatePickerConfig,
  KInputConfig,
  KInputNumberConfig,
  KInputPasswordConfig,
  KButtonConfig,
  KCheckboxConfig,
  KUserSelectConfig,
  KOrgSelectConfig,
  KTreeSelectConfig,
  KObjectSelectConfig,
  KPersonSelectConfig,
  treeConfig,
];
