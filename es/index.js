import _startup from './api/startup';
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
import _emit from './api/emit';
import _emitWith from './api/emit-with';
import _off from './api/off';
import _connect from './api/connect';
import _dispatch from './api/dispatch';
import _ccContext from './cc-context';
import _createDispatcher from './api/create-dispatcher';
import _CcFragment from './component/CcFragment';
export var startup = _startup;
export var load = _load;
export var run = _load;
export var register = _register;
export var r = _r;
export var registerToDefault = _registerToDefault;
export var registerSingleClassToDefault = _registerSingleClassToDefault;
export var configure = _configure;
export var call = _call;
export var setGlobalState = _setGlobalState;
export var setState = _setState;
export var getState = _getState;
export var emit = _emit;
export var emitWith = _emitWith;
export var off = _off;
export var connect = _connect;
export var dispatch = _dispatch;
export var ccContext = _ccContext;
export var createDispatcher = _createDispatcher;
export var CcFragment = _CcFragment;
var defaultExport = {
  emit: emit,
  emitWith: emitWith,
  off: off,
  connect: connect,
  dispatch: dispatch,
  startup: startup,
  load: load,
  run: run,
  register: register,
  r: r,
  registerToDefault: registerToDefault,
  registerSingleClassToDefault: registerSingleClassToDefault,
  configure: configure,
  call: call,
  setGlobalState: setGlobalState,
  setState: setState,
  getState: getState,
  ccContext: ccContext,
  createDispatcher: createDispatcher,
  CcFragment: CcFragment
};

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;