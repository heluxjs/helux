"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getCcContext = getCcContext;
exports["default"] = void 0;

var _constant = require("../support/constant");

var util = _interopRequireWildcard(require("../support/util"));

var _pickDepFns3 = _interopRequireDefault(require("../core/base/pick-dep-fns"));

var _computedValue2, _reducer;

var refs = {};

var setStateByModule = function setStateByModule(module, committedState, refCtx) {
  var moduleState = _getState(module);

  var prevModuleState = _getPrevState(module);

  var moduleComputedValue = _computedValue[module];
  var rootComputedDep = computed.getRootComputedDep();

  var _pickDepFns = (0, _pickDepFns3["default"])(false, _constant.CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState),
      cFns = _pickDepFns.pickedFns,
      setted = _pickDepFns.setted,
      changed = _pickDepFns.changed;

  var refModule = refCtx ? refCtx.module : null;
  var newState = Object.assign({}, moduleState, committedState);
  cFns.forEach(function (_ref) {
    var retKey = _ref.retKey,
        fn = _ref.fn,
        depKeys = _ref.depKeys;
    var fnCtx = {
      retKey: retKey,
      setted: setted,
      changed: changed,
      stateModule: module,
      refModule: refModule,
      oldState: moduleState,
      committedState: committedState,
      refCtx: refCtx
    };
    var fistDepKey = depKeys[0];
    var computedValue;

    if (depKeys.length === 1 && fistDepKey !== '*') {
      computedValue = fn(committedState[fistDepKey], moduleState[fistDepKey], fnCtx);
    } else {
      computedValue = fn(newState, moduleState, fnCtx);
    }

    moduleComputedValue[retKey] = computedValue;
  });
  var rootWatchDep = watch.getRootWatchDep();

  var _pickDepFns2 = (0, _pickDepFns3["default"])(false, _constant.CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState),
      wFns = _pickDepFns2.pickedFns,
      ws = _pickDepFns2.setted,
      wc = _pickDepFns2.changed;

  wFns.forEach(function (_ref2) {
    var retKey = _ref2.retKey,
        fn = _ref2.fn,
        depKeys = _ref2.depKeys;
    var fnCtx = {
      retKey: retKey,
      setted: ws,
      changed: wc,
      stateModule: module,
      refModule: refModule,
      oldState: moduleState,
      committedState: committedState,
      refCtx: refCtx
    };
    var firstDepKey = depKeys[0];

    if (depKeys.length === 1 && firstDepKey !== '*') {
      fn(committedState[firstDepKey], moduleState[firstDepKey], fnCtx);
    } else {
      fn(newState, moduleState, fnCtx);
    }
  });
  Object.keys(committedState).forEach(function (key) {
    /** setStateByModuleAndKey */
    prevModuleState[key] = moduleState[key]; // const fnCtx = { key, module, moduleState, committedState };

    moduleState[key] = committedState[key];
  });
};

var _getState = function getState(module) {
  return _state[module];
};

var _getPrevState = function getPrevState(module) {
  return _prevState[module];
};

var _computedValue = (_computedValue2 = {}, _computedValue2[_constant.MODULE_GLOBAL] = {}, _computedValue2[_constant.MODULE_DEFAULT] = {}, _computedValue2[_constant.MODULE_CC] = {}, _computedValue2);

var _computedDep = {};
var _computedRaw = {};
var computed = {
  _computedValue: _computedValue,
  _computedRaw: _computedRaw,
  _computedDep: _computedDep,
  getRootComputedValue: function getRootComputedValue() {
    return _computedValue;
  },
  getRootComputedDep: function getRootComputedDep() {
    return _computedDep;
  },
  getRootComputedRaw: function getRootComputedRaw() {
    return _computedRaw;
  }
};
/** watch section */

var _watchDep = {};
var _watchRaw = {};
var watch = {
  _watchRaw: _watchRaw,
  _watchDep: _watchDep,
  getRootWatchDep: function getRootWatchDep() {
    return _watchDep;
  },
  getRootWatchRaw: function getRootWatchRaw() {
    return _watchRaw;
  }
};

function hotReloadWarning(err) {
  var message = err.message || err;
  var st = 'color:green;border:1px solid green';
  console.log("%c error detected " + message + ", cc found app is maybe running in hot reload mode, so cc will silent this error...", st);
  console.log("%c but if this is not as your expectation ,maybe you can reload your whole app to avoid this error message", st);
}
/** ccContext section */


var _state = {};
var _prevState = {};
var ccContext = {
  isHotReloadMode: function isHotReloadMode() {
    if (ccContext.isHot) return true;
    var result = false;

    if (window) {
      console.log("%c[[isHotReloadMode]] window.name:" + window.name, 'color:green;border:1px solid green');

      if (window.webpackHotUpdate || window.name === 'previewFrame' //for stackblitz
      || window.__SANDBOX_DATA__ // for codesandbox
      || window.BrowserFS // for codesandbox
      ) {
          result = true;
        }
    }

    return result;
  },
  throwCcHmrError: function throwCcHmrError(err) {
    if (ccContext.isHotReloadMode()) {
      hotReloadWarning(err);
    } else throw err;
  },
  computedCompare: true,
  watchCompare: true,
  watchImmediate: false,
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
  // 映射好模块的状态所有key并缓存住，用于提高性能
  moduleName_stateKeys_: {},
  // 记录某个模块作为其他被哪些ccClass连接
  connectedModuleName_ccClassKeys_: {},

  /**
    ccClassContext:{
      module,
      ccClassKey,
      // renderKey机制影响的类范围，默认只影响调用者所属的类，如果有别的类观察了同一个模块的某个key，这个类的实例是否触发渲染不受renderKey影响
      // 为 * 表示影响所有的类，即其他类实例都受renderKey机制影响。
      renderKeyClasses, 
      originalWatchedKeys,
      watchedKeys,
      ccKeys: [],
      connectedState: {},
      connectedModuleKeyMapping: null,
      connectedModule:{},//记录当前cc类连接到了其他哪些模块
    }
  */
  ccClassKey_ccClassContext_: {},
  // globalStateKeys is maintained by cc automatically,
  // when user call cc.setGlobalState, or ccInstance.setGlobalState,
  // commit state will be checked strictly by cc with globalStateKeys,
  // all the keys of commit state must been included in globalStateKeys
  globalStateKeys: [],
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
    _state: _state,
    _prevState: _prevState,
    //辅助CcFragment defineEffect之用
    getState: function getState(module) {
      if (module) return _getState(module);else return _state;
    },
    getPrevState: function getPrevState(module) {
      if (module) return _getPrevState(module);else return _prevState;
    },
    setState: function setState(module, partialSharedState, refCtx) {
      setStateByModule(module, partialSharedState, refCtx);
    },
    setGlobalState: function setGlobalState(partialGlobalState) {
      setStateByModule(_constant.MODULE_GLOBAL, partialGlobalState);
    },
    getGlobalState: function getGlobalState() {
      return _state[_constant.MODULE_GLOBAL];
    },
    //对state直接赋值，cc启动的时候某些场景需要调用此函数
    initStateDangerously: function initStateDangerously(module, state) {
      _state[module] = state;
    }
  },
  reducer: {
    _reducer: (_reducer = {}, _reducer[_constant.MODULE_GLOBAL] = {}, _reducer[_constant.MODULE_CC] = {}, _reducer),
    _reducerCaller: {},
    _lazyReducerCaller: {},
    // _reducerRefCaller: {},//为实例准备的reducer caller
    // _lazyReducerRefCaller: {},//为实例准备的lazy reducer caller
    _reducerFnName_fullFnNames_: {},
    _reducerModule_fnNames_: {}
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
  ccUkey_ref_: refs,
  //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
  event_handlers_: {},
  ccUKey_handlerKeys_: {},
  // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
  // it is a ref that towards ccUniqueKeyEvent_handler_'s key
  // when component unmounted, it's handler will been removed
  handlerKey_handler_: {},
  renderKey_ccUkeys_: {},
  refs: refs,
  info: {
    startupTime: Date.now(),
    version: '1.5.45',
    author: 'fantasticsoul',
    emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
    tag: 'destiny'
  },
  // fragment association
  fragmentNameCount: 0,
  featureStr_classKey_: {},
  userClassKey_featureStr_: {},
  errorHandler: null,
  middlewares: [],
  plugins: []
};

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