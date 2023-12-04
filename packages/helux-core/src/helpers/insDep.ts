import { getInsScope } from '../factory/common/speedup';
import type { InsCtxDef } from '../factory/creator/buildInternal';

/**
 * recover dep
 */
export function recoverDep(insCtx: InsCtxDef) {
  const { UNMOUNT_INFO_MAP } = getInsScope();
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

/**
 * 每轮渲染完毕的 effect 里触发依赖数据更新
 */
export function updateDep(insCtx: InsCtxDef) {
  const { canCollect, isFirstRender, currentDepKeys } = insCtx;
  // 标记了不能收集依赖，则运行期间不做更新依赖的动作
  if (!canCollect) {
    if (isFirstRender) {
      insCtx.depKeys = currentDepKeys.slice();
    }
    return;
  }
  insCtx.depKeys = currentDepKeys.slice();
}

/**
 * 重置记录读依赖需要的辅助数据
 */
export function resetDepHelpData(insCtx: InsCtxDef) {
  const { canCollect } = insCtx;
  // 标记了不能收集依赖，则运行期间不做重置依赖的动作
  if (!canCollect) {
    return;
  }
  insCtx.readMap = {}; // reset read map
  insCtx.delReadMap = {};
  insCtx.depKeys = insCtx.currentDepKeys.slice();
  insCtx.currentDepKeys.length = 0;
}
