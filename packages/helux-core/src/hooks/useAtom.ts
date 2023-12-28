import type { CoreApiCtx } from '../types/api-ctx';
import type { Atom, ICompAtomCtx, IRenderInfo, IUseSharedStateOptions, SetState } from '../types/base';
import { useAtomLogic } from './common/useAtomLogic';

export function useAtom<T = any>(
  apiCtx: CoreApiCtx,
  sharedState: T,
  options: IUseSharedStateOptions<T> = {},
): [T, SetState<Atom<T>>, IRenderInfo] {
  const { tuple } = useAtomLogic(apiCtx, sharedState, options);
  return tuple;
}

export function useAtomX<T = any>(apiCtx: CoreApiCtx, sharedState: T, options: IUseSharedStateOptions<T> = {}): ICompAtomCtx {
  const { tuple } = useAtomLogic(apiCtx, sharedState, options);
  const [state, setState, renderInfo] = tuple;
  return { ...renderInfo, state, setState };
}
