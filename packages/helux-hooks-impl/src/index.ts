import { buildApi } from './apiFactory';
export * from './api';
/**
 * 因这些仅提供给 wrapper 库使用，故和 types-api 里的接口区分开，从这里单独暴露出去，
 * index.d.ts 里也只声明了这两个接口
 */
export { buildApi };
