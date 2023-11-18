import { isDerivedAtom } from '../../factory/common/atom';
import { getDepKeyInfo } from '../../factory/common/util';
import { delBlockCtx, markBlockMounted } from '../../helpers/blockCtx';
import { isSharedState } from '../../helpers/state';
import { useDerivedSimpleLogic } from '../../hooks/common/useDerivedLogic';
import { useSharedSimpleLogic } from '../../hooks/common/useSharedLogic';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { IBlockCtx, LoadingStatus } from '../../types/base';

export function useDep(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, showLoading = false) {
  let status: LoadingStatus = { loading: false, err: null, ok: true };
  blockCtx.map.forEach((depKeys, stateOrResult) => {
    // trust beblow statement, cause map data supplied by blockCtx is stable
    if (isSharedState(stateOrResult)) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const insCtx = useSharedSimpleLogic(apiCtx, stateOrResult);
      if (insCtx.isFirstRender) {
        // transfer depKeys
        depKeys.forEach((depKey) => insCtx.recordDep(getDepKeyInfo(depKey)));
      }
      insCtx.isFirstRender = false;
    } else {
      // will transfer depKeys in genDerivedResult process
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const fnCtx = useDerivedSimpleLogic(apiCtx, { result: stateOrResult, forAtom: isDerivedAtom(stateOrResult), showLoading });
      if (!fnCtx.status.ok) {
        status = fnCtx.status;
      }
    }
  });
  return status;
}

export function useDelBlockCtxEffect(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, isDynamic: boolean) {
  apiCtx.react.useEffect(() => {
    if (!blockCtx.mounted) {
      markBlockMounted(blockCtx);
    }
    return () => delBlockCtx(blockCtx.key, isDynamic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockCtx]);
}

export function useIsFirstRender(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, isDynamic: boolean) {
  const ref = apiCtx.react.useRef({ isFirst: true, key: blockCtx.key });
  if (ref.current.key !== blockCtx.key) {
    // works for hot reload
    delBlockCtx(ref.current.key, isDynamic);
    ref.current.isFirst = true;
    ref.current.key = blockCtx.key;
  }
  return ref;
}
