import { DICT, MOUNTED, UNMOUNT } from '../../consts';
import { isAtom } from '../../factory/common/atom';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { INS_CTX } from '../../factory/creator/current';
import { delGlobalId, mapGlobalId } from '../../factory/creator/globalId';
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
  const { id, globalId, insKey } = insCtx;
  insCtx.internal.recordId(id, insKey);
  mapGlobalId(globalId, insKey);
  recoverDep(insCtx);
}

export function delInsCtx(insCtx: InsCtxDef) {
  insCtx.mountStatus = UNMOUNT;
  const { id, globalId, insKey, internal } = insCtx;
  internal.delId(id, insKey);
  internal.insCount -= 1;
  if (internal.insCount === 0) {
    internal.lifecycle.willUnmount();
  }
  delGlobalId(globalId, insKey);
  clearDep(insCtx);
}

/**
 * at hot-reload mode, shared key may be changed
 */
export function isSharedKeyChanged<T = Dict>(insCtx: InsCtxDef, sharedState: T) {
  const curSharedKey = getInternal(sharedState).sharedKey;
  return insCtx.internal.sharedKey !== curSharedKey;
}
