"use strict";

exports.__esModule = true;
exports["default"] = exports.ERR_MESSAGE = exports.ERR = exports.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = exports.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = exports.BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = exports.BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = exports.BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = exports.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE = exports.CHANGE_BY_BROADCASTED_SHARED_STATE = exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE = exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE = exports.CHANGE_BY_SELF = exports.CC_DISPATCHER_BOX = exports.CC_DISPATCHER = exports.CC_FRAGMENT_PREFIX = exports.MODULE_CC = exports.MODULE_DEFAULT = exports.MODULE_GLOBAL = void 0;

var _ERR_MESSAGE;

var MODULE_GLOBAL = '$$global';
exports.MODULE_GLOBAL = MODULE_GLOBAL;
var MODULE_DEFAULT = '$$default';
exports.MODULE_DEFAULT = MODULE_DEFAULT;
var MODULE_CC = '$$cc';
exports.MODULE_CC = MODULE_CC;
var CC_FRAGMENT_PREFIX = '$$Fragment';
exports.CC_FRAGMENT_PREFIX = CC_FRAGMENT_PREFIX;
var CC_DISPATCHER = '$$Dispatcher';
exports.CC_DISPATCHER = CC_DISPATCHER;
var CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';
exports.CC_DISPATCHER_BOX = CC_DISPATCHER_BOX;
var CHANGE_BY_SELF = 100;
exports.CHANGE_BY_SELF = CHANGE_BY_SELF;
var CHANGE_BY_BROADCASTED_GLOBAL_STATE = 101;
exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE = CHANGE_BY_BROADCASTED_GLOBAL_STATE;
var CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE = 102;
exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE = CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE;
var CHANGE_BY_BROADCASTED_SHARED_STATE = 103;
exports.CHANGE_BY_BROADCASTED_SHARED_STATE = CHANGE_BY_BROADCASTED_SHARED_STATE;
var CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE = 104;
exports.CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE = CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
var BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = 300;
exports.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD = BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;
var BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = 301;
exports.BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
var BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = 302;
exports.BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE = BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE;
var BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = 303; //  two kind of state extraction
//    cc will use ccInstance's sharedStateKeys and globalStateKeys to extract committed state  

exports.BROADCAST_TRIGGERED_BY_CC_API_SET_STATE = BROADCAST_TRIGGERED_BY_CC_API_SET_STATE;
var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1; //    cc will use one module's sharedStateKeys and globalStateKeys to extract committed state  

exports.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
var STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;
exports.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
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
exports.ERR = ERR;
var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'react-controller-center startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for react-controller-center,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE] = "sharedToGlobalMapping is not allowed to supply to startup's options in non module. ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!", _ERR_MESSAGE[ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the computed keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'react-control-center';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CCComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CCComponent! if you are sure the key is different, maybe the CCComponent's father Component is also a CCComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_OPTION_INVALID] = 'ccOption must be a plain json object! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS] = 'some of your storedStateKeys has been declared in CCClass sharedStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS] = 'you must explicitly specify a ccKey for ccInstance if you want to use storeStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure your ccClassKey been registered to react-control-center before you use the ccClass!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED] = "$$global is cc's build-in module name, all ccClass is watching $$global's state implicitly, user can not assign $$global to module prop!", _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE] = 'ccClass is declared as singleton, now cc found you are trying execute cc.invokeSingle, you can call cc.invoke instead, it does not care whether your ccClass is singleton or not! ', _ERR_MESSAGE[ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE] = 'you are trying register a react class to a single class module, but cc found the target module has been registered!', _ERR_MESSAGE[ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID] = 'stateToPropMapping is invalid, must be a plain json object, check it in your register method or connect method!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY] = 'storedStateKeys or sharedStateKeys is not an Array!', _ERR_MESSAGE[ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'storedStateKeys or sharedStateKeys include non string element', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS] = 'some of your sharedStateKeys has been declared in CCClass globalStateKeys!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY] = "globalStateKeys or sharedStateKeys is not an Array! if you want to watch all state keys of a module state or all state keys of global state, you can set sharedStateKeys='*' and globalStateKeys='*'", _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'globalStateKeys or sharedStateKeys include non string element!', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE] = 'some keys of configured global state have been included in store.globalState', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY] = 'found key is sharedToGlobalMapping key in globalStateKeys, you should delete it ', _ERR_MESSAGE[ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE] = 'found key in globalStateKeys is not included in global state, check your globalStateKeys', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);
exports.ERR_MESSAGE = ERR_MESSAGE;
var _default = {
  MODULE_GLOBAL: MODULE_GLOBAL,
  MODULE_DEFAULT: MODULE_DEFAULT,
  MODULE_CC: MODULE_CC,
  ERR: ERR,
  ERR_MESSAGE: ERR_MESSAGE,
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
  CHANGE_BY_SELF: CHANGE_BY_SELF,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE: CHANGE_BY_BROADCASTED_GLOBAL_STATE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE: CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE,
  CHANGE_BY_BROADCASTED_SHARED_STATE: CHANGE_BY_BROADCASTED_SHARED_STATE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE: CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD: BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE: BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE: BROADCAST_TRIGGERED_BY_CC_API_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_API_SET_STATE: BROADCAST_TRIGGERED_BY_CC_API_SET_STATE
};
exports["default"] = _default;