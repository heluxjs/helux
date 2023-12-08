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
  share,
  shareState,
  shareAtom,
  createShared,
  // derive api
  derive,
  deriveAtom,
  runDerive,
  runDeriveAsync,
  // watch api
  watch,
  // hooks api
  useAtom,
  useReactive,
  useDerived,
  useDerivedAtom,
  useWatch,
  useGlobalId,
  useService,
  useOnEvent,
  useMutable,
  useMutateLoading,
  useActionLoading,
  useForceUpdate,
  useEffect,
  useLayoutEffect,
  useStable,
  useObject,
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
  currentDraftRoot,
  setAtomVal,
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

export const useShared = useAtom;
export const actionAsync = action;
export const atomAction = action;
export const atomActionAsync = action;
