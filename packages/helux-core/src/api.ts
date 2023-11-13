import { limuUtils, produce } from 'limu';
import { derive, deriveAsync, deriveAtom, deriveAtomAsync } from './factory/createDerived';
import { atom, share, shareState, shareAtom } from './factory/createShared';
import { watch } from './factory/createWatch';
import { action, actionAsync, atomAction, atomActionAsync } from './factory/createAction';
import { runMutate, runMutateTask, mutate, mutateDict, atomMutate } from './factory/createMutate';
import { EVENT_NAME, WAY, LOADING_MODE } from './consts/user';
import { getAtom } from './factory/common/atom';
import { addMiddleware } from './factory/common/middleware';
import { addPlugin } from './factory/common/plugin';
import { on, emit } from './factory/common/userBus';
import { runDerive, getDeriveLoading } from './helpers/fnRunner';
import { getRawState, getSnap } from './helpers/state';
import { useDerivedAtom, useDerivedAtomAsync, useDerived, useDerivedAsync } from './hooks/useDerived';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useGlobalId } from './hooks/useGlobalId';
import { useObject } from './hooks/useObject';
import { useService, storeSrv } from './hooks/useService';
import { useAtom, useShared } from './hooks/useShared';
import { useWatch } from './hooks/useWatch';
import { useOnEvent } from './hooks/useOnEvent';
import { useMutable } from './hooks/useMutable';
import { useStable } from './hooks/useStable';
import { useMutateLoading, getMutateLoading, useActionLoading, getActionLoading } from './hooks/useLoading';
import { block, blockStatus, dynamicBlock, dynamicBlockStatus, signal } from './signal';

const { shallowCompare, isDiff } = limuUtils;
const createShared = share; // for compatible wit v2 helux
const $ = signal; // signal api alias

export {
  // share api
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
  useObject,
  useService,
  useForceUpdate,
  useEffect,
  useLayoutEffect,
  useOnEvent,
  useMutable,
  useMutateLoading,
  useActionLoading,
  useStable,
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
  produce,
  // util api
  storeSrv,
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
