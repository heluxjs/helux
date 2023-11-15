import { delListItem, nodupPush, safeMapGet } from 'helux-utils';
import { STATE_TYPE } from '../../consts';
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
    const { state } = createFn({ apiCtx, rawState: {}, forGlobal: true, stateType: STATE_TYPE.GLOGAL_EMPTY });
    const internal = getInternal(state);
    ctx.globalEmpty = state;
    ctx.globalEmptyInternal = internal;
  }
  GLOBAL_EMPTY = shared;
  return shared;
}

export function getGlobalIdInsKeys(id: NumStrSymbol) {
  const { GID_INSKEYS_MAP } = getFnScope();
  return safeMapGet(GID_INSKEYS_MAP, id, [] as number[]);
}

export function getGlobalEmptyInternal() {
  return getRootCtx().globalEmptyInternal;
}

export function mapGlobalId(id: NumStrSymbol, insKey: number) {
  if (!id) return;
  const keys = getGlobalIdInsKeys(id);
  nodupPush(keys, insKey);
}

export function delGlobalId(id: NumStrSymbol, insKey: number) {
  if (!id) return;
  const keys = getGlobalIdInsKeys(id);
  delListItem(keys, insKey);
}
