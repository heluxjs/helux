import { enureReturnArr, isPromise, noop } from '@helux/utils';
import { FROM, SCOPE_TYPE } from '../../consts';
import { getRunningFn, getSafeFnCtx } from '../../factory/common/fnScope';
import { emitErr } from '../../factory/common/plugin';
import type { TInternal } from '../../factory/creator/buildInternal';
import { FN_DEP_KEYS, REACTIVE_META, TRIGGERED_WATCH } from '../../factory/creator/current';
import { alertDepKeyDeadCycleErr, analyzeErrLog, dcErr, inDeadCycle, probeDepKeyDeadCycle } from '../../factory/creator/deadCycle';
import { getStatusKey, setLoadStatus } from '../../factory/creator/loading';
import { getStateNode } from '../../factory/creator/mutateDeep';
import { markFnEnd } from '../../helpers/fnCtx';
import { markIgnore } from '../../helpers/fnDep';
import { getInternal } from '../../helpers/state';
import type {
  ActionAsyncReturn,
  ActionReturn,
  Fn,
  From,
  IMutateFnStdItem,
  ISetFactoryOpts,
  IWatchAndCallMutateDictOptions,
  SharedState,
} from '../../types/base';
import { createWatchLogic } from '../createWatch';
import { buildReactive, flushActive, innerFlush } from './reactive';

const noopAny: any = () => {};

interface ICallMutateBase {
  /** 透传给用户 */
  isFirstCall?: boolean;
  /** watchAndCallMutateDict 需要自己捕获错误 */
  throwErr?: boolean;
  sn?: number;
  from: From;
  fnItem: IMutateFnStdItem;
}

interface ICallMutateFnOpt<T = SharedState> extends ICallMutateBase {
  /** fn 函数调用入参拼装 */
  getArgs?: (param: { isFirstCall: boolean; draft: T; draftRoot: T; setState: Fn; desc: string; input: any[] }) => any[];
}

interface ICallAsyncMutateFnOpt extends ICallMutateBase {
  mergeReturn?: boolean;
  /** task 函数调用入参拼装，暂不像同步函数逻辑那样提供 draft 给用户直接操作，用户必须使用 setState 修改状态 */
  getArgs?: (param: { flush: any; draft: any; draftRoot: any; desc: string; setState: Fn; input: any[] }) => any[];
}

const taskProm = new Map<any, boolean>();

/**
 * deps 的第一次执行时在 createWatchLogic 步骤里，
 * 首次执行完毕收集到了依赖，后续再执行 deps 给原始对象即可
 */
function getInput(internal: TInternal, fnItem: IMutateFnStdItem) {
  const { forAtom, rawState } = internal;
  if (forAtom) {
    return enureReturnArr(fnItem.deps, rawState.val);
  }
  return enureReturnArr(fnItem.deps, rawState);
}

/**
 * task 是否是一个异步函数，首次执行完毕即可分析得到结果并缓存到 taskProm 中
 */
export function isTaskProm(task: any) {
  return taskProm.get(task) ?? false;
}

/** 呼叫异步函数的逻辑封装，mutate task 执行或 action 定义的函数（同步或异步）执行都会走到此逻辑 */
export function callAsyncMutateFnLogic<T = SharedState>(targetState: T, options: ICallAsyncMutateFnOpt): ActionReturn | ActionAsyncReturn {
  const { sn, getArgs = noop, from, throwErr, isFirstCall, fnItem, mergeReturn } = options;
  const { desc = '', depKeys, task = noopAny } = fnItem;
  const internal = getInternal(targetState);
  const { sharedKey } = internal;
  const customOptions: ISetFactoryOpts = { desc, sn, from };
  const statusKey = getStatusKey(from, desc);
  const { draft, draftRoot } = buildReactive(internal, { depKeys, desc, from });
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

  const input = FROM.MUTATE === from ? getInput(internal, fnItem) : [];
  const defaultParams = { isFirstCall, desc, setState, input, draft, draftRoot, flush };
  const args = getArgs(defaultParams) || [defaultParams];
  const isProm = taskProm.get(task);
  const isUnconfirmedFn = isProm === undefined;
  const setStatus = (loading: boolean, err: any, ok: boolean) => {
    if (isUnconfirmedFn || isProm) {
      /**
       * 异步函数调用发起前已调用 markFnEnd 来结束依赖收集行为，
       * 之前未结束这里会造成死循环（ 注：禁止异步函数依赖收集本就是合理行为 ）
       * 死循环案例：
       * mutate({ async task(){ ..... } }) 是一个会立即执行的异步任务，setLoadStatus 内部读取 loading 的状态，
       * 依赖 Mutate/1 算到当前函数上，mutate 结束后又发起一个请求 loading 变为为 false 的动作，然后又找到当前函数
       * 当前函数执行又标记 loading 为 true，如此往复形成死循环
       */
      setLoadStatus(internal, statusKey, { loading, err, ok });
    }
  };

  setStatus(true, null, false);
  const handleErr = (err: any): ActionReturn => {
    FN_DEP_KEYS.del();
    setStatus(false, err, false);
    if (throwErr) {
      throw err;
    }
    return { snap: internal.snap, err, result: null };
  };
  const handlePartial = (partial: any): ActionReturn => {
    // 来自 mutate 调用时，task 返回结果自动合并
    if (mergeReturn) {
      partial && setState(partial);
    }
    setStatus(false, null, true);
    // 这里需要主动 flush 一次，让返回的 snap 是最新值（ flush 内部会主动判断 reactive 是否已过期，不会有冗余的刷新动作产生 ）
    // const nextState = actions.xxxMethod(); //  nextState 为最新值
    // 同时多个 action 组合使用时，下一个 action 可自动获取到最新的 draft
    flush(desc);

    return { snap: internal.snap, err: null, result: partial };
  };

  try {
    const result = task(...args);
    // is result a promise
    const isProm = isPromise(result);
    // 注：只能从结果判断函数是否是 Promise，因为编译后的函数很可能再套一层函数
    taskProm.set(task, isProm);
    if (isProm) {
      return Promise.resolve(result).then(handlePartial).catch(handleErr);
    }
    return handlePartial(result);
  } catch (err) {
    return handleErr(err);
  }
}

/** 呼叫同步函数的逻辑封装 */
export function callMutateFnLogic<T = SharedState>(targetState: T, options: ICallMutateFnOpt<T>): ActionReturn {
  const { sn, getArgs = noop, from, throwErr, isFirstCall = false, fnItem } = options;
  const { desc = '', watchKey, fn = noopAny } = fnItem;
  const isMutate = FROM.MUTATE === from;
  isMutate && TRIGGERED_WATCH.set(watchKey);

  const internal = getInternal(targetState);
  const { setStateFactory, forAtom, sharedState } = internal;
  // 第一次执行时开启依赖收集
  const enableDep = isMutate && isFirstCall;
  const setFactoryOpts: ISetFactoryOpts = { desc, sn, from, isFirstCall, enableDep };
  // 不定制同步函数入参的话，默认就是 (draft, input)，
  // 调用函数形如：(draft)=>draft.xxx+=1; 或 (draft, input)=>draft.xxx+=input[0]
  const setState: any = (cb: any) => {
    const { finish } = setStateFactory(setFactoryOpts); // 继续透传 sn from 等信息
    return finish(cb);
  };

  const state = getStateNode(sharedState, forAtom);
  const input = isMutate ? getInput(internal, fnItem) : [];
  const { draftNode: draft, draftRoot, finish } = setStateFactory(setFactoryOpts);
  const args = getArgs({ isFirstCall, draft, draftRoot, setState, desc, input }) || [draft, { input, state, draftRoot, isFirstCall }];

  try {
    const fnCtx = getSafeFnCtx(fnItem.watchKey);
    // 当前函数已存在死循环
    if (fnCtx.dcErrorInfo.err) {
      alertDepKeyDeadCycleErr(internal, fnCtx.dcErrorInfo);
      return { snap: internal.snap, err: null, result: null };
    }

    const result = fn(...args);
    finish(result, { fnKey: fnCtx.fnKey });
    afterFnRun(internal, fnItem, isFirstCall);
    return { snap: internal.snap, err: null, result: null };
  } catch (err: any) {
    afterFnRun(internal, fnItem, isFirstCall);
    // TODO 同步函数错误发送给插件
    if (throwErr) {
      throw err;
    }
    return { snap: internal.snap, err, result: null };
  }
}

function afterFnRun(internal: TInternal, fnItem: IMutateFnStdItem, isFirstCall: boolean) {
  // 存档一下收集到依赖，方便后续探测异步函数里的死循环可能存在的情况
  if (isFirstCall && !fnItem.onlyDeps) {
    const fnCtx = getRunningFn().fnCtx;
    if (fnCtx) {
      // 异步函数强制忽略依赖收集行为
      fnItem.depKeys = markFnEnd();
    } else {
      // 可能在 notify 里已经执行过 markFnEnd 了，这里将 FN_DEP_KEYS.current 转移出来
      fnItem.depKeys = FN_DEP_KEYS.current();
    }
    FN_DEP_KEYS.del();
  }
  const rmeta = REACTIVE_META.current();
  // 当前 reactive 对象是在 fnCtx 内部调用时操作的，需探测死循环
  // 形如 watch(()=>{ foo() }, ()=>[s.a]) function foo(){ reactiv.a+=1 }
  if (rmeta.isTop && rmeta.fnKey === fnItem.watchKey) {
    // 发现死循环后，下一次执行被阻断
    probeDepKeyDeadCycle(internal, getSafeFnCtx(fnItem.watchKey), rmeta.writeKeys);
  }
  // 标记 fnItem 所属 watch 运行结束
  TRIGGERED_WATCH.del();
}

function initFnItem(internal: TInternal, fnItem: IMutateFnStdItem) {
  // clean
  flushActive();
  FN_DEP_KEYS.del();
  markIgnore(false);

  const fnCtx = getRunningFn().fnCtx;
  if (fnCtx) {
    // 将子函数信息挂上去
    fnCtx.subFnInfo = fnItem;
    // 优先读子函数配置，在读模块配置
    fnCtx.checkDeadCycle = fnItem.checkDeadCycle ?? internal.checkDeadCycle;
    // 双向记录一下 fnItem 和 watch 函数之间的关系
    fnItem.watchKey = fnCtx.fnKey;
  }

  // 设定了依赖全部从 deps 函数获取，提前结束运行中的 fnCtx
  if (fnItem.onlyDeps) {
    fnItem.depKeys = markFnEnd();
  }
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
  const { mutateFnDict, usefulName, forAtom, sharedState } = internal;
  const emitErrToPlugin = (err: Error) => emitErr(internal, err);

  keys.forEach((descKey) => {
    const item = mutateFnDict[descKey];
    // 开始映射 mutate 函数相关数据依赖关系
    createWatchLogic(
      ({ sn, isFirstCall }) => {
        if (isFirstCall) {
          initFnItem(internal, item);
        }
        // 调用了 ctx.setEnableMutate 设置 enableMutate 为 false
        // https://github.com/heluxjs/helux/issues/102
        if (!internal.enableMutate) {
          return;
        }

        const { desc, fn, task, immediate } = item;
        const dc = inDeadCycle(usefulName, desc);
        try {
          // 已处于死循环中的函数，不再执行
          if (dc.isIn) {
            throw dcErr(usefulName, dc.cycle, desc);
          }
          const baseOpts = { sn, throwErr: true, isFirstCall, fnItem: item, from: FROM.MUTATE };
          // 包含 task 配置时，fn 只会在首次执行被调用一次
          if (fn && (isFirstCall || !task)) {
            callMutateFnLogic(target, baseOpts);
          }

          if (task) {
            // 考虑到只有task立即执行task的情况，这里调用 markFnEnd 确保异步函数强制忽略依赖收集行为
            isFirstCall && (item.depKeys = markFnEnd());
            // 第一次调用时，如未显示定义 immediate 值，则触发规律是没有 fn 则执行 task，有 fn 则不执行 task
            const canRunAtFirstCall = isFirstCall && (immediate ?? !fn);
            if (!isFirstCall || canRunAtFirstCall) {
              // 已通过类型约定 mutate task 一定是异步函数，这里可安全 as
              const ret = callAsyncMutateFnLogic(target, baseOpts) as ActionAsyncReturn;
              ret.catch(emitErrToPlugin);
            }
          }

          return item;
        } catch (err: any) {
          if (err.cause === 'DeadCycle') {
            analyzeErrLog(usefulName, err, internal.alertDeadCycleErr);
          }
          emitErrToPlugin(err);
        }
      },
      {
        deps: () => {
          if (!item.deps) return [];
          return item.deps(getStateNode(sharedState, forAtom)) || [];
        },
        sharedState: target,
        scopeType: SCOPE_TYPE.STATIC,
        immediate: true,
      },
    );
  });
}
