import { limuUtils } from 'limu';
import { atom, createShared, derive, deriveAsync, deriveAtom, deriveAtomAsync, deriveAtomTask, deriveTask, share, watch } from './factory';
import './factory/root';
import * as advance from './helpers/advance';
import { runDerive } from './helpers/fndep';
import { getRawState, getRawStateSnap } from './helpers/state';
import { useAtomDerived, useAtomDerivedAsync, useAtomDerivedTask, useDerived, useDerivedAsync, useDerivedTask } from './hooks/useDerived';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useGlobalId } from './hooks/useGlobalId';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useAtom, useShared } from './hooks/useShared';
import { useWatch } from './hooks/useWatch';

const { shallowCompare, isDiff } = limuUtils;
const shareState = createShared;

export {
  atom,
  share,
  shareState,
  // derive for shared state
  derive,
  deriveAsync,
  deriveTask,
  // derive for shared atom
  deriveAtom,
  deriveAtomAsync,
  deriveAtomTask,
  watch,
  runDerive,
  createShared,
  advance,
  useAtom,
  useShared,
  // use derived state
  useDerived,
  useDerivedAsync,
  useDerivedTask,
  // use derived atom
  useAtomDerived,
  useAtomDerivedAsync,
  useAtomDerivedTask,
  useWatch,
  useGlobalId,
  useObject,
  useService,
  useForceUpdate,
  useEffect,
  useLayoutEffect,
  shallowCompare,
  isDiff,
  getRawState,
  getRawStateSnap,
};
