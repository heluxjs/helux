import { ASYNC_TYPE, WATCH } from '../consts';
import { delComputingFnKey, getFnCtx, getFnCtxByObj, putComputingFnKey } from '../factory/common/fnScope';
import type { Dict, TriggerReason, IDeriveFnParams } from '../types';
import { markComputing } from './fnStatus';
import { shouldShowComputing } from './fnCtx';

const { MAY_TRANSFER } = ASYNC_TYPE;

/**
 * 执行 derive 设置的导出函数
 */
export function runFn(
  fnKey: string,
  options?: { sn?: number; force?: boolean; isFirstCall?: boolean; triggerReasons?: TriggerReason[], err?: any }
) {
  const { isFirstCall = false, triggerReasons = [], sn = 0, err } = options || {};
  const fnCtx = getFnCtx(fnKey);
  if (!fnCtx) {
    return;
  }
  if (fnCtx.fnType === WATCH) {
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
  const updateAndDrillDown = (options: { data?: any, err?: any }) => {
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
  const input = fnCtx.deps() || [];
  const fnParams: IDeriveFnParams = { isFirstCall, prevResult, triggerReasons, input };
  if (!isAsync) {
    const result = fn(fnParams);
    return updateAndDrillDown({ data: result });
  }

  // mark computing for first async task run
  if (isAsync && isFirstCall) {
    fnCtx.nextLevelFnKeys.forEach((key) => markComputing(key, 0));
  }

  if (isAsyncTransfer) {
    // only works for useDerived
    updateAndDrillDown({ err });
    return fnCtx.result;
  }
  if (fnCtx.asyncType === MAY_TRANSFER) {
    const result = fn(fnParams);
    return updateAndDrillDown({ data: result });
  }

  if (isFirstCall) {
    depKeys.forEach((depKey) => {
      putComputingFnKey(depKey, fnKey)
    });
  }

  if (task) {
    const del = () => isFirstCall && depKeys.forEach((depKey) => delComputingFnKey(depKey, fnKey));
    return task(fnParams).then((data: any) => {
      del();
      updateAndDrillDown({ data });
      return fnCtx.result;
    }).catch((err: any) => {
      // TODO: emit ERR_OCCURRED to plugin
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
export function rerunDeriveFn<T = Dict>(result: T): T {
  const fnCtx = getFnCtxByObj(result);
  if (!fnCtx) {
    throw new Error('[Helux]: not a derived result');
  }
  return runFn(fnCtx.fnKey);
}

export function runDerive<T = Dict>(result: T): T {
  return rerunDeriveFn(result);
}

export function runDeriveAsync<T = Dict>(result: T): Promise<T> {
  return Promise.resolve(rerunDeriveFn(result));
}

export function getDeriveLoading<T = Dict>(result: T) {
  const fnCtx = getFnCtxByObj(result);
  if (fnCtx) {
    return fnCtx.status;
  }
  // 和 mutate action 对其，确保 loading 环节取值不报错
  return { loading: false, err: null, ok: true };
}
