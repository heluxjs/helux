import * as fnDep from '../helpers/fndep';
import { isFn } from '../utils';
import type { IFnCtx, IWatchFnParams, ScopeType } from '../types';

export function createWatchLogic(watchFn: (fnParams: IWatchFnParams) => void, options: { scopeType: ScopeType, fnCtxBase?: IFnCtx }) {
  const { scopeType, fnCtxBase } = options;

  if (!isFn(watchFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to createWatch!');
  }

  const fnCtx = fnDep.mapFn(watchFn, { specificProps: { scopeType, fnType: 'watch' }, fnCtxBase });
  watchFn({ isFirstCall: true });
  fnDep.delRunninFnKey();

  return fnCtx;
}

export function watch(watchFn: (fnParams: IWatchFnParams) => void) {
  createWatchLogic(watchFn, { scopeType: 'static' });
}
