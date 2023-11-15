import { ASYNC_TYPE } from '../consts';
import { CoreApiCtx } from '../types/api-ctx';
import type {
  DeriveAtomFn,
  DerivedAtom,
  DerivedDict,
  DeriveDictFn,
  Dict,
  IDeriveAsyncOptions,
  IDeriveAtomAsyncOptions,
  PlainObject,
} from '../types/base';
import { getAtomTuple, getTuple, useDerivedLogic } from './common/useDerivedLogic';

const { TASK } = ASYNC_TYPE;

export function useDerived<T = PlainObject>(api: CoreApiCtx, resultOrFn: DerivedDict<T> | DeriveDictFn<T>) {
  const fnCtx = useDerivedLogic(api, { fn: resultOrFn });
  return getTuple<T>(fnCtx);
}

export function useDerivedAsync<T = Dict, D = any[]>(api: CoreApiCtx, options: IDeriveAsyncOptions<T, D>) {
  const fnCtx = useDerivedLogic(api, { ...options, showProcess: true, asyncType: TASK });
  return getTuple<T>(fnCtx);
}

export function useDerivedAtom<T = any>(api: CoreApiCtx, resultOrFn: DerivedAtom<T> | DeriveAtomFn<T>) {
  const fnCtx = useDerivedLogic(api, { fn: resultOrFn, forAtom: true });
  return getAtomTuple<T>(fnCtx);
}

export function useDerivedAtomAsync<T = any, D = any[]>(api: CoreApiCtx, options: IDeriveAtomAsyncOptions<T, D>) {
  const fnCtx = useDerivedLogic(api, { ...options, showProcess: true, asyncType: TASK, forAtom: true });
  return getAtomTuple<T>(fnCtx);
}
