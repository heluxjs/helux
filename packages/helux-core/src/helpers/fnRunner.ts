import { enureReturnArr, isPromise, noopVoid, tryAlert } from '@helux/utils';
import { ASYNC_TYPE, WATCH } from '../consts';
import { delComputingFnKey, getFnCtx, getFnCtxByObj, putComputingFnKey } from '../factory/common/fnScope';
import type { TInternal } from '../factory/creator/buildInternal';
import { probeDeadCycle } from '../factory/creator/deadCycle';
import type { Dict, From, IDeriveFnParams, TriggerReason } from '../types/base';
import { shouldShowComputing } from './fnCtx';
import { markComputing } from './fnStatus';

const { MAY_TRANSFER } = ASYNC_TYPE;

interface IRnFnOpt {
  sn?: number;
  from?: From;
  force?: boolean;
  isFirstCall?: boolean;
  triggerReasons?: TriggerReason[];
  err?: any;
  internal?: TInternal;
  desc?: any;
  forceFn?: boolean;
  forceTask?: boolean;
}

/**
 * 执行 derive 设置的导出函数
 */
export function runFn(fnKey: string, options?: IRnFnOpt) {
  const { isFirstCall = false, forceFn = false, forceTask = false, triggerReasons = [], sn = 0, from, err, internal, desc } = options || {};
  const fnCtx = getFnCtx(fnKey);
  if (!fnCtx) {
    return;
  }
  if (fnCtx.fnType === WATCH) {
    // 来自 mutate 触发的 watch 才探测死循环
    from === 'Mutate' && probeDeadCycle(sn, desc, internal);
    return fnCtx.fn({ isFirstCall, triggerReasons, sn });
  }

  const { isAsync, fn, task, isAsyncTransfer, forAtom, result, depKeys } = fnCtx;
  if (fnCtx.remainRunCount > 0) {
    fnCtx.remainRunCount -= 1;
  }

  const assignResult = (data: Dict) => {
    const dataVar = forAtom ? { val: data } : data;
    // 非中转结果
    if (!fnCtx.returnUpstreamResult && dataVar) {
      Object.assign(fnCtx.result, dataVar);
    }
    // 需生成新的代理对象，让直接透传结果给 memo 组件的场景也能够正常工作，useDerived 会用到此属性
    fnCtx.shouldReplaceResult = true;
  };
  /** 尝试更新函数对应的实例 */
  const triggerUpdate = () => {
    fnCtx.renderInfo.sn = sn;
    fnCtx.updater();
  };
  /** 下钻执行其他函数 */
  const updateAndDrillDown = (options: { data?: any; err?: any }) => {
    const { data, err = null } = options;
    if (!err) {
      assignResult(data);
      if (isFirstCall) {
        if (isAsync && fnCtx.status.loading && !shouldShowComputing(fnCtx)) {
          fnCtx.setLoading(false, err);
        }
      } else if (fnCtx.remainRunCount === 0) {
        fnCtx.setLoading(false, err);
      }
    } else {
      fnCtx.setLoading(false, err);
    }
    triggerUpdate();
    fnCtx.nextLevelFnKeys.forEach((key) => {
      runFn(key, { isFirstCall, sn, triggerReasons, err });
    });
  };

  const prevResult = forAtom ? result.val : result;
  const input = enureReturnArr(fnCtx.deps);
  const fnParams: IDeriveFnParams = { isFirstCall, prevResult, triggerReasons, input, sn };
  const shouldRunFn = !isAsync || forceFn || (isAsync && !task);
  if (shouldRunFn) {
    const result = fn(fnParams);
    updateAndDrillDown({ data: result });
    return fnCtx.result;
  }

  // mark computing for first async task run
  if (isAsync && isFirstCall) {
    fnCtx.nextLevelFnKeys.forEach((key) => markComputing(key, 0));
  }
  // only works for useDerived
  if (isAsyncTransfer) {
    updateAndDrillDown({ err });
    return fnCtx.result;
  }
  if (fnCtx.asyncType === MAY_TRANSFER) {
    const result = fn(fnParams);
    return updateAndDrillDown({ data: result });
  }
  if (task) {
    let del = noopVoid;
    if (isFirstCall) {
      depKeys.forEach((depKey) => putComputingFnKey(depKey, fnKey));
      del = () => depKeys.forEach((depKey) => delComputingFnKey(depKey, fnKey));
    } else if (forceTask) {
      // 需要展现 loading，由 runDeriveAsync 触发
      fnCtx.nextLevelFnKeys.forEach((fnKey) => markComputing(fnKey));
    }

    return Promise.resolve(() => {
      const result = task(fnParams);
      // 检查 result 是否是 Promise 来反推 task 是否是 async 函数
      if (!isPromise(result)) {
        tryAlert('ERR_NON_FN: derive task arg should be async function!', false);
        return null;
      }
      return result;
    })
      .then((wrap) => wrap())
      .then((data: any) => {
        del();
        updateAndDrillDown({ data });
        return fnCtx.result;
      })
      .catch((err: any) => {
        // TODO: emit ON_DERIVE_ERROR_OCCURED to plugin
        del();
        updateAndDrillDown({ err }); // 向下传递错误
        return fnCtx.result;
      });
  }

  return fnCtx.result;
}

/**
 * run redive fn by result
 */
export function rerunDeriveFn<T = Dict>(result: T, options?: { forceFn?: boolean; forceTask?: boolean }): T {
  const fnCtx = getFnCtxByObj(result);
  if (!fnCtx) {
    throw new Error('[Helux]: not a derived result');
  }
  return runFn(fnCtx.fnKey, { ...(options || {}) });
}

export function runDerive<T = Dict>(result: T): T {
  return rerunDeriveFn(result, { forceFn: true });
}

export function runDeriveAsync<T = Dict>(result: T): Promise<T> {
  return Promise.resolve(rerunDeriveFn(result, { forceTask: true }));
}

export function getDeriveLoading<T = Dict>(result: T) {
  const fnCtx = getFnCtxByObj(result);
  if (fnCtx) {
    return fnCtx.status;
  }
  // 和 mutate action 对其，确保 loading 环节取值不报错
  return { loading: false, err: null, ok: true };
}
