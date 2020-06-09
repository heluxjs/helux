import { ICtxBase, IAnyFnInObj } from './types';

export type IRefCtx = ICtxBase & {
  /**
   *  原始的计算结果容器，在beforeMount阶段对refComputedValue包裹defineProperty时，
   *  会用refComputedOri来存储refComputedValue的值
   */
  refComputedOri: any;
  refComputedValue: any;
  /**
   * 不按模块分类，映射的cuRetKey_fn_
   * key: cuRetKey
   * value: cuFn
   */
  computedRetKeyFns: IAnyFnInObj,
};