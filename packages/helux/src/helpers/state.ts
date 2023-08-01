import { SHARED_KEY } from '../consts';
import type { TInternal } from '../factory/common/buildInternal';
import { getHeluxRoot } from '../factory/root';
import { Dict } from '../types';
import { isObj } from '../utils';

function getScope() {
  return getHeluxRoot().help.shared;
}

const { UNMOUNT_INFO_MAP, SHARED_KEY_STATE_MAP, INTERMAL_MAP } = getScope();

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

export function getRawState(state: Dict) {
  const internal = getInternal(state);
  return internal.rawState;
}

export function getSharedKey(state: Dict) {
  if (!isObj(state)) return 0;
  return state[SHARED_KEY] || 0;
}

export function bindInternal<T extends Dict = Dict>(state: Dict, internal: T): T {
  const key = getSharedKey(state);
  INTERMAL_MAP[key] = internal;
  return internal;
}

let keySeed = 0;
export function markSharedKey(state: Dict) {
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  state.__proto__[SHARED_KEY] = keySeed;
  return keySeed;
}

export function mapSharedState(sharedKey: number, state: Dict) {
  SHARED_KEY_STATE_MAP.set(sharedKey, state);
}

export function getSharedState(sharedKey: number) {
  return SHARED_KEY_STATE_MAP.get(sharedKey);
}

export function record(moduleName: string, sharedState: Dict) {
  const { rootState, help } = getHeluxRoot();
  const treeKey = moduleName || getSharedKey(sharedState);
  if (rootState[treeKey] && !window.location.port) {
    return console.error(`moduleName ${moduleName} duplicate!`);
  }
  // may hot replace for dev mode or add new mod
  rootState[treeKey] = sharedState;
  help.mod[treeKey] = { setState: getInternal(sharedState).setState };
}
