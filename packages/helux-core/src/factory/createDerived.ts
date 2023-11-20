import { isFn } from '@helux/utils';
import type { Atom, DeriveAtomFn, DeriveAtomFnItem, DeriveFn, DeriveFnItem, ICreateDeriveLogicOptions, PlainObject } from '../types/base';
import { initDeriveFn } from './common/derived';

export function createDeriveLogic<T extends any = any>(
  fn: DeriveFn<T> | DeriveFnItem | DeriveAtomFn<T> | DeriveAtomFnItem,
  options?: ICreateDeriveLogicOptions,
) {
  const fnItem = isFn(fn) ? { fn } : fn || {};
  const fnCtx = initDeriveFn({ ...(options || {}), ...fnItem });
  return fnCtx;
}

/**
 * 创建派生结果
 */
export function derive<T = PlainObject>(deriveFn: DeriveFn<T> | DeriveFnItem): T {
  const fnCtx = createDeriveLogic<T>(deriveFn);
  return fnCtx.proxyResult as T;
}

/**
 * 为 atom 创建一个派生结果，支持返回 pritimive 类型
 */
export function deriveAtom<T = any>(deriveFn: DeriveAtomFn | DeriveAtomFnItem): Atom<T> {
  const fnCtx = createDeriveLogic<T>(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<T>;
}
