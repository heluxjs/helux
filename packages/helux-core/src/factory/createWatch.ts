import { isFn, noop } from '@helux/utils';
import { SCOPE_TYPE, WATCH } from '../consts';
import { getRootValDepKeyInfo } from '../factory/common/util';
import { markFnEnd, markFnStart, registerFn } from '../helpers/fnCtx';
import { delFnDep, recordFnDepKeys } from '../helpers/fnDep';
import { runFn } from '../helpers/fnRunner';
import { getInternal, getSharedKey } from '../helpers/state';
import type { Fn, IFnCtx, IWatchFnParams, ScopeType, SharedState, WatchOptionsType } from '../types/base';
import { INS_CTX } from './creator/current';
import { parseWatchOptions } from './creator/parse';
interface ICreateWatchLogicOpts<T = SharedState> {
  scopeType: ScopeType;
  sharedState?: T;
  fnCtxBase?: IFnCtx;
  immediate?: boolean;
  deps?: Fn;
  label?: string;
  isSimpleWatch?: boolean;
}

function putSharedToDep(list: any[]) {
  // list 里可能包含共享状态自身引用
  if (Array.isArray(list)) {
    list.forEach((sharedState: any) => {
      // sharedState may a atom val returned by useWatch deps fn
      const insCtx = INS_CTX.current(sharedState);
      const internal = getInternal(sharedState) || insCtx?.internal;
      if (internal) {
        const { depKey, sharedKey } = getRootValDepKeyInfo(internal);
        recordFnDepKeys([depKey], { sharedKey });
      }
      // TODO discuss 加一个参数控制关闭此逻辑?
      // 有实例使用的 useWatch 的 deps 函数返回值里包含了根值自身
      if (insCtx) {
        insCtx.recordDep(getRootValDepKeyInfo(internal));
      }
    });
  }
}

export function createWatchLogic<T = SharedState>(watchFn: (fnParams: IWatchFnParams) => any, options: ICreateWatchLogicOpts<T>) {
  const { scopeType, fnCtxBase, immediate, deps = noop, label = 'watch', sharedState, isSimpleWatch } = options;
  if (!isFn(watchFn)) {
    throw new Error(`ERR_NON_FN: pass an non-function to ${label}!`);
  }

  const fnCtx = registerFn(watchFn, { specificProps: { scopeType, fnType: WATCH, isSimpleWatch }, fnCtxBase });
  markFnStart(fnCtx.fnKey, getSharedKey(sharedState));
  const list = deps() || [];
  putSharedToDep(list);

  if (immediate) {
    watchFn({ isFirstCall: true });
  }
  // 注：markFnEnd 会两调用两次，factory/creator/notify  factory/creator/mutateFn 里的会提前触发，
  // 方便函数及时锁定依赖（ 不会因为查找到其他 watch 函数继续执行导致记录无效的依赖 ）
  // 然后 deadCycle 模块可以正常探测出死循环
  // 这里再调一次兜底是为了确保函数能够结束
  markFnEnd();

  return fnCtx;
}

export function watch(watchFn: (fnParams: IWatchFnParams) => void, options?: WatchOptionsType) {
  const { deps, immediate } = parseWatchOptions(options);
  const fnCtx = createWatchLogic(watchFn, { scopeType: SCOPE_TYPE.STATIC, deps, immediate });
  return {
    run: (throwErr?: boolean) => runFn(fnCtx.fnKey, { throwErr }),
    unwatch: () => delFnDep(fnCtx),
  };
}
