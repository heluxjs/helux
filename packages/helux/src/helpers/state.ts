import type { TInternal } from '../factory/common/buildInternal';
import { getHeluxRoot } from '../factory/root';
import { Dict, IInnerCreateOptions, SharedDict } from '../types';
import { isDebug, isObj, safeMapGet } from '../utils';

function getScope() {
  return getHeluxRoot().help.sharedInfo;
}

const { UNMOUNT_INFO_MAP, SHARED_KEY_STATE_MAP, STATE_SHARED_KEY_MAP, INTERMAL_MAP, BEENING_WATCHED_MAP } = getScope();

export function getInternalMap() {
  return INTERMAL_MAP;
}

export function getUnmountInfoMap() {
  return UNMOUNT_INFO_MAP;
}

export function getInternal(state: Dict): TInternal {
  const key = getSharedKey(state);
  return INTERMAL_MAP[key];
}

export function getInternalByKey(sharedKey: number): TInternal {
  return INTERMAL_MAP[sharedKey];
}

export function getRawState<T extends Dict>(state: T): T {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getRawStateSnap<T extends Dict>(state: T): T {
  const internal = getInternal(state);
  return internal.rawStateSnap;
}

export function getSharedKey(state: Dict) {
  if (!isObj(state)) return 0;
  return STATE_SHARED_KEY_MAP.get(state) || 0;
}

/**
 * see window.__HELUX__.help.shared.INTERMAL_MAP
 */
export function clearInternal(moduleName: string) {
  if (!moduleName) return;
  if (!isDebug()) return;

  let matchedKeys: string[] = [];
  const keys = Object.keys(INTERMAL_MAP);
  for (const key of keys) {
    const item = INTERMAL_MAP[key];
    if (item.moduleName === moduleName) {
      matchedKeys.push(item.sharedKey);
    }
  }

  // 清除头2个即可
  if (matchedKeys.length > 2) {
    Reflect.deleteProperty(INTERMAL_MAP, matchedKeys[0]);
    Reflect.deleteProperty(INTERMAL_MAP, matchedKeys[1]);
  }
}

export function bindInternal<T extends Dict = Dict>(state: Dict, internal: T): T {
  const key = getSharedKey(state);
  INTERMAL_MAP[key] = internal;
  return internal;
}

export function markSharedKey(state: Dict) {
  let keySeed = getScope().keySeed;
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  STATE_SHARED_KEY_MAP.set(state, keySeed);
  getScope().keySeed = keySeed;
  return keySeed;
}

export function mapSharedState(sharedKey: number, sharedState: Dict) {
  SHARED_KEY_STATE_MAP.set(sharedKey, sharedState);
  // 代理后的 sharedState 也记录下对应的 sharedKey
  STATE_SHARED_KEY_MAP.set(sharedState, sharedKey);
}

export function getSharedState(sharedKey: number) {
  return SHARED_KEY_STATE_MAP.get(sharedKey);
}

export function recordMod(sharedState: Dict, options: IInnerCreateOptions) {
  const { rootState, help } = getHeluxRoot();
  const { forGlobal, moduleName } = options;
  const treeKey = moduleName || getSharedKey(sharedState);
  if (rootState[treeKey] && !window.location.port) {
    return console.error(`moduleName ${moduleName} duplicate!`);
  }
  // may hot replace for dev mode or add new mod
  rootState[treeKey] = sharedState;
  const internal = getInternal(sharedState);
  help.mod[treeKey] = { setState: internal.setState };

  if (forGlobal) {
    getHeluxRoot().globalInternal = internal;
  }
}

export function setWatcher(selfShared: SharedDict, watch: SharedDict[]) {
  watch.forEach((watchingTarget) => {
    const watchers = safeMapGet(BEENING_WATCHED_MAP, watchingTarget, [] as SharedDict[]);
    watchers.push(selfShared);
  });
}

export function getWatchers(changedShared: SharedDict) {
  const watcherList = BEENING_WATCHED_MAP.get(changedShared) || [];
  return watcherList;
}
