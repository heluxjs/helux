import { SCOPE_TYPE, WATCH } from '../consts';
import * as fnDep from '../helpers/fndep';
import { getInternal } from '../helpers/state';
import type { Fn, IFnCtx, IWatchFnParams, ScopeType, WatchDepFn, WatchOptionsType } from '../types';
import { isFn, isObj, noop } from '../utils';

function parseOptions(options?: WatchOptionsType) {
  let dep: WatchDepFn = noop;
  let immediate: boolean = true;
  if (isFn(options)) {
    dep = options;
  } else if (isObj(options)) {
    dep = options.dep || noop;
    immediate = options.immediate ?? true;
  }
  return { immediate, dep };
}

export function createWatchLogic(
  watchFn: (fnParams: IWatchFnParams) => void,
  options: { scopeType: ScopeType; fnCtxBase?: IFnCtx; immediate?: boolean; dep?: Fn },
) {
  const { scopeType, fnCtxBase, immediate = false, dep = noop } = options;
  if (!isFn(watchFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to watch!');
  }

  const fnCtx = fnDep.mapFn(watchFn, { specificProps: { scopeType, fnType: WATCH }, fnCtxBase });
  const list = dep() || [];
  if (immediate) {
    watchFn({ isFirstCall: true });
  }
  if (Array.isArray(list)) {
    list.forEach((sharedState: any) => {
      const internal = getInternal(sharedState);
      if (internal) {
        const { sharedKey } = internal;
        fnDep.recordValKeyDep(`${sharedKey}`, { sharedKey });
      }
    });
  }
  fnDep.delRunninFnKey();

  return fnCtx;
}

export function watch(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchOptionsType) {
  const { dep, immediate } = parseOptions(options);
  createWatchLogic(watchFn, { scopeType: SCOPE_TYPE.STATIC, dep, immediate });
}
