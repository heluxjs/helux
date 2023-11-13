import { VER } from '../consts';
import type { Dict, Fn, IBlockCtx, IFnCtx, IPlugin, IUnmountInfo, Middleware, NumStrSymbol, LoadingState } from '../types';
import { asType, GLOBAL_REF, safeGet } from '../utils';
import { setReactLib } from '../react';
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
     * 避免 share 接口的 mutate 函数里收集到自己对自己的依赖，从而造成无限死循环
     */
    runningSharedState: null as any,
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
    /** sharedState to depKeys */
    runningDepMap: new Map<any, string[]>(),
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
    STATE_SHARED_KEY_MAP: new Map<any, number>(),
    /** sharedKey to internal */
    INTERMAL_MAP: new Map<number, TInternal>(),
  };
}

function buildEventBus() {
  const name2cbs: Dict<Fn[]> = {};
  return {
    on: (name: string, cb: Fn) => {
      const cbs = safeGet(name2cbs, name, [] as Fn[]);
      cbs.push(cb);
    },
    emit: (name: string, ...args: any[]) => {
      const cbs = name2cbs[name] || [];
      cbs.slice().forEach((cb) => cb(...args));
    },
    off: (name: string, cb: Fn) => {
      const cbs = name2cbs[name] || [];
      const idx = cbs.findIndex(item => item === cb);
      if (idx >= 0) cbs.splice(idx, 1);
    },
    /** for perf */
    canEmit: (name: string) => name2cbs[name],
  };
}

function createRoot() {
  const root = {
    VER,
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

export function getRootCtx() {
  return ROOT.ctx || asType<HeluxRoot['ctx']>({});
}

export function getRoot() {
  return ROOT;
}

export function initHeluxContext(options: {
  heluxCtxKey: string | symbol;
  reactLib: any;
  standalone?: boolean;
  transfer?: (existedRoot: any, newRoot: any) => any;
}) {
  if (inited) return; // only can be call one time!

  const { heluxCtxKey, standalone, transfer, reactLib } = options;
  setReactLib(reactLib);
  const existedRoot: HeluxRoot = GLOBAL_REF[heluxCtxKey];
  const done = (key: string | symbol) => {
    inited = true;
    ROOT = createRoot();
    GLOBAL_REF[key] = ROOT;
  };

  if (!existedRoot) {
    return done(heluxCtxKey);
  }

  // found another version, but want to own dependency helux context
  if (standalone) {
    return done(`${String(heluxCtxKey)}_${Date.now()}`);
  }

  // now current helux will reuse existed helux context,
  // multi helux lib will share one hulex context,
  // no matter the helux in app1 and and2 is the same module or not,
  // it is ok that app1 can use a shared state exported from app2 by useShared directly,

  //try transfer legacy root by user custom transfer fn
  if (transfer) {
    inited = true;
    ROOT = createRoot(); // may a lower version root
    transfer(existedRoot, ROOT);
  }
}
