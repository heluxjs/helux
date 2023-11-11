import { ensureGlobal } from '../factory/createShared';
import { getGlobalEmpty } from '../factory/creator/globalId';
import { NumStrSymbol } from '../types';
import { useSharedSimpleLogic } from './common/useSharedLogic';

export function useGlobalId(globalId: NumStrSymbol) {
  ensureGlobal();
  const globalEmpty = getGlobalEmpty();
  const insCtx = useSharedSimpleLogic(globalEmpty, { staticDeps: () => [], globalId });
  return insCtx.renderInfo;
}
