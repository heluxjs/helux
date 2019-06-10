"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.getCcContext = getCcContext;
exports["default"] = void 0;

var _constant = require("../support/constant");

var util = _interopRequireWildcard(require("../support/util"));

var _computedValue, _computedFn, _reducer;

var refs = {};

var setStateByModule = function setStateByModule(module, partialState) {
  Object.keys(partialState).forEach(function (key) {
    setStateByModuleAndKey(module, key, partialState[key]);
  });
};

var _getState = function getState(module) {
  var _state = ccContext.store._state;
  return _state[module];
};

var setStateByModuleAndKey = function setStateByModuleAndKey(module, key, value) {
  var moduleState = _getState(module);

  var moduleComputedFn = computed._computedFn[module];
  var watchFn = watch[module];
  var oldValue = moduleState[key];

  if (moduleComputedFn) {
    var fn = moduleComputedFn[key];

    if (fn) {
      var computedValue = fn(value, oldValue, moduleState);
      computed._computedValue[module][key] = computedValue;
    }
  }

  if (watchFn) {
    var _fn = watchFn[key];
    if (_fn) _fn(value, oldValue, moduleState); //fn(newValue, oldValue)
  }

  moduleState[key] = value;
};

var computed = {
  _computedValue: (_computedValue = {}, _computedValue[_constant.MODULE_GLOBAL] = {}, _computedValue[_constant.MODULE_DEFAULT] = {}, _computedValue[_constant.MODULE_CC] = {}, _computedValue),
  _computedFn: (_computedFn = {}, _computedFn[_constant.MODULE_GLOBAL] = {}, _computedFn[_constant.MODULE_DEFAULT] = {}, _computedFn[_constant.MODULE_CC] = {}, _computedFn),
  getRootComputedValue: function getRootComputedValue() {
    return computed._computedValue;
  },
  getRootComputedFn: function getRootComputedFn() {
    return computed._computedFn;
  }
};
var watch = {
  _watch: {},
  getRootWatch: function getRootWatch() {
    return watch._watch;
  },
  getModuleWatch: function getModuleWatch(module) {
    return watch._watch[module];
  }
};
var ccContext = {
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
  moduleSingleClass: {},
  moduleName_ccClassKeys_: {},
  // map from moduleName to sharedStateKeys
  moduleName_sharedStateKeys_: {},
  // map from moduleName to globalStateKeys
  moduleName_globalStateKeys_: {},
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_: {},
  //to let cc know which ccClass are watching globalStateKeys
  globalCcClassKeys: [],

  /**
    ccClassContext:{
      module,
      sharedStateKeys,
      globalStateKeys,
      connectedState:{},
      connectedComputed:{},
      ccKeys: [],
      stateToPropMapping: null,
      connectedModule:{}
    }
  */
  ccClassKey_ccClassContext_: {},
  // [globalKey]:${modules}, let cc know what modules are watching a same globalKey
  globalKey_toModules_: {},
  sharedToGlobalMapping: {},
  //  translate sharedToGlobalMapping object to another shape: {sharedKey: {globalMappingKey, fromModule}, ... }
  sharedKey_globalMappingKeyDescriptor_: {},
  // [globalKey]:${sharedKey}
  globalMappingKey_sharedKey_: {},
  // [globalKey]:${modules}, let cc know what modules are watching a same globalMappingKey
  globalMappingKey_toModules_: {},
  // let cc know a globalMappingKey is mapped from which module
  globalMappingKey_fromModule_: {},
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [],
  //  all global keys that exclude sharedToGlobalMapping keys
  pureGlobalStateKeys: [],
  //store里的setState行为会自动触发模块级别的computed、watch函数
  store: {
    appendState: function appendState(module, state) {
      var moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;
      var stateKeys = util.safeGetArrayFromObject(moduleName_stateKeys_, module);
      util.okeys(state).forEach(function (k) {
        if (!stateKeys.includes(k)) {
          stateKeys.push(k);
        }
      });
      ccContext.store.setState(module, state);
    },
    _state: {},
    getState: function getState(module) {
      if (module) return _getState(module);else return ccContext.store._state;
    },
    setState: function setState(module, partialSharedState) {
      setStateByModule(module, partialSharedState);
    },
    setStateByModuleAndKey: setStateByModuleAndKey,
    setGlobalState: function setGlobalState(partialGlobalState) {
      setStateByModule(_constant.MODULE_GLOBAL, partialGlobalState);
    },
    setGlobalStateByKey: function setGlobalStateByKey(key, value) {
      setStateByModuleAndKey(_constant.MODULE_GLOBAL, key, value);
    },
    getGlobalState: function getGlobalState() {
      return ccContext.store._state[_constant.MODULE_GLOBAL];
    },
    //对state直接赋值，cc启动的时候某些场景需要调用此函数
    initStateDangerously: function initStateDangerously(module, state) {
      ccContext.store._state[module] = state;
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[_constant.MODULE_GLOBAL] = {}, _reducer[_constant.MODULE_CC] = {}, _reducer),
    _reducerName_FullReducerNameList_: {}
  },
  computed: computed,
  watch: watch,
  refStore: {
    _state: {},
    setState: function setState(ccUniqueKey, partialStoredState) {
      var _state = ccContext.refStore._state;
      var fullStoredState = _state[ccUniqueKey];
      var mergedState = Object.assign({}, fullStoredState, partialStoredState);
      _state[ccUniqueKey] = mergedState;
    }
  },
  init: {
    _init: {}
  },
  ccKey_ref_: refs,
  //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
  event_handlers_: {},
  ccUniqueKey_handlerKeys_: {},
  // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
  // it is a ref that towards ccUniqueKeyEvent_handler_'s key
  // when component unmounted, it's handler will been removed
  handlerKey_handler_: {},
  ccKey_option_: {},
  refs: refs,
  info: {
    startupTime: Date.now(),
    version: '1.2.28',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'xenogear'
  },
  // fragment association
  fragmentNameCount: 0,
  fragmentFeature_classKey_: {},
  fragmentCcKeys: [],
  errorHandler: null,
  middlewares: [],
  plugins: []
};

if (window && !window.sss) {
  window.sss = ccContext.store._state;
}

function getCcContext() {
  return ccContext;
}

var lsLen = localStorage.length;
var _refStoreState = ccContext.refStore._state;

for (var i = 0; i < lsLen; i++) {
  var lsKey = localStorage.key(i);

  if (lsKey.startsWith('CCSS_')) {
    try {
      _refStoreState[lsKey.substr(5)] = JSON.parse(localStorage.getItem(lsKey));
    } catch (err) {
      console.error(err);
    }
  }
}

var _default = ccContext;
exports["default"] = _default;