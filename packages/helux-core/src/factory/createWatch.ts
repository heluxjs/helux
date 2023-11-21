import { isFn, noop } from '@helux/utils';
import { SCOPE_TYPE, WATCH } from '../consts';
import { markFnEnd, markFnStart, registerFn } from '../helpers/fnCtx';
import { recordFnDepKeys } from '../helpers/fnDep';
import { getInternal } from '../helpers/state';
import type { Fn, IFnCtx, IWatchFnParams, ScopeType, SharedState, WatchOptionsType } from '../types/base';
import { parseWatchOptions } from './creator/parse';

function putSharedToDep(list: any[]) {
  // list 里可能包含共享状态自身引用
  if (Array.isArray(list)) {
    list.forEach((sharedState: any) => {
      const internal = getInternal(sharedState);
      if (internal) {
        const { sharedKey } = internal;
        recordFnDepKeys([`${sharedKey}`], { sharedKey });
      }
    });
  }
}

export function createWatchLogic<T = SharedState>(
  watchFn: (fnParams: IWatchFnParams) => void,
  options: { scopeType: ScopeType; fnCtxBase?: IFnCtx; immediate?: boolean; deps?: Fn; sharedState?: T },
) {
  const { scopeType, fnCtxBase, immediate, deps = noop } = options;
  if (!isFn(watchFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to watch!');
  }

  const fnCtx = registerFn(watchFn, { specificProps: { scopeType, fnType: WATCH }, fnCtxBase });
  markFnStart(fnCtx.fnKey);
  const list = deps() || [];
  if (immediate) {
    watchFn({ isFirstCall: true });
  }
  markFnEnd();
  putSharedToDep(list);

  return fnCtx;
}

export function watch(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchOptionsType) {
  const { deps, immediate } = parseWatchOptions(options);
  createWatchLogic(watchFn, { scopeType: SCOPE_TYPE.STATIC, deps, immediate });
}
