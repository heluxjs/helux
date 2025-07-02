import type { PartialStateCb } from '@helux/types';
import type { CoreApiCtx } from '../types/api-ctx';
import { getSharedKey } from '../helpers/state';
import type { Dict, ILocalStateApi } from '../types/base';

/**
 * 使用 useObject 有两个好处
 * ```txt
 * 1 方便定义多个状态值时，少写很多 useState
 * 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 :
 * "Called SetState() on an Unmounted Component" Errors
 * ```
 * 此方法由 helux 直接提供，是为了兼容 2.* 版本的用户，让2.* 版本可安全升级到最新版本而无需改造代码
 */
export function useObject<T extends Dict = Dict>(
  apiCtx: CoreApiCtx,
  initialState: T | (() => T),
  isStable?: boolean,
): [T, (partialStateOrCb: Partial<T> | PartialStateCb<T>) => void, ILocalStateApi<T>] {
  // initialState can not be a shared object
  if (getSharedKey(initialState)) {
    throw new Error('ERR_OBJ_NOT_NORMAL: can not pass a shared object to useObject!');
  }

  return apiCtx.hookImpl.useObjectLogicV2(initialState, { isStable })
}
