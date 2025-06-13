import { ensureGlobal } from '../factory/createShared';
import type { CoreApiCtx } from '../types/api-ctx';
import type { NumStrSymbol } from '../types/base';
import { useAtomSimpleLogic } from './common/useAtomLogic';

export function useGlobalId(apiCtx: CoreApiCtx, globalId: NumStrSymbol | NumStrSymbol[]) {
  const globalEmpty = ensureGlobal(apiCtx);
  const globalIds = Array.isArray(globalId) ? globalId : [globalId];
  const insCtx = useAtomSimpleLogic(
    apiCtx,
    globalEmpty,
    { globalIds, isGlobalId: true, disableProxy: true },
  );
  return insCtx.renderInfo;
}
