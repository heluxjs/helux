import { getHeluxRoot } from '../factory/root';
import type { IInsCtx } from '../types';

function getScope() {
  return getHeluxRoot().help.insDep;
}

const { UNMOUNT_INFO_MAP } = getScope();

/**
 * recover dep
 */
export function recoverDep(insCtx: IInsCtx) {
  const { insKey, readMap, internal } = insCtx;
  internal.mapInsCtx(insKey, insCtx);

  let info = UNMOUNT_INFO_MAP.get(insKey);
  if (info) {
    info.c = 2;
    info.prev = insKey - 1;
  } else {
    info = { c: 1, t: Date.now(), prev: 0 };
    UNMOUNT_INFO_MAP.set(insKey, info);
  }

  const { c: mountCount } = info;
  if (mountCount === 2) {
    // 因为双调用导致第二次 mount，需把前一刻已触发了 unmount 行为导致的依赖丢失还原回来
    Object.keys(readMap).forEach((key) => {
      internal.recordDep(key, insKey);
    });
  }
}

/**
 * clear dep
 */
export function clearDep(insCtx: IInsCtx) {
  const { readMap, insKey, internal } = insCtx;
  // del dep before unmount
  Object.keys(readMap).forEach((key) => internal.delDep(key, insKey));
  internal.delInsCtx(insKey);
}

export function updateDep(insCtx: IInsCtx) {
  const { insKey, readMap, readMapPrev, internal } = insCtx;
  Object.keys(readMapPrev).forEach((prevKey) => {
    if (!readMap[prevKey]) {
      // lost dep
      internal.delDep(prevKey, insKey);
    }
  });
  insCtx.readMapStrict = null;
}

export function resetReadMap(insCtx: IInsCtx) {
  const { readMap, readMapStrict } = insCtx;
  if (readMapStrict) {
    // second call
    insCtx.readMapPrev = readMapStrict;
    insCtx.readMapStrict = null;
  } else {
    insCtx.readMapPrev = readMap;
    insCtx.readMapStrict = readMap;
    insCtx.readMap = {}; // reset read map
  }
}
