import { isFn } from '@helux/utils';
import { ASYNC_TYPE, SCOPE_TYPE } from '../../consts';
import { isDerivedAtom } from '../../factory/common/atom';
import { getFnCtxByObj } from '../../factory/common/fnScope';
import { createDeriveLogic } from '../../factory/createDerived';
import { delFnCtx } from '../../helpers/fnCtx';
import { attachInsDerivedResult } from '../../helpers/insCtx';
import type { AsyncType, IFnCtx } from '../../types/base';

const InvalidInput = 'ERR_NOT_DERIVED_RESULT: useDerived only accept derived result';
const NotDerivedAtom = 'ERR_NOT_ATOM_RESULT: useDerivedAtom only accept derived atom';

export interface IUseDerivedLogicOptions {
  result: any;
  asyncType?: AsyncType;
  showLoading?: boolean;
  forAtom?: boolean;
}

interface IDeriveCtx {
  input: any;
  deriveFn: any;
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
export function genDerivedResult(deriveCtx: IDeriveCtx, options: IUseDerivedLogicOptions) {
  const { result, forAtom, showLoading } = options;
  const { fnCtx, input, deriveFn } = deriveCtx;
  let isCtxChanged = false;

  // 已记录函数句柄，完成了导出结果的各种初始动作
  if (deriveFn) {
    const isChanged = isInputChanged(fnCtx, input, result);
    if (!isChanged) {
      return;
    } else {
      isCtxChanged = true;
      ensureHotReload(fnCtx);
    }
  }

  deriveCtx.input = result;
  const upstreamFnCtx = getFnCtxByObj(result);
  if (!upstreamFnCtx) {
    throw new Error(InvalidInput);
  }
  if (forAtom && !isDerivedAtom(result)) {
    throw new Error(NotDerivedAtom);
  }

  // 做结果中转
  deriveCtx.deriveFn = () => upstreamFnCtx.result;
  createDeriveLogic(
    { fn: () => upstreamFnCtx.result, deps: () => [], task: async () => upstreamFnCtx.result },
    {
      isAsync: upstreamFnCtx.isAsync,
      scopeType: SCOPE_TYPE.HOOK,
      fnCtxBase: fnCtx,
      isAsyncTransfer: true,
      runAsync: false,
      returnUpstreamResult: true,
      forAtom,
      asyncType: ASYNC_TYPE.MAY_TRANSFER,
      showLoading,
    },
  );

  attachInsDerivedResult(fnCtx);
  if (isCtxChanged) {
    fnCtx.updater();
  }
}
