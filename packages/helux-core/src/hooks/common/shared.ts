import { isAtom } from '../../factory/common/atom';
import type { InsCtxDef, TInternal } from '../../factory/creator/buildInternal';
import { delGlobalId, mapGlobalId } from '../../factory/creator/globalId';
import { attachInsProxyState } from '../../helpers/insCtx';
import { clearDep, recoverDep } from '../../helpers/insDep';
import { getInternal } from '../../helpers/state';
import type { Dict } from '../../types/base';

/**
 * let code beblow works;
 * const [dict] = useAtom(dictAtom);
 * useWatch(()=>{}, ()=>[dict]);
 */
const atomValMap = new Map<any, any>();
window.ww = atomValMap;

export function recordAtomVal(insCtx: InsCtxDef) {
  if (insCtx.isFirstRender && insCtx.internal.forAtom) {
    insCtx.atomVal = insCtx.proxyState.val;
    // 如果 val 是原始值，多个相同的值会覆盖，造成 useWatch 判断失误
    // 这里会写到文档的常见使用错误里，警示作者避免直接传递原始值给 useWatch deps 函数
    atomValMap.set(insCtx.atomVal, insCtx.internal);
  }
}

export function delAtomVal(val: any) {
  atomValMap.delete(val);
}

export function getAtomValInternal(val: any): TInternal | undefined {
  return atomValMap.get(val);
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
  if (ver !== dataVer) {
    // 替换 proxyState，让把共享对象透传给 memo 组件的场景也能正常触发重新渲染
    insCtx.ver = dataVer;
    attachInsProxyState(insCtx);
  }
}

// recover ins ctx (dep,updater etc...) for double mount behavior under react 18 strict mode
export function recoverInsCtx(insCtx: InsCtxDef) {
  const { id, globalId, insKey } = insCtx;
  insCtx.internal.recordId(id, insKey);
  mapGlobalId(globalId, insKey);
  recoverDep(insCtx);
}

export function delInsCtx(insCtx: InsCtxDef) {
  const { id, globalId, insKey } = insCtx;
  insCtx.internal.delId(id, insKey);
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
