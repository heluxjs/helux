import { enureReturnArr, noop, tryAlert } from '@helux/utils';
import { EVENT_NAME, SCOPE_TYPE } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { wrapPartial } from '../../factory/common/util';
import { analyzeErrLog, dcErr, inDeadCycle } from '../../factory/creator/deadCycle';
import { setLoadStatus } from '../../factory/creator/loading';
import { markIgnore, markTaskRunning } from '../../helpers/fnDep';
import { getInternal } from '../../helpers/state';
import type { Fn, From, ICallMutateFnOptions, IInnerSetStateOptions, IWatchAndCallMutateDictOptions, SharedState } from '../../types/base';
import { createWatchLogic } from '../createWatch';

interface ICallMutateFnLogicOptionsBase {
  desc?: string;
  sn?: number;
  deps?: Fn;
  from: From;
  /** watchAndRunMutate 需要自己捕获错误 */
  throwErr?: boolean;
  /** 控制死循环探测逻辑执行时机 */
  isFirstCall?: boolean;
}

interface ICallMutateFnLogicOptions<T = SharedState> extends ICallMutateFnLogicOptionsBase {
  fn: Fn;
  /** fn 函数调用入参拼装 */
  getArgs?: (param: { draft: SharedState; draftRoot: SharedState; setState: Fn; desc: string; input: any[] }) => any[];
}

interface ICallAsyncMutateFnLogicOptions extends ICallMutateFnLogicOptionsBase {
  task: Fn;
  /** task 函数调用入参拼装，暂不像同步函数逻辑那样提供 draft 给用户直接操作，用户必须使用 setState 修改状态 */
  getArgs?: (param: { desc: string; setState: Fn; input: any[] }) => any[];
}

/** 呼叫异步函数的逻辑封装 */
export function callAsyncMutateFnLogic<T = SharedState>(targetState: T, options: ICallAsyncMutateFnLogicOptions) {
  const { desc = '', sn, task, getArgs = noop, deps, from } = options;
  const internal = getInternal(targetState);
  const customOptions: IInnerSetStateOptions = { desc, sn, from };
  const statusKey = `${from}/${desc}`;
  const setState: any = (cb: any) => {
    return internal.innerSetState(cb, customOptions); // 继续透传 sn from 等信息
  };

  const defaultParams = { desc, setState, input: enureReturnArr(deps, targetState) };
  const args = getArgs(defaultParams) || [defaultParams];
  setLoadStatus(internal, statusKey, { loading: true, err: null, ok: false });
  // 标记 task 运行中，避免 helpers/fnDep 模块 recordFnDepKeys 方法收集冗余的 depKey 造成 mutate 死循环探测逻辑误判
  markTaskRunning();

  return Promise.resolve(task(...args))
    .then(() => {
      // TODO 考虑要不要处理 task 返回的 partial
      setLoadStatus(internal, statusKey, { loading: false, err: null, ok: true });
      return internal.snap;
    })
    .catch((err) => {
      setLoadStatus(internal, statusKey, { loading: false, err, ok: false });
      return internal.snap;
    });
}

/** 呼叫同步函数的逻辑封装 */
export function callMutateFnLogic<T = SharedState>(targetState: T, options: ICallMutateFnLogicOptions<T>) {
  const { desc = '', sn, fn, getArgs = noop, deps, from, throwErr, isFirstCall } = options;
  const internal = getInternal(targetState);
  const { forAtom, setStateImpl, innerSetState, sharedState } = internal;
  const innerSetOptions: IInnerSetStateOptions = { desc, sn, from, isFirstCall };
  // 不定制同步函数入参的话，默认就是 (draft, input)，
  // 调用函数形如：(draft)=>draft.xxx+=1; 或 (draft, input)=>draft.xxx+=input[0]
  const setState: any = (cb: any) => {
    return innerSetState(cb, innerSetOptions); // 继续透传 sn from 等信息
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
  const { draftNode: draft, draftRoot, finishMutate } = setStateImpl(noop);
  const args = getArgs({ draft, draftRoot, setState, desc, input }) || [draft, { input, state }];

  // TODO 考虑同步函数的错误发送给插件
  try {
    const result = fn(...args);
    const partial = wrapPartial(forAtom, result);
    return finishMutate(partial, innerSetOptions);
  } catch (err: any) {
    if (throwErr) {
      throw err;
    }
    setLoadStatus(internal, `${from}/${desc}`, { loading: false, err, ok: false });
    return internal.snap;
  }
}

/** 调用 mutate 函数，优先处理 task，且最多只处理一个，调用方自己保证只传一个 */
export function callMutateFn<T = SharedState>(target: T, options: ICallMutateFnOptions<T> = { forTask: false }) {
  const { fn, task, forTask } = options;
  const from = 'Mutate';
  if (forTask && task) {
    // 处理异步函数
    return callAsyncMutateFnLogic(target, { ...options, task, from });
  }
  if (!forTask && fn) {
    // 处理同步函数
    return callMutateFnLogic(target, { ...options, fn, from });
  }
  return getInternal(target).snap;
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
              callMutateFn(target, { ...baseOpt, fn, forTask: false });
            }
          }
          if (task) {
            // 第一次调用时，如未显示定义 immediate 值，则触发规律是没有 fn 则执行，有 fn 则不执行
            const canRunForFirstCall = isFirstCall && (immediate ?? !fn);
            if (!isFirstCall || canRunForFirstCall) {
              callMutateFn(target, { ...baseOpt, task, forTask: true });
            }
          }
        } catch (err: any) {
          if (err.cause === 'DeadCycle') {
            analyzeErrLog(usefulName, err);
          } else {
            tryAlert(err, false);
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
