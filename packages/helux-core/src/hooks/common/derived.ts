import { ASYNC_TYPE, SCOPE_TYPE } from '../../consts';
import { isDerivedAtom } from '../../factory/common/atom';
import { getFnCtxByObj } from '../../factory/common/fnScope';
import { createDeriveAsyncLogic, createDeriveLogic } from '../../factory/createDerived';
import { delFnCtx } from '../../helpers/fnCtx';
import { attachInsDerivedResult } from '../../helpers/insCtx';
import type { AsyncType, IFnCtx, ScopeType } from '../../types';
import { isFn, isObj } from '../../utils';

const InvalidInput = 'ERR_NON_DERIVED_FN_OR_RESULT: useDerived only accept a static derived result or derive fn';
const NotDerivedAtom = 'ERR_NOT_ATOM_RESULT: useAtom series fn only accept derived atom';

export interface IUseDerivedLogicOptions {
  fn: any;
  task?: any;
  deps?: any;
  asyncType?: AsyncType;
  showProcess?: boolean;
  forAtom?: boolean;
}

interface IInitOptions extends IUseDerivedLogicOptions {
  deriveCtx: { input: any; deriveFn: any };
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

/**
 * 兼容调试模式下 hot-reload 模式
 */
function ensureHotReload(fnCtx: IFnCtx) {
  delFnCtx(fnCtx); // del prev mapping fnCtx data
  // 以下数据也需要清除，待后续的 createDerivedLogic 流程重新写入
  fnCtx.depKeys.length = 0;
  fnCtx.prevLevelFnKeys.length = 0;
  fnCtx.renderInfo.sn += 1;
}

/** 生成导出结果 */
export function genDerivedResult(options: IInitOptions) {
  const { deriveCtx, fn, deps, task, fnCtx, showProcess, asyncType = ASYNC_TYPE.MAY_TRANSFER, forAtom } = options;
  let isAsync = false;
  let upstreamFnCtx: IFnCtx | null = null;
  let isCtxChanged = false;
  const scopeType: ScopeType = SCOPE_TYPE.HOOK;

  // 已记录函数句柄，完成了导出结果的各种初始动作
  if (deriveCtx.deriveFn) {
    const isChanged = isInputChanged(fnCtx, deriveCtx.input, fn);
    if (!isChanged) {
      return;
    } else {
      isCtxChanged = true;
      ensureHotReload(fnCtx);
    }
  }

  deriveCtx.input = fn;
  if (asyncType === ASYNC_TYPE.MAY_TRANSFER) {
    // 传入了局部的临时计算函数，形如： useDerived(()=>{ ... })
    if (isFn(fn)) {
      deriveCtx.deriveFn = fn;
    } else if (isObj(fn)) {
      // may a static derived result
      upstreamFnCtx = getFnCtxByObj(fn);
      if (!upstreamFnCtx) {
        throw new Error(InvalidInput);
      }
      const ensuredFnCtx = upstreamFnCtx;

      if (forAtom && !isDerivedAtom(ensuredFnCtx.proxyResult)) {
        throw new Error(NotDerivedAtom);
      }

      isAsync = upstreamFnCtx.isAsync;
      // 做结果中转
      deriveCtx.deriveFn = () => ensuredFnCtx.result;
    } else {
      throw new Error(InvalidInput);
    }

    // 使用了异步导出的结果 useDerived(asyncDerivedReuslt)
    if (isAsync && upstreamFnCtx) {
      const ensuredFnCtx = upstreamFnCtx;
      createDeriveAsyncLogic(
        { fn: () => ensuredFnCtx.result, deps: () => [], task: async () => ensuredFnCtx.result },
        {
          scopeType,
          fnCtxBase: fnCtx,
          isAsyncTransfer: true,
          runAsync: false,
          returnUpstreamResult: true,
          showProcess: showProcess ?? true,
          forAtom,
        },
      );
    } else {
      createDeriveLogic(deriveCtx.deriveFn, { scopeType, fnCtxBase: fnCtx, forAtom });
    }
  } else {
    // source or task
    deriveCtx.deriveFn = fn;
    createDeriveAsyncLogic({ fn, task, deps }, { scopeType, fnCtxBase: fnCtx, showProcess, forAtom });
  }

  attachInsDerivedResult(fnCtx);

  if (isCtxChanged) {
    fnCtx.updater();
  }
}
