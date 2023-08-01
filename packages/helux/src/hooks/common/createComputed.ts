import { createComputedLogic } from '../../factory/createComputed';
import { createComputedAsyncLogic } from '../../factory/createComputedAsync';
import { createComputedTaskLogic } from '../../factory/createComputedTask';
import { getFnCtxByObj } from '../../helpers/fndep';
import { attachInsComputedResult } from '../../helpers/ins';
import { AsyncType, IFnCtx, ScopeType } from '../../types';
import { isFn, isObj } from '../../utils';

const InvalidInput = 'ERR_NON_COMPUTED_FN_OR_RESULT: useComputed only accept a static computed result or computed fn';

export interface IUseComputedOptions {
  fn: any;
  sourceFn?: any;
  asyncType?: AsyncType;
  careComputeStatus?: boolean;
  enableRecordResultDep?: boolean;
}

interface ICreateOptions extends IUseComputedOptions {
  fnRef: React.MutableRefObject<any>;
  fnCtx: IFnCtx;
}

export function createComputed(options: ICreateOptions) {
  const { fnRef, fn, sourceFn, fnCtx, careComputeStatus, asyncType } = options;
  let isAsync = false;
  let upstreamFnCtx: IFnCtx | null = null;
  const scopeType: ScopeType = 'hook';

  // 已记录函数句柄
  if (fnRef.current) {
    return;
  }

  // 传入了局部的临时计算函数
  if (asyncType === 'normal') {
    if (isFn(fn)) {
      fnRef.current = fn;
    } else if (isObj(fn)) {
      // may a static computed result
      upstreamFnCtx = getFnCtxByObj(fn);
      if (!upstreamFnCtx) {
        throw new Error(InvalidInput);
      }
      const ensuredFnCtx = upstreamFnCtx;
      isAsync = upstreamFnCtx.isAsync;
      // 做结果中转
      fnRef.current = () => ensuredFnCtx.result;
    } else {
      throw new Error(InvalidInput);
    }

    if (isAsync && upstreamFnCtx) {
      const ensuredFnCtx = upstreamFnCtx;
      createComputedAsyncLogic(
        () => ({ source: ensuredFnCtx.result, initial: ensuredFnCtx.result }),
        async () => ensuredFnCtx.result,
        {
          scopeType,
          fnCtxBase: fnCtx,
          allowTransfer: true,
          runAsync: false,
          returnUpstreamResult: true,
          careComputeStatus,
        },
      );
    } else {
      createComputedLogic(fnRef.current, { scopeType, fnCtxBase: fnCtx });
    }
  } else {
    // source or task
    fnRef.current = fn;
    if (asyncType === 'source') {
      createComputedAsyncLogic(sourceFn, fn, { scopeType, fnCtxBase: fnCtx, careComputeStatus });
    } else {
      createComputedTaskLogic(fn, { scopeType, fnCtxBase: fnCtx, careComputeStatus });
    }
  }

  attachInsComputedResult(fnCtx);
}
