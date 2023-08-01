import { EXPIRE_MS, FN_KEY, NOT_MOUNT, PROTO_KEY, RENDER_START, SHARED_KEY, SIZE_LIMIT, UNMOUNT } from '../consts';
import { getHeluxRoot } from '../factory/root';
import type { Dict, Fn, IFnCtx, ScopeType } from '../types';
import { isFn, isObj, nodupPush, noop, safeMapGet } from '../utils';
import { injectHeluxProto } from './obj';
import { getInternalByKey } from './state';

function getScope() {
  return getHeluxRoot().help.fnDep;
}

const scope = getScope();
const { VALKEY_FNKEYS_MAP, UNMOUNT_INFO_MAP, FNKEY_HOOK_CTX_MAP, FNKEY_STATIC_CTX_MAP } = scope;

function getKeySeed(scopeType: ScopeType) {
  let keySeed = scope.keySeed[scopeType];
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  scope.keySeed[scopeType] = keySeed;
  return keySeed;
}

export function markFnKey(fnOrObj: Dict, scopeType: ScopeType, fnKey?: string) {
  const prefix = scopeType === 'static' ? 's' : 'h';
  const fnKeyStr = fnKey || `${prefix}${getKeySeed(scopeType)}`;
  if (isFn(fnOrObj)) {
    // @ts-ignore
    fnOrObj[FN_KEY] = fnKeyStr;
  } else {
    fnOrObj.__proto__[FN_KEY] = fnKeyStr;
  }
  return fnKeyStr;
}

export function getFnKey(fnOrObj: Dict): string {
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

export function buildFnCtx(specificProps?: Partial<IFnCtx>): IFnCtx {
  const base: IFnCtx = {
    fnKey: '',
    fn: noop,
    isFirstLevel: true,
    sourceFn: noop,
    isComputing: false,
    remainRunCount: 0,
    careComputeStatus: false,
    enableRecordResultDep: false,
    nextLevelFnKeys: [],
    prevLevelFnKeys: [],
    mountStatus: NOT_MOUNT,
    depKeys: [],
    depSharedKeys: [],
    result: {},
    fnType: 'watch',
    isResultReaded: false,
    isResultReadedOnce: false,
    returnUpstreamResult: false,
    scopeType: 'static',
    renderStatus: RENDER_START,
    proxyResult: {},
    updater: noop,
    createTime: Date.now(),
    shouldReplaceResult: false,
    isAsync: false,
    isAsyncTransfer: false,
    asyncType: 'normal',
    subscribe: (cb) => {
      // console.log('call fnDep subscribe, snap changed', cb);
      cb();
    },
  };
  return Object.assign(base, specificProps || {});
}

export function mapFn(fn: Fn, options: { specificProps: Partial<IFnCtx> & { scopeType: ScopeType }; fnCtxBase?: IFnCtx }) {
  const { specificProps, fnCtxBase } = options;
  injectHeluxProto(fn);
  const { scopeType } = specificProps;
  const fnKey = markFnKey(fn, scopeType);
  const props = { fn, fnKey, ...specificProps };
  scope.currentRunningFnKey = fnKey;
  let fnCtx = buildFnCtx(props);
  if (fnCtxBase) {
    // 指向用户透传的 fnCtxBase
    fnCtx = Object.assign(fnCtxBase, props);
  }
  getCtxMap(scopeType).set(fnKey, fnCtx);
  return fnCtx;
}

export function delFn(fn: Fn) {
  const fnKey = getFnKey(fn);
  if (!fnKey) return;

  const fnCtx = getFnCtx(fnKey);
  fnCtx && delFnCtx(fnCtx);
}

export function delValKeyFnKeys(fnCtx: IFnCtx) {
  const { depKeys, fnKey } = fnCtx;
  depKeys.forEach((key) => {
    const fnKeys = VALKEY_FNKEYS_MAP.get(key) || [];
    const idx = fnKeys.indexOf(fnKey);
    if (idx >= 0) {
      fnKeys.splice(idx, 1);
    }
  });
}

export function delHistoryUnmoutFnCtx() {
  const { FNKEY_HOOK_CTX_MAP } = scope;
  if (FNKEY_HOOK_CTX_MAP.size >= SIZE_LIMIT) {
    console.error('trigger delelte');
    FNKEY_HOOK_CTX_MAP.forEach((fnCtx) => {
      const { mountStatus, createTime, fnKey } = fnCtx;
      if ([NOT_MOUNT, UNMOUNT].includes(mountStatus) && Date.now() - createTime > EXPIRE_MS) {
        delValKeyFnKeys(fnCtx);
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
        // deleting item in map.forEach is doable
        FNKEY_HOOK_CTX_MAP.delete(fnKey);
      }
    });
  }
}

export function delFnCtx(fnCtx: IFnCtx) {
  const { fnKey } = fnCtx;
  delValKeyFnKeys(fnCtx);
  FNKEY_HOOK_CTX_MAP.delete(fnKey);

  if (UNMOUNT_INFO_MAP.get(fnKey)?.c === 2) {
    UNMOUNT_INFO_MAP.delete(fnKey);
  }
  delHistoryUnmoutFnCtx();
}

export function getCtxMap(scopeKeyOrFnKey: string) {
  const map = scopeKeyOrFnKey[0] === 's' ? FNKEY_STATIC_CTX_MAP : FNKEY_HOOK_CTX_MAP;
  return map;
}

export function getFnCtx(fnKey: string) {
  const map = getCtxMap(fnKey);
  return map.get(fnKey);
}

export function getFnCtxByObj(obj: Dict) {
  const fnKey = getFnKey(obj);
  return getFnCtx(fnKey) || null;
}

export function delRunninFnKey() {
  scope.currentRunningFnKey = '';
}

export function getRunninFnCtx() {
  if (!scope.currentRunningFnKey) {
    return null;
  }
  return getFnCtx(scope.currentRunningFnKey);
}

/**
 * 自动记录当前正在运行的函数对 valKey 的依赖
 * 以及 valKey 对应的函数记录
 */
export function recordValKeyDep(
  prefixedValKey: string | string[],
  options?: { sharedKey?: number; specificCtx?: IFnCtx | null; belongCtx?: IFnCtx },
) {
  const { specificCtx, belongCtx, sharedKey } = options || {};

  const runningFnCtx = getRunninFnCtx();
  const fnCtx: IFnCtx | null | undefined = specificCtx || runningFnCtx;
  if (!fnCtx) {
    return;
  }

  if (sharedKey) {
    nodupPush(fnCtx.depSharedKeys, sharedKey);
  }

  if (runningFnCtx && belongCtx) {
    runningFnCtx.isFirstLevel = false;
    if (belongCtx.isAsync) {
      runningFnCtx.isAsync = true;
    }
    const fnKey = belongCtx.fnKey;
    nodupPush(fnCtx.prevLevelFnKeys, fnKey);
    nodupPush(belongCtx.nextLevelFnKeys, runningFnCtx.fnKey);
  }

  const doRecord = (valKey: string) => {
    if ([SHARED_KEY, PROTO_KEY].includes(valKey)) {
      return;
    }
    nodupPush(fnCtx.depKeys, valKey);
    const fnKeys = safeMapGet(VALKEY_FNKEYS_MAP, valKey, []);
    nodupPush(fnKeys, fnCtx.fnKey);
  };

  if (Array.isArray(prefixedValKey)) {
    prefixedValKey.forEach(doRecord);
  } else {
    doRecord(prefixedValKey);
  }
}

export function revertDep(fnCtx?: IFnCtx) {
  if (fnCtx) {
    fnCtx.depKeys.forEach((valKey: string) => recordValKeyDep(valKey, { specificCtx: fnCtx }));
  }
}

export function getDepFnStats(valKey: string, runCountStats: Dict<number>) {
  const fnKeys = VALKEY_FNKEYS_MAP.get(valKey) || [];
  const firstLevelFnKeys: string[] = [];
  const asyncFnKeys: string[] = [];

  fnKeys.forEach((fnKey) => {
    const fnCtx = getFnCtx(fnKey);
    if (!fnCtx) return;
    if (fnCtx.isFirstLevel) {
      firstLevelFnKeys.push(fnKey);
    }
    if (fnCtx.isAsync) {
      asyncFnKeys.push(fnKey);
    }
    const count = runCountStats[fnKey];
    runCountStats[fnKey] = count === undefined ? 1 : count + 1;
  });

  return { firstLevelFnKeys, asyncFnKeys };
}

export function markComputing(fnKey: string, runCount: number) {
  const fnCtx = getFnCtx(fnKey);
  if (fnCtx) {
    fnCtx.isComputing = true;
    fnCtx.remainRunCount += runCount;
    fnCtx.updater();
  }
}

export function runFn(fnKey: string, options?: { force?: boolean; isFirstCall?: boolean }) {
  const { isFirstCall = false } = options || {};
  const fnCtx = getFnCtx(fnKey);
  if (!fnCtx) {
    return;
  }
  if (fnCtx.remainRunCount > 0) {
    fnCtx.remainRunCount -= 1;
  }

  const { isAsync, fn, sourceFn, isAsyncTransfer, fnType } = fnCtx;
  const assignResult = (data: Dict) => {
    // 是计算函数
    if (fnType === 'computed') {
      // 非中转结果
      if (!fnCtx.returnUpstreamResult && data) {
        Object.assign(fnCtx.result, data);
      }
      // 需生成新的代理对象，让直接透传结果给 memo 组件的场景也能够正常工作，useComputed 会用到此属性
      fnCtx.shouldReplaceResult = true;
    }
  };
  const triggerUpdate = () => {
    // 开启读依赖功能时，实例读取了计算结果才执行更新
    if (fnCtx.enableRecordResultDep) {
      fnCtx.isResultReaded && fnCtx.updater();
    } else {
      // 未开启读依赖功能时，实例曾读取过计算结果就执行更新
      fnCtx.isResultReadedOnce && fnCtx.updater();
    }
  };
  /** 下钻执行其他函数 */
  const updateAndDrillDown = (data?: any) => {
    assignResult(data);
    if (fnCtx.remainRunCount === 0) {
      fnCtx.isComputing = false;
    }
    triggerUpdate();
    fnCtx.nextLevelFnKeys.forEach((key) => runFn(key));
  };

  const cuParams = { isFirstCall: false, prevResult: fnCtx.result };
  if (isAsync) {
    if (isAsyncTransfer) {
      updateAndDrillDown();
    } else {
      // TODO: allow user configure global err handler for async compupted
      if (fnCtx.asyncType === 'source') {
        fn({ isFirstCall, source: sourceFn(cuParams).source }).then((data: any) => {
          updateAndDrillDown(data);
        });
      } else if (fnCtx.asyncType === 'task') {
        fn({ isFirstCall })
          .task(cuParams)
          .then((data: any) => {
            updateAndDrillDown(data);
          });
      } else {
        const result = fn(cuParams);
        updateAndDrillDown(result);
      }
    }
  } else {
    const result = fn(cuParams);
    updateAndDrillDown(result);
  }
}

export function runComputed<T extends Dict = Dict>(result: T) {
  const fnCtx = getFnCtxByObj(result);
  if (!fnCtx) {
    throw new Error('[Helux]: not a computed result');
  }
  runFn(fnCtx.fnKey);
}

export function recoverDep(fnCtx: IFnCtx) {
  const { fnKey } = fnCtx;
  FNKEY_HOOK_CTX_MAP.set(fnKey, fnCtx);

  let info = UNMOUNT_INFO_MAP.get(fnKey);
  if (info) {
    info.c = 2;
  } else {
    info = { c: 1, t: Date.now(), prev: 0 };
    UNMOUNT_INFO_MAP.set(fnKey, info);
  }

  const { c: mountCount } = info;
  if (mountCount === 2) {
    // 因为双调用导致第二次 mount，需把前一刻已触发了 unmount 行为导致的依赖丢失还原回来
    const fnCtx = getFnCtx(fnKey);
    fnCtx && revertDep(fnCtx);
  }
}

export function getDepSharedStateFeature(fn: IFnCtx) {
  let feature = '';
  fn.depSharedKeys.forEach((key) => {
    const ver = getInternalByKey(key)?.ver || 0;
    feature += `${ver}_`;
  });
  return feature;
}
