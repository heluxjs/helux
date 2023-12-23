### type utils

```ts
/** share 返回的共享对象， draftRoot 和 draft 相等，atom 返回的共享对象， draftRoot = { val: draft } */
export type DraftRootType<T = SharedState> = T extends Atom | ReadOnlyAtom ? AtomDraft<T> : T;

/** share 返回的共享对象， draftRoot 和 draft 相等，atom 返回的共享对象， draftRoot = { val: draft } */
export type DraftType<T = SharedState> = T extends Atom | ReadOnlyAtom ? AtomDraftVal<T> : T;

export type StateRootType<T = SharedState> = T extends Atom | ReadOnlyAtom ? ReadOnlyAtom<T> : ReadOnlyDict<T>;

export type StateType<T = SharedState> = T extends Atom | ReadOnlyAtom ? ReadOnlyAtomVal<T> : ReadOnlyDict<T>;

/** partial state or cb */
export type PartialArgType<T> = T extends PlainObject ? Partial<T> | ((draft: T) => void | Partial<T>) : T | ((draft: T) => void | T);
```

## to del

```ts
AtomSyncFnBuilder;
AtomSyncer;
```

## todo

针对 action 加上 merge 实现

##

````ts
  defineTpActions: <
    D extends Dict<Action | ActionAsync> = any,
  >(actions: D, throwErr?: boolean) => {
    actions: { [K in keyof D]: (
      /** 支持用户单独使用 ActionFnParam 标记类型并推导给 action 函数 */
      payload: Parameters<D[K]>[0]['payload'],
    ) => ReturnType<D[K][0]> };
    eActions: D;
    getLoading: () => Ext<LoadingState<D>>;
    useLoading: () => [Ext<LoadingState<D>>, SetState<LoadingState>, IInsRenderInfo];
  };

  defineActions: <P extends Dict | undefined = undefined>() => <
    D = P extends Dict
    ? ({ [K in keyof P]: ActionFnDef<P[K], T> } & { [K in string]: ActionFnDef<UnconfirmedArg, T> })
    : { [K in string]: ActionFnDef<UnconfirmedArg, T> },
  >(
    /** action 函数定义字典集合 */
    actionFnDefs: D,
    /**
     * default: false，
     * false 表示 eActions 调用时，错误不抛出，传递给返回元组的第二位参数 [ result, err ]，
     * true 则表示抛出，此时用户外部的逻辑要自己 try catch 捕获错误
     */
    throwErr?: boolean,
  ) => {
    /** 调用 actions.xxMethod，返回结果为函数内部执行完毕返回的结果，会抛出函数执行过程出现的错误 */
    actions: { [K in keyof D]: (
      /** 支持用户单独使用 ActionFnParam 标记类型并推导给 action 函数 */
      payload: K extends keyof P ? PayloadType<P, K> : Parameters<D[K]>[0]['payload'],
    ) => ReturnType<D[K]> };
    /** 调用 eActions.xxMethod，返回结果为元组 [ result , err ]，会通过 throwErr 参数决定错误是抛出还是返回到元组里 */
    eActions: {
      [K in keyof D]: (
        payload: K extends keyof P ? PayloadType<P, K> : Parameters<D[K]>[0]['payload'],
        /**
         * default: undefined
         * 未设定时，走 defineActions(actionFnDefs, throwErr) 的设定或默认值
         */
        throwErr?: boolean,
      ) => ReturnType<D[K]> extends Promise<any>
        ? Promise<[PromiseValType<ReturnType<D[K]>>, Error | null]>
        : [ReturnType<D[K]>, Error | null];
    };
    getLoading: () => Ext<LoadingState<D>>;
    useLoading: () => [Ext<LoadingState<D>>, SetState<LoadingState>, IInsRenderInfo];
  };

export type ActionFnReturnType1<T> = T extends Primitive
  ? void | T
  : T extends PlainObject
  ? void | Partial<T>
  : void | T;

export type ActionFnDef1<P = any, T = any> = (
  param: ActionFnParam<P, T>,
) => T extends Atom | ReadOnlyAtom ? ActionFnReturnType1<AtomValType<T>> : ActionFnReturnType1<T>;

export type ActionFnReturnTypeAsync<T> = T extends Primitive
  ? Promise<void | T>
  : T extends PlainObject
  ? Promise<void | Partial<T>>
  : Promise<void | T> | void | T;

export type ActionFnDefAsync<P = any, T = any> = (
  param: ActionFnParam<P, T>,
) => T extends Atom | ReadOnlyAtom ? ActionFnReturnTypeAsync<AtomValType<T>> : ActionFnReturnTypeAsync<T>;

// 这个功能暂时弃用，defineActions 已支持单独对 函数标记类型

  /**
   * 单独对每一个 action 函数设定 payload 类型时，使用 defineTpActions 替代 defineActions
   * ```ts
   * const ctx = sharex(dictFactory, { moduleName: 'DefineApi' });
   *
   * const { actions, useLoading, getLoading } = ctx.defineTpActions({
   *   // 注里这里的  ctx.action 调用方式是柯里化调用 ctx.action()(fnDef)
   *   changeA: ctx.action<number>()(({ draft, payload }) => { // 此处 payload 获得类型提示
   *     draft.a.b.c = 200;
   *   }),
   *   changeB: ctx.action<boolean>()(async ({ draft, payload }) => {
   *     draft.a.b.c = 200;
   *   }),
   * });
   *
   * actions.changeB(true); // 此处入参 payload 获得类型校验
   * ```
   */
  defineTpActions: <
    D extends Dict<Action | ActionAsync> = any,
  >(actions: D, throwErr?: boolean) => {
    actions: D;
    getLoading: () => Ext<LoadingState<D>>;
    useLoading: () => [Ext<LoadingState<D>>, SetState<LoadingState>, IInsRenderInfo];
  };

````

```ts
// defineActions 和 defineAsyncActions 需要细分  ActionFnDef 是同步还是异步，故此处再次分类出
// ActionNormalFnDef  ActionFnDefAsync
export type ActionNormalFnReturnType<T> = T extends PlainObject ? void | Partial<T> : void | T;

export type ActionNormalFnDef<P = any, T = any> = (
  param: ActionFnParam<P, T>,
) => T extends Atom | ReadOnlyAtom ? ActionNormalFnReturnType<AtomValType<T>> : ActionNormalFnReturnType<T>;

export type ActionAsyncFnReturnType<T> = T extends PlainObject ? Promise<void | Partial<T>> : Promise<void | T>;

export type ActionAsyncFnDef<P = any, T = any> = (
  param: ActionFnParam<P, T>,
) => T extends Atom | ReadOnlyAtom ? ActionAsyncFnReturnType<AtomValType<T>> : ActionAsyncFnReturnType<T>;
```
