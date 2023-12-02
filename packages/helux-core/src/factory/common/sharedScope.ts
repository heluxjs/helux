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

  // 对于 shared 根对象的比较，rootValKey 和 sharedKeyStr 相同，此时可安全复用 isStateChanged 结果
  // 原因见 factory/common/notify 45 行，analyzeDepKey(rootValKey)
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

export function hasChangedNode(internal: TInternal, depKeys: string[], depKey: string) {
  // 优先比较自身值有无变化
  if (depKeys.includes(depKey) && diffVal(internal, depKey)) {
    return true;
  }

  // 再查找子串值有无变化
  let subValChanged = false;
  for (const storedDepKey of depKeys) {
    // 是 key 的子串，比较值是否有变化
    if (storedDepKey.startsWith(depKey) && diffVal(internal, storedDepKey)) {
      subValChanged = true;
    }
  }
  return subValChanged;
}

/**
 * 清除比较记录
 */
export function clearDiff() {
  const scope = getSharedScope();
  scope.COMPARE_MAP.clear();
  scope.isStateChanged = false;
}
