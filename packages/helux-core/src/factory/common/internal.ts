import { isDebug } from '../../utils';
import type { TInternal } from '../creator/buildInternal';
import { getSharedScope } from './speedup';

export function getInternalMap() {
  const { INTERMAL_MAP } = getSharedScope();
  return INTERMAL_MAP;
}

/**
 * for hot reload
 * see window.__HELUX__.help.shared.INTERMAL_MAP
 */
export function clearInternal(moduleName: string, loc: string) {
  if (!moduleName || !isDebug() || !loc) return;
  const map = getInternalMap();
  let matchedKeys: number[] = [];
  map.forEach((item) => {
    if (item.moduleName === moduleName && item.loc === loc) {
      matchedKeys.push(item.sharedKey);
    }
  });

  // 清除第一个即可
  if (matchedKeys.length > 1) {
    Reflect.deleteProperty(map, matchedKeys[0]);
  }
}

export function setInternal(key: number, internal: TInternal) {
  const map = getInternalMap();
  map.set(key, internal);
  return internal;
}
