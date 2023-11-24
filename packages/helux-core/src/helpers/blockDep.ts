import { nodupPush } from '@helux/utils';
import { getBlockScope } from '../factory/common/speedup';

/**
 * 为可能存在的 block(cb) 的 [cb调用] 记录依赖
 */
export function recordBlockDepKey(depKeys: string[], result?: any) {
  const blockScope = getBlockScope();
  const { runningKey } = blockScope;
  if (runningKey) {
    const { KEY_DYNAMIC_CTX_MAP, KEY_CTX_MAP, isDynamic } = blockScope;
    const ctxMap = isDynamic ? KEY_DYNAMIC_CTX_MAP : KEY_CTX_MAP;
    const blockCtx = ctxMap.get(runningKey);
    if (blockCtx) {
      const { results, depKeys: blockDepKeys } = blockCtx;
      // blockCtx is setted at initBlockCtx phase
      if (result) {
        // @ts-ignore
        nodupPush(results, result);
      } else {
        depKeys.forEach((depKey) => nodupPush(blockDepKeys, depKey));
      }
    }
  }
}
