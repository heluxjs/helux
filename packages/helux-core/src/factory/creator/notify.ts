import { dedupList, nodupPush } from '@helux/utils';
import { markFnEnd } from '../../helpers/fnCtx';
import { getDepFnStats } from '../../helpers/fnDep';
import { runFn } from '../../helpers/fnRunner';
import { markComputing } from '../../helpers/fnStatus';
import { runInsUpdater } from '../../helpers/insCtx';
import type { Dict, InsCtxMap } from '../../types/base';
import { clearDiff, diffVal, hasChangedNode } from '../common/sharedScope';
import { FN_DEP_KEYS } from '../creator/current';
import type { InsCtxDef } from './buildInternal';
import { getGlobalEmptyInternal, getGlobalIdInsKeys } from './globalId';
import type { ICommitOpts } from './mutateDeep';

export function updateIns(insCtxMap: InsCtxMap, insKey: number, sn: number) {
  const insCtx = insCtxMap.get(insKey) as InsCtxDef;
  if (insCtx) {
    // 透传变更批次编号给示例，方便标记多个实例的更新是否来自于同一批次
    insCtx.renderInfo.sn = sn;
    runInsUpdater(insCtx);
  }
}

/**
 * 相关依赖函数执行（render渲染函数，derive派生函数，watch观察函数）
 */
export function execDepFns(opts: ICommitOpts) {
  const { mutateCtx, internal } = opts;
  const { ids, globalIds, depKeys, triggerReasons, isFirstCall, from, sn, desc, fnKey: fromFnKey } = mutateCtx;
  const { key2InsKeys, id2InsKeys, insCtxMap, rootValKey } = internal;

  // these associate ins keys will be update
  let dirtyInsKeys: number[] = [];
  let dirtyGlobalInsKeys: number[] = [];
  // these associate derived/watch fn will be update
  let dirtyFnKeys: string[] = [];
  let dirtyAsyncFnKeys: string[] = [];
  const runCountStats: Dict<number> = {};

  // 提前结束依赖收集，防止后续的 watch 步骤里执行其他函数收集到脏依赖
  if (isFirstCall) {
    const depKeys = markFnEnd();
    FN_DEP_KEYS.set(depKeys);
  }

  const findDirtyFnKeys = (key: string, forSharedKey = false) => {
    // 通过根值去查询 fnCtx，内部再根据自己的依赖比较后得出需要执行的函数
    const { firstLevelFnKeys, asyncFnKeys } = getDepFnStats(internal, key, runCountStats, forSharedKey);
    dirtyFnKeys = dirtyFnKeys.concat(firstLevelFnKeys);
    dirtyAsyncFnKeys = dirtyAsyncFnKeys.concat(asyncFnKeys);
  };

  const analyzeDepKey = (key: string) => {
    // 值相等就忽略
    if (!diffVal(internal, key)) {
      return;
    }

    const insKeys = key2InsKeys[key] || [];
    const validInsKeys: number[] = [];
    for (const insKey of insKeys) {
      // 已包含或已排除，都跳过当次循环
      if (dirtyInsKeys.includes(insKey)) {
        continue;
      }
      const insCtx = insCtxMap.get(insKey);
      // TODO 考虑是否加上此判断？
      // if (!insCtx || insCtx.renderStatus === RENDER_START) {
      if (!insCtx) {
        continue;
      }
      const depKeys = insCtx.getDeps();
      // 未对 useAtom 返回值有任何读操作时
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
    dirtyInsKeys = dirtyInsKeys.concat(validInsKeys);
    findDirtyFnKeys(key);
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
  // fix issue 136
  findDirtyFnKeys(rootValKey, true);

  // clear cached diff result
  clearDiff();
  // find id's ins keys
  ids.forEach((id) => {
    dirtyInsKeys = dirtyInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys, fn keys
  globalIds.forEach((id) => {
    getGlobalIdInsKeys(id).forEach((insKey) => nodupPush(dirtyGlobalInsKeys, insKey));
  });

  // deduplicate
  dirtyInsKeys = dedupList(dirtyInsKeys);
  dirtyFnKeys = dedupList(dirtyFnKeys);
  dirtyAsyncFnKeys = dedupList(dirtyAsyncFnKeys);
  // start mark async derive fn computing
  dirtyAsyncFnKeys.forEach((fnKey) => markComputing(fnKey, runCountStats[fnKey]));
  // start execute derive/watch fns
  const watchFnKeys: string[] = [];
  const runOptions = { depKeys, sn, from, triggerReasons, watchFnKeys, skipWatch: true, internal, desc, isFirstCall, fromFnKey };
  dirtyFnKeys.forEach((fnKey) => runFn(fnKey, runOptions));
  const runOptionsOfWatch = { depKeys, sn, from, triggerReasons, internal, desc, isFirstCall, fromFnKey };
  watchFnKeys.forEach((fnKey) => runFn(fnKey, runOptionsOfWatch));

  // start trigger rerender
  dirtyInsKeys.forEach((insKey) => updateIns(insCtxMap, insKey, sn));
  // start update globalId ins
  if (dirtyGlobalInsKeys.length) {
    const globalInsCtxMap = getGlobalEmptyInternal().insCtxMap;
    dirtyGlobalInsKeys.forEach((insKey) => updateIns(globalInsCtxMap, insKey, sn));
  }
}
