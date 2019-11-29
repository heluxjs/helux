import { Component, ReactNode } from 'react';
import { string } from 'prop-types';

type CcCst = {
  MODULE_GLOBAL: '$$global';
  MODULE_DEFAULT: '$$default';
  MODULE_CC: '$$cc';
  MODULE_CC_ROUTER: '$$CONCENT_ROUTER';

  CC_CLASS_PREFIX: '$$CcClass';
  CC_FRAGMENT_PREFIX: '$$CcFrag';
  CC_HOOK_PREFIX: '$$CcHook';
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
export interface IAnyFnReturnObj {
  (...args: any): IAnyObj;
}
export interface IAnyFnInObj { [key: string]: IAnyFn }

interface IComputedFnDesc {
  fn: typeof computedFn;
  compare?: boolean;
  depKeys?: string[];
}
interface IReducerFn {
  (payload: any, moduleState: any, actionCtx: IActionCtx): any;
}

// !!!use infer
export type ArrItemsType<T extends any[]> = T extends Array<infer E> ? E : never;

export type ComputeValType<T> = {
  readonly [K in keyof T]: T[K] extends IAnyFn ? ReturnType<T[K]> : (T[K] extends IComputedFnDesc ? ReturnType<T[K]['fn']> : unknown);
}
export type ReducerType<T> = {
  // readonly [K in keyof T]: T[K] extends IAnyFn ? (payload: Parameters<T[K]>[0]) => Promise<ReturnType<T[K]>> : unknown;
  readonly [K in keyof T]: T[K] extends IAnyFn ?
  (payload: Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]) =>
    ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>>
  : unknown;
}

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
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => FnReturnType;
type RefComputedValFn<FnCtx extends IFnCtxBase, FnReturnType, Val> = (
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,
) => FnReturnType;

type RefWatchFn<FnCtx extends IFnCtxBase> = (
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => boolean | void;
type RefWatchValFn<FnCtx extends IFnCtxBase, Val> = (
  oldVal: Val,
  newVal: Val,
  fnCtx: FnCtx,
) => boolean | void;

declare function computedFn<FnCtx extends IFnCtxBase>(
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
): any;


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

/**
 *
 * @param retKey
 * @param computedFn
 * @param {string[]} depKeys
 * @param {boolean} compare defalut is true
 */
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFn: RefComputedFn<IFnCtx, FnReturnType>, depKeys?: string[], compare?: boolean): void;
declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType, ValType>(retKey: string, computedFn: RefComputedValFn<IFnCtx, FnReturnType, ValType>, depKeys?: string[], compare?: boolean): void;
//user decide it is FnCtx or FnCtxConnect
declare function refCtxComputed(multiComputed: {
  [retKey: string]: <FnCtx extends IFnCtxBase, FnReturnType>(oldVal: any, newVal: any, fnCtx: FnCtx) => FnReturnType,
}): void;
declare function refCtxComputed(multiComputed: {
  [retKey: string]: <FnCtx extends IFnCtxBase, FnReturnType, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => FnReturnType,
}): void;
declare function refCtxComputed(multiComputed: {
  [retKey: string]: {
    fn: <FnCtx extends IFnCtxBase, FnReturnType>(oldVal: any, newVal: any, fnCtx: FnCtx) => FnReturnType,
    depKeys?: string[],
    compare?: boolean,
  }
}): void;
declare function refCtxComputed(multiComputed: {
  [retKey: string]: {
    fn: <FnCtx extends IFnCtxBase, FnReturnType, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => FnReturnType,
    depKeys?: string[],
    compare?: boolean,
  }
}): void;

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
declare function refCtxWatch(multiWatch: {
  [retKey: string]: <FnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: FnCtx) => void,
}): void;
declare function refCtxWatch(multiWatch: {
  [retKey: string]: <FnCtx extends IFnCtxBase, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => void,
}): void;
declare function refCtxWatch(multiWatch: {
  [retKey: string]: {
    fn: <FnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: FnCtx) => void,
    depKeys?: string[],
    compare?: boolean,
    immediate?: boolean,
  }
}): void;
declare function refCtxWatch(multiWatch: {
  [retKey: string]: {
    fn: <FnCtx extends IFnCtxBase, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => void,
    depKeys?: string[],
    compare?: boolean,
    immediate?: boolean,
  }
}): void;

type ClearEffect = IAnyFn | void;
type EffectDepKeys = string[] | null;
declare function refCtxEffect<RefCtx extends IRefCtxBase>(cb: (refCtx: RefCtx, isCalledInDidMount: boolean) => ClearEffect, depKeys?: EffectDepKeys, immediate?: boolean): void;

declare function refCtxAux(auxMethodName: string, handler: IAnyFn): void;

declare function syncCb(value: any, keyPath: string, syncContext: { moduleState: object, fullKeyPath: string, state: object, refCtx: object }): IAnyObj;
declare function syncCb<Val, ModuleState, RefCtx extends IRefCtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: ModuleState, refCtx: RefCtx }): IAnyObj;
// if module state is not equal full state, you need pass generic type FullState
declare function syncCb<Val, ModuleState, FullState, RefCtx extends IRefCtxBase>(value: Val, keyPath: string, syncContext: { moduleState: ModuleState, fullKeyPath: string, state: FullState, refCtx: RefCtx }): IAnyObj;

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
interface IRefCtxBase {
  module: '$$default' | string | any;
  // module: '$$default';
  reducerModule: string;
  ccKey: string;
  ccClassKey: string;
  ccUniqueKey: string;
  initTime: number;
  renderCount: number;
  storedKeys: string[] | TStar;
  watchedKeys: string[] | TStar;
  connect: { [key: string]: string[] | TStar };
  ccOptions: {
    persistStoredKeys?: string[];
    storedKeys?: string[];
  };
  mapped: IAnyObj;
  stateKeys: string[];

  state: IAnyObj;
  prevState: IAnyObj;
  props: IAnyObj;
  moduleState: IAnyObj;
  globalState: IAnyObj;
  connectedState: IAnyObj;
  refComputed: IAnyObj;
  refConnectedComputed: IAnyObj;
  moduleComputed: IAnyObj;
  globalComputed: IAnyObj;
  connectedComputed: IAnyObj;

  moduleReducer: IAnyObj;
  moduleLazyReducer: IAnyObj;
  connectedReducer: IAnyObj;
  connectedLazyReducer: IAnyObj;
  reducer: IAnyFnInObj;
  lazyReducer: IAnyFnInObj;

  computed: typeof refCtxComputed;
  watch: typeof refCtxWatch;
  effect: typeof refCtxEffect;
  aux: typeof refCtxAux;
  execute: (handler: IAnyFn) => void;

  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  reactSetState: <P, S, K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ) => void;
  reactForceUpdate: (callback?: () => void) => void;
  setState: typeof refCtxSetState;
  forceUpdate: typeof refCtxForceUpdate;
  setGlobalState: typeof refCtxSetGlobalState;
  setModuleState: typeof refCtxSetModuleState;
  sync: (string: string, value?: typeof syncCb | any, renderKey?: string, delay?: string) => SyncReturn;
  syncBool: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  syncInt: (string: string, renderKey?: string, delay?: string) => SyncReturn;
  set: (string: string, value: any, renderKey?: string, delay?: string) => void;
  setBool: (string: string, renderKey?: string, delay?: string) => void;
  settings: IAnyObj;
}

interface IRefCtxMBase<ModuleName extends any> extends IRefCtxBase {
  // !!! let ModuleName extends (keyof RootState | keyof RootReducer) works
  module: ModuleName;
}

//  ***********************************************************
//  ************ when module state equal ref state ************
//  ***********************************************************
export interface IRefCtx
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends (keyof RootState | keyof RootReducer),// !!! let RootReducer[ModuleName] and RootState[ModuleName] works
  Props,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxMBase<ModuleName> {
  globalState: RootState['$$global'];
  state: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  prevState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  moduleLazyReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  props: Props;
  settings: Settings;
  refConnectedComputed: Rccu;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxMcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ModuleCu, // moduleComputed
  Settings extends IAnyObj,
  Rccu extends IAnyObj, // refConnectedComputed
  >
  extends
  IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxMcuCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ModuleCu,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxMcuRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ModuleCu,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  refComputed: RefCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxMcuConRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ModuleCu,
  RootCu extends IRootBase,
  ConnectedModules extends keyof IRootBase,
  RefCu, Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxMcuRcu<RootState, RootReducer, ModuleName, Props, ModuleCu, RefCu, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxConRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  Props,
  RefCu,
  Settings extends IAnyObj,
  >
  extends IRefCtx<RootState, RootReducer, ModuleName, Props, IAnyObj, IAnyObj> {
  refComputed: RefCu;
}

//  ***************************************************************
//  ************ when module state not equal ref state ************
//  ***************************************************************
export interface IRefCtxRs<
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends (keyof RootState | keyof RootReducer),
  RefState,
  Props,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  > extends IRefCtxMBase<ModuleName> {
  globalState: RootState['$$global'];
  moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  prevState: ModuleName extends keyof RootState ? RootState[ModuleName] : {};
  moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] :
    // !!! concent will inject setState to moduleReducer
    RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  moduleLazyReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] :
    RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  state: RefState;
  props: Props;
  settings: Settings;
  refConnectedComputed: Rccu;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxRsMcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ModuleCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxRsMcuCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ModuleCu,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends
  IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxRsMcuRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  // ModuleName extends keyof RootState,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ModuleCu,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  // extends IRefCtxRs<RootState, RootReducer, ModuleName extends string ? string : string, RefState, Props, Settings, Rccu> {
  moduleComputed: ModuleCu;
  refComputed: RefCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxRsMcuConRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ModuleCu,
  RootCu extends IRootBase,
  ConnectedModules extends keyof IRootBase,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRsMcuRcu<RootState, RootReducer, ModuleName, RefState, Props, ModuleCu, RefCu, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxRsCon
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxRsConRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  ConnectedModules extends keyof IRootBase,
  RootCu extends IRootBase,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedReducer: Pick<RootReducer, ConnectedModules>;
  connectedLazyReducer: Pick<RootReducer, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRsRcu
  <
  RootState extends IRootBase,
  RootReducer extends IRootBase,
  ModuleName extends keyof RootState,
  RefState,
  Props,
  RefCu,
  Settings extends IAnyObj,
  Rccu extends IAnyObj
  >
  extends IRefCtxRs<RootState, RootReducer, ModuleName, RefState, Props, Settings, Rccu> {
  refComputed: RefCu;
}

export interface IFnCtxBase {
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: IAnyObj;
  committedState: IAnyObj;
  refCtx: IRefCtxBase;
}
export interface IFnCtxMBase<ModuleName> {
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: IAnyObj;
  committedState: IAnyObj;
  refCtx: IRefCtxMBase<ModuleName>;
}
export interface IFnCtx<RefCtx extends IRefCtxBase> extends IFnCtxBase {
  refCtx: RefCtx;
}
export interface IFnCtxComm<RefCtx extends IRefCtxBase, FullState> extends IFnCtxBase {
  oldState: FullState;
  committedState: Partial<FullState>;
  refCtx: RefCtx;
}
export interface IFnCtxM<ModuleName, RefCtx extends IRefCtxMBase<ModuleName>> extends IFnCtxMBase<ModuleName> {
  refCtx: RefCtx;
}
export interface IFnCtxMComm<ModuleName, RefCtx extends IRefCtxMBase<ModuleName>, FullState> extends IFnCtxMBase<ModuleName> {
  oldState: FullState;
  committedState: Partial<FullState>;
  refCtx: RefCtx;
}

declare class ConcentComponent extends Component {
}

interface RegisterOptions<RootState, ModuleName extends keyof RootState, RefState> {
  module?: ModuleName// default '$$default'
  watchedKeys?: (keyof RootState[ModuleName])[];
  storedKeys?: (Exclude<keyof RefState, keyof RootState[ModuleName]>)[];
  connect?: (keyof RootState | '$$global' | '$$default')[] |
  // currently I do not know how to pass ${moduleName} to evaluate target type in object value
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState | '$$global' | '$$default')]?: TStar | string[] };
  tag?: string;
  persistStoredKeys?: boolean;
  lite?: 1 | 2 | 3 | 4;
  reducerModule?: string;// defuault equal ${module}
  isPropsProxy?: boolean;// default false
  isSingle?: boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: boolean;//default true
  setup?: IAnyObj;
  mapProps?: <RefCtx extends IRefCtxBase>(refCtx: RefCtx) => IAnyObj;
  props?: IAnyObj;
}

interface FnRegisterOptions<RootState, ModuleName extends keyof RootState, RefState> extends RegisterOptions<RootState, ModuleName, RefState> {
  state?: IAnyFnReturnObj | RefState;
}
interface RenderFnRegisterOptions<RootState, ModuleName extends keyof RootState, RefState> extends RegisterOptions<RootState, ModuleName, RefState> {
  state?: IAnyFnReturnObj | RefState;
  render: <RefCtx extends IRefCtxBase>(props: RefCtx | any) => ReactNode;
}

type WatchFn = (
  oldVal: any,
  newVal: any,
  fnCtx: IFnCtxBase,//user decide it is FnCtx or FnCtxConnect
) => void;
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
    [retKey: string]: typeof computedFn | IComputedFnDesc;
  };
  watch?: {
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
  targetModule: string | any;
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
// constraint RefCtx must be an implement of IRefCtxBase
export interface IActionCtxRef<RefCtx extends IRefCtxBase> extends IActionCtxBase {
  refCtx: RefCtx;
}
export interface IActionCtxM<ModuleName extends (keyof RootState | keyof RootCu), RootState, RootCu> extends IActionCtxBase {
  targetModule: ModuleName;
  moduleState: ModuleName extends keyof RootState ? RootState[ModuleName] : IAnyObj;
  moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : IAnyObj;
}
export interface IActionCtxMRef<ModuleName extends (keyof RootState | keyof RootCu), RootState, RootCu, RefCtx extends IRefCtxBase> extends IActionCtxBase {
  targetModule: ModuleName;
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
export function clearContextIfHot(clearAll: boolean, warningErrForClearAll?: string): void;

export function run(storeConfig?: StoreConfig | null, runOptions?: RunOptions): void;

export function register<RootState, ModuleName extends keyof RootState>(
  registerOptions: String | RegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;
export function register<RootState, ModuleName extends keyof RootState, RefState>(
  registerOptions: String | RegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;

//use decide it is RefCtx or RefCtxConnect
export function registerDumb<RootState extends IRootBase, ModuleName extends keyof RootState, RefCtxBase extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;
export function registerDumb<RootState extends IRootBase, ModuleName extends keyof RootState, RefState, RefCtxBase extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;
export function registerDumb<RootState extends IRootBase, ModuleName extends keyof RootState, RefCtxBase extends IRefCtxBase>(
  registerOptions: RenderFnRegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): typeof Component;
export function registerDumb<RootState extends IRootBase, ModuleName extends keyof RootState, RefState, RefCtxBase extends IRefCtxBase>(
  registerOptions: RenderFnRegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): typeof Component;

export function registerHookComp<RootState extends IRootBase, ModuleName extends keyof RootState, RefCtxBase extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;
export function registerHookComp<RootState extends IRootBase, ModuleName extends keyof RootState, RefState, RefCtxBase extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;
export function registerHookComp<RootState extends IRootBase, ModuleName extends keyof RootState, RefCtxBase extends IRefCtxBase>(
  registerOptions: RenderFnRegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
  ccClassKey?: string,
): typeof Component;
export function registerHookComp<RootState extends IRootBase, ModuleName extends keyof RootState, RefState, RefCtxBase extends IRefCtxBase>(
  registerOptions: RenderFnRegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): typeof Component;

//use decide it is RefCtx or RefCtxConnect
export function useConcent<RootState extends IRootBase, ModuleName extends keyof RootState, RefState, RefCtx extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RefState>,
  ccClassKey?: string,
): RefCtx;
// when moduleState equal refState
export function useConcent<RootState extends IRootBase, ModuleName extends keyof RootState, RefCtx extends IRefCtxBase>(
  registerOptions: String | FnRegisterOptions<RootState, ModuleName, RootState[ModuleName]>,
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

export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

export function lazyDispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

export declare const emit: typeof refCtxEmit;

export declare const off: typeof refCtxOff;

export function execute(ccClassKey: string, ...args: any): void;

export function executeAll(...args: any): void;

export function appendState(moduleName: string, state: IAnyObj): void;

export declare const cst: CcCst;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: IAnyFnInObj;
export declare const lazyReducer: IAnyFnInObj;

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
  lazyDispatch: typeof lazyDispatch,
  reducer: typeof reducer,
  lazyReducer: typeof lazyReducer,
  emit: typeof refCtxEmit,
  off: typeof refCtxOff,
  execute: typeof execute,
  executeAll: typeof executeAll,
  appendState: typeof appendState,
  cst: typeof cst,
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;