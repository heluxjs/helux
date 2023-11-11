import { MOUNTED, RENDER_END, RENDER_START } from '../../consts';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { buildInsCtx } from '../../helpers/insCtx';
import { resetReadMap, updateDep } from '../../helpers/insDep';
import { getInternal } from '../../helpers/state';
import { react } from '../../react';
import type { Dict, IInnerUseSharedOptions } from '../../types';
import { useForceUpdate } from './../useForceUpdate';
import { checkAtom, checkStateVer, delInsCtx, isSharedKeyChanged, readExtraDeps, recoverInsCtx } from './shared';
import { useSync } from './useSync';

// for skip ts check out of if block
const nullInsCtx = null as unknown as InsCtxDef;

/**
 * 生成组件对应的上下文
 */
function useInsCtx<T = Dict>(sharedState: T, options: IInnerUseSharedOptions<T>): InsCtxDef {
  const updater = useForceUpdate();
  const ctxRef = react.useRef<{ ctx: InsCtxDef }>({ ctx: nullInsCtx });
  // start build or rebuild ins ctx
  let insCtx = ctxRef.current.ctx;
  if (!insCtx || isSharedKeyChanged(insCtx, sharedState)) {
    insCtx = buildInsCtx({ updater, sharedState, ...options });
    ctxRef.current.ctx = insCtx;
  }

  return insCtx;
}

/**
 * 组件卸载清理相关依赖
 */
function useDelInsCtxEffect(insCtx: InsCtxDef) {
  react.useEffect(() => {
    insCtx.mountStatus = MOUNTED;
    recoverInsCtx(insCtx);
    return () => {
      delInsCtx(insCtx);
    };
  }, [insCtx]);
}

/**
 * 收集组件渲染需要的依赖
 */
function useDepCollection<T = Dict>(sharedState: T, insCtx: InsCtxDef, options: IInnerUseSharedOptions<T>) {
  insCtx.renderStatus = RENDER_START;
  resetReadMap(insCtx);
  readExtraDeps(insCtx, options);
  // adapt to react 18
  useSync(insCtx.subscribe, () => getInternal(sharedState).snap);

  // start update dep in every render period
  react.useEffect(() => {
    insCtx.renderStatus = RENDER_END;
    insCtx.isFirstRender = false;
    updateDep(insCtx);
  });
}

/**
 * 裁剪后的 useSharedLogic，供 signal 模块 和 useGlobalId 调用
 */
export function useSharedSimpleLogic<T extends Dict = Dict>(sharedState: T, options: IInnerUseSharedOptions<T> = {}): InsCtxDef {
  const insCtx = useInsCtx(sharedState, options);
  // adapt to react 18
  useSync(insCtx.subscribe, () => getInternal(sharedState).snap);
  useDelInsCtxEffect(insCtx);

  return insCtx;
}

export function useSharedLogic<T = Dict>(sharedState: T, options: IInnerUseSharedOptions<T> = {}): InsCtxDef {
  checkAtom(sharedState, options.forAtom);
  const insCtx = useInsCtx(sharedState, options);
  useDepCollection(sharedState, insCtx, options);
  useDelInsCtxEffect(insCtx);
  checkStateVer(insCtx);

  return insCtx;
}
