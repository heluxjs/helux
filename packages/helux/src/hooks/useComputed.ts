import { useEffect, useRef, useState } from 'react';
import { MOUNTED, RENDER_END, RENDER_START } from '../consts';
import { buildFnCtx, delFnCtx, getDepSharedStateFeature, recoverDep } from '../helpers/fndep';
import { attachInsComputedResult } from '../helpers/ins';
import { ComputedFn, ComputedResult, IsComputing, PlainObject } from '../types';
import { noop } from '../utils';
import { createComputed, IUseComputedOptions } from './common/createComputed';
import { useSync } from './common/useSync';
import { useForceUpdate } from './useForceUpdate';

export function useComputedLogic<T extends PlainObject = PlainObject>(options: IUseComputedOptions): [T, IsComputing] {
  const { fn, sourceFn = noop, enableRecordResultDep = false, careComputeStatus, asyncType = 'normal' } = options;
  const fnRef = useRef<any>(null);
  const updater = useForceUpdate();
  const [fnCtx] = useState(() => {
    return buildFnCtx({ updater, enableRecordResultDep, scopeType: 'hook' });
  });
  fnCtx.renderStatus = RENDER_START;
  createComputed({ fnRef, careComputeStatus, fn, sourceFn, fnCtx, asyncType });

  if (fnCtx.enableRecordResultDep) {
    fnCtx.isResultReaded = false; // 待到 proxy 里产生读取行为时，会被置为 true
  }
  if (fnCtx.shouldReplaceResult) {
    attachInsComputedResult(fnCtx);
    fnCtx.shouldReplaceResult = false;
  }

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

  return [fnCtx.proxyResult, fnCtx.isComputing];
}

export function useComputed<T extends PlainObject = PlainObject>(
  resultOrFn: ComputedResult<T> | ComputedFn<T>,
  enableRecordResultDep?: boolean,
): [T, IsComputing] {
  const resultPair = useComputedLogic({ fn: resultOrFn, enableRecordResultDep });
  return resultPair;
}
