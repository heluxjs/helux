import type { IFnCtx, IFnParams, PlainObject, ScopeType } from '../types';
import { createFnCtx } from './common/computed';

export function createComputedLogic<T extends PlainObject = PlainObject>(
  computeFn: (params: IFnParams<T>) => T,
  options?: { scopeType?: ScopeType; fnCtxBase?: IFnCtx },
) {
  const fnCtx = createFnCtx({ ...(options || {}), sourceFn: computeFn, computeFn, isAsync: false });
  return fnCtx;
}

/**
 * 创建一个普通的计算任务
 */
export function createComputed<T extends PlainObject = PlainObject>(computedFn: (params: IFnParams) => T): T {
  const fnCtx = createComputedLogic<T>(computedFn);
  return fnCtx.proxyResult;
}
