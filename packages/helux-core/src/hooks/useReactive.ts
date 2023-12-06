import { isAtom } from '../factory/common/atom';
import type { CoreApiCtx } from '../types/api-ctx';
import type { IRenderInfo, IUseSharedStateOptions } from '../types/base';
import { useSharedLogic } from './common/useSharedLogic';

export function useReactive<T = any>(apiCtx: CoreApiCtx, sharedState: T, options: IUseSharedStateOptions<T> = {}): [T, IRenderInfo] {
  const forAtom = isAtom(sharedState);
  const { tuple } = useSharedLogic(apiCtx, sharedState, { ...options, forAtom, isReactive: true });
  return [tuple[0], tuple[2]];
}
