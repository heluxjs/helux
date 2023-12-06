import { asType, safeObjGet } from '@helux/utils';
import { VER as LIMU_VER } from 'limu';
import { VER } from '../consts';
import type { Dict, Fn, IBlockCtx, IFnCtx, IPlugin, IUnmountInfo, LoadingState, Middleware, NumStrSymbol } from '../types/base';
import type { TInternal } from './creator/buildInternal';

function buildFnScope() {
  return {
    keySeed: {
      static: 0,
      hook: 0,
      InnerMutate: 0,
      Mutate: 0,
    },
    runningFnKey: '',
    /**
     * 从 sharedKey 维度辅助 helpers/fnDep 丢弃一些异步逻辑中收集的依赖信息
     */
    runningSharedKey: 0,
    /**
     * 从 isTaskRunning 维度辅助 helpers/fnDep 丢弃一些异步逻辑中收集的依赖信息
     * 标记 task 是否运行中用于控制 helpers/fnDep 逻辑发现是 task 运行时不记录 depKeys，
     * 避免 mutate 配置的 task 里多次变化当前共享对象的状态是误判为死循环
     */
    isTaskRunning: false,
    isIgnore: false,
    /** 函数运行结束收集到的 depKeys */
    depKeys: [] as string[],
    /** globalId to Array<insKey> */
    GID_INSKEYS_MAP: new Map<NumStrSymbol, number[]>(),
    FNKEY_STATIC_CTX_MAP: new Map<string, IFnCtx>(),
    FNKEY_HOOK_CTX_MAP: new Map<string, IFnCtx>(),
    DEPKEY_FNKEYS_MAP: new Map<string, string[]>(),
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
      const modData = root.ctx.mod[moduleName];
      if (!modData) {
        throw new Error(`moduleName ${moduleName} not found`);
      }
      modData.setState(partialState);
    },
    ctx: {
      bus: buildEventBus(),
      userBus: buildEventBus(),
      mod: {} as Dict, // 与模块相关的辅助信息
      middlewares: [] as Middleware[],
      plugins: [] as IPlugin[],
      sharedScope: buildSharedScope(),
      fnScope: buildFnScope(),
      insScope: buildInsScope(),
      blockScope: buildBlockScope(),
      markAtomMap: new Map<any, boolean>(), // 不支持 symbol 的环境才会记录此map
      renderSN: 0, // 渲染批次序列号种子数
      globalLoading: asType<LoadingState>(null), // works for top api useLoading
      globalLoadingInternal: asType<TInternal>(null), // works for top api useLoading
      globalEmpty: asType<Dict>(null), // works for top api useGlobalId
      globalEmptyInternal: asType<TInternal>(null), // works for top api useGlobalId
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
