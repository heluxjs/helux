import { ASYNC_TYPE, NOT_MOUNT, RENDER_START } from '../consts';
import { delHistoryUnmoutFnCtx, getCtxMap, getFnCtx, getFnKey, markFnKey } from '../factory/common/fnScope';
import { getFnScope } from '../factory/common/speedup';
import type { Fn, IFnCtx, ScopeType } from '../types';
import { noop, noopArr, includeOne } from '../utils';
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
    showProcess: false,
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
      base.status.loading = loading;
      base.status.err = err;
      base.status.ok = !loading && !err;
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
  fnScope.runningFnKey = '';
  fnScope.runningSharedState = null;
}

export function markFnStart(fnKey: string, sharedState?: any) {
  const fnScope = getFnScope();
  fnScope.runningFnKey = fnKey;
  fnScope.runningSharedState = sharedState;
}

export function registerFn(fn: Fn, options: { specificProps: Partial<IFnCtx> & { scopeType: ScopeType }; fnCtxBase?: IFnCtx }) {
  const { specificProps, fnCtxBase } = options;
  const { scopeType } = specificProps;
  const fnKey = markFnKey(fn, scopeType);
  const props = { fn, fnKey, ...specificProps };
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

export function delFnCtx(fnCtx: IFnCtx) {
  const { FNKEY_HOOK_CTX_MAP, UNMOUNT_INFO_MAP } = getFnScope();
  const { fnKey } = fnCtx;
  delFnDepData(fnCtx);
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
