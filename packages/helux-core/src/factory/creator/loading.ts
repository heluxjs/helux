import { EVENT_NAME, FROM, HELUX_GLOBAL_LOADING, LOADING_MODE, STATE_TYPE } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { createOb } from '../../helpers/obj';
import { getInternal } from '../../helpers/state';
import { useSharedLogic } from '../../hooks/common/useSharedLogic';
import type { Dict, Fn, From, IRenderInfo, LoadingState, LoadingStatus } from '../../types';
import { noop } from '../../utils';
import { getRootCtx } from '../root';
import type { TInternal } from './buildInternal';

const { MUTATE } = FROM;
const { GLOGAL_LOADING, PRIVATE_LOADING } = STATE_TYPE;
const { PRIVATE, GLOBAL, NONE } = LOADING_MODE;
const fakeExtra: Dict = {};
const fakeLoading: Dict = {};
const fakeRenderInfo: IRenderInfo = { sn: 0, getDeps: noop };
const fakeTuple = [createSafeLoading(fakeExtra, fakeLoading, MUTATE), noop, fakeRenderInfo];

// will init after calling ensureGlobal at createShared
let GLOBAL_LOADING: any = null;

export function getGlobalLoading() {
  return GLOBAL_LOADING;
}

export function getGlobalLoadingInternal() {
  return getRootCtx().globalLoadingInternal;
}

export function initGlobalLoading(createFn: Fn) {
  const ctx = getRootCtx();
  let shared = ctx.globalLoading;
  if (!shared) {
    const { state } = createFn({ rawState: {}, stateType: GLOGAL_LOADING }, { moduleName: HELUX_GLOBAL_LOADING });
    const internal = getInternal(state);
    ctx.globalLoadingInternal = internal;
    ctx.globalLoading = state;
  }
  GLOBAL_LOADING = shared;
  return shared;
}

/**
 * 为 shared 或 atom 创建独立的伴生 loading 状态
 * 通过分析 mutateFnDict 对象，为宿主对象创建一个伴生对象，专注于存储各种 desc 调用对应的 loading 状态
 */
export function createLoading(createFn: Fn, leaderInternal: TInternal) {
  const { mutateFnDict, moduleName } = leaderInternal;
  const rawLoading: LoadingState = {};
  Object.keys(mutateFnDict).forEach((desc: string) => {
    rawLoading[desc] = { loading: false, err: null, ok: true };
  });
  const name = moduleName ? `${moduleName}@Loading` : '';
  const loadingCtx = createFn({ rawState: rawLoading, isLoading: true, stateType: PRIVATE_LOADING }, { moduleName: name });
  return loadingCtx.state;
}

export function setLoadStatus(internal: TInternal, statusKey: string, status: LoadingStatus) {
  if (!statusKey) return;
  const { loadingInternal } = internal;
  loadingInternal.setState((draft: any) => {
    draft[statusKey] = status;
  });
  if (status.err) {
    emitPluginEvent(internal, EVENT_NAME.ON_ERROR_OCCURED, { err: status.err });
    console.error(status.err);
  }
}

/**
 * 因 loading 的特殊性（类型里标记了 Ext 扩展），支持用户按字符串查询 loading 并确保不出错，
 * 创建一个 loading 代理对象，如获取不到真实的数据，则返回一个假的，
 * 确保让 loading 的任意获取都是安全的，不会出现 undefined
 */
export function createSafeLoading(extra: Dict, loading: any, from: From) {
  let safeLoading = extra[from];
  if (!safeLoading) {
    // 各种 from 场景对应的 safeLoading 最多只创建一次
    safeLoading = createOb(loading, {
      get(target, key) {
        const realKey = `${from}/${key}`;
        return target[realKey] || { loading: false, ok: true, err: null };
      },
    });
    extra[from] = safeLoading;
  }
  return safeLoading;
}

export function getLoadingInfo(createFn: Fn, internal: TInternal, from: From = MUTATE) {
  const { stateType, loadingMode } = internal;
  const isUserState = STATE_TYPE.USER_STATE === stateType;

  // 可供用户在组件外部安全读状态的 loading 对象
  let loadingState: any = createSafeLoading(fakeExtra, {}, from);
  // 供钩子函数使用的代理对象
  let loadingProxy = {};
  // 仅用户自己创建的状态才需要创建伴生的 loading 对象
  if (isUserState) {
    if (PRIVATE === loadingMode) {
      loadingProxy = internal.extra.loadingProxy;
      if (!loadingProxy) {
        loadingProxy = createLoading(createFn, internal);
        internal.extra.loadingProxy = loadingProxy;
        // 向宿主上写入私有的 loadingInternal 实现
        internal.loadingInternal = getInternal(loadingProxy);
      }
      loadingState = createSafeLoading(internal.extra, loadingProxy, from);
    } else if (GLOBAL === loadingMode) {
      const globalLoadingInternal = getGlobalLoadingInternal();
      loadingProxy = getGlobalLoading();
      // 向宿主上挂上全局的 globalLoadingInternal 实现
      internal.loadingInternal = globalLoadingInternal;
      loadingState = createSafeLoading(globalLoadingInternal.extra, loadingProxy, from);
    }
  }
  return { loadingState, loadingProxy };
}

/**
 * 初始化伴生的 loading 上下文
 */
export function initLoadingCtx(createFn: Fn, leaderInternal: TInternal, from: From) {
  const { stateType, loadingMode } = leaderInternal;
  const isUserState = STATE_TYPE.USER_STATE === stateType;

  let useLoading = () => fakeTuple;
  // 当前状态是用户状态，且未禁用伴生loading
  if (isUserState && NONE !== loadingMode) {
    useLoading = () => {
      const loadingProxy = getLoadingInfo(createFn, leaderInternal, from).loadingProxy;
      const { proxyState, internal, extra, renderInfo } = useSharedLogic(loadingProxy);
      // 注意此处用实例的 extra 记录 safeLoading，实例存在期间 safeLoading 创建一次后会被后续一直复用
      return [createSafeLoading(extra, proxyState, from), internal.setState, renderInfo];
    };
  }

  return {
    useLoading,
    getLoading: () => getLoadingInfo(createFn, leaderInternal, from).loadingState,
  };
}
