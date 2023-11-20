import type { ApiCtx, Dict, PartialStateCb } from '@helux/types';
import { isFn } from '@helux/utils';
import { useForceUpdate } from './useForceUpdate';
import { useStable } from './useStable';

interface IObjApi<T> {
  setState: (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void;
  getLatestState: () => T;
}

interface ILogicRef {
  state: any;
  unmount: boolean;
  shouldCopy: boolean;
}

export function useObjectLogic<T extends object = Dict>(
  apiCtx: ApiCtx,
  initialState: T | (() => T),
  handleState?: (partialStateOrCb: Partial<T> | PartialStateCb<T>, prevState: T) => T,
  returnFull?: boolean,
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void, IObjApi<T>] {
  const { useState, useRef, useEffect } = apiCtx.react;
  const [stableState] = useState<T>(initialState);
  const forceUpdate = useForceUpdate(apiCtx);
  const logicRef = useRef<ILogicRef>({ state: null, unmount: false, shouldCopy: true });

  const api: IObjApi<T> = useStable(apiCtx, {
    setState(partialStateOrCb: any) {
      const cur = logicRef.current;
      if (cur.unmount) {
        // already unmounted
        return;
      }
      let partial;
      const { state } = cur;
      // user want to handle partial state self
      if (handleState) {
        // prevState 优先给已浅克隆的那个
        partial = handleState(partialStateOrCb, cur.state || stableState);
        // 处理者需自己保证返回的完整状态，目前此函数对接了 useMutable
        if (returnFull && partial) {
          cur.state = partial;
          cur.shouldCopy = false;
        } else {
          cur.shouldCopy = true;
        }
      } else {
        partial = (isFn(partialStateOrCb) ? partialStateOrCb(state) : partialStateOrCb) || {};
        cur.shouldCopy = true; // 标记需要潜克隆，触发 getLatestState 时才做克隆操作
      }

      Object.assign(stableState, partial || {}); // 合并到稳定引用里
      forceUpdate();
    },
    getLatestState() {
      const cur = logicRef.current;
      if (cur.shouldCopy) {
        cur.state = { ...stableState }; // 浅克隆为最新的
        cur.shouldCopy = false;
      }
      return cur.state as T;
    },
  });

  useEffect(() => {
    const cur = logicRef.current;
    cur.unmount = false; // 防止 StrictMode 写为 true
    // cleanup callback，标记组件已卸载
    return () => {
      cur.unmount = true;
    };
  }, [logicRef]);

  return [stableState, api.setState, api];
}

/**
 * 使用 useObject 有两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * 3 默认返回稳定引用状态
 * ```
 * @param initialState
 * @returns
 */
export function useObject<T extends object = Dict>(apiCtx: ApiCtx, initialState: T | (() => T)) {
  return useObjectLogic(apiCtx, initialState);
}
