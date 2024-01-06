import { FnVoid } from '@helux/types';
import { getVal, noop } from '@helux/utils';
import { MOUNTED, SCOPE_TYPE } from '../../consts';
import { getDepKeyInfo } from '../../factory/common/util';
import { createWatchLogic } from '../../factory/createWatch';
import { parseWatchOptions } from '../../factory/creator/parse';
import { buildFnCtx, delFnCtx, markFnEnd, markFnStart } from '../../helpers/fnCtx';
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

interface IUseWatchLogicOptions {
  label: string;
  forEffect: boolean;
  watchFn: Fn;
  watchOptions: WatchOptionsType;
}

interface IFnRefCurrent {
  fn: Fn;
  wrap: any;
  fnKey: string;
  isDeferMarked: boolean;
}

function useWatchLogic(apiCtx: CoreApiCtx, options: IUseWatchLogicOptions) {
  const { useRef, useState, useMemo, useEffect } = apiCtx.react;
  const { label, forEffect, watchFn, watchOptions } = options;
  const fnRef = useRef<IFnRefCurrent>({ fn: watchFn, wrap: null, fnKey: '', isDeferMarked: false });
  const [fnCtx] = useState(() => buildFnCtx());
  // 总是绑定最新的 watchFn，让组件里的 watch 可以读取到闭包里的最新值
  // fnRef.current = watchFn; // 这样写不兼容 react dev tool
  fnRef.current.fn = useMemo(() => watchFn, [watchFn]);

  if (!fnRef.current.wrap) {
    const { deps, immediate } = parseWatchOptions(forEffect, watchOptions);
    // 传入了局部的自定义观察函数
    fnRef.current.wrap = (params: any) => {
      // 避免 strict 模式下冗余触发
      if (fnCtx.mountStatus === MOUNTED) {
        fnRef.current.fn(params);
        return;
      }

      // 组件首次渲染，用户设置 immediate 为 true 时逻辑会走到这里，推迟到 MOUNTED 设置时再执行
      fnCtx.extra.deferedWatch = () => {
        if (fnRef.current.isDeferMarked) {
          fnRef.current.fn(params);
          return;
        }
        // 对于延迟执行的函数，需要再次调用 markFnStart 才能让 fn(params) 执行收集到依赖
        fnRef.current.isDeferMarked = true;
        markFnStart(fnRef.current.fnKey, 0);
        fnRef.current.fn(params);
        markFnEnd();
      };
    };
    const { fnKey } = createWatchLogic(fnRef.current.wrap, { scopeType: HOOK, fnCtxBase: fnCtx, deps, immediate, label });
    fnRef.current.fnKey = fnKey;
  }
  useFnCtxEffect(useEffect, fnCtx);
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

export function useWatch(apiCtx: CoreApiCtx, watchFn: Fn, watchOptions: WatchOptionsType) {
  useWatchLogic(apiCtx, { label: 'useWatch', forEffect: false, watchFn, watchOptions });
}

export function useWatchEffect(apiCtx: CoreApiCtx, watchFn: Fn, watchOptions: WatchOptionsType) {
  useWatchLogic(apiCtx, { label: 'useWatchEffect', forEffect: true, watchFn, watchOptions });
}
