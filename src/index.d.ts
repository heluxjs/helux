import { Component, ReactNode, ComponentClass, FC } from 'react';

type CC_CLASS = '$$CcClass';
type CC_FRAGMENT = '$$CcFrag';
type CC_HOOK = '$$CcHook';

export type MODULE_GLOBAL = '$$global';
export type MODULE_DEFAULT = '$$default';
type MODULE_CC = '$$cc';
declare const MODULE_VOID = '$$concent_void_module_624313307';
export type MODULE_VOID = typeof MODULE_VOID;

type CcCst = {
  MODULE_GLOBAL: MODULE_GLOBAL;
  MODULE_DEFAULT: MODULE_DEFAULT;
  MODULE_CC: MODULE_CC;
  MODULE_VOID: MODULE_VOID;
  MODULE_CC_ROUTER: '$$CONCENT_ROUTER';

  CC_CLASS: CC_CLASS;
  CC_FRAGMENT: CC_FRAGMENT;
  CC_HOOK: CC_HOOK;
  CC_PREFIX: '$$Cc';

  CC_DISPATCHER: '$$Dispatcher';
  CC_DISPATCHER_BOX: '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';

  CCSYNC_KEY: typeof Symbol;

  SIG_FN_START: 10;
  SIG_FN_END: 11;
  SIG_FN_QUIT: 12;
  SIG_FN_ERR: 13;
  SIG_MODULE_CONFIGURED: 14;
  SIG_STATE_CHANGED: 15;

  RENDER_NO_OP: 1;
  RENDER_BY_KEY: 2;
  RENDER_BY_STATE: 3;

  FOR_ONE_INS_FIRSTLY: 1;
  FOR_ALL_INS_OF_A_MOD: 2;

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
  FN_CU: 'computed';
  FN_WATCH: 'watch';
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

interface IReducerFn {
  // let configure works well, set actionCtx generic type any
  (payload: any, moduleState: any, actionCtx: IActionCtx<any, any, any, any, any>): any | Promise<any>;
}

// !!!use infer
export type ArrItemsType<T extends any[]> = T extends Array<infer E> ? E : never;

export type ComputedValType<T> = {
  readonly [K in keyof T]: T[K] extends IAnyFn ? ReturnType<T[K]> :
  (
    T[K] extends IComputedFnSimpleDesc ? ReturnType<T[K]['fn']> : never
  );
}

export type SettingsType<SetupFn extends (...args: any) => any> = ReturnType<SetupFn> extends void ? {} : ReturnType<SetupFn>;

export type StateType<S> = S extends IAnyFn ? ReturnType<IAnyFn> : S;

interface IDispatchOptions {
  silent?: boolean;
  lazy?: boolean;
  renderKey?: string;
  delay?: number;// pick this delay first if user pass
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
export type TAuto = '-';
export type DepKeys = string[] | TStar | TAuto;

// type EvSyncReturn = (event: React.ChangeEvent<HTMLInputElement>) => void;
type SyncReturn = (...args: any) => void;

type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;

type RefComputedFn<FnCtx extends IFnCtxBase, CuRet, RefFullState extends IAnyObj = {}> = (
  oldState: RefFullState,
  newState: RefFullState,
  fnCtx: FnCtx,
) => CuRet;

type RefWatchFn<FnCtx extends IFnCtxBase, RefFullState extends IAnyObj = {}> = (
  oldState: RefFullState,
  newState: RefFullState,
  fnCtx: FnCtx,
) => boolean | void;

declare function computedFn<FnCtx extends IFnCtxBase = IFnCtxBase>(
  oldVal: any,
  newVal: any,
  fnCtx: FnCtx,
): any;
type GetComputedFn<T> = <FnCtx extends IFnCtxBase = IFnCtxBase>(
  oldVal: any,
  newVal: any,
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

// make type for empty RootReducer
export interface IRootBase extends IDict {
  [MODULE_VOID]: any
  $$global: any;
  $$default: any;
  [customizedKey: string]: any;
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

declare function refCtxOff(eventName: string): void;
declare function refCtxOff(eventDesc: [string, string?]): void;
declare function refCtxOff(eventDesc: { name: string, identity?: string }): void;

export type GetPromiseT<F extends (...args: any) => any> = F extends (...args: any) => Promise<infer T> ? T : ReturnType<F>;
type MyReturnType<F extends (...args) => any> = ReturnType<F> extends Promise<infer T>
  ? T
  : ReturnType<F>

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
declare function refCtxDispatch<Fn extends IReducerFn>
  (type: string, payload: (Parameters<Fn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<Fn>>;
declare function refCtxDispatch<RdFn extends IReducerFn>
  (type: RdFn, payload: (Parameters<RdFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn, FullState extends IAnyObj = {}>
  (type: { module?: string, fn: RdFn, cb?: (state: FullState) => void }, payload: (Parameters<RdFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<RdFn>>;
declare function refCtxDispatch<RdFn extends IReducerFn>
  (type: [string, RdFn], payload: (Parameters<RdFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<RdFn>>;

declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<UserFn>>;
declare function refCtxInvoke<UserFn extends IReducerFn>
  (fn: { module: string, fn: UserFn }, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<GetPromiseT<UserFn>>;

declare function refCtxSetState<FullState = {}>(state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState<FullState = {}>(moduleName: string, state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;

declare function refCtxForceUpdate<FullState = {}>(cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetGlobalState<GlobalState = {}>(state: Partial<GlobalState>, cb?: (newFullState: GlobalState) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetModuleState<RootState, T extends keyof RootState>(moduleName: T, state: Partial<RootState[T]>, cb?: (newFullState: RootState[T]) => void, renderKey?: string, delay?: number): void;

declare function refCtxGetConnectWatchedKeys(): { [key: string]: string[] };
declare function refCtxGetConnectWatchedKeys(module: string): string[];

/**
 * <V extends IAnyObj, CuRet, F extends IFnCtxBase = IFnCtxBase>
 * @param retKey 
 * @param fn 
 * @param {DepKeys} depKeys 
 * @param compare 
 * @param sort 
 */
declare function refCtxComputed(retKey: string, fn: RefComputedFn<IFnCtxBase, any, IAnyObj>, depKeys?: DepKeys, compare?: boolean, sort?: number): void;
declare function refCtxComputed(
  retKey: string,
  fnDesc: { fn: RefComputedFn<IFnCtxBase, any, IAnyObj>, depKeys?: DepKeys, compare?: boolean, sort?: number, retKeyDep?: boolean }
): void;

declare function refCtxComputed<RefFullState, CuRet = any, F extends IFnCtxBase = IFnCtxBase>
  (retKey: string, fn: RefComputedFn<F, CuRet, RefFullState>, depKeys?: DepKeys, compare?: boolean, sort?:number): void;
// (retKey: string, fn: RefComputedFn<F, CuRet, RefFullState>, depKeys?: (keyof RefFullState)[], compare?: boolean): void;
declare function refCtxComputed<RefFullState, CuRet = any, F extends IFnCtxBase = IFnCtxBase>(
  retKey: string,
  fnDesc: { computedFn: RefComputedFn<F, CuRet, RefFullState>, depKeys?: DepKeys, compare?: boolean, sort?: number, retKeyDep?: boolean }
): void;

// !!! 写成  <FnCtx extends IFnCtxBase, FnReturnType>(oldVal: any, newVal: any, fnCtx: FnCtx) => FnReturnType 暂时无法约束返回类型
// !!! 写成  <IFnCtx extends IFnCtxBase, FnReturnType, ValType>(oldVal: ValType, newVal: ValType, fnCtx: IFnCtxBase) => FnReturnType 暂时无法约束值类型和返回类型
// 先写为如下方式
type MultiComputed = {
  [retKey: string]: ((oldVal: any, newVal: any, fnCtx: IFnCtxBase) => any) | {
    fn: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => any,
    depKeys?: DepKeys,
    compare?: boolean,
    sort?: number,
    retKeyDep?: boolean,
  }
}
declare function refCtxComputed(multiComputed: MultiComputed): void;
declare function refCtxComputed(multiFn: (ctx: ICtxBase) => MultiComputed): void;

type VorB = void | boolean;
/**
 * 
 * @param retKey 
 * @param watchFn 
 * @param {DepKeys} depKeys 
 * @param {boolean} compare defalut is true
 * @param {boolean} immediate defalut is false
 */
declare function refCtxWatch(retKey: string, fn: RefWatchFn<IFnCtxBase, IAnyObj>, depKeys?: DepKeys, compare?: boolean, immediate?: boolean): void;
declare function refCtxWatch(retKey: string, fnDesc: { fn: RefWatchFn<IFnCtxBase, IAnyObj>, depKeys?: DepKeys, compare?: boolean, immediate?: boolean, retKeyDep?: boolean }): void;

declare function refCtxWatch<RefFullState, F extends IFnCtxBase = IFnCtxBase>
  (retKey: string, fn: RefWatchFn<F, RefFullState>, depKeys?: DepKeys, compare?: boolean, immediate?: boolean): void;
declare function refCtxWatch<RefFullState, F extends IFnCtxBase = IFnCtxBase>
  (retKey: string, fnDesc: { fn: RefWatchFn<F, RefFullState>, depKeys?: DepKeys, compare?: boolean, immediate?: boolean, retKeyDep?: boolean }): void;

// !!! 写成  <FnCtx extends IFnCtxBase, ValType>(oldVal: ValType, newVal: ValType, fnCtx: FnCtx) => VorB 暂时无法约束值类型
// 先写为如下方式
type MultiWatch = {
  [retKey: string]: ((oldVal: any, newVal: any, fnCtx: IFnCtxBase) => VorB) | {
    fn: (oldVal: any, newVal: any, fnCtx: IFnCtxBase) => VorB,
    depKeys?: DepKeys,
    compare?: boolean,
    immediate?: boolean,
    retKeyDep?: boolean,
  }
}
declare function refCtxWatch(multiWatch: MultiWatch): void;
declare function refCtxWatch(multiFn: (ctx: ICtxBase) => MultiWatch): void;

type ClearEffect = IAnyFnPromise | void;
type EffectDepKeys = string[] | null;

declare function refCtxEffect<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeys?: EffectDepKeys, compare?:boolean, immediate?: boolean): void;
declare function refCtxEffectProps<RefCtx extends ICtxBase = ICtxBase>
  (cb: (refCtx: RefCtx, isFirstCall: boolean) => ClearEffect, depKeys?: EffectDepKeys, immediate?: boolean): void;

declare function syncCb(value: any, keyPath: string, syncContext: { module:string, moduleState: object, fullKeyPath: string, state: object, refCtx: object }): IAnyObj | boolean;
// if module state is not equal full state, you need pass generic type FullState
declare function syncCb<Val, ModuleState, RefState = {}, RefCtx extends ICtxBase = ICtxBase>
  (
    value: Val, keyPath: string,
    syncContext: { module:string, moduleState: ModuleState, fullKeyPath: string, state: RefState, refCtx: RefCtx }
  ): any;

declare function asCb(value: any, keyPath: string, syncContext: { module:string, moduleState: object, fullKeyPath: string, state: object, refCtx: object }): any;
// if module state is not equal full state, you need pass generic type FullState
declare function asCb<Val, ModuleState, RefState, RefCtx extends ICtxBase = ICtxBase>
  (
    value: Val, keyPath: string,
    syncContext: { module:string, moduleState: ModuleState, fullKeyPath: string, state: RefState, refCtx: RefCtx }
  ): any;

//////////////////////////////////////////
// exposed interface
//////////////////////////////////////////

/**
 * use this interface to match ctx type that component only defined belong-module
 * 
 * concent will build ctx for every instance
 * for class get get like this: this.ctx
 * for function get get like this: const ctx = useConcent('foo');
 */
export interface ICtxBase {
  readonly module: PropKey;
  // module: '$$default';
  readonly isSingle: boolean;
  readonly type: CC_CLASS | CC_FRAGMENT | CC_HOOK;
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
  readonly renderKey: string;
  readonly tag: string;

  readonly mapped: IAnyObj;
  readonly stateKeys: string[];

  extra: any;
  staticExtra: any;
  readonly state: any;
  readonly prevState: any;
  readonly props: any;
  readonly prevProps: any;
  readonly moduleState: any;
  readonly mstate: any;
  readonly globalState: any;
  readonly connectedState: any;
  readonly refComputed: any;
  readonly moduleComputed: any;
  readonly globalComputed: any;
  readonly connectedComputed: any;

  readonly moduleReducer: any;
  readonly connectedReducer: any;
  readonly reducer: any;
  readonly mr: any;// alias of moduleReducer
  readonly cr: any;// alias of connectedReducer
  readonly r: any;// alias of reducer

  computed: typeof refCtxComputed;
  watch: typeof refCtxWatch;
  effect: typeof refCtxEffect;
  effectProps: typeof refCtxEffectProps;
  execute: (handler: IAnyFnPromise) => void;

  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;

  dispatch: typeof refCtxDispatch;
  dispatchLazy: typeof refCtxDispatch;
  dispatchSilent: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  silentDispatch: typeof refCtxDispatch;

  getWatchedKeys: () => string[];
  getConnectWatchedKeys: typeof refCtxGetConnectWatchedKeys;

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
  refs: { [key: string]: { current: any } };
  useRef: (refName: string) => any;//for class return ref=>{...}, for function return hookRef
  forceUpdate: typeof refCtxForceUpdate;
  setGlobalState: typeof refCtxSetGlobalState;
  setModuleState: typeof refCtxSetModuleState;
  sync: (string: string, value?: typeof syncCb | any, renderKey?: string, delay?: string) => SyncReturn;
  syncBool: (string: string, value?: typeof syncCb | boolean, renderKey?: string, delay?: string) => SyncReturn;
  syncInt: (string: string, value?: typeof syncCb | number, renderKey?: string, delay?: string) => SyncReturn;
  syncAs: (string: string, value?: typeof asCb | any, renderKey?: string, delay?: string) => SyncReturn;
  set: (string: string, value: any, renderKey?: string, delay?: string) => void;
  setBool: (string: string, renderKey?: string, delay?: string) => void;
  readonly settings: IAnyObj;
}

type ExtraType = [any, any];
// export interface ExtraType<> type ExtraType = [any=any, any=any];

/**
 * IRefCtx series is simple than ICtx series, it is a loose mode check,
 * so it is more easy to use when your coding environment is js^_^
 * IRefCtx is more suitable for ts coding environment!
 * so my suggestion is : when you use js and no d.ts file, try IRefCtx series to mark type for jsdoc, 
 * and when you use ts or have d.ts file in js, consider ICtx series fist!!!!!
 */
export interface IRefCtx<
  Props extends IAnyObj = {},
  PrivState extends IAnyObj = {},
  ModuleState extends IAnyObj = {},
  ModuleReducer extends IAnyObj = {},
  ModuleComputed extends IAnyObj = {},
  Settings extends IAnyObj = {},
  RefComputed extends IAnyObj = {},
  Mapped extends IAnyObj = {},
  // when connect other modules
  ConnectedState extends IAnyObj = {},
  ConnectedReducer extends IAnyObj = {},
  ConnectedComputed extends IAnyObj = {},
  ExtraType extends [any, any] | [any] = [any, any],
  >
  extends ICtxBase {
  readonly props: Props;
  readonly prevProps: Props;
  readonly state: PrivState & ModuleState;
  extra: ExtraType[0];
  staticExtra: ExtraType[1] extends undefined ? any : ExtraType[1];
  readonly prevState: PrivState & ModuleState;
  readonly moduleState: ModuleState;
  readonly mstate: ModuleState;
  readonly moduleComputed: ModuleComputed;
  readonly moduleReducer: ModuleReducer;
  readonly mr: ModuleReducer;// alias of moduleReducer
  readonly settings: Settings;
  readonly mapped: Mapped;
  readonly refComputed: RefComputed;
  // when connect other modules
  readonly connectedState: ConnectedState;
  readonly connectedReducer: ConnectedReducer;
  readonly cr: ConnectedReducer;// alias of connectedReducer
  readonly connectedComputed: ConnectedComputed;
}


/**
 *  =================================
 *   ICtx series start! because ICtx has strict type check, so start with RootState RootReducer RootComputed generic type
 *  =================================
 */
export interface ICtx
  <
  RootState extends IRootBase = IRootBase,
  RootReducer extends { [key in keyof RootState]?: any } = IRootBase,
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
  extra: ExtraType[0];
  staticExtra: ExtraType[1] extends undefined ? any : ExtraType[1];
  readonly state: RootState[ModuleName] & PrivState;
  readonly prevState: RootState[ModuleName] & PrivState;
  readonly moduleState: RootState[ModuleName];
  // readonly mstate: RootState[ModuleName];
  readonly reducer: RootReducer;
  readonly r: RootReducer;
  readonly moduleReducer: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  // alias of moduleReducer
  readonly mr: ModuleName extends keyof RootReducer ? (
    RootReducer[ModuleName]['setState'] extends Function ?
    RootReducer[ModuleName] : RootReducer[ModuleName] & { setState: typeof refCtxSetState }
  ) : {};
  readonly moduleComputed: ModuleName extends keyof RootCu ? RootCu[ModuleName] : {};
  readonly settings: Settings;
  readonly refComputed: RefComputed;
  readonly mapped: Mapped;
  // overwrite connectedState , connectedComputed
  readonly connectedState: Pick<RootState, ConnectedModules>;
  readonly connectedReducer: Pick<RootReducer, ConnectedModules>;
  readonly cr: Pick<RootReducer, ConnectedModules>;// alias of connectedReducer
  readonly connectedComputed: Pick<RootCu, ConnectedModules>;

  // !!! 目前这样写有问题，例如连接是foo,bar, 
  // 外面推导出的是 Pick<RootReducer, "foo"> | Pick<RootReducer, "bar">
  // 而不是 Pick<RootReducer, "foo" | "bar">

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
  RootState, {}, {}, Props, PrivState,
  MODULE_DEFAULT, MODULE_VOID, Settings, RefComputed, {}, Extra
  > { }

// this kind of ctx must belong to $$default module
// it has no default type as it has not been exposed to user!
export interface ICtxDefault
  <
  RootState extends IRootBase = IRootBase,
  RootReducer extends { [key in keyof RootState]?: any } = IRootBase,
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
  RootState, RootReducer, RootCu, Props, PrivState,
  ModuleName, ConnectedModules, Settings, RefComputed, Mapped, Extra
  > {
  // __key_as_hint_your_ctx_is_not_default__: 'your component is belong to $$default module by default, but you give a type Ctx which not belong to $$default module',
}


type GetFnCtxCommit<ModuleState> = <PS extends Partial<ModuleState>>(partialState: PS) => void;
type GetFnCtxCommitCu<ModuleComputed> = <PC extends Partial<ModuleComputed>>(partialComputed: PC) => void;

// to constrain IFnCtx interface series shape
export interface IFnCtxBase{
  retKey: string;
  isFirstCall: boolean;
  commitCu: GetFnCtxCommitCu<any>;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: any;
  committedState: IAnyObj;
  cuVal: any;
  refCtx: ICtxBase;
  commit: GetFnCtxCommit<any>;
  commitCu: GetFnCtxCommitCu<any>;
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
  extra?: any,// work for useConcent only
  watchedKeys?: string[] | TStar | TAuto;
  storedKeys?: any;
  connect?: any;
  tag?: string;
  persistStoredKeys?: boolean;
  lite?: 1 | 2 | 3 | 4;
  layoutEffect?: boolean;// work for useConcent only
  isPropsProxy?: boolean;// work for register only, default false
  isSingle?: boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: boolean;//default true
  setup?: (refCtx: ICtx) => IAnyObj | void;
  // render?: (ctxOrMapped: any) => ReactNode;// work for useConcent, registerHookComp, registerDumb only
}

// 不把render写在IRegBase里，会导致registerHookComp接口里的联合类型render函数类型失效
// 所以这里单独为CcFrag单独写一个接口
interface IRegBaseFrag<P extends IAnyObj, ICtx extends ICtxBase> extends IRegBase<P, ICtx> {
  render?: (ctxOrMapped: any) => ReactNode;// work for useConcent, registerHookComp, registerDumb only
}

interface IRegBaseSt<P extends IAnyObj, ICtx extends ICtxBase, FnState = {}> extends IRegBase<P, ICtx> {
  state: FnState; // state required
}

type ConnectSpec<RootState extends IRootBase> = (keyof RootState)[] |
  // !!! currently I do not know how to pass ${moduleName} to evaluate target type in object value
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState)]?: TStar | TAuto | string[] };
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
  storedKeys?: PrivState extends IAnyFn ? (keyof ReturnType<PrivState>)[] : (keyof PrivState)[]
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
  <IFnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: IFnCtx): void | boolean;
}
// declare function watchFn<IFnCtx extends IFnCtxBase>(oldVal: any, newVal: any, fnCtx: IFnCtx): void;
type WatchFnDesc = {
  fn: WatchFn,
  compare?: boolean,// default is runtimeVar.watchCompare
  immediate?: boolean,// default is runtimeVar.watchImmediate
  depKeys?: DepKeys,// default is '-'
  retKeyDep?: boolean,// default is true
}

type TypeDesc = {
  module?: string;
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

type MidInfo = {
  calledBy: string, type: string, payload: any,
  renderKey: string, delay: number, ccKey: string, ccUniqueKey: string,
  committedState: object, sharedState: object | null,
  refModule: string, module: string, fnName: string,
  modState: (key: string, value: any) => void,
};
type PluginOn = (sig: string | string[], callback: (data: { sig: string, payload: any }) => void) => void;
interface Plugin {
  install: (on: PluginOn) => { name: string };
}
interface RunOptions {
  middlewares?: ((midInfo: MidInfo, next: Function) => void)[];
  plugins?: Plugin[];// default is false
  isHot?: boolean;// default is false
  isStrict?: boolean;
  errorHandler?: (err: Error) => void;
  reducer?: IAnyFnInObj;// deprecated
  bindCtxToMethod?: boolean;
  computedCompare?: boolean;// default is true
  watchCompare?: boolean;// default is true
  watchImmediate?: boolean;// default is false
  reComputed?: boolean;// default is true
}

export interface IActionCtxBase {
  callerModule: string;
  module: PropKey;
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
  setState: (obj: IAnyObj) => Promise<IAnyObj>;
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
  setState: <T extends Partial<FullState>>(obj: T) => Promise<T>;
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
export function register<Props extends IAnyObj = {}>(
  registerOptions: string,
  ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<Props>;
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
): (ReactComp: typeof Component) => ComponentClass<Props>;



export function connect<
  Props extends IAnyObj = {},
  RootState extends IRootBase = IRootBase,
  >(
    connectSpec: ConnectSpec<RootState>,
    ccClassKey?: string,
): (ReactComp: typeof Component) => ComponentClass<Props>;


export type NoMap = 'NoMap';
type NoPrivState = 'NoPrivState';
type TMap = IAnyObj | NoMap;

export function registerHookComp<Props extends IAnyObj, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): (renderFn: (props: RefCtx) => ReactNode) => FC<Props>;

// ********* registerOptions 【包含】render时，直接返回组件 *********
/** ====== 无指定所属模块，仅自定义自己的自己管理状态时 ======*/
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
export function useConcent<Props extends IAnyObj = {}, RefCtx extends ICtxBase = ICtxBase>(
  registerOptions?: string,
  ccClassKey?: string,
): RefCtx;
export function useConcent<
  Props extends IAnyObj,
  RefCtx extends ICtxBase,
  T extends IAnyObj | NoMap,
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

export function configure(moduleName: string, moduleConfig: ModuleConfig): void;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, ModuleState>(moduleName: keyof RootState, state: Partial<ModuleState>, renderKey?: string, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<RootState extends IRootBase>(): RootState['$$global'];

export function getConnectedState<RootState>(ccClassKey: string): Partial<RootState>;

export function getComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: string, delay?: number): void;

// only work for top api cc.dispatch
interface IDispatchExtra {
  ccClassKey?: string;
  ccKey?: string;
  throwError?: boolean;
  refModule?: string;
}
export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string | IDispatchOptions, delay?: number, extra?: IDispatchExtra): Promise<T>;

export declare const emit: typeof refCtxEmit;

export declare const off: typeof refCtxOff;

export function execute(ccClassKey: string, ...args: any): void;

export function executeAll(...args: any): void;

export function appendState(moduleName: string, state: IAnyObj): void;


type DefOptions = { depKeys?: DepKeys, compare?: boolean, lazy?: boolean, sort?: number, retKeyDep?: boolean };

export function defComputedVal<CuRet>(ret: CuRet): IComputedFnDesc<GetComputedFn<CuRet>>;

export function defComputed<V extends IAnyObj, CuRet, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => CuRet, defOptions: DepKeys | DefOptions): IComputedFnDesc<GetComputedFn<CuRet>>;
export function defComputed<CuRet>
  (fn: (newState: IAnyObj, oldState: IAnyObj, fnCtx: IFnCtxBase) => CuRet, defOptions: DepKeys | DefOptions): IComputedFnDesc<GetComputedFn<CuRet>>;

type DefLazyOptions = { depKeys?: DepKeys, compare?: boolean, sort?: number, retKeyDep?: boolean };

export function defLazyComputed<V extends IAnyObj, CuRet, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => CuRet, defOptions: DepKeys | DefLazyOptions): IComputedFnDesc<GetComputedFn<CuRet>>;
export function defLazyComputed<CuRet>
  (fn: (newState: IAnyObj, oldState: IAnyObj, fnCtx: IFnCtxBase) => CuRet, defOptions: DepKeys | DefLazyOptions): IComputedFnDesc<GetComputedFn<CuRet>>;

type DefWatchOptions = { depKeys?: DepKeys, compare?: boolean, immediate?: boolean, sort?: number, retKeyDep?: boolean };

export function defWatch<V extends IAnyObj = {}, F extends IFnCtxBase = IFnCtxBase>
  (fn: (newState: V, oldState: V, fnCtx: F) => void | boolean, defOptions?: DepKeys | DefWatchOptions): WatchFnDesc;

export declare const cst: CcCst;

export class CcFragment<P extends IAnyObj, Ctx extends ICtxBase> extends
  Component<{
    register: IRegBaseFrag<P, Ctx>, ccKey?: string, ccClassKey?: string,
    ccOption?: { storedKeys?: string[], renderKey?: string, persistStoredKeys?: boolean, tag?: string }
  }, any> { }

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: IAnyFnInObj;

export function getRefs<Ctx extends ICtxBase>(): Ctx[];

export function cloneModule(moduleName: string, existingModule: string, moduleConfig?: ModuleConfig): void;

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
  configure: typeof configure,
  cloneModule: typeof cloneModule,
  set: typeof set,
  setState: typeof setState,
  setGlobalState: typeof setGlobalState,
  getState: typeof getState,
  getGlobalState: typeof getGlobalState,
  getConnectedState: typeof getConnectedState,
  getComputed: typeof getComputed,
  getGlobalComputed: typeof getGlobalComputed,
  getRefs: typeof getRefs,
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
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;

