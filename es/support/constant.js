export const MODULE_GLOBAL = '$$global';
export const MODULE_DEFAULT = '$$default';
export const MODULE_CC = '$$cc';
export const MODULE_CC_ROUTER = '$$CONCENT_ROUTER';

export const CC_CLASS_PREFIX = '$$CcClass';
export const CC_FRAGMENT_PREFIX = '$$CcFrag';
export const CC_HOOK_PREFIX = '$$CcHook';
export const CC_PREFIX = '$$Cc';

export const CC_DISPATCHER = '$$Dispatcher';
export const CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';

export const  CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
export const  MOCKE_KEY = Symbol('__for_mock_event__');
export const  LAZY_KEY = Symbol('__lazy_handle_state__');

export const SIG_FN_START = 10;
export const SIG_FN_END = 11;
export const SIG_FN_QUIT = 12;
export const SIG_FN_ERR = 13;
export const SIG_MODULE_CONFIGURED = 14;

export const STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1;
export const STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;

export const EFFECT_AVAILABLE = 1;
export const EFFECT_STOPPED = 0;

export const DISPATCH = 'dispatch';
export const SET_STATE = 'setState';
export const SET_MODULE_STATE = 'setModuleState';
export const FORCE_UPDATE = 'forceUpdate';
export const INVOKE = 'invoke';
export const SYNC = 'sync';

export const ERR = {
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
  CC_MODULE_NAME_HAS_NO_STATE:1017,

  CC_CLASS_KEY_DUPLICATE: 1100,
  CC_CLASS_NOT_FOUND: 1101,
  CC_CLASS_STORE_MODULE_INVALID: 1102,
  CC_CLASS_REDUCER_MODULE_INVALID: 1103,
  CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED:1104,

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
  CC_REDUCER_MODULE_NAME_DUPLICATE: 1511,
  // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,
}

export const ERR_MESSAGE = {
  [ERR.CC_ALREADY_STARTUP]: 'concent startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ',
  [ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE]: 'you are trying register a module class but cc startup with non module mode! ',
  [ERR.CC_MODULE_NAME_DUPLICATE]: 'module name duplicate!',
  [ERR.CC_REGISTER_A_CC_CLASS]: 'registering a cc class is prohibited! ',
  [ERR.CC_MODULE_KEY_CC_FOUND]: 'key:"$$cc" is a built-in module name for concent,you can not configure it or the name like it in you store or reducer! ',
  [ERR.CC_MODULE_NAME_INVALID]: `module name is invalid, /^[\$\#\&a-zA-Z0-9_-]+$/.test() is false. `,
  [ERR.CC_STORE_STATE_INVALID]: `module state of store must be a plain json object! `,
  [ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID]: `argument moduleReducer is invalid, must be a function!`,
  [ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID]: `argument reducer is invalid, must be a plain json object(not an array also)!`,
  [ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID]: `argument reducer's value is invalid, must be a plain json object(not an array also), maybe you can use moduleReducer to config the reducer for this module!`,
  [ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION]: `one of the watch keys is not a valid module name in store!`,
  [ERR.CC_MODULE_NOT_FOUND]: `module not found!`,
  [ERR.CC_DISPATCH_STRING_INVALID]: `dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)、(moduleName)/(functionName)、(moduleName)/(reducerModuleName)/(functionName)`,
  [ERR.CC_DISPATCH_PARAM_INVALID]: `dispatch param type is invalid, it must be string or object`,
  [ERR.CC_NO_DISPATCHER_FOUND]: `
    cc guess you may set autoCreateDispatcher as false in StartupOption,
    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, 
    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:
    import {createDispatcher} from 'concent';
    const CcDispatcher = createDispatcher();
    <App>
      <CcDispatcher />
      {/* another jsx */}
    </App>
    or
    <CcDispatcher>
      <App />
    </CcDispatcher>
  `,
  [ERR.CC_MODULE_NAME_HAS_NO_STATE]:`there is no module state in the store for your input module name`,

  [ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE]: `ccKey duplicate while new a CcComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CcComponent! if you are sure the key is different, maybe the CcComponent's father Component is also a CcComponent, then you can prefix your ccKey with the father Component's ccKey!   `,
  [ERR.CC_CLASS_INSTANCE_OPTION_INVALID]: 'ccOption must be a plain json object! ',
  [ERR.CC_CLASS_INSTANCE_NOT_FOUND]: 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ',
  [ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND]: 'ccClass instance method not found, make sure the instance include the method! ',
  [ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID]: 'ccClass instance invoke callWith method with invalid args! ',
  [ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE]: 'ccClass is declared as singleton, now cc found you are trying new another one instance! ',
  [ERR.CC_ARG_STORED_KEYS_DUPLICATE_WITH_WATCHED_KEYS]: 'some of your storedKeys has been declared in CcClass watchedKeys!',
  [ERR.CC_STORED_KEYS_NEED_CCKEY]: 'you must explicitly specify a ccKey for ccInstance if you want to use storedKeys!',

  [ERR.CC_CLASS_KEY_DUPLICATE]: 'ccClassKey duplicate while you register a react class!  ',
  [ERR.CC_CLASS_NOT_FOUND]: 'ccClass not found, make sure the supplied ccClassKey been registered to concent!  ',
  [ERR.CC_CLASS_STORE_MODULE_INVALID]: 'ccClass ccOption module value is invalid, can not match it in store! ',
  [ERR.CC_CLASS_REDUCER_MODULE_INVALID]: 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ',
  [ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED]: '$$fragment is cc built-in class key prefix, your class key can not start with it!',

  [ERR.CC_ARG_KEYS_NOT_AN_ARRAY]: `watchedKeys is not an Array! if you want to watch all state keys of a module, you can set watchedKeys='*' `,
  [ERR.CC_ARG_KEYS_INCLUDE_NON_STRING_ELEMENT]: 'watchedKeys include non string element!',

  [ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID]: `action type's naming is invalid, correct one may like: fooModule/fooType. `,
  [ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE]: `action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!`,
  [ERR.CC_REDUCER_MODULE_NAME_DUPLICATE]: `reducer module name duplicate!`,
  [ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE]: `reducer action type duplicate!`,
  [ERR.CC_REDUCER_NOT_A_FUNCTION]: `reducer must be a function!`,

  // [ERR.REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE]: `reducer key is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in reducer keys!`,
}

export default {
  MODULE_GLOBAL,
  MODULE_DEFAULT,
  MODULE_CC,
  ERR,
  ERR_MESSAGE,

  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
}
