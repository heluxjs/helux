import { MOUNTED, SCOPE_TYPE } from '../consts';
import { createWatchLogic } from '../factory/createWatch';
import { parseWatchOptions } from '../factory/creator/parse';
import { buildFnCtx, delFnCtx } from '../helpers/fnCtx';
import { recoverDep } from '../helpers/fnDep';
import { react } from '../react';
import type { Fn, WatchOptionsType } from '../types';
import { isFn } from '../utils';

export function useWatch(watchFn: Fn, options: WatchOptionsType) {
  const fnRef = react.useRef<any>(null);
  const fnWrapRef = react.useRef<any>(null);
  const [fnCtx] = react.useState(() => buildFnCtx());
  fnRef.current = watchFn; // 总是绑定最新的 watchFn，让组件里的 watch 可以读取到闭包里的最新值

  if (!fnWrapRef.current) {
    if (!isFn(watchFn)) {
      throw new Error('ERR_NON_WATCH_FN: useWatch only accept function');
    }
    const { deps, immediate } = parseWatchOptions(options);
    // 传入了局部的自定义观察函数
    fnWrapRef.current = (params: any) => {
      // 避免 strict 模式下冗余的触发
      if (fnCtx.mountStatus === MOUNTED) {
        fnRef.current(params);
      }
    }
    createWatchLogic(fnWrapRef.current, { scopeType: SCOPE_TYPE.HOOK, fnCtxBase: fnCtx, deps, immediate });
  }

  react.useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    recoverDep(fnCtx);
    return () => {
      delFnCtx(fnCtx);
    };
  }, [fnCtx]);

}
