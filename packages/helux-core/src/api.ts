import { limuUtils, produce } from 'limu';
import { EVENT_NAME, LOADING_MODE, WAY } from './consts/user';
import { getAtom } from './factory/common/atom';
import { addMiddleware } from './factory/common/middleware';
import { addPlugin } from './factory/common/plugin';
import { emit, on } from './factory/common/userBus';
import { action, actionAsync, atomAction, atomActionAsync } from './factory/createAction';
import { derive, deriveAsync, deriveAtom, deriveAtomAsync } from './factory/createDerived';
import { atomMutate, mutate, mutateDict, runMutate, runMutateTask } from './factory/createMutate';
import { atom, share, shareAtom, shareState } from './factory/createShared';
import { watch } from './factory/createWatch';
import { getDeriveLoading, runDerive } from './helpers/fnRunner';
import { getRawState, getSnap } from './helpers/state';
import { useDerived, useDerivedAsync, useDerivedAtom, useDerivedAtomAsync } from './hooks/useDerived';
import { useGlobalId } from './hooks/useGlobalId';
import { getActionLoading, getMutateLoading, useActionLoading, useMutateLoading } from './hooks/useLoading';
import { useMutable } from './hooks/useMutable';
import { useOnEvent } from './hooks/useOnEvent';
import { storeSrv, useService } from './hooks/useService';
import { useAtom, useShared } from './hooks/useShared';
import { useWatch } from './hooks/useWatch';
import { block, blockStatus, dynamicBlock, dynamicBlockStatus, signal } from './signal';

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
  deriveAsync,
  deriveAtom,
  deriveAtomAsync,
  runDerive,
  // watch api
  watch,
  // hooks api
  useAtom,
  useShared,
  useDerived,
  useDerivedAsync,
  useDerivedAtom,
  useDerivedAtomAsync,
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
  signal,
  block,
  blockStatus,
  dynamicBlock,
  dynamicBlockStatus,
  $,
  // mutate api
  mutate,
  mutateDict,
  atomMutate,
  runMutate,
  runMutateTask,
  // emit api
  emit,
  on,
  // util api
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
  WAY,
  LOADING_MODE,
};
