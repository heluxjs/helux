import { isDebug } from '@helux/utils';
import { STATE_TYPE } from '../../consts';
import type { TInternal } from '../creator/buildInternal';
import { getSharedScope } from './speedup';

export function getInternalMap() {
  const { INTERMAL_MAP } = getSharedScope();
  return INTERMAL_MAP;
}

/**
 * for hot reload
 * see window.__HELUX__.ctx.shared.INTERMAL_MAP
 */
export function clearInternal(moduleName: string, loc: string) {
  if (!moduleName || !isDebug() || !loc) return;
  const { INTERMAL_MAP, SHARED_KEY_STATE_MAP, STATE_SHARED_KEY_MAP } = getSharedScope();
  let matchedKeys: number[] = [];
  let cleared = false;
  INTERMAL_MAP.forEach((item) => {
    // 清理逻辑仅处理用户状态即可
    if (item.moduleName === moduleName && item.loc === loc && item.stateType === STATE_TYPE.USER_STATE) {
      matchedKeys.push(item.sharedKey);
    }
  });

  // 清除第一个即可
  if (matchedKeys.length > 1) {
    const key = matchedKeys[0];
    const prev = INTERMAL_MAP.get(key);
    INTERMAL_MAP.delete(key);
    if (prev) {
      SHARED_KEY_STATE_MAP.delete(prev.sharedKey);
      STATE_SHARED_KEY_MAP.delete(prev.rawState);
    }
  }

  return cleared;
}

export function setInternal(key: number, internal: TInternal) {
  const map = getInternalMap();
  map.set(key, internal);
  return internal;
}
