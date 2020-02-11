import { Component, ReactNode, ComponentClass, FC } from 'react';
import { string } from 'prop-types';

type CC_CLASS_PREFIX = '$$CcClass';
type CC_FRAGMENT_PREFIX = '$$CcFrag';
type CC_HOOK_PREFIX = '$$CcHook';

type CcCst = {
  MODULE_GLOBAL: '$$global';
  MODULE_DEFAULT: '$$default';
  MODULE_CC: '$$cc';
  MODULE_CC_ROUTER: '$$CONCENT_ROUTER';

  CC_CLASS_PREFIX: CC_CLASS_PREFIX;
  CC_FRAGMENT_PREFIX: CC_FRAGMENT_PREFIX;
  CC_HOOK_PREFIX: CC_HOOK_PREFIX;
  CC_PREFIX: '$$Cc';

  CC_DISPATCHER: '$$Dispatcher';
  CC_DISPATCHER_BOX: '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';

  CCSYNC_KEY: typeof Symbol;
  MOCKE_KEY: typeof Symbol;
  LAZY_KEY: typeof Symbol;

  SIG_FN_START: 10;
  SIG_FN_END: 11;
  SIG_FN_QUIT: 12;
  SIG_FN_ERR: 13;
  SIG_MODULE_CONFIGURED: 14;
  SIG_STATE_CHANGED: 15;

  RENDER_NO_OP: 1;
  RENDER_BY_KEY: 2;
  RENDER_BY_STATE: 3;

  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: 1;
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: 2;

  EFFECT_AVAILABLE: 1;
  EFFECT_STOPPED: 0;

  DISPATCH: 'dispatch';
  SET_STATE: 'setState';
  SET_MODULE_STATE: 'setModuleState';
  FORCE_UPDATE: 'forceUpdate';
  INVOKE: 'invoke';
  SYNC: 'sync';

  CATE_MODULE: 'module';
  CATE_REF: 'ref';
}


export interface IAnyObj { [key: string]: any }
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

interface IComputedFnDesc<Fn extends typeof computedFn> {
  fn: Fn;
  compare?: boolean;
  depKeys?: string[];
}
interface IComputedFnSimpleDesc {
  fn: IAnyFn;
  compare?: boolean;
  depKeys?: string[];
}
interface IReducerFn {
  (payload: any, moduleState: any, actionCtx: IActionCtx): any | Promise<any>;
}

// !!!use infer
export type ArrItemsType<T extends any[]> = T extends Array<infer E> ? E : never;

export type ComputeValType<T> = {
  readonly [K in keyof T]: T[K] extends IAnyFn ? ReturnType<T[K]> : (T[K] extends IComputedFnSimpleDesc ? ReturnType<T[K]['fn']> : never);
}

export type SettingsType<SetupFn extends (...args: any) => any> = ReturnType<SetupFn> extends void ? {} : ReturnType<SetupFn>;

interface IDispatchOptions {
  silent?: boolean;
  lazy?: boolean;
  renderKey?: string;
  delay?: number;
}
type ReducerMethod<T, K extends keyof T> = T[K] extends IAnyFn ? (
  payload: Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0],
  renderKeyOrOptions?: string | IDispatchOptions,
  delay?: number,
) => ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>> : unknown;

export type ReducerType<T extends IAnyObj> = T['setState'] extends Function ? {
  // readonly [K in keyof T]: T[K] extends IAnyFn ? (payload: Parameters<T[K]>[0]) => Promise<ReturnType<T[K]>> : unknown;
  readonly [K in keyof T]: ReducerMethod<T, K>;
} : {
  readonly [K in keyof T]: ReducerMethod<T, K>;
} & { setState: ReducerMethod<{ setState: (payload: IAnyObj, renderKeyOrOptions?: string | IDispatchOptions, delay?: number) => any }, 'setState'> }

export interface EvMapBase {
  [key: string]: any[];
}

export type TStar = '*';

// type EvSyncReturn = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type TSyncReturn = (val: any) => void;

type SyncReturn = TSyncReturn;

type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;

type RefComputedFn<FnCtx extends IFnCtxBase, FnReturnType> = (
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is IFnCtx or IFnCtxM
) => FnReturnType;
type RefComputedValFn<FnCtx extends IFnCtxBase, FnReturnType, Val> = (
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,
) => FnReturnType;

type RefWatchFn<FnCtx extends IFnCtxBase> = (
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is IFnCtx or IFnCtxM
) => boolean | void;
type RefWatchValFn<FnCtx extends IFnCtxBase, Val> = (
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,
) => boolean | void;

declare function computedFn<FnCtx extends IFnCtxBase>(
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is IFnCtx or IFnCtxM
): any;
type GetComputedFn<T> = <FnCtx extends IFnCtxBase>(
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,
) => T;


interface IDict {
  [customizedKey: string]: any;
  // [customizedKey2: number]: any;
}

// make type for empty RootReducer
export interface IRootBase extends IDict {
  $$global: any;
  $$default: any;
  $$cc?: any;
}

type PropKey = string | number | symbol;

// export function dodo<TA, TB, keyof TA extends keyof TB>(a: TA, b: TB): void; 
type MyPick<RootState extends IRootBase, ConnectedModules extends keyof IRootBase> = Pick<RootState, ConnectedModules>;

type Super<T> = T extends infer U ? U : object;

/**
 * 
 * @param eventName 
 * @param cb 
 * @param delayToDidMount default is true
 * suggest use conditional type to maitain EventCbArgsType
 * 
    // or type EventCbArgsType<EventName>
    type ET<EventName> = 
      EventName extends 'foo' ? [string, number] :
      EventName extends 'bar' ? [string, boolean] :
      [];
 */
declare function refCtxOn<EventCbArgs extends any[]>(eventName: string, cb: OnCallBack<EventCbArgs>, delayToDidMount?: boolean): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: [string, string?], cb: OnCallBack<EventCbArgs>, delayToDidMount?: boolean): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EventCbArgs>, delayToDidMount?: boolean): void;

// this way is better!!!
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventName: EvName, cb: OnCallBack<EvMap[EvName]>, delayToDidMount?: boolean): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: [string, string?], cb: OnCallBack<EvMap[EvName]>, delayToDidMount?: boolean): void;
declare function refCtxOn<EvMap extends EvMapBase, EvName extends string>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EvMap[EvName]>, delayToDidMount?: boolean): void;

declare function refCtxEmit<EventCbArgs extends any[]>(eventName: string, ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: [string, string?], ...args: EventCbArgs): void;
declare function refCtxEmit<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, ...args: EventCbArgs): void;

// this way is better!!!
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventName: string, ...args: EvMap[EvName]): void;
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventDesc: [string, string?], ...args: EvMap[EvName]): void;
declare function refCtxEmit<EvMap extends EvMapBase, EvName extends string>(eventDesc: { name: string, identity?: string }, ...args: EvMap[EvName]): void;

declare function refCtxOff(eventName: string): void;
declare function refCtxOff(eventDesc: [string, string?]): void;
declare function refCtxOff(eventDesc: { name: string, identity?: string }): void;

/**
 * 
 * @param type 
 * @param payload 
 * @param renderKey 
 * @param delay 
 *  if first arg type is string, user should mannually make sure fnName an fn is mapped correctly, if you don not want to do so, you can write code like below
 * 
 *  function aaa(){}; function bbb(){};
    type reducerFnType<FnName> =
      FnName extends 'aaa' ? typeof aaa :
      FnName extends 'bbb' ? typeof bbb :
      null;

    type PayloadType<FnName extends string> = (Parameters<reducerFnType<FnName>>)[0];
    type reducerFnResultType<FnName extends string> = ReturnType<reducerFnType<FnName>>;
 */
declare function refCtxDispatch<Fn extends IReducerFn>(type: string, payload: (Parameters<Fn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<Fn>>;
declare function refCtxDispatch<TypeAsFn extends IReducerFn>(type: TypeAsFn, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;
declare function refCtxDispatch<TypeAsFn extends IReducerFn>(type: { module: string, fn: TypeAsFn }, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;

declare function refCtxInvoke<UserFn extends IReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>(fn: { module: string, fn: UserFn }, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;

declare function refCtxSetState<FullState>(state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState<FullState>(moduleName: string, state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(moduleName: string, state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxForceUpdate(cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;
declare function refCtxForceUpdate<FullState>(cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetGlobalState<GlobalState>(state: Partial<GlobalState>, cb?: (newFullState: GlobalState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetGlobalState(state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetModuleState<ModuleState>(moduleName: string, state: Partial<ModuleState>, cb?: (newFullState: ModuleState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetModuleState(moduleName: string, state: IAnyObj, cb?: (newFullState: IAnyObj) => void, renderKey?: string, delay?: number): void;

type Rfn<T> = <FnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: FnCtx) => T;
/**
 *
 * @param retKey
 * @param computedFn
 * @param {string[]} depKeys
 * @param {boolean} compare defalut is true
 */
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFn: RefComputedFn<IFnCtx, FnReturnType>, depKeys?: string[], compare?: boolean): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, ValType>(retKey: string, computedFn: RefComputedValFn<IFnCtx, FnReturnType, ValType>, depKeys?: string[], compare?: boolean): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, RootState extends IRootBase, ModuleName extends keyof RootState, T extends keyof RootState[ModuleName]>
  (retKey: T, computedFn: RefComputedValFn<IFnCtx, FnReturnType, RootState[ModuleName][T]>, depKeys?: string[], compare?: boolean): void;

declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFnDesc: { fn: RefComputedFn<IFnCtx, FnReturnType>, depKeys?: string[], compare?: boolean }): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, ValType>(retKey: string, computedFnDesc: { fn: RefComputedValFn<IFnCtx, FnReturnType, ValType>, depKeys?: string[], compare?: boolean }): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, RootState extends IRootBase, ModuleName extends keyof RootState, T extends keyof RootState[ModuleName]>
  (retKey: T, computedFnDesc: { fn: RefComputedValFn<IFnCtx, FnReturnType, RootState[ModuleName][T]>, depKeys?: string[], compare?: boolean }): void;

// !!! 写成  <FnCtx extends IFnCtxBase, FnReturnType>(oldVal: any, newVal: any, fnCtx: FnCtx) => FnReturnType 暂时无法约束返回类型
// !!! 写成  <IFnCtx extends IFnCtxBase, FnReturnType, ValType>(oldVal: ValType, newVal: ValType, fnCtx: IFnCtxBase) => FnReturnType 暂时无法约束值类型和返回类型
// 先写为如下方式
declare function refCtxComputed(multiComputed: {
  [retKey: string]: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => any,
}): void;
declare function refCtxComputed(multiComputed: {
  [retKey: string]: {
    fn: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => any,
    depKeys?: string[],
    compare?: boolean,
  }
}): void;

type VorB = void | boolean;
/**
 * 
 * @param retKey 
 * @param watchFn 
 * @param {string[]} depKeys 
 * @param {boolean} compare defalut is true
 * @param {boolean} immediate defalut is false
 */
declare function refCtxWatch<IFnCtx extends IFnCtxBase>(retKey: string, watchFn: RefWatchFn<IFnCtx>, depKeys?: string[], compare?: boolean, immediate?: boolean): void;
declare function refCtxWatch<IFnCtx extends IFnCtxBase, ValType>(retKey: string, watchFn: RefWatchValFn<IFnCtx, ValType>, depKeys?: string[], compare?: boolean, immediate?: boolean): void;
declare function refCtxWatch<IFnCtx extends IFnCtxBase, RootState extends IRootBase, ModuleName extends keyof RootState, T extends keyof RootState[ModuleName]>
  (retKey: string, watchFn: RefWatchValFn<IFnCtx, RootState[ModuleName][T]>, depKeys?: string[], compare?: boolean, immediate?: boolean): void;

declare function refCtxWatch<IFnCtx extends IFnCtxBase>(retKey: string, watchFnDesc: { fn: RefWatchFn<IFnCtx>, depKeys?: string[], compare?: boolean, immediate?: boolean }): void;
declare function refCtxWatch<IFnCtx extends IFnCtxBase, ValType>(retKey: string, watchFnDesc: { fn: RefWatchValFn<IFnCtx, ValType>, depKeys?: string[], compare?: boolean, immediate?: boolean }): void;
declare function refCtxWatch<IFnCtx extends IFnCtxBase, RootState extends IRootBase, ModuleName extends keyof RootState, T extends keyof RootState[ModuleName]>
  (retKey: T, watchFnDesc: { fn: RefWatchValFn<IFnCtx, RootState[ModuleName][T]>, depKeys?: string[], compare?: boolean, immediate?: boolean }): void;

// !!! 写成  <FnCtx extends IFnCtxBase, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => VorB 暂时无法约束值类型
// 先写为如下方式
declare function refCtxWatch(multiWatch: {
  [retKey: string]: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => VorB,
}): void;
declare function refCtxWatch(multiWatch: {
  [retKey: string]: {
    fn: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => VorB,
    depKeys?: string[],
    compare?: boolean,
    immediate?: boolean,
  }
}): void;

type ClearEffect = IAnyFnPromise | void;
type EffectDepKeys = string[] | null;
declare function refCtxEffect<RefCtx extends ICtxBase>(cb: (refCtx: RefCtx, isCalledInDidMount: boolean) => ClearEffect, depKeys?: EffectDepKeys, immediate?: boolean): void;

declare function refCtxAux(auxMethodName: string, handler: IAnyFnPromise): void;

declare function syncCb(value: any, keyPath: string, syncContext: { moduleState: object, fullKeyPath: string, state: object, refCtx: object }): IAnyObj;
declare function syncCb<Val, ModuleState, RefCtx extends ICtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: ModuleState, refCtx: RefCtx }): IAnyObj;
// if module state is not equal full state, you need pass generic type FullState
declare function syncCb<Val, ModuleState, FullState, RefCtx extends ICtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: FullState, refCtx: RefCtx }): IAnyObj;

//////////////////////////////////////////
// exposed interface
//////////////////////////////////////////

/**
 * use this interface to match ctx type that component only defined belong module
 * 
 * concent will build ctx for every instance
 * for class get get like this: this.ctx
 * for function get get like this: const ctx = useConcent('foo');
 */
export interface ICtxBase {
  readonly module: '$$default' | string | any;
  // module: '$$default';
  readonly isSingle: boolean;
  readonly type: CC_CLASS_PREFIX | CC_FRAGMENT_PREFIX | CC_HOOK_PREFIX;
  readonly reducerModule: string;
  readonly ccKey: string;
  readonly ccClassKey: string;
  readonly ccUniqueKey: string;
  readonly initTime: number;
  readonly renderCount: number;
  readonly storedKeys: string[] | TStar;
  readonly watchedKeys: string[] | TStar;
  readonly connect: { [key: string]: string[] | TStar };
  readonly ccOptions: {
    persistStoredKeys?: string[];
    storedKeys?: string[];
  };
  readonly mapped: IAnyObj;
  readonly stateKeys: string[];

  // readonly state: IAnyObj;
  state: any;
  readonly prevState: any;
  readonly props: any;
  readonly prevProps: any;
  readonly moduleState: any;
  readonly globalState: IAnyObj;
  readonly connectedState: IAnyObj;
  readonly refComputed: IAnyObj;
  readonly refConnectedComputed: IAnyObj;
  readonly moduleComputed: any;
  readonly globalComputed: IAnyObj;
  readonly connectedComputed: IAnyObj;

  readonly moduleReducer: any;
  readonly connectedReducer: IAnyObj;
  readonly reducer: IAnyFnInObj;

  computed: typeof refCtxComputed;
  watch: typeof refCtxWatch;
  effect: typeof refCtxEffect;
  effectProps: typeof refCtxEffect;
  aux: typeof refCtxAux;
  execute: (handler: IAnyFnPromise) => void;

  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;

  dispatch: typeof refCtxDispatch;
  dispatchLazy: typeof refCtxDispatch;
  dispatchSilent: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  silentDispatch: typeof refCtxDispatch;

  invoke: typeof refCtxInvoke;
  invokeLazy: typeof refCtxInvoke;
  invokeSilent: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  silentInvoke: typeof refCtxInvoke;

  reactSetState: <P, S, K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ) => void;
  reactForceUpdate: (callback?: () => void) => void;
  initState: (state: IAnyObj) => void;
  setState: typeof refCtxSetState;
  forceUpdate: typeof refCtxForceUpdate;
  setGlobalState: typeof refCtxSetGlobalState;
  setModuleState: typeof refCtxSetModuleState;
  sync: (string: string, value?: typeof syncCb | any, renderKey?: string, delay?: string) => SyncReturn;
  syncBool: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  syncInt: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  set: (string: string, value: any, renderKey?: string, delay?: string) => void;
  setBool: (string: string, renderKey?: string, delay?: string) => void;
  readonly settings: IAnyObj;
}

/**
 * ICtx series is simple than IRefCtx series, it is a loose mode check,
 * so it is more easy to use when your coding environment is js^_^
 * IRefCtx is more suitable for ts coding environment!
 * so my suggestion is : when you use js, try ICtx series to mark type, and when you use ts , try use IRefCtx series.
 */
export interface ICtx<
  Props extends IAnyObj,
  ModuleState extends IAnyObj,
  ModuleReducer extends IAnyObj,
  ModuleComputed extends IAnyObj,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  state: ModuleState;
  readonly prevState: ModuleState;
  readonly moduleState: ModuleState;
  readonly moduleComputed: ModuleComputed;
  readonly moduleReducer: ModuleReducer;
  readonly settings: Settings;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
}
export interface ICtxCon<
  Props extends IAnyObj,
  ModuleState extends IAnyObj,
  ModuleReducer extends IAnyObj,
  ModuleComputed extends IAnyObj,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj,
  // when connect other modules
  ConnectedState extends IAnyObj,
  ConnectedReducer extends IAnyObj,
  ConnectedComputed extends IAnyObj,
  RefConnectedComputed extends IAnyObj,
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  state: ModuleState;
  readonly prevState: ModuleState;
  readonly moduleState: ModuleState;
  readonly moduleReducer: ModuleReducer;
  readonly settings: Settings;
  readonly moduleComputed: ModuleComputed;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
  readonly connectedState: ConnectedState;
  readonly connectedReducer: ConnectedReducer;
  readonly connectedComputed: ConnectedComputed;
  readonly refConnectedComputed: RefConnectedComputed;
}

/**
 * when ref state not equal moduleState, need pass State generic type
 */
export interface ICtxRs<
  Props extends IAnyObj,
  State extends IAnyObj,
  ModuleState extends IAnyObj,
  ModuleReducer extends IAnyObj,
  ModuleComputed extends IAnyObj,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  state: State;
  readonly prevState: State;
  readonly moduleState: ModuleState;
  readonly moduleComputed: ModuleComputed;
  readonly moduleReducer: ModuleReducer;
  readonly settings: Settings;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
}
export interface ICtxRsCon<
  Props extends IAnyObj,
  State extends IAnyObj,
  ModuleState extends IAnyObj,
  ModuleReducer extends IAnyObj,
  ModuleComputed extends IAnyObj,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj,
  // when connect other modules
  ConnectedState extends IAnyObj,
  ConnectedReducer extends IAnyObj,
  ConnectedComputed extends IAnyObj,
  RefConnectedComputed extends IAnyObj,
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  state: State;
  readonly prevState: State;
  readonly moduleState: ModuleState;
  readonly moduleReducer: ModuleReducer;
  readonly settings: Settings;
  readonly moduleComputed: ModuleComputed;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
  readonly connectedState: ConnectedState;
  readonly connectedReducer: ConnectedReducer;
  readonly connectedComputed: ConnectedComputed;
  readonly refConnectedComputed: RefConnectedComputed;
}

interface ICtxMBase<ModuleName extends any> extends ICtxBase {
  // !!! let ModuleName extends (keyof RootState | keyof RootReducer) works
  module: any;
}

/**
 *  =================================
 *   IRefCtx series start!!!!!!
 *  =================================
 */

export interface IRefCtx
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  RootComputed extends IRootBase,
  Props,
  ModuleName extends keyof IRootBase,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends ICtxMBase<ModuleName> {
  readonly props: Props;
  readonly prevProps: Props;
  readonly globalState: RootState['$$global'];
  state: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  readonly prevState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  readonly moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  readonly moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  readonly moduleComputed: ModuleName extends keyof RootState ? RootComputed[ModuleName] : {};
  readonly settings: Settings;
  readonly refComputed: RefComputed;
  readonly mapped: Mapped;
}

export interface IRefCtxCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  RootComputed extends IRootBase,
  Props,
  ModuleName extends keyof IRootBase,
  ConnectedModules extends keyof IRootBase,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, RootComputed, Props, ModuleName, Settings, RefComputed, Mapped> {
  // overwrite connectedState , connectedComputed
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootComputed, ConnectedModules>;
}

//  ***********************************************************
//  when ref state not equal module state 
//  use IRefCtxRs instead of IRefCtx
//  ***********************************************************
export interface IRefCtxRs
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  RootComputed extends IRootBase,
  Props,
  State,
  ModuleName extends keyof IRootBase,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends ICtxMBase<ModuleName> {
  readonly props: Props;
  readonly prevProps: Props;
  readonly globalState: RootState['$$global'];
  state: State;
  readonly prevState: State;
  readonly moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  readonly moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  readonly moduleComputed: ModuleName extends keyof RootState ? RootComputed[ModuleName] : {};
  readonly settings: Settings;
  readonly refComputed: RefComputed;
  readonly mapped: Mapped;
}

//  ***********************************************************
//  when ref state not equal module state 
//  use IRefCtxRsCon instead of IRefCtxCon
//  ***********************************************************
export interface IRefCtxRsCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  RootComputed extends IRootBase,
  Props,
  State,
  ModuleName extends keyof IRootBase,
  ConnectedModules extends keyof IRootBase,
  Settings extends IAnyObj,
  RefComputed extends IAnyObj,
  Mapped extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, RootComputed, Props, State, ModuleName, Settings, RefComputed, Mapped> {
  // overwrite connectedState , connectedComputed
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootComputed, ConnectedModules>;
}


type GetFnCtxCommit<ModuleState> = <PS extends Partial<ModuleState>>(partialState: PS) => void;
type GetFnCtxCommitCu<ModuleComputed> = <PC extends Partial<ModuleComputed>>(partialComputed: PC) => void;

// To constrain IFnCtx interface series shape
export interface IFnCtxBase {
  retKey: string;
  isFirstCall: boolean;
  callInfo: { payload: IAnyObj, renderKey: string, delay: number };
  commit: GetFnCtxCommit<any>;
  commitCu: GetFnCtxCommitCu<any>;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: any;
  committedState: IAnyObj;
  refCtx: ICtxBase;
}
// M, means need module associate generic type
export interface IFnCtxMBase<ModuleName, FullState, Computed> extends IFnCtxBase {
  commit: GetFnCtxCommit<FullState>;// for module computed or watch definition, FullState equivalent ModuleState, Computed equivalent ModuleComputed
  commitCu: GetFnCtxCommitCu<Computed>;
  oldState: FullState;
  refCtx: ICtxMBase<ModuleName>;
}
export interface IFnCtx<RefCtx extends ICtxBase> extends IFnCtxBase {
  refCtx: RefCtx;
}
export interface IFnCtxM<RefCtx extends ICtxMBase<ModuleName>, ModuleName, FullState, Computed> extends IFnCtxMBase<ModuleName, FullState, Computed> {
  refCtx: RefCtx;
  committedState: Partial<FullState>;
}

declare class ConcentComponent<P> extends Component {
  ctx: ICtxBase;

  constructor(props: Readonly<P>);
  constructor(props: P, context?: any);
}

interface InnerRegisterBase {
  props?: any;
  module?: PropKey // default '$$default'
  state?: IAnyFnReturnObj | IAnyObj;
  watchedKeys?: string[];
  storedKeys?: any;
  connect?: any;
  tag?: string;
  persistStoredKeys?: boolean;
  lite?: 1 | 2 | 3 | 4;
  reducerModule?: string;// defuault equal ${module}
  isPropsProxy?: boolean;// default false
  isSingle?: boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: boolean;//default true
  setup?: (refCtx: ICtxBase) => IAnyObj;
}
interface InnerRegisterCtxBase<RefCtx extends ICtxBase> extends InnerRegisterBase {
  setup?: (refCtx: RefCtx) => IAnyObj;
}

export interface RegisterOptions<RootState, ModuleName extends keyof RootState, RefState> extends InnerRegisterBase {
  module: ModuleName,
  watchedKeys?: (Extract<keyof RootState[ModuleName], string>)[];
  storedKeys?: (Exclude<keyof RefState, keyof RootState[ModuleName]>)[];
  connect?: (keyof RootState | '$$global' | '$$default')[] |
  // !!! currently I do not know how to pass ${moduleName} to evaluate target type in object value
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState | '$$global' | '$$default')]?: TStar | string[] };
  setup?: (refCtx: ICtxBase) => any;
}
export interface RegisterOptionsCtx<RefCtx extends ICtxBase, RootState, ModuleName extends keyof RootState, RefState> extends RegisterOptions<RootState, ModuleName, RefState> {
  setup?: (refCtx: RefCtx) => any;
}

//user decide it is FnCtx or FnCtxConnect
interface WatchFn {
  <IFnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: IFnCtx): void | boolean;
}
// declare function watchFn<IFnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: IFnCtx): void;
type WatchFnDesc = {
  fn: WatchFn,
  compare?: boolean,
  immediate?: boolean,
  depKeys?: string[],
}

type TypeDesc = {
  module?: string;
  reducerModule?: string;
  type: string;
  cb?: Function;
};

type ModuleConfig = {
  state: Object;
  reducer?: {
    [fnName: string]: IReducerFn;
  };
  computed?: {
    [retKey: string]: typeof computedFn | IComputedFnSimpleDesc;
  };
  watch?: {
    // [retKey: string]: typeof watchFn | WatchFnDesc;
    [retKey: string]: WatchFn | WatchFnDesc;
  };
  init?: <ModuleState>() => Partial<ModuleState>
}

interface StoreConfig {
  [moduleName: string]: ModuleConfig;
}

type StateInfo = {
  committedState: object, sharedState: object, module: string,
  type: string, ccUniqueKey: string, renderKey: string,
};
type PluginOn = (sig: string | string[], callback: (data: { sig: string, payload: any }) => void) => void;
interface Plugin {
  install: (on: PluginOn) => { name: string };
}
interface RunOptions {
  middlewares?: ((stateInfo: StateInfo, next: Function) => void)[];
  plugins?: Plugin[];// default is false
  isHot?: boolean;// default is false
  isStrict?: boolean;
  errorHandler?: (err: Error) => void;
  reducer?: IAnyFnInObj;// deprecated
  bindCtxToMethod?: boolean;
  computedCompare?: boolean;// default is true
  watchCompare?: boolean;// default is true
  watchImmediate?: boolean;// default is false
}

interface IActionCtxBase {
  callerModule: string;
  module: string | any;
  committedStateMap: IAnyObj,
  committedState: IAnyObj,
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  rootState: IAnyObj;
  globalState: IAnyObj;
  moduleState: IAnyObj;
  moduleComputed: IAnyObj;
  setState: (obj: IAnyObj, renderKey?: string, delay?: number) => Promise<IAnyObj>;
  refCtx: IAnyObj;
}
export interface IActionCtx extends IActionCtxBase {
}
// constraint RefCtx must be an implement of ICtxBase
export interface IActionCtxRef<RefCtx extends ICtxBase> extends IActionCtxBase {
  refCtx: RefCtx;
}
export interface IActionCtxM<ModuleName extends (keyof RootState | keyof RootCu), RootState, RootCu> extends IActionCtxBase {
  module: ModuleName;
  moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : IAnyObj;
  moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : IAnyObj;
}
export interface IActionCtxMRef<ModuleName extends (keyof RootState | keyof RootCu), RootState, RootCu, RefCtx extends ICtxBase> extends IActionCtxBase {
  module: ModuleName;
  moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : IAnyObj;
  moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : IAnyObj;
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

export function register<IProps extends IAnyObj = {}>(
  registerOptions: string,
  ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<IProps>;
export function register<IProps extends IAnyObj, RootState, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<IProps>;
export function register<IProps extends IAnyObj, RootState, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<IProps>;



export function registerHookComp<IProps, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): (renderFn: (props: RefCtx) => ReactNode) => FC<IProps>;

// ********* registerOptions 【包含】render时，直接返回组件 *********

// <<<<<< Start: 有mapProps，命中以下3个函数，render函数的参数类型就是mapProps返回类型
/** ======  赋默认type，方便定义含render含mapProps的registerOptions参数时，可以缺省泛型来调用 ======*/
export function registerHookComp<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
/** ====== 需要约束module, watchedKeys, storedKeys, connect 参数时，传递RootState、ModuleName ======*/
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
/** ====== 当refState和moduleState不等时，传递第5位泛型参数 ======*/
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
// >>>>>> End

// <<<<<< Start:无mapProps，命中以下3个函数，以下T仅用于占位，实际调用时填写{}，render函数的参数类型就是RefCtx
/** ======  赋默认type，方便定义含render不含mapProps的registerOptions参数时，可以缺省泛型来调用 ======*/
export function registerHookComp<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
export function registerHookComp<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
export function registerHookComp<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): FC<IProps>;
// >>>>>> End
// -----------------------------------------------------------------------------------------------------------------------------------------
// ********* registerOptions 【不包含】render时，返回一个接收render函数作为参数的函数，由函数返回组件 *********
// <<<<<< Start: 有mapProps，命中以下3个函数，render函数的参数类型就是mapProps返回类型
export function registerHookComp<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => FC<IProps>;
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => FC<IProps>;
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => FC<IProps>;
// >>>>>> End

// <<<<<< Start: 无mapProps，命中以下3个函数，以下T仅用于占位，render函数的参数类型就是RefCtx
export function registerHookComp<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => FC<IProps>;
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => FC<IProps>;
export function registerHookComp<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => FC<IProps>;
// >>>>>> End



// 除了返回组件是ClassComponent，registerDumb效果和registerHookComp一样
export function registerDumb<IProps, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): (renderFn: (props: RefCtx) => ReactNode) => ComponentClass<IProps>;

// ********* registerOptions 【包含】render时，直接返回组件 *********

// <<<<<< Start: 有mapProps，命中以下3个函数，render函数的参数类型就是mapProps返回类型
/** ======  赋默认type，方便定义含render含mapProps的registerOptions参数时，可以缺省泛型来调用 ======*/
export function registerDumb<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
/** ====== 需要约束module, watchedKeys, storedKeys, connect 参数时，传递RootState、ModuleName ======*/
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
/** ====== 当refState和moduleState不等时，传递第5位泛型参数 ======*/
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { mapProps: (refCtx: RefCtx) => T; render: (props: T) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
// >>>>>> End

// <<<<<< Start:无mapProps，命中以下3个函数，以下T仅用于占位，实际调用时填写{}，render函数的参数类型就是RefCtx
/** ======  赋默认type，方便定义含render不含mapProps的registerOptions参数时，可以缺省泛型来调用 ======*/
export function registerDumb<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
export function registerDumb<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
export function registerDumb<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { render: (props: RefCtx) => ReactNode },
  ccClassKey?: string,
): ComponentClass<IProps>;
// >>>>>> End
// -----------------------------------------------------------------------------------------------------------------------------------------
// ********* registerOptions 【不包含】render时，返回一个接收render函数作为参数的函数，由函数返回组件 *********
// <<<<<< Start: 有mapProps，命中以下3个函数，render函数的参数类型就是mapProps返回类型
export function registerDumb<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => ComponentClass<IProps>;
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => ComponentClass<IProps>;
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { mapProps: (refCtx: RefCtx) => T; },
  ccClassKey?: string,
): (render: (props: T) => ReactNode) => ComponentClass<IProps>;
// >>>>>> End

// <<<<<< Start: 无mapProps，命中以下3个函数，以下T仅用于占位，render函数的参数类型就是RefCtx
export function registerDumb<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase, T = {}>(
  registerOptions: InnerRegisterCtxBase<RefCtx>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => ComponentClass<IProps>;
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => ComponentClass<IProps>;
export function registerDumb<IProps, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (render: (props: RefCtx) => ReactNode) => ComponentClass<IProps>;
// >>>>>> End



// user decide RefCtx type is which one of RefCtx series, default is ICtxBase
export function useConcent<IProps extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): RefCtx;
export function useConcent<IProps extends IAnyObj, RefCtx extends ICtxBase, T extends IAnyObj>(
  // 这里重定义props，覆盖InnerRegisterCtxBase里的props属性，和泛型关联上以便产生类型约束
  registerOptions: InnerRegisterCtxBase<RefCtx> & { layoutEffect?: boolean, mapProps?: (refCtx: RefCtx) => T; props?: IProps },
  ccClassKey?: string,
): RefCtx;
// when moduleState equal refState
export function useConcent<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RootState[ModuleName]> & { layoutEffect?: boolean, mapProps?: (refCtx: RefCtx) => T; props?: IProps },
  ccClassKey?: string,
): RefCtx;
export function useConcent<IProps extends IAnyObj, RefCtx extends ICtxBase, T, RootState extends IRootBase, ModuleName extends keyof RootState, RefState>(
  registerOptions: RegisterOptionsCtx<RefCtx, RootState, ModuleName, RefState> & { layoutEffect?: boolean, mapProps?: (refCtx: RefCtx) => T; props?: IProps },
  ccClassKey?: string,
): RefCtx;

export function configure(moduleName: string, moduleConfig: ModuleConfig): void;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, moduleState>(moduleName: keyof RootState, state: Partial<moduleState>, renderKey?: string, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<RootState extends IRootBase>(): RootState['$$global'];

export function getConnectedState<RootState>(ccClassKey: string): Partial<RootState>;

export function getComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: string, delay?: number): void;

interface IDispatchExtra {
  ccClassKey?: string;
  ccKey?: string;
  throwError?: boolean;
}
export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string | IDispatchOptions, delay?: number, extra?: IDispatchExtra): Promise<T>;

export declare const emit: typeof refCtxEmit;

export declare const off: typeof refCtxOff;

export function execute(ccClassKey: string, ...args: any): void;

export function executeAll(...args: any): void;

export function appendState(moduleName: string, state: IAnyObj): void;

export function defComputedVal<V>(val: V, compare?: boolean): IComputedFnDesc<GetComputedFn<V>>;

export function defComputed<F extends IFnCtxBase, T>(fn: (oldVal: any, newVal: any, fnCtx: F) => T, depKeys?: string[], compare?: boolean): IComputedFnDesc<GetComputedFn<T>>;
export function defComputed<F extends IFnCtxBase, T, V>(fn: (oldVal: V, newVal: V, fnCtx: F) => T, depKeys?: string[], compare?: boolean): IComputedFnDesc<GetComputedFn<T>>;

export function defWatch<F extends IFnCtxBase>(fn: (oldVal: any, newVal: any, fnCtx: F) => void | boolean, depKeys?: string[], compare?: boolean, immediate?: boolean): WatchFnDesc;
export function defWatch<F extends IFnCtxBase, V>(fn: (oldVal: V, newVal: V, fnCtx: F) => void | boolean, depKeys?: string[], compare?: boolean, immediate?: boolean): WatchFnDesc;

export function defWatchImmediate<F extends IFnCtxBase>(fn: (oldVal: any, newVal: any, fnCtx: F) => void | boolean, depKeys?: string[], compare?: boolean): WatchFnDesc;
export function defWatchImmediate<F extends IFnCtxBase, V>(fn: (oldVal: V, newVal: V, fnCtx: F) => void | boolean, depKeys?: string[], compare?: boolean): WatchFnDesc;

export declare const cst: CcCst;

export function test<T extends string, U extends number | boolean>(p1: T, p2: U): string;
export function test<T extends string>(p1: T, p2: string): string;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: IAnyFnInObj;

declare type DefaultExport = {
  clearContextIfHot: typeof clearContextIfHot,
  run: typeof run,
  register: typeof register,
  registerDumb: typeof registerDumb,
  useConcent: typeof useConcent,
  configure: typeof configure,
  cloneModule: typeof cloneModule,
  setState: typeof setState,
  setGlobalState: typeof setGlobalState,
  getState: typeof getState,
  getGlobalState: typeof getGlobalState,
  getConnectedState: typeof getConnectedState,
  getComputed: typeof getComputed,
  getGlobalComputed: typeof getGlobalComputed,
  set: typeof set,
  dispatch: typeof dispatch,
  reducer: typeof reducer,
  emit: typeof refCtxEmit,
  off: typeof refCtxOff,
  execute: typeof execute,
  executeAll: typeof executeAll,
  appendState: typeof appendState,
  defComputed: typeof defComputed,
  defComputedVal: typeof defComputedVal,
  defWatch: typeof defWatch,
  defWatchImmediate: typeof defWatchImmediate,
  cst: typeof cst,
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;