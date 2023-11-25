import { isFn, noop } from '@helux/utils';
import { SCOPE_TYPE, WATCH } from '../consts';
import { markFnEnd, markFnStart, registerFn } from '../helpers/fnCtx';
import { recordFnDepKeys } from '../helpers/fnDep';
import { getInternal } from '../helpers/state';
import type { Fn, IFnCtx, IWatchFnParams, ScopeType, SharedState, WatchOptionsType } from '../types/base';
import { parseWatchOptions } from './creator/parse';

interface ICreateWatchLogicOpts<T = SharedState> {
  scopeType: ScopeType;
  sharedState?: T;
  fnCtxBase?: IFnCtx;
  immediate?: boolean;
  deps?: Fn;
  manualDepKeys?: string[];
  label?: string;
}

function putSharedToDep(list: any[]) {
  // list 里可能包含共享状态自身引用
  if (Array.isArray(list)) {
    list.forEach((sharedState: any) => {
      const internal = getInternal(sharedState);
      if (internal) {
        const { sharedKey, forAtom } = internal;
        // deps 列表里的 atom 结果自动拆箱
        const suffix = forAtom ? '/val' : '';
        recordFnDepKeys([`${sharedKey}${suffix}`], { sharedKey });
      }
    });
  }
}

export function createWatchLogic<T = SharedState>(watchFn: (fnParams: IWatchFnParams) => void, options: ICreateWatchLogicOpts<T>) {
  const { scopeType, fnCtxBase, immediate, deps = noop, manualDepKeys, label = 'watch' } = options;
  if (!isFn(watchFn)) {
    throw new Error(`ERR_NON_FN: pass an non-function to ${label}!`);
  }

  const fnCtx = registerFn(watchFn, { specificProps: { scopeType, fnType: WATCH }, fnCtxBase });
  if (manualDepKeys) {
    fnCtx.depKeys = manualDepKeys;
  } else {
    markFnStart(fnCtx.fnKey);
    const list = deps() || [];
    if (immediate) {
      watchFn({ isFirstCall: true });
    }
    putSharedToDep(list);
    // 注：markFnEnd 会两调用两次，factory/creator/updater 里的逻辑会提前触发一次，
    // 方便函数及时锁定依赖（ 不会因为查找到其他 watch 函数继续执行导致记录无效的依赖 ）
    // 然后 deadCycle 模块可以正常探测出死循环
    // 这里再调一次兜底是为了确保函数能够结束
    markFnEnd();
  }

  return fnCtx;
}

export function watch(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchOptionsType) {
  const { deps, immediate } = parseWatchOptions(options);
  createWatchLogic(watchFn, { scopeType: SCOPE_TYPE.STATIC, deps, immediate });
}
