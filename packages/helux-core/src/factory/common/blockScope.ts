import { getBlockScope } from './speedup';

/**
 * 记录共享状态或共享派生结果最近一次读取的数据，为 block 模块服务
 * for perf, no options param here
 */
export function recordLastest(
  sharedKey: number,
  val: any,
  sharedState: any,
  depKey: string,
  keyPath: string[],
  isDerivedResult = false,
  isDerivedAtom = false,
) {
  const scope = getBlockScope();
  scope.latest = { sharedKey, val, stateOrResult: sharedState, depKey, keyPath, isDerivedResult, isDerivedAtom };
}

/**
 * 获取最新的数据读取信息
 */
export function getLastest() {
  const scope = getBlockScope();
  return scope.latest;
}

export function getBlockCtxMap(isDynamic: boolean) {
  const { KEY_DYNAMIC_CTX_MAP, KEY_CTX_MAP } = getBlockScope();
  const map = isDynamic ? KEY_DYNAMIC_CTX_MAP : KEY_CTX_MAP;
  return map;
}
