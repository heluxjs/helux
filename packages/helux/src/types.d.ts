export type NumStr = number | string;

export type NumStrSymbol = number | string | symbol;

export type Dict<T extends any = any> = Record<NumStrSymbol, T>;

export type PlainObject = Record<string, {}>;

export type DictN<T extends any = any> = Record<number, T>;

export type Fn<T extends any = any> = (...args: any[]) => T;

export type Ext<T extends Dict = Dict> = T & { [key: string]: any };

export type EenableReactive = ICreateOptionsFull['enableReactive'];

export type KeyBoolDict = Record<string, boolean>;

export type KeyIdsDict = Record<string, NumStrSymbol[]>;

export type KeyInsKeysDict = Record<NumStrSymbol, number[]>;

export type ReadonlyAtom<T extends any = any> = { readonly val: T };

export type MutableAtom<T extends any = any> = { val: T };

export type Draft<T> = T;

export type Mutable<T extends Dict = Dict> = T;

export type NextState<T extends Dict = Dict> = T;

export type NextAtomValue<T> = T;

export type SharedDict<T extends Dict = any> = T;

export type Atom<T extends any = any> = { val: T };

export type SharedState = SharedDict | Atom;

/**
 * 'FIRST_RENDER': 仅组件首次渲染时收集依赖，
 * 'EVERY_RENDER': 组件每一轮渲染时都收集依赖
 */
export type DepCollectionWay = 'FIRST_RENDER' | 'EVERY_RENDER';

/** 是否在执行计算中，如是同步的计算结果，hook里此值总是 false，不会产生变化 */
export type IsComputing = boolean;

export type SetState<T extends Dict = Dict> = (
  partialStateOrRecipeCb: Partial<T> | ((mutable: Mutable<T>) => void | Partial<T>),
  options?: ISetStateOptions<T>,
) => NextState<T>;

export type AsyncSetState<T extends Dict = Dict> = (
  partialStateOrRecipeCb: Partial<T> | ((mutable: Mutable<T>) => void | Partial<T>),
  options?: ISetStateOptions<T>,
) => Promise<NextState<T>>;

export type SetAtom<T extends any = any> = (
  newAtomOrRecipeCb: T | ((mutable: MutableAtom<T>) => void | T),
  options?: ISetStateOptions<T>,
) => NextAtomValue<T>;

export type Call<T extends Dict = Dict> = <A extends any[] = any[]>(
  srvFn: (ctx: {
    args: A;
    state: Readonly<T>;
    draft: Mutable<T>;
    setState: SetState<T>;
    /** 仅适用 draft 修改数据时，可使用此函数设置 setStateOptions */
    setOptions?: (options: ISetStateOptions<T>) => void;
  }) => Promise<Partial<T>> | Partial<T> | void,
  ...args: A
) => Promise<NextState<T>>;

export type AtomCall<T extends any = any> = <A extends any[] = any[]>(
  srvFn: (ctx: {
    args: A;
    state: ReadonlyAtom<T>;
    draft: MutableAtom<T>;
    setState: SetAtom<T>;
    /** 仅适用 draft 修改数据时，可使用此函数设置 setStateOptions */
    setOptions?: (options: ISetStateOptions<Atom<T>>) => void;
  }) => Promise<T> | T | void,
  ...args: A
) => Promise<NextAtomValue<T>>;

export interface IShareMutateFnParams<D extends SharedState = SharedState, W extends SharedState[] = SharedState[], De extends any = any> {
  draft: D;
  watch: W;
  /**
   * 源头调用设定的那个desc值
   */
  desc: De | null;
  /**
   * share 链的第二个 mutable 回调通过 setOptions 设置后，后续的 mutable 可通过 prevDesc 拿到，
   * 未设置的话，prevDesc 为空
   */
  prevDesc?: De | null;
  setOptions: (customOptions: ISetStateOptions) => void;
}

export type ShareMutateFn<D extends SharedState, W extends SharedState[], E extends any> = (
  params: IShareMutateFnParams<D, W, E>,
) => void | Promise<void>;

export interface ICreateOptionsFull<T extends Dict = Dict, W extends SharedState[] = SharedState[]> {
  /**
   * 模块名称，方便用户可以查看到语义化的状态树，不传递的话内部会以生成的自增序号 作为 key
   * 传递的话如果重复了，目前的策略仅仅是做个警告，helux 内部始终以生成的自增序号作为模块命名空间控制其他逻辑
   */
  moduleName: string;
  /**
   * default: true
   * when true, it means using deep dependency collection strategy in component, using mutable state to generate new state
   */
  deep: boolean;
  /**
   * default: true ，是否使用精确更新策略
   * ```
   * 为 true 时，表示使用精确更新策略，此时相信用户用稳定方式去修改状态，helux 内部会使用深度依赖收集到的最长路径（即更新凭据）
   * 去更新视图，有助于缩小更新视图范围，达到更精确通知视图更新的目的，开启此设置需谨慎，确保开启后按约定使用稳定方式去修改状态，
   * 否则会造成冗余更新，具体原因见下面代码解释
   * ```
   * ```ts
   * // 如下为稳定方式更新，在 exact 为 true 时，会查 a1|b、a2|b|c、a2|b|e 这些依赖对应的视图更新
   * // exact 为 false 时，会查 a1、a1|b、a2、a2|b、a2|b|c、a2|b|e 这些依赖对应的视图更新
   * // 所以只要用户按约定一定使用稳定方式去修改状态的话，通知范围会减少
   * setState(draft=>{
   *  draft.a1.b = 1;
   *  draft.a2.b.c = 2
   *  draft.a2.b.e = 3
   * });
   *
   * // 如下使用非稳定方式更新时，此时只会查 a2 去更新视图，则可能造成部分视图冗余更新
   * setState(draft=>{
   *  draft.a2 = { b: { ...draft.a2.b, c: 2, e: 3 } };
   * });
   * // 冗余更新的原因是，假如视图V1读的是 a2.b.f，它的依赖是 a2、a2|b、a2|b|f，
   * // 上面的更新语句其实只改了 a2.b.c  a2.b.e，但更新凭据是 a2，则也会通知V1更新
   * // 如果使用稳定更新方式，用最长路径去更新视图的话，更新路径是 a2|b|c  a2|b|e，则不同通知V1更新
   * ```
   */
  exact: boolean;
  /**
   * 配置状态变更联动视图更新的规则
   */
  rules: {
    /**
     * 当这些数据节点发生变化时和被读取时，对应的各种行为
     */
    when: (state: T) => any | void;
    /**
     * 变化时，需要触发重渲染的和共享状态绑定关系的 id 对应的组件（ id 可在调用 useShared 时可设定 ）
     */
    ids?: NumStrSymbol[];
    /**
     * 变化时，需要触发重渲染的全局 id 对应的组件（ id 可在调用 useShared 或 useGlobalId 时可设定 ）
     */
    globalIds?: NumStrSymbol[];
    /**
     * defatul: false，表示不停止收集依赖
     * 读取时，是否依赖收集值停留到当前这一层，对应数组来说，停留在当前key+index，对于对象来说，停留在当前key
     */
    stopDep?: boolean;
  }[];
  /**
   * 监听别的由 share 或 atom 生成的共享对象的变化
   */
  watch: W;
  /**
   * watch 里任意共享对象发生变化时欲执行的修改函数
   */
  mutate: (params: IShareMutateFnParams<T, W>) => void | Promise<void>;
  /**
   * default: false，是否创建响应式状态
   * ```
   * 响应式状态，即可直接通过给对象赋值来驱动视图渲染的模式（且支持对第一层key直接赋值才起作用）：`obj.a = 1`
   * 特别注意，此参数仅针对 isDeep=false 处于浅依赖收集模式的状态有效
   *
   * true：创建响应式状态，false：创建非响应式状态
   * ```
   */
  enableReactive: boolean;
  /**
   * @deprecated
   * 目前此特性暂未实现
   * default: false，直接读取 sharedObj 时是否记录依赖，目前用于满足 helux-solid 库的需要，
   * enableReactive 为 true 时 ，设置此参数才有意义
   */
  enableRecordDep: boolean;
  /**
   * default: false，是否对传入进来的 obj 做浅拷贝
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

export interface IInnerCreateOptions extends ICreateOptionsFull {
  forAtom: boolean;
  forGlobal: boolean;
}

// collectionWay: FIRST_RENDER EVERY_RENDER EVERY_RENDER_MERGE
export interface IUseSharedOptions<T extends Dict = Dict> {
  /**
   * default: 'EVERY_RENDER'
   * 依赖收集方式，默认是每一轮渲染都去收集视图的最新依赖数据
   */
  way?: DepCollectionWay;
  /**
   * 组件的静态依赖，，一旦设置后当前组件的依赖收集行为将关闭，请慎用此设置
   */
  staticDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 除了收集到的依赖之外，补充的额外依赖项，如果设置 staticDeps 则此设置无效
   */
  extraDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 视图的id，在 ICreateOptionsFull.rules 里配置更新的 ids 包含的值指的就是此处配置的id，
   * 此id属于传入的 sharedState ，即和共享状态绑定了对应关系，意味着组件使用不同的 sharedState，
   * 时传入了相同的id，是相互隔离的状态
   */
  id?: NumStrSymbol;
  /**
   * 全局id，在 ICreateOptionsFull.rules 子项里配置 globalIds，
   * 此 id 不属于传入的 sharedState ，即 rules 触发的更新范围是全局的，和具体的 sharedState 无关，
   * 此 id 也可以通过 useGlobalId 设定
   */
  globalId?: NumStrSymbol;
  /**
   * @deprecated
   * default: false，
   * 这个特性可能移除，和现有流程不匹配
   */
  enableReactive?: boolean;
}

export interface IInnerUseSharedOptions<T extends Dict = Dict> extends IUseSharedOptions<T> {
  forAtom?: boolean;
}

export interface ISetStateOptions<T extends Dict = Dict, De extends any = any> {
  /**
   * 除了 setState 方法里收集的状态变化依赖之外，额外追加的变化依赖，适用于没有某些状态值无改变也要触发视图渲染的场景
   */
  extraDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 需要排除掉的依赖，因内部先执行 extraDeps 再执行 excludeDeps，故 excludeDeps 也能排除掉 extraDeps 追加的依赖
   */
  excludeDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 传递到 share 链的 mutable 回调参数里，方便 mutable 回调逻辑识别后做不同的修改动作，desc 始终执行源头调用设定的那个值
   */
  desc?: De;
}

export interface IInnerSetStateOptions<T extends Dict = Dict, De extends any = any> extends ISetStateOptions<T, De> {
  prevDesc?: De;
}

export type ICreateOptions<T extends Dict = Dict> = Partial<ICreateOptionsFull<T>>;

export type ModuleName = string;

export type TriggerReason = { sharedKey: number; moduleName: string; keyPath: string[] };

export type ICreateOptionsType<T extends Dict = Dict> = ModuleName | EenableReactive | ICreateOptions<T>;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;

export interface IWatchFnParams {
  isFirstCall: boolean;
}

export type WatchDepFn = () => any[] | void;

export interface IWatchOptions {
  dep?: WatchDepFn;
  /**
   * default: true，
   * 默认值为 true 是为了首次允许收集到依赖，如依赖在dep函数设定了，且不需要立即执行，
   * 则可以人工设定 immediate 为 false
   */
  immediate?: boolean;
}

export type WatchOptionsType = WatchDepFn | IWatchOptions;

export interface IDeriveFnParams<R extends any = any> {
  isFirstCall: boolean;
  prevResult: R | null;
}

export interface IAsyncTaskParams<S extends any = any, R extends any = any> extends IDeriveFnParams<R> {
  source: S;
}

export type DerivedResult<R extends PlainObject = PlainObject> = R;

export type DeriveFn<R extends PlainObject = PlainObject> = (params: IDeriveFnParams<R>) => R;

export type DerivedAtom<R extends any = any> = { val: R };

export type DeriveAtomFn<R extends any = any> = (params: IDeriveFnParams<R>) => R;

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

export type FnType = 'watch' | 'derive';

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
  careDeriveStatus: boolean;
  /** 是否是 atom 导出的结果 */
  forAtom: boolean;
  /**
   * default: false ，是否对计算结果开启记录读依赖功能，此功能仅针对 hook 里使用 useDerived 有效
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
  /** 依赖的 valKey 集合 */
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
  /** work for hook derived fnCtx */
  updater: Fn;
  /** work for hook derived fnCtx */
  isResultReaded: boolean;
  /** 只要结果曾经读取过就记录为 true */
  isResultReadedOnce: boolean;
  /** 为了更友好的支持热更新而加入的标记，标记当前 fnCtx 是否已过期 */
  isExpired: boolean;
  /**
   * 是否返回了上游的计算结算，方便为计算结果中转机制服务
   * work for derived result transfer mechanism
   */
  returnUpstreamResult: boolean;
  /** work for hook derived fnCtx */
  renderStatus: ReanderStatus;
  /** fn ctx created timestamp */
  createTime: number;
  /** work for hook derived fnCtx  */
  shouldReplaceResult: boolean;
  /**
   * 是否是异步的计算函数，使用了异步计算结果、返回了异步计算结果、返回了 asyncTask，满足任意一种情况都会标记为 true
   */
  isAsync: boolean;
  /** 是否是一个中转结果的异步函数，内部用的标记 */
  isAsyncTransfer: boolean;
  asyncType: AsyncType;
  subscribe: Fn;
  renderInfo: IRenderInfo;
}

export interface IRenderInfo {
  /** 渲染序号，多个实例拥有相同的此值表示属于同一批次被触发渲染 */
  sn: number;
  /**
   * 获取当前组件的依赖列表，通常需要再 useEffect 里调用能获取当前渲染收集的依赖，
   * 如在渲染过程中直接调用获取的是前一次渲染收集的依赖
   */
  getDeps: () => string[];
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
  /** 是否是第一次渲染 */
  isFirstRender: boolean;
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
  id: NumStrSymbol;
  globalId: NumStrSymbol;
  way: DepCollectionWay;
  /** 能否收集依赖 */
  canCollect: boolean;
  /** 是否有静态依赖 */
  hasStaticDeps: boolean;
  renderInfo: IRenderInfo;
}

export type InsCtxMap = Map<number, IInsCtx>;

export interface ICreateDerivedLogicOptions {
  careDeriveStatus?: boolean;
  scopeType?: ScopeType;
  fnCtxBase?: IFnCtx;
  allowTransfer?: boolean;
  runAsync?: boolean;
  asyncType?: AsyncType;
  returnUpstreamResult?: boolean;
  forAtom?: boolean;
}

export interface IHeluxParams {
  /**
   * 一个标识了 sharedKey 的普通json对象，可以作为一个始终可以获取到最新值的稳定引用
   */
  markedState: Dict;
  rawState: Dict;
  shouldSync: boolean;
  sharedKey: number;
  moduleName: string;
  createOptions: IInnerCreateOptions;
}

export interface IRuleConf {
  idsDict: KeyIdsDict;
  globalIdsDict: KeyIdsDict;
  stopDepInfo: {
    keys: string[];
    isArrDict: KeyBoolDict;
  };
}
