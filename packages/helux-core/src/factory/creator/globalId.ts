import { delListItem, nodupPush, safeMapGet } from '@helux/utils';
import { RUN_AT_SERVER, STATE_TYPE } from '../../consts';
import { getInternal } from '../../helpers/state';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Fn, NumStrSymbol } from '../../types/base';
import { getFnScope } from '../common/speedup';
import { getRootCtx } from '../root';

// will init after calling ensureGlobal at createShared
let GLOBAL_EMPTY: any = null;

export function getGlobalEmpty() {
  return GLOBAL_EMPTY;
}

export function initGlobalEmpty(apiCtx: CoreApiCtx, createFn: Fn) {
  const ctx = getRootCtx();
  let shared = ctx.globalEmpty;
  if (!shared) {
    // global shared state
    const { stateRoot } = createFn({ apiCtx, rawState: {}, forGlobal: true, stateType: STATE_TYPE.GLOGAL_EMPTY });
    const internal = getInternal(stateRoot);
    ctx.globalEmpty = stateRoot;
    ctx.globalEmptyInternal = internal;
    GLOBAL_EMPTY = stateRoot;
    shared = stateRoot;
  }
  return shared;
}

export function getGlobalIdInsKeys(id: NumStrSymbol) {
  const { GID_INSKEYS_MAP } = getFnScope();
  return safeMapGet(GID_INSKEYS_MAP, id, [] as number[]);
}

export function getGlobalEmptyInternal() {
  return getRootCtx().globalEmptyInternal;
}

export function mapGlobalIds(ids: NumStrSymbol[], insKey: number) {
  // 服务端运行时，不做 globalId 映射，避免内存浪费
  if (RUN_AT_SERVER) return;
  ids.forEach((id) => {
    const keys = getGlobalIdInsKeys(id);
    nodupPush(keys, insKey);
  });
}

export function delGlobalIds(ids: NumStrSymbol[], insKey: number) {
  ids.forEach((id) => {
    const keys = getGlobalIdInsKeys(id);
    delListItem(keys, insKey);
  });
}
