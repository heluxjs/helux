import { delListItem, isDebug, isFn, isObj, nodupPush, safeMapGet } from '@helux/utils';
import { FN_KEY } from '../../consts';
import { injectHeluxProto } from '../../helpers/obj';
import type { Dict, IFnCtx, ScopeType } from '../../types/base';
import { fakeFnCtx } from '../common/fake';
import { genFnKey } from '../common/key';
import { getFnScope } from './speedup';

export function getCtxMap(scopeKeyOrFnKey: string) {
  const { FNKEY_STATIC_CTX_MAP, FNKEY_HOOK_CTX_MAP } = getFnScope();
  const map = scopeKeyOrFnKey[0] === 's' ? FNKEY_STATIC_CTX_MAP : FNKEY_HOOK_CTX_MAP;
  return map;
}

export function putComputingFnKey(depKey: string, fnKey: string) {
  const { DEPKEY_COMPUTING_FNKEYS_MAP } = getFnScope();
  const fnKeys = safeMapGet(DEPKEY_COMPUTING_FNKEYS_MAP, depKey, [] as string[]);
  fnKeys.push(fnKey);
}

export function delComputingFnKey(depKey: string, fnKey: string) {
  const { DEPKEY_COMPUTING_FNKEYS_MAP } = getFnScope();
  const fnKeys = DEPKEY_COMPUTING_FNKEYS_MAP.get(depKey);
  if (fnKeys) {
    delListItem(fnKeys, fnKey);
  }
}

/**
 * 删除已记录的相关依赖数据
 */
export function delFnDepData(fnCtx: IFnCtx) {
  const { DEPKEY_FNKEYS_MAP, SKEY_FNKEYS_MAP } = getFnScope();
  const { depKeys, fnKey, depSharedKeys } = fnCtx;
  const toDel: string[] = [];

  depKeys.forEach((key) => {
    const fnKeys = DEPKEY_FNKEYS_MAP.get(key) || [];
    delListItem(fnKeys, fnKey);
    nodupPush(toDel, fnKey);
  });

  // 将 sharedKey 映射的 fnKey 也一并移除
  depSharedKeys.forEach((key) => {
    const fnKeysOfSkey = SKEY_FNKEYS_MAP.get(String(key)) || [];
    toDel.forEach((key) => {
      delListItem(fnKeysOfSkey, key);
    });
  });
}

/**
 * 对当前 fnKey 在上游的记录做操作（删除、新增）
 */
export function opUpstreamFnKey(fnCtx: IFnCtx, isAdd?: boolean) {
  const { FNKEY_STATIC_CTX_MAP } = getFnScope();
  const { fnKey, prevLevelFnKeys } = fnCtx;
  prevLevelFnKeys.forEach((upFnKey) => {
    const next = FNKEY_STATIC_CTX_MAP.get(upFnKey)?.nextLevelFnKeys;
    if (next) {
      isAdd ? nodupPush(next, fnKey) : delListItem(next, fnKey);
    }
  });
}

/**
 * for hot reload
 * see window.__HELUX__.help.fnDep.FNKEY_HOOK_CTX_MAP
 */
export function markFnExpired() {
  const { FNKEY_HOOK_CTX_MAP } = getFnScope();
  if (isDebug()) {
    // for hot reload working well
    FNKEY_HOOK_CTX_MAP.forEach((item) => {
      item.isExpired = true;
    });
  }
}

export function markFnKey(fnOrObj: Dict, scopeType: ScopeType, fnKey?: string) {
  const fnKeyStr = fnKey || genFnKey(scopeType);
  if (isFn(fnOrObj)) {
    // @ts-ignore
    fnOrObj[FN_KEY] = fnKeyStr;
  } else {
    injectHeluxProto(fnOrObj);
    fnOrObj.__proto__[FN_KEY] = fnKeyStr;
  }
  return fnKeyStr;
}

export function getFnKey<T = Dict>(fnOrObj: T): string {
  if (isFn(fnOrObj)) {
    // @ts-ignore
    return fnOrObj[FN_KEY] || '';
  }
  if (isObj(fnOrObj)) {
    // @ts-ignore
    return fnOrObj.__proto__[FN_KEY] || '';
  }
  return '';
}

export function getFnCtx(fnKey: string) {
  const map = getCtxMap(fnKey);
  return map.get(fnKey);
}

export function getSafeFnCtx(fnKey: string) {
  return getCtxMap(fnKey).get(fnKey) || fakeFnCtx;
}

export function getFnCtxByObj<T = Dict>(obj: T) {
  const fnKey = getFnKey(obj);
  return getFnCtx(fnKey) || null;
}

export function getRunningFn() {
  const { runningFnKey, depKeys, fixedDepKeys, runningSharedKey, isIgnore, delPathAoa } = getFnScope();
  const fnCtx = !runningFnKey ? null : getFnCtx(runningFnKey);
  return { fnCtx, depKeys, fixedDepKeys, delPathAoa, isIgnore, runningSharedKey };
}

export function hasRunningFn() {
  return getFnScope().runningFnKey;
}
