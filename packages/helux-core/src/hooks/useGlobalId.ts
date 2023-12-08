import { ensureGlobal } from '../factory/createShared';
import { getGlobalEmpty } from '../factory/creator/globalId';
import type { CoreApiCtx } from '../types/api-ctx';
import type { NumStrSymbol } from '../types/base';
import { useAtomSimpleLogic } from './common/useAtomLogic';

export function useGlobalId(apiCtx: CoreApiCtx, globalId: NumStrSymbol) {
  ensureGlobal(apiCtx);
  const globalEmpty = getGlobalEmpty();
  const insCtx = useAtomSimpleLogic(apiCtx, globalEmpty, { collectType: 'no', globalId });
  return insCtx.renderInfo;
}
