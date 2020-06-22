"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.getCcContext = getCcContext;
exports["default"] = void 0;

var _statekeysMap = _interopRequireDefault(require("./statekeys-map"));

var _computedMap = _interopRequireDefault(require("./computed-map"));

var _watchMap = _interopRequireDefault(require("./watch-map"));

var _runtimeVar = _interopRequireDefault(require("./runtime-var"));

var _runtimeHandler = _interopRequireDefault(require("./runtime-handler"));

var _wakeyUkeyMap = require("./wakey-ukey-map");

var _refs = _interopRequireDefault(require("./refs"));

var _constant = require("../support/constant");

var util = _interopRequireWildcard(require("../support/util"));

var _pickDepFns = _interopRequireDefault(require("../core/base/pick-dep-fns"));

var _findDepFnsToExecute3 = _interopRequireDefault(require("../core/base/find-dep-fns-to-execute"));

var _extractStateByKeys2 = _interopRequireDefault(require("../core/state/extract-state-by-keys"));

var _reducer;

var _computedValue = _computedMap["default"]._computedValue;
var okeys = util.okeys,
    extractChangedState = util.extractChangedState;

var getDispatcher = function getDispatcher() {
  return ccContext.permanentDispatcher;
};

var setStateByModule = function setStateByModule(module, committedState, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$ref = _ref.ref,
      ref = _ref$ref === void 0 ? null : _ref$ref,
      _ref$callInfo = _ref.callInfo,
      callInfo = _ref$callInfo === void 0 ? {} : _ref$callInfo,
      _ref$noSave = _ref.noSave,
      noSave = _ref$noSave === void 0 ? false : _ref$noSave;

  var moduleState = _getState(module);

  var moduleComputedValue = _computedValue[module];

  var rootComputedDep = _computedMap["default"].getRootComputedDep();

  var curDepComputedFns = function curDepComputedFns(committedState, isFirstCall) {
    return (0, _pickDepFns["default"])(isFirstCall, _constant.CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);
  };

  var rootWatchDep = _watchMap["default"].getRootWatchDep();

  var curDepWatchFns = function curDepWatchFns(committedState, isFirstCall) {
    return (0, _pickDepFns["default"])(isFirstCall, _constant.CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState);
  };

  var callerRef = ref || getDispatcher();
  var refModule = callerRef.module;
  var newState = Object.assign({}, moduleState, committedState);
  var deltaCommittedState = Object.assign({}, committedState);

  var _findDepFnsToExecute = (0, _findDepFnsToExecute3["default"])(callerRef, module, refModule, moduleState, curDepComputedFns, deltaCommittedState, newState, deltaCommittedState, callInfo, false, 'computed', _constant.CATE_MODULE, moduleComputedValue),
      hasDeltaInCu = _findDepFnsToExecute.hasDelta;

  var _findDepFnsToExecute2 = (0, _findDepFnsToExecute3["default"])(callerRef, module, refModule, moduleState, curDepWatchFns, deltaCommittedState, newState, deltaCommittedState, callInfo, false, 'watch', _constant.CATE_MODULE, moduleComputedValue),
      hasDeltaInWa = _findDepFnsToExecute2.hasDelta;

  if (!noSave) {
    saveSharedState(module, deltaCommittedState);
  }

  return {
    hasDelta: hasDeltaInCu || hasDeltaInWa,
    deltaCommittedState: deltaCommittedState
  };
};

var saveSharedState = function saveSharedState(module, toSave, needExtract) {
  if (needExtract === void 0) {
    needExtract = false;
  }

  var target = toSave;

  if (needExtract) {
    var _extractStateByKeys = (0, _extractStateByKeys2["default"])(toSave, _statekeysMap["default"][module], true),
        partialState = _extractStateByKeys.partialState;

    target = partialState;
  }

  var moduleState = _getState(module);

  var prevModuleState = _getPrevState(module);

  incModuleVer(module);
  return extractChangedState(moduleState, target, {
    prevStateContainer: prevModuleState,
    incStateVer: function incStateVer(key) {
      return _incStateVer(module, key);
    }
  });
};

var _getState = function getState(module) {
  return _state[module];
};

var _getPrevState = function getPrevState(module) {
  return _prevState[module];
};

var getModuleVer = function getModuleVer(module) {
  if (!module) return _moduleVer;
  return _moduleVer[module];
};

var incModuleVer = function incModuleVer(module) {
  try {
    _moduleVer[module]++;
  } catch (err) {
    _moduleVer[module] = 1;
  }
};

var getStateVer = function getStateVer(module) {
  if (!module) return _stateVer;
  return _stateVer[module];
};

var _incStateVer = function _incStateVer(module, key) {
  _stateVer[module][key]++;
};

var getRootState = function getRootState() {
  var _ref2;

  return _ref2 = {}, _ref2[_constant.MODULE_CC] = {}, _ref2[_constant.MODULE_VOID] = {}, _ref2[_constant.MODULE_GLOBAL] = {}, _ref2[_constant.MODULE_DEFAULT] = {}, _ref2;
};
/** ccContext section */


var _state = getRootState();

var _prevState = getRootState(); // record state version, to let ref effect avoid endless execute
// 1 effect里的函数再次出发当前实例渲染，渲染完后检查prevModuleState curModuleState, 对应的key值还是不一样，又再次出发effect，造成死循环
// 2 确保引用型值是基于原有引用修改某个属性的值时，也能触发effect


var _stateVer = {}; // 优化before-render里无意义的merge mstate导致冗余的set（太多的set会导致 Maximum call stack size exceeded）
// https://codesandbox.io/s/happy-bird-rc1t7?file=/src/App.js concent below 2.4.18会触发

var _moduleVer = {};
var ccContext = {
  getDispatcher: getDispatcher,
  isHotReloadMode: function isHotReloadMode() {
    if (ccContext.isHot) return true;
    return window && (window.webpackHotUpdate || util.isOnlineEditor());
  },
  runtimeVar: _runtimeVar["default"],
  runtimeHandler: _runtimeHandler["default"],
  isHot: false,
  reComputed: true,
  isStartup: false,
  //  cc allow multi react class register to a module by default, but if want to control some module 
  //  to only allow register one react class, flag the module name as true in this option object
  //  example:  {fooModule: true, barModule:true}
  moduleSingleClass: {},
  moduleName_stateFn_: {},
  moduleName_ccClassKeys_: {},
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_: _statekeysMap["default"],
  // 记录模块是不是通过configure配置的
  moduleName_isConfigured_: {},

  /**
   * ccClassContext:{
   *   module,
   *   ccClassKey,
   *   // renderKey机制影响的类范围，默认只影响调用者所属的类，如果有别的类观察了同一个模块的某个key，这个类的实例是否触发渲染不受renderKey影响
   *   // 为 * 表示影响所有的类，即其他类实例都受renderKey机制影响。
   *   renderKeyClasses, 
   *   originalWatchedKeys,
   *   watchedKeys,
   *   ccKeys: [],
   *   connectedState: {},
   *   connectedModuleKeyMapping: null,
   *   connectedModule:{},//记录当前cc类连接到了其他哪些模块
   * }
  */
  ccClassKey_ccClassContext_: {},

  /**
   * globalStateKeys is maintained by cc automatically,
   * when user call cc.setGlobalState, or ccInstance.setGlobalState,
   * committedState will be checked strictly by cc with globalStateKeys,
   * committedState keys must been included in globalStateKeys
   */
  globalStateKeys: [],
  //store里的setState行为会自动触发模块级别的computed、watch函数
  store: {
    appendState: function appendState(module, state) {
      var stateKeys = util.safeGetArray(_statekeysMap["default"], module);
      okeys(state).forEach(function (k) {
        if (!stateKeys.includes(k)) {
          stateKeys.push(k);
        }
      });
      ccContext.store.setState(module, state);
    },
    _state: _state,
    _prevState: _prevState,
    //辅助effect逻辑用
    _stateVer: _stateVer,
    //触发时，比较state版本，防止死循环
    getState: function getState(module) {
      if (module) return _getState(module);else return _state;
    },
    getPrevState: function getPrevState(module) {
      if (module) return _getPrevState(module);else return _prevState;
    },
    getStateVer: getStateVer,
    getModuleVer: getModuleVer,
    setState: function setState(module, partialSharedState, options) {
      return setStateByModule(module, partialSharedState, options);
    },
    setGlobalState: function setGlobalState(partialGlobalState) {
      return setStateByModule(_constant.MODULE_GLOBAL, partialGlobalState);
    },
    saveSharedState: saveSharedState,
    getGlobalState: function getGlobalState() {
      return _state[_constant.MODULE_GLOBAL];
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[_constant.MODULE_GLOBAL] = {}, _reducer[_constant.MODULE_CC] = {}, _reducer),
    _caller: {},
    // _reducerRefCaller: {},//为实例准备的reducer caller
    _fnName_fullFnNames_: {},
    _module_fnNames_: {}
  },
  computed: _computedMap["default"],
  watch: _watchMap["default"],
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
  ccUKey_ref_: _refs["default"],

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
  waKey_uKeyMap_: _wakeyUkeyMap.waKey_uKeyMap_,
  waKey_staticUKeyMap_: _wakeyUkeyMap.waKey_staticUKeyMap_,
  refs: _refs["default"],
  info: {
    packageLoadTime: Date.now(),
    firstStartupTime: '',
    latestStartupTime: '',
    version: 'test-2.0.5',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'tina'
  },
  featureStr_classKey_: {},
  userClassKey_featureStr_: {},
  middlewares: [],
  plugins: [],
  pluginNameMap: {},
  permanentDispatcher: null,
  localStorage: null,
  recoverRefState: function recoverRefState() {}
};

ccContext.recoverRefState = function () {
  var localStorage = ccContext.localStorage;
  if (!localStorage) return;
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
};

function getCcContext() {
  return ccContext;
}

var _default = ccContext;
exports["default"] = _default;