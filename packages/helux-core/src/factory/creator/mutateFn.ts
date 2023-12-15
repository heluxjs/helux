import { enureReturnArr, isPromise, noop, tryAlert } from '@helux/utils';
import { EVENT_NAME, SCOPE_TYPE, FROM } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { getRunningFn } from '../../factory/common/fnScope';
import { buildReactive, innerFlush } from './reactive';
import { analyzeErrLog, dcErr, inDeadCycle } from '../../factory/creator/deadCycle';
import { getStatusKey, setLoadStatus } from '../../factory/creator/loading';
import { REACTIVE_META, FN_DEP_KEYS } from '../../factory/creator/current';
import { markIgnore } from '../../helpers/fnDep';
import { getInternal } from '../../helpers/state';
import { markFnEnd } from '../../helpers/fnCtx';
import type { Fn, From, ICallMutateFnOptions, IInnerSetStateOptions, IWatchAndCallMutateDictOptions, SharedState } from '../../types/base';
import { createWatchLogic } from '../createWatch';

interface ICallMutateBase {
  desc?: string;
  sn?: number;
  deps?: Fn;
  from: From;
  /** watchAndRunMutate 需要自己捕获错误 */
  throwErr?: boolean;
  /** 控制死循环探测逻辑执行时机 */
  isFirstCall?: boolean;
}

interface ICallMutateFnOpt<T = SharedState> extends ICallMutateBase {
  fn: Fn;
  /** fn 函数调用入参拼装 */
  getArgs?: (param: { draft: T; draftRoot: T; setState: Fn; desc: string; input: any[] }) => any[];
}

interface ICallAsyncMutateFnOpt extends ICallMutateBase {
  depKeys: string[];
  task: Fn;
  /** task 函数调用入参拼装，暂不像同步函数逻辑那样提供 draft 给用户直接操作，用户必须使用 setState 修改状态 */
  getArgs?: (param: { flush: any, draft: any; draftRoot: any; desc: string; setState: Fn; input: any[] }) => any[];
}

const fnProm = new Map<any, boolean>();

/** 呼叫异步函数的逻辑封装，mutate task 执行或 action 定义的函数（同步或异步）执行都会走到此逻辑 */
export function callAsyncMutateFnLogic<T = SharedState>(
  targetState: T,
  options: ICallAsyncMutateFnOpt,
): [any, Error | null] | Promise<[any, Error | null]> {
  const { desc = '', sn, task, getArgs = noop, deps, from, throwErr, depKeys } = options;
  const internal = getInternal(targetState);
  const { sharedKey } = internal;
  const customOptions: IInnerSetStateOptions = { desc, sn, from };
  const statusKey = getStatusKey(from, desc);
  const { draft, draftRoot, meta } = buildReactive(internal, depKeys, { desc, from });
  const flush = (desc: string) => {
    innerFlush(sharedKey, desc);
  };

  const setState: any = (cb: any) => {
    // ATTENTION LABEL( flush )
    // 调用 setState 主动把响应式对象可能存在的变更先提交
    // reactive.a = 66;
    // setState(draft=>draft.a+100); // flush 后回调里可拿到 draft.a 最新值为 66
    flush(desc);
    const { finish } = internal.setStateFactory(customOptions); // 透传 sn from 等信息
    return finish(cb);
  };

  const defaultParams = { desc, setState, input: enureReturnArr(deps, targetState), draft, draftRoot, flush };
  const args = getArgs(defaultParams) || [defaultParams];
  const isProm = fnProm.get(task);
  const isUnconfirmedFn = isProm === undefined;
  const setStatus = (loading: boolean, err: any, ok: boolean) => {
    if (isUnconfirmedFn || isProm) {
      /**
       * 异步函数调用发起前 已标记忽略依赖收集行为，之前未标记这里会造成死循环（ 注：禁止异步函数依赖收集本就是合理行为 ）
       * 死循环案例：
       * mutate({ async task(){ ..... } }) 是一个会立即执行的异步任务，setLoadStatus 内部读取 loading 的状态，
       * 依赖 Mutate/1 算到当前函数上，mutate 结束后又发起一个请求 loading 变为为 false 的动作，然后又找到当前函数
       * 当前函数执行又标记 loading 为 true，如此往复形成死循环
       */
      setLoadStatus(internal, statusKey, { loading, err, ok });
    }
  };

  setStatus(true, null, false);
  const handleErr = (err: any): [any, Error | null] => {
    REACTIVE_META.del(meta.key);
    FN_DEP_KEYS.del();
    setStatus(false, err, false);
    if (throwErr) {
      throw err;
    }
    return [internal.snap, err];
  };
  const handlePartial = (partial: any): [any, Error | null] => {
    partial && setState(partial);
    setStatus(false, null, true);
    // 这里需要主动 flush 一次，让返回的 snap 是最新值
    // const nextState = actions.xxxMethod(); //  nextState 为最新值
    flush(desc);
    // del mutate or action reactive data
    REACTIVE_META.del(meta.key);

    return [internal.snap, null];
  };

  try {
    const result = task(...args);
    const isResultProm = isPromise(result);
    // 注：只能从结果判断函数是否是 Promise，因为编译后的函数很可能再套一层函数
    fnProm.set(task, isResultProm);
    if (isResultProm) {
      return Promise.resolve(result).then(handlePartial).catch(handleErr);
    }
    return handlePartial(result);
  } catch (err) {
    return handleErr(err);
  }
}

/** 呼叫同步函数的逻辑封装 */
export function callMutateFnLogic<T = SharedState>(targetState: T, options: ICallMutateFnOpt<T>): [any, Error | null] {
  const { desc = '', sn, fn, getArgs = noop, deps, from, throwErr, isFirstCall } = options;
  const internal = getInternal(targetState);
  const { forAtom, setStateFactory, sharedState } = internal;
  const innerSetOptions: IInnerSetStateOptions = { desc, sn, from, isFirstCall };
  // 不定制同步函数入参的话，默认就是 (draft, input)，
  // 调用函数形如：(draft)=>draft.xxx+=1; 或 (draft, input)=>draft.xxx+=input[0]
  const setState: any = (cb: any) => {
    const { finish } = setStateFactory(); // 继续透传 sn from 等信息
    return finish(cb, innerSetOptions);
  };
  const input = enureReturnArr(deps, targetState);
  // atom 自动拆箱
  let state = sharedState;
  if (forAtom) {
    // sharedState.val 会产生一次影响运行逻辑的依赖收集，这里标记一下 ignore
    markIgnore(true); // stop dep collect
    state = sharedState.val;
    markIgnore(false); // recover dep collect
  }
  const { draftNode: draft, draftRoot, finish } = setStateFactory({ from, enableDep: true });
  const args = getArgs({ draft, draftRoot, setState, desc, input }) || [draft, { input, state, draftRoot }];

  try {
    const result = fn(...args);
    finish(result, innerSetOptions)
    return [internal.snap, null];
  } catch (err: any) {
    // TODO 同步函数错误发送给插件
    if (throwErr) {
      throw err;
    }
    return [internal.snap, err];
  }
}

/** 调用 mutate 函数，优先处理 task，且最多只处理一个，调用方自己保证只传一个 */
export function callMutateFn(target: any, options: ICallMutateFnOptions = { forTask: false, depKeys: [] }) {
  const { fn, task, forTask } = options;
  const from = FROM.MUTATE;
  if (forTask && task) {
    // 处理异步函数
    return callAsyncMutateFnLogic(target, { ...options, task, from });
  }
  if (!forTask && fn) {
    // 处理同步函数
    return callMutateFnLogic(target, { ...options, fn, from });
  }
  return [getInternal(target).snap, null] as [any, Error | null];
}

/**
 * 监听并运行 mutate 函数
 * @param options
 */
export function watchAndCallMutateDict(options: IWatchAndCallMutateDictOptions) {
  const { target, dict } = options;
  const keys = Object.keys(dict);
  if (!keys.length) return;
  const internal = getInternal(target);
  const { mutateFnDict, usefulName } = internal;

  keys.forEach((descKey) => {
    const item = mutateFnDict[descKey];
    // 开始映射 mutate 函数相关数据依赖关系
    createWatchLogic(
      ({ sn, isFirstCall }) => {
        const { desc, fn, task, deps, immediate } = item;
        const fnCtx = getRunningFn().fnCtx;
        if (isFirstCall && fnCtx) {
          fnCtx.subFnInfo = item; // 将子函数信息挂上去
        }

        FN_DEP_KEYS.del();
        const dc = inDeadCycle(usefulName, desc);

        try {
          // 已处于死循环中的函数，不再执行
          if (dc.isIn) {
            throw dcErr(usefulName, dc.cycle, desc);
          }
          const baseOpt = { sn, desc, deps, throwErr: true, isFirstCall };
          if (fn) {
            // 包含 task 配置时，fn 只会在首次执行被调用一次
            if (isFirstCall || !task) {
              markIgnore(false);
              callMutateFn(target, { ...baseOpt, fn, forTask: false, depKeys: [] });
            }
          }

          // 存档一下收集到依赖，方便后续探测异步函数里的死循环可能存在的情况
          if (isFirstCall) {
            if (fnCtx) {
              // 异步函数强制忽略依赖收集行为
              item.depKeys = markFnEnd();
            } else {
              // 可能在 notify 里已经执行过 markFnEnd 了，这里将 FN_DEP_KEYS.current 转移出来
              item.depKeys = FN_DEP_KEYS.current();
            }
            FN_DEP_KEYS.del();
          }

          if (task) {
            // 第一次调用时，如未显示定义 immediate 值，则触发规律是没有 fn 则执行 task，有 fn 则不执行 task
            const canRunForFirstCall = isFirstCall && (immediate ?? !fn);
            if (!isFirstCall || canRunForFirstCall) {
              callMutateFn(target, { ...baseOpt, task, forTask: true, depKeys: item.depKeys });
            }
          }

          return item;
        } catch (err: any) {
          if (err.cause === 'DeadCycle') {
            analyzeErrLog(usefulName, err);
          } else {
            tryAlert(err);
          }
          emitPluginEvent(internal, EVENT_NAME.ON_ERROR_OCCURED, { err });
        }
      },
      {
        deps: () => item.deps?.(target) || [],
        sharedState: target,
        scopeType: SCOPE_TYPE.STATIC,
        immediate: true,
      },
    );
  });
}
