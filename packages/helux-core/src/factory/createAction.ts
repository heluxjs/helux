import type { Atom, Fn, SharedDict, SharedState } from '../types';
import { checkShared } from './common/check';
import { callAsyncMutateFnLogic, callMutateFnLogic } from './creator/mutateFn';

/**
 * 内部统一封装，shared 和 atom 走统一的入口，上层接口自己标记对应类型
 */
function innerCreate<T = SharedState>(state: T, options: { fn: Fn; desc: string; label: string; forAtom?: boolean; isAsync?: boolean }) {
  const { forAtom = false, isAsync = false, fn, desc = '', label } = options;
  checkShared(state, { forAtom, label, strict: true });
  if (isAsync) {
    const asyncAction = (...args: any[]) => {
      return callAsyncMutateFnLogic(state, { task: fn, desc, getArgs: ({ setState, desc }) => [{ setState, desc, args }], from: 'Action' });
    }; // now fn can have a name 'asyncAction' at dev mode
    asyncAction.__fnName = desc;
    return asyncAction;
  }

  const action = (...args: any[]) => {
    return callMutateFnLogic(state, {
      fn,
      desc,
      getArgs: ({ draft, setState, desc }) => [{ draft, setState, desc, args }],
      from: 'Action',
    });
  }; // now fn can have a name 'action' at dev mode
  action.__fnName = desc;
  return action;
}

/**
 * 创建一个 action 函数，建议设置 desc，这样可以结合 redux-devtool 准确定位到调用源
 */
export function action<T = SharedDict>(sharedDict: T) {
  return (fn: Fn, desc = '') => innerCreate(sharedDict, { fn, desc, label: 'action' });
}

/**
 * 创建一个 action 异步函数
 */
export function actionAsync<T = SharedDict>(sharedDict: T) {
  return (fn: Fn, desc = '') => innerCreate(sharedDict, { fn, desc, label: 'actionAsync', isAsync: true });
}

/**
 * 为 atom 创建一个 action 函数
 */
export function atomAction<T = any>(atom: Atom<T>) {
  return (fn: Fn, desc = '') => innerCreate(atom, { fn, desc, label: 'atomAction', forAtom: true });
}

/**
 * 为 atom 创建一个 action 异步函数
 */
export function atomActionAsync<T = any>(atom: Atom<T>) {
  return (fn: Fn, desc = '') => innerCreate(atom, { fn, desc, label: 'atomActionAsync', isAsync: true, forAtom: true });
}
