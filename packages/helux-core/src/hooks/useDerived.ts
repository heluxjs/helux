import { CoreApiCtx } from '../types/api-ctx';
import type { DerivedAtom, DerivedDict, IUseDerivedOptions, PlainObject } from '../types/base';
import { getAtomTuple, getTuple, useDerivedLogic } from './common/useDerivedLogic';

export function useDerived<T = PlainObject>(api: CoreApiCtx, result: DerivedDict<T>, options?: IUseDerivedOptions) {
  const fnCtx = useDerivedLogic(api, { result, ...(options || {}) });
  return getTuple<T>(fnCtx);
}

export function useDerivedAtom<T = any>(api: CoreApiCtx, result: DerivedAtom<T>, options?: IUseDerivedOptions) {
  const fnCtx = useDerivedLogic(api, { result, forAtom: true, ...(options || {}) });
  return getAtomTuple<T>(fnCtx);
}
