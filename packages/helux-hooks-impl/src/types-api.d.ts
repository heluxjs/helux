import { Dict, EffectCb, PartialStateCb } from '@helux/types';

/**
 * 使用稳定的数据
 * ```ts
 *   const [num, setNum] = useState(1});
 *
 *   // 返回一堆稳定方法的集合对象，srv下的所有方法都是稳定不变的引用，方法内部始终能读取到最新的 props.num 和 num
 *   const srv = useStable({
 *      readState() {
 *       console.log(`%c read state num ${num}`, `color:green`);
 *      },
 *      readProps() {
 *        console.log(`%c read props num ${props.num}`, `color:green`);
 *      },
 *    });
 *
 *     // 返回一个稳定的方法，方法内部始终能读取到最新的 props.num 和 num
 *    const fn = useStable(() => {
 *      console.log(`%c read num ${props.num} ${obj.num}`, `color:green`);
 *    });
 * ```
 */
export function useStable<T = any>(data: T): T;

/**
 * 对齐 React.useEffect
 * 优化了调用逻辑，即 strict 模式与普通模式行为一致，只有一次 mount 与 unmount 产生
 */
export function useEffect(cb: EffectCb, deps?: any[]): void;

/**
 * 对齐 React.useLayoutEffect
 * 优化了调用逻辑，即 strict 模式与普通模式行为一致，只有一次 mount 与 unmount 产生
 */
export function useLayoutEffect(cb: EffectCb, deps?: any[]): void;

/**
 * 可指定是否是 isLayout
 */
export function useEffectLogic(cb: EffectCb, options: { isLayout?: boolean; deps?: any[] }): void;

/**
 * 强制更新
 */
export function useForceUpdate(): () => void;

export interface IObjApi<T> {
  setState: (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void;
  /** 返回最新的状态，可能会变化，适用于透传给子组件 */
  getLatestState: () => T;
}

/**
 * 使用普通对象，需注意此接口只接受普通对象
 * 应用里使用 useObject 替代 React.useState 将享受到以下两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * 3 默认返回稳定引用状态
 * ```
 * 代码示例：
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
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void, IObjApi<T>];

/**
 * 复用 useOjbect 内部逻辑，支持自己处理 state
 */
export function useObjectLogic<T = Dict>(
  initialState: T | (() => T),
  handleState?: (partialStateOrCb: Partial<T> | PartialStateCb<T>, prevState: T) => T | null,
  returnFull?: boolean,
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void, IObjApi<T>];
