import { initHeluxContext } from '@helux/core';
import reactLib from 'preact/compat';

const api = initHeluxContext({ heluxCtxKey: '__HELUX_PREACT__', reactLib });

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
  // hooks api
  useAtom,
  useAtomX,
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
  // init api
  init,
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
  cst,
} = api;
