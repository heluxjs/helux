import { initHeluxContext } from '@helux/core';
import * as React from 'react';

const api = initHeluxContext({ heluxCtxKey: '__HELUX__', reactLib: React });

/**
 * for compatible wit v2 helux
 * 这个接口仅为了兼容 helux v2 升级到 v3 后不报错
 */
export const createShared = api.share;

// SignalView，BlockView 类型上是从 api 导出的，但实际是从 COMPS 导出的，因他们要在 apiFactory 被 memo 包裹一下
// @ts-ignore
const { COMPS } = api;
export const { SignalView, SignalV2, BlockView, BlockV2 } = COMPS;

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
  addMiddleware,
  addPlugin,
  cst,
} = api;
