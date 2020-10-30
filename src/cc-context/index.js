import moduleName_stateKeys_ from './statekeys-map';
import computed from './computed-map';
import watch from './watch-map';
import runtimeVar from './runtime-var';
import runtimeHandler from './runtime-handler';
import { waKey_uKeyMap_, waKey_staticUKeyMap_ } from './wakey-ukey-map';
import module_insCount_ from './modue-ins-count-map';
import lifecycle from './lifecycle';
import refs from './refs';
import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT, MODULE_VOID, CATE_MODULE, FN_CU, FN_WATCH } from '../support/constant';
import * as util from '../support/util';
import pickDepFns from '../core/base/pick-dep-fns';
import findDepFnsToExecute from '../core/base/find-dep-fns-to-execute';
import extractStateByKeys from '../core/state/extract-state-by-keys';

const { _computedValue } = computed;
const { okeys, extractChangedState } = util;
const getDispatcher = () => ccContext.permanentDispatcher;

const setStateByModule = (module, committedState, { ref = null, callInfo = {}, noSave = false } = {}) => {
  const moduleState = getState(module);
  const moduleComputedValue = _computedValue[module];

  const rootComputedDep = computed.getRootComputedDep();
  const curDepComputedFns = (committedState, isFirstCall) => pickDepFns(isFirstCall, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);

  const rootWatchDep = watch.getRootWatchDep();
  const curDepWatchFns = (committedState, isFirstCall) => pickDepFns(isFirstCall, CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState);

  const callerRef = ref || getDispatcher();
  const refModule = callerRef.module;
  const newState = Object.assign({}, moduleState, committedState);
  const deltaCommittedState = Object.assign({}, committedState);

  const { hasDelta: hasDeltaInCu } = findDepFnsToExecute(
    callerRef, module, refModule, moduleState, curDepComputedFns,
    deltaCommittedState, newState, deltaCommittedState, callInfo, false,
    FN_CU, CATE_MODULE, moduleComputedValue,
  );
  const { hasDelta: hasDeltaInWa } = findDepFnsToExecute(
    callerRef, module, refModule, moduleState, curDepWatchFns,
    deltaCommittedState, newState, deltaCommittedState, callInfo, false,
    FN_WATCH, CATE_MODULE, moduleComputedValue,
  );

  if (!noSave) {
    saveSharedState(module, deltaCommittedState);
  }

  return {
    hasDelta: hasDeltaInCu || hasDeltaInWa,
    deltaCommittedState,
  };
}

const saveSharedState = (module, toSave, needExtract = false) => {
  let target = toSave;
  if (needExtract) {
    const { partialState } = extractStateByKeys(toSave, moduleName_stateKeys_[module], true);
    target = partialState;
  }

  const moduleState = getState(module);
  const prevModuleState = getPrevState(module);
  incModuleVer(module);

  // 调用 extractChangedState 时会更新 moduleState
  return extractChangedState(moduleState, target, {
    prevStateContainer: prevModuleState,
    incStateVer: key => incStateVer(module, key),
  });
}

const getState = (module) => {
  return _state[module];
}

const getPrevState = (module) => {
  return _prevState[module];
}

const getModuleVer = function (module) {
  if (!module) return _moduleVer;
  return _moduleVer[module];
}

const incModuleVer = function (module, val = 1) {
  try {
    _moduleVer[module] += val
  } catch (err) {
    _moduleVer[module] = val;
  }
}

function replaceMV(mv){
  _moduleVer = mv;
}

const getStateVer = function (module) {
  if (!module) return _stateVer;
  return _stateVer[module];
}
const incStateVer = function (module, key) {
  _stateVer[module][key]++;
}
const getRootState = () => ({
  [MODULE_CC]: {},
  [MODULE_VOID]: {},
  [MODULE_GLOBAL]: {},
  [MODULE_DEFAULT]: {},
})


/** ccContext section */
const _state = getRootState();
const _prevState = getRootState();
// record state version, to let ref effect avoid endless execute
// 1 effect里的函数再次出发当前实例渲染，渲染完后检查prevModuleState curModuleState, 对应的key值还是不一样，又再次出发effect，造成死循环
// 2 确保引用型值是基于原有引用修改某个属性的值时，也能触发effect
const _stateVer = {};
// 优化before-render里无意义的merge mstate导致冗余的set（太多的set会导致 Maximum call stack size exceeded）
// https://codesandbox.io/s/happy-bird-rc1t7?file=/src/App.js concent below 2.4.18会触发
let _moduleVer = {};

const ccContext = {
  getDispatcher,
  isHotReloadMode: function () {
    if (ccContext.isHot) return true;
    return window && (window.webpackHotUpdate || util.isOnlineEditor());
  },
  runtimeVar,
  runtimeHandler,
  isHot: false,
  reComputed: true,
  isStartup: false,
  moduleName_stateFn_: {
  },
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_,
  // 记录模块是不是通过configure配置的
  moduleName_isConfigured_: {
  },
  /**
   * ccClassContext:{
   *   module,
   *   ccClassKey,
   *   // renderKey机制影响的类范围，默认只影响调用者所属的类，如果有别的类观察了同一个模块的某个key，这个类的实例是否触发渲染不受renderKey影响
   *   // 为 * 表示影响所有的类，即其他类实例都受renderKey机制影响。
   *   renderKeyClasses, 
   * }
  */
  ccClassKey_ccClassContext_: {
  },
  /**
   * globalStateKeys is maintained by cc automatically,
   * when user call cc.setGlobalState, or ccInstance.setGlobalState,
   * committedState will be checked strictly by cc with globalStateKeys,
   * committedState keys must been included in globalStateKeys
   */
  globalStateKeys: [
  ],
  // store里的setState行为会自动触发模块级别的computed、watch函数
  store: {
    appendState: function (module, state) {
      const stateKeys = util.safeGetArray(moduleName_stateKeys_, module);
      okeys(state).forEach(k => {
        if (!stateKeys.includes(k)) {
          stateKeys.push(k);
        }
      });
      ccContext.store.setState(module, state);
    },
    _state,
    _prevState,// 辅助effect逻辑用
    _stateVer,// 触发时，比较state版本，防止死循环
    getState: function (module) {
      if (module) return getState(module);
      else return _state;
    },
    getPrevState: function (module) {
      if (module) return getPrevState(module);
      else return _prevState;
    },
    getStateVer,
    getModuleVer,
    incModuleVer,
    replaceMV,
    setState: function (module, partialSharedState, options) {
      return setStateByModule(module, partialSharedState, options);
    },
    setGlobalState: function (partialGlobalState) {
      return setStateByModule(MODULE_GLOBAL, partialGlobalState);
    },
    saveSharedState,
    getGlobalState: function () {
      return _state[MODULE_GLOBAL];
    },
  },
  reducer: {
    _reducer: {
      [MODULE_GLOBAL]: {
      },
      [MODULE_CC]: {
      }
    },
    _caller: {},
    // _reducerRefCaller: {},//为实例准备的reducer caller
    _fnName_fullFnNames_: {},
    _module_fnNames_: {}
  },
  computed,
  watch,
  refStore: {
    _state: {},
    setState: function (ccUniqueKey, partialStoredState) {
      const _state = ccContext.refStore._state;
      const fullStoredState = _state[ccUniqueKey];
      const mergedState = Object.assign({}, fullStoredState, partialStoredState);
      _state[ccUniqueKey] = mergedState;
    },
  },
  lifecycle,
  ccUKey_ref_: refs,
  /**
   * key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
   */
  event_handlers_: {},
  ccUKey_handlerKeys_: {},
  /**
   * to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
   * it is a ref that towards ccUniqueKeyEvent_handler_'s key
   * when component unmounted, its handler will been removed
   */
  handlerKey_handler_: {},
  waKey_uKeyMap_,
  waKey_staticUKeyMap_,
  module_insCount_,
  refs,
  info: {
    packageLoadTime: Date.now(),
    firstStartupTime: '',
    latestStartupTime: '',
    version: '2.9.37',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'glaxy',
  },

  featureStr_classKey_: {},
  userClassKey_featureStr_: {},
  middlewares: [],
  plugins: [],
  pluginNameMap: {},
  permanentDispatcher: null,
  localStorage: null,
  recoverRefState: () => { },
  getModuleStateKeys: (m) => ccContext.moduleName_stateKeys_[m],
}

ccContext.recoverRefState = function () {
  const localStorage = ccContext.localStorage;
  if (!localStorage) return;

  const lsLen = localStorage.length;
  const _refStoreState = ccContext.refStore._state;
  try {
    for (let i = 0; i < lsLen; i++) {
      const lsKey = localStorage.key(i);
      if (!lsKey.startsWith('CCSS_')) return;
      _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
    }
  } catch (err) {
    console.error(err);
  }
}

export function getCcContext() {
  return ccContext;
}

export default ccContext;
