import { isFn } from 'helux-utils';
import { MOUNTED, SCOPE_TYPE } from '../consts';
import { createWatchLogic } from '../factory/createWatch';
import { parseWatchOptions } from '../factory/creator/parse';
import { buildFnCtx, delFnCtx } from '../helpers/fnCtx';
import { recoverDep } from '../helpers/fnDep';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Fn, WatchOptionsType } from '../types/base';

export function useWatch(apiCtx: CoreApiCtx, watchFn: Fn, options: WatchOptionsType) {
  const { useRef, useState, useMemo, useEffect } = apiCtx.react;
  const fnRef = useRef<{ fn: Fn; wrap: any }>({ fn: watchFn, wrap: null });
  const [fnCtx] = useState(() => buildFnCtx());
  // 总是绑定最新的 watchFn，让组件里的 watch 可以读取到闭包里的最新值
  // fnRef.current = watchFn; // 这样写不兼容 react dev tool
  fnRef.current.fn = useMemo(() => watchFn, [watchFn]);

  if (!fnRef.current.wrap) {
    if (!isFn(watchFn)) {
      throw new Error('ERR_NON_WATCH_FN: useWatch only accept function');
    }
    const { deps, immediate } = parseWatchOptions(options);
    // 传入了局部的自定义观察函数
    fnRef.current.wrap = (params: any) => {
      // 避免 strict 模式下冗余的触发
      if (fnCtx.mountStatus === MOUNTED) {
        fnRef.current.fn(params);
      }
    };
    createWatchLogic(fnRef.current.wrap, { scopeType: SCOPE_TYPE.HOOK, fnCtxBase: fnCtx, deps, immediate });
  }

  useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    recoverDep(fnCtx);
    return () => {
      delFnCtx(fnCtx);
    };
  }, [fnCtx]);
}
