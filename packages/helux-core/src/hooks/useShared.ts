import type { CoreApiCtx } from '../types/api-ctx';
import type { Dict, IRenderInfo, IUseSharedStateOptions, SetAtom, SetState } from '../types/base';
import { useSharedLogic } from './common/useSharedLogic';

export function useShared<T = Dict>(
  apiCtx: CoreApiCtx,
  sharedState: T,
  options: IUseSharedStateOptions<T> = {},
): [T, SetState<T>, IRenderInfo] {
  const { tuple } = useSharedLogic(apiCtx, sharedState, options);
  return tuple;
}

export function useAtom<T = any>(
  apiCtx: CoreApiCtx,
  sharedState: T,
  options: IUseSharedStateOptions<T> = {},
): [T, SetAtom<T>, IRenderInfo] {
  const { tuple } = useSharedLogic(apiCtx, sharedState, { ...options, forAtom: true });
  return tuple;
}
