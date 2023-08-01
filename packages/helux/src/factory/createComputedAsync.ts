import type { Dict, IAsyncTaskParams, ICreateComputedLogicOptions } from '../types';
import { createFnCtx } from './common/computed';

export function createComputedAsyncLogic<S extends any = any, R extends Dict = Dict>(
  sourceFn: () => { source: S; initial: R },
  computeFn: (taskParams: IAsyncTaskParams) => Promise<R>,
  options?: ICreateComputedLogicOptions,
) {
  const fnCtx = createFnCtx({ ...(options || {}), sourceFn, computeFn, isAsync: true, asyncType: 'source' });
  return fnCtx;
}

export function createComputedAsync<S extends any = any, R extends Dict = Dict>(
  sourceFn: () => { source: S; initial: R },
  computeFn: (taskParams: IAsyncTaskParams<S>) => Promise<R>,
): R {
  const fnCtx = createComputedAsyncLogic<S, R>(sourceFn, computeFn);
  return fnCtx.proxyResult;
}
