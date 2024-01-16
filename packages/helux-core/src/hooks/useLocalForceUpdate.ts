import type { CoreApiCtx } from '../types/api-ctx';

/**
 * 强制更新当前组件
 */
export function useLocalForceUpdate(apiCtx: CoreApiCtx): () => void {
  const updater = apiCtx.hookImpl.useForceUpdate();
  return updater;
}
