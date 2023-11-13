import { getInternalMap } from '../factory/common/internal';
import { getSharedScope } from '../factory/common/speedup';
import type { TInternal } from '../factory/creator/buildInternal';
import { getRoot } from '../factory/root';
import { Dict, SharedState } from '../types';
import { ParsedOptions } from '../factory/creator/parse';
import { getSafeNext, isDebug, isObj } from '../utils';


export function getInternalByKey(sharedKey: number): TInternal {
  const internalMap = getInternalMap();
  return internalMap.get(sharedKey) as TInternal;
}

export function getInternal<T = SharedState>(state: T): TInternal {
  const key = getSharedKey(state);
  return getInternalByKey(key);
}

export function setInternal(state: SharedState, internal: TInternal) {
  const internalMap = getInternalMap();
  const key = getSharedKey(state);
  internalMap.set(key, internal);
}

export function getRawState<T = Dict>(state: T): T {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getSnap<T = Dict>(state: T, isPrev = true): T {
  const internal = getInternal(state);
  return isPrev ? internal.prevSnap : internal.snap;
}

export function getSharedKey<T = SharedState>(state: T) {
  if (!isObj(state)) return 0;
  const scope = getSharedScope();
  const { STATE_SHARED_KEY_MAP } = scope;
  return STATE_SHARED_KEY_MAP.get(state) || 0;
}

export function isSharedState(maySharedState: any) {
  const { STATE_SHARED_KEY_MAP } = getSharedScope();
  return !!STATE_SHARED_KEY_MAP.get(maySharedState);
}

export function markSharedKey(state: Dict) {
  const scope = getSharedScope();
  const { STATE_SHARED_KEY_MAP } = scope;
  const keySeed = getSafeNext(scope.keySeed);
  STATE_SHARED_KEY_MAP.set(state, keySeed);
  scope.keySeed = keySeed;
  return keySeed;
}

export function mapSharedState(sharedKey: number, sharedState: Dict) {
  const { SHARED_KEY_STATE_MAP, STATE_SHARED_KEY_MAP } = getSharedScope();
  SHARED_KEY_STATE_MAP.set(sharedKey, sharedState);
  // 代理后的 sharedState 也记录下对应的 sharedKey
  STATE_SHARED_KEY_MAP.set(sharedState, sharedKey);
}

export function getSharedState(sharedKey: number) {
  const { SHARED_KEY_STATE_MAP } = getSharedScope();
  return SHARED_KEY_STATE_MAP.get(sharedKey);
}

export function recordMod(sharedState: Dict, options: ParsedOptions) {
  const { rootState, ctx } = getRoot();
  const { moduleName } = options;
  const treeKey = moduleName || getSharedKey(sharedState);
  if (rootState[treeKey] && !isDebug()) {
    return console.error(`moduleName ${moduleName} duplicate!`);
  }
  // may hot replace for dev mode or add new mod
  rootState[treeKey] = sharedState;
  const internal = getInternal(sharedState);
  ctx.mod[treeKey] = { setState: internal.setState };
}
