/*
|------------------------------------------------------------------------------------------------
| helux@3.0.0
| A simple and powerful react state library with dependency collection, computed and watch, 
| compatible with react 18 concurrency mode.
|------------------------------------------------------------------------------------------------
*/
import type { Dict, DictN, EffectCb, ICreateOptionsType, SharedObject } from './types';

type Advance = {
  /** after calling getDepStats, mem depStats will be cleanup automatically */
  getDepStats: () => DictN<Array<string>>;
  getSharedState: (sharedKey: number) => Dict;
};

/**
 * @deprecated
 * unstable currently ( for helux-signal in the future )
 */
export const advance: Advance;

/**
 * 创建共享对象，可透传给 useSharedObject，具体使用见 useSharedObject
 * @param rawState
 * @param moduleName
 * ```
 * const sharedObj = createSharedObject({a:1, b:2});
 * ```
 */
export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T), moduleName?: string): SharedObject<T>;

/**
 *  创建响应式的共享对象，可透传给 useSharedObject
 * ```
 * const [sharedObj, setSharedObj] = createReactiveSharedObject({a:1, b:2});
 * // sharedObj.a = 111; // 任意地方修改 a 属性，触发视图渲染
 * // setSharedObj({a: 111}); // 使用此方法修改 a 属性，同样也能触发视图渲染，深层次的数据修改可使用此方法
 * ```
 */
export function createReactiveSharedObject<T extends Dict = Dict>(
  rawState: T | (() => T),
  moduleName?: string,
): [SharedObject<T>, (partialState: Partial<T>) => void];

/**
 * 创建响应式的共享对象，当需要调用脱离函数上下文的服务函数（即不需要感知props时），
 * 可使用该接口替代`createSharedObject`和`createReactiveSharedObject`，
 * 该接口的第二位参数为是否创建响应式状态，为 true 时效果同 `createReactiveSharedObject` 返回的 sharedObj
 *
 * ```
 *  const ret = createShared({ a: 100, b: 2 });
 *  const ret2 = createShared({ a: 100, b: 2 }, true); // 创建响应式状态
 *  // ret.state 可透传给 useSharedObject
 *  // ret.setState 可以直接修改状态
 *  // ret.call 可以调用服务函数，并透传上下文
 *  const ret3 = createShared({ a: 100, b: 2 }, 'demo'); // 指定模块名
 *
 *  // 既指定模块名，也设定响应式为true
 *  const ret4 = createShared({ a: 100, b: 2 }, { moduleName: 'demo', enableReactive: true });
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
 *      // const { args, state, setState } = ctx;
 *      return { a, b };
 *    }, a, b);
 *  }
 * ```
 * 如需感知组件上下文，则需要`useService`接口去定义服务函数，可查看 useService 相关说明
 */
export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
};

/**
 * 使用共享对象，需注意此接口只接受共享对象，如传递普通对象给它会报错 OBJ_NOT_SHARED_ERR
 * ```ts
 * // 在组件外部其他地方创建共享对象
 * const sharedObj = createSharedObject({a:1, b:2});
 * // 然后在任意组件里使用即可
 * const [ obj, setObj ] = useSharedObject(sharedObj);
 * ```
 * @param sharedObject
 * @param enableReactive
 */
export function useSharedObject<T extends Dict = Dict>(
  sharedObject: T | (() => T),
  enableReactive?: boolean,
): [SharedObject<T>, (partialState: Partial<T>) => void];

/**
 * alias of useSharedObject
 */
export const useShared: typeof useSharedObject;

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

type DefaultExport = {
  /**
   * @deprecated
   * unstable currently ( for helux-signal in the future )
   */
  advance: Advance;
  useObject: typeof useObject;
  useService: typeof useService;
  useSharedObject: typeof useSharedObject;
  useForceUpdate: typeof useForceUpdate;
  useShared: typeof useSharedObject;
  useEffect: typeof useEffect;
  useLayoutEffect: typeof useLayoutEffect;
  createShared: typeof createShared;
  createSharedObject: typeof createSharedObject;
  createReactiveSharedObject: typeof createReactiveSharedObject;
};

declare const defaultExport: DefaultExport;
export default defaultExport;
