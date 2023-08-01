import * as fnDep from '../helpers/fndep';
import type { IFnCtx, IFnParams } from '../types';
import { isFn } from '../utils';

export function createWatchLogic(watchFn: (fnParams: IFnParams) => void, options: { scopeType: 'static' | 'hook'; fnCtxBase?: IFnCtx }) {
  const { scopeType, fnCtxBase } = options;

  if (!isFn(watchFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to createWatch!');
  }

  const fnCtx = fnDep.mapFn(watchFn, { specificProps: { scopeType, fnType: 'watch' }, fnCtxBase });
  watchFn({ isFirstCall: true });
  fnDep.delRunninFnKey();

  return fnCtx;
}

export function createWatch(watchFn: (fnParams: IFnParams) => void) {
  createWatchLogic(watchFn, { scopeType: 'static' });
}
