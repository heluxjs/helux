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
import _getState from './api/get-state';
import _getGlobalState from './api/get-global-state';
import _getGlobalComputed from './api/get-global-computed';
import _getComputed from './api/get-computed';
import _debugComputed from './api/debug-computed';
import _emit from './api/emit';
import _off from './api/off';
import _dispatch from './api/dispatch';
import _ccContext from './cc-context';
import _execute from './api/execute';
import _executeAll from './api/execute-all';
import _getRefs from './api/get-refs';
import _appendState from './api/append-state';
import _reducer from './api/reducer';
import _clearContextIfHot from './api/clear-context-if-hot';
import _CcFragment from './component/CcFragment';
import _Ob from './component/Ob';
import _useConcent from './api/use-concent';
import _fnPayload from './api/fn-payload';
import * as _cst from './support/constant';
import * as util from './support/util';

const { bindToContainer, safeGet } = util;

// for ssr
if (typeof window === 'undefined') {
  // eslint-disable-next-line
  global && (global.window = {});
}

const _getRef = (filters) => {
  const refs = _getRefs(filters);
  return refs[0];
};

export const cloneModule = _cloneModule;
export const run = _run;
export const connect = _connect;
export const connectDumb = _connectDumb;
export const register = _register;
export const registerDumb = _registerDumb;
export const registerHookComp = _registerHookComp;
export const configure = _configure;
export const defineModule = (conf) => {
  const confCopy = Object.assign({}, conf);
  if (conf.reducer) confCopy.r = confCopy.reducer;
  return confCopy;
};
export const setGlobalState = _setGlobalState;
export const setState = _setState;
export const set = _set;
export const getState = _getState;
export const getGlobalState = _getGlobalState;
export const getComputed = _getComputed;
export const debugComputed = _debugComputed;
export const getGlobalComputed = _getGlobalComputed;
export const emit = _emit;
export const off = _off;
export const dispatch = _dispatch;
export const ccContext = _ccContext;
export const execute = _execute;
export const executeAll = _executeAll;
export const getRefs = _getRefs;
export const getRef = _getRef;
export const reducer = _reducer;
export const clearContextIfHot = _clearContextIfHot;
export const CcFragment = _CcFragment;
export const Ob = _Ob;
export const cst = _cst;
export const appendState = _appendState;
export const useConcent = _useConcent;
export const fnPayload = _fnPayload;

export const defComputed = (fn, defOptions) => util.makeFnDesc(fn, defOptions);
export const defLazyComputed = (fn, defOptions) => {
  const desc = util.makeFnDesc(fn, defOptions);
  desc.lazy = true;
  return desc;
}
export const defComputedVal = (val) => ({ fn: () => val, depKeys: [] });
/** @type {import('./types').defWatch} */
export const defWatch = (fn, defOptions) => util.makeFnDesc(fn, defOptions);

const innerBindCcTo = (custPrefix, bindTo) => {
  if (!bindTo) return;
  let prefix = custPrefix ? `${custPrefix}_` : '';
  bindToContainer(`${prefix}cc`, defaultExport, bindTo);
  bindToContainer(`${prefix}CC_CONTEXT`, ccContext, bindTo);
  bindToContainer(`${prefix}ccc`, ccContext, bindTo);
  bindToContainer(`${prefix}cccc`, ccContext.computed._computedValues, bindTo);
  bindToContainer(`${prefix}sss`, ccContext.store._state, bindTo);
}

export const bindCcToWindow = (custPrefix) => {
  innerBindCcTo(custPrefix, window);
};

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
  defineModule,
  dispatch,
  run,
  setGlobalState,
  setState,
  set,
  getGlobalState,
  getState,
  getComputed,
  debugComputed,
  getGlobalComputed,
  ccContext,
  execute,
  executeAll,
  getRefs,
  getRef,
  reducer,
  clearContextIfHot,
  CcFragment,
  Ob,
  cst,
  appendState,
  useConcent,
  bindCcToMcc,
  bindCcToWindow,
  defComputed,
  defLazyComputed,
  defComputedVal,
  defWatch,
  fnPayload,
}

let multiCcContainer = null;
let mccKey = '';
export function bindCcToMcc(key) {
  if (!multiCcContainer) {
    throw new Error('current env is not multi concent ins mode');
  }
  mccKey = key;
  const subBindTo = safeGet(multiCcContainer, key);
  innerBindCcTo('', subBindTo);
}

function avoidMultiCcInSameScope() {
  let winCc = window.cc;
  if (multiCcContainer && multiCcContainer[mccKey]) {
    winCc = multiCcContainer[mccKey].cc;
  }
  if (!winCc) {
    return;
  }
  if (winCc.ccContext && winCc.ccContext.info) {
    const existedVersion = winCc.ccContext.info.version;
    const newVersion = ccContext.info.version;
    // webpack-dev-server模式下，有些引用了concent的插件或者中间件模块，如果和当前concent版本不一致的话，会保留另外一个concent在其包下
    // 路径如 node_modules/concent-middleware-web-devtool/node_modules/concent（注，在版本一致时，不会出现此问题）
    // 这样的就相当于隐形的实例化两个concent 上下文，这是不允许的
    if (existedVersion !== newVersion) {
      throw new Error(
        `concent ver conflict! cur[${existedVersion}]-new[${newVersion}], refresh browser or reinstall some concent-eco-lib`
      );
    }
  }
}

let binded = false;
// 微前端机构里，如果每个子应用都有自己的cc实例，允许用户绑定到mcc下，避免相互覆盖
const autoBind = () => {
  if (window) multiCcContainer = window.mcc;
  avoidMultiCcInSameScope();
  // 延迟绑定，等待用户调用 bindCcToWindow
  setTimeout(() => {
    if (!binded) {
      binded = true;
      bindCcToWindow('cc');
    }
  }, 2000);
};

if (window) {
  multiCcContainer = window.mcc;
  autoBind();
} else {
  // 防止某些在线IDE不能及时拿到window
  setTimeout(autoBind, 1000);
}

export default defaultExport;
