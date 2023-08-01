import { limuUtils } from 'limu';
import { createComputed } from './factory/createComputed';
import { createComputedAsync } from './factory/createComputedAsync';
import { createComputedTask } from './factory/createComputedTask';
import { createDeepShared, createShared } from './factory/createShared';
import { createWatch } from './factory/createWatch';
import './factory/root';
import * as advance from './helpers/advance';
import { runComputed } from './helpers/fndep';
import { getRawState } from './helpers/state';
import { useComputed } from './hooks/useComputed';
import { useComputedAsync } from './hooks/useComputedAsync';
import { useComputedTask } from './hooks/useComputedTask';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared } from './hooks/useShared';
import { useWatch } from './hooks/useWatch';

const { shallowCompare, isDiff } = limuUtils;

export {
  advance,
  useShared,
  useComputed,
  useComputedAsync,
  useComputedTask,
  useWatch,
  useObject,
  useService,
  useForceUpdate,
  useEffect,
  useLayoutEffect,
  createShared,
  createDeepShared,
  createComputed,
  createComputedAsync,
  createComputedTask,
  createWatch,
  runComputed,
  shallowCompare,
  isDiff,
  getRawState,
};
