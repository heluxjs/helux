import type { CoreApiCtx } from '../types/api-ctx';
import type { Atom, Dict, IRenderInfo, IUseAtomOptions, IUseSharedOptions, SetAtom, SetState } from '../types/base';
import { useSharedLogic } from './common/useSharedLogic';

export function useShared<T = Dict>(apiCtx: CoreApiCtx, sharedState: T, options: IUseSharedOptions<T> = {}): [T, SetState<T>, IRenderInfo] {
  const insCtx = useSharedLogic(apiCtx, sharedState, options);
  const { proxyState, internal, renderInfo } = insCtx;
  return [proxyState, internal.setState, renderInfo];
}

export function useAtom<T = any>(apiCtx: CoreApiCtx, sharedState: Atom<T>, options: IUseAtomOptions<T> = {}): [T, SetAtom<T>, IRenderInfo] {
  const insCtx = useSharedLogic(apiCtx, sharedState, { ...options, forAtom: true });
  const { proxyState, internal, renderInfo } = insCtx;
  return [proxyState.val, internal.setAtom, renderInfo];
}
