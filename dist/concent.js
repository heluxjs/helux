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
  var CC_FRAGMENT_PREFIX = '$$Fragment';
  var CC_DISPATCHER = '$$Dispatcher';
  var CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';
  var CHANGE_BY_SELF = 100;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE = 101;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE = 102;
  var CHANGE_BY_BROADCASTED_SHARED_STATE = 103;
  var CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE = 104;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 300;
  var BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = 301;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = 302;
  var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 303;
  var CURSOR_KEY = Symbol('__for_sync_param_cursor__');
  var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__'); //  two kind of state extraction
  //    cc will use ccInstance's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1; //    cc will use one module's sharedStateKeys and globalStateKeys to extract committed state  

  var STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;
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
    CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1103,
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
    CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS: 1400,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY: 1402,
    CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT: 1403,
    CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY: 1404,
    CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE: 1405,
    CC_REDUCER_ACTION_TYPE_NAMING_INVALID: 1500,
    CC_REDUCER_ACTION_TYPE_DUPLICATE: 1501,
    CC_REDUCER_ACTION_TYPE_NO_MODULE: 1502,
    CC_REDUCER_NOT_A_FUNCTION: 1503,
    CC_REDUCER_MODULE_NAME_DUPLICATE: 1511 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'concent startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for concent,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'concent';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_MODULE_NAME_HAS_NO_STATE] = "there is no module state in the store for your input module name", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure the supplied ccClassKey been registered to concent!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

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
      if (_fn) _fn(value, oldValue); //fn(newValue, oldValue)
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
      _state: {},
      getState: function getState(module) {
        if (module) return _getState(module);else return ccContext.store._state;
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
      version: '1.2.14',
      author: 'fantasticsoul',
      emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
      tag: 'xenogear'
    },
    // fragment association
    fragmentNameCount: 0,
    fragmentFeature_classKey_: {},
    fragmentCcKeys: [],
    errorHandler: null,
    middlewares: []
  };

  if (window && !window.sss) {
    window.sss = ccContext.store._state;
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
    } else if (Object.keys(object).length > 0) {
      return true;
    } else {
      return false;
    }
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

  function makeCcClassContext(module, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys) {
    return {
      module: module,
      ccClassKey: ccClassKey,
      originalSharedStateKeys: originalSharedStateKeys,
      originalGlobalStateKeys: originalGlobalStateKeys,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
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

  function setConnectedState (connectedState, module, key, value) {
    var moduleConnState = util.safeGetObjectFromObject(connectedState, module);
    moduleConnState[key] = value;
  }

  var me = util.makeError,
      throwCcHmrError$1 = util.throwCcHmrError;
  function buildCcClassContext (ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, forCcFragment) {
    if (forCcFragment === void 0) {
      forCcFragment = false;
    }

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var _computedValue = ccContext.computed._computedValue;
    var ccClassContext = contextMap[ccClassKey];

    if (forCcFragment === true) {
      //对于CcFragment的调用，ccClassContext可能是已存在的，因为cc根据CcFragment的connect参数为当前CcFragment分配一个ccClassKey，
      //多个CcFragment实例的connect一样的话，会被分配给同一个ccClassKey
      if (ccClassContext === undefined) {
        ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
      }
    } else {
      //对于register调用，ccClassContext一定是不存在的, 如果存在就报错
      if (ccClassContext !== undefined) {
        throwCcHmrError$1(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
      }

      ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }

    var connectedModule = {};
    var connectedComputed = {};

    if (stateToPropMapping) {
      var _state = ccContext.store._state;
      var connectedState = ccClassContext.connectedState;
      var prefixedKeys = Object.keys(stateToPropMapping);
      var len = prefixedKeys.length;

      for (var i = 0; i < len; i++) {
        var prefixedKey = prefixedKeys[i];

        var _prefixedKey$split = prefixedKey.split('/'),
            targetModule = _prefixedKey$split[0],
            targetStateKey = _prefixedKey$split[1]; // prefixedKey : 'foo/f1'


        connectedModule[targetModule] = 1;
        var moduleState = _state[targetModule];
        setConnectedState(connectedState, targetModule, targetStateKey, moduleState[targetStateKey]);

        if (!connectedComputed[targetModule]) {
          //绑定_computedValue的引用到connectedComputed上
          connectedComputed[targetModule] = _computedValue[targetModule];
        }
      }

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
      throw me$2(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$1("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
    }

    var isHot = util.isHotReloadMode();

    if (forCcFragment === true) {
      var fragmentCcKeys = ccContext.fragmentCcKeys;

      if (fragmentCcKeys.includes(ccKey)) {
        throw me$2(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("<CcFragment ccKey=\"" + ccKey + "\" />")); // if(isHot){
        //   util.justWarning(`cc found you supply a duplicate ccKey:${ccKey} to CcFragment, but now cc is running in hot reload mode, so if this message is wrong, you can ignore it.`);
        // }else{
        //   throw me(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi(`<CcFragment ccKey="${ccKey}" />`));
        // }
      } else {
        fragmentCcKeys.push(ccKey);
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
      handlerKey_handler_ = ccContext.handlerKey_handler_;
  function unsetRef (ccClassKey, ccUniqueKey) {
    if (ccContext.isDebug) {
      console.log(styleStr(ccUniqueKey + " unset ref"), color('purple'));
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

  var _state = ccContext.store._state;
  /**
   * 根据connect参数算出ccClassKey值和stateToPropMapping值
   */

  function getFeatureStrAndStpMapping(connectSpec) {
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
          Object.keys(moduleState).forEach(function (sKey) {
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
      featureStr: featureStrs.join('|'),
      stateToPropMapping: stateToPropMapping
    };
  }

  function setValue(obj, keys, lastKeyIndex, keyIndex, value) {
    var key = keys[keyIndex];

    if (lastKeyIndex === keyIndex) {
      obj[key] = value;
    } else {
      setValue(obj[key], keys, lastKeyIndex, ++keyIndex, value);
    }
  }

  var extractStateByCcsync = (function (ccsync, value, ccint, defaultState) {
    var _value = value;

    if (ccint === true) {
      try {
        _value = parseInt(value);
      } catch (err) {}
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
      var _state;

      return {
        module: module,
        state: (_state = {}, _state[keys[0]] = _value, _state)
      };
    } else {
      var _state2;

      var _keys = keys,
          key = _keys[0],
          restKeys = _keys.slice(1);

      var targetState;
      if (module) targetState = ccContext.store.getState(module);else targetState = defaultState;
      var subState = targetState[key];
      setValue(subState, restKeys, restKeys.length - 1, 0, _value);
      return {
        module: module,
        state: (_state2 = {}, _state2[key] = subState, _state2)
      };
    }
  });

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

  var verifyKeys$1 = util.verifyKeys,
      ccClassDisplayName$1 = util.ccClassDisplayName,
      styleStr$1 = util.styleStr,
      color$1 = util.color,
      verboseInfo$1 = util.verboseInfo,
      makeError$2 = util.makeError,
      justWarning$1 = util.justWarning,
      throwCcHmrError$2 = util.throwCcHmrError;
  var _ccContext$store = ccContext.store,
      _state$1 = _ccContext$store._state,
      getState = _ccContext$store.getState,
      ccStoreSetState$1 = _ccContext$store.setState,
      setStateByModuleAndKey$1 = _ccContext$store.setStateByModuleAndKey,
      _reducer$1 = ccContext.reducer._reducer,
      refStore = ccContext.refStore,
      globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_,
      _computedValue$1 = ccContext.computed._computedValue,
      moduleName_sharedStateKeys_ = ccContext.moduleName_sharedStateKeys_,
      moduleName_globalStateKeys_ = ccContext.moduleName_globalStateKeys_,
      moduleName_stateKeys_ = ccContext.moduleName_stateKeys_,
      ccKey_ref_$2 = ccContext.ccKey_ref_,
      ccKey_option_$1 = ccContext.ccKey_option_,
      globalCcClassKeys = ccContext.globalCcClassKeys,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_,
      globalMappingKey_toModules_ = ccContext.globalMappingKey_toModules_,
      globalMappingKey_fromModule_ = ccContext.globalMappingKey_fromModule_,
      globalKey_toModules_ = ccContext.globalKey_toModules_,
      sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_,
      middlewares = ccContext.middlewares;
  var cl$1 = color$1;
  var ss$1 = styleStr$1;
  var me$3 = makeError$2;
  var vbi$3 = verboseInfo$1;
  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_GLOBAL_STATE = 'setGlobalState';
  var FORCE_UPDATE = 'forceUpdate';

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

  function checkStoreModule(module, checkGlobalModule, throwError) {
    if (checkGlobalModule === void 0) {
      checkGlobalModule = true;
    }

    if (throwError === void 0) {
      throwError = true;
    }

    if (checkGlobalModule && module === MODULE_GLOBAL) {
      handleError(me$3(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
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

    if (checkStoreModule(inputModule, false, false)) {
      if (inputModule != currentModule) {
        if (reactCallback) {
          justWarning$1(me$3(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$3(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no change to be triggered
        }
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
    }
  }

  function getSharedKeysAndGlobalKeys(module, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
    var sharedStateKeys = inputSharedStateKeys,
        globalStateKeys = inputGlobalStateKeys;

    if (inputSharedStateKeys === '*') {
      sharedStateKeys = Object.keys(getState(module));
    }

    if (inputGlobalStateKeys === '*') {
      globalStateKeys = Object.keys(getState(MODULE_GLOBAL));
    }

    var _verifyKeys = verifyKeys$1(sharedStateKeys, globalStateKeys),
        duplicate = _verifyKeys.duplicate,
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi$3("ccClassKey:" + ccClassKey));
    }

    if (keyElementNotString) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi$3("ccClassKey:" + ccClassKey));
    }

    if (duplicate) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi$3("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
    }

    var globalState = getState(MODULE_GLOBAL);
    var hasGlobalMappingKeyInSharedStateKeys = false;
    var matchedGlobalKey, matchedSharedKey;
    var len = globalStateKeys.length;

    for (var i = 0; i < len; i++) {
      var gKey = globalStateKeys[i];

      if (globalState[gKey] === undefined) {
        throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi$3("ccClassKey:" + ccClassKey + ", invalid key in globalStateKeys is [" + gKey + "]"));
      }

      var sharedKey = globalMappingKey_sharedKey_[gKey];
      var fromModule = globalMappingKey_fromModule_[gKey]; //  if cc found one of the globalStateKeys of this module is just mapped from shared to global
      //  it is strictly prohibited here

      if (fromModule == module && sharedStateKeys.includes(sharedKey)) {
        hasGlobalMappingKeyInSharedStateKeys = true;
        matchedGlobalKey = gKey;
        matchedSharedKey = sharedKey;
        break;
      }
    } // maybe in the future, this is ok？ if user change sharedToGlobalMapping frequently, user don't have to change ccClass's globalStateKeys at the same time
    // but currently, this situation is strictly prohibited...... prevent from syncGlobalState and syncSharedState signal working badly


    if (hasGlobalMappingKeyInSharedStateKeys) {
      throw me$3(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi$3("ccClassKey [" + ccClassKey + "], invalid global key [" + matchedGlobalKey + "], matched state key [" + matchedSharedKey + "]"));
    }

    return {
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys
    };
  }

  function checkCcStartupOrNot() {
    if (!window.cc || ccContext.isCcAlreadyStartup !== true) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  }

  function extractStateToBeBroadcasted(refModule, sourceState, sharedStateKeys, globalStateKeys) {
    var _extractStateByKeys = extractStateByKeys(sourceState, sharedStateKeys),
        partialSharedState = _extractStateByKeys.partialState,
        isPartialSharedStateEmpty = _extractStateByKeys.isStateEmpty;

    var _extractStateByKeys2 = extractStateByKeys(sourceState, globalStateKeys),
        partialGlobalState = _extractStateByKeys2.partialState,
        isPartialGlobalStateEmpty = _extractStateByKeys2.isStateEmpty; //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
    //  the stateValue will been collected to module_globalState_, 
    //  any stateValue's key if it is a shared key that mapped to global key,
    //  the stateValue will been collected to module_globalState_ also,
    //  key means module name, value means the state to been broadcasted to the module


    var module_globalState_ = {}; //  see if sourceState includes globalMappingKeys, extract the target state that will been broadcasted to other module by globalMappingKey_sharedKey_

    globalStateKeys.forEach(function (gKey) {
      var stateValue = sourceState[gKey];

      if (stateValue !== undefined) {
        var sharedKey = globalMappingKey_sharedKey_[gKey];
        var toModules, stateKey;

        if (sharedKey) {
          //  this global key is created from some other module's sharedToGlobalMapping setting
          toModules = globalMappingKey_toModules_[gKey];
          stateKey = sharedKey;
        } else {
          //  this is normal global key
          toModules = globalKey_toModules_[gKey];
          stateKey = gKey;
        }

        if (toModules) {
          toModules.forEach(function (m) {
            if (m != refModule) {
              // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
              var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
              modulePartialGlobalState[stateKey] = stateValue;
            }
          });
        }
      }
    }); //  see if sourceState includes sharedStateKey which are mapped to globalStateKey

    sharedStateKeys.forEach(function (sKey) {
      var stateValue = sourceState[sKey];

      if (stateValue !== undefined) {
        var descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];

        if (descriptor) {
          var globalMappingKey = descriptor.globalMappingKey;
          var toModules = globalMappingKey_toModules_[globalMappingKey]; //  !!!set this state to globalState, let other module that watching this globalMappingKey
          //  can recover it correctly while they are mounted again!

          setStateByModuleAndKey$1(MODULE_GLOBAL, globalMappingKey, stateValue);

          if (toModules) {
            toModules.forEach(function (m) {
              if (m != refModule) {
                // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
                var modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
                modulePartialGlobalState[globalMappingKey] = stateValue;
              }
            });
          }
        }
      }
    }); // partialSharedState is prepared for input module 
    // partialGlobalState is prepared for input module 
    // module_globalState_ is prepared for other module 

    return {
      isPartialSharedStateEmpty: isPartialSharedStateEmpty,
      partialSharedState: partialSharedState,
      isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
      partialGlobalState: partialGlobalState,
      module_globalState_: module_globalState_
    };
  } //to let cc know a specified module are watching what sharedStateKeys


  function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
    var sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
    if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
    partialSharedStateKeys.forEach(function (sKey) {
      if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
    });
  }

  function mapGlobalKeyAndToModules(_curStateModule, globalStateKeys) {
    globalStateKeys.forEach(function (gKey) {
      var toModules = util.safeGetArrayFromObject(globalKey_toModules_, gKey); // because cc allow multi class register to a same module, so here judge if toModules includes module or not

      if (!toModules.includes(_curStateModule)) {
        toModules.push(_curStateModule);
      }
    });
  }

  function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
    globalStateKeys.forEach(function (gKey) {
      var toModules = util.safeGetArrayFromObject(globalMappingKey_toModules_, gKey);

      if (globalMappingKey_sharedKey_[gKey]) {
        //  if this gKey is globalMappingKey
        if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule);
      }
    });
  } //to let cc know a specified module are watching what globalStateKeys


  function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
    var globalStateKeysOfModule = util.safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);
    partialGlobalStateKeys.forEach(function (gKey) {
      if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
    });
  } //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, connectSpec) {
    var fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;

    if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
      throw me$3(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
    }

    var _getFeatureStrAndStpM = getFeatureStrAndStpMapping(connectSpec),
        stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping;

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var ctx = contextMap[ccClassKey];

    if (ctx !== undefined) {
      // analyze is ccClassKey really duplicated
      if (util.isHotReloadMode()) {
        var str1 = ctx.originalGlobalStateKeys.toString() + ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
        var str2 = originalGlobalStateKeys.toString() + originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);

        if (str1 !== str2) {
          throw me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
        } else {
          throwCcHmrError$2(me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
        }
      } else {
        throw me$3(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
      }
    }

    buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping);
  }
  /****
   * it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
   * 
   * if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
   * then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$invoke, $$dispatch method will trigger this extraction strategy
   * ------------------------------------------------------------------------------------------------------------------------
   * if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
   * then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
   * will trigger this extraction strategy
   */


  function getSuitableGlobalStateKeysAndSharedStateKeys(isDispatcher, stateFor, moduleName, ccClassGlobalStateKeys, ccClassSharedStateKeys) {
    if (isDispatcher) {
      //dispatcher实例调用的话，本身是不携带任何***StateKeys信息的
      return {
        sharedStateKeys: moduleName_stateKeys_[moduleName] || [],
        globalStateKeys: []
      };
    }

    var globalStateKeys, sharedStateKeys;

    if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
      globalStateKeys = ccClassGlobalStateKeys;
      sharedStateKeys = ccClassSharedStateKeys;
    } else if (stateFor === STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
      // user may declare module but no any class register to the module,
      // and a cc class define stateToPropMapping to watch this module's state change,
      // then moduleName_globalStateKeys_[moduleName] will be undefined
      globalStateKeys = moduleName_globalStateKeys_[moduleName] || [];
      sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
    } else {
      throw new Error("stateFor is not set correctly! "); // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
    }

    return {
      globalStateKeys: globalStateKeys,
      sharedStateKeys: sharedStateKeys
    };
  }

  function _throwForExtendInputClassAsFalseCheck(ccClassKey) {
    throw me$3("cc found that you set sharedStateKeys\u3001globalStateKeys or storedStateKeys, but you set extendInputClass as false at the same time\n    while you register a ccClass:" + ccClassKey + ", this is not allowed, extendInputClass=false means cc will give you\n    a props proxy component, in this situation, cc is unable to take over your component state, so set sharedStateKeys or globalStateKeys\n    is strictly prohibited, but you can still set stateToPropMapping to let cc control your component render timing!\n  ");
  }

  function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, connectSpec) {
    if (extendInputClass === false) {
      if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
        //??? maybe can use this.props.state?
        _throwForExtendInputClassAsFalseCheck(ccClassKey);
      }
    }

    var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys),
        targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
        targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, connectSpec);
    mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);
    mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
    mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
    mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
    mapModuleAndCcClassKeys(stateModule, ccClassKey); //tell cc this ccClass is watching some globalStateKeys of global module

    if (targetGlobalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);
    return {
      sharedStateKeys: targetSharedStateKeys,
      globalStateKeys: targetGlobalStateKeys
    };
  }

  function computeValueForRef(refComputedFn, refComputed, unchangedState, commitState) {
    if (refComputedFn) {
      var toBeComputed = refComputedFn();
      var toBeComputedKeys = Object.keys(toBeComputed);
      toBeComputedKeys.forEach(function (key) {
        var fn = toBeComputed[key];
        var newValue = commitState[key];

        if (newValue !== undefined) {
          var computedValue = fn(newValue, unchangedState[key], unchangedState);
          refComputed[key] = computedValue;
        }
      });
    }
  }

  function watchValueForRef(refWatchFn, refEntireState, userCommitState) {
    var shouldCurrentRefUpdate = true;

    if (refWatchFn) {
      var refWatch = refWatchFn();
      var watchStateKeys = Object.keys(refWatch);
      var len = watchStateKeys.length;
      var shouldNouUpdateLen = 0;
      watchStateKeys.forEach(function (key) {
        var commitValue = userCommitState[key];

        if (commitValue !== undefined) {
          var watchFn = refWatch[key];
          var ret = watchFn(commitValue, refEntireState[key]); // watchFn(newValue, oldValue);

          if (ret === false) shouldNouUpdateLen++;
        }
      }); //只有所有watch都返回false，才不触发当前实例更新

      if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
    }

    return shouldCurrentRefUpdate;
  }

  function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
    var stateToPropMapping = targetClassContext.stateToPropMapping,
        connectedModule = targetClassContext.connectedModule;

    if (connectedModule[commitModule] === 1) {
      var connectedState = targetClassContext.connectedState,
          ccKeys = targetClassContext.ccKeys;
      var isSetConnectedStateTriggered = false;
      commitStateKeys.forEach(function (sKey) {
        var moduledStateKey = commitModule + "/" + sKey;

        if (stateToPropMapping[moduledStateKey]) {
          setConnectedState(connectedState, commitModule, sKey, commitState[sKey]);
          isSetConnectedStateTriggered = true;
        }
      }); //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍

      if (isSetConnectedStateTriggered === true) {
        ccKeys.forEach(function (ccUniKey) {
          var ref = ccKey_ref_$2[ccUniKey];
          if (ref) ref.cc.reactForceUpdate();
        });
      }
    }
  }

  function broadcastConnectedState(commitModule, commitState) {
    // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
    var commitStateKeys = Object.keys(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

    Object.keys(moduleName_ccClassKeys_).forEach(function (moduleName) {
      var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
      ccClassKeys.forEach(function (ccClassKey) {
        var ccClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
        updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
      });
    });
  }

  function _promiseErrorHandler(resolve, reject) {
    return function (err) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return err ? reject(err) : resolve.apply(void 0, args);
    };
  }

  function _promisifyCcFn(ccFn, userLogicFn, executionContext) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    return new Promise(function (resolve, reject) {
      var _executionContext = Object.assign(executionContext, {
        __innerCb: _promiseErrorHandler(resolve, reject)
      });

      ccFn.apply(void 0, [userLogicFn, _executionContext].concat(args));
    })["catch"](catchCcError);
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$1(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
      }
    }
  }

  function getStateFor(inputModule, currentModule) {
    return inputModule === currentModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
  }

  function register(ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        _ref$sharedStateKeys = _ref.sharedStateKeys,
        inputSharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys,
        _ref$globalStateKeys = _ref.globalStateKeys,
        inputGlobalStateKeys = _ref$globalStateKeys === void 0 ? [] : _ref$globalStateKeys,
        _ref$storedStateKeys = _ref.storedStateKeys,
        inputStoredStateKeys = _ref$storedStateKeys === void 0 ? [] : _ref$storedStateKeys,
        _ref$connect = _ref.connect,
        connect = _ref$connect === void 0 ? {} : _ref$connect,
        reducerModule = _ref.reducerModule,
        _ref$extendInputClass = _ref.extendInputClass,
        extendInputClass = _ref$extendInputClass === void 0 ? true : _ref$extendInputClass,
        _ref$isSingle = _ref.isSingle,
        isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
        _ref$asyncLifecycleHo = _ref.asyncLifecycleHook,
        asyncLifecycleHook = _ref$asyncLifecycleHo === void 0 ? true : _ref$asyncLifecycleHo,
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
      var _asyncLifecycleHook = asyncLifecycleHook;

      var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


      checkStoreModule(_curStateModule);

      var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, connect),
          sKeys = _mapModuleAssociateDa.sharedStateKeys,
          gKeys = _mapModuleAssociateDa.globalStateKeys;

      var sharedStateKeys = sKeys,
          globalStateKeys = gKeys;
      var isIssArr = Array.isArray(inputStoredStateKeys);

      if (!isIssArr && inputStoredStateKeys !== '*') {
        throw new Error("register.option.storedStateKeys type err, it is must be an array or string *");
      }

      if (isIssArr) {
        var allKeys = sKeys.concat(gKeys);
        inputStoredStateKeys.forEach(function (v) {
          if (allKeys.includes(v)) {
            throw new Error("register.option.storedStateKeys key err, the key[" + v + "] is already been declared in sharedStateKeys or globalStateKeys ");
          }
        });
      }

      return function (ReactClass) {
        if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
          throw me$3(ERR.CC_REGISTER_A_CC_CLASS, vbi$3("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
        }

        var TargetClass = extendInputClass ? ReactClass : React__default.Component;

        var CcClass =
        /*#__PURE__*/
        function (_TargetClass) {
          _inheritsLoose(CcClass, _TargetClass);

          function CcClass(props, context) {
            var _this;

            try {
              _this = _TargetClass.call(this, props, context) || this;
              if (!_this.state) _this.state = {};
              var ccKey = props.ccKey,
                  _props$ccOption = props.ccOption,
                  ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
              var originalCcKey = ccKey;
              util.bindThis(_assertThisInitialized(_this), ['__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync', '__$$getEffectHandler', '__$$getXEffectHandler', '__$$makeEffectHandler', '__$$getInvokeHandler', '__$$getXInvokeHandler', '__$$makeInvokeHandler', '__$$getChangeStateHandler', '__$$getDispatchHandler', '__$$getSyncHandler']); // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

              if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

              if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
              if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
              var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook;

              var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
                  newCcKey = _computeCcUniqueKey.ccKey,
                  ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                  isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

              var ccClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
              setRef(_assertThisInitialized(_this), isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption); // bind connectedState to $$connectedState

              _this.$$connectedState = ccClassContext.connectedState || {}; // bind refComputed,computed result will been collected into refComputed by calling __$$recoverState later

              _this.$$refComputed = {};

              _this.__$$recoverState(_curStateModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey);

              if (!ccOption.storedStateKeys) {
                ccOption.storedStateKeys = inputStoredStateKeys;
              }

              if (ccOption.storedStateKeys === '*') {
                var toExcludeKeys = sharedStateKeys.concat(globalStateKeys);

                var _allKeys = Object.keys(_this.state);

                var storedStateKeys = _allKeys.filter(function (k) {
                  return !toExcludeKeys.includes(k);
                });

                ccOption.storedStateKeys = storedStateKeys;
              }

              _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys); // debugger;


              console.log(ccContext); //放在__$$mapCcToInstance，防止$$cache取this.connectedComputed报错undefined
              //$$cache要注意使用规范

              if (_this.$$computed) _this.$$computed = _this.$$computed.bind(_assertThisInitialized(_this), _assertThisInitialized(_this)); //把this直接当参数传入

              if (_this.$$watch) _this.$$watch = _this.$$watch.bind(_assertThisInitialized(_this), _assertThisInitialized(_this));
              if (_this.$$execute) _this.$$execute = _this.$$execute.bind(_assertThisInitialized(_this), _assertThisInitialized(_this));

              if (_this.$$cache) {
                _this.$$cache = _this.$$cache.bind(_assertThisInitialized(_this), _assertThisInitialized(_this));
                _this.$$refCache = _this.$$cache();
              } else {
                _this.$$refCache = {};
              }
            } catch (err) {
              catchCcError(err);
            }

            return _this;
          } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


          var _proto = CcClass.prototype;

          _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            return this.state !== nextState;
          };

          _proto.__$$recoverState = function __$$recoverState(currentModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey) {
            var refState = refStore._state[ccUniqueKey] || {};
            var sharedState = _state$1[currentModule];
            var globalState = _state$1[MODULE_GLOBAL];
            var syncSharedState = ccOption.syncSharedState,
                syncGlobalState = ccOption.syncGlobalState;
            var partialSharedState = {},
                partialGlobalState = {};

            if (syncSharedState) {
              var _extractStateByKeys3 = extractStateByKeys(sharedState, sharedStateKeys),
                  partialState = _extractStateByKeys3.partialState;

              partialSharedState = partialState;
            }

            if (syncGlobalState) {
              var _extractStateByKeys4 = extractStateByKeys(globalState, globalStateKeys),
                  _partialState2 = _extractStateByKeys4.partialState;

              partialGlobalState = _partialState2;
            }

            var selfState = this.state;
            var entireState = Object.assign({}, selfState, refState, partialSharedState, partialGlobalState);
            this.state = entireState;
            computeValueForRef(this.$$computed, this.$$refComputed, entireState, entireState);
          } //仅仅只是在存在多重装饰器时，如果不想在类里面通过this.props.***来调用cc注入的方法时，
          //可以在类的componentWillMount里调用 this.props.$$attach(this)
          ;

          _proto.$$attach = function $$attach(childRef) {
            var _this2 = this;

            var attachMethods = ['$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di', '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$sync', '$$invoke', '$$xinvoke', '$$effect', '$$xeffect', '$$moduleComputed', '$$globalComputed', '$$refComputed', '$$connectedComputed', '$$forceSyncState', 'setState', 'setGlobalState', 'forceUpdate'];
            attachMethods.forEach(function (m) {
              return childRef[m] = _this2[m];
            });

            if (childRef.$$cache) {
              childRef.$$cache = childRef.$$cache.bind(this, childRef);
              childRef.$$refCache = childRef.$$cache();
            } else {
              childRef.$$refCache = {};
            }
          };

          _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys) {
            var _this3 = this;

            var reactSetStateRef = this.setState.bind(this);
            var reactForceUpdateRef = this.forceUpdate.bind(this);
            var ccState = {
              renderCount: 1,
              isSingle: isSingle,
              asyncLifecycleHook: asyncLifecycleHook,
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
              globalStateKeys: globalStateKeys
            };

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

            this.cc = {
              ccState: ccState,
              ccClassKey: ccClassKey,
              originalCcKey: originalCcKey,
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              beforeSetState: this.$$beforeSetState,
              beforeBroadcastState: this.$$beforeBroadcastState,
              afterSetState: this.$$afterSetState,
              reactSetState: function reactSetState(state, cb) {
                ccState.renderCount += 1; //让dispatch里取的state最新的

                _this3.state = Object.assign(_this3.state, state);
                reactSetStateRef(state, cb);
              },
              reactForceUpdate: function reactForceUpdate(state, cb) {
                ccState.renderCount += 1;
                reactForceUpdateRef(state, cb);
              },
              setState: function setState(state, cb, delay) {
                if (delay === void 0) {
                  delay = -1;
                }

                _this3.$$changeState(state, {
                  ccKey: ccKey,
                  module: currentModule,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  cb: cb,
                  calledBy: SET_STATE,
                  delay: delay
                });
              },
              forceSyncState: function forceSyncState(state, cb, delay) {
                if (delay === void 0) {
                  delay = -1;
                }

                _this3.$$changeState(state, {
                  forceSync: true,
                  ccKey: ccKey,
                  module: currentModule,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  cb: cb,
                  calledBy: SET_STATE,
                  delay: delay
                });
              },
              setGlobalState: function setGlobalState(partialGlobalState, delay, broadcastTriggeredBy) {
                if (delay === void 0) {
                  delay = -1;
                }

                if (broadcastTriggeredBy === void 0) {
                  broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
                }

                _this3.$$changeState(partialGlobalState, {
                  ccKey: ccKey,
                  module: MODULE_GLOBAL,
                  broadcastTriggeredBy: broadcastTriggeredBy,
                  calledBy: SET_GLOBAL_STATE,
                  delay: delay
                });
              },
              forceUpdate: function forceUpdate(cb, delay) {
                _this3.$$changeState(_this3.state, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  cb: cb,
                  calledBy: FORCE_UPDATE,
                  delay: delay
                });
              },
              // change other module's state, the difference between effect and xeffect is:
              // xeffect will take your logicFn param list's first place to put ExecutionContext
              __effect: function __effect(targetModule, userLogicFn, option) {
                var _this3$cc;

                var ccKey = option.ccKey,
                    identity = option.identity,
                    _option$delay = option.delay,
                    delay = _option$delay === void 0 ? -1 : _option$delay,
                    context = option.context,
                    methodName = option.methodName;

                for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
                  args[_key3 - 3] = arguments[_key3];
                }

                return (_this3$cc = _this3.cc).__promisifiedInvokeWith.apply(_this3$cc, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: getStateFor(targetModule, currentModule),
                  context: context,
                  module: targetModule,
                  calledBy: methodName,
                  fnName: userLogicFn.name,
                  delay: delay,
                  identity: identity
                }].concat(args));
              },
              __invoke: function __invoke(userLogicFn, option) {
                var _this3$cc2;

                var _option$context = option.context,
                    context = _option$context === void 0 ? false : _option$context,
                    _option$forceSync = option.forceSync,
                    forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                    cb = option.cb,
                    delay = option.delay,
                    identity = option.identity,
                    methodName = option.methodName;

                for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                  args[_key4 - 2] = arguments[_key4];
                }

                return (_this3$cc2 = _this3.cc).__promisifiedInvokeWith.apply(_this3$cc2, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  context: context,
                  module: currentModule,
                  calledBy: methodName,
                  fnName: userLogicFn.name,
                  delay: delay,
                  identity: identity,
                  forceSync: forceSync,
                  cb: cb
                }].concat(args));
              },
              __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext) {
                for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                  args[_key5 - 2] = arguments[_key5];
                }

                return _promisifyCcFn.apply(void 0, [_this3.cc.__invokeWith, userLogicFn, executionContext].concat(args));
              },
              __invokeWith: function __invokeWith(userLogicFn, executionContext) {
                for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                  args[_key6 - 2] = arguments[_key6];
                }

                var ccKey = executionContext.ccKey,
                    stateFor = executionContext.stateFor,
                    _executionContext$mod = executionContext.module,
                    targetModule = _executionContext$mod === void 0 ? currentModule : _executionContext$mod,
                    _executionContext$con = executionContext.context,
                    context = _executionContext$con === void 0 ? false : _executionContext$con,
                    _executionContext$for = executionContext.forceSync,
                    forceSync = _executionContext$for === void 0 ? false : _executionContext$for,
                    cb = executionContext.cb,
                    __innerCb = executionContext.__innerCb,
                    type = executionContext.type,
                    reducerModule = executionContext.reducerModule,
                    calledBy = executionContext.calledBy,
                    fnName = executionContext.fnName,
                    _executionContext$del = executionContext.delay,
                    delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
                    identity = executionContext.identity;
                isStateModuleValid(targetModule, currentModule, cb, function (err, newCb) {
                  if (err) return handleCcFnError(err, __innerCb);

                  if (context) {
                    var dispatch = _this3.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, ccKey);

                    var dispatchIdentity = _this3.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, ccKey, identity); //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                    //目前先保留state


                    var executionContextForUser = Object.assign(executionContext, {
                      effect: _this3.__$$getEffectHandler(ccKey),
                      xeffect: _this3.__$$getXEffectHandler(ccKey),
                      invoke: _this3.__$$getInvokeHandler(),
                      xinvoke: _this3.__$$getXInvokeHandler(),
                      moduleState: getState(targetModule),
                      connectedState: ccClassContext[currentModule],
                      moduleComputed: _computedValue$1[currentModule],
                      state: _this3.state,
                      getState: function getState() {
                        return _this3.state;
                      },
                      getModuleState: function getModuleState() {
                        return getState(MODULE_GLOBAL);
                      },
                      store: getState(),
                      globalState: getState(MODULE_GLOBAL),
                      dispatch: dispatch,
                      dispatchIdentity: dispatchIdentity,
                      d: dispatch,
                      di: dispatchIdentity
                    });
                    args.unshift(executionContextForUser);
                  }

                  var _partialState = null;
                  co_1.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                    _partialState = partialState;

                    _this3.$$changeState(partialState, {
                      identity: identity,
                      ccKey: ccKey,
                      stateFor: stateFor,
                      module: targetModule,
                      forceSync: forceSync,
                      cb: newCb,
                      type: type,
                      reducerModule: reducerModule,
                      changedBy: CHANGE_BY_SELF,
                      calledBy: calledBy,
                      fnName: fnName,
                      delay: delay
                    });
                  }).then(function () {
                    if (__innerCb) __innerCb(null, _partialState);
                  })["catch"](function (err) {
                    handleCcFnError(err, __innerCb);
                  });
                });
              },
              dispatch: function dispatch(_temp2) {
                var _ref2 = _temp2 === void 0 ? {} : _temp2,
                    ccKey = _ref2.ccKey,
                    stateFor = _ref2.stateFor,
                    inputModule = _ref2.module,
                    inputReducerModule = _ref2.reducerModule,
                    identity = _ref2.identity,
                    _ref2$forceSync = _ref2.forceSync,
                    forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                    type = _ref2.type,
                    payload = _ref2.payload,
                    reactCallback = _ref2.cb,
                    __innerCb = _ref2.__innerCb,
                    _ref2$delay = _ref2.delay,
                    delay = _ref2$delay === void 0 ? -1 : _ref2$delay;

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
                    ccKey: ccKey,
                    stateFor: stateFor,
                    ccUniqueKey: ccUniqueKey,
                    ccOption: ccOption,
                    module: targetStateModule,
                    reducerModule: targetReducerModule,
                    type: type,
                    payload: payload,
                    forceSync: forceSync,
                    cb: newCb,
                    context: true,
                    __innerCb: __innerCb,
                    calledBy: DISPATCH,
                    delay: delay,
                    identity: identity
                  };

                  _this3.cc.__invokeWith(reducerFn, executionContext);
                });
              },
              prepareReactSetState: function prepareReactSetState(identity, changedBy, state, stateFor, next, reactCallback) {
                // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
                // 要不然$$cache就没意义了
                // if(this.$$cache){
                //   this.$$refCache = this.$$cache();
                // }
                if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                  if (next) next();
                  return;
                }

                if (identity) {
                  //if user specify identity
                  if (_this3.cc.ccKey !== identity) {
                    // current instance would have been rendered only if current instance's ccKey equal identity
                    if (next) next();
                    return;
                  }
                }

                if (storedStateKeys.length > 0) {
                  var _extractStateByKeys5 = extractStateByKeys(state, storedStateKeys),
                      partialState = _extractStateByKeys5.partialState,
                      isStateEmpty = _extractStateByKeys5.isStateEmpty;

                  if (!isStateEmpty) {
                    if (ccOption.storeInLocalStorage === true) {
                      var _extractStateByKeys6 = extractStateByKeys(_this3.state, storedStateKeys),
                          entireStoredState = _extractStateByKeys6.partialState;

                      var currentStoredState = Object.assign({}, entireStoredState, partialState);
                      localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                    }

                    refStore.setState(ccUniqueKey, partialState);
                  }
                }

                var shouldCurrentRefUpdate = true;

                if (!util.isObjectNotNull(state)) {
                  if (next) next();
                  return;
                } else {
                  var thisState = _this3.state;
                  computeValueForRef(_this3.$$computed, _this3.$$refComputed, thisState, state);
                  shouldCurrentRefUpdate = watchValueForRef(_this3.$$watch, thisState, state);
                }

                if (shouldCurrentRefUpdate === false) {
                  if (next) next();
                }

                if (_this3.$$beforeSetState) {
                  if (asyncLifecycleHook) {
                    _this3.$$beforeSetState({
                      changedBy: changedBy
                    });

                    _this3.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  } else {
                    // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                    // $$beforeSetState(context, next){}
                    _this3.$$beforeSetState({
                      changedBy: changedBy
                    }, function () {
                      _this3.cc.reactSetState(state, reactCallback);

                      if (next) next();
                    });
                  }
                } else {
                  _this3.cc.reactSetState(state, reactCallback);

                  if (next) next();
                }
              },
              prepareBroadcastGlobalState: function prepareBroadcastGlobalState(identity, broadcastTriggeredBy, globalState, delay) {
                //!!! save global state to store
                var _getAndStoreValidGlob = getAndStoreValidGlobalState(globalState, currentModule, ccClassKey),
                    validGlobalState = _getAndStoreValidGlob.partialState,
                    isStateEmpty = _getAndStoreValidGlob.isStateEmpty;

                var startBroadcastGlobalState = function startBroadcastGlobalState() {
                  if (!isStateEmpty) {
                    if (_this3.$$beforeBroadcastState) {
                      //check if user define a life cycle hook $$beforeBroadcastState
                      if (asyncLifecycleHook) {
                        _this3.$$beforeBroadcastState({
                          broadcastTriggeredBy: broadcastTriggeredBy
                        });

                        _this3.cc.broadcastGlobalState(identity, validGlobalState);
                      } else {
                        _this3.$$beforeBroadcastState({
                          broadcastTriggeredBy: broadcastTriggeredBy
                        }, function () {
                          _this3.cc.broadcastGlobalState(identity, validGlobalState);
                        });
                      }
                    } else {
                      _this3.cc.broadcastGlobalState(identity, validGlobalState);
                    }
                  }
                };

                if (delay > 0) {
                  var feature = util.computeFeature(ccUniqueKey, globalState);
                  runLater(startBroadcastGlobalState, feature, delay);
                } else {
                  startBroadcastGlobalState();
                }
              },
              prepareBroadcastState: function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, delay, identity) {
                var targetSharedStateKeys, targetGlobalStateKeys;

                try {
                  var isDispatcher = _this3.cc.ccClassKey === CC_DISPATCHER;
                  var result = getSuitableGlobalStateKeysAndSharedStateKeys(isDispatcher, stateFor, moduleName, globalStateKeys, sharedStateKeys);
                  targetSharedStateKeys = result.sharedStateKeys;
                  targetGlobalStateKeys = result.globalStateKeys;
                } catch (err) {
                  return justWarning$1(err.message + " prepareBroadcastState failed!");
                }

                var skipBroadcastRefState = false;

                if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                  if (targetSharedStateKeys.length === 0 && targetGlobalStateKeys.length === 0) {
                    skipBroadcastRefState = true;
                  }
                }

                var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, committedState, targetSharedStateKeys, targetGlobalStateKeys),
                    isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                    isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                    partialSharedState = _extractStateToBeBroa.partialSharedState,
                    partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                    module_globalState_ = _extractStateToBeBroa.module_globalState_; //!!! save state to store


                if (!isPartialSharedStateEmpty) ccStoreSetState$1(moduleName, partialSharedState);
                if (!isPartialGlobalStateEmpty) ccStoreSetState$1(MODULE_GLOBAL, partialGlobalState);

                var startBroadcastState = function startBroadcastState() {
                  if (_this3.$$beforeBroadcastState) {
                    //check if user define a life cycle hook $$beforeBroadcastState
                    if (asyncLifecycleHook) {
                      _this3.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      }, function () {
                        _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                      });
                    } else {
                      _this3.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      });

                      _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                    }
                  } else {
                    _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                  }
                };

                if (delay > 0) {
                  var feature = util.computeFeature(ccUniqueKey, committedState);
                  runLater(startBroadcastState, feature, delay);
                } else {
                  startBroadcastState();
                }
              },
              broadcastState: function broadcastState(skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity) {
                if (skipBroadcastRefState === false) {
                  var _partialSharedState = partialSharedState;
                  if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

                  var _this3$cc$ccState = _this3.cc.ccState,
                      currentCcKey = _this3$cc$ccState.ccUniqueKey,
                      _currentModule = _this3$cc$ccState.module;
                  // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
                  // so flag ignoreCurrentCcKey as true;

                  var ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
                  var ccClassKeys = moduleName_ccClassKeys_[moduleName];

                  if (ccClassKeys) {
                    //  these ccClass are watching the same module's state
                    ccClassKeys.forEach(function (ccClassKey) {
                      var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
                      var ccKeys = classContext.ccKeys,
                          sharedStateKeys = classContext.sharedStateKeys,
                          globalStateKeys = classContext.globalStateKeys;
                      if (ccKeys.length === 0) return;
                      if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return; //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!

                      var _extractStateByKeys7 = extractStateByKeys(_partialSharedState, sharedStateKeys, true),
                          sharedStateForCurrentCcClass = _extractStateByKeys7.partialState,
                          isSharedStateEmpty = _extractStateByKeys7.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                      //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                      //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                      //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                      var _extractStateByKeys8 = extractStateByKeys(partialGlobalState, globalStateKeys, true),
                          globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                          isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

                      if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;
                      var mergedStateForCurrentCcClass = Object.assign({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);
                      ccKeys.forEach(function (ccKey) {
                        if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
                        var ref = ccKey_ref_$2[ccKey];

                        if (ref) {
                          var option = ccKey_option_$1[ccKey];
                          var toSet = null,
                              changedBy = -1;

                          if (option.syncSharedState && option.syncGlobalState) {
                            changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
                            toSet = mergedStateForCurrentCcClass;
                          } else if (option.syncSharedState) {
                            changedBy = CHANGE_BY_BROADCASTED_SHARED_STATE;
                            toSet = sharedStateForCurrentCcClass;
                          } else if (option.syncGlobalState) {
                            changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE;
                            toSet = globalStateForCurrentCcClass;
                          }

                          if (toSet) {
                            if (ccContext.isDebug) {
                              console.log(ss$1("ref " + ccKey + " to be rendered state(changedBy " + changedBy + ") is broadcast from same module's other ref " + currentCcKey), cl$1());
                            }

                            ref.cc.prepareReactSetState(identity, changedBy, toSet, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                          }
                        }
                      });
                    });
                  }

                  if (util.isObjectNotNull(module_globalState_)) {
                    var moduleNames = Object.keys(module_globalState_);
                    moduleNames.forEach(function (mName) {
                      var partialGlobalState = module_globalState_[mName];
                      var ccClassKeys = moduleName_ccClassKeys_[mName];
                      ccClassKeys.forEach(function (ccClassKey) {
                        var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
                        var ccKeys = classContext.ccKeys,
                            globalStateKeys = classContext.globalStateKeys;
                        if (ccKeys.length === 0) return;
                        if (globalStateKeys.length === 0) return;

                        var _extractStateByKeys9 = extractStateByKeys(partialGlobalState, globalStateKeys),
                            globalStateForCurrentCcClass = _extractStateByKeys9.partialState,
                            isPartialGlobalStateEmpty = _extractStateByKeys9.isStateEmpty;

                        if (isPartialGlobalStateEmpty) return;
                        ccKeys.forEach(function (ccKey) {
                          var ref = ccKey_ref_$2[ccKey];

                          if (ref) {
                            var option = ccKey_option_$1[ccKey];

                            if (option.syncGlobalState) {
                              if (ccContext.isDebug) {
                                console.log(ss$1("ref " + ccKey + " to be rendered state(only global state) is broadcast from other module " + moduleName), cl$1());
                              }

                              ref.cc.prepareReactSetState(identity, CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, globalStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                            }
                          }
                        });
                      });
                    });
                  }
                } //!!! 注意，这里要把global提出来播，例如一个属于$$default模块的实例提交得有$$global模块的数据，是需要被播出去的


                var _extractStateByKeys10 = extractStateByKeys(originalState, ccContext.globalStateKeys),
                    toToBroadcastGlobalState = _extractStateByKeys10.partialState,
                    isEmptyG = _extractStateByKeys10.isStateEmpty;

                if (!isEmptyG) {
                  broadcastConnectedState(MODULE_GLOBAL, toToBroadcastGlobalState);
                }

                broadcastConnectedState(moduleName, originalState);
              },
              broadcastGlobalState: function broadcastGlobalState(identity, globalSate) {
                globalCcClassKeys.forEach(function (ccClassKey) {
                  var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
                  var globalStateKeys = classContext.globalStateKeys,
                      ccKeys = classContext.ccKeys;

                  var _extractStateByKeys11 = extractStateByKeys(globalSate, globalStateKeys),
                      partialState = _extractStateByKeys11.partialState,
                      isStateEmpty = _extractStateByKeys11.isStateEmpty;

                  if (!isStateEmpty) {
                    ccKeys.forEach(function (ccKey) {
                      var ref = ccKey_ref_$2[ccKey];

                      if (ref) {
                        var option = ccKey_option_$1[ccKey];

                        if (option.syncGlobalState === true) {
                          ref.cc.prepareReactSetState(identity, CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                        }
                      }
                    });
                  }
                });
                broadcastConnectedState(MODULE_GLOBAL, globalSate);
              },
              emit: function emit(event) {
                for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                  args[_key7 - 1] = arguments[_key7];
                }

                findEventHandlersToPerform.apply(ev, [event, {
                  identity: null
                }].concat(args));
              },
              emitIdentity: function emitIdentity(event, identity) {
                for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                  args[_key8 - 2] = arguments[_key8];
                }

                findEventHandlersToPerform.apply(ev, [event, {
                  identity: identity
                }].concat(args));
              },
              emitWith: function emitWith(event, option) {
                for (var _len9 = arguments.length, args = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
                  args[_key9 - 2] = arguments[_key9];
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
            var thisCC = this.cc; // when call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY

            var d = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey);

            var di = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey, ccKey); //ccKey is identity by default


            this.$$d = d;
            this.$$di = di;
            this.$$dispatch = d;
            this.$$dispatchIdentity = di;
            this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1, ccKey);
            this.$$invoke = this.__$$getInvokeHandler();
            this.$$xinvoke = this.__$$getXInvokeHandler();
            this.$$effect = this.__$$getEffectHandler(ccKey);
            this.$$xeffect = this.__$$getXEffectHandler(ccKey);
            this.$$emit = thisCC.emit;
            this.$$emitIdentity = thisCC.emitIdentity;
            this.$$emitWith = thisCC.emitWith;
            this.$$on = thisCC.on;
            this.$$onIdentity = thisCC.onIdentity;
            this.$$off = thisCC.off;
            this.$$moduleComputed = _computedValue$1[currentModule] || {};
            this.$$globalComputed = _computedValue$1[MODULE_GLOBAL] || {};
            this.$$connectedComputed = ccClassContext.connectedComputed;
            this.$$forceSyncState = thisCC.forceSyncState; // add$$ prefix, to let user it is cc api

            this.setState = thisCC.setState; //let setState call cc.setState

            this.setGlobalState = thisCC.setGlobalState; //let setState call cc.setState

            this.forceUpdate = thisCC.forceUpdate; //let forceUpdate call cc.forceUpdate
          } // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
          // so make sure you know what you want, and you don't need call this method most of the time,
          // -------------------------------------------------------------------------------------------------------------------------
          // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
          // when ccIns's module != target module,
          //        cc will only broadcast the state to target module, and be careful: it will overwrite the target module's state!!
          // when ccIns's module == target module,
          //        if ccIns option.syncSharedState is false, cc only change it's own state, no broadcast operation happen.
          //           but if you pass forceSync=true, cc will also broadcast the state to target module, 
          //           and be careful: cc will clone this piece of state before broadcasting, so it will overwrite the target module's state !!!
          //        if ccIns option.syncSharedState is true, change it's own state and broadcast the state to target module
          ;

          _proto.$$changeState = function $$changeState(state, _temp4) {
            var _this4 = this;

            var _ref4 = _temp4 === void 0 ? {} : _temp4,
                ccKey = _ref4.ccKey,
                _ref4$stateFor = _ref4.stateFor,
                stateFor = _ref4$stateFor === void 0 ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref4$stateFor,
                module = _ref4.module,
                broadcastTriggeredBy = _ref4.broadcastTriggeredBy,
                changedBy = _ref4.changedBy,
                forceSync = _ref4.forceSync,
                reactCallback = _ref4.cb,
                type = _ref4.type,
                reducerModule = _ref4.reducerModule,
                calledBy = _ref4.calledBy,
                fnName = _ref4.fnName,
                _ref4$delay = _ref4.delay,
                delay = _ref4$delay === void 0 ? -1 : _ref4$delay,
                identity = _ref4.identity;

            //executionContext
            if (state == undefined) return; //do nothing

            if (!isPlainJsonObject(state)) {
              justWarning$1("cc found your commit state is not a plain json object!");
            }

            var _doChangeState = function _doChangeState() {
              if (module == MODULE_GLOBAL) {
                _this4.cc.prepareBroadcastGlobalState(identity, broadcastTriggeredBy, state, delay);
              } else {
                var ccState = _this4.cc.ccState;
                var currentModule = ccState.module;
                var btb = broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;

                if (module === currentModule) {
                  // who trigger $$changeState, who will change the whole received state 
                  _this4.cc.prepareReactSetState(identity, changedBy || CHANGE_BY_SELF, state, stateFor, function () {
                    //if forceSync=true, cc clone the input state
                    if (forceSync === true) {
                      _this4.cc.prepareBroadcastState(stateFor, btb, module, state, true, delay, identity);
                    } else if (ccState.ccOption.syncSharedState) {
                      _this4.cc.prepareBroadcastState(stateFor, btb, module, state, false, delay, identity);
                    }
                  }, reactCallback);
                } else {
                  if (forceSync) justWarning$1("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi$3("module:" + module + " currentModule" + currentModule));
                  if (reactCallback) justWarning$1("callback for react.setState will be ignore"); //触发修改转态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是是OF_ONE_MODULE

                  _this4.cc.prepareBroadcastState(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, btb, module, state, true, delay, identity);
                }
              }
            };

            var middlewaresLen = middlewares.length;

            if (middlewaresLen > 0) {
              var passToMiddleware = {
                ccKey: ccKey,
                state: state,
                stateFor: stateFor,
                module: module,
                type: type,
                reducerModule: reducerModule,
                broadcastTriggeredBy: broadcastTriggeredBy,
                changedBy: changedBy,
                forceSync: forceSync,
                calledBy: calledBy,
                fnName: fnName
              };
              var index = 0;

              var next = function next() {
                if (index === middlewaresLen) {
                  // all middlewares been executed
                  _doChangeState();
                } else {
                  var middlewareFn = middlewares[index];
                  index++;
                  middlewareFn(passToMiddleware, next);
                }
              };

              next();
            } else {
              _doChangeState();
            }
          } //executionContext: { module:string, forceSync:boolean, cb }
          ;

          _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
            var _this5 = this;

            return function (state) {
              return _this5.$$changeState(state, executionContext);
            };
          };

          _proto.__$$getInvokeHandler = function __$$getInvokeHandler() {
            return this.__$$makeInvokeHandler(false, 'invoke');
          };

          _proto.__$$getXInvokeHandler = function __$$getXInvokeHandler() {
            return this.__$$makeInvokeHandler(true, 'xinvoke');
          };

          _proto.__$$makeInvokeHandler = function __$$makeInvokeHandler(giveContextToUserLoginFn, methodName) {
            var _this6 = this;

            if (giveContextToUserLoginFn === void 0) {
              giveContextToUserLoginFn = false;
            }

            return function (firstParam) {
              var firstParamType = typeof firstParam;
              var err = new Error("param type error, correct usage: " + methodName + "(userFn:function, ...args:any[]) or " + methodName + "(option:{fn:function, delay:number, identity:string}, ...args:any[])");

              for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
                args[_key10 - 1] = arguments[_key10];
              }

              if (firstParamType === 'function') {
                var _this6$cc;

                return (_this6$cc = _this6.cc).__invoke.apply(_this6$cc, [firstParam, {
                  context: giveContextToUserLoginFn,
                  methodName: methodName
                }].concat(args));
              } else if (firstParamType === 'object') {
                var _this6$cc2;

                // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
                var fn = firstParam.fn;
                delete firstParam.fn;
                var option = firstParam;

                if (typeof fn != 'function') {
                  throw err;
                }

                option.context = giveContextToUserLoginFn;
                option.methodName = methodName;
                return (_this6$cc2 = _this6.cc).__invoke.apply(_this6$cc2, [fn, option].concat(args));
              } else {
                throw err;
              } // return ()=>{}

            };
          };

          _proto.__$$getEffectHandler = function __$$getEffectHandler(ccKey) {
            return this.__$$makeEffectHandler(ccKey, false, 'effect');
          };

          _proto.__$$getXEffectHandler = function __$$getXEffectHandler(ccKey) {
            return this.__$$makeEffectHandler(ccKey, true, 'xeffect');
          };

          _proto.__$$makeEffectHandler = function __$$makeEffectHandler(ccKey, giveContextToUserLoginFn, methodName) {
            var _this7 = this;

            if (giveContextToUserLoginFn === void 0) {
              giveContextToUserLoginFn = false;
            }

            return function (firstParam, userLogicFn) {
              var firstParamType = typeof firstParam;

              for (var _len11 = arguments.length, args = new Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
                args[_key11 - 2] = arguments[_key11];
              }

              if (firstParamType === 'string') {
                var _this7$cc;

                return (_this7$cc = _this7.cc).__effect.apply(_this7$cc, [firstParam, userLogicFn, {
                  context: giveContextToUserLoginFn,
                  ccKey: ccKey,
                  methodName: methodName
                }].concat(args));
              } else if (firstParamType === 'object') {
                var _this7$cc2;

                var _module2 = firstParam.module,
                    _firstParam$delay = firstParam.delay,
                    delay = _firstParam$delay === void 0 ? -1 : _firstParam$delay,
                    identity = firstParam.identity;
                var option = {
                  module: _module2,
                  delay: delay,
                  identity: identity,
                  context: giveContextToUserLoginFn,
                  methodName: methodName
                };
                return (_this7$cc2 = _this7.cc).__effect.apply(_this7$cc2, [_module2, userLogicFn, option].concat(args));
              } else {
                throw new Error("param type error, correct usage: " + methodName + "(module:string, ...args:any[]) or " + methodName + "(option:{module:string, delay:number, identity:string}, ...args:any[])");
              }
            };
          };

          _proto.__$$getDispatchHandler = function __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload, delay, ccKey, defaultIdentity) {
            var _this8 = this;

            if (delay === void 0) {
              delay = -1;
            }

            if (defaultIdentity === void 0) {
              defaultIdentity = '';
            }

            return function (paramObj, payloadWhenFirstParamIsString, userInputIdentity) {
              if (paramObj === void 0) {
                paramObj = {};
              }

              var paramObjType = typeof paramObj;

              var _module = originalComputedStateModule,
                  _reducerModule,
                  _forceSync = false,
                  _type,
                  _payload = inputPayload,
                  _cb,
                  _delay = delay;

              var _identity = defaultIdentity;

              if (paramObjType === 'object') {
                var _paramObj = paramObj,
                    _paramObj$module = _paramObj.module,
                    _module3 = _paramObj$module === void 0 ? originalComputedStateModule : _paramObj$module,
                    _reducerModule2 = _paramObj.reducerModule,
                    _paramObj$forceSync = _paramObj.forceSync,
                    forceSync = _paramObj$forceSync === void 0 ? false : _paramObj$forceSync,
                    _paramObj$type = _paramObj.type,
                    type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                    _paramObj$payload = _paramObj.payload,
                    payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                    cb = _paramObj.cb,
                    _paramObj$delay = _paramObj.delay,
                    _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
                    identity = _paramObj.identity;

                _module = _module3;
                _reducerModule = _reducerModule2 || _module3;
                _forceSync = forceSync;
                _type = type;
                _payload = payload;
                _cb = cb;
                _delay = _delay2;
                if (identity) _identity = identity;
              } else if (paramObjType === 'string') {
                var slashCount = paramObj.split('').filter(function (v) {
                  return v === '/';
                }).length;
                _payload = payloadWhenFirstParamIsString;
                if (userInputIdentity) _identity = userInputIdentity;

                if (slashCount === 0) {
                  _type = paramObj;
                } else if (slashCount === 1) {
                  var _paramObj$split = paramObj.split('/'),
                      _module4 = _paramObj$split[0],
                      _type2 = _paramObj$split[1];

                  _module = _module4;
                  _reducerModule = _module;
                  _type = _type2;
                } else if (slashCount === 2) {
                  var _paramObj$split2 = paramObj.split('/'),
                      _module5 = _paramObj$split2[0],
                      _reducerModule3 = _paramObj$split2[1],
                      _type3 = _paramObj$split2[2];

                  if (_module5 === '' || _module5 === ' ') _module = originalComputedStateModule; //paramObj may like: /foo/changeName
                  else _module = _module5;
                  _module = _module5;
                  _reducerModule = _reducerModule3;
                  _type = _type3;
                } else {
                  return Promise.reject(me$3(ERR.CC_DISPATCH_STRING_INVALID, vbi$3(paramObj)));
                }
              } else {
                return Promise.reject(me$3(ERR.CC_DISPATCH_PARAM_INVALID));
              }

              if (_module === '*') {
                return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
              } // pick user input reducerModule firstly


              var targetReducerModule = _reducerModule || originalComputedReducerModule || module;
              return new Promise(function (resolve, reject) {
                _this8.cc.dispatch({
                  stateFor: stateFor,
                  module: _module,
                  reducerModule: targetReducerModule,
                  forceSync: _forceSync,
                  type: _type,
                  payload: _payload,
                  cb: _cb,
                  __innerCb: _promiseErrorHandler(resolve, reject),
                  delay: _delay,
                  ccKey: ccKey,
                  identity: _identity
                });
              })["catch"](catchCcError);
            };
          };

          _proto.__$$getSyncHandler = function __$$getSyncHandler(stateFor) {
            var _this9 = this;

            return function (e) {
              return _this9.$$sync(e, stateFor);
            };
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
            var ccKey = this.cc.ccKey;

            var handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccKey, ccidt);

            handler()["catch"](handleCcFnError);
          } // when CCSYNC_KEY:   stateFor=ccint, seat1=ccdelay, seat2=ccidt, seat3=stateFor
          ;

          _proto.$$sync = function $$sync(event, stateFor, seat1, seat2, seat3, seat4) {
            if (stateFor === void 0) {
              stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
            }

            if (typeof event === 'string') {
              var _this$$$sync$bind;

              var _ccint = stateFor === true || stateFor === 'true';

              var syncFn = this.$$sync.bind(this, (_this$$$sync$bind = {}, _this$$$sync$bind[CCSYNC_KEY] = event, _this$$$sync$bind), _ccint, seat1, seat2, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
              return syncFn;
            }

            var targetE = event,
                targetStateFor = stateFor;

            if (event[CCSYNC_KEY] != undefined) {
              var _ccsync = event[CCSYNC_KEY];
              var _ccint2 = stateFor;
              var _ccdelay = seat1;
              var _ccidt = seat2;
              targetStateFor = seat3;
              var _value = seat4; //此时的value就是event

              if (typeof _value === 'object' && _value.currentTarget !== undefined) {
                //a real event
                _value = _value.currentTarget.value;
              }

              targetE = {
                currentTarget: {
                  value: _value,
                  dataset: {
                    ccsync: _ccsync,
                    ccint: _ccint2,
                    ccdelay: _ccdelay,
                    ccidt: _ccidt
                  }
                }
              };
            }

            if (event.stopPropagation) event.stopPropagation();
            var currentModule = this.cc.ccState.module;

            var _module = currentModule,
                _delay = -1,
                _identity = '';

            var currentTarget = targetE.currentTarget;
            var value = currentTarget.value,
                dataset = currentTarget.dataset;
            var ccdelay = dataset.ccdelay,
                _dataset$ccidt2 = dataset.ccidt,
                ccidt = _dataset$ccidt2 === void 0 ? '' : _dataset$ccidt2,
                ccint = dataset.ccint,
                ccsync = dataset.ccsync;

            if (!ccsync) {
              return justWarning$1("data-ccsync attr no found, you must define it while using this.$$sync");
            }

            if (ccsync.includes('/')) {
              _module = ccsync.split('/')[0];
            }

            var fullState = _module !== currentModule ? getState(_module) : this.state;

            var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, fullState),
                state = _extractStateByCcsync.state;

            if (ccdelay) {
              try {
                _delay = parseInt(ccdelay);
              } catch (err) {}
            }

            if (ccidt) _identity = ccidt;
            this.$$changeState(state, {
              ccKey: this.cc.ccKey,
              stateFor: targetStateFor,
              module: _module,
              delay: _delay,
              identity: _identity
            });
          };

          _proto.componentDidUpdate = function componentDidUpdate() {
            if (_TargetClass.prototype.componentDidUpdate) _TargetClass.prototype.componentDidUpdate.call(this);
            if (this.$$afterSetState) this.$$afterSetState();
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            var _this$cc$ccState = this.cc.ccState,
                ccUniqueKey = _this$cc$ccState.ccUniqueKey,
                ccClassKey = _this$cc$ccState.ccClassKey;
            offEventHandlersByCcUniqueKey(ccUniqueKey);
            unsetRef(ccClassKey, ccUniqueKey); //if father component implement componentWillUnmount，call it again

            if (_TargetClass.prototype.componentWillUnmount) _TargetClass.prototype.componentWillUnmount.call(this);
          };

          _proto.render = function render() {
            if (ccContext.isDebug) {
              console.log(ss$1("@@@ render " + ccClassDisplayName$1(ccClassKey)), cl$1());
            }

            if (extendInputClass) {
              //now cc class extends ReactClass, call super.render()
              return _TargetClass.prototype.render.call(this);
            } else {
              // now cc class extends ReactComponent, render user inputted ReactClass
              var props = Object.assign(this, this.props);
              return React__default.createElement(ReactClass, props);
            }
          };

          return CcClass;
        }(TargetClass);

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

  function mapSharedKeyToGlobal (moduleName, sharedKey, globalMappingKey) {
    var _state = ccContext.store._state;
    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    var globalMappingKey_fromModule_ = ccContext.globalMappingKey_fromModule_;
    var sharedKey_globalMappingKeyDescriptor_ = ccContext.sharedKey_globalMappingKeyDescriptor_;
    var globalStateKeys = ccContext.globalStateKeys;
    var globalState = _state[MODULE_GLOBAL];
    var moduleState = _state[moduleName];

    if (!moduleState.hasOwnProperty(sharedKey)) {
      throw new Error("the module:" + moduleName + " doesn't have a key named " + sharedKey + ", check your sharedToGlobalMapping or your module state");
    }

    if (globalState.hasOwnProperty(globalMappingKey)) {
      throw new Error("the key:" + globalMappingKey + " has been declared already in globalState, you can't use it to map the sharedStateKey:" + sharedKey + " to global state, try rename your mappingKey in sharedToGlobalMapping!");
    }

    globalStateKeys.push(globalMappingKey);
    globalState[globalMappingKey] = moduleState[sharedKey];
    globalMappingKey_sharedKey_[globalMappingKey] = sharedKey;
    globalMappingKey_fromModule_[globalMappingKey] = moduleName;
    sharedKey_globalMappingKeyDescriptor_[sharedKey] = {
      globalMappingKey: globalMappingKey,
      fromModule: moduleName
    };
  }

  function handleModuleSharedToGlobalMapping (moduleName, moduleSharedKeyToGlobalKeyConfig) {
    var sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
    var sLen = sharedKeys.length;

    for (var k = 0; k < sLen; k++) {
      var sharedKey = sharedKeys[k];
      var globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];

      if (typeof globalMappingKey !== 'string') {
        throw new Error("globalMappingKey type error, is must be string, check your sharedToGlobalMapping! " + util.verboseInfo("module:" + moduleName + ", sharedKey:" + sharedKey));
      }

      mapSharedKeyToGlobal(moduleName, sharedKey, globalMappingKey);
    }
  }

  function initModuleState (module, state, rootStateCanNotContainInputModule) {
    if (rootStateCanNotContainInputModule === void 0) {
      rootStateCanNotContainInputModule = true;
    }

    if (rootStateCanNotContainInputModule) checkModuleNameAndState(module, state);else checkModuleNameBasicallyAndState(module, state); // ccContext.store.setState(module, state);

    var rootState = ccContext.store.getState();
    rootState[module] = state;
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

  function setState (module, state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
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
        broadcastTriggeredBy: BROADCAST_TRIGGERED_BY_CC_API_SET_STATE,
        lazyMs: lazyMs
      });
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function makeSetStateHandler (module) {
    return function (state) {
      try {
        setState(module, state, 0, true);
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

  function initModuleReducer (module, reducer, rootReducerCanNotContainInputModule) {
    if (rootReducerCanNotContainInputModule === void 0) {
      rootReducerCanNotContainInputModule = true;
    }

    if (!reducer) return;
    if (rootReducerCanNotContainInputModule) checkReducerModuleName(module);else checkModuleNameBasically(module);
    var _ccContext$reducer = ccContext.reducer,
        _reducer = _ccContext$reducer._reducer,
        _reducerName_FullReducerNameList_ = _ccContext$reducer._reducerName_FullReducerNameList_;
    _reducer[module] = reducer;
    var reducerNames = okeys(reducer);
    reducerNames.forEach(function (name) {
      var list = safeGetArrayFromObject(_reducerName_FullReducerNameList_, name);
      list.push(module + "/" + name);
    });
  }

  var safeGetObjectFromObject$1 = safeGetObjectFromObject,
      isPlainJsonObject$1 = isPlainJsonObject;
  /**
   * 设置watch值，过滤掉一些无效的key
   */

  function initModuleWatch (module, moduleWatch) {
    if (!isPlainJsonObject$1(moduleWatch)) {
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
      isPlainJsonObject$2 = isPlainJsonObject;
  function initModuleComputed (module, computed) {
    if (!isPlainJsonObject$2(computed)) {
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

  var isPlainJsonObject$3 = isPlainJsonObject,
      okeys$1 = okeys;
  function configStoreState(storeState) {
    var sharedToGlobalMapping = ccContext.sharedToGlobalMapping;

    if (!isPlainJsonObject$3(storeState)) {
      throw new Error("the storeState is not a plain json object!");
    }

    var globalStateKeys = ccContext.globalStateKeys,
        pureGlobalStateKeys = ccContext.pureGlobalStateKeys,
        store = ccContext.store;
    store.initStateDangerously(MODULE_CC, {});
    if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
    if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
    var moduleNames = okeys$1(storeState);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      var moduleState = storeState[moduleName];
      initModuleState(moduleName, moduleState);
      var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

      if (sharedKey_globalKey_) {
        handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
      }
    }

    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    globalStateKeys.reduce(function (pKeys, gKey) {
      if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
      return pKeys;
    }, pureGlobalStateKeys);
  }
  /**
   * 
   * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
   */

  function configRootReducer(rootReducer) {
    var moduleNames = okeys$1(rootReducer);
    if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
    if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      initModuleReducer(moduleName, rootReducer[moduleName]);
    }
  }
  function configRootComputed(computed) {
    if (!isPlainJsonObject$3(computed)) {
      throw new Error("StartUpOption.computed is not a plain json object!");
    }

    var moduleNames = okeys$1(computed);
    moduleNames.forEach(function (m) {
      return initModuleComputed(m, computed[m]);
    });
  }
  function configRootWatch(watch) {
    if (!isPlainJsonObject$3(watch)) {
      throw new Error("StartUpOption.watch is not a plain json object!");
    }

    var moduleNames = Object.keys(watch);
    moduleNames.forEach(function (m) {
      return initModuleWatch(m, watch[m]);
    });
  }
  function executeRootInit(init) {
    if (!init) return;

    if (!isPlainJsonObject$3(init)) {
      throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
    }

    var moduleNames = okeys$1(init);
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
  function configSharedToGlobalMapping(sharedToGlobalMapping) {
    if (!isPlainJsonObject$3(sharedToGlobalMapping)) {
      throw new Error("StartupOption.sharedToGlobalMapping is not a plain json object!");
    }

    safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
  }
  function configModuleSingleClass(moduleSingleClass) {
    if (!isPlainJsonObject$3(moduleSingleClass)) {
      throw new Error("StartupOption.moduleSingleClass is not a plain json object!");
    }

    safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
  }
  function configMiddlewares(middlewares) {
    if (middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
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
        _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
        sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
        _ref$moduleSingleClas = _ref.moduleSingleClass,
        moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
        _ref$isStrict = _ref.isStrict,
        isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
        _ref$isDebug = _ref.isDebug,
        isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
        _ref$errorHandler = _ref.errorHandler,
        errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
        _ref$isHot = _ref.isHot,
        isHot = _ref$isHot === void 0 ? false : _ref$isHot,
        _ref$autoCreateDispat = _ref.autoCreateDispatcher,
        autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat;

    try {
      util.justTip("cc version " + ccContext.info.version);
      ccContext.isHot = isHot;
      ccContext.errorHandler = errorHandler;
      ccContext.isStrict = isStrict;
      ccContext.isDebug = isDebug;

      if (ccContext.isCcAlreadyStartup) {
        var err = util.makeError(ERR.CC_ALREADY_STARTUP);

        if (util.isHotReloadMode()) {
          clearObject(ccContext.globalStateKeys);
          clearObject(ccContext.reducer._reducer);
          clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL], {});
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

      configSharedToGlobalMapping(sharedToGlobalMapping);
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
        window.CC_CONTEXT = ccContext;
        window.ccc = ccContext;
        window.cccc = ccContext.computed._computedValue;
      }

      ccContext.isCcAlreadyStartup = true;
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
   * @param {{state:object, reducer:object, watch:object, computed:object, init:object, sharedToGlobalMapping:object, isClassSingle:boolean}} config
   * @param {object} [option] reducer、init、sharedToGlobalMapping
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
        sharedToGlobalMapping = config.sharedToGlobalMapping,
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

    if (sharedToGlobalMapping) {
      handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
    }

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
   * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, sharedToGlobalMapping:object, isClassSingle:boolean} }} store
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
    var _sharedToGlobalMapping = {};
    var _moduleSingleClass = {};
    var moduleNames = Object.keys(store);
    moduleNames.forEach(function (m) {
      var config = store[m];
      var state = config.state,
          reducer = config.reducer,
          watch = config.watch,
          computed = config.computed,
          init = config.init,
          sharedToGlobalMapping = config.sharedToGlobalMapping,
          isClassSingle = config.isClassSingle;
      if (state) _store[m] = state;
      if (reducer) _reducer[m] = reducer;
      if (watch) _watch[m] = watch;
      if (computed) _computed[m] = computed;
      if (init) _init[m] = init;
      if (sharedToGlobalMapping) _sharedToGlobalMapping[m] = sharedToGlobalMapping;
      if (typeof isClassSingle === 'boolean') _moduleSingleClass[m] = isClassSingle;
    });
    if (!util.isObjectNotNull(_init)) _init = null;
    var startupOption = {
      store: _store,
      reducer: _reducer,
      watch: _watch,
      computed: _computed,
      init: _init,
      sharedToGlobalMapping: _sharedToGlobalMapping,
      moduleSingleClass: _moduleSingleClass
    };
    var _option = option,
        middlewares = _option.middlewares,
        isStrict = _option.isStrict,
        isDebug = _option.isDebug,
        errorHandler = _option.errorHandler,
        isHot = _option.isHot,
        autoCreateDispatcher = _option.autoCreateDispatcher,
        reducer = _option.reducer;

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
      isStrict: isStrict,
      isDebug: isDebug,
      errorHandler: errorHandler,
      isHot: isHot,
      autoCreateDispatcher: autoCreateDispatcher
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
   * @param {Array<string>|string} [registerOption.globalStateKeys] 
   * declare which global keys's state changing the current class care about,
   * default is empty array, that means any state key's value changing will not effect global state,
   * note! the keys must have been declared in global state,
   * assume your global state like {gColor:'red', gWidth:200},
   * and you define globalStateKeys like ['gColor']，
   * when you current cc instance send a state to cc like {gColor:'blue', otherKey:'whatever'},
   * global state's gColor will been changed and any other cc instance if their globalStateKeys include gColor
   * will read the latest gColor value and render new view.
   * your can also define it as '*', it means current cc class will watch global module whole state,
   * ============   !!!!!!  ============
   * and pay attention key naming duplicate, because a cc instance's state is merged from global state、module state and self state,
   * so cc don't allow sharedStateKeys and globalStateKeys has duplicate element
   * 
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
   * @param {string} [registerOption.extendInputClass] default is true
   * cc alway use strategy of reverse inheritance to wrap your react class, that meas you can call cc instance method from `this` directly
   * but if you meet multi decorator in your legacy project and want to change it to cc, to make it still works well in cc mode,
   * you can set extendInputClass as false, then cc will use strategy of prop proxy to wrap your react class, in this situation, 
   * all the cc instance method and property you can only get them from `this.props`, for example
   * ```
   *    @cc.register('BasicForms',{
   *      connect: {'form': ['regularFormSubmitting']},
   *      extendInputClass: false 
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
   * @param {string} [registerOption.asyncLifecycleHook] default is true
   * we can define cc class lifecycle method $$beforeSetState、$$afterSetState、$$beforeBroadcastState,
   * but they are synchronous by default,
   * if you define registerOption.isSingle as true, these three method's second param will be next handler
   *  * ============   !!!!!!  ============
   *  you must call next, if you don't want to block any of next operation in cc core
   * ```
   * $$beforeSetState(executeContext, next){
   *  // here if you don't call next(), it will block reactSetState, broadcastState and etc operations ~_~
   * }
   * ```
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
   * option.globalStateKeys is called g for short 
   * option.connect is called pm for c 
   * option.isSingle is called is for short 
   * option.asyncLifecycleHook is called as for short 
   * option.reducerModule is called re for short 
   * option.extendInputClass is called ex for short 
   */

  function _r (ccClassKey, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.m,
        sharedStateKeys = _ref.s,
        globalStateKeys = _ref.g,
        storedStateKeys = _ref.st,
        connect = _ref.c,
        isSingle = _ref.is,
        asyncLifecycleHook = _ref.as,
        reducerModule = _ref.re,
        extendInputClass = _ref.ex;

    return register$1(ccClassKey, {
      extendInputClass: extendInputClass,
      module: module,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
      storedStateKeys: storedStateKeys,
      connect: connect,
      isSingle: isSingle,
      asyncLifecycleHook: asyncLifecycleHook,
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

  function setGlobalState (state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.setGlobalState(state, lazyMs, BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE);
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  function throwApiCallError() {
    throw new Error("api doc: cc.setState(module:string, state:Object, lazyMs?:Number, throwError?:Boolean)");
  }

  function _setState (module, state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
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

    setState(module, state, lazyMs, throwError);
  }

  var getState$1 = ccContext.store.getState;

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
   * @param {boolean} [option.extendInputClass] default is true
   * @param {boolean} [option.isSingle] default is false
   * @param {boolean} [option.asyncLifecycleHook] 
   * @param {string} [option.module]
   * @param {Array<string>} [option.sharedStateKeys]
   * @param {Array<string>} [option.globalStateKeys]
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

  function _dispatch (action, payLoadWhenActionIsString, identity, _temp) {
    if (identity === void 0) {
      identity = '';
    }

    var _ref = _temp === void 0 ? [] : _temp,
        ccClassKey = _ref[0],
        ccKey = _ref[1],
        throwError = _ref[2];

    if (action === undefined && payLoadWhenActionIsString === undefined) {
      throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any), when action is String, second param means payload");
    }

    var dispatchFn;

    try {
      if (ccClassKey && ccKey) {
        var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          dispatchFn = targetRef.$$dispatch;
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
          dispatchFn = ref.__fragmentParams.dispatch;
        } else {
          dispatchFn = ref.$$dispatchForModule;
        }
      }

      if (typeof action === 'string' && action.startsWith('*')) {
        var reducerName = action.split('/').pop();
        var rnList_ = ccContext.reducer._reducerName_FullReducerNameList_[reducerName];
        rnList_.forEach(function (fullReducerName) {
          dispatchFn(fullReducerName, payLoadWhenActionIsString, identity);
        });
      } else {
        dispatchFn(action, payLoadWhenActionIsString, identity);
      }
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  var ccKey_ref_$3 = ccContext.ccKey_ref_,
      ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;
  function getRefsByClassKey (ccClassKey) {
    var refs = [];
    var ccClassContext = ccClassKey_ccClassContext_$2[ccClassKey];

    if (!ccClassContext) {
      return refs;
    }

    var ccKeys = ccClassContext.ccKeys;
    ccKeys.filter(function (k) {
      var ref = ccKey_ref_$3[k];
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

  var ccKey_ref_$4 = ccContext.ccKey_ref_;
  function getDispatcherRef () {
    var ref = ccKey_ref_$4[CC_DISPATCHER];

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
      fragmentFeature_classKey_ = ccContext.fragmentFeature_classKey_;
  /**
   * 根据connect参数动态的把CcFragment划为某个ccClassKey的实例，同时计算出stateToPropMapping值
   * @param connectSpec 形如: {foo:'*', bar:['b1', 'b2']}
   */

  function getFragmentClassKeyAndStpMapping(connectSpec) {
    if (!isObjectNotNull(connectSpec)) {
      //代表没有connect到store任何模块的CcFragment
      return {
        ccClassKey: CC_FRAGMENT_PREFIX + "_0",
        stateToPropMapping: null
      };
    }

    var _getFeatureStrAndStpM = getFeatureStrAndStpMapping(connectSpec),
        featureStr = _getFeatureStrAndStpM.featureStr,
        stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping;

    var ccClassKey = fragmentFeature_classKey_[featureStr];

    if (ccClassKey) {
      return {
        ccClassKey: ccClassKey,
        stateToPropMapping: stateToPropMapping
      };
    } else {
      var oldFragmentNameCount = ccContext.fragmentNameCount;
      var fragmentNameCount = oldFragmentNameCount + 1;
      ccContext.fragmentNameCount = fragmentNameCount;
      ccClassKey = CC_FRAGMENT_PREFIX + "_" + fragmentNameCount;
      fragmentFeature_classKey_[featureStr] = ccClassKey;
      return {
        ccClassKey: ccClassKey,
        stateToPropMapping: stateToPropMapping
      };
    }
  }

  var cursorKey = CURSOR_KEY;
  var ccSyncKey = CCSYNC_KEY;

  var CcFragment =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(CcFragment, _Component);

    function CcFragment(props, context) {
      var _this;

      _this = _Component.call(this, props, context) || this;
      var ccKey = props.ccKey,
          _props$connect = props.connect,
          connectSpec = _props$connect === void 0 ? {} : _props$connect,
          _props$state = props.state,
          state = _props$state === void 0 ? {} : _props$state;

      var _getFragmentClassKeyA = getFragmentClassKeyAndStpMapping(connectSpec),
          ccClassKey = _getFragmentClassKeyA.ccClassKey,
          stateToPropMapping = _getFragmentClassKeyA.stateToPropMapping;

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

      buildCcClassContext(ccClassKey, MODULE_DEFAULT, [], [], [], [], stateToPropMapping, true);
      setRef(_assertThisInitialized(_this), false, ccClassKey, ccKey, ccUniqueKey, {}, true); // for CcFragment, just put ccClassKey to module's cc class keys

      var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_;
      var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_, MODULE_DEFAULT);
      if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
      var ctx = ccClassKey_ccClassContext_$3[ccClassKey];
      var connectedComputed = ctx.connectedComputed || {};
      var connectedState = ctx.connectedState || {}; // only bind reactForceUpdateRef for CcFragment

      var reactForceUpdateRef = _this.forceUpdate.bind(_assertThisInitialized(_this));

      var ccState = {
        module: MODULE_DEFAULT,
        ccClassKey: ccClassKey,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
        stateToPropMapping: stateToPropMapping,
        renderCount: 0
      };
      _this.cc = {
        ccState: ccState,
        reactForceUpdate: function reactForceUpdate(state, cb) {
          ccState.renderCount += 1;
          reactForceUpdateRef(state, cb);
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
              var _this$__fragmentParam;

              _this.__fragmentParams.sync(e, (_this$__fragmentParam = {}, _this$__fragmentParam[cursorKey] = cursor, _this$__fragmentParam));
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
      _this.state = state;
      var __fragmentParams = {
        connectedComputed: connectedComputed,
        connectedState: connectedState,
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
          bindEventHandlerToCcContext(MODULE_DEFAULT, ccClassKey, ccUniqueKey, event, null, handler);
        },
        onIdentity: function onIdentity(event, identity, handler) {
          bindEventHandlerToCcContext(MODULE_DEFAULT, ccClassKey, ccUniqueKey, event, identity, handler);
        },
        dispatch: dispatcher.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, MODULE_DEFAULT, null, null, null, -1, ccKey),
        effect: dispatcher.__$$getEffectHandler(ccKey),
        xeffect: dispatcher.__$$getXEffectHandler(ccKey),
        //seat1, seat2仅仅用于占位
        sync: function sync(e, cursor, seat1, seat2) {
          if (typeof e === 'string') {
            var _fragmentParams$sync;

            var syncFn = __fragmentParams.sync.bind(null, (_fragmentParams$sync = {}, _fragmentParams$sync[ccSyncKey] = e, _fragmentParams$sync), cursor); //此时的e是ccsync, cursor是bindedInt


            return syncFn;
          } else {
            if (cursor !== null && typeof cursor === 'object' && cursor[cursorKey] !== undefined) {
              // syncLocalHookState 同步本地的hook状态
              var _cursor = cursor[cursorKey];
              __hookMeta.stateArr[_cursor] = e.currentTarget.value;

              _this.cc.reactForceUpdate();
            } else {
              var ccint = '',
                  ccsync = '',
                  value = '',
                  mockE = e;

              if (typeof e === 'object' && e[ccSyncKey] !== undefined) {
                ccint = cursor;
                ccsync = e[ccSyncKey];
                value = seat1; //这个值由函数注入

                mockE = {
                  currentTarget: {
                    value: value,
                    dataset: {
                      ccsync: ccsync,
                      ccint: ccint
                    }
                  }
                };
              } else {
                var currentTarget = e.currentTarget;
                value = currentTarget.value;
                var dataset = currentTarget.dataset;
                ccint = dataset.ccint;
                ccsync = dataset.ccsync;
              }

              if (e.stopPropagation) e.stopPropagation();

              if (!ccsync) {
                return justWarning("data-ccsync attr no found, you must define it while using syncLocal");
              }

              if (ccsync.includes('/')) {
                // syncModuleState 同步模块的state状态
                dispatcher.$$sync(mockE, STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE);
              } else {
                // syncLocalState 同步本地的state状态
                var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, _this.state),
                    _state = _extractStateByCcsync.state;

                __fragmentParams.setState(_state);
              }
            }
          }
        },
        setModuleState: function setModuleState(module, state, lazyMs) {
          dispatcher.$$changeState(state, {
            ccKey: ccKey,
            module: module,
            stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
            broadcastTriggeredBy: null,
            lazyMs: lazyMs
          });
        },
        setGlobalState: function setGlobalState(state, lazyMs) {
          dispatcher.$$changeState(state, {
            ccKey: ccKey,
            MODULE_GLOBAL: MODULE_GLOBAL,
            stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
            broadcastTriggeredBy: null,
            lazyMs: lazyMs
          });
        },
        state: _this.state,
        props: props,
        setState: function setState(state) {
          _this.setState(state, function () {
            return _this.cc.reactForceUpdate();
          });
        }
      };
      _this.__fragmentParams = __fragmentParams;
      return _this;
    }

    var _proto = CcFragment.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var _this$__hookMeta = this.__hookMeta,
          effectCbArr = _this$__hookMeta.effectCbArr,
          effectCbReturnArr = _this$__hookMeta.effectCbReturnArr;
      this.__hookMeta.isCcFragmentMounted = true;
      effectCbArr.forEach(function (cb) {
        var cbReturn = cb();

        if (typeof cbReturn === 'function') {
          effectCbReturnArr.push(cbReturn);
        } else {
          effectCbReturnArr.push(null);
        }
      });
    };

    _proto.componentDidUpdate = function componentDidUpdate() {
      var _this$__hookMeta2 = this.__hookMeta,
          effectCbArr = _this$__hookMeta2.effectCbArr,
          effectCbReturnArr = _this$__hookMeta2.effectCbReturnArr,
          effectSeeResult = _this$__hookMeta2.effectSeeResult;
      effectCbArr.forEach(function (cb, idx) {
        var shouldEffectExecute = effectSeeResult[idx];

        if (shouldEffectExecute) {
          var cbReturn = cb();

          if (typeof cbReturn === 'function') {
            effectCbReturnArr[idx] = cbReturn;
          }
        }
      });
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate() {
      return false;
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.__hookMeta.effectCbReturnArr.forEach(function (cb) {
        if (cb) cb();
      });

      var _this$cc$ccState = this.cc.ccState,
          ccUniqueKey = _this$cc$ccState.ccUniqueKey,
          ccClassKey = _this$cc$ccState.ccClassKey;
      offEventHandlersByCcUniqueKey(ccUniqueKey);
      unsetRef(ccClassKey, ccUniqueKey);
      if (_Component.prototype.componentWillUnmount) _Component.prototype.componentWillUnmount.call(this);
    };

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          render = _this$props.render;
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
  var getState$2 = getState$1;
  var getGlobalState$1 = getGlobalState;
  var getComputed = _getComputed;
  var emit = _emit;
  var emitWith = _emitWith;
  var off = _off;
  var connect = _connect;
  var dispatch = _dispatch;
  var ccContext$1 = ccContext;
  var createDispatcher$1 = createDispatcher;
  var execute = _execute;
  var executeAll = _executeAll;
  var CcFragment$1 = CcFragment;
  var defaultExport = {
    cloneModule: cloneModule,
    emit: emit,
    emitWith: emitWith,
    off: off,
    connect: connect,
    dispatch: dispatch,
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
    getGlobalState: getGlobalState$1,
    setState: setState$1,
    getState: getState$2,
    getComputed: getComputed,
    ccContext: ccContext$1,
    createDispatcher: createDispatcher$1,
    execute: execute,
    executeAll: executeAll,
    CcFragment: CcFragment$1
  };

  if (window) {
    window.cc = defaultExport;
  }

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
  exports.getState = getState$2;
  exports.getGlobalState = getGlobalState$1;
  exports.getComputed = getComputed;
  exports.emit = emit;
  exports.emitWith = emitWith;
  exports.off = off;
  exports.connect = connect;
  exports.dispatch = dispatch;
  exports.ccContext = ccContext$1;
  exports.createDispatcher = createDispatcher$1;
  exports.execute = execute;
  exports.executeAll = executeAll;
  exports.CcFragment = CcFragment$1;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
