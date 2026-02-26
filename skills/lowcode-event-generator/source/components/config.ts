export enum DataTypeEnum {
  UNKNOWN = 'UNKNOWN',
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  LONG = 'LONG',
  DECIMAL = 'DECIMAL',
  DATETIME = 'DATETIME',
  BOOLEAN = 'BOOLEAN',
  CLOB = 'CLOB',
  BLOB = 'BLOB',
  REFERENCE_OBJECT = 'REFERENCE_OBJECT',
  ENUM = 'ENUM',
  UNIT = 'UNIT',
  CLASSIFICATION = 'CLASSIFICATION',
  PERSON = 'PERSON',
  USER = 'USER',
  BIZ_ORG = 'BIZ_ORG',
}
export enum FormComponentEnum {
  INPUT = 'KInput',
  INPUT_NUMBER = 'KInputNumber',
  CHECKBOX = 'KCheckbox',
  DATE_PICKER = 'KDatePicker',
  SELECT = 'KSelect',
  TREE_SELECT = 'KTreeSelect',
  USER_SELECTOR = 'KUserSelector',
  PERSON_SELECTOR = 'KPersonSelector',
  OBJECT_SELECTOR = 'KObjectSelector',
  INPUT_TEXTAREA = 'KInput',
  ORG_SELECTOR = 'KOrgSelector',
  FACTORY_SELECTOR = 'KFactorySelector',
}

export const PAGE_TYPES = [
  { label: '数据管理页面', key: 'dataManagement' },
  { label: '标准页面', key: 'standard' },
  { label: '高代码页面', key: 'proCode' },
];

export const DEFAULT_FEATURE_OPTIONS = [
  { label: '新增', value: 'onAdd', position: 'header', positionDesc: '顶部' },
  { label: '批量删除', value: 'onBatchDelete', position: 'header', positionDesc: '顶部' },
  { label: '导入', value: 'onImport', position: 'header', positionDesc: '顶部' },
  { label: '导出', value: 'onExport', position: 'header', positionDesc: '顶部' },
  { label: '编辑', value: 'onSingleEdit', position: 'row', positionDesc: '行内' },
  { label: '删除', value: 'onSingleDelete', position: 'row', positionDesc: '行内' },
];

export const COMPONENT_OPTIONS = [
  { label: '文本框', value: 'KInput' },
  { label: '数字输入框', value: 'KInputNumber' },
  { label: '布尔选择', value: 'KCheckbox' },
  { label: '日期选择', value: 'KDatePicker' },
  { label: '下拉选择', value: 'KSelect' },
  { label: '树形选择', value: 'KTreeSelect' },
  { label: '用户选择', value: 'KUserSelector' },
  { label: '人员选择', value: 'KPersonSelector' },
  { label: '组织选择', value: 'KOrgSelector' },
  { label: '对象选择', value: 'KObjectSelector' },
];

export const DATA_TYPE_COMPONENT_MAP = {
  [DataTypeEnum.UNKNOWN]: 'KInput',
  [DataTypeEnum.STRING]: 'KInput',
  [DataTypeEnum.LONG]: 'KInput',
  [DataTypeEnum.INTEGER]: 'KInputNumber',
  [DataTypeEnum.DECIMAL]: 'KInputNumber',
  [DataTypeEnum.BOOLEAN]: 'KCheckbox',
  [DataTypeEnum.DATETIME]: 'KDatePicker',
  [DataTypeEnum.CLOB]: 'KInput',
  [DataTypeEnum.BLOB]: 'KInput',
  [DataTypeEnum.ENUM]: 'KSelect',
  [DataTypeEnum.CLASSIFICATION]: 'KTreeSelect',
  [DataTypeEnum.UNIT]: 'KSelect',
  [DataTypeEnum.USER]: 'KUserSelector',
  [DataTypeEnum.PERSON]: 'KPersonSelector',
  [DataTypeEnum.BIZ_ORG]: 'KOrgSelector',
  [DataTypeEnum.REFERENCE_OBJECT]: 'KObjectSelector',
} as const;

export interface FileConfig {
  fileName: string;
  template: keyof typeof PAGE_TEMPLATES;
  needsStringify?: boolean;
}

export const PAGE_TEMPLATES = {
  SCHEMA: (schema?: any) => `const schema = ${JSON.stringify(schema, null, 2)};
export default schema;`,
} as const;

export const FILE_CONFIGS: FileConfig[] = [
  {
    fileName: 'schema.ts',
    template: 'SCHEMA',
  },
];
