import { VER } from '../consts';
import type { Dict, IFnCtx, IUnmountInfo } from '../types';

const windowRef: Dict & Window & typeof globalThis = window;

function buildFnDep() {
  return {
    keySeed: {
      static: 0,
      hook: 0,
    },
    currentRunningFnKey: '',
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
    },
    legacyRoot: {},
  };
  return root;
}

type HeluxRoot = ReturnType<typeof createRoot>;

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
