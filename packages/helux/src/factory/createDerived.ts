import { createFnCtx } from './common/derived';
import type { Atom, IFnCtx, IFnParams, PlainObject, ScopeType, IAsyncTaskParams, ICreateDerivedLogicOptions } from '../types';

export function createDerivedLogic<R extends any = any>(
  deriveFn: (params: IFnParams<R>) => R,
  options?: { scopeType?: ScopeType; fnCtxBase?: IFnCtx, forAtom?: boolean },
) {
  const fnCtx = createFnCtx({ ...(options || {}), sourceFn: deriveFn, deriveFn, isAsync: false });
  return fnCtx;
}

export function createDerivedAsyncLogic<S extends any = any, R extends any = any>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams) => Promise<R>,
  options?: ICreateDerivedLogicOptions,
) {
  const fnCtx = createFnCtx({ ...(options || {}), sourceFn, deriveFn, isAsync: true, asyncType: 'source' });
  return fnCtx;
}

export function createDerivedTaskLogic<R extends any = any>(
  deriveFn: (taskParams: IFnParams) => { initial: R; task: () => Promise<R> },
  options?: ICreateDerivedLogicOptions,
) {
  const fnCtx = createFnCtx({ ...(options || {}), deriveFn, isAsync: true, asyncType: 'task' });
  return fnCtx;
}

/**
 * 创建一个普通的派生新结果的任务
 */
export function derive<R extends PlainObject = PlainObject>(deriveFn: (params: IFnParams) => R): R {
  const fnCtx = createDerivedLogic<R>(deriveFn);
  return fnCtx.proxyResult as R;
}

export function deriveAsync<S extends any = any, R extends PlainObject = PlainObject>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S>) => Promise<R>,
): R {
  const fnCtx = createDerivedAsyncLogic<S, R>(sourceFn, deriveFn);
  return fnCtx.proxyResult as R;
}

export function deriveTask<R extends PlainObject = PlainObject>(
  deriveFn: (taskParams: IFnParams) => { initial: R; task: () => Promise<R> },
): R {
  const fnCtx = createDerivedTaskLogic<R>(deriveFn);
  return fnCtx.proxyResult as R;
}

/**
 * 创建一个普通的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtom<R extends any = any>(deriveFn: (params: IFnParams<R>) => R): Atom<R> {
  const fnCtx = createDerivedLogic<R>(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<R>;
}

/**
 * 创建一个异步的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtomAsync<S extends any = any, R extends any = any>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S>) => Promise<R>,
): Atom<R> {
  const fnCtx = createDerivedAsyncLogic<S, R>(sourceFn, deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<R>;
}

/**
 * 创建一个异步的派生新结果的atom任务，支持返回 pritimive 类型
 */
export function deriveAtomTask<R extends any = any>(
  deriveFn: (taskParams: IFnParams<R>) => { initial: R; task: () => Promise<R> },
): Atom<R> {
  const fnCtx = createDerivedTaskLogic(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<R>;
}
