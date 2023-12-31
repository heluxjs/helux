import { getRootCtx } from '../../factory/root';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Fn } from '../../types/base';

/**
 * resolve react tearing problem
 * param1: subscribe
 * param2: getSnapshot
 */
export function useSync(api: CoreApiCtx, subscribe: Fn, getSnapshot: Fn, getServerSnapshot?: Fn) {
  if (!getRootCtx().isRootRender) {
    return;
  }

  try {
    const getServerSnapshotFn = getServerSnapshot || getSnapshot;
    api.react.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshotFn);
  } catch (err) {
    // ReactDevTool sometimes throw this strange bug:
    // dispatcher.useSyncExternalStore is not a function
    console.error(err);
  }
}
