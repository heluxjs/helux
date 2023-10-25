/*
|------------------------------------------------------------------------------------------------
| helux@3.0.7
| A simple and powerful react state library with dependency collection, derive, watch, atom ... etc features,
| compatible with react 18 concurrency mode.
|------------------------------------------------------------------------------------------------
*/
import type { LimuUtils } from 'limu';
import type {
  Atom,
  AtomCall,
  Call,
  DeriveAtomFn,
  DerivedAtom,
  DerivedResult,
  DeriveFn,
  Dict,
  EffectCb,
  IAsyncTaskParams,
  ICreateOptionsType,
  IDeriveFnParams,
  IRenderInfo,
  IsComputing,
  IUseSharedOptions,
  IWatchFnParams,
  NumStrSymbol,
  PlainObject,
  SetAtom,
  SetState,
  SharedDict,
  WatchOptionsType,
} from './types';

export type * from './types';

/**
 * 创建浅依赖收集的共享对象
 *
 * ```
 *  const [ state, setState, call ] = share({ a: 100, b: 2 });
 *  // state 可透传给 useSharedObject
 *  // setState 可以直接修改状态
 *  // call 可以调用服务函数，并透传上下文
 *
 *  // share({ a: 100, b: 2 }, true); // 创建响应式状态
 *  // share({ a: 100, b: 2 }, 'demo'); // 指定模块名
 *  // share({ a: 100, b: 2 }, { moduleName: 'demo', enableReactive: true }); // 既指定模块名，也设定响应式为true
 *
 * ```
 *  以下将举例两种具体的调用方式
 * ```
 * // 调用服务函数第一种方式，直接调用定义的函数，配合 ret.setState 修改状态
 * function changeAv2(a: number, b: number) {
 *    ret.setState({ a, b });
 * }
 *
 * // 第二种方式，使用 ret.call(srvFn, ...args) 调用定义在call函数参数第一位的服务函数
 * function changeA(a: number, b: number) {
 *    ret.call(async function (ctx) { // ctx 即是透传的调用上下文，
 *      // args：使用 call 调用函数时透传的参数列表，state：状态，setState：更新状态句柄
 *      // 此处可全部感知到具体的类型
 *      // const { args, state, setState, draft } = ctx;
 *
 *      // 直接返回变化的部分数据
 *      return { a, b };
 *      // or 修改 draft
 *      draft.a = a;
 *      drqft.b = b;
 *      // or 混合使用（既修改draft，也返回变化数据）
 *      draft.a = a;
 *      return { b };
 *    }, a, b);
 *  }
 * ```
 * 如需感知组件上下文，则需要`useService`接口去定义服务函数，可查看 useService 相关说明
 */
export function share<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType<T>,
): [SharedDict<T>, SetState<T>, Call<T>];

/**
 * for compatible wit v2 helux
 * 这个接口仅为了兼容 helux v2 升级到 v3 后不报错
 */
export const createShared: typeof share;

/**
 * 效果完全等同 share，唯一的区别是 share 返回元组 [state,setState,call] ，
 * shareState 返回对象{state,setState,call}
 */
export function shareState<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType<T>,
): { state: SharedDict<T>; setState: SetState<T>; call: Call<T> };

/**
 * 支持共享 primitive 类型值的接口
 */
export function atom<T extends any = any>(
  rawState: T | (() => T),
  createOptions?: ICreateOptionsType<Atom<T>>,
): [Atom<T>, SetAtom<T>, AtomCall<T>];

/**
 * 以共享状态或其他计算结果为输入，创建计算函数
 * 需注意返回结果必须是 Object
 * @param deriveFn
 * ```
 */
export function derive<T extends PlainObject = PlainObject>(deriveFn: (params: IDeriveFnParams) => T): T;

/**
 * 支持异步导出的接口
 * @param sourceFn
 * @param deriveFn
 */
export function deriveAsync<S extends any = any, R extends Dict = Dict>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S>) => Promise<R>,
): R;

/**
 * 支持异步导出的另一种写法的接口
 */
export function deriveTask<R extends PlainObject = PlainObject>(
  deriveFn: (taskParams: IDeriveFnParams) => {
    initial: R;
    task: () => Promise<R>;
  },
): R;

/**
 * 创建一个普通的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtom<T extends any = any>(deriveFn: (params: IDeriveFnParams) => T): Atom<T>;

/**
 * 创建一个异步的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtomAsync<S extends any = any, R extends any = any>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S>) => Promise<R>,
): Atom<R>;

/**
 * 创建一个异步的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtomTask<R extends any = any>(
  deriveFn: (taskParams: IDeriveFnParams) => { initial: R; task: () => Promise<R> },
): Atom<R>;

/**
 * 观察共享状态变化，默认 watchFn 立即执行
 * ```ts
 * // 函数内解构完成监听
 * watch(()=>{ console.log(shared.val) }, { immediate: true });
 * // 第二个参数传递依赖收集回调，收集到监听key，不需要立即执行的话可设定 immediate 为 false
 * watch(()=>{ console.log('shared.val changed')}, ()=>[shared.val]);
 * // 第二个参数传递依赖收集回调，收集到监听对象，表示shared发生变化就执行watch回调
 * watch(()=>{ console.log('shared changed')}, ()=>[shared]);
 * // 第二个参数传递依赖收集回调，既设置监听key，也设置监听对象
 * watch(()=>{ console.log('shared1 or shared2.val changed')}, {dep:()=>[shared1,shared2.val]});
 * ```
 */
export function watch(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchOptionsType): void;

/**
 * 使用共享对象，需注意此接口只接受共享对象，如传递普通对象给它会报错 OBJ_NOT_SHARED_ERR
 * ```ts
 * // 在组件外部其他地方创建共享对象
 * const [ sharedObj ] = share({a:1, b:2});
 * // 然后在任意组件里使用即可
 * const [ obj, setObj ] = useShared(sharedObj);
 * ```
 */
export function useShared<T extends Dict = Dict>(
  sharedObject: T,
  IUseSharedOptions?: IUseSharedOptions<T>,
): [SharedDict<T>, SetState<T>, IRenderInfo];

/**
 * 组件使用 atom，注此接口只接受 atom 生成的对象，如传递 share 生成的对象会报错
 */
export function useAtom<T extends any = any>(sharedState: Atom<T>, options?: IUseSharedOptions<Atom<T>>): [T, SetAtom<T>, IRenderInfo];

/**
 * 使用普通对象，需注意此接口只接受普通对象，如传递共享对象给它会报错 OBJ_NOT_NORMAL_ERR
 * 应用里使用 useObject 替代 React.useState 将享受到以下两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * ```
 * 需注意此接口只接受普通对象，如传递共享对象给它会报错 OBJ_NOT_NORMAL_ERR
 * @param initialState
 * @returns
 */
export function useObject<T extends Dict = Dict>(initialState: T | (() => T)): [T, (partialState: Partial<T>) => void];

/**
 * 使用全局id，配合 rules[].globalIds 做定向通知更新
 */
export function useGlobalId(globalId: NumStrSymbol): IRenderInfo;

/**
 * 使用服务注入模式开发 react 组件，可配和`useObject`和`useSharedObject`同时使用，详细使用方式见在线示例：
 * @link https://codesandbox.io/s/demo-show-service-dev-mode-ikybly?file=/src/Child.tsx
 * @link https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx
 * > 需注意：当你需要将状态提升为共享时，只需将 useObject 换为 useSharedObject 并传入同样数据协议的共享对象即可
 *
 * 以下是简单示例，可通过`srv.ctx.getProps()`拿到组件的 props 数据
 * ```ts
 *  const [state, setState] = useSharedObject(sharedObj);
 *  // 返回的 srv 是一个稳定的引用，它包含的方式也是稳定的引用
 *  const srv = useService({ props, state, setState }, {
 *    change(label: string) {
 *      // !!! do not use compCtx.state or compCtx.state due to closure trap
 *      // console.log("expired state:", compCtx.state.label);
 *
 *      // get latest state
 *      const state = srv.ctx.getState();
 *      console.log("the latest label in state:", state.label);
 *      // get latest props
 *      const props = srv.ctx.getProps();
 *      console.log("the latest props when calling change", props);
 *
 *      // your logic here
 *      srv.ctx.setState({ label });
 *    }
 *  });
 * ```
 * @param compCtx
 * @param serviceImpl
 */
export function useService<P extends Dict = Dict, S extends Dict = Dict, T extends Dict = Dict>(
  compCtx: {
    props: P;
    state: S;
    setState: (partialState: Partial<S>) => void;
  },
  serviceImpl: T,
): T & {
  ctx: {
    setState: (partialState: Partial<S>) => void;
    getState: () => S;
    getProps: () => P;
  };
};

/**
 * 强制更新
 */
export function useForceUpdate(): () => void;

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

export function useDerived<R extends PlainObject = PlainObject>(
  resultOrFn: DerivedResult<R> | DeriveFn<R>,
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function useDerivedAsync<S extends any = any, R extends PlainObject = PlainObject>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S, R>) => Promise<R>,
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function useDerivedTask<R extends Dict = Dict>(
  deriveFn: (taskParams: IDeriveFnParams<R>) => { initial: R; task: () => Promise<R> },
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function useAtomDerived<R extends any = any>(
  resultOrFn: DerivedAtom<R> | DeriveAtomFn<R>,
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function useAtomDerivedAsync<S extends any = any, R extends any = any>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S, R>) => Promise<R>,
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function useAtomDerivedTask<R extends any = any>(
  deriveFn: (taskParams: IDeriveFnParams<R>) => { initial: R; task: () => Promise<R> },
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo];

export function getRawState<T extends Dict>(state: T): T;

export function getRawStateSnap<T extends Dict>(state: T): T;

export const shallowCompare: LimuUtils['shallowCompare'];

export const isDiff: LimuUtils['isDiff'];

export function runDerive<T extends Dict = Dict>(result: T): T;
