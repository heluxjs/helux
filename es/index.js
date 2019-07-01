import _startup from './api/startup';
import _cloneModule from './api/clone-module';
import _load from './api/load';
import _register from './api/register';
import _r from './api/r';
import _registerToDefault from './api/register-to-default';
import _registerSingleClassToDefault from './api/register-single-class-to-default';
import _configure from './api/configure';
import _call from './api/call';
import _setGlobalState from './api/set-global-state';
import _setState from './api/set-state';
import _set from './api/set';
import _getState from './api/get-state';
import _getGlobalState from './api/get-global-state';
import _getComputed from './api/get-computed';
import _emit from './api/emit';
import _emitWith from './api/emit-with';
import _off from './api/off';
import _connect from './api/connect';
import _connectDumb from './api/connect-dumb';
import _connectPure from './api/connect-pure';
import _dispatch from './api/dispatch';
import _lazyDispatch from './api/lazyDispatch';
import _ccContext from './cc-context';
import _createDispatcher from './api/create-dispatcher';
import _execute from './api/execute';
import _executeAll from './api/execute-all';
import _getRefs from './api/get-refs';
import _getConnectedState from './api/get-connected-state';
import _appendState from './api/appendState';
import _reducer from './api/reducer';
import _lazyReducer from './api/lazyReducer';
import _CcFragment from './component/CcFragment';
import * as _cst from './support/constant';
import * as util from './support/util';

export const startup = _startup;
export const cloneModule = _cloneModule;
export const load = _load;
export const run = _load;
export const register = _register;
export const r = _r;
export const registerToDefault = _registerToDefault;
export const registerSingleClassToDefault = _registerSingleClassToDefault;
export const configure = _configure;
export const call = _call;
export const setGlobalState = _setGlobalState;
export const setState = _setState;
export const set = _set;
export const getState = _getState;
export const getGlobalState = _getGlobalState;
export const getConnectedState = _getConnectedState;
export const getComputed = _getComputed;
export const emit = _emit;
export const emitWith = _emitWith;
export const off = _off;
export const connect = _connect;
export const connectDumb = _connectDumb;
export const connectPure = _connectPure;
export const dispatch = _dispatch;
export const lazyDispatch = _lazyDispatch;
export const ccContext = _ccContext;
export const createDispatcher = _createDispatcher;
export const execute = _execute;
export const executeAll = _executeAll;
export const getRefs = _getRefs;
export const reducer = _reducer;
export const lazyReducer = _lazyReducer;
export const CcFragment = _CcFragment;
export const cst = _cst;
export const appendState = _appendState;

const defaultExport = {
  cloneModule,
  emit,
  emitWith,
  off,
  connect,
  connectDumb,
  connectPure,
  dispatch,
  lazyDispatch,
  startup,
  load,
  run,
  register,
  r,
  registerToDefault,
  registerSingleClassToDefault,
  configure,
  call,
  setGlobalState,
  setState,
  set,
  getGlobalState,
  getState,
  getComputed,
  getConnectedState,
  ccContext,
  createDispatcher,
  execute,
  executeAll,
  getRefs,
  reducer,
  lazyReducer,
  CcFragment,
  cst,
  appendState,
}

util.bindToWindow('cc', defaultExport);

export default defaultExport;
