import { limuUtils, produce } from 'limu';
import { EVENT_NAME, LIMU_VER, RECORD_LOADING, VER } from './consts/user';
import { getAtom, isAtom, isDerivedAtom } from './factory/common/atom';
import { addMiddleware } from './factory/common/middleware';
import { addPlugin } from './factory/common/plugin';
import { emit, on } from './factory/common/userBus';
import { action } from './factory/createAction';
import { derive, deriveDict } from './factory/createDerived';
import { mutate, mutateDict, runMutate, runMutateTask } from './factory/createMutate';
import { atom, share, shareAtom, shareState } from './factory/createShared';
import { sync, syncer } from './factory/createSync';
import { watch } from './factory/createWatch';
import { flush, reactiveDesc } from './factory/creator/buildReactive';
import { currentDraftRoot, setAtomVal } from './factory/creator/current';
import { getDeriveLoading, runDerive, runDeriveTask } from './helpers/fnRunner';
import { getRawState, getSnap } from './helpers/state';
import { useAtom } from './hooks/useAtom';
import { useDerived } from './hooks/useDerived';
import { useGlobalId } from './hooks/useGlobalId';
import { getActionLoading, getMutateLoading, useActionLoading, useMutateLoading } from './hooks/useLoading';
import { useMutable } from './hooks/useMutable';
import { useOnEvent } from './hooks/useOnEvent';
import { useReactive } from './hooks/useReactive';
import { storeSrv, useService } from './hooks/useService';
import { useWatch } from './hooks/useWatch';
import { block, dynamicBlock, signal } from './signal';

const { shallowCompare, isDiff } = limuUtils;
const createShared = share; // for compatible wit v2 helux
const $ = signal; // signal api alias

export {
  atom,
  share,
  shareState,
  shareAtom,
  createShared,
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
  // action api
  action,
  // signal api
  $,
  signal,
  block,
  dynamicBlock,
  // mutate api
  mutate,
  mutateDict,
  runMutate,
  runMutateTask,
  // sync api
  sync,
  syncer,
  // emit api
  emit,
  on,
  // util api
  reactiveDesc,
  flush,
  currentDraftRoot,
  setAtomVal,
  isAtom,
  isDerivedAtom,
  storeSrv,
  produce,
  shallowCompare,
  isDiff,
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
};
