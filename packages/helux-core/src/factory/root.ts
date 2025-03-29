import { asType, safeObjGet } from '@helux/utils';
import { VER as LIMU_VER } from 'limu';
import { VER } from '../consts';
import type {
  Dict,
  Fn,
  IBlockCtx,
  IFnCtx,
  IInitOptions,
  IPlugin,
  IUnmountInfo,
  LoadingState,
  Middleware,
  NumStrSymbol,
} from '../types/base';
import type { TInternal } from './creator/buildInternal';

function buildFnScope() {
  return {
    keySeed: {
      static: 0,
      hook: 0,
      Reactive: 0,
      Mutate: 0,
    },
    runningFnKey: '',
    /**
     * 从 sharedKey 维度辅助 helpers/fnDep 丢弃一些异步逻辑中收集的依赖信息
     */
    runningSharedKey: 0,
    /**
     * 忽略依赖收集，辅助 helpers/fnDep mutateFn/callAsyncMutateFnLogic 里丢弃一些异步逻辑中收集的依赖信息
     * helux强制用户必须把依赖放置于同步逻辑中
     */
    isIgnore: false,
    /** 函数运行结束收集到的读依赖 depKeys */
    depKeys: [] as string[],
    /** 函数运行结束后，会做一次依赖精简逻辑，只保留最长路径依赖，若依赖在 fixedDepKeys 里则不会被精简掉 */
    fixedDepKeys: [] as string[],
    /**
     * del path array of array
     * 需要移除的 depKeys，解决 mutate 回调里 draft 里深层次读取修改的依赖收集不正确问题
     * ```
     * // 这里 get 收集到了 a，这个 a 需要移除，否则会造成死循环依赖误判
     * draft.a.val = state.someKey + 1;
     * ```
     */
    delPathAoa: [] as string[][],
    /** globalId to Array<insKey> */
    GID_INSKEYS_MAP: new Map<NumStrSymbol, number[]>(),
    FNKEY_STATIC_CTX_MAP: new Map<string, IFnCtx>(),
    FNKEY_HOOK_CTX_MAP: new Map<string, IFnCtx>(),
    DEPKEY_FNKEYS_MAP: new Map<string, string[]>(),
    /** sharedKeyStr to fnKeys */
    SKEY_FNKEYS_MAP: new Map<string, string[]>(),
    UNMOUNT_INFO_MAP: new Map<string, IUnmountInfo>(),
    /** 记录第一次运行的各个函数，辅助推导出计算状态 */
    DEPKEY_COMPUTING_FNKEYS_MAP: new Map<string, string[]>(),
  };
}

function buildBlockScope() {
  return {
    keySeed: 0, // for block key
    keyPrefix: 0,
    initCount: 0,
    mountedCount: 0,
    latest: {
      val: null,
      stateOrResult: null,
      sharedKey: 0,
      depKey: '',
      keyPath: [] as string[],
      isDerivedResult: false,
      isDerivedAtom: false,
    },
    runningKey: '',
    isDynamic: false,
    /** blockKey to IBlockCtx */
    KEY_CTX_MAP: new Map<string, IBlockCtx>(),
    KEY_DYNAMIC_CTX_MAP: new Map<string, IBlockCtx>(),
  };
}

function buildInsScope() {
  return {
    keySeed: 0, // for insKey
    UNMOUNT_INFO_MAP: new Map<number, IUnmountInfo>(),
  };
}

function buildSharedScope() {
  return {
    keySeed: 0, // for sharedKey
    SHARED_KEY_STATE_MAP: new Map<number, Dict>(),
    /** rawState to sharedKey */
    STATE_SHARED_KEY_MAP: new Map<any, number>(),
    /** sharedKey to internal */
    INTERMAL_MAP: new Map<number, TInternal>(),
    /** cache value compare result */
    COMPARE_MAP: new Map<string, boolean>(),
    isStateChanged: false,
  };
}

function buildEventBus() {
  const name2cbs: Dict<Fn[]> = {};
  return {
    on: (name: string, cb: Fn) => {
      const cbs = safeObjGet(name2cbs, name, [] as Fn[]);
      cbs.push(cb);
    },
    emit: (name: string, ...args: any[]) => {
      const cbs = name2cbs[name] || [];
      cbs.slice().forEach((cb) => cb(...args));
    },
    off: (name: string, cb: Fn) => {
      const cbs = name2cbs[name] || [];
      const idx = cbs.findIndex((item) => item === cb);
      if (idx >= 0) cbs.splice(idx, 1);
    },
    /** for perf */
    canEmit: (name: string) => name2cbs[name],
  };
}

export function createRoot() {
  const root = {
    VER,
    LIMU_VER,
    rootState: {} as Dict,
    setState: (moduleName: string, partialState: Dict) => {
      const modInternal = root.ctx.modMap.get(moduleName);
      if (!modInternal) {
        throw new Error(`moduleName ${moduleName} not found`);
      }
      modInternal.setState(partialState);
    },
    ctx: {
      bus: buildEventBus(),
      userBus: buildEventBus(),
      mod: {} as Dict, // 与模块相关的辅助信息（4.7.0 之后使用 modMap 替代，后期会删除此属性）
      modMap: new Map<any, TInternal>(), // 替代 mod
      middlewares: [] as Middleware[],
      plugins: [] as IPlugin[],
      sharedScope: buildSharedScope(),
      fnScope: buildFnScope(),
      insScope: buildInsScope(),
      blockScope: buildBlockScope(),
      markAtomMap: new Map<any, boolean>(), // 不支持 symbol 的环境才会记录此map
      renderSN: 0, // 触发setState批次序列号的种子数
      globalLoading: asType<LoadingState>(null), // works for top api useLoading
      globalLoadingInternal: asType<TInternal>(null), // works for top api useLoading
      globalEmpty: asType<Dict>(null), // works for top api useGlobalId
      globalEmptyInternal: asType<TInternal>(null), // works for top api useGlobalId
      isRootRender: true,
    },
    legacyRoot: {},
  };
  return root;
}
export type HeluxRoot = ReturnType<typeof createRoot>;
export type RootCtx = HeluxRoot['ctx'];

/** will inited by calling initHeluxContext later  */
let ROOT = asType<HeluxRoot>({});
let inited = false;
let API = asType<any>(null);
let optionsInited = false;

export function getRootCtx() {
  return ROOT.ctx || asType<HeluxRoot['ctx']>({});
}

export function getRoot() {
  return ROOT;
}

export function setRootData(options: Dict) {
  ROOT = options.ROOT;
  API = options.api;
  inited = options.inited;
}

export function getRootData() {
  return { ROOT, inited, API };
}

export function init(options: IInitOptions) {
  if (optionsInited) {
    return false;
  }
  optionsInited = true;
  const { isRootRender = true } = options;
  getRootCtx().isRootRender = isRootRender;
  return true;
}
