import { act } from '@testing-library/react';
import * as React from 'react';
import { initHeluxContext } from '../../helux-core/src/index';

window.alert = () => {};

// pass act to avoid Warning:
// An update to TestComponent inside a test was not wrapped in act(...).
// This ensures that you're testing the behavior the user would see in the browser.
// Learn more at https://reactjs.org/link/wrap-tests-with-act
const api = initHeluxContext({ heluxCtxKey: '__HELUX__', reactLib: React, act });

// 导出 core 所有方法，类型由 index.d.ts 提供（见 package.json的 types 配置）
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

export const useShared = useAtom;
export const actionAsync = action;
export const atomAction = action;
export const atomActionAsync = action;
