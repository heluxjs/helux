import _cloneModule from './api/clone-module';
import _run from './api/run';
import _connect from './api/connect';
import _connectDumb from './api/connect-dumb';
import _register from './api/register';
import _registerDumb from './api/register-dumb';
import _registerHookComp from './api/register-hook-comp';
import _configure from './api/configure';
import _setGlobalState from './api/set-global-state';
import _setState from './api/set-state';
import _set from './api/set';
import _setValue from './api/set-val';
import _getState from './api/get-state';
import _getGlobalState from './api/get-global-state';
import _getComputed from './api/get-computed';
import _emit from './api/emit';
import _off from './api/off';
import _dispatch from './api/dispatch';
import _ccContext from './cc-context';
import _execute from './api/execute';
import _executeAll from './api/execute-all';
import _getRefs from './api/get-refs';
import _getConnectedState from './api/get-connected-state';
import _appendState from './api/append-state';
import _reducer from './api/reducer';
import _clearContextIfHot from './api/clear-context-if-hot';
import _CcFragment from './component/CcFragment';
import _Ob from './component/Ob';
import _useConcent from './api/use-concent';
import * as _cst from './support/constant';
import * as util from './support/util';

export const cloneModule = _cloneModule;
export const run = _run;
export const connect = _connect;
export const connectDumb = _connectDumb;
export const register = _register;
export const registerDumb = _registerDumb;
export const registerHookComp = _registerHookComp;
export const configure = _configure;
export const setGlobalState = _setGlobalState;
export const setState = _setState;
export const set = _set;
export const setValue = _setValue;
export const getState = _getState;
export const getGlobalState = _getGlobalState;
export const getConnectedState = _getConnectedState;
export const getComputed = _getComputed;
export const emit = _emit;
export const off = _off;
export const dispatch = _dispatch;
export const ccContext = _ccContext;
export const execute = _execute;
export const executeAll = _executeAll;
export const getRefs = _getRefs;
export const reducer = _reducer;
export const clearContextIfHot = _clearContextIfHot;
export const CcFragment = _CcFragment;
export const Ob = _Ob;
export const cst = _cst;
export const appendState = _appendState;
export const useConcent = _useConcent;

export const defComputed = (fn, defOptions) => util.makeFnDesc(fn, defOptions);
export const defLazyComputed = (fn, defOptions) => {
  const desc = util.makeFnDesc(fn, defOptions);
  desc.lazy = true;
  return desc;
}
export const defComputedVal = (val) => ({ fn: () => val, depKeys: [] });
export const defWatch = (fn, defOptions) => util.makeFnDesc(fn, defOptions);

const defaultExport = {
  cloneModule,
  emit,
  off,
  connect,
  connectDumb,
  register,
  registerDumb,
  registerHookComp,
  configure,
  dispatch,
  run,
  setGlobalState,
  setState,
  set,
  setValue,
  getGlobalState,
  getState,
  getComputed,
  getConnectedState,
  ccContext,
  execute,
  executeAll,
  getRefs,
  reducer,
  clearContextIfHot,
  CcFragment,
  Ob,
  cst,
  appendState,
  useConcent,
  bindCcToMcc,
  defComputed,
  defLazyComputed,
  defComputedVal,
  defWatch,
}

export function bindCcToMcc(name) {
  if (!multiCcContainer) {
    throw new Error('current env is not multi concent ins mode');
  }
  if (multiCcContainer[name]) {
    throw new Error(`ccNamespace[${name}] already existed in window.mcc`);
  }
  util.setCcNamespace(name);
  util.bindToWindow(name, defaultExport, multiCcContainer);
}

function avoidMultiCcInSameScope() {
  const winCc = util.getWinCc();
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
}

// 微前端机构里，每个子应用都有自己的cc实例，需要绑定到mcc下，防止相互覆盖
const multiCcContainer = window.mcc;
if (multiCcContainer) {
  // 1秒后concent会检查ccns，如果不存在，说明用户忘记调用bindCcToMcc了
  setTimeout(() => {
    const ccns = util.getCcNamespace();
    if (!ccns) {
      throw new Error('detect window.mcc, but user forget call bindCcToMcc in bundle entry');
    } else {
      avoidMultiCcInSameScope();
    }
  }, 1000);
} else {
  avoidMultiCcInSameScope();
  util.bindToWindow('cc', defaultExport);
}

export default defaultExport;
