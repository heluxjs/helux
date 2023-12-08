import type { Fn, SharedState } from '../types/base';
import { checkShared } from './common/check';
import { callAsyncMutateFnLogic } from './creator/mutateFn';

/**
 * 内部统一封装，shared 和 atom 走统一的入口，上层接口自己标记对应类型
 */
function innerCreate<T = SharedState>(state: T, options: { fn: Fn; desc: string; label: string }) {
  const { fn, desc = '', label } = options;
  checkShared(state, { label, strict: true });
  const commonParams = { desc, from: 'Action' } as const;
  // 把 action 函数统一当异步函数去处理，callAsyncMutateFnLogic 内部会自动判断是否需要走异步调用逻辑
  const action = (payload: any) => {
    return callAsyncMutateFnLogic(state, {
      ...commonParams,
      task: fn,
      getArgs: ({ draft, draftRoot, setState, desc }) => [{ draft, draftRoot, setState, desc, payload }],
    });
  };
  // now fn can have a name 'action' at dev mode
  action.__fnName = desc;
  return action;
}

/**
 * 创建一个 action 函数，建议设置 desc，这样可以结合 redux-devtool 准确定位到调用源
 */
export function action<T = SharedState>(sharedDict: T) {
  return (fn: Fn, desc = '') => innerCreate(sharedDict, { fn, desc, label: 'action' });
}
