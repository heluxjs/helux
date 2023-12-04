import { dedupList, nodupPush } from '@helux/utils';
import { markFnEnd } from '../../helpers/fnCtx';
import { getDepFnStats } from '../../helpers/fnDep';
import { runFn } from '../../helpers/fnRunner';
import { markComputing } from '../../helpers/fnStatus';
import { runInsUpdater } from '../../helpers/insCtx';
import type { Dict, InsCtxMap } from '../../types/base';
import { clearDiff, diffVal, hasChangedNode } from '../common/sharedScope';
import type { InsCtxDef } from './buildInternal';
import type { ICommitStateOptions } from './commitState';
import { getGlobalEmptyInternal, getGlobalIdInsKeys } from './globalId';

function updateIns(insCtxMap: InsCtxMap, insKey: number, sn: number) {
  const insCtx = insCtxMap.get(insKey) as InsCtxDef;
  if (insCtx) {
    insCtx.renderInfo.sn = sn;
    runInsUpdater(insCtx);
  }
}

/**
 * 相关依赖函数执行（render渲染函数，derive派生函数，watch观察函数）
 */
export function execDepFns(opts: ICommitStateOptions) {
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

  const analyzeDepKey = (key: string) => {
    // 值相等就忽略
    if (!diffVal(internal, key)) {
      return;
    }

    const insKeys = key2InsKeys[key] || [];
    const validInsKeys: number[] = [];
    for (const insKey of insKeys) {
      // 已包含或已排除，都跳过当次循环
      if (allInsKeys.includes(insKey)) {
        continue;
      }
      const insCtx = insCtxMap.get(insKey);
      if (!insCtx) {
        continue;
      }
      const depKeys = insCtx.getDeps();
      // 未对 useState useAtom 返回值有任何读操作时
      if (depKeys[0] === rootValKey) {
        if (diffVal(internal, rootValKey)) {
          validInsKeys.push(insKey);
        }
        continue;
      }

      if (hasChangedNode(internal, depKeys, key)) {
        validInsKeys.push(insKey);
      }
    }

    allInsKeys = allInsKeys.concat(validInsKeys);
    const { firstLevelFnKeys, asyncFnKeys } = getDepFnStats(internal, key, runCountStats);
    allFirstLevelFnKeys = allFirstLevelFnKeys.concat(firstLevelFnKeys);
    allAsyncFnKeys = allAsyncFnKeys.concat(asyncFnKeys);
  };
  depKeys.forEach((k) => analyzeDepKey(k));
  // 分析 rootValKey 结果刻意放 depKeys.forEach 之后执行，是需要复用 sharedScope.isStateChanged 结果，有以下2个作用
  // 1 watch derive 的 deps 函数里如观察的共享对象本身的变化，需以 rootValKey 为依赖去查出来
  // 2 子串更新时，还能够查出只读取了父路径的组件并触发更新
  // 例如，comp1: a.b.c.d , comp2: a.b
  // 更新 draft.a.b.c.d = 1000, 导致 a.b 也变了，按 a.b.c.d 去查组件实例是查不到 comp2 的
  // 这里通过 rootValKey 依靠 depKey&insKey 不对称记录机制可找到 comp2 并触发其实例更新
  if (!depKeys.includes(rootValKey)) {
    analyzeDepKey(rootValKey);
  }
  // clear cached diff result
  clearDiff();
  // find id's ins keys
  ids.forEach((id) => {
    allInsKeys = allInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys, fn keys
  globalIds.forEach((id) => {
    getGlobalIdInsKeys(id).forEach((insKey) => nodupPush(globalInsKeys, insKey));
  });

  // deduplicate
  allInsKeys = dedupList(allInsKeys);
  allFirstLevelFnKeys = dedupList(allFirstLevelFnKeys);
  allAsyncFnKeys = dedupList(allAsyncFnKeys);
  // start execute derive/watch fns
  allAsyncFnKeys.forEach((fnKey) => markComputing(fnKey, runCountStats[fnKey]));
  allFirstLevelFnKeys.forEach((fnKey) => runFn(fnKey, { sn, from, triggerReasons, internal, desc, isFirstCall }));

  // start trigger rerender
  allInsKeys.forEach((insKey) => updateIns(insCtxMap, insKey, sn));
  // start update globalId ins
  if (globalInsKeys.length) {
    const globalInsCtxMap = getGlobalEmptyInternal().insCtxMap;
    globalInsKeys.forEach((insKey) => updateIns(globalInsCtxMap, insKey, sn));
  }
}
