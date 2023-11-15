import { Dict, EffectCb, PartialStateCb } from 'helux-types';

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

/**
 * 使用普通对象，需注意此接口只接受普通对象，使用 useObject 替代 React.useState 将享受到以下两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * ```
 * 需注意此接口只接受普通对象，如传递共享对象给它会报错 OBJ_NOT_NORMAL_ERR
 * @param initialState
 * @returns
 */
export function useObject<T = Dict>(initialState: T | (() => T)): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void];

/**
 * 相比 useObject 多了一个是否呼叫传入的 setState 的开关
 */
export function useObjectLogic<T = Dict>(
  state: T,
  setState: (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void,
  callInputSet?: boolean,
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void];
