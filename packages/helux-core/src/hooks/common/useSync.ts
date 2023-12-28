import type { CoreApiCtx } from '../../types/api-ctx';

/**
 * resolve react tearing problem
 * param1: subscribe
 * param2: getSnapshot
 */
export function useSync(api: CoreApiCtx, ...args: any[]) {
  try {
    api.react.useSyncExternalStore(...args);
  } catch (err) {
    // ReactDevTool sometimes throw this strange bug:
    // dispatcher.useSyncExternalStore is not a function
    console.error(err);
  }
}
