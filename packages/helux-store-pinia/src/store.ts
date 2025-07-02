import { getSnap, sharex, type ISharedCtx, type IUseSharedStateOptions } from 'helux';
import { useState } from 'react';
import type { HeluxOptions, IDefineStoreOptions, IStoreCtx } from './types';
import { extractOptions, makeLifecycle, makeWrapActions, makeWrapDerived, makeWrapStore } from './util';

export function defineStore(
  moduleName: string,
  options: IDefineStoreOptions<{}, {}, {}>,
  heluxOptions?: HeluxOptions,
): IStoreCtx<{}, {}, {}> {
  const { firstVerState, lifecycle, userGetters, userActions, stateFn } = extractOptions(false, options);
  const ctx = sharex(firstVerState, { ...(heluxOptions || {}), moduleName }) as ISharedCtx;
  const { state } = ctx;
  const reset = () => ctx.setState(stateFn());
  const { derivedState } = makeWrapDerived(ctx, { userGetters, userActions });
  // 未分层结构是用 state 当 derived，因为是基于自身可变计算的派生属性
  const { wrapActions, getLoading, useLoading } = makeWrapActions(ctx, { reset, userGetters, derived: derivedState, userActions });
  // 创建生命周期
  makeLifecycle(ctx, lifecycle, { userGetters, userActions, wrapActions, derivedState });

  return {
    getStore: () => {
      const { reactive } = ctx;
      // 绑定顶层 reactive 给 actions 函数或 store自身操作
      return makeWrapStore(reactive, { userGetters, derived: reactive, state, userActions, wrapActions, reset });
    },
    useStore: (options?: IUseSharedStateOptions) => {
      const [reactive] = ctx.useReactive(options) as unknown as [any];
      // 提供一个稳定的 store 对象给用户
      const [wrapStore] = useState(() => {
        // 绑定 reactive 给 actions 函数或 store自身操作
        const wrapStore = makeWrapStore(reactive, { userGetters, derived: reactive, state, userActions, wrapActions, reset });
        return wrapStore;
      });
      return wrapStore;
    },
    getLoading,
    useLoading,
    reset,
    getSnap: (latest = true) => {
      return getSnap(state, !latest);
    },
    getGettersSnap: (latest = true) => {
      return getSnap(state, !latest);
    },
    state,
    reactive: ctx.reactive,
    getters: state,
    actions: wrapActions,
    reactiveDesc: ctx.reactiveDesc,
  };
}
