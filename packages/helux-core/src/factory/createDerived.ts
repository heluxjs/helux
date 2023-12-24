import { isFn } from '@helux/utils';
import type { Atom, DeriveFn, ICreateDeriveLogicOptions, IDeriveFnItem, IDeriveTaskOptions, PlainObject } from '../types/base';
import { initDeriveFn } from './common/derived';

export function createDeriveLogic<T extends any = any>(fn: DeriveFn<T> | IDeriveFnItem, options?: ICreateDeriveLogicOptions) {
  const fnItem = isFn(fn) ? { fn } : fn || {};
  const fnCtx = initDeriveFn({ ...(options || {}), ...fnItem });
  return fnCtx;
}

/**
 * 创建派生结果，自动装箱为 { val: T }
 */
export function derive<T = any>(deriveFn: DeriveFn<T> | IDeriveFnItem): Atom<T> {
  const fnCtx = createDeriveLogic<T>(deriveFn, { forAtom: true });
  return fnCtx.proxyResult as Atom<T>;
}

/**
 * 创建一个返回值为 dict 数据的派生结果，区别于 derive 接口，此接口无自动装箱行为
 */
export function deriveDict<T = PlainObject>(deriveFn: DeriveFn<T> | IDeriveFnItem): T {
  const fnCtx = createDeriveLogic<T>(deriveFn);
  return fnCtx.proxyResult as T;
}

/**
 * 采用柯里化方式生成一个 deriveFnItem ，方便自动推导 deps 返回类型给 IDeriveFnParams
 */
export function defineDeriveTask(deps?: () => any[]) {
  return (options: IDeriveTaskOptions): IDeriveFnItem => ({ ...options, deps });
}

/**
 * 辅助给直接透传给 defineFullDerive 的某个 deriveFnItem 标记类型
 */
export function defineDeriveFnItem<F extends IDeriveFnItem>(fnItem: F): F {
  return fnItem;
}
