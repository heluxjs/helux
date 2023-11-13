import { react } from '../../react';

/**
 * resolve react tearing problem
 * param1: subscribe
 * param2: getSnapshot
 */
export function useSync(...args: any[]) {
  try {
    react.useSyncExternalStore(...args);
  } catch (err) {
    // ReactDevTooll sometimes throw this strange bug:
    // dispatcher.useSyncExternalStore is not a function
    console.error(err);
  }
}
