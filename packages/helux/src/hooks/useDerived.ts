import { useEffect, useRef, useState } from 'react';
import { ASYNC_TYPE, MOUNTED, RENDER_END, RENDER_START, SCOPE_TYPE } from '../consts';
import { buildFnCtx, delFnCtx, getDepSharedStateFeature, recoverDep } from '../helpers/fndep';
import { attachInsDerivedResult } from '../helpers/ins';
import type {
  Atom,
  DeriveAtomFn,
  DerivedAtom,
  DerivedResult,
  DeriveFn,
  Dict,
  IAsyncTaskParams,
  IDeriveFnParams,
  IRenderInfo,
  IsComputing,
  PlainObject,
} from '../types';
import { noop } from '../utils';
import { genDerivedResult, IUseDerivedOptions } from './common/derived';
import { useSync } from './common/useSync';
import { useForceUpdate } from './useForceUpdate';

const { SOURCE, TASK } = ASYNC_TYPE;

function useDerivedLogic<R>(options: IUseDerivedOptions): [R, IsComputing, IRenderInfo] {
  const { fn, sourceFn = noop, enableRecordResultDep = false, careDeriveStatus, asyncType } = options;
  const deriveCtxRef = useRef({ input: fn, deriveFn: null });
  const updater = useForceUpdate();
  const [fnCtx] = useState(() => {
    return buildFnCtx({ updater, enableRecordResultDep, scopeType: SCOPE_TYPE.HOOK });
  });
  fnCtx.renderStatus = RENDER_START;
  genDerivedResult({ deriveCtx: deriveCtxRef.current, careDeriveStatus, fn, sourceFn, fnCtx, asyncType });

  if (fnCtx.enableRecordResultDep) {
    fnCtx.isResultReaded = false; // 待到 proxy 里产生读取行为时，会被置为 true
  }
  if (fnCtx.shouldReplaceResult) {
    attachInsDerivedResult(fnCtx);
    fnCtx.shouldReplaceResult = false;
  }
  // adapt to react 18
  useSync(fnCtx.subscribe, () => getDepSharedStateFeature(fnCtx));

  useEffect(() => {
    fnCtx.renderStatus = RENDER_END;
  });

  useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    recoverDep(fnCtx);
    return () => {
      delFnCtx(fnCtx);
    };
  }, [fnCtx]);

  return [fnCtx.proxyResult as R, fnCtx.isComputing, fnCtx.renderInfo];
}

export function useDerived<R extends PlainObject = PlainObject>(
  resultOrFn: DerivedResult<R> | DeriveFn<R>,
  enableRecordResultDep?: boolean,
) {
  const resultTuple = useDerivedLogic<R>({ fn: resultOrFn, enableRecordResultDep });
  return resultTuple;
}

export function useDerivedAsync<S extends any = any, R extends PlainObject = PlainObject>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S, R>) => Promise<R>,
  enableRecordResultDep?: boolean,
) {
  const resultTuple = useDerivedLogic({
    fn: deriveFn,
    sourceFn,
    enableRecordResultDep,
    careDeriveStatus: true,
    asyncType: SOURCE,
  });
  return resultTuple as [R, IsComputing, IRenderInfo];
}

export function useDerivedTask<R extends Dict = Dict>(
  deriveFn: (taskParams: IDeriveFnParams) => { initial: R; task: () => Promise<R> },
  enableRecordResultDep?: boolean,
) {
  const resultTuple = useDerivedLogic({
    fn: deriveFn,
    enableRecordResultDep,
    careDeriveStatus: true,
    asyncType: TASK,
  });
  return resultTuple as [R, IsComputing, IRenderInfo];
}

export function useAtomDerived<R extends any = any>(
  resultOrFn: DerivedAtom<R> | DeriveAtomFn<R>,
  enableRecordResultDep?: boolean,
): [R, boolean, IRenderInfo] {
  const [result, isComputing, info] = useDerivedLogic<Atom<R>>({ fn: resultOrFn, enableRecordResultDep, forAtom: true });
  return [result.val, isComputing, info];
}

export function useAtomDerivedAsync<S extends any = any, R extends any = any>(
  sourceFn: () => { source: S; initial: R },
  deriveFn: (taskParams: IAsyncTaskParams<S, R>) => Promise<R>,
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo] {
  const [result, isComputing, info] = useDerivedLogic<Atom<R>>({
    fn: deriveFn,
    sourceFn,
    enableRecordResultDep,
    careDeriveStatus: true,
    asyncType: SOURCE,
    forAtom: true,
  });
  return [result.val, isComputing, info];
}

export function useAtomDerivedTask<R extends any = any>(
  deriveFn: (taskParams: IDeriveFnParams<R>) => { initial: R; task: () => Promise<R> },
  enableRecordResultDep?: boolean,
): [R, IsComputing, IRenderInfo] {
  const [result, isComputing, info] = useDerivedLogic<Atom<R>>({
    fn: deriveFn,
    enableRecordResultDep,
    careDeriveStatus: true,
    asyncType: TASK,
    forAtom: true,
  });
  return [result.val, isComputing, info];
}
