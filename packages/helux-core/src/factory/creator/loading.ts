import { isSymbol, noop, noopArr } from '@helux/utils';
import { EVENT_NAME, FROM, HELUX_GLOBAL_LOADING, RECORD_LOADING, STATE_TYPE } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { createOb } from '../../helpers/obj';
import { getInternal } from '../../helpers/state';
import { useAtomLogic } from '../../hooks/common/useAtomLogic';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Dict, Fn, From, IRenderInfo, LoadingState, LoadingStatus } from '../../types/base';
import { checkSharedStrict } from '../common/check';
import { isDict } from '../common/util';
import { getRootCtx } from '../root';
import type { TInternal } from './buildInternal';
import { getGlobalEmpty } from './globalId';

const { MUTATE, LOADING } = FROM;
const { GLOGAL_LOADING, PRIVATE_LOADING } = STATE_TYPE;
const { PRIVATE, GLOBAL } = RECORD_LOADING;
const fakeExtra: Dict = {};
const fakeLoading: Dict = {};
const fakeRenderInfo: IRenderInfo = { time: 0, sn: 0, getDeps: noopArr, getPrevDeps: noopArr, insKey: 0, setDraft: noop, isAtom: false };
const fakeTuple = [createSafeLoading(fakeExtra, fakeLoading, MUTATE), noop, fakeRenderInfo];

interface IInitLoadingCtxOpt {
  internal: TInternal;
  from: From;
  apiCtx: CoreApiCtx;
}

/**
 * 为 shared 或 atom 创建独立的伴生 loading 状态
 * 通过分析 mutateFnDict 对象，为宿主对象创建一个伴生对象，专注于存储各种 desc 调用对应的 loading 状态
 */
function createLoading(createFn: Fn, options: IInitLoadingCtxOpt) {
  const { internal, apiCtx } = options; // now internal is leaderInternal
  const { mutateFnDict, moduleName } = internal;
  const rawLoading: LoadingState = {};
  Object.keys(mutateFnDict).forEach((desc: string) => {
    rawLoading[desc] = { loading: false, err: null, ok: true };
  });
  const name = moduleName ? `${moduleName}@Loading` : '';
  const loadingCtx = createFn({ apiCtx, rawState: rawLoading, isLoading: true, stateType: PRIVATE_LOADING }, { moduleName: name });
  return loadingCtx.state;
}

// will init after calling ensureGlobal at createShared
let GLOBAL_LOADING: any = null;

export function getGlobalLoading() {
  return GLOBAL_LOADING;
}

export function getGlobalLoadingInternal() {
  return getRootCtx().globalLoadingInternal;
}

export function initGlobalLoading(apiCtx: CoreApiCtx, createFn: Fn) {
  const ctx = getRootCtx();
  let shared = ctx.globalLoading;
  if (!shared) {
    const { stateRoot } = createFn({ apiCtx, rawState: {}, stateType: GLOGAL_LOADING }, { moduleName: HELUX_GLOBAL_LOADING });
    const internal = getInternal(stateRoot);
    ctx.globalLoadingInternal = internal;
    ctx.globalLoading = stateRoot;
  }
  GLOBAL_LOADING = shared;
  return shared;
}

export function getStatusKey(from: string, desc: string) {
  let descStr = desc;
  if (isSymbol(desc)) {
    // @ts-ignore
    descStr = desc.toString();
  }
  // 基于 > 分割 ，否则 getDepKeyInfo 还原 key 错误，导致 block 里无法正确补上相关 loading 的依赖
  return `${from}>${descStr}`;
}

export function setLoadStatus(internal: TInternal, statusKey: string, status: LoadingStatus) {
  if (!statusKey) return;
  const { loadingInternal } = internal;
  loadingInternal.innerSetState(
    (draft: any) => {
      draft[statusKey] = status;
    },
    { from: LOADING },
  );
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
export function createSafeLoading(extra: Dict, loadingObj: any, from: From) {
  let safeLoading = extra[from];
  if (!safeLoading) {
    // 各种 from 场景对应的 safeLoading 最多只创建一次
    safeLoading = createOb(loadingObj, {
      get(target, key) {
        // 通过 from 避免 mutate 和 action 重复key，同时也方便 devtool 知道调用来源
        const realKey = getStatusKey(from, key);
        return target[realKey] || { loading: false, ok: true, err: null };
      },
    });
    extra[from] = safeLoading;
  }
  return safeLoading;
}

export function getLoadingInfo(createFn: Fn, options: IInitLoadingCtxOpt) {
  const { internal, from } = options;
  const { stateType, recordLoading } = internal;
  const isUserState = STATE_TYPE.USER_STATE === stateType;

  // 可供用户在组件外部安全读状态的 loading 对象
  let loadingState: any = createSafeLoading(fakeExtra, {}, from);
  // 供钩子函数使用的代理对象
  let loadingProxy = {};
  // 仅用户自己创建的状态才需要创建伴生的 loading 对象
  if (isUserState) {
    if (PRIVATE === recordLoading) {
      loadingProxy = internal.extra.loadingProxy;
      if (!loadingProxy) {
        loadingProxy = createLoading(createFn, options);
        internal.extra.loadingProxy = loadingProxy;
        // 向宿主上挂上私有的 loadingInternal 实现
        internal.loadingInternal = getInternal(loadingProxy);
      }
      loadingState = createSafeLoading(internal.extra, loadingProxy, from);
    } else if (GLOBAL === recordLoading) {
      const globalLoadingInternal = getGlobalLoadingInternal();
      loadingProxy = getGlobalLoading();
      // 向宿主上挂上全局的 globalLoadingInternal 实现
      internal.loadingInternal = globalLoadingInternal;
      loadingState = createSafeLoading(globalLoadingInternal.extra, loadingProxy, from);
    } else {
      // 设置 recordLoading='no' 时，loadingProxy 指向空代理对象，
      // 避免 useLoading 报错 not a shared object
      loadingProxy = getGlobalEmpty();
    }
  } else {
    // 此刻的 internal 即 globalLoadingInternal
    loadingProxy = internal.sharedState;
    loadingState = createSafeLoading(internal.extra, loadingProxy, from);
  }

  // loadingState 给用户使用的读安全对象，loadingProxy 给 hook 使用的对象
  return { loadingState, loadingProxy };
}

/**
 * 未指定 actions 或 mutate 时，使用的自身对应的 action 和 mutate loading
 */
function getLoadingOpts(options: IInitLoadingCtxOpt, actionsOrMutate?: Dict) {
  if (!isDict(actionsOrMutate)) {
    return options;
  }
  const keys = Object.keys(actionsOrMutate);
  if (!keys.length) {
    return options;
  }
  const oneItem = actionsOrMutate[keys[0]];
  if (!oneItem.__sharedKey) {
    return options;
  }
  return {
    ...options,
    internal: checkSharedStrict(oneItem.__sharedKey),
  };
}

/**
 * 初始化伴生的 loading 上下文
 */
export function initLoadingCtx(createFn: Fn, options: IInitLoadingCtxOpt) {
  const { internal: leaderInternal, from, apiCtx } = options;
  const { stateType } = leaderInternal;
  const isUserState = STATE_TYPE.USER_STATE === stateType;
  // 提前为共享状态自身生成 loadingInternal
  getLoadingInfo(createFn, options);

  let useLoading = () => fakeTuple;
  // 当前状态是用户状态
  if (isUserState) {
    useLoading = (actionsOrMutate?: Dict) => {
      const targetOptions = getLoadingOpts(options, actionsOrMutate);
      const loadingProxy = getLoadingInfo(createFn, targetOptions).loadingProxy;
      const {
        insCtx: { proxyState, internal, extra, renderInfo },
      } = useAtomLogic(apiCtx, loadingProxy);
      const statusDict = createSafeLoading(extra, proxyState, from);
      // 注意此处用实例的 extra 记录 safeLoading，实例存在期间 safeLoading 创建一次后会被后续一直复用
      return [statusDict, internal.setState, renderInfo];
    };
  }

  return {
    useLoading,
    getLoading: (actionsOrMutate?: Dict) => {
      const targetOptions = getLoadingOpts(options, actionsOrMutate);
      // 返回读安全的 loading 对象给用户
      return getLoadingInfo(createFn, targetOptions).loadingState;
    },
  };
}
