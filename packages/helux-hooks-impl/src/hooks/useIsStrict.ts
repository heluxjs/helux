import type { ApiCtx, EffectStrictCb } from '@helux/types';
import { useEffectLogic } from './useEffect';

export function useIsStrict(apiCtx: ApiCtx, cb: EffectStrictCb) {
  useEffectLogic(apiCtx, cb, { deps: [], isLayout: true, passIsStrict: true });
}
