import { enureReturnArr, isFn, isObj, noop } from 'helux-utils';
import { EVENT_NAME, SCOPE_TYPE } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { setLoadStatus } from '../../factory/creator/loading';
import { analyzeErrLog, inDeadCycle, dcErr } from '../../factory/creator/deadCycle';
import { getInternal } from '../../helpers/state';
import type { Fn, From, ICallMutateFnOptions, IInnerSetStateOptions, IWatchAndCallMutateDictOptions, SharedState } from '../../types/base';
import { createWatchLogic } from '../createWatch';

interface ICallMutateFnLogicOptionsBase {
  desc?: string;
  sn?: number;
  skipBefore?: boolean;
  deps?: Fn;
  from: From;
  /** watchAndRunMutate 需要自己捕获错误 */
  throwErr?: boolean;
  /** 控制死循环探测逻辑执行时机 */
  isFirstCall?: boolean;
}

interface ICallMutateFnLogicOptions<T = SharedState> extends ICallMutateFnLogicOptionsBase {
  draft?: T;
  fn: Fn;
  /** fn 函数调用入参拼装 */
  getArgs?: (param: { draft: SharedState; setState: Fn; desc: string }) => any[];
}

interface ICallAsyncMutateFnLogicOptions extends ICallMutateFnLogicOptionsBase {
  task: Fn;
  /** task 函数调用入参拼装，暂不像同步函数逻辑那样提供 draft 给用户直接操作，用户必须使用 setState 修改状态 */
  getArgs?: (param: { desc: string; setState: Fn }) => any[];
}

function mayWrapVal(forAtom: boolean, val: any) {
  if (val === undefined) return; // undefined 丢弃，如正需要赋值 undefined，对 draft 操作即可
  if (forAtom) return { val };
  if (isObj(val)) return val;
}

/** 呼叫异步函数的逻辑封装 */
export function callAsyncMutateFnLogic<T = SharedState>(targetState: T, options: ICallAsyncMutateFnLogicOptions) {
  const { desc = '', sn, task, skipBefore = false, getArgs = noop, deps, from, throwErr } = options;
  const internal = getInternal(targetState);
  const { before, setStateImpl, forAtom } = internal;
  const customOptions: IInnerSetStateOptions = { desc, sn, from };
  const statusKey = `${from}/${desc}`;

  const setState: any = (cb: any) => {
    const { draft, finishMutate } = setStateImpl(noop);
    // 注意这里需要区分是 atom 还是 shared 返回，atom 返回要自动包裹未 { val: T }
    const mayPartial = !isFn(cb) ? mayWrapVal(forAtom, cb) : mayWrapVal(forAtom, cb(draft));
    let mayAnotherPartial = null;

    try {
      if (!skipBefore) {
        mayAnotherPartial = mayWrapVal(forAtom, before({ from, draft, desc, sn }));
      }
      let mergedPartial;
      if (mayPartial || mayAnotherPartial) {
        mergedPartial = Object.assign({}, mayPartial, mayAnotherPartial);
      }
      finishMutate(mergedPartial, customOptions);
    } catch (err: any) {
      if (throwErr) {
        throw err;
      }
      setLoadStatus(internal, statusKey, { loading: false, err, ok: false });
      return internal.snap;
    }
  };

  const defaultParams = { desc, setState, input: enureReturnArr(deps, targetState) };
  const args = getArgs(defaultParams) || [defaultParams];
  setLoadStatus(internal, statusKey, { loading: true, err: null, ok: false });
  return Promise.resolve(task(...args))
    .then(() => {
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
  const { desc = '', sn, fn, skipBefore = false, getArgs = noop, deps, from, throwErr, isFirstCall } = options;
  const internal = getInternal(targetState);
  const { before, setStateImpl, setDraft } = internal;
  const innerSetOptions: IInnerSetStateOptions = { desc, sn, from, isFirstCall };

  let draft = options.draft as SharedState; // 如果传递了 draft 表示需要复用
  let finishMutate = noop;

  // 现阶段此段逻辑不会触发，见 watchAndCallMutateDict TODO 解释
  if (!draft) {
    // 不透传 draft 时，才指向一个真正有结束功能的 finishMutate 句柄
    const ret = setStateImpl(noop);
    draft = ret.draft;
    finishMutate = ret.finishMutate;
  }
  // 不定制同步函数入参的话，默认就是 (draft, input)，
  // 调用函数形如：(draft)=>draft.xxx+=1; 或 (draft, input)=>draft.xxx+=input[0]
  const input = enureReturnArr(deps, targetState);
  const args = getArgs({ draft, setState: setDraft, desc, input }) || [draft, input];

  // TODO 考虑同步函数的错误发送给插件
  try {
    fn(...args);
    let newPartial;
    if (!skipBefore) {
      newPartial = before({ from, draft, desc, sn });
    }
    return finishMutate(newPartial, innerSetOptions);
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

let count = 0;

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
  // TODO: 此段代码为后面的 mutateSelf 接口做准备
  // const { setStateImpl, mutateFnDict, usefulName } = internal;
  // let { draft, finishMutate } = setStateImpl(noop);
  // const lastIdx = keys.length - 1;

  keys.forEach((descKey, idx) => {
    const item = mutateFnDict[descKey];
    // 开始映射函数相关箭头关系
    createWatchLogic(
      ({ sn, isFirstCall }) => {
        const { desc, fn, task, deps, immediate } = item;
        const dc = inDeadCycle(usefulName, desc);

        try {
          // 已处于死循环中的函数，不再执行
          if (dc.isIn) {
            throw dcErr(dc.cycle, desc);
          }

          const baseOpt = { sn, desc, deps, throwErr: true, isFirstCall };

          if (fn) {
            // 包含 task 配置时，fn 只会在首次执行被调用一次
            if (isFirstCall || !task) {
              if (count === 100) {
                return;
              }
              count++;

              console.error('---> before callMutateFn ', desc, ' isFirstCall ', isFirstCall);
              // 首次运行会复用 draft ，经过多次修改，最后一次才提交
              callMutateFn(target, { ...baseOpt, fn, forTask: false });
              console.error('---> after callMutateFn ', desc, ' isFirstCall ', isFirstCall);
            }
          }

          if (task) {
            // 第一次调用时，如未显示定义 immediate 值，则触发规律是没有 fn 则执行，有 fn 则不执行
            const canRunAtFirstCall = isFirstCall && (immediate ?? !fn);
            if (!isFirstCall || canRunAtFirstCall) {
              callMutateFn(target, { ...baseOpt, task, forTask: true });
            }
          }

          // TODO: 此段代码为后面的 mutateSelf 接口做准备，初次执行自我变更的多个函数时会更高效
          // 单因指提交一次draft的特效，对用户的mutate函数定义有特别要求，
          // 即定义 deps 取 state，单计算时必须总取 draft，因为 draft 才是最新的
          // 循环到最后时将收集所有函数对上游数据的依赖，然后刻意将 draft 置空，后续此段逻辑不会再触发
          // if (lastIdx === idx && draft) {
          //   // ATTENTION: draft = null 必须放置到 finishMutate 之前，
          //   // 原理是 finishMutate 内部流程是先结束草稿，再触发 watch，如出现循环依赖的话，
          //   // 后续会复用已撤销的 draft 或再次结束 draft 导致以下错误产生
          //   // 1 Not a Limu root draft or draft has been finished
          //   // 2 Cannot perform 'get' on a proxy that has been revoked
          //   draft = null;
          //   console.error('------> start finish draft');
          //   // 结束草稿，并开始触发收集到依赖对应的各个 watch 函数
          //   // 此阶段由 helpers/fnRunner 模块调用 probeDeadCycle 收集运行信息来避免循环依赖照成的 watch 执行死循环
          //   // finishMutate(null, { desc });
          // }

        } catch (err: any) {
          if (err.cause === 'DeadCycle') {
            analyzeErrLog(usefulName, err);
          } else {
            // tryAlert(err, false);
            console.error(err);
          }
          emitPluginEvent(internal, EVENT_NAME.ON_ERROR_OCCURED, { err });
        }
      },
      {
        deps: () => (item.deps?.(target) || []),
        sharedState: target,
        scopeType: SCOPE_TYPE.STATIC,
        immediate: true,
      },
    );
  });
}
