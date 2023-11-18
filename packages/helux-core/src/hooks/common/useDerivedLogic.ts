import { MOUNTED, RENDER_END, RENDER_START, SCOPE_TYPE } from '../../consts';
import { buildFnCtx, delFnCtx } from '../../helpers/fnCtx';
import { getDepSharedStateFeature, recoverDep } from '../../helpers/fnDep';
import { attachInsDerivedResult } from '../../helpers/insCtx';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { IFnCtx, IRenderInfo, LoadingStatus } from '../../types/base';
import { genDerivedResult, IUseDerivedLogicOptions } from './derived';
import { useSync } from './useSync';

function useFnCtx(apiCtx: CoreApiCtx, options: IUseDerivedLogicOptions): IFnCtx {
  const { result, forAtom } = options;
  const { hookImpl, react } = apiCtx;
  const updater = hookImpl.useForceUpdate();
  const { current: deriveCtx } = react.useRef<{ input: any; deriveFn: any; fnCtx: any }>({ input: result, deriveFn: null, fnCtx: null });
  if (!deriveCtx.fnCtx) {
    deriveCtx.fnCtx = buildFnCtx({ updater, scopeType: SCOPE_TYPE.HOOK, forAtom });
  }
  const fnCtx = deriveCtx.fnCtx;
  fnCtx.renderStatus = RENDER_START;
  genDerivedResult(deriveCtx, options);

  return fnCtx;
}

function useReplace(apiCtx: CoreApiCtx, fnCtx: IFnCtx) {
  if (fnCtx.shouldReplaceResult) {
    attachInsDerivedResult(fnCtx);
    fnCtx.shouldReplaceResult = false;
  }
  // adapt to react 18
  useSync(apiCtx, fnCtx.subscribe, () => getDepSharedStateFeature(fnCtx));
  apiCtx.react.useEffect(() => {
    fnCtx.renderStatus = RENDER_END;
  });
}

function useFnCtxEffect(apiCtx: CoreApiCtx, fnCtx: IFnCtx) {
  apiCtx.react.useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    recoverDep(fnCtx);
    return () => {
      delFnCtx(fnCtx);
    };
  }, [fnCtx]);
}

export function getTuple<R>(fnCtx: IFnCtx): [R, LoadingStatus, IRenderInfo] {
  return [fnCtx.proxyResult as R, fnCtx.status, fnCtx.renderInfo];
}

export function getAtomTuple<R>(fnCtx: IFnCtx): [R, LoadingStatus, IRenderInfo] {
  return [fnCtx.proxyResult.val as R, fnCtx.status, fnCtx.renderInfo];
}

/**
 * 裁剪后的 useSharedLogic，供 signal 模块 调用
 */
export function useDerivedSimpleLogic(apiCtx: CoreApiCtx, options: IUseDerivedLogicOptions): IFnCtx {
  const fnCtx = useFnCtx(apiCtx, options);
  useSync(apiCtx, fnCtx.subscribe, () => getDepSharedStateFeature(fnCtx));
  useFnCtxEffect(apiCtx, fnCtx);

  return fnCtx;
}

export function useDerivedLogic(apiCtx: CoreApiCtx, options: IUseDerivedLogicOptions): IFnCtx {
  const fnCtx = useFnCtx(apiCtx, options);
  useReplace(apiCtx, fnCtx);
  useFnCtxEffect(apiCtx, fnCtx);

  return fnCtx;
}
