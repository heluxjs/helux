import type { Dict, ICreateOptions, ILifecycle, IUseSharedStateOptions, LoadingStatus } from 'helux';

/** 使用reactive修改状态时，标记表述，方便在devtool里可追溯 */
type MarkRreactiveDesc = (desc: string) => void;

type HeluxOptions = Omit<ICreateOptions, 'moduleName'>;

type D = Dict;

type EmptyDict = {};

type StateWrap<T extends Dict> = { state: T };

type GetDict<D extends any> = D extends never | undefined ? EmptyDict : D;

// 合并多个 actions 到一个字典，目前暂定只匹配前6个
type MergeActions<AS extends D[]> = GetDict<AS[0]> &
  GetDict<AS[1]> &
  GetDict<AS[2]> &
  GetDict<AS[3]> &
  GetDict<AS[4]> &
  GetDict<AS[5]> &
  GetDict<AS[6]>;

// 合并多个 getters 到一个字典，目前暂定只匹配前6个
type MergeGetters<GS extends D[]> = GettersProp<GetDict<GS[0]>> &
  GettersProp<GetDict<GS[1]>> &
  GettersProp<GetDict<GS[2]>> &
  GettersProp<GetDict<GS[3]>> &
  GettersProp<GetDict<GS[4]>> &
  GettersProp<GetDict<GS[5]>> &
  GettersProp<GetDict<GS[6]>>;

/** 将 getters 函数转为 getters 属性 */
export type GettersProp<G extends Dict> = {
  readonly [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : any;
};

// 约束返回给用户使用的 loading 类型
export type LoadingType<A extends Dict = any> = { [K in keyof A]: LoadingStatus };

export interface IDefineLayeredStoreOptions<S extends Dict, G extends Dict, A extends Dict> {
  state: (() => S) | S;
  /** 确保 getters 里能访问到 state */
  getters?: G & ThisType<StateWrap<S> & GettersProp<G>>;
  /** 确保 actions 里能访问到 state getters */
  actions?: A & ThisType<StateWrap<S> & A & GettersProp<G>>;
  /** 确保 lifecycle 里能访问到 state getters actions */
  lifecycle?: ILifecycle & ThisType<StateWrap<S> & A & GettersProp<G>>;
}

export interface ILayeredStoreCtx<S extends Dict, G extends Dict, A extends Dict> {
  getStore: () => {
    state: S;
    getters: GettersProp<G>;
    actions: A;
  };
  useState: (options?: IUseSharedStateOptions) => [S, A];
  useGetters: (options?: IUseSharedStateOptions) => GettersProp<G>;
  useStore: (options?: IUseSharedStateOptions) => { state: S; getters: GettersProp<G>; actions: A };
  useLoading: () => LoadingType<A>;
  getLoading: () => LoadingType<A>;
  getSnap: () => S;
  getGettersSnap: () => GettersProp<G>;
  reset: () => void;
  state: S;
  getters: GettersProp<G>;
  reactive: S;
  actions: A;
  reactiveDesc: MarkRreactiveDesc;
}

/**
 * 约束 defineStore options 的类型定义
 */
export interface IDefineStoreOptions<S extends Dict, G extends Dict, A extends Dict> {
  state: (() => S) | S;
  /** 确保 getters 里能访问到 state */
  getters?: G & ThisType<S & GettersProp<G>>;
  /** 确保 actions 里能访问到 state getters */
  actions?: A & ThisType<S & A & GettersProp<G>>;
  /** 确保 lifecycle 里能访问到 state getters actions */
  lifecycle?: ILifecycle & ThisType<S & A & GettersProp<G>>;
}

export interface IStoreCtx<S extends Dict, G extends Dict, A extends Dict> {
  getStore: () => S & GettersProp<G> & A;
  useStore: (options?: IUseSharedStateOptions) => S & GettersProp<G> & A;
  useLoading: () => LoadingType<A>;
  getLoading: () => LoadingType<A>;
  getSnap: () => S & GettersProp<G>;
  getGettersSnap: () => S & GettersProp<G>;
  reset: () => void;
  state: S & GettersProp<G>;
  getters: GettersProp<G>;
  reactive: S;
  actions: A;
  reactiveDesc: MarkRreactiveDesc;
}
