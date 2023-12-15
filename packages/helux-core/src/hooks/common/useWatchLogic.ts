import { FnVoid } from '@helux/types';
import { getVal, noop } from '@helux/utils';
import { MOUNTED, SCOPE_TYPE } from '../../consts';
import { getDepKeyInfo } from '../../factory/common/util';
import { createWatchLogic } from '../../factory/createWatch';
import { parseWatchOptions } from '../../factory/creator/parse';
import { buildFnCtx, delFnCtx } from '../../helpers/fnCtx';
import { recoverDep } from '../../helpers/fnDep';
import { getSharedState } from '../../helpers/state';
import type { CoreApiCtx } from '../../types/api-ctx';
import type { Fn, IFnCtx, IWatchOptions, WatchOptionsType } from '../../types/base';

const { HOOK } = SCOPE_TYPE;
interface ISimpleWatchOptions extends IWatchOptions {
  manualDepKeys: string[];
}

function useFnCtxEffect(useEffect: FnVoid, fnCtx: IFnCtx) {
  useEffect(() => {
    fnCtx.mountStatus = MOUNTED;
    recoverDep(fnCtx);
    fnCtx.extra.deferedWatch?.();
    return () => {
      delFnCtx(fnCtx);
    };
  }, [fnCtx]);
}

/**
 * 简化版的 useWatch，服务于 block
 */
export function useWatchSimpleLogic(apiCtx: CoreApiCtx, watchFn: Fn, options: ISimpleWatchOptions) {
  const { useState, useEffect } = apiCtx.react;
  const [fnCtx] = useState(() => buildFnCtx());

  if (fnCtx.fn === noop) {
    const { manualDepKeys = [] } = options;
    // replay get logic for transfering deps
    const deps = () =>
      manualDepKeys.map((depKey) => {
        const { sharedKey, keyPath } = getDepKeyInfo(depKey);
        const state = getSharedState(sharedKey);
        return getVal(state, keyPath);
      });
    createWatchLogic(watchFn, { scopeType: HOOK, fnCtxBase: fnCtx, deps, isSimpleWatch: true });
  }
  useFnCtxEffect(useEffect, fnCtx);
}

export function useWatch(apiCtx: CoreApiCtx, watchFn: Fn, options: WatchOptionsType) {
  const { useRef, useState, useMemo, useEffect } = apiCtx.react;
  const fnRef = useRef<{ fn: Fn; wrap: any }>({ fn: watchFn, wrap: null });
  const [fnCtx] = useState(() => buildFnCtx());
  // 总是绑定最新的 watchFn，让组件里的 watch 可以读取到闭包里的最新值
  // fnRef.current = watchFn; // 这样写不兼容 react dev tool
  fnRef.current.fn = useMemo(() => watchFn, [watchFn]);

  if (!fnRef.current.wrap) {
    const { deps, immediate } = parseWatchOptions(options);
    // 传入了局部的自定义观察函数
    fnRef.current.wrap = (params: any) => {
      // 避免 strict 模式下冗余触发
      if (fnCtx.mountStatus === MOUNTED) {
        fnRef.current.fn(params);
      } else {
        // 组件首次渲染，用户设置 immediate 为 true 时逻辑会走到这里，推迟到 MOUNTED 设置时再执行
        fnCtx.extra.deferedWatch = () => fnRef.current.fn(params);
      }
    };
    createWatchLogic(fnRef.current.wrap, { scopeType: HOOK, fnCtxBase: fnCtx, deps, immediate, label: 'useWatch' });
  }
  useFnCtxEffect(useEffect, fnCtx);
}
