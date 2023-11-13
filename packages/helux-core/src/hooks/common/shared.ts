import { isAtom } from '../../factory/common/atom';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { delGlobalId, mapGlobalId } from '../../factory/creator/globalId';
import { attachInsProxyState } from '../../helpers/insCtx';
import { clearDep, recoverDep } from '../../helpers/insDep';
import { getInternal } from '../../helpers/state';
import type { Dict, IUseSharedOptions } from '../../types';
import { isFn } from '../../utils';

export function checkAtom(mayAtom: any, forAtom?: boolean) {
  if (forAtom && !isAtom(mayAtom)) {
    throw new Error('must supply atom state to useAtom');
  }
}

export function checkAtomResult(mayAtom: any, forAtom?: boolean) {
  if (forAtom && !isAtom(mayAtom)) {
    throw new Error('must supply atom state to useAtom');
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

/** 如已经设置 staticDeps，将不会执行 extraDeps */
export function readExtraDeps(insCtx: InsCtxDef, options: IUseSharedOptions) {
  if (insCtx.hasStaticDeps) {
    return;
  }
  if (isFn(options.extraDeps)) {
    options.extraDeps(insCtx.proxyState);
  }
}

/**
 * at hot-reload mode, shared key may be changed
 */
export function isSharedKeyChanged<T = Dict>(insCtx: InsCtxDef, sharedState: T) {
  const curSharedKey = getInternal(sharedState).sharedKey;
  return insCtx.internal.sharedKey !== curSharedKey;
}
