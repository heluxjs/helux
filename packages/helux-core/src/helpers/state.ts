import { getSafeNext, getVal, noop, warn } from '@helux/utils';
import { limuUtils } from 'limu';
import { RUN_AT_SERVER, SHARED_KEY } from '../consts';
import { getInternalMap } from '../factory/common/internal';
import { getSharedScope } from '../factory/common/speedup';
import type { TInternal } from '../factory/creator/buildInternal';
import { ParsedOptions } from '../factory/creator/parse';
import { getRoot } from '../factory/root';
import { Dict, IBoundStateInfo, SharedState } from '../types/base';

export function getInternalByKey(sharedKey: number): TInternal {
  const internalMap = getInternalMap();
  return internalMap.get(sharedKey) as TInternal;
}

export function getInternal<T = SharedState>(state: T): TInternal {
  const key = getSharedKey(state);
  const val = getInternalByKey(key);
  return val;
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

/** TODO: get sub node of state */
export function getRawNode() {
  noop();
}

export function getSnap<T = Dict>(state: T, isPrev = true): T {
  const internal = getInternal(state);
  return isPrev ? internal.prevSnap : internal.snap;
}

export function getSharedKey(state: any) {
  if (!state) return 0;
  return state[SHARED_KEY] || getSharedScope().STATE_SHARED_KEY_MAP.get(state) || 0;
}

export function isSharedState(maySharedState: any) {
  return !!getSharedScope().STATE_SHARED_KEY_MAP.get(maySharedState);
}

export function getBoundStateInfo(extraState?: SharedState) {
  let boundInfo: IBoundStateInfo = { state: {}, stateRoot: {}, isAtom: false };
  if (!extraState) {
    return boundInfo;
  }
  const extraInternal = getInternal(extraState);
  if (extraInternal) {
    const { sharedState: state, sharedRoot: stateRoot } = extraInternal;
    boundInfo = { state, stateRoot, isAtom: extraInternal.forAtom };
  }
  return boundInfo;
}

export function markSharedKey(state: Dict) {
  const scope = getSharedScope();
  const { STATE_SHARED_KEY_MAP } = scope;
  const keySeed = getSafeNext(scope.keySeed);
  STATE_SHARED_KEY_MAP.set(state, keySeed);
  scope.keySeed = keySeed;
  return keySeed;
}

export function mapSharedState(sharedKey: number, sharedRoot: Dict) {
  const { SHARED_KEY_STATE_MAP, STATE_SHARED_KEY_MAP } = getSharedScope();
  SHARED_KEY_STATE_MAP.set(sharedKey, sharedRoot);
  // 代理后的 sharedState 也记录下对应的 sharedKey
  STATE_SHARED_KEY_MAP.set(sharedRoot, sharedKey);
}

export function getSharedState(sharedKey: number) {
  return getSharedScope().SHARED_KEY_STATE_MAP.get(sharedKey);
}

export function recordMod(sharedState: Dict, options: ParsedOptions) {
  // 服务端运行，没必要记录模块信息到 global 上，避免服务端内存浪费、
  // 和冗余模块重复信息提示（nextjs里同一个地方的share代码会被多次调用）
  if (RUN_AT_SERVER) {
    return;
  }

  const { rootState, ctx } = getRoot();
  const { moduleName, usefulName } = options;
  const existedShared = rootState[usefulName];
  const existedInternal = getInternal(existedShared);
  if (moduleName && existedInternal && existedInternal.loc !== options.loc) {
    // 非 loading 模块才提示
    if (!moduleName.endsWith('@Loading')) {
      const locInfo = `\nloc1:${existedInternal.loc} \nloc2:${options.loc}`;
      warn(
        `only-dev-mode tip: moduleName ${moduleName} duplicate! `
        + 'this does not effect helux but the duplicated module will be ignored by devtool '
        + 'and the store tree keyed by moduleName'
        + locInfo,
      );
    }
    return;
  }
  // may hot replace for dev mode or add new mod
  rootState[usefulName] = sharedState;
  ctx.modMap.set(usefulName, getInternal(sharedState));
}

export function getCurrentProxyPath(mayProxyDraft: any) {
  if (!mayProxyDraft) {
    return [];
  }
  const meta = limuUtils.getDraftMeta(mayProxyDraft);
  if (!meta) {
    return [];
  }
  return meta.keyPath;
}

/**
 * 获取代理对象（可能已过期）的最新版本代理对象
 */
export function getCurrentProxy(proxyRoot: any, mayProxyDraft: any) {
  const path = getCurrentProxyPath(mayProxyDraft);
  let result = mayProxyDraft;
  if (!path.length) {
    return [result, false, path];
  }

  let isGetSucess = true;
  try {
    result = getVal(proxyRoot, path);
  } catch (err: any) {
    isGetSucess = false;
  }
  return [result, isGetSucess, path];
}
