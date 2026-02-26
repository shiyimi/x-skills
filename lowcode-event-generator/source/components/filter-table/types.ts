import React from 'react';

export interface OperationButton {
  label: string;
  action: string;
  XXXId?: string;
}

export interface FilterTableColumn {
  name: string;
  label: string;
  type: string;
  columnType?: 'normal' | 'operation';
  visible?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  required?: boolean;
  disabled?: boolean;
  order?: number;
  fixed?: 'left' | 'right';
  operationButtons?: OperationButton[];
  render?: (_: any, record: any) => React.ReactNode;
  componentProps?: Record<string, any>;
}

export interface FilterTableSearch {
  visible: boolean;
  body: Array<{
    name: string;
    label: string;
    type: string;
    visible?: boolean;
    required?: boolean;
  }>;
  columnCount?: number;
}

export interface FilterTablePagination {
  pageSize: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
}

export interface FilterTableRowButton {
  XXXId: string;
  name: string;
  label: string;
  type: string;
  buttonType?: 'default' | 'primary' | 'dashed' | 'text' | 'link';
  order?: number;
  accessCode?: string;
}

export interface FilterTableProp {
  columns?: FilterTableColumn[];
  pagination?: FilterTablePagination;
  rowButtons?: FilterTableRowButton[];
  isEditing?: boolean;
  selectionType?: 'checkbox' | 'radio' | 'none';
  operationButtons?: OperationButton[];
  onValueChange?: (value: any) => void;
}

export const DEFAULT_COLUMN_TYPES = [
  { label: '文本', value: 'KInput' },
  { label: '数字', value: 'KInputNumber' },
  { label: '下拉选择', value: 'KSelect' },
  { label: '日期时间', value: 'KDatePicker' },
  { label: '复选框', value: 'KCheckbox' },
  { label: '对象选择', value: 'KObjectSelector' },
  { label: '用户选择', value: 'KUserSelector' },
  { label: '组织选择', value: 'KOrgSelector' },
  { label: '自定义', value: 'custom' },
];

export const DEFAULT_ALIGN_OPTIONS = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
];
