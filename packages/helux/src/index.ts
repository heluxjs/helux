import './factory/root';
import { limuUtils } from 'limu';
import { createShared, share, atom, derive, deriveAsync, deriveTask, deriveAtom, deriveAtomAsync, deriveAtomTask, watch } from './factory';
import * as advance from './helpers/advance';
import { runDerive } from './helpers/fndep';
import { getRawState, getRawStateSnap } from './helpers/state';
import { useDerived, useDerivedAsync, useDerivedTask, useAtomDerived, useAtomDerivedAsync, useAtomDerivedTask, } from './hooks/useDerived';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared, useAtom } from './hooks/useShared';
import { useWatch } from './hooks/useWatch';
import { useGlobalId } from './hooks/useGlobalId';

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
  createShared, // just for compatible with helux v2
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
