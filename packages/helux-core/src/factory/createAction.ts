import { FROM } from '../consts';
import { getStatusKey, setLoadStatus } from '../factory/creator/loading';
import type { Ext, Fn, SharedState } from '../types/base';
import { checkSharedStrict } from './common/check';
import { newMutateFnItem } from './common/ctor';
import { ensureBool } from './common/util';
import { handlePartial } from './creator/mutateDeep';
import { callAsyncMutateFnLogic } from './creator/mutateFn';

const { ACTION } = FROM;

/**
 * 内部统一封装，shared 和 atom 走统一的入口，上层接口自己标记对应类型
 */
function innerCreate<T = SharedState>(
  state: T,
  options: { task: Ext<Fn>; desc: string; label: string; throwErr?: boolean; mergeReturn?: boolean },
) {
  const { label, throwErr, desc = '', task, mergeReturn = true } = options;
  const outThrowErr = ensureBool(throwErr, false);
  const internal = checkSharedStrict(state, { label });
  const { forAtom } = internal;

  // 把 action 定义函数统一当异步函数去处理，callAsyncMutateFnLogic 内部会自动判断是否需要走异步调用逻辑
  // now fn can have a name 'action' at dev mode
  const action = (payload: any, throwFnErr?: boolean) => {
    // 用户调用 action 独立定义的 throwErr 优先级高于 创建 action 函数时预设的 throwErr
    // throwErr 谨慎处理，只严格接受布尔值
    const throwErrVar = ensureBool(throwFnErr, outThrowErr);
    const fnItem = newMutateFnItem({ desc, task, depKeys: [] });
    const dispatch = (task: any, payload: any) => {
      // 可能 task 自身就是 action，例如
      // const { actions } = definedActions()({
      //   foo(){},
      //   bar({dispatch}){
      //     // 以下两种调用方式等效
      //     dispatch(actions.foo, 1); // 此时 actions.foo 就是 action 函数
      //     actions.foo(1);
      //   },
      // })
      if (!task.__action) {
        return task(payload);
      }
      return task.__action(payload);
    };

    return callAsyncMutateFnLogic(state, {
      fnItem,
      from: ACTION,
      mergeReturn,
      throwErr: throwErrVar, // action task 默认不抛错误
      getArgs: ({ draft, draftRoot, setState, desc, flush }) => {
        const merge = (partial: any) => {
          handlePartial({ partial, forAtom, draftRoot, draftNode: draft });
        };
        return [{ draft, draftRoot, setState, desc, payload, flush, merge, dispatch }];
      },
    });
  };
  // 提前记录一个值，方便用户使用 getLoading 时可收集到依赖
  setLoadStatus(internal, getStatusKey(ACTION, desc), { loading: false, ok: true, err: null });
  action.__sharedKey = internal.sharedKey;
  action.__fnName = desc;

  // 记录task句柄，提供给 defineTpActions 克隆之用
  action.__task = task;
  // 记录 action 句柄，提供给 dispatch 使用
  task.__action = action;
  return action;
}

/**
 * 创建一个 action 函数，建议设置 desc，这样可以结合 redux-devtool 准确定位到调用源
 */
export function action<T = SharedState>(sharedState: T) {
  return (mergeReturn?: boolean) =>
    (task: Fn, desc = '', throwErr?: boolean) =>
      innerCreate(sharedState, { task, desc, label: 'action', mergeReturn, throwErr });
}
