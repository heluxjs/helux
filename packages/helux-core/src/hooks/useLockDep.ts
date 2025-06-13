import { getVal } from "@helux/utils";
import { limuUtils } from 'limu';
import type { CoreApiCtx } from '../types/api-ctx';
import { getInternal } from '../helpers/state';
import { useGlobalId } from './useGlobalId';
import { getDepKeyByPath } from '../factory/common/util';

const hiddenGlobalId = Symbol('HiddenGlobalId');

export function useLockDep<T extends any>(apiCtx: CoreApiCtx, mayProxyNode: T): T {
  const meta = limuUtils.getDraftMeta(mayProxyNode);
  let globalIds: any = [hiddenGlobalId];
  let val: any = mayProxyNode;
  if (meta) {
    const internal = getInternal(meta.rootMeta.self);
    if (internal) {
      const { keyPath, arrKeyPath, keyPaths } = meta;
      const { sharedKey } = internal;
      if (keyPaths.length > 1) {
        globalIds = keyPaths.map(path => getDepKeyByPath(path, sharedKey));
      } else {
        const targetPath = arrKeyPath.length ? arrKeyPath : keyPath;
        globalIds = getDepKeyByPath(targetPath, internal.sharedKey);
      }

      val = getVal(internal.rawState, keyPath);
    }
  }
  useGlobalId(apiCtx, globalIds);
  return val;
}
