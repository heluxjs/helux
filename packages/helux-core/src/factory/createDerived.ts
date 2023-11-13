import { ASYNC_TYPE } from '../consts';
import type { Atom, ICreateDeriveLogicOptions, IDeriveFnParams, IFnCtx, PlainObject, ScopeType, IDeriveAtomAsyncOptions, IDeriveAsyncOptions } from '../types';
import { initDeriveFn } from './common/derived';

const { TASK } = ASYNC_TYPE;

export function createDeriveLogic<T extends any = any>(
  fn: (params: IDeriveFnParams<T>) => T,
  options?: { scopeType?: ScopeType; fnCtxBase?: IFnCtx; forAtom?: boolean },
) {
  const fnCtx = initDeriveFn({ ...(options || {}), fn, isAsync: false });
  return fnCtx;
}

export function createDeriveAsyncLogic(options: any, innerOptions?: ICreateDeriveLogicOptions) {
  const fnCtx = initDeriveFn({ ...(innerOptions || {}), ...options, isAsync: true, asyncType: TASK });
  return fnCtx;
}

/**
 * 创建一个普通的派生结果
 */
export function derive<T = PlainObject>(deriveFn: (params: IDeriveFnParams<T>) => T): T {
  const fnCtx = createDeriveLogic<T>(deriveFn);
  return fnCtx.proxyResult as T;
}

/**
 * 创建一个带有异步计算过程的派生结果
 */
export function deriveAsync<T = PlainObject, D = any[]>(options: IDeriveAsyncOptions<T, D>): T {
  const fnCtx = createDeriveAsyncLogic(options);
  return fnCtx.proxyResult as T;
}

/**
 * 为 atom 创建一个普通的派生结果，支持返回 pritimive 类型
 */
export function deriveAtom<T = any>(deriveFn: (params: IDeriveFnParams<T>) => T): Atom<T> {
  const fnCtx = createDeriveLogic<T>(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<T>;
}

/**
 * 为 atom 创建一个带有异步计算过程的派生结果，支持返回 pritimive 类型
 */
export function deriveAtomAsync<T = any, D = any[]>(options: IDeriveAtomAsyncOptions<T, D>): Atom<T> {
  const fnCtx = createDeriveAsyncLogic(options, { forAtom: true });
  return fnCtx.proxyResult as Atom<T>;
}
