import { dedupList } from '@helux/utils';
import { markFnEnd } from '../../helpers/fnCtx';
import { getDepFnStats } from '../../helpers/fnDep';
import { runFn } from '../../helpers/fnRunner';
import { markComputing } from '../../helpers/fnStatus';
import { runInsUpdater } from '../../helpers/insCtx';
import type { Dict, InsCtxMap } from '../../types/base';
import { clearDiff, diffVal } from '../common/sharedScope';
import type { InsCtxDef } from './buildInternal';
import type { ICommitStateOptions } from './commitState';
import { getGlobalEmptyInternal, getGlobalIdInsKeys } from './globalId';

export function execDepFnAndInsUpdater(opts: ICommitStateOptions) {
  const { mutateCtx, internal, desc, isFirstCall, from, sn } = opts;
  const { ids, globalIds, depKeys, triggerReasons } = mutateCtx;
  const { key2InsKeys, id2InsKeys, insCtxMap, rootValKey } = internal;

  internal.ver += 1;
  // find associate ins keys
  let allInsKeys: number[] = [];
  let globalInsKeys: number[] = [];
  // find associate derived/watch fn ctxs
  let allFirstLevelFnKeys: string[] = [];
  let allAsyncFnKeys: string[] = [];
  const runCountStats: Dict<number> = {};

  if (isFirstCall) {
    markFnEnd();
  }

  const analyzeDepKey = (key: string, skipFindIns?: boolean) => {
    // 值相等就忽略
    if (!diffVal(internal, key)) {
      return;
    }

    if (!skipFindIns) {
      allInsKeys = allInsKeys.concat(key2InsKeys[key] || []);
    }
    const { firstLevelFnKeys, asyncFnKeys } = getDepFnStats(internal, key, runCountStats);
    allFirstLevelFnKeys = allFirstLevelFnKeys.concat(firstLevelFnKeys);
    allAsyncFnKeys = allAsyncFnKeys.concat(asyncFnKeys);
  };
  depKeys.forEach((k) => analyzeDepKey(k));
  // 直接设定 deps 的 watch derive 函数，观察的共享对象本身的变化，这里以 rootValKey 为依赖去查出来
  // 注意这里刻意放 depKeys.forEach 之后执行，是需要复用 sharedScope.isStateChanged 结果
  // 因这里补上 rootValKey 仅为了查 watch derive 函数，故刻意传递 skipFindIns = true 跳过 ins 查询
  // 否则会导致不该更新的实例也触发更新了，影响精确更新结果
  if (!depKeys.includes(rootValKey)) {
    analyzeDepKey(rootValKey, true);
  }
  // clear cached diff result
  clearDiff();
  // find id's ins keys
  ids.forEach((id) => {
    allInsKeys = allInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys, fn keys
  globalIds.forEach((id) => {
    getGlobalIdInsKeys(id).forEach((insKey) => globalInsKeys.push(insKey));
  });

  // deduplicate
  allInsKeys = dedupList(allInsKeys);
  allFirstLevelFnKeys = dedupList(allFirstLevelFnKeys);
  allAsyncFnKeys = dedupList(allAsyncFnKeys);
  // start execute derive/watch fns
  allAsyncFnKeys.forEach((fnKey) => markComputing(fnKey, runCountStats[fnKey]));
  allFirstLevelFnKeys.forEach((fnKey) => runFn(fnKey, { sn, from, triggerReasons, internal, desc, isFirstCall }));

  const updateIns = (insCtxMap: InsCtxMap, insKey: number) => {
    const insCtx = insCtxMap.get(insKey) as InsCtxDef;
    if (insCtx) {
      insCtx.renderInfo.sn = sn;
      runInsUpdater(insCtx);
    }
  };
  // start update
  allInsKeys.forEach((insKey) => updateIns(insCtxMap, insKey));
  // start update globalId ins
  if (globalInsKeys.length) {
    const globalInsCtxMap = getGlobalEmptyInternal().insCtxMap;
    globalInsKeys.forEach((insKey) => updateIns(globalInsCtxMap, insKey));
  }
}
