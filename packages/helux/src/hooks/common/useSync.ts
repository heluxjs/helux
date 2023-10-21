import React from 'react';
import { noop } from '../../utils';

// @ts-ignore
const useSyncExternalStore = React['useSyncExternalStore'] || noop;

/**
 * resolve react tearing problem
 * param1: subscribe
 * param2: getSnapshot
 */
export function useSync(...args: any[]) {
  useSyncExternalStore(...args);
}
