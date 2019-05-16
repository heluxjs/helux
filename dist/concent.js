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
  var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 303; //  two kind of state extraction
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
    CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE: 1007,
    CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1008,
    CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1009,
    CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1010,
    CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION: 1011,
    CC_MODULE_NOT_FOUND: 1012,
    CC_DISPATCH_STRING_INVALID: 1013,
    CC_DISPATCH_PARAM_INVALID: 1014,
    CC_NO_DISPATCHER_FOUND: 1015,
    CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION: 1016,
    CC_CLASS_KEY_DUPLICATE: 1100,
    CC_CLASS_NOT_FOUND: 1101,
    CC_CLASS_STORE_MODULE_INVALID: 1102,
    CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED: 1103,
    CC_CLASS_REDUCER_MODULE_INVALID: 1104,
    CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE: 1105,
    CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE: 1106,
    CC_CLASS_STATE_TO_PROP_MAPPING_INVALID: 1107,
    CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID: 1108,
    CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED: 1109,
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
    CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE: 1401,
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
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the computed keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'react-control-center';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID] = 'key of stateToPropMapping is invalid, correct one may like $g/m, must and only include one slash, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

  var _state2, _reducer;
  var refs = {};

  var setStateByModule = function setStateByModule(module, partialState) {
    // const fullState = getState(module);
    // const mergedState = { ...fullState, ...partialState };
    // _state[module] = mergedState;
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

    if (moduleComputedFn) {
      var fn = moduleComputedFn[key];

      if (fn) {
        var computedValue = fn(value);
        computed._computedValue[module][key] = computedValue;
      }
    }

    if (watchFn) {
      var _fn = watchFn[key];
      if (_fn) _fn(value, moduleState[key]); //fn(newValue, oldValue)
    }

    moduleState[key] = value;
  };

  var computed = {
    _computedValue: {},
    _computedFn: {}
  };
  var watch = {};
  var ccContext = {
    isDebug: false,
    // if isStrict is true, every error will be throw out instead of console.error, 
    // but this may crash your app, make sure you have a nice error handling way,
    // like componentDidCatch in react 16.*
    isStrict: false,
    returnRootState: false,
    isModuleMode: false,
    isCcAlreadyStartup: false,
    //  cc allow multi react class register to a module by default, but if want to control some module 
    //  to only allow register one react class, flag the module name as true in this option object
    //  example:  {fooModule: true, barModule:true}
    moduleSingleClass: {},
    propModuleName_ccClassKeys_: {//module is watched by these ccClass's propState
    },
    moduleName_ccClassKeys_: {},
    // map from moduleName to sharedStateKeys
    moduleName_sharedStateKeys_: {},
    // map from moduleName to globalStateKeys
    moduleName_globalStateKeys_: {},
    //to let cc know which ccClass are watching globalStateKeys
    globalCcClassKeys: [],

    /**
      ccClassContext:{
        module,
        sharedStateKeys,
        globalStateKeys,
        isPropModuleMode:false,// when false, data were collected into propState directly, else collected into propState[module]
        propState:{},
        propKey_stateKeyDescriptor_: {},
        stateKey_propKeyDescriptor_: {},
        stateToPropMapping:null,
        ccKeys: [],
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
    store: {
      _state: (_state2 = {}, _state2[MODULE_GLOBAL] = {}, _state2[MODULE_CC] = {}, _state2),
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
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer)
    },
    computed: computed,
    watch: watch,
    refStore: {
      _state: {},
      setState: function setState(ccUniqueKey, partialStoredState) {
        var _state = ccContext.refStore._state;
        var fullStoredState = _state[ccUniqueKey];
        var mergedState = Object.assign(fullStoredState, partialStoredState);
        _state[ccUniqueKey] = mergedState;
      }
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
      version: '1.1.92',
      author: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
      tag: 'promise land'
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

      if (window.webpackHotUpdate || window.name === 'previewFrame') {
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
      propState: {},
      propKey_stateKeyDescriptor_: {},
      stateKey_propKeyDescriptor_: {},
      stateToPropMapping: null
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
  function clearObject(object, excludeKeys) {
    if (excludeKeys === void 0) {
      excludeKeys = [];
    }

    if (Array.isArray(object)) object.length = 0;else Object.keys(object).forEach(function (key) {
      if (!excludeKeys.includes(key)) delete object[key];
    });
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

  /****
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module, excludeDispatcher) {
    if (excludeDispatcher === void 0) {
      excludeDispatcher = true;
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
        throw new Error("sorry, module: " + module + " is invalid, cc don't know this module!");
      }
    }

    if (ccKeys.length === 0) {
      ccKeys = Object.keys(ccKey_ref_);
    }

    if (ccKeys.length === 0) {
      var ignoreIt = "if this message doesn't matter, you can ignore it";
      if (module) throw new Error("[[pick-one-ref]]: no any ccInstance founded for module:" + module + "!," + ignoreIt);else throw new Error("[[pick-one-ref]]: no any ccInstance founded currently," + ignoreIt);
    }

    if (excludeDispatcher === true) {
      ccKeys = ccKeys.filter(function (key) {
        return key !== CC_DISPATCHER;
      });
    }

    var oneRef = ccKey_ref_[ccKeys[0]];

    if (!oneRef) {
      throw new Error('cc found no ref!');
    }

    return oneRef;
  }

  function checkModuleName (moduleName, checkForReducer) {
    if (checkForReducer === void 0) {
      checkForReducer = false;
    }

    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;

    if (!isModuleNameValid(moduleName)) {
      throw makeError(ERR.CC_MODULE_NAME_INVALID, verboseInfo(" moduleName:" + moduleName + " is invalid!"));
    }

    if (isModuleNameCcLike(moduleName)) {
      throw makeError(ERR.CC_MODULE_KEY_CC_FOUND);
    }

    if (checkForReducer) {
      if (moduleName != MODULE_GLOBAL) {
        if (_reducer[moduleName]) {
          throw makeError(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
        }
      }
    } else {
      if (_state[moduleName]) {
        throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName:" + moduleName));
      }
    }
  }

  function checkModuleState (moduleState, moduleName) {
    if (!util.isModuleStateValid(moduleState)) {
      throw util.makeError(ERR.CC_STORE_STATE_INVALID, util.verboseInfo("moduleName:" + moduleName + "'s state is invalid!"));
    }
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

  var ccStoreSetState = ccContext.store.setState;
  var ccGlobalStateKeys = ccContext.globalStateKeys;
  var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";
  function getAndStoreValidGlobalState (globalState) {
    var _extractStateByKeys = extractStateByKeys(globalState, ccGlobalStateKeys),
        validGlobalState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    if (Object.keys(validGlobalState) < Object.keys(globalState)) {
      justWarning(tip);
    }

    ccStoreSetState(MODULE_GLOBAL, validGlobalState);
    return {
      partialState: validGlobalState,
      isStateEmpty: isStateEmpty
    };
  }

  function getStateHandlerForInit (module) {
    return function (state) {
      try {
        setState(module, state, 0, true);
      } catch (err) {
        if (module == MODULE_GLOBAL) {
          getAndStoreValidGlobalState(state);
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

  var feature_timerId = {};
  var runLater = (function (cb, feature, lazyMs) {
    if (lazyMs === void 0) {
      lazyMs = 1000;
    }

    var timerId = feature_timerId[feature];
    if (timerId) clearTimeout(timerId);
    feature_timerId[feature] = setTimeout(function () {
      delete feature_timerId[feature];
      cb();
    }, lazyMs);
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

  function uuid (forFragment) {
    if (forFragment === void 0) {
      forFragment = false;
    }

    var prefix = forFragment === true ? 'CCF' : 'CC';
    _currentIndex++;
    var nonceStr = genNonceStr();
    return prefix + "_" + Date.now() + "_" + nonceStr + "_" + _currentIndex;
  }

  var catchCcError = (function (err) {
    if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
  });

  function setPropState (propState, propKey, propValue, isPropStateModuleMode, module) {
    if (isPropStateModuleMode) {
      var modulePropState = util.safeGetObjectFromObject(propState, module);
      modulePropState[propKey] = propValue;
    } else {
      propState[propKey] = propValue;
    }
  }

  var me = util.makeError,
      vbi = util.verboseInfo,
      throwCcHmrError$1 = util.throwCcHmrError;

  function _throwPropDuplicateError(prefixedKey, module) {
    throw me("cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error", vbi("the prefixedKey is " + prefixedKey + ", module is:" + module));
  }

  function _getPropKeyPair(isPropStateModuleMode, module, stateKey, propKey) {
    if (isPropStateModuleMode === true) {
      var derivedPropKey = '';
      if (propKey === '') derivedPropKey = stateKey;else derivedPropKey = propKey;
      var moduledPropKey = module + "/" + derivedPropKey;
      return {
        moduledPropKey: moduledPropKey,
        originalPropKey: propKey,
        derivedPropKey: derivedPropKey
      };
    } else {
      return {
        moduledPropKey: propKey,
        originalPropKey: propKey,
        derivedPropKey: propKey
      };
    }
  }

  function buildCcClassContext (ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode, forCcFragment) {
    if (forCcFragment === void 0) {
      forCcFragment = false;
    }

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var ccClassContext = contextMap[ccClassKey];

    if (forCcFragment === true) {
      //if this is called fro CcFragment, just reuse  ccClassContext;
      if (ccClassContext === undefined) {
        ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
      }
    } else {
      if (ccClassContext !== undefined) {
        throwCcHmrError$1(me(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
      }

      ccClassContext = util.makeCcClassContext(moduleName, ccClassKey, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }

    var _state = ccContext.store._state;
    var propModuleName_ccClassKeys_ = ccContext.propModuleName_ccClassKeys_;

    if (stateToPropMapping != undefined) {
      var propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
      var stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
      var propState = ccClassContext.propState;

      if (typeof stateToPropMapping !== 'object') {
        throw me(ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey);
      }

      var module_mapAllStateToProp_ = {};
      var module_sharedKey_ = {};
      var module_prefixedKeys_ = {};
      var prefixedKeys = Object.keys(stateToPropMapping);
      var len = prefixedKeys.length;

      for (var i = 0; i < len; i++) {
        var prefixedKey = prefixedKeys[i];

        if (!util.isPrefixedKeyValid(prefixedKey)) {
          throw me(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey + ", key:" + prefixedKey);
        }

        var _prefixedKey$split = prefixedKey.split('/'),
            targetModule = _prefixedKey$split[0],
            targetKey = _prefixedKey$split[1];

        if (module_mapAllStateToProp_[targetModule] === true) ; else {
          if (targetKey === '*') {
            module_mapAllStateToProp_[targetModule] = true;
            module_sharedKey_[targetModule] = prefixedKey;
          } else {
            var modulePrefixedKeys = util.safeGetArrayFromObject(module_prefixedKeys_, targetModule);
            modulePrefixedKeys.push(prefixedKey);
            module_mapAllStateToProp_[targetModule] = false;
          }
        }
      }

      var targetModules = Object.keys(module_mapAllStateToProp_);
      var propKey_appeared_ = {}; //help cc to judge propKey is duplicated or not

      targetModules.forEach(function (module) {
        var moduleState = _state[module];

        if (moduleState === undefined) {
          throw me(ERR.CC_MODULE_NOT_FOUND, vbi("module:" + module + ", check your stateToPropMapping config!"));
        }

        var isPropStateSet = false;

        if (module_mapAllStateToProp_[module] === true) {
          var moduleStateKeys = Object.keys(moduleState);
          moduleStateKeys.forEach(function (msKey) {
            // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
            var _getPropKeyPair2 = _getPropKeyPair(isPropStateModuleMode, module, msKey, ''),
                moduledPropKey = _getPropKeyPair2.moduledPropKey,
                originalPropKey = _getPropKeyPair2.originalPropKey,
                derivedPropKey = _getPropKeyPair2.derivedPropKey;

            var appeared = propKey_appeared_[moduledPropKey];

            if (appeared === true) {
              _throwPropDuplicateError(module_sharedKey_[module], module);
            } else {
              propKey_appeared_[moduledPropKey] = true; // in this situation , moduledPropKey and moduledStateKey are equal

              propKey_stateKeyDescriptor_[moduledPropKey] = {
                module: module,
                originalStateKey: msKey,
                moduledStateKey: moduledPropKey
              };
              stateKey_propKeyDescriptor_[moduledPropKey] = {
                module: module,
                originalStateKey: msKey,
                moduledPropKey: moduledPropKey,
                originalPropKey: originalPropKey,
                derivedPropKey: derivedPropKey
              };
              setPropState(propState, derivedPropKey, moduleState[msKey], isPropStateModuleMode, module);
              isPropStateSet = true;
            }
          });
        } else {
          var _prefixedKeys = module_prefixedKeys_[module];

          _prefixedKeys.forEach(function (prefixedKey) {
            var _prefixedKey$split2 = prefixedKey.split('/'),
                stateModule = _prefixedKey$split2[0],
                stateKey = _prefixedKey$split2[1];

            var propKey = stateToPropMapping[prefixedKey];

            var _getPropKeyPair3 = _getPropKeyPair(isPropStateModuleMode, module, stateKey, propKey),
                moduledPropKey = _getPropKeyPair3.moduledPropKey,
                originalPropKey = _getPropKeyPair3.originalPropKey,
                derivedPropKey = _getPropKeyPair3.derivedPropKey;

            var appeared = propKey_appeared_[moduledPropKey];

            if (appeared === true) {
              _throwPropDuplicateError(prefixedKey, module);
            } else {
              propKey_appeared_[moduledPropKey] = true;
              var moduledStateKey = module + "/" + stateKey; // stateKey_propKeyDescriptor_ map's key must be moduledStateKey like 'foo/key', cause different module may include the same state key

              propKey_stateKeyDescriptor_[moduledPropKey] = {
                module: stateModule,
                originalStateKey: stateKey,
                moduledStateKey: moduledStateKey
              };
              stateKey_propKeyDescriptor_[moduledStateKey] = {
                module: stateModule,
                originalStateKey: stateKey,
                moduledPropKey: moduledPropKey,
                originalPropKey: originalPropKey,
                derivedPropKey: derivedPropKey
              };
              setPropState(propState, derivedPropKey, moduleState[stateKey], isPropStateModuleMode, module);
              isPropStateSet = true;
            }
          });
        }

        if (isPropStateSet === true) {
          var pCcClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
          if (!pCcClassKeys.includes(ccClassKey)) pCcClassKeys.push(ccClassKey);
        }
      });
      ccClassContext.stateToPropMapping = stateToPropMapping;
      ccClassContext.isPropStateModuleMode = isPropStateModuleMode;
    }

    contextMap[ccClassKey] = ccClassContext;
  }

  var me$1 = util.makeError,
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
      throw me$1(ERR.CC_CLASS_INSTANCE_OPTION_INVALID, vbi$1("a standard default ccOption may like: {\"syncSharedState\": true, \"asyncLifecycleHook\":false, \"storedStateKeys\": []}"));
    }

    var isHot = util.isHotReloadMode();

    if (forCcFragment === true) {
      var fragmentCcKeys = ccContext.fragmentCcKeys;

      if (fragmentCcKeys.includes(ccKey)) {
        throw me$1(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("<CcFragment ccKey=\"" + ccKey + "\" />")); // if(isHot){
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
        if (isSingle && insCount > 1) throw me$1(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi$1("ccClass:" + ccClassKey));

        if (insCount > 2) {
          // now cc can make sure the ccKey duplicate
          throw me$1(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
        } // just warning


        util.justWarning("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi$1("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
        // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
        // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
        // so cc set ref later

        setCcInstanceRef(ccUniqueKey, ref, ccKeys, ccOption, 600);
      } else {
        throw me$1(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$1("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
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

  var me$2 = util.makeError,
      vbi$2 = util.verboseInfo;
  function mapModuleAndCcClassKeys (moduleName, ccClassKey) {
    var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        moduleSingleClass = ccContext.moduleSingleClass;
    var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    if (ccClassKeys.includes(ccClassKey)) {
      util.throwCcHmrError(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw me$2(ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi$2("module " + moduleName + ", ccClassKey " + ccClassKey));
    } // to avoid ccClassKeys include duplicate key in hmr mode


    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
  }

  var verifyKeys$1 = util.verifyKeys,
      ccClassDisplayName$1 = util.ccClassDisplayName,
      styleStr$1 = util.styleStr,
      color$1 = util.color,
      verboseInfo$1 = util.verboseInfo,
      makeError$1 = util.makeError,
      justWarning$1 = util.justWarning,
      throwCcHmrError$2 = util.throwCcHmrError;
  var _ccContext$store = ccContext.store,
      _state = _ccContext$store._state,
      getState = _ccContext$store.getState,
      ccStoreSetState$1 = _ccContext$store.setState,
      setStateByModuleAndKey$1 = _ccContext$store.setStateByModuleAndKey,
      _reducer$1 = ccContext.reducer._reducer,
      refStore = ccContext.refStore,
      globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_,
      _computedValue = ccContext.computed._computedValue,
      event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_$1 = ccContext.handlerKey_handler_,
      ccUniqueKey_handlerKeys_$1 = ccContext.ccUniqueKey_handlerKeys_,
      propModuleName_ccClassKeys_ = ccContext.propModuleName_ccClassKeys_,
      moduleName_sharedStateKeys_ = ccContext.moduleName_sharedStateKeys_,
      moduleName_globalStateKeys_ = ccContext.moduleName_globalStateKeys_,
      ccKey_ref_$1 = ccContext.ccKey_ref_,
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
  var me$3 = makeError$1;
  var vbi$3 = verboseInfo$1;
  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_GLOBAL_STATE = 'setGlobalState';
  var FORCE_UPDATE = 'forceUpdate';
  var EFFECT = 'effect';
  var XEFFECT = 'xeffect';
  var INVOKE = 'invoke';
  var INVOKE_WITH = 'invokeWith';
  var CALL = 'call';
  var CALL_WITH = 'callWith';
  var CALL_THUNK = 'callThunk';
  var CALL_THUNK_WITH = 'callThunkWith';
  var COMMIT = 'commit';
  var COMMIT_WITH = 'commitWith';

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

    if (!ccContext.isModuleMode) {
      if (module !== MODULE_DEFAULT) {
        handleError(me$3(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi$3("module:" + module)), throwError);
        return false;
      } else return true;
    } else {
      if (checkGlobalModule && module === MODULE_GLOBAL) {
        handleError(me$3(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
        return false;
      }

      if (!_state[module]) {
        handleError(me$3(ERR.CC_CLASS_STORE_MODULE_INVALID, vbi$3("module:" + module + " is not configured in cc's store")), throwError);
        return false;
      } else return true;
    }
  }

  function checkReducerModule(reducerModule, throwError) {
    if (throwError === void 0) {
      throwError = true;
    }

    if (!ccContext.isModuleMode) {
      if (reducerModule != MODULE_DEFAULT) {
        handleError(me$3(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, "reducerModule:" + reducerModule), throwError);
      }
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


  function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
    var fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;

    if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
      throw me$3(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
    }

    var contextMap = ccContext.ccClassKey_ccClassContext_;
    var ct = contextMap[ccClassKey];

    if (ct !== undefined) {
      // analyze is ccClassKey really duplicated
      if (util.isHotReloadMode()) {
        var str1 = ct.originalGlobalStateKeys.toString() + ct.originalSharedStateKeys.toString() + JSON.stringify(ct.stateToPropMapping);
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

    buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode);
  }
  /****
   * it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
   * 
   * if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
   * then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$commit, $$call, $$callThunk, $$invoke, $$dispatch method will trigger this extraction strategy
   * ------------------------------------------------------------------------------------------------------------------------
   * if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
   * then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
   * usually ccInstance's $$commitWith, $$callWith, $$callThunkWith, $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
   * will trigger this extraction strategy
   */


  function getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, ccClassGlobalStateKeys, ccClassSharedStateKeys) {
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

  function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
    if (extendInputClass === false) {
      if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
        //??? maybe can use this.props.state?
        _throwForExtendInputClassAsFalseCheck(ccClassKey);
      }
    }

    var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys),
        targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
        targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

    mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, stateToPropMapping, isPropStateModuleMode);
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

  function computeValueForRef(refComputedFn, refComputed, state) {
    if (refComputedFn) {
      var toBeComputed = refComputedFn();
      var toBeComputedKeys = Object.keys(toBeComputed);
      toBeComputedKeys.forEach(function (key) {
        var fn = toBeComputed[key];
        var originalValue = state[key];

        if (originalValue !== undefined) {
          var computedValue = fn(originalValue, state);
          refComputed[key] = computedValue;
        }
      });
    }
  }

  function watchValueForRef(refWatchFn, refEntireState, userCommitState) {
    if (refWatchFn) {
      var refWatch = refWatchFn();
      var watchStateKeys = Object.keys(refWatch);
      watchStateKeys.forEach(function (key) {
        var commitValue = userCommitState[key];

        if (commitValue !== undefined) {
          var watchFn = refWatch[key];
          watchFn(commitValue, refEntireState[key]); // watchFn(newValue, oldValue);
        }
      });
    }
  }

  function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
    var handlers = util.safeGetArrayFromObject(event_handlers_, event);

    if (typeof handler !== 'function') {
      return justWarning$1("event " + event + "'s handler is not a function!");
    }

    var targetHandlerIndex = handlers.findIndex(function (v) {
      return v.ccUniqueKey === ccUniqueKey && v.identity === identity;
    });
    var handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_$1, ccUniqueKey);
    var handlerKey = makeHandlerKey(ccUniqueKey, event, identity); //  that means the component of ccUniqueKey mounted again 
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

    deleteHandlers(handlers);
  }

  function deleteHandlers(handlers) {
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

  function offEventHandlersByCcUniqueKey(ccUniqueKey) {
    var handlerKeys = ccUniqueKey_handlerKeys_$1[ccUniqueKey];

    if (handlerKeys) {
      var toDeleteHandlers = [];
      handlerKeys.forEach(function (k) {
        return toDeleteHandlers.push(handlerKey_handler_$1[k]);
      });
      deleteHandlers(toDeleteHandlers);
    }
  }

  function updateModulePropState(module_isPropStateChanged, noRenderCcUniKeyMap, changedPropStateList, targetClassContext, state, stateModuleName) {
    var stateToPropMapping = targetClassContext.stateToPropMapping,
        stateKey_propKeyDescriptor_ = targetClassContext.stateKey_propKeyDescriptor_,
        propState = targetClassContext.propState,
        isPropStateModuleMode = targetClassContext.isPropStateModuleMode,
        ccClassKey = targetClassContext.ccClassKey,
        ccKeys = targetClassContext.ccKeys;

    if (stateToPropMapping) {
      Object.keys(state).forEach(function (sKey) {
        // sKey mean user commit state's key, it equal propKey, so it may be an alias
        // use input stateModuleName to compute moduledStateKey for current stateKey
        // to see if the propState should be updated
        var moduledStateKey = stateModuleName + "/" + sKey;
        var moduledPropKeyDescriptor = stateKey_propKeyDescriptor_[moduledStateKey];

        if (moduledPropKeyDescriptor) {
          var derivedPropKey = moduledPropKeyDescriptor.derivedPropKey;

          if (module_isPropStateChanged[stateModuleName] !== true) {
            //mark propState changed
            module_isPropStateChanged[stateModuleName] = true;
            changedPropStateList.push(propState); // push this ref to changedPropStateList
          }

          var stateValue = state[sKey];
          setPropState(propState, derivedPropKey, stateValue, isPropStateModuleMode, stateModuleName);
          setStateByModuleAndKey$1(stateModuleName, sKey, stateValue);
        } else {
          if (ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
            noRenderCcUniKeyMap[ccKeys[0]] = 1; // every ccFragment class only have one ins
          }
        }
      });
    }
  }

  function broadcastPropState(module, commitState) {
    var changedPropStateList = [];
    var module_isPropStateChanged = {}; // record which module's propState has been changed

    var noRenderCcUniKeyMap = {}; //these ccUniKeys ins will not been trigger to render
    // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject

    Object.keys(moduleName_ccClassKeys_).forEach(function (moduleName) {
      var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
      ccClassKeys.forEach(function (ccClassKey) {
        var ccClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
        updateModulePropState(module_isPropStateChanged, noRenderCcUniKeyMap, changedPropStateList, ccClassContext, commitState, module);
      });
    });
    Object.keys(module_isPropStateChanged).forEach(function (module) {
      //  this module has stateToPropMapping and propState has been changed!!!
      var ccClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
      ccClassKeys.forEach(function (ccClassKey) {
        var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
        var ccKeys = classContext.ccKeys;
        ccKeys.forEach(function (ccKey) {
          if (noRenderCcUniKeyMap[ccKey] === 1) return;
          var ref = ccKey_ref_$1[ccKey];

          if (ref) {
            ref.cc.reactForceUpdate();
          }
        });
      });
    });
  }

  function _promiseErrorHandler(resolve, reject) {
    return function (err) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return err ? reject(err) : resolve.apply(void 0, args);
    };
  }

  function _promisifyCcFn(ccFn, userLogicFn, executionContext) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      args[_key3 - 3] = arguments[_key3];
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

  function register(ccClassKey, _temp) {
    var _ref4 = _temp === void 0 ? {} : _temp,
        _ref4$module = _ref4.module,
        module = _ref4$module === void 0 ? MODULE_DEFAULT : _ref4$module,
        _ref4$sharedStateKeys = _ref4.sharedStateKeys,
        inputSharedStateKeys = _ref4$sharedStateKeys === void 0 ? [] : _ref4$sharedStateKeys,
        _ref4$globalStateKeys = _ref4.globalStateKeys,
        inputGlobalStateKeys = _ref4$globalStateKeys === void 0 ? [] : _ref4$globalStateKeys,
        _ref4$stateToPropMapp = _ref4.stateToPropMapping,
        stateToPropMapping = _ref4$stateToPropMapp === void 0 ? null : _ref4$stateToPropMapp,
        _ref4$isPropStateModu = _ref4.isPropStateModuleMode,
        isPropStateModuleMode = _ref4$isPropStateModu === void 0 ? false : _ref4$isPropStateModu,
        reducerModule = _ref4.reducerModule,
        _ref4$extendInputClas = _ref4.extendInputClass,
        extendInputClass = _ref4$extendInputClas === void 0 ? true : _ref4$extendInputClas,
        _ref4$isSingle = _ref4.isSingle,
        isSingle = _ref4$isSingle === void 0 ? false : _ref4$isSingle,
        _ref4$asyncLifecycleH = _ref4.asyncLifecycleHook,
        asyncLifecycleHook = _ref4$asyncLifecycleH === void 0 ? true : _ref4$asyncLifecycleH,
        _ref4$__checkStartUp = _ref4.__checkStartUp,
        __checkStartUp = _ref4$__checkStartUp === void 0 ? true : _ref4$__checkStartUp,
        __calledBy = _ref4.__calledBy;

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
      checkReducerModule(_reducerModule);

      var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, stateToPropMapping, isPropStateModuleMode),
          sKeys = _mapModuleAssociateDa.sharedStateKeys,
          gKeys = _mapModuleAssociateDa.globalStateKeys;

      var sharedStateKeys = sKeys,
          globalStateKeys = gKeys;
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
              util.bindThis(_assertThisInitialized(_this), ['__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync', '__$$getChangeStateHandler', '__$$getEffectHandler', '__$$getLazyEffectHandler', '__$$getXEffectHandler', '__$$getLazyXEffectHandler', '__$$getDispatchHandler', '__$$getEffectIdentityHandler', '__$$getXEffectIdentityHandler']);
              if (!ccOption.storedStateKeys) ccOption.storedStateKeys = []; // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing

              if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

              if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
              if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
              var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook,
                  storedStateKeys = ccOption.storedStateKeys;

              var _computeCcUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey),
                  newCcKey = _computeCcUniqueKey.ccKey,
                  ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                  isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

              var ccClassContext = ccClassKey_ccClassContext_$1[ccClassKey];
              setRef(_assertThisInitialized(_this), isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);

              _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys); // bind propState to $$propState


              _this.$$propState = ccClassContext.propState || {};

              _this.__$$recoverState(ccClassKey);
            } catch (err) {
              catchCcError(err);
            }

            return _this;
          } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


          var _proto = CcClass.prototype;

          _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            return this.state !== nextState;
          };

          _proto.__$$recoverState = function __$$recoverState() {
            var _this$cc$ccState = this.cc.ccState,
                currentModule = _this$cc$ccState.module,
                globalStateKeys = _this$cc$ccState.globalStateKeys,
                sharedStateKeys = _this$cc$ccState.sharedStateKeys,
                ccOption = _this$cc$ccState.ccOption,
                ccUniqueKey = _this$cc$ccState.ccUniqueKey;
            var refState = refStore._state[ccUniqueKey] || {};
            var sharedState = _state[currentModule];
            var globalState = _state[MODULE_GLOBAL];
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
            computeValueForRef(this.$$computed, this.$$refComputed, entireState);
          };

          _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys) {
            var _this2 = this,
                _this$cc;

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

            this.cc = (_this$cc = {
              ccState: ccState,
              ccClassKey: ccClassKey,
              originalCcKey: originalCcKey,
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              beforeSetState: this.$$beforeSetState,
              beforeBroadcastState: this.$$beforeBroadcastState,
              afterSetState: this.$$afterSetState,
              reactSetState: function reactSetState(state, cb) {
                ccState.renderCount += 1;
                reactSetStateRef(state, cb);
              },
              reactForceUpdate: function reactForceUpdate(state, cb) {
                ccState.renderCount += 1;
                reactForceUpdateRef(state, cb);
              },
              setState: function setState(state, cb, lazyMs) {
                if (lazyMs === void 0) {
                  lazyMs = -1;
                }

                _this2.$$changeState(state, {
                  ccKey: ccKey,
                  module: currentModule,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  cb: cb,
                  calledBy: SET_STATE,
                  lazyMs: lazyMs
                });
              },
              forceSyncState: function forceSyncState(state, cb, lazyMs) {
                if (lazyMs === void 0) {
                  lazyMs = -1;
                }

                _this2.$$changeState(state, {
                  forceSync: true,
                  ccKey: ccKey,
                  module: currentModule,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  cb: cb,
                  calledBy: SET_STATE,
                  lazyMs: lazyMs
                });
              },
              setGlobalState: function setGlobalState(partialGlobalState, lazyMs, broadcastTriggeredBy) {
                if (lazyMs === void 0) {
                  lazyMs = -1;
                }

                if (broadcastTriggeredBy === void 0) {
                  broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
                }

                _this2.$$changeState(partialGlobalState, {
                  ccKey: ccKey,
                  module: MODULE_GLOBAL,
                  broadcastTriggeredBy: broadcastTriggeredBy,
                  calledBy: SET_GLOBAL_STATE,
                  lazyMs: lazyMs
                });
              },
              forceUpdate: function forceUpdate(cb, lazyMs) {
                _this2.$$changeState(_this2.state, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  cb: cb,
                  calledBy: FORCE_UPDATE,
                  lazyMs: lazyMs
                });
              },
              effect: function effect(targetModule, userLogicFn) {
                var _this2$cc;

                for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                  args[_key4 - 2] = arguments[_key4];
                }

                return (_this2$cc = _this2.cc).__effect.apply(_this2$cc, [targetModule, userLogicFn, {
                  ccKey: ccKey
                }, -1].concat(args));
              },
              lazyEffect: function lazyEffect(targetModule, userLogicFn, lazyMs) {
                var _this2$cc2;

                for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
                  args[_key5 - 3] = arguments[_key5];
                }

                return (_this2$cc2 = _this2.cc).__effect.apply(_this2$cc2, [targetModule, userLogicFn, {
                  ccKey: ccKey
                }, lazyMs].concat(args));
              },
              // change other module's state, mostly you should use this method to generate new state instead of xeffect,
              // because xeffect will force your logicFn to put your first param as ExecutionContext
              __effect: function __effect(targetModule, userLogicFn, extra, lazyMs) {
                var _this2$cc3;

                var ccKey = extra.ccKey,
                    identity = extra.identity;

                for (var _len6 = arguments.length, args = new Array(_len6 > 4 ? _len6 - 4 : 0), _key6 = 4; _key6 < _len6; _key6++) {
                  args[_key6 - 4] = arguments[_key6];
                }

                return (_this2$cc3 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc3, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  context: false,
                  module: targetModule,
                  calledBy: EFFECT,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs,
                  identity: identity
                }].concat(args));
              },
              // change other module's state, cc will give userLogicFn EffectContext object as first param
              xeffect: function xeffect(targetModule, userLogicFn) {
                var _this2$cc4;

                for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                  args[_key7 - 2] = arguments[_key7];
                }

                (_this2$cc4 = _this2.cc).__xeffect.apply(_this2$cc4, [targetModule, userLogicFn, {
                  ccKey: ccKey
                }, -1].concat(args));
              },
              lazyXeffect: function lazyXeffect(targetModule, userLogicFn, lazyMs) {
                var _this2$cc5;

                for (var _len8 = arguments.length, args = new Array(_len8 > 3 ? _len8 - 3 : 0), _key8 = 3; _key8 < _len8; _key8++) {
                  args[_key8 - 3] = arguments[_key8];
                }

                (_this2$cc5 = _this2.cc).__xeffect.apply(_this2$cc5, [targetModule, userLogicFn, {
                  ccKey: ccKey
                }, lazyMs].concat(args));
              },
              // change other module's state, cc will give userLogicFn EffectContext object as first param
              __xeffect: function __xeffect(targetModule, userLogicFn, extra, lazyMs) {
                var ccKey = extra.ccKey;
                var thisCC = _this2.cc;

                for (var _len9 = arguments.length, args = new Array(_len9 > 4 ? _len9 - 4 : 0), _key9 = 4; _key9 < _len9; _key9++) {
                  args[_key9 - 4] = arguments[_key9];
                }

                return thisCC.__promisifiedInvokeWith.apply(thisCC, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  lazyMs: lazyMs,
                  context: true,
                  module: targetModule,
                  calledBy: XEFFECT,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext) {
                for (var _len10 = arguments.length, args = new Array(_len10 > 2 ? _len10 - 2 : 0), _key10 = 2; _key10 < _len10; _key10++) {
                  args[_key10 - 2] = arguments[_key10];
                }

                return _promisifyCcFn.apply(void 0, [_this2.cc.__invokeWith, userLogicFn, executionContext].concat(args));
              },
              // always change self module's state
              invoke: function invoke(userLogicFn) {
                var _this2$cc6;

                for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
                  args[_key11 - 1] = arguments[_key11];
                }

                return (_this2$cc6 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc6, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: INVOKE,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              xinvoke: function xinvoke(userLogicFn) {
                var _this2$cc7;

                for (var _len12 = arguments.length, args = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
                  args[_key12 - 1] = arguments[_key12];
                }

                return (_this2$cc7 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc7, [userLogicFn, {
                  context: true,
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: INVOKE,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              // advanced invoke, can change other module state, but user should put module to option
              // and user can decide userLogicFn's first param is ExecutionContext if set context as true
              invokeWith: function invokeWith(userLogicFn, option) {
                var _this2$cc8;

                var _option$module = option.module,
                    module = _option$module === void 0 ? currentModule : _option$module,
                    _option$context = option.context,
                    context = _option$context === void 0 ? false : _option$context,
                    _option$forceSync = option.forceSync,
                    forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                    cb = option.cb,
                    lazyMs = option.lazyMs;

                for (var _len13 = arguments.length, args = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
                  args[_key13 - 2] = arguments[_key13];
                }

                return (_this2$cc8 = _this2.cc).__promisifiedInvokeWith.apply(_this2$cc8, [userLogicFn, {
                  ccKey: ccKey,
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  context: context,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: INVOKE_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __invokeWith: function __invokeWith(userLogicFn, executionContext) {
                for (var _len14 = arguments.length, args = new Array(_len14 > 2 ? _len14 - 2 : 0), _key14 = 2; _key14 < _len14; _key14++) {
                  args[_key14 - 2] = arguments[_key14];
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
                    _executionContext$laz = executionContext.lazyMs,
                    lazyMs = _executionContext$laz === void 0 ? -1 : _executionContext$laz,
                    identity = executionContext.identity;
                isStateModuleValid(targetModule, currentModule, cb, function (err, newCb) {
                  if (err) return handleCcFnError(err, __innerCb);

                  if (context) {
                    var executionContextForUser = Object.assign(executionContext, {
                      effectIdentity: _this2.__$$getEffectIdentityHandler(ccKey),
                      xeffectIdentity: _this2.__$$getXEffectIdentityHandler(ccKey),
                      effect: _this2.__$$getEffectHandler(ccKey),
                      lazyEffect: _this2.__$$getLazyEffectHandler(ccKey),
                      xeffect: _this2.__$$getXEffectHandler(ccKey),
                      lazyXeffect: _this2.__$$getLazyXEffectHandler(ccKey),
                      moduleState: getState(targetModule),
                      state: _this2.state,
                      entireState: getState(),
                      globalState: getState(MODULE_GLOBAL),
                      dispatch: _this2.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, lazyMs, ccKey),
                      dispatchIdentity: _this2.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, lazyMs, ccKey, identity)
                    });
                    args.unshift(executionContextForUser);
                  }

                  var _partialState = null;
                  co_1.wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                    _partialState = partialState;

                    _this2.$$changeState(partialState, {
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
                      lazyMs: lazyMs
                    });
                  }).then(function () {
                    if (__innerCb) __innerCb(null, _partialState);
                  })["catch"](function (err) {
                    handleCcFnError(err, __innerCb);
                  });
                });
              },
              call: function call(userLogicFn) {
                var _this2$cc9;

                for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
                  args[_key15 - 1] = arguments[_key15];
                }

                return (_this2$cc9 = _this2.cc).__promisifiedCallWith.apply(_this2$cc9, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: CALL,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              callWith: function callWith(userLogicFn, _temp2) {
                var _this2$cc10;

                var _ref5 = _temp2 === void 0 ? {} : _temp2,
                    _ref5$module = _ref5.module,
                    module = _ref5$module === void 0 ? currentModule : _ref5$module,
                    _ref5$forceSync = _ref5.forceSync,
                    forceSync = _ref5$forceSync === void 0 ? false : _ref5$forceSync,
                    cb = _ref5.cb,
                    _ref5$lazyMs = _ref5.lazyMs,
                    lazyMs = _ref5$lazyMs === void 0 ? -1 : _ref5$lazyMs;

                for (var _len16 = arguments.length, args = new Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
                  args[_key16 - 2] = arguments[_key16];
                }

                return (_this2$cc10 = _this2.cc).__promisifiedCallWith.apply(_this2$cc10, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: CALL_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __promisifiedCallWith: function __promisifiedCallWith(userLogicFn, executionContext) {
                for (var _len17 = arguments.length, args = new Array(_len17 > 2 ? _len17 - 2 : 0), _key17 = 2; _key17 < _len17; _key17++) {
                  args[_key17 - 2] = arguments[_key17];
                }

                return _promisifyCcFn.apply(void 0, [_this2.cc.__callWith, userLogicFn, executionContext].concat(args));
              },
              __callWith: function __callWith(userLogicFn, _temp3) {
                var _ref6 = _temp3 === void 0 ? {} : _temp3,
                    stateFor = _ref6.stateFor,
                    _ref6$module = _ref6.module,
                    module = _ref6$module === void 0 ? currentModule : _ref6$module,
                    _ref6$forceSync = _ref6.forceSync,
                    forceSync = _ref6$forceSync === void 0 ? false : _ref6$forceSync,
                    cb = _ref6.cb,
                    __innerCb = _ref6.__innerCb;

                for (var _len18 = arguments.length, args = new Array(_len18 > 2 ? _len18 - 2 : 0), _key18 = 2; _key18 < _len18; _key18++) {
                  args[_key18 - 2] = arguments[_key18];
                }

                isStateModuleValid(module, currentModule, cb, function (err, newCb) {
                  if (err) return handleCcFnError(err, __innerCb);

                  try {
                    userLogicFn.call.apply(userLogicFn, [_this2, _this2.__$$getChangeStateHandler({
                      stateFor: stateFor,
                      module: module,
                      forceSync: forceSync,
                      cb: newCb
                    })].concat(args));
                  } catch (err) {
                    handleCcFnError(err, __innerCb);
                  }
                });
              },
              callThunk: function callThunk(userLogicFn) {
                var _this2$cc11;

                for (var _len19 = arguments.length, args = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
                  args[_key19 - 1] = arguments[_key19];
                }

                (_this2$cc11 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc11, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: CALL_THUNK,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              callThunkWith: function callThunkWith(userLogicFn, _temp4) {
                var _this2$cc12;

                var _ref7 = _temp4 === void 0 ? {} : _temp4,
                    _ref7$module = _ref7.module,
                    module = _ref7$module === void 0 ? currentModule : _ref7$module,
                    _ref7$forceSync = _ref7.forceSync,
                    forceSync = _ref7$forceSync === void 0 ? false : _ref7$forceSync,
                    cb = _ref7.cb,
                    _ref7$lazyMs = _ref7.lazyMs,
                    lazyMs = _ref7$lazyMs === void 0 ? -1 : _ref7$lazyMs;

                for (var _len20 = arguments.length, args = new Array(_len20 > 2 ? _len20 - 2 : 0), _key20 = 2; _key20 < _len20; _key20++) {
                  args[_key20 - 2] = arguments[_key20];
                }

                (_this2$cc12 = _this2.cc).__promisifiedCallThunkWith.apply(_this2$cc12, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: CALL_THUNK_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              },
              __promisifiedCallThunkWith: function __promisifiedCallThunkWith(userLogicFn, executionContext) {
                for (var _len21 = arguments.length, args = new Array(_len21 > 2 ? _len21 - 2 : 0), _key21 = 2; _key21 < _len21; _key21++) {
                  args[_key21 - 2] = arguments[_key21];
                }

                return _promisifyCcFn.apply(void 0, [_this2.cc.__callThunkWith, userLogicFn, executionContext].concat(args));
              },
              __callThunkWith: function __callThunkWith(userLogicFn, _temp5) {
                var _ref8 = _temp5 === void 0 ? {} : _temp5,
                    stateFor = _ref8.stateFor,
                    _ref8$module = _ref8.module,
                    module = _ref8$module === void 0 ? currentModule : _ref8$module,
                    _ref8$forceSync = _ref8.forceSync,
                    forceSync = _ref8$forceSync === void 0 ? false : _ref8$forceSync,
                    cb = _ref8.cb,
                    __innerCb = _ref8.__innerCb;

                for (var _len22 = arguments.length, args = new Array(_len22 > 2 ? _len22 - 2 : 0), _key22 = 2; _key22 < _len22; _key22++) {
                  args[_key22 - 2] = arguments[_key22];
                }

                isStateModuleValid(module, currentModule, cb, function (err, newCb) {
                  if (err) return handleCcFnError(err, __innerCb);

                  try {
                    userLogicFn.call.apply(userLogicFn, [_this2].concat(args))(_this2.__$$getChangeStateHandler({
                      stateFor: stateFor,
                      module: module,
                      forceSync: forceSync,
                      cb: newCb
                    }));
                  } catch (err) {
                    handleCcFnError(err, __innerCb);
                  }
                });
              },
              commit: function commit(userLogicFn) {
                var _this2$cc13;

                for (var _len23 = arguments.length, args = new Array(_len23 > 1 ? _len23 - 1 : 0), _key23 = 1; _key23 < _len23; _key23++) {
                  args[_key23 - 1] = arguments[_key23];
                }

                (_this2$cc13 = _this2.cc).__commitWith.apply(_this2$cc13, [userLogicFn, {
                  stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                  module: currentModule,
                  calledBy: COMMIT,
                  fnName: userLogicFn.name
                }].concat(args));
              },
              commitWith: function commitWith(userLogicFn, _temp6) {
                var _this2$cc14;

                var _ref9 = _temp6 === void 0 ? {} : _temp6,
                    _ref9$module = _ref9.module,
                    module = _ref9$module === void 0 ? currentModule : _ref9$module,
                    _ref9$forceSync = _ref9.forceSync,
                    forceSync = _ref9$forceSync === void 0 ? false : _ref9$forceSync,
                    cb = _ref9.cb,
                    lazyMs = _ref9.lazyMs;

                for (var _len24 = arguments.length, args = new Array(_len24 > 2 ? _len24 - 2 : 0), _key24 = 2; _key24 < _len24; _key24++) {
                  args[_key24 - 2] = arguments[_key24];
                }

                (_this2$cc14 = _this2.cc).__commitWith.apply(_this2$cc14, [userLogicFn, {
                  stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
                  module: module,
                  forceSync: forceSync,
                  cb: cb,
                  calledBy: COMMIT_WITH,
                  fnName: userLogicFn.name,
                  lazyMs: lazyMs
                }].concat(args));
              }
            }, _this$cc["__promisifiedCallWith"] = function __promisifiedCallWith(userLogicFn, executionContext) {
              for (var _len25 = arguments.length, args = new Array(_len25 > 2 ? _len25 - 2 : 0), _key25 = 2; _key25 < _len25; _key25++) {
                args[_key25 - 2] = arguments[_key25];
              }

              return _promisifyCcFn.apply(void 0, [_this2.cc.__commitWith, userLogicFn, executionContext].concat(args));
            }, _this$cc.__commitWith = function __commitWith(userLogicFn, _temp7) {
              var _ref10 = _temp7 === void 0 ? {} : _temp7,
                  stateFor = _ref10.stateFor,
                  _ref10$module = _ref10.module,
                  module = _ref10$module === void 0 ? currentModule : _ref10$module,
                  _ref10$forceSync = _ref10.forceSync,
                  forceSync = _ref10$forceSync === void 0 ? false : _ref10$forceSync,
                  cb = _ref10.cb,
                  __innerCb = _ref10.__innerCb;

              for (var _len26 = arguments.length, args = new Array(_len26 > 2 ? _len26 - 2 : 0), _key26 = 2; _key26 < _len26; _key26++) {
                args[_key26 - 2] = arguments[_key26];
              }

              isStateModuleValid(module, currentModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);

                try {
                  var state = userLogicFn.call.apply(userLogicFn, [_this2].concat(args));

                  _this2.$$changeState(state, {
                    stateFor: stateFor,
                    module: module,
                    forceSync: forceSync,
                    cb: newCb
                  });
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            }, _this$cc.dispatch = function dispatch(_temp8) {
              var _ref11 = _temp8 === void 0 ? {} : _temp8,
                  ccKey = _ref11.ccKey,
                  stateFor = _ref11.stateFor,
                  inputModule = _ref11.module,
                  inputReducerModule = _ref11.reducerModule,
                  identity = _ref11.identity,
                  _ref11$forceSync = _ref11.forceSync,
                  forceSync = _ref11$forceSync === void 0 ? false : _ref11$forceSync,
                  type = _ref11.type,
                  payload = _ref11.payload,
                  reactCallback = _ref11.cb,
                  __innerCb = _ref11.__innerCb,
                  _ref11$lazyMs = _ref11.lazyMs,
                  lazyMs = _ref11$lazyMs === void 0 ? -1 : _ref11$lazyMs;

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
                  lazyMs: lazyMs,
                  identity: identity
                };

                _this2.cc.__invokeWith(reducerFn, executionContext);
              });
            }, _this$cc.prepareReactSetState = function prepareReactSetState(identity, changedBy, state, stateFor, next, reactCallback) {
              if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (next) next();
                return;
              }

              if (identity) {
                //if user specify identity
                if (_this2.cc.ccKey !== identity) {
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
                    var _extractStateByKeys6 = extractStateByKeys(_this2.state, storedStateKeys),
                        entireStoredState = _extractStateByKeys6.partialState;

                    var currentStoredState = Object.assign({}, entireStoredState, partialState);
                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }

                  refStore.setState(ccUniqueKey, partialState);
                }
              }

              if (!util.isObjectNotNull(state)) {
                if (next) next();
                return;
              } else {
                computeValueForRef(_this2.$$computed, _this2.$$refComputed, state);
                watchValueForRef(_this2.$$watch, _this2.state, state);
              }

              if (_this2.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  _this2.$$beforeSetState({
                    changedBy: changedBy
                  });

                  _this2.cc.reactSetState(state, reactCallback);

                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this2.$$beforeSetState({
                    changedBy: changedBy
                  }, function () {
                    _this2.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                }
              } else {
                _this2.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            }, _this$cc.prepareBroadcastGlobalState = function prepareBroadcastGlobalState(identity, broadcastTriggeredBy, globalState, lazyMs) {
              var _getAndStoreValidGlob = getAndStoreValidGlobalState(globalState),
                  validGlobalState = _getAndStoreValidGlob.partialState,
                  isStateEmpty = _getAndStoreValidGlob.isStateEmpty;

              var startBroadcastGlobalState = function startBroadcastGlobalState() {
                if (!isStateEmpty) {
                  if (_this2.$$beforeBroadcastState) {
                    //check if user define a life cycle hook $$beforeBroadcastState
                    if (asyncLifecycleHook) {
                      _this2.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      });

                      _this2.cc.broadcastGlobalState(identity, validGlobalState);
                    } else {
                      _this2.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      }, function () {
                        _this2.cc.broadcastGlobalState(identity, validGlobalState);
                      });
                    }
                  } else {
                    _this2.cc.broadcastGlobalState(identity, validGlobalState);
                  }
                }
              };

              if (lazyMs > 0) {
                var feature = util.computeFeature(ccUniqueKey, globalState);
                runLater(startBroadcastGlobalState, feature, lazyMs);
              } else {
                startBroadcastGlobalState();
              }
            }, _this$cc.prepareBroadcastState = function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, lazyMs, identity) {
              var targetSharedStateKeys, targetGlobalStateKeys;

              try {
                var result = getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, globalStateKeys, sharedStateKeys);
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
                  module_globalState_ = _extractStateToBeBroa.module_globalState_;

              if (!isPartialSharedStateEmpty) ccStoreSetState$1(moduleName, partialSharedState);
              if (!isPartialGlobalStateEmpty) ccStoreSetState$1(MODULE_GLOBAL, partialGlobalState);

              var startBroadcastState = function startBroadcastState() {
                if (_this2.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    }, function () {
                      _this2.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                    });
                  } else {
                    _this2.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    });

                    _this2.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                  }
                } else {
                  _this2.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                }
              };

              if (lazyMs > 0) {
                var feature = util.computeFeature(ccUniqueKey, committedState);
                runLater(startBroadcastState, feature, lazyMs);
              } else {
                startBroadcastState();
              }
            }, _this$cc.broadcastState = function broadcastState(skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity) {
              if (skipBroadcastRefState === false) {
                var _partialSharedState = partialSharedState;
                if (needClone) _partialSharedState = util.clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

                var currentCcKey = _this2.cc.ccState.ccUniqueKey;
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
                      var ref = ccKey_ref_$1[ccKey];

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
                        var ref = ccKey_ref_$1[ccKey];

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
              }

              broadcastPropState(moduleName, originalState);
            }, _this$cc.broadcastGlobalState = function broadcastGlobalState(identity, globalSate) {
              globalCcClassKeys.forEach(function (ccClassKey) {
                var classContext = ccClassKey_ccClassContext_$1[ccClassKey];
                var globalStateKeys = classContext.globalStateKeys,
                    ccKeys = classContext.ccKeys;

                var _extractStateByKeys10 = extractStateByKeys(globalSate, globalStateKeys),
                    partialState = _extractStateByKeys10.partialState,
                    isStateEmpty = _extractStateByKeys10.isStateEmpty;

                if (!isStateEmpty) {
                  ccKeys.forEach(function (ccKey) {
                    var ref = ccKey_ref_$1[ccKey];

                    if (ref) {
                      var option = ccKey_option_$1[ccKey];

                      if (option.syncGlobalState === true) {
                        ref.cc.prepareReactSetState(identity, CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                      }
                    }
                  });
                }
              });
              broadcastPropState(MODULE_GLOBAL, globalSate);
            }, _this$cc.emit = function emit(event) {
              for (var _len27 = arguments.length, args = new Array(_len27 > 1 ? _len27 - 1 : 0), _key27 = 1; _key27 < _len27; _key27++) {
                args[_key27 - 1] = arguments[_key27];
              }

              findEventHandlersToPerform.apply(void 0, [event, {
                identity: null
              }].concat(args));
            }, _this$cc.emitIdentity = function emitIdentity(event, identity) {
              for (var _len28 = arguments.length, args = new Array(_len28 > 2 ? _len28 - 2 : 0), _key28 = 2; _key28 < _len28; _key28++) {
                args[_key28 - 2] = arguments[_key28];
              }

              findEventHandlersToPerform.apply(void 0, [event, {
                identity: identity
              }].concat(args));
            }, _this$cc.emitWith = function emitWith(event, option) {
              for (var _len29 = arguments.length, args = new Array(_len29 > 2 ? _len29 - 2 : 0), _key29 = 2; _key29 < _len29; _key29++) {
                args[_key29 - 2] = arguments[_key29];
              }

              findEventHandlersToPerform.apply(void 0, [event, option].concat(args));
            }, _this$cc.on = function on(event, handler) {
              bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler);
            }, _this$cc.onIdentity = function onIdentity(event, identity, handler) {
              bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler);
            }, _this$cc.off = function off(event, _temp9) {
              var _ref12 = _temp9 === void 0 ? {} : _temp9,
                  module = _ref12.module,
                  ccClassKey = _ref12.ccClassKey,
                  identity = _ref12.identity;

              //  consider if module === currentModule, let off happened?
              findEventHandlersToOff(event, {
                module: module,
                ccClassKey: ccClassKey,
                identity: identity
              });
            }, _this$cc);
            var thisCC = this.cc; // let CcComponent instance can call dispatch directly
            // if you call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY

            var d = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey);

            var di = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey, ccKey); //ccKey is identity by default


            this.$$d = d;
            this.$$di = di;
            this.$$dispatch = d;
            this.$$dispatchIdentity = di;
            this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1, ccKey);
            this.$$invoke = thisCC.invoke; // commit state to cc directly, but userFn can be promise or generator both!

            this.$$xinvoke = thisCC.xinvoke; // commit state to cc directly, but userFn can be promise or generator both!

            this.$$invokeWith = thisCC.invokeWith;
            this.$$call = thisCC.call; // commit state by setState handler

            this.$$callWith = thisCC.callWith;
            this.$$callThunk = thisCC.callThunk; // commit state by setState handler

            this.$$callThunkWith = thisCC.callThunkWith;
            this.$$commit = thisCC.commit; // commit state to cc directly, userFn can only be normal function

            this.$$commitWith = thisCC.commitWith;
            this.$$effect = thisCC.effect; // commit state to cc directly, userFn can be normal 、 generator or async function

            this.$$lazyEffect = thisCC.lazyEffect; // commit state to cc directly, userFn can be normal 、 generator or async function

            this.$$xeffect = thisCC.xeffect;
            this.$$lazyXeffect = thisCC.lazyXeffect;
            this.$$emit = thisCC.emit;
            this.$$emitIdentity = thisCC.emitIdentity;
            this.$$emitWith = thisCC.emitWith;
            this.$$on = thisCC.on;
            this.$$onIdentity = thisCC.onIdentity;
            this.$$off = thisCC.off;
            this.$$refComputed = {};
            this.$$moduleComputed = _computedValue[currentModule] || {};
            this.$$globalComputed = _computedValue[MODULE_GLOBAL] || {};
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

          _proto.$$changeState = function $$changeState(state, _temp10) {
            var _this3 = this;

            var _ref13 = _temp10 === void 0 ? {} : _temp10,
                ccKey = _ref13.ccKey,
                _ref13$stateFor = _ref13.stateFor,
                stateFor = _ref13$stateFor === void 0 ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref13$stateFor,
                module = _ref13.module,
                broadcastTriggeredBy = _ref13.broadcastTriggeredBy,
                changedBy = _ref13.changedBy,
                forceSync = _ref13.forceSync,
                reactCallback = _ref13.cb,
                type = _ref13.type,
                reducerModule = _ref13.reducerModule,
                calledBy = _ref13.calledBy,
                fnName = _ref13.fnName,
                _ref13$lazyMs = _ref13.lazyMs,
                lazyMs = _ref13$lazyMs === void 0 ? -1 : _ref13$lazyMs,
                identity = _ref13.identity;

            //executionContext
            if (state == undefined) return; //do nothing

            if (!isPlainJsonObject(state)) {
              justWarning$1("cc found your commit state is not a plain json object!");
            }

            var _doChangeState = function _doChangeState() {
              if (module == MODULE_GLOBAL) {
                _this3.cc.prepareBroadcastGlobalState(identity, broadcastTriggeredBy, state, lazyMs);
              } else {
                var ccState = _this3.cc.ccState;
                var currentModule = ccState.module;
                var btb = broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;

                if (module === currentModule) {
                  // who trigger $$changeState, who will change the whole received state 
                  _this3.cc.prepareReactSetState(identity, changedBy || CHANGE_BY_SELF, state, stateFor, function () {
                    //if forceSync=true, cc clone the input state
                    if (forceSync === true) {
                      _this3.cc.prepareBroadcastState(stateFor, btb, module, state, true, lazyMs, identity);
                    } else if (ccState.ccOption.syncSharedState) {
                      _this3.cc.prepareBroadcastState(stateFor, btb, module, state, false, lazyMs, identity);
                    }
                  }, reactCallback);
                } else {
                  if (forceSync) justWarning$1("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi$3("module:" + module + " currentModule" + currentModule));
                  if (reactCallback) justWarning$1("callback for react.setState will be ignore");

                  _this3.cc.prepareBroadcastState(stateFor, btb, module, state, true, lazyMs, identity);
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
          } //{ module, forceSync, cb }
          ;

          _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
            var _this4 = this;

            return function (state) {
              return _this4.$$changeState(state, executionContext);
            };
          };

          _proto.__$$getEffectHandler = function __$$getEffectHandler(ccKey) {
            var _this5 = this;

            return function (targetModule, userLogicFn) {
              var _this5$cc;

              for (var _len30 = arguments.length, args = new Array(_len30 > 2 ? _len30 - 2 : 0), _key30 = 2; _key30 < _len30; _key30++) {
                args[_key30 - 2] = arguments[_key30];
              }

              return (_this5$cc = _this5.cc).__effect.apply(_this5$cc, [targetModule, userLogicFn, {
                ccKey: ccKey
              }, -1].concat(args));
            };
          };

          _proto.__$$getEffectIdentityHandler = function __$$getEffectIdentityHandler(ccKey) {
            var _this6 = this;

            return function (targetModule, identity, userLogicFn) {
              var _this6$cc;

              for (var _len31 = arguments.length, args = new Array(_len31 > 3 ? _len31 - 3 : 0), _key31 = 3; _key31 < _len31; _key31++) {
                args[_key31 - 3] = arguments[_key31];
              }

              return (_this6$cc = _this6.cc).__effect.apply(_this6$cc, [targetModule, userLogicFn, {
                ccKey: ccKey,
                identity: identity
              }, -1].concat(args));
            };
          };

          _proto.__$$getLazyEffectHandler = function __$$getLazyEffectHandler(ccKey) {
            var _this7 = this;

            return function (targetModule, userLogicFn, lazyMs) {
              var _this7$cc;

              for (var _len32 = arguments.length, args = new Array(_len32 > 3 ? _len32 - 3 : 0), _key32 = 3; _key32 < _len32; _key32++) {
                args[_key32 - 3] = arguments[_key32];
              }

              return (_this7$cc = _this7.cc).__effect.apply(_this7$cc, [targetModule, userLogicFn, {
                ccKey: ccKey
              }, lazyMs].concat(args));
            };
          };

          _proto.__$$getXEffectHandler = function __$$getXEffectHandler(ccKey) {
            var _this8 = this;

            return function (targetModule, userLogicFn) {
              var _this8$cc;

              for (var _len33 = arguments.length, args = new Array(_len33 > 2 ? _len33 - 2 : 0), _key33 = 2; _key33 < _len33; _key33++) {
                args[_key33 - 2] = arguments[_key33];
              }

              return (_this8$cc = _this8.cc).__xeffect.apply(_this8$cc, [targetModule, userLogicFn, {
                ccKey: ccKey
              }, -1].concat(args));
            };
          };

          _proto.__$$getXEffectIdentityHandler = function __$$getXEffectIdentityHandler(ccKey) {
            var _this9 = this;

            return function (targetModule, identity, userLogicFn) {
              var _this9$cc;

              for (var _len34 = arguments.length, args = new Array(_len34 > 3 ? _len34 - 3 : 0), _key34 = 3; _key34 < _len34; _key34++) {
                args[_key34 - 3] = arguments[_key34];
              }

              return (_this9$cc = _this9.cc).__xeffect.apply(_this9$cc, [targetModule, userLogicFn, {
                ccKey: ccKey,
                identity: identity
              }, -1].concat(args));
            };
          };

          _proto.__$$getLazyXEffectHandler = function __$$getLazyXEffectHandler(ccKey) {
            var _this10 = this;

            return function (targetModule, userLogicFn, lazyMs) {
              var _this10$cc;

              for (var _len35 = arguments.length, args = new Array(_len35 > 3 ? _len35 - 3 : 0), _key35 = 3; _key35 < _len35; _key35++) {
                args[_key35 - 3] = arguments[_key35];
              }

              return (_this10$cc = _this10.cc).__xeffect.apply(_this10$cc, [targetModule, userLogicFn, {
                ccKey: ccKey
              }, lazyMs].concat(args));
            };
          };

          _proto.__$$getDispatchHandler = function __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload, lazyMs, ccKey, defaultIdentity) {
            var _this11 = this;

            if (lazyMs === void 0) {
              lazyMs = -1;
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
                  _lazyMs = lazyMs;

              var _identity = defaultIdentity;

              if (paramObjType === 'object') {
                var _paramObj = paramObj,
                    _paramObj$module = _paramObj.module,
                    _module2 = _paramObj$module === void 0 ? originalComputedStateModule : _paramObj$module,
                    _reducerModule2 = _paramObj.reducerModule,
                    _paramObj$forceSync = _paramObj.forceSync,
                    forceSync = _paramObj$forceSync === void 0 ? false : _paramObj$forceSync,
                    _paramObj$type = _paramObj.type,
                    type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                    _paramObj$payload = _paramObj.payload,
                    payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                    cb = _paramObj.cb,
                    _paramObj$lazyMs = _paramObj.lazyMs,
                    _lazyMs2 = _paramObj$lazyMs === void 0 ? -1 : _paramObj$lazyMs,
                    identity = _paramObj.identity;

                _module = _module2;
                _reducerModule = _reducerModule2 || _module2;
                _forceSync = forceSync;
                _type = type;
                _payload = payload;
                _cb = cb;
                _lazyMs = _lazyMs2;
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
                      _module3 = _paramObj$split[0],
                      _type2 = _paramObj$split[1];

                  _module = _module3;
                  _reducerModule = _module;
                  _type = _type2;
                } else if (slashCount === 2) {
                  var _paramObj$split2 = paramObj.split('/'),
                      _module4 = _paramObj$split2[0],
                      _reducerModule3 = _paramObj$split2[1],
                      _type3 = _paramObj$split2[2];

                  if (_module4 === '' || _module4 === ' ') _module = originalComputedStateModule; //paramObj may like: /foo/changeName
                  else _module = _module4;
                  _module = _module4;
                  _reducerModule = _reducerModule3;
                  _type = _type3;
                } else {
                  return Promise.reject(me$3(ERR.CC_DISPATCH_STRING_INVALID, vbi$3(paramObj)));
                }
              } else {
                return Promise.reject(me$3(ERR.CC_DISPATCH_PARAM_INVALID));
              } // pick user input reducerModule firstly


              var targetReducerModule = _reducerModule || originalComputedReducerModule || module;
              return new Promise(function (resolve, reject) {
                _this11.cc.dispatch({
                  stateFor: stateFor,
                  module: _module,
                  reducerModule: targetReducerModule,
                  forceSync: _forceSync,
                  type: _type,
                  payload: _payload,
                  cb: _cb,
                  __innerCb: _promiseErrorHandler(resolve, reject),
                  lazyMs: _lazyMs,
                  ccKey: ccKey,
                  identity: _identity
                });
              })["catch"](catchCcError);
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

            handler();
          };

          _proto.$$sync = function $$sync(event) {
            var _this$$$changeState;

            var _module = this.cc.ccState.module,
                _lazyMs = -1,
                _identity = '';

            var currentTarget = event.currentTarget;
            var value = currentTarget.value,
                dataset = currentTarget.dataset;
            var ccm = dataset.ccm,
                ccdelay = dataset.ccdelay,
                _dataset$ccidt2 = dataset.ccidt,
                ccidt = _dataset$ccidt2 === void 0 ? '' : _dataset$ccidt2,
                ccint = dataset.ccint,
                stateKey = dataset.ccsync;

            if (!stateKey) {
              return justWarning$1("data-ccsync attr no found, you must define it while using this.$$sync");
            }

            if (ccm) _module = ccm;

            if (ccdelay) {
              try {
                _lazyMs = parseInt(ccdelay);
              } catch (err) {}
            }

            if (ccidt) _identity = ccidt;

            if (ccint !== undefined) {
              try {
                value = parseInt(value);
              } catch (err) {}
            }

            this.$$changeState((_this$$$changeState = {}, _this$$$changeState[stateKey] = value, _this$$$changeState), {
              ccKey: this.cc.ccKey,
              stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
              module: _module,
              lazyMs: _lazyMs,
              identity: _identity
            });
          };

          _proto.componentDidUpdate = function componentDidUpdate() {
            if (_TargetClass.prototype.componentDidUpdate) _TargetClass.prototype.componentDidUpdate.call(this);
            if (this.$$afterSetState) this.$$afterSetState();
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            var _this$cc$ccState2 = this.cc.ccState,
                ccUniqueKey = _this$cc$ccState2.ccUniqueKey,
                ccClassKey = _this$cc$ccState2.ccClassKey;
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

  var ccKey_ref_$2 = ccContext.ccKey_ref_;
  function getDispatcherRef () {
    var ref = ccKey_ref_$2[CC_DISPATCHER];

    if (!ref) {
      if (util.isHotReloadMode()) {
        util.justTip('in hot reload mode, CC_DISPATCHER initialized more than one time');
      } else {
        throw util.makeError(ERR.CC_NO_DISPATCHER_FOUND);
      }
    }

    return ref;
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

  var vbi$4 = verboseInfo;
  var ss$2 = styleStr;
  var cl$2 = color;

  function keysWarning(keyWord) {
    justWarning("now cc is startup with non module mode, cc only allow you define " + keyWord + " like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
  }

  function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
    if (!isPlainJsonObject(store)) {
      throw new Error("the store is not a plain json object!");
    }

    if (!isPlainJsonObject(sharedToGlobalMapping)) {
      throw new Error("the sharedToGlobalMapping is not a plain json object!");
    }

    ccContext.sharedToGlobalMapping = sharedToGlobalMapping;
    var globalStateKeys = ccContext.globalStateKeys;
    var pureGlobalStateKeys = ccContext.pureGlobalStateKeys;
    var _state = ccContext.store._state;
    var globalState = store[MODULE_GLOBAL];
    _state[MODULE_CC] = {};

    if (isModuleMode) {
      var moduleNames = Object.keys(store);

      if (globalState) {
        if (!util.isModuleStateValid(globalState)) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi$4("moduleName:" + MODULE_GLOBAL + "'s state is invalid!"));
        } else {
          console.log(ss$2('$$global module state found while startup cc!'), cl$2());
          Object.keys(globalState).forEach(function (key) {
            globalStateKeys.push(key);
          });
        }
      } else {
        console.log(ss$2('$$global module state not found, cc will generate one for user automatically!'), cl$2());
        globalState = {};
      }

      _state[MODULE_GLOBAL] = globalState;
      var len = moduleNames.length;
      var isDefaultModuleExist = false;

      for (var i = 0; i < len; i++) {
        var moduleName = moduleNames[i];

        if (moduleName !== MODULE_GLOBAL) {
          checkModuleName(moduleName);
          var moduleState = store[moduleName];
          checkModuleState(moduleState, moduleName);

          if (moduleName === MODULE_DEFAULT) {
            isDefaultModuleExist = true;
            console.log(ss$2('$$default module state found while startup cc!'), cl$2());
          }

          _state[moduleName] = moduleState;
          var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

          if (sharedKey_globalKey_) {
            handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
          }
        }
      }

      if (!isDefaultModuleExist) {
        _state[MODULE_DEFAULT] = {};
        console.log(ss$2('$$default module state not found,cc will generate one for user automatically!'), cl$2());
      }
    } else {
      // non module mode
      if (sharedToGlobalMapping && util.isObjectNotNull(sharedToGlobalMapping)) {
        throw util.makeError(ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
      }

      var includeDefaultModule = store.hasOwnProperty(MODULE_DEFAULT);
      var includeGlobalModule = store.hasOwnProperty(MODULE_GLOBAL);
      var invalidKeyCount = 0;

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          if (!util.isModuleStateValid(store[MODULE_DEFAULT])) {
            throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi$4(" moduleName:" + MODULE_DEFAULT + "'s state is invalid!"));
          }

          _state[MODULE_DEFAULT] = store[MODULE_DEFAULT];
          invalidKeyCount += 1;
          console.log(ss$2('$$default module state found while startup cc with non module mode!'), cl$2());
        } else {
          _state[MODULE_DEFAULT] = {};
        }

        if (includeGlobalModule) {
          if (!util.isModuleStateValid(store[MODULE_GLOBAL])) {
            throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi$4(" moduleName:" + MODULE_GLOBAL + "'s state is invalid!"));
          }

          globalState = store[MODULE_GLOBAL];
          Object.keys(globalState).forEach(function (key) {
            return globalStateKeys.push(key);
          });
          invalidKeyCount += 1;
          console.log(ss$2('$$global module state found while startup cc with non module mode!'), cl$2());
          _state[MODULE_GLOBAL] = globalState;
        } else {
          _state[MODULE_GLOBAL] = {};
        }

        if (Object.keys(store).length > invalidKeyCount) {
          keysWarning('store');
        }
      } else {
        // treat store as $$default module store
        if (!util.isModuleStateValid(store)) {
          throw util.makeError(ERR.CC_STORE_STATE_INVALID, vbi$4(" moduleName:" + MODULE_DEFAULT + "'s state  is invalid!"));
        }

        _state[MODULE_DEFAULT] = store;
      }
    }

    var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
    globalStateKeys.reduce(function (pKeys, gKey) {
      if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
      return pKeys;
    }, pureGlobalStateKeys);
  }
  /**
   * @description
   * @author zzk
   * @param {*} reducer may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
   */


  function bindReducerToCcContext(reducer) {
    var _reducer = ccContext.reducer._reducer;
    var moduleNames = Object.keys(reducer);
    var len = moduleNames.length;
    var isDefaultReducerExist = false,
        isGlobalReducerExist = false;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      checkModuleName(moduleName, true);
      _reducer[moduleName] = reducer[moduleName];
      if (moduleName === MODULE_DEFAULT) isDefaultReducerExist = true;
      if (moduleName === MODULE_GLOBAL) isGlobalReducerExist = true;
    }

    if (!isDefaultReducerExist) _reducer[MODULE_DEFAULT] = {};
    if (!isGlobalReducerExist) _reducer[MODULE_GLOBAL] = {};
  }

  function bindComputedToCcContext(computed, isModuleMode) {
    if (!isPlainJsonObject(computed)) {
      throw new Error("the computed value of StartUpOption is not a plain json object!");
    }

    function mapComputed(m, moduleComputed) {
      var moduleState = _state[m];

      if (!moduleState) {
        throw util.makeError(ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION, vbi$4(" moduleName in computed: " + m));
      }

      if (!isPlainJsonObject(moduleComputed)) {
        throw new Error("the value of one key of the computed object is not a plain json object!");
      }

      var stateKeys = Object.keys(moduleComputed);
      stateKeys.forEach(function (key) {
        var originalValue = moduleState[key];

        if (originalValue !== undefined) {
          var moduleComputedFn = util.safeGetObjectFromObject(_computedFn, m);
          var fn = moduleComputed[key];
          moduleComputedFn[key] = fn;
          var computedValue = fn(originalValue, moduleState);
          var moduleComputedValue = util.safeGetObjectFromObject(_computedValue, m);
          moduleComputedValue[key] = computedValue;
        } else {
          //strict?
          justWarning("key:" + key + " of module:" + m + " of computed object is not declared in module:" + m + " of store!");
        }
      });
    }

    var _ccContext$computed = ccContext.computed,
        _computedFn = _ccContext$computed._computedFn,
        _computedValue = _ccContext$computed._computedValue;
    var _state = ccContext.store._state;

    if (isModuleMode) {
      var moduleNames = Object.keys(computed);
      moduleNames.forEach(function (m) {
        mapComputed(m, computed[m]);
      });
    } else {
      mapToCcContextForNonModule(computed, mapComputed, 'computed');
    }
  }

  function mapToCcContextForNonModule(startOptionConfig, mapFn, configLabel) {
    var includeDefaultKey = startOptionConfig.hasOwnProperty(MODULE_DEFAULT);
    var includeGlobalKey = startOptionConfig.hasOwnProperty(MODULE_GLOBAL);

    if (includeDefaultKey || includeGlobalKey) {
      var invalidKeyCount = 0;

      if (includeDefaultKey) {
        invalidKeyCount++;
        mapFn(MODULE_DEFAULT, startOptionConfig[MODULE_DEFAULT]);
      }

      if (includeGlobalKey) {
        invalidKeyCount++;
        mapFn(MODULE_GLOBAL, startOptionConfig[MODULE_GLOBAL]);
      }

      if (Object.keys(startOptionConfig).length > invalidKeyCount) {
        keysWarning(configLabel);
      }
    } else {
      mapFn(MODULE_DEFAULT, startOptionConfig);
    }
  }

  function bindWatchToCcContext(inputWatch, isModuleMode) {
    if (!isPlainJsonObject(inputWatch)) {
      throw new Error("StartUpOption.watch is not a plain json object!");
    }

    var ccWatch = ccContext.watch;
    var _state = ccContext.store._state;

    function mapWatch(moduleName, moduleWatch) {
      var stateKeys = Object.keys(moduleWatch);
      stateKeys.forEach(function (key) {
        var moduleState = _state[moduleName];
        var originalValue = moduleState[key];

        if (originalValue !== undefined) {
          var moduleWatchFn = moduleWatch[key];

          if (typeof moduleWatchFn !== 'function') {
            throw new Error("watch." + m + "." + key + " 's value is not a function");
          }

          var ccModuleWatch = util.safeGetObjectFromObject(ccWatch, moduleName);
          ccModuleWatch[key] = moduleWatchFn;
        } else {
          //strict?
          justWarning("key:" + key + " in watch." + moduleName + " is not declared in store." + moduleName + "!");
        }
      });
    }

    if (isModuleMode) {
      var moduleNames = Object.keys(inputWatch);
      moduleNames.forEach(function (m) {
        var moduleState = _state[m];

        if (!moduleState) {
          throw util.makeError(ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION, vbi$4(" moduleName in watch is " + m));
        }

        var moduleWatch = inputWatch[m];
        mapWatch(m, moduleWatch);
      });
    } else {
      mapToCcContextForNonModule(inputWatch, mapWatch, 'watch');
    }
  }

  function executeInitializer(isModuleMode, store, init) {
    var stateHandler = getStateHandlerForInit;
    if (init === undefined) return;

    if (!isModuleMode) {
      if (isPlainJsonObject(init)) {
        var includeDefaultModule = init.hasOwnProperty(MODULE_DEFAULT);
        var includeGlobalModule = init.hasOwnProperty(MODULE_GLOBAL);

        if (includeDefaultModule || includeGlobalModule) {
          if (includeDefaultModule) {
            var defaultInit = init[MODULE_DEFAULT];

            if (defaultInit) {
              if (typeof defaultInit !== 'function') {
                throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
              } else {
                defaultInit(stateHandler(MODULE_DEFAULT));
              }
            }
          }

          if (includeGlobalModule) {
            var globalInit = init[MODULE_GLOBAL];

            if (globalInit) {
              if (typeof globalInit !== 'function') {
                throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
              } else {
                globalInit(stateHandler(MODULE_GLOBAL));
              }
            }
          }
        } else {
          throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
        }
      } else {
        if (typeof init !== 'function') {
          throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
        }

        init(stateHandler(MODULE_DEFAULT));
      }
    } else {
      if (!isPlainJsonObject(init)) {
        throw new Error('init value must be a object like { ${moduleName}:Function } when cc startup in moduleMode!');
      }

      var moduleNames = Object.keys(init);
      moduleNames.forEach(function (moduleName) {
        if (!store[moduleName]) {
          throw new Error("module " + moduleName + " not found, check your ccStartupOption.init object keys");
        }

        var initFn = init[moduleName];

        if (initFn) {
          initFn(stateHandler(moduleName));
        }
      });
    }
  }
  /* 
  store in CC_CONTEXT may like:
   {
    $$global:{
   
    },
    module1:{
      books:[],
      user:{},
      color:'red',
      readCount:5,
    },
    module2:{
      books:[],
      colors:[],
      followCount:15,
    }
  }
  reducer = {
    [moduleName1]:{
      [actionType1]:callback(setState, {type:'',payload:''})
      [actionType2]:callback(setState, {type:'',payload:''})
    },
    [moduleName2]:{
      [actionType1]:callback(setState, {type:'',payload:''})
    }
  }
  init = {
    global:(setState)=>{}
  }
  */


  function _startup (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$isModuleMode = _ref.isModuleMode,
        isModuleMode = _ref$isModuleMode === void 0 ? false : _ref$isModuleMode,
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

      if (ccContext.isCcAlreadyStartup) {
        var err = util.makeError(ERR.CC_ALREADY_STARTUP);

        if (util.isHotReloadMode()) {
          clearObject(ccContext.reducer._reducer);
          clearObject(ccContext.store._state);
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

      if (autoCreateDispatcher) {
        if (!ccContext.refs[CC_DISPATCHER]) {
          var Dispatcher = createDispatcher();
          var box = document.querySelector("#" + CC_DISPATCHER_BOX);

          if (!box) {
            box = document.createElement('div');
            box.id = CC_DISPATCHER_BOX;
            box.style.position = 'fixed';
            box.style.left = 0;
            box.style.top = 0;
            box.style.display = 'none';
            box.style.zIndex = -888666;
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
      }

      ccContext.isModuleMode = isModuleMode;
      ccContext.isStrict = isStrict;
      ccContext.isDebug = isDebug;
      util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
      util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
      bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
      bindReducerToCcContext(reducer);
      bindComputedToCcContext(computed, isModuleMode);
      bindWatchToCcContext(watch, isModuleMode);

      if (init) {
        var computedStore = ccContext.store._state;
        executeInitializer(isModuleMode, computedStore, init);
      }

      if (middlewares.length > 0) {
        var ccMiddlewares = ccContext.middlewares;
        middlewares.forEach(function (m) {
          return ccMiddlewares.push(m);
        });
      }

      ccContext.isCcAlreadyStartup = true;
      ccContext.isHot = isHot;
      ccContext.errorHandler = errorHandler;
    } catch (err) {
      if (errorHandler) errorHandler(err);else throw err;
    }
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
   * @param {object} [registerOption.stateToPropMapping] { (moduleName/keyName)/(alias), ...}
   * if you don't like module state merge to cc instance state property, 
   * you can define stateToPropMapping, that means you can get module from this.$$propState in cc instance method,
   * for example, if you define it like: {'moudleA/foo':'foo', 'moudleB/bar':'bar'}
   * now your can get value of foo and bar from these two module,
   * ```
   *    const {foo, bar} = this.$$propState;
   * ```
   * ============   !!!!!!  ============
   * note that, any state changing of key for foo and bar will effect current cc class instance to render new view,
   * that means you can use this feature to achieve purpose of watching multi module state changing ^_^
   * 
   * if moudleA and moudleB has a duplicate key naming, you can define stateToPropMapping like:
   * {'moudleA/foo':'foo', 'moudleA/bar':'moudleA_bar','moudleB/bar':'bar'}
   * now your can get value of foo and bar from these two module like below,
   * ```
   *    const {foo, moudleA_bar, bar} = this.$$propState;
   * ```
   * if you want to want to watch moudleA and moudleB whole state changing 
   * and you can make sure they don't have key naming duplicate problem!
   * you can define stateToPropMapping like: {'moudleA/*':'', 'moudleB/*':''}
   * now your can get any key state from this.$$propState,
   * 
   * ============   !!!!!!  ============
   * a better way to avoid key naming duplicate problem is set registerOption.isPropStateModuleMode as true,
   * now your can these two moudle state like below, you can get every state from specified module^_^
   * ```
   *    const {moudleA, moudleB} = this.$$propState;
   * ```
   * 
   * @param {object} [registerOption.isPropStateModuleMode] default is false, see above know how to use it
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
   *      stateToPropMapping: {'form/regularFormSubmitting': 'submitting'},
   *      extendInputClass: false 
   *    })
   *    @Form.create()
   *    export default class BasicForms extends PureComponent {
   *      componentDidMount()=>{
   *        this.props.$$dispatch('form/getInitData');
   *      }
   *      render(){
   *        const {submitting} = this.props.$$propState;
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
   * option.stateToPropMapping is called pm for short 
   * option.isPropStateModuleMode is called mm for short 
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
        stateToPropMapping = _ref.pm,
        isPropStateModuleMode = _ref.mm,
        isSingle = _ref.is,
        asyncLifecycleHook = _ref.as,
        reducerModule = _ref.re,
        extendInputClass = _ref.ex;

    return register$1(ccClassKey, {
      extendInputClass: extendInputClass,
      module: module,
      sharedStateKeys: sharedStateKeys,
      globalStateKeys: globalStateKeys,
      stateToPropMapping: stateToPropMapping,
      isPropStateModuleMode: isPropStateModuleMode,
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

  var ccGlobalStateKeys$1 = ccContext.globalStateKeys;
  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {String} module
   * @param {Object} state
   * @param {Object} [option] reducer、init、sharedToGlobalMapping
   * @param {Object} [option.reducer]  you can define multi reducer for a module by specify a reducer
   * @param {Object} [option.moduleReducer]  if you specify moduleReducer and reducer at the same time, the reducer will be ignored!
   * cc will give state module name as moduleReducer key
   * @param {Object} [option.init]
   * @param {Object} [option.globalState]  this globalState will been merged to $$global module state
   * @param {Object} [option.sharedToGlobalMapping]
   * @param {Object} [option.middlewares]
   */

  function _configure (module, state, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        singleClass = _ref.singleClass,
        moduleReducer = _ref.moduleReducer,
        reducer = _ref.reducer,
        init = _ref.init,
        globalState = _ref.globalState,
        sharedToGlobalMapping = _ref.sharedToGlobalMapping,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares;

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet, you can not call cc.configure!');
    }

    if (!ccContext.isModuleMode) {
      throw new Error('cc is running in non module node, can not call cc.configure');
    }

    checkModuleName(module);
    checkModuleState(state, module);
    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;

    if (_state[module]) {
      throw makeError(ERR.CC_MODULE_NAME_DUPLICATE, verboseInfo("moduleName " + module));
    }

    _state[module] = state;

    if (singleClass === true) {
      ccContext.moduleSingleClass[module] = true;
    }

    if (moduleReducer) {
      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
      }

      _reducer[module] = moduleReducer;
    } else if (reducer) {
      if (!isPlainJsonObject(reducer)) {
        throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " 's moduleReducer is invalid"));
      }

      var reducerModuleNames = Object.keys(reducer);
      reducerModuleNames.forEach(function (rmName) {
        checkModuleName(rmName);
        var moduleReducer = reducer[rmName];

        if (!isPlainJsonObject(moduleReducer)) {
          throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo("moduleName " + module + " reducer 's value  is invalid"));
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

    var storedGlobalState = _state[MODULE_GLOBAL];

    if (globalState) {
      checkModuleState(globalState, MODULE_GLOBAL);
      var globalStateKeys = Object.keys(globalState);
      globalStateKeys.forEach(function (gKey) {
        if (storedGlobalState[gKey]) {
          throw makeError(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE, verboseInfo("duplicate globalKey: " + gKey));
        }

        var stateValue = globalState[gKey];
        storedGlobalState[gKey] = stateValue;
        ccGlobalStateKeys$1.push(gKey);
      });
    }

    if (sharedToGlobalMapping) {
      handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
    }

    if (init) {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function!');
      }

      init(getStateHandlerForInit(module));
    }

    if (middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
      });
    }
  }

  var vbi$5 = util.verboseInfo;
  /**
   * @description
   * @author zzk
   * @export
   * @param {*} ccClassKey must pass to invoke!
   * @param {*} ccInstanceKey must pass to invoke but you can pass null or undefined or '', cc will pick one instance of this CcClass
   * @param {*} method
   * @param {*} args
   * @returns
   */

  function invoke (ccClassKey, ccInstanceKey, method) {
    var _ref$method;

    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
        ccKey_ref_ = ccContext.ccKey_ref_;
    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext) {
      var err = util.makeError(ERR.CC_CLASS_NOT_FOUND, vbi$5(" ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccInstanceKey) {
      var ccKey = util.makeUniqueCcKey(ccClassKey, ccInstanceKey);
      ref = ccKey_ref_[ccKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccKey_ref_[ccKeys[0]]; // pick first one
    }

    if (!ref) {
      var _err = util.makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$5(" ccClassKey:" + ccClassKey + " ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = util.makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$5(" method:" + method)); // only error


      return console.error(_err2.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
  }

  var vbi$6 = util.verboseInfo;
  function _invokeSingle (ccClassKey, method) {
    if (ccClassKey === undefined) {
      throw new Error("api doc: cc.invokeSingle(ccClassKey:String, method:String, ...args)");
    }

    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext.isSingle) {
      var err = util.makeError(ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi$6("ccClassKey:" + ccClassKey)); // only error, the target instance may has been unmounted really!

      return console.error(err.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    invoke.apply(void 0, [ccClassKey, ccClassKey, method].concat(args));
  }

  function _setState (module, state, lazyMs, throwError) {
    if (lazyMs === void 0) {
      lazyMs = -1;
    }

    if (throwError === void 0) {
      throwError = false;
    }

    if (module === undefined && state === undefined) {
      throw new Error("api doc: cc.setState(module:String, state:Object, lazyMs?:Number, throwError?:Boolean)");
    }

    setState(module, state, lazyMs, throwError);
  }

  var getState$1 = ccContext.store.getState;

  function emit (event) {
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
   * @param {object} stateToPropMapping { (moduleAndStateKey): (mappedStateKeyInPropState) }
   * @param {object} option 
   * @param {boolean} [option.extendInputClass] default is true
   * @param {boolean} [option.isSingle] default is false
   * @param {boolean} [option.isPropStateModuleMode] 
   * @param {boolean} [option.asyncLifecycleHook] 
   * @param {string} [option.module]
   * @param {Array<string>} [option.sharedStateKeys]
   * @param {Array<string>} [option.globalStateKeys]
   */

  function _connect (ccClassKey, stateToPropMapping, option) {
    if (option === void 0) {
      option = {};
    }

    var mergedOption = Object.assign({
      isPropStateModuleMode: true
    }, option, {
      stateToPropMapping: stateToPropMapping
    });
    return register$1(ccClassKey, mergedOption);
  }

  function _dispatch (action, payLoadWhenActionIsString, _temp) {
    var _ref = _temp === void 0 ? [] : _temp,
        ccClassKey = _ref[0],
        ccKey = _ref[1],
        throwError = _ref[2];

    if (action === undefined && payLoadWhenActionIsString === undefined) {
      throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any), when action is String, second param means payload");
    }

    try {
      if (ccClassKey && ccKey) {
        var uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          targetRef.$$dispatch(action, payLoadWhenActionIsString);
        }
      } else {
        var ref = pickOneRef();
        ref.$$dispatchForModule(action, payLoadWhenActionIsString);
      }
    } catch (err) {
      if (throwError) throw err;else util.justWarning(err.message);
    }
  }

  var ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_,
      fragmentFeature_classKey_ = ccContext.fragmentFeature_classKey_;
  var me$4 = util.makeError;

  function getFeatureStr(stateToPropMapping) {
    var prefixedPropKeys = Object.keys(stateToPropMapping);
    var module_mapAllStateToProp_ = {};
    var index_targetModule_ = {};
    prefixedPropKeys.sort();
    prefixedPropKeys.forEach(function (prefixedKey, index) {
      if (!util.isPrefixedKeyValid(prefixedKey)) {
        throw me$4(ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "error occurred in cc fragment");
      }

      var _prefixedKey$split = prefixedKey.split('/'),
          targetModule = _prefixedKey$split[0],
          targetKey = _prefixedKey$split[1];

      index_targetModule_[index] = {
        targetModule: targetModule,
        targetKey: targetKey
      };

      if (targetKey === '*') {
        module_mapAllStateToProp_[targetModule] = true;
      }
    });
    var strArr = [];
    prefixedPropKeys.forEach(function (prefixedKey, index) {
      var targetModule = index_targetModule_[index];

      if (module_mapAllStateToProp_[targetModule] === true) {
        var str = targetModule + "/*";

        if (!strArr.includes(str)) {
          strArr.push(str);
        } else {
          util.justWarning("prefixedKey:" + prefixedKey + " will be ignored in stateToPropMapping because of existing prefixedKey:" + str);
        }
      } else {
        strArr.push(prefixedKey);
      }
    });
    return strArr.join(',');
  }

  function getFragmentClassKey(stateToPropMapping) {
    var featureStr = getFeatureStr(stateToPropMapping);
    var targetClassKey = fragmentFeature_classKey_[featureStr];

    if (targetClassKey) {
      return targetClassKey;
    } else {
      var oldFragmentNameCount = ccContext.fragmentNameCount;
      var fragmentNameCount = oldFragmentNameCount + 1;
      ccContext.fragmentNameCount = fragmentNameCount;
      targetClassKey = CC_FRAGMENT_PREFIX + "_" + fragmentNameCount;
      fragmentFeature_classKey_[featureStr] = targetClassKey;
      return targetClassKey;
    }
  }

  var CcFragment =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(CcFragment, _Component);

    function CcFragment(props, context) {
      var _this;

      _this = _Component.call(this, props, context) || this;
      var stateToPropMapping = props.stateToPropMapping,
          pm = props.pm,
          isPropStateModuleMode = props.isPropStateModuleMode,
          mm = props.mm,
          ccKey = props.ccKey,
          connect = props.connect;

      var _stateToPropMapping = stateToPropMapping || pm;

      var _isPropStateModuleMode = isPropStateModuleMode || mm;

      if (_stateToPropMapping === undefined) _stateToPropMapping = {};
      if (_isPropStateModuleMode === undefined) _isPropStateModuleMode = false; //allow use connect replace stateToPropMapping, and when use connect, isPropStateModuleMode is always true

      if (connect) {
        _stateToPropMapping = connect;
        _isPropStateModuleMode = true;
      }

      var ccClassKey = getFragmentClassKey(_stateToPropMapping);
      var ccUniqueKey = '',
          isCcUniqueKeyAutoGenerated = false;

      if (ccKey) {
        // for CcFragment, if user supply ccKey to props, ccUniqueKey will equal ccKey
        ccUniqueKey = ccKey;
      } else {
        var _helper$computeCcUniq = computeCcUniqueKey(false, ccClassKey, ccKey, true),
            ck = _helper$computeCcUniq.ccKey,
            cuk = _helper$computeCcUniq.ccUniqueKey,
            ag = _helper$computeCcUniq.isCcUniqueKeyAutoGenerated;

        ccUniqueKey = cuk;
        isCcUniqueKeyAutoGenerated = ag;
        ccKey = ck;
      }

      buildCcClassContext(ccClassKey, MODULE_DEFAULT, [], [], [], [], _stateToPropMapping, _isPropStateModuleMode, true);
      setRef(_assertThisInitialized(_this), false, ccClassKey, ccKey, ccUniqueKey, {}, true); // for CcFragment, just put ccClassKey to module's cc class keys

      var moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_;
      var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, MODULE_DEFAULT);
      if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
      _this.$$propState = ccClassKey_ccClassContext_$2[ccClassKey].propState || {}; // only bind reactForceUpdateRef for CcFragment

      var reactForceUpdateRef = _this.forceUpdate.bind(_assertThisInitialized(_this));

      var ccState = {
        module: MODULE_DEFAULT,
        ccClassKey: ccClassKey,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
        stateToPropMapping: _stateToPropMapping,
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

          var setter = function setter(newState) {
            stateArr[cursor] = newState;

            _this.cc.reactForceUpdate();
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
                __hookMeta.effectSeeResult = false; // effect fn will been executed only in didMount
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
      _this.__fragmentParams = {
        hook: hook,
        propState: _this.$$propState,
        emit: emit,
        dispatch: dispatcher.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, MODULE_DEFAULT, null, null, null, -1, ccKey),
        effect: dispatcher.__$$getEffectHandler(ccKey),
        xeffect: dispatcher.__$$getXEffectHandler(ccKey),
        lazyEffect: dispatcher.__$$getLazyEffectHandler(ccKey),
        lazyXeffect: dispatcher.__$$getLazyXEffectHandler(ccKey),
        setState: function setState$$1(module, state, lazyMs) {
          dispatcher.$$changeState(state, {
            ccKey: ccKey,
            module: module,
            stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
            broadcastTriggeredBy: null,
            lazyMs: lazyMs
          });
        },
        setGlobalState: function setGlobalState$$1(state, lazyMs) {
          dispatcher.$$changeState(state, {
            ccKey: ccKey,
            MODULE_GLOBAL: MODULE_GLOBAL,
            stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
            broadcastTriggeredBy: null,
            lazyMs: lazyMs
          });
        }
      };
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
      unsetRef(ccClassKey, ccUniqueKey);
      if (_Component.prototype.componentWillUnmount) _Component.prototype.componentWillUnmount.call(this);
    };

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          render = _this$props.render;
      var target = render || children;

      if (typeof target === 'function') {
        return target(this.__fragmentParams) || React__default.createElement(React.Fragment);
      } else {
        return target;
      }
    };

    return CcFragment;
  }(React.Component);

  var startup = _startup;
  var register$2 = register$1;
  var r = _r;
  var registerToDefault = _registerToDefault;
  var registerSingleClassToDefault = _registerSingleClassToDefault;
  var configure = _configure;
  var invoke$1 = invoke;
  var invokeSingle = _invokeSingle;
  var setGlobalState$1 = setGlobalState;
  var setState$1 = _setState;
  var getState$2 = getState$1;
  var emit$1 = emit;
  var emitWith = _emitWith;
  var off = _off;
  var connect = _connect;
  var dispatch = _dispatch;
  var ccContext$1 = ccContext;
  var createDispatcher$1 = createDispatcher;
  var CcFragment$1 = CcFragment;
  var defaultExport = {
    emit: emit,
    emitWith: _emitWith,
    off: _off,
    connect: _connect,
    dispatch: _dispatch,
    startup: _startup,
    register: register$1,
    r: _r,
    registerToDefault: _registerToDefault,
    registerSingleClassToDefault: _registerSingleClassToDefault,
    configure: _configure,
    invoke: invoke,
    invokeSingle: _invokeSingle,
    setGlobalState: setGlobalState,
    setState: _setState,
    getState: getState$1,
    ccContext: ccContext,
    createDispatcher: createDispatcher,
    CcFragment: CcFragment
  };

  if (window) {
    window.cc = defaultExport;
  }

  exports.startup = startup;
  exports.register = register$2;
  exports.r = r;
  exports.registerToDefault = registerToDefault;
  exports.registerSingleClassToDefault = registerSingleClassToDefault;
  exports.configure = configure;
  exports.invoke = invoke$1;
  exports.invokeSingle = invokeSingle;
  exports.setGlobalState = setGlobalState$1;
  exports.setState = setState$1;
  exports.getState = getState$2;
  exports.emit = emit$1;
  exports.emitWith = emitWith;
  exports.off = off;
  exports.connect = connect;
  exports.dispatch = dispatch;
  exports.ccContext = ccContext$1;
  exports.createDispatcher = createDispatcher$1;
  exports.CcFragment = CcFragment$1;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
