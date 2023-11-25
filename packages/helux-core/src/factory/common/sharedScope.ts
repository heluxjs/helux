import type { TInternal } from '../creator/buildInternal';
import { getSharedScope } from './speedup';
import { isValChanged } from './util';

/**
 * true: 有差异
 * false：无差异
 */
export function diffVal(internal: TInternal, depKey: string) {
  const scope = getSharedScope();
  const { COMPARE_MAP } = scope;
  let result = COMPARE_MAP.get(depKey);
  // already have cached compare result
  if (result !== undefined) {
    return result;
  }

  // 对于 shared 根对象的比较，rootValKey 和 sharedKeyStr相同，此时可安全复用 isStateChanged 结果
  // 原因见 factory/common/update 45 行，analyzeDepKey(rootValKey)
  if (internal.sharedKeyStr === depKey) {
    return scope.isStateChanged;
  }

  result = isValChanged(internal, depKey);
  COMPARE_MAP.set(depKey, result);

  // 记录根对象已发送改变
  if (result) {
    scope.isStateChanged = true;
  }

  return result;
}

/**
 * 清除比较记录
 */
export function clearDiff() {
  const scope = getSharedScope();
  scope.COMPARE_MAP.clear();
  scope.isStateChanged = false;
}
