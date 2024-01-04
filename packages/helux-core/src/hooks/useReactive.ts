import { isAtom } from '../factory/common/atom';
import type { CoreApiCtx } from '../types/api-ctx';
import type { ICompReactiveCtx, IRenderInfo, IUseSharedStateOptions } from '../types/base';
import { useAtomLogic } from './common/useAtomLogic';

export function useReactive<T = any>(apiCtx: CoreApiCtx, sharedState: T, options: IUseSharedStateOptions<T> = {}): [T, T, IRenderInfo] {
  // 具体关于 Atom 的类型体操见 types/api
  const forAtom = isAtom(sharedState);
  const { insCtx } = useAtomLogic(apiCtx, sharedState, { ...options, forAtom, isReactive: true });
  return [insCtx.proxyStateVal, insCtx.proxyState, insCtx.renderInfo];
}

export function useReactiveX<T = any>(apiCtx: CoreApiCtx, sharedState: T, options: IUseSharedStateOptions<T> = {}): ICompReactiveCtx {
  const [state, stateRoot, info] = useReactive(apiCtx, sharedState, options);
  return { ...info, state, stateRoot };
}
