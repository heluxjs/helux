import type { ForwardedRef, FunctionComponent, PropsWithChildren, ReactNode } from '@helux/types';
import type { IOperateParams } from 'limu';
import type { DepKeyInfo } from './inner';

/**
 * 函数描述
 * ```text
 * creaaAction 或者 定义 mutateFn 等场景建议明确传递函数描述，方便接入 helux-plugin-redux-devtool 后
 * 可以明确追踪到每一个调用的具体出处，不加的话可能都为 setState 调用
 * ```
 */
export type FnDesc = string;

/**
 * 不使用 loading 模块，设置此项后，shared/atom 的异步 action 执行状态将不发送到 loading 模块
 */
export type NoRecord = 'no';

/**
 * 使用共享状态配套的伴生 loading 模块记录，异步 action 执行状态只发送到此伴生 loading 模块，降低函数 desc 命名冲突可能性
 */
export type RecordToPrivate = 'private';

/**
 * 使用 global loading 模块记录，异步 action 执行状态会发送到全局 loading 模块，会少占用一些内存
 * 但需要注意其他共享状态的 异步action函数的 desc 命名方式，避免相互覆盖
 */
export type RecordToGlobal = 'global';

export type RecordLoading = NoRecord | RecordToPrivate | RecordToGlobal;

export type From = 'Mutate' | 'Action' | 'SetState';

/**
 * onRead用于给开发者配置读操作钩子函数，所有值读取操作均触发此钩子函数，
 * 如果 onReadFn 返回了具体指，则会透传给用户，这是一个危险的操作，用户需自己为此负责
 */
export type OnRead = (opParams: IOperateParams) => any;

export interface IBlockCtx {
  key: string;
  results: DerivedDict[];
  /** all depKeys */
  depKeys: string[];
  /** 是否开启响应 status 功能 */
  enableStatus: boolean;
  collected: boolean;
  mounted: boolean;
  time: number;
  renderAtomOnce: boolean;
  /** for helping store ref temporarily */
  ref?: any;
  /** for helping store status temporarily */
  status: LoadingStatus;
}

/**
 * default: false ，是否启用响应 status 变化的功能
 * ```text
 * 为了性能考虑，默认 false 表示没有启用（内部会少调用一些钩子）
 * 如确认 block 组件内部有任何异步数据获取逻辑且需要使用透传的 status 做加载中判断，设置此选项为 true 即可
 * ```
 */
export type EnableStatus = boolean;

export interface IBlockOptions<P = object> {
  enableStatus?: EnableStatus;
  /**
   * default: true
   * block()返回组件实是否包裹React.memo，默认包裹
   */
  memo?: boolean;
  /**
   * default: undefined
   * memo 的比较函数，默认走 react 内置的浅比较规则，如确定 block 不传递任何 props，建议设置为 ()=>true
   */
  compare?: (prevProps: Readonly<PropsWithChildren<P>>, nextProps: Readonly<PropsWithChildren<P>>) => boolean;
}

export type BlockOptionsType = EnableStatus | IBlockOptions;

/**
 * block 渲染函数内部存在判断逻辑时，可使用 read 提前锁定住相关依赖
 * ```
 * // 注意输入的是可变长入参，返回的元组
 * const [val1, val2, val3] = read(1,2,3);
 * ```
 */
export type Read = <A extends readonly any[] = readonly any[]>(...args: A) => A;

export type BlockParams<P = object, T = any> = { props: P; status: LoadingStatus; read: Read; ref?: ForwardedRef<T> };

export type BlockCb<P = object, T = any> = (props: P, params?: BlockParams<T>) => ReactNode;

// maybe add a new interface that pass 3 args in the future ?
// export type BlockCbV2<P = object> = (props: P, ref?: ForwardedRef<any>, blockCtx: BlockCbCtx) => ReactNode;

export type BlockComponent<P = object> = FunctionComponent<P & { ref?: any }>;

export type Srv<S = Dict, P = Dict, E = Dict> = S & { inner: { getProps: () => P; getExtra: () => E } };

export type NumStr = number | string;

export type NumStrSymbol = number | string | symbol;

export type Dict<T = any> = Record<NumStrSymbol, T>;

export type PlainObject = Record<string, {}>;

export type DictN<T = any> = Record<number, T>;

export type DictS<T = any> = Record<string, T>;

export type Fn<T = any> = (...args: any[]) => T;

export type FnA<A extends ReadOnlyArr = ReadOnlyArr> = (...args: A) => void;

export type Off = Fn;

export type SharedDict<T = PlainObject> = T;

/** returned by share */
export type ReadOnlyDict<T = PlainObject> = T;

/** returned by derive */
export type DerivedDict<R = PlainObject> = R;

/** shared result derive fn definition  */
export type DeriveFn<R = PlainObject> = (params: IDeriveFnParams<R>) => R;

export type NextSharedDict<T = PlainObject> = T;

export type NextAtom<T = any> = { val: T };

/** returned by atom */
export type Atom<T = any> = { val: T };

/** returned by deriveAtom */
export type DerivedAtom<R = any> = { val: R };

/** derive atom fn definition  */
export type DeriveAtomFn<R = any> = (params: IDeriveAtomFnParams<R>) => R;

export type NextAtomVal<T> = T;

export type ReadonlyAtom<T = any> = { readonly val: T };

export type Ext<T = Dict, V = any> = T & { [key: string]: V };

export type KeyBoolDict = Record<string, boolean>;

export type KeyIdsDict = Record<string, NumStrSymbol[]>;

export type KeyInsKeysDict = Record<NumStrSymbol, number[]>;

export type DraftRoot<T = SharedDict> = T;

/** boxed atom draft */
export type AtomDraftRoot<T = any> = { val: T };

/** unboxed atom draft */
export type AtomDraft<T = any> = T;

export type SharedState = SharedDict | Atom;

/** can pass to signal fn */
export type SingalVal = Atom | DerivedAtom | NumStrSymbol | ReactNode | BlockComponent;

export type AtomValType<T> = T extends Atom<infer V> ? V : T;

export type LoadingStatus = {
  loading: boolean;
  err: Error | null;
  /** ok=!loading && !err */
  ok: boolean;
};

export type LoadingState<T = Dict> = {
  [key in keyof T]: LoadingStatus;
};

export type ActionFnParam<A = any[], T = SharedDict> = {
  draft: DraftRoot<T>;
  draftRoot: DraftRoot<T>;
  setState: SetState<T>;
  desc: string;
  args: A;
};

export type ActionAsyncFnParam<A = any[], T = SharedDict> = { setState: SetState<T>; desc: string; args: A };

export type ActionFnDef<A = any[], T = SharedDict> = (param: ActionFnParam<A, T>) => Partial<T> | void;

export type Action<A extends any[] = any[], T = SharedDict> = (...args: A) => NextSharedDict<T>;

export type ActionAsyncFnDef<A = any[], T = SharedDict> = (param: ActionAsyncFnParam<A, T>) => void;

export type ActionAsync<A extends any[] = any[], T = SharedDict> = (...args: A) => Promise<NextSharedDict<T>>;

// atom action series

export type AtomActionFnParam<A = any[], T = any> = {
  draft: AtomDraft<T>;
  draftRoot: AtomDraftRoot<T>;
  setState: SetAtom<T>;
  desc: string;
  args: A;
};

export type AtomActionAsyncFnParam<A = any[], T = any> = { setState: SetAtom<T>; desc: string; args: A };

export type AtomActionFnDef<A = any[], T = any> = (param: AtomActionFnParam<A, T>) => Partial<T> | void;

export type AtomAction<A extends any[] = any[], T = any> = (...args: A) => NextAtom<T>;

export type AtomActionAsyncFnDef<A = any[], T = any> = (param: AtomActionAsyncFnParam<A, T>) => void;

export type AtomActionAsync<A extends any[] = any[], T = any> = (...args: A) => Promise<NextAtom<T>>;

export type ReadOnlyArr = readonly any[];

export interface IRunMutateOptions {
  desc?: string;
  /**
   * default: false，是否严格检查传入的 sharedState 变量为共享对象
   * true，严格检查，如果检查失败，则报错
   * false，非严格检查，如果检查失败，则原样返回传入对象
   */
  strict?: boolean;
}

export interface IMutateTaskParam<T = SharedDict, A = any[]> {
  /**
   * 函数描述
   */
  desc: string;
  setState: SetState<T>;
  input: A;
}

export interface IAtomMutateTaskParam<T = any, A = any[]> {
  desc: FnDesc;
  setState: SetAtom<T>;
  input: A;
}

/** 呼叫 mutate 的句柄，由顶层api mutate 和 atomMutate 返回，可直接无理由重运行 mutate 函数 */
export type MutateCall<T = any> = () => T;

export type MutateTaskCall<T = any> = () => Promise<T>;

export type MutateWitness<T = any> = {
  /** 人工调用 mutate 配置里的同步函数 */
  call: MutateCall<T>;
  /** 人工调用 mutate 配置里的异步函数 */
  callTask: MutateTaskCall<T>;
  /** 用户透传的原始描述值 */
  oriDesc: string;
  /** 内部生成的实际描述值 */
  desc: string;
  snap: T;
};

// for dict
export type MutateTask<T = SharedDict, A = ReadOnlyArr> = (param: IMutateTaskParam<T, A>) => Promise<void>;

/** 如定义了 task 函数，则 fn 在异步函数执行之前回执行一次，且只在首次执行一次，后续不会执行 */
export type MutateFn<T = SharedDict, A = ReadOnlyArr> = (draft: DraftRoot<T>, params: { input: A; state: T }) => void;

export type MutateFnItem<T = SharedDict, A = ReadOnlyArr> = {
  /** 异步 mutate 的依赖项列表 */
  deps?: (state: T) => A;
  fn?: MutateFn<T, A>;
  task?: MutateTask<T, A>;
  /** default: false, task 是否立即执行 */
  immediate?: boolean;
};

/** std item 确保了 desc 一定存在 */
export type MutateFnStdItem<T = any, A = ReadOnlyArr> = MutateFnItem<T, A> & {
  /** 用户透传的原始 desc */
  oriDesc: string;
  /** 可能是内部生成的 desc */
  desc: string;
};

export type MutateFnLooseItem<T = SharedDict, A = ReadOnlyArr> = MutateFnItem<T, A> & {
  /** 建议用户指定，无指定时内部会自动生成唯一 desc */
  desc?: FnDesc;
};

export type MutateFnDict<T = SharedDict> = Dict<MutateFn<T> | MutateFnItem<T>>;

export type MutateFnItemDict<T = SharedDict> = Dict<MutateFnItem<T>>;

/** 内部用 */
export type MutateFnStdDict<T = SharedDict> = Dict<MutateFnStdItem<T>>;

export type MutateFnList<T = SharedDict> = Array<MutateFn<T> | MutateFnLooseItem<T>>;

// for atom
export type AtomMutateTask<T = any, A = ReadOnlyArr> = (param: IAtomMutateTaskParam<T, A>) => Promise<void>;

/** 如定义了 task 函数，则 atom fn 在异步函数执行之前回执行一次，且只在首次执行一次，后续不会执行 */
export type AtomMutateFn<T = any, A = ReadOnlyArr> = (draft: AtomDraft<T>, params: { input: A; state: T }) => void;

export type AtomMutateFnItem<T = any, A = ReadOnlyArr> = {
  /** 如定义了 task，fn 只会执行一次 */
  fn?: AtomMutateFn<T, A>;
  /** 异步 atom mutate 的依赖项列表 */
  deps?: (state: T) => A;
  /** 异步计算任务 */
  task?: AtomMutateTask<T, A>;
  /** default: false, task 是否立即执行 */
  immediate?: boolean;
};

/** std item 确保了 desc 一定存在 */
export type AtomMutateFnStdItem<T = any, A = ReadOnlyArr> = AtomMutateFnItem<T, A> & {
  /** 用户透传的原始 desc */
  oriDesc: string;
  /** 可能是内部生成的 desc */
  desc: string;
};

export type AtomMutateFnLooseItem<T = any, A = ReadOnlyArr> = AtomMutateFnItem<T, A> & {
  /** 建议用户指定，无指定时内部会自动生成唯一 desc */
  desc?: FnDesc;
};

export type AtomMutateFnDict<T = any> = Dict<AtomMutateFn<T> | AtomMutateFnItem<T>>;

export type AtomMutateFnItemDict<T = SharedDict> = Dict<AtomMutateFnItem<T>>;

export type AtomMutateFnStdDict<T = any> = Dict<AtomMutateFnStdItem<T>>;

export type AtomMutateFnList<T = any> = Array<AtomMutateFn<T> | AtomMutateFnLooseItem<T>>;

export type PartialStateCb<T = Dict> = (prev: T) => Partial<T> | void;

export type ChangeDraftCb<T = Dict> = (mutableDraft: T) => Partial<T> | void;

export type DeriveFnItem<T = Dict, I = readonly any[]> = {
  deps?: () => I;
  fn?: (params: IDeriveFnParams<T, I>) => T;
  task?: (params: IDeriveFnParams<T, I>) => Promise<T>;
  immediate?: boolean;
};

export type DeriveAtomFnItem<T = any, I = readonly any[]> = {
  fn: (params: IDeriveAtomFnParams<T, I>) => T;
  deps?: () => I;
  task: (params: IDeriveAtomFnParams<T, I>) => Promise<T>;
  immediate?: boolean;
};

export type SetState<T = Dict> = (
  partialStateOrRecipeCb: Partial<T> | ((draft: DraftRoot<T>) => void | Partial<T>),
  options?: ISetStateOptions<T>,
) => NextSharedDict<T>;

/** dangerous asyn set state */
export type AsyncSetState<T = Dict> = (
  partialStateOrRecipeCb: Partial<T> | ((draft: DraftRoot<T>) => void | Partial<T>),
  options?: ISetStateOptions<T>,
) => Promise<NextSharedDict<T>>;

export type SetAtom<T = any> = (
  newAtomOrRecipeCb: T | ((draft: AtomDraft<T>) => void | T),
  options?: ISetStateOptions<Atom<T>>,
) => NextAtomVal<T>;

export type InnerSetState<T = Dict> = (
  partialStateOrRecipeCb: Partial<T> | ((draft: DraftRoot<T>) => void | Partial<T>),
  options?: IInnerSetStateOptions<T>,
) => NextSharedDict<T>;

export type Call<T = Dict> = <A extends any[] = any[]>(
  srvFn: (ctx: { args: A; state: Readonly<T>; draft: DraftRoot<T>; draftRoot: DraftRoot<T>; setState: SetState<T> }) => Partial<T> | void,
  ...args: A
) => NextSharedDict<T>;

/**
 * 👿 呼叫异步函数修改 draft 是危险的行为，可能会造成数据脏覆盖的情况产生
 */
export type CallAsync<T = Dict> = <A extends any[] = any[]>(
  srvFn: (ctx: {
    args: A;
    state: Readonly<T>;
    draft: DraftRoot<T>;
    draftRoot: DraftRoot<T>;
    setState: SetState<T>;
  }) => Promise<Partial<T> | void>,
  ...args: A
) => Promise<NextSharedDict<T>>;

export type AtomCall<T = any> = <A extends any[] = any[]>(
  srvFn: (ctx: { args: A; state: ReadonlyAtom<T>; draft: AtomDraft<T>; draftRoot: AtomDraftRoot<T>; setState: SetAtom<T> }) => T | void,
  ...args: A
) => NextAtomVal<T>;

/**
 * 👿 呼叫异步函数修改 atom draft 是危险的行为，可能会造成数据脏覆盖的情况产生
 */
export type AtomCallAsync<T = any> = <A extends any[] = any[]>(
  srvFn: (ctx: {
    args: A;
    state: ReadonlyAtom<T>;
    draft: AtomDraft<T>;
    draftRoot: AtomDraftRoot<T>;
    setState: SetAtom<T>;
  }) => Promise<T | void>,
  ...args: A
) => Promise<NextAtomVal<T>>;

export type SyncerFn = (mayEvent: any, ...args: any[]) => void;

export type PathRecorder<T = SharedState, V = any> = (target: T) => V;

// 此处用 V 约束 before 函数的返回类型
export type SyncFnBuilder<T = SharedDict, V = any> = (
  pathOrRecorder: string[] | PathRecorder<T>,
  /** 在提交数据之前，还可以修改其他数据或自身数据的函数 */
  before?: (eventNewVal: V, draft: T) => void,
) => SyncerFn;

export type AtomSyncFnBuilder<T = any, V = any> = (
  pathOrRecorder: string[] | PathRecorder<T>,
  /** 在提交数据之前，还可以修改其他数据或自身数据的函数 */
  before?: (eventNewVal: V, draft: AtomDraft<T>) => void,
) => SyncerFn;

export type Syncer<T = Dict> = { [key in keyof T]: SyncerFn };

export type AtomSyncer<T = any> = T extends Dict ? { [key in keyof T]: SyncerFn } : SyncerFn;

export type SafeLoading<T = SharedState, O extends ICreateOptions<T> = ICreateOptions<T>> = O['mutate'] extends MutateFnDict<T>
  ? Ext<LoadingState<O['mutate']>, LoadingStatus>
  : Ext<LoadingState, LoadingStatus>;

export type AtomSafeLoading<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>> = O['mutate'] extends AtomMutateFnDict<T>
  ? Ext<LoadingState<O['mutate']>, LoadingStatus>
  : Ext<LoadingState, LoadingStatus>;

export interface ISharedStateCtxBase {
  /**
   * 配置 onRead 钩子函数
   */
  setOnReadHook: (onRead: OnRead) => void;
  /** 共享状态唯一 key */
  sharedKey: number;
  sharedKeyStr: string;
  rootValKey: string;
}

export interface ISharedCtx<T = SharedDict, O extends ICreateOptions<T> = ICreateOptions<T>> extends ISharedStateCtxBase {
  mutate: <A extends ReadOnlyArr = ReadOnlyArr>(fnItem: MutateFnLooseItem<T, A> | MutateFn<T, A>) => MutateWitness<T>;
  runMutate: (descOrOptions: string | IRunMutateOptions) => T;
  runMutateTask: (descOrOptions: string | IRunMutateOptions) => T;
  call: Call<T>;
  callAsync: CallAsync<T>;
  action: <A extends any[] = any[]>(fn: ActionFnDef<A, T>, desc?: FnDesc) => Action<A, T>;
  actionAsync: <A extends any[] = any[]>(fn: ActionAsyncFnDef<A, T>, desc?: FnDesc) => ActionAsync<A, T>;
  state: ReadOnlyDict<T>;
  setState: SetState<T>;
  sync: SyncFnBuilder<T>;
  syncer: Syncer<T>;
  useState: (options?: IUseSharedStateOptions<T>) => [T, SetState<T>, IInsRenderInfo];
  /** 获取 Mutate 状态 */
  getMutateLoading: () => SafeLoading<T, O>;
  /** 使用 Mutate 状态 */
  useMutateLoading: () => [SafeLoading<T, O>, SetState<LoadingState>, IInsRenderInfo];
  /** 获取 Action 状态 */
  getActionLoading: () => SafeLoading<T, O>;
  /** 使用 Action 状态 */
  useActionLoading: () => [SafeLoading<T, O>, SetState<LoadingState>, IInsRenderInfo];
}

export interface IAtomCtx<T = any, O extends IAtomCreateOptions<T> = IAtomCreateOptions<T>> extends ISharedStateCtxBase {
  mutate: <A extends ReadOnlyArr = ReadOnlyArr>(fnItem: AtomMutateFnLooseItem<T, A> | AtomMutateFn<T, A>) => MutateWitness<T>;
  call: AtomCall<T>;
  callAsync: AtomCallAsync<T>;
  action: <A extends any[] = any[]>(fn: AtomActionFnDef<A, T>, desc?: FnDesc) => AtomAction<A, T>;
  actionAsync: <A extends any[] = any[]>(fn: AtomActionAsyncFnDef<A, T>, desc?: FnDesc) => AtomActionAsync<A, T>;
  state: ReadonlyAtom<T>;
  setState: SetAtom<T>;
  sync: AtomSyncFnBuilder<T>;
  syncer: AtomSyncer<T>;
  useState: (options?: IUseSharedStateOptions<T>) => [T, SetAtom<T>, IInsRenderInfo];
  /** 获取 Mutate 状态 */
  getMutateLoading: () => AtomSafeLoading<T, O>;
  /** 使用 Mutate 状态 */
  useMutateLoading: () => [AtomSafeLoading<T, O>, SetState<LoadingState>, IInsRenderInfo];
  /** 获取 Action 状态 */
  getActionLoading: () => AtomSafeLoading<T, O>;
  /** 使用 Action 状态 */
  useActionLoading: () => [AtomSafeLoading<T, O>, SetState<LoadingState>, IInsRenderInfo];
  setAtomVal: (val: T) => void;
}

interface IMutateFnParamsBase {
  from: From;
  desc?: FnDesc;
  sn?: number;
}

export interface IMutateFnParams<T = SharedState> extends IMutateFnParamsBase {
  draftRoot: DraftRoot<T>;
  draft: DraftRoot<T>;
}

export interface IAtomMutateFnParams<T = any> extends IMutateFnParamsBase {
  draftRoot: AtomDraftRoot<T>;
  draft: AtomDraft<T>;
}

export interface IDataRule<T = any> {
  /**
   * 当这些数据节点发生变化时和被读取时，对应的各种行为
   * 对于 atom ，回调里的 stateNode 是已拆箱的结果
   */
  when: (stateNode: T) => any[] | void;
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
}

export interface ICreateOptionsBaseFull<T = any> {
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
   * default: 'private' ，表示loading 对象记录的位置，具体含义见 recordLoading，
   * 注：loading 对象用于辅助查询 mutate 或者 action 异步函数的执行状态
   */
  recordLoading: RecordLoading;
  /**
   * default: 6
   * 依赖收集的深度，默认 6， 意味着对复杂对象至多收集到第六层 json path 作为依赖
   */
  stopDepth: number;
  /**
   * deufalt: true
   * 遇到数组结构时，是否停止收集依赖，true 表示停止，此时只会收集到带下标的 json path，
   * 如：a|b|c|list|0，针对数组结构，stopDepthOfArr 会是 stopDepth + 1，多的一层用于记录下标值
   */
  stopArrDep: boolean;
  /**
   * 配置状态变更联动视图更新规则
   */
  rules: IDataRule<T>[];
  /**
   * default: fasle，是否允许对草稿对象读值时收集依赖，
   * 默认不允许，否则 mutate 回调里使用类似 draft.a +=1 时很容易造成死循环，
   * 此参数偏向于面向库开发者来使用
   */
  enableDraftDep: boolean;
}

export interface ICreateOptionsFull<T = Dict> extends ICreateOptionsBaseFull<T> {
  /**
   * 定义当前状态对其他状态有依赖的 mutate 函数集合或函数，它们将被自动执行，并收集到每个函数各自对应的上游数据依赖
   */
  mutate: MutateFn<T> | MutateFnDict<T> | MutateFnList<T>;
  /**
   * action、mutate、setState、sync提交状态之前的函数，可对draft操作，如需要返回则返回的部分对象是全新值才是安全的草稿，该函数执行时机是在中间件之前
   */
  before: (params: IMutateFnParams<T>) => void | Partial<T>;
}

export interface IAtomCreateOptionsFull<T = any> extends ICreateOptionsBaseFull<T> {
  /**
   * 定义当前状态对其他状态有依赖的 mutate 函数集合或函数，它们将被自动执行，并收集到每个函数各自对应的上游数据依赖
   */
  mutate: AtomMutateFn<T> | AtomMutateFnDict<T> | AtomMutateFnList<T>;
  /**
   * action、mutate、setState、sync提交atom状态之前的函数，可对draft操作，也可返回新的atom值，该函数执行时机是在中间件之前
   */
  before: (params: IAtomMutateFnParams<T>) => void;
}

export interface IInnerCreateOptions<T = SharedState> extends ICreateOptionsFull<SharedState> {
  forAtom: boolean;
  forGlobal: boolean;
  stateType: string;
  loc: string;
  mutateFns: Array<MutateFnLooseItem<T>>;
}

export interface IUseSharedStateOptions<T = any> {
  /**
   * default: every ，设置为 first 或 no 可以进一步提高组件渲染性能，但需要注意
   * first 时如果组件的依赖是变化的，会造成依赖丢失的情况产生，触发组件不会重渲染的bug，
   * no 时不会从ui渲染力收集到依赖，需 deps 函数补充依赖
   * ```txt
   * no ，此时依赖仅靠 deps 提供
   * first ，仅首轮渲染收集依赖，后续渲染流程不收集
   * every ，每一轮渲染流程都实时收集
   * ```
   */
  collectType?: 'no' | 'first' | 'every';
  /**
   * 视图的id，在 ICreateOptionsFull.rules 里配置更新的 ids 包含的值指的就是此处配置的id，
   * 此id属于传入的 sharedState ，即和共享状态绑定了对应关系，意味着组件使用不同的 sharedState
   * 时传入了相同的id，是相互隔离的
   */
  id?: NumStrSymbol;
  /**
   * default: true ，是否以 pure 模式使用状态，此参数只影响字典数据的依赖收集规则
   * ```
   * 1 为 true，表示状态仅用于当前组件ui渲染，此模式下不会收集中间态字典依赖，只记录字典最长依赖
   * 2 为 false，表示状态不只是用于当前组件ui渲染，还会透传给 memo 的子组件，透传给 useEffect 依赖数组，
   *   此模式下会收集中间态字典依赖，不丢弃记录过的字典依赖
   * ```
   * 组件 Demo 使用示例
   * ```ts
   * function Demo(){
   *  const [state] = useAtom(dictAtom, { pure: true });
   *  const { extra, name, desc } = state;
   *  // 这里继续下钻读取了 state.extra 的子节点，故state.extra 算作一个中间态的依赖
   *  const { list, mark } = extra;
   * }
   *
   * // pure = true 时，extra 被忽略
   * 此时依赖为: name, desc, extra.list, extra.mask
   *
   * // pure = false 时，extra 被收集
   * 此时依赖为: name, desc, extra, extra.list, extra.mask
   *
   * ```
   * pure = true ，拥有更好的重渲染命中精准度
   * ```ts
   * // 重新赋值了 extra，但其实 extra.list, extra.mask 孩子节点没变化，
   * // helux 内部经过比较 extra.list, extra.mask 值发现无变化后不会重渲染 Demo
   * setState(draft=> draft.extra = { ...draft.extra });
   *
   * // 👻 但要注意，此时如果 extra 传给了 useEffect，并不会因为 extra的变化而引起 Effect 重新执行
   * useEffect(()=>{//...logic}, [state.extra]);
   * // 如执行了则是因为其他依赖引起组件重渲染刚好顺带触发了 Effect 执行
   *
   * // 所以这里如需要中间态依赖也能正常收集到，有以下两种方式
   * // 1 【推荐】人工补上 extrta 依赖（相当于固定住依赖）
   * useAtom(dictAtom, { deps: state=>state.extra });
   * // 2 设置 pure 为 false
   * useAtom(dictAtom, { pure: false });
   * useAtom(dictAtom);
   * ```
   */
  pure?: boolean;
  /**
   * 组件件可在渲染过实时收集到依赖，如需补充一些组件渲染过程中不体现的额外依赖时，设置此函数
   * 此时组件的依赖是 deps 返回依赖和渲染完毕收集到的依赖合集
   */
  deps?: (readOnlyState: T) => any[] | void;
  /**
   * default: true，是否记录数组自身依赖，当确认是孩子组件自己读数组下标渲染的场景，可设置为 false，
   * 这样数组被重置时不会触发重渲染
   * ```ts
   * // true: 记录数组自身依赖
   * const [ dict ] = useAtom(dictAtom);
   * // 此时依赖是 dict, dict.list[0]
   * dict.list[0];
   * // 重置 list，引发当前组件重渲染
   * setDictAtom(draft=> draft.list = draft.list.slice());
   *
   * // false: 不记录数组自身依赖，适用于孩子组件自己读数组下标渲染的场景
   * const [ dict ] = useAtom(dictAtom, { arrDep: false });
   * // 此时依赖是 dict.list[0]
   * dict.list[0];
   * // 重置 list，不会引发当前组件重渲染
   * setDictAtom(draft=> draft.list = draft.list.slice());
   * ```
   */
  arrDep?: boolean;
  /**
   * default: true，是否记录数组下标依赖，当通过循环数组生成孩子的场景，可设置为 false，减少组件自身的依赖记录数量，
   * 此参数在 arrDep=true 时设置有效，arrDep=false 时，arrIndexDep 被自动强制设为 true
   *
   * ```ts
   * arrDep=true arrIndexDep = true
   * deps: list list[0] list[...]
   *
   * arrDep=true arrIndexDep = false
   * deps: list
   *
   * arrDep=false
   * deps: list[0] list[...]
   * ```
   */
  arrIndexDep?: boolean;
}

export interface IInnerUseSharedOptions<T = Dict> extends IUseSharedStateOptions<T> {
  /**
   * 全局id，在 ICreateOptionsFull.rules 子项里配置 globalIds，
   * 此 id 需通过 useGlobalId 设定
   */
  globalId?: NumStrSymbol;
  forAtom?: boolean;
}

export interface ISetStateOptions<T = any> {
  /**
   * 除了 setState 方法里收集的状态变化依赖之外，额外追加的变化依赖，适用于没有某些状态值无改变也要触发视图渲染的场景
   */
  extraDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 需要排除掉的依赖，因内部先执行 extraDeps 再执行 excludeDeps，故 excludeDeps 也能排除掉 extraDeps 追加的依赖
   */
  excludeDeps?: (readOnlyState: T) => any[] | void;
  /**
   * 会传递到插件，标识调用源
   */
  desc?: FnDesc;
  /**
   * 功能同 ICreateOptions.rules[].ids，触发带 id 的组件实例更新
   */
  ids?: NumStrSymbol[];
  /**
   * 功能同 ICreateOptions.rules[].globalIds，触发带 globalId 的组件实例更新
   */
  globalIds?: NumStrSymbol[];
}

export interface IInnerSetStateOptions<T = Dict> extends ISetStateOptions<T> {
  from?: From;
  isAsync?: boolean;
  isFirstCall?: boolean;
  sn?: number;
}

export type ICreateOptions<T = Dict> = Partial<ICreateOptionsFull<T>>;

export type IAtomCreateOptions<T = any> = Partial<IAtomCreateOptionsFull<T>>;

export type TriggerReason = { sharedKey: number; moduleName: string; keyPath: string[] };

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;

export interface IWatchFnParams {
  isFirstCall: boolean;
  sn?: number;
}

export type WatchDepFn = () => any[] | undefined;

export interface IWatchOptions {
  deps?: WatchDepFn;
  /**
   * default: false，
   * 如没有定义 deps 依赖，需设置 immediate，这样可以让 watch 首次执行后收集到相关依赖，
   * 当然也可以定义了 deps 依赖的情况下设置 immediate 为 true，这样整个 watch 函数的依赖是
   * deps 定义的和 watch 首次执行后收集到的两者合并的结果
   */
  immediate?: boolean;
}

export type WatchOptionsType = WatchDepFn | IWatchOptions;

export interface IDeriveFnParamsBase<I = readonly any[]> {
  /** 函数的运行编号，每次自增1 */
  sn: number;
  isFirstCall: boolean;
  triggerReasons: TriggerReason[];
  input: I;
}

export interface IDeriveFnParams<T = Dict, I = readonly any[]> extends IDeriveFnParamsBase<I> {
  prevResult: T | null;
}

export interface IDeriveAtomFnParams<R = any, I = readonly any[]> extends IDeriveFnParamsBase<I> {
  prevResult: Atom<R> | null;
}

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

export type AsyncType = 'source' | 'task' | 'may_transfer';

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
   *  deriveAsync/useDeriveAsync 传入的异步计算任务函数
   */
  task: Fn;
  /** 记录 task或fn 对应的 deps 函数，结果会透传给 input */
  deps: () => any[];
  /**
   * default: true，是否是处于第一层的函数，使用了其他计算结果时就会表标记为 false
   */
  isFirstLevel: boolean;
  /**
   * 当前函数的计算状态
   */
  status: LoadingStatus;
  /** 当前函数对应的下游函数中还剩几个需要执行 */
  remainRunCount: number;
  /**
   * 是否展示异步计算函数的变化过程
   */
  showLoading: boolean;
  /** 是否是 atom 导出的结果 */
  forAtom: boolean;
  /**
   * 直接依赖此函数的下一层函数列表，如其他函数使用了此函数的返回结果（包括中转返回结果），则它们的 key 会被记录到这里
   */
  nextLevelFnKeys: string[];
  /** 此函数依赖的上一层函数列表，如此函数内部使用了其他函数的返回结果，则把其他函数的 key 会被记录到这里 */
  prevLevelFnKeys: string[];
  /** 未挂载 已挂载 已卸载 */
  mountStatus: MountStatus;
  /** 依赖的 depKey 集合 */
  depKeys: string[];
  /** 依赖的共享状态 key 集合 */
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
   * 是否是异步的计算函数，满足任意一种情况都会标记为 true
   * 1 使用了异步计算结果、
   * 2 返回了异步计算结果、
   * 3 返回了 asyncTask，
   */
  isAsync: boolean;
  /** 是否是一个中转结果的异步函数，内部用的标记 */
  isAsyncTransfer: boolean;
  asyncType: AsyncType;
  subscribe: Fn;
  renderInfo: IRenderInfo;
  /** 记录一些需复用的中间生成的数据 */
  extra;
  setLoading: (loading: boolean, err?: any) => void;
}

export interface IRenderInfo {
  /** 渲染序号，多个实例拥有相同的此值表示属于同一批次被触发渲染 */
  sn: number;
  /**
   * 获取派生结果对应的依赖
   */
  getDeps: () => string[];
}

export interface IInsRenderInfo {
  /** 渲染序号，多个实例拥有相同的此值表示属于同一批次被触发渲染 */
  sn: number;
  /** 实例 key */
  insKey: number;
  /**
   * 获取组件的当前渲染周期里收集到依赖列表，通常需要在 useEffect 里调用能获取当前渲染周期收集的所有依赖，
   * 如在渲染过程中直接调用获取的是正在收集中的依赖（注：依赖包含了 deps 函数固定住的依赖）
   */
  getDeps: () => string[];
  snap: any;
  /**
   * 获取组件的前一次渲染周期里收集到依赖列表（注：依赖包含了 deps 函数固定住的依赖）
   */
  getPrevDeps: () => string[];
}

export interface IInsCtx<T = Dict> {
  /** 当前渲染完毕所依赖的 key 记录 */
  readMap: Dict;
  /** 已标记删除的 key 记录 */
  delReadMap: Dict;
  /** 是否是 pure 模式 */
  pure: boolean;
  depKeys: string[];
  /** deps 函数写入的固定依赖 */
  fixedDepKeys: string[];
  currentDepKeys: string[];
  /** 是否是深度依赖收集模式 */
  isDeep: boolean;
  /** 是否是第一次渲染 */
  isFirstRender: boolean;
  insKey: number;
  /** 记录一些需复用的中间生成的数据 */
  extra: Dict;
  internal: T;
  rawState: Dict;
  sharedState: Dict;
  proxyState: Dict;
  rootVal: any;
  updater: Fn;
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
  /** 全局id，此属性只服务于 useGlobaId 设定的 globalId */
  globalId: NumStrSymbol;
  /**
   * default: every
   * 使用钩子函数时透传的能否收集依赖的标记
   */
  collectType: 'no' | 'first' | 'every';
  /**
   * default: true
   * 计算出的能否收集依赖标记，如透传了 options.collect=false，会在首轮渲染结束后标记为 false
   */
  canCollect: boolean;
  getDeps: IInsRenderInfo['getDeps'];
  renderInfo: IInsRenderInfo;
  /** inner high frequency call func, for perf, no options */
  recordDep: (depKeyInfo: DepKeyInfo, parentType?: string, isValArrLike?: boolean) => void;
}

export type InsCtxMap = Map<number, IInsCtx>;

export interface ICreateDeriveLogicOptions {
  isAsync?: boolean;
  showLoading?: boolean;
  scopeType?: ScopeType;
  fnCtxBase?: IFnCtx;
  isAsyncTransfer?: boolean;
  runAsync?: boolean;
  asyncType?: AsyncType;
  returnUpstreamResult?: boolean;
  forAtom?: boolean;
  immediate?: boolean;
}

export interface IRuleConf {
  hasIds: boolean;
  idsDict: KeyIdsDict;
  hasGlobalIds: boolean;
  globalIdsDict: KeyIdsDict;
  stopDepInfo: {
    depth: number;
    keys: string[];
    isArrDict: KeyBoolDict;
    arrKeyStopDcit: KeyBoolDict;
    stopArrDep: boolean;
  };
}

interface ICallMutateFnOptions<T = SharedState> {
  forTask: boolean;
  fn?: MutateFn<T> | AtomMutateFn<T>;
  task?: MutateTask<T> | AtomMutateTask<T>;
  desc?: FnDesc;
  sn?: number;
  deps?: Fn;
  throwErr?: boolean;
}

export interface IUseDerivedOptions {
  /**
   * default: undefined
   * 大多数不需要人为控制此参数，内部会自己判断使用的导出结果是否含异步过程来确定是否有 loading
   * ```ts
   * // 人为控制无loading，不管是否使用异步结果
   * const [ result ] = useDerivedAsync(result, { showLoading: false })
   * ```
   */
  showLoading?: boolean;
}

export interface IWatchAndCallMutateDictOptions<T = SharedState> {
  target: T;
  dict: MutateFnStdDict<T> | AtomMutateFnStdDict<T>;
}

export interface IChangeInfoBase {
  sharedKey: number;
  moduleName: string;
}

export interface IDataChangingInfo extends IChangeInfoBase {
  draftRoot: DraftRoot | AtomDraftRoot;
  draft: DraftRoot | AtomDraft;
  forAtom: boolean;
}

export interface IDataChangedInfo extends IChangeInfoBase {
  type: string;
  snap: SharedState;
}

export interface IMiddlewareCtx extends IDataChangingInfo {
  /** setData 存储的数据，下一个中间件可获取 */
  data: Dict;
  setData(key: any, value: any);
  /** 中间件下标 */
  idx: number;
  /** 执行状态修改的批次编号 */
  sn: number;
}

export type Middleware = (midCtx: IMiddlewareCtx) => void;

export type PluginStateChangedOnCb = (info: IDataChangedInfo) => void;

export type PluginStateChangedOn = (cb: PluginStateChangedOnCb) => void;

export type PluginCommonOnCb = (data: any) => void;

export type PluginCommonOn = (heluxEventName: string, cb: PluginCommonOnCb) => void;

export type PluginCtx = { on: PluginCommonOn; onStateChanged: PluginStateChangedOn };

/**
 * 内置一些高频使用的时间监听，如 onStateChanged
 */
export type PluginInstall = (pluginCtx: PluginCtx) => void;

export interface IPlugin {
  install: PluginInstall;
  name?: string;
  desc?: FnDesc;
}
