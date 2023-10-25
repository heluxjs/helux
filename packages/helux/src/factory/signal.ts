/** 辅助 helux-signal 的模块，目前暂还用不上 */
import { getSharedKey } from '../helpers/state';
import type { Dict, DictN } from '../types';
import { nodupPush, safeGet } from '../utils';

let depStats: DictN<Array<string>> = {};

function mapDepStats(sharedKey: number) {
  const keys = safeGet(depStats, sharedKey, []);
  return keys;
}

/** after calling getDepStats, mem depStats will be cleanup automatically */
export function getDepStats() {
  const curDepStats = depStats;
  depStats = {};
  return curDepStats;
}

export function recordDep(sharedKey: number, valKey: string | symbol) {
  const keys = mapDepStats(sharedKey);
  nodupPush(keys, valKey);
}

export function setShared(sharedList: Dict[]) {
  sharedList.forEach((shared) => mapDepStats(getSharedKey(shared)));
}
