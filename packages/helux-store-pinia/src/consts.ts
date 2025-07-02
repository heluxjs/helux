/**
 * store 内部方法，获取当前代理的最新版本代理
 */
export const INNER_GET_CURRENT_PROXY = '$getCurrentProxy';

/**
 * 在 defineStore defineLayeredStore 里获取只读状态
 */
export const INNER_STATE = '$state';

/**
 * 在 defineStore defineLayeredStore 里操作草稿
 */
export const INNER_DRAFT = '$draft';

/**
 * 在 defineStore defineLayeredStore 里重置状态
 */
export const INNER_RESET = '$reset';

/**
 * 在 defineLayeredStore 里获取只读状态
 */
export const STATE = 'state';

/**
 * 在 defineLayeredStore 里操作草稿
 */
export const DRAFT = 'draft';
