import { ICtxBase, IAnyFnInObj, IAnyObj, IFnCtxBase, CalledBy } from './types';
import { UNSTART, START, END } from './support/priv-constant';

type RenderStatus = typeof UNSTART | typeof START | typeof END;

export interface ComputedPackedValue {
  needCompute: boolean;
  fn: Function;
  newState: IAnyObj;
  oldState: IAnyObj;
  fnCtx: IFnCtxBase;
  isLazy: boolean;
  result: any;
}

interface DepDesc {
  stateKey2retKeys: Record<string, string[]>;
  retKey2fn: Record<string, Function>;
  immediateRetKeys: string[];
}

interface Options {
  module: string;
  skipMiddleware: boolean;
  payload: any;
  stateChangedCb: (state: any) => void;
  force: boolean;
  keys: string[],
  keyPath: string, // sync api 透传
  reactCallback: (state: any) => void;
  type: string;
  calledBy: CalledBy,
  fnName: string,
  renderKey: string,
  delay: number;
}

// 以下这些属性，尽管开发者可以log出来，
// 但不标记在 ICtxBase里 是希望开发者不要访问或者修改这些属性，否则引发的问题后果自负哦
export type IRefCtx = ICtxBase & {
  /**
   * 经 defineProperty 处理过的对象，用于获取 refComputedRawValues 里的 packedValue
   */
  refComputedValues: Record<string, any>;
  /**
   * 辅助 refComputedValues 取值，避免 get 死循环
   */
  refComputedRawValues: Record<string, ComputedPackedValue>;
  /**
   * 不按模块分类，映射的cuRetKey_fn_
   * key: cuRetKey
   * value: cuFn
   */
  computedRetKeyFns: IAnyFnInObj;
  /**
   * key: moduleName
   */
  computedDep: Record<string, DepDesc>;
  /**
   * key: moduleName
   */
  watchDep: Record<string, DepDesc>;
  changeState: (state: any, options: Options) => void;
  /** mark setup fn executing is start or end  */
  __$$inBM: boolean;
  __$$renderStatus: RenderStatus;
  /** 静态的观察依赖key列表，在实例didMount时会一次性记录这些静态依赖 */
  __$$staticWaKeys: string[];

  // 当前实例观察的key map
  __$$curWaKeys: {},
};


export interface IRef {
  ctx: IRefCtx;
  /**
   * short of mountStatus
   * NOT_MOUNT = 1; MOUNTED = 2; UNMOUNTED = 3;
   */
  __$$ms: number;
}
