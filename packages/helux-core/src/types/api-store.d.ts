import type { Dict, Fn, IActionTaskParams, ICreateOptionsFull, ILifecycle, IRenderInfo, LoadingStatus, SetState } from './base';

// 约束返回给用户使用的 loading 类型
export type LoadingType<A extends Dict = any> = { [K in keyof A]: LoadingStatus };
// 约束返回给用户使用的 actions 类型
export type ActionsType<A extends Dict = any, P extends Dict = Dict> = {
  [K in keyof A]: (payload: K extends keyof P ? P[K] : any) => ReturnType<A[K]>;
};
// 约束返回给用户使用的 derived 类型
export type DerivedType<D extends Dict = any> = {
  [K in keyof D]: ReturnType<D[K]>;
};
// 约束 defineStore options.actions 类型
export type OptionActionsType<S extends Dict = any, A extends Dict = any, P extends Dict = any> = A extends Dict
  ? {
      [K in keyof A]: (params: IActionTaskParams<S, K extends keyof P ? P[K] : any>) => any;
    }
  : A;
// 约束 defineStore options.derived 类型
export type OptionDerivedType<S extends Dict = any, D extends Dict = any> = D extends Dict
  ? {
      [K in keyof D]: (params: { state: S; getDerived: () => { [K in keyof D]: any } }) => any;
    }
  : D;

export type IStateOptions<T = any> = Omit<ICreateOptionsFull<T>, 'moduleName' | 'deep' | 'mutate' | 'mutateList' | 'enableMutate'>;

// 约束 defineStore options 类型
export interface IDefineStoreOptions<S extends Dict = any, D extends Dict = any, A extends Dict = any, P extends Dict = any> {
  state: S;
  derived?: OptionDerivedType<S, D>;
  actions?: OptionActionsType<S, A, P>;
  lifecycle?: ILifecycle;
  stateOptions?: IStateOptions<S>;
  derivedOptions?: IStateOptions;
  moduleName?: string;
}

export declare function defineStore<P extends Dict = Dict>(): <
  S extends Dict = Dict,
  D extends Dict<Fn> = Dict<Fn>,
  A extends Dict<Fn> = Dict<Fn>,
>(
  options: IDefineStoreOptions<S, D, A, P>,
) => {
  useState: () => [state: S, setState: SetState<S>, renderInfo: IRenderInfo<S>];
  useDerived: () => DerivedType<D>;
  useLoading: () => LoadingType<A>;
  actions: ActionsType<A, P>;
  state: S;
  reactive: S;
  getLoading: () => LoadingType<A>;
};
