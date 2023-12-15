import { getStatusKey, setLoadStatus } from '../factory/creator/loading';
import type { Fn, SharedState } from '../types/base';
import { checkSharedStrict } from './common/check';
import { callAsyncMutateFnLogic } from './creator/mutateFn';

const Action = 'Action';

/**
 * 内部统一封装，shared 和 atom 走统一的入口，上层接口自己标记对应类型
 */
function innerCreate<T = SharedState>(state: T, options: { task: Fn; desc: string; label: string; throwErr?: boolean }) {
  const { label, throwErr, desc = '', task } = options;
  const internal = checkSharedStrict(state, { label });
  // 把 action 函数统一当异步函数去处理，callAsyncMutateFnLogic 内部会自动判断是否需要走异步调用逻辑
  // now fn can have a name 'action' at dev mode
  const action = (payload: any, throwFnErr?: boolean) => {
    // 用户调用 action 独立定义的 throwErr 优先级高于 创建 action 函数时预设的 throwErr
    const throwErrVar = throwFnErr ?? throwErr;
    return callAsyncMutateFnLogic(state, {
      desc,
      task,
      from: Action,
      depKeys: [],
      throwErr: throwErrVar,
      getArgs: ({ draft, draftRoot, setState, desc, flush }) => [{ draft, draftRoot, setState, desc, payload, flush }],
    });
  };
  // 提前记录一个值，方便用户使用 getLoading 时可收集到依赖
  setLoadStatus(internal, getStatusKey(Action, desc), { loading: false, ok: true, err: null });
  action.__sharedKey = internal.sharedKey;
  action.__fnName = desc;
  return action;
}

/**
 * 创建一个 action 函数，建议设置 desc，这样可以结合 redux-devtool 准确定位到调用源
 */
export function action<T = SharedState>(sharedState: T) {
  return (task: Fn, desc = '', throwErr?: boolean) => innerCreate(sharedState, { task, desc, label: 'action', throwErr });
}
