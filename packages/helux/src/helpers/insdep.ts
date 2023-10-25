import type { InsCtxDef } from '../factory/common/buildInternal';
import { getHeluxRoot } from '../factory/root';

function getScope() {
  return getHeluxRoot().help.insDepScope;
}

const { UNMOUNT_INFO_MAP } = getScope();

/**
 * recover dep
 */
export function recoverDep(insCtx: InsCtxDef) {
  const { insKey, readMap, internal } = insCtx;
  internal.mapInsCtx(insCtx, insKey);

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
export function clearDep(insCtx: InsCtxDef) {
  const { readMap, insKey, internal } = insCtx;
  // del dep before unmount
  Object.keys(readMap).forEach((key) => internal.delDep(key, insKey));
  internal.delInsCtx(insKey);
}

export function updateDep(insCtx: InsCtxDef) {
  const { insKey, readMap, readMapPrev, internal, hasStaticDeps } = insCtx;
  // 设置了静态依赖则运行期间不做更新依赖的动作
  if (hasStaticDeps) {
    return;
  }
  Object.keys(readMapPrev).forEach((prevKey) => {
    if (!readMap[prevKey]) {
      // lost dep
      internal.delDep(prevKey, insKey);
    }
  });
  insCtx.readMapStrict = null;
}

export function resetReadMap(insCtx: InsCtxDef) {
  const { readMap, readMapStrict, hasStaticDeps } = insCtx;
  // 设置了静态依赖则运行期间不做重置依赖的动作
  if (hasStaticDeps) {
    return;
  }
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
