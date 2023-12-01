import { includeOne, matchDictKey, nodupPush, noop, noopArr } from '@helux/utils';
import { ASYNC_TYPE, NOT_MOUNT, RENDER_START } from '../consts';
import { delHistoryUnmoutFnCtx, getCtxMap, getFnCtx, getFnKey, markFnKey, opUpstreamFnKey } from '../factory/common/fnScope';
import { getFnScope } from '../factory/common/speedup';
import type { Dict, Fn, IFnCtx, ScopeType } from '../types/base';
import { delFnDepData } from './fnDep';

const { MAY_TRANSFER } = ASYNC_TYPE;

export function buildFnCtx(specificProps?: Partial<IFnCtx>): IFnCtx {
  const base: IFnCtx = {
    fnKey: '', // 在 feDep.mapFn 阶段会生成
    fn: noop,
    isFirstLevel: true,
    isExpired: false,
    task: noop,
    deps: noopArr,
    status: { loading: false, err: null, ok: true },
    forAtom: false,
    remainRunCount: 0,
    showLoading: false,
    nextLevelFnKeys: [],
    prevLevelFnKeys: [],
    mountStatus: NOT_MOUNT,
    depKeys: [],
    depSharedKeys: [],
    result: {},
    fnType: 'watch',
    returnUpstreamResult: false,
    scopeType: 'static',
    renderStatus: RENDER_START,
    proxyResult: {},
    updater: noop,
    createTime: Date.now(),
    shouldReplaceResult: false,
    isAsync: false,
    isAsyncTransfer: false,
    asyncType: MAY_TRANSFER,
    subscribe: (cb) => {
      cb();
    },
    extra: {},
    setLoading: (loading: boolean, err = null) => {
      const ok = !loading && !err;
      base.status = { loading, err, ok };
    },
    renderInfo: {
      sn: 0,
      getDeps: () => base.depKeys.slice(),
    },
  };
  return Object.assign(base, specificProps || {});
}

export function markFnEnd() {
  const fnScope = getFnScope();
  const { runningFnKey } = fnScope;
  if (!runningFnKey) return;

  // 针对 derive watch 函数，fnCtx.depKeys 只记录最长路径
  const fnCtx = getFnCtx(runningFnKey);
  if (fnCtx) {
    const { depKeys: afterRunDepKeys } = fnScope;
    const { depKeys } = fnCtx;
    const dict: Dict<number> = {};
    afterRunDepKeys.forEach((k) => (dict[k] = 1));
    afterRunDepKeys.forEach((depKey) => {
      const matched = matchDictKey(dict, depKey);
      // 匹配到的子串不是 depKey 自身，就丢弃该子串
      // 随着子串不停地被丢弃，最长路径的多个 depKey 就保留下来了
      if (matched && matched !== depKey) {
        delete dict[matched];
      }
    });
    const validDepKeys = Object.keys(dict);
    validDepKeys.forEach((depKey) => nodupPush(depKeys, depKey));
  }

  fnScope.runningFnKey = '';
  fnScope.depKeys = [];
  fnScope.isTaskRunning = false;
  fnScope.runningSharedKey = 0;
}

export function markFnStart(fnKey: string, sharedKey: number) {
  const fnScope = getFnScope();
  fnScope.runningFnKey = fnKey;
  fnScope.runningSharedKey = sharedKey;
  /** 待到 task 运行时会被标记为 true */
  fnScope.isTaskRunning = false;
  fnScope.isIgnore = false;
}

export function registerFn(fn: Fn, options: { specificProps: Partial<IFnCtx> & { scopeType: ScopeType }; fnCtxBase?: IFnCtx }) {
  const { specificProps, fnCtxBase } = options;
  const { scopeType } = specificProps;
  const fnKey = markFnKey(fn, scopeType);
  const props = { fn, fnKey, ...specificProps };
  // 如 fnCtxBase 存在则 fnCtx 指向用户透传的 fnCtxBase
  const fnCtx = fnCtxBase ? Object.assign(fnCtxBase, props) : buildFnCtx(props);
  getCtxMap(scopeType).set(fnKey, fnCtx);
  return fnCtx;
}

export function delFn(fn: Fn) {
  const fnKey = getFnKey(fn);
  if (!fnKey) return;

  const fnCtx = getFnCtx(fnKey);
  fnCtx && delFnCtx(fnCtx);
}

export function delFnCtx(fnCtx: IFnCtx) {
  const { FNKEY_HOOK_CTX_MAP, UNMOUNT_INFO_MAP } = getFnScope();
  const { fnKey } = fnCtx;
  delFnDepData(fnCtx);
  opUpstreamFnKey(fnCtx);
  // 删除延迟的 watch 函数，严格模式下的下一次挂载无需再执行此函数
  fnCtx.extra.deferedWatch = null;
  // 删除当前fnKey 与 hookFnCtx 的映射关系
  FNKEY_HOOK_CTX_MAP.delete(fnKey);

  if (UNMOUNT_INFO_MAP.get(fnKey)?.c === 2) {
    UNMOUNT_INFO_MAP.delete(fnKey);
  }
  delHistoryUnmoutFnCtx();
}

export function shouldShowComputing(fnCtx: IFnCtx) {
  const { DEPKEY_COMPUTING_FNKEYS_MAP } = getFnScope();
  const { prevLevelFnKeys, depKeys } = fnCtx;
  let ret = false;
  for (const depKey of depKeys) {
    const fnKeys = DEPKEY_COMPUTING_FNKEYS_MAP.get(depKey) || [];
    // 正在计算的函数中有，包含有 prevLevelFnKeys 任意一项，需要显示计算中
    if (includeOne(fnKeys, prevLevelFnKeys)) {
      ret = true;
      break;
    }
  }
  return ret;
}
