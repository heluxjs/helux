import { FROM } from '../consts';
import { checkSharedStrict } from '../factory/common/check';
import { createSharedLogic, ensureGlobal } from '../factory/createShared';
import { createSafeLoading, getGlobalLoadingInternal, getLoadingInfo } from '../factory/creator/loading';
import type { CoreApiCtx } from '../types/api-ctx';
import type { From, IRenderInfo, LoadingState, SafeLoading, SetState, SharedState } from '../types/base';
import { useSharedSimpleLogic } from './common/useSharedLogic';

const { ACTION, MUTATE } = FROM;

function getLoadingCtx<T = SharedState>(apiCtx: CoreApiCtx, options?: { target?: T; from: From }) {
  ensureGlobal(apiCtx);
  const { target, from = 'InnerMutate' } = options || {};
  let internal = getGlobalLoadingInternal();
  if (target) {
    // 传递了 target 才检查
    internal = checkSharedStrict(target);
  }
  const { loadingProxy, loadingState } = getLoadingInfo(createSharedLogic, { apiCtx, internal, from });
  return { loadingProxy, loadingState, internal, from };
}

function useLoadingLogic<T = SharedState>(
  apiCtx: CoreApiCtx,
  options: { target?: T; from: From },
): [SafeLoading, SetState<LoadingState>, IRenderInfo] {
  const { loadingProxy, internal, from } = getLoadingCtx(apiCtx, options);
  const { proxyState, extra, renderInfo } = useSharedSimpleLogic(apiCtx, loadingProxy);
  return [createSafeLoading(extra, proxyState, from), internal.setState, renderInfo];
}

/** 获取 mutate 函数产生的 loading */
export function getMutateLoading<T = SharedState>(apiCtx: CoreApiCtx, target?: T): SafeLoading {
  const { loadingState } = getLoadingCtx(apiCtx, { target, from: MUTATE });
  return loadingState;
}

/** 使用 mutate 函数产生的 loading */
export function useMutateLoading<T = SharedState>(apiCtx: CoreApiCtx, target?: T) {
  return useLoadingLogic(apiCtx, { target, from: MUTATE });
}

/** 获取 action 函数产生的 loading */
export function getActionLoading<T = SharedState>(apiCtx: CoreApiCtx, target?: T): SafeLoading {
  const { loadingState } = getLoadingCtx(apiCtx, { target, from: ACTION });
  return loadingState;
}

/** 使用 action 函数产生的 loading */
export function useActionLoading<T = SharedState>(apiCtx: CoreApiCtx, target?: T) {
  return useLoadingLogic(apiCtx, { target, from: ACTION });
}
