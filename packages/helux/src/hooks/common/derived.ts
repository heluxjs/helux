import { ASYNC_TYPE, SCOPE_TYPE } from '../../consts';
import { createDerivedLogic, createDerivedAsyncLogic, createDerivedTaskLogic } from '../../factory/createDerived';
import { isAtomProxy } from '../../factory/common/util';
import { getFnCtxByObj, delFnCtx } from '../../helpers/fndep';
import { attachInsDerivedResult } from '../../helpers/ins';
import { isFn, isObj } from '../../utils';
import type { AsyncType, IFnCtx, ScopeType } from '../../types';

const InvalidInput = 'ERR_NON_DERIVED_FN_OR_RESULT: useDerived only accept a static derived result or derived fn';
const NotAtomResult = 'ERR_NOT_ATOM_RESULT: useAtom series fn only accept atom result';

export interface IUseDerivedOptions {
  fn: any;
  sourceFn?: any;
  asyncType?: AsyncType;
  careDeriveStatus?: boolean;
  enableRecordResultDep?: boolean;
  forAtom?: boolean;
}

interface IInitOptions extends IUseDerivedOptions {
  deriveCtx: { input: any, deriveFn: any };
  fnCtx: IFnCtx;
}

/**
 * with hot-reload mode, static result ref may be changed
 */
function isInputChanged(fnCtx: IFnCtx, storedInput: any, curInput: any) {
  if (fnCtx.isExpired) {
    fnCtx.isExpired = false;
    return true;
  }

  // 探测函数变化已交给 isExpired 来控制，这里直接返回 false
  if (isFn(curInput)) {
    return false;
  }
  return curInput !== storedInput;
}

/** 生成导出结果 */
export function genDerivedResult(options: IInitOptions) {
  const { deriveCtx, fn, sourceFn, fnCtx, careDeriveStatus, asyncType = ASYNC_TYPE.NORMAL, forAtom } = options;
  let isAsync = false;
  let upstreamFnCtx: IFnCtx | null = null;
  let needUpdate = false;
  const scopeType: ScopeType = SCOPE_TYPE.HOOK;

  // 已记录函数句柄，完成了导出结果的各种初始动作
  if (deriveCtx.deriveFn) {
    const isChanged = isInputChanged(fnCtx, deriveCtx.input, fn);
    if (!isChanged) {
      return;
    } else {
      delFnCtx(fnCtx); // del prev mapping fnCtx data
      needUpdate = true; // for hot reload
    }
  }

  deriveCtx.input = fn;
  // 传入了局部的临时计算函数
  if (asyncType === ASYNC_TYPE.NORMAL) {
    if (isFn(fn)) {
      deriveCtx.deriveFn = fn;
    } else if (isObj(fn)) {
      // may a static derived result
      upstreamFnCtx = getFnCtxByObj(fn);
      if (!upstreamFnCtx) {
        throw new Error(InvalidInput);
      }
      const ensuredFnCtx = upstreamFnCtx;

      if (forAtom && !isAtomProxy(ensuredFnCtx.proxyResult)) {
        throw new Error(NotAtomResult);
      }

      isAsync = upstreamFnCtx.isAsync;
      // 做结果中转
      deriveCtx.deriveFn = () => ensuredFnCtx.result;
    } else {
      throw new Error(InvalidInput);
    }

    if (isAsync && upstreamFnCtx) {
      const ensuredFnCtx = upstreamFnCtx;
      createDerivedAsyncLogic(
        () => ({ source: ensuredFnCtx.result, initial: ensuredFnCtx.result }),
        async () => ensuredFnCtx.result,
        {
          scopeType,
          fnCtxBase: fnCtx,
          allowTransfer: true,
          runAsync: false,
          returnUpstreamResult: true,
          careDeriveStatus,
          forAtom,
        },
      );
    } else {
      createDerivedLogic(deriveCtx.deriveFn, { scopeType, fnCtxBase: fnCtx, forAtom });
    }
  } else {
    // source or task
    deriveCtx.deriveFn = fn;
    if (asyncType === ASYNC_TYPE.SOURCE) {
      createDerivedAsyncLogic(sourceFn, fn, { scopeType, fnCtxBase: fnCtx, careDeriveStatus, forAtom });
    } else {
      createDerivedTaskLogic(fn, { scopeType, fnCtxBase: fnCtx, careDeriveStatus, forAtom });
    }
  }

  attachInsDerivedResult(fnCtx);

  if (needUpdate) {
    fnCtx.updater();
  }
}
