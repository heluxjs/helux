(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('co'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'co', 'react', 'react-dom'], factory) :
  (factory((global.concent = {}),global.co,global.React,global.ReactDOM));
}(this, (function (exports,co,React,ReactDOM) { 'use strict';

  co = co && co.hasOwnProperty('default') ? co['default'] : co;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

  var _ERR_MESSAGE;

  var MODULE_GLOBAL = '$$global';
  var MODULE_DEFAULT = '$$default';
  var MODULE_CC = '$$cc';
  var MODULE_CC_ROUTER = '$$CONCENT_ROUTER';
  var CC_CLASS_PREFIX = '$$CcClass';
  var CC_FRAGMENT_PREFIX = '$$CcFrag';
  var CC_HOOK_PREFIX = '$$CcHook';
  var CC_PREFIX = '$$Cc';
  var CC_DISPATCHER = '$$Dispatcher';
  var CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';
  var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
  var MOCKE_KEY = Symbol('__for_mock_event__');
  var LAZY_KEY = Symbol('__lazy_handle_state__');
  var SIG_FN_START = 10;
  var SIG_FN_END = 11;
  var SIG_FN_QUIT = 12;
  var SIG_FN_ERR = 13;
  var SIG_MODULE_CONFIGURED = 14;
  var SIG_STATE_CHANGED = 15;
  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1;
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
    CC_CLASS_REDUCER_MODULE_INVALID: 1103,
    CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED: 1104,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
    CC_CLASS_INSTANCE_OPTION_INVALID: 1201,
    CC_CLASS_INSTANCE_NOT_FOUND: 1202,
    CC_CLASS_INSTANCE_METHOD_NOT_FOUND: 1203,
    CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID: 1204,
    CC_CLASS_INSTANCE_MORE_THAN_ONE: 1205,
    CC_STORED_KEYS_NEED_CCKEY: 1207,
    CC_ARG_STORED_KEYS_DUPLICATE_WITH_WATCHED_KEYS: 1401,
    CC_ARG_KEYS_NOT_AN_ARRAY: 1402,
    CC_ARG_KEYS_INCLUDE_NON_STRING_ELEMENT: 1403,
    CC_REDUCER_ACTION_TYPE_NAMING_INVALID: 1500,
    CC_REDUCER_ACTION_TYPE_DUPLICATE: 1501,
    CC_REDUCER_ACTION_TYPE_NO_MODULE: 1502,
    CC_REDUCER_NOT_A_FUNCTION: 1503,
    CC_REDUCER_MODULE_NAME_DUPLICATE: 1511 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'concent startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for concent,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'concent';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_MODULE_NAME_HAS_NO_STATE] = "there is no module state in the store for your input module name", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CcComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CcComponent! if you are sure the key is different, maybe the CcComponent's father Component is also a CcComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_ARG_STORED_KEYS_DUPLICATE_WITH_WATCHED_KEYS] = 'some of your storedKeys has been declared in CcClass watchedKeys!', _ERR_MESSAGE[ERR.CC_STORED_KEYS_NEED_CCKEY] = 'you must explicitly specify a ccKey for ccInstance if you want to use storedKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure the supplied ccClassKey been registered to concent!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_ARG_KEYS_NOT_AN_ARRAY] = "watchedKeys is not an Array! if you want to watch all state keys of a module, you can set watchedKeys='*' ", _ERR_MESSAGE[ERR.CC_ARG_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'watchedKeys include non string element!', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);
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
    CC_CLASS_PREFIX: CC_CLASS_PREFIX,
    CC_FRAGMENT_PREFIX: CC_FRAGMENT_PREFIX,
    CC_HOOK_PREFIX: CC_HOOK_PREFIX,
    CC_PREFIX: CC_PREFIX,
    CC_DISPATCHER: CC_DISPATCHER,
    CC_DISPATCHER_BOX: CC_DISPATCHER_BOX,
    CCSYNC_KEY: CCSYNC_KEY,
    MOCKE_KEY: MOCKE_KEY,
    LAZY_KEY: LAZY_KEY,
    SIG_FN_START: SIG_FN_START,
    SIG_FN_END: SIG_FN_END,
    SIG_FN_QUIT: SIG_FN_QUIT,
    SIG_FN_ERR: SIG_FN_ERR,
    SIG_MODULE_CONFIGURED: SIG_MODULE_CONFIGURED,
    SIG_STATE_CHANGED: SIG_STATE_CHANGED,
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

  var _computedValue2, _computedFn2, _reducer;
  var refs = {};

  var setStateByModule = function setStateByModule(module, committedState) {
    var moduleState = _getState(module);

    var prevModuleState = _getPrevState(module);

    var moduleComputedFns = _computedFn[module];
    var moduleComputedValue = _computedValue[module];
    var watchFns = _watch[module];
    Object.keys(committedState).forEach(function (key) {
      /** setStateByModuleAndKey */
      var value = committedState[key];
      var oldValue = moduleState[key];
      prevModuleState[key] = oldValue;
      var fnCtx = {
        key: key,
        module: module,
        moduleState: moduleState,
        committedState: committedState
      };

      if (moduleComputedFns) {
        var fn = moduleComputedFns[key];

        if (fn) {
          var computedValue = fn(value, oldValue, fnCtx);
          moduleComputedValue[key] = computedValue;
        }
      }

      if (watchFns) {
        var _fn = watchFns[key];
        if (_fn) _fn(value, oldValue, fnCtx); //fn(newValue, oldValue)
      }

      moduleState[key] = value;
    });
  };

  var _getState = function getState(module) {
    return _state[module];
  };

  var _getPrevState = function getPrevState(module) {
    return _prevState[module];
  };

  var _computedValue = (_computedValue2 = {}, _computedValue2[MODULE_GLOBAL] = {}, _computedValue2[MODULE_DEFAULT] = {}, _computedValue2[MODULE_CC] = {}, _computedValue2);

  var _computedFn = (_computedFn2 = {}, _computedFn2[MODULE_GLOBAL] = {}, _computedFn2[MODULE_DEFAULT] = {}, _computedFn2[MODULE_CC] = {}, _computedFn2);

  var computed = {
    _computedValue: _computedValue,
    _computedFn: _computedFn,
    getRootComputedValue: function getRootComputedValue() {
      return _computedValue;
    },
    getRootComputedFn: function getRootComputedFn() {
      return _computedFn;
    }
  };
  /** watch section */

  var _watch = {};
  var watch = {
    _watch: _watch,
    getRootWatch: function getRootWatch() {
      return _watch;
    },
    getModuleWatch: function getModuleWatch(module) {
      return _watch[module];
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
        watchedKeys,
        connectedState:{},
        connectedComputed:{},
        ccKeys: [],
        connectedModuleduleKeyMapping: null,
        connectedModuledule:{}
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
        var stateKeys = safeGetArrayFromObject(moduleName_stateKeys_, module);
        okeys(state).forEach(function (k) {
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
      setState: function setState(module, partialSharedState) {
        setStateByModule(module, partialSharedState);
      },
      setGlobalState: function setGlobalState(partialGlobalState) {
        setStateByModule(MODULE_GLOBAL, partialGlobalState);
      },
      getGlobalState: function getGlobalState() {
        return _state[MODULE_GLOBAL];
      },
      //对state直接赋值，cc启动的时候某些场景需要调用此函数
      initStateDangerously: function initStateDangerously(module, state) {
        _state[module] = state;
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer),
      _reducerCaller: {},
      _lazyReducerCaller: {},
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
    ccUkey_option_: {},
    refs: refs,
    info: {
      startupTime: Date.now(),
      version: '1.5.10',
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
  function isObjectNull(object) {
    return !isObjectNotNull(object);
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
  /** make ccClassContext */

  function makeCcClassContext(module, ccClassKey, watchedKeys, originalWatchedKeys) {
    return {
      module: module,
      ccClassKey: ccClassKey,
      originalWatchedKeys: originalWatchedKeys,
      watchedKeys: watchedKeys,
      ccKeys: [],
      connectedState: {},
      connectedModuleKeyMapping: null,
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
  function strictWarning(err) {
    if (ccContext.isStrict) {
      throw err;
    }

    justWarning(err);
  }
  function safeGetObjectFromObject(object, key, defaultVal) {
    if (defaultVal === void 0) {
      defaultVal = {};
    }

    var childrenObject = object[key];

    if (!childrenObject) {
      childrenObject = object[key] = defaultVal;
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
      }, 3000);
    }
  }
  /**
   * 浅比较两个对象
   * come from : https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
   */

  function shallowDiffers(a, b) {
    for (var i in a) {
      if (!(i in b)) return true;
    }

    for (var _i in b) {
      if (a[_i] !== b[_i]) return true;
    }

    return false;
  }
  var util = {
    clearObject: clearObject,
    makeError: makeError,
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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var catchCcError = (function (err) {
    if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
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

  var sigs = [SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR, SIG_MODULE_CONFIGURED, SIG_STATE_CHANGED];
  var sig_cbs_ = {};
  sigs.forEach(function (sig) {
    return sig_cbs_[sig] = [];
  });
  function clearCbs() {
    sigs.forEach(function (sig) {
      return sig_cbs_[sig].length = 0;
    });
  }
  function send(sig, payload) {
    var cbs = sig_cbs_[sig];
    cbs.forEach(function (cb) {
      cb({
        sig: sig,
        payload: payload
      });
    });
  }
  function on(sigOrSigs, cb) {
    function pushCb(sig, cb) {
      var cbs = sig_cbs_[sig];

      if (!cbs) {
        console.warn("invalid sig[" + sig + "]");
        return;
      }

      cbs.push(cb);
    }

    if (Array.isArray(sigOrSigs)) {
      sigOrSigs.forEach(function (sig) {
        pushCb(sig, cb);
      });
    } else {
      pushCb(sigOrSigs, cb);
    }
  }

  var isModuleNameCcLike$1 = isModuleNameCcLike,
      isModuleNameValid$1 = isModuleNameValid,
      vbi = verboseInfo,
      makeError$1 = makeError;
  /** 检查模块名，名字合法，就算检查通过 */

  function checkModuleNameBasically(moduleName) {
    if (!isModuleNameValid$1(moduleName)) {
      throw makeError$1(ERR.CC_MODULE_NAME_INVALID, vbi(" module[" + moduleName + "] is invalid!"));
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
        throw makeError$1(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, vbi("module[" + moduleName + "]"));
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
          throw makeError$1(ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
        }
      } else {
        //要求模块状态应该存在
        if (!_state[moduleName]) {
          //实际上却不存在
          throw makeError$1(ERR.CC_MODULE_NAME_HAS_NO_STATE, vbi(_vbiMsg));
        }
      }
    }
  }
  function checkModuleState(moduleState, moduleName) {
    if (!isModuleStateValid(moduleState)) {
      throw makeError(ERR.CC_STORE_STATE_INVALID, vbi("module[" + moduleName + "]'s state is invalid!"));
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
  function checkStoredKeys(moduleStateKeys, storedKeys) {
    var isSKeysArr = Array.isArray(storedKeys);

    if (!isSKeysArr && storedKeys !== '*') {
      throw new Error("storedKeys type err, it is must be an array or string *");
    }

    if (isSKeysArr) {
      storedKeys.forEach(function (sKey) {
        if (moduleStateKeys.includes(sKey)) {
          throw new Error("storedKeys key err, the key[" + sKey + "] can not be a module state key!");
        }
      });
    }
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

  function shouldSkipKey (key, refModule, stateModule, connectSpecLike, moduleStateKeys) {
    var skip = false;
    var keyModule = '';
    var stateKey = key;

    if (key.includes('/')) {
      // moduledKey : 'foo/f1'
      var _key$split = key.split('/'),
          tmpKeyModule = _key$split[0],
          unmoduledKey = _key$split[1];

      stateKey = unmoduledKey; // 'foo/f1': keyModule为foo  , /f1'：keyModule为${refModule}

      keyModule = tmpKeyModule || refModule; // 状态所属模块和keyModule对不上，直接跳过

      if (keyModule !== stateModule) {
        return {
          skip: true
        };
      }
      /**
       * defineWatch里定义的观察key和register里定义的观察key，是各自独立的，即
       * foo模块刻意定义watchedKeys为空数组，但是defineWatch里定义了一个key观察函数，该函数依然会被触发
      -    */


      if (stateModule === refModule) {
        if (!moduleStateKeys.includes(unmoduledKey)) {
          return {
            skip: true
          };
        }
      } else {
        //提交的状态非refModule，检查connectSpec
        if (!connectSpecLike[stateModule]) {
          return {
            skip: true
          };
        }
      }
    } //不用写else 判断moduleStateKeys是否包含unmoduledKey，这个key可能是实例自己持有的key


    return {
      skip: skip,
      stateKey: stateKey,
      keyModule: keyModule
    };
  }

  var getState = ccContext.store.getState;
  var moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;
  function watchKeyForRef (refCtx, stateModule, oldState, committedState) {
    var watchSpec = refCtx.watchSpec,
        connect = refCtx.connect,
        refModule = refCtx.module;
    if (watchSpec.hasFn !== true) return true;
    var shouldCurrentRefUpdate = true;
    var moduleStateKeys = moduleName_stateKeys_[refModule];
    var watchFns = watchSpec.watchFns;
    var watchStateKeys = okeys(watchFns);
    watchStateKeys.forEach(function (key) {
      var _shouldSkipKey = shouldSkipKey(key, refModule, stateModule, connect, moduleStateKeys),
          stateKey = _shouldSkipKey.stateKey,
          skip = _shouldSkipKey.skip,
          keyModule = _shouldSkipKey.keyModule;

      if (skip) return;
      var commitValue = committedState[stateKey];

      if (commitValue !== undefined) {
        var watchFn = watchFns[key];
        var targetModule = keyModule || refModule;
        var moduleState = getState(targetModule);
        var fnCtx = {
          key: stateKey,
          module: targetModule,
          moduleState: moduleState,
          committedState: committedState
        };
        var ret = watchFn(commitValue, oldState[stateKey], fnCtx, refCtx); // watchFn(newValue, oldValue);
        //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

        if (ret === false) shouldCurrentRefUpdate = false;
      }
    });
    return shouldCurrentRefUpdate;
  }

  var getState$1 = ccContext.store.getState;
  var moduleName_stateKeys_$1 = ccContext.moduleName_stateKeys_; //CcFragment实例调用会提供callerCtx
  // stateModule表示状态所属的模块

  function computeValueForRef (refCtx, stateModule, oldState, committedState) {
    var computedSpec = refCtx.computedSpec,
        refModule = refCtx.module,
        refComputed = refCtx.refComputed,
        refConnectedComputed = refCtx.refConnectedComputed;
    var computedFns = computedSpec.computedFns,
        hasFn = computedSpec.hasFn;
    if (hasFn !== true) return;
    var moduleStateKeys = moduleName_stateKeys_$1[stateModule];
    var toBeComputedKeys = okeys(computedFns);
    toBeComputedKeys.forEach(function (key) {
      var _shouldSkipKey = shouldSkipKey(key, refModule, stateModule, refConnectedComputed, moduleStateKeys),
          stateKey = _shouldSkipKey.stateKey,
          skip = _shouldSkipKey.skip,
          keyModule = _shouldSkipKey.keyModule;

      if (skip) return;
      var newValue = committedState[stateKey];

      if (newValue !== undefined) {
        var fn = computedFns[key]; //用原始定义当然key去取fn

        var moduleState = getState$1(keyModule);
        var fnCtx = {
          key: stateKey,
          module: keyModule,
          moduleState: moduleState,
          committedState: committedState
        };
        var computedValue = fn(newValue, oldState[stateKey], fnCtx, refCtx);
        var targetComputed = refConnectedComputed[keyModule]; //foo模块的实例，定义的watchKey是 foo/f1, 此时skip是false，但是结果不会向refConnectedComputed里放的
        //因为refConnectedComputed放置的只是connect连接的模块的key结算结果

        if (targetComputed) {
          targetComputed[stateKey] = computedValue;
        } //foo模块的实例，定义的watchKey是 foo/f1, /f1, f1 都会放置到refComputed里


        if (!keyModule || keyModule === refModule) {
          refComputed[stateKey] = computedValue;
        }
      }
    });
  }

  var isPlainJsonObject$1 = isPlainJsonObject,
      justWarning$1 = justWarning,
      isObjectNotNull$1 = isObjectNotNull,
      computeFeature$1 = computeFeature,
      okeys$1 = okeys,
      styleStr$1 = styleStr,
      color$1 = color;
  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
      STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1 = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      FORCE_UPDATE$1 = FORCE_UPDATE,
      SET_STATE$1 = SET_STATE,
      SET_MODULE_STATE$1 = SET_MODULE_STATE,
      INVOKE$1 = INVOKE,
      SYNC$1 = SYNC,
      SIG_STATE_CHANGED$1 = SIG_STATE_CHANGED;
  var _ccContext$store = ccContext.store,
      setState = _ccContext$store.setState,
      getPrevState = _ccContext$store.getPrevState,
      middlewares = ccContext.middlewares,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      connectedModuleName_ccClassKeys_ = ccContext.connectedModuleName_ccClassKeys_,
      refStore = ccContext.refStore,
      moduleName_stateKeys_$2 = ccContext.moduleName_stateKeys_,
      ccUkey_ref_ = ccContext.ccUkey_ref_;

  function getStateFor(inputModule, refModule) {
    return inputModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1;
  }

  function getActionType(calledBy, type) {
    if ([FORCE_UPDATE$1, SET_STATE$1, SET_MODULE_STATE$1, INVOKE$1, SYNC$1].includes(calledBy)) {
      return "ccApi/" + calledBy;
    } else {
      return "dispatch/" + type;
    }
  }

  function changeRefState (state, _temp, targetRef) {
    var _ref = _temp === void 0 ? {} : _temp,
        ccKey = _ref.ccKey,
        ccUniqueKey = _ref.ccUniqueKey,
        module = _ref.module,
        _ref$skipMiddleware = _ref.skipMiddleware,
        skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
        reactCallback = _ref.reactCallback,
        type = _ref.type,
        reducerModule = _ref.reducerModule,
        _ref$calledBy = _ref.calledBy,
        calledBy = _ref$calledBy === void 0 ? SET_STATE$1 : _ref$calledBy,
        fnName = _ref.fnName,
        _ref$delay = _ref.delay,
        delay = _ref$delay === void 0 ? -1 : _ref$delay,
        identity = _ref.identity;

    var stateFor = getStateFor(module, targetRef.ctx.module);
    if (state === undefined) return; //do nothing
    // const isControlledByConcent = targetRef.ctx.isControlledByConcent;

    if (!isPlainJsonObject$1(state)) {
      justWarning$1("cc found your commit state is not a plain json object!");
      return;
    }

    var currentModule = targetRef.ctx.module;
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
    send(SIG_STATE_CHANGED$1, {
      committedState: state,
      sharedState: broadcastInfo.partialSharedState,
      module: module,
      type: getActionType(calledBy, type),
      ccUniqueKey: ccUniqueKey
    });

    if (module === currentModule) {
      // who trigger $$changeState, who will change the whole received state 
      prepareReactSetState(targetRef, identity, calledBy, state, stateFor, function () {
        prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, module, state, delay, identity, reactCallback);
      }, reactCallback);
    } else {
      if (reactCallback) justWarning$1("callback for react.setState will be ignore"); //触发修改状态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是OF_ONE_MODULE

      prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1, module, state, delay, identity, reactCallback);
    }
  }

  function prepareReactSetState(targetRef, identity, calledBy, state, stateFor, next, reactCallback) {
    var thisState = targetRef.state;
    var refCtx = targetRef.ctx;
    var stateModule = refCtx.module,
        storedKeys = refCtx.storedKeys,
        ccOption = refCtx.ccOption,
        ccUniqueKey = refCtx.ccUniqueKey;

    if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1) {
      if (next) next();
      return;
    }

    if (identity) {
      //if user specify identity
      if (refCtx.ccKey !== identity) {
        // current instance would have been rendered only if current instance's ccKey equal identity
        if (next) next();
        return;
      }
    }

    if (storedKeys.length > 0) {
      var _extractStateByKeys = extractStateByKeys(state, storedKeys),
          partialState = _extractStateByKeys.partialState,
          isStateEmpty = _extractStateByKeys.isStateEmpty;

      if (!isStateEmpty) {
        if (ccOption.persistStoredKeys === true) {
          var _extractStateByKeys2 = extractStateByKeys(thisState, storedKeys),
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

    computeValueForRef(refCtx, stateModule, thisState, state);
    var shouldCurrentRefUpdate = watchKeyForRef(refCtx, stateModule, thisState, state);

    if (targetRef.__$$isUnmounted !== true) {
      refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);
    }

    if (next) next();
  }

  function syncCommittedStateToStore(moduleName, committedState) {
    var stateKeys = moduleName_stateKeys_$2[moduleName];

    var _extractStateByKeys3 = extractStateByKeys(committedState, stateKeys),
        isPartialSharedStateEmpty = _extractStateByKeys3.isStateEmpty,
        partialSharedState = _extractStateByKeys3.partialState;

    var skipBroadcastRefState = false; //!!! save state to store

    if (!isPartialSharedStateEmpty) setState(moduleName, partialSharedState);else skipBroadcastRefState = true;
    return {
      partialSharedState: partialSharedState,
      skipBroadcastRefState: skipBroadcastRefState
    };
  }

  function prepareBroadcastState(targetRef, skipMiddleware, passToMiddleware, broadcastInfo, stateFor, moduleName, committedState, delay, identity, reactCallback) {
    var skipBroadcastRefState = broadcastInfo.skipBroadcastRefState,
        partialSharedState = broadcastInfo.partialSharedState;

    var startBroadcastState = function startBroadcastState() {
      broadcastState(targetRef, skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, identity, reactCallback);
    };

    var willBroadcast = function willBroadcast() {
      if (delay > 0) {
        var feature = computeFeature$1(targetRef.ctx.ccUniqueKey, committedState);
        runLater(startBroadcastState, feature, delay);
      } else {
        startBroadcastState();
      }
    };

    if (skipMiddleware) {
      willBroadcast();
      return;
    }

    var len = middlewares.length;

    if (len > 0) {
      passToMiddleware.sharedState = partialSharedState; //这个记录到store的状态也传给中间件ctx

      var index = 0;

      var next = function next() {
        if (index === len) {
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

  function broadcastState(targetRef, skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, identity, reactCallback) {
    if (skipBroadcastRefState === false) {
      var currentCcKey = targetRef.ctx.ccUniqueKey; // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
      // so flag ignoreCurrentCcKey as true;

      var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1;
      var ccClassKeys = moduleName_ccClassKeys_[moduleName];

      if (ccClassKeys) {
        //  these ccClass are watching the same module's state
        ccClassKeys.forEach(function (ccClassKey) {
          var classContext = ccClassKey_ccClassContext_[ccClassKey];
          var ccKeys = classContext.ccKeys,
              watchedKeys = classContext.watchedKeys,
              originalWatchedKeys = classContext.originalWatchedKeys;
          if (ccKeys.length === 0) return;
          if (watchedKeys.length === 0) return;
          var sharedStateForCurrentCcClass;

          if (originalWatchedKeys === '*') {
            sharedStateForCurrentCcClass = partialSharedState;
          } else {
            var _extractStateByKeys4 = extractStateByKeys(partialSharedState, watchedKeys, true),
                partialState = _extractStateByKeys4.partialState,
                isStateEmpty = _extractStateByKeys4.isStateEmpty;

            if (isStateEmpty) return;
            sharedStateForCurrentCcClass = partialState;
          }

          ccKeys.forEach(function (ccKey) {
            if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
            var ref = ccUkey_ref_[ccKey];

            if (ref) {
              if (ccContext.isDebug) {
                console.log(styleStr$1("received state for ref[" + ccKey + "] is broadcasted from same module's other ref " + currentCcKey), color$1());
              }

              prepareReactSetState(ref, identity, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1);
            }
          });
        });
      }
    }

    broadcastConnectedState(moduleName, originalState); //hook的setter本来是没有回调的，官方是推荐用useEffect代替，concent放在这里执行，以达到hook 和 class 的setState达到一样的效果

    if (reactCallback && targetRef.ctx.type === CC_HOOK_PREFIX) {
      reactCallback(targetRef.state);
    }
  }

  function broadcastConnectedState(commitModule, commitState) {
    var commitStateKeys = okeys$1(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

    var ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
    ccClassKeys.forEach(function (ccClassKey) {
      var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  }

  function updateConnectedState(targetClassContext, commitModule, committedState, committedStateKeys) {
    var connectedModuleKeyMapping = targetClassContext.connectedModuleKeyMapping,
        connectedModule = targetClassContext.connectedModule;

    if (connectedModule[commitModule] === 1) {
      var ccKeys = targetClassContext.ccKeys;
      var isSetConnectedStateTriggered = false;
      var len = committedStateKeys.length;

      for (var i = 0; i < len; i++) {
        var moduledStateKey = commitModule + "/" + committedStateKeys[i];

        if (connectedModuleKeyMapping[moduledStateKey]) {
          isSetConnectedStateTriggered = true;
          break; //只要感知到有一个key发生变化，就可以跳出循环了，
          //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
        }
      } //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍


      if (isSetConnectedStateTriggered === true) {
        var prevModuleState = getPrevState(commitModule);
        ccKeys.forEach(function (ccUniKey) {
          var ref = ccUkey_ref_[ccUniKey];

          if (ref && ref.__$$isUnmounted !== true) {
            var refCtx = ref.ctx;
            var shouldCurrentRefUpdate = watchKeyForRef(refCtx, commitModule, prevModuleState, committedState);
            computeValueForRef(refCtx, commitModule, ref.state, committedState);
            if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
          }
        });
      }
    }
  }

  // import hoistNonReactStatic from 'hoist-non-react-statics';
  var verboseInfo$1 = verboseInfo,
      makeError$2 = makeError,
      justWarning$2 = justWarning,
      okeys$2 = okeys;
  var getState$2 = ccContext.store.getState,
      _reducer$1 = ccContext.reducer._reducer,
      _computedValue$1 = ccContext.computed._computedValue,
      ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_;
  var me = makeError$2;
  var vbi$1 = verboseInfo$1;

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
  }

  function paramCallBackShouldNotSupply(module, currentModule) {
    return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
  }

  function _promiseErrorHandler(resolve, reject) {
    return function (err) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return err ? reject(err) : resolve.apply(void 0, args);
    };
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
  } // any error in this function will not been throwed, cc just warning, 


  function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(inputModule, false)) {
      if (inputModule !== currentModule) {
        if (reactCallback) {
          justWarning$2(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$1(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no chance to be triggered
        }
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
    }
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$2(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
      }
    }
  }

  function _promisifyCcFn(ccFn, userLogicFn, executionContext, payload) {
    return new Promise(function (resolve, reject) {
      var _executionContext = Object.assign(executionContext, {
        __innerCb: _promiseErrorHandler(resolve, reject)
      });

      ccFn(userLogicFn, _executionContext, payload);
    })["catch"](catchCcError);
  }

  function __promisifiedInvokeWith(userLogicFn, executionContext, payload) {
    return _promisifyCcFn(invokeWith, userLogicFn, executionContext, payload);
  }

  function __invoke(userLogicFn, option, payload) {
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
    return __promisifiedInvokeWith(userLogicFn, {
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
  }

  function makeCcSetStateHandler(ref, containerRef) {
    return function (state, cb, shouldCurrentRefUpdate) {
      var refCtx = ref.ctx;
      var containerRefState = containerRef ? containerRef.state : null;
      var refState = ref.state;
      /** start update state */
      //采用此种写法的话，dispatch.ctx不能暴露state了，只能暴露getState句柄，才能保证取到最新的state
      // ref.state = Object.assign(ref.state, state);
      //采用okeys写法，让dispatch.ctx里的refState总是指向同一个引用

      okeys$2(state).forEach(function (k) {
        var val = state[k];
        refState[k] = val;
        if (containerRefState) containerRefState[k] = val; //让代理模式下的容器组件state也总是保持最新的
      });
      refCtx.state = refState;
      /** start update ui */

      if (shouldCurrentRefUpdate) {
        refCtx.renderCount += 1;
        refCtx.reactSetState(state, cb);
      }
    };
  }
  function makeCcForceUpdateHandler(ref) {
    return function (cb) {
      var refCtx = ref.ctx;
      refCtx.renderCount += 1;
      refCtx.reactForceUpdate(cb);
    };
  } // last param: chainData

  function makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        chainId = _ref.chainId,
        oriChainId = _ref.oriChainId,
        isLazy = _ref.isLazy,
        _ref$chainId_depth_ = _ref.chainId_depth_,
        chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

    return function (firstParam, payload, delay, identity) {
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
        module: targetRef.ctx.module,
        chainId: _chainId,
        oriChainId: _oriChainId,
        chainId_depth_: chainId_depth_,
        delay: delay,
        identity: identity
      };
      var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:{fn:function, delay:number, identity:string}, ...args:any[])");

      if (firstParamType === 'function') {
        return __invoke(firstParam, option, payload);
      } else if (firstParamType === 'object') {
        //firstParam: {fn:function, delay:number, identity:string}
        // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
        var fn = firstParam.fn,
            userInputModule = firstParam.module;
        if (typeof fn != 'function') throw err;
        if (userInputModule) option.module = userInputModule; //用某个模块的实例去修改另外模块的数据

        return __invoke(fn, option, payload);
      } else {
        throw err;
      } // return ()=>{}

    };
  }
  function invokeWith(userLogicFn, executionContext, payload) {
    //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
    var targetRef = executionContext.targetRef;
    var _curStateModule = targetRef.ctx.module;
    var ccKey = executionContext.ccKey,
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
        chainId = executionContext.chainId,
        oriChainId = executionContext.oriChainId,
        chainId_depth_ = executionContext.chainId_depth_;
    isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
      if (err) return handleCcFnError(err, __innerCb);
      var moduleState = getState$2(targetModule);
      var executionContextForUser = {};
      var isSourceCall = false;

      if (context) {
        isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1; //调用前先加1

        chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

        var _dispatch = makeDispatchHandler(targetRef, false, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, -1, identity, chainId, oriChainId, chainId_depth_);

        var lazyDispatch = makeDispatchHandler(targetRef, true, ccKey, ccUniqueKey, ccClassKey, targetModule, reducerModule, -1, identity, chainId, oriChainId, chainId_depth_);
        var sourceClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
        executionContextForUser = Object.assign(executionContext, {
          invoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, {
            chainId: chainId,
            oriChainId: oriChainId,
            chainId_depth_: chainId_depth_
          }),
          //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
          lazyInvoke: makeInvokeHandler(targetRef, ccKey, ccUniqueKey, ccClassKey, {
            isLazy: true,
            oriChainId: oriChainId,
            chainId_depth_: chainId_depth_
          }),
          dispatch: _dispatch,
          lazyDispatch: lazyDispatch,
          rootState: getState$2(),
          globalState: getState$2(MODULE_GLOBAL),
          //指的是目标模块的state
          moduleState: moduleState,
          //指的是目标模块的的moduleComputed
          moduleComputed: _computedValue$1[targetModule],
          //!!!指的是调用源cc类的connectedState
          connectedState: sourceClassContext.connectedState,
          //!!!指的是调用源cc类的connectedComputed
          connectedComputed: sourceClassContext.connectedComputed,
          //!!!指的是调用源cc类实例的state
          refState: targetRef.state //其他ref相关的属性，不再传递给上下文，concent不鼓励用户在reducer使用ref相关数据，因为不同调用方传递不同的ref值，会引起用户不注意的bug

        });
      }

      send(SIG_FN_START, {
        isSourceCall: isSourceCall,
        calledBy: calledBy,
        module: targetModule,
        chainId: chainId,
        fn: userLogicFn
      });
      co.wrap(userLogicFn)(payload, moduleState, executionContextForUser).then(function (partialState) {
        chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

        var curDepth = chainId_depth_[chainId];
        var commitStateList = [];
        send(SIG_FN_END, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        }); // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

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
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        });
        handleCcFnError(err, __innerCb);
      });
    });
  }
  function dispatch(_temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        targetRef = _ref2.targetRef,
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

    var targetReducerMap = _reducer$1[inputReducerModule];

    if (!targetReducerMap) {
      return __innerCb(new Error("no reducerMap found for reducer module:" + inputReducerModule));
    }

    var reducerFn = targetReducerMap[type];

    if (!reducerFn) {
      var fns = Object.keys(targetReducerMap);
      return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + inputReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
    } // const errMsg = util.isCcActionValid({ type, payload });
    // if (errMsg) return justWarning(errMsg);


    isStateModuleValid(inputModule, targetRef.ctx.module, reactCallback, function (err, newCb) {
      if (err) return __innerCb(err);
      var executionContext = {
        targetRef: targetRef,
        ccKey: ccKey,
        ccClassKey: ccClassKey,
        ccUniqueKey: ccUniqueKey,
        module: inputModule,
        reducerModule: inputReducerModule,
        type: type,
        cb: newCb,
        context: true,
        __innerCb: __innerCb,
        calledBy: DISPATCH,
        delay: delay,
        identity: identity,
        chainId: chainId,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      };
      invokeWith(reducerFn, executionContext, payload);
    });
  }
  function makeDispatchHandler(targetRef, isLazy, ccKey, ccUniqueKey, ccClassKey, defaultModule, defaultReducerModule, delay, defaultIdentity, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
  ) {
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

      var _module = defaultModule,
          _reducerModule,
          _type,
          _payload,
          _cb,
          _delay = delay;

      var _identity = defaultIdentity;

      if (paramObjType === 'object') {
        var _paramObj = paramObj,
            _paramObj$module = _paramObj.module,
            module = _paramObj$module === void 0 ? defaultModule : _paramObj$module,
            reducerModule = _paramObj.reducerModule,
            type = _paramObj.type,
            payload = _paramObj.payload,
            cb = _paramObj.cb,
            _paramObj$delay = _paramObj.delay,
            _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
            identity = _paramObj.identity;

        _module = module;
        _reducerModule = reducerModule || module;
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
              _module2 = _targetFirstParam$spl[0],
              _type2 = _targetFirstParam$spl[1];

          _module = _module2;
          _reducerModule = _module;
          _type = _type2;
        } else if (slashCount === 2) {
          var _targetFirstParam$spl2 = targetFirstParam.split('/'),
              _module3 = _targetFirstParam$spl2[0],
              _reducerModule2 = _targetFirstParam$spl2[1],
              _type3 = _targetFirstParam$spl2[2];

          if (_module3 === '' || _module3 === ' ') _module = defaultModule; //targetFirstParam may like: /foo/changeName
          else _module = _module3;
          _module = _module3;
          _reducerModule = _reducerModule2;
          _type = _type3;
        } else {
          return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi$1(targetFirstParam)));
        }
      } else {
        return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
      }

      if (_module === '*') {
        return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
      } // pick user input reducerModule firstly!


      var targetReducerModule = _reducerModule || defaultReducerModule || _module;
      var p = new Promise(function (resolve, reject) {
        dispatch({
          targetRef: targetRef,
          module: _module,
          reducerModule: targetReducerModule,
          type: _type,
          payload: _payload,
          cb: _cb,
          __innerCb: _promiseErrorHandler(resolve, reject),
          ccKey: ccKey,
          ccUniqueKey: ccUniqueKey,
          ccClassKey: ccClassKey,
          delay: _delay,
          identity: _identity,
          chainId: _chainId,
          oriChainId: _oriChainId,
          chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

        });
      })["catch"](catchCcError);
      return p;
    };
  }

  var _state$1 = ccContext.store._state;
  /**
   * 根据connect参数算出ccClassKey值和connectedModuleKeyMapping值
   */

  function getFeatureStrAndCmkMapping (connectSpec, fragmentModule, fragmentPrefix, watchedKeys) {
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
    var connectedModuleKeyMapping = {};
    moduleNames.forEach(function (m) {
      var moduleState = _state$1[m];
      var feature = fragmentPrefix + "_" + m + "/";

      if (moduleState === undefined) {
        throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
      }

      var val = connectSpec[m];

      if (typeof val === 'string') {
        if (val !== '*') throw new Error(invalidConnectItem(m));else {
          featureStrs.push(feature + "*");
          okeys(moduleState).forEach(function (sKey) {
            return connectedModuleKeyMapping[m + "/" + sKey] = sKey;
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
            connectedModuleKeyMapping[m + "/" + sKey] = sKey;
          }
        });
        featureStrs.push(feature);
      }
    });

    if (fragmentModule) {
      if (watchedKeys === '*') featureStrs.unshift(fragmentPrefix + "_$" + fragmentModule + "/*");else {
        watchedKeys.sort();
        var tmpStr = fragmentModule + "/" + watchedKeys.join(',');
        featureStrs.unshift(tmpStr);
      }
    }

    return {
      featureStr: featureStrs.join('|'),
      connectedModuleKeyMapping: connectedModuleKeyMapping,
      connectedModuleNames: moduleNames
    };
  }

  var isObjectNull$1 = isObjectNull,
      me$1 = makeError;
  var featureStr_classKey_ = ccContext.featureStr_classKey_,
      userClassKey_featureStr_ = ccContext.userClassKey_featureStr_,
      ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;
  var cursor = 0;
  function getCcClassKey (allowNamingDispatcher, module, connect, prefix, featureStr, classKey) {
    if (classKey === void 0) {
      classKey = '';
    }

    // 未指定classKey
    if (!classKey) {
      // 未指定所属模块，也未连接到其他模块
      if (module === MODULE_DEFAULT && isObjectNull$1(connect)) {
        return prefix + "0";
      }

      var _classKey = featureStr_classKey_[featureStr];

      if (_classKey) {
        return _classKey;
      }

      cursor++;
      _classKey = "" + prefix + cursor;
      featureStr_classKey_[featureStr] = _classKey;
      return _classKey;
    } // verify user input classKey


    if (classKey.startsWith(CC_PREFIX)) {
      throw new Error("user can not specify a classKey[" + classKey + "] starts with $$Cc");
    }

    if (!allowNamingDispatcher) {
      if (classKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
        throw new Error(CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n      you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
      }
    }

    var ctx = ccClassKey_ccClassContext_$2[classKey];

    if (ctx) {
      var fStr = userClassKey_featureStr_[classKey];

      if (fStr !== featureStr) {
        //不允许，特征值不一样的class指定相同的ccClassKey
        throw me$1(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:[" + classKey + "] duplicate");
      }
    } else {
      userClassKey_featureStr_[classKey] = featureStr;
    }

    return classKey;
  }

  var moduleName_stateKeys_$3 = ccContext.moduleName_stateKeys_,
      moduleName_ccClassKeys_$1 = ccContext.moduleName_ccClassKeys_,
      moduleSingleClass = ccContext.moduleSingleClass,
      ccClassKey_ccClassContext_$3 = ccContext.ccClassKey_ccClassContext_,
      connectedModuleName_ccClassKeys_$1 = ccContext.connectedModuleName_ccClassKeys_,
      _computedValue$2 = ccContext.computed._computedValue;
  var verifyKeys$1 = verifyKeys,
      me$2 = makeError,
      vbi$2 = verboseInfo;

  function checkCcStartupOrNot() {
    if (ccContext.isCcAlreadyStartup !== true || !window.cc) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  }

  function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
    var watchedKeys = inputWatchedKeys;

    if (inputWatchedKeys === '*') {
      watchedKeys = moduleName_stateKeys_$3[module];
    }

    var _verifyKeys = verifyKeys$1(watchedKeys, []),
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray) {
      throw me$2(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi$2("ccClassKey:" + ccClassKey));
    }

    if (keyElementNotString) {
      throw me$2(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi$2("ccClassKey:" + ccClassKey));
    }

    return watchedKeys;
  }

  function mapModuleToCcClassKeys(moduleName, ccClassKey) {
    var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_$1, moduleName);

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw new Error("module[" + moduleName + "] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[" + ccClassKeys[0] + "] has been registered!");
    } // 做一个判断，防止热加载时，传入重复的ccClassKey


    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
  }

  function mapCcClassKeyToCcClassContext(ccClassKey, moduleName, originalWatchedKeys, watchedKeys, connectedModuleKeyMapping, connectedModuleNames) {
    var ccClassContext = ccClassKey_ccClassContext_$3[ccClassKey]; //做一个判断，有可能是热加载调用

    if (!ccClassContext) {
      ccClassContext = makeCcClassContext(moduleName, ccClassKey, watchedKeys, originalWatchedKeys);
      ccClassKey_ccClassContext_$3[ccClassKey] = ccClassContext;
    }

    var connectedModule = {};
    var connectedComputed = {};

    if (connectedModuleKeyMapping) {
      var _state = ccContext.store._state;
      var connectedState = ccClassContext.connectedState; //直接赋值引用

      connectedModuleNames.forEach(function (m) {
        connectedState[m] = _state[m];
        connectedComputed[m] = _computedValue$2[m];
        connectedModule[m] = 1; //记录连接的模块
        //记录这个模块被某个ccClassKey连接

        var ccClassKeys = safeGetArrayFromObject(connectedModuleName_ccClassKeys_$1, m);
        ccClassKeys.push(ccClassKey);
      });
      ccClassContext.connectedModuleKeyMapping = connectedModuleKeyMapping;
      ccClassContext.connectedModule = connectedModule;
      ccClassContext.connectedComputed = connectedComputed;
    }
  }
  /**
   * map registration info to ccContext
   */


  function mapRegistrationInfo (module, ccClassKey, classKeyPrefix, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy) {
    if (inputStoredKeys === void 0) {
      inputStoredKeys = [];
    }

    if (__checkStartUp === true) checkCcStartupOrNot();
    var allowNamingDispatcher = __calledBy === 'cc';

    var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


    checkModuleName(module, false, "module[" + module + "] is not configured in store");
    checkStoredKeys(moduleName_stateKeys_$3[module], inputStoredKeys);
    var _connect = connect;

    if (Array.isArray(connect)) {
      _connect = {};
      connect.forEach(function (m) {
        return _connect[m] = '*';
      });
    }

    var _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);

    var _getFeatureStrAndCmkM = getFeatureStrAndCmkMapping(_connect),
        featureStr = _getFeatureStrAndCmkM.featureStr,
        connectedModuleKeyMapping = _getFeatureStrAndCmkM.connectedModuleKeyMapping,
        connectedModuleNames = _getFeatureStrAndCmkM.connectedModuleNames;

    var _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey);

    mapCcClassKeyToCcClassContext(_ccClassKey, module, inputWatchedKeys, _watchedKeys, connectedModuleKeyMapping, connectedModuleNames);
    mapModuleToCcClassKeys(module, _ccClassKey);
    var isSKeysArr = Array.isArray(inputStoredKeys);

    if (!isSKeysArr && inputStoredKeys !== '*') {
      throw new Error("storedKeys type err, it is must be an array or string *");
    }

    if (isSKeysArr) {
      inputStoredKeys.forEach(function (v) {
        if (_watchedKeys.includes(v)) {
          throw new Error("storedKeys key err, the key[" + v + "] is already been declared in watchedKeys");
        }
      });
    }

    return {
      _module: module,
      _reducerModule: _reducerModule,
      _connect: _connect,
      _watchedKeys: _watchedKeys,
      _ccClassKey: _ccClassKey
    };
  }

  /****
   * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module, mustBelongToModule) {
    if (mustBelongToModule === void 0) {
      mustBelongToModule = false;
    }

    var ccUkey_ref_ = ccContext.ccUkey_ref_,
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
        throw new Error("module[" + module + "] is not declared in store");
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

    var oneRef = ccUkey_ref_[ccKeys[0]];

    if (!oneRef) {
      throw new Error('cc found no ref!');
    }

    return oneRef;
  }

  var me$3 = util.makeError,
      vbi$3 = util.verboseInfo,
      ss = util.styleStr,
      cl = util.color;
  var ccUKey_insCount = {};

  function setCcInstanceRef(ccUniqueKey, ref, ccKeys, option, delayMs) {
    function setRef() {
      ccContext.ccUkey_ref_[ccUniqueKey] = ref;
      ccKeys.push(ccUniqueKey);
      ccContext.ccUkey_option_[ccUniqueKey] = option;
    }

    incCcKeyInsCount(ccUniqueKey);

    if (delayMs) {
      setTimeout(setRef, delayMs);
    } else {
      setRef();
    }
  }

  function incCcKeyInsCount(ccUniqueKey) {
    if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 1;else ccUKey_insCount[ccUniqueKey] += 1;
  }
  function decCcKeyInsCount(ccUniqueKey) {
    if (ccUKey_insCount[ccUniqueKey] === undefined) ccUKey_insCount[ccUniqueKey] = 0;else ccUKey_insCount[ccUniqueKey] -= 1;
  }
  function getCcKeyInsCount(ccUniqueKey) {
    if (ccUKey_insCount[ccUniqueKey] === undefined) return 0;else return ccUKey_insCount[ccUniqueKey];
  }
  function setRef (ref, isSingle, ccClassKey, ccKey, ccUniqueKey, ccOption) {
    var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
    var ccKeys = classContext.ccKeys;

    if (ccContext.isDebug) {
      console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
    }

    if (!util.isCcOptionValid(ccOption)) {
      throw me$3(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$3("a standard default ccOption may like: {\"storedKeys\": []}"));
    }

    var isHot = ccContext.isHotReloadMode();

    if (ccKeys.includes(ccUniqueKey)) {
      if (isHot) {
        // get existed ins count
        var insCount = getCcKeyInsCount(ccUniqueKey);
        if (isSingle && insCount > 0) throw me$3(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi$3("ccClass:" + ccClassKey));

        if (insCount > 1) {
          // now cc can make sure the ccKey duplicate
          throw me$3(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$3("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
        } // just warning


        util.justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi$3("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
        // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
        // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
        // so cc set ref later

        setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption, 600);
      } else {
        throw me$3(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$3("ccClass:[" + ccClassKey + "],ccKey:[" + ccUniqueKey + "]"));
      }
    } else {
      setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption);
    }

    return classContext;
  }

  var ccUkey_ref_$2 = ccContext.ccUkey_ref_,
      ccUkey_option_ = ccContext.ccUkey_option_,
      ccUKey_handlerKeys_ = ccContext.ccUKey_handlerKeys_,
      ccClassKey_ccClassContext_$4 = ccContext.ccClassKey_ccClassContext_,
      handlerKey_handler_ = ccContext.handlerKey_handler_;
  function unsetRef (ccClassKey, ccUniqueKey) {
    if (ccContext.isDebug) {
      console.log(styleStr(ccUniqueKey + " unset ref"), color('purple'));
    } // ccContext.ccUkey_ref_[ccUniqueKey] = null;


    delete ccUkey_ref_$2[ccUniqueKey];
    delete ccUkey_option_[ccUniqueKey];
    var classContext = ccClassKey_ccClassContext_$4[ccClassKey];
    var ccKeys = classContext.ccKeys;
    var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
    if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
    decCcKeyInsCount(ccUniqueKey);
    var handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];

    if (handlerKeys) {
      handlerKeys.forEach(function (hKey) {
        delete handlerKey_handler_[hKey]; // ccUniqueKey maybe generated randomly, so delete the key instead of set null
        // handlerKey_handler_[hKey] = null;
      });
    }
  }

  var event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_$1 = ccContext.handlerKey_handler_,
      ccUKey_handlerKeys_$1 = ccContext.ccUKey_handlerKeys_,
      ccUkey_ref_$3 = ccContext.ccUkey_ref_;

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
            delete ccUKey_handlerKeys_$1[ccUniqueKey]; //delete mapping of ccUKey_handlerKeys_;
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
    var handlerKeys = util.safeGetArrayFromObject(ccUKey_handlerKeys_$1, ccUniqueKey);
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
  function findEventHandlersToPerform(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _event = '',
        _identity = null,
        _module = null,
        _ccClassKey = null;

    if (typeof event === 'string') {
      _event = event;
    } else {
      _event = event.name;
      _identity = event.identity;
      _module = event.module;
      _ccClassKey = event.ccClassKey;
    }

    var handlers = _findEventHandlers(_event, _module, _ccClassKey, _identity);

    handlers.forEach(function (_ref) {
      var ccUniqueKey = _ref.ccUniqueKey,
          handlerKey = _ref.handlerKey;

      if (ccUkey_ref_$3[ccUniqueKey] && handlerKey) {
        //  confirm the instance is mounted and handler is not been offed
        var handler = handlerKey_handler_$1[handlerKey];
        if (handler) handler.fn.apply(handler, args);
      }
    });
  }
  function findEventHandlersToOff(event, _ref2) {
    var module = _ref2.module,
        ccClassKey = _ref2.ccClassKey,
        identity = _ref2.identity;

    var handlers = _findEventHandlers(event, module, ccClassKey, identity);

    _deleteEventHandlers(handlers);
  }
  function offEventHandlersByCcUniqueKey(ccUniqueKey) {
    var handlerKeys = ccUKey_handlerKeys_$1[ccUniqueKey];

    if (handlerKeys) {
      var toDeleteHandlers = [];
      handlerKeys.forEach(function (k) {
        return toDeleteHandlers.push(handlerKey_handler_$1[k]);
      });

      _deleteEventHandlers(toDeleteHandlers);
    }
  }
  function getEventItem(event, curStateModule, ccClassKey) {
    //不检查array了... 要求用户需正确传递参数
    if (typeof event === 'object') {
      var _event = Object.assign(event);

      if (event.ctx === true) {
        _event.module = curStateModule;
        _event.ccClassKey = ccClassKey;
      } //否则就允许用户传如自己定义的module, ccClassKey


      return _event;
    } else {
      return {
        name: event
      };
    }
  }

  var ev = /*#__PURE__*/Object.freeze({
    bindEventHandlerToCcContext: bindEventHandlerToCcContext,
    findEventHandlersToPerform: findEventHandlersToPerform,
    findEventHandlersToOff: findEventHandlersToOff,
    offEventHandlersByCcUniqueKey: offEventHandlersByCcUniqueKey,
    getEventItem: getEventItem
  });

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

  function uuid (tag) {
    _currentIndex++;
    var nonceStr = tag || genNonceStr();
    return nonceStr + "_" + _currentIndex;
  }

  function computeCcUniqueKey (isClassSingle, ccClassKey, ccKey, tag) {
    var ccUniqueKey;

    if (isClassSingle) {
      //??? need strict
      if (ccKey) util.justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[" + ccKey + "]");
      ccUniqueKey = ccClassKey;
    } else {
      if (ccKey) {
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      } else {
        var uuidStr = uuid(tag);
        ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
      }
    }

    return ccUniqueKey;
  }

  var getState$3 = ccContext.store.getState;

  function getValFromEvent(e) {
    var se = convertToStandardEvent(e);

    if (se) {
      return se.currentTarget.value;
    } else {
      return e;
    }
  }

  var buildMockEvent = (function (spec, e, refModule) {
    var _ref;

    var ccint = false,
        ccsync = '',
        ccidt = '',
        value = '',
        extraState = undefined,
        ccdelay = -1,
        isToggleBool = false;
    var syncKey = spec[CCSYNC_KEY];
    var type = spec.type;

    if (syncKey !== undefined) {
      //来自生成的sync生成的setter函数调用
      ccsync = syncKey;
      ccdelay = spec.delay;
      ccidt = spec.idt;

      if (type === 'val' || type === 'int') {
        //set value
        ccint = type === 'int'; //convert to int
        //优先从spec里取，取不到的话，从e里面分析并提取

        var val = spec.val;

        if (val === undefined) {
          value = getValFromEvent(e);
        } else {
          if (typeof val === 'function') {
            var keyPath, fullKeyPath, module;

            if (ccsync.includes('/')) {
              var _ccsync$split = ccsync.split('/'),
                  _module = _ccsync$split[0],
                  _keyPath = _ccsync$split[1];

              keyPath = _keyPath;
              fullKeyPath = ccsync;
              module = _module;
            } else {
              keyPath = ccsync;
              fullKeyPath = refModule + "/" + keyPath;
              module = refModule;
            }

            extraState = val(getValFromEvent(e), keyPath, {
              moduleState: getState$3(module),
              fullKeyPath: fullKeyPath
            });
          } else {
            value = val;
          }
        }
      } else if (type === 'bool') {
        //toggle bool
        isToggleBool = true;
      } else return null;
    } else {
      //来自于sync直接调用 <input data-ccsync="foo/f1" onChange={this.sync} /> 
      var se = convertToStandardEvent(e);

      if (se) {
        // e is event
        var currentTarget = se.currentTarget;
        value = currentTarget.value;
        var dataset = currentTarget.dataset;
        if (type === 'int') ccint = true;else ccint = dataset.ccint !== undefined;
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
      extraState: extraState,
      dataset: {
        ccsync: ccsync,
        ccint: ccint,
        ccdelay: ccdelay,
        ccidt: ccidt
      }
    }, _ref.isToggleBool = isToggleBool, _ref;
  });

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

    if (keys.length === 1) {
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

  var getState$4 = ccContext.store.getState;
  function __sync (spec, ref, e) {
    var refCtx = ref.ctx;
    var refModule = refCtx.module;
    var mockE = null;

    if (spec[MOCKE_KEY]) {
      mockE = spec;
    } else {
      //可能是来自$$sync生成的setter调用
      mockE = buildMockEvent(spec, e, refModule);
    }

    if (!mockE) return; //参数无效

    var currentTarget = mockE.currentTarget;
    var dataset = currentTarget.dataset,
        value = currentTarget.value,
        extraState = currentTarget.extraState;
    if (e && e.stopPropagation) e.stopPropagation();
    var ccsync = dataset.ccsync,
        ccint = dataset.ccint,
        ccdelay = dataset.ccdelay,
        ccidt = dataset.ccidt;

    if (ccsync.startsWith('/')) {
      dataset.ccsync = "" + refModule + ccsync; //附加上默认模块值
    }

    if (ccsync.includes('/')) {
      // syncModuleState 同步模块的state状态
      var targetModule = ccsync.split('/')[0];
      var ccKey = refCtx.ccKey,
          ccUniqueKey = refCtx.ccUniqueKey;

      if (extraState) {
        return changeRefState(extraState, {
          calledBy: SYNC,
          ccKey: ccKey,
          ccUniqueKey: ccUniqueKey,
          module: targetModule,
          delay: ccdelay,
          identity: ccidt
        }, ref);
      }

      var fullState = targetModule !== refModule ? getState$4(targetModule) : ref.state;

      var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool),
          state = _extractStateByCcsync.state;

      return changeRefState(state, {
        calledBy: SYNC,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: targetModule,
        delay: ccdelay,
        identity: ccidt
      }, ref);
    } else {
      //调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
      if (extraState) {
        return ref.setState(extraState, null, ccdelay, ccidt);
      }

      var _extractStateByCcsync2 = extractStateByCcsync(ccsync, value, ccint, ref.state, mockE.isToggleBool),
          _state = _extractStateByCcsync2.state;

      return ref.setState(_state, null, ccdelay, ccidt);
    }
  }

  function deh (refCtx, item, handler, fns, immediateKeys) {
    var itype = typeof item;

    if (itype === 'object') {
      if (Array.isArray(item)) {
        // handler._fnName = getFnName();//给函数标记一个名词，方便后面触发trigger时使用
        throw new Error('not support multi keys currently');
      } else {
        okeys(item).forEach(function (key) {
          return fns[key] = item[key];
        });
      }
    } else if (itype === 'function') {
      var ret = item(refCtx);

      if (typeof ret === 'object') {
        okeys(ret).forEach(function (key) {
          return fns[key] = ret[key];
        });
      }
    } else if (itype === 'string') {
      var key = item;
      fns[key] = handler;
      if (immediateKeys) immediateKeys.push(key);
    }
  }

  function getDefineWatchHandler (refCtx, watchFns, immediateWatchKeys) {
    return function (watchItem, watchHandler, immediate) {
      if (immediate) deh(refCtx, watchItem, watchHandler, watchFns, immediateWatchKeys);else deh(refCtx, watchItem, watchHandler, watchFns);
    };
  }

  function getDefineComputedHandler (refCtx, watchFns) {
    return function (computedItem, computedHandler) {
      deh(refCtx, computedItem, computedHandler, watchFns);
    };
  }

  function getOutProps (props) {
    if (props) {
      return props.props || props; //把最外层的props传递给用户
    } else {
      return {};
    }
  }

  var refStore$1 = ccContext.refStore,
      ccClassKey_ccClassContext_$5 = ccContext.ccClassKey_ccClassContext_,
      getState$5 = ccContext.store.getState,
      moduleName_ccClassKeys_$2 = ccContext.moduleName_ccClassKeys_,
      _computedValue$3 = ccContext.computed._computedValue;
  var okeys$3 = okeys,
      me$4 = makeError,
      vbi$4 = verboseInfo;
  var idSeq = 0;

  function getEId() {
    idSeq++;
    return Symbol("__autoGen_" + idSeq + "__");
  } //调用buildFragmentRefCtx 之前，props参数已被处理过

  /**
   * 构建refCtx，附加到ref.cc上
   * liteLevel 越小，绑定的方法越少
   */


  function buildRefCtx (ref, params, liteLevel) {
    if (liteLevel === void 0) {
      liteLevel = 3;
    }

    var reactSetState = ref.setState.bind(ref);
    var reactForceUpdate = ref.forceUpdate.bind(ref);
    var isSingle = params.isSingle,
        ccClassKey = params.ccClassKey,
        ccKey = params.ccKey,
        module = params.module,
        reducerModule = params.reducerModule,
        type = params.type,
        _params$state = params.state,
        state = _params$state === void 0 ? {} : _params$state,
        storedKeys = params.storedKeys,
        watchedKeys = params.watchedKeys,
        connect = params.connect,
        tag = params.tag,
        ccOption = params.ccOption;
    reducerModule = reducerModule || module;
    var stateModule = module; //用户使用ccKey属性的话，必需显示的指定ccClassKey

    if (ccKey && !ccClassKey) {
      throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
    }

    var _storedKeys = [];

    if (storedKeys !== undefined && storedKeys.length > 0) {
      if (!ccKey) throw me$4(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi$4("ccClassKey[" + ccClassKey + "]"));
      _storedKeys = storedKeys;
    }

    var ccUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey, tag);
    var classCtx = ccClassKey_ccClassContext_$5[ccClassKey];
    var connectedComputed = classCtx.connectedComputed || {};
    var connectedState = classCtx.connectedState || {};
    var moduleState = getState$5(module);
    var moduleComputed = _computedValue$3[module] || {};
    var globalComputed = _computedValue$3[MODULE_GLOBAL] || {};
    var globalState = getState$5(MODULE_GLOBAL);
    var refConnectedComputed = {};
    okeys$3(connect).forEach(function (moduleName) {
      refConnectedComputed[moduleName] = {};
    }); // recover ref state

    var refStoredState = refStore$1._state[ccUniqueKey] || {};
    var mergedState = Object.assign({}, state, refStoredState, moduleState);
    ref.state = mergedState; // record ref

    setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey, {}); // record ccClassKey

    var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_$2, module);
    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey); // create cc api

    var _setState = function _setState(module, state, calledBy, reactCallback, delay, identity) {
      changeRefState(state, {
        calledBy: calledBy,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: module,
        delay: delay,
        identity: identity,
        reactCallback: reactCallback
      }, ref);
    };

    var setGlobalState = function setGlobalState(state, reactCallback, delay, identity) {
      _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, delay, identity);
    };

    var setModuleState = function setModuleState(module, state, reactCallback, delay, identity) {
      _setState(module, state, SET_MODULE_STATE, reactCallback, delay, identity);
    }; // const setState = (state, reactCallback, delay, identity) => {


    var setState = function setState(p1, p2, p3, p4, p5) {
      if (typeof p1 === 'string') {
        //p1 module, p2 state, p3 cb, p4 delay, p5 idt
        setModuleState(p1, p2, p3, p4, p5);
      } else {
        //p1 state, p2 cb, p3 delay, p4 idt
        _setState(stateModule, p1, SET_STATE, p2, p3, p4);
      }
    };

    var forceUpdate = function forceUpdate(reactCallback, delay, identity) {
      _setState(stateModule, ref.state, FORCE_UPDATE, reactCallback, delay, identity);
    };

    var changeState = function changeState(state, option) {
      changeRefState(state, option, ref);
    };

    var dispatch$$1 = makeDispatchHandler(ref, false, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule);
    var lazyDispatch = makeDispatchHandler(ref, true, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule);
    var invoke = makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey);
    var lazyInvoke = makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey, {
      isLazy: true
    });

    var syncBool = function syncBool(e, delay, idt) {
      var _sync$bind;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return __sync.bind(null, (_sync$bind = {}, _sync$bind[CCSYNC_KEY] = e, _sync$bind.type = 'bool', _sync$bind.delay = delay, _sync$bind.idt = idt, _sync$bind), ref);

      __sync({
        type: 'bool'
      }, e, ref);
    };

    var sync = function sync(e, val, delay, idt) {
      var _sync$bind2;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return __sync.bind(null, (_sync$bind2 = {}, _sync$bind2[CCSYNC_KEY] = e, _sync$bind2.type = 'val', _sync$bind2.val = val, _sync$bind2.delay = delay, _sync$bind2.idt = idt, _sync$bind2), ref);

      __sync({
        type: 'val'
      }, ref, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />

    };

    var set = function set(ccsync, val, delay, idt) {
      var _sync;

      __sync((_sync = {}, _sync[CCSYNC_KEY] = ccsync, _sync.type = 'val', _sync.val = val, _sync.delay = delay, _sync.idt = idt, _sync), ref);
    };

    var setBool = function setBool(ccsync, delay, idt) {
      var _sync2;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      __sync((_sync2 = {}, _sync2[CCSYNC_KEY] = ccsync, _sync2.type = 'bool', _sync2.delay = delay, _sync2.idt = idt, _sync2), ref);
    };

    var syncInt = function syncInt(e, delay, idt) {
      var _sync$bind3;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return __sync.bind(null, (_sync$bind3 = {}, _sync$bind3[CCSYNC_KEY] = e, _sync$bind3.type = 'int', _sync$bind3.delay = delay, _sync$bind3.idt = idt, _sync$bind3), ref);

      __sync({
        type: 'int'
      }, ref, e);
    };

    var emit = function emit(event) {
      var _event = getEventItem(event, stateModule, ccClassKey);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      findEventHandlersToPerform.apply(ev, [_event].concat(args));
    };

    var off = function off(event, _temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          module = _ref.module,
          ccClassKey = _ref.ccClassKey,
          identity = _ref.identity;

      findEventHandlersToOff(event, {
        module: module,
        ccClassKey: ccClassKey,
        identity: identity
      });
    };

    var on = function on(event, handler, identity) {
      if (identity === void 0) {
        identity = null;
      }

      bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };

    var effectItems = []; // {fn:function, status:0, eId:'', immediate:true}

    var eid_effectReturnCb_ = {}; // fn

    var effectMeta = {
      effectItems: effectItems,
      eid_effectReturnCb_: eid_effectReturnCb_
    };

    var defineEffect = function defineEffect(fn, stateKeys, eId, immediate) {
      if (immediate === void 0) {
        immediate = true;
      }

      if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');

      if (stateKeys !== null && stateKeys !== undefined) {
        if (!Array.isArray(stateKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
      }

      var _eId = eId || getEId(); // const effectItem = { fn: _fn, stateKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };


      var effectItem = {
        fn: fn,
        stateKeys: stateKeys,
        eId: _eId,
        immediate: immediate
      };
      effectItems.push(effectItem);
    };

    var aux = {},
        watchFns = {},
        computedFns = {};
    var immediateWatchKeys = [];
    var ctx = {
      // static params
      type: type,
      module: module,
      reducerModule: reducerModule,
      ccClassKey: ccClassKey,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      renderCount: 1,
      initTime: Date.now(),
      storedKeys: _storedKeys,
      watchedKeys: watchedKeys,
      connect: connect,
      ccOption: ccOption,
      props: getOutProps(ref.props),
      prevState: Object.assign({}, mergedState),
      // state
      state: mergedState,
      moduleState: moduleState,
      globalState: globalState,
      connectedState: connectedState,
      // computed
      refComputed: {},
      refConnectedComputed: refConnectedComputed,
      moduleComputed: moduleComputed,
      globalComputed: globalComputed,
      connectedComputed: connectedComputed,
      //collect CcHook mapProps result
      mapped: {},
      // api meta data
      watchFns: watchFns,
      computedFns: computedFns,
      immediateWatchKeys: immediateWatchKeys,
      watchSpec: {},
      computedSpec: {},
      execute: null,
      reducer: {},
      lazyReducer: {},
      aux: aux,
      // auxiliary method map
      effectMeta: effectMeta,
      // api
      reactSetState: reactSetState,
      reactForceUpdate: reactForceUpdate,
      setState: setState,
      setGlobalState: setGlobalState,
      setModuleState: setModuleState,
      forceUpdate: forceUpdate,
      changeState: changeState,
      dispatch: dispatch$$1,
      lazyDispatch: lazyDispatch,
      invoke: invoke,
      lazyInvoke: lazyInvoke,
      syncBool: syncBool,
      sync: sync,
      set: set,
      setBool: setBool,
      syncInt: syncInt,
      emit: emit,
      on: on,
      off: off,
      defineEffect: defineEffect,
      // alias
      effect: defineEffect,
      __$$ccForceUpdate: makeCcForceUpdateHandler(ref),
      __$$ccSetState: makeCcSetStateHandler(ref)
    };

    ctx.defineExecute = function (handler) {
      return ctx.execute = handler;
    };

    var defineWatch = getDefineWatchHandler(ctx, watchFns, immediateWatchKeys);
    var defineComputed = getDefineComputedHandler(ctx, computedFns);

    var defineAuxMethod = function defineAuxMethod(methodName, handler) {
      return ctx.aux[methodName] = handler;
    }; // api


    ctx.defineWatch = defineWatch;
    ctx.defineComputed = defineComputed;
    ctx.defineAuxMethod = defineAuxMethod; // alias

    ctx.watch = defineWatch;
    ctx.computed = defineComputed;
    ref.ctx = ctx;
    ref.setState = setState;
    ref.forceUpdate = forceUpdate;
  }

  var getState$6 = ccContext.store.getState;
  /** 由首次render触发 */

  function triggerComputedAndWatch (ref) {
    var ctx = ref.ctx;
    var computedSpec = ctx.computedSpec,
        watchSpec = ctx.watchSpec,
        connect = ctx.connect,
        refModule = ctx.module;

    if (computedSpec.hasFn) {
      var refState = ref.state;
      computeValueForRef(ctx, refModule, refState, refState);
      okeys(connect).forEach(function (m) {
        var mState = getState$6(m);
        computeValueForRef(ctx, m, mState, mState);
      });
    }

    if (watchSpec.hasFn) {
      var immediateWatchKeys = watchSpec.immediateWatchKeys;

      if (immediateWatchKeys.length > 0) {
        var module_stateSpec_ = {};
        immediateWatchKeys.forEach(function (key) {
          var targetModule, targetStateKey;

          if (key.includes('/')) {
            var _key$split = key.split('/'),
                module = _key$split[0],
                stateKey = _key$split[1];

            targetModule = module || refModule; // key: 'foo/f1' or '/f1'

            targetStateKey = stateKey;
          } else {
            targetModule = refModule;
            targetStateKey = key;
          }

          var stateSpec = safeGetObjectFromObject(module_stateSpec_, targetModule, {
            state: {},
            module: targetModule
          });
          stateSpec.state[targetStateKey] = getState$6(targetModule)[targetStateKey];
        });
        Object.values(module_stateSpec_).forEach(function (stateSpec) {
          var module = stateSpec.module,
              state = stateSpec.state;
          watchKeyForRef(ctx, module, getState$6(module), state);
        });
      }
    }
  }

  function getComputedSpec (computedFns, module) {
    var hasFn = Object.keys(computedFns).length > 0;
    return {
      computedFns: computedFns,
      module: module,
      hasFn: hasFn
    };
  }

  function getWatchSpec (watchFns, immediateWatchKeys) {
    if (immediateWatchKeys === void 0) {
      immediateWatchKeys = [];
    }

    var hasFn = Object.keys(watchFns).length > 0;
    return {
      watchFns: watchFns,
      immediateWatchKeys: immediateWatchKeys,
      hasFn: hasFn
    };
  }

  var safeGetObjectFromObject$1 = safeGetObjectFromObject,
      okeys$4 = okeys;
  var _reducerModule_fnNames_ = ccContext.reducer._reducerModule_fnNames_;
  function beforeMount (ref, setup, bindCtxToMethod) {
    var ctx = ref.ctx;
    var reducer = ctx.reducer,
        lazyReducer = ctx.lazyReducer,
        dispatch = ctx.dispatch,
        lazyDispatch = ctx.lazyDispatch,
        connect = ctx.connect,
        module = ctx.module;
    var connectedModules = okeys$4(connect);
    var allModules = connectedModules.slice();
    if (!allModules.includes(module)) allModules.push(module); //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
    //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

    allModules.forEach(function (m) {
      var refReducerFnObj = safeGetObjectFromObject$1(reducer, m);
      var refLazyReducerFnObj = safeGetObjectFromObject$1(lazyReducer, m);
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
      var watchFns = ctx.watchFns,
          computedFns = ctx.computedFns,
          immediateWatchKeys = ctx.immediateWatchKeys;
      if (typeof setup !== 'function') throw new Error('type of setup must be function');
      var settingsObj = setup(ctx) || {};
      if (!isPlainJsonObject(settingsObj)) throw new Error('type of setup return result must be an plain json object');
      var globalBindCtx = ccContext.bindCtxToMethod; //优先读自己的，再读全局的

      if (bindCtxToMethod === true || globalBindCtx === true && bindCtxToMethod !== false) {
        okeys$4(settingsObj).forEach(function (name) {
          var settingValue = settingsObj[name];
          if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
        });
      }

      ctx.settings = settingsObj;
      ctx.computedSpec = getComputedSpec(computedFns);
      ctx.watchSpec = getWatchSpec(watchFns, immediateWatchKeys);
    }

    triggerComputedAndWatch(ref);
  }

  function beforeUnmount (ref) {
    //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
    //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
    ref.__$$isUnmounted = true;
    var ctx = ref.ctx;
    var eid_effectReturnCb_ = ctx.effectMeta.eid_effectReturnCb_;
    Object.getOwnPropertySymbols(eid_effectReturnCb_).forEach(function (symbolKey) {
      var cb = eid_effectReturnCb_[symbolKey];
      if (typeof cb === 'function') cb(ctx);
    });
    okeys(eid_effectReturnCb_).forEach(function (eId) {
      var cb = eid_effectReturnCb_[eId];
      if (typeof cb === 'function') cb(ctx);
    });
    var ccUniqueKey = ctx.ccUniqueKey,
        ccClassKey = ctx.ccClassKey;
    offEventHandlersByCcUniqueKey(ccUniqueKey);
    unsetRef(ccClassKey, ccUniqueKey);
  }

  var moduleName_stateKeys_$4 = ccContext.moduleName_stateKeys_,
      _ccContext$store$1 = ccContext.store,
      getPrevState$1 = _ccContext$store$1.getPrevState,
      getState$7 = _ccContext$store$1.getState;
  function triggerSetupEffect (ref, callByDidMount) {
    var ctx = ref.ctx;
    var _ctx$effectMeta = ctx.effectMeta,
        effectItems = _ctx$effectMeta.effectItems,
        eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_;

    if (callByDidMount) {
      effectItems.forEach(function (item) {
        if (item.immediate === false) return;
        var cb = item.fn(ctx);
        if (cb) eid_effectReturnCb_[item.eId] = cb;
      });
    } else {
      //callByDidUpdate
      var prevState = ctx.prevState;
      var curState = ref.state;
      var toBeExecutedFns = [];
      effectItems.forEach(function (item) {
        // const { status, stateKeys, fn, eId } = item;
        // if (status === EFFECT_STOPPED) return;
        var stateKeys = item.stateKeys,
            fn = item.fn,
            eId = item.eId;

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

              var _prevState = getPrevState$1(module);

              if (!_prevState) {
                justWarning("key[" + key + "] is invalid, its module[" + module + "] has not been declared in store!");
                continue;
              }

              if (!moduleName_stateKeys_$4[module].includes(unmoduledKey)) {
                justWarning("key[" + key + "] is invalid, its unmoduledKey[" + unmoduledKey + "] has not been declared in state!");
                continue;
              }

              targetCurState = getState$7(module);
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
            toBeExecutedFns.push({
              fn: fn,
              eId: eId
            });
          }
        } else {
          toBeExecutedFns.push({
            fn: fn,
            eId: eId
          });
        }
      });
      toBeExecutedFns.forEach(function (item) {
        var fn = item.fn,
            eId = item.eId;
        var cb = fn(ctx);
        if (cb) eid_effectReturnCb_[eId] = cb;
      });
    }
  }

  function getStoredKeys (refDeclaredState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
    var targetStoredKeys = ccOptionStoredKeys || registerStoredKeys;

    if (!targetStoredKeys) {
      return [];
    }

    if (targetStoredKeys === '*') {
      return Object.keys(refDeclaredState).filter(function (k) {
        return !moduleStateKeys.includes(k);
      });
    } else {
      checkStoredKeys(moduleStateKeys, targetStoredKeys);
      return targetStoredKeys;
    }
  }

  var moduleName_stateKeys_$5 = ccContext.moduleName_stateKeys_;
  var ccClassDisplayName$1 = util.ccClassDisplayName,
      styleStr$2 = util.styleStr,
      color$2 = util.color,
      verboseInfo$2 = util.verboseInfo,
      makeError$3 = util.makeError;
  var cl$1 = color$2;
  var ss$1 = styleStr$2;
  var me$5 = makeError$3;
  var vbi$5 = verboseInfo$2;
  function register(_temp, ccClassKey) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        _ref$watchedKeys = _ref.watchedKeys,
        inputWatchedKeys = _ref$watchedKeys === void 0 ? '*' : _ref$watchedKeys,
        _ref$storedKeys = _ref.storedKeys,
        inputStoredKeys = _ref$storedKeys === void 0 ? [] : _ref$storedKeys,
        persistStoredKeys = _ref.persistStoredKeys,
        _ref$connect = _ref.connect,
        connect = _ref$connect === void 0 ? {} : _ref$connect,
        _ref$tag = _ref.tag,
        tag = _ref$tag === void 0 ? '' : _ref$tag,
        reducerModule = _ref.reducerModule,
        _ref$isPropsProxy = _ref.isPropsProxy,
        isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
        _ref$isSingle = _ref.isSingle,
        isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
        _ref$__checkStartUp = _ref.__checkStartUp,
        __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
        _ref$compareProps = _ref.compareProps,
        compareProps = _ref$compareProps === void 0 ? true : _ref$compareProps,
        __calledBy = _ref.__calledBy;

    if (ccClassKey === void 0) {
      ccClassKey = '';
    }

    try {
      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, CC_CLASS_PREFIX, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy),
          _module = _mapRegistrationInfo._module,
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      return function (ReactClass) {
        if (ReactClass.prototype && ReactClass.prototype.$$attach) {
          throw me$5(ERR.CC_REGISTER_A_CC_CLASS, vbi$5("CcClass can not been registered!"));
        } // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;


        var ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;

        var _CcClass =
        /*#__PURE__*/
        function (_ToBeExtendedClass) {
          _inheritsLoose(CcClass, _ToBeExtendedClass);

          function CcClass(props, context) {
            var _this;

            try {
              _this = _ToBeExtendedClass.call(this, props, context) || this;
              _this.state = _this.state || {};
              _this.$$attach = _this.$$attach.bind(_assertThisInitialized(_this));

              var _tag = props.ccTag || tag;

              var ccOption = props.ccOption || {
                persistStoredKeys: persistStoredKeys
              };
              var declaredState = _this.state;

              var _storedKeys = getStoredKeys(declaredState, moduleName_stateKeys_$5[_module], ccOption.storedKeys, inputStoredKeys);

              var params = Object.assign({}, props, {
                isSingle: isSingle,
                module: _module,
                reducerModule: _reducerModule,
                tag: _tag,
                state: declaredState,
                type: CC_CLASS_PREFIX,
                watchedKeys: _watchedKeys,
                ccClassKey: _ccClassKey,
                connect: _connect,
                storedKeys: _storedKeys,
                ccOption: ccOption
              });
              buildRefCtx(_assertThisInitialized(_this), params);
              if (_this.$$setup) _this.$$setup = _this.$$setup.bind(_assertThisInitialized(_this));
              beforeMount(_assertThisInitialized(_this), _this.$$setup, false);
            } catch (err) {
              catchCcError(err);
            }

            return _this;
          } // 如果代理组件或者继承组件没有没有实现scu，则同时比较nextState nextProps
          // 因为nextProps不同也会导致重渲染，所以需要约束用户不要把可变数据从props传下来，以提高性能


          var _proto = CcClass.prototype;

          _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            var childRef = this.ctx.childRef;

            if (childRef && childRef.shouldComponentUpdate) {
              return childRef.shouldComponentUpdate(nextProps, nextState);
            } else if (_ToBeExtendedClass.prototype.shouldComponentUpdate) {
              return _ToBeExtendedClass.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
            }

            var isPropsChanged = compareProps ? shallowDiffers(this.props, nextProps) : false;
            return this.state !== nextState || isPropsChanged;
          } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
          //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
          ;

          _proto.$$attach = function $$attach(childRef) {
            var _this2 = this;

            this.ctx.reactSetState = childRef.setState.bind(childRef);
            this.ctx.reactForceUpdate = childRef.forceUpdate.bind(childRef); // childRef.childRefRea

            ['setState', 'forceUpdate'].forEach(function (m) {
              childRef[m] = _this2[m].bind(_this2);
            });
            var ctx = this.ctx;
            ctx.childRef = childRef;
            childRef.ctx = ctx; //替换掉cc.__$$ccSetState cc.__$$ccForceUpdate, 让changeRefState正确的更新目标实例

            ctx.__$$ccSetState = makeCcSetStateHandler(childRef, this);
            ctx.__$$ccForceUpdate = makeCcForceUpdateHandler(childRef);
            var childRefState = childRef.state;
            var thisState = this.state;
            if (!childRefState) childRefState = childRef.state = {};
            var newState = Object.assign({}, childRefState, thisState);
            childRef.state = newState; //在childRef进入首次render流程前，提前赋值

            ctx.state = newState; //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
            // this.state = newState; // bad writing

            okeys(newState).forEach(function (key) {
              return thisState[key] = newState[key];
            });
            beforeMount(childRef, childRef.$$setup);
            triggerComputedAndWatch(childRef);
          };

          _proto.componentDidMount = function componentDidMount() {
            if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this); // 代理模式不再强制检查$$attach是否给调用
            // if (isPropsProxy === true && !this.ctx.childRef) {
            //   throw new Error('you forgot to call this.props.$$attach(this) in constructor, you must call it after state assign expression next line!');
            // }

            triggerSetupEffect(this, true);
          };

          _proto.componentDidUpdate = function componentDidUpdate() {
            if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this);
            triggerSetupEffect(this);
            this.ctx.prevState = Object.assign({}, this.state);
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
            beforeUnmount(this);
          };

          _proto.render = function render() {
            if (ccContext.isDebug) {
              console.log(ss$1("@@@ render " + ccClassDisplayName$1(_ccClassKey)), cl$1());
            }

            if (isPropsProxy === false) {
              //now cc class extends ReactClass, call super.render()
              return _ToBeExtendedClass.prototype.render.call(this);
            } else {
              //将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
              return React.createElement(ReactClass, {
                ctx: this.ctx,
                $$attach: this.$$attach
              });
            }
          };

          return CcClass;
        }(ToBeExtendedClass);

        if (_ccClassKey === CC_DISPATCHER) _CcClass.displayName = 'CcDispatcher';else _CcClass.displayName = ccClassDisplayName$1(_ccClassKey);
        return _CcClass;
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

      function DefaultComponent() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = DefaultComponent.prototype;

      _proto.render = function render() {
        return this.props.children || React.createElement('span', {
          style: {
            display: 'none'
          }
        });
      };

      return DefaultComponent;
    }(React.Component);

    if (ccContext.refs[CC_DISPATCHER]) {
      if (ccContext.isHotReloadMode()) {
        util.justTip("hot reload mode, CC_DISPATCHER existed");
      } else {
        throw new Error("CcDispatcher can only be initialize one time");
      }
    }

    var TargetComponent = CustomizedComponent || DefaultComponent;
    return register({
      isSingle: true,
      __checkStartUp: false,
      __calledBy: 'cc'
    }, CC_DISPATCHER)(TargetComponent);
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

  function setState$1 (module, state, delay, identity, skipMiddleware) {
    if (delay === void 0) {
      delay = -1;
    }

    try {
      var ref = pickOneRef(module);
      var option = {
        ccKey: '[[top api:cc.setState]]',
        module: module,
        delay: delay,
        identity: identity,
        skipMiddleware: skipMiddleware
      };
      ref.ctx.changeState(state, option);
    } catch (err) {
      strictWarning(err);
    }
  }

  var ccStoreSetState = ccContext.store.setState;
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

    ccStoreSetState(MODULE_GLOBAL, validGlobalState);
    return {
      partialState: validGlobalState,
      isStateEmpty: isStateEmpty
    };
  }

  function makeSetStateHandler (module) {
    return function (state) {
      try {
        setState$1(module, state, 0);
      } catch (err) {
        if (module === MODULE_GLOBAL) {
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

  function dispatch$1 (isLazy, action, payLoadWhenActionIsString, delay, identity, _temp) {
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
          dispatchFn = isLazy ? targetRef.ctx.lazyDispatch : targetRef.ctx.dispatch;
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

        dispatchFn = isLazy ? ref.ctx.lazyDispatch : ref.ctx.dispatch;
      }

      if (typeof action === 'string' && action.startsWith('*')) {
        var reducerModName = action.split('/').pop();
        var fullFnNames = ccContext.reducer._reducerFnName_fullFnNames_[reducerModName];
        if (!fullFnNames) return;
        var tasks = [];
        fullFnNames.forEach(function (fullFnName) {
          tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, delay, identity));
        });
        return Promise.all(tasks);
      } else {
        return dispatchFn(action, payLoadWhenActionIsString, delay, identity);
      }
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function dispatch$2 (action, payLoadWhenActionIsString, delay, identity, option) {
    return dispatch$1(false, action, payLoadWhenActionIsString, delay, identity, option);
  }

  function lazyDispatch (action, payLoadWhenActionIsString, delay, identity, option) {
    dispatch$1(true, action, payLoadWhenActionIsString, delay, identity, option);
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
        _reducerFnName_fullFnNames_ = _ccContext$reducer._reducerFnName_fullFnNames_,
        _reducerModule_fnNames_ = _ccContext$reducer._reducerModule_fnNames_;
    _reducer[module] = reducer;
    var subReducerCaller = safeGetObjectFromObject(_reducerCaller, module);
    var subLazyReducerCaller = safeGetObjectFromObject(_lazyReducerCaller, module);
    var fnNames = safeGetArrayFromObject(_reducerModule_fnNames_, module);
    var reducerNames = okeys(reducer);
    reducerNames.forEach(function (name) {
      fnNames.push(name);
      var fullFnName = module + "/" + name;

      subReducerCaller[name] = function (payload, delay, idt) {
        return dispatch$2(fullFnName, payload, delay, idt);
      };

      subLazyReducerCaller[name] = function (payload, delay, idt) {
        return lazyDispatch(fullFnName, payload, delay, idt);
      };

      var reducerFn = reducer[name];

      if (typeof reducerFn !== 'function') {
        throw new Error("reducer key[" + name + "] 's value is not a function");
      } else {
        reducerFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名
      } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
      // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
      // reducerFn.stateModule = module;


      var list = safeGetArrayFromObject(_reducerFnName_fullFnNames_, name);
      list.push(fullFnName);
    });
  }

  var safeGetObjectFromObject$2 = safeGetObjectFromObject,
      isPlainJsonObject$2 = isPlainJsonObject,
      strictWarning$1 = strictWarning;
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

        var ccModuleWatch = safeGetObjectFromObject$2(rootWatch, module);
        ccModuleWatch[key] = fn;
      } else {
        strictWarning$1("watch." + module + "'s key[" + key + "] is not declared in store." + module + "!");
      }
    });
  }

  var safeGetObjectFromObject$3 = safeGetObjectFromObject,
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
        var moduleComputedFn = safeGetObjectFromObject$3(rootComputedFn, module);
        var fn = computed[key];
        moduleComputedFn[key] = fn;
        var computedValue = fn(originalValue, originalValue, moduleState);
        var moduleComputedValue = safeGetObjectFromObject$3(rootComputedValue, module);
        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        justWarning("computed." + module + "'s key[" + key + "] is not declared in store." + module + "'s state!");
      }
    });
  }

  var isPlainJsonObject$4 = isPlainJsonObject,
      okeys$5 = okeys;
  /** 对已有的store.$$global状态追加新的state */
  // export function appendGlobalState(globalState) {
  //   // todo
  // }

  function configStoreState(storeState) {
    if (!isPlainJsonObject$4(storeState)) {
      throw new Error("the storeState is not a plain json object!");
    }

    var store = ccContext.store;
    store.initStateDangerously(MODULE_CC, {});
    if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
    if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
    var moduleNames = okeys$5(storeState);
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
    if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
    if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
    var moduleNames = okeys$5(rootReducer);
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

    var moduleNames = okeys$5(computed);
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

    var moduleNames = okeys$5(init);
    moduleNames.forEach(function (moduleName) {
      checkModuleName(moduleName, false, "there is no module state defined in store for init." + moduleName);
      var initFn = init[moduleName];

      if (initFn) {
        co(initFn).then(function (state) {
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

      clearCbs(); //清理掉已映射好的插件回调

      var pluginNameMap = {};
      plugins.forEach(function (p) {
        ccPlugins.push(p);

        if (p.install) {
          var pluginInfo = p.install(on);
          var e = new Error('plugin.install must return result:{name:string, options?:object}');
          if (!pluginInfo) throw e;
          var pluginName = pluginInfo.name;
          if (!pluginName) throw e;
          if (pluginNameMap[pluginName]) throw new Error("pluginName[" + pluginName + "] duplicate");
          pluginNameMap[pluginName] = 1;
        } else {
          throw new Error('a plugin must export install handler!');
        }
      });
    }
  }

  var justCalledByStartUp = false;

  function _clearInsAssociation() {
    clearObject(ccContext.event_handlers_);
    clearObject(ccContext.ccUKey_handlerKeys_);
    var cct = ccContext.ccClassKey_ccClassContext_;
    Object.keys(cct).forEach(function (ccClassKey) {
      var ctx = cct[ccClassKey];
      clearObject(ctx.ccKeys);
    });
    clearObject(ccContext.handlerKey_handler_);
    clearObject(ccContext.ccUkey_ref_, [CC_DISPATCHER]);
    clearObject(ccContext.refs, [CC_DISPATCHER]);
    clearObject(ccContext.ccUkey_option_);
  }

  function _clearAll() {
    clearObject(ccContext.globalStateKeys);
    clearObject(ccContext.reducer._reducer);
    clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER], {});
    clearObject(ccContext.computed._computedFn);
    clearObject(ccContext.computed._computedValue);

    _clearInsAssociation();
  }

  function _prepareClear(cb) {
    if (ccContext.isCcAlreadyStartup) {
      if (ccContext.isHotReloadMode()) {
        cb();
      } else {
        console.warn("clear failed because of not running under hot reload mode!");
      }
    } else {
      //还没有启动过，泽只是标记justCalledByStartUp为true
      justCalledByStartUp = true;
    }
  }

  function clearContextIfUnderHotReloadMode (clearAll, warningErrForClearAll) {
    if (clearAll === void 0) {
      clearAll = false;
    }

    _prepareClear(function () {
      if (clearAll) {
        justCalledByStartUp = true;

        _clearAll();

        console.warn(warningErrForClearAll);
      } else {
        // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
        // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命名单独放置在一个脚本里，
        // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
        // runConcent调用清理把justCalledByStartUp置为true，则renderApp就可以不用执行了
        // 随后只是改了某个component文件时，则只会触发 renderApp，
        // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
        if (justCalledByStartUp) {
          justCalledByStartUp = false;
          return;
        }

        console.warn("attention: method[clearContextIfUnderHotReloadMode] need been invoked before your app rendered!");

        _clearInsAssociation();
      }
    });
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
      var err = util.makeError(ERR.CC_ALREADY_STARTUP);
      clearContextIfUnderHotReloadMode(true, err);
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

          ReactDOM.render(React.createElement(Dispatcher), box);
          util.justTip("[[startUp]]: cc create a CcDispatcher automatically");
        } else {
          util.justTip("[[startUp]]: CcDispatcher existed already");
        }
      } else {
        throw new Error('customizing Dispatcher is not allowed in current version cc');
      }

      bindToWindow('CC_CONTEXT', ccContext);
      bindToWindow('ccc', ccContext);
      bindToWindow('cccc', ccContext.computed._computedValue);
      bindToWindow('sss', ccContext.store._state);
      ccContext.isCcAlreadyStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

      configPlugins(plugins);
    } catch (err) {
      if (errorHandler) errorHandler(err);else throw err;
    }
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

        if (rmName === MODULE_GLOBAL) {
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

    send(SIG_MODULE_CONFIGURED, module);
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
   * @param {{isStrict:boolean}} option
   */

  function _run (store, option) {
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
   * @param {Array<string>|string} [registerOption.watchedKeys] 
   * declare current cc class's any instance is concerned which state keys's state changing,
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
   * and if you always want to use R1 reducer function to generate new state, you can write like below
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
   * @param {string} [registerOption.isPropsProxy] default is false
   * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
   * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
   * you can set isPropsProxy as true, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
   * all the cc instance method and property you can get them from both `this.props` and `this.`, for example
   * ```
   *    @cc.register({
   *      connect: {'form': ['regularFormSubmitting']},
   *      isPropsProxy: true 
   *    },'BasicForms')
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

  function register$1 (registerOption, ccClassKey) {
    var _registerOption = registerOption;

    if (_registerOption) {
      var optType = typeof _registerOption;

      if (optType === 'object') {
        delete _registerOption.__checkStartUp;
        delete _registerOption.__calledBy;
      } else if (optType === 'string') {
        _registerOption = {
          module: registerOption
        };
      } else {
        throw new Error('registerOption type error, must be array or string');
      }
    } else {
      _registerOption = {
        module: MODULE_DEFAULT
      };
    }

    return register(_registerOption, ccClassKey);
  }

  function _connect (connectSpec, ccClassKey) {
    return register$1({
      connect: connectSpec
    }, ccClassKey);
  }

  var shallowDiffers$1 = shallowDiffers;
  var moduleName_stateKeys_$6 = ccContext.moduleName_stateKeys_;
  var nullSpan = React.createElement('span', {
    style: {
      display: 'none'
    }
  });

  var CcFragment =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(CcFragment, _React$Component);

    function CcFragment(props, context) {
      var _this;

      _this = _React$Component.call(this, props, context) || this; // 非registerDumb调用，即直接使用<CcFragment />做初始化， 把组件的注册信息映射到ccContext

      if (props.__$$regDumb !== true) {
        var _props$module = props.module,
            module = _props$module === void 0 ? MODULE_DEFAULT : _props$module,
            propsCcClassKey = props.ccClassKey,
            ccKey = props.ccKey,
            ccTag = props.ccTag,
            _props$watchedKeys = props.watchedKeys,
            watchedKeys = _props$watchedKeys === void 0 ? '*' : _props$watchedKeys,
            _props$ccOption = props.ccOption,
            ccOption = _props$ccOption === void 0 ? {} : _props$ccOption,
            _props$connect = props.connect,
            connect = _props$connect === void 0 ? {} : _props$connect,
            reducerModule = props.reducerModule,
            _props$state = props.state,
            state = _props$state === void 0 ? {} : _props$state,
            isSingle = props.isSingle; //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys

        var _mapRegistrationInfo = mapRegistrationInfo(module, propsCcClassKey, CC_FRAGMENT_PREFIX, watchedKeys, ccOption.storedKeys, connect, reducerModule, true),
            _module = _mapRegistrationInfo._module,
            _reducerModule = _mapRegistrationInfo._reducerModule,
            _watchedKeys = _mapRegistrationInfo._watchedKeys,
            _ccClassKey = _mapRegistrationInfo._ccClassKey,
            _connect = _mapRegistrationInfo._connect;

        var storedKeys = getStoredKeys(state, moduleName_stateKeys_$6[_module], ccOption.storedKeys, []);
        buildRefCtx(_assertThisInitialized(_this), {
          isSingle: isSingle,
          ccKey: ccKey,
          connect: _connect,
          state: state,
          module: _module,
          reducerModule: _reducerModule,
          storedKeys: storedKeys,
          watchedKeys: _watchedKeys,
          tag: ccTag,
          ccClassKey: _ccClassKey,
          ccOption: ccOption,
          type: CC_FRAGMENT_PREFIX
        });
      } else {
        var outProps = getOutProps(props);

        var _ccOption = outProps.ccOption || props.ccOption;

        var _storedKeys = getStoredKeys(props.state, moduleName_stateKeys_$6[props.module], _ccOption.storedKeys, props.storedKeys);

        var params = Object.assign({}, props, {
          storedKeys: _storedKeys,
          ccOption: _ccOption,
          type: CC_FRAGMENT_PREFIX
        });
        buildRefCtx(_assertThisInitialized(_this), params);
      }

      _this.setState = _this.ctx.setState;
      _this.forceUpdate = _this.ctx.forceUpdate;
      beforeMount(_assertThisInitialized(_this), props.setup, props.bindCtxToMethod);
      _this.__$$compareProps = props.compareProps || true;
      return _this;
    }

    var _proto = CcFragment.prototype;

    _proto.componentDidMount = function componentDidMount() {
      triggerSetupEffect(this, true);
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      var isPropsChanged = this.__$$compareProps ? shallowDiffers$1(getOutProps(nextProps), getOutProps(this.props)) : false;
      return this.state !== nextState || isPropsChanged;
    };

    _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
      //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
      this.ctx.props = getOutProps(nextProps);
      this.ctx.state = nextState;
    } // componentDidUpdate(prevProps, prevState) {
    ;

    _proto.componentDidUpdate = function componentDidUpdate() {
      triggerSetupEffect(this); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用

      this.ctx.prevState = Object.assign({}, this.state); // this.ctx.prevProps = this.ctx.props;
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      beforeUnmount(this);
      if (_React$Component.prototype.componentWillUnmount) _React$Component.prototype.componentWillUnmount.call(this);
    };

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          render = _this$props.render;
      var view = render || children;

      if (typeof view === 'function') {
        var _this$props2 = this.props,
            __$$regDumb = _this$props2.__$$regDumb,
            mapProps = _this$props2.mapProps;
        var ctx = this.ctx;

        if (__$$regDumb !== true && mapProps) {
          //直接使用<CcFragment />实例化
          return view(mapProps(ctx)) || nullSpan;
        } else {
          return view(ctx) || nullSpan;
        }
      } else {
        if (React.isValidElement(view)) {
          //直接传递dom，无论state怎么改变都不会再次触发渲染
          throw new Error("CcFragment's children can not b a react dom ");
        }

        return view;
      }
    };

    return CcFragment;
  }(React.Component);

  function _registerDumb(Dumb, isSingle, module, reducerModule, watchedKeys, storedKeys, persistStoredKeys, connect, state, setup, bindCtxToMethod, ccClassKey, tag, mapProps, props, compareProps) {
    //对state做克隆,防止用同一个connectDumb结果包不同的fn组件,共享了同一份state
    //const c = registerDumb({state:{info:{a:1}}});
    // const UI1_ = c(UI1); const UI2_ = c(UI2);
    // 让UI1_和UI2_各自拥有自己的localState
    var stateType = typeof state;
    var clonedState = null;
    if (stateType === 'function') clonedState = state();else if (stateType !== 'object') {
      throw new Error('state must be a plain json object');
    } else {
      clonedState = clone(state);
    }

    var render = function render(ctx) {
      if (mapProps) {
        var generatedProps = mapProps(ctx); // if (generatedProps.ctx === undefined) generatedProps.ctx = ctx;

        return React.createElement(Dumb, generatedProps);
      } else {
        return React.createElement(Dumb, ctx);
      }
    }; //优先读取实例化的时候传入的，再读connectDumb配置的


    var ccTag = props.ccTag || tag;
    var ccOption = {
      persistStoredKeys: persistStoredKeys
    }; //ccKey由实例化的Dumb组件props上透传下来

    return React.createElement(CcFragment, {
      isSingle: isSingle,
      ccClassKey: ccClassKey,
      __$$regDumb: true,
      tag: ccTag,
      ccKey: props.ccKey,
      props: props,
      module: module,
      reducerModule: reducerModule,
      watchedKeys: watchedKeys,
      storedKeys: storedKeys,
      ccOption: ccOption,
      connect: connect,
      state: clonedState,
      setup: setup,
      bindCtxToMethod: bindCtxToMethod,
      render: render,
      compareProps: compareProps
    });
  }

  function registerDumb (registerOption, ccClassKey) {
    var _registerOption = typeof registerOption === 'string' ? {
      module: registerOption
    } : registerOption;

    if (!_registerOption) _registerOption = {
      module: MODULE_DEFAULT
    };
    var _registerOption2 = _registerOption,
        isSingle = _registerOption2.isSingle,
        tag = _registerOption2.tag,
        mapProps = _registerOption2.mapProps,
        _registerOption2$modu = _registerOption2.module,
        module = _registerOption2$modu === void 0 ? MODULE_DEFAULT : _registerOption2$modu,
        reducerModule = _registerOption2.reducerModule,
        _registerOption2$watc = _registerOption2.watchedKeys,
        watchedKeys = _registerOption2$watc === void 0 ? '*' : _registerOption2$watc,
        storedKeys = _registerOption2.storedKeys,
        persistStoredKeys = _registerOption2.persistStoredKeys,
        _registerOption2$conn = _registerOption2.connect,
        connect = _registerOption2$conn === void 0 ? {} : _registerOption2$conn,
        _registerOption2$stat = _registerOption2.state,
        state = _registerOption2$stat === void 0 ? {} : _registerOption2$stat,
        setup = _registerOption2.setup,
        bindCtxToMethod = _registerOption2.bindCtxToMethod,
        compareProps = _registerOption2.compareProps;

    var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    return function (Dumb) {
      //避免react dev tool显示的dom为Unknown
      var ConnectedFragment = function ConnectedFragment(props) {
        return _registerDumb(Dumb, isSingle, _module, _reducerModule, _watchedKeys, storedKeys, persistStoredKeys, _connect, state, setup, bindCtxToMethod, _ccClassKey, tag, mapProps, props, compareProps);
      };

      return ConnectedFragment;
    };
  }

  function _connectDumb (connectSpec, ccClassKey) {
    return registerDumb({
      connect: connectSpec
    }, ccClassKey);
  }

  var vbi$6 = util.verboseInfo;
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
        ccUkey_ref_ = ccContext.ccUkey_ref_;
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
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$6("ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccKey) {
      var ccUniKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      ref = ccUkey_ref_[ccUniKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccUkey_ref_[ccKeys[0]]; // pick first one
    }

    if (!ref) {
      var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$6("ccClassKey:" + ccClassKey + " ccKey:" + ccKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$6("method:" + method)); // only error


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

  function setGlobalState (state, cb, delay, idt, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.ctx.setGlobalState(state, cb, delay, idt);
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

    setState$1(module, state, delayMs, identity, skipMiddleware, throwError);
  }

  function _set (moduledKeyPath, val, delay, idt) {
    var dispatcher = pickOneRef();
    dispatcher.ctx.set(moduledKeyPath, val, delay, idt);
  }

  var getState$8 = (function (module) {
    return ccContext.store.getState(module);
  });

  function _setValue (moduledKeyPath, val) {
    if (!moduledKeyPath.includes('/')) {
      throw new Error("keyPath must start with module");
    }

    var _moduledKeyPath$split = moduledKeyPath.split('/'),
        targetModule = _moduledKeyPath$split[0];

    var fullState = getState$8(targetModule);

    var _extractStateByCcsync = extractStateByCcsync(moduledKeyPath, val, false, fullState, false),
        state = _extractStateByCcsync.state;

    return state;
  }

  var getGlobalState = ccContext.store.getGlobalState;

  var _computedValue$4 = ccContext.computed._computedValue;
  var _getComputed = (function (module) {
    return _computedValue$4[module];
  });

  function _emit (event) {
    if (event === undefined) {
      throw new Error("api doc: cc.emit(event:string|{name:string, identity?:string, ctx?:boolean}, ...args)");
    }

    try {
      var _ref$ctx;

      var ref = pickOneRef();

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_ref$ctx = ref.ctx).emit.apply(_ref$ctx, [event].concat(args));
    } catch (err) {
      util.justWarning(err.message);
    }
  }

  function _off (event, option) {
    try {
      var ref = pickOneRef();
      ref.ctx.off(event, option);
    } catch (err) {
      if (option.throwError) throw err;else util.justWarning(err.message);
    }
  }

  var ccUkey_ref_$4 = ccContext.ccUkey_ref_,
      ccClassKey_ccClassContext_$6 = ccContext.ccClassKey_ccClassContext_;
  function getRefsByClassKey (ccClassKey) {
    var refs = [];
    var ccClassContext = ccClassKey_ccClassContext_$6[ccClassKey];

    if (!ccClassContext) {
      return refs;
    }

    var ccKeys = ccClassContext.ccKeys;
    ccKeys.forEach(function (k) {
      var ref = ccUkey_ref_$4[k];
      if (ref) refs.push(ref);
    });
    return refs;
  }

  var _execute = (function (ccClassKey) {
    var refs = getRefsByClassKey(ccClassKey);
    refs.forEach(function (ref) {
      if (ref.ctx.execute) ref.ctx.execute();
    });
  });

  function getRefs () {
    var refs = [];
    var ccUkey_ref_ = ccContext.ccUkey_ref_;
    var ccKeys = okeys(ccUkey_ref_);
    ccKeys.forEach(function (k) {
      var ref = ccUkey_ref_[k];
      if (ref) refs.push(ref);
    });
    return refs;
  }

  var _executeAll = (function () {
    var refs = getRefs();
    refs.forEach(function (ref) {
      if (ref.ctx.execute) ref.ctx.execute();
    });
  });

  var ccClassKey_ccClassContext_$7 = ccContext.ccClassKey_ccClassContext_;
  var _getConnectedState = (function (ccClassKey) {
    var ctx = ccClassKey_ccClassContext_$7[ccClassKey];
    return ctx.connectedState || {};
  });

  var appendState = ccContext.store.appendState;

  var _reducerCaller = ccContext.reducer._reducerCaller;

  var _lazyReducerCaller = ccContext.reducer._lazyReducerCaller;

  var ccUkey_ref_$5 = ccContext.ccUkey_ref_,
      moduleName_stateKeys_$7 = ccContext.moduleName_stateKeys_;
  var refCursor = 1;
  var cursor_refKey_ = {};

  function getUsableCursor() {
    return refCursor;
  }

  function incCursor() {
    refCursor = refCursor + 1;
  }

  var makeSetState = function makeSetState(ccHookState, hookSetState) {
    return function (partialState) {
      ccHookState.state = Object.assign({}, ccHookState.state, partialState);
      var newHookState = Object.assign({}, ccHookState);
      hookSetState(newHookState);
    };
  };

  var makeForceUpdate = function makeForceUpdate(ccHookState, hookSetState) {
    return function () {
      var newHookState = Object.assign({}, ccHookState);
      hookSetState(newHookState);
    };
  };

  function CcHook(ccHookState, hookSetState, props) {
    this.setState = makeSetState(ccHookState, hookSetState);
    this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
    this.__$$isUnmounted = false;
    this.state = ccHookState.state;
    this.isFirstRendered = true;
    this.props = props;
  }

  var useConcent = (function (registerOption) {
    var _registerOption = registerOption;

    if (typeof registerOption === 'string') {
      _registerOption = {
        module: registerOption
      };
    }

    var _registerOption2 = _registerOption,
        _registerOption2$stat = _registerOption2.state,
        state = _registerOption2$stat === void 0 ? {} : _registerOption2$stat,
        _registerOption2$prop = _registerOption2.props,
        props = _registerOption2$prop === void 0 ? {} : _registerOption2$prop,
        mapProps = _registerOption2.mapProps;
    var reactUseState = React.useState;

    if (!reactUseState) {
      throw new Error('make sure your react version is larger than or equal 16.8');
    }

    var cursor = getUsableCursor();

    var _reactUseState = reactUseState({
      cursor: cursor,
      state: state
    }),
        ccHookState = _reactUseState[0],
        hookSetState = _reactUseState[1];

    var nowCursor = ccHookState.cursor;
    var isFirstRendered = nowCursor === cursor;
    var hookRef;

    if (isFirstRendered) {
      var _registerOption3 = _registerOption,
          ccClassKey = _registerOption3.ccClassKey,
          module = _registerOption3.module,
          reducerModule = _registerOption3.reducerModule,
          _registerOption3$watc = _registerOption3.watchedKeys,
          watchedKeys = _registerOption3$watc === void 0 ? '*' : _registerOption3$watc,
          _registerOption3$stor = _registerOption3.storedKeys,
          storedKeys = _registerOption3$stor === void 0 ? [] : _registerOption3$stor,
          persistStoredKeys = _registerOption3.persistStoredKeys,
          _registerOption3$conn = _registerOption3.connect,
          connect = _registerOption3$conn === void 0 ? {} : _registerOption3$conn,
          setup = _registerOption3.setup,
          bindCtxToMethod = _registerOption3.bindCtxToMethod;
      incCursor();

      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
          _module = _mapRegistrationInfo._module,
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      hookRef = new CcHook(ccHookState, hookSetState, props);
      var ccOption = props.ccOption || {
        persistStoredKeys: persistStoredKeys
      };

      var _storedKeys = getStoredKeys(state, moduleName_stateKeys_$7[_module], ccOption.storedKeys, storedKeys);

      var params = Object.assign({}, _registerOption, {
        module: _module,
        reducerModule: _reducerModule,
        watchedKeys: _watchedKeys,
        type: CC_HOOK_PREFIX,
        ccClassKey: _ccClassKey,
        connect: _connect,
        ccOption: ccOption,
        storedKeys: _storedKeys
      });
      buildRefCtx(hookRef, params);
      beforeMount(hookRef, setup, bindCtxToMethod);
      cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
    } else {
      var refKey = cursor_refKey_[nowCursor];
      hookRef = ccUkey_ref_$5[refKey];
      var _refCtx = hookRef.ctx; //existing period, replace reactSetState and reactForceUpdate

      _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
      _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
      _refCtx.props = props;
    } //for every render


    React.useEffect(function () {
      if (!hookRef.isFirstRendered) {
        // mock componentDidUpdate
        triggerSetupEffect(hookRef, false);
        hookRef.ctx.prevState = Object.assign({}, hookRef.state); //方便下一轮渲染比较用
      }
    }); //for first render

    React.useEffect(function () {
      // mock componentDidMount
      hookRef.isFirstRendered = false;
      triggerSetupEffect(hookRef, true);
      return function () {
        beforeUnmount(hookRef);
      };
    }, []);
    var refCtx = hookRef.ctx; // before every render

    if (mapProps) refCtx.mapped = mapProps(refCtx);
    return refCtx;
  });

  var startup$1 = startup;
  var cloneModule = _cloneModule;
  var run = _run;
  var connect = _connect;
  var connectDumb = _connectDumb;
  var register$2 = register$1;
  var registerDumb$1 = registerDumb;
  var configure$1 = configure;
  var call = _call;
  var setGlobalState$1 = setGlobalState;
  var setState$2 = _setState;
  var set = _set;
  var setValue$1 = _setValue;
  var getState$9 = getState$8;
  var getGlobalState$1 = getGlobalState;
  var getConnectedState = _getConnectedState;
  var getComputed = _getComputed;
  var emit = _emit;
  var off = _off;
  var dispatch$3 = dispatch$2;
  var lazyDispatch$1 = lazyDispatch;
  var ccContext$1 = ccContext;
  var createDispatcher$1 = createDispatcher;
  var execute = _execute;
  var executeAll = _executeAll;
  var getRefs$1 = getRefs;
  var reducer = _reducerCaller;
  var lazyReducer = _lazyReducerCaller;
  var clearContextIfUnderHotReloadMode$1 = clearContextIfUnderHotReloadMode;
  var CcFragment$1 = CcFragment;
  var cst = _cst;
  var appendState$1 = appendState;
  var useConcent$1 = useConcent;
  var defaultExport = {
    cloneModule: cloneModule,
    emit: emit,
    off: off,
    connect: connect,
    connectDumb: connectDumb,
    register: register$2,
    registerDumb: registerDumb$1,
    configure: configure$1,
    dispatch: dispatch$3,
    lazyDispatch: lazyDispatch$1,
    startup: startup$1,
    run: run,
    call: call,
    setGlobalState: setGlobalState$1,
    setState: setState$2,
    set: set,
    setValue: setValue$1,
    getGlobalState: getGlobalState$1,
    getState: getState$9,
    getComputed: getComputed,
    getConnectedState: getConnectedState,
    ccContext: ccContext$1,
    createDispatcher: createDispatcher$1,
    execute: execute,
    executeAll: executeAll,
    getRefs: getRefs$1,
    reducer: reducer,
    lazyReducer: lazyReducer,
    clearContextIfUnderHotReloadMode: clearContextIfUnderHotReloadMode$1,
    CcFragment: CcFragment$1,
    cst: cst,
    appendState: appendState$1,
    useConcent: useConcent$1
  };
  var winCc = window.cc;

  if (winCc) {
    if (winCc.ccContext && winCc.ccContext.info) {
      var existedVersion = winCc.ccContext.info.version;
      var nowVersion = ccContext$1.info.version; //webpack-dev-server模式下，有些引用了concent的插件或者中间件模块，如果和当前concent版本不一致的话，会保留另外一个concent在其包下
      //路径如 node_modules/concent-middleware-web-devtool/node_modules/concent（注，在版本一致时，不会出现此问题）
      //这样的就相当于隐形的实例化两个concent 上下文，这是不允许的

      if (existedVersion !== nowVersion) {
        throw new Error("a existed version concent " + existedVersion + " is different with current about to import concent " + nowVersion + ", \n      it may caused by some of your concent-eco-module with older version concent, please reinstall them (concent-*** module)");
      }
    }
  }

  bindToWindow('cc', defaultExport);

  exports.startup = startup$1;
  exports.cloneModule = cloneModule;
  exports.run = run;
  exports.connect = connect;
  exports.connectDumb = connectDumb;
  exports.register = register$2;
  exports.registerDumb = registerDumb$1;
  exports.configure = configure$1;
  exports.call = call;
  exports.setGlobalState = setGlobalState$1;
  exports.setState = setState$2;
  exports.set = set;
  exports.setValue = setValue$1;
  exports.getState = getState$9;
  exports.getGlobalState = getGlobalState$1;
  exports.getConnectedState = getConnectedState;
  exports.getComputed = getComputed;
  exports.emit = emit;
  exports.off = off;
  exports.dispatch = dispatch$3;
  exports.lazyDispatch = lazyDispatch$1;
  exports.ccContext = ccContext$1;
  exports.createDispatcher = createDispatcher$1;
  exports.execute = execute;
  exports.executeAll = executeAll;
  exports.getRefs = getRefs$1;
  exports.reducer = reducer;
  exports.lazyReducer = lazyReducer;
  exports.clearContextIfUnderHotReloadMode = clearContextIfUnderHotReloadMode$1;
  exports.CcFragment = CcFragment$1;
  exports.cst = cst;
  exports.appendState = appendState$1;
  exports.useConcent = useConcent$1;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
