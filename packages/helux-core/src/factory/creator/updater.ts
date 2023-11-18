import { dedupList } from 'helux-utils';
import { getDepFnStats } from '../../helpers/fnDep';
import { runFn } from '../../helpers/fnRunner';
import { markComputing } from '../../helpers/fnStatus';
import { runInsUpdater } from '../../helpers/insCtx';
import type { Dict, InsCtxMap } from '../../types/base';
import { genRenderSN } from '../common/key';
import type { InsCtxDef } from './buildInternal';
import type { ICommitStateOptions } from './commitState';
import { getGlobalEmptyInternal, getGlobalIdInsKeys } from './globalId';

export function execDepFnAndInsUpdater(opts: ICommitStateOptions) {
  const { mutateCtx, internal, desc, isFirstCall, from } = opts;
  const { ids, globalIds, depKeys, triggerReasons } = mutateCtx;
  const { key2InsKeys, id2InsKeys, insCtxMap, sharedKey } = internal;

  internal.ver += 1;
  // find associate ins keys
  let allInsKeys: number[] = [];
  let globalInsKeys: number[] = [];
  // find associate derived/watch fn ctxs
  let allFirstLevelFnKeys: string[] = [];
  let allAsyncFnKeys: string[] = [];
  const runCountStats: Dict<number> = {};

  const analyzeDepKey = (key: string) => {
    allInsKeys = allInsKeys.concat(key2InsKeys[key] || []);
    const { firstLevelFnKeys, asyncFnKeys } = getDepFnStats(key, runCountStats);
    allFirstLevelFnKeys = allFirstLevelFnKeys.concat(firstLevelFnKeys);
    allAsyncFnKeys = allAsyncFnKeys.concat(asyncFnKeys);
  };
  depKeys.forEach(analyzeDepKey);
  // 直接设定 watchList 的 watch 函数，观察的共享对象本身的变化，这里以 sharedKey 为依赖去取查出来
  analyzeDepKey(`${sharedKey}`);
  // find id's ins keys
  ids.forEach((id) => {
    allInsKeys = allInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys, fn keys
  globalIds.forEach((id) => {
    getGlobalIdInsKeys(id).forEach((insKey) => globalInsKeys.push(insKey));
  });

  // sn 序号相同表示同一批次触发重渲染
  const sn = opts.sn || genRenderSN();
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
