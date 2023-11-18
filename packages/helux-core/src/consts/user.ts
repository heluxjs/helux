/** 可按需注册更多的事件名并实现，方便插件收集更多的运行时数据做对应分析 */
export const EVENT_NAME = {
  ON_DATA_CHANGED: 'ON_DATA_CHANGED',
  ON_SHARE_CREATED: 'ON_SHARE_CREATED',
  ON_ERROR_OCCURED: 'ON_ERROR_OCCURED',
} as const;

export const LOADING_MODE = {
  NONE: 'NONE',
  PRIVATE: 'PRIVATE',
  GLOBAL: 'GLOBAL',
} as const;

export const FROM = {
  MUTATE: 'Mutate',
  ACTION: 'Action',
} as const;
