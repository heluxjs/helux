import { react } from '../../react';

/**
 * resolve react tearing problem
 * param1: subscribe
 * param2: getSnapshot
 */
export function useSync(...args: any[]) {
  react.useSyncExternalStore(...args);
}
