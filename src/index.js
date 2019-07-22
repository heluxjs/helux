import _startup from './api/startup';
import _cloneModule from './api/clone-module';
import _load from './api/load';
import _register from './api/register';
import _r from './api/r';
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
import _lazyDispatch from './api/lazy-dispatch';
import _ccContext from './cc-context';
import _createDispatcher from './api/create-dispatcher';
import _execute from './api/execute';
import _executeAll from './api/execute-all';
import _getRefs from './api/get-refs';
import _getConnectedState from './api/get-connected-state';
import _appendState from './api/append-state';
import _reducer from './api/reducer';
import _lazyReducer from './api/lazy-reducer';
import _clearContextIfUnderHotReloadMode from './api/clear-context-if-under-hot-reload-mode';
import _CcFragment from './component/CcFragment';
import _useConcent from './api/use-concent';
import * as _cst from './support/constant';
import * as util from './support/util';

export const startup = _startup;
export const cloneModule = _cloneModule;
export const load = _load;
export const run = _load;
export const register = _register;
export const r = _r;
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
export const clearContextIfUnderHotReloadMode = _clearContextIfUnderHotReloadMode;
export const CcFragment = _CcFragment;
export const cst = _cst;
export const appendState = _appendState;
export const useConcent = _useConcent;

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
  clearContextIfUnderHotReloadMode,
  CcFragment,
  cst,
  appendState,
  useConcent,
}

const winCc = window.cc;
if (winCc) {
  if (winCc.ccContext && winCc.ccContext.info) {
    const existedVersion = winCc.ccContext.info.version;
    const nowVersion = ccContext.info.version;
    //webpack-dev-server模式下，有些引用了concent的插件或者中间件模块，如果和当前concent版本不一致的话，会保留另外一个concent在其包下
    //路径如 node_modules/concent-middleware-web-devtool/node_modules/concent（注，在版本一致时，不会出现此问题）
    //这样的就相当于隐形的实例化两个concent 上下文，这是不允许的
    if (existedVersion !== nowVersion) {
      throw new Error(`a existed version concent ${existedVersion} is different with current about to import concent ${nowVersion}, 
      it may caused by some of your concent-eco-module with older version concent, please reinstall them (concent-*** module)`);
    }
  }
}
util.bindToWindow('cc', defaultExport);

export default defaultExport;
