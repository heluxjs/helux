import { MOUNTED, RENDER_END, RENDER_START, SCOPE_TYPE } from '../../consts';
import { buildFnCtx, delFnCtx } from '../../helpers/fnCtx';
import { getDepSharedStateFeature, recoverDep } from '../../helpers/fnDep';
import { attachInsDerivedResult } from '../../helpers/insCtx';
import { react } from '../../react';
import type { IFnCtx, IRenderInfo, LoadingStatus } from '../../types';
import { useForceUpdate } from '../useForceUpdate';
import { genDerivedResult, IUseDerivedLogicOptions } from './derived';
import { useSync } from './useSync';

function useFnCtx(options: IUseDerivedLogicOptions): IFnCtx {
  const { fn, task, deps, showProcess, asyncType, forAtom } = options;
  const updater = useForceUpdate();
  const deriveCtxRef = react.useRef({ input: fn, deriveFn: null });
  const [fnCtx] = react.useState(() => {
    return buildFnCtx({ updater, scopeType: SCOPE_TYPE.HOOK, forAtom });
  });
  fnCtx.renderStatus = RENDER_START;
  genDerivedResult({ fn, task, deps, deriveCtx: deriveCtxRef.current, showProcess, fnCtx, asyncType, forAtom });

  return fnCtx;
}

function useReplace(fnCtx: IFnCtx) {
  if (fnCtx.shouldReplaceResult) {
    attachInsDerivedResult(fnCtx);
    fnCtx.shouldReplaceResult = false;
  }
  // adapt to react 18
  useSync(fnCtx.subscribe, () => getDepSharedStateFeature(fnCtx));
  react.useEffect(() => {
    fnCtx.renderStatus = RENDER_END;
  });
}

function useDelFnCtxEffect(fnCtx: IFnCtx) {
  react.useEffect(() => {
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
export function useDerivedSimpleLogic(options: IUseDerivedLogicOptions): IFnCtx {
  const fnCtx = useFnCtx(options);
  useSync(fnCtx.subscribe, () => getDepSharedStateFeature(fnCtx));
  useDelFnCtxEffect(fnCtx);

  return fnCtx;
}

export function useDerivedLogic(options: IUseDerivedLogicOptions): IFnCtx {
  const fnCtx = useFnCtx(options);
  useReplace(fnCtx);
  useDelFnCtxEffect(fnCtx);

  return fnCtx;
}
