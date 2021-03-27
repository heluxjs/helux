import React, { Component, ReactNode, ComponentClass, FC } from 'react';

/**
 * concent types.d.ts file v2.14.15
 */

type CC_CLASS = '$$CcClass';
type CC_HOOK = '$$CcHook';

type CC_FRAGMENT = '$$CcFrag';
type CC_CUSTOMIZE = '$$CcCust';
type CC_OB = '$$CcOb';

declare const mvoid = '$$concent_void_module_624313307';

export type MODULE_GLOBAL = '$$global';
export type MODULE_DEFAULT = '$$default';
type MODULE_CC = '$$cc';
export type MODULE_VOID = typeof mvoid;

type CcCst = {
  MODULE_GLOBAL: MODULE_GLOBAL;
  MODULE_DEFAULT: MODULE_DEFAULT;
  MODULE_CC: MODULE_CC;
  MODULE_VOID: MODULE_VOID;
  MODULE_CC_ROUTER: '$$CONCENT_ROUTER';

  CC_CLASS: CC_CLASS;
  CC_HOOK: CC_HOOK;
  CC_FRAGMENT: CC_FRAGMENT;
  CC_OB: CC_OB;
  CC_CUSTOMIZE: CC_CUSTOMIZE;
  CC_PREFIX: '$$Cc';

  CC_DISPATCHER: '$$Dispatcher';

  CCSYNC_KEY: typeof Symbol;

  SIG_FN_START: 10;
  SIG_FN_END: 11;
  SIG_FN_QUIT: 12;
  SIG_FN_ERR: 13;
  SIG_MODULE_CONFIGURED: 14;
  SIG_STATE_CHANGED: 15;
  SIG_ASYNC_COMPUTED_START: 30,
  SIG_ASYNC_COMPUTED_END: 31,
  SIG_ASYNC_COMPUTED_ERR: 32,
  SIG_ASYNC_COMPUTED_BATCH_START: 33,
  SIG_ASYNC_COMPUTED_BATCH_END: 34,

  RENDER_NO_OP: 1;
  RENDER_BY_KEY: 2;
  RENDER_BY_STATE: 3;

  FOR_CUR_MOD: 1;
  FOR_ANOTHER_MOD: 2;

  // EFFECT_AVAILABLE: 1;
  // EFFECT_STOPPED: 0;

  DISPATCH: 'dispatch';
  SET_STATE: 'setState';
  SET_MODULE_STATE: 'setModuleState';
  FORCE_UPDATE: 'forceUpdate';
  INVOKE: 'invoke';
  SYNC: 'sync';

  CATE_MODULE: 'module';
  CATE_REF: 'ref';
  FN_CU: 'computed';
  FN_WATCH: 'watch';
}

export type CalledBy = CcCst['DISPATCH'] | CcCst['SET_STATE'] | CcCst['SET_MODULE_STATE'] | CcCst['FORCE_UPDATE'] | CcCst['INVOKE'] | CcCst['SYNC'];
export type SigFn = CcCst['SIG_FN_START'] | CcCst['SIG_FN_END'] | CcCst['SIG_FN_QUIT'] | CcCst['SIG_FN_ERR'];
export type SigModuleConfigured = CcCst['SIG_MODULE_CONFIGURED'];
export type SigStateChanged = CcCst['SIG_STATE_CHANGED'];

export interface IAnyObj { [key: string]: any }
// export type IAnyObj = Record<string, any>;
export interface IAnyFn {
  (...args: any): any;
}
export interface IAnyFnPromise {
  (...args: any): any | Promise<any>;
}
export interface IAnyFnReturnObj {
  (...args: any): IAnyObj;
}
export interface IAnyFnInObj { [key: string]: IAnyFn }
export interface IAnyClass {
  new(...args: any[]): any;
}

export interface ToggleBoolFn {
  (...args: any): any;
}
export interface SyncValueToStateFn {
  (...args: any): any;
}
// let user export syncer new type when user define private state
export type Syncer<FullState> = FullState extends IAnyObj ? { [key in keyof FullState]: SyncValueToStateFn } : {};
// let user export syncerOfBool new type when user define private state
export type SyncerOfBool<FullState> = FullState extends IAnyObj ? { [key in GetBoolKeys<FullState>]: ToggleBoolFn } : {};

declare function computedFn<FnCtx extends IFnCtxBase = IFnCtxBase>(
  newState: any,
  oldState: any,
  fnCtx: FnCtx,
): any;

interface IComputedFnDesc<Fn extends typeof computedFn> {
  fn: Fn;
  sort?: number;
  compare?: boolean;
  depKeys?: DepKeys;
  retKeyDep?: boolean;
}
interface IComputedFnSimpleDesc {
  fn: IAnyFn;
  sort?: number;
  compare?: boolean;
  depKeys?: DepKeys;
  retKeyDep?: boolean;
}

export interface IReducerFn {
  // let configure works well, set actionCtx generic type any
  (payload: any, moduleState: any, actionCtx: IActionCtx<any, any, any, any, any>): any | Promise<any>;
}

// !!!use infer
export type ArrItemsType<T> = T extends (any[] | readonly any[]) ? (
  T extends Array<infer E> ? E : never
) : any;


export type ComputedValType<T> = {
  readonly [K in keyof T]: T[K] extends IAnyFn ? GetPromiseT<T[K]> :
  (T[K] extends IComputedFnSimpleDesc ? GetPromiseT<T[K]['fn']> : never);
}

// for heping refComputed to infer type
export type ComputedValTypeForFn<Fn extends IAnyFn> = {
  readonly [K in keyof ReturnType<Fn>]: ReturnType<Fn>[K] extends IAnyFn ? GetPromiseT<ReturnType<Fn>[K]> :
  (ReturnType<Fn>[K] extends IComputedFnSimpleDesc ? GetPromiseT<ReturnType<Fn>[K]['fn']> : never);
}

export type SetupFn = (ctx: ICtxBase) => IAnyObj | void;
export type SettingsType<Fn> = Fn extends SetupFn ?
  (ReturnType<Fn> extends IAnyObj ? ReturnType<Fn> : {}) : {};

/**
 * inspired by
 * https://github.com/pirix-gh/ts-toolbelt/blob/master/src/List/Tail.ts
 */
type C2List<A = any> = ReadonlyArray<A>;
type Tail<L extends C2List> =
  ((...t: L) => any) extends ((head: any, ...tail: infer LTail) => any)
  ? LTail
  : never
type GetRestItemsType<A extends Array<any>> = Exclude<A, A[0]>;
// when set bindCtxToMethod as true, user should use SettingsCType to infer ctx.settings type
export type SettingsCType<Fn extends SetupFn, Ctx extends ICtxBase = ICtxBase> =
  ReturnType<Fn> extends IAnyObj ? (
    { [key in keyof ReturnType<Fn>]:
      (
        ReturnType<Fn>[key] extends IAnyFn ?
        (...p: GetRestItemsType<Tail<Parameters<ReturnType<Fn>[key]>>>) => ReturnType<ReturnType<Fn>[key]> :
        ReturnType<Fn>[key]
      )
    }
  ) : {}

export type StateType<S> = S extends IAnyFn ? ReturnType<S> : S;

type RenderKey = string | number | Array<string | number>;

export interface IDispatchOptions {
  /**
   * force update module state no matter state changed or not, bydefaut is false
   */
  force?: boolean;
  silent?: boolean;
  lazy?: boolean;
  renderKey?: RenderKey;
  /**
   * delay broadcast state to other refs
   */
  delay?: number;
}

export interface ReducerCallerParams {
  module: string,
  fnName: string,
  payload: any,
  renderKey: any,
  delay: any,
}

type ReducerMethod<T, K extends keyof T> = T[K] extends IAnyFn ? (
  payload: Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0],
  renderKeyOrOptions?: RenderKey | IDispatchOptions,
  delay?: number,
) => ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>> : unknown;

type ReducerCallerMethod<T, K extends keyof T> = T[K] extends IAnyFn ? (
  payload: Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0],
  renderKeyOrOptions?: RenderKey | IDispatchOptions,
  delay?: number,
) => ReducerCallerParams : unknown;
// ) => ReducerCallerParams<Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]> : unknown;

export type ReducerType<S extends IAnyObj, Rd = IAnyObj> = Rd extends IAnyObj ? (
  Rd['setState'] extends Function
  ? { readonly [K in keyof Rd]: ReducerMethod<Rd, K> }
  : (
    { readonly [K in keyof Rd]: ReducerMethod<Rd, K>; }
    & { setState: <P extends Partial<S> = {}>(payload: P, renderKeyOrOptions?: RenderKey | IDispatchOptions, delay?: number) => Promise<P> }
  )) : {};

export type ReducerCallerType<T> = T extends IAnyObj ? (
  T['setState'] extends Function
  ? { readonly [K in keyof T]: ReducerCallerMethod<T, K> }
  : (
    { readonly [K in keyof T]: ReducerCallerMethod<T, K> }
    & {
      setState: <P = IAnyObj>(payload: P, renderKeyOrOptions?: RenderKey | IDispatchOptions, delay?: number) => {
        module: string, fnName: 'setState',
        payload: P, renderKey: any, delay: any,
      }
    }
  )) : {};

// attention here omit Ghosts[number]
export type ReducerGhostType<Ghosts, Reducer> = Ghosts extends readonly string[]
  ? { [key in Ghosts[number]]: Omit<Reducer, Ghosts[number]> }
  : {};

export interface EvMapBase {
  [key: string]: any[];
}

/** watch all keys changed */
export type TStar = '*';
/** collect key change automatically */
export type TAuto = '-';
export type DepKeys<State extends IAnyObj = IAnyObj> = Array<keyof State> | TStar | TAuto;

type DepKeyCollector<State> = (state: State) => any;
export type DepKeysOfWatch<State extends IAnyObj = IAnyObj> = DepKeyCollector<State> | Array<keyof State> | TStar | TAuto;

// type EvSyncReturn = (event: React.ChangeEvent<HTMLInputElement>) => void;

type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;

type RefComputedFn<FnCtx extends IFnCtxBase, CuRet, RefFullState extends IAnyObj = {}> = (
  newState: RefFullState,
  oldState: RefFullState,
  fnCtx: FnCtx,
) => CuRet;

type RefWatchFn<FnCtx extends IFnCtxBase, RefFullState extends IAnyObj = {}> = (
  newState: RefFullState,
  oldState: RefFullState,
  fnCtx: FnCtx,
) => boolean | void;

type GetComputedFn<T> = <FnCtx extends IFnCtxBase = IFnCtxBase>(
  newState: any,
  oldState: any,
  fnCtx: FnCtx,
) => T;

interface IDict {
  [customizedKey: string]: any;
  // [customizedKey2: number]: any;
}
interface IDictWithT<T> {
  [customizedKey: string]: T;
  // [customizedKey2: number]: any;
}

export interface IRootBase extends IDict {
  [mvoid]: any
  $$global: any;
  $$default: any;
  [customizedModuleKey: string]: any;
}

type PropKey = string | number | symbol;

type FnState = IAnyFnReturnObj | IAnyObj;

// export function dodo<TA, TB, keyof TA extends keyof TB>(a: TA, b: TB): void; 
type MyPick<RootState extends IRootBase, ConnectedModules extends keyof IRootBase> = Pick<RootState, ConnectedModules>;

type Super<T> = T extends infer U ? U : object;

/**
 * 
 * @param eventName 
 * @param cb 
 * suggest use conditional type to maitain EventCbArgsType
 * 
    // or type EventCbArgsType<EventName>
    type ET<EventName> = 
      EventName extends 'foo' ? [string, number] :
      EventName extends 'bar' ? [string, boolean] :
      [];
 */
declare function refCtxOn<EventCbArgs extends any[] = any[]>(eventName: string, cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[] = any[]>(eventDesc: [string, string?], cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[] = any[]>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EventCbArgs>): void;

// this way is better!!!
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventName: EvName, cb: OnCallBack<EvMap[EvName]>): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: [string, string?], cb: OnCallBack<EvMap[EvName]>): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EvMap[EvName]>): void;

type EventDesc = { name: string, identity?: string, canPerform?: (ctx: ICtxBase) => boolean, module?: string, ccClassKey?: string, ccUniqueKey?: string };
declare function refCtxEmit<EventCbArgs extends any[] = any[]>(eventName: string, ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[] = any[]>(eventDesc: [string, string?], ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[] = any[]>(eventDesc: EventDesc, ...args: EventCbArgs): void;

// this way is better!!!
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventName: string, ...args: EvMap[EvName]): void;
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventDesc: [string, string?], ...args: EvMap[EvName]): void;
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventDesc: EventDesc, ...args: EvMap[EvName]): void;

export interface OffOptions {
  module?: string;
  ccClassKey?: string;
  ccUniqueKey?: string;
}
declare function refCtxOff(eventName: string, offOptions?: OffOptions): void;
declare function refCtxOff(eventDesc: [string, string?], offOptions?: OffOptions): void;
declare function refCtxOff(eventDesc: { name: string, identity?: string }, offOptions?: OffOptions): void;

export type GetPromiseT<F extends (...args: any) => any> = F extends (...args: any) => Promise<infer T> ? T : ReturnType<F>;

/**
 * 
 * @param type 
 * @param payload 
 * @param renderKey 
 * @param delay 
 *  if first arg type is string, user should manually make sure fnName an fn is mapped correctly, if you don not want to do so, you can write code like below
 * 
 *  function aaa(){}; function bbb(){};
    type reducerFnType<FnName> =
      FnName extends 'aaa' ? typeof aaa :
      FnName extends 'bbb' ? typeof bbb :
      null;
    type PayloadType<FnName extends string> = (Parameters<reducerFnType<FnName>>)[0];
    type reducerFnResultType<FnName extends string> = ReturnType<reducerFnType<FnName>>;
 */
type RenderKeyOrOpts = RenderKey | IDispatchOptions;
declare function refCtxDispatch<RdFn extends IReducerFn>
  (type: string, payload?: (Parameters<RdFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn>
  (type: RdFn, payload?: (Parameters<RdFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn, FullState extends IAnyObj = {}>
  (type: { module?: string, fn: RdFn, cb?: (state: FullState) => void }, payload?: (Parameters<RdFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn, FullState extends IAnyObj = {}>
  (type: { module?: string, type: string, cb?: (state: FullState) => void }, payload?: (Parameters<RdFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn>
  (type: [string, RdFn], payload?: (Parameters<RdFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<RdFn>>;

declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: UserFn, payload?: (Parameters<UserFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: UserFn, payload?: (Parameters<UserFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: { module: string, fn: UserFn }, payload?: (Parameters<UserFn>)[0], renderKey?: RenderKeyOrOpts, delay?: number): Promise<GetPromiseT<UserFn>>;

declare function refCtxForceUpdate<FullState = {}>(cb?: (newFullState: FullState) => void, renderKey?: RenderKeyOrOpts, delay?: number): void;
declare function refCtxSetGlobalState<GlobalState = {}>(state: Partial<GlobalState>, cb?: (newFullState: GlobalState) => void, renderKey?: RenderKeyOrOpts, delay?: number): void;

declare function refCtxGetConnectWatchedKeys(): { [key: string]: string[] };
declare function refCtxGetConnectWatchedKeys(module: string): string[];

declare function reducerSetState<FullState = {}>(state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: RenderKeyOrOpts, delay?: number): Promise<IAnyObj | undefined>;

type ComputeCb<FullState extends IAnyObj = IAnyObj> = (newState: FullState, oldState: FullState, fnCtx: _IFnCtx<FullState>) => any;
export type MultiComputed<FullState extends IAnyObj = IAnyObj> = {
  [retKey: string]: ComputeCb<FullState> | {
    fn: ComputeCb<FullState>,
    depKeys?: DepKeys<FullState>,
    compare?: boolean,
    sort?: number,
    retKeyDep?: boolean,
  }
};
export type MultiComputedFn<State extends IAnyObj = IAnyObj> = (ctx: ICtxBase) => MultiComputed<State>;

interface ComputedCbOptions<State extends IAnyObj = IAnyObj> {
  depKeys?: DepKeys<State>,
  compare?: boolean,
  sort?: number,
  retKeyDep?: boolean
}
/**
 * ctx.comptued overloading
 * define how to compute refComputed
 */
interface RefCtxComputed<State extends IAnyObj = IAnyObj> {
  <T extends MultiComputed<State>>(multiComputed: T): ComputedValType<T>;
  <T extends MultiComputedFn<State>>(multiFn: T): ComputedValTypeForFn<T>;
  <Key extends string, Fn extends ComputeCb<State>>
    (retKey: Key, fn: Fn, depKeysOrOpts?: DepKeys<State> | ComputedCbOptions<State>): ComputedValType<{ [key in Key]: Fn }>;
  <Key extends string, Fn extends ComputeCb<State>>
    (retKey: Key, fnDesc: { fn: Fn } & ComputedCbOptions<State>): ComputedValType<{ [key in Key]: Fn }>;
}

/**
 * 不支持 computedModule 传递参数形如 (ctx)=> cuDesc
 */
interface RefCtxComputedModule<RootState extends IAnyObj = IAnyObj> {
  <T extends MultiComputed<RootState[M]>, M extends keyof RootState>(moduleName: M, multiComputed: T): ComputedValType<T>;
  // <T extends MultiComputedFn<RootState[M]>, M extends keyof RootState>(moduleName: M, multiFn: T): ComputedValTypeForFn<T>;
  <Key extends string, Fn extends ComputeCb<RootState[M]>, M extends keyof RootState>
    (moduleName: M, retKey: Key, fn: Fn, depKeysOrOpts?: DepKeys<RootState[M]> | ComputedCbOptions<RootState[M]>): ComputedValType<{ [key in Key]: Fn }>;
  <Key extends string, Fn extends ComputeCb<RootState[M]>, M extends keyof RootState>
    (moduleName: M, retKey: Key, fnDesc: { fn: Fn } & ComputedCbOptions<RootState[M]>): ComputedValType<{ [key in Key]: Fn }>;
}

interface WatchCbOptions<State extends IAnyObj = IAnyObj> {
  depKeys?: DepKeysOfWatch<State>;
  /** defalut is true */
  compare?: boolean;
  /** defalut is false */
  immediate?: boolean;
  sort?: number;
  /** retKeyDep: default is true, when key is same as state key, it will be a dep */
  retKeyDep?: boolean;
}

type WatchCb<FullState extends IAnyObj = IAnyObj> = (newState: FullState, oldState: FullState, fnCtx: _IFnCtx<FullState>) => void;
type MultiWatch<FullState extends IAnyObj = IAnyObj> = {
  [fnKey: string]: WatchCb<FullState> | {
    fn: WatchCb<FullState>,
    depKeys?: DepKeys<FullState>,
    compare?: boolean,
    immediate?: boolean,
    retKeyDep?: boolean,
  }
};
export type MultiWatchFn<FullState extends IAnyObj = IAnyObj> = (ctx: ICtxBase) => MultiWatch<FullState>;

interface RefCtxWatch<State extends IAnyObj = IAnyObj> {
  <T extends MultiWatch<State>>(multiWatch: T): void;
  <T extends MultiWatchFn<State>>(multiWatchFn: T): void;
  <Key extends string, Fn extends WatchCb<State>>(fnKey: Key, fn: Fn, depKeysOrOpts?: DepKeysOfWatch<State> | WatchCbOptions<State>): void;
  <Key extends string, Fn extends WatchCb<State>>(fnKey: Key, fnDesc: { fn: Fn } & WatchCbOptions<State>): void;
}

/**
 * 不支持 watchModule 传递参数形如 (ctx)=> watchDesc
 */
interface RefCtxWatchModule<RootState extends IAnyObj = IAnyObj> {
  <T extends MultiWatch<RootState[M]>, M extends keyof RootState>(moduleName: M, multiWatch: T): void;
  // <T extends MultiWatchFn<RootState[M]>, M extends keyof RootState>(moduleName: M, multiWatchFn: T): void;
  <Fn extends WatchCb<RootState[M]>, M extends keyof RootState>
    (moduleName: M, fn: Fn, depKeysOrOpts?: DepKeysOfWatch<RootState[M]> | WatchCbOptions<RootState[M]>): void;
  <Fn extends WatchCb<RootState[M]>, M extends keyof RootState>
    (moduleName: M, fnDesc: { fn: Fn } & WatchCbOptions<RootState[M]>): void;
}

type ClearEffect = IAnyFnPromise | IAnyFn | void;
type EffectDepKeys = string[] | null;
interface DepKeysOptions {
  depKeys?: EffectDepKeys;
  /** compare is true by default */
  compare?: boolean;
  /** immediate is true by default */
  immediate?: boolean;
}

// compare default is true, 表示针对object类型的值需不需要比较
// immediate default is true
declare function refCtxEffect<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeys?: EffectDepKeys, compare?: boolean, immediate?: boolean): void;
declare function refCtxEffect<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeysOpt?: DepKeysOptions): void;

declare function refCtxEffectProps<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeys?: EffectDepKeys, immediate?: boolean): void;
declare function refCtxEffectProps<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeysOpt?: DepKeysOptions): void;


interface SyncCb {
  (
    value: any, keyPath: string,
    syncContext: { event: React.BaseSyntheticEvent, module: string, moduleState: object, fullKeyPath: string, state: object, refCtx: object }
  ): IAnyObj | boolean;
  // if module state is not equal full state, you need pass generic type FullState
  <Val, ModuleState, FullState = {}, RefCtx extends ICtxBase = ICtxBase>(
    value: Val, keyPath: string,
    syncContext: { event: React.BaseSyntheticEvent, module: string, moduleState: ModuleState, fullKeyPath: string, state: FullState, refCtx: RefCtx }
  ): any;
}

declare function asCb
  (
    value: any, keyPath: string,
    syncContext: { event: React.BaseSyntheticEvent, module: string, moduleState: object, fullKeyPath: string, state: object, refCtx: object }
  ): any;
// if module state is not equal full state, you need pass generic type FullState
declare function asCb<Val, ModuleState, RefState, RefCtx extends ICtxBase = ICtxBase>
  (
    value: Val, keyPath: string,
    syncContext: { event: React.BaseSyntheticEvent, module: string, moduleState: ModuleState, fullKeyPath: string, state: RefState, refCtx: RefCtx }
  ): any;

interface RefCtxSync{
  (string: string, value?: SyncCb | any, renderKey?: RenderKeyOrOpts, delay?: string): IAnyFn;
  (...args: any[]): any; // 支持dom直接绑sync时ts语法正确 <input data-ccsync='name' onChange={sync} />
}  

//////////////////////////////////////////
// exposed interface
//////////////////////////////////////////

/**
 * use this interface to match ctx type that component only defined belong-module
 * 
 * concent will build ctx for every instance
 * get ctx in class : this.ctx
 * get ctx in function : const ctx = useConcent('foo');
 */
export interface ICtxBase {
  // module: '$$default';
  readonly module: PropKey;
  readonly allModules: string[];
  /** component type */
  readonly type: CC_CLASS | CC_HOOK;
  /** component instance type */
  readonly insType: CC_FRAGMENT | CC_OB | CC_CUSTOMIZE;
  readonly ccKey: string;
  readonly ccClassKey: string;
  readonly ccUniqueKey: string;
  readonly initTime: number;
  readonly renderCount: number;
  readonly watchedKeys: string[] | TStar | TAuto;
  readonly privStateKeys: string[];
  readonly connect: { [key: string]: string[] | TStar | TAuto };

  // ref can rewrite these 4 props by ccOption
  readonly persistStoredKeys: boolean;
  readonly storedKeys: string[];
  readonly renderKey: string | number;
  readonly tag: string;

  readonly mapped: any;
  readonly stateKeys: string[];

  readonly extra: any;
  readonly staticExtra: any;
  readonly state: any;
  readonly unProxyState: any;
  readonly prevState: any;
  readonly props: any;
  readonly prevProps: any;
  readonly moduleState: any;
  readonly globalState: any;
  readonly connectedState: any;
  readonly refComputed: any;
  readonly moduleComputed: any;
  readonly globalComputed: any;
  readonly connectedComputed: any;

  readonly moduleReducer: any;
  readonly globalReducer: any;
  readonly connectedReducer: any;
  readonly reducer: any;
  readonly mr: any; // alias of moduleReducer
  readonly mrc: any; // alias of moduleReducerCaller
  readonly mrg: any; // alias of moduleReducerGhost
  readonly gr: any; // alias of globalReducer
  readonly cr: any; // alias of connectedReducer
  readonly r: any; // alias of reducer

  readonly computed: RefCtxComputed<IAnyObj>;
  readonly computedModule: RefCtxComputedModule<IAnyObj>;
  readonly watch: RefCtxWatch<IAnyObj>;
  readonly watchModule: RefCtxWatchModule<IAnyObj>;
  readonly effect: typeof refCtxEffect;
  readonly effectProps: typeof refCtxEffectProps;
  readonly execute: (filters: RefFilters, handler: IAnyFnPromise) => void;

  readonly on: typeof refCtxOn;
  readonly emit: typeof refCtxEmit;
  readonly off: typeof refCtxOff;

  readonly dispatch: typeof refCtxDispatch;
  readonly dispatchLazy: typeof refCtxDispatch;
  readonly dispatchSilent: typeof refCtxDispatch;
  readonly lazyDispatch: typeof refCtxDispatch;
  readonly silentDispatch: typeof refCtxDispatch;

  readonly getWatchedKeys: () => string[];
  readonly getConnectWatchedKeys: typeof refCtxGetConnectWatchedKeys;

  readonly invoke: typeof refCtxInvoke;
  readonly invokeLazy: typeof refCtxInvoke;
  readonly invokeSilent: typeof refCtxInvoke;
  readonly lazyInvoke: typeof refCtxInvoke;
  readonly silentInvoke: typeof refCtxInvoke;

  readonly reactSetState: <P, S, K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ) => void;
  readonly reactForceUpdate: (callback?: () => void) => void;
  readonly initState: RefCtxInitState<any>;
  readonly setState: RefCtxSetState;
  readonly refs: { [key: string]: { current: any } };
  /** 
   * get target ref from ctx.refs
   */
  readonly getRef: <T extends any = any>(refName: string) => { current: T } | undefined;
  /**
   * can work for both class and function
   */
  readonly useRef: <T extends any = any>(refName: string) => ((reactRef: T) => void);
  readonly forceUpdate: typeof refCtxForceUpdate;
  readonly setGlobalState: typeof refCtxSetGlobalState;
  readonly setModuleState: RefCtxSetModuleState<any>;
  readonly sync: RefCtxSync;
  readonly syncer: any;
  readonly syncerOfBool: any;
  /** alias of  syncerOfBool */
  readonly sybo: any;
  readonly syncBool: (string: string, value?: SyncCb | boolean, renderKey?: RenderKey, delay?: string) => IAnyFn;
  readonly syncInt: (string: string, value?: SyncCb | number, renderKey?: RenderKey, delay?: string) => IAnyFn;
  readonly syncAs: (string: string, value?: typeof asCb | any, renderKey?: RenderKey, delay?: string) => any;
  readonly set: (string: string, value: any, renderKey?: RenderKey, delay?: string) => void;
  readonly setBool: (string: string, renderKey?: RenderKey, delay?: string) => void;
  readonly settings: IAnyObj;
}
interface ICtxBaseP<Props extends any> extends ICtxBase {
  props: Props;
}

type RefCtxInitState<ModuleState extends IAnyObj = IAnyObj> = <PrivState extends IAnyObj>(state: PrivState | (() => PrivState)) =>
  Extract<keyof PrivState, keyof ModuleState> extends never
  // you must make sure that there is no common keys between privState and moduleState
  ? {
    state: PrivState & ModuleState, computed: RefCtxComputed<PrivState & ModuleState>,
    watch: RefCtxWatch<PrivState & ModuleState>, setState: RefCtxSetState<PrivState & ModuleState>,
    sync: RefCtxSync, syncer: Syncer<PrivState & ModuleState>,
    syncerOfBool: SyncerOfBool<PrivState & ModuleState>, sybo: SyncerOfBool<PrivState & ModuleState>,
    ccUniqueKey: string;
    initTime: number;
    renderCount: number;
  }
  : never;

type DecideFullState<T1, T2 extends IAnyObj> = T2['__no_anyobj_passed__'] extends '_nap_' ? T1 : T2;

/**
 * ctx.setState overloading
 */
interface RefCtxSetState<FullState extends IAnyObj = IAnyObj> {
  <MergedFullState extends IAnyObj = { __no_anyobj_passed__: '_nap_' }>(
    state: Partial<DecideFullState<FullState, MergedFullState>>,
    cb?: (newFullState: DecideFullState<FullState, MergedFullState>) => void | null,
    renderKey?: RenderKeyOrOpts,
    delay?: number,
  ): void;
  <MergedFullState extends IAnyObj = { __no_anyobj_passed__: '_nap_' }>(
    updater: (prevFullState: DecideFullState<FullState, MergedFullState>, props: any) => Partial<DecideFullState<FullState, MergedFullState>>,
    renderKey?: RenderKeyOrOpts,
    delay?: number,
  ): void;
}

interface RefCtxSetModuleState<ModuleState extends IAnyObj = IAnyObj> {
  (
    state: Partial<ModuleState>,
    cb?: (newFullState: ModuleState) => void | null,
    renderKey?: RenderKeyOrOpts,
    delay?: number,
  ): void;
  (
    updater: (prevFullState: ModuleState, props: any) => Partial<ModuleState>,
    renderKey?: RenderKeyOrOpts,
    delay?: number,
  ): void;
}

/**
 * the difference between IRefCtx and ICtx is that
 * IRefCtx doesn't need to know RootModule
 */
export interface IRefCtx<
  Props extends IAnyObj = {},
  PrivState extends IAnyObj = {},
  ModuleState extends IAnyObj = {},
  ModuleReducer extends IAnyObj = {},
  ModuleReducerCaller extends IAnyObj = {},
  ModuleReducerGhost extends IAnyObj = {},
  ModuleComputed extends IAnyObj = {},
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  Mapped extends IAnyObj = {},
  // when connect other modules
  ConnectedState extends IAnyObj = {},
  ConnectedReducer extends IAnyObj = {},
  ConnectedComputed extends IAnyObj = {},
  ExtraTypes extends [IAnyObj, any] | [IAnyObj] = [IAnyObj, any],
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  readonly state: PrivState & ModuleState;
  readonly unProxyState: PrivState & ModuleState;
  readonly extra: ExtraTypes[0];
  readonly staticExtra: ExtraTypes[1] extends undefined ? any : ExtraTypes[1];
  readonly prevState: PrivState & ModuleState;
  readonly moduleState: ModuleState;
  readonly moduleComputed: ModuleComputed;
  readonly moduleReducer: ModuleReducer;
  readonly mr: ModuleReducer;// alias of moduleReducer
  readonly mrc: ModuleReducerCaller;// alias of moduleReducerCaller
  readonly mrg: ModuleReducerGhost;// alias of moduleReducerGhost
  readonly settings: Settings;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
  // when connect other modules
  readonly connectedState: ConnectedState;
  readonly connectedReducer: ConnectedReducer;
  readonly cr: ConnectedReducer;// alias of connectedReducer
  readonly connectedComputed: ConnectedComputed;
  readonly computed: RefCtxComputed<PrivState & ModuleState>;
  readonly computedModule: RefCtxComputedModule;
  readonly watch: RefCtxWatch<PrivState & ModuleState>;
  readonly watchModule: RefCtxWatchModule;
  readonly initState: RefCtxInitState<ModuleState>;
  readonly setState: RefCtxSetState<ModuleState>;
  readonly setModuleState: RefCtxSetModuleState<ModuleState>;
  readonly syncer: Syncer<ModuleState>;
  readonly syncerOfBool: { [key in keyof PickBool<ModuleState>]: IAnyFn };
  /** alias of syncerOfBool  */
  readonly sybo: { [key in keyof PickBool<ModuleState>]: IAnyFn };
}

export interface IRefCtxWithRoot<
  RootInfo extends IAnyObj = {},
  Props extends IAnyObj = {},
  PrivState extends IAnyObj = {},
  ModuleState extends IAnyObj = {},
  ModuleReducer extends IAnyObj = {},
  ModuleReducerCaller extends IAnyObj = {},
  ModuleReducerGhost extends IAnyObj = {},
  ModuleComputed extends IAnyObj = {},
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  Mapped extends IAnyObj = {},
  // when connect other modules
  ConnectedState extends IAnyObj = {},
  ConnectedReducer extends IAnyObj = {},
  ConnectedComputed extends IAnyObj = {},
  ExtraType extends [IAnyObj, any] | [IAnyObj] = [IAnyObj, any],
  >
  extends IRefCtx<
  Props, PrivState, ModuleState, ModuleReducer, ModuleReducerCaller, ModuleReducerGhost,
  ModuleComputed, Settings, RefComputed,
  Mapped, ConnectedState, ConnectedReducer, ConnectedComputed, ExtraType
  > {
  readonly globalState: GetSubType<GetSubType<RootInfo, 'state'>, MODULE_GLOBAL>;
  readonly globalComputed: ComputedValType<GetSubType<GetSubType<RootInfo, 'computed'>, MODULE_GLOBAL>>;
  readonly watchModule: RefCtxWatchModule<GetSubType<RootInfo, 'state'>>;
}


export interface ModuleDesc {
  // most time you use define state as IAnyFnReturnObj, then it can been cloned anytime
  state: IAnyObj | IAnyFnReturnObj;
  reducer?: IAnyFnInObj;
  computed?: { [key: string]: IAnyFn | IComputedFnSimpleDesc };
  ghosts?: readonly string[];
  watch?: { [key: string]: IAnyFn | WatchFnDesc };
}
interface RootModule {
  [key: string]: ModuleDesc;
}

type GetSubType<T, K> = K extends keyof T ? T[K] : {};
type GetSubArrType<T, K> = K extends keyof T ? T[K] : [];
type GetSubRdType<M extends ModuleDesc> = ReducerType<StateType<M['state']>, GetSubType<M, 'reducer'>>;
type GetSubRdCallerType<M extends ModuleDesc> = ReducerCallerType<GetSubType<M, 'reducer'>>;
type GetSubRdGhostType<M extends ModuleDesc> = ReducerGhostType<GetSubArrType<M, 'ghosts'>, GetSubRdType<M>>;
type GetSubCuType<M extends ModuleDesc> = ComputedValType<GetSubType<M, 'computed'>>;

type GetConnState<Mods extends RootModule, Conn extends keyof Mods> = {
  [key in Conn]: StateType<Mods[key]['state']>
} & (IncludeModelKey<Mods, MODULE_GLOBAL> extends true ? {} : { [key in MODULE_GLOBAL]: {} });
type GetConnReducer<Mods extends RootModule, Conn extends keyof Mods> = {
  [key in Conn]: ReducerType<StateType<Mods[key]['state']>, Mods[key]['reducer']>
} & (IncludeModelKey<Mods, MODULE_GLOBAL> extends true ? {} : { [key in MODULE_GLOBAL]: {} });
type GetConnComputed<Mods extends RootModule, Conn extends keyof Mods> = {
  [key in Conn]: ComputedValType<Mods[key]['computed']>
} & (IncludeModelKey<Mods, MODULE_GLOBAL> extends true ? {} : { [key in MODULE_GLOBAL]: {} });

export interface IRefCtxM<
  RootInfo extends IAnyObj, Props extends IAnyObj, M extends ModuleDesc, Se = {}, RefCu = {}, Extra = {}
  >
  extends IRefCtxWithRoot<
  RootInfo, Props, {}, StateType<M['state']>, GetSubRdType<M>, GetSubRdCallerType<M>, GetSubRdGhostType<M>,
  GetSubCuType<M>, Se, RefCu, {}, {}, {}, {}, [Extra]
  > { }
export interface IRefCtxMS<
  RootInfo extends IAnyObj, Props extends IAnyObj, M extends ModuleDesc, St extends IAnyObj = {}, Se = {}, RefCu = {}, Extra = {}
  >
  extends IRefCtxWithRoot<
  RootInfo, Props, St, StateType<M['state']>, GetSubRdType<M>, GetSubRdCallerType<M>, GetSubRdGhostType<M>,
  GetSubCuType<M>, Se, RefCu, {}, {}, {}, {}, [Extra]
  > { }
export interface IRefCtxS<
  RootInfo extends IAnyObj, Props extends IAnyObj, St extends IAnyObj = {}, Se = {}, RefCu = {}, Extra = {}
  >
  extends IRefCtxWithRoot<RootInfo, Props, St, {}, {}, {}, Se, RefCu, {}, {}, {}, {}, [Extra]
  > { }
export interface IRefCtxMConn<
  RootInfo extends IAnyObj, Props extends IAnyObj, M extends ModuleDesc, Mods extends RootModule,
  Conn extends keyof Mods, Se = {}, RefCu = {}, Extra = {}
  >
  extends IRefCtxWithRoot<
  RootInfo, Props, {}, StateType<M['state']>, GetSubRdType<M>, GetSubRdCallerType<M>, GetSubRdGhostType<M>, GetSubCuType<M>, Se, RefCu,
  {}, GetConnState<Mods, Conn>, GetConnReducer<Mods, Conn>, GetConnComputed<Mods, Conn>, [Extra]
  > { }
export interface IRefCtxMSConn<
  RootInfo extends IAnyObj, Props extends IAnyObj, M extends ModuleDesc, St extends IAnyObj,
  Mods extends RootModule, Conn extends keyof Mods, Se = {}, RefCu = {}, Extra = {},
  >
  extends IRefCtxWithRoot<
  RootInfo, Props, St, StateType<M['state']>, GetSubRdType<M>, GetSubRdCallerType<M>, GetSubRdGhostType<M>, GetSubCuType<M>, Se, RefCu,
  {}, GetConnState<Mods, Conn>, GetConnReducer<Mods, Conn>, GetConnComputed<Mods, Conn>, [Extra]
  > { }
export interface IRefCtxConn<
  RootInfo extends IAnyObj, Props extends IAnyObj, Mods extends RootModule, Conn extends keyof Mods, Se = {}, RefCu = {}, Extra = {},
  >
  extends IRefCtxWithRoot<
  RootInfo, Props, {}, {}, {}, {}, Se, RefCu,
  {}, GetConnState<Mods, Conn>, GetConnReducer<Mods, Conn>, GetConnComputed<Mods, Conn>, [Extra]
  > { }

// !!! only extract boolean value type's keys
type GetBoolKeys<T extends IAnyObj> = { [K in keyof T]: T[K] extends boolean ? K : never }[keyof T];
type PickBool<T extends IAnyObj> = Pick<T, GetBoolKeys<T>>;

/**
 *  =================================
 *   ICtx series start! because ICtx has strict type check, so start with RootState RootReducer RootComputed generic type
 *  =================================
 */
export interface ICtx
  <
  RootState extends IRootBase = IRootBase,
  RootReducer extends { [key in keyof RootState]?: any } = IRootBase,
  RootReducerCaller extends { [key in keyof RootState]?: any } = IRootBase,
  RootReducerGhost extends { [key in keyof RootState]?: any } = IRootBase,
  RootCu extends { [key in keyof RootState]?: any } = IRootBase,
  Props = {},
  PrivState = {},
  ModuleName extends keyof RootState = MODULE_DEFAULT,
  // ConnectedModules extends keyof IRootBase = MODULE_VOID,
  // !!! 配合下面的问题注释掉
  ConnectedModules extends keyof RootState = MODULE_VOID,
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  Mapped extends IAnyObj = {},
  ExtraType extends [any, any] | [any] = [any, any],
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  readonly globalState: RootState[MODULE_GLOBAL];
  readonly globalComputed: RootCu[MODULE_GLOBAL];
  readonly extra: ExtraType[0];
  readonly staticExtra: ExtraType[1] extends undefined ? any : ExtraType[1];
  readonly computed: RefCtxComputed<PrivState & RootState[ModuleName]>;
  readonly computedModule: RefCtxComputedModule<RootState>;
  readonly watch: RefCtxWatch<PrivState & RootState[ModuleName]>;
  readonly watchModule: RefCtxWatchModule<RootState>;
  readonly initState: RefCtxInitState<RootState[ModuleName]>;
  readonly setState: RefCtxSetState<RootState[ModuleName]>;
  readonly setModuleState: RefCtxSetModuleState<RootState[ModuleName]>;
  readonly syncer: Syncer<RootState[ModuleName]>;
  readonly syncerOfBool: { [key in keyof PickBool<RootState[ModuleName]>]: IAnyFn };
  /** alias of syncerOfBool */
  readonly sybo: { [key in keyof PickBool<RootState[ModuleName]>]: IAnyFn };
  readonly state: PrivState & RootState[ModuleName];
  readonly unProxyState: PrivState & RootState[ModuleName];
  readonly prevState: PrivState & RootState[ModuleName];
  readonly moduleState: RootState[ModuleName];
  readonly reducer: RootReducer;
  readonly r: RootReducer;
  readonly globalReducer: RootReducer[MODULE_GLOBAL];
  readonly gr: RootReducer[MODULE_GLOBAL];
  readonly moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof reducerSetState }
  ) : {};
  // alias of moduleReducer
  readonly mr: ModuleName extends keyof RootReducer ? RootReducer[ModuleName] : {};
  // alias of moduleReducerCaller
  readonly mrc: ModuleName extends keyof RootReducerCaller ? RootReducerCaller[ModuleName] : {};
  readonly mrg: ModuleName extends keyof RootReducerGhost ? (
    { [K in keyof ArrItemsType<RootReducerGhost[ModuleName]>]: RootReducer[ModuleName] }
  ) : {};
  readonly moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : {};
  readonly settings: Settings;
  /** for user get computed value in ui */
  readonly refComputed: RefComputed;
  readonly mapped: Mapped;
  // overwrite connectedState , connectedComputed
  readonly connectedState: Pick<RootState, ConnectedModules | MODULE_GLOBAL>;
  readonly connectedReducer: Pick<RootReducer, ConnectedModules | MODULE_GLOBAL>;
  readonly cr: Pick<RootReducer, ConnectedModules | MODULE_GLOBAL>;// alias of connectedReducer
  readonly connectedComputed: Pick<RootCu, ConnectedModules | MODULE_GLOBAL>;

  // !!! 目前这样写有问题，例如连接是foo,bar, 
  // 外面推导出的是 Pick<RootReducer, 'foo'> | Pick<RootReducer, 'bar'>
  // 而不是 Pick<RootReducer, 'foo' | 'bar'>

  // connectedReducer: ConnectedModules extends keyof RootReducer ? Pick<RootReducer, ConnectedModules> : {};
  // connectedComputed: ConnectedModules extends keyof RootCu ? Pick<RootCu, ConnectedModules> : {};
}

export interface ICtxCommon<
  Props = {},
  PrivState extends IAnyObj = {},
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  RootState extends IRootBase = IRootBase,
  Extra extends [any, any] | [any] = [any, any],
  > extends ICtx<
  RootState, {}, {}, {}, {}, Props, PrivState,
  MODULE_DEFAULT, MODULE_VOID, Settings, RefComputed, {}, Extra
  > { }

// this kind of ctx must belong to $$default module
// it has no default type as it has not been exposed to user!
export interface ICtxDefault
  <
  RootState extends IRootBase = IRootBase,
  RootReducer extends { [key in keyof RootState]?: any } = IRootBase,
  RootReducerCaller extends { [key in keyof RootState]?: any } = IRootBase,
  RootReducerGhost extends { [key in keyof RootState]?: any } = IRootBase,
  RootCu extends { [key in keyof RootState]?: any } = IRootBase,
  Props = {},
  PrivState extends IAnyObj = {},
  ModuleName extends Required<MODULE_DEFAULT> = MODULE_DEFAULT,
  ConnectedModules extends keyof RootState = MODULE_VOID,
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  Mapped extends IAnyObj = {},
  Extra extends [any, any] | [any] = [any, any],
  >
  extends ICtx
  <
  RootState, RootReducer, RootReducerCaller, RootReducerGhost, RootCu, Props, PrivState,
  ModuleName, ConnectedModules, Settings, RefComputed, Mapped, Extra
  > {
  // __key_as_hint_your_ctx_is_not_default__: 'your component is belong to $$default module by default, but you give a type Ctx which not belong to $$default module',
}


type GetFnCtxCommit<ModuleState> = <PS extends Partial<ModuleState>>(partialState: PS) => void;
type GetFnCtxCommitCu<ModuleComputed> = <PC extends Partial<ModuleComputed>>(partialComputed: PC) => void;


// to constrain IFnCtx interface series shape
interface _IFnCtx<FullState extends IAnyObj = IAnyObj> {// 方便 ctx.computed({....}) 定义计算描述体时，可以正确赋值fnCtx类型
  retKey: string;
  callInfo: ICallInfo,
  /**
   * is cb been called first time
   */
  isFirstCall: boolean;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: FullState;
  committedState: IAnyObj;
  deltaCommittedState: IAnyObj;
  cuVal: IAnyObj;
  refCtx: ICtxBase;
  setInitialVal: (initialVal: any) => void;
  commit: GetFnCtxCommit<FullState>;
  commitCu: GetFnCtxCommitCu<any>;
}
export interface IFnCtxBase extends _IFnCtx {
  refCtx: ICtxBase;
}
// M, means need module associate generic type
export interface IFnCtx<RefCtx extends ICtxBase = ICtxBase, FullState = {}, Computed = {}> extends IFnCtxBase {
  commit: GetFnCtxCommit<FullState>;// for module computed or watch definition, FullState equivalent ModuleState, Computed equivalent ModuleComputed
  commitCu: GetFnCtxCommitCu<Computed>;
  committedState: Partial<FullState>;
  cuVal: Computed;
  oldState: FullState;
  refCtx: RefCtx;
  // __forCheckRefCtxAndCu__?: RefCtx['moduleComputed'] extends {} ? (
  //   Computed extends {} ? true : never
  // ) : (
  //   Computed extends RefCtx['moduleComputed'] ? true : never
  // );
}

declare class ConcentComponent<P> extends Component {
  ctx: ICtxBase;
  constructor(props: Readonly<P>);
  constructor(props: P, context?: any);
}
interface IRegBase<P extends IAnyObj, ICtx extends ICtxBase> {
  module?: PropKey;
  props?: P;
  state?: IAnyFnReturnObj | IAnyObj;
  extra?: any, // assign to ctx.extra in every render period for useConcent , but only time for register
  staticExtra?: any, // assign to ctx.staticExtra only one time for useConcent and register both
  watchedKeys?: string[] | TStar | TAuto;
  storedKeys?: string[];
  connect?: any;
  tag?: string;
  persistStoredKeys?: boolean;
  lite?: 1 | 2 | 3 | 4;
  layoutEffect?: boolean; // work for useConcent only
  isPropsProxy?: boolean; // work for register only, default false
  bindCtxToMethod?: boolean; // default false
  renderKeyClasses?: string[];
  compareProps?: boolean; //default true
  setup?: (refCtx: ICtx) => IAnyObj | void;
  cuDesc?: MultiComputed | MultiComputedFn | null;
  // render?: (ctxOrMapped: any) => ReactNode; // work for useConcent, registerHookComp, registerDumb only
}

// 不把render写在IRegBase里，会导致registerHookComp接口里的联合类型render函数类型失效
// 所以这里单独为CcFrag单独写一个接口
interface IRegBaseFrag<P extends IAnyObj, ICtx extends ICtxBase> extends IRegBase<P, ICtx> {
  render?: (ctxOrMapped: any) => ReactNode; // work for useConcent, registerHookComp, registerDumb only
}

interface IRegBaseSt<P extends IAnyObj, ICtx extends ICtxBase, FnState = {}> extends IRegBase<P, ICtx> {
  state: FnState; // state required
}

// 加readonly 修饰是为了支持声明connect时用 as const后缀
// @see https://codesandbox.io/s/concent-guide-ts-zrxd5?file=/src/pages/CtxMConn/index.tsx
type ConnectSpec<RootState extends IRootBase> = (keyof RootState)[] | readonly (keyof RootState)[] |
  // !!! currently I do not know how to pass ${moduleName} to evaluate target type in object value
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState)]?: TStar | TAuto | string[] };

type TargetKeysInFn<PrivState extends IAnyFnReturnObj> = Exclude<keyof ReturnType<PrivState>, (number | symbol)>;
type TargetKeysInObj<PrivState extends IAnyObj> = Exclude<keyof PrivState, (number | symbol)>;
export interface RegisterOptions<
  P extends IAnyObj,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState,
  ICtx extends ICtxBase = ICtxBase
  >
  extends IRegBase<P, ICtx> {
  module?: ModuleName,
  state?: PrivState,
  watchedKeys?: (Extract<keyof RootState[ModuleName], string>)[] | TStar | TAuto;
  storedKeys?: PrivState extends IAnyFn ? (TargetKeysInFn<PrivState>)[] : (TargetKeysInObj<PrivState>)[]
  connect?: ConnectSpec<RootState>,
  setup?: (refCtx: ICtx) => IAnyObj | void;
}

// only state required
interface RegisterOptionsSt<
  P extends IAnyObj,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState,
  ICtx extends ICtxBase = ICtxBase
  >
  extends RegisterOptions<P, RootState, ModuleName, PrivState, ICtx> {
  state: PrivState;
}
// only module required
interface RegisterOptionsMo<
  P extends IAnyObj,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState,
  ICtx extends ICtxBase = ICtxBase
  >
  extends RegisterOptions<P, RootState, ModuleName, PrivState, ICtx> {
  module: ModuleName,
}
// both module、state required
interface RegisterOptionsMoSt<
  P extends IAnyObj,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState,
  ICtx extends ICtxBase = ICtxBase
  >
  extends RegisterOptions<P, RootState, ModuleName, PrivState, ICtx> {
  module: ModuleName,
  state: PrivState;
}

//user decide it is FnCtx or FnCtxConnect
interface WatchFn {
  <IFnCtx extends IFnCtxBase>(newState: any, oldState: any, fnCtx: IFnCtx): void | boolean;
}
// declare function watchFn<IFnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: IFnCtx): void;
type WatchFnDesc = {
  fn: WatchFn,
  compare?: boolean,// default is runtimeVar.watchCompare
  immediate?: boolean,// default is runtimeVar.watchImmediate
  depKeys?: DepKeysOfWatch,// default is '-'
  retKeyDep?: boolean,// default is true
}

type TypeDesc = {
  module?: string;
  type: string;
  cb?: Function;
};

declare function init<T extends IAnyObj = IAnyObj>(moduleState: T): Partial<T>;
declare function init<T extends IAnyObj = IAnyObj>(moduleState: T): Promise<Partial<T>>;

/** default is true */
export type TriggerOnce = boolean | void;
export type ModuleConfig = {
  state: Object;
  reducer?: {
    [fnName: string]: IReducerFn;
  };
  ghosts?: string[] | readonly string[];
  computed?: {
    [retKey: string]: typeof computedFn | IComputedFnSimpleDesc;
  };
  watch?: {
    // [retKey: string]: typeof watchFn | WatchFnDesc;
    [retKey: string]: WatchFn | WatchFnDesc;
  };
  lifecycle?: {
    initState?: typeof init; // legency for ModuleConfig.init
    initStateDone?: (dispatch: IDispatch, moduleState: any) => any; // legency for ModuleConfig.initPost
    // insteand of initState and initStateDone, using bellow methods is better way
    // because you can put the logic to reducer
    loaded?: (dispatch: IDispatch, moduleState: any) => void;
    // return triggerOnce, default is true, 
    // that means mounted will only been called one time if match the condition
    mounted?: (dispatch: IDispatch, moduleState: any) => TriggerOnce;
    willUnmount?: (dispatch: IDispatch, moduleState: any) => TriggerOnce;
  }
}

export interface StoreConfig {
  [moduleName: string]: ModuleConfig;
}

export type MidCtx = {
  calledBy: CalledBy, type: string, payload: any,
  renderKey: Array<string | number>[], delay: number, ccKey: string, ccUniqueKey: string,
  committedState: object, sharedState: object | null,
  refModule: string, module: string, fnName: string,
  modState: (key: string, value: any) => void,
};

type SigFnData = {
  sig: SigFn,
  payload: {
    isSourceCall: boolean,
    calledBy: CalledBy,
    module: string,
    chainId: number,
    fn: Function,
  }
};
type SigModuleConfiguredData = {
  sig: SigModuleConfigured,
  payload: string,//配置了新模块
};
type SigStateChangedData = {
  sig: SigStateChanged,
  payload: {
    calledBy: CalledBy,
    type: string,
    committedState: IAnyObj,
    sharedState: IAnyObj | null,
    module: string,
    ccUniqueKey: string,
    renderKey: Array<string | number>[],
  }
};

declare function ccPluginOn(sig: SigFn | SigFn[], callback: (data: SigFnData) => void): void;
declare function ccPluginOn(sig: SigModuleConfigured, callback: (data: SigModuleConfiguredData) => void): void;
declare function ccPluginOn(sig: SigStateChanged, callback: (data: SigStateChangedData) => void): void;
declare function ccPluginOn(sig: string | string[], callback: (data: { sig: string, payload: any }) => void): void;
interface Plugin {
  install: (on: typeof ccPluginOn) => { name: string };
}
export interface RunOptions {
  middlewares?: ((midCtx: MidCtx, next: Function) => void)[];
  plugins?: Plugin[];// default is false
  isHot?: boolean;// default is false
  isStrict?: boolean;
  log?: boolean; // if print error message with console.error, default is true
  act?: IAnyFn; // should pass act avoid warning if in test mode, see https://reactjs.org/docs/test-utils.html#act
  errorHandler?: (err: Error) => void;
  /**
   * this kind of error will not lead to app crash, but should let developer know it
   */
  warningHandler?: (err: Error) => void;
  bindCtxToMethod?: boolean; // default false
  /**
   * default is true
   * it means no matter state changed or not, if a ref call setState or mr.{method}
   * it will always been rendered
   */
  alwaysRenderCaller?: boolean;
  computedCompare?: boolean; // default is false, trigger computed if set
  watchCompare?: boolean; // default is false, trigger watch if set
  watchImmediate?: boolean; // default is false
  reComputed?: boolean; // default is true
  extractModuleChangedState?: boolean;// default is true
  extractRefChangedState?: boolean;// default is false
  /**
   * when extractRefChangedState is true, objectValueCompare will effect
   * --------------------------------------------------------------------
   * objectValueCompare is false by default.
   * in this situation concent treat object value as new value when user set it
   * 
   * const { obj } = ctx.state;
   * obj.foo = 'new';
   * ctx.setState({obj});// trigger re-render
   * 
   * // but if you set objectValueCompare true, you need write immutable style code to trigger re-render
   * ctx.setState({obj});// no trigger re-render
   * ctx.setState({obj:{...obj}});// trigger re-render
   */
  objectValueCompare?: boolean;// default is false
  nonObjectValueCompare?: boolean;// default is true
  localStorage?: Record<string, any>;// localStorage lib, in browser it will be window.localStorage by default, in rn, user should pass one
  /**
   * currently an async cu fun will be computed to below template in babel:
   * function asyncFn(_x, _x2, _x3) {
   *     return _asyncFn.apply(this, arguments);
   *  }
   *  so if you want your async cu fn work well after compiled, you must specify async-cu-keys
   */
  asyncCuKeys?: string[],
}

export interface ICallInfo {
  renderKey: Array<string | number>[];
  delay: number;
  fnName: string;
  type: string;
  calledBy: string;
  keys: string[];
  keyPath: string;
}

export interface IActionCtxBase {
  callInfo: ICallInfo;
  callerModule: string;
  module: PropKey;
  committedStateMap: IAnyObj,
  committedState: IAnyObj,
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  rootState: IAnyObj;
  globalState: any;
  moduleState: IAnyObj;
  moduleComputed: IAnyObj;
  setState: (obj: any, renderKey?: RenderKey, delay?: number) => Promise<any>;
  refCtx: IAnyObj;
}

// constraint RefCtx must be an implement of ICtxBase
export interface IActionCtx<
  RootState extends IRootBase = IRootBase,
  RootCu extends IRootBase = IRootBase,
  ModuleName extends keyof RootState = MODULE_VOID,
  RefCtx extends ICtxBase = ICtxBase,
  FullState extends IAnyObj = RootState[ModuleName]
  > extends IActionCtxBase {
  module: ModuleName;
  moduleState: RootState[ModuleName];
  moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : {};
  rootState: RootState;
  globalState: RootState[MODULE_GLOBAL];
  setState: <T extends Partial<FullState>>(obj: T, renderKey?: RenderKey, delay?: number) => Promise<T>;
  refCtx: RefCtx;
}

// 直接传入模块描述体来推导 actionCtx 类型
export interface IModActionCtx<
  RootInfo extends IAnyObj,
  Mod extends ModuleDesc,
  RefCtx extends ICtxBase = ICtxBase,
  > extends IActionCtxBase {
  moduleState: StateType<Mod['state']>;
  moduleComputed: GetSubCuType<Mod>;
  rootState: GetSubType<RootInfo, 'state'>;
  globalState: GetSubType<GetSubType<RootInfo, 'state'>, MODULE_GLOBAL>;
  setState: <T extends Partial<StateType<Mod['state']>>>(obj: T, renderKey?: RenderKey, delay?: number) => Promise<T>;
  refCtx: RefCtx;
}


//////////////////////////////////////////
// exposed top api
//////////////////////////////////////////

/**
 * 
 * @param clearAll default false
 * @param warningErrForClearAll 
 */
export function clearContextIfHot(clearAll?: boolean, warningErrForClearAll?: string): void;

export function run(storeConfig?: StoreConfig | null, runOptions?: RunOptions): void;

// register 用于class组件注册，因只有setup在class组件的reg参数里是有意义的，而setup在类组件里使用场景不多
// 所以setup的ctx参数类型不再有泛型方法列表里传入，由用户自己标记，如果不标记则默认为ICtxBase，以便减少register函数的泛型列表长度
export function register(
  registerOptions: string,
  ccClassKey?: string,
): (ReactComp: IAnyClass) => IAnyClass;
export function register<
  Props extends IAnyObj,
  RootState extends IRootBase = IRootBase,
  ModuleName extends keyof RootState = MODULE_DEFAULT,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    PrivState extends NoPrivState ?
    (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}> : RegisterOptionsMo<Props, RootState, ModuleName, {}>) :
    (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>>),
  ccClassKey?: string,
): (ReactComp: IAnyClass) => IAnyClass;



export function connect<
  Props extends IAnyObj = {},
  RootState extends IRootBase = IRootBase,
  >(
    connectSpec: ConnectSpec<RootState>,
    ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<Props>;


export type NoMap = 'NoMap'; // no mapProps passed
type NoPrivState = 'NoPrivState';
type TMap = IAnyObj | NoMap;

export function registerHookComp<Props extends IAnyObj, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): (renderFn: (props: RefCtx) => ReactNode) => FC<Props>;

// ********* registerOptions 【包含】render时，直接返回组件 *********
/** ====== 无指定所属模块，仅自定义自己的管理状态时 ======*/
export function registerHookComp<
  Props extends IAnyObj,
  RefCtx extends ICtxDefault = ICtxDefault,
  T extends TMap = NoMap,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  // 用IRegBaseSt来约束只有state无module传入
  registerOptions: (PrivState extends NoPrivState ? IRegBase<Props, RefCtx> : IRegBaseSt<Props, RefCtx, Exclude<PrivState, NoPrivState>>)
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; })
    & { render: (props: T extends NoMap ? RefCtx : T) => ReactNode },
  ccClassKey?: string,
): FC<Props>;
export function registerHookComp<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends TMap,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    // 约束state，module是否必需传入
    (PrivState extends NoPrivState ?
      (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}, RefCtx> : RegisterOptionsMo<Props, RootState, ModuleName, {}, RefCtx>) :
      (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx>)
    )
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; })
    & { render: (props: T extends NoMap ? RefCtx : T) => ReactNode },
  ccClassKey?: string,
): FC<Props>;
// -----------------------------------------------------------------------------------------------------------------------------------------
// ********* registerOptions 【不包含】render时，返回一个接收render函数作为参数的函数，由函数返回组件 *********
/** ====== 无指定所属模块，仅自定义自己的自己管理状态时 ======*/
export function registerHookComp<
  Props extends IAnyObj,
  RefCtx extends ICtxDefault = ICtxDefault, // RefCtx约束为ICtxDefault
  T extends TMap = NoMap,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  // 用IRegBaseSt来约束只有state无module传入
  registerOptions:
    (PrivState extends NoPrivState ? IRegBase<Props, RefCtx> : IRegBaseSt<Props, RefCtx, Exclude<PrivState, NoPrivState>>)
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; }),
  ccClassKey?: string,
): (render: (props: T extends NoMap ? RefCtx : T) => ReactNode) => FC<Props>;//有mapProp时，render函数的参数类型就是mapProps返回类型
export function registerHookComp<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends TMap,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    // 约束state，module是否必需传入
    (PrivState extends NoPrivState ?
      (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}, RefCtx> : RegisterOptionsMo<Props, RootState, ModuleName, {}, RefCtx>) :
      (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx>)
    )
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; }),
  ccClassKey?: string,
): (render: (props: T extends NoMap ? RefCtx : T) => ReactNode) => FC<Props>;



// 除了返回组件是ClassComponent，registerDumb效果和registerHookComp一样
export function registerDumb<Props extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): (renderFn: (props: RefCtx) => ReactNode) => ComponentClass<Props>;

// ********* registerOptions 【包含】render时，直接返回组件 *********
/** ====== 无指定所属模块，仅自定义自己的自己管理状态时 ======*/
export function registerDumb<
  Props extends IAnyObj,
  RefCtx extends ICtxDefault = ICtxDefault, // RefCtx约束为ICtxDefault
  T extends TMap = NoMap,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  // 用IRegBaseSt来约束只有state无module传入
  registerOptions: (PrivState extends NoPrivState ? IRegBase<Props, RefCtx> : IRegBaseSt<Props, RefCtx, Exclude<PrivState, NoPrivState>>)
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; })
    & { render: (props: T extends NoMap ? RefCtx : T) => ReactNode },
  ccClassKey?: string,
): ComponentClass<Props>;
export function registerDumb<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends TMap,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    // 约束state，module是否必需传入
    (PrivState extends NoPrivState ?
      (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}, RefCtx> : RegisterOptionsMo<Props, RootState, ModuleName, {}, RefCtx>) :
      (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx>)
    )
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; })
    & { render: (props: T extends NoMap ? RefCtx : T) => ReactNode },
  ccClassKey?: string,
): ComponentClass<Props>;
// -----------------------------------------------------------------------------------------------------------------------------------------
// ********* registerOptions 【不包含】render时，返回一个接收render函数作为参数的函数，由函数返回组件 *********
/** ====== 无指定所属模块，仅自定义自己的自己管理状态时 ======*/
export function registerDumb<
  Props extends IAnyObj,
  RefCtx extends ICtxDefault = ICtxDefault, // RefCtx约束为ICtxDefault
  T extends TMap = NoMap,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  // 用IRegBaseSt来约束只有state无module传入
  registerOptions: (PrivState extends NoPrivState ? IRegBase<Props, RefCtx> : IRegBaseSt<Props, RefCtx, Exclude<PrivState, NoPrivState>>)
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; }),
  ccClassKey?: string,
): (render: (props: T extends NoMap ? RefCtx : T) => ReactNode) => ComponentClass<Props>;//有mapProp时，render函数的参数类型就是mapProps返回类型
export function registerDumb<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends TMap,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    // 约束state，module是否必需传入
    (PrivState extends NoPrivState ?
      (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}, RefCtx> : RegisterOptionsMo<Props, RootState, ModuleName, {}, RefCtx>) :
      (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx>)
    )
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T; }),
  ccClassKey?: string,
): (render: (props: T extends NoMap ? RefCtx : T) => ReactNode) => ComponentClass<Props>;

export function connectDumb<Props extends IAnyObj = {}, RootState extends IRootBase = IRootBase, RefCtx extends ICtxBase = ICtxBase>(
  connectSpec: ConnectSpec<RootState>,
  ccClassKey: string,
): (render: (props: RefCtx) => ReactNode) => ComponentClass<Props>;

// user decide RefCtx type is which one of RefCtx series, default is ICtxBase
export function useConcent<Props extends IAnyObj = IAnyObj, RefCtx extends ICtxBase = ICtxBaseP<Props>>(
  registerOptions?: string,
  ccClassKey?: string,
): RefCtx;
export function useConcent<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends IAnyObj | NoMap = NoMap,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    (PrivState extends NoPrivState ? IRegBase<Props, RefCtx> : IRegBaseSt<Props, RefCtx, Exclude<PrivState, NoPrivState>>)
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T }),
  ccClassKey?: string,
): RefCtx;
export function useConcent<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends IAnyObj | NoMap,
  RootState extends IRootBase,
  ModuleName extends keyof RootState,
  PrivState extends FnState | NoPrivState = NoPrivState
>(
  registerOptions:
    // 约束state，module是否必需传入
    (PrivState extends NoPrivState ?
      (ModuleName extends MODULE_DEFAULT ? RegisterOptions<Props, RootState, ModuleName, {}, RefCtx> : RegisterOptionsMo<Props, RootState, ModuleName, {}, RefCtx>) :
      (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, Exclude<PrivState, NoPrivState>, RefCtx>)
      // 下面写法是不对的，需要如上使用Exclude排除掉
      // (ModuleName extends MODULE_DEFAULT ? RegisterOptionsSt<Props, RootState, ModuleName, PrivState, RefCtx> : RegisterOptionsMoSt<Props, RootState, ModuleName, PrivState, RefCtx>)
    )
    & (T extends NoMap ? {} : { mapProps: (refCtx: RefCtx) => T }),
  ccClassKey?: string,
): RefCtx;


declare function configureModule(moduleName: string, moduleConfig: ModuleConfig): void;
declare function configureModule(storeConfig: StoreConfig): void;

export const configure: typeof configureModule;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, ModuleState>(moduleName: keyof RootState, state: Partial<ModuleState>, renderKey?: RenderKey, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<RootState extends IRootBase>(): RootState['$$global'];

export function getComputed<T>(moduleName?: string): T;

/**
 * for printing cu object in console as plain json object
 */
export function debugComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: RenderKey, delay?: number): void;

// only work for top api cc.dispatch
interface IDispatchExtra {
  ccClassKey?: string;
  ccKey?: string;
  throwError?: boolean;
  refModule?: string;
}

type GetDispatchRetType<T> = T extends IAnyFn ? GetPromiseT<T> : any;
type GetDispatchPayloadType<T> = T extends IAnyFn ? Parameters<T>[0] : any;
declare function ccDispatch<T extends string | IAnyFn | TypeDesc, P extends GetDispatchPayloadType<T>>(
  type: T, payload?: P, renderKey?: RenderKey | IDispatchOptions, delay?: number, extra?: IDispatchExtra
): Promise<GetDispatchRetType<T>>;
export type IDispatch = typeof ccDispatch;

export declare const dispatch: IDispatch;

export declare const emit: typeof refCtxEmit;

export declare const off: typeof refCtxOff;

export function execute(ccClassKey: string, ...args: any): void;

export function executeAll(...args: any): void;

export function appendState(moduleName: string, state: IAnyObj): void;


type DefOptions = { depKeys?: DepKeys, compare?: boolean, lazy?: boolean, sort?: number, retKeyDep?: boolean };

export function defComputedVal<CuRet>(ret: CuRet): IComputedFnDesc<GetComputedFn<CuRet>>;

export function defComputed<V extends IAnyObj, CuRet, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => CuRet, defOptions?: DepKeys | DefOptions): IComputedFnDesc<GetComputedFn<CuRet>>;
export function defComputed<CuRet>
  (fn: (newState: IAnyObj, oldState: IAnyObj, fnCtx: IFnCtxBase) => CuRet, defOptions?: DepKeys | DefOptions): IComputedFnDesc<GetComputedFn<CuRet>>;

type DefLazyOptions = { depKeys?: DepKeys, compare?: boolean, sort?: number, retKeyDep?: boolean };

export function defLazyComputed<V extends IAnyObj, CuRet, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => CuRet, defOptions?: DepKeys | DefLazyOptions): IComputedFnDesc<GetComputedFn<CuRet>>;
export function defLazyComputed<CuRet>
  (fn: (newState: IAnyObj, oldState: IAnyObj, fnCtx: IFnCtxBase) => CuRet, defOptions?: DepKeys | DefLazyOptions): IComputedFnDesc<GetComputedFn<CuRet>>;

export function defWatch<V extends IAnyObj = {}, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => void | boolean, defOptions?: DepKeysOfWatch<V> | WatchCbOptions<V>): WatchFnDesc;

export declare const cst: CcCst;

export class CcFragment<P extends IAnyObj, Ctx extends ICtxBase> extends
  Component<{
    register: IRegBaseFrag<P, Ctx>, ccKey?: string, ccClassKey?: string,
    ccOption?: { storedKeys?: string[], renderKey?: string | number, persistStoredKeys?: boolean, tag?: string }
  }, any> { }

/**
 * [state, computed, reducers]
 * reducers:{ mr: IAnyFnInObj, cr: IAnyFnInObj, r: IAnyFnInObj }
 */
type ObRenderFn = (obTuple: [IAnyObj, IAnyObj, { mr: IAnyFnInObj, cr: IAnyFnInObj, r: IAnyFnInObj }]) => React.ReactElement;
export function Ob(props: { classKey?: string, module?: string, connect?: string | string[], render: ObRenderFn, children?: ObRenderFn }): React.FC;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: IAnyFnInObj;

export interface RefFilters {
  /**
   * find refs that mountStatus is belong (NOT_MOUNT, MOUNTED) or (MOUNTED)
   * default is false, means only find out MOUNTED refs
   */
  includeNotMount?: boolean;
  tag?: string;
  ccClassKey?: string;
  moduleName?: string;
}
type ccClassKey = string;
export function getRefs<Ctx extends ICtxBase>(filters?: RefFilters | ccClassKey): { ctx: Ctx }[];
export function getRef<Ctx extends ICtxBase>(filters?: RefFilters | ccClassKey): ({ ctx: Ctx } | undefined);

/**
 *
 * @param newModuleName
 * @param existingModuleName 
 * @param overwriteModuleConfig overwriteModuleConfig will been merged to existingModuleConfig
 */
export function cloneModule(newModuleName: string, existingModuleName: string, overwriteModuleConfig?: ModuleConfig): void;

//////////////////////////////////////////////////
// type helper
//////////////////////////////////////////////////
export type IncludeModelKey<Models, ModelKey> = ModelKey extends keyof Models ? true : false;

export type GetRootState<Models extends { [key: string]: ModuleConfig }> = {
  [key in keyof Models]: StateType<Models[key]['state']>
}
  & { [cst.MODULE_VOID]: {} }
  & (IncludeModelKey<Models, MODULE_DEFAULT> extends true ? {} : { [cst.MODULE_DEFAULT]: {} })
  & (IncludeModelKey<Models, MODULE_GLOBAL> extends true ? {} : { [cst.MODULE_GLOBAL]: {} });

export type GetRootReducer<Models extends { [key: string]: ModuleConfig }> = {
  [key in keyof Models]: 'reducer' extends keyof Models[key] ?
  (Models[key]['reducer'] extends IAnyObj ? ReducerType<StateType<Models[key]['state']>, Models[key]['reducer']> : {})
  : {};
}
  & { [cst.MODULE_VOID]: {} }
  & (IncludeModelKey<Models, MODULE_DEFAULT> extends true ? {} : { [cst.MODULE_DEFAULT]: {} })
  & (IncludeModelKey<Models, MODULE_GLOBAL> extends true ? {} : { [cst.MODULE_GLOBAL]: {} });

export type GetRootReducerCaller<Models extends { [key: string]: ModuleConfig }> = {
  [key in keyof Models]: 'reducer' extends keyof Models[key] ?
  (Models[key]['reducer'] extends IAnyObj ? ReducerCallerType<Models[key]['reducer']> : {})
  : {};
}
  & { [cst.MODULE_VOID]: {} }
  & (IncludeModelKey<Models, MODULE_DEFAULT> extends true ? {} : { [cst.MODULE_DEFAULT]: {} })
  & (IncludeModelKey<Models, MODULE_GLOBAL> extends true ? {} : { [cst.MODULE_GLOBAL]: {} });

export type GetRootReducerGhost<Models extends { [key: string]: ModuleConfig }, RootReducer extends { [K in keyof Models]: any }> = {
  [key in keyof Models]: 'ghosts' extends keyof Models[key] ?
  (Models[key]['ghosts'] extends string[] ? { [ghostKey in ArrItemsType<Models[key]['ghosts']>]: RootReducer[key] } : {})
  : {};
}
  & { [cst.MODULE_VOID]: {} }
  & (IncludeModelKey<Models, MODULE_DEFAULT> extends true ? {} : { [cst.MODULE_DEFAULT]: {} })
  & (IncludeModelKey<Models, MODULE_GLOBAL> extends true ? {} : { [cst.MODULE_GLOBAL]: {} });

export type GetRootComputed<Models extends { [key: string]: ModuleConfig }> = {
  [key in keyof Models]: 'computed' extends keyof Models[key] ?
  (Models[key]['computed'] extends IAnyObj ? ComputedValType<Models[key]['computed']> : {})
  : {};
}
  & { [cst.MODULE_VOID]: {} }
  & (IncludeModelKey<Models, MODULE_DEFAULT> extends true ? {} : { [cst.MODULE_DEFAULT]: {} })
  & (IncludeModelKey<Models, MODULE_GLOBAL> extends true ? {} : { [cst.MODULE_GLOBAL]: {} });


declare type DefaultExport = {
  ccContext: any,
  clearContextIfHot: typeof clearContextIfHot,
  run: typeof run,
  register: typeof register,
  connect: typeof connect,
  registerDumb: typeof registerDumb,
  connectDumb: typeof connectDumb,
  registerHookComp: typeof registerHookComp,
  useConcent: typeof useConcent,
  configure: typeof configureModule,
  cloneModule: typeof cloneModule,
  set: typeof set,
  setState: typeof setState,
  setGlobalState: typeof setGlobalState,
  getState: typeof getState,
  getGlobalState: typeof getGlobalState,
  getComputed: typeof getComputed,
  debugComputed: typeof debugComputed,
  getGlobalComputed: typeof getGlobalComputed,
  getRefs: typeof getRefs,
  getRef: typeof getRef,
  dispatch: typeof dispatch,
  reducer: typeof reducer,
  emit: typeof refCtxEmit,
  off: typeof refCtxOff,
  execute: typeof execute,
  executeAll: typeof executeAll,
  appendState: typeof appendState,
  defComputed: typeof defComputed,
  defLazyComputed: typeof defLazyComputed,
  defComputedVal: typeof defComputedVal,
  defWatch: typeof defWatch,
  cst: typeof cst,
  CcFragment: typeof CcFragment,
  Ob: typeof Ob,
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;
