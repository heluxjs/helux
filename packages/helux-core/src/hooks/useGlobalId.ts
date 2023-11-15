import { ensureGlobal } from '../factory/createShared';
import { getGlobalEmpty } from '../factory/creator/globalId';
import type { CoreApiCtx } from '../types/api-ctx';
import type { NumStrSymbol } from '../types/base';
import { useSharedSimpleLogic } from './common/useSharedLogic';

export function useGlobalId(apiCtx: CoreApiCtx, globalId: NumStrSymbol) {
  ensureGlobal(apiCtx);
  const globalEmpty = getGlobalEmpty();
  const insCtx = useSharedSimpleLogic(apiCtx, globalEmpty, { staticDeps: () => [], globalId });
  return insCtx.renderInfo;
}
