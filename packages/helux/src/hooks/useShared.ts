import { useEffect, useRef } from 'react';
import { IS_SHARED, MOUNTED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import type { InsCtxDef, TInternal } from '../factory/common/buildInternal';
import { isAtomProxy } from '../factory/common/util';
import { delGlobalId, mapGlobalId } from '../factory/root';
import { attachInsProxyState, buildInsCtx } from '../helpers/ins';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/insdep';
import { getInternal, getRawState } from '../helpers/state';
import type { Atom, Dict, IInnerUseSharedOptions, IUseSharedOptions, RenderInfo, SetAtom, SetState } from '../types';
import { isFn } from '../utils';
import { useSync } from './common/useSync';
import { useObjectLogic } from './useObject';

// for skip ts check that after if block
const nullInsCtx = null as unknown as InsCtxDef;

function checkAtom(mayAtom: any, forAtom?: boolean) {
  if (forAtom && !isAtomProxy(mayAtom)) {
    throw new Error('must supply atom state to useAtom');
  }
}

function checkStateVer(insCtx: InsCtxDef, options: IUseSharedOptions) {
  const {
    ver,
    internal: { ver: dataVer },
  } = insCtx;
  if (ver !== dataVer) {
    // 替换 proxyState，让把共享对象透传给 memo 组件的场景也能正常触发重新渲染
    insCtx.ver = dataVer;
    attachInsProxyState(insCtx, options.enableReactive);
  }
}

// recover ins ctx (dep,updater etc...) for double mount behavior under react strict mode
function recoverInsCtx(insCtx: InsCtxDef) {
  const { id, globalId, insKey } = insCtx;
  insCtx.internal.recordId(id, insKey);
  mapGlobalId(globalId, insKey);
  recoverDep(insCtx);
}

function clearInsCtx(insCtx: InsCtxDef) {
  const { id, globalId, insKey } = insCtx;
  insCtx.internal.delId(id, insKey);
  delGlobalId(globalId, insKey);
  clearDep(insCtx);
}

/** 如已经设置 staticDeps， extraDeps 将不会执行 */
function readExtraDeps(insCtx: InsCtxDef, options: IUseSharedOptions) {
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
function isSharedKeyChanged<T extends Dict = Dict>(insCtx: InsCtxDef, sharedState: T) {
  const curSharedKey = getInternal(sharedState).sharedKey;
  return insCtx.internal.sharedKey !== curSharedKey;
}

function useSharedLogic<T extends Dict = Dict>(sharedState: T, options: IInnerUseSharedOptions<T> = {}): [T, TInternal, RenderInfo] {
  checkAtom(sharedState, options.forAtom);
  const rawState = getRawState(sharedState);

  const [, setState] = useObjectLogic(rawState, { force: true, [IS_SHARED]: true, [SKIP_MERGE]: true });
  const ctxRef = useRef<{ ctx: InsCtxDef }>({ ctx: nullInsCtx });

  // start build or rebuild ins ctx
  let insCtx = ctxRef.current.ctx;
  if (!insCtx || isSharedKeyChanged(insCtx, sharedState)) {
    insCtx = buildInsCtx({ setState, sharedState, ...options });
    ctxRef.current.ctx = insCtx;
  }

  insCtx.renderStatus = RENDER_START;
  resetReadMap(insCtx);
  readExtraDeps(insCtx, options);
  // adapt to react 18
  useSync(insCtx.subscribe, () => getInternal(sharedState).rawStateSnap);

  // start update dep in every render period
  useEffect(() => {
    insCtx.renderStatus = RENDER_END;
    insCtx.isFirstRender = false;
    updateDep(insCtx);
  });

  useEffect(() => {
    insCtx.mountStatus = MOUNTED;
    recoverInsCtx(insCtx);
    return () => {
      clearInsCtx(insCtx);
    };
  }, [insCtx]);

  checkStateVer(insCtx, options);
  const { internal, renderSN } = insCtx;
  return [insCtx.proxyState, internal, { renderSN }];
}

export function useShared<T extends Dict = Dict>(sharedState: T, options: IUseSharedOptions<T> = {}): [T, SetState<T>, RenderInfo] {
  const [proxyState, internal, info] = useSharedLogic(sharedState, options);
  return [proxyState, internal.setState, info];
}

export function useAtom<T extends any = any>(sharedState: Atom<T>, options: IUseSharedOptions<Atom<T>> = {}): [T, SetAtom<T>, RenderInfo] {
  const [proxyState, internal, info] = useSharedLogic(sharedState, { ...options, forAtom: true });
  return [proxyState.val, internal.setAtom, info];
}
