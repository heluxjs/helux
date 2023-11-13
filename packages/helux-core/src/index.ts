import { initHeluxContext } from './factory/root';
export * from './api';
export { model, modelFactory } from './factory/createModel'; // 依赖 api，故独立导出

export {
  /**
   * 这里暴露 initHeluxContext 出去是给 wrapper 库使用，但 types-api 里故意隐藏了此接口
   * 方便 wrapper 库的 types 可直接指向 helux-core/src/types-api.d.ts 文件后，
   * 上层用户感知不到此接口的存在
   */
  initHeluxContext, // 这里暴露出去给 wrapper 库使用，但 types-api 里故意隐藏了此接口
};
