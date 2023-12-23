import { initHeluxContext } from '@helux/core';
import * as React from 'react';

const api = initHeluxContext({ heluxCtxKey: '__HELUX__', reactLib: React });

/**
 * for compatible wit v2 helux
 * 这个接口仅为了兼容 helux v2 升级到 v3 后不报错
 */
export const createShared = api.share;

// 导出 core 所有方法，类型由 index.d.ts 提供（见 package.json的 types 配置）
export const {
  atom,
  atomx,
  share,
  sharex,
  // derive api
  derive,
  deriveDict,
  runDerive,
  runDeriveTask,
  // watch api
  watch,
  // hooks api
  useAtom,
  useReactive,
  useDerived,
  useWatch,
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
  // action api
  action,
  // signal api
  signal,
  block,
  dynamicBlock,
  $,
  // mutate api
  mutate,
  mutateDict,
  runMutate,
  runMutateTask,
  // sync api
  sync,
  syncer,
  // model api
  model,
  modelFactory,
  // emit api
  emit,
  on,
  // util api
  reactiveDesc,
  flush,
  isAtom,
  isDerivedAtom,
  storeSrv,
  shallowCompare,
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
  EVENT_NAME,
  RECORD_LOADING,
  VER,
  LIMU_VER,
} = api;
