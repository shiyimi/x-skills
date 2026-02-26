/**
 * 事件模式枚举
 * CODE: 代码模式，使用 JS 脚本
 * CONFIG: 配置模式，使用低代码动作配置
 */
export enum EventMode {
  CODE = 'code',
  CONFIG = 'config',
}

/**
 * 事件配置对象
 * 定义了组件触发的事件及其响应逻辑
 */
export interface EventConfig<T = any> {
  /** 事件模式：目前主要关注 'code' 模式 */
  eventMode: EventMode;
  /** 触发组件的唯一标识 (XXXId) */
  triggerId: string;
  /** 事件标签，用于展示，格式通常为 "组件Label#事件Label" */
  eventLabel: string;
  /** 事件名称，对应组件元数据中的 events.name */
  eventName: string;
  /** 容器组件ID，通常与 triggerId 相同 */
  containerId: string;
  /** JS 脚本内容 (仅在 eventMode='code' 时有效) */
  script?: string;
  /** 动作列表 (仅在 eventMode='config' 时有效)，代码模式下为空数组 */
  actions: (T & { order?: number })[];
}

/**
 * 网格布局项配置
 * 定义组件在网格布局中的位置和尺寸
 */
export type GridLayoutItem = {
  /** 组件唯一标识 (XXXId) */
  i: string;
  /** X轴位置 (0-23) */
  x: number;
  /** Y轴位置 */
  y: number;
  /** 宽度 (1-24) */
  w: number;
  /** 高度 */
  h: number;
  /** 尺寸模式：固定或自动 */
  sizeMode?: 'FIXED' | 'AUTO';
  /** 自定义像素宽度 */
  customWidth?: number;
  /** 自定义像素高度 */
  customHeight?: number;
};

/**
 * 页面整体 Schema 结构
 * 包含布局信息、组件列表和事件列表
 */
export type GridLayoutSchema<T = any> = {
  /** 页面根容器ID */
  XXXId?: string;
  /** 布局类型 */
  layoutType?: 'grid' | 'flex' | string | undefined;
  /** 页面名称 */
  name?: string;
  /** 页面标题 */
  label?: string;
  /** 网格布局配置列表 */
  gridLayout: GridLayoutItem[];
  /** 组件配置列表 */
  componentList: T[];
  /** 事件配置列表 */
  eventList: EventConfig[];
  /** 自增ID计数器 */
  autoIncrementId?: number;
};

/**
 * 组件配置对象 (ControlConfig)
 * 定义单个组件的属性、事件和元数据
 */
export type ControlConfig<T = any> = {
  /** 组件唯一标识 */
  XXXId?: string;
  /** 组件名称字段 */
  name?: string;
  /** 组件类型，如 'KButton', 'KInput' */
  type: string;
  /** 组件显示标签 */
  label: string;
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 组件描述 */
  description?: string;
  /** 组件特有属性 */
  componentProps?: {
    /** 组件绑定的事件列表 */
    onEvents?: EventConfig[];
    /** 动态事件源配置 (用于扩展标准事件之外的触发源) */
    dynamicEventOrigin?: {
      /** 动态事件对应的数据源 Key */
      key: string;
      /** 动态事件源标签 */
      label: string;
      /** 字段名称映射 */
      fieldNames: {
        label: string;
        action?: string;
        name?: string;
        description?: string;
      };
    }[];
  } & T;
  /** 子组件布局 (如果是容器组件) */
  gridLayout?: GridLayoutItem[];
  /** 组件支持的事件定义 (元数据) */
  events?: {
    name: string;
    label: string;
    description?: string;
    params?: { name: string; remark: string; valueType: any }[];
  }[];
  /** 组件支持的方法定义 (元数据) */
  methods?: {
    name: string;
    label: string;
    description?: string;
    params?: {
      name: string;
      label: string;
      description?: string;
      required?: boolean;
    }[];
  }[];
};
