"use strict";

exports.__esModule = true;
exports.UNMOUNTED = exports.MOUNTED = exports.NOT_MOUNT = exports.ERR_MESSAGE = exports.ERR = exports.FN_WATCH = exports.FN_CU = exports.CATE_REF = exports.CATE_MODULE = exports.SYNC = exports.INVOKE = exports.FORCE_UPDATE = exports.SET_MODULE_STATE = exports.SET_STATE = exports.DISPATCH = exports.FOR_ALL_INS_OF_A_MOD = exports.FOR_ONE_INS_FIRSTLY = exports.RENDER_BY_STATE = exports.RENDER_BY_KEY = exports.RENDER_NO_OP = exports.SIG_ASYNC_COMPUTED_BATCH_END = exports.SIG_ASYNC_COMPUTED_BATCH_START = exports.SIG_ASYNC_COMPUTED_ERR = exports.SIG_ASYNC_COMPUTED_END = exports.SIG_ASYNC_COMPUTED_START = exports.SIG_STATE_CHANGED = exports.SIG_MODULE_CONFIGURED = exports.SIG_FN_ERR = exports.SIG_FN_QUIT = exports.SIG_FN_END = exports.SIG_FN_START = exports.CCSYNC_KEY = exports.CC_DISPATCHER = exports.CC_PREFIX = exports.CC_CUSTOMIZE = exports.CC_OB = exports.CC_FRAGMENT = exports.CC_HOOK = exports.CC_CLASS = exports.MODULE_CC_ROUTER = exports.MODULE_VOID = exports.MODULE_CC = exports.MODULE_DEFAULT = exports.MODULE_GLOBAL = void 0;

var _ERR_MESSAGE;

var MODULE_GLOBAL = '$$global';
exports.MODULE_GLOBAL = MODULE_GLOBAL;
var MODULE_DEFAULT = '$$default';
exports.MODULE_DEFAULT = MODULE_DEFAULT;
var MODULE_CC = '$$cc'; //do not consider symbol as MODULE_VOID

exports.MODULE_CC = MODULE_CC;
var MODULE_VOID = '$$concent_void_module_624313307';
exports.MODULE_VOID = MODULE_VOID;
var MODULE_CC_ROUTER = '$$CONCENT_ROUTER'; // component type

exports.MODULE_CC_ROUTER = MODULE_CC_ROUTER;
var CC_CLASS = '$$CcClass';
exports.CC_CLASS = CC_CLASS;
var CC_HOOK = '$$CcHook'; // component ins type

/** use CcFragment initialize a component instance in jsx directly */

exports.CC_HOOK = CC_HOOK;
var CC_FRAGMENT = '$$CcFrag';
/** use Ob to initialize a component instance in jsx directly */

exports.CC_FRAGMENT = CC_FRAGMENT;
var CC_OB = '$$CcOb';
/**
 * use api register、useConcent to create component firstly, 
 * then use the customized component to initialize a component instance in jsx
 */

exports.CC_OB = CC_OB;
var CC_CUSTOMIZE = '$$CcCust';
exports.CC_CUSTOMIZE = CC_CUSTOMIZE;
var CC_PREFIX = '$$Cc';
exports.CC_PREFIX = CC_PREFIX;
var CC_DISPATCHER = '$$Dispatcher';
exports.CC_DISPATCHER = CC_DISPATCHER;
var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
exports.CCSYNC_KEY = CCSYNC_KEY;
var SIG_FN_START = 10;
exports.SIG_FN_START = SIG_FN_START;
var SIG_FN_END = 11;
exports.SIG_FN_END = SIG_FN_END;
var SIG_FN_QUIT = 12;
exports.SIG_FN_QUIT = SIG_FN_QUIT;
var SIG_FN_ERR = 13;
exports.SIG_FN_ERR = SIG_FN_ERR;
var SIG_MODULE_CONFIGURED = 14;
exports.SIG_MODULE_CONFIGURED = SIG_MODULE_CONFIGURED;
var SIG_STATE_CHANGED = 15;
exports.SIG_STATE_CHANGED = SIG_STATE_CHANGED;
var SIG_ASYNC_COMPUTED_START = 30;
exports.SIG_ASYNC_COMPUTED_START = SIG_ASYNC_COMPUTED_START;
var SIG_ASYNC_COMPUTED_END = 31;
exports.SIG_ASYNC_COMPUTED_END = SIG_ASYNC_COMPUTED_END;
var SIG_ASYNC_COMPUTED_ERR = 32;
exports.SIG_ASYNC_COMPUTED_ERR = SIG_ASYNC_COMPUTED_ERR;
var SIG_ASYNC_COMPUTED_BATCH_START = 33;
exports.SIG_ASYNC_COMPUTED_BATCH_START = SIG_ASYNC_COMPUTED_BATCH_START;
var SIG_ASYNC_COMPUTED_BATCH_END = 34;
exports.SIG_ASYNC_COMPUTED_BATCH_END = SIG_ASYNC_COMPUTED_BATCH_END;
var RENDER_NO_OP = 1;
exports.RENDER_NO_OP = RENDER_NO_OP;
var RENDER_BY_KEY = 2;
exports.RENDER_BY_KEY = RENDER_BY_KEY;
var RENDER_BY_STATE = 3;
exports.RENDER_BY_STATE = RENDER_BY_STATE;
var FOR_ONE_INS_FIRSTLY = 1;
exports.FOR_ONE_INS_FIRSTLY = FOR_ONE_INS_FIRSTLY;
var FOR_ALL_INS_OF_A_MOD = 2; // 暂时用不到
// export const EFFECT_AVAILABLE = 1;
// export const EFFECT_STOPPED = 0;

exports.FOR_ALL_INS_OF_A_MOD = FOR_ALL_INS_OF_A_MOD;
var DISPATCH = 'dispatch';
exports.DISPATCH = DISPATCH;
var SET_STATE = 'setState';
exports.SET_STATE = SET_STATE;
var SET_MODULE_STATE = 'setModuleState';
exports.SET_MODULE_STATE = SET_MODULE_STATE;
var FORCE_UPDATE = 'forceUpdate';
exports.FORCE_UPDATE = FORCE_UPDATE;
var INVOKE = 'invoke';
exports.INVOKE = INVOKE;
var SYNC = 'sync';
exports.SYNC = SYNC;
var CATE_MODULE = 'module';
exports.CATE_MODULE = CATE_MODULE;
var CATE_REF = 'ref';
exports.CATE_REF = CATE_REF;
var FN_CU = 'computed';
exports.FN_CU = FN_CU;
var FN_WATCH = 'watch';
exports.FN_WATCH = FN_WATCH;
var ERR = {
  CC_MODULE_NAME_DUPLICATE: 1002,
  CC_MODULE_NOT_FOUND: 1012,
  CC_DISPATCH_STRING_INVALID: 1013,
  CC_DISPATCH_PARAM_INVALID: 1014,
  CC_MODULE_NOT_CONNECTED: 1015,
  CC_CLASS_KEY_DUPLICATE: 1100,
  CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
  CC_STORED_KEYS_NEED_CCKEY: 1207,
  CC_REDUCER_NOT_A_FUNCTION: 1503
};
exports.ERR = ERR;
var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "when type param is string, it must be one of these format: (fnName)\u3001(moduleName)/(fnName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_MODULE_NOT_CONNECTED] = "module not been connected by ref", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "props.ccKey duplicate", _ERR_MESSAGE[ERR.CC_STORED_KEYS_NEED_CCKEY] = 'you must explicitly specify a ccKey for ccInstance when set storedKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate!', _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);
exports.ERR_MESSAGE = ERR_MESSAGE;
var NOT_MOUNT = 1;
exports.NOT_MOUNT = NOT_MOUNT;
var MOUNTED = 2; // 已挂载未卸载

exports.MOUNTED = MOUNTED;
var UNMOUNTED = 3;
exports.UNMOUNTED = UNMOUNTED;