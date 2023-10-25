import { useEffect, useRef } from 'react';
import { IS_SHARED, MOUNTED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import type { InsCtxDef, TInternal } from '../factory/common/buildInternal';
import { buildInsCtx } from '../helpers/ins';
import { resetReadMap, updateDep } from '../helpers/insdep';
import { getInternal, getRawState } from '../helpers/state';
import type { Atom, Dict, IInnerUseSharedOptions, IRenderInfo, IUseSharedOptions, SetAtom, SetState } from '../types';
import { checkAtom, checkStateVer, clearInsCtx, isSharedKeyChanged, readExtraDeps, recoverInsCtx } from './common/shared';
import { useSync } from './common/useSync';
import { useObjectLogic } from './useObject';

// for skip ts check that after if block
const nullInsCtx = null as unknown as InsCtxDef;

function useSharedLogic<T extends Dict = Dict>(sharedState: T, options: IInnerUseSharedOptions<T> = {}): [T, TInternal, IRenderInfo] {
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
  const { internal, renderInfo } = insCtx;
  return [insCtx.proxyState, internal, renderInfo];
}

export function useShared<T extends Dict = Dict>(sharedState: T, options: IUseSharedOptions<T> = {}): [T, SetState<T>, IRenderInfo] {
  const [proxyState, internal, info] = useSharedLogic(sharedState, options);
  return [proxyState, internal.setState, info];
}

export function useAtom<T extends any = any>(sharedState: Atom<T>, options: IUseSharedOptions<Atom<T>> = {}): [T, SetAtom<T>, IRenderInfo] {
  const [proxyState, internal, info] = useSharedLogic(sharedState, { ...options, forAtom: true });
  return [proxyState.val, internal.setAtom, info];
}
