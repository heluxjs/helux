if (!this._assertThisInitialized) {
  this._assertThisInitialized = function (self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
}
if (!this._extends) {
  this._extends = function () {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
}
if (!this._inheritsLoose) {
  this._inheritsLoose = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); }
    subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }
}


(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/esm/assertThisInitialized'), require('@babel/runtime/helpers/esm/inheritsLoose'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/esm/assertThisInitialized', '@babel/runtime/helpers/esm/inheritsLoose', 'react', 'react-dom'], factory) :
  (factory((global.ReactControlCenter = {}),global._assertThisInitialized,global._inheritsLoose,global.React,global.ReactDOM));
}(this, (function (exports,_assertThisInitialized,_inheritsLoose,React,ReactDOM) { 'use strict';

  _assertThisInitialized = _assertThisInitialized && _assertThisInitialized.hasOwnProperty('default') ? _assertThisInitialized['default'] : _assertThisInitialized;
  _inheritsLoose = _inheritsLoose && _inheritsLoose.hasOwnProperty('default') ? _inheritsLoose['default'] : _inheritsLoose;
  var React__default = 'default' in React ? React['default'] : React;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

  var _ERR_MESSAGE;

  var MODULE_GLOBAL = '$$global';
  var MODULE_DEFAULT = '$$default';
  var MODULE_CC = '$$cc';
  var MODULE_CC_ROUTER = '$$CONCENT_ROUTER';
  var CC_FRAGMENT_PREFIX = '$$Fragment';
  var CC_DISPATCHER = '$$Dispatcher';
  var CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';
  var CURSOR_KEY = Symbol('__for_sync_param_cursor__');
  var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
  var MOCKE_KEY = Symbol('__for_mock_event__');
  var LAZY_KEY = Symbol('__lazy_handle_state__');
  var SIG_FN_START = 10;
  var SIG_FN_END = 11;
  var SIG_FN_QUIT = 12;
  var SIG_FN_ERR = 13; //  two kind of state extraction
  //    cc will use ccInstance's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1; //    cc will use one module's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;
  var EFFECT_AVAILABLE = 1;
  var EFFECT_STOPPED = 0;
  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_MODULE_STATE = 'setModuleState';
  var FORCE_UPDATE = 'forceUpdate';
  var INVOKE = 'invoke';
  var SYNC = 'sync';
  var ERR = {
    CC_ALREADY_STARTUP: 1000,
    CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
    CC_MODULE_NAME_DUPLICATE: 1002,
    CC_REGISTER_A_CC_CLASS: 1003,
    CC_MODULE_KEY_CC_FOUND: 1004,
    CC_MODULE_NAME_INVALID: 1005,
    CC_STORE_STATE_INVALID: 1006,
    CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1008,
    CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1009,
    CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1010,
    CC_MODULE_NOT_FOUND: 1012,
    CC_DISPATCH_STRING_INVALID: 1013,
    CC_DISPATCH_PARAM_INVALID: 1014,
    CC_NO_DISPATCHER_FOUND: 1015,
    CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION: 1016,
    CC_MODULE_NAME_HAS_NO_STATE: 1017,
    CC_CLASS_KEY_DUPLICATE: 1100,
    CC_CLASS_NOT_FOUND: 1101,
    CC_CLASS_STORE_MODULE_INVALID: 1102,
    CC_CLASS_REDUCER_MODULE_INVALID: 1104,
    CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE: 1106,
    CC_CLASS_STATE_TO_PROP_MAPPING_INVALID: 1107,
    CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED: 1108,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
    CC_CLASS_INSTANCE_OPTION_INVALID: 1201,
    CC_CLASS_INSTANCE_NOT_FOUND: 1202,
    CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1203,
    CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1204,
    CC_CLASS_INSTANCE_MORE_THAN_ONE: 1205,
    CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS: 1206,
    CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS: 1207,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY: 1300,
    CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT: 1301,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY: 1402,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT: 1403,
    CC_REDUCER_ACTION_TYPE_NAMING_INVALID: 1500,
    CC_REDUCER_ACTION_TYPE_DUPLICATE: 1501,
    CC_REDUCER_ACTION_TYPE_NO_MODULE: 1502,
    CC_REDUCER_NOT_A_FUNCTION: 1503,
    CC_REDUCER_MODULE_NAME_DUPLICATE: 1511 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'concent startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for concent,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'concent';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_MODULE_NAME_HAS_NO_STATE] = "there is no module state in the store for your input module name", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure the supplied ccClassKey been registered to concent!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);
  var constant = {
    MODULE_GLOBAL: MODULE_GLOBAL,
    MODULE_DEFAULT: MODULE_DEFAULT,
    MODULE_CC: MODULE_CC,
    ERR: ERR,
    ERR_MESSAGE: ERR_MESSAGE,
    STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
    STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE
  };

  var _cst = /*#__PURE__*/Object.freeze({
    MODULE_GLOBAL: MODULE_GLOBAL,
    MODULE_DEFAULT: MODULE_DEFAULT,
    MODULE_CC: MODULE_CC,
    MODULE_CC_ROUTER: MODULE_CC_ROUTER,
    CC_FRAGMENT_PREFIX: CC_FRAGMENT_PREFIX,
    CC_DISPATCHER: CC_DISPATCHER,
    CC_DISPATCHER_BOX: CC_DISPATCHER_BOX,
    CURSOR_KEY: CURSOR_KEY,
    CCSYNC_KEY: CCSYNC_KEY,
    MOCKE_KEY: MOCKE_KEY,
    LAZY_KEY: LAZY_KEY,
    SIG_FN_START: SIG_FN_START,
    SIG_FN_END: SIG_FN_END,
    SIG_FN_QUIT: SIG_FN_QUIT,
    SIG_FN_ERR: SIG_FN_ERR,
    STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
    STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
    EFFECT_AVAILABLE: EFFECT_AVAILABLE,
    EFFECT_STOPPED: EFFECT_STOPPED,
    DISPATCH: DISPATCH,
    SET_STATE: SET_STATE,
    SET_MODULE_STATE: SET_MODULE_STATE,
    FORCE_UPDATE: FORCE_UPDATE,
    INVOKE: INVOKE,
    SYNC: SYNC,
    ERR: ERR,
    ERR_MESSAGE: ERR_MESSAGE,
    default: constant
  });

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

  var _getPrevState = function getPrevState(module) {
    var _prevState = ccContext.store._prevState;
    return _prevState[module];
  };

  var setStateByModuleAndKey = function setStateByModuleAndKey(module, key, value) {
    var moduleState = _getState(module);

    var prevModuleState = _getPrevState(module);

    var moduleComputedFn = computed._computedFn[module];
    var watchFn = watch._watch[module];
    var oldValue = moduleState[key];
    prevModuleState[key] = oldValue;
    var keyDesc = {
      key: key,
      module: module,
      moduleState: moduleState
    };

    if (moduleComputedFn) {
      var fn = moduleComputedFn[key];

      if (fn) {
        var computedValue = fn(value, oldValue, keyDesc);
        computed._computedValue[module][key] = computedValue;
      }
    }

    if (watchFn) {
      var _fn = watchFn[key];
      if (_fn) _fn(value, oldValue, keyDesc); //fn(newValue, oldValue)
    }

    moduleState[key] = value;
  };

  var computed = {
    _computedValue: (_computedValue = {}, _computedValue[MODULE_GLOBAL] = {}, _computedValue[MODULE_DEFAULT] = {}, _computedValue[MODULE_CC] = {}, _computedValue),
    _computedFn: (_computedFn = {}, _computedFn[MODULE_GLOBAL] = {}, _computedFn[MODULE_DEFAULT] = {}, _computedFn[MODULE_CC] = {}, _computedFn),
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
    // 映射好模块的状态所有key并缓存住，用于提高性能
    moduleName_stateKeys_: {},

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
    ccClassKey_ccClassContext_: {},
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
        var stateKeys = safeGetArrayFromObject(moduleName_stateKeys_, module);
        okeys(state).forEach(function (k) {
          if (!stateKeys.includes(k)) {
            stateKeys.push(k);
          }
        });
        ccContext.store.setState(module, state);
      },
      _state: {},
      _prevState: {//辅助CcFragment defineEffect之用
      },
      getState: function getState(module) {
        if (module) return _getState(module);else return ccContext.store._state;
      },
      getPrevState: function getPrevState(module) {
        if (module) return _getPrevState(module);else return ccContext.store._prevState;
      },
      setState: function setState(module, partialSharedState) {
        setStateByModule(module, partialSharedState);
      },
      setStateByModuleAndKey: setStateByModuleAndKey,
      setGlobalState: function setGlobalState(partialGlobalState) {
        setStateByModule(MODULE_GLOBAL, partialGlobalState);
      },
      setGlobalStateByKey: function setGlobalStateByKey(key, value) {
        setStateByModuleAndKey(MODULE_GLOBAL, key, value);
      },
      getGlobalState: function getGlobalState() {
        return ccContext.store._state[MODULE_GLOBAL];
      },
      //对state直接赋值，cc启动的时候某些场景需要调用此函数
      initStateDangerously: function initStateDangerously(module, state) {
        ccContext.store._state[module] = state;
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer),
      _reducerCaller: {},
      _lazyReducerCaller: {},
      _reducerName_FullReducerNameList_: {},
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
      version: '1.4.2',
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
  bindToWindow('sss', ccContext.store._state);
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

  function isHotReloadMode() {
    if (ccContext.isHot) return true;
    var result = false;

    if (window) {
      console.log("%c[[isHotReloadMode]] window.name:" + window.name, 'color:green;border:1px solid green');

      if (window.webpackHotUpdate || window.name === 'previewFrame' //for stackblitz
      || window.__SANDBOX_DATA__ // for codesandbox
      ) {
          result = true;
        }
    }

    return result;
  }
  function bindThis(_this, methods) {
    methods.forEach(function (method) {
      return _this[method] = _this[method].bind(_this);
    });
  }
  function isValueNotNull(value) {
    return !(value === null || value === undefined);
  }
  function isObjectNotNull(object) {
    if (object === null || object === undefined) {
      return false;
    }

    if (Object.keys(object).length > 0) {
      return true;
    }

    return false;
  }
  function isPlainJsonObject(obj, canBeArray) {
    if (canBeArray === void 0) {
      canBeArray = false;
    }

    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        if (canBeArray) return true;else return false;
      }

      return true;
    } else {
      return false;
    }
  }
  function isPrefixedKeyValid(key) {
    var slashCount = key.split('').filter(function (v) {
      return v === '/';
    }).length;

    if (slashCount === 1) {
      return true;
    } else {
      return false;
    }
  }
  function isActionTypeValid(type) {
    if (typeof type !== 'string') {
      return false;
    } else {
      if (type.length === 0) return false;else return true;
    }
  }
  function makeError(code, extraMessage) {
    var message = '';
    if (typeof code === 'string') message = code;else {
      message = ERR_MESSAGE[code] || '';
    }
    if (extraMessage) message += extraMessage;
    if (!message) message = "undefined message for code:" + code;
    var error = new Error(message);
    error.code = code;
    return error;
  }
  function hotReloadWarning(err) {
    var message = err.message || err;
    var st = 'color:green;border:1px solid green';
    console.log("%c error detected " + message + ", cc found app is maybe running in hot reload mode, so cc will silent this error...", st);
    console.log("%c but if this is not as your expectation ,maybe you can reload your whole app to avoid this error message", st);
  }
  /**
   * these error may caused by hmr
   * @param {*} err 
   */

  function throwCcHmrError(err) {
    if (isHotReloadMode()) {
      hotReloadWarning(err);
    } else throw err;
  }
  /** make ccClassContext */

  function makeCcClassContext(module, ccClassKey, sharedStateKeys, originalSharedStateKeys) {
    return {
      module: module,
      ccClassKey: ccClassKey,
      originalSharedStateKeys: originalSharedStateKeys,
      sharedStateKeys: sharedStateKeys,
      ccKeys: [],
      connectedState: {},
      stateToPropMapping: null,
      connectedModule: {} //记录当前cc类连接到了其他哪些模块

    };
  } // !!! different ccClass enable own a same key

  function makeUniqueCcKey(ccClassKey, ccKey) {
    // return `${ccClassKey}/${ccKey}`;
    return ccClassKey + "$" + ccKey;
  }
  function makeHandlerKey(ccUniqueKey, eventName, identity) {
    return ccUniqueKey + "$" + eventName + "$" + identity;
  }
  function isModuleNameValid(moduleName) {
    return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
  }
  function isModuleNameCcLike(moduleName) {
    var name = moduleName.toLowerCase();
    return name === MODULE_CC;
  }
  function isModuleStateValid(state) {
    return isPlainJsonObject(state);
  }

  function isCcOptionValid(ccOption) {
    return isPlainJsonObject(ccOption);
  }
  function isCcActionValid(action) {
    var errMessage = '';

    if (!action) {
      errMessage = 'trying to dispatch an null action is meaningless!';
    } else {
      // const { type, payload } = action;
      var type = action.type;

      if (!isActionTypeValid(type)) {
        errMessage += 'action type must be string and length must LTE 1! ';
      } // if (!isPlainJsonObject(payload, true)) {
      //   errMessage += 'payload must be a plain json object! ';
      // }

    }

    return errMessage;
  }
  function disassembleActionType(namespacedActionType) {
    if (namespacedActionType.includes('/')) {
      var _namespacedActionType = namespacedActionType.split('/'),
          moduleName = _namespacedActionType[0],
          actionType = _namespacedActionType[1];

      return {
        moduleName: moduleName,
        actionType: actionType
      };
    } else {
      return {
        moduleName: MODULE_GLOBAL,
        actionType: namespacedActionType
      };
    }
  }
  function verboseInfo(info) {
    return " --verbose-info: " + info;
  }
  function ccClassDisplayName(className) {
    return "CC(" + className + ")";
  }
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  function verifyKeys(keys1, keys2) {
    var duplicate = false,
        notArray = false,
        keyElementNotString = false;
    if (!Array.isArray(keys1)) return {
      duplicate: duplicate,
      notArray: true,
      keyElementNotString: keyElementNotString
    };
    if (!Array.isArray(keys2)) return {
      duplicate: duplicate,
      notArray: true,
      keyElementNotString: keyElementNotString
    };
    var len1 = keys1.length;
    var len2 = keys2.length;

    outLoop: for (var i = 0; i < len1; i++) {
      var tmpKey = keys1[i];

      if (typeof tmpKey !== 'string') {
        keyElementNotString = true;
        break outLoop;
      }

      for (var j = 0; j < len2; j++) {
        var tmpKey2 = keys2[j];

        if (typeof tmpKey2 !== 'string') {
          keyElementNotString = true;
          break outLoop;
        }

        if (tmpKey2 === tmpKey) {
          duplicate = true;
          break outLoop;
        }
      }
    }

    return {
      duplicate: duplicate,
      notArray: notArray,
      keyElementNotString: keyElementNotString
    };
  }
  function color(color) {
    if (color === void 0) {
      color = 'green';
    }

    return "color:" + color + ";border:1px solid " + color;
  }
  function styleStr(str) {
    return "%c" + str;
  }
  function justWarning(err) {
    console.error(' ------------ CC WARNING ------------');
    if (err instanceof Error) console.error(err.message);else console.error(err);
  }
  function justTip(msg) {
    console.log(' ------------ CC TIP ------------');
    console.log("%c" + msg, 'color:green;border:1px solid green;');
  }
  function safeGetObjectFromObject(object, key) {
    var childrenObject = object[key];

    if (!childrenObject) {
      childrenObject = object[key] = {};
    }

    return childrenObject;
  }
  function safeGetArrayFromObject(object, key) {
    var childrenArray = object[key];

    if (!childrenArray) {
      childrenArray = object[key] = [];
    }

    return childrenArray;
  }
  function safeAssignObjectValue(assignTo, assignFrom) {
    Object.keys(assignFrom).forEach(function (key) {
      assignTo[key] = assignFrom[key];
    });
  }
  function isStateValid(state) {
    if (!state || !isPlainJsonObject(state)) {
      return false;
    } else {
      return true;
    }
  }
  function computeFeature(ccUniqueKey, state) {
    var stateKeys = Object.keys(state);
    var stateKeysStr = stateKeys.sort().join('|');
    return ccUniqueKey + "/" + stateKeysStr;
  }
  function randomNumber(lessThan) {
    if (lessThan === void 0) {
      lessThan = 52;
    }

    var seed = Math.random();
    return parseInt(seed * lessThan);
  }
  function clearObject(object, excludeKeys, reset) {
    if (excludeKeys === void 0) {
      excludeKeys = [];
    }

    if (Array.isArray(object)) object.length = 0;else Object.keys(object).forEach(function (key) {
      if (!excludeKeys.includes(key)) delete object[key];else {
        if (reset) object[key] = reset;
      }
    });
  }
  function okeys(obj) {
    return Object.keys(obj);
  }
  function flatObject(connectedState, alias, allowKeyDup) {
    if (allowKeyDup === void 0) {
      allowKeyDup = false;
    }

    var modules = okeys(connectedState);
    var fObj = {};
    modules.forEach(function (m) {
      var subObj = connectedState[m];
      var keys = okeys(subObj);
      keys.forEach(function (k) {
        var aliasKey = alias[m + "/" + k];

        if (fObj[k] != undefined) {
          //重复了，看看有没有别名
          if (aliasKey) {
            fObj[aliasKey] = subObj[k];
          } else {
            if (allowKeyDup === true) {
              fObj[k] = subObj[k]; //重写
            } else {
              throw "key[" + k + "] duplicate in module " + m;
            }
          }
        } else {
          if (aliasKey) {
            fObj[aliasKey] = subObj[k];
          } else {
            fObj[k] = subObj[k];
          }
        }
      });
    });
    return fObj;
  }
  function convertToStandardEvent(e) {
    var ret = null;

    if (e) {
      if (e.currentTarget && e.type) {
        ret = e;
      } else if (e.nativeEvent && e.target) {
        e.currentTarget = e.target;
        ret = e;
      }
    }

    return ret;
  } //防止有些在线IDE，绑定失败

  function bindToWindow(key, obj) {
    if (window) {
      window[key] = obj;
    } else {
      setTimeout(function () {
        if (window) window[key] = obj;
      }, 6000);
    }
  }
  var util = {
    clearObject: clearObject,
    makeError: makeError,
    throwCcHmrError: throwCcHmrError,
    hotReloadWarning: hotReloadWarning,
    isHotReloadMode: isHotReloadMode,
    makeCcClassContext: makeCcClassContext,
    makeUniqueCcKey: makeUniqueCcKey,
    makeHandlerKey: makeHandlerKey,
    isActionTypeValid: isActionTypeValid,
    isModuleNameValid: isModuleNameValid,
    isModuleNameCcLike: isModuleNameCcLike,
    isModuleStateValid: isModuleStateValid,
    isCcOptionValid: isCcOptionValid,
    isCcActionValid: isCcActionValid,
    isPrefixedKeyValid: isPrefixedKeyValid,
    isPlainJsonObject: isPlainJsonObject,
    isObjectNotNull: isObjectNotNull,
    isValueNotNull: isValueNotNull,
    isStateValid: isStateValid,
    disassembleActionType: disassembleActionType,
    verboseInfo: verboseInfo,
    bindThis: bindThis,
    ccClassDisplayName: ccClassDisplayName,
    clone: clone,
    verifyKeys: verifyKeys,
    color: color,
    styleStr: styleStr,
    justWarning: justWarning,
    justTip: justTip,
    safeGetObjectFromObject: safeGetObjectFromObject,
    safeGetArrayFromObject: safeGetArrayFromObject,
    safeAssignObjectValue: safeAssignObjectValue,
    computeFeature: computeFeature,
    randomNumber: randomNumber
  };

  /**
   * slice() reference.
   */

  var slice = Array.prototype.slice;

  /**
   * Expose `co`.
   */

  var co_1 = co['default'] = co.co = co;

  /**
   * Wrap the given generator `fn` into a
   * function that returns a promise.
   * This is a separate function so that
   * every `co()` call doesn't create a new,
   * unnecessary closure.
   *
   * @param {GeneratorFunction} fn
   * @return {Function}
   * @api public
   */

  co.wrap = function (fn) {
    createPromise.__generatorFunction__ = fn;
    return createPromise;
    function createPromise() {
      return co.call(this, fn.apply(this, arguments));
    }
  };

  /**
   * Execute the generator function or a generator
   * and return a promise.
   *
   * @param {Function} fn
   * @return {Promise}
   * @api public
   */

  function co(gen) {
    var ctx = this;
    var args = slice.call(arguments, 1);

    // we wrap everything in a promise to avoid promise chaining,
    // which leads to memory leak errors.
    // see https://github.com/tj/co/issues/180
    return new Promise(function(resolve, reject) {
      if (typeof gen === 'function') gen = gen.apply(ctx, args);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);

      onFulfilled();

      /**
       * @param {Mixed} res
       * @return {Promise}
       * @api private
       */

      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * @param {Error} err
       * @return {Promise}
       * @api private
       */

      function onRejected(err) {
        var ret;
        try {
          ret = gen.throw(err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }

      /**
       * Get the next value in the generator,
       * return a promise.
       *
       * @param {Object} ret
       * @return {Promise}
       * @api private
       */

      function next(ret) {
        if (ret.done) return resolve(ret.value);
        var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "' + String(ret.value) + '"'));
      }
    });
  }

  /**
   * Convert a `yield`ed value into a promise.
   *
   * @param {Mixed} obj
   * @return {Promise}
   * @api private
   */

  function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ('function' == typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }

  /**
   * Convert a thunk to a promise.
   *
   * @param {Function}
   * @return {Promise}
   * @api private
   */

  function thunkToPromise(fn) {
    var ctx = this;
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }

  /**
   * Convert an array of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Array} obj
   * @return {Promise}
   * @api private
   */

  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this));
  }

  /**
   * Convert an object of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Object} obj
   * @return {Promise}
   * @api private
   */

  function objectToPromise(obj){
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);
      else results[key] = obj[key];
    }
    return Promise.all(promises).then(function () {
      return results;
    });

    function defer(promise, key) {
      // predefine the key in the result
      results[key] = undefined;
      promises.push(promise.then(function (res) {
        results[key] = res;
      }));
    }
  }

  /**
   * Check if `obj` is a promise.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */

  function isPromise(obj) {
    return 'function' == typeof obj.then;
  }

  /**
   * Check if `obj` is a generator.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */

  function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
  }

  /**
   * Check if `obj` is a generator function.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */
  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }

  /**
   * Check for plain object.
   *
   * @param {Mixed} val
   * @return {Boolean}
   * @api private
   */

  function isObject(val) {
    return Object == val.constructor;
  }

  function extractStateByKeys (state, stateKeys, returnNullIfEmpty) {
    if (returnNullIfEmpty === void 0) {
      returnNullIfEmpty = false;
    }

    var partialState = {};

    if (!isStateValid(state) || !isObjectNotNull(state)) {
      return {
        partialState: returnNullIfEmpty ? null : partialState,
        isStateEmpty: true
      };
    }

    var isStateEmpty = true;
    stateKeys.forEach(function (key) {
      var value = state[key];

      if (value !== undefined) {
        partialState[key] = value;
        isStateEmpty = false;
      }
    });
    return {
      partialState: partialState,
      isStateEmpty: isStateEmpty
    };
  }

  var me = util.makeError,
      throwCcHmrError$1 = util.throwCcHmrError;
  function buildCcClassContext (ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, stateToPropMapping, connectedModuleNames, forCcFragment) {
    if (forCcFragment === void 0) {
      forCcFragment = false;
    }

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var _computedValue = ccContext.computed._computedValue;
    var ccClassContext = contextMap[ccClassKey];

    if (forCcFragment === true) {
      //对于CcFragment的调用，ccClassContext可能是已存在的，
      //因为cc根据CcFragment的connect参数计算ccClassKey
      //多个CcFragment实例的connect一样的话，会计算出同一个ccClassKey
      if (ccClassContext === undefined) {
        ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, originalSharedStateKeys);
      }
    } else {
      //对于register调用，ccClassContext一定是不存在的, 如果存在就报错
      if (ccClassContext !== undefined) {
        throwCcHmrError$1(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
      }

      ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, originalSharedStateKeys);
    }

    var connectedModule = {};
    var connectedComputed = {};

    if (stateToPropMapping) {
      var _state = ccContext.store._state;
      var connectedState = ccClassContext.connectedState; // const prefixedKeys = Object.keys(stateToPropMapping);
      // const len = prefixedKeys.length;
      // for (let i = 0; i < len; i++) {
      //   const prefixedKey = prefixedKeys[i];
      //   const [targetModule, targetStateKey] = prefixedKey.split('/');// prefixedKey : 'foo/f1'
      //   connectedModule[targetModule] = 1;
      //   const moduleState = _state[targetModule];
      //   connectedState[targetModule] = moduleState;
      //   // setConnectedState(connectedState, targetModule, targetStateKey, moduleState[targetStateKey]);
      //   if(!connectedComputed[targetModule]){//绑定_computedValue的引用到connectedComputed上
      //     connectedComputed[targetModule] = _computedValue[targetModule];
      //   }
      // }
      //直接赋值引用

      connectedModuleNames.forEach(function (m) {
        connectedState[m] = _state[m];
        connectedComputed[m] = _computedValue[m];
        connectedModule[m] = 1; //记录连接的模块
      });
      ccClassContext.stateToPropMapping = stateToPropMapping;
      ccClassContext.connectedModule = connectedModule;
      ccClassContext.connectedComputed = connectedComputed;
    }

    contextMap[ccClassKey] = ccClassContext;
  }

  var catchCcError = (function (err) {
    if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
  });

  var me$1 = util.makeError,
      vbi = util.verboseInfo;
  function mapModuleAndCcClassKeys (moduleName, ccClassKey) {
    var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        moduleSingleClass = ccContext.moduleSingleClass;
    var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    if (ccClassKeys.includes(ccClassKey)) {
      util.throwCcHmrError(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw me$1(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi("module " + moduleName + ", ccClassKey " + ccClassKey));
    } // to avoid ccClassKeys include duplicate key in hmr mode


    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
  }

  var me$2 = util.makeError,
      vbi$1 = util.verboseInfo,
      ss = util.styleStr,
      cl = util.color;
  var ccKey_insCount = {};

  function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
    function setRef() {
      ccContext.ccKey_ref_[ccUniqueKey] = ref;
      ccKeys.push(ccUniqueKey);
      ccContext.ccKey_option_[ccUniqueKey] = option;
    }

    incCcKeyInsCount(ccUniqueKey);

    if (delayMs) {
      setTimeout(setRef, delayMs);
    } else {
      setRef();
    }
  }

  function incCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 1;else ccKey_insCount[ccUniqueKey] += 1;
  }
  function decCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) ccKey_insCount[ccUniqueKey] = 0;else ccKey_insCount[ccUniqueKey] -= 1;
  }
  function getCcKeyInsCount(ccUniqueKey) {
    if (ccKey_insCount[ccUniqueKey] === undefined) return 0;else return ccKey_insCount[ccUniqueKey];
  }
  function setRef (ref, isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption, forCcFragment) {
    if (forCcFragment === void 0) {
      forCcFragment = false;
    }

    var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
    var ccKeys = classContext.ccKeys;

    if (ccContext.isDebug) {
      console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
    }

    if (!util.isCcOptionValid(ccOption)) {
      throw me$2(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$1("a standard default ccOption may like: {\"storedStateKeys\": []}"));
    }

    var isHot = util.isHotReloadMode();

    if (forCcFragment === true) {
      //因为CcFragment不强调类的概念，ccClassKey是自动生成的，所以对于标记了ccKey的CcFragment实例
      //通过fragmentCcKeys来排除有没有重复，如果这里通过classContext去查就是不对的，因为不同的classContext可以包含相同的ccKey
      var fragmentCcKeys = ccContext.fragmentCcKeys;

      if (fragmentCcKeys.includes(ccUniqueKey)) {
        //指定了ccKey的CcFragment，ccUniqueKey和ccKey是一样的
        throw me$2(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("<CcFragment ccKey=\"" + ccKey + "\" />")); // if(isHot){
        //   util.justWarning(`cc found you supply a duplicate ccKey:${ccKey} to CcFragment, but now cc is running in hot reload mode, so if this message is wrong, you can ignore it.`);
        // }else{
        //   throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`<CcFragment ccKey="${ccKey}" />`));
        // }
      } else {
        fragmentCcKeys.push(ccUniqueKey);
      }
    }

    if (ccKeys.includes(ccUniqueKey)) {
      if (isHot) {
        var insCount = getCcKeyInsCount(ccUniqueKey);
        if (isSingle && insCount > 1) throw me$2(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi$1("ccClass:" + ccClassKey));

        if (insCount > 2) {
          // now cc can make sure the ccKey duplicate
          throw me$2(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
        } // just warning


        util.justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
        // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
        // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
        // so cc set ref later

        setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption, 600);
      } else {
        throw me$2(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
      }
    } else {
      setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption);
    }

    return classContext;
  }

  var ccKey_ref_ = ccContext.ccKey_ref_,
      ccKey_option_ = ccContext.ccKey_option_,
      ccUniqueKey_handlerKeys_ = ccContext.ccUniqueKey_handlerKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      handlerKey_handler_ = ccContext.handlerKey_handler_,
      fragmentCcKeys = ccContext.fragmentCcKeys;
  function unsetRef (ccClassKey, ccUniqueKey) {
    if (ccContext.isDebug) {
      console.log(styleStr(ccUniqueKey + " unset ref"), color('purple'));
    }

    var fIndex = fragmentCcKeys.indexOf(ccUniqueKey);

    if (fIndex >= 0) {
      fragmentCcKeys.splice(fIndex, 1);
    } // ccContext.ccKey_ref_[ccUniqueKey] = null;


    delete ccKey_ref_[ccUniqueKey];
    delete ccKey_option_[ccUniqueKey];
    var classContext = ccClassKey_ccClassContext_[ccClassKey];
    var ccKeys = classContext.ccKeys;
    var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
    if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
    decCcKeyInsCount(ccUniqueKey);
    var handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];

    if (handlerKeys) {
      handlerKeys.forEach(function (hKey) {
        delete handlerKey_handler_[hKey]; // ccUniqueKey maybe generated randomly, so delete the key instead of set null
        // handlerKey_handler_[hKey] = null;
      });
    }
  }

  var _currentIndex = 0;
  var letters = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];

  function genNonceStr(length) {
    if (length === void 0) {
      length = 6;
    }

    var ret = '';

    for (var i = 0; i < length; i++) {
      ret += letters[randomNumber()];
    }

    return ret;
  }

  function uuid (forFragment) {
    if (forFragment === void 0) {
      forFragment = false;
    }

    var prefix = forFragment === true ? 'CCF' : 'CC';
    _currentIndex++;
    var nonceStr = genNonceStr();
    return prefix + "_" + Date.now() + "_" + nonceStr + "_" + _currentIndex;
  }

  function computeCcUniqueKey (isClassSingle, ccClassKey, ccKey, forFragment) {
    if (forFragment === void 0) {
      forFragment = false;
    }

    var ccUniqueKey;
    var isCcUniqueKeyAutoGenerated = false;
    var newCcKey = ccKey;

    if (isClassSingle) {
      if (ccKey) util.justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey:" + ccKey);
      ccUniqueKey = ccClassKey;
      newCcKey = ccClassKey;
    } else {
      if (ccKey) {
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      } else {
        // const uuidStr = uuid().replace(/-/g, '_');
        var uuidStr = uuid(forFragment);
        newCcKey = uuidStr;
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
        isCcUniqueKeyAutoGenerated = true;
      }
    }

    return {
      ccKey: newCcKey,
      ccUniqueKey: ccUniqueKey,
      isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated
    };
  }

  var buildMockEvent = (function (spec, e) {
    var _ref;

    var ccint = false,
        ccsync = '',
        ccidt = '',
        value = '',
        ccdelay = -1,
        isToggleBool = false;
    var specSyncKey = spec[CCSYNC_KEY];
    var type = spec.type;

    if (specSyncKey !== undefined) {
      //来自生成的sync生成的setter函数调用
      ccsync = specSyncKey;
      ccdelay = spec.delay;
      ccidt = spec.idt;

      if (type === 'val' || type === 'int') {
        //set value
        ccint = type === 'int'; //convert to int
        //优先从spec里取，取不到的话，从e里面分析并提取

        var val = spec.val;

        if (val === undefined) {
          var se = convertToStandardEvent(e);

          if (se) {
            value = se.currentTarget.value;
          } else {
            value = e;
          }
        } else {
          value = val;
        }
      } else if (type === 'bool') {
        //toggle bool
        isToggleBool = true;
      } else return null;
    } else {
      //来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
      var _se = convertToStandardEvent(e);

      if (_se) {
        // e is event
        var currentTarget = _se.currentTarget;
        value = currentTarget.value;
        var dataset = currentTarget.dataset;
        if (type === 'int') ccint = true;else ccint = dataset.ccint != undefined;
        ccsync = dataset.ccsync;
        if (!ccsync) return null;
        ccidt = dataset.ccidt;
        var dataSetDelay = dataset.ccdelay;

        if (dataSetDelay) {
          try {
            ccdelay = parseInt(dataSetDelay);
          } catch (err) {}
        }
      } else {
        //<Input onChange={this.sync}/> is invalid
        return null;
      }
    }

    return _ref = {}, _ref[MOCKE_KEY] = 1, _ref.currentTarget = {
      value: value,
      dataset: {
        ccsync: ccsync,
        ccint: ccint,
        ccdelay: ccdelay,
        ccidt: ccidt
      }
    }, _ref.isToggleBool = isToggleBool, _ref;
  });

  var _state = ccContext.store._state;
  /**
   * 根据connect参数算出ccClassKey值和stateToPropMapping值
   */

  function getFeatureStrAndStpMapping(connectSpec, fragmentModule) {
    if (!util.isPlainJsonObject(connectSpec)) {
      throw new Error("CcFragment or CcClass's prop connect type error, it is not a plain json object");
    }

    var invalidConnect = "CcFragment or CcClass's prop connect is invalid,";

    var invalidConnectItem = function invalidConnectItem(m) {
      return invalidConnect + " module[" + m + "]'s value must be * or array of string";
    };

    var moduleNames = Object.keys(connectSpec);
    moduleNames.sort();
    var featureStrs = [];
    var stateToPropMapping = {};
    moduleNames.forEach(function (m) {
      var moduleState = _state[m];
      var feature = m + "/";

      if (moduleState === undefined) {
        throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
      }

      var val = connectSpec[m];

      if (typeof val === 'string') {
        if (val !== '*') throw new Error(invalidConnectItem(m));else {
          featureStrs.push(feature + "*");
          okeys(moduleState).forEach(function (sKey) {
            return stateToPropMapping[m + "/" + sKey] = sKey;
          });
        }
      } else if (!Array.isArray(val)) {
        throw new Error(invalidConnectItem(m));
      } else {
        val.forEach(function (sKey) {
          if (!moduleState.hasOwnProperty(sKey)) {
            throw new Error(invalidConnect + " module[" + m + "]'s key[" + sKey + "] not declared in cc store ");
          } else {
            feature += sKey + ",";
            stateToPropMapping[m + "/" + sKey] = sKey;
          }
        });
        featureStrs.push(feature);
      }
    });
    return {
      featureStr: fragmentModule + '/' + featureStrs.join('|'),
      stateToPropMapping: stateToPropMapping,
      connectedModuleNames: moduleNames
    };
  }

  function setValue(obj, keys, lastKeyIndex, keyIndex, value, isToggleBool) {
    if (isToggleBool === void 0) {
      isToggleBool = false;
    }

    var key = keys[keyIndex];

    if (lastKeyIndex === keyIndex) {
      if (isToggleBool === true) {
        var oriVal = obj[key];

        if (typeof oriVal !== 'boolean') {
          justWarning("key[" + key + "]'s value type is not boolean");
        } else {
          obj[key] = !oriVal;
        }
      } else {
        obj[key] = value;
      }
    } else {
      setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value, isToggleBool);
    }
  }

  var extractStateByCcsync = (function (ccsync, value, ccint, oriState, isToggleBool) {
    var _value = value;

    if (ccint === true) {
      _value = parseInt(value); //strict?

      if (Number.isNaN(_value)) {
        justWarning(value + " can not convert to int but you set ccint as true!\uFF01");
        _value = value;
      }
    }

    var module = null,
        keys = [];

    if (ccsync.includes('/')) {
      var _ccsync$split = ccsync.split('/'),
          _module = _ccsync$split[0],
          restStr = _ccsync$split[1];

      module = _module;

      if (restStr.includes('.')) {
        keys = restStr.split('.');
      } else {
        keys = [restStr];
      }
    } else if (ccsync.includes('.')) {
      keys = ccsync.split('.');
    } else {
      keys = [ccsync];
    }

    if (keys.length == 1) {
      var targetStateKey = keys[0];

      if (isToggleBool === true) {
        var _state;

        return {
          module: module,
          state: (_state = {}, _state[targetStateKey] = !oriState[targetStateKey], _state)
        };
      } else {
        var _state2;

        return {
          module: module,
          state: (_state2 = {}, _state2[targetStateKey] = _value, _state2)
        };
      }
    } else {
      var _state3;

      var _keys = keys,
          key = _keys[0],
          restKeys = _keys.slice(1);

      var subState = oriState[key];
      setValue(subState, restKeys, restKeys.length - 1, 0, _value, isToggleBool);
      return {
        module: module,
        state: (_state3 = {}, _state3[key] = subState, _state3)
      };
    }
  });

  var id = 0;
  var chainId_moduleStateMap_ = {};
  var chainId_isExited_ = {};
  var chainId_isLazy_ = {};
  function getChainId() {
    id++;
    return id;
  }
  function setChainState(chainId, targetModule, partialState) {
    if (partialState) {
      var moduleStateMap = chainId_moduleStateMap_[chainId];
      if (!moduleStateMap) moduleStateMap = chainId_moduleStateMap_[chainId] = {};
      var state = moduleStateMap[targetModule];

      if (!state) {
        moduleStateMap[targetModule] = partialState;
      } else {
        var mergedState = Object.assign(state, partialState);
        moduleStateMap[targetModule] = mergedState;
      }
    }
  }
  function setAndGetChainStateList(chainId, targetModule, partialState) {
    setChainState(chainId, targetModule, partialState);
    return getChainStateList(chainId);
  }
  function getChainStateList(chainId) {
    var moduleStateMap = chainId_moduleStateMap_[chainId];
    var list = [];
    okeys(moduleStateMap).forEach(function (m) {
      list.push({
        module: m,
        state: moduleStateMap[m]
      });
    });
    return list;
  }
  function removeChainState(chainId) {
    delete chainId_moduleStateMap_[chainId];
  }
  function isChainExited(chainId) {
    return chainId_isExited_[chainId] === true;
  }
  function setChainIdLazy(chainId) {
    chainId_isLazy_[chainId] = true;
  }
  function isChainIdLazy(chainId) {
    return chainId_isLazy_[chainId] === true;
  }

  function send(sig, payload) {
    var plugins = ccContext.plugins;
    plugins.forEach(function (p) {
      if (p.receive) p.receive(sig, payload);
    });
  }

  var isModuleNameCcLike$1 = isModuleNameCcLike,
      isModuleNameValid$1 = isModuleNameValid,
      vbi$2 = verboseInfo,
      makeError$1 = makeError;
  /** 检查模块名，名字合法，就算检查通过 */

  function checkModuleNameBasically(moduleName) {
    if (!isModuleNameValid$1(moduleName)) {
      throw makeError$1(ERR.CC_MODULE_NAME_INVALID, vbi$2(" module[" + moduleName + "] is invalid!"));
    }

    if (isModuleNameCcLike$1(moduleName)) {
      throw makeError$1(ERR.CC_MODULE_KEY_CC_FOUND);
    }
  }
  function checkReducerModuleName(moduleName) {
    var _reducer = ccContext.reducer._reducer;
    checkModuleNameBasically(moduleName);

    if (moduleName !== MODULE_GLOBAL) {
      if (_reducer[moduleName]) {
        throw makeError$1(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, vbi$2("module[" + moduleName + "]"));
      }
    }
  }
  /**
   * 检查模块名, moduleStateMustNotDefinedInStore 默认为true，表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
   * 如果设置为false，表示【module名字合法】且【对应的moduleState存在】，才算检查通过
   * @param {string} moduleName 
   * @param {boolean} moduleStateMustNotDefinedInStore 
   */

  function checkModuleName(moduleName, moduleStateMustNotDefinedInStore, vbiMsg) {
    if (moduleStateMustNotDefinedInStore === void 0) {
      moduleStateMustNotDefinedInStore = true;
    }

    if (vbiMsg === void 0) {
      vbiMsg = '';
    }

    var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

    var _state = ccContext.store._state;
    checkModuleNameBasically(moduleName);

    if (moduleName !== MODULE_GLOBAL) {
      if (moduleStateMustNotDefinedInStore === true) {
        //要求模块状态应该不存在
        if (isObjectNotNull(_state[moduleName])) {
          //但是却存在了
          throw makeError$1(ERR.CC_MODULE_NAME_DUPLICATE, vbi$2(_vbiMsg));
        }
      } else {
        //要求模块状态应该存在
        if (!_state[moduleName]) {
          //实际上却不存在
          throw makeError$1(ERR.CC_MODULE_NAME_HAS_NO_STATE, vbi$2(_vbiMsg));
        }
      }
    }
  }
  function checkModuleState(moduleState, moduleName) {
    if (!isModuleStateValid(moduleState)) {
      throw makeError(ERR.CC_STORE_STATE_INVALID, vbi$2("module[" + moduleName + "]'s state is invalid!"));
    }
  }
  function checkModuleNameAndState(moduleName, moduleState) {
    checkModuleName(moduleName);
    checkModuleState(moduleState, moduleName);
  }
  function checkModuleNameBasicallyAndState(moduleName, moduleState) {
    checkModuleName(moduleName);
    checkModuleState(moduleState, moduleName);
  }

  var event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_$1 = ccContext.handlerKey_handler_,
      ccUniqueKey_handlerKeys_$1 = ccContext.ccUniqueKey_handlerKeys_,
      ccKey_ref_$1 = ccContext.ccKey_ref_;

  function _findEventHandlers(event, module, ccClassKey, identity) {
    if (identity === void 0) {
      identity = null;
    }

    var handlers = event_handlers_[event];

    if (handlers) {
      var filteredHandlers;
      if (ccClassKey) filteredHandlers = handlers.filter(function (v) {
        return v.ccClassKey === ccClassKey;
      });else if (module) filteredHandlers = handlers.filter(function (v) {
        return v.module === module;
      });else filteredHandlers = handlers; // identity is null means user call emit or emitIdentity which set identity as null
      // identity is not null means user call emitIdentity

      filteredHandlers = filteredHandlers.filter(function (v) {
        return v.identity === identity;
      });
      return filteredHandlers;
    } else {
      return [];
    }
  }

  function _deleteEventHandlers(handlers) {
    var toDeleteCcUniqueKeyMap = {};
    var toDeleteEventNames = [];
    handlers.forEach(function (item) {
      var handlerKey = item.handlerKey,
          ccUniqueKey = item.ccUniqueKey,
          event = item.event;
      delete handlerKey_handler_$1[handlerKey]; //delete mapping of handlerKey_handler_;
      toDeleteCcUniqueKeyMap[ccUniqueKey] = 1;
      if (!toDeleteEventNames.includes(event)) toDeleteEventNames.push(event);
    });
    toDeleteEventNames.forEach(function (event) {
      var eHandlers = event_handlers_[event];

      if (eHandlers) {
        eHandlers.forEach(function (h, idx) {
          var ccUniqueKey = h.ccUniqueKey;

          if (toDeleteCcUniqueKeyMap[ccUniqueKey] === 1) {
            eHandlers[idx] = null;
            delete ccUniqueKey_handlerKeys_$1[ccUniqueKey]; //delete mapping of ccUniqueKey_handlerKeys_;
          }
        });
        event_handlers_[event] = eHandlers.filter(function (v) {
          return v !== null;
        }); //delete event_handlers_
      }
    });
  }

  function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
    var handlers = util.safeGetArrayFromObject(event_handlers_, event);

    if (typeof handler !== 'function') {
      return util.justWarning("event " + event + "'s handler is not a function!");
    }

    var targetHandlerIndex = handlers.findIndex(function (v) {
      return v.ccUniqueKey === ccUniqueKey && v.identity === identity;
    });
    var handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_$1, ccUniqueKey);
    var handlerKey = util.makeHandlerKey(ccUniqueKey, event, identity); //  that means the component of ccUniqueKey mounted again 
    //  or user call $$on for a same event in a same instance more than once

    var handlerItem = {
      event: event,
      module: module,
      ccClassKey: ccClassKey,
      ccUniqueKey: ccUniqueKey,
      identity: identity,
      handlerKey: handlerKey,
      fn: handler
    };

    if (targetHandlerIndex > -1) {
      //  cc will alway use the latest handler
      handlers[targetHandlerIndex] = handlerItem;
    } else {
      handlers.push(handlerItem);
      handlerKeys.push(handlerKey);
    }

    handlerKey_handler_$1[handlerKey] = handlerItem;
  }
  function findEventHandlersToPerform(event, _ref) {
    var module = _ref.module,
        ccClassKey = _ref.ccClassKey,
        identity = _ref.identity;

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var handlers = _findEventHandlers(event, module, ccClassKey, identity);

    handlers.forEach(function (_ref2) {
      var ccUniqueKey = _ref2.ccUniqueKey,
          handlerKey = _ref2.handlerKey;

      if (ccKey_ref_$1[ccUniqueKey] && handlerKey) {
        //  confirm the instance is mounted and handler is not been offed
        var handler = handlerKey_handler_$1[handlerKey];
        if (handler) handler.fn.apply(handler, args);
      }
    });
  }
  function findEventHandlersToOff(event, _ref3) {
    var module = _ref3.module,
        ccClassKey = _ref3.ccClassKey,
        identity = _ref3.identity;

    var handlers = _findEventHandlers(event, module, ccClassKey, identity);

    _deleteEventHandlers(handlers);
  }
  function offEventHandlersByCcUniqueKey(ccUniqueKey) {
    var handlerKeys = ccUniqueKey_handlerKeys_$1[ccUniqueKey];

    if (handlerKeys) {
      var toDeleteHandlers = [];
      handlerKeys.forEach(function (k) {
        return toDeleteHandlers.push(handlerKey_handler_$1[k]);
      });

      _deleteEventHandlers(toDeleteHandlers);
    }
  }

  var ev = /*#__PURE__*/Object.freeze({
    bindEventHandlerToCcContext: bindEventHandlerToCcContext,
    findEventHandlersToPerform: findEventHandlersToPerform,
    findEventHandlersToOff: findEventHandlersToOff,
    offEventHandlersByCcUniqueKey: offEventHandlersByCcUniqueKey
  });

  function shouldSkipKey (specModule, key, stateModule, connectSpecLike, moduleStateKeys, ctx) {
    var skip = false;
    var keyModule = '';
    var stateKey = key;

    if (key.includes('/')) {
      // moduledKey : 'foo/f1'
      var _key$split = key.split('/'),
          tmpKeyModule = _key$split[0],
          unmoduledKey = _key$split[1];

      if (tmpKeyModule === '') {
        // '/f1'，观察实例所属模块的key
        tmpKeyModule = specModule;
        stateKey = specModule + key;
      }

      keyModule = tmpKeyModule; //这个key的模块不是提交state所属的模块， 对应的watch就需要排除掉
      //因为setState只提交自己模块的数据，所以如果tmpKeyModule是其他模块，这里并不会被触发
      //dispatch调用如果指定了其他模块，是会触发这里的逻辑的

      if (keyModule !== stateModule) {
        skip = true;
      } else if (!connectSpecLike[stateModule]) {
        //key的模块没有在connect里定义过
        //??? need strict
        skip = true;
      } else if (!moduleStateKeys.includes(unmoduledKey)) {
        //??? need strict
        justWarning("moduled key[" + key + "] is invalid");
        skip = true;
      } else {
        stateKey = unmoduledKey;
      }
    }

    return {
      skip: skip,
      stateKey: stateKey,
      keyModule: keyModule
    };
  }

  var getState = ccContext.store.getState;
  var moduleName_stateKeys_ = ccContext.moduleName_stateKeys_; //CcFragment实例调用会提供ctx

  function computeValueForRef (stateModule, computedSpec, refComputed, refConnectedComputed, oldState, commitState, ctx) {
    if (computedSpec) {
      var moduleStateKeys = moduleName_stateKeys_[stateModule];
      var computedFns = computedSpec.computedFns,
          computedSpecModule = computedSpec.module;
      var toBeComputedKeys = okeys(computedFns);
      toBeComputedKeys.forEach(function (key) {
        var _shouldSkipKey = shouldSkipKey(computedSpecModule, key, stateModule, refConnectedComputed, moduleStateKeys, ctx),
            stateKey = _shouldSkipKey.stateKey,
            skip = _shouldSkipKey.skip,
            keyModule = _shouldSkipKey.keyModule;

        if (skip) return;
        var newValue = commitState[stateKey];

        if (newValue !== undefined) {
          var fn = computedFns[key]; //用原始定义当然key去取fn

          var targetModule = keyModule || stateModule;
          var moduleState = getState(targetModule);
          var keyDesc = {
            key: stateKey,
            module: targetModule,
            moduleState: moduleState
          };
          var computedValue = fn(newValue, oldState[stateKey], keyDesc, ctx);

          if (keyModule) {
            refConnectedComputed[keyModule][stateKey] = computedValue;
          } else {
            refComputed[stateKey] = computedValue;
          }
        }
      });
    }
  }

  function getWatchSpec (watch, ctx, module) {
    var watchFns;
    var watchType = typeof watch;
    if (watchType === 'function') watchFns = watch(ctx);else if (watchType === 'object' && !Array.isArray(watch)) watchFns = watch;else throw new Error('watch type can only be a function or a plain json object');
    return {
      watchFns: watchFns,
      module: module
    };
  }

  function getComputedSpec (computed, ctx, module) {
    var computedFns;
    var computedType = typeof computed;
    if (computedType === 'function') computedFns = computed(ctx);else if (computedType === 'object' && !Array.isArray(computed)) computedFns = computed;else throw new Error('computed type can only be a function or a plain json object');
    return {
      computedFns: computedFns,
      module: module
    };
  }

  var feature_timerId = {};
  var runLater = (function (cb, feature, delay) {
    if (delay === void 0) {
      delay = 1000;
    }

    var timerId = feature_timerId[feature];
    if (timerId) clearTimeout(timerId);
    feature_timerId[feature] = setTimeout(function () {
      delete feature_timerId[feature];
      cb();
    }, delay);
  });

  var getState$1 = ccContext.store.getState;
  var moduleName_stateKeys_$1 = ccContext.moduleName_stateKeys_;
  function watchKeyForRef (stateModule, watchSpec, connect, refEntireState, userCommitState, ctx) {
    var shouldCurrentRefUpdate = true;

    if (watchSpec) {
      var globalStateKeys = moduleName_stateKeys_$1[MODULE_GLOBAL];
      var moduleStateKeys = moduleName_stateKeys_$1[stateModule];
      var watchFns = watchSpec.watchFns,
          watchSpecModule = watchSpec.module;
      var watchStateKeys = okeys(watchFns);
      var len = watchStateKeys.length;
      var shouldNouUpdateLen = 0;
      watchStateKeys.forEach(function (key) {
        var _shouldSkipKey = shouldSkipKey(watchSpecModule, key, stateModule, connect, moduleStateKeys, globalStateKeys),
            stateKey = _shouldSkipKey.stateKey,
            skip = _shouldSkipKey.skip,
            keyModule = _shouldSkipKey.keyModule;

        if (skip) return;
        var commitValue = userCommitState[stateKey];

        if (commitValue !== undefined) {
          var watchFn = watchFns[key];
          var targetModule = keyModule || stateModule;
          var moduleState = getState$1(targetModule);
          var keyDesc = {
            key: stateKey,
            module: targetModule,
            moduleState: moduleState
          };
          var ret = watchFn(commitValue, refEntireState[stateKey], keyDesc, ctx); // watchFn(newValue, oldValue);

          if (ret === false) shouldNouUpdateLen++;
        }
      }); //只有所有watch都返回false，才不触发当前实例更新

      if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
    }

    return shouldCurrentRefUpdate;
  }

  var isPlainJsonObject$1 = isPlainJsonObject,
      justWarning$1 = justWarning,
      isObjectNotNull$1 = isObjectNotNull,
      computeFeature$1 = computeFeature,
      okeys$1 = okeys,
      safeGetArrayFromObject$1 = safeGetArrayFromObject,
      styleStr$1 = styleStr,
      color$1 = color;
  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
      STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1 = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      FORCE_UPDATE$1 = FORCE_UPDATE;
  var _ccContext$store = ccContext.store,
      ccStoreSetState = _ccContext$store.setState,
      getState$2 = _ccContext$store.getState,
      middlewares = ccContext.middlewares,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_,
      refStore = ccContext.refStore,
      moduleName_stateKeys_$2 = ccContext.moduleName_stateKeys_,
      ccKey_ref_$2 = ccContext.ccKey_ref_;

  function getStateFor(inputModule, refModule) {
    return inputModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1;
  }

  function changeRefState (state, _temp, targetRef) {
    var _ref = _temp === void 0 ? {} : _temp,
        ccKey = _ref.ccKey,
        ccUniqueKey = _ref.ccUniqueKey,
        module = _ref.module,
        _ref$skipMiddleware = _ref.skipMiddleware,
        skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
        reactCallback = _ref.cb,
        type = _ref.type,
        reducerModule = _ref.reducerModule,
        calledBy = _ref.calledBy,
        fnName = _ref.fnName,
        _ref$delay = _ref.delay,
        delay = _ref$delay === void 0 ? -1 : _ref$delay,
        identity = _ref.identity;

    //executionContext
    var stateFor = getStateFor(module, targetRef.cc.ccState.module);
    if (state == undefined) return; //do nothing
    // const isControlledByConcent = targetRef.cc.ccState.isControlledByConcent;

    if (!isPlainJsonObject$1(state)) {
      justWarning$1("cc found your commit state is not a plain json object!");
      return;
    }

    var refCc = targetRef.cc;
    var ccState = refCc.ccState;
    var currentModule = ccState.module;
    var passToMiddleware = {};

    if (skipMiddleware !== true) {
      passToMiddleware = {
        calledBy: calledBy,
        type: type,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        state: state,
        stateFor: stateFor,
        module: module,
        reducerModule: reducerModule,
        fnName: fnName
      };
    } //在prepareReactSetState之前把状态存储到store，
    //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
    //也防止prepareReactSetState里有异步的钩子函数，导致state同步到store有延迟而出现其他bug


    var broadcastInfo = syncCommittedStateToStore(module, state);

    if (module === currentModule) {
      // who trigger $$changeState, who will change the whole received state 
      prepareReactSetState(targetRef, identity, calledBy, state, stateFor, function () {
        prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, identity);
      }, reactCallback);
    } else {
      if (reactCallback) justWarning$1("callback for react.setState will be ignore"); //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE

      prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1, module, state, delay, identity);
    }
  }

  function prepareReactSetState(targetRef, identity, calledBy, state, stateFor, next, reactCallback) {
    // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
    // 要不然$$cache就没意义了
    // if(targetRef.$$cache){
    //   targetRef.$$refCache = targetRef.$$cache();
    // }
    var thisState = targetRef.state;
    var thisCc = targetRef.cc;
    var _thisCc$ccState = thisCc.ccState,
        stateModule = _thisCc$ccState.module,
        connect = _thisCc$ccState.connect,
        storedStateKeys = _thisCc$ccState.storedStateKeys,
        ccOption = _thisCc$ccState.ccOption;
    var ccUniqueKey = thisCc.ccUniqueKey;

    if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1) {
      if (next) next();
      return;
    }

    if (identity) {
      //if user specify identity
      if (thisCc.ccKey !== identity) {
        // current instance would have been rendered only if current instance's ccKey equal identity
        if (next) next();
        return;
      }
    }

    if (storedStateKeys.length > 0) {
      var _extractStateByKeys = extractStateByKeys(state, storedStateKeys),
          partialState = _extractStateByKeys.partialState,
          isStateEmpty = _extractStateByKeys.isStateEmpty;

      if (!isStateEmpty) {
        if (ccOption.storeInLocalStorage === true) {
          var _extractStateByKeys2 = extractStateByKeys(thisState, storedStateKeys),
              entireStoredState = _extractStateByKeys2.partialState;

          var currentStoredState = Object.assign({}, entireStoredState, partialState);
          localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
        }

        refStore.setState(ccUniqueKey, partialState);
      }
    } //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render


    if (calledBy !== FORCE_UPDATE$1 && !isObjectNotNull$1(state)) {
      if (next) next();
      return;
    }

    computeValueForRef(stateModule, thisCc.computedSpec, thisCc.refComputed, thisCc.refConnectedComputed, thisState, state);
    var ctx = targetRef.__fragmentParams || targetRef.cc;
    var shouldCurrentRefUpdate = watchKeyForRef(stateModule, thisCc.watchSpec, connect, thisState, state, ctx);

    if (shouldCurrentRefUpdate === false) {
      if (next) next();
    }

    if (targetRef.$$beforeSetState) {
      targetRef.$$beforeSetState({
        state: state
      });
    }

    thisCc.reactSetState(state, reactCallback);
    if (next) next();
  }

  function syncCommittedStateToStore(moduleName, committedState) {
    var stateKeys = moduleName_stateKeys_$2[moduleName];

    var _extractStateByKeys3 = extractStateByKeys(committedState, stateKeys),
        isPartialSharedStateEmpty = _extractStateByKeys3.isStateEmpty,
        partialSharedState = _extractStateByKeys3.partialState;

    var skipBroadcastRefState = false; //!!! save state to store

    if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);else skipBroadcastRefState = true;
    return {
      partialSharedState: partialSharedState,
      skipBroadcastRefState: skipBroadcastRefState
    };
  }

  function prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, identity) {
    var skipBroadcastRefState = broadcastInfo.skipBroadcastRefState,
        partialSharedState = broadcastInfo.partialSharedState;

    var startBroadcastState = function startBroadcastState() {
      if (targetRef.$$beforeBroadcastState) {
        //check if user define a life cycle hook $$beforeBroadcastState
        targetRef.$$beforeBroadcastState({});
      }

      broadcastState(targetRef, skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity);
    };

    var willBroadcast = function willBroadcast() {
      if (delay > 0) {
        var feature = computeFeature$1(targetRef.cc.ccUniqueKey, committedState);
        runLater(startBroadcastState, feature, delay);
      } else {
        startBroadcastState();
      }
    };

    if (skipMiddleware) {
      willBroadcast();
      return;
    }

    var middlewaresLen = middlewares.length;

    if (middlewaresLen > 0) {
      passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx

      var index = 0;

      var next = function next() {
        if (index === middlewaresLen) {
          // all middlewares been executed
          willBroadcast();
        } else {
          var middlewareFn = middlewares[index];
          index++;
          middlewareFn(passToMiddleware, next);
        }
      };

      next();
    } else {
      willBroadcast();
    }
  }

  function broadcastState(targetRef, skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, identity) {
    if (skipBroadcastRefState === false) {
      var currentCcKey = targetRef.cc.ccState.ccUniqueKey; // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
      // so flag ignoreCurrentCcKey as true;

      var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1;
      var ccClassKeys = moduleName_ccClassKeys_[moduleName];

      if (ccClassKeys) {
        //  these ccClass are watching the same module's state
        ccClassKeys.forEach(function (ccClassKey) {
          var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
          var ccKeys = classContext.ccKeys,
              sharedStateKeys = classContext.sharedStateKeys,
              originalSharedStateKeys = classContext.originalSharedStateKeys;
          if (ccKeys.length === 0) return;
          if (sharedStateKeys.length === 0) return;
          var sharedStateForCurrentCcClass;

          if (originalSharedStateKeys === '*') {
            sharedStateForCurrentCcClass = partialSharedState;
          } else {
            var _extractStateByKeys4 = extractStateByKeys(partialSharedState, sharedStateKeys, true),
                partialState = _extractStateByKeys4.partialState,
                isStateEmpty = _extractStateByKeys4.isStateEmpty;

            if (isStateEmpty) return;
            sharedStateForCurrentCcClass = partialState;
          }

          ccKeys.forEach(function (ccKey) {
            if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
            var ref = ccKey_ref_$2[ccKey];

            if (ref) {
              if (ccContext.isDebug) {
                console.log(styleStr$1("received state for ref " + ccKey + " is broadcasted from same module's other ref " + currentCcKey), color$1());
              }

              prepareReactSetState(ref, identity, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1);
            }
          });
        });
      }
    }

    broadcastConnectedState(moduleName, originalState);
  }

  function broadcastConnectedState(commitModule, commitState) {
    // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
    var commitStateKeys = okeys$1(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

    okeys$1(moduleName_ccClassKeys_).forEach(function (moduleName) {
      var ccClassKeys = safeGetArrayFromObject$1(moduleName_ccClassKeys_, moduleName);
      ccClassKeys.forEach(function (ccClassKey) {
        var ccClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
        updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
      });
    });
  }

  function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
    var stateToPropMapping = targetClassContext.stateToPropMapping,
        connectedModule = targetClassContext.connectedModule;

    if (connectedModule[commitModule] === 1) {
      var ccKeys = targetClassContext.ccKeys;
      var isSetConnectedStateTriggered = false;
      var len = commitStateKeys.length;

      for (var i = 0; i < len; i++) {
        var moduledStateKey = commitModule + "/" + commitStateKeys[i];

        if (stateToPropMapping[moduledStateKey]) {
          isSetConnectedStateTriggered = true;
          break; //只要感知到有一个key发生变化，就可以跳出循环了，
          //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
        }
      } //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍


      if (isSetConnectedStateTriggered === true) {
        ccKeys.forEach(function (ccUniKey) {
          var ref = ccKey_ref_$2[ccUniKey];

          if (ref) {
            var refCc = ref.cc;
            var watchSpec = refCc.watchSpec;
            var computedSpec = refCc.computedSpec;
            var shouldCurrentRefUpdate = watchKeyForRef(commitModule, watchSpec, refCc.ccState.connect, getState$2(commitModule), commitState, ref.__fragmentParams); //如果ref是CcFragment实例，将获得ctx

            computeValueForRef(commitModule, computedSpec, refCc.refComputed, refCc.refConnectedComputed, ref.state, commitState, ref.__fragmentParams);
            if (shouldCurrentRefUpdate) refCc.reactForceUpdate();
          }
        });
      }
    }
  }

  var verifyKeys$1 = util.verifyKeys,
      ccClassDisplayName$1 = util.ccClassDisplayName,
      styleStr$2 = util.styleStr,
      color$2 = util.color,
      verboseInfo$1 = util.verboseInfo,
      makeError$2 = util.makeError,
      justWarning$2 = util.justWarning,
      throwCcHmrError$2 = util.throwCcHmrError;
  var _ccContext$store$1 = ccContext.store,
      _state$1 = _ccContext$store$1._state,
      getState$3 = _ccContext$store$1.getState,
      _reducer$1 = ccContext.reducer._reducer,
      refStore$1 = ccContext.refStore,
      _computedValue$1 = ccContext.computed._computedValue,
      moduleName_sharedStateKeys_ = ccContext.moduleName_sharedStateKeys_,
      ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;
  var cl$1 = color$2;
  var ss$1 = styleStr$2;
  var me$3 = makeError$2;
  var vbi$3 = verboseInfo$1;

  function paramCallBackShouldNotSupply(module, currentModule) {
    return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
  }

  function handleError(err, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (throwError) throw err;else {
      handleCcFnError(err);
    }
  }

  function checkStoreModule(module, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    try {
      checkModuleName(module, false, "module[" + module + "] is not configured in store");
      return true;
    } catch (err) {
      handleError(err, throwError);
      return false;
    }
  } // any error in this function will not been throwed, cc just warning, 


  function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(inputModule, false)) {
      if (inputModule != currentModule) {
        if (reactCallback) {
          justWarning$2(me$3(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$3(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no chance to be triggered
        }
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
    }
  }

  function getSharedKeys(module, ccClassKey, inputSharedStateKeys) {
    var sharedStateKeys = inputSharedStateKeys;

    if (inputSharedStateKeys === '*') {
      sharedStateKeys = Object.keys(getState$3(module));
    }

    var _verifyKeys = verifyKeys$1(sharedStateKeys, []),
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi$3("ccClassKey:" + ccClassKey));
    }

    if (keyElementNotString) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi$3("ccClassKey:" + ccClassKey));
    }

    return sharedStateKeys;
  }

  function checkCcStartupOrNot() {
    if (ccContext.isCcAlreadyStartup !== true || !window.cc) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  } //to let cc know a specified module are watching what sharedStateKeys


  function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
    var sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
    if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
    partialSharedStateKeys.forEach(function (sKey) {
      if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
    });
  } //tell cc this ccClass is watching some sharedStateKeys of a module state


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, connectSpec) {
    var fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;

    if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
      throw me$3(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
    }

    var _getFeatureStrAndStpM = getFeatureStrAndStpMapping(connectSpec),
        stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping,
        connectedModuleNames = _getFeatureStrAndStpM.connectedModuleNames;

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var ctx = contextMap[ccClassKey];

    if (ctx !== undefined) {
      // analyze is ccClassKey really duplicated
      if (util.isHotReloadMode()) {
        var str1 = ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
        var str2 = originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);

        if (str1 !== str2) {
          throw me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
        } else {
          throwCcHmrError$2(me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
        }
      } else {
        throw me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
      }
    }

    buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, sharedStateKeys, stateToPropMapping, connectedModuleNames);
  }

  function mapModuleAssociateDataToCcContext(ccClassKey, stateModule, sharedStateKeys, connectSpec) {
    var targetSharedStateKeys = getSharedKeys(stateModule, ccClassKey, sharedStateKeys);
    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, targetSharedStateKeys, connectSpec);
    mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);
    mapModuleAndCcClassKeys(stateModule, ccClassKey);
    return targetSharedStateKeys;
  }

  function _promiseErrorHandler(resolve, reject) {
    return function (err) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return err ? reject(err) : resolve.apply(void 0, args);
    };
  }

  function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
    return new Promise(function (resolve, reject) {
      var _executionContext = Object.assign(executionContext, {
        __innerCb: _promiseErrorHandler(resolve, reject)
      });

      ccFn(userLogicFn, _executionContext, payload);
    })["catch"](catchCcError);
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$2(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
      }
    }
  } //忽略掉传递进来的chainId，chainDepth，重新生成它们，源头调用了lazyDispatch或者ctx里调用了lazyDispatch，就会触发此逻辑


  function getNewChainData(isLazy, chainId, oriChainId, chainId_depth_) {
    var _chainId;

    if (isLazy === true) {
      _chainId = getChainId();
      setChainIdLazy(_chainId);
      chainId_depth_[_chainId] = 1; //置为1
    } else {
      _chainId = chainId || getChainId();
      if (!chainId_depth_[_chainId]) chainId_depth_[_chainId] = 1;
    } //源头函数会触发创建oriChainId， 之后就一直传递下去了


    var _oriChainId = oriChainId || _chainId;

    return {
      _chainId: _chainId,
      _oriChainId: _oriChainId
    };
  }

  function register(ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        _ref$sharedStateKeys = _ref.sharedStateKeys,
        inputSharedStateKeys = _ref$sharedStateKeys === void 0 ? '*' : _ref$sharedStateKeys,
        _ref$storedStateKeys = _ref.storedStateKeys,
        inputStoredStateKeys = _ref$storedStateKeys === void 0 ? [] : _ref$storedStateKeys,
        _ref$connect = _ref.connect,
        connect = _ref$connect === void 0 ? {} : _ref$connect,
        reducerModule = _ref.reducerModule,
        _ref$isPropsProxy = _ref.isPropsProxy,
        isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
        _ref$isSingle = _ref.isSingle,
        isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
        _ref$__checkStartUp = _ref.__checkStartUp,
        __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
        __calledBy = _ref.__calledBy;

    try {
      if (!ccClassKey) throw new Error("[[register]]: ccClassKey is undefined!");
      if (__checkStartUp === true) checkCcStartupOrNot();

      if (__calledBy !== 'cc') {
        if (ccClassKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
          throw new Error(CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n        you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
        }
      }

      var _curStateModule = module;

      var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


      checkStoreModule(_curStateModule);
      var sKeys = mapModuleAssociateDataToCcContext(ccClassKey, _curStateModule, inputSharedStateKeys, connect);
      var sharedStateKeys = sKeys;
      var isIssArr = Array.isArray(inputStoredStateKeys);

      if (!isIssArr && inputStoredStateKeys !== '*') {
        throw new Error("register.option.storedStateKeys type err, it is must be an array or string *");
      }

      if (isIssArr) {
        inputStoredStateKeys.forEach(function (v) {
          if (sKeys.includes(v)) {
            throw new Error("register.option.storedStateKeys key err, the key[" + v + "] is already been declared in sharedStateKeys");
          }
        });
      }

      return function (ReactClass) {
        if (ReactClass.prototype.__$$mapCcToInstance) {
          throw me$3(ERR.CC_REGISTER_A_CC_CLASS, vbi$3("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
        }

        var ToBeExtendedClass = isPropsProxy === false ? ReactClass : React__default.Component;

        var CcClass =
        /*#__PURE__*/
        function (_ToBeExtendedClass) {
          _inheritsLoose(CcClass, _ToBeExtendedClass);

          function CcClass(props, context) {
            var _this;

            try {
              _this = _ToBeExtendedClass.call(this, props, context) || this;
              if (!_this.state) _this.state = {};
              var ccKey = props.ccKey,
                  _props$ccOption = props.ccOption,
                  ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
              var originalCcKey = ccKey; //这些方法是cc自己注入的

              util.bindThis(_assertThisInitialized(_this), ['__$$mapCcToInstance', '__$$recoverState', '$$domDispatch', '$$sync', '$$syncBool', '$$syncInt', '$$set', '__$$sync', '$$setBool', '__$$getInvokeHandler', '__$$makeInvokeHandler', '$$changeState', '__$$getChangeStateHandler', '__$$getDispatchHandler', '$$attach']);

              var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
                  newCcKey = _computeCcUniqueKey.ccKey,
                  ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                  isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

              var ccClassContext = ccClassKey_ccClassContext_$2[ccClassKey];
              setRef(_assertThisInitialized(_this), isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);

              if (!ccOption.storedStateKeys) {
                ccOption.storedStateKeys = inputStoredStateKeys;
              }

              if (ccOption.storedStateKeys === '*') {
                var toExcludeKeys = moduleName_sharedStateKeys_[_curStateModule];
                var allKeys = Object.keys(_this.state);
                var storedStateKeys = allKeys.filter(function (k) {
                  return !toExcludeKeys.includes(k);
                });
                ccOption.storedStateKeys = storedStateKeys;
              }

              _this.__$$mapCcToInstance(isSingle, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, connect);

              _this.$$connectedState = _this.cc.connectedState;
              _this.$$globalState = _this.cc.globalState;
              _this.$$refComputed = _this.cc.refComputed;
              _this.$$refConnectedComputed = _this.cc.refConnectedComputed; //这些方法是cc交给用户定义的，放置到cc下统一管理，因为多重装饰器模式下，这里属性是从this上取不到的
              //放在__$$recoverState之前，优先设置this.cc.computed

              if (_this.$$watch) {
                _this.cc.watch = _this.$$watch.bind(_assertThisInitialized(_this)); //区别于CcFragment, 对于class组件，不把this当作上下文传进去了

                _this.cc.watchSpec = getWatchSpec(_this.cc.watch, null, _curStateModule);
              }

              if (_this.$$computed) {
                _this.cc.computed = _this.$$computed.bind(_assertThisInitialized(_this));
                _this.cc.computedSpec = getComputedSpec(_this.cc.computed, null, _curStateModule);
              }

              if (_this.$$onUrlChanged) _this.cc.onUrlChanged = _this.$$onUrlChanged.bind(_assertThisInitialized(_this));
              if (_this.$$execute) _this.cc.execute = _this.$$execute.bind(_assertThisInitialized(_this)); //$$cache要注意使用规范

              if (_this.$$cache) {
                _this.$$cache = _this.$$cache.bind(_assertThisInitialized(_this));
                _this.$$refCache = _this.$$cache();
              } else {
                _this.$$refCache = {};
              }

              _this.__$$recoverState(_curStateModule, ccUniqueKey, connect);
            } catch (err) {
              catchCcError(err);
            }

            return _this;
          } // 如果代理组件或者继承组件没有没有实现scu，则concent采用只比较state的方式来决定组件要不要更新，不再关心nextProps


          var _proto = CcClass.prototype;

          _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            var childRef = this.cc.childRef;

            if (childRef && childRef.shouldComponentUpdate) {
              return childRef.shouldComponentUpdate(nextProps, nextState);
            } else if (_ToBeExtendedClass.prototype.shouldComponentUpdate) {
              return _ToBeExtendedClass.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
            }

            return this.state !== nextState;
          };

          _proto.__$$recoverState = function __$$recoverState(currentModule, ccUniqueKey, connect) {
            var refStoredState = refStore$1._state[ccUniqueKey] || {};
            var moduleState = _state$1[currentModule];
            var refState = this.state;
            var entireState = Object.assign({}, refState, refStoredState, moduleState);
            this.state = entireState;
            var thisCc = this.cc;
            var computedSpec = thisCc.computedSpec;

            if (computedSpec) {
              var refComputed = thisCc.refComputed,
                  refConnectedComputed = thisCc.refConnectedComputed;
              computeValueForRef(currentModule, computedSpec, refComputed, refConnectedComputed, entireState, entireState);
              okeys(connect).forEach(function (m) {
                var mState = getState$3(m);
                computeValueForRef(m, computedSpec, refComputed, refConnectedComputed, mState, mState);
              });
            }
          } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
          //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
          ;

          _proto.$$attach = function $$attach(childRef) {
            var _this2 = this;

            var attachMethods = ['$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di', '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$set', '$$setBool', '$$sync', '$$syncBool', '$$syncInt', '$$invoke', '$$lazyInvoke', 'setState', 'setGlobalState', 'setModuleState', 'forceUpdate'];
            attachMethods.forEach(function (m) {
              childRef[m] = _this2[m].bind(_this2);
            }); //这些负责搜集结果的key，单独绑定

            childRef.$$refComputed = this.cc.refComputed;
            childRef.$$refConnectedComputed = this.cc.refConnectedComputed;
            childRef.$$connectedComputed = this.cc.connectedComputed;
            childRef.$$moduleComputed = this.cc.moduleComputed;
            childRef.$$globalComputed = this.cc.globalComputed;
            childRef.$$connectedState = this.cc.connectedState;
            childRef.$$globalState = this.cc.globalState;
            var thisCc = this.cc;
            var curModule = thisCc.ccState.module;
            childRef.cc = thisCc;

            var bindChildRefCcApi = function bindChildRefCcApi(cRef, method, ccMethod) {
              if (cRef[method]) {
                childRef[method] = childRef[method].bind(childRef);
                thisCc[ccMethod] = childRef[method];
                if (method === '$$watch') thisCc.watchSpec = getWatchSpec(thisCc.$$watch, null, curModule);else if (method === '$$computed') thisCc.computedSpec = getComputedSpec(thisCc.$$computed, null, curModule);
              }
            }; //这些方法绑定的this指向childRef


            bindChildRefCcApi(childRef, '$$watch', 'watch');
            bindChildRefCcApi(childRef, '$$computed', 'computed');
            bindChildRefCcApi(childRef, '$$onUrlChanged', 'onUrlChanged');

            if (childRef.$$cache) {
              childRef.$$cache = childRef.$$cache.bind(childRef);
              this.cc.cache = childRef.$$cache;
              childRef.$$refCache = childRef.$$cache();
            } else {
              childRef.$$refCache = {};
            }

            var childRefState = childRef.state;
            var newState = Object.assign({}, childRefState, this.state);
            this.state = newState; //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
            // childRef.state = newState;//在childRef进入首次render流程前，提前赋值

            okeys(newState).forEach(function (key) {
              return childRefState[key] = newState[key];
            });
            this.cc.childRef = childRef;
          };

          _proto.componentDidMount = function componentDidMount() {
            if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);

            if (isPropsProxy === true) {
              if (!this.cc.childRef) {
                throw new Error('you forgot to call this.props.$$attach(this) constructor, and you must call it after super() next line!');
              } else {
                //执行到父组件的componentDidMount，可以等同于认为孩子mounted了
                this.cc.isChildRefMounted = true;
              }
            }
          };

          _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, connect) {
            var _this3 = this;

            var reactSetStateRef = this.setState.bind(this);
            var reactForceUpdateRef = this.forceUpdate.bind(this);
            var isControlledByConcent = sharedStateKeys.length > 0 || util.isObjectNotNull(connect);
            var ccState = {
              renderCount: 1,
              isSingle: isSingle,
              ccClassKey: ccClassKey,
              ccKey: ccKey,
              originalCcKey: originalCcKey,
              ccUniqueKey: ccUniqueKey,
              isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
              storedStateKeys: storedStateKeys,
              ccOption: ccOption,
              ccClassContext: ccClassContext,
              module: currentModule,
              reducerModule: currentReducerModule,
              sharedStateKeys: sharedStateKeys,
              initTime: Date.now(),
              connect: connect,
              isControlledByConcent: isControlledByConcent
            };
            var refConnectedComputed = {};
            okeys(connect).forEach(function (moduleName) {
              refConnectedComputed[moduleName] = {};
            });

            var _verifyKeys2 = verifyKeys$1(sharedStateKeys, storedStateKeys),
                duplicate = _verifyKeys2.duplicate,
                notArray = _verifyKeys2.notArray,
                keyElementNotString = _verifyKeys2.keyElementNotString;

            if (notArray) {
              throw me$3(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi$3("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
            }

            if (keyElementNotString) {
              throw me$3(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi$3("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
            }

            if (duplicate) {
              throw me$3(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi$3("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
            }

            if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
              throw me$3(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi$3("ccClassKey:" + ccClassKey));
            }

            var connectedState = ccClassContext.connectedState || {};
            var globalState = getState$3(MODULE_GLOBAL);
            this.cc = {
              isChildRefMounted: false,
              onUrlChanged: null,
              watch: null,
              watchSpec: null,
              computed: null,
              computedSpec: null,
              refComputed: {},
              refConnectedComputed: refConnectedComputed,
              //定义在类里的带模块名字的computedKey计算计算结果收集对象
              connectedComputed: {},
              globalComputed: {},
              moduleComputed: {},
              connectedState: connectedState,
              globalState: globalState,
              execute: null,
              ccState: ccState,
              ccClassKey: ccClassKey,
              originalCcKey: originalCcKey,
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              beforeSetState: this.$$beforeSetState,
              beforeBroadcastState: this.$$beforeBroadcastState,
              reactSetState: function reactSetState(state, cb) {
                ccState.renderCount += 1; //采用此种写法的话，dispatch.ctx不能暴露state了，只能暴露getState句柄，才能保证取到最新的state
                // this.state = Object.assign(this.state, state);
                //采用okeys写法，让dispatch.ctx里的refState总是指向同一个引用

                okeys(state).forEach(function (k) {
                  return _this3.state[k] = state[k];
                });
                reactSetStateRef(state, cb);
              },
              reactForceUpdate: function reactForceUpdate(cb) {
                ccState.renderCount += 1;
                reactForceUpdateRef(cb);
              },
              setState: function setState(state, cb, delay, identity) {
                if (delay === void 0) {
                  delay = -1;
                }

                changeRefState(state, {
                  ccKey: ccKey,
                  identity: identity,
                  module: currentModule,
                  cb: cb,
                  calledBy: SET_STATE,
                  delay: delay
                }, _this3);
              },
              setModuleState: function setModuleState(module, state, delay, identity) {
                if (delay === void 0) {
                  delay = -1;
                }

                changeRefState(state, {
                  ccKey: ccKey,
                  identity: identity,
                  module: module,
                  calledBy: SET_MODULE_STATE,
                  delay: delay
                }, _this3);
              },
              setGlobalState: function setGlobalState(partialGlobalState, delay, identity) {
                if (delay === void 0) {
                  delay = -1;
                }

                _this3.cc.setModuleState(MODULE_GLOBAL, partialGlobalState, delay, identity);
              },
              forceUpdate: function forceUpdate(cb, delay, identity) {
                changeRefState(_this3.state, {
                  ccKey: ccKey,
                  identity: identity,
                  module: currentModule,
                  cb: cb,
                  calledBy: FORCE_UPDATE,
                  delay: delay
                }, _this3);
              },
              __invoke: function __invoke(userLogicFn, option, payload) {
                var targetRef = option.targetRef,
                    ccKey = option.ccKey,
                    ccUniqueKey = option.ccUniqueKey,
                    ccClassKey = option.ccClassKey,
                    delay = option.delay,
                    identity = option.identity,
                    calledBy = option.calledBy,
                    module = option.module,
                    chainId = option.chainId,
                    oriChainId = option.oriChainId,
                    chainId_depth_ = option.chainId_depth_;
                return _this3.cc.__promisifiedInvokeWith(userLogicFn, {
                  targetRef: targetRef,
                  ccKey: ccKey,
                  ccUniqueKey: ccUniqueKey,
                  context: true,
                  module: module,
                  ccClassKey: ccClassKey,
                  calledBy: calledBy,
                  fnName: userLogicFn.name,
                  delay: delay,
                  identity: identity,
                  chainId: chainId,
                  oriChainId: oriChainId,
                  chainId_depth_: chainId_depth_
                }, payload);
              },
              __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext, payload) {
                return _promisifyCcFn(_this3.cc.__invokeWith, userLogicFn, executionContext, payload);
              },
              __invokeWith: function __invokeWith(userLogicFn, executionContext, payload) {
                //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
                var targetRef = executionContext.targetRef,
                    ccKey = executionContext.ccKey,
                    ccUniqueKey = executionContext.ccUniqueKey,
                    ccClassKey = executionContext.ccClassKey,
                    _executionContext$mod = executionContext.module,
                    targetModule = _executionContext$mod === void 0 ? _curStateModule : _executionContext$mod,
                    _executionContext$con = executionContext.context,
                    context = _executionContext$con === void 0 ? false : _executionContext$con,
                    cb = executionContext.cb,
                    __innerCb = executionContext.__innerCb,
                    type = executionContext.type,
                    reducerModule = executionContext.reducerModule,
                    calledBy = executionContext.calledBy,
                    fnName = executionContext.fnName,
                    _executionContext$del = executionContext.delay,
                    delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
                    identity = executionContext.identity,
                    refState = executionContext.refState,
                    chainId = executionContext.chainId,
                    oriChainId = executionContext.oriChainId,
                    chainId_depth_ = executionContext.chainId_depth_;
                isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
                  if (err) return handleCcFnError(err, __innerCb);
                  var moduleState = getState$3(targetModule);
                  var executionContextForUser = {};

                  if (context) {
                    //调用前先加1
                    chainId_depth_[chainId] = chainId_depth_[chainId] + 1; //暂时不考虑在ctx提供lazyDispatch功能

                    var dispatch = _this3.__$$getDispatchHandler(targetRef, refState, false, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, null, null, -1, identity, chainId, oriChainId, chainId_depth_);

                    var dispatchIdentity = _this3.__$$getDispatchHandler(targetRef, refState, false, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, null, null, -1, identity, chainId, oriChainId, chainId_depth_);

                    var sourceClassContext = ccClassKey_ccClassContext_$2[ccClassKey]; //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                    //目前先保留state

                    var _refState = refState || _this3.state; //优先取透传的，再取自己的，因为有可能是Dispatcher调用


                    executionContextForUser = Object.assign(executionContext, {
                      // 将targetModule一直携带下去，让链式调用里所以句柄隐含的指向最初调用方的module
                      invoke: _this3.__$$getInvokeHandler(targetRef, targetModule, ccKey, ccUniqueKey, ccClassKey, {
                        chainId: chainId,
                        oriChainId: oriChainId,
                        chainId_depth_: chainId_depth_
                      }),
                      //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
                      lazyInvoke: _this3.__$$getInvokeHandler(targetRef, targetModule, ccKey, ccUniqueKey, ccClassKey, {
                        isLazy: true,
                        oriChainId: oriChainId,
                        chainId_depth_: chainId_depth_
                      }),
                      rootState: getState$3(),
                      globalState: getState$3(MODULE_GLOBAL),
                      //指的是目标模块的state
                      moduleState: moduleState,
                      //指的是目标模块的的moduleComputed
                      moduleComputed: _computedValue$1[targetModule],
                      //!!!指的是调用源cc类的connectedState
                      connectedState: sourceClassContext.connectedState,
                      //!!!指的是调用源cc类的connectedComputed
                      connectedComputed: sourceClassContext.connectedComputed,
                      //!!!指的是调用源cc类实例的state
                      refState: _refState,
                      //其他ref相关的属性，不再传递给上下文，concent不鼓励用户在reducer使用ref相关数据，因为不同调用方传递不同的ref值，会引起用户不注意的bug
                      dispatch: dispatch,
                      dispatchIdentity: dispatchIdentity,
                      d: dispatch,
                      di: dispatchIdentity
                    });
                  }

                  send(SIG_FN_START, {
                    module: targetModule,
                    chainId: chainId,
                    fn: userLogicFn
                  });
                  co_1.wrap(userLogicFn)(payload, moduleState, executionContextForUser).then(function (partialState) {
                    chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

                    var curDepth = chainId_depth_[chainId];
                    var commitStateList = [];
                    send(SIG_FN_END, {
                      module: targetModule,
                      chainId: chainId
                    }); // if (chainId == oriChainId) {//是源头函数结束，发送函数结束的信号给插件
                    //   send(SIG_FN_END, { module: targetModule, chainId });
                    // }
                    // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

                    if (isChainIdLazy(chainId)) {
                      //来自于惰性派发的调用
                      if (curDepth > 1) {
                        //某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
                        setChainState(chainId, targetModule, partialState);
                      } else {
                        // chainDepth === 1, 合并状态一次性提交到store并派发到组件实例
                        if (isChainExited(chainId)) ; else {
                          commitStateList = setAndGetChainStateList(chainId, targetModule, partialState);
                          removeChainState(chainId);
                        }
                      }
                    } else {
                      commitStateList = [{
                        module: targetModule,
                        state: partialState
                      }];
                    }

                    commitStateList.forEach(function (v) {
                      changeRefState(v.state, {
                        identity: identity,
                        ccKey: ccKey,
                        ccUniqueKey: ccUniqueKey,
                        module: v.module,
                        cb: newCb,
                        type: type,
                        reducerModule: reducerModule,
                        calledBy: calledBy,
                        fnName: fnName,
                        delay: delay
                      }, targetRef);
                    });
                    if (__innerCb) __innerCb(null, partialState);
                  })["catch"](function (err) {
                    send(SIG_FN_ERR, {
                      module: targetModule,
                      chainId: chainId
                    });
                    handleCcFnError(err, __innerCb);
                  });
                });
              },
              dispatch: function dispatch(_temp2) {
                var _ref2 = _temp2 === void 0 ? {} : _temp2,
                    targetRef = _ref2.targetRef,
                    refState = _ref2.refState,
                    ccKey = _ref2.ccKey,
                    ccUniqueKey = _ref2.ccUniqueKey,
                    ccClassKey = _ref2.ccClassKey,
                    inputModule = _ref2.module,
                    inputReducerModule = _ref2.reducerModule,
                    identity = _ref2.identity,
                    type = _ref2.type,
                    payload = _ref2.payload,
                    reactCallback = _ref2.cb,
                    __innerCb = _ref2.__innerCb,
                    _ref2$delay = _ref2.delay,
                    delay = _ref2$delay === void 0 ? -1 : _ref2$delay,
                    chainId = _ref2.chainId,
                    oriChainId = _ref2.oriChainId,
                    chainId_depth_ = _ref2.chainId_depth_;

                //if module not defined, targetStateModule will be currentModule
                var targetStateModule = inputModule || currentModule; //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule

                var targetReducerModule = inputReducerModule || targetStateModule;
                var targetReducerMap = _reducer$1[targetReducerModule];

                if (!targetReducerMap) {
                  return __innerCb(new Error("no reducerMap found for reducer module:" + targetReducerModule));
                }

                var reducerFn = targetReducerMap[type];

                if (!reducerFn) {
                  var fns = Object.keys(targetReducerMap);
                  return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + targetReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
                } // const errMsg = util.isCcActionValid({ type, payload });
                // if (errMsg) return justWarning(errMsg);


                isStateModuleValid(targetStateModule, currentModule, reactCallback, function (err, newCb) {
                  if (err) return __innerCb(err);
                  var executionContext = {
                    targetRef: targetRef,
                    ccKey: ccKey,
                    ccClassKey: ccClassKey,
                    ccUniqueKey: ccUniqueKey,
                    ccOption: ccOption,
                    module: targetStateModule,
                    reducerModule: targetReducerModule,
                    type: type,
                    cb: newCb,
                    context: true,
                    __innerCb: __innerCb,
                    calledBy: DISPATCH,
                    delay: delay,
                    identity: identity,
                    refState: refState,
                    chainId: chainId,
                    oriChainId: oriChainId,
                    chainId_depth_: chainId_depth_
                  };

                  _this3.cc.__invokeWith(reducerFn, executionContext, payload);
                });
              },
              emit: function emit(event) {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }

                findEventHandlersToPerform.apply(ev, [event, {
                  identity: null
                }].concat(args));
              },
              emitIdentity: function emitIdentity(event, identity) {
                for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                  args[_key3 - 2] = arguments[_key3];
                }

                findEventHandlersToPerform.apply(ev, [event, {
                  identity: identity
                }].concat(args));
              },
              emitWith: function emitWith(event, option) {
                for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                  args[_key4 - 2] = arguments[_key4];
                }

                findEventHandlersToPerform.apply(ev, [event, option].concat(args));
              },
              on: function on(event, handler) {
                bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler);
              },
              onIdentity: function onIdentity(event, identity, handler) {
                bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler);
              },
              off: function off(event, _temp3) {
                var _ref3 = _temp3 === void 0 ? {} : _temp3,
                    module = _ref3.module,
                    ccClassKey = _ref3.ccClassKey,
                    identity = _ref3.identity;

                //  consider if module === currentModule, let off happened?
                findEventHandlersToOff(event, {
                  module: module,
                  ccClassKey: ccClassKey,
                  identity: identity
                });
              }
            };
            var thisCC = this.cc;

            var d = this.__$$getDispatchHandler(this, null, false, ccKey, ccUniqueKey, ccClassKey, currentModule, null, null, null, -1);

            var di = this.__$$getDispatchHandler(this, null, false, ccKey, ccUniqueKey, ccClassKey, currentModule, null, null, null, -1, ccKey); //ccKey is identity by default


            this.$$lazyDispatch = this.__$$getDispatchHandler(this, null, true, ccKey, ccUniqueKey, ccClassKey, currentModule, null, null, null, -1);
            this.$$d = d;
            this.$$di = di;
            this.$$dispatch = d;
            this.$$dispatchIdentity = di;
            this.$$dispatchForModule = this.__$$getDispatchHandler(this, null, false, ccKey, ccUniqueKey, ccClassKey, currentModule, null, null, null, -1);
            this.$$lazyDispatchForModule = this.__$$getDispatchHandler(this, null, true, ccKey, ccUniqueKey, ccClassKey, currentModule, null, null, null, -1);
            this.$$invoke = this.__$$getInvokeHandler(this, _curStateModule, ccKey, ccUniqueKey, ccClassKey);
            this.$$lazyInvoke = this.__$$getInvokeHandler(this, _curStateModule, ccKey, ccUniqueKey, ccClassKey, {
              isLazy: true
            });
            this.$$emit = thisCC.emit;
            this.$$emitIdentity = thisCC.emitIdentity;
            this.$$emitWith = thisCC.emitWith;
            this.$$on = thisCC.on;
            this.$$onIdentity = thisCC.onIdentity;
            this.$$off = thisCC.off;
            this.$$moduleComputed = thisCC.moduleComputed = _computedValue$1[currentModule] || {};
            this.$$globalComputed = thisCC.globalComputed = _computedValue$1[MODULE_GLOBAL] || {};
            this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;
            this.setState = thisCC.setState; //let setState call cc.setState

            this.setGlobalState = thisCC.setGlobalState; //let setGlobalState call cc.setGlobalState

            this.setModuleState = thisCC.setModuleState; //let setModuleState call cc.setModuleState

            this.forceUpdate = thisCC.forceUpdate; //let forceUpdate call cc.forceUpdate
          };

          _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
            var _this4 = this;

            return function (state) {
              return changeRefState(state, executionContext, _this4);
            };
          };

          _proto.__$$getInvokeHandler = function __$$getInvokeHandler(targetRef, module, ccKey, ccUniqueKey, ccClassKey, chainData) {
            return this.__$$makeInvokeHandler(targetRef, module, ccKey, ccUniqueKey, ccClassKey, chainData);
          };

          _proto.__$$makeInvokeHandler = function __$$makeInvokeHandler(targetRef, module, ccKey, ccUniqueKey, ccClassKey, _temp4) {
            var _this5 = this;

            var _ref4 = _temp4 === void 0 ? {} : _temp4,
                chainId = _ref4.chainId,
                oriChainId = _ref4.oriChainId,
                isLazy = _ref4.isLazy,
                _ref4$chainId_depth_ = _ref4.chainId_depth_,
                chainId_depth_ = _ref4$chainId_depth_ === void 0 ? {} : _ref4$chainId_depth_;

            return function (firstParam, payload) {
              var _getNewChainData = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
                  _chainId = _getNewChainData._chainId,
                  _oriChainId = _getNewChainData._oriChainId;

              var firstParamType = typeof firstParam;
              var option = {
                targetRef: targetRef,
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                ccClassKey: ccClassKey,
                calledBy: INVOKE,
                module: module,
                chainId: _chainId,
                oriChainId: _oriChainId,
                chainId_depth_: chainId_depth_
              };
              var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, identity:string}, ...args:any[])");

              if (firstParamType === 'function') {
                return _this5.cc.__invoke(firstParam, option, payload);
              } else if (firstParamType === 'object') {
                //firstParam: {fn:function, delay:number, identity:string}
                // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
                var fn = firstParam.fn,
                    delay = firstParam.delay,
                    identity = firstParam.identity,
                    userInputModule = firstParam.module;
                if (typeof fn != 'function') throw err;
                option.delay = delay;
                option.identity = identity;
                if (userInputModule) option.module = userInputModule; //用某个模块的实例去修改另外模块的数据

                return _this5.cc.__invoke(fn, option, payload);
              } else {
                throw err;
              } // return ()=>{}

            };
          };

          _proto.__$$getDispatchHandler = function __$$getDispatchHandler(targetRef, refState, isLazy, ccKey, ccUniqueKey, ccClassKey, targetModule, targetReducerModule, inputType, inputPayload, delay, defaultIdentity, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
          ) {
            var _this6 = this;

            if (delay === void 0) {
              delay = -1;
            }

            if (defaultIdentity === void 0) {
              defaultIdentity = '';
            }

            if (chainId_depth_ === void 0) {
              chainId_depth_ = {};
            }

            return function (paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) {
              if (paramObj === void 0) {
                paramObj = {};
              }

              var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
                  _chainId = _getNewChainData2._chainId,
                  _oriChainId = _getNewChainData2._oriChainId;

              var paramObjType = typeof paramObj;

              var _module = targetModule,
                  _reducerModule,
                  _type,
                  _payload = inputPayload,
                  _cb,
                  _delay = delay;

              var _identity = defaultIdentity;

              if (paramObjType === 'object') {
                var _paramObj = paramObj,
                    _paramObj$module = _paramObj.module,
                    _module2 = _paramObj$module === void 0 ? targetModule : _paramObj$module,
                    _reducerModule2 = _paramObj.reducerModule,
                    _paramObj$type = _paramObj.type,
                    type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                    _paramObj$payload = _paramObj.payload,
                    payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                    cb = _paramObj.cb,
                    _paramObj$delay = _paramObj.delay,
                    _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
                    identity = _paramObj.identity;

                _module = _module2;
                _reducerModule = _reducerModule2 || _module2;
                _type = type;
                _payload = payload;
                _cb = cb;
                _delay = _delay2;
                if (identity) _identity = identity;
              } else if (paramObjType === 'string' || paramObjType === 'function') {
                var targetFirstParam = paramObj;

                if (paramObjType === 'function') {
                  var fnName = paramObj.__fnName;
                  if (!fnName) throw new Error('you are calling a unnamed function!!!');
                  targetFirstParam = fnName; // _module = paramObjType.stateModule || module;
                }

                var slashCount = targetFirstParam.split('').filter(function (v) {
                  return v === '/';
                }).length;
                _payload = payloadWhenFirstParamIsString;
                if (userInputIdentity) _identity = userInputIdentity;
                if (userInputDelay !== undefined) _delay = userInputDelay;

                if (slashCount === 0) {
                  _type = targetFirstParam;
                } else if (slashCount === 1) {
                  var _targetFirstParam$spl = targetFirstParam.split('/'),
                      _module3 = _targetFirstParam$spl[0],
                      _type2 = _targetFirstParam$spl[1];

                  _module = _module3;
                  _reducerModule = _module;
                  _type = _type2;
                } else if (slashCount === 2) {
                  var _targetFirstParam$spl2 = targetFirstParam.split('/'),
                      _module4 = _targetFirstParam$spl2[0],
                      _reducerModule3 = _targetFirstParam$spl2[1],
                      _type3 = _targetFirstParam$spl2[2];

                  if (_module4 === '' || _module4 === ' ') _module = targetModule; //targetFirstParam may like: /foo/changeName
                  else _module = _module4;
                  _module = _module4;
                  _reducerModule = _reducerModule3;
                  _type = _type3;
                } else {
                  return Promise.reject(me$3(ERR.CC_DISPATCH_STRING_INVALID, vbi$3(targetFirstParam)));
                }
              } else {
                return Promise.reject(me$3(ERR.CC_DISPATCH_PARAM_INVALID));
              }

              if (_module === '*') {
                return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
              } // pick user input reducerModule firstly


              var nowReducerModule = _reducerModule || targetReducerModule || module;
              var p = new Promise(function (resolve, reject) {
                _this6.cc.dispatch({
                  targetRef: targetRef,
                  module: _module,
                  reducerModule: nowReducerModule,
                  type: _type,
                  payload: _payload,
                  cb: _cb,
                  __innerCb: _promiseErrorHandler(resolve, reject),
                  ccKey: ccKey,
                  ccUniqueKey: ccUniqueKey,
                  ccClassKey: ccClassKey,
                  delay: _delay,
                  identity: _identity,
                  refState: refState,
                  chainId: _chainId,
                  oriChainId: _oriChainId,
                  chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

                });
              })["catch"](catchCcError);
              return p;
            };
          };

          _proto.$$changeState = function $$changeState(state, option) {
            changeRefState(state, option, this);
          };

          _proto.$$domDispatch = function $$domDispatch(event) {
            var currentTarget = event.currentTarget;
            var value = currentTarget.value,
                dataset = currentTarget.dataset;
            var type = dataset.cct,
                module = dataset.ccm,
                reducerModule = dataset.ccrm,
                _dataset$ccdelay = dataset.ccdelay,
                ccdelay = _dataset$ccdelay === void 0 ? -1 : _dataset$ccdelay,
                _dataset$ccidt = dataset.ccidt,
                ccidt = _dataset$ccidt === void 0 ? '' : _dataset$ccidt;
            var payload = {
              event: event,
              dataset: dataset,
              value: value
            };
            var _this$cc = this.cc,
                ccKey = _this$cc.ccKey,
                ccUniqueKey = _this$cc.ccUniqueKey;

            var handler = this.__$$getDispatchHandler(this, null, false, ccKey, ccUniqueKey, ccClassKey, module, reducerModule, type, payload, ccdelay, ccidt);

            handler()["catch"](handleCcFnError);
          };

          _proto.$$syncBool = function $$syncBool(e, delay, idt) {
            var _this$__$$sync$bind;

            if (delay === void 0) {
              delay = -1;
            }

            if (idt === void 0) {
              idt = '';
            }

            if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind = {}, _this$__$$sync$bind[CCSYNC_KEY] = e, _this$__$$sync$bind.type = 'bool', _this$__$$sync$bind.delay = delay, _this$__$$sync$bind.idt = idt, _this$__$$sync$bind));

            this.__$$sync({
              type: 'bool'
            }, e);
          };

          _proto.$$syncInt = function $$syncInt(e, delay, idt) {
            var _this$__$$sync$bind2;

            if (delay === void 0) {
              delay = -1;
            }

            if (idt === void 0) {
              idt = '';
            }

            if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind2 = {}, _this$__$$sync$bind2[CCSYNC_KEY] = e, _this$__$$sync$bind2.type = 'int', _this$__$$sync$bind2.delay = delay, _this$__$$sync$bind2.idt = idt, _this$__$$sync$bind2));

            this.__$$sync({
              type: 'int'
            }, e);
          };

          _proto.$$set = function $$set(ccsync, val, delay, idt) {
            var _this$__$$sync;

            this.__$$sync((_this$__$$sync = {}, _this$__$$sync[CCSYNC_KEY] = ccsync, _this$__$$sync.type = 'val', _this$__$$sync.val = val, _this$__$$sync.delay = delay, _this$__$$sync.idt = idt, _this$__$$sync));
          } //对布尔值自动取反
          ;

          _proto.$$setBool = function $$setBool(ccsync, delay, idt) {
            var _this$__$$sync2;

            this.__$$sync((_this$__$$sync2 = {}, _this$__$$sync2[CCSYNC_KEY] = ccsync, _this$__$$sync2.type = 'bool', _this$__$$sync2.delay = delay, _this$__$$sync2.idt = idt, _this$__$$sync2));
          };

          _proto.$$sync = function $$sync(e, val, delay, idt) {
            if (typeof e === 'string') {
              var _this$__$$sync$bind3;

              return this.__$$sync.bind(this, (_this$__$$sync$bind3 = {}, _this$__$$sync$bind3[CCSYNC_KEY] = e, _this$__$$sync$bind3.type = 'val', _this$__$$sync$bind3.val = val, _this$__$$sync$bind3.delay = delay, _this$__$$sync$bind3.idt = idt, _this$__$$sync$bind3));
            } else if (e && e[MOCKE_KEY]) {
              return this.__$$sync(e);
            }

            this.__$$sync({
              type: 'val'
            }, e); // for <input data-ccsync="foo/f1" onChange={this.$$sync} />

          };

          _proto.__$$sync = function __$$sync(spec, e) {
            var mockE = null;

            if (spec[MOCKE_KEY]) {
              mockE = spec;
            } else if (spec[CCSYNC_KEY] !== undefined) {
              //来自$$sync生成的setter调用
              mockE = buildMockEvent(spec, e);
            } else {
              mockE = convertToStandardEvent(e);
            }

            if (!mockE) return; //参数无效

            if (e && e.stopPropagation) e.stopPropagation();
            var currentTarget = mockE.currentTarget;
            var dataset = currentTarget.dataset;
            var ccsync = dataset.ccsync,
                ccint = dataset.ccint,
                ccdelay = dataset.ccdelay,
                ccidt = dataset.ccidt;
            var value = currentTarget.value;
            var thisCc = this.cc;
            var currentModule = thisCc.ccState.module;
            var _module = currentModule;

            if (ccsync.includes('/')) {
              _module = ccsync.split('/')[0];
            }

            var fullState = _module !== currentModule ? getState$3(_module) : this.state;

            var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool),
                state = _extractStateByCcsync.state;

            changeRefState(state, {
              calledBy: SYNC,
              ccKey: thisCc.ccKey,
              ccUniqueKey: thisCc.ccUniqueKey,
              module: _module,
              delay: ccdelay,
              identity: ccidt
            }, this);
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            var _this$cc$ccState = this.cc.ccState,
                ccUniqueKey = _this$cc$ccState.ccUniqueKey,
                ccClassKey = _this$cc$ccState.ccClassKey;
            offEventHandlersByCcUniqueKey(ccUniqueKey);
            unsetRef(ccClassKey, ccUniqueKey); //if father component implement componentWillUnmount，call it again

            if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
          };

          _proto.render = function render() {
            if (ccContext.isDebug) {
              console.log(ss$1("@@@ render " + ccClassDisplayName$1(ccClassKey)), cl$1());
            }

            if (isPropsProxy === false) {
              //now cc class extends ReactClass, call super.render()
              return _ToBeExtendedClass.prototype.render.call(this);
            } else {
              var thisCc = this.cc; //只将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
              // const props = Object.assign({}, this.props, { $$attach: this.$$attach });

              var props = Object.assign({}, this, {
                $$attach: this.$$attach
              });

              if (thisCc.isChildRefMounted) {
                var childRefState = thisCc.childRef.state;
                var thisState = this.state;
                okeys(this.state).forEach(function (key) {
                  childRefState[key] = thisState[key];
                }); //不能采用直接赋值，这相当于隐式的替换了state，会造成更新失败
                // thisCc.childRef.state = this.state;
              }

              return React__default.createElement(ReactClass, props);
            }
          };

          return CcClass;
        }(ToBeExtendedClass);

        if (ccClassKey === CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';else CcClass.displayName = ccClassDisplayName$1(ccClassKey);
        return CcClass;
      };
    } catch (err) {
      catchCcError(err);
    }
  }

  function createDispatcher (CustomizedComponent) {
    var DefaultComponent =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(DefaultComponent, _React$Component);

      function DefaultComponent(props, context) {
        return _React$Component.call(this, props, context) || this;
      }

      var _proto = DefaultComponent.prototype;

      _proto.render = function render() {
        return this.props.children || React__default.createElement('span', {
          style: {
            display: 'none'
          }
        });
      };

      return DefaultComponent;
    }(React__default.Component);

    if (ccContext.refs[CC_DISPATCHER]) {
      if (util.isHotReloadMode()) {
        util.justTip("hot reload mode, CC_DISPATCHER existed");
      } else {
        throw new Error("CcDispatcher can only be initialize one time");
      }
    }

    var TargetComponent = CustomizedComponent || DefaultComponent;
    return register(CC_DISPATCHER, {
      isSingle: true,
      __checkStartUp: false,
      __calledBy: 'cc'
    })(TargetComponent);
  }

  function initModuleState (module, state, rootStateCanNotContainInputModule) {
    if (rootStateCanNotContainInputModule === void 0) {
      rootStateCanNotContainInputModule = true;
    }

    if (rootStateCanNotContainInputModule) checkModuleNameAndState(module, state);else checkModuleNameBasicallyAndState(module, state); // ccContext.store.setState(module, state);

    var rootState = ccContext.store.getState();
    var prevRootState = ccContext.store.getPrevState();
    rootState[module] = state;
    prevRootState[module] = Object.assign({}, state);
    var statKeys = Object.keys(state);
    ccContext.moduleName_stateKeys_[module] = statKeys;

    if (module === MODULE_GLOBAL) {
      var globalStateKeys = ccContext.globalStateKeys;
      statKeys.forEach(function (key) {
        return globalStateKeys.push(key);
      });
    }
  }

  /****
   * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module, mustBelongToModule) {
    if (mustBelongToModule === void 0) {
      mustBelongToModule = false;
    }

    var ccKey_ref_ = ccContext.ccKey_ref_,
        moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var ccKeys = [];

    if (module) {
      if (ccContext.store._state[module]) {
        var ccClassKeys = moduleName_ccClassKeys_[module];

        if (ccClassKeys && ccClassKeys.length !== 0) {
          var oneCcClassKey = ccClassKeys[0];
          var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

          if (!ccClassContext) {
            throw new Error("no ccClassContext found for ccClassKey " + oneCcClassKey + "!");
          }

          ccKeys = ccClassContext.ccKeys;
        }
      } else {
        throw new Error("module[" + module + "] is invalid, is is not declared in store");
      }

      if (module === MODULE_DEFAULT) {
        ccKeys = ccKeys.filter(function (key) {
          return !key.startsWith(CC_FRAGMENT_PREFIX);
        });
      }

      if (ccKeys.length === 0) {
        if (mustBelongToModule === false) ccKeys = [CC_DISPATCHER];else {
          var ignoreIt = "if this message doesn't matter, you can ignore it";
          throw new Error("[[pickOneRef]]: no ref found for module[" + module + "]!," + ignoreIt);
        }
      }
    } else {
      ccKeys = [CC_DISPATCHER];
    }

    var oneRef = ccKey_ref_[ccKeys[0]];

    if (!oneRef) {
      throw new Error('cc found no ref!');
    }

    return oneRef;
  }

  function setState (module, state, delay, identity, skipMiddleware, throwError) {
    if (delay === void 0) {
      delay = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef(module);
      ref.$$changeState(state, {
        ccKey: '[[top api:cc.setState]]',
        module: module,
        stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
        delay: delay,
        identity: identity,
        skipMiddleware: skipMiddleware
      });
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  var ccStoreSetState$1 = ccContext.store.setState;
  var ccGlobalStateKeys = ccContext.globalStateKeys;
  var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";
  function getAndStoreValidGlobalState (globalState, tipModule, tipCcClassKey) {
    if (tipModule === void 0) {
      tipModule = '';
    }

    if (tipCcClassKey === void 0) {
      tipCcClassKey = '';
    }

    var _extractStateByKeys = extractStateByKeys(globalState, ccGlobalStateKeys),
        validGlobalState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    var vKeys = okeys(validGlobalState);
    var allKeys = okeys(globalState);

    if (vKeys.length < allKeys.length) {
      //??? need strict?
      var invalidKeys = allKeys.filter(function (k) {
        return !vKeys.includes(k);
      });
      justWarning(tip + ',invalid keys: ' + invalidKeys.join(',') + ', make sure the keys is invalid and their values are not undefined');
      console.log(globalState);
      if (tipModule) justWarning('module is ' + tipModule);
      if (tipCcClassKey) justWarning('ccClassKey is ' + tipCcClassKey);
    }

    ccStoreSetState$1(MODULE_GLOBAL, validGlobalState);
    return {
      partialState: validGlobalState,
      isStateEmpty: isStateEmpty
    };
  }

  function makeSetStateHandler (module) {
    return function (state) {
      try {
        setState(module, state, 0);
      } catch (err) {
        if (module == MODULE_GLOBAL) {
          getAndStoreValidGlobalState(state, module);
        } else {
          var moduleState = ccContext.store.getState(module);

          if (!moduleState) {
            return util.justWarning("invalid module " + module);
          }

          var keys = Object.keys(moduleState);

          var _extractStateByKeys = extractStateByKeys(state, keys),
              validModuleState = _extractStateByKeys.partialState,
              isStateEmpty = _extractStateByKeys.isStateEmpty;

          if (!isStateEmpty) ccContext.store.setState(module, validModuleState); //store this state;
        }

        util.justTip("no ccInstance found for module " + module + " currently, cc will just store it, lately ccInstance will pick this state to render");
      }
    };
  }

  function dispatch (isLazy, action, payLoadWhenActionIsString, delay, identity, _temp) {
    if (identity === void 0) {
      identity = '';
    }

    var _ref = _temp === void 0 ? {} : _temp,
        ccClassKey = _ref.ccClassKey,
        ccKey = _ref.ccKey,
        throwError = _ref.throwError;

    if (action === undefined && payLoadWhenActionIsString === undefined) {
      throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any, delay?:number, idt?:string), when action is String, second param means payload");
    }

    var dispatchFn;

    try {
      if (ccClassKey && ccKey) {
        var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          dispatchFn = isLazy ? targetRef.$$lazyDispatch : targetRef.$$dispatch;
        }
      } else {
        var module = '';

        if (typeof action == 'string' && action.includes('/')) {
          module = action.split('/')[0];
        }

        var ref;

        if (module !== '*') {
          ref = pickOneRef(module);
        } else {
          ref = pickOneRef();
        }

        if (ref.cc.ccState.ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
          dispatchFn = isLazy ? ref.__fragmentParams.lazyDispatch : ref.__fragmentParams.dispatch;
        } else {
          dispatchFn = isLazy ? ref.$$lazyDispatchForModule : ref.$$dispatchForModule;
        }
      }

      if (typeof action === 'string' && action.startsWith('*')) {
        var reducerName = action.split('/').pop();
        var rnList_ = ccContext.reducer._reducerName_FullReducerNameList_[reducerName];
        rnList_.forEach(function (fullReducerName) {
          dispatchFn(fullReducerName, payLoadWhenActionIsString, delay, identity);
        });
      } else {
        dispatchFn(action, payLoadWhenActionIsString, delay, identity);
      }
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function dispatch$1 (action, payLoadWhenActionIsString, delay, identity, option) {
    dispatch(false, action, payLoadWhenActionIsString, delay, identity, option);
  }

  function lazyDispatch (action, payLoadWhenActionIsString, delay, identity, option) {
    dispatch(true, action, payLoadWhenActionIsString, delay, identity, option);
  }

  function initModuleReducer (module, reducer, rootReducerCanNotContainInputModule) {
    if (rootReducerCanNotContainInputModule === void 0) {
      rootReducerCanNotContainInputModule = true;
    }

    if (!reducer) return;
    if (rootReducerCanNotContainInputModule) checkReducerModuleName(module);else checkModuleNameBasically(module);
    var _ccContext$reducer = ccContext.reducer,
        _reducer = _ccContext$reducer._reducer,
        _reducerCaller = _ccContext$reducer._reducerCaller,
        _lazyReducerCaller = _ccContext$reducer._lazyReducerCaller,
        _reducerName_FullReducerNameList_ = _ccContext$reducer._reducerName_FullReducerNameList_,
        _reducerModule_fnNames_ = _ccContext$reducer._reducerModule_fnNames_;
    _reducer[module] = reducer;
    var subReducerCaller = safeGetObjectFromObject(_reducerCaller, module);
    var subLazyReducerCaller = safeGetObjectFromObject(_lazyReducerCaller, module);
    var fnNames = safeGetArrayFromObject(_reducerModule_fnNames_, module);
    var reducerNames = okeys(reducer);
    reducerNames.forEach(function (name) {
      fnNames.push(name);

      subReducerCaller[name] = function (payload, delay, idt) {
        return dispatch$1(module + "/" + name, payload, delay, idt);
      };

      subLazyReducerCaller[name] = function (payload, delay, idt) {
        return lazyDispatch(module + "/" + name, payload, delay, idt);
      };

      var reducerFn = reducer[name];

      if (typeof reducerFn !== 'function') {
        throw new Error("reducer key[" + name + "] 's value is not a function");
      } else {
        reducerFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名
      } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
      // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
      // reducerFn.stateModule = module;


      var list = safeGetArrayFromObject(_reducerName_FullReducerNameList_, name);
      list.push(module + "/" + name);
    });
  }

  var safeGetObjectFromObject$1 = safeGetObjectFromObject,
      isPlainJsonObject$2 = isPlainJsonObject;
  /**
   * 设置watch值，过滤掉一些无效的key
   */

  function initModuleWatch (module, moduleWatch) {
    if (!isPlainJsonObject$2(moduleWatch)) {
      throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
    }

    checkModuleName(module, false, "watch." + module + " is invalid");
    var rootWatch = ccContext.watch.getRootWatch();
    var getState = ccContext.store.getState;
    var watchStateKeys = Object.keys(moduleWatch);
    watchStateKeys.forEach(function (key) {
      var moduleState = getState(module);
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var fn = moduleWatch[key];

        if (typeof fn !== 'function') {
          throw new Error("watch." + module + "." + key + "'s value is not a function");
        }

        var ccModuleWatch = safeGetObjectFromObject$1(rootWatch, module);
        ccModuleWatch[key] = fn;
      } else {
        //strict?
        justWarning("watch." + module + "'s key[" + key + "] is not declared in store." + module + "!");
      }
    });
  }

  var safeGetObjectFromObject$2 = safeGetObjectFromObject,
      isPlainJsonObject$3 = isPlainJsonObject;
  function initModuleComputed (module, computed) {
    if (!isPlainJsonObject$3(computed)) {
      throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
    }

    checkModuleName(module, false, "computed." + module + " is invalid");
    var rootState = ccContext.store.getState();
    var rootComputedValue = ccContext.computed.getRootComputedValue();
    var rootComputedFn = ccContext.computed.getRootComputedFn();
    var moduleState = rootState[module];
    var stateKeys = Object.keys(computed);
    stateKeys.forEach(function (key) {
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleComputedFn = safeGetObjectFromObject$2(rootComputedFn, module);
        var fn = computed[key];
        moduleComputedFn[key] = fn;
        var computedValue = fn(originalValue, originalValue, moduleState);
        var moduleComputedValue = safeGetObjectFromObject$2(rootComputedValue, module);
        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        justWarning("computed." + module + "'s key[" + key + "] is not declared in store." + module + "'s state!");
      }
    });
  }

  var ccGlobalStateKeys$1 = ccContext.globalStateKeys;

  function setGlobalConfig(storedGlobalConf, inputGlobalConf, label) {
    var globalState = ccContext.store.getGlobalState();

    if (inputGlobalConf) {
      if (!util.isPlainJsonObject(inputGlobalConf)) {
        throw new Error("option.global" + label + " is not a plain json object");
      }

      var globalConfKeys = Object.keys(inputGlobalConf);
      globalConfKeys.forEach(function (gKey) {
        if (storedGlobalConf.hasOwnProperty(gKey)) {
          throw new Error("key[" + gKey + "] duplicated in global." + label.toLowerCase());
        }

        var confValue = inputGlobalConf[gKey];
        storedGlobalConf[gKey] = confValue;
        if (label === 'State') ccGlobalStateKeys$1.push(gKey);else if (label === 'Computed') {
          var val = globalState[gKey];
          var computedVal = confValue(val, val, globalState);
          ccContext.computed._computedValue[MODULE_GLOBAL][gKey] = computedVal;
        }
      });
    }
  }
  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {string} module
   * @param {{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean}} config
   * @param {object} [option] reducer、init
   * @param {{[reducerModuleName:string]:{[fnName:string]:function}}} [option.reducer]
   * @param {object} [option.globalState] will been merged to $$global module state
   * @param {object} [option.globalWatch] will been merged to $$global module watch
   * @param {object} [option.globalComputed] will been merged to $$global module computed
   * @param {function[]} [option.middlewares]
   */


  function configure (module, config, option) {
    if (option === void 0) {
      option = {};
    }

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet, you can not call cc.configure!');
    }

    if (!util.isPlainJsonObject(config)) {
      throw new Error('[[configure]] param type error, config is not plain json object!');
    }

    if (module === MODULE_GLOBAL) {
      throw new Error('cc do not allow configure global module');
    }

    var state = config.state,
        reducer = config.reducer,
        computed = config.computed,
        watch = config.watch,
        init = config.init,
        isClassSingle = config.isClassSingle;
    var _option = option,
        optionReducer = _option.reducer,
        globalState = _option.globalState,
        globalWatch = _option.globalWatch,
        globalComputed = _option.globalComputed,
        middlewares = _option.middlewares;
    initModuleState(module, state);
    initModuleReducer(module, reducer);
    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;
    _state[module] = state;

    if (computed) {
      initModuleComputed(module, computed);
    }

    if (watch) {
      initModuleWatch(module, watch);
    }

    if (isClassSingle === true) {
      ccContext.moduleSingleClass[module] = true;
    }

    if (optionReducer) {
      if (!isPlainJsonObject(optionReducer)) {
        throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("module[" + module + "] 's moduleReducer is invalid"));
      }

      var reducerModuleNames = Object.keys(optionReducer);
      reducerModuleNames.forEach(function (rmName) {
        checkModuleName(rmName);
        var moduleReducer = optionReducer[rmName];

        if (!isPlainJsonObject(moduleReducer)) {
          throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("module[" + module + "] reducer 's value is invalid"));
        }

        if (rmName == MODULE_GLOBAL) {
          //merge input globalReducer to existed globalReducer
          var typesOfGlobal = Object.keys(moduleReducer);
          var globalReducer = _reducer[MODULE_GLOBAL];
          typesOfGlobal.forEach(function (type) {
            if (globalReducer[type]) {
              throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo("type " + type));
            }

            var reducerFn = moduleReducer[type];

            if (typeof reducerFn !== 'function') {
              throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
            }

            globalReducer[type] = reducerFn;
          });
        } else {
          _reducer[rmName] = moduleReducer;
        }
      });
    }

    if (reducer) {
      if (!isPlainJsonObject(reducer)) {
        throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("config.reducer is not a plain json object"));
      }

      _reducer[module] = reducer;
    }

    var storedGlobalState = _state[MODULE_GLOBAL];
    var storedGlobalComputedFn = ccContext.computed._computedFn[MODULE_GLOBAL];
    var storedGlobalWatch = ccContext.watch[MODULE_GLOBAL]; //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算

    setGlobalConfig(storedGlobalState, globalState, 'State');
    setGlobalConfig(storedGlobalComputedFn, globalComputed, 'Computed');
    setGlobalConfig(storedGlobalWatch, globalWatch, 'Watch');

    if (init) {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function!');
      }

      init(makeSetStateHandler(module));
    }

    if (middlewares && middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
        ccMiddlewares.push(m);
      });
    }

    ccContext.plugins.forEach(function (p) {
      if (p.writeModuleState) {
        var pluginName = p.name;

        if (pluginName !== module) {
          var pluginState = ccContext.store.getState(pluginName);
          p.writeModuleState(pluginState, module);
        }
      }
    });
  }

  var isPlainJsonObject$4 = isPlainJsonObject,
      okeys$2 = okeys;
  var getState$4 = ccContext.store.getState;
  function configStoreState(storeState) {
    if (!isPlainJsonObject$4(storeState)) {
      throw new Error("the storeState is not a plain json object!");
    }

    var store = ccContext.store;
    store.initStateDangerously(MODULE_CC, {});
    if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
    if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
    var moduleNames = okeys$2(storeState);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      var moduleState = storeState[moduleName];
      initModuleState(moduleName, moduleState);
    }
  }
  /**
   * 
   * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
   */

  function configRootReducer(rootReducer) {
    var moduleNames = okeys$2(rootReducer);
    if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
    if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      initModuleReducer(moduleName, rootReducer[moduleName]);
    }
  }
  function configRootComputed(computed) {
    if (!isPlainJsonObject$4(computed)) {
      throw new Error("StartUpOption.computed is not a plain json object!");
    }

    var moduleNames = okeys$2(computed);
    moduleNames.forEach(function (m) {
      return initModuleComputed(m, computed[m]);
    });
  }
  function configRootWatch(watch) {
    if (!isPlainJsonObject$4(watch)) {
      throw new Error("StartUpOption.watch is not a plain json object!");
    }

    var moduleNames = Object.keys(watch);
    moduleNames.forEach(function (m) {
      return initModuleWatch(m, watch[m]);
    });
  }
  function executeRootInit(init) {
    if (!init) return;

    if (!isPlainJsonObject$4(init)) {
      throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
    }

    var moduleNames = okeys$2(init);
    moduleNames.forEach(function (moduleName) {
      checkModuleName(moduleName, false, "there is no module state defined in store for init." + moduleName);
      var initFn = init[moduleName];

      if (initFn) {
        co_1(initFn).then(function (state) {
          makeSetStateHandler(moduleName)(state);
        });
      }
    });
    ccContext.init._init = init;
  }
  function configModuleSingleClass(moduleSingleClass) {
    if (!isPlainJsonObject$4(moduleSingleClass)) {
      throw new Error("StartupOption.moduleSingleClass is not a plain json object!");
    }

    safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
  }
  function configMiddlewares(middlewares) {
    if (middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      ccMiddlewares.length = 0; //防止热加载重复多次载入middlewares

      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
      });
    }
  }
  function configPlugins(plugins) {
    if (plugins.length > 0) {
      var ccPlugins = ccContext.plugins;
      ccPlugins.length = 0; //防止热加载重复多次载入plugins

      var moduleNames = okeys$2(ccContext.moduleName_stateKeys_);
      plugins.forEach(function (p) {
        ccPlugins.push(p);

        if (p.configure) {
          var conf = p.configure();
          p.name = conf.module;
          configure(conf.module, conf);
          moduleNames.forEach(function (m) {
            if (p.writeModuleState) {
              p.writeModuleState(conf.state, m);
            }
          });
        } else {
          throw new Error('a plugin must export configure handler!');
        }
      });
    }
  }

  function startup (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$store = _ref.store,
        store = _ref$store === void 0 ? {} : _ref$store,
        _ref$reducer = _ref.reducer,
        reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
        _ref$init = _ref.init,
        init = _ref$init === void 0 ? null : _ref$init,
        _ref$computed = _ref.computed,
        computed = _ref$computed === void 0 ? {} : _ref$computed,
        _ref$watch = _ref.watch,
        watch = _ref$watch === void 0 ? {} : _ref$watch,
        _ref$moduleSingleClas = _ref.moduleSingleClass,
        moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
        _ref$plugins = _ref.plugins,
        plugins = _ref$plugins === void 0 ? [] : _ref$plugins,
        _ref$isStrict = _ref.isStrict,
        isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
        _ref$isDebug = _ref.isDebug,
        isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
        _ref$errorHandler = _ref.errorHandler,
        errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
        _ref$isHot = _ref.isHot,
        isHot = _ref$isHot === void 0 ? false : _ref$isHot,
        _ref$autoCreateDispat = _ref.autoCreateDispatcher,
        autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat,
        _ref$isReducerArgsOld = _ref.isReducerArgsOldMode,
        isReducerArgsOldMode = _ref$isReducerArgsOld === void 0 ? false : _ref$isReducerArgsOld,
        _ref$bindCtxToMethod = _ref.bindCtxToMethod,
        bindCtxToMethod = _ref$bindCtxToMethod === void 0 ? false : _ref$bindCtxToMethod;

    try {
      util.justTip("cc version " + ccContext.info.version);
      ccContext.isHot = isHot;
      ccContext.errorHandler = errorHandler;
      ccContext.isStrict = isStrict;
      ccContext.isDebug = isDebug;
      ccContext.isReducerArgsOldMode = isReducerArgsOldMode;
      ccContext.bindCtxToMethod = bindCtxToMethod;

      if (ccContext.isCcAlreadyStartup) {
        var err = util.makeError(ERR.CC_ALREADY_STARTUP);

        if (util.isHotReloadMode()) {
          clearObject(ccContext.globalStateKeys);
          clearObject(ccContext.reducer._reducer);
          clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER], {});
          clearObject(ccContext.computed._computedFn);
          clearObject(ccContext.computed._computedValue);
          clearObject(ccContext.event_handlers_);
          clearObject(ccContext.ccUniqueKey_handlerKeys_);
          var cct = ccContext.ccClassKey_ccClassContext_;
          Object.keys(cct).forEach(function (ccClassKey) {
            var ctx = cct[ccClassKey];
            clearObject(ctx.ccKeys);
          });
          clearObject(ccContext.handlerKey_handler_);
          clearObject(ccContext.ccKey_ref_, [CC_DISPATCHER]);
          clearObject(ccContext.refs, [CC_DISPATCHER]);
          clearObject(ccContext.fragmentCcKeys);
          clearObject(ccContext.ccKey_option_);
          util.hotReloadWarning(err);
        } else throw err;
      }

      configModuleSingleClass(moduleSingleClass);
      configStoreState(store);
      configRootReducer(reducer);
      configRootComputed(computed);
      configRootWatch(watch);
      executeRootInit(init);
      configMiddlewares(middlewares);

      if (autoCreateDispatcher) {
        if (!ccContext.refs[CC_DISPATCHER]) {
          var Dispatcher = createDispatcher();
          var box = document.querySelector("#" + CC_DISPATCHER_BOX);

          if (!box) {
            box = document.createElement('div');
            box.id = CC_DISPATCHER_BOX;
            var boxSt = box.style;
            boxSt.position = 'fixed';
            boxSt.left = 0;
            boxSt.top = 0;
            boxSt.display = 'none';
            boxSt.zIndex = -888666;
            document.body.append(box);
          }

          ReactDOM.render(React__default.createElement(Dispatcher), box);
          util.justTip("[[startUp]]: cc create a CcDispatcher automatically");
        } else {
          util.justTip("[[startUp]]: CcDispatcher existed already");
        }
      } else {
        throw 'customizing Dispatcher is not allowed in current version cc';
      }

      if (window) {
        bindToWindow('CC_CONTEXT', ccContext);
        bindToWindow('ccc', ccContext);
        bindToWindow('cccc', ccContext.computed._computedValue);
      }

      ccContext.isCcAlreadyStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

      configPlugins(plugins);
    } catch (err) {
      if (errorHandler) errorHandler(err);else throw err;
    }
  }

  /**
   * @param {string} newModule
   * @param {string} existingModule
   */

  var _cloneModule = (function (newModule, existingModule, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        state = _ref.state,
        reducer = _ref.reducer,
        computed = _ref.computed,
        watch = _ref.watch,
        init = _ref.init;

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet');
    }

    checkModuleNameBasically(newModule);
    checkModuleName(existingModule, false);
    var mState = ccContext.store.getState(existingModule);
    var stateCopy = clone(mState);
    if (state) stateCopy = Object.assign(stateCopy, state);
    var reducerEx = ccContext.reducer._reducer[existingModule] || {};
    if (reducer) reducerEx = Object.assign(reducerEx, reducer);
    var computedEx = ccContext.computed._computedFn[existingModule] || {};
    if (computed) computedEx = Object.assign(computedEx, computed);
    var watchEx = ccContext.watch._watch[existingModule] || {};
    if (watch) watchEx = Object.assign(watchEx, watch);
    var initEx = ccContext.init._init[existingModule];
    if (init) initEx = init;
    var confObj = {
      state: stateCopy,
      reducer: reducerEx,
      computed: computedEx,
      watch: watchEx
    };
    if (initEx) confObj.init = initEx;
    configure(newModule, confObj);
  });

  /**
   * load will call startup
   * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
   * @param option
   */

  function _load (store, option) {
    if (store === void 0) {
      store = {};
    }

    if (option === void 0) {
      option = {};
    }

    if (!util.isPlainJsonObject(store)) {
      throw new Error('[[load]]: param error, store is not a plain json object');
    }

    if (!util.isPlainJsonObject(option)) {
      throw new Error('[[load]]: param error, option is not a plain json object');
    }

    var _store = {};
    var _reducer = {};
    var _watch = {};
    var _computed = {};
    var _init = {};
    var _moduleSingleClass = {};
    var moduleNames = Object.keys(store);
    moduleNames.forEach(function (m) {
      var config = store[m];
      var state = config.state,
          reducer = config.reducer,
          watch = config.watch,
          computed = config.computed,
          init = config.init,
          isClassSingle = config.isClassSingle;
      if (state) _store[m] = state;
      if (reducer) _reducer[m] = reducer;
      if (watch) _watch[m] = watch;
      if (computed) _computed[m] = computed;
      if (init) _init[m] = init;
      if (typeof isClassSingle === 'boolean') _moduleSingleClass[m] = isClassSingle;
    });
    if (!util.isObjectNotNull(_init)) _init = null;
    var startupOption = {
      store: _store,
      reducer: _reducer,
      watch: _watch,
      computed: _computed,
      init: _init,
      moduleSingleClass: _moduleSingleClass
    };
    var _option = option,
        middlewares = _option.middlewares,
        plugins = _option.plugins,
        isStrict = _option.isStrict,
        isDebug = _option.isDebug,
        errorHandler = _option.errorHandler,
        isHot = _option.isHot,
        autoCreateDispatcher = _option.autoCreateDispatcher,
        reducer = _option.reducer,
        isReducerArgsOldMode = _option.isReducerArgsOldMode,
        bindCtxToMethod = _option.bindCtxToMethod;

    if (reducer) {
      if (!util.isPlainJsonObject(reducer)) {
        throw new Error('[[load]]: param option.reducer error, it is not a plain json object');
      }

      Object.keys(reducer).forEach(function (reducerModule) {
        _reducer[reducerModule] = reducer[reducerModule];
      });
    }

    var mergedOption = Object.assign(startupOption, {
      middlewares: middlewares,
      plugins: plugins,
      isStrict: isStrict,
      isDebug: isDebug,
      errorHandler: errorHandler,
      isHot: isHot,
      autoCreateDispatcher: autoCreateDispatcher,
      isReducerArgsOldMode: isReducerArgsOldMode,
      bindCtxToMethod: bindCtxToMethod
    });
    startup(mergedOption);
  }

  /****
   * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
   * but you can not register multi react class with a same ccClassKey!
   * @param {object} registerOption
   * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
   * @param {Array<string>|string} [registerOption.sharedStateKeys] 
   * declare which state keys's state changing will shared to current cc class's module,
   * default is empty array, that means any state key's value changing will not effect it's module state,
   * if you define it like ['foo', 'bar'], when current cc instance change foo and bar, 
   * it will effect other cc instance only if any of them whose sharedStateKeys include any key of foo and bar,
   * and other cc instance change foo and bar will effect current cc instance also,
   * your can also define it as '*', it means current cc class will watch its module whole state,
   * note! the keys must have been declared in module state.
   * @param {{ [moduleName:string]: keys: string[] | '*' }} [registerOption.connect]
   * @param {string} [registerOption.reducerModule] default is equal as module if you don't declare it
   * if you call cc instance api $$dispatch without module and reducerMoudle like below
   * ```
   *    this.$$dispatch({type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('doStaff', {foo:1, bar:2});
   * ```
   * cc will find current cc class's reducerModule function named doStaff to execute 
   * and will change current cc class's moudle state,
   * so you don't have to write code like below if current cc class module is M1 
   * and you always want to use R1 reducer function to generate new state
   * ```
   *    this.$$dispatch({module:'M1', reducerModule:'R1', type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('M1/R1/doStaff', {foo:1, bar:2});
   * ```
   * 
   * ============   !!!!!!  ============
   * note if you really want to change other module's state and use other reducer function, you must input module and reducerModule
   * in your $$dispatch method, or they will been replaced by current cc class's default module and default reducerModule
   * ```
   *    this.$$dispatch({module:'M2', reducerModule:'R2', type:'doStaff', payload:{foo:1, bar:2}});
   * ```
   * @param {string} [registerOption.isPropsProxy] default is true
   * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
   * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
   * you can set isPropsProxy as true, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
   * all the cc instance method and property you can only get them from `this.props`, for example
   * ```
   *    @cc.register('BasicForms',{
   *      connect: {'form': ['regularFormSubmitting']},
   *      isPropsProxy: true 
   *    })
   *    @Form.create()
   *    export default class BasicForms extends PureComponent {
   *      componentDidMount()=>{
   *        this.props.$$dispatch('form/getInitData');
   *      }
   *      render(){
   *        const {regularFormSubmitting} = this.props.$$connectedState.from;
   *      }
   *    }
   * ```
   * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
   * @param {string} [registerOption.isSingle] default is false
   * if you only allow current cc class only initialize one time, 
   * that means there is only one cc instance can be existed for current cc class at most,
   * you can define registerOption.isSingle as true, it just like singleton mode in java coding^_^
   */

  function register$1 (ccClassKey, registerOption) {
    if (registerOption) {
      delete registerOption.__checkStartUp;
      delete registerOption.__calledBy;
    }

    return register(ccClassKey, registerOption);
  }

  /****
   * short for register
   * the option's definition is also been changed
   * option.module is called m for short 
   * option.sharedStateKeys is called s for short 
   * option.connect is called pm for c 
   * option.isSingle is called is for short 
   * option.reducerModule is called re for short 
   * option.isPropsProxy is called ip for short 
   */

  function _r (ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.m,
        sharedStateKeys = _ref.s,
        storedStateKeys = _ref.st,
        connect = _ref.c,
        isSingle = _ref.is,
        reducerModule = _ref.re,
        isPropsProxy = _ref.ip;

    return register$1(ccClassKey, {
      isPropsProxy: isPropsProxy,
      module: module,
      sharedStateKeys: sharedStateKeys,
      storedStateKeys: storedStateKeys,
      connect: connect,
      isSingle: isSingle,
      reducerModule: reducerModule
    });
  }

  function _registerToDefault (ccClassKey, option) {
    if (option === void 0) {
      option = {};
    }

    if (!option.sharedStateKeys) option.sharedStateKeys = '*';
    option.module = MODULE_DEFAULT;
    return register$1(ccClassKey, option);
  }

  function _registerSingleClassToDefault (ccClassKey, option) {
    if (option === void 0) {
      option = {};
    }

    if (!option.sharedStateKeys) option.sharedStateKeys = '*';
    option.module = MODULE_DEFAULT;
    option.isSingle = true;
    return register$1(ccClassKey, option);
  }

  var vbi$4 = util.verboseInfo;
  /**
   * @description
   * @author zzk
   * @export
   * @param {string} keyDesc '{ccClassKey}' |  '{ccClassKey}/'  | '{ccClassKey}/{ccKey}'
   * @param {string} method
   * @param {any[]} args
   * @returns
   */

  function _call (keyDesc, method) {
    var _ref$method;

    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
        ccKey_ref_ = ccContext.ccKey_ref_;
    var ccClassKey = '';
    var ccKey = '';

    if (keyDesc.includes('/')) {
      var _keyDesc$split = keyDesc.split('/'),
          key1 = _keyDesc$split[0],
          key2 = _keyDesc$split[1];

      ccClassKey = key1;
      ccKey = key2;
    } else {
      ccClassKey = keyDesc;
    }

    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext) {
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$4(" ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccKey) {
      var ccUniKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      ref = ccKey_ref_[ccUniKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccKey_ref_[ccKeys[0]]; // pick first one
    }

    if (!ref) {
      var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$4(" ccClassKey:" + ccClassKey + " ccKey:" + ccKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$4(" method:" + method)); // only error


      return console.error(_err2.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
  }

  /****
   * if you are sure the input state is really belong to global state, call cc.setGlobalState,
   * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
   */

  function setGlobalState (state, delayMs, throwError) {
    if (delayMs === void 0) {
      delayMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.setGlobalState(state, delayMs);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function throwApiCallError() {
    throw new Error("api doc: cc.setState(module:string, state:object, delayMs?:number, skipMiddleware?:boolean, throwError?:boolean)");
  }

  function _setState (module, state, delayMs, identity, skipMiddleware, throwError) {
    if (delayMs === void 0) {
      delayMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    if (module === undefined && state === undefined) {
      throwApiCallError();
    }

    if (typeof module !== 'string') {
      throwApiCallError();
    }

    setState(module, state, delayMs, identity, skipMiddleware, throwError);
  }

  function _set (moduledKeyPath, val, delay, idt) {
    var dispatcher = pickOneRef();
    dispatcher.$$set(moduledKeyPath, val, delay, idt);
  }

  var getState$5 = ccContext.store.getState;

  var getGlobalState = ccContext.store.getGlobalState;

  var _computedValue$2 = ccContext.computed._computedValue;
  var _getComputed = (function (module) {
    return _computedValue$2[module];
  });

  function _emit (event) {
    if (event === undefined) {
      throw new Error("api doc: cc.emit(event:String, ...args)");
    }

    try {
      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      ref.$$emit.apply(ref, [event].concat(args));
    } catch (err) {
      util.justWarning(err.message);
    }
  }

  function _emitWith (event, option) {
    if (event === undefined) {
      throw new Error("api doc: cc.emitWith(event:string, option:{module?:string, ccClassKey?:string, identity?:string} ...args)");
    }

    try {
      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      ref.$$emitWith.apply(ref, [event, option].concat(args));
    } catch (err) {
      if (option.throwError) throw err;else util.justWarning(err.message);
    }
  }

  function _off (event, option) {
    try {
      var ref = pickOneRef();
      ref.$$off(event, option);
    } catch (err) {
      if (option.throwError) throw err;else util.justWarning(err.message);
    }
  }

  /**
   * 
   * @param {*} ccClassKey 
   * @param {object} connectSpec { [module:string]: value: string[] | '*' }
   * @param {object} option 
   * @param {boolean} [option.isPropsProxy] default is false
   * @param {boolean} [option.isSingle] default is false
   * @param {string} [option.module]
   * @param {Array<string>} [option.sharedStateKeys]
   */

  function _connect (ccClassKey, connectSpec, option) {
    if (option === void 0) {
      option = {};
    }

    var mergedOption = Object.assign({
      connect: connectSpec
    }, option);
    return register$1(ccClassKey, mergedOption);
  }

  var ccKey_ref_$3 = ccContext.ccKey_ref_;
  function getDispatcherRef () {
    var ref = ccKey_ref_$3[CC_DISPATCHER];

    if (!ref) {
      if (util.isHotReloadMode()) {
        util.justTip('in hot reload mode, CC_DISPATCHER initialized more than one time');
      } else {
        throw util.makeError(ERR.CC_NO_DISPATCHER_FOUND);
      }
    }

    return ref;
  }

  var ccClassKey_ccClassContext_$3 = ccContext.ccClassKey_ccClassContext_,
      fragmentFeature_classKey_ = ccContext.fragmentFeature_classKey_,
      _ccContext$store$2 = ccContext.store,
      getState$6 = _ccContext$store$2.getState,
      getPrevState = _ccContext$store$2.getPrevState,
      moduleName_stateKeys_$3 = ccContext.moduleName_stateKeys_,
      _reducerModule_fnNames_ = ccContext.reducer._reducerModule_fnNames_,
      _computedValue$3 = ccContext.computed._computedValue;
  var okeys$3 = okeys;
  /**
   * 根据connect参数动态的把CcFragment划为某个ccClassKey的实例，同时计算出stateToPropMapping值
   * @param connectSpec 形如: {foo:'*', bar:['b1', 'b2']}
   */

  function getFragmentClassKeyAndStpMapping(connectSpec, fragmentModule) {
    if (!isObjectNotNull(connectSpec) && fragmentModule == MODULE_DEFAULT) {
      //代表没有connect到store任何模块的CcFragment
      return {
        ccClassKey: CC_FRAGMENT_PREFIX + "_0",
        stateToPropMapping: null
      };
    }

    var _getFeatureStrAndStpM = getFeatureStrAndStpMapping(connectSpec, fragmentModule),
        featureStr = _getFeatureStrAndStpM.featureStr,
        stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping,
        connectedModuleNames = _getFeatureStrAndStpM.connectedModuleNames;

    var ccClassKey = fragmentFeature_classKey_[featureStr];

    if (ccClassKey) {
      return {
        ccClassKey: ccClassKey,
        stateToPropMapping: stateToPropMapping,
        connectedModuleNames: connectedModuleNames
      };
    } else {
      var oldFragmentNameCount = ccContext.fragmentNameCount;
      var fragmentNameCount = oldFragmentNameCount + 1;
      ccContext.fragmentNameCount = fragmentNameCount;
      ccClassKey = CC_FRAGMENT_PREFIX + "_" + fragmentNameCount;
      fragmentFeature_classKey_[featureStr] = ccClassKey;
      return {
        ccClassKey: ccClassKey,
        stateToPropMapping: stateToPropMapping,
        connectedModuleNames: connectedModuleNames
      };
    }
  }

  var idSeq = 0;

  function getEId() {
    idSeq++;
    return Symbol("__autoGen_" + idSeq + "__");
  }

  var CcFragment =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(CcFragment, _Component);

    function CcFragment(props, context) {
      var _this;

      _this = _Component.call(this, props, context) || this;
      _this.__beforeMount = _this.__beforeMount.bind(_assertThisInitialized(_this));
      var ccKey = props.ccKey,
          _props$connect = props.connect,
          connectSpec = _props$connect === void 0 ? {} : _props$connect,
          _props$state = props.state,
          state = _props$state === void 0 ? {} : _props$state,
          module = props.module,
          storedStateKeys = props.storedStateKeys,
          _props$sharedStateKey = props.sharedStateKeys,
          sharedStateKeys = _props$sharedStateKey === void 0 ? '*' : _props$sharedStateKey; //计算fragment所属的模块

      var fragmentModule = module || MODULE_DEFAULT;
      var mergedState = Object.assign(state, getState$6(fragmentModule));
      _this.state = mergedState;
      var _storedStateKeys = [];

      if (storedStateKeys !== undefined) {
        if (!ccKey) throw new Error('you must supply ccKey explicitly to props if you specify storedStateKeys');
        _storedStateKeys = storedStateKeys;
      }

      var _sharedStateKeys = sharedStateKeys;

      if (sharedStateKeys === '*') {
        _sharedStateKeys = moduleName_stateKeys_$3[fragmentModule];
      }

      var _getFragmentClassKeyA = getFragmentClassKeyAndStpMapping(connectSpec, fragmentModule),
          ccClassKey = _getFragmentClassKeyA.ccClassKey,
          stateToPropMapping = _getFragmentClassKeyA.stateToPropMapping,
          connectedModuleNames = _getFragmentClassKeyA.connectedModuleNames;

      var ccUniqueKey = '',
          isCcUniqueKeyAutoGenerated = false;

      if (ccKey) {
        // for CcFragment, if user supply ccKey to props, ccUniqueKey will equal ccKey
        ccUniqueKey = ccKey;
      } else {
        var _base$computeCcUnique = computeCcUniqueKey(false, ccClassKey, ccKey, true),
            ck = _base$computeCcUnique.ccKey,
            cuk = _base$computeCcUnique.ccUniqueKey,
            ag = _base$computeCcUnique.isCcUniqueKeyAutoGenerated;

        ccUniqueKey = cuk;
        isCcUniqueKeyAutoGenerated = ag;
        ccKey = ck;
      }

      var outProps = props.props || props; //把最外层的props传递给用户

      buildCcClassContext(ccClassKey, fragmentModule, sharedStateKeys, _sharedStateKeys, stateToPropMapping, connectedModuleNames, true);
      setRef(_assertThisInitialized(_this), false, ccClassKey, ccKey, ccUniqueKey, {}, true); // for CcFragment, just put ccClassKey to module's cc class keys

      var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_;
      var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_, fragmentModule);
      if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
      var ctx = ccClassKey_ccClassContext_$3[ccClassKey];
      var connectedComputed = ctx.connectedComputed || {};
      var connectedState = ctx.connectedState || {};
      var moduleState = getState$6(fragmentModule);
      var moduleComputed = _computedValue$3[fragmentModule] || {};

      var reactForceUpdateRef = _this.forceUpdate.bind(_assertThisInitialized(_this));

      var reactSetStateRef = _this.setState.bind(_assertThisInitialized(_this));

      var refConnectedComputed = {};
      var refComputed = {};
      okeys$3(connectSpec).forEach(function (moduleName) {
        refConnectedComputed[moduleName] = {};
      });
      var ccState = {
        storedStateKeys: _storedStateKeys,
        sharedStateKeys: _sharedStateKeys,
        module: fragmentModule,
        ccClassKey: ccClassKey,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
        stateToPropMapping: stateToPropMapping,
        renderCount: 0,
        initTime: Date.now(),
        connect: connectSpec
      };
      _this.cc = {
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        ccClassKey: ccClassKey,
        // onUrlChanged: null,
        prevState: mergedState,
        ccState: ccState,
        refConnectedComputed: refConnectedComputed,
        refComputed: refComputed,
        watch: null,
        watchSpec: null,
        computed: null,
        computedSpec: null,
        reactForceUpdate: function reactForceUpdate(cb) {
          ccState.renderCount += 1; //方便用户直接绑定forceUpdate

          if (typeof cb !== 'function') reactForceUpdateRef();else reactForceUpdateRef(cb);
        },
        reactSetState: function reactSetState(state, cb) {
          ccState.renderCount += 1;
          reactSetStateRef(state, cb);
        }
      }; // hook implement fo CcFragment

      var __hookMeta = {
        isCcFragmentMounted: false,
        useStateCount: 0,
        useStateCursor: 0,
        stateArr: [],
        useEffectCount: 0,
        useEffectCursor: 0,
        effectCbArr: [],
        effectSeeAoa: [],
        // shouldEffectExecute array of array
        effectSeeResult: [],
        // collect every effect fn's shouldExecute result
        effectCbReturnArr: []
      };
      _this.__hookMeta = __hookMeta;
      var hook = {
        useState: function useState(initialState) {
          var cursor = __hookMeta.useStateCursor;
          var stateArr = __hookMeta.stateArr;
          __hookMeta.useStateCursor++;

          if (__hookMeta.isCcFragmentMounted === false) {
            //render CcFragment before componentDidMount
            __hookMeta.useStateCount++;
            stateArr[cursor] = initialState;
          } else {
            cursor = cursor % __hookMeta.useStateCount;
          }

          var setter = function setter(e) {
            if (e.currentTarget && e.type) {
              var _sync;

              __sync((_sync = {}, _sync[CURSOR_KEY] = cursor, _sync), e);
            } else {
              stateArr[cursor] = e;

              _this.cc.reactForceUpdate();
            }
          };

          return [stateArr[cursor], setter];
        },
        useEffect: function useEffect(cb, shouldEffectExecute) {
          var cursor = __hookMeta.useEffectCursor;
          __hookMeta.useEffectCursor++;

          if (__hookMeta.isCcFragmentMounted === false) {
            __hookMeta.effectCbArr.push(cb);

            __hookMeta.effectSeeAoa.push(shouldEffectExecute);

            __hookMeta.useEffectCount++;
          } else {
            // if code running jump into this block, CcFragment already mounted, and now compute result for didUpdate
            cursor = cursor % __hookMeta.useEffectCount;

            if (Array.isArray(shouldEffectExecute)) {
              var len = shouldEffectExecute.length;

              if (len == 0) {
                __hookMeta.effectSeeResult[cursor] = false; // effect fn will been executed only in didMount
              } else {
                // compare prevSee and curSee
                var effectSeeResult = false;
                var prevSeeArr = __hookMeta.effectSeeAoa[cursor];

                if (!prevSeeArr) {
                  effectSeeResult = true;
                } else {
                  for (var i = 0; i < len; i++) {
                    if (shouldEffectExecute[i] !== prevSeeArr[i]) {
                      effectSeeResult = true;
                      break;
                    }
                  }
                }

                __hookMeta.effectSeeAoa[cursor] = shouldEffectExecute;
                __hookMeta.effectSeeResult[cursor] = effectSeeResult;
                if (effectSeeResult) __hookMeta.effectCbArr[cursor] = cb;
              }
            } else {
              __hookMeta.effectSeeResult[cursor] = true; // effect fn will always been executed in didMount and didUpdate

              __hookMeta.effectSeeAoa[cursor] = shouldEffectExecute;
              __hookMeta.effectCbArr[cursor] = cb;
            }
          }
        }
      };
      var dispatcher = getDispatcherRef();

      var __sync = function __sync(spec, e) {
        if (spec[CURSOR_KEY] !== undefined) {
          //来自hook生成的setter调用
          var _cursor = spec[CURSOR_KEY];
          __hookMeta.stateArr[_cursor] = e.currentTarget.value;

          _this.cc.reactForceUpdate();

          return;
        }

        var mockE = buildMockEvent(spec, e);
        if (!mockE) return; //参数无效

        var currentTarget = mockE.currentTarget;
        var dataset = currentTarget.dataset;
        if (e && e.stopPropagation) e.stopPropagation();
        var ccsync = dataset.ccsync;

        if (ccsync.startsWith('/')) {
          dataset.ccsync = "" + _this.cc.ccState.module + ccsync; //附加上默认模块值
        }

        if (ccsync.includes('/')) {
          // syncModuleState 同步模块的state状态
          dispatcher.$$sync(mockE);
        } else {
          // syncLocalState 同步本地的state状态
          var _extractStateByCcsync = extractStateByCcsync(dataset.ccsync, currentTarget.value, dataset.ccint, _this.state, mockE.isToggleBool),
              _state2 = _extractStateByCcsync.state;

          __fragmentParams.setState(_state2);
        }
      };

      var effectItems = []; // {fn:function, status:0, eId:'', immediate:true}

      var eid_effectReturnCb_ = {}; // fn

      _this.__staticEffectMeta = {
        effectItems: effectItems,
        eid_effectReturnCb_: eid_effectReturnCb_
      };
      var __fragmentParams = {
        module: fragmentModule,
        isCcFragment: true,
        refComputed: refComputed,
        refConnectedComputed: refConnectedComputed,
        connectedComputed: connectedComputed,
        connectedState: connectedState,
        moduleState: moduleState,
        moduleComputed: moduleComputed,
        // 新增defineEffect相关的支持
        defineEffect: function defineEffect(fn, stateKeys, eId, immediate) {
          if (immediate === void 0) {
            immediate = true;
          }

          if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');

          if (stateKeys !== null && stateKeys !== undefined) {
            if (!Array.isArray(stateKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
          }

          var _fn = fn.bind(_assertThisInitialized(_this), _this.__fragmentParams, outProps);

          var _eId = eId || getEId();

          var effectItem = {
            fn: _fn,
            stateKeys: stateKeys,
            status: EFFECT_AVAILABLE,
            eId: _eId,
            immediate: immediate
          };
          effectItems.push(effectItem);
        },
        stopEffect: function stopEffect(eId) {
          var target = effectItems.find(function (v) {
            return v.eId === eId;
          });
          if (target) target.status = EFFECT_STOPPED;
        },
        resumeEffect: function resumeEffect(eId) {
          var target = effectItems.find(function (v) {
            return v.eId === eId;
          });
          if (target) target.status = EFFECT_AVAILABLE;
        },
        removeEffect: function removeEffect(eId) {
          var targetIdx = effectItems.findIndex(function (v) {
            return v.eId === eId;
          });
          if (targetIdx >= 0) effectItems.splice(targetIdx, 1);
        },
        stopAllEffect: function stopAllEffect() {
          effectItems.forEach(function (v) {
            return v.status = EFFECT_STOPPED;
          });
        },
        resumeAllEffect: function resumeAllEffect() {
          effectItems.forEach(function (v) {
            return v.status = EFFECT_AVAILABLE;
          });
        },
        removeAllEffect: function removeAllEffect() {
          effectItems.length = 0;
        },
        defineWatch: function defineWatch(watch) {
          var watchSpec = getWatchSpec(watch, _this.__fragmentParams, _this.cc.ccState.module);
          _this.cc.watch = watch;
          _this.cc.watchSpec = watchSpec;
        },
        defineComputed: function defineComputed(computed) {
          var computedSpec = getComputedSpec(computed, _this.__fragmentParams, _this.cc.ccState.module);
          _this.cc.computed = computed;
          _this.cc.computedSpec = computedSpec;
        },
        settings: {},
        reducer: {},
        lazyReducer: {},
        // ------ end ------
        //对布尔值自动取反
        syncBool: function syncBool(e, delay, idt) {
          var _sync$bind;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return __sync.bind(null, (_sync$bind = {}, _sync$bind[CCSYNC_KEY] = e, _sync$bind.type = 'bool', _sync$bind.delay = delay, _sync$bind.idt = idt, _sync$bind));

          __sync({
            type: 'bool'
          }, e);
        },
        //if <Input onChange={(value:string, value2:string)=>void} />
        // <Input onChange={ctx.sync} /> not work!!!
        // <Input onChange={ctx.sync('foo/f1')} /> ok
        // only <input data-ccsync="foo/f1" onChange={ctx.sync} /> ok
        // only <input onChange={ctx.sync('foo/f1')} /> ok
        sync: function sync(e, val, delay, idt) {
          var _sync$bind2;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return __sync.bind(null, (_sync$bind2 = {}, _sync$bind2[CCSYNC_KEY] = e, _sync$bind2.type = 'val', _sync$bind2.val = val, _sync$bind2.delay = delay, _sync$bind2.idt = idt, _sync$bind2));

          __sync({
            type: 'val'
          }, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />

        },
        //因为val可以是任意类型值，所以不再需要提供setInt
        set: function set(ccsync, val, delay, idt) {
          var _sync2;

          __sync((_sync2 = {}, _sync2[CCSYNC_KEY] = ccsync, _sync2.type = 'val', _sync2.val = val, _sync2.delay = delay, _sync2.idt = idt, _sync2));
        },
        //对布尔值自动取反
        setBool: function setBool(ccsync, delay, idt) {
          var _sync3;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          __sync((_sync3 = {}, _sync3[CCSYNC_KEY] = ccsync, _sync3.type = 'bool', _sync3.delay = delay, _sync3.idt = idt, _sync3));
        },
        // <Input onChange={ctx.syncInt} /> not work!!!
        // <Input onChange={ctx.syncInt('foo/bar')} /> ok
        // <input onChange={ctx.syncInt('foo/bar')} /> ok
        // <input data-ccsync="foo/f1" onChange={ctx.syncInt('foo/fq')} /> ok
        syncInt: function syncInt(e, delay, idt) {
          var _sync$bind3;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return __sync.bind(null, (_sync$bind3 = {}, _sync$bind3[CCSYNC_KEY] = e, _sync$bind3.type = 'int', _sync$bind3.delay = delay, _sync$bind3.idt = idt, _sync$bind3));

          __sync({
            type: 'int'
          }, e); //<input data-ccsync="foo/f1" onChange={ctx.syncInt} />

        },
        onUrlChanged: function onUrlChanged(cb) {
          _this.cc.onUrlChanged = cb.bind(_assertThisInitialized(_this));
        },
        hook: hook,
        emit: function emit(event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          findEventHandlersToPerform.apply(ev, [event, {
            identity: null
          }].concat(args));
        },
        emitIdentity: function emitIdentity(event, identity) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          findEventHandlersToPerform.apply(ev, [event, {
            identity: identity
          }].concat(args));
        },
        on: function on(event, handler) {
          bindEventHandlerToCcContext(_this.cc.ccState.module, ccClassKey, ccUniqueKey, event, null, handler);
        },
        onIdentity: function onIdentity(event, identity, handler) {
          bindEventHandlerToCcContext(_this.cc.ccState.module, ccClassKey, ccUniqueKey, event, identity, handler);
        },
        dispatch: function dispatch(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) {
          var stateModule = _this.cc.ccState.module;

          var d = dispatcher.__$$getDispatchHandler(_assertThisInitialized(_this), _this.state, false, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule, null, null, -1);

          return d(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity);
        },
        lazyDispatch: function lazyDispatch(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) {
          var stateModule = _this.cc.ccState.module;

          var d = dispatcher.__$$getDispatchHandler(_assertThisInitialized(_this), _this.state, true, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule, null, null, -1);

          return d(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity);
        },
        callDispatch: function callDispatch() {
          var _this$__fragmentParam;

          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return (_this$__fragmentParam = _this.__fragmentParams.dispatch).bind.apply(_this$__fragmentParam, [_assertThisInitialized(_this)].concat(args));
        },
        callLazyDispatch: function callLazyDispatch() {
          var _this$__fragmentParam2;

          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return (_this$__fragmentParam2 = _this.__fragmentParams.lazyDispatch).bind.apply(_this$__fragmentParam2, [_assertThisInitialized(_this)].concat(args));
        },
        invoke: dispatcher.__$$getInvokeHandler(_assertThisInitialized(_this), fragmentModule, ccKey, ccUniqueKey, ccClassKey),
        lazyInvoke: dispatcher.__$$getInvokeHandler(_assertThisInitialized(_this), fragmentModule, ccKey, ccUniqueKey, ccClassKey, {
          isLazy: true
        }),
        setModuleState: function setModuleState(module, state, delay, identity) {
          var _module = module,
              _state = state,
              _delay = delay,
              _identity = identity;

          if (typeof module === 'object') {
            _module = _this.cc.ccState.module;
            _state = module;
            _delay = state;
            _identity = delay;
          }

          changeRefState(_state, {
            calledBy: SET_MODULE_STATE,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            module: _module,
            delay: _delay,
            identity: _identity
          }, _assertThisInitialized(_this));
        },
        setGlobalState: function setGlobalState(state, delay, identity) {
          _this.__fragmentParams.setModuleState(MODULE_GLOBAL, state, delay, identity);
        },
        state: mergedState,
        props: outProps,
        fragmentProps: props,
        setState: function setState(state, cb, delay, identity) {
          changeRefState(state, {
            calledBy: SET_STATE,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            module: fragmentModule,
            cb: cb,
            delay: delay,
            identity: identity
          }, _assertThisInitialized(_this));
        },
        forceUpdate: function forceUpdate(cb, delay, identity) {
          changeRefState(_this.state, {
            calledBy: FORCE_UPDATE,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            module: fragmentModule,
            cb: cb,
            delay: delay,
            identity: identity
          }, _assertThisInitialized(_this));
        }
      };
      _this.__fragmentParams = __fragmentParams;

      _this.__beforeMount();

      return _this;
    }

    var _proto = CcFragment.prototype;

    _proto.__beforeMount = function __beforeMount() {
      var _this2 = this;

      var _this$props = this.props,
          setup = _this$props.setup,
          bindCtxToMethod = _this$props.bindCtxToMethod;
      var ctx = this.__fragmentParams;
      var reducer = ctx.reducer;
      var lazyReducer = ctx.lazyReducer;
      var thisCc = this.cc;
      var thisState = this.state;
      var _thisCc$ccState = thisCc.ccState,
          connect = _thisCc$ccState.connect,
          module = _thisCc$ccState.module;
      var dispatch = this.__fragmentParams.dispatch;
      var lazyDispatch = this.__fragmentParams.lazyDispatch;
      var connectModules = okeys$3(connect);
      var allModules = connectModules.slice();
      if (!allModules.includes(module)) allModules.push(module); //向实例的reducer里绑定方法，key:{module} value:{reducerFn}

      allModules.forEach(function (m) {
        var refReducerFnObj = safeGetObjectFromObject(reducer, m);
        var refLazyReducerFnObj = safeGetObjectFromObject(lazyReducer, m);
        var fnNames = _reducerModule_fnNames_[m] || [];
        fnNames.forEach(function (fnName) {
          refReducerFnObj[fnName] = function (payload, delay, idt) {
            return dispatch(m + "/" + fnName, payload, delay, idt);
          };

          refLazyReducerFnObj[fnName] = function (payload, delay, idt) {
            return lazyDispatch(m + "/" + fnName, payload, delay, idt);
          };
        });
      }); //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后，分析computedSpec之前

      if (setup) {
        if (typeof setup !== 'function') throw new Error('type of setup must be function');
        var settingsObj = setup(this.__fragmentParams) || {};
        if (!isPlainJsonObject(settingsObj)) throw new Error('type of setup return result must be an plain json object');
        var globalBindCtx = ccContext.bindCtxToMethod; //优先读自己的，再读全局的

        if (bindCtxToMethod === true || globalBindCtx === true && bindCtxToMethod !== false) {
          okeys$3(settingsObj).forEach(function (name) {
            var settingValue = settingsObj[name];
            if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(_this2, ctx);
          });
        }

        ctx.settings = settingsObj;
      }

      var computedSpec = thisCc.computedSpec; //触发计算computed

      if (computedSpec) {
        var refComputed = thisCc.refComputed,
            refConnectedComputed = thisCc.refConnectedComputed; //这里操作的是moduleState，最后一个参数置为true，让无模块的stateKey的计算值能写到refComputed里,

        computeValueForRef(module, computedSpec, refComputed, refConnectedComputed, thisState, thisState, this.__fragmentParams);
        connectModules.forEach(function (m) {
          var mState = getState$6(m);
          computeValueForRef(m, computedSpec, refComputed, refConnectedComputed, mState, mState, _this2.__fragmentParams);
        });
      }
    };

    _proto.executeHookEffect = function executeHookEffect(callByDidMount) {
      var ctx = this.__fragmentParams;
      var _this$__hookMeta = this.__hookMeta,
          effectCbArr = _this$__hookMeta.effectCbArr,
          effectCbReturnArr = _this$__hookMeta.effectCbReturnArr;

      if (callByDidMount) {
        this.__hookMeta.isCcFragmentMounted = true;
        effectCbArr.forEach(function (cb) {
          var cbReturn = cb(ctx);

          if (typeof cbReturn === 'function') {
            effectCbReturnArr.push(cbReturn);
          } else {
            effectCbReturnArr.push(null);
          }
        });
      } else {
        var effectSeeResult = this.__hookMeta.effectSeeResult;
        effectCbArr.forEach(function (cb, idx) {
          var shouldEffectExecute = effectSeeResult[idx];

          if (shouldEffectExecute) {
            var cbReturn = cb(ctx);

            if (typeof cbReturn === 'function') {
              effectCbReturnArr[idx] = cbReturn;
            }
          }
        });
      }
    };

    _proto.executeSetupEffect = function executeSetupEffect(callByDidMount) {
      var _this$__staticEffectM = this.__staticEffectMeta,
          effectItems = _this$__staticEffectM.effectItems,
          eid_effectReturnCb_ = _this$__staticEffectM.eid_effectReturnCb_;
      var ctx = this.__fragmentParams;

      if (callByDidMount) {
        effectItems.forEach(function (item) {
          if (item.immediate === false) return;
          var cb = item.fn(ctx);
          if (cb) eid_effectReturnCb_[item.eId] = cb;
        });
      } else {
        //callByDidUpdate
        var prevState = this.cc.prevState;
        var curState = this.state;
        effectItems.forEach(function (item) {
          var status = item.status,
              stateKeys = item.stateKeys,
              fn = item.fn,
              eId = item.eId;
          if (status === EFFECT_STOPPED) return;

          if (stateKeys) {
            var keysLen = stateKeys.length;
            if (keysLen === 0) return;
            var shouldEffectExecute = false;

            for (var i = 0; i < keysLen; i++) {
              var key = stateKeys[i];
              var targetCurState = void 0,
                  targetPrevState = void 0,
                  targetKey = void 0;

              if (key.includes('/')) {
                var _key$split = key.split('/'),
                    module = _key$split[0],
                    unmoduledKey = _key$split[1];

                var _prevState = getPrevState(module);

                if (!_prevState) {
                  justWarning("key[" + key + "] is invalid, its module[" + module + "] has not been declared in store!");
                  continue;
                }

                if (!moduleName_stateKeys_$3[module].includes(unmoduledKey)) {
                  justWarning("key[" + key + "] is invalid, its unmoduledKey[" + unmoduledKey + "] has not been declared in state!");
                  continue;
                }

                targetCurState = getState$6(module);
                targetPrevState = _prevState;
                targetKey = unmoduledKey;
              } else {
                targetCurState = curState;
                targetPrevState = prevState;
                targetKey = key;
              }

              if (targetPrevState[targetKey] !== targetCurState[targetKey]) {
                shouldEffectExecute = true;
                break;
              }
            }

            if (shouldEffectExecute) {
              var cb = fn(ctx);
              if (cb) eid_effectReturnCb_[eId] = cb;
            }
          } else {
            var _cb = fn(ctx);

            if (_cb) eid_effectReturnCb_[eId] = _cb;
          }
        });
      }
    };

    _proto.componentDidMount = function componentDidMount() {
      this.executeSetupEffect(true);
      this.executeHookEffect(true);
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(_, nextState) {
      return this.state !== nextState;
    };

    _proto.componentWillUpdate = function componentWillUpdate() {
      this.cc.prevState = this.state;
    };

    _proto.componentDidUpdate = function componentDidUpdate() {
      this.executeSetupEffect();
      this.executeHookEffect();
      this.cc.prevState = this.state; //!!!  重置prevState，防止其他模块的更新操作再次执行executeSetupEffect时，判断shouldEffectExecute失效
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      var ctx = this.__fragmentParams;

      this.__hookMeta.effectCbReturnArr.forEach(function (cb) {
        if (typeof cb === 'function') cb(ctx);
      });

      var eid_effectReturnCb_ = this.__staticEffectMeta.eid_effectReturnCb_;
      Object.getOwnPropertySymbols(eid_effectReturnCb_).forEach(function (symbolKey) {
        var cb = eid_effectReturnCb_[symbolKey];
        if (typeof cb === 'function') cb(ctx);
      });
      okeys$3(eid_effectReturnCb_).forEach(function (eId) {
        var cb = eid_effectReturnCb_[eId];
        if (typeof cb === 'function') cb(ctx);
      });
      var _this$cc$ccState = this.cc.ccState,
          ccUniqueKey = _this$cc$ccState.ccUniqueKey,
          ccClassKey = _this$cc$ccState.ccClassKey;
      offEventHandlersByCcUniqueKey(ccUniqueKey);
      unsetRef(ccClassKey, ccUniqueKey);
      if (_Component.prototype.componentWillUnmount) _Component.prototype.componentWillUnmount.call(this);
    };

    _proto.render = function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          render = _this$props2.render;
      var view = render || children;

      if (typeof view === 'function') {
        this.__fragmentParams.state = this.state; //注意这里，一定要每次都取最新的

        return view(this.__fragmentParams) || React__default.createElement(React.Fragment);
      } else {
        if (React__default.isValidElement(view)) {
          justWarning("you are trying to specify a react dom to be CcFragment's children, it will never been rendered again no matter how your state changed!!!");
        }

        return view;
      }
    };

    return CcFragment;
  }(React.Component);

  function _connectDumb(mapProps, module, sharedStateKeys, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props) {
    var render = function render(ctx) {
      var connectedState = ctx.connectedState;

      if (mapProps) {
        var generatedProps = mapProps(ctx);
        if (mapState) throw new Error('mapState is not allowed when you specify mapProps in args');
        return React__default.createElement(Dumb, generatedProps);
      } else {
        var mappedState = {};

        if (mapState) {
          if (mapState === true) {
            mappedState = flatObject(connectedState, alias);
          } else {
            mappedState = mapState(ctx) || {};
          }
        }

        ctx.mappedState = mappedState; //将mappedState绑在ctx上，方便其他地方使用

        return React__default.createElement(Dumb, {
          mappedState: mappedState,
          ctx: ctx,
          props: props
        });
      }
    }; //ccKey由实例化的Dumb组件props上透传下来


    return React__default.createElement(CcFragment, {
      key: props.key,
      ccKey: props.ccKey,
      props: props,
      module: module,
      sharedStateKeys: sharedStateKeys,
      connect: connect,
      state: state,
      setup: setup,
      bindCtxToMethod: bindCtxToMethod,
      render: render
    });
  }

  var connectDumb = (function (_ref) {
    var mapProps = _ref.mapProps,
        mapState = _ref.mapState,
        module = _ref.module,
        sharedStateKeys = _ref.sharedStateKeys,
        connect = _ref.connect,
        _ref$state = _ref.state,
        state = _ref$state === void 0 ? {} : _ref$state,
        setup = _ref.setup,
        bindCtxToMethod = _ref.bindCtxToMethod,
        _ref$alias = _ref.alias,
        alias = _ref$alias === void 0 ? {} : _ref$alias;
    return function (Dumb) {
      //对state做克隆,防止用同一个concnetDumb结果包不同的fn组件,共享了同一份state
      //const c = concnetDumb({state:{info:{a:1}}});
      // const UI1_ = c(UI1); const UI2_ = c(UI2);
      // 让UI1_和UI2_各自拥有自己的localState
      var stateType = typeof state;
      var clonedState = null;
      if (stateType === 'function') clonedState = state();else if (stateType !== 'object') {
        throw new Error('state must be a plain json object');
      } else {
        clonedState = clone(state);
      } //这样写可以避免react dev tool显示的dom为Unknown

      var ConnectedFragment = function ConnectedFragment(props) {
        return _connectDumb(mapProps, module, sharedStateKeys, connect, clonedState, setup, bindCtxToMethod, mapState, alias, Dumb, props);
      };

      return ConnectedFragment;
    };
  });

  var _connectPure = (function (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.module,
        mapProps = _ref.mapProps,
        mapState = _ref.mapState,
        connect = _ref.connect,
        state = _ref.state,
        setup = _ref.setup,
        bindCtxToMethod = _ref.bindCtxToMethod;

    if (mapState) throw new Error('mapState is not allowed in connectPure method args');
    var _mapProps = mapProps;
    if (!mapProps) _mapProps = function _mapProps() {};
    return connectDumb({
      module: module,
      mapProps: _mapProps,
      connect: connect,
      state: state,
      setup: setup,
      bindCtxToMethod: bindCtxToMethod
    });
  });

  var ccKey_ref_$4 = ccContext.ccKey_ref_,
      ccClassKey_ccClassContext_$4 = ccContext.ccClassKey_ccClassContext_;
  function getRefsByClassKey (ccClassKey) {
    var refs = [];
    var ccClassContext = ccClassKey_ccClassContext_$4[ccClassKey];

    if (!ccClassContext) {
      return refs;
    }

    var ccKeys = ccClassContext.ccKeys;
    ccKeys.filter(function (k) {
      var ref = ccKey_ref_$4[k];
      if (ref) refs.push(ref);
    });
    return refs;
  }

  var _execute = (function (ccClassKey) {
    var refs = getRefsByClassKey(ccClassKey);
    refs.forEach(function (ref) {
      if (ref.$$execute) ref.$$execute();
    });
  });

  function getRefs () {
    var refs = [];
    var ccKey_ref_ = ccContext.ccKey_ref_;
    var ccKeys = okeys(ccKey_ref_);
    ccKeys.forEach(function (k) {
      var ref = ccKey_ref_[k];
      if (ref) refs.push(ref);
    });
    return refs;
  }

  var _executeAll = (function () {
    var refs = getRefs();
    refs.forEach(function (ref) {
      if (ref.$$execute) ref.$$execute();
    });
  });

  var ccClassKey_ccClassContext_$5 = ccContext.ccClassKey_ccClassContext_;
  var _getConnectedState = (function (ccClassKey) {
    var ctx = ccClassKey_ccClassContext_$5[ccClassKey];
    return ctx.connectedState || {};
  });

  var appendState = ccContext.store.appendState;

  var _reducerCaller = ccContext.reducer._reducerCaller;

  var _lazyReducerCaller = ccContext.reducer._lazyReducerCaller;

  var startup$1 = startup;
  var cloneModule = _cloneModule;
  var load = _load;
  var run = _load;
  var register$2 = register$1;
  var r = _r;
  var registerToDefault = _registerToDefault;
  var registerSingleClassToDefault = _registerSingleClassToDefault;
  var configure$1 = configure;
  var call = _call;
  var setGlobalState$1 = setGlobalState;
  var setState$1 = _setState;
  var set = _set;
  var getState$7 = getState$5;
  var getGlobalState$1 = getGlobalState;
  var getConnectedState = _getConnectedState;
  var getComputed = _getComputed;
  var emit = _emit;
  var emitWith = _emitWith;
  var off = _off;
  var connect = _connect;
  var connectDumb$1 = connectDumb;
  var connectPure = _connectPure;
  var dispatch$2 = dispatch$1;
  var lazyDispatch$1 = lazyDispatch;
  var ccContext$1 = ccContext;
  var createDispatcher$1 = createDispatcher;
  var execute = _execute;
  var executeAll = _executeAll;
  var getRefs$1 = getRefs;
  var reducer = _reducerCaller;
  var lazyReducer = _lazyReducerCaller;
  var CcFragment$1 = CcFragment;
  var cst = _cst;
  var appendState$1 = appendState;
  var defaultExport = {
    cloneModule: cloneModule,
    emit: emit,
    emitWith: emitWith,
    off: off,
    connect: connect,
    connectDumb: connectDumb$1,
    connectPure: connectPure,
    dispatch: dispatch$2,
    lazyDispatch: lazyDispatch$1,
    startup: startup$1,
    load: load,
    run: run,
    register: register$2,
    r: r,
    registerToDefault: registerToDefault,
    registerSingleClassToDefault: registerSingleClassToDefault,
    configure: configure$1,
    call: call,
    setGlobalState: setGlobalState$1,
    setState: setState$1,
    set: set,
    getGlobalState: getGlobalState$1,
    getState: getState$7,
    getComputed: getComputed,
    getConnectedState: getConnectedState,
    ccContext: ccContext$1,
    createDispatcher: createDispatcher$1,
    execute: execute,
    executeAll: executeAll,
    getRefs: getRefs$1,
    reducer: reducer,
    lazyReducer: lazyReducer,
    CcFragment: CcFragment$1,
    cst: cst,
    appendState: appendState$1
  };
  bindToWindow('cc', defaultExport);

  exports.startup = startup$1;
  exports.cloneModule = cloneModule;
  exports.load = load;
  exports.run = run;
  exports.register = register$2;
  exports.r = r;
  exports.registerToDefault = registerToDefault;
  exports.registerSingleClassToDefault = registerSingleClassToDefault;
  exports.configure = configure$1;
  exports.call = call;
  exports.setGlobalState = setGlobalState$1;
  exports.setState = setState$1;
  exports.set = set;
  exports.getState = getState$7;
  exports.getGlobalState = getGlobalState$1;
  exports.getConnectedState = getConnectedState;
  exports.getComputed = getComputed;
  exports.emit = emit;
  exports.emitWith = emitWith;
  exports.off = off;
  exports.connect = connect;
  exports.connectDumb = connectDumb$1;
  exports.connectPure = connectPure;
  exports.dispatch = dispatch$2;
  exports.lazyDispatch = lazyDispatch$1;
  exports.ccContext = ccContext$1;
  exports.createDispatcher = createDispatcher$1;
  exports.execute = execute;
  exports.executeAll = executeAll;
  exports.getRefs = getRefs$1;
  exports.reducer = reducer;
  exports.lazyReducer = lazyReducer;
  exports.CcFragment = CcFragment$1;
  exports.cst = cst;
  exports.appendState = appendState$1;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
