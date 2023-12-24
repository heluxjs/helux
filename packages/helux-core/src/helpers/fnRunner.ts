import { enureReturnArr, isPromise, noopVoid, tryAlert } from '@helux/utils';
import { ASYNC_TYPE, FROM, WATCH } from '../consts';
import { fakeFnCtx, fakeInternal } from '../factory/common/fake';
import { delComputingFnKey, getFnCtx, getFnCtxByObj, putComputingFnKey } from '../factory/common/fnScope';
import { emitErr } from '../factory/common/plugin';
import type { TInternal } from '../factory/creator/buildInternal';
import { REACTIVE_META, TRIGGERED_WATCH } from '../factory/creator/current';
import { alertDepKeyDeadCycleErr, probeDepKeyDeadCycle, probeFnDeadCycle } from '../factory/creator/deadCycle';
import { innerFlush } from '../factory/creator/reactive';
import type { Dict, From, IDeriveFnParams, IFnCtx, TriggerReason } from '../types/base';
import { shouldShowComputing } from './fnCtx';
import { markComputing } from './fnStatus';

const { MAY_TRANSFER } = ASYNC_TYPE;

interface IRunFnOpt {
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
  /**
   * default: false
   * 是否对atom型全量派生结果拆箱
   */
  unbox?: boolean;
}

/**
 * 执行 watch 函数，内部会尝试检测死循环，防止无限调用情况产生
 * TODO  后续优化拦截逻辑，提高可读性
 */
function runWatch(fnCtx: IFnCtx, options: IRunFnOpt) {
  const { isFirstCall = false, triggerReasons = [], sn = 0, from, internal = fakeInternal, desc } = options;
  if (fnCtx.dcErrorInfo.err) {
    alertDepKeyDeadCycleErr(internal, fnCtx.dcErrorInfo);
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

  // 测试 OK，示例 MutateFnDc
  // 检测出 mutate fn 里修改自己的依赖导致的死循环
  // mutate({ fn: (draft)=> draft.a+=1 })
  if (fnCtx.isRunning && probeDepKeyDeadCycle(internal, fnCtx, options.depKeys || [])) {
    return;
  }

  const rmeta = REACTIVE_META.current();
  // 当前 reactive 对象是在 fnCtx 内部调用时操作的，需探测死循环
  if (rmeta.fnKey === fnCtx.fnKey && probeDepKeyDeadCycle(internal, fnCtx, rmeta.writeKeys)) {
    return;
  }

  // 提前 flush 可能已经存在的 reactive 对象，避免死循环误判
  // 此操作会自动找到对应的函数执行，下面逻辑无需再执行
  innerFlush(rmeta.sharedKey, rmeta.desc);
  REACTIVE_META.del(rmeta.key);

  const isReactiveInCb = fnCtx.isRunning === true && rmeta.isTop;
  // 来自 watch(()=>{ r.a+=1 }, ()=>[s.a]) 的死循环
  if (isReactiveInCb && probeDepKeyDeadCycle(internal, fnCtx, rmeta.writeKeys)) {
    return;
  }

  fnCtx.isRunning = true;
  TRIGGERED_WATCH.set(fnCtx.fnKey);
  const ret = fnCtx.fn({ isFirstCall, triggerReasons, sn });
  TRIGGERED_WATCH.del();
  //  重新获取函数中可能存在的 reactive 修改
  const afterRunRmeta = REACTIVE_META.current();

  // 来自以下类似示例的死循环
  // 1 watch 对调用调用 watch(()=>{ r.a+=1 }, ()=>[s.a])
  // 2 watch或mutate 中调用其他函数修改自身依赖 watch(()=>{ foo() }, ()=>[s.a]) function foo(){ reactiv.a+=1 }
  if (afterRunRmeta.isTop && afterRunRmeta.fnKey === fnCtx.fnKey && probeDepKeyDeadCycle(internal, fnCtx, afterRunRmeta.writeKeys)) {
    return;
  }

  // 可能是一个异步执行的 task 任务，再次检查，注前面45行的 fnCtx.isRunning 在此种情况时会判断失效，这里需执行 fn 后做后置检查
  // 形如 mutate({ deps:()=>[reative.a], async task(){ reative.a+=1 }, immediate: true })
  if (ret && ret.task) {
    // 发现异步 task 有死循环，则标记函数不可用
    if (afterRunRmeta.from === FROM.MUTATE && probeDepKeyDeadCycle(internal, fnCtx, fnCtx.subFnInfo.writeKeys)) {
      return;
    }
  }

  fnCtx.isRunning = false;
  return ret;
}

/**
 * 执行 derive 设置函数
 */
export function runFn(fnKey: string, options: IRunFnOpt = {}) {
  const {
    isFirstCall = false,
    forceFn = false,
    forceTask = false,
    throwErr = false,
    triggerReasons = [],
    sn = 0,
    err,
    unbox = false,
    internal = fakeInternal,
  } = options;
  const fnCtx = getFnCtx(fnKey);
  const resultTuple = (err: any = null) => {
    if (err && throwErr) throw err;
    const ctx = fnCtx || fakeFnCtx;
    return unbox ? [ctx.result.val, err] : [ctx.result, err];
  };
  if (!fnCtx) {
    return resultTuple(new Error(`not a valid watch or derive cb for key ${fnKey}`));
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
    return resultTuple();
  }

  // mark computing for first async task run
  if (isAsync && isFirstCall) {
    fnCtx.nextLevelFnKeys.forEach((key) => markComputing(key, 0));
  }
  // only works for useDerived
  if (isAsyncTransfer) {
    updateAndDrillDown({ err });
    return resultTuple();
  }
  if (fnCtx.asyncType === MAY_TRANSFER) {
    const result = fn(fnParams);
    updateAndDrillDown({ data: result });
    return resultTuple();
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
        return resultTuple();
      })
      .catch((err: any) => {
        // TODO: emit ON_DERIVE_ERROR_OCCURED to plugin
        del();
        updateAndDrillDown({ err }); // 向下传递错误
        if (throwErr) throw err;
        emitErr(internal, err);
        return resultTuple(err);
      });
  }

  return resultTuple(err);
}

/**
 * run redive fn by result
 */
export function rerunDeriveFn<T = Dict>(
  result: T,
  options?: { forceFn?: boolean; forceTask?: boolean; throwErr?: boolean; unbox?: boolean },
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

/**
 * 内部使用的重运行全量派生函数接口，目前提供给 createShared
 */
export function innerRunDerive<T = any>(result: T, throwErr?: boolean): [T, Error | null] {
  return rerunDeriveFn(result, { forceFn: true, throwErr, unbox: true });
}

/**
 * 内部使用的重运行全量派生函数异步任务，目前提供给 createShared
 */
export function innerRunDeriveTask<T = Dict>(result: T, throwErr?: boolean): Promise<[T, Error | null]> {
  return Promise.resolve(rerunDeriveFn(result, { forceTask: true, throwErr, unbox: true }));
}

export function getDeriveLoading<T = Dict>(result: T) {
  const fnCtx = getFnCtxByObj(result);
  if (fnCtx) {
    return fnCtx.status;
  }
  // 和 mutate action 对其，确保 loading 环节取值不报错
  return { loading: false, err: null, ok: true };
}
