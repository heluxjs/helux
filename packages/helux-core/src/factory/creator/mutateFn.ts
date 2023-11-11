import { SCOPE_TYPE } from '../../consts';
import { setLoadStatus } from '../../factory/creator/loading';
import { getInternal } from '../../helpers/state';
import type { Fn, From, ICallMutateFnOptions, IConfigureMutateFnsOptions, IInnerSetStateOptions, SharedState } from '../../types';
import { enureReturnArr, isFn, isObj, noop } from '../../utils';
import { createWatchLogic } from '../createWatch';

interface ICallMutateFnLogicOptionsBase {
  desc?: string;
  sn?: number;
  skipBefore?: boolean;
  deps?: Fn;
  from: From;
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
  const { desc = '', sn, task, skipBefore = false, getArgs = noop, deps, from } = options;
  const internal = getInternal(targetState);
  const { before, setStateImpl, forAtom } = internal;
  const customOptions: IInnerSetStateOptions = { desc, sn, from };

  const setState: any = (cb: any) => {
    const { draft, finishMutate } = setStateImpl(noop);
    // 注意这里需要区分是 atom 还是 shared 返回，atom 返回要自动包裹未 { val: T }
    const mayPartial = !isFn(cb) ? mayWrapVal(forAtom, cb) : mayWrapVal(forAtom, cb(draft));
    let mayAnotherPartial = null;
    if (!skipBefore) {
      mayAnotherPartial = mayWrapVal(forAtom, before({ from, draft, desc, sn }));
    }
    let mergedPartial;
    if (mayPartial || mayAnotherPartial) {
      mergedPartial = Object.assign({}, mayPartial, mayAnotherPartial);
    }
    finishMutate(mergedPartial, customOptions);
  };

  const defaultParams = { desc, setState, input: enureReturnArr(deps) };
  const args = getArgs(defaultParams) || [defaultParams];

  const statusKey = `${from}/${desc}`;
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
  const { desc = '', sn, fn, skipBefore = false, getArgs = noop, deps, from } = options;
  const { before, setStateImpl, setDraft } = getInternal(targetState);
  const customOptions: IInnerSetStateOptions = { desc, sn, from };

  let draft = options.draft as SharedState; // 如果传递了 draft 表示需要复用
  let finishMutate = noop;
  if (!draft) {
    // 不透传 draft 时，才指向一个真正有结束功能的 finishMutate 句柄
    const ret = setStateImpl(noop);
    draft = ret.draft;
    finishMutate = ret.finishMutate;
  }
  // 不定制同步函数入参的话，默认就是 (draft, input)，
  // 调用函数形如：(draft)=>draft.xxx+=1; 或 (draft, input)=>draft.xxx+=input[0]
  const input = enureReturnArr(deps);
  const args = getArgs({ draft, setState: setDraft, desc, input }) || [draft, input];

  fn(...args);
  let newPartial;
  if (!skipBefore) {
    newPartial = before({ from, draft, desc, sn });
  }
  return finishMutate(newPartial, customOptions);
}

/** 调用 mutate 函数，优先处理 task，且最多只处理一个，调用方自己保证只传一个 */
export function callMutateFn<T = SharedState>(target: T, options: ICallMutateFnOptions<T> = { forTask: false }) {
  const { desc = '', sn = 0, fn, task, deps, draft, forTask } = options;
  const from = 'Mutate';
  if (forTask && task) {
    // 处理异步函数
    return callAsyncMutateFnLogic(target, { from, desc, sn, task, deps });
  }
  if (!forTask && fn) {
    // 处理同步函数
    return callMutateFnLogic(target, { from, desc, sn, fn, draft, deps });
  }
  return getInternal(target).snap;
}

export function configureMutateFns(options: IConfigureMutateFnsOptions) {
  const { target, fns, isOut } = options;
  let { setStateImpl, mutateFnDict } = getInternal(target);
  let { draft, finishMutate } = setStateImpl(noop);
  let lastIdx = fns.length - 1;

  fns.forEach((item, idx) => {
    // 记录外部定义的 mutate，外部调用入口中间经过 configureMutateFn时 已自动补齐可能缺失的 desc
    if (isOut) {
      mutateFnDict[item.desc || ''] = item;
    }
    // 开始映射函数相关箭头关系
    createWatchLogic(
      ({ sn, isFirstCall }) => {
        const { desc = '', fn, task, deps, immediate = false } = item;
        if (fn) {
          // 包含 task 配置时，fn 只会在首次执行被调用一次
          if (isFirstCall || !task) {
            // 首次运行会复用 draft ，经过多次修改，最后一次才提交
            callMutateFn(target, { draft, sn, fn, desc, deps, forTask: false });
          }
        }

        if (task) {
          // 第一次运行则检查 immediate
          if ((isFirstCall && immediate) || !isFirstCall) {
            callMutateFn(target, { sn, task, desc, deps, forTask: true });
          }
        }

        // 循环到最后时将收集所有函数对上游数据的依赖，然后刻意将 draft 置空，后续此段逻辑不会再触发
        if (lastIdx === idx && draft) {
          finishMutate(null, { desc: desc || 'RunMutateFns' });
          draft = null;
        }
      },
      {
        deps: item.deps || noop,
        sharedState: target,
        scopeType: SCOPE_TYPE.STATIC,
        immediate: true,
      },
    );
  });
}
