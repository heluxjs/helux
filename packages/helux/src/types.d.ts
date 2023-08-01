export type PrimitiveItem = number | string;

export type PrimitiveSymItem = PrimitiveItem | symbol;

// export type PlainObject = Record<PrimitiveSymItem, T>;

export type Dict<T extends any = any> = Record<PrimitiveSymItem, T>;

// export type PlainObject = Record<string, {}>;
export type PlainObject = Dict;

export type DictN<T extends any = any> = Record<number, T>;

export type Fn<T extends any = any> = (...args: any[]) => T;

export type SharedObject<T extends Dict = any> = T;

export type EenableReactive = boolean;

/** 是否在执行计算中，如是同步的计算结果，hook里此值总是 false，不会产生变化 */
export type IsComputing = boolean;

export interface IBaseCreateOptionsFull {
  /** 模块名称，不传递的话内部会生成 symbol 作为key */
  moduleName: string;
}

export interface ICreateOptionsFull extends IBaseCreateOptionsFull {
  /** default: false，是否创建响应式状态，true：是，false：否 */
  enableReactive: EenableReactive;

  /** default: false，直接读取 sharedObj 时是否记录依赖，目前用于满足 helux-solid 库的需要，enableReactive 为 true 时 ，设置此参数才有意义 */
  enableRecordDep: boolean;
  /**
   * default: false
   * 是否对传入进来的 obj 做浅拷贝
   * ```
   * const originalObj = { a:1, b: 2 };
   * const { state } = createShared(originalObj, { copyObj: true } );
   * // 若 copyObj === true, 则 getRawState(state) === originalObj 结果为 false
   * // 若 copyObj === false, 则 getRawState(state) === originalObj 结果为 true
   * ```
   */
  copyObj: boolean;
  /**
   * defaut: true, 修改的状态值是否同步到原始状态
   * 注意此参数仅在 copyObj=true 时设置才有意义
   * ```
   * const originalObj = { a:1, b: 2 };
   * const { state, setState } = createShared(originalObj);
   * // 为 true 时，任何 setState 调用都会同步到 originalObj 上
   * ```
   */
  enableSyncOriginal: boolean;
}

export interface ICreateDeepOptionsFull extends IBaseCreateOptionsFull {
  isDeep: boolean;
}

export type InnerCreateOptions = ICreateDeepOptionsFull & ICreateOptionsFull;

export type ICreateOptions = Partial<ICreateOptionsFull>;

export type ICreateDeepOptions = Partial<ICreateDeepOptionsFull>;

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EenableReactive | ICreateOptions;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;

export interface IFnParams<T extends PlainObject = PlainObject> {
  isFirstCall: boolean;
  prevResult: T | null;
}

export interface IAsyncTaskParams<S extends any = any> extends IFnParams {
  source: S;
}

export type ComputedResult<T extends Dict = Dict> = T;

export type ComputedFn<T extends Dict = Dict> = (params: IFnParams) => T;

export interface IUnmountInfo {
  t: number;
  /** mount count, 第一次挂载或第二次挂载 */
  c: 1 | 2;
  /**
   * @deprecated
   * 前一个实例 id，已无意义，后续会移除
   */
  prev: number;
}

export type FnType = 'watch' | 'computed';

export type ScopeType = 'static' | 'hook';

export type AsyncType = 'source' | 'task' | 'normal';

export type ReanderStatus = '1' | '2';

export type MountStatus = 1 | 2 | 3;

export interface IFnCtx {
  /**
   * 计算函数本体，即透传给 derive 的回调函数
   */
  fn: Fn;
  /**
   * 函数唯一标记 key
   */
  fnKey: string;
  /**
   *  deriveAsync/useDeriveAsync 传入的第一个回调函数
   */
  sourceFn: Fn;
  /**
   * default: true，是否是处于第一层的函数，使用了其他计算结果时就会表标记为 false
   */
  isFirstLevel: boolean;
  isComputing: boolean;
  remainRunCount: number;
  careComputeStatus: boolean;
  /**
   * default: false ，是否对计算结果开启记录读依赖功能，此功能仅针对 hook 里使用 useComputed 有效
   */
  enableRecordResultDep: boolean;
  /**
   * 直接依赖此函数的下一层函数列表，如其他函数使用了此函数的返回结果（包括中转返回结果），则它们的 key 会被记录到这里
   */
  nextLevelFnKeys: string[];
  /** 此函数依赖的上一层函数列表，如此函数内部使用了其他函数的返回结果，则把其他函数的 key 会被记录到这里 */
  prevLevelFnKeys: string[];
  /** 未挂载 已挂载 已卸载 */
  mountStatus: MountStatus;
  depKeys: string[];
  /** 依赖的共享状态集合 */
  depSharedKeys: number[];
  /**
   * 计算函数返回的原始结果，总是指向第一次计算返回的结果
   */
  result: PlainObject;
  /**
   * 提供给 hook 函数读取的代理结果
   */
  proxyResult: PlainObject;
  fnType: FnType;
  scopeType: ScopeType;
  /** work for hook computed fnCtx */
  updater: Fn;
  /** work for hook computed fnCtx */
  isResultReaded: boolean;
  /** 只要结果曾经读取过就记录为 true */
  isResultReadedOnce: boolean;
  /**
   * 是否返回了上游的计算结算，方便为计算结果中转机制服务
   * work for computed result transfer mechanism
   */
  returnUpstreamResult: boolean;
  /** work for hook computed fnCtx */
  renderStatus: ReanderStatus;
  /** fn ctx created timestamp */
  createTime: number;
  /** work for hook computed fnCtx  */
  shouldReplaceResult: boolean;
  /**
   * 是否是异步的计算函数，使用了异步计算结果、返回了异步计算结果、返回了 asyncTask，满足任意一种情况都会标记为 true
   */
  isAsync: boolean;
  /** 是否是一个中转结果的异步函数，内部用的标记 */
  isAsyncTransfer: boolean;
  asyncType: AsyncType;
  subscribe: Fn;
}

export interface IInsCtx<T extends Dict = Dict> {
  /** 当前渲染完毕所依赖的 key 记录 */
  readMap: Dict;
  /** 上一次渲染完毕所依赖的 key 记录 */
  readMapPrev: Dict;
  /** StrictMode 下辅助 resetDepMap 函数能够正确重置 readMapPrev 值 */
  readMapStrict: null | Dict;
  /** 是否是深度依赖收集模式 */
  isDeep: boolean;
  insKey: number;
  internal: T;
  rawState: Dict;
  sharedState: Dict;
  proxyState: Dict;
  setState: Fn;
  /** 未挂载 已挂载 已卸载 */
  mountStatus: MountStatus;
  renderStatus: ReanderStatus;
  /** ins ctx created timestamp */
  createTime: number;
  /** adapt to react 18 useSyncExternalStore */
  subscribe: Fn;
  /** 实例读取数据对应的版本号 */
  ver: number;
}

export interface ICreateComputedLogicOptions {
  careComputeStatus?: boolean;
  scopeType?: ScopeType;
  fnCtxBase?: IFnCtx;
  allowTransfer?: boolean;
  runAsync?: boolean;
  asyncType?: AsyncType;
  returnUpstreamResult?: boolean;
}

export interface IHeluxParams {
  heluxObj: Dict;
  rawState: Dict;
  shouldSync: boolean;
  sharedKey: number;
  createOptions: InnerCreateOptions;
}
