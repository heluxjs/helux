import { EVENT_NAME, SCOPE_TYPE } from '../../consts';
import { emitPluginEvent } from '../../factory/common/plugin';
import { setLoadStatus } from '../../factory/creator/loading';
import { getInternal } from '../../helpers/state';
import type { Fn, From, ICallMutateFnOptions, IInnerSetStateOptions, IWatchAndCallMutateDictOptions, SharedState } from '../../types';
import { enureReturnArr, isFn, isObj, isProxyRevoked, noop, tryAlert } from '../../utils';
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

  const defaultParams = { desc, setState, input: enureReturnArr(deps, targetState) };
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
  const internal = getInternal(targetState);
  const { before, setStateImpl, setDraft } = internal;
  const innerSetOptions: IInnerSetStateOptions = { desc, sn, from };

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
    const statusKey = `${from}/${desc}`;
    setLoadStatus(internal, statusKey, { loading: false, err, ok: false });
    return internal.snap;
  }
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

/**
 * 监听并运行 mutate 函数
 * @param options
 */
export function watchAndCallMutateDict(options: IWatchAndCallMutateDictOptions) {
  const { target, dict } = options;
  const internal = getInternal(target);
  const { setStateImpl, mutateFnDict, usefulName } = internal;
  let { draft, finishMutate } = setStateImpl(noop);
  const keys = Object.keys(dict);
  const lastIdx = keys.length - 1;
  const keysStr = keys.join(',');
  let foundRecycleDep = false;

  keys.forEach((descKey, idx) => {
    const item = mutateFnDict[descKey];
    // 开始映射函数相关箭头关系
    createWatchLogic(
      ({ sn, isFirstCall }) => {
        try {
          const { realDesc: desc, fn, task, deps, immediate = false } = item;
          console.log('run watch fn ', desc);
          if (fn) {
            // 包含 task 配置时，fn 只会在首次执行被调用一次
            if (isFirstCall || !task) {
              // 首次运行会复用 draft ，经过多次修改，最后一次才提交
              callMutateFn(target, { draft, sn, fn, desc, deps, forTask: false });
              console.log('end watch fn ', desc);
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
            console.log('del draft before', desc);
            finishMutate(null, { desc });
            // draft = null 刻意放到 finishMutate 之后，帮助helux及早发现循环引用并告知用户
            // 把 draft = null 和 finishMutate 两者顺序调换，则出现无限循环调用，无法及时拦截住循环依赖错误
            draft = null;
          }
        } catch (err: any) {
          let customLabel = '';
          if (draft != null && isProxyRevoked(draft) && err.message.includes('revoked')) {
            // 出现错误 Cannot perform 'get' on a proxy that has been revoked 代表同步的多个 mutate 里出现了循环依赖
            // 原理是 finishMutate 内部流程是先结束草稿，再触发watch，如出现循环依赖的话，后续会复用已撤销的 draft 进而导致错误产生
            customLabel = `found module [${usefulName}] recycle dep in mutate fns [${keysStr}], please check them!`;
            if (foundRecycleDep) {
              return; // 静默掉，会有多个同步函数触发，这里只需告警一次即可
            }
            foundRecycleDep = true;
          }
          tryAlert(err, false, customLabel);
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
