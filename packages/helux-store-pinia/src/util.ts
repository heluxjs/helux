import type { Dict, Fn, ILifecycle, ISharedCtx } from 'helux';

function keys(obj: object) {
  return Object.keys(obj);
}

export function returnConf(conf: Dict) {
  return conf;
}

export function extractOptions(isLayered: boolean, options: any) {
  const { state: stateOrFn, getters = {}, actions = {}, lifecycle = {} } = options;
  let stateFn = stateOrFn;
  if (typeof stateOrFn !== 'function') {
    stateFn = () => stateOrFn;
  }

  const firstVerState: any = stateFn();
  const userGetters: any = getters;
  const userActions: any = actions;
  const userLifecycle: any = lifecycle;

  // 是合并型 store
  if (!isLayered) {
    // 检查是否有 key 重复
    const rawKeys = keys(firstVerState).concat(userGetters).concat(userActions).concat(userLifecycle);
    const dedupKeys = Array.from(new Set(rawKeys));
    if (rawKeys.length > dedupKeys.length) {
      throw new Error('[defineStore error]: found duplicate keys in state, getters, actions, lifecycle!');
    }

    // 把 getters 里的 key 赋值到第一版 state 里
    Object.keys(userGetters).forEach((key) => {
      firstVerState[key] = undefined;
    });
  }

  return { stateFn, firstVerState, userGetters, userActions, lifecycle };
}

export function makeWrapStore(state: any, options: any, isLayered?: boolean) {
  const { userGetters, derived, userActions, wrapActions } = options;
  const wrapStore = new Proxy(
    {},
    {
      get(t: any, p: any) {
        // state 独立存放
        if (isLayered && p === 'state') {
          return state;
        }

        if (p in state) {
          return state[p];
        }
        if (p in userGetters) {
          return derived[p];
        }
        if (p in userActions) {
          const fn = wrapActions[p];
          return fn;
        }
        return t[p];
      },
      set(t: any, p: any, v: any) {
        if (p in state) {
          state[p] = v;
          return true;
        }
        console.warn('can not set');
        return false;
      },
    },
  );
  return wrapStore;
}

export function makeWrapActions(ctx: ISharedCtx, options: any, isLayered?: boolean) {
  const { userActions, userGetters, derived } = options;
  const actionFns: any = {};
  let wrapActions: any = {};
  Object.keys(userActions).forEach((key) => {
    actionFns[key] = ({ draft, payload }: any) => {
      // 绑定 ctx.state 给 actions 函数操作
      const wrapStore = makeWrapStore(draft, { userGetters, derived, userActions, wrapActions }, isLayered);
      const fn = userActions[key].bind(wrapStore);
      // 这里的 payload 是一个数组，故使用 apply 接受并转为可变长度参数调用
      return fn.apply(null, payload);
    };
  });
  const { actions, getLoading, useLoading } = ctx.defineActions(false, true)(actionFns);
  wrapActions = actions;
  return { wrapActions: actions, getLoading, useLoading };
}

export function makeWrapDerived(ctx: ISharedCtx, options: any, isLayered?: boolean): { derivedState: any; useDerivedState: Fn } {
  const { userGetters, userActions } = options;
  const { state } = ctx;
  const initDerived: any = {};
  const deriveFns: any = {};

  if (!isLayered) {
    Object.keys(userGetters).forEach((key) => {
      deriveFns[key] = (draft: any) => {
        const wrapStore = makeWrapStore(draft, { userGetters, derived: draft, userActions, wrapActions: {} });
        const fn = userGetters[key].bind(wrapStore);
        draft[key] = fn(draft);
      };
    });
    ctx.defineMutateSelf()(deriveFns);
    // 因需要基于自身可变计算的派生属性，未分层结构用 state 当作 derived
    return { derivedState: state, useDerivedState: () => { } };
  }

  Object.keys(userGetters).forEach((key) => {
    initDerived[key] = undefined;
    deriveFns[key] = (draft: any) => {
      // 绑定 ctx.state 给 getters 函数限制为只可读操作, 提供 draft 给用户，使 getters 里 g2 依赖 g1 的计算也能正常收集到依赖
      const wrapStore = makeWrapStore(state, { userGetters, derived: draft, userActions, wrapActions: {} }, isLayered);
      const fn = userGetters[key].bind(wrapStore);
      draft[key] = fn(state);
    };
  });
  const dm = ctx.defineMutateDerive(initDerived)(deriveFns);

  return { derivedState: dm.derivedState, useDerivedState: dm.useDerivedState };
}

export function makeLifecycle(ctx: ISharedCtx, lifecycle: ILifecycle, options: any) {
  const { userGetters, userActions, wrapActions, isLayered, derived } = options;
  const { reactive } = ctx;
  const userLifecycle: any = lifecycle;
  const lifecycleFns: any = {};

  Object.keys(lifecycle).forEach((key) => {
    lifecycleFns[key] = (params: any) => {
      // 绑定 reactive 给 lifecycle 函数使用, 因为用户可能在 lifecycle 里直接修改状态
      const wrapStore = makeWrapStore(reactive, { userGetters, derived, userActions, wrapActions }, isLayered);
      const fn = userLifecycle[key].bind(wrapStore);
      fn(params);
    };
  });

  ctx.defineLifecycle(lifecycleFns);
}
