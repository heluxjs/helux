import { nodupPush, safeMapGet } from '@helux/utils';
import { DERIVE, EXPIRE_MS, NOT_MOUNT, PROTO_KEY, RUN_AT_SERVER, SIZE_LIMIT, UNMOUNT } from '../consts';
import { delFnDepData, getFnCtx, getRunningFn, opUpstreamFnKey } from '../factory/common/fnScope';
import { hasChangedNode } from '../factory/common/sharedScope';
import { getFnScope } from '../factory/common/speedup';
import type { TInternal } from '../factory/creator/buildInternal';
import { DEPS_CB } from '../factory/creator/current';
import type { Dict, IFnCtx } from '../types/base';
import { getInternalByKey } from './state';

export function markIgnore(isIgnore = true) {
  const fnScope = getFnScope();
  fnScope.isIgnore = isIgnore;
}

/**
 * 自动记录当前正在运行的函数对 depKey 的依赖，以及 depKey 对应的函数记录
 */
export function recordFnDepKeys(
  inputDepKeys: string[],
  options: { sharedKey?: number; specificCtx?: IFnCtx | null; belongCtx?: IFnCtx; kv?: Dict },
) {
  const { fnCtx: runningFnCtx, depKeys, fixedDepKeys, isIgnore } = getRunningFn();
  const fnCtx: IFnCtx | null | undefined = options.specificCtx || runningFnCtx;
  if (!fnCtx) {
    // 来自 useGlobalForceUpdate 的 deps 收集
    DEPS_CB.current()(inputDepKeys);
    return;
  }
  const { fnKey, scopeType } = fnCtx;
  // 服务端运行的话，不记录任何 hook 实例对应的相关映射关系，避免不必要的服务端内存开销
  if (RUN_AT_SERVER && scopeType === 'hook') {
    return;
  }

  const { DEPKEY_FNKEYS_MAP, SKEY_FNKEYS_MAP } = getFnScope();
  const { belongCtx, sharedKey, kv = {} } = options;

  if (sharedKey) {
    nodupPush(fnCtx.depSharedKeys, sharedKey);
  }

  if (runningFnCtx && belongCtx) {
    runningFnCtx.isFirstLevel = false;
    if (belongCtx.isAsync) {
      runningFnCtx.isAsync = true; // 传递异步标记，只要使用了异步结果，当前函数也标记为异步
    }
    const fnKey = belongCtx.fnKey;
    // 映射好上下游函数之间的关系
    nodupPush(fnCtx.prevLevelFnKeys, fnKey);
    nodupPush(belongCtx.nextLevelFnKeys, runningFnCtx.fnKey);
  }

  inputDepKeys.forEach((depKey: string) => {
    if (PROTO_KEY === depKey || isIgnore) {
      return;
    }
    // 注意此处暂不记录到 fnCtx.depKeys 里，而是记录到 fnScope.depKeys 里
    // 等到 markFnEnd 时再按最长路径提取出所有 depKeys 转移到 fnCtx.depKeys 里
    if (runningFnCtx) {
      nodupPush(depKeys, depKey); // here depKeys is come from fnScope
      // fix https://github.com/heluxjs/helux/issues/172, block 组件读取的数组 key 要固定住
      if (runningFnCtx.forBlock) {
        const val = kv[depKey];
        if (Array.isArray(val)) {
          nodupPush(fixedDepKeys, depKey); // here fixedDepKeys is come from fnScope
        }
      }
    }

    const fnKeys = safeMapGet(DEPKEY_FNKEYS_MAP, depKey, []);
    nodupPush(fnKeys, fnKey);
    const [sKey] = depKey.split('/');
    const fnKeysOfSkey = safeMapGet(SKEY_FNKEYS_MAP, sKey, []);
    nodupPush(fnKeysOfSkey, fnKey);
  });
}

export function ensureFnDepData(fnCtx?: IFnCtx) {
  if (fnCtx) {
    fnCtx.depKeys.forEach((depKey: string) => recordFnDepKeys([depKey], { specificCtx: fnCtx }));
  }
}

/** TODO 后续接入内置 useEffect 后，这里可考虑移除 */
export function recoverDep(fnCtx: IFnCtx) {
  const { FNKEY_HOOK_CTX_MAP, UNMOUNT_INFO_MAP } = getFnScope();
  if (RUN_AT_SERVER) return;

  const { fnKey } = fnCtx;
  FNKEY_HOOK_CTX_MAP.set(fnKey, fnCtx);
  opUpstreamFnKey(fnCtx, true);

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
    ensureFnDepData(fnCtx);
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

/**
 * 获得依赖的第一层函数、异步函数
 */
export function getDepFnStats(internal: TInternal, depKey: string, runCountStats: Dict<number>, isSharedKey = false) {
  const { DEPKEY_FNKEYS_MAP, SKEY_FNKEYS_MAP } = getFnScope();
  const map = isSharedKey ? SKEY_FNKEYS_MAP : DEPKEY_FNKEYS_MAP;
  const fnKeys = map.get(depKey) || [];
  const firstLevelFnKeys: string[] = [];
  const asyncFnKeys: string[] = [];
  const { disableProxy } = internal;

  fnKeys.forEach((fnKey) => {
    const fnCtx = getFnCtx(fnKey);
    if (!fnCtx) return;
    // 子串对应值变化时、或禁用代理时，将其加入到 firstLevelFnKeys
    if (hasChangedNode(internal, fnCtx.depKeys, depKey) || disableProxy) {
      if (fnCtx.isFirstLevel) {
        firstLevelFnKeys.push(fnKey);
      }
      if (fnCtx.isAsync && fnCtx.fnType === DERIVE) {
        asyncFnKeys.push(fnKey);
      }

      const count = runCountStats[fnKey]; // 每个函数将要运行的次数统计
      if (count === undefined) {
        runCountStats[fnKey] = 1;
      } else if (!isSharedKey) {
        runCountStats[fnKey] = count + 1;
      }
    }
  });

  return { firstLevelFnKeys, asyncFnKeys };
}

export function delFnDep(fnCtx: IFnCtx) {
  delFnDepData(fnCtx);
  opUpstreamFnKey(fnCtx);
}

export function delHistoryUnmoutFnCtx() {
  const { FNKEY_HOOK_CTX_MAP } = getFnScope();
  // works for strict mode
  if (FNKEY_HOOK_CTX_MAP.size >= SIZE_LIMIT) {
    const now = Date.now();
    FNKEY_HOOK_CTX_MAP.forEach((fnCtx) => {
      const { mountStatus, createTime, fnKey } = fnCtx;
      if ([NOT_MOUNT, UNMOUNT].includes(mountStatus) && now - createTime > EXPIRE_MS) {
        delFnDep(fnCtx);
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
        // deleting item in map.forEach is doable
        FNKEY_HOOK_CTX_MAP.delete(fnKey);
      }
    });
  }
}
