import { ASYNC_TYPE } from '../consts';
import type {
  DeriveAtomFn,
  DerivedAtom,
  DerivedDict,
  DeriveDictFn,
  Dict,
  PlainObject,
  IDeriveAsyncOptions,
  IDeriveAtomAsyncOptions,
} from '../types';
import { getAtomTuple, getTuple, useDerivedLogic } from './common/useDerivedLogic';

const { TASK } = ASYNC_TYPE;

export function useDerived<T = PlainObject>(resultOrFn: DerivedDict<T> | DeriveDictFn<T>) {
  const fnCtx = useDerivedLogic({ fn: resultOrFn });
  return getTuple<T>(fnCtx);
}

export function useDerivedAsync<T = Dict, D = any[]>(options: IDeriveAsyncOptions<T, D>) {
  const fnCtx = useDerivedLogic({ ...options, showProcess: true, asyncType: TASK });
  return getTuple<T>(fnCtx);
}

export function useDerivedAtom<T = any>(resultOrFn: DerivedAtom<T> | DeriveAtomFn<T>) {
  const fnCtx = useDerivedLogic({ fn: resultOrFn, forAtom: true });
  return getAtomTuple<T>(fnCtx);
}

export function useDerivedAtomAsync<T = any, D = any[]>(options: IDeriveAtomAsyncOptions<T, D>) {
  const fnCtx = useDerivedLogic({ ...options, showProcess: true, asyncType: TASK, forAtom: true });
  return getAtomTuple<T>(fnCtx);
}
