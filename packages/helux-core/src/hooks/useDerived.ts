import { isDerivedAtom } from '../factory/common/atom';
import { CoreApiCtx } from '../types/api-ctx';
import type { DerivedDict, IUseDerivedOptions, PlainObject } from '../types/base';
import { useDerivedLogic } from './common/useDerivedLogic';

export function useDerived<T = PlainObject>(api: CoreApiCtx, result: DerivedDict<T>, options?: IUseDerivedOptions) {
  const fnCtx = useDerivedLogic(api, { result, ...(options || {}) });
  const { proxyResult, status, renderInfo } = fnCtx;
  const resultForComp = isDerivedAtom(result) ? proxyResult.val : proxyResult;
  return [resultForComp, status, renderInfo];
}
