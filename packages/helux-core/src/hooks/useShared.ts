import type { Atom, Dict, IRenderInfo, IUseSharedOptions, IUseAtomOptions, SetAtom, SetState } from '../types';
import { useSharedLogic } from './common/useSharedLogic';

export function useShared<T = Dict>(sharedState: T, options: IUseSharedOptions<T> = {}): [T, SetState<T>, IRenderInfo] {
  const insCtx = useSharedLogic(sharedState, options);
  const { proxyState, internal, renderInfo } = insCtx;
  return [proxyState, internal.setState, renderInfo];
}

export function useAtom<T = any>(sharedState: Atom<T>, options: IUseAtomOptions<T> = {}): [T, SetAtom<T>, IRenderInfo] {
  const insCtx = useSharedLogic(sharedState, { ...options, forAtom: true });
  const { proxyState, internal, renderInfo } = insCtx;
  return [proxyState.val, internal.setAtom, renderInfo];
}
