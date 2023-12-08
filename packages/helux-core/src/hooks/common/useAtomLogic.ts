import { Fn } from 'helux';
import { MOUNTED, RENDER_END, RENDER_START } from '../../consts';
import type { InsCtxDef } from '../../factory/creator/buildInternal';
import { INS_CTX } from '../../factory/creator/current';
import { buildInsCtx } from '../../helpers/insCtx';
import { resetDepHelpData, updateDep } from '../../helpers/insDep';
import { getInternal } from '../../helpers/state';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Dict, IInnerUseSharedOptions, IInsRenderInfo } from '../../types/base';
import { checkAtom, checkStateVer, delInsCtx, isSharedKeyChanged, prepareTuple, recoverInsCtx } from './shared';
import { useSync } from './useSync';

// for skip ts check out of if block
const nullInsCtx = null as unknown as InsCtxDef;

/**
 * 生成组件对应的上下文
 */
function useInsCtx<T = Dict>(apiCtx: CoreApiCtx, sharedState: T, options: IInnerUseSharedOptions<T>): InsCtxDef {
  const { hookImpl, react } = apiCtx;
  const updater = hookImpl.useForceUpdate();
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
 * 组件初次加载、卸载前相关副作用
 */
function useClearEffect(apiCtx: CoreApiCtx, insCtx: InsCtxDef) {
  apiCtx.react.useEffect(() => {
    INS_CTX.del(insCtx.rootVal);
    // 设定了 options.collect='first' 则首轮渲染结束后标记不能再收集依赖，阻值后续新的渲染流程里继续收集依赖的行为
    if (insCtx.collectType === 'first') {
      insCtx.canCollect = false;
    }

    insCtx.mountStatus = MOUNTED;
    recoverInsCtx(insCtx);
    return () => {
      delInsCtx(insCtx);
    };
  }, [insCtx]);
}

/**
 * 收集组件渲染需要的依赖，做一些其他设置逻辑
 */
function useCollectDep<T = Dict>(apiCtx: CoreApiCtx, sharedState: T, insCtx: InsCtxDef, options: IInnerUseSharedOptions<T>) {
  insCtx.renderStatus = RENDER_START;
  resetDepHelpData(insCtx);
  // adapt to react 18
  useSync(apiCtx, insCtx.subscribe, () => getInternal(sharedState).snap);

  // start update dep in every render period
  apiCtx.react.useEffect(() => {
    insCtx.renderStatus = RENDER_END;
    insCtx.isFirstRender = false;
    updateDep(insCtx);
  });
}

/**
 * 裁剪后的 useSharedLogic，供 signal 模块 和 useGlobalId 调用
 */
export function useAtomSimpleLogic<T extends Dict = Dict>(
  apiCtx: CoreApiCtx,
  sharedState: T,
  options: IInnerUseSharedOptions<T> = {},
): InsCtxDef {
  const insCtx = useInsCtx(apiCtx, sharedState, options);
  // adapt to react 18
  useSync(apiCtx, insCtx.subscribe, () => getInternal(sharedState).snap);
  useClearEffect(apiCtx, insCtx);

  return insCtx;
}

export function useAtomLogic<T = Dict>(
  apiCtx: CoreApiCtx,
  sharedState: T,
  options: IInnerUseSharedOptions<T> = {},
): { tuple: [any, Fn, IInsRenderInfo]; insCtx: InsCtxDef } {
  const { forAtom } = options;
  checkAtom(sharedState, forAtom);
  const insCtx = useInsCtx(apiCtx, sharedState, options);
  useCollectDep(apiCtx, sharedState, insCtx, options);
  useClearEffect(apiCtx, insCtx);
  checkStateVer(insCtx);
  const tuple = prepareTuple(insCtx);

  return { tuple, insCtx };
}
