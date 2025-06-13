import { noop } from '@helux/utils';
import { finishImmut } from 'limu';
import { DICT, MOUNTED, UNMOUNT } from '../../consts';
import { isAtom } from '../../factory/common/atom';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { INS_CTX } from '../../factory/creator/current';
import { delGlobalIds, mapGlobalIds } from '../../factory/creator/globalId';
import { attachInsProxyState } from '../../helpers/insCtx';
import { clearDep, recoverDep } from '../../helpers/insDep';
import { getInternal } from '../../helpers/state';
import type { Dict, Fn, IInsRenderInfo } from '../../types/base';

/**
 * 记录一些必要的辅助数据，返回 useAtom 需要的元组数据
 */
export function prepareTuple(insCtx: InsCtxDef): [any, Fn, IInsRenderInfo] {
  const { proxyState, internal, renderInfo, canCollect, isReactive } = insCtx;
  const { sharedKey, sharedKeyStr, insSetState, forAtom } = internal;
  renderInfo.snap = internal.snap;
  renderInfo.time = Date.now();
  // atom 自动拆箱，注意这里  proxyState.val 已触发记录根值依赖
  const rootVal = forAtom ? proxyState.val : proxyState;

  // 首次渲染时，记录一下 rootVal
  if (insCtx.isFirstRender) {
    // ATTENTION：这里会提前触发一次 .val 根值依赖记录
    insCtx.rootVal = rootVal;
    // 如果 val 是原始值，多个相同的值会覆盖，造成 useWatch 判断失误
    // 这里会写到文档的常见使用错误里，警示作者避免直接传递原始值给 useWatch deps 函数
    // 此数据会在 useClearEffect 回调里清除
    INS_CTX.set(insCtx.rootVal, insCtx);
  }
  if (!forAtom && canCollect) {
    // 记录一次根值依赖，让未对 useAtom 返回值有任何读操作的组件也响应更新
    insCtx.recordDep({ depKey: sharedKeyStr, keyPath: [], sharedKey }, DICT);
  }

  // 提供给 useReactive 的拆箱行为在 useDrived 里单独处理
  const finalRoot = isReactive ? proxyState : rootVal;
  return [finalRoot, insSetState, renderInfo];
}

export function checkAtom(mayAtom: any, forAtom?: boolean) {
  if (forAtom && !isAtom(mayAtom)) {
    throw new Error('useAtom only accept atom');
  }
}

export function checkStateVer(insCtx: InsCtxDef) {
  const {
    ver,
    internal: { ver: dataVer },
  } = insCtx;
  if (ver === dataVer) {
    return;
  }
  insCtx.ver = dataVer;
  // 替换 proxyState，让把共享对象透传给 memo 组件、useEffect deps 的场景也能正常触发重新渲染
  attachInsProxyState(insCtx);
}

// recover ins ctx (dep,updater etc...) for double mount behavior under react 18 strict mode
export function recoverInsCtx(insCtx: InsCtxDef) {
  insCtx.mountStatus = MOUNTED;
  const { id, globalIds, insKey } = insCtx;
  insCtx.internal.recordId(id, insKey);
  mapGlobalIds(globalIds, insKey);
  recoverDep(insCtx);
}

export function delInsCtx(insCtx: InsCtxDef) {
  insCtx.mountStatus = UNMOUNT;
  const { id, globalIds, insKey, internal, isLoading, isGlobalId } = insCtx;
  internal.delId(id, insKey);
  internal.insCount -= 1;
  if (internal.insCount === 0) {
    internal.lifecycle.willUnmount();
  }
  delGlobalIds(globalIds, insKey);
  clearDep(insCtx);

  if (isLoading || isGlobalId) {
    // 1 把组件使用的共享状态对应的伴生状态清理掉
    // 2 把 useGlobalId 对应状态清理掉
    try {
      const proxyState = insCtx.proxyState;
      finishImmut(proxyState);
    } catch (err: any) {
      noop(err);
      // 对 limu 尝试做数据清理，避免 ROOT_CTX 持有过多的无用 metaMap
      // err: Not a Limu root draft or draft has been finished!
      // 这里可静默如上错误，因会有一次 react-dom 的 safelyCallDestroy 调用，
      // 导致对同一个代理对象做两次结束草稿而报错
    }
  }
}

/**
 * at hot-reload mode, shared key may be changed
 */
export function isSharedKeyChanged<T = Dict>(insCtx: InsCtxDef, sharedState: T) {
  const curSharedKey = getInternal(sharedState).sharedKey;
  return insCtx.internal.sharedKey !== curSharedKey;
}
