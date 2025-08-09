/*
|------------------------------------------------------------------------------------------------
| helux-core@5.5.0
| A state library core that integrates atom, signal, collection dep, derive and watch,
| it supports all react like frameworks ( including react 18 ).
|------------------------------------------------------------------------------------------------
*/
import type { ForwardedRef, MutableRefObject, ReactNode } from '@helux/types';
import type { HooksApiImpl } from '@helux/hooks-impl';
import type {
  Draft,
  GenNewStateCb,
  ICreateDraftOptions,
} from 'limu';
import type {
  Action,
  ActionAsync,
  ActionTask,
  Atom,
  AtomValType,
  BlockComponent,
  ChangeDraftCb,
  DerivedAtom,
  DerivedDict,
  DerivedResultType,
  DeriveFn,
  Dict,
  EffectCb,
  EnableStatus,
  Fn,
  IAtomCtx,
  IBindAtomOptions,
  IBlockOptions,
  IBlockParams,
  IBoundStateInfo,
  ICompAtomCtx,
  ICompReactiveCtx,
  ICreateActionOptions,
  ICreateOptions,
  IDeriveFnItem,
  IDeriveTaskOptions,
  IInitOptions,
  IInsRenderInfo,
  IMutateFnItem,
  IMutateFnLooseItem,
  IMutateWitness,
  IPlugin,
  IRenderInfo,
  IRunMutateOptions,
  ISharedCtx,
  IUseDerivedOptions,
  IUseSharedStateOptions,
  IWatchFnParams,
  IWithAtomOptions,
  JSONDict,
  LoadingState,
  LoadingStatus,
  Middleware,
  MutateFn,
  MutateFnDict,
  NoRecord,
  NumStrSymbol,
  Off,
  PartialStateCb,
  PlainObject,
  ReadOnlyArr,
  ReadOnlyAtom,
  ReadOnlyDict,
  SafeLoading,
  SetState,
  SharedState,
  SingalVal,
  Syncer,
  SyncFnBuilder,
  WatchEffectOptionsType,
  WatchOptionsType,
  ILocalStateApi,
} from './base';
import * as limuApi from 'limu';

// since v5.5.0+, export limu
export const limu: typeof limuApi;

export declare const cst: {
  VER: '5.5.0';
  LIMU_VER: string;
  EVENT_NAME: {
    /** 共享状态创建时的事件 */
    ON_SHARE_CREATED: 'ON_SHARE_CREATED';
    /** 共享状态变化时的事件 */
    ON_DATA_CHANGED: 'ON_DATA_CHANGED';
  };
  RECORD_LOADING: {
    NO: NoRecord;
    PRIVATE: 'private';
    GLOBAL: 'global';
  };
};

/**
 * 创建字典型共享对象
 *
 * ```
 *  const [ state, setState, ctx ] = share({ a: 100, b: 2 });
 *  // state 可透传给 useSharedObject
 *  // setState 可以直接修改状态
 *  // 推荐使用 ctx.defineActions 或  ctx.defineTpActions 创建修改函数
 *
 *  // 指定模块名后，可接入devtool工具查看数据变更
 *  share({ a: 100, b: 2 }, { moduleName: 'demo' });
 *
 * ```
 *  以下将举例两种具体的调用方式
 * ```
 * // 调用服务函数第一种方式，直接调用定义的函数，配合 ctx.setState 修改状态
 * function changeAv2(a: number, b: number) {
 *    ctx.setState({ a, b });
 * }
 *
 * // 第二种方式，推荐使用 ctx.defineActions 或  ctx.defineTpActions 创建修改函数
 * @see TODO add link
 * ```
 * 如需感知组件上下文，则需要`useService`接口去定义服务函数，可查看 useService 相关说明
 */
export function share<T extends JSONDict = JSONDict, E extends JSONDict = JSONDict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  rawState: T | (() => T),
  createOptions?: O,
): readonly [ReadOnlyDict<T>, SetState<T>, ISharedCtx<T, E>];
// ): readonly [ReadOnlyDict<T>, SetDraft<T>, ISharedCtx<T>];

/**
 * 支持共享所有类型值的接口，会自动装箱为 {val:T} 结构的数据
 */
export function atom<T = any, E extends JSONDict = JSONDict, O extends ICreateOptions<Atom<T>> = ICreateOptions<Atom<T>>>(
  rawState: T | (() => T),
  createOptions?: O,
): readonly [ReadOnlyAtom<T>, SetState<T>, IAtomCtx<T, E>];
// ): readonly [ReadOnlyAtom<T>, AtomTupleSetState<Atom<T>>, IAtomCtx<T>];

/**
 * 效果完全等同 share，唯一的区别是 share 返回元组 [state,setState,ctx] sharex 返回 ctx 自身
 */
export function sharex<T extends JSONDict = JSONDict, E extends JSONDict = JSONDict, O extends ICreateOptions<T> = ICreateOptions<T>>(
  rawState: T | (() => T),
  createOptions?: O,
): ISharedCtx<T, E>;

/**
 * 效果完全等同 atom，唯一的区别是 share 返回元组 [state,setState,call] atom 返回 ctx 自身
 */
export function atomx<T = any, E extends JSONDict = JSONDict, O extends ICreateOptions<Atom<T>> = ICreateOptions<Atom<T>>>(
  rawState: T | (() => T),
  createOptions?: O,
): IAtomCtx<T, E>;

/**
 * 定义全量派生结果，支持同步和异步，支持返回 pritimive 类型，如果确定返回 dict 数据，可优先考虑使用 deriveDict 接口，
 * 返回结果无装箱操作
 * ```ts
 * // 示例1：已一个共享对象和已导出结果作为输入源定义一个异步计算任务
 *  const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 } } });
 *  // 同步派生，会自动装箱 { val: any }
 *  const doubleAResult = derive(() => sharedState.a * 2 + random());
 *  // 等效于 deriveDict ，但 deriveDict 还可以在第一层扩展其他属性，故确定返回 dict 数据的话可优先考虑使用 deriveDict 接口
 *  const doubleAResult = deriveDict({ fn: () => ({ val: sharedState.a * 2 + random() }) });
 *
 *  // 异步派生
 *  const aPlusB2Result = derive({
 *    // 【可选】定义依赖项，会透传给 fn 和 task 的 input
 *    deps: () => [sharedState.a, sharedState.b.b1.b2, doubleAResult.val] as const,
 *    // 【必须】定义初始值函数，首次一定会执行
 *    fn: () => 0,
 *    // 【可选】如定义了 task，则定义的 fn 后续不再执行
 *    // 1 未显式定义 immediate 时，如定义了 fn，则 task 首次不执行，未定义则 task 首次执行
 *    // 2 显式定义 immediate 时，为 true 则立即执行 task，为 false 则下次再执行
 *    task: async ({ input: [a, b2, val] }) => { // 定义异步运算任务，input 里可获取到 deps 返回的值
 *      await delay(1000);
 *      return a + b2 + val + random();
 *    },
 *    //【可选】定义后就首次执行任务 task（默认首次不执行）
 *    immediate: true,
 *  });
 *
 *  // 异步派生示例2：初始值函数读取 input 计算初始值，并定义一个后续相关依赖发生变化后才计算的异步任务
 *  const aPlusB2Result = deriveAsync({
 *    deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
 *    // 读取 deps 函数的返回并相加
 *    fn: ({ input : [a, b]}) => ({ val: a + b }),
 *    // 不设置 immediate，task 首次不执行，在相关依赖变化后才执行
 *    task: async ({ input: [a, b] })=>{  ...  },
 *  });
 * ```
 */
export function derive<T = any, I extends ReadOnlyArr = ReadOnlyArr, S = SharedState>(
  deriveFnOrFnItem: DeriveFn<T, I, S> | IDeriveFnItem<T, I, S>,
  boundState?: S,
): DerivedAtom<T>;

/**
 * 创建一个派生atom新结果的任务，支持返回 pritimive 类型
 * ```ts
 * const [numAtom] = atom(1);
 * const doubleResult = deriveAtom(()=>numAtom.val*2);
 * ```
 */
export function deriveDict<R = PlainObject, I extends ReadOnlyArr = ReadOnlyArr, S = SharedState>(
  deriveFnOrFnItem: DeriveFn<R, I, S> | IDeriveFnItem<R, I, S>,
  boundState?: S,
): DerivedDict<R>;

export function defineDeriveTask<I extends ReadOnlyArr = any>(
  deps?: (info: IBoundStateInfo) => I,
): <T = any>(fnItem: IDeriveTaskOptions<T, I>) => IDeriveFnItem<T, I>;

/**
 * 辅助给直接透传给 defineFullDerive 的某个 fnItem 标记类型
 * ```
 * defineFullDerive()({
 *   someKey: defineDeriveFnItem<IDeriveFnItem<number, [number]>>({ ... }),
 * });
 *
 * // 等效于直接使用 IDeriveFnItem 标记类型
 * const someItem: IDeriveFnItem<number, [number]> = { ... };
 * ```
 */
export function defineDeriveFnItem<F extends IDeriveFnItem>(fnItem: F): F;

/**
 * 辅助给直接透传给 defineMutateDerive 的某个 fnItem 标记类型
 */
export function defineMutateFnItem<F extends IMutateFnItem>(fnItem: F): F;

/**
 * 观察共享状态变化，watch 回调默认不立即执行，需要设置 immediate=true 才立即执行，
 * 因回调默认不立即执行，options 类型设计为必填，提示用户使用 watch 需要显式指定依赖
 * ```ts
 * // 立即运行，自动对首次运行时函数内读取到的值完成变化监听
 * watch(()=>{ console.log(shared.val) }, { immediate: true });
 * // 第二个参数传递依赖收集回调，收集到监听key，不需要立即执行的话可设定 immediate 为 false 或不设置
 * watch(()=>{ console.log('shared.val changed')}, ()=>[shared.val]);
 * // 第二个参数传递依赖收集回调，收集到监听对象，表示shared发生变化就执行watch回调
 * watch(()=>{ console.log('shared changed')}, ()=>[shared]);
 * // 第二个参数传递依赖收集回调，既设置监听key，也设置监听对象
 * watch(()=>{ console.log('shared1 or shared2.val changed')}, {dep:()=>[shared1,shared2.val]});
 * ```
 */
export function watch(
  watchFn: (fnParams: IWatchFnParams) => void,
  options: WatchOptionsType,
): { run: (throwErr?: boolean) => void; unwatch: Fn };

/**
 * watchEffect 和 watch 用法一样，
 * 区别于 watch 的点是：watchEffect 会立即执行回调，自动对首次运行时函数内读取到的值完成变化监听，
 * 因回调会立即执行，options 类型设计为选填
 */
export function watchEffect(
  watchFn: (fnParams: IWatchFnParams) => void,
  options?: WatchEffectOptionsType,
): { run: (throwErr?: boolean) => void; unwatch: Fn };

/**
 * 组件使用 atom，注此接口只接受 atom 生成的对象，如传递 share 生成的对象会报错
 * ```ts
 * // 使用原始类型 atom
 * const [num, setNum] = useAtom(numAtom);
 * // 修改原始类型 atom
 * setNum(num+1);
 * setNum(draft=>{draft+=1});
 *
 * // 使用对象类型 atom
 * const [obj, setObj] = useAtom(objAtom);
 * // 修改对象类型 atom
 * setNum(draft=>{
 *   draft.a+=1;
 *   draft.b+=2;
 * });
 * ```
 */
// export function useAtom<T extends SharedState = any>(
export function useAtom<T extends any = any>(
  sharedState: T,
  options?: IUseSharedStateOptions<T>,
): [
    T extends ReadOnlyAtom ? AtomValType<T> : T,
    // AtomTupleSetState<T>,
    SetState<T>,
    IInsRenderInfo<T>,
  ];

/**
 * 区别于 useAtom，useAtomX 返回对象
 */
export function useAtomX<T = any>(
  sharedState: T,
  options?: IUseSharedStateOptions<T>,
): T extends ReadOnlyAtom ? ICompAtomCtx<AtomValType<T>> : ICompAtomCtx<T>;

export function useReactive<T = any>(
  sharedState: T,
  options?: IUseSharedStateOptions<T>,
): [
    // 针对 atom，第一位 reactive 参数自动拆箱
    T extends Atom ? T['val'] : T,
    // 代表 reactiveRoot
    T,
    IInsRenderInfo,
  ];

export function useReactiveX<T = any>(sharedState: T, options?: IUseSharedStateOptions<T>): ICompReactiveCtx<T>;

/**
 * 更新当前共享状态的所有实例组件，谨慎使用此功能，会触发大面积的更新，
 * 推荐设定 presetDeps、overWriteDeps 函数减少更新范围
 * ```ts
 * const updateAllAtomIns = useGlobalForceUpdate(someShared);
 * // 和从 ctx 上获取的 useForceUpdate 效果一样，useForceUpdate 自动绑定了对应的共享状态
 * const updateAllAtomIns = ctx.useForceUpdate();
 *
 * // 支持预设更新范围，以下两种写法等效
 * const updateSomeAtomIns = useGlobalForceUpdate(someShared, state=>[state.a, state.b]);
 * const updateSomeAtomIns = ctx.useForceUpdate(state=>[state.a, state.b]);
 *
 * // 支持调用时重写更新范围
 * updateSomeAtomIns(state=>[state.c]); // 本次更新只更新 c 相关的实例
 *
 * // 重写为 null，表示更新所有实例，强制覆盖可能存在的 presetDeps
 * updateSomeAtomIns(null)
 *
 * // 返回空数组不会做任何更新
 * updateSomeAtomIns(state=>[]);
 *
 * // 返回里包含了自身也会触发更新所有实例
 * updateSomeAtomIns(state=>[state]);
 *
 * // 因 updateSomeAtomIns 内部对 overWriteDeps 做了是否是函数的检查，
 * // 故 overWriteDeps 类型联合了 Dict， 让 ts 编程不设定 overWriteDeps 时可直接绑定到组件的 onClick 事件而不报编译错误
 * <button onClick={updateSomeAtomIns}>updateSomeAtomIns</button>
 * ```
 */
export function useGlobalForceUpdate<T = any>(
  sharedState: T,
  presetDeps?: (sharedState: T) => any[],
): (overWriteDeps?: ((sharedState: T) => any[]) | Dict | null) => void;

/**
 * 使用普通对象，需注意此接口只接受普通对象
 * 应用里使用 useObject 替代 React.useState 将享受到以下两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * 3 默认返回稳定引用状态
 * ```
 * @example 代码示例：
 * ```ts
 * const [ stableState, setState, objApi ] = useObject({a:1, b:2});
 * // stableState 是稳定引用
 * // objApi.getLatestState() // 获取最新的，适用于需要透传给子组件的场景
 * ```
 * @param initialState
 * @returns
 */
export function useObject<T = Dict>(
  initialState: T | (() => T),
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void, ILocalStateApi<T>];

/**
 * 功能同 watch，默认首次不执行回调，故需要提前写清楚依赖，
 * 可在组件中使用 useWatch 来完成状态变化监听，会在组件销毁时自动取消监听，
 * 注意 useWatch 会调里不存在闭包陷阱，可总是获取到函数组件里的局部状态最新值
 * @example
 * 依赖写在 deps 里，首次不执行
 * ```
 *  useWatch(() => { // code... }, () => [sharedState.a]);
 *  // or
 *  useWatch(() => { // code... }, {deps: () => [sharedState.a]});
 * ```
 * @example
 * 依赖写在回调里，首次执行回调收集到依赖，但不执行具体逻辑
 * ```
 *  useWatch((params) => {
 *    // 此处收集到依赖
 *    const { a } = sharedState;
 *    // 首次执行则退出，仅为了收集到依赖（如需要首次也执行逻辑，可删除这里的 return）
 *    if(params.isFirstCall) return;
 *
 *    // 非首次时将执行具体逻辑
 *    // code...
 *  }, { immediate: true });
 * ```
 */
export function useWatch(watchFn: (fnParams: IWatchFnParams) => void, options: WatchOptionsType);

/**
 * 功能同 watchEffect 一样，区别在于 useWatchEffect 会立即执行回调，自动对首次运行时函数内读取到的值完成变化监听
 * 在组件中使用 useWatchEffect 来完成状态变化监听，会在组件销毁时自动取消监听
 * @example
 * ```
 *  // 组件首次渲染就立即执行回调，同时也会收集到依赖
 *  useWatchEffect(() => {
 *    console.log('useWatchEffect: sharedState.a changed', sharedState.a);
 *  });
 *  // 等效于写为
 *  useWatch(() => {
 *    // 此时不用再函数写 sharedState.a 也能观察到其变化
 *    console.log('sharedState.a changed');
 *  }, { deps: () => [sharedState.a], immediate: true });
 *
 * ```
 */
export function useWatchEffect(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchEffectOptionsType);

/**
 * 使用全局id，配合 rules[].globalIds 做定向通知更新
 */
export function useGlobalId(globalId: NumStrSymbol): IRenderInfo;

/**
 * ```ts
 *  const [state, setState] = useAtom(sharedObj);
 *  // 返回的 srv 是一个稳定的引用，它包含的方式也是稳定的引用，方法里能总是读取闭包外的最新值
 *  const srv = useService({
 *    change(label: string) {
 *       console.log(props.num); // 总是最新值
 *    }
 *  });
 * ```
 * @param compCtx
 * @param serviceImpl
 */
export function useService<S = Dict, P = object>(serviceImpl: S, props?: P): S;

/**
 * 返回一个可以强制更新当前组件的更新函数
 */
export function useLocalForceUpdate(): () => void;

export function storeSrv(ref: MutableRefObject<any>): void;

export function sync<T extends SharedState>(target: T): SyncFnBuilder<T>;

export function syncer<T extends SharedState>(target: T): Syncer<T>;

/**
 * 对齐 React.useEffect
 * 优化了调用逻辑，即 strict 模式与普通模式行为一致，只有一次 mount 与 unmount 产生
 * @param cb
 * @param deps
 */
export function useEffect(cb: EffectCb, deps?: any[]): void;

/**
 * 对齐 React.useLayoutEffect
 * 优化了调用逻辑，即 strict 模式与普通模式行为一致，只有一次 mount 与 unmount 产生
 * @param cb
 * @param deps
 */
export function useLayoutEffect(cb: EffectCb, deps?: any[]): void;

export function useDerived<R = DerivedDict | DerivedAtom>(
  result: R,
  options?: IUseDerivedOptions,
): [DerivedResultType<R>, LoadingStatus, IRenderInfo];

/**
 * 组件里监听来自 emit 接口发射的事件，会在组件销毁时自动取消监听，监听回调总是能读到外部最新值，不存在闭包陷阱
 * @param onBeforeMount - default: false，
 * false：在组件的挂载后完成监听，true：在组件的挂载前完成监听
 * @example
 * ```jsx
 * import { emit, useOnEvent } from 'helux';
 *
 * function emitEvent() {
 *   emit('test_event', 1, 2);
 * }
 *
 * function Comp() {
 *   const [num, setNum] = React.useState(1);
 *   const change = () => setNum(prev => prev + 1);
 *   useOnEvent('test_event', (...args) => {
 *     console.log('receive args ', ...args);
 *     console.log('num is ', num); // 这里总是能读到外部最新值，不存在闭包陷阱
 *   });
 *   return <button onClick={change}>change {num}</button>;
 * }
 * ```
 */
export function useOnEvent(name: string, cb: Fn, onBeforeMount?: boolean): void;

/**
 * 以 mutable 方式修改 react 状态
 * ```ts
 * const [state, setState] = useMutable({ a: { a1: 1 }, b: 1 });
 * setState({ b: Date.now() }); // 浅层次修改，直接返回即可，内部自动合并
 * setState(draft => {
 *   draft.a.a1 = Date.now()
 * }); // 使用回调方式修改draft
 * ```
 */
export function useMutable<T extends PlainObject>(
  initialState: T | (() => T),
): [state: T, setDraft: (partialStateOrCb: Partial<T> | ChangeDraftCb<T>) => void, objApi: ILocalStateApi<T>];

/**
 * 生成稳定的字典对象，对象的所有方法将转为稳定引用，且回调里始终可以读到外部的最新值，无闭包陷阱
 * @example
 * ```ts
 * function Comp(props: any) {
 *   const [obj, setObj] = useObject({ num: 1 });
 *   // 如字典包含非方法值，可获取最新值
 *   const srv = useStable({
 *     readState() {
 *       console.log(`%c read state num ${obj.num}`, `color:green`);
 *     },
 *     readProps() {
 *       console.log(`%c read props num ${props.num}`, `color:green`);
 *     },
 *     changeState() {
 *       setObj({ num: random() });
 *     },
 *   });
 *
 *   // 如传入单函数，则返回的稳定的函数引用
 *   const fn = useStable(() => {
 *    console.log(`%c read state num ${obj.num}`, `color:green`);
 *   });
 *
 *   // 传入值，则只是返回最新值
 *   const numTwo = useStable(2);
 * }
 * ```
 */
export function useStable<T = any>(data: T): T;

/**
 * 锁定依赖，配合父组件设置 arrIndexDep=false 时用
 */
export function useLockDep<T = any>(data: T): T;

/**
 * default: GlobalLoading，
 * 不传递任何共享状态的话，顶层 useMutateLoading 默认使用全局的 loading 状态
 * ```ts
 * // 使用全局的 loading 对象
 * useMutateLoading();
 * // 使用指定指定共享对象的 Mutate loading 对象
 * useMutateLoading(someShared);
 * ```
 * 返回的 loading 对象取值操作是恒安全的，传入任意字符串均返回 status 对象，
 * ```ts
 * const [ loading ] = useMutateLoading();
 * loading['whatever-key']; // 均能返回 status 对象，对于不存在的 mutate key，返回的 status 不变
 * ```
 */
export function useMutateLoading<T = SharedState>(target?: T): [SafeLoading, SetState<LoadingState>, IInsRenderInfo];

/** 组件外部读取 Mutate loading */
export function getMutateLoading<T = SharedState>(target?: T): SafeLoading;

/** 组件外部读取 Action loading */
export function useActionLoading<T = SharedState>(target?: T): [SafeLoading, SetState<LoadingState>, IInsRenderInfo];

/** 组件外部读取 loading */
export function getActionLoading<T = SharedState>(target?: T): SafeLoading;

/** 获取某个导出结果的 loading status */
export function getDeriveLoading<T = Dict>(target: T): LoadingStatus;

export function getAtom<T = any>(mayAtom: T): AtomValType<T>;

/**
 * 返回代理对象的原始数据，如果想获取具体节点的原始数据，使用 limu.original 替代
 * @example
 * ```ts
 * getRawState(state.x.y); // always return state node;
 * limu.original(state.x.y); // return y node
 * ```
 * @param state
 */
export function getRawState<T = Dict>(state: T): T;

/**
 * isPrevSnap 默认值为 true，表示返回前一刻的快照，设为 false 表示返回最新快照
 */
export function getSnap<T = Dict>(state: T, isPrevSnap?: boolean): T;

/**
 * 获取代理对象（可能已过期）的最新版本代理对象
 */
export function getCurrentProxy<T = any>(
  proxyRoot: any,
  mayProxyDraft: T,
): [currentProxy: T, isGetSucess: boolean, path: string[]];

export function emit<A extends any[] = any[]>(name: string, ...args: A): void;

/**
 * 监听事件，返回一个取消监听的句柄
 */
export function on<A extends ReadOnlyArr = ReadOnlyArr>(name: string, cb: (...args: A) => void): Off;

/**
 * 人工运行匹配 desc 的 mutate 函数，未传递任何描述则尝试调用可能存在的单函数
 */
export function runMutate<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions): T;

/**
 * 人工运行匹配 desc 的 mutate 函数（存在才执行），未传递任何描述则尝试调用可能存在的单函数
 */
export function runMutateTask<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions): Promise<T>;

/**
 * 外部为 atom 或 share 创建一个 mutate 函数，不定义在(atom,share)接口的 options 参数里，生成共享对象后再对其定义 mutate 函数
 * 此处采用柯里化风格api，可拥有更好的类型编码提示，会自动把 deps 类型映射到 task 函数的回调函数的 input 参数上
 * ```ts
 * mutate(someAtom)(draf=>draft.a = draft.b+1);
 * mutate(someAtom)({
 *   fn: draf=>draft.a = draft.b+1
 * });
 *
 * // 支持绑定一个额外的共享对象
 * mutate(someAtom, anotherAtom)((draft, params)=>{
 *   console.log(params.extraBound.stateRoot); // ---> anotherAtom
 *   draft.a = draft.b+1;
 * });
 * ```
 */
export function mutate<T extends SharedState, E extends SharedState>(
  target: T,
  extraTarget?: E,
): <A extends ReadOnlyArr = ReadOnlyArr>(fnItem: IMutateFnLooseItem<T, A, E> | MutateFn<T, A, E>) => IMutateWitness<T>;

export function mutateDict<T extends SharedState, E extends SharedState>(
  target: T,
  extraTarget?: E,
): <D extends MutateFnDict<T, E> = MutateFnDict<T, E>>(fnDict: D) => { [K in keyof D]: IMutateWitness<T> };

/**
 * @param result - 传入派生结果，会自动触发结果对应的派生函数重计算
 * @param throwErr - 默认 `false`，错误传地给元组第二位参数
 */
export function runDerive<T = SharedState>(result: T, throwErr?: boolean): [T, Error | null];

export function runDeriveTask<T = SharedState>(result: T, throwErr?: boolean): Promise<[T, Error | null]>;

/**
 * 生成 Block 组件，会自动绑定视图中的状态依赖，
 * 注意视图中不能存在判断语句，否则会照成依赖丢失的情况产生
 * ```tsx
 * const [ sharedUser ] = share({...})
 * // ✅ ok
 * const User = block(()=><div>{sharedUser.name}</div>);
 * // ❌ bad
 * const User = block(()=><div>{sharedUser.age >10?sharedUser.name:sharedUser.nickname}</div>);
 *
 * 其他地方渲染User即可 <User />
 * ```
 */
export function block<P = object, T = any>(
  cb: (props: P, ref: ForwardedRef<T>) => ReactNode,
  options?: EnableStatus | IBlockOptions<P>,
): BlockComponent<P>;

/**
 * 功能同 block，适用于在组件里调用动态生成组件的场景，会在组件销毁后自动释放掉占用的内存
 * 如果在组件里使用 block 生成组件，也能正常工作，但会额外占用一些不会释放的内存
 */
export function dynamicBlock<P = object, T = any>(
  cb: (props: P, ref: ForwardedRef<T>) => ReactNode,
  options?: EnableStatus | IBlockOptions<P>,
): BlockComponent<P>;

/**
 * 获取 props 上的 blockParams 参数，如不存在也会返回，并标识 isFake=true，
 * 在 signal(getProps, Comp) 场景，这样设计课让 Comp 在 signal 外或 signal 中均可正常渲染不报错
 * @param props
 */
export function getBlockParams<P = object>(props: P): IBlockParams<P>;

/**
 * 创建一个具有 signal 响应粒度的视图，仅当传入的值发生变化才渲染且只渲染 signal 区域，helux 同时也导出了 $ 符号表示 signal 函数
 * ```tsx
 * // ✅ ok，传入原始值
 * <div>...long content {$(sharedUser.name)}</div>
 * // ✅ ok，传入包含原始值的atom对象，内部会自动拆开 atom
 * <div>...long content {$(userFullNameAtom)}</div>
 * // ✅ ok，传入定义的 block 组件
 * const User = block(()=><h1>{sharedUser.name}</h1>); // 注：User 也可以当做组件直接实例化 <User />
 * <div>...long content {$(User)}</div>
 * // ✅ ok，复杂渲染逻辑可传入渲染函数，（注：可将这个回调通过 block 抽象为一个组件）
 * <div>...long content {$(()=><div><span>{sharedUser.infoObj.grade}</span><span>{sharedUser.infoObj.addr}</span></div>)}</div>
 * // ✅ ok，支持 props 和 渲染函数分离定义
 * const Info = (props)=><div>name:{props.name}-age{props.age}</div>;
 * const getProps = ()=>({ name: state.info.name, age: state.info.age });
 * <div>...long content {$(getProps,Info)}</div>
 *
 * //  atom 响应示例
 * // ✅ ok，传入原始值 atom，推荐这种写法
 * <div>...long content {$(atom)}</div>
 * // ✅ ok，传入拆开的原始值 atom
 * <div>...long content {$(atom.val)}</div>
 * // ✅ ok，传入返回原始值 atom 函数
 * <div>...long content {$(()=>atom)}</div>
 * // ✅ ok，传入返回拆开的原始值 atom 函数
 * <div>...long content {$(()=>atom.val)}</div>
 *
 * // 不成功或有缺陷的响应示例
 * // ❌ bad 传入对象，react 本身也不允许，考虑使用 ()=> ReactNode 写法替代
 * <div>...long content {$(sharedUser.infoObj)}</div>
 * // ✅ 可使用 ()=> ReactNode 写法替代
 * <div>...long content {$(()=>`${sharedUser.infoObj.name}-${sharedUser.infoObj.age}`)}</div>
 * // ✅ 👉 更推荐定制 format 函数来展开此对象渲染，避免重复从根对象开始的取值过程
 * <div>...long content {$(sharedUser.infoObj, (v)=>`${v.name}-${v.age}`)}</div>
 * // ❌ bad 传入多个值
 * <div>...long content {$([1,2,3]])}</div>
 * // ❌ 内部存在有判断，可能会造成响应依赖缺失
 * <div>...long content {$(()=><div>{sharedUser.age>10?sharedUser.name:sharedUser.nickname}</div>)}</div>
 * // ✅ 👉推荐定制format函数，函数里可将所有依赖提前声明，随后再做判断
 * <div>...long content {$(sharedUser, (v)=>{const{age,name,nickname}=v;return age>10?name:nickname})}</div>
 * ```
 */
export function signal<T extends SingalVal>(inputVar: T, format?: (val: T) => any, enableStatus?: EnableStatus): ReactNode;
export function signal(inputVar: (props: any) => SingalVal, format?: (val: any) => any, enableStatus?: EnableStatus): ReactNode;
export function signal(inputVar: () => SingalVal): ReactNode;

/**
 * signal 函数的简写导出
 */
export const $: typeof signal;

type ISignalViewInnerProps<T extends SingalVal = any> = {
  /**
   * 信号响应输入值，必须透传函数 ()=>T，
   * ```jsx
   *  // 不支持 input 为 T 的原因如下，考虑下面两个连续声明在一起的组件
   * <SignalView input={state.a.b} format={...} />
   * <SignalView input={state.a} format={...} />
   * // 编译后是
   * react.createElement(SignalView, {input:state.a.b, forat:...})
   * react.createElement(SignalView, {input:state.a, forat:...})
   * // SignalView 对应函数的执行是延后的，真正执行 SignalView 时，
   * // 第一个声明处拿到的依赖为 state.a 了，而不是想要的 state.a.b
   * // 但 $ 写法是支持直接绑定值的，因为它的执行时间并没有延后
   * {$(state.a.b, format)}
   * {$(state.a, format)}
   * ```
   */
  input: () => T;
  format?: (val: T) => any;
  /**
   * 响应异步计算任务的状态变化
   */
  enableStatus?: EnableStatus;
  ref?: any;
  /**
   * 当前组件关心的 action 函数 status 变化列表
   */
  useStatusList?: () => LoadingStatus[];
};

type SignalViewProps<T extends SingalVal = any, ViewProps extends object = any> = ISignalViewInnerProps<T> &
  Omit<ViewProps, 'input' | 'format' | 'enableStatus' | 'ref' | 'useStatusList'>;

/**
 * signal 的组件化写法
 */
export function SignalView(props: SignalViewProps): ReactNode;
export function SignalView<T extends SingalVal = any, O extends object = any>(props: SignalViewProps<T, O>): ReactNode;

interface ISignalV2Props<T extends SingalVal = any, V extends object = any> extends ISignalViewInnerProps<T> {
  viewProps: V;
}

interface ISignalV2SimpleProps<T extends SingalVal = any> extends ISignalViewInnerProps<T> {
  viewProps?: any;
}

/**
 * viewProps 属性会透传到组件上（如 format传的组件）
 * @param props
 */
export function SignalV2(props: ISignalV2SimpleProps): ReactNode;
export function SignalV2<T extends SingalVal = any>(props: ISignalV2SimpleProps<T>): ReactNode;
export function SignalV2<T extends SingalVal = any, V extends object = object>(props: ISignalV2Props<T, V>): ReactNode;

type IBlockViewInnerProps<Data extends object = any, ViewProps extends object = any> = {
  data: () => Data;
  comp: (compProps: Data & ViewProps, ref: any) => any; // react component def
  /**
   * 响应异步计算任务的状态变化
   */
  enableStatus?: EnableStatus;
  ref?: any;
  /**
   * 当前组件关心的 action 函数 status 变化列表
   */
  useStatusList?: () => LoadingStatus[];
};

type IBlockViewProps<Data extends object = any, ViewProps extends object = any> = IBlockViewInnerProps<Data, ViewProps> &
  Omit<ViewProps, 'input' | 'format' | 'enableStatus' | 'ref' | 'useStatusList'>;

/**
 * 收窄 SignalView，变换属性为 data, comp,
 * 除去 'input' | 'format' | 'enableStatus' | 'ref' | 'useStatusList' 之外的属性
 * 会和 data 函数返回值会合并后透传到 comp 组件 props 上
 * @example
 * ```tsx
 * // 不约束类型
 * <BlockView data={() => ({ a: 1 })} comp={Label} b={1} />; // props {a:1, b: 1}
 * // 只约束 data 函数返回类型
 * <BlockView<{ a: 1 }> data={() => ({ a: 1 })} comp={Label} b={1} />
 * // 约束 data 函数返回类型和 其他 props类型
 * <BlockView<{ a: 1 }, { b: number }> data={() => ({ a: 1 })} comp={Label} b={1} />
 * ```
 */
export function BlockView(props: IBlockViewProps): ReactNode;
// 只约束Data
export function BlockView<D extends object = any>(props: IBlockViewProps<D, any>): ReactNode;
// Data，ViewProps 都约束
export function BlockView<D extends object = any, V extends object = object>(props: IBlockViewProps<D, V>): ReactNode;

interface IBlockV2Props<Data extends object = any, V extends object = any> extends IBlockViewInnerProps<Data, V> {
  viewProps: V;
}

interface IBlockV2SimpleProps<Data extends object = any> extends IBlockViewInnerProps<Data, any> {
  viewProps?: any;
}

/**
 * 收窄 SignalView，变换属性为 data, comp,
 * viewProps 和 data 函数返回值会合并后透传到 comp 组件 props 上
 * @example
 * ```tsx
 * // 不约束类型
 * <BlockV2 data={() => ({ a: 1 })} comp={Label} viewProps={{ b: 's' }} />
 * // 只约束 data 函数返回类型
 * <BlockV2<{ a: 1 }> data={() => ({ a: 1 })} comp={Label} viewProps={{ b: 's' }} />
 * // 约束 data 函数返回类型和 viewProps 类型
 * <BlockV2<{ a: 1 }, { b: number }> data={() => ({ a: 1 })} comp={Label} viewProps={{ b: 's' }} />
 * ```
 */
export function BlockV2(props: IBlockV2SimpleProps): ReactNode;
// 只约束Data
export function BlockV2<Data extends object = any>(props: IBlockV2SimpleProps<Data>): ReactNode;
// Data，ViewProps 都约束
export function BlockV2<Data extends object = any, V extends object = object>(props: IBlockV2Props<Data, V>): ReactNode;

/**
 * 添加中间件，可在数据提交前做二次修改，可写入数据传递给下一个中间件
 * ```ts
 * function myMiddleware({ draft, setData, moduleName, sharedKey, idx }){
 *  setData('key', 1); // 写数据给下一个中间件
 *  draft.time = 2; // 修改数据
 * }
 * ```
 */
export function addMiddleware(mid: Middleware): void;

/**
 * 使用中间件，可监听 helux 内部的各种事件做异步处理
 * ```ts
 *  const myPlugin = {
 *    install(ctx){
 *      // 监听其他将来会扩展的事件
 *      ctx.on('someEvent', ()=>{ ... });
 *      // 监听内置的 onStateChanged 事件
 *      ctx.onStateChanged(({snap})=>{
 *          // 可记录 snap 到 redux-dev-tool
 *      });
 *    },
 *    name: 'myPlugin', // 名称可选
 *    desc: 'this is helux plugin demo', // 描述可选
 *  };
 *  usePlugin(myPlugin);
 * ```
 * @param plugin
 */
export function addPlugin(plugin: IPlugin): void;

/**
 * ```ts
 * // 不约束args类型，fnDef 函数定义的参数args将是 any[]
 * const someAction = action(shared)()(fnDef, desc);
 * someAction(); // 无约束
 *
 * // 约束args类型
 * const someAction = action(shared)<[number, string]>()((param)=>{
 *   const payload = param.payload; // 提示类型 [number, string]
 * }, 'someAction');
 * someAction([1,1]); // 这里第二位参数将提示类型错误
 * ```
 * 注意此处采用了柯里化调用方式是为了能自动推导出返回函数的返回值类型
 */
export function action<T = any>(
  sharedState: T,
): <P = any>() => <F extends Fn = ActionTask<T, P>>(
  fn: F,
  descOrOptions?: string | ICreateActionOptions,
) => ReturnType<F> extends Promise<any> ? ActionAsync<F, P, T> : Action<F, P, T>;

/**
 * test if the input arg is a result returned by atom()
 */
export function isAtom(mayAtom: any): boolean;

/**
 * test if the input arg is a result returned by atom() or share()
 */
export function isSharedState(mayShared: any): boolean;

/**
 * test if the input arg is a result returned by drive()
 */
export function isDerivedAtom(mayDerivedAtom: any): boolean;

/**
 * test if the input arg is a result returned by drive() or deriveDict()
 */
export function isDerivedResult(mayDerived: any): boolean;

/**
 * set one-time used reactive modification desc
 * 设置一次性使用的响应式变更数据描述，方便 devtool 查看
 */
export function reactiveDesc(stateOrDraftRoot: any, desc: string): number;

/**
 * manually triggering reactive change data submission
 * 主动触发响应式变更数据提交
 */
export function flush(state: SharedState, desc?: string): void;

export declare function init(options: IInitOptions): boolean;

// ----------- 以下 limu 接口二次重导出会报错，这里手动声明一下 --------------
// err: 如果没有引用 "../../helux-core/node_modules/limu/lib"，则无法命名 "produce" 的推断类型。这很可能不可移植。需要类型注释

/**
 * 来自  LimuUtils.shallowCompare
 * 浅比较两个对象，除了专用于比较 helux 生成的代理对象，此函数还可以比较普通对象
 * ```txt
 * true：两个对象一样
 * false：两个对象不一样
 * ```
 */
export declare function shallowCompare(prev: any, next: any, compareLimuProxyRaw?: boolean): boolean;

export declare type AnyArray = Array<any>;
export declare type AnyObject<T extends any = any> = {
  [key: string]: T;
};
export declare type ProduceCb<T> = (draft: Draft<T>) => void;
export declare type ObjectLike = AnyObject | AnyArray | Map<any, any> | Set<any>;
interface IProduce {
  <T extends ObjectLike>(baseState: T, recipe: ProduceCb<T>, options?: ICreateDraftOptions): T;
  /**
   * use in react:
   * setState(produce(draft=>{
   *    draft.name = 2;
   * }));
   */
  <T extends ObjectLike>(recipe: ProduceCb<T>, options?: ICreateDraftOptions): GenNewStateCb<T>;
}

/**
 * 来自  LimuUtils.isDiff
 */
export declare function isDiff(val1: any, val2: any): boolean;

/**
 * 来自  LimuUtils.isDraft，判断是否是草稿节点
 */
export declare function isDraft(mayDraft: any): boolean;

export declare const produce: IProduce;

/**
 * 标记对象为 raw，此对象始终不会被代理，需注意标被标记后此对象会失去结构共享特性
 * see test: https://github.com/tnfe/limu/blob/main/test/api/markRaw.ts
 */
export declare function markRaw<T extends any = any>(rawVal: T): T;

/**
 * 兼容 react 类组件使用 helux ，区别于 withAtom ，bindAtom 返回函数组件
 */
export declare function bindAtom<T extends any = any>(ClassComp: T, atomMap: IBindAtomOptions): T;

/**
 * 兼容 react 类组件使用 helux，可使用 withAtom 包裹目标类组件返回新的类组件，
 * helux 会将 atom 上下文字典注入到 this.props.hx 上，可主动赋值到类成员属性 hx 上方便使用
 * @example
 * ```jsx
 * import { atom, withAtom, assignThisHX } from 'helux';
 * const [numAtom] = atom({ num: 1, info: { addr: 'bj' } });
 *
 * class DemoCls extends React.Component<any> {
 *   // 先声明，运行时会由 withAtom 将值注入到此属性上
 *   private hx = assignThisHX(this);
 *   render() {
 *     console.log(this.hx.atom.state); // 获取到 atom state
 *   }
 * }
 *
 * const IDemo = withAtom(DemoCls, { atom: numAtom });
 * ```
 *
 * @example
 * 透传多个 atom，通过 options.atoms 参数传递
 * ```jsx
 * import { atom, withAtom, assignThisHX } from 'helux';
 *
 * const [numAtom] = atom({ num: 1, info: { addr: 'bj' } });
 * const [bookAtom] = atom({ name: 'book', list: [] });
 *
 * class DemoCls extends React.Component {
 *   private hx = assignThisHX(this);
 *   addNum = () => {
 *     this.hx.atoms.num.setState((draft: any) => void (draft.num += 2));
 *   };
 *   render() {
 *     const { num: { state } } = this.hx.atoms;
 *     return <div>hello num {state.num}<button onClick={this.addNum}> add num </button></div>;
 *   }
 * }
 *
 * const IDemo = withAtom(DemoCls, { atoms: { num: numAtom, book: bookAtom } });
 * ```
 *
 * @example
 * 也支持既传 atom，又传 atoms
 * ```
 * const IDemo = withAtom(DemoCls, { atom: someAtom, atoms: { num: numAtom, book: bookAtom } });
 *
 * // 在类组件里
 * // this.hx.atom 获取到 atom 对应上下文
 * // this.hx.atoms.num 和 this.hx.atoms.book 各自对应的 atom 对应上下文
 * ```
 */
export declare function withAtom<T extends any = any>(ClassComp: T, options: IWithAtomOptions): T;

/**
 * 辅助 class 组件给hx指定相应的类型，
 * isPropsProxy=true 处于属性代理模式时，hx 的值会由 assignThisHX 赋值上去，
 * isPropsProxy=false 处于属性反向继承时，hx 的值会由包裹后的组件运行时赋值上去，
 * 为了方便类型提示，建议总是调用 assignThisHX 赋值 hx，
 * @example
 * ```jsx
 * const [numAtom] = atom({ num: 1, info: { addr: 'bj' }, show: true, time: Date.now() });
 * const woptions = makeWithAtomOptions({ atoms: { num: numAtom, book: bookAtom } });
 *
 * class DemoCls extends React.Component<any> {
 *   private hx = assignThisHX<HXType<typeof woptions>>(this);
 *
 *   constructor(props, context) {
 *     // 注意，如在构造器里获取 hx 对象，建议使用 getHX 可安全获取，理由见 getHX 函数注释
 *     const hx = getHX<HXType<typeof woptions>>(props, context); // ok
 *     // const hx = this.hx; // error while isPropsProxy=false
 *   }
 *
 *   addNum = () => {
 *     // 此处将感知到类型提示
 *     this.hx.num.setState((draft: any) => void (draft.num += 2));
 *   };
 * }
 *
 * const AtomedDemo = withAtom(DemoCls, woptions);
 * ```
 */
export declare function assignThisHX<T extends any = any>(thisRef: any): T;

/**
 * 除 constructor 外其他成员函数均可通过 tis.hx 获取 hx 对象，但当 isPropsProxy=false 走反向继承时，
 * 用户在 constructor 里是获取不到 this.hx 值的（isPropsProxy=true可以），此时需要从 context.hx 获取到，
 * 为了能在 isPropsProxy 任意切换时都能安全获取到 hx，建议用户走 getHX 函数获取，
 * （注：hx is short for helux class component atom context）
 * @example
 * ```ts
 *  constructor(props, context) {
 *    // const hx = this.hx; // error while isPropsProxy=false
 *    const hx = getHX(props, context); // ok
 *  }
 * ```
 * 可用 HXType 生成类型透传给 getHX 函数，
 * @example
 * ```ts
 *  const woptions = makeWithAtomOptions({ atoms: { num: numAtom } });
 *  // 获得类型提示
 *  const hx = getHX<HXType<typeof woptions>>(props, context);
 * ```
 */
export declare function getHX<T extends any = any>(props: any, context: any): T;

/**
 * 辅助独立创建 withAtom 接口的 options 时能够感知类型提示，同时方便将 options 透传给 HXType 时推导出 hx 具体类型
 * @example
 * ```
 * const [numAtom] = atom({ num: 1, info: { addr: 'bj' }, show: true, time: Date.now() });
 * // 书写 options 配置时获得类型提示
 * const woptions = makeWithAtomOptions({ atoms: { num: numAtom } });
 *
 * class DemoCls extends React.Component<any> {
 *  // 透传 woptions 类型给 HXType 将为 hx 赋上具体类型
 *  private hx = assignThisHX<HXType<typeof woptions>>(this);a
 * }
 *
 * const AtomedDemo = withAtom(DemoCls, woptions);
 * ```
 */
export declare function makeWithAtomOptions<T extends IWithAtomOptions>(options: T): T;

export declare const hookImpl: HooksApiImpl;
