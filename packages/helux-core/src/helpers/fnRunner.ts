import { enureReturnArr, isPromise, noopVoid, tryAlert } from '@helux/utils';
import { ASYNC_TYPE, FROM, WATCH } from '../consts';
import { delComputingFnKey, getFnCtx, getFnCtxByObj, putComputingFnKey } from '../factory/common/fnScope';
import type { TInternal } from '../factory/creator/buildInternal';
import { REACTIVE_META } from '../factory/creator/current';
import { probeDepKeyDeadCycle, probeFnDeadCycle } from '../factory/creator/deadCycle';
import { fakeInternal } from '../factory/creator/fake';
import type { Dict, From, IDeriveFnParams, IFnCtx, TriggerReason } from '../types/base';
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
  throwErr?: boolean;
  depKeys?: string[];
}

/**
 * 执行 watch 函数，内部会尝试检测死循环，防止无限调用情况产生
 * @param fnCtx
 * @param options
 * @returns
 */
function runWatch(fnCtx: IFnCtx, options: IRnFnOpt) {
  const { isFirstCall = false, triggerReasons = [], sn = 0, from, internal = fakeInternal, desc } = options;
  if (!fnCtx.isUsable) {
    // 发现来自死循环的不可用标记，恢复可用，直接结束调用，避免无限调用情况产生
    fnCtx.isUsable = true;
    return;
  }
  // simpleWatch 的依赖时转移进去的，不需要判死循环，否则会照成误判
  // 设定了 checkDeadCycle 为 false，不检查死循环
  if (fnCtx.isSimpleWatch || !fnCtx.checkDeadCycle) {
    return fnCtx.fn({ isFirstCall, triggerReasons, sn });
  }
  // 优先开始检查 mutate 多个同步函数间的死循环
  if (FROM.MUTATE === from) {
    // 多个fn同步串行之后后，如出现死循环错误会抛到到 mutateFn 里
    probeFnDeadCycle(internal, sn, desc);
  }
  // 来自 reactive 对象或其他 setState 调用
  if (fnCtx.isRunning && probeDepKeyDeadCycle(internal, fnCtx, options.depKeys || [])) {
    return;
  }
  fnCtx.isRunning = true;
  const ret = fnCtx.fn({ isFirstCall, triggerReasons, sn });
  const rmeta = REACTIVE_META.current();
  // 可能是一个异步执行的 task 任务，再次检查，注前面45行的 fnCtx.isRunning 在此种情况时会判断失效，这里需执行 fn 后做后置检查
  // 形如 mutate({ deps:()=>[reative.a], async task(){ reative.a+=1 }, immediate: true })
  if (ret && ret.task) {
    if (rmeta.from === FROM.MUTATE && probeDepKeyDeadCycle(internal, fnCtx, options.depKeys || [])) {
      // 发现异步 task 有死循环，则暂时标记函数不可用
      fnCtx.isUsable = false;
    }
  } else if (rmeta.isReactive) {
    // 来自 watch(()=>{ r.a+=1 }, ()=>[s.a]) 的死循环
    if (probeDepKeyDeadCycle(internal, fnCtx, rmeta.writeKeys)) {
      // 发现异步 task 有死循环，则暂时标记函数不可用
      fnCtx.isUsable = false;
    }
  }

  fnCtx.isRunning = false;
  return ret;
}

/**
 * 执行 derive 设置函数
 */
export function runFn(fnKey: string, options: IRnFnOpt = {}) {
  const { isFirstCall = false, forceFn = false, forceTask = false, throwErr = false, triggerReasons = [], sn = 0, err } = options;
  const fnCtx = getFnCtx(fnKey);
  if (!fnCtx) {
    return [null, new Error(`not a valid watch or derive cb for key ${fnKey}`)];
  }
  if (fnCtx.fnType === WATCH) {
    return runWatch(fnCtx, options);
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
    return [fnCtx.result, null];
  }

  // mark computing for first async task run
  if (isAsync && isFirstCall) {
    fnCtx.nextLevelFnKeys.forEach((key) => markComputing(key, 0));
  }
  // only works for useDerived
  if (isAsyncTransfer) {
    updateAndDrillDown({ err });
    return [fnCtx.result, null];
  }
  if (fnCtx.asyncType === MAY_TRANSFER) {
    const result = fn(fnParams);
    updateAndDrillDown({ data: result });
    return [fnCtx.result, null];
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
        tryAlert('ERR_NON_FN: derive task arg should be async function!', { throwErr });
        return null;
      }
      return result;
    })
      .then((wrap) => wrap())
      .then((data: any) => {
        del();
        updateAndDrillDown({ data });
        return [fnCtx.result, null];
      })
      .catch((err: any) => {
        // TODO: emit ON_DERIVE_ERROR_OCCURED to plugin
        del();
        updateAndDrillDown({ err }); // 向下传递错误
        if (throwErr) throw err;
        return [fnCtx.result, err];
      });
  }

  return [fnCtx.result, null];
}

/**
 * run redive fn by result
 */
export function rerunDeriveFn<T = Dict>(
  result: T,
  options?: { forceFn?: boolean; forceTask?: boolean; throwErr?: boolean },
): [T, Error | null] {
  const fnCtx = getFnCtxByObj(result);
  if (!fnCtx) {
    throw new Error('[Helux]: not a derived result');
  }
  return runFn(fnCtx.fnKey, { ...(options || {}) });
}

/**
 * 重运行全量派生函数
 */
export function runDerive<T = Dict>(result: T, throwErr?: boolean): [T, Error | null] {
  return rerunDeriveFn(result, { forceFn: true, throwErr });
}

/**
 * 重运行全量派生函数异步任务
 */
export function runDeriveTask<T = Dict>(result: T, throwErr?: boolean): Promise<[T, Error | null]> {
  return Promise.resolve(rerunDeriveFn(result, { forceTask: true, throwErr }));
}

export function getDeriveLoading<T = Dict>(result: T) {
  const fnCtx = getFnCtxByObj(result);
  if (fnCtx) {
    return fnCtx.status;
  }
  // 和 mutate action 对其，确保 loading 环节取值不报错
  return { loading: false, err: null, ok: true };
}
