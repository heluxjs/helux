import { ICtxBase, IAnyFnInObj } from './types';
import { UNSTART, START, END } from './support/priv-constant';

type RenderStatus = typeof UNSTART | typeof START | typeof END;

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
  /** is in before mount step */
  __$$inBM: boolean;
  __$$renderStatus: RenderStatus;
  /** 静态的观察依赖key列表，在实例didMount时会一次性记录这些静态依赖 */
  __$$staticWaKeys: string[];
};