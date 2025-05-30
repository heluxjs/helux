import { noop } from '@helux/utils';
import { isDerivedAtom } from '../../factory/common/atom';
import { delBlockCtx, markBlockMounted } from '../../helpers/blockCtx';
import { useDerivedSimpleLogic } from '../../hooks/common/useDerivedLogic';
import { useWatchSimpleLogic } from '../../hooks/common/useWatchLogic';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Fn, IBlockCtx, LoadingStatus } from '../../types/base';

export function useStateDep(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, forceUpdate: Fn) {
  useWatchSimpleLogic(apiCtx, forceUpdate, { manualDepKeys: blockCtx.depKeys });
}

export function useDep(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, forceUpdate: Fn, useStatusList: Fn) {
  let status: LoadingStatus = { loading: false, err: null, ok: true };
  useStateDep(apiCtx, blockCtx, forceUpdate);
  const statusList: LoadingStatus[] = useStatusList() || [];
  statusList.forEach((v) => noop(v.loading)); // 触发一下读取动作，表示关心 status 变化

  // use result dep, find one non-ok status
  blockCtx.results.forEach((result) => {
    // trust beblow statement, cause map data supplied by blockCtx is stable
    // ATTENTION: helux will transfer depKeys in genDerivedResult process
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fnCtx = useDerivedSimpleLogic(apiCtx, { result, forAtom: isDerivedAtom(result), showLoading: blockCtx.enableStatus });
    if (!fnCtx.status.ok) {
      status = fnCtx.status;
    }
  });

  if (!status.loading && !status.err) {
    for (const item of statusList) {
      if (item.loading || item.err) {
        status = item;
        break;
      }
    }
  }

  return status;
}

export function useDelBlockCtxEffect(apiCtx: CoreApiCtx, blockCtx: IBlockCtx, isDynamic: boolean) {
  apiCtx.react.useEffect(() => {
    if (!blockCtx.mounted) {
      markBlockMounted(blockCtx);
    }
    return () => {
      delBlockCtx(blockCtx.key, isDynamic);
    };
    // here ignore isDynamic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockCtx]);
}
