import { MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT } from '../support/constant';
import * as util from '../support/util';

const refs = {};
const setStateByModule = (module, partialState) => {
  Object.keys(partialState).forEach(key => {
    setStateByModuleAndKey(module, key, partialState[key]);
  });
}

const getState = (module) => {
  const _state = ccContext.store._state;
  return _state[module];
}

const getPrevState = (module) => {
  const _prevState = ccContext.store._prevState;
  return _prevState[module];
}

const setStateByModuleAndKey = (module, key, value) => {
  const moduleState = getState(module);
  const prevModuleState = getPrevState(module);
  const moduleComputedFn = computed._computedFn[module];
  const watchFn = watch._watch[module];
  const oldValue = moduleState[key];
  prevModuleState[key] = oldValue;

  const keyDesc = { key, module, moduleState };
  if (moduleComputedFn) {
    const fn = moduleComputedFn[key];
    if (fn) {
      const computedValue = fn(value, oldValue, keyDesc);
      computed._computedValue[module][key] = computedValue;
    }
  }

  if (watchFn) {
    const fn = watchFn[key];
    if (fn) fn(value, oldValue, keyDesc);//fn(newValue, oldValue)
  }
  moduleState[key] = value;
}

const computed = {
  _computedValue: {
    [MODULE_GLOBAL]: {},
    [MODULE_DEFAULT]: {},
    [MODULE_CC]: {},
  },
  _computedFn: {
    [MODULE_GLOBAL]: {},
    [MODULE_DEFAULT]: {},
    [MODULE_CC]: {},
  },
  getRootComputedValue: () => computed._computedValue,
  getRootComputedFn: () => computed._computedFn,
};
const watch = {
  _watch: {},
  getRootWatch: () => watch._watch,
  getModuleWatch: module => watch._watch[module],
};

const ccContext = {
  isDebug: false,
  // if isStrict is true, every error will be throw out instead of console.error, 
  // but this may crash your app, make sure you have a nice error handling way,
  // like componentDidCatch in react 16.*
  isStrict: false,
  returnRootState: false,
  isCcAlreadyStartup: false,
  //  cc allow multi react class register to a module by default, but if want to control some module 
  //  to only allow register one react class, flag the module name as true in this option object
  //  example:  {fooModule: true, barModule:true}
  moduleSingleClass: {

  },
  moduleName_ccClassKeys_: {

  },
  // map from moduleName to sharedStateKeys
  moduleName_sharedStateKeys_: {

  },
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_: {

  },
  /**
    ccClassContext:{
      module,
      sharedStateKeys,
      connectedState:{},
      connectedComputed:{},
      ccKeys: [],
      stateToPropMapping: null,
      connectedModule:{}
    }
  */
  ccClassKey_ccClassContext_: {

  },
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [

  ],
  //  all global keys that exclude sharedToGlobalMapping keys
  pureGlobalStateKeys: [

  ],
  //store里的setState行为会自动触发模块级别的computed、watch函数
  store: {
    appendState: function (module, state) {
      const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;
      const stateKeys = util.safeGetArrayFromObject(moduleName_stateKeys_, module);
      util.okeys(state).forEach(k => {
        if (!stateKeys.includes(k)) {
          stateKeys.push(k);
        }
      });
      ccContext.store.setState(module, state);
    },
    _state: {
    },
    _prevState:{//辅助CcFragment defineEffect之用
    },
    getState: function (module) {
      if (module) return getState(module);
      else return ccContext.store._state;
    },
    getPrevState: function (module) {
      if (module) return getPrevState(module);
      else return ccContext.store._prevState;
    },
    setState: function (module, partialSharedState) {
      setStateByModule(module, partialSharedState);
    },
    setStateByModuleAndKey,
    setGlobalState: function (partialGlobalState) {
      setStateByModule(MODULE_GLOBAL, partialGlobalState);
    },
    setGlobalStateByKey: function (key, value) {
      setStateByModuleAndKey(MODULE_GLOBAL, key, value);
    },
    getGlobalState: function () {
      return ccContext.store._state[MODULE_GLOBAL];
    },
    //对state直接赋值，cc启动的时候某些场景需要调用此函数
    initStateDangerously: (module, state)=>{
      ccContext.store._state[module] = state;
    },
  },
  reducer: {
    _reducer: {
      [MODULE_GLOBAL]: {

      },
      [MODULE_CC]: {

      }
    },
    _reducerCaller:{
    },
    _lazyReducerCaller:{
    },
    _reducerName_FullReducerNameList_:{
    },
    _reducerModule_fnNames_:{

    }
  },
  computed,
  watch,
  refStore: {
    _state: {

    },
    setState: function (ccUniqueKey, partialStoredState) {
      const _state = ccContext.refStore._state;
      const fullStoredState = _state[ccUniqueKey];
      const mergedState = Object.assign({}, fullStoredState, partialStoredState);
      _state[ccUniqueKey] = mergedState;
    },
  },
  init:{
    _init:{}
  },
  ccKey_ref_: refs,
  //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
  event_handlers_: {

  },
  ccUniqueKey_handlerKeys_: {},
  // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
  // it is a ref that towards ccUniqueKeyEvent_handler_'s key
  // when component unmounted, it's handler will been removed
  handlerKey_handler_: {
  },
  ccKey_option_: {

  },
  refs,
  info: {
    startupTime: Date.now(),
    version: '1.38.0',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'xenogear',
  },
  // fragment association
  fragmentNameCount: 0,
  fragmentFeature_classKey_: {

  },
  fragmentCcKeys: [],
  errorHandler: null,
  middlewares: [],
  plugins:[],
}

if (window && !window.sss) {
  window.sss = ccContext.store._state;
}


export function getCcContext() {
  return ccContext;
}

const lsLen = localStorage.length;
const _refStoreState = ccContext.refStore._state;
for (var i = 0; i < lsLen; i++) {
  const lsKey = localStorage.key(i);
  if (lsKey.startsWith('CCSS_')) {
    try {
      _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
    } catch (err) {
      console.error(err);
    }
  }
}

export default ccContext;
