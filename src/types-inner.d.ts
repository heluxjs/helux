import { ICtxBase, IAnyFnInObj } from './types';
import { UNSTART, START, END } from './support/priv-constant';

type RenderStatus = typeof UNSTART | typeof START | typeof END;

export type IRefCtx = ICtxBase & {
  refCuRetContainer: any;
  /**
   * 原始的计算结果容器，在beforeMount阶段对 refComputedValue 包裹 defineProperty 时，
   * 会用 refComputedOri 来存储 refComputedValue 的值
   */
  refCuPackedValues: any;
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

  // 当前实例观察的key map
  __$$curWaKeys: {},
};