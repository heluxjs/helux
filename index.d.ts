import { Component, ReactNode } from 'react';

export type ArrItemsType<T extends any[]> = T extends Array<infer E>  ? E : never;

export interface TAnyObj { [key: string]: any }

export type TStar = '*';

type AnyFn = (...args: any[]) => any;
type ReducerFn = (payload: any, moduleState: any, actionCtx: IActionCtx) => any;

type OnCallBack<EventCbArgs extends any[]> = (...args: EventCbArgs) => void;
type RefComputedFn<FnCtx extends IFnCtxBase, FnReturnType> = (
  oldVal: string,
  newVal: any,
  fnCtx: FnCtx,//user decide it is FnCtx or FnCtxConnect
) => FnReturnType;
type RefComputedFnDesc<FnCtx extends IFnCtxBase, FnReturnType> = {
  fn: RefComputedFn<FnCtx, FnReturnType>;
  compare?: boolean;
  depKeys?: string[];
};

type ComputedFn = (
  oldVal: any,
  newVal: any,
  fnCtx: IFnCtxBase,//user decide it is FnCtx or FnCtxConnect
) => any;
type ComputedFnDesc = {
  fn: ComputedFn;
  compare?: boolean;
  depKeys?: string[];
};

interface DefaultBase {
  $$global: any,
  $$default: any,
  $$cc?: any,
  [customizedKey: string]: any;
}
export interface DefaultState extends DefaultBase {
}
interface DefaultCu extends DefaultBase {
}


// export function dodo<TA, TB, keyof TA extends keyof TB>(a: TA, b: TB): void; 
type MyPick<RootState extends DefaultState, ConnectedModules extends keyof DefaultState> = Pick<RootState, ConnectedModules>;

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
declare function refCtxOn<EventCbArgs extends any[]>(eventName: string, cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: [string, string?], cb: OnCallBack<EventCbArgs>): void;
declare function refCtxOn<EventCbArgs extends any[]>(eventDesc: { name: string, identity?: string }, cb: OnCallBack<EventCbArgs>): void;

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
declare function refCtxDispatch<Fn extends ReducerFn>(type: string, payload: (Parameters<Fn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<Fn>>;
declare function refCtxDispatch<TypeAsFn extends ReducerFn>(type: TypeAsFn, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;
declare function refCtxDispatch<TypeAsFn extends ReducerFn>(type: { module: string, fn: TypeAsFn }, payload: (Parameters<TypeAsFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<TypeAsFn>>;

declare function refCtxInvoke<UserFn extends ReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends ReducerFn>(fn: UserFn, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;
declare function refCtxInvoke<UserFn extends ReducerFn>(fn: { module: string, fn: UserFn }, payload: (Parameters<UserFn>)[0], renderKey?: string, delay?: number): Promise<ReturnType<UserFn>>;

declare function refCtxSetState<FullState>(state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState<FullState>(moduleName:string, state: Partial<FullState>, cb?: (newFullState: FullState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(state: TAnyObj, cb?: (newFullState: TAnyObj) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetState(moduleName:string, state: TAnyObj, cb?: (newFullState: TAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetGlobalState<GlobalState>(state: Partial<GlobalState>, cb?: (newFullState: GlobalState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetGlobalState(state: TAnyObj, cb?: (newFullState: TAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxSetModuleState<ModuleState>(moduleName:string, state: Partial<ModuleState>, cb?: (newFullState: ModuleState) => void, renderKey?: string, delay?: number): void;
declare function refCtxSetModuleState(moduleName:string, state: TAnyObj, cb?: (newFullState: TAnyObj) => void, renderKey?: string, delay?: number): void;

declare function refCtxComputed<IFnCtx extends IFnCtxBase, FnReturnType>(retKey: string, computedFn: RefComputedFn<IFnCtx, FnReturnType>): void;

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
interface IRefCtxBase{
  state: TAnyObj;
  moduleState: TAnyObj;
  globalState: TAnyObj;
  connectedState: TAnyObj;
  refComputed: TAnyObj;
  refConnectedComputed: TAnyObj;
  moduleComputed: TAnyObj;
  globalComputed: TAnyObj;
  connectedComputed: TAnyObj;
  computed: typeof refCtxComputed;
  on: typeof refCtxOn;
  emit: typeof refCtxEmit;
  off: typeof refCtxOff;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  setState: typeof refCtxSetState;
  setGlobalState: typeof refCtxSetGlobalState;
  setModuleState: typeof refCtxSetModuleState;
  sync: (string: string, value?: SyncCb | any, renderKey?: string, delay?: string) => Function;
  syncBool: (string: string, renderKey?: string, delay?: string) => Function;
  syncInt: (string: string, renderKey?: string, delay?: string) => Function;
  set: (string: string, value: any, renderKey?: string, delay?: string) => void;
  setBool: (string: string, renderKey?: string, delay?: string) => void;
  settings: TAnyObj;
}

type SyncCb = (value: any, keyPath: string, syncContext: { moduleState: object, fullKeyPath: string }) => void;
type SetCb = (newFullState: object) =>void;
export interface IRefCtx<RootState extends DefaultState, ModuleState, RefState, Settings, Rccu extends TAnyObj> extends IRefCtxBase{
  state: RefState;
  moduleState: ModuleState;
  globalState: RootState['$$global'];
  settings: Settings;
  refConnectedComputed: Rccu;
}
/**
 * match ctx type: use belonged module computed
 */
export interface IRefCtxMcu
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends 
  IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  moduleComputed: ModuleCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules
 */
export interface IRefCtxMcuCon
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, ConnectedModules extends keyof RootState,
  RootCu extends RootState, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends
  IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  moduleComputed: ModuleCu;
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: use belonged module computed, define ref computed in setup
 */
export interface IRefCtxMcuRcu
  <RootState extends DefaultState, ModuleState, RefState, ModuleCu, RefCu, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  moduleComputed: ModuleCu;
  refComputed: RefCu;
}
/**
 * match ctx type: use belonged module computed, connect other modules, define ref computed in setup
 */
export interface IRefCtxMcuConRcu
  <RootState extends DefaultBase, ModuleState, RefState, ModuleCu, RootCu extends DefaultBase,
  ConnectedModules extends keyof DefaultBase, RefCu, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends IRefCtxMcuRcu<RootState, ModuleState, RefState, ModuleCu, RefCu, Settings, Rccu> {
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules
 */
export interface IRefCtxCon
  <RootState extends DefaultState, ModuleState, RefState, ConnectedModules extends keyof DefaultBase, 
  RootCu extends DefaultBase, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  // overwrite connectedState , connectedComputed
  connectedState: MyPick<RootState, ConnectedModules>;
  connectedComputed: MyPick<RootCu, ConnectedModules>;
}
/**
 * match ctx type: connect other modules, define ref computed in setup
 */
export interface IRefCtxConRcu
  <RootState extends DefaultState, ModuleState, RefState, ConnectedModules extends keyof RootState, 
  RootCu extends RootState, RefCu, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  connectedState: Pick<RootState, ConnectedModules>;
  connectedComputed: Pick<RootCu, ConnectedModules>;
  refComputed: RefCu;
}
/**
 * match ctx type: define ref computed in setup
 */
export interface IRefCtxRcu
  <RootState extends DefaultState, ModuleState, RefState, RefCu, Settings extends TAnyObj, Rccu extends TAnyObj>
  extends IRefCtx<RootState, ModuleState, RefState, Settings, Rccu> {
  refComputed: RefCu;
}

export interface IFnCtxBase {
  retKey: string;
  setted: string[];
  changed: string[];
  stateModule: string;
  refModule: string;
  oldState: TAnyObj;
  committedState: TAnyObj;
  refCtx: IRefCtxBase;
}
export interface IFnCtx<RefCtx extends IRefCtxBase> extends IFnCtxBase{
  refCtx: RefCtx;
}
export interface IFnCtxComm<RefCtx extends IRefCtxBase, FullState> extends IFnCtxBase{
  oldState: FullState;
  committedState: Partial<FullState>;
  refCtx: RefCtx;
}

declare class ConcentComponent extends Component {
}

interface RegisterOptions<RootState, ModuleState, RefState> {
  module?: string;// default '$$default'
  watchedKeys?: (keyof ModuleState)[];
  storedKeys?: (Exclude<keyof RefState, keyof ModuleState>)[];
  connect?: (keyof RootState | '$$global' | '$$default')[] |
  // currently I do not know how to pass ${moduleName} to evaluate target type
  // something like (keyof RootState[moduleName] )[] but it is wrong writing
  { [moduleName in (keyof RootState | '$$global' | '$$default')]?: TStar | string[] };
  tag?: string;
  persistStoredKeys?: Boolean;
  lite?: 1 | 2 | 3 | 4;
  reducerModule?: string;// defuault equal ${module}
  isPropsProxy?: Boolean;// default false
  isSingle?: Boolean; //default false
  renderKeyClasses?: string[];
  compareProps?: Boolean;//default true
}

// interface reducerFn {
//   <ModuleState>(
//     payload: any,
//   ): Promise<Pick<ModuleState, keyof ModuleState>>
// }
// interface reducerFn {
//   <ModuleState>(
//     payload: any,
//     moduleState: ModuleState,
//   ): Promise<Pick<ModuleState, keyof ModuleState>>
// }
// interface reducerFn {
//   <ModuleState>(
//     payload: any,
//     moduleState: ModuleState,
//     actionCtx?: IActionCtx,
//   ): Promise<Pick<ModuleState, keyof ModuleState>>
// }

type WatchFn = <RootState, ModuleState>(
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
    [fnName: string]: ReducerFn;
  };
  computed?: {
    [retKey: string]: ComputedFn | ComputedFnDesc;
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
  middlewares: ((stateInfo: StateInfo, next: Function) => void)[];
  plugins: Plugin[];
}

interface IActionCtxBase {
  targetModule: string;
  invoke: typeof refCtxInvoke;
  lazyInvoke: typeof refCtxInvoke;
  dispatch: typeof refCtxDispatch;
  lazyDispatch: typeof refCtxDispatch;
  setState: (obj: TAnyObj) => Promise<TAnyObj>;
}
export interface IActionCtx extends IActionCtxBase {
  refCtx: {};
}
// constraint RefCtx must be an implement of IRefCtxBase
export interface IActionCtxRef<RefCtx extends IRefCtxBase> extends IActionCtxBase {
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

export function register<RootState, ModuleState, RefState>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (ReactCompType: typeof Component) => typeof ConcentComponent;

//use decide it is RefCtx or RefCtxConnect
export function registerDumb<RootState, ModuleState, RefState, RefCtxBase>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): (renderFn: (props: RefCtxBase | any) => ReactNode) => typeof Component;

//use decide it is RefCtx or RefCtxConnect
export function useConcent<RootState, ModuleState, RefState, RefCtxBase>(
  registerOptions: String | RegisterOptions<RootState, ModuleState, RefState>,
  ccClassKey?: string,
): RefCtxBase;

export function configure(moduleName: string, moduleConfig: ModuleConfig): void;

export function cloneModule(newModule: string, existingModule: string, overwriteModuleConfig?: ModuleConfig): void;

export function setState<RootState, moduleState>(moduleName: keyof RootState, state: Partial<moduleState>, renderKey?: string, delay?: number): void;

export function setGlobalState<GlobalState>(state: Partial<GlobalState>): void;

export function getState<RootState>(moduleName?: keyof RootState): object;

export function getGlobalState<RootState extends DefaultBase>(): RootState['$$global'];

export function getConnectedState<RootState>(ccClassKey: string): Partial<RootState>;

export function getComputed<T>(moduleName?: string): T;

export function getGlobalComputed<T>(): T;

export function set(keyPath: string, value: any, renderKey?: string, delay?: number): void;

export function dispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

export function lazyDispatch<T>(type: string | TypeDesc, payload?: any, renderKey?: string, delay?: number): Promise<T>;

/**
 * user specify detail type when use
 * 
 * import {reducer} from 'concent';
 * import { RootReducer } from 'types';
 * 
 * const typedReducer = reducer as RootReducer;
 */
export declare const reducer: any;
export declare const lazyReducer: any;

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
}

declare let defaultExport: DefaultExport;
export default defaultExport;

export as namespace cc;