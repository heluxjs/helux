import { FROM } from '../consts';
import { checkSharedStrict } from '../factory/common/check';
import { createSharedLogic, ensureGlobal } from '../factory/createShared';
import { createSafeLoading, getGlobalLoadingInternal, getLoadingInfo } from '../factory/creator/loading';
import { From, IRenderInfo, LoadingState, SafeLoading, SetState, SharedState } from '../types';
import { useSharedSimpleLogic } from './common/useSharedLogic';

const { ACTION, MUTATE } = FROM;

function getLoadingCtx<T = SharedState>(options?: { target?: T; from: From }) {
  ensureGlobal();
  const { target, from = 'InnerMutate' } = options || {};
  let internal = getGlobalLoadingInternal();
  if (target) {
    // 传递了 target 才检查
    internal = checkSharedStrict(target);
  }
  const { loadingProxy, loadingState } = getLoadingInfo(createSharedLogic, internal, from);
  return { loadingProxy, loadingState, internal, from };
}

function useLoadingLogic<T = SharedState>(options: { target?: T; from: From }): [SafeLoading, SetState<LoadingState>, IRenderInfo] {
  const { loadingProxy, internal, from } = getLoadingCtx(options);
  const { proxyState, extra, renderInfo } = useSharedSimpleLogic(loadingProxy);
  return [createSafeLoading(extra, proxyState, from), internal.setState, renderInfo];
}

/** 获取 mutate 函数产生的 loading */
export function getMutateLoading<T = SharedState>(target?: T): SafeLoading {
  const { loadingState } = getLoadingCtx({ target, from: MUTATE });
  return loadingState;
}

/** 使用 mutate 函数产生的 loading */
export function useMutateLoading<T = SharedState>(target?: T) {
  return useLoadingLogic({ target, from: MUTATE });
}

/** 获取 action 函数产生的 loading */
export function getActionLoading<T = SharedState>(target?: T): SafeLoading {
  const { loadingState } = getLoadingCtx({ target, from: ACTION });
  return loadingState;
}

/** 使用 action 函数产生的 loading */
export function useActionLoading<T = SharedState>(target?: T) {
  return useLoadingLogic({ target, from: ACTION });
}
