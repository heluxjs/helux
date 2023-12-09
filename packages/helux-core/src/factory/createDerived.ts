import { isFn } from '@helux/utils';
import type { Atom, DeriveFn, DeriveFnItem, ICreateDeriveLogicOptions, PlainObject } from '../types/base';
import { initDeriveFn } from './common/derived';

export function createDeriveLogic<T extends any = any>(fn: DeriveFn<T> | DeriveFnItem, options?: ICreateDeriveLogicOptions) {
  const fnItem = isFn(fn) ? { fn } : fn || {};
  const fnCtx = initDeriveFn({ ...(options || {}), ...fnItem });
  return fnCtx;
}

/**
 * 创建派生结果
 */
export function derive<T = any>(deriveFn: DeriveFn<T> | DeriveFnItem): Atom<T> {
  const fnCtx = createDeriveLogic<T>(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<T>;
}

/**
 * 创建一个返回值为 dict 数据的派生结果，区别于 derive 接口，此接口无自动装箱行为
 */
export function deriveDict<T = PlainObject>(deriveFn: DeriveFn<T> | DeriveFnItem): T {
  const fnCtx = createDeriveLogic<T>(deriveFn);
  return fnCtx.proxyResult as T;
}
