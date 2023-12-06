import { limuUtils, produce } from 'limu';
import { EVENT_NAME, LIMU_VER, RECORD_LOADING, VER } from './consts/user';
import { getAtom, isAtom, isDerivedAtom } from './factory/common/atom';
import { addMiddleware } from './factory/common/middleware';
import { addPlugin } from './factory/common/plugin';
import { emit, on } from './factory/common/userBus';
import { action, actionAsync, atomAction, atomActionAsync } from './factory/createAction';
import { derive, deriveAtom } from './factory/createDerived';
import { atomMutate, mutate, mutateDict, runMutate, runMutateTask } from './factory/createMutate';
import { atom, share, shareAtom, shareState } from './factory/createShared';
import { sync, syncer } from './factory/createSync';
import { watch } from './factory/createWatch';
import { currentDraftRoot, setAtomVal } from './factory/creator/current';
import { getDeriveLoading, runDerive, runDeriveAsync } from './helpers/fnRunner';
import { getRawState, getSnap } from './helpers/state';
import { useDerived, useDerivedAtom } from './hooks/useDerived';
import { useGlobalId } from './hooks/useGlobalId';
import { getActionLoading, getMutateLoading, useActionLoading, useMutateLoading } from './hooks/useLoading';
import { useMutable } from './hooks/useMutable';
import { useOnEvent } from './hooks/useOnEvent';
import { useReactive } from './hooks/useReactive';
import { storeSrv, useService } from './hooks/useService';
import { useAtom, useShared } from './hooks/useShared';
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
  deriveAtom,
  runDerive,
  runDeriveAsync,
  // watch api
  watch,
  // hooks api
  useAtom,
  useShared,
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
  // action api
  action,
  actionAsync,
  atomAction,
  atomActionAsync,
  // signal api
  $,
  signal,
  block,
  dynamicBlock,
  // mutate api
  mutate,
  mutateDict,
  atomMutate,
  runMutate,
  runMutateTask,
  // sync api
  sync,
  syncer,
  // emit api
  emit,
  on,
  // util api
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
