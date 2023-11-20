import { nodupPush, safeMapGet } from '@helux/utils';
import { getBlockScope } from '../factory/common/speedup';

/**
 * 为可能存在的 block(cb) 的 [cb调用] 记录依赖
 */
export function recordBlockDepKey(stateOrResult: any, depKeys: string[]) {
  const blockScope = getBlockScope();
  const { runningKey } = blockScope;
  if (runningKey) {
    const { KEY_DYNAMIC_CTX_MAP, KEY_CTX_MAP, isDynamic } = blockScope;
    const map = isDynamic ? KEY_DYNAMIC_CTX_MAP : KEY_CTX_MAP;
    const blockCtx = map.get(runningKey);
    if (blockCtx) {
      // blockCtx is seted at initBlockCtx phase
      const cachedDepKeys = safeMapGet(blockCtx.map, stateOrResult, []);
      depKeys.forEach((depKey) => nodupPush(cachedDepKeys, depKey));
    }
  }
}
