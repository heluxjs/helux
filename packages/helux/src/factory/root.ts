import { VER } from '../consts';
import type { Dict, IFnCtx, IUnmountInfo, NumStrSymbol } from '../types';
import { asType, nodupPush, safeMapGet } from '../utils';
import type { TInternal } from './common/buildInternal';

const windowRef: Dict & Window & typeof globalThis = window;

function buildFnDep() {
  return {
    keySeed: {
      static: 0,
      hook: 0,
    },
    currentRunningFnKey: '',
    GID_INSKEYS_MAP: new Map<NumStrSymbol, number[]>(), // globalId to insKeys
    FNKEY_STATIC_CTX_MAP: new Map<string, IFnCtx>(),
    FNKEY_HOOK_CTX_MAP: new Map<string, IFnCtx>(),
    VALKEY_FNKEYS_MAP: new Map<string, string[]>(),
    UNMOUNT_INFO_MAP: new Map<string, IUnmountInfo>(),
  };
}

function buildInsDep() {
  return {
    keySeed: 0,
    UNMOUNT_INFO_MAP: new Map<number, IUnmountInfo>(),
  };
}

function buildShared() {
  return {
    UNMOUNT_INFO_MAP: new Map<number, IUnmountInfo>(),
    SHARED_KEY_STATE_MAP: new Map<number, Dict>(),
    STATE_SHARED_KEY_MAP: new Map<any, number>(),
    INTERMAL_MAP: {} as Dict,
  };
}

function createRoot() {
  const root = {
    VER,
    rootState: {} as Dict,
    setState: (moduleName: string, partialState: Dict) => {
      const modData = root.help.mod[moduleName];
      if (!modData) {
        throw new Error(`moduleName ${moduleName} not found`);
      }
      modData.setState(partialState);
    },
    help: {
      mod: {} as Dict, // 与模块相关的辅助信息
      shared: buildShared(),
      fnDep: buildFnDep(),
      insDep: buildInsDep(),
      markAtomMap: new Map<any, boolean>(), // 不支持 symbol 的环境才会记录此map
    },
    globalShared: asType<Dict>(null), // works for useGlobalId
    globalInternal: asType<TInternal>(null), // works for useGlobalId
    legacyRoot: {},
  };
  return root;
}

export function getMarkAtomMap() {
  const map = getHeluxRoot().help.markAtomMap;
  return map;
}

export function getGlobalIdInsKeys(id: NumStrSymbol) {
  const map = getHeluxRoot().help.fnDep.GID_INSKEYS_MAP;
  return safeMapGet(map, id, [] as number[]);
}

export function getGlobalInternal() {
  return getHeluxRoot().globalInternal;
}

type HeluxRoot = ReturnType<typeof createRoot>;

export function getGlobalShared() {
  return getHeluxRoot().globalShared;
}

export function setGlobalShared(shared: Dict) {
  getHeluxRoot().globalShared = shared;
  return shared;
}

export function mapGlobalId(id: NumStrSymbol, insKey: number) {
  if (!id) return;
  const keys = getGlobalIdInsKeys(id);
  nodupPush(keys, insKey);
}

export function delGlobalId(id: NumStrSymbol, insKey: number) {
  if (!id) return;
  const keys = getGlobalIdInsKeys(id);
  const idx = keys.indexOf(insKey);
  if (idx >= 0) {
    keys.splice(idx, 1);
  }
}

export function getHeluxRoot(): HeluxRoot {
  return windowRef.__HELUX__;
}

export function ensureHeluxRoot() {
  const root: HeluxRoot = windowRef.__HELUX__;
  if (!root) {
    windowRef.__HELUX__ = createRoot();
    return;
  }

  // try transfer legacy
  const v = root.VER[0];
  if (v === '2' || v === '1') {
    const newRoot = createRoot();
    newRoot.legacyRoot = root;
    windowRef.__HELUX__ = newRoot;
  }
}

ensureHeluxRoot();
