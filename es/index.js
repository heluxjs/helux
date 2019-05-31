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
import _getState from './api/get-state';
import _getGlobalState from './api/get-global-state';
import _getComputed from './api/get-computed';
import _emit from './api/emit';
import _emitWith from './api/emit-with';
import _off from './api/off';
import _connect from './api/connect';
import _dispatch from './api/dispatch';
import _ccContext from './cc-context';
import _createDispatcher from './api/create-dispatcher';
import _execute from './api/execute';
import _executeAll from './api/execute-all';
import _CcFragment from './component/CcFragment';

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
export const getState = _getState;
export const getGlobalState = _getGlobalState;
export const getComputed = _getComputed;
export const emit = _emit;
export const emitWith = _emitWith;
export const off = _off;
export const connect = _connect;
export const dispatch = _dispatch;
export const ccContext = _ccContext;
export const createDispatcher = _createDispatcher;
export const execute = _execute;
export const executeAll = _executeAll;
export const CcFragment = _CcFragment;

const defaultExport = {
  cloneModule,
  emit,
  emitWith,
  off,
  connect,
  dispatch,
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
  getGlobalState,
  setState,
  getState,
  getComputed,
  ccContext,
  createDispatcher,
  execute,
  executeAll,
  CcFragment,
}

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;
