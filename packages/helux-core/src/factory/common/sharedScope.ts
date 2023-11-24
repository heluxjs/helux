import type { TInternal } from '../creator/buildInternal';
import { getSharedScope } from './speedup';
import { isValChanged } from './util';

/**
 * true: 有差异
 * false：无差异
 */
export function diffVal(internal: TInternal, depKey: string) {
  const { COMPARE_MAP } = getSharedScope();
  let result = COMPARE_MAP.get(depKey);
  if (result !== undefined) {
    return result;
  }
  result = isValChanged(internal, depKey);
  COMPARE_MAP.set(depKey, result);
  return result;
}

export function clearDiff() {
  const { COMPARE_MAP } = getSharedScope();
  COMPARE_MAP.clear();
}
