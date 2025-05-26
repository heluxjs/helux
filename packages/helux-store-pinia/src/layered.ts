import { useState } from 'react';
import { getSnap, sharex, type ISharedCtx, type IUseSharedStateOptions } from 'helux';
import type { IDefineStoreOptions, ILayeredStoreCtx } from './types';
import { extractOptions, makeLifecycle, makeWrapActions, makeWrapDerived } from './util';

export function defineLayeredStore(moduleName: string, options: IDefineStoreOptions<{}, {}, {}>): ILayeredStoreCtx<{}, {}, {}> {
  const { firstVerState, lifecycle, userGetters, userActions, stateFn } = extractOptions(true, options);
  const ctx = sharex(firstVerState, { moduleName }) as ISharedCtx;
  const { state } = ctx;

  const { derivedState, useDerivedState } = makeWrapDerived(ctx, { userGetters, userActions }, true);
  const { wrapActions, getLoading, useLoading } = makeWrapActions(ctx, { userGetters, derived: derivedState, userActions }, true);
  // 创建生命周期
  makeLifecycle(ctx, lifecycle, { userGetters, userActions, wrapActions, derivedState, isLayered: true });

  return {
    getStore: () => {
      return { state: ctx.reactive, getters: derivedState, actions: wrapActions };
    },
    useState: (options?: IUseSharedStateOptions) => {
      const [reactive] = ctx.useReactive(options) as unknown as [any];
      return [reactive, wrapActions];
    },
    useGetters: (options?: IUseSharedStateOptions) => {
      const [derived] = useDerivedState(options);
      return derived;
    },
    useStore: (options?: IUseSharedStateOptions) => {
      const [reactive] = ctx.useReactive(options) as unknown as [any];
      const [derived] = useDerivedState(options);
      // 提供一个稳定的 store 对象给用户
      const [store] = useState(() => {
        return { state: reactive, actions: wrapActions, getters: derived };
      })
      return store;
    },
    getLoading,
    useLoading,
    reset: () => {
      ctx.setState(stateFn());
    },
    getSnap: (latest = true) => {
      const isPrevSnap = !latest;
      return getSnap(state, isPrevSnap);
    },
    getGettersSnap: (latest = true) => {
      return getSnap(derivedState, !latest);
    },
    state,
    reactive: ctx.reactive,
    getters: derivedState,
    actions: wrapActions,
    reactiveDesc: ctx.reactiveDesc,
  };
}
