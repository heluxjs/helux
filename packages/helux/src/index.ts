import { initHeluxContext } from '@helux/core';
import type { HooksApiImpl } from '@helux/hooks-impl';
import * as React from 'react';

const api = initHeluxContext({ heluxCtxKey: '__HELUX__', reactLib: React });

/**
 * for compatible wit v2 helux
 * 这个接口仅为了兼容 helux v2 升级到 v3 后不报错
 */
export const createShared = api.share;

/**
 * 避免警告：如果没有引用 "../hooks-impl/src/types-api"，则无法命名 "hookImpl" 的推断类型。这很可能不可移植。需要类型注释
 */
export const hookImpl: HooksApiImpl = api.hookImpl;

// 导出 core 所有方法，类型由 index.d.ts 提供（见 package.json 的 types 配置）
export const {
  atom,
  atomx,
  share,
  sharex,
  // derive api
  derive,
  deriveDict,
  defineDeriveTask,
  defineDeriveFnItem,
  runDerive,
  runDeriveTask,
  // watch api
  watch,
  watchEffect,
  // hooks api
  useAtom,
  useAtomX,
  useReactive,
  useReactiveX,
  useDerived,
  useWatch,
  useWatchEffect,
  useGlobalId,
  useService,
  useOnEvent,
  useMutable,
  useMutateLoading,
  useActionLoading,
  useEffect,
  useLayoutEffect,
  useStable,
  useObject,
  useLocalForceUpdate,
  useGlobalForceUpdate,
  useLockDep,
  // for react class component
  bindAtom,
  withAtom,
  assignThisHX,
  getHX,
  makeWithAtomOptions,
  // action api
  action,
  // signal api
  signal,
  block,
  dynamicBlock,
  getBlockParams,
  SignalView,
  SignalV2,
  BlockView,
  BlockV2,
  $,
  // mutate api
  mutate,
  mutateDict,
  runMutate,
  runMutateTask,
  defineMutateFnItem,
  // sync api
  sync,
  syncer,
  // model api
  model,
  modelFactory,
  // emit api
  emit,
  on,
  // init api
  init,
  // util api
  limu,
  reactiveDesc,
  flush,
  isAtom,
  isSharedState,
  isDerivedAtom,
  isDerivedResult,
  isDraft,
  storeSrv,
  shallowCompare,
  markRaw,
  isDiff,
  produce,
  getMutateLoading,
  getActionLoading,
  getDeriveLoading,
  getRawState,
  getSnap,
  getAtom,
  getCurrentProxy,
  addMiddleware,
  addPlugin,
  cst,
} = api;
