export const MODULE_GLOBAL = '$$global';
export const MODULE_DEFAULT = '$$default';
export const MODULE_CC = '$$cc';
//do not consider symbol as MODULE_VOID
export const MODULE_VOID = '$$concent_void_module_624313307';
export const MODULE_CC_ROUTER = '$$CONCENT_ROUTER';


// component type
export const CC_CLASS = '$$CcClass';
export const CC_HOOK = '$$CcHook';

// component ins type
/** use CcFragment initialize a component instance in jsx directly */ 
export const CC_FRAGMENT = '$$CcFrag';
/** use Ob to initialize a component instance in jsx directly */ 
export const CC_OB = '$$CcOb';
/**
 * use api register、useConcent to create component firstly, 
 * then use the customized component to initialize a component instance in jsx
 */
export const CC_CUSTOMIZE = '$$CcCust';

export const CC_PREFIX = '$$Cc';

export const CC_DISPATCHER = '$$Dispatcher';

export const  CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');


export const SIG_FN_START = 10;
export const SIG_FN_END = 11;
export const SIG_FN_QUIT = 12;
export const SIG_FN_ERR = 13;
export const SIG_MODULE_CONFIGURED = 14;
export const SIG_STATE_CHANGED = 15;

export const SIG_ASYNC_COMPUTED_START = 30;
export const SIG_ASYNC_COMPUTED_END = 31;
export const SIG_ASYNC_COMPUTED_ERR = 32;
export const SIG_ASYNC_COMPUTED_BATCH_START = 33;
export const SIG_ASYNC_COMPUTED_BATCH_END = 34;

export const RENDER_NO_OP = 1;
export const RENDER_BY_KEY = 2;
export const RENDER_BY_STATE = 3;


export const FOR_ONE_INS_FIRSTLY = 1;
export const FOR_ALL_INS_OF_A_MOD = 2;

// 暂时用不到
// export const EFFECT_AVAILABLE = 1;
// export const EFFECT_STOPPED = 0;

export const DISPATCH = 'dispatch';
export const SET_STATE = 'setState';
export const SET_MODULE_STATE = 'setModuleState';
export const FORCE_UPDATE = 'forceUpdate';
export const INVOKE = 'invoke';
export const SYNC = 'sync';


export const CATE_MODULE = 'module';
export const CATE_REF = 'ref';
export const FN_CU = 'computed';
export const FN_WATCH = 'watch';


export const ERR = {
  CC_MODULE_NAME_DUPLICATE: 1002,
  CC_MODULE_NOT_FOUND: 1012,
  CC_DISPATCH_STRING_INVALID: 1013,
  CC_DISPATCH_PARAM_INVALID: 1014,
  CC_MODULE_NOT_CONNECTED: 1015,

  CC_CLASS_KEY_DUPLICATE: 1100,

  CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
  CC_STORED_KEYS_NEED_CCKEY: 1207,

  CC_REDUCER_NOT_A_FUNCTION: 1503,
}


export const ERR_MESSAGE = {
  [ERR.CC_MODULE_NAME_DUPLICATE]: 'module name duplicate!',
  [ERR.CC_MODULE_NOT_FOUND]: `module not found!`,
  [ERR.CC_DISPATCH_STRING_INVALID]: `when type param is string, it must be one of these format: (fnName)、(moduleName)/(fnName)`,
  [ERR.CC_DISPATCH_PARAM_INVALID]: `dispatch param type is invalid, it must be string or object`,
  [ERR.CC_MODULE_NOT_CONNECTED]: `module not been connected by ref`,

  [ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE]: `props.ccKey duplicate`,
  [ERR.CC_STORED_KEYS_NEED_CCKEY]: 'you must explicitly specify a ccKey for ccInstance when set storedKeys!',

  [ERR.CC_CLASS_KEY_DUPLICATE]: 'ccClassKey duplicate!',

  [ERR.CC_REDUCER_NOT_A_FUNCTION]: `reducer must be a function!`,
}
