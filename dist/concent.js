(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.concent = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  /**
   * 为避免cc-context文件里调用的方法和自身产生循环引用，将moduleName_stateKeys_单独拆开放置到此文件
   * 如果还有别的类似循环引用产生，都可以像moduleName_stateKeys_一样单独拆出来放置为一个文件
   */
  var moduleName_stateKeys_ = {
    '$$default': []
  }; // 映射好模块的状态所有key并缓存住，用于提高性能

  var _ERR_MESSAGE;

  var MODULE_GLOBAL = '$$global';
  var MODULE_DEFAULT = '$$default';
  var MODULE_CC = '$$cc'; //do not consider symbol as MODULE_VOID

  var MODULE_VOID = '$$concent_void_module_624313307';
  var MODULE_CC_ROUTER = '$$CONCENT_ROUTER'; // component type

  var CC_CLASS = '$$CcClass';
  var CC_HOOK = '$$CcHook'; // component ins type

  /** use CcFragment initialize a component instance in jsx directly */

  var CC_FRAGMENT = '$$CcFrag';
  /** use Ob to initialize a component instance in jsx directly */

  var CC_OB = '$$CcOb';
  /**
   * use api register、useConcent to create component firstly, 
   * then use the customized component to initialize a component instance in jsx
   */

  var CC_CUSTOMIZE = '$$CcCust';
  var CC_PREFIX = '$$Cc';
  var CC_DISPATCHER = '$$Dispatcher';
  var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
  var SIG_FN_START = 10;
  var SIG_FN_END = 11;
  var SIG_FN_QUIT = 12;
  var SIG_FN_ERR = 13;
  var SIG_MODULE_CONFIGURED = 14;
  var SIG_STATE_CHANGED = 15;
  var SIG_ASYNC_COMPUTED_START = 30;
  var SIG_ASYNC_COMPUTED_END = 31;
  var SIG_ASYNC_COMPUTED_ERR = 32;
  var SIG_ASYNC_COMPUTED_BATCH_START = 33;
  var SIG_ASYNC_COMPUTED_BATCH_END = 34;
  var RENDER_NO_OP = 1;
  var RENDER_BY_KEY = 2;
  var RENDER_BY_STATE = 3;
  var FOR_ONE_INS_FIRSTLY = 1;
  var FOR_ALL_INS_OF_A_MOD = 2; // 暂时用不到
  // export const EFFECT_AVAILABLE = 1;
  // export const EFFECT_STOPPED = 0;

  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_MODULE_STATE = 'setModuleState';
  var FORCE_UPDATE = 'forceUpdate';
  var INVOKE = 'invoke';
  var SYNC = 'sync';
  var CATE_MODULE = 'module';
  var CATE_REF = 'ref';
  var FN_CU = 'computed';
  var FN_WATCH = 'watch';
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
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "when type param is string, it must be one of these format: (fnName)\u3001(moduleName)/(fnName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_MODULE_NOT_CONNECTED] = "module not been connected by ref", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "props.ccKey duplicate", _ERR_MESSAGE[ERR.CC_STORED_KEYS_NEED_CCKEY] = 'you must explicitly specify a ccKey for ccInstance when set storedKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate!', _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);

  var _cst = /*#__PURE__*/Object.freeze({
    MODULE_GLOBAL: MODULE_GLOBAL,
    MODULE_DEFAULT: MODULE_DEFAULT,
    MODULE_CC: MODULE_CC,
    MODULE_VOID: MODULE_VOID,
    MODULE_CC_ROUTER: MODULE_CC_ROUTER,
    CC_CLASS: CC_CLASS,
    CC_HOOK: CC_HOOK,
    CC_FRAGMENT: CC_FRAGMENT,
    CC_OB: CC_OB,
    CC_CUSTOMIZE: CC_CUSTOMIZE,
    CC_PREFIX: CC_PREFIX,
    CC_DISPATCHER: CC_DISPATCHER,
    CCSYNC_KEY: CCSYNC_KEY,
    SIG_FN_START: SIG_FN_START,
    SIG_FN_END: SIG_FN_END,
    SIG_FN_QUIT: SIG_FN_QUIT,
    SIG_FN_ERR: SIG_FN_ERR,
    SIG_MODULE_CONFIGURED: SIG_MODULE_CONFIGURED,
    SIG_STATE_CHANGED: SIG_STATE_CHANGED,
    SIG_ASYNC_COMPUTED_START: SIG_ASYNC_COMPUTED_START,
    SIG_ASYNC_COMPUTED_END: SIG_ASYNC_COMPUTED_END,
    SIG_ASYNC_COMPUTED_ERR: SIG_ASYNC_COMPUTED_ERR,
    SIG_ASYNC_COMPUTED_BATCH_START: SIG_ASYNC_COMPUTED_BATCH_START,
    SIG_ASYNC_COMPUTED_BATCH_END: SIG_ASYNC_COMPUTED_BATCH_END,
    RENDER_NO_OP: RENDER_NO_OP,
    RENDER_BY_KEY: RENDER_BY_KEY,
    RENDER_BY_STATE: RENDER_BY_STATE,
    FOR_ONE_INS_FIRSTLY: FOR_ONE_INS_FIRSTLY,
    FOR_ALL_INS_OF_A_MOD: FOR_ALL_INS_OF_A_MOD,
    DISPATCH: DISPATCH,
    SET_STATE: SET_STATE,
    SET_MODULE_STATE: SET_MODULE_STATE,
    FORCE_UPDATE: FORCE_UPDATE,
    INVOKE: INVOKE,
    SYNC: SYNC,
    CATE_MODULE: CATE_MODULE,
    CATE_REF: CATE_REF,
    FN_CU: FN_CU,
    FN_WATCH: FN_WATCH,
    ERR: ERR,
    ERR_MESSAGE: ERR_MESSAGE
  });

  var _computedValue2, _computedValueOri2;

  var _computedValue = (_computedValue2 = {}, _computedValue2[MODULE_GLOBAL] = {}, _computedValue2[MODULE_DEFAULT] = {}, _computedValue2[MODULE_CC] = {}, _computedValue2);

  var _computedValueOri = (_computedValueOri2 = {}, _computedValueOri2[MODULE_GLOBAL] = {}, _computedValueOri2[MODULE_DEFAULT] = {}, _computedValueOri2[MODULE_CC] = {}, _computedValueOri2);

  var _computedDep = {};
  var _computedRaw = {};
  var computedMap = {
    _computedValueOri: _computedValueOri,
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

  // 后续在逐步迁移其他的
  var runtimeVar = {
    // if isStrict is true, every error will be throw out instead of console.error, 
    // but this may crash your app, make sure you have a nice error handling way,
    // like componentDidCatch in react 16.*
    isStrict: false,
    isDebug: false,
    computedCompare: true,
    watchCompare: true,
    watchImmediate: false,
    bindCtxToMethod: false,
    extractModuleChangedState: true,
    extractRefChangedState: false,
    // 对于triggerReactSetState调用，当judgeStateChangedForRef为true时，触发__$$ccSetState 前，提取真正发生变化的值
    // 对于saveSharedState调用，提取真正发生变化的值作为sharedState，透传给其他实例
    // object类型值的比较规则默认是 false
    // false: 不比较，只要set了就提取出来
    // true: 比较，只有和前一刻的值不一样就提取出来
    objectValueCompare: false,
    // 非object类型值的比较规则默认是 true，
    // false: 不比较，只要set了就提取出来
    // true: 只有和前一刻的值不一样就提取出来
    nonObjectValueCompare: true
  };

  var runtimeHandler = {
    errorHandler: null
  };

  // 依赖收集写入的映射
  var waKey_uKeyMap_ = {}; // 依赖标记写入的映射，是一个实例化完成就会固化的依赖
  // 不采取一开始映射好全部waKey的形式，而是采用safeGet动态添加map映射

  var waKey_staticUKeyMap_ = {};

  function _mapIns(mapContainer, waKey, ccUniqueKey) {
    try {
      mapContainer[waKey][ccUniqueKey] = 1; //处于依赖状态
    } catch (err) {
      var map = {};
      map[ccUniqueKey] = 1;
      mapContainer[waKey] = map;
    }
  }

  function makeWaKey(module, stateKey) {
    return module + "/" + stateKey;
  }
  function mapIns(module, stateKey, ccUniqueKey) {
    _mapIns(waKey_uKeyMap_, makeWaKey(module, stateKey), ccUniqueKey);
  }
  function mapInsM(modStateKey, ccUniqueKey) {
    _mapIns(waKey_uKeyMap_, modStateKey, ccUniqueKey);
  }
  function delIns(module, stateKey, ccUniqueKey) {
    delInsM(makeWaKey(module, stateKey), ccUniqueKey);
  }
  function delInsM(modStateKey, ccUniqueKey) {
    try {
      delete waKey_uKeyMap_[modStateKey][ccUniqueKey];
    } catch (err) {// do nothing
    }
  }
  function mapStaticInsM(modStateKey, ccUniqueKey) {
    _mapIns(waKey_staticUKeyMap_, modStateKey, ccUniqueKey);
  }
  function delStaticInsM(modStateKey, ccUniqueKey) {
    try {
      delete waKey_staticUKeyMap_[modStateKey][ccUniqueKey];
    } catch (err) {// do nothing
    }
  }

  var refs = {};

  var CU_KEY = Symbol('cuk');
  var UNSTART = '0';
  var START = '1';
  var END = '2';
  var FUNCTION = 'function';
  var NOT_A_JSON = 'is not a plain json object!';
  var STR_ARR_OR_STAR = 'should be an string array or *!';

  /* eslint-disable */
  var cer = console.error;
  function noop() {}
  function isValueNotNull(value) {
    return !(value === null || value === undefined);
  }
  function isObjectNotNull(object) {
    if (object === null || object === undefined) {
      return false;
    }

    if (okeys(object).length > 0) {
      return true;
    }

    return false;
  }
  function isObjectNull(object) {
    return !isObjectNotNull(object);
  }
  function isObject(obj) {
    var str = Object.prototype.toString.call(obj); // !!!编译后的对象可能重写了toStringTag Symbol(Symbol.toStringTag): "Module"

    return str === '[object Object]' || str === '[object Module]';
  } // isPJO is short of isPlainJsonObject

  function isPJO(obj, canBeArray) {
    if (canBeArray === void 0) {
      canBeArray = false;
    }

    var isArr = Array.isArray(obj);
    var isObj = isObject(obj);
    return canBeArray ? isObj || isArr : isObj;
  }
  function isAsyncFn(fn) {
    if (!fn) return false; // @see https://github.com/tj/co/blob/master/index.js
    // obj.constructor.name === 'AsyncFunction'

    var isAsync = Object.prototype.toString.call(fn) === '[object AsyncFunction]' || 'function' == typeof fn.then;

    if (isAsync === true) {
      return true;
    } //有可能成降级编译成 __awaiter格式的了 或者 _regenerator


    var fnStr = fn.toString();

    if (fnStr.indexOf('_awaiter') >= 0 || fnStr.indexOf('_regenerator') >= 0) {
      return true;
    }

    return false;
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
  function makeCuPackedValue(isLazy, result, needCompute, fn, newState, oldState, fnCtx) {
    var _ref;

    return _ref = {}, _ref[CU_KEY] = 1, _ref.needCompute = needCompute, _ref.fn = fn, _ref.newState = newState, _ref.oldState = oldState, _ref.fnCtx = fnCtx, _ref.isLazy = isLazy, _ref.result = result, _ref;
  }
  function makeCuDepDesc() {
    return {
      retKey_fn_: {},
      retKey_lazy_: {},
      stateKey_retKeys_: {},
      // 用于辅助依赖收集系统更新依赖之用，render逻辑书写 refCompute.*** moduleCompted.*** connectedCompute.yy.** 时触发
      retKey_stateKeys_: {},
      fnCount: 0
    };
  }
  /** make ccClassContext */

  function makeCcClassContext(module, ccClassKey, renderKeyClasses) {
    return {
      module: module,
      ccClassKey: ccClassKey,
      renderKeyClasses: renderKeyClasses
    };
  } // !!! different ccClass enable own a same key

  function makeUniqueCcKey(ccClassKey, featureStr) {
    return ccClassKey + "$" + featureStr;
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
  function verboseInfo(info) {
    return info ? " --verbose-info: " + info : '';
  }
  function ccClassDisplayName(className) {
    return "CC(" + className + ")";
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

  var tipStart = function tipStart(str) {
    return "------------ CC " + str + " ------------";
  };

  function justWarning(err) {
    cer(tipStart('WARNING'));

    if (err instanceof Error) {
      cer(err.message);
      cer(err.stack);
    } else cer(err);
  }
  function justTip(msg) {
    console.log(tipStart('TIP'));
    console.log("%c" + msg, 'color:green;border:1px solid green;');
  }
  function strictWarning(err) {
    cer(tipStart('WARNING'));
    cer(err);

    if (runtimeVar.isStrict) {
      throw err;
    }
  }
  function safeGet(object, key, defaultVal) {
    if (defaultVal === void 0) {
      defaultVal = {};
    }

    var childrenObject = object[key];

    if (!childrenObject) {
      childrenObject = object[key] = defaultVal;
    }

    return childrenObject;
  }
  function safeGetArray(object, key) {
    return safeGet(object, key, []);
  }
  function noDupPush(arr, strItem) {
    if (!arr.includes(strItem)) arr.push(strItem);
  }
  function safeGetThenNoDupPush(object, key, strItem) {
    var arr = safeGetArray(object, key);
    noDupPush(arr, strItem);
  }
  function safeAssignObjectValue(assignTo, assignFrom) {
    Object.keys(assignFrom).forEach(function (key) {
      assignTo[key] = assignFrom[key];
    });
  }
  /**
   * 把某个object赋值到container[key]的map下，map存在就直接赋值，map不存在则先创建再赋值，确保map引用无变化
   * @param {*} container 对象容器
   * @param {*} key 字段名
   * @param {*} objectToBeenAssign 等待赋值的object
   */

  function safeAssignToMap(container, key, objectToBeenAssign) {
    var map = container[key];
    if (!map) map = container[key] = {};
    safeAssignObjectValue(map, objectToBeenAssign);
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
  } // 在 object[key]存在且deepClear为true时，传入的reset会被忽略
  // 传入deepClear是为了保持引用不变

  function clearObject(object, excludeKeys, reset, deepClear) {
    if (excludeKeys === void 0) {
      excludeKeys = [];
    }

    if (deepClear === void 0) {
      deepClear = false;
    }

    if (Array.isArray(object)) {
      var retainKeys = [];
      excludeKeys.forEach(function (key) {
        if (object.includes(key)) retainKeys.push(key);
      });
      object.length = 0;
      retainKeys.forEach(function (key) {
        return object.push(key);
      });
    } else Object.keys(object).forEach(function (key) {
      if (excludeKeys.includes(key)) ; else {
        var subMap = object[key];

        if (deepClear && subMap) {
          okeys(subMap).forEach(function (key) {
            return delete subMap[key];
          });
        } else {
          if (reset) object[key] = reset;else delete object[key];
        }
      }
    });
  }
  function okeys(obj) {
    return Object.keys(obj);
  }
  function convertToStandardEvent(e) {
    var ret = null; // avoid Warning: This synthetic event is reused for performance reasons. If you're seeing this...
    // call e.persist() @see https://reactjs.org/docs/events.html#event-pooling

    if (e) {
      if (e.persist) e.persist();

      if (e.currentTarget && e.type) {
        ret = e;
      } else if (e.nativeEvent && e.target) {
        e.currentTarget = e.target;
        ret = e;
      }
    }

    return ret;
  } //防止有些在线IDE，绑定失败

  function bindToWindow(key, toBindObj, targetObj) {
    var attachToTarget = function attachToTarget(targetObj) {
      if (!window) return;
      if (targetObj) targetObj[key] = toBindObj;else window[key] = toBindObj;
    };

    if (window) {
      attachToTarget(targetObj);
    } else {
      setTimeout(function () {
        attachToTarget(targetObj);
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
  function extractChangedState(oldState, partialNewState, moduleOpt) {
    var changedState = {};
    var setted = false;
    var extractRefChangedState = runtimeVar.extractRefChangedState,
        extractModuleChangedState = runtimeVar.extractModuleChangedState,
        nonObjectValueCompare = runtimeVar.nonObjectValueCompare,
        objectValueCompare = runtimeVar.objectValueCompare;
    var needExtractChangedState = moduleOpt ? extractModuleChangedState : extractRefChangedState; // 非模块调用

    if (!moduleOpt) {
      if (!needExtractChangedState) return partialNewState;
      if (!nonObjectValueCompare && !objectValueCompare) return partialNewState;
    }

    if (partialNewState) {
      okeys(partialNewState).forEach(function (key) {
        var oldVal = oldState[key];
        var newVal = partialNewState[key];
        var valType = typeof newVal;
        var isNotEqual = true;

        if (valType !== 'object') {
          // 比较非object类型的值
          if (nonObjectValueCompare) isNotEqual = oldVal !== newVal;
        } else {
          // 比较object类型的值
          if (objectValueCompare) isNotEqual = oldVal !== newVal;
        }

        if (isNotEqual) {
          if (moduleOpt) {
            moduleOpt.prevStateContainer[key] = oldVal;
            moduleOpt.incStateVer(key);
            oldState[key] = newVal;
          }

          changedState[key] = newVal;
          setted = true;
        }
      });
    }

    return setted ? changedState : null;
  }
  function differStateKeys(oldState, newState) {
    var changed = [],
        setted = []; // const unchanged=[];

    okeys(newState).forEach(function (k) {
      var newVal = newState[k];

      if (newVal !== undefined) {
        setted.push(k);
        if (newVal !== oldState[k]) changed.push(k); // else unchanged.push(k);
      }
    });
    return {
      changed: changed,
      setted: setted
    };
  }
  function removeArrElements(arr, toRemoveArr) {
    var newArr = [];
    arr.forEach(function (item) {
      if (!toRemoveArr.includes(item)) newArr.push(item);
    });
    return newArr;
  }
  function getRegisterOptions(options) {
    if (options === void 0) {
      options = {};
    }

    if (typeof options === 'string') {
      return {
        module: options
      };
    } else {
      return Object.assign({
        module: MODULE_DEFAULT
      }, options);
    }
  }
  var ccns = '';
  function setCcNamespace(name) {
    ccns = name;
  }
  function getCcNamespace() {
    return ccns;
  }
  function getWinCc() {
    if (ccns) return window.mcc[ccns];
    return window.cc;
  }
  function makeCommitHandler() {
    var state = null;

    var commit = function commit(partialState) {
      if (!state) state = {};
      Object.assign(state, partialState);
    };

    var clear = function clear() {
      return state = null;
    };

    var getFnCommittedState = function getFnCommittedState() {
      return state;
    };

    return {
      commit: commit,
      clear: clear,
      getFnCommittedState: getFnCommittedState
    };
  }
  function isOnlineEditor() {
    var result = false;

    if (window) {
      if (window.name === 'previewFrame' //for stackblitz
      || window.__SANDBOX_DATA__ // for codesandbox
      || window.BrowserFS // for codesandbox
      ) {
          result = true;
        }
    }

    return result;
  }
  function makeCallInfo(module) {
    return {
      payload: null,
      renderKey: '',
      delay: -1,
      module: module,
      fnName: ''
    };
  }
  function evalState(state) {
    if (state === void 0) {
      state = {};
    }

    var ret = typeof state === 'function' ? state() : state;

    if (!isPJO(ret)) {
      throw new Error("state " + NOT_A_JSON);
    }

    return ret;
  }

  function _getValue(obj, keys, lastKeyIndex, keyIndex) {
    var key = keys[keyIndex];

    if (lastKeyIndex === keyIndex) {
      return obj[key];
    } else {
      return _getValue(obj[key], keys, lastKeyIndex, ++keyIndex);
    }
  }

  function getValueByKeyPath(obj, keyPath) {
    var keys = keyPath.split('.');
    return _getValue(obj, keys, keys.length - 1, 0);
  }
  function isDepKeysValid(depKeys) {
    return Array.isArray(depKeys) || depKeys === '-' || depKeys === '*';
  }
  function checkDepKeys(depKeys) {
    if (depKeys && !isDepKeysValid(depKeys)) {
      throw new Error("depKeys must an array , '*' or '-'");
    }
  }
  function makeFnDesc(fn, depKeysOrOpt, check) {
    if (check === void 0) {
      check = true;
    }

    // 防止显式的传递null
    var _depKeysOrOpt = depKeysOrOpt || {};

    var desc = {
      fn: fn
    };
    var assignFrom = isDepKeysValid(_depKeysOrOpt) ? {
      depKeys: _depKeysOrOpt
    } : _depKeysOrOpt;
    check && checkDepKeys(assignFrom.depKeys);
    return Object.assign(desc, assignFrom);
  }
  function delay(ms) {
    if (ms === void 0) {
      ms = 0;
    }

    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }
  function getErrStackKeywordLoc(err, keyword, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var errStack = err.stack;
    var arr = errStack.split('\n');
    var len = arr.length;
    var curLocation = '';

    for (var i = 0; i < len; i++) {
      if (arr[i].includes(keyword)) {
        curLocation = arr[i + offset];
        break;
      }
    }

    return curLocation;
  }

  function getCacheDataContainer() {
    return {
      module: {
        computed: {},
        watch: {}
      },
      ref: {
        computed: {},
        watch: {},
        effect: {}
      }
    };
  }

  var cacheArea_pickedRetKeys_ = getCacheDataContainer();

  function _wrapFn(retKey, retKey_fn_, isLazy) {
    var _retKey_fn_$retKey = retKey_fn_[retKey],
        fn = _retKey_fn_$retKey.fn,
        depKeys = _retKey_fn_$retKey.depKeys,
        sort = _retKey_fn_$retKey.sort;
    return {
      retKey: retKey,
      fn: fn,
      depKeys: depKeys,
      isLazy: isLazy,
      sort: sort
    };
  } // asc sort


  var sortCb = function sortCb(o1, o2) {
    return o1.sort - o2.sort;
  };

  function clearCachedData() {
    cacheArea_pickedRetKeys_ = getCacheDataContainer();
  } // cate module | ref
  // type computed | watch

  function pickDepFns (isBeforeMount, cate, type, depDesc, stateModule, oldState, committedState, cUkey) {
    var moduleDep = depDesc[stateModule]; // it can be refModuleDep or moduleDep

    var pickedFns = []; // 针对type module， init-module-state时，已对_computedValueOri赋值了默认cuDesc，
    // 所以此时可以安全的直接判断非关系，而不用担心 {}对象存在

    if (isObjectNull(moduleDep)) return {
      pickedFns: pickedFns,
      setted: [],
      changed: [],
      retKey_stateKeys_: {}
    };
    var retKey_fn_ = moduleDep.retKey_fn_,
        retKey_lazy_ = moduleDep.retKey_lazy_,
        stateKey_retKeys_ = moduleDep.stateKey_retKeys_,
        retKey_stateKeys_ = moduleDep.retKey_stateKeys_,
        fnCount = moduleDep.fnCount;
    /** 首次调用 */

    if (isBeforeMount) {
      var retKeys = okeys(retKey_fn_);

      var _setted = okeys(committedState);

      var _changed = _setted;

      if (type === 'computed') {
        return {
          pickedFns: retKeys.map(function (retKey) {
            return _wrapFn(retKey, retKey_fn_, retKey_lazy_[retKey]);
          }).sort(sortCb),
          setted: _setted,
          changed: _changed,
          retKey_stateKeys_: retKey_stateKeys_
        };
      } // for watch


      retKeys.forEach(function (retKey) {
        var _retKey_fn_$retKey2 = retKey_fn_[retKey],
            fn = _retKey_fn_$retKey2.fn,
            immediate = _retKey_fn_$retKey2.immediate,
            depKeys = _retKey_fn_$retKey2.depKeys,
            sort = _retKey_fn_$retKey2.sort;
        if (immediate) pickedFns.push({
          retKey: retKey,
          fn: fn,
          depKeys: depKeys,
          sort: sort
        });
      });
      pickedFns.sort(sortCb);
      return {
        pickedFns: pickedFns,
        setted: _setted,
        changed: _changed,
        retKey_stateKeys_: retKey_stateKeys_
      };
    } // 这些目标stateKey的值发生了变化


    var _differStateKeys = differStateKeys(oldState, committedState),
        setted = _differStateKeys.setted,
        changed = _differStateKeys.changed;

    if (setted.length === 0) {
      return {
        pickedFns: pickedFns,
        setted: [],
        changed: [],
        retKey_stateKeys_: {}
      };
    } //用setted + changed + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns


    var cacheKey = setted.join(',') + '|' + changed.join(',') + '|' + stateModule; // 要求用户必须在setup里静态的定义完computed & watch，动态的调用computed & watch的回调因为缓存原因不会被触发

    var tmpNode = cacheArea_pickedRetKeys_[cate][type];
    var cachePool = cUkey ? safeGet(tmpNode, cUkey) : tmpNode;
    var cachedPickedRetKeys = cachePool[cacheKey];

    if (cachedPickedRetKeys) {
      // todo, for 2.5, call checkFnByDepPath with variable depKey_pathDepKeys_
      return {
        pickedFns: cachedPickedRetKeys.map(function (retKey) {
          return _wrapFn(retKey, retKey_fn_, retKey_lazy_[retKey]);
        }),
        setted: setted,
        changed: changed,
        retKey_stateKeys_: retKey_stateKeys_
      };
    }

    _pickFn(pickedFns, setted, changed, retKey_fn_, stateKey_retKeys_, retKey_lazy_, fnCount);

    cachePool[cacheKey] = pickedFns.map(function (v) {
      return v.retKey;
    }); // todo, for 2.5, call checkFnByDepPath with variable depKey_pathDepKeys_

    return {
      pickedFns: pickedFns,
      setted: setted,
      changed: changed,
      retKey_stateKeys_: retKey_stateKeys_
    };
  }

  function _pickFn(pickedFns, settedStateKeys, changedStateKeys, retKey_fn_, stateKey_retKeys_, retKey_lazy_, fnCount) {
    if (settedStateKeys.length === 0) return; // 把*的函数先全部挑出来, 有key的值发生变化了或者有设值行为

    var starRetKeys = stateKey_retKeys_['*'];

    if (starRetKeys) {
      var isKeyValChanged = changedStateKeys.length > 0;
      starRetKeys.forEach(function (retKey) {
        var _retKey_fn_$retKey3 = retKey_fn_[retKey],
            fn = _retKey_fn_$retKey3.fn,
            compare = _retKey_fn_$retKey3.compare,
            depKeys = _retKey_fn_$retKey3.depKeys,
            sort = _retKey_fn_$retKey3.sort;
        var toPush = {
          retKey: retKey,
          fn: fn,
          depKeys: depKeys,
          isLazy: retKey_lazy_[retKey],
          sort: sort
        };

        if (compare) {
          if (isKeyValChanged) pickedFns.push(toPush);
          return;
        }

        pickedFns.push(toPush);
      });
    } // 继续遍历settedStateKeys, 挑选出剩余的目标fn（非*相关的）


    if (pickedFns.length < fnCount) {
      (function () {
        var retKey_picked_ = {};
        var len = settedStateKeys.length;

        var _loop2 = function _loop2(i) {
          var stateKey = settedStateKeys[i];
          var retKeys = stateKey_retKeys_[stateKey]; //发生变化了的stateKey不一定在依赖列表里

          if (!retKeys) return "continue";
          retKeys.forEach(function (retKey) {
            //没有挑过的方法才挑出来
            if (!retKey_picked_[retKey]) {
              var _retKey_fn_$retKey4 = retKey_fn_[retKey],
                  fn = _retKey_fn_$retKey4.fn,
                  compare = _retKey_fn_$retKey4.compare,
                  depKeys = _retKey_fn_$retKey4.depKeys,
                  sort = _retKey_fn_$retKey4.sort;
              var canPick = true;

              if (compare && !changedStateKeys.includes(stateKey)) {
                canPick = false;
              }

              if (canPick) {
                retKey_picked_[retKey] = true;
                pickedFns.push({
                  retKey: retKey,
                  fn: fn,
                  depKeys: depKeys,
                  isLazy: retKey_lazy_[retKey],
                  sort: sort
                });
              }
            }
          });
          if (pickedFns.length === fnCount) return "break";
        };

        _loop: for (var i = 0; i < len; i++) {
          var _ret = _loop2(i);

          switch (_ret) {
            case "continue":
              continue;

            case "break":
              break _loop;
          }
        }
      })();
    }

    pickedFns.sort(sortCb);
  }

  function setPartialState(partialState, state, key) {
    var value = state[key];

    if (value !== undefined) {
      partialState[key] = value;
      return true;
    }

    return false;
  }

  function extractStateByKeys (state, stateKeys, returnNullIfEmpty, needIgnored) {
    if (stateKeys === void 0) {
      stateKeys = [];
    }

    if (returnNullIfEmpty === void 0) {
      returnNullIfEmpty = false;
    }

    if (needIgnored === void 0) {
      needIgnored = false;
    }

    var partialState = {},
        ignoredStateKeys = [],
        missKeyInState = false;

    if (!isPJO(state)) {
      return {
        partialState: returnNullIfEmpty ? null : partialState,
        isStateEmpty: true,
        ignoredStateKeys: ignoredStateKeys,
        missKeyInState: missKeyInState
      };
    }

    var isStateEmpty = true;
    var committedStateKeys = okeys(state);

    if (committedStateKeys.length >= stateKeys.length) {
      missKeyInState = true;
      stateKeys.forEach(function (key) {
        if (setPartialState(partialState, state, key)) isStateEmpty = false;
      });
      if (needIgnored) ignoredStateKeys = removeArrElements(committedStateKeys, stateKeys);
    } else {
      committedStateKeys.forEach(function (key) {
        if (stateKeys.includes(key)) {
          if (setPartialState(partialState, state, key)) isStateEmpty = false;
        } else {
          missKeyInState = true;
          if (needIgnored) ignoredStateKeys.push(key);
        }
      });
    }

    if (isStateEmpty && returnNullIfEmpty) partialState = null;
    return {
      partialState: partialState,
      isStateEmpty: isStateEmpty,
      ignoredStateKeys: ignoredStateKeys,
      missKeyInState: missKeyInState
    };
  }

  var isKeyValid = function isKeyValid(obj, key) {
    return typeof key !== "symbol" && Object.prototype.hasOwnProperty.call(obj, key);
  };
  /**
   * 用于传递给 computed 回调收集相关依赖
   * defComputed((newState, oldState)=>{
   *   // 此处的newState oldState即cuObState
   * })
   * @param {{[key:string]:any}} state 
   * @param {string[]} depKeys 
   */


  function makeCuObState (state, depKeys) {
    return new Proxy(state, {
      get: function get(target, key) {
        /**
         * 第一个isKeyValid判断，是为了防止误使用state算computed value，而触发了其他的key收集
         *   ctx.computed('count', n => {
         *     return n * 2;// 正确写法本应该是 return n.count * 2
         *    })
         *   // 本应该是 n.count * 2, 写为 n * 2 后，触发的key分别为
         *   // valueOf, toString, Symbol(...)
         */
        if (isKeyValid(target, key) && !depKeys.includes(key)) depKeys.push(key);
        return target[key];
      },
      // set: function (target, key) {
      set: function set() {
        // do nothing，拒绝用户在computed回调里修改state的值
        return true;
      }
    });
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var catchCcError = (function (err) {
    var errorHandler = runtimeHandler.errorHandler;
    if (errorHandler) errorHandler(err);else throw err;
  });

  var sigs = [SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR, SIG_MODULE_CONFIGURED, SIG_STATE_CHANGED, SIG_ASYNC_COMPUTED_START, SIG_ASYNC_COMPUTED_END, SIG_ASYNC_COMPUTED_ERR, SIG_ASYNC_COMPUTED_BATCH_START, SIG_ASYNC_COMPUTED_BATCH_END];
  var sig_cbs_ = {};
  sigs.forEach(function (sig) {
    return sig_cbs_[sig] = [];
  });

  function _pushSigCb(sigMap, sigOrSigs, cb) {
    function pushCb(sig, cb) {
      var cbs = sigMap[sig];

      if (cb) {
        cbs.push(cb);
      } else {
        console.warn("invalid sig[" + sig + "]");
      }
    }

    if (Array.isArray(sigOrSigs)) {
      sigOrSigs.forEach(function (sig) {
        pushCb(sig, cb);
      });
    } else {
      pushCb(sigOrSigs, cb);
    }
  }

  function clearCbs() {
    sigs.forEach(function (sig) {
      return sig_cbs_[sig].length = 0;
    });
  }
  function send(sig, payload) {
    var cbs = sig_cbs_[sig];
    cbs.forEach(function (cb) {
      return cb({
        sig: sig,
        payload: payload
      });
    });
  }
  function on(sigOrSigs, cb) {
    _pushSigCb(sig_cbs_, sigOrSigs, cb);
  }

  var waKey_uKeyMap_$1 = waKey_uKeyMap_,
      waKey_staticUKeyMap_$1 = waKey_staticUKeyMap_;

  function triggerReRender(ref) {
    if (!ref) return; // 对于挂载好了还未卸载的实例，才有必要触发重渲染

    if (ref.__$$isUnmounted === false) {
      var refCtx = ref.ctx;

      refCtx.__$$ccForceUpdate();
    }
  }

  function executeCuInfo(_x) {
    return _executeCuInfo.apply(this, arguments);
  }

  function _executeCuInfo() {
    _executeCuInfo = _asyncToGenerator(
    /*#__PURE__*/
    regenerator.mark(function _callee(cuInfo) {
      var fns, len, sourceType, ref, module, fnAsync, fnRetKeys, cuRetContainer, retKey_stateKeys_, isModule, stateKeys, curRetKey, i, fn, isAsync, retKey, ret, toSend, uKeyMap, uKeys;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              fns = cuInfo.fns;
              len = fns.length;

              if (!(len === 0)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return");

            case 5:
              _context.next = 7;
              return delay();

            case 7:
              sourceType = cuInfo.sourceType, ref = cuInfo.ref, module = cuInfo.module, fnAsync = cuInfo.fnAsync, fnRetKeys = cuInfo.fnRetKeys, cuRetContainer = cuInfo.cuRetContainer, retKey_stateKeys_ = cuInfo.retKey_stateKeys_;
              isModule = sourceType !== CATE_REF;
              stateKeys = [];
              curRetKey = '';
              _context.prev = 11;
              send(SIG_ASYNC_COMPUTED_BATCH_START, {
                module: module
              });
              i = 0;

            case 14:
              if (!(i < len)) {
                _context.next = 34;
                break;
              }

              fn = fns[i];
              isAsync = fnAsync[i];
              retKey = fnRetKeys[i];
              curRetKey = retKey;
              ret = void 0;
              send(SIG_ASYNC_COMPUTED_START, {
                module: module,
                retKey: retKey
              });

              if (!isAsync) {
                _context.next = 27;
                break;
              }

              _context.next = 24;
              return fn();

            case 24:
              ret = _context.sent;
              _context.next = 28;
              break;

            case 27:
              ret = fn();

            case 28:
              cuRetContainer[retKey] = makeCuPackedValue(false, ret);
              send(SIG_ASYNC_COMPUTED_END, {
                module: module,
                retKey: retKey
              });
              if (isModule) stateKeys = stateKeys.concat(retKey_stateKeys_[retKey]);

            case 31:
              i++;
              _context.next = 14;
              break;

            case 34:
              send(SIG_ASYNC_COMPUTED_BATCH_END, {
                module: module
              });
              _context.next = 41;
              break;

            case 37:
              _context.prev = 37;
              _context.t0 = _context["catch"](11);

              if (isModule) {
                toSend = {
                  module: module,
                  err: _context.t0,
                  retKey: curRetKey
                };
                send(SIG_ASYNC_COMPUTED_ERR, toSend);
                send(SIG_ASYNC_COMPUTED_BATCH_END, toSend);
              }

              catchCcError(_context.t0);

            case 41:
              if (isModule) {
                //  让所有正确执行完毕的计算函数关联到的实例能够被触发重渲染
                stateKeys = Array.from(new Set(stateKeys));
                uKeyMap = {};
                stateKeys.forEach(function (stateKey) {
                  var waKey = module + "/" + stateKey; // 利用assign不停的去重

                  Object.assign(uKeyMap, waKey_uKeyMap_$1[waKey], waKey_staticUKeyMap_$1[waKey]);
                });
                uKeys = okeys(uKeyMap);
                uKeys.forEach(function (refKey) {
                  triggerReRender(refs[refKey]);
                });
              } else {
                triggerReRender(ref);
              }

              _context.next = 47;
              break;

            case 44:
              _context.prev = 44;
              _context.t1 = _context["catch"](0);
              catchCcError(_context.t1);

            case 47:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 44], [11, 37]]);
    }));
    return _executeCuInfo.apply(this, arguments);
  }

  //  cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
  //
  //  receive cur in rendering period as below
  //  cur: {a:'val', c:'val', d:'val'}
  //
  //  after render
  //  cur: {a:1, c:1, d:1} compare: {a:1, b:2, c:1, d:1} compareCount=4 nextCompare:{a:2, c:2, d:2}
  //
  //  then concent know 'b' should delete from dep because its value is 2, 
  //  if compare key count become bigger than previous render(4>3) or compare key values include 2, then cache will be expired
  //
  //  before next render, assign nextCompare to compare, clear cur and nextCompare
  //  cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}

  function updateDep (ref, module, key, isForModule) {
    var refCtx = ref.ctx;

    if (refCtx.__$$inBM === true || // 还处于beforeMount步骤
    refCtx.__$$renderStatus === START) {
      var ccUniqueKey = refCtx.ccUniqueKey;

      if (!isForModule) {
        // for ref connect
        var waKey = makeWaKey(module, key); // 未挂载时，是refWatch 或者 refComputed 函数里读取了moduleComputed的值间接推导出来的依赖stateKey
        // 则写到static块里，防止依赖丢失

        if (refCtx.__$$inBM === true) {
          refCtx.__$$staticWaKeys[waKey] = 1;
          return;
        } // 处于非自动收集状态则忽略，依赖在buildRefCtx时已记录


        if (refCtx.connect[module] !== '-') return;
        var __$$curConnWaKeys = refCtx.__$$curConnWaKeys,
            __$$compareConnWaKeys = refCtx.__$$compareConnWaKeys,
            __$$nextCompareConnWaKeys = refCtx.__$$nextCompareConnWaKeys,
            __$$nextCompareConnWaKeyCount = refCtx.__$$nextCompareConnWaKeyCount;
        mapInsM(waKey, ccUniqueKey);
        __$$curConnWaKeys[module][key] = 1;
        __$$compareConnWaKeys[module][key] = 1;
        var tmpMap = __$$nextCompareConnWaKeys[module];

        if (!tmpMap[key]) {
          tmpMap[key] = 2;
          __$$nextCompareConnWaKeyCount[module]++;
        }
      } else {
        // for ref module
        var refModule = refCtx.module; // 这个stateKey不是模块的stateKey，则忽略依赖记录
        // 此处不能用privStateKeys来判断，用户有可能动态的写入新的key
        // if(!refCtx.privStateKeys.includes(key)){

        if (!moduleName_stateKeys_[refModule].includes(key)) {
          return;
        }

        var _waKey = makeWaKey(refModule, key);

        if (refCtx.__$$inBM === true) {
          refCtx.__$$staticWaKeys[_waKey] = 1;
          return;
        } // 处于非自动收集状态则忽略


        if (refCtx.watchedKeys !== '-') return;
        var __$$curWaKeys = refCtx.__$$curWaKeys,
            __$$compareWaKeys = refCtx.__$$compareWaKeys,
            __$$nextCompareWaKeys = refCtx.__$$nextCompareWaKeys;
        mapInsM(_waKey, ccUniqueKey);
        __$$curWaKeys[key] = 1;
        __$$compareWaKeys[key] = 1;

        if (!__$$nextCompareWaKeys[key]) {
          __$$nextCompareWaKeys[key] = 2;
          refCtx.__$$nextCompareWaKeyCount++;
        }
      }
    }
  }

  /**
   * 为每一个实例单独建立了一个获取计算结果的观察容器，方便写入依赖
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var _computedValueOri$1 = computedMap._computedValueOri,
      _computedValue$1 = computedMap._computedValue,
      _computedRaw$1 = computedMap._computedRaw,
      _computedDep$1 = computedMap._computedDep; // refModuleCuDep 来自 ref.ctx.computedDep

  function writeRetKeyDep(refModuleCuDep, ref, module, retKey, isForModule) {
    var retKey_stateKeys_ = refModuleCuDep.retKey_stateKeys_; // 所有组件都自动连接到$$global模块，但是未必有对$$global模块的retKey依赖

    if (!retKey_stateKeys_) return;
    var stateKeys = retKey_stateKeys_[retKey] || [];
    stateKeys.forEach(function (stateKey) {
      updateDep(ref, module, stateKey, isForModule);
    });
  }
  /** 
    此函数被以下两种场景调用，
    1 模块首次运行computed&watch时
    2 实例首次运行computed&watch时
    用于生成cuVal透传给计算函数fnCtx.cuVal,
    用户读取cuVal的结果时，收集到当前计算函对其他计算函数的依赖关系
    
      module:
        function fullName(n, o, f){
            return n.firstName + n.lastName;
        }
      
      // 此时funnyName依赖是 firstName lastName age
      function funnyName(n, o, f){
        const { fullName } = f.cuVal;
        return fullName + n.age;
      }
      
      ref:
      ctx.computed('fullName',(n, o, f)=>{
        return n.firstName + n.lastName;
      })
      
      // 此时funnyName依赖是 firstName lastName age
      ctx.computed('funnyName',(n, o, f)=>{
        const { fullName } = f.cuVal;
        return fullName + n.age;
      })
   */


  function getSimpleObContainer(retKey, sourceType, fnType, module,
  /**@type ICtx*/
  refCtx, retKeys, referInfo) {
    var oriCuContainer, oriCuObContainer, computedRaw;

    if (CATE_MODULE === sourceType) {
      oriCuContainer = _computedValueOri$1[module];
      oriCuObContainer = _computedValue$1[module];
      computedRaw = _computedRaw$1[module];
    } else {
      oriCuContainer = refCtx.refComputedOri;
      oriCuObContainer = refCtx.refComputedValue;
      computedRaw = refCtx.computedRetKeyFns;
    } // create cuVal


    return new Proxy(oriCuContainer, {
      get: function get(target, otherRetKey) {
        var fnInfo = sourceType + " " + fnType + " retKey[" + retKey + "]"; // 1 防止用户从 cuVal读取不存在的key
        // 2 首次按序执行所有的computed函数时，前面的计算函数取取不到后面的计算结果，收集不到依赖，所以这里强制用户要注意计算函数的书写顺序

        if (hasOwnProperty.call(oriCuContainer, otherRetKey)) {
          if (isAsyncFn(computedRaw[otherRetKey])) {
            referInfo.hasAsyncCuRefer = true; //  不允许读取异步计算函数结果做二次计算，隔离一切副作用，确保依赖关系简单和纯粹
            // throw new Error(`${fnInfo},  get an async retKey[${otherRetKey}] from cuVal is not allowed`);
          }

          retKeys.push(otherRetKey);
        } else {
          justWarning(fnInfo + " get cuVal invalid retKey[" + otherRetKey + "]");
        } // 从已定义defineProperty的计算结果容器里获取结果


        return oriCuObContainer[otherRetKey];
      },
      set: function set() {
        return true;
      }
    });
  } // isForModule : true for module , false for connect

  function makeCuRefObContainer (ref, module, isForModule, isRefCu) {
    if (isForModule === void 0) {
      isForModule = true;
    }

    if (isRefCu === void 0) {
      isRefCu = false;
    }

    // 注意isRefCu为true时，beforeMount时做了相关的赋值操作，保证了读取ref.ctx下目标属性是安全的
    var oriCuContainer = isRefCu ? ref.ctx.refComputedOri : _computedValueOri$1[module];
    var oriCuObContainer = isRefCu ? ref.ctx.refComputedValue : _computedValue$1[module];
    if (!oriCuContainer) return {}; // 为普通的计算结果容器建立代理对象

    return new Proxy(oriCuContainer, {
      get: function get(target, retKey) {
        // 防止用户从 cuVal读取不存在的key
        if (hasOwnProperty.call(oriCuContainer, retKey)) {
          // 由refComputed.{keyName}取值触发
          if (isRefCu) {
            var computedDep = ref.ctx.computedDep;
            Object.keys(computedDep).forEach(function (m) {
              writeRetKeyDep(computedDep[m], ref, m, retKey, isForModule);
            });
          } // 由moduleComputed.{keyName} 或者 connectedComputed.{moduleName}.{keyName} 取值触发
          else {
              writeRetKeyDep(_computedDep$1[module], ref, module, retKey, isForModule);
            }
        } // 从已定义defineProperty的计算结果容器里获取结果


        return oriCuObContainer[retKey];
      },
      set: function set(target, retKey, value) {
        target[retKey] = value;
        return true;
      }
    });
  }

  var noCommit = function noCommit(tip, asIs) {
    return justWarning(tip + " call commit or commitCu as it is " + asIs);
  }; // 记录某个cuRetKey引用过哪些staticCuRetKeys
  // 直接引用或者间接引用过staticCuRetKey都会记录在列表内


  var modCuRetKey_referStaticCuRetKeys_ = {};
  var refCuRetKey_referStaticCuRetKeys_ = {};

  function getCuRetKeyRSListMap(sourceType, module, ccUniqueKey) {
    if (sourceType == CATE_MODULE) {
      return safeGet(modCuRetKey_referStaticCuRetKeys_, module);
    } else {
      return safeGet(refCuRetKey_referStaticCuRetKeys_, ccUniqueKey);
    }
  }

  function getCuRetKeyRSList(cuRetKey, sourceType, module, ccUniqueKey) {
    var map = getCuRetKeyRSListMap(sourceType, module, ccUniqueKey);
    return safeGetArray(map, cuRetKey);
  }

  function clearCuRefer() {
    modCuRetKey_referStaticCuRetKeys_ = {};
    refCuRetKey_referStaticCuRetKeys_ = {};
  }

  function getCuDep(refCtx, sourceType) {
    return sourceType === CATE_REF ? refCtx.computedDep : computedMap._computedDep;
  }

  function setStateKeyRetKeysMap(refCtx, sourceType, fnType, stateModule, retKey, keys, isKeysDep) {
    if (isKeysDep === void 0) {
      isKeysDep = true;
    }

    if (keys.length === 0) return;
    var modDep, cuModDep;

    if (sourceType === CATE_REF) {
      // 由ref发起调用，refCtx是肯定有值的
      var computedDep = refCtx.computedDep;
      var depDesc = fnType === FN_CU ? computedDep : refCtx.watchDep;
      cuModDep = safeGet(computedDep, stateModule);
      modDep = safeGet(depDesc, stateModule);
    } else {
      var cuDep = computedMap._computedDep;

      var _depDesc = fnType === FN_CU ? cuDep : watch._watchDep;

      cuModDep = safeGet(cuDep, stateModule);
      modDep = safeGet(_depDesc, stateModule);
    }

    var stateKey_retKeys_ = safeGet(modDep, 'stateKey_retKeys_');
    var retKey_stateKeys_ = safeGet(modDep, 'retKey_stateKeys_');

    var updateRelationship = function updateRelationship(depKeys) {
      var stateKeys = safeGetArray(retKey_stateKeys_, retKey);
      depKeys.forEach(function (sKey) {
        var retKeys = safeGetArray(stateKey_retKeys_, sKey); // 此处判断一下retKeys，谨防用户直接在computed里操作obState, 这里拿到的sKey是一堆原型链上key，如`valueOf`等

        if (Array.isArray(retKeys) && !retKeys.includes(retKey)) retKeys.push(retKey);
        if (!stateKeys.includes(sKey)) stateKeys.push(sKey);
      });
    };

    if (isKeysDep) {
      // keys is depKeys
      updateRelationship(keys);
    } else {
      // keys is retKeys, 将retKeys里各自retKey的stateKeys转移给目标retKey
      keys.forEach(function (sourceRetKey) {
        // 这里取的是cu模块的retKey_stateKeys_
        var retKey_stateKeys_ = safeGet(cuModDep, 'retKey_stateKeys_');
        var sourceStateKeys = retKey_stateKeys_[sourceRetKey] || [];
        updateRelationship(sourceStateKeys);
      });
    }
  }

  function getRetKeyFnMap(refCtx, sourceType, stateModule) {
    // 始终从_computedDep 取retKey_fn_，来判断commitCu提交的retKey是否合法
    if (sourceType === CATE_REF) {
      return refCtx.computedRetKeyFns;
    } else {
      var moduleDep = computedMap._computedDep[stateModule] || {};
      return moduleDep.retKey_fn_ || {};
    }
  }

  function mapRSList(cuRetKey, referCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule) {
    var cuRetKey_referStaticCuRetKeys_ = getCuRetKeyRSListMap(cuRetKey, sourceType, stateModule, ccUniqueKey);
    var retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);
    var referStaticCuRetKeys = safeGetArray(cuRetKey_referStaticCuRetKeys_, cuRetKey);
    referCuRetKeys.forEach(function (referCuRetKey) {
      var fnDesc = retKey_fn_[referCuRetKey]; // 直接引用

      if (fnDesc.isStatic) {
        referStaticCuRetKeys.push(referCuRetKey);
      } else {
        var tmpRSList = safeGetArray(cuRetKey_referStaticCuRetKeys_, referCuRetKey); // 把引用的referCuRetKey对应的staticCuRetKey列表记录到当前cuRetKey的staticCuRetKey列表记录上
        // 因为computed函数是严格按需执行的，所以此逻辑能够成立

        tmpRSList.forEach(function (staticCuRetKey) {
          return noDupPush(referStaticCuRetKeys, staticCuRetKey);
        });
      }
    });
  }

  var STOP_FN = Symbol('sf'); // fnType: computed watch
  // sourceType: module ref
  // initDeltaCommittedState 会在整个过程里收集所有的提交状态

  function executeDepFns(ref, stateModule, refModule, oldState, finder, committedState, initNewState, initDeltaCommittedState, callInfo, isFirstCall, fnType, sourceType, computedContainer, mergeToDelta) {
    if (ref === void 0) {
      ref = {};
    }

    if (mergeToDelta === void 0) {
      mergeToDelta = true;
    }

    var refCtx = ref.ctx;
    var ccUniqueKey = refCtx ? refCtx.ccUniqueKey : ''; // while循环结束后，收集到的所有的新增或更新state

    var committedStateInWhile = {};
    var nextTickCuInfo = {
      sourceType: sourceType,
      ref: ref,
      module: stateModule,
      fns: [],
      fnAsync: [],
      fnRetKeys: [],
      cuRetContainer: computedContainer
    };
    var whileCount = 0;
    var curStateForComputeFn = committedState;
    var hasDelta = false;

    var _loop = function _loop() {
      whileCount++; // 因为beforeMountFlag为true的情况下，finder里调用的pickDepFns会挑出所有函数，
      // 这里必需保证只有第一次循环的时候取isFirstCall的实际值，否则一定取false，（要不然就陷入无限死循环，每一次都是true，每一次都挑出所有dep函数执行）

      var beforeMountFlag = whileCount === 1 ? isFirstCall : false;

      var _finder = finder(curStateForComputeFn, beforeMountFlag),
          pickedFns = _finder.pickedFns,
          setted = _finder.setted,
          changed = _finder.changed,
          retKey_stateKeys_ = _finder.retKey_stateKeys_;

      nextTickCuInfo.retKey_stateKeys_ = retKey_stateKeys_;
      if (!pickedFns.length) return "break";

      var _makeCommitHandler = makeCommitHandler(),
          commit = _makeCommitHandler.commit,
          getFnCommittedState = _makeCommitHandler.getFnCommittedState;

      var _makeCommitHandler2 = makeCommitHandler(),
          commitCu = _makeCommitHandler2.commit,
          getRetKeyCu = _makeCommitHandler2.getFnCommittedState,
          clearCu = _makeCommitHandler2.clear;

      pickedFns.forEach(function (_ref) {
        var retKey = _ref.retKey,
            fn = _ref.fn,
            depKeys = _ref.depKeys,
            isLazy = _ref.isLazy;
        var keyInfo = sourceType + " " + fnType + " retKey[" + retKey + "]";
        var tip = keyInfo + " can't"; // 异步计算的初始值

        var initialVal = '';
        var isInitialValSetted = false;
        var fnCtx = {
          retKey: retKey,
          callInfo: callInfo,
          isFirstCall: isFirstCall,
          commit: commit,
          commitCu: commitCu,
          setted: setted,
          changed: changed,
          // 在sourceType为module时, 如果非首次计算
          // computedContainer只是一个携带defineProperty的计算结果收集容器，没有收集依赖行为
          cuVal: computedContainer,
          committedState: curStateForComputeFn,
          deltaCommittedState: initDeltaCommittedState,
          stateModule: stateModule,
          refModule: refModule,
          oldState: oldState,
          refCtx: refCtx,
          setInitialVal: function setInitialVal() {
            beforeMountFlag && justWarning("non async " + keyInfo + " call setInitialVal is unnecessary");
          }
        }; // 循环里的首次计算且是自动收集状态，注入代理对象，收集计算&观察依赖

        var needCollectDep = beforeMountFlag && depKeys === '-'; // 用户通过cuVal读取其他计算结果时，记录cuRetKeys，用于辅助下面计算依赖

        var collectedCuRetKeys = []; // 读取newState时，记录stateKeys，用于辅助下面计算依赖

        var collectedDepKeys = []; // 对于computed，首次计算时会替换为obContainer用于收集依赖
        // !!!对于watch，immediate为true才有机会替换为obContainer收集到依赖

        var referInfo = {
          hasAsyncCuRefer: false
        };

        if (needCollectDep) {
          // 替换cuVal，以便动态的收集到computed&watch函数里读取cuVal时计算相关依赖
          fnCtx.cuVal = getSimpleObContainer(retKey, sourceType, fnType, stateModule, refCtx, collectedCuRetKeys, referInfo);
        }

        if (fnType === FN_CU) {
          var isCuFnAsync = isAsyncFn(fn);

          if (isLazy || isCuFnAsync) {
            // lazyComputed 和 asyncComputed 不能调用commit commitCu，以隔绝副作用
            var asIs = isLazy ? 'lazy' : 'async computed';

            fnCtx.commit = function () {
              return noCommit(tip, asIs);
            };

            fnCtx.commitCu = fnCtx.commit;
            if (isCuFnAsync) fnCtx.setInitialVal = function (val) {
              initialVal = val;
              isInitialValSetted = true; // 这里阻止异步计算函数的首次执行，交给executeAsyncCuInfo去触发

              if (beforeMountFlag) throw STOP_FN;
            };
          }

          if (isLazy) {
            computedContainer[retKey] = makeCuPackedValue(isLazy, null, true, fn, initNewState, oldState, fnCtx);
          } else {
            var newStateArg = initNewState,
                oldStateArg = oldState; // 首次计算时，new 和 old是同一个对象，方便用于收集depKeys

            if (needCollectDep) {
              newStateArg = oldStateArg = makeCuObState(initNewState, collectedDepKeys);
            }

            var computedRet; // 异步函数首次执行时才去调用它，仅为了收集依赖

            if (isCuFnAsync) {
              if (beforeMountFlag) {
                fn(newStateArg, oldStateArg, fnCtx)["catch"](function (err) {
                  if (err !== STOP_FN) throw err;
                });
              }
            } else {
              computedRet = fn(newStateArg, oldStateArg, fnCtx);
            }

            if (isCuFnAsync || referInfo.hasAsyncCuRefer) {
              // 首次计算时需要赋初始化值
              if (beforeMountFlag) {
                if (!isInitialValSetted) {
                  throw new Error("async " + keyInfo + " forget call setInitialVal");
                }

                computedRet = initialVal;
              } // 不做任何新的计算，还是赋值原来的结果
              // 新的结果等待 asyncComputedMgr 来计算并触发相关实例重渲染
              else computedRet = computedContainer[retKey]; // 替换掉setInitialVal，使其失效


              fnCtx.setInitialVal = noop;

              fnCtx.commit = function () {
                return noCommit(tip, 'async computed or it refers async computed ret');
              };

              fnCtx.commitCu = fnCtx.commit; //安排到nextTickCuInfo里，while结束后单独触发它们挨个按需计算

              nextTickCuInfo.fns.push(function () {
                return fn(newStateArg, oldStateArg, fnCtx);
              });
              nextTickCuInfo.fnAsync.push(isCuFnAsync);
              nextTickCuInfo.fnRetKeys.push(retKey);
            } // 记录计算结果


            computedContainer[retKey] = makeCuPackedValue(false, computedRet);

            if (needCollectDep) {
              // 在computed函数里读取了newState的stateKey，需要将其记录到当前retKey的依赖列表上
              // 以便能够在相应stateKey值改变时，能够正确命中该computed函数
              setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedDepKeys); // 在computed里读取cuVal里的其他retKey结果, 要将其他retKey对应的stateKeys写到当前retKey的依赖列表上，
              // 以便能够在相应stateKey值改变时，能够正确命中该computed函数

              setStateKeyRetKeysMap(refCtx, sourceType, FN_CU, stateModule, retKey, collectedCuRetKeys, false);
              mapRSList(retKey, collectedCuRetKeys, refCtx, ccUniqueKey, sourceType, stateModule);
            }
          }
        } else {
          // watch
          var tmpInitNewState = initNewState;
          var tmpOldState = oldState; // 首次触发watch时，才传递ob对象，用于收集依赖

          if (needCollectDep) {
            tmpInitNewState = makeCuObState(initNewState, collectedDepKeys); //new 和 old是同一个对象，方便用于收集depKeys

            tmpOldState = tmpInitNewState;
          }

          fn(tmpInitNewState, tmpOldState, fnCtx); // 首次触发watch时, 才记录依赖

          if (needCollectDep) {
            // 在watch函数里读取了newState的stateKey，需要将其记录到当前watch retKey的依赖列表上
            // 以便能够在相应stateKey值改变时，能够正确命中该watch函数
            setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedDepKeys); // 在watch里读取了cuVal里的retKey结果，要将这些retKey对应的stateKey依赖附加到当前watch retKey的依赖列表上，
            // 以便能够在相应stateKey值改变时，能够正确命中该watch函数

            setStateKeyRetKeysMap(refCtx, sourceType, FN_WATCH, stateModule, retKey, collectedCuRetKeys, false);
          }
        } // refCompute&refWatch 里获取state、moduleState、connectedState的值收集到的depKeys要记录为ref的静态依赖


        if (needCollectDep && sourceType === CATE_REF) {
          collectedDepKeys.forEach(function (key) {
            return refCtx.__$$staticWaKeys[makeWaKey(stateModule, key)] = 1;
          }); // 注：refWatch直接读取了moduleComputed 或者 connectedComputed的值时也收集到了依赖
          // 逻辑在updateDep里判断__$$isBM来确定是不是首次触发
        } // computedContainer对于module computed fn里调用committedCu，是moduleComputed结果容器，
        // 对于ref computed fn里调用committedCu来说，是refComputed结果容器
        // 每一个retKey返回的committedCu都及时处理掉，因为下面setStateKeyRetKeysMap需要对此时的retKey写依赖


        var committedCuRet = getRetKeyCu();

        if (committedCuRet) {
          var retKey_fn_ = getRetKeyFnMap(refCtx, sourceType, stateModule);
          okeys(committedCuRet).forEach(function (cuRetKey) {
            // 模块计算函数里调用commitCu只能修改模块计算retKey
            // 实例计算函数里调用commitCu只能修改实例计算retKey
            var fnDesc = retKey_fn_[cuRetKey];
            if (!fnDesc) justWarning("commitCu:" + tip + " commit [" + cuRetKey + "], it is not defined"); // 由committedCu提交的值，可以统一当作非lazy值set回去，方便取的时候直接取
            else {
                // 检查提交目标只能是静态的cuRetKey
                if (fnDesc.isStatic) {
                  var RSList = getCuRetKeyRSList(cuRetKey, sourceType, stateModule, ccUniqueKey);

                  if (RSList.includes(cuRetKey)) {
                    // 直接或间接引用了这个cuRetKey，就不能去改变它，以避免死循环
                    justWarning("commitCu:" + tip + " change [" + cuRetKey + "], [" + retKey + "] referred [" + cuRetKey + "]");
                  } else {
                    computedContainer[cuRetKey] = makeCuPackedValue(false, committedCuRet[cuRetKey]);
                  }
                } else {
                  justWarning("commitCu:" + tip + " change [" + cuRetKey + "], it must have zero dep keys");
                }
              }
          });
          clearCu();
        }
      }); // 这里一次性处理所有computed or watch函数提交了然后合并后的state

      curStateForComputeFn = getFnCommittedState();

      if (curStateForComputeFn) {
        // toAssign may be null
        var assignCuState = function assignCuState(toAssign, mergeAssign) {
          if (mergeAssign === void 0) {
            mergeAssign = false;
          }

          // 确保finder函数只针对这一部分新提交的状态去触发computed or watch
          if (mergeAssign) Object.assign(curStateForComputeFn, toAssign);else curStateForComputeFn = toAssign;
          if (!curStateForComputeFn) return;
          Object.assign(committedStateInWhile, curStateForComputeFn);

          if (mergeToDelta) {
            Object.assign(initNewState, curStateForComputeFn);
            Object.assign(initDeltaCommittedState, curStateForComputeFn);
          } else {
            // 强行置为null，结束while循环  
            // mergeToDelta为false表示这是来自connectedRefs触发的 cu 或者 wa 函数
            // 此时传入的 initDeltaCommittedState 是模块state
            // 但是实例里 cu 或 wa 函数只能commit private state
            // 收集到 committedStateInWhile 后，在外面单独触发新的 computedForRef watchForRef过程
            curStateForComputeFn = null;
          }

          hasDelta = true;
        };

        var ensureCommittedState = function ensureCommittedState(fnCommittedState) {
          // !!! 确保实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
          // !!! 同时确保privState里的key是事先声明过的，而不是动态添加的
          var stateKeys = sourceType === 'ref' ? refCtx.privStateKeys : moduleName_stateKeys_[stateModule];

          var _extractStateByKeys = extractStateByKeys(fnCommittedState, stateKeys, true),
              partialState = _extractStateByKeys.partialState,
              ignoredStateKeys = _extractStateByKeys.ignoredStateKeys;

          if (ignoredStateKeys.length) {
            var reason = "they are not " + (sourceType === CATE_REF ? 'private' : 'module') + ", fn is " + sourceType + " " + fnType;
            justWarning("these state keys[" + ignoredStateKeys.join(',') + "] are invalid, " + reason);
          }

          return partialState; // 返回合法的提交状态
        };

        var partialState = ensureCommittedState(curStateForComputeFn);

        if (partialState) {
          assignCuState(partialState); // watch里提交了新的片段state，再次过一遍computed、watch函数

          if (fnType === FN_WATCH) {
            // const stateKey_retKeys_ = getStateKeyRetKeysMap(refCtx, sourceType, stateModule);
            var computedDep = getCuDep(refCtx, sourceType, stateModule);

            var _finder2 = function _finder2(committedState, isBeforeMount) {
              return pickDepFns(isBeforeMount, sourceType, FN_CU, computedDep, stateModule, oldState, committedState, ccUniqueKey);
            }; // 一轮watch函数执行结束，去触发对应的computed计算


            var _executeDepFns = executeDepFns(ref, stateModule, refModule, oldState, _finder2, partialState, initNewState, initDeltaCommittedState, callInfo, false, // 再次由watch发起的computed函数查找调用，irFirstCall，一定是false
            FN_CU, sourceType, computedContainer),
                _hasDelta = _executeDepFns.hasDelta,
                newCommittedState = _executeDepFns.newCommittedState;

            if (_hasDelta) {
              // see https://codesandbox.io/s/complex-cu-watch-chain-s9wzt, 
              // 输入 cc.setState('test', {k1:Date.now()})，确保k4 watch被触发
              var validCommittedState = ensureCommittedState(newCommittedState); // 让validCommittedState合并到curStateForComputeFn里，确保下一轮循环相关watch能被computed里提交的状态触发

              assignCuState(validCommittedState, true);
            }
          }
        }
      }

      if (whileCount > 2) {
        justWarning('fnCtx.commit may goes endless loop, please check your code'); // 清空，确保不再触发while循环

        curStateForComputeFn = null;
      }
    };

    while (curStateForComputeFn) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    executeCuInfo(nextTickCuInfo);
    return {
      hasDelta: hasDelta,
      newCommittedState: committedStateInWhile
    };
  }

  var _reducer;
  var _computedValue$2 = computedMap._computedValue;
  var okeys$1 = okeys,
      extractChangedState$1 = extractChangedState;

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

    var moduleComputedValue = _computedValue$2[module];
    var rootComputedDep = computedMap.getRootComputedDep();

    var curDepComputedFns = function curDepComputedFns(committedState, isFirstCall) {
      return pickDepFns(isFirstCall, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);
    };

    var rootWatchDep = watch.getRootWatchDep();

    var curDepWatchFns = function curDepWatchFns(committedState, isFirstCall) {
      return pickDepFns(isFirstCall, CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState);
    };

    var callerRef = ref || getDispatcher();
    var refModule = callerRef.module;
    var newState = Object.assign({}, moduleState, committedState);
    var deltaCommittedState = Object.assign({}, committedState);

    var _findDepFnsToExecute = executeDepFns(callerRef, module, refModule, moduleState, curDepComputedFns, deltaCommittedState, newState, deltaCommittedState, callInfo, false, 'computed', CATE_MODULE, moduleComputedValue),
        hasDeltaInCu = _findDepFnsToExecute.hasDelta;

    var _findDepFnsToExecute2 = executeDepFns(callerRef, module, refModule, moduleState, curDepWatchFns, deltaCommittedState, newState, deltaCommittedState, callInfo, false, 'watch', CATE_MODULE, moduleComputedValue),
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
      var _extractStateByKeys = extractStateByKeys(toSave, moduleName_stateKeys_[module], true),
          partialState = _extractStateByKeys.partialState;

      target = partialState;
    }

    var moduleState = _getState(module);

    var prevModuleState = _getPrevState(module);

    incModuleVer(module);
    return extractChangedState$1(moduleState, target, {
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

    return _ref2 = {}, _ref2[MODULE_CC] = {}, _ref2[MODULE_VOID] = {}, _ref2[MODULE_GLOBAL] = {}, _ref2[MODULE_DEFAULT] = {}, _ref2;
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
      return window && (window.webpackHotUpdate || isOnlineEditor());
    },
    runtimeVar: runtimeVar,
    runtimeHandler: runtimeHandler,
    isHot: false,
    reComputed: true,
    isStartup: false,
    moduleName_stateFn_: {},
    // 映射好模块的状态所有key并缓存住，用于提高性能
    moduleName_stateKeys_: moduleName_stateKeys_,
    // 记录模块是不是通过configure配置的
    moduleName_isConfigured_: {},

    /**
     * ccClassContext:{
     *   module,
     *   ccClassKey,
     *   // renderKey机制影响的类范围，默认只影响调用者所属的类，如果有别的类观察了同一个模块的某个key，这个类的实例是否触发渲染不受renderKey影响
     *   // 为 * 表示影响所有的类，即其他类实例都受renderKey机制影响。
     *   renderKeyClasses, 
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
        var stateKeys = safeGetArray(moduleName_stateKeys_, module);
        okeys$1(state).forEach(function (k) {
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
        return setStateByModule(MODULE_GLOBAL, partialGlobalState);
      },
      saveSharedState: saveSharedState,
      getGlobalState: function getGlobalState() {
        return _state[MODULE_GLOBAL];
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer),
      _caller: {},
      // _reducerRefCaller: {},//为实例准备的reducer caller
      _fnName_fullFnNames_: {},
      _module_fnNames_: {}
    },
    computed: computedMap,
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
    ccUKey_ref_: refs,

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
    waKey_uKeyMap_: waKey_uKeyMap_,
    waKey_staticUKeyMap_: waKey_staticUKeyMap_,
    refs: refs,
    info: {
      packageLoadTime: Date.now(),
      firstStartupTime: '',
      latestStartupTime: '',
      version: '2.8.8',
      author: 'fantasticsoul',
      emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
      tag: 'glaxy'
    },
    featureStr_classKey_: {},
    userClassKey_featureStr_: {},
    middlewares: [],
    plugins: [],
    pluginNameMap: {},
    permanentDispatcher: null,
    localStorage: null,
    recoverRefState: function recoverRefState() {},
    getModuleStateKeys: function getModuleStateKeys(m) {
      return ccContext.moduleName_stateKeys_[m];
    }
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

  /**
   * private variable, not bind in ccContext
   */
  var pendingModules = [];

  var isModuleNameCcLike$1 = isModuleNameCcLike,
      isModuleNameValid$1 = isModuleNameValid,
      vbi = verboseInfo,
      makeError$1 = makeError,
      okeys$2 = okeys;
  var store = ccContext.store,
      getModuleStateKeys = ccContext.getModuleStateKeys;
  /** 检查模块名，名字合法，就算检查通过 */

  function checkModuleNameBasically(moduleName) {
    if (!isModuleNameValid$1(moduleName)) {
      throw new Error("module[" + moduleName + "] writing is invalid!");
    }

    if (isModuleNameCcLike$1(moduleName)) {
      throw new Error("'$$cc' is a built-in module name for concent");
    }
  }
  /**
   * 检查模块名, moduleMustNotExisted 默认为true，
   * true表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
   * false表示【module名字合法】且【对应的moduleState存在】，才算检查通过
   * @param {string} moduleName 
   * @param {boolean} [moduleMustNotExisted=true] - true 要求模块应该不存在 ,false 要求模块状态应该已存在
   */

  function checkModuleName(moduleName, moduleMustNotExisted, vbiMsg) {
    if (moduleMustNotExisted === void 0) {
      moduleMustNotExisted = true;
    }

    if (vbiMsg === void 0) {
      vbiMsg = '';
    }

    var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

    var _state = store._state;
    checkModuleNameBasically(moduleName);

    if (moduleName !== MODULE_GLOBAL) {
      if (moduleMustNotExisted) {
        if (isObjectNotNull(_state[moduleName])) {
          //但是却存在了
          throw makeError$1(ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
        }
      } else {
        if (!_state[moduleName]) {
          //实际上却不存在
          throw makeError$1(ERR.CC_MODULE_NOT_FOUND, vbi(_vbiMsg));
        }
      }
    }
  }
  function checkModuleNameAndState(moduleName, moduleState, moduleMustNotExisted) {
    checkModuleName(moduleName, moduleMustNotExisted);

    if (!isPJO(moduleState)) {
      throw new Error("module[" + moduleName + "]'s state " + NOT_A_JSON);
    }
  }
  function checkStoredKeys(belongModule, storedKeys) {
    if (storedKeys === '*') {
      return;
    }

    if (Array.isArray(storedKeys)) {
      checkKeys(belongModule, storedKeys, false, 'storedKeys invalid ');
      return;
    }

    throw new Error("storedKeys type err, " + STR_ARR_OR_STAR);
  }
  function checkKeys(module, keys, keyShouldBeModuleStateKey, extraInfo) {
    if (keyShouldBeModuleStateKey === void 0) {
      keyShouldBeModuleStateKey = true;
    }

    if (extraInfo === void 0) {
      extraInfo = '';
    }

    var keyword = keyShouldBeModuleStateKey ? '' : 'not ';

    var keyTip = function keyTip(name, keyword) {
      return extraInfo + "key[" + name + "] must " + keyword + "be a module state key";
    };

    var moduleStateKeys = getModuleStateKeys(module);
    keys.forEach(function (sKey) {
      var keyInModuleState = moduleStateKeys.includes(sKey);

      var throwErr = function throwErr() {
        throw new Error(keyTip(sKey, keyword));
      };

      if (keyShouldBeModuleStateKey) {
        !keyInModuleState && throwErr();
      } else {
        keyInModuleState && throwErr();
      }
    });
  }
  function checkConnectSpec(connectSpec) {
    var invalidConnect = "param connect is invalid,";

    var invalidConnectItem = function invalidConnectItem(m) {
      return invalidConnect + " module[" + m + "]'s value " + STR_ARR_OR_STAR;
    };

    okeys$2(connectSpec).forEach(function (m) {
      checkModuleName(m, false);
      var val = connectSpec[m];

      if (typeof val === 'string') {
        if (val !== '*' && val !== '-') throw new Error(invalidConnectItem(m));
      } else if (!Array.isArray(val)) {
        throw new Error(invalidConnectItem(m));
      } else {
        checkKeys(m, val, true, "connect module[" + m + "] invalid,");
      }
    });
  }
  function checkRenderKeyClasses(regRenderKeyClasses) {
    if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
      throw new Error("renderKeyClasses type err, it " + STR_ARR_OR_STAR);
    }
  }

  var keyWord = '.checkModuleNameAndState';

  function getDupLocation(errStack) {
    if (!errStack) errStack = '';
    /** stack may like this: at CodeSandbox
    Error: module name duplicate! --verbose-info: module[SetupDemo]
      at makeError (https://xvcej.csb.app/node_modules/concent/src/support/util.js:128:15)
      at checkModuleName (https://xvcej.csb.app/node_modules/concent/src/core/param/checker.js:71:15)
    >>  at Object.checkModuleNameAndState (https://xvcej.csb.app/node_modules/concent/src/core/param/checker.js:90:3)
      at _default (https://xvcej.csb.app/node_modules/concent/src/core/state/init-module-state.js:25:13)
      at _default (https://xvcej.csb.app/node_modules/concent/src/api/configure.js:96:35)
    >>  at evaluate (https://xvcej.csb.app/src/pages/SetupDemo/model/index.js:13:24)
      at Jn (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:146799)
      at e.value (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:162063)
      at e.value (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:202119)
      at t (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:161805)
      ...
     or: at local web-dev-server
     Error: module name duplicate! --verbose-info: module[batchAddGroup]
      at makeError (http://localhost:3001/static/js/main.chunk.js:20593:17)
      at checkModuleName (http://localhost:3001/static/js/main.chunk.js:17256:15)
    >>  at Module.checkModuleNameAndState (http://localhost:3001/static/js/main.chunk.js:17273:3)
      at http://localhost:3001/static/js/main.chunk.js:19804:106
      at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750:80)
    >>  at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374:55)
      at __webpack_require__ (http://localhost:3001/static/js/bundle.js:782:30)
      at fn (http://localhost:3001/static/js/bundle.js:150:20)
     */

    var arr = errStack.split('\n');
    var len = arr.length;
    var locationStr = '';

    for (var i = 0; i < len; i++) {
      var strPiece = arr[i];

      if (strPiece.includes(keyWord)) {
        var _ret = function () {
          var callConfigureIdx = i + 3; // 向下3句就是调用处
          // 这句话是具体调用configure的地方
          // at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374:55)

          var targetStrPiece = arr[callConfigureIdx];
          var arr2 = targetStrPiece.split(':');
          var lastIdx = arr2.length - 1;
          var locationStrArr = [];
          arr2.forEach(function (str, idx) {
            if (idx !== lastIdx) locationStrArr.push(str);
          }); // at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374

          locationStr = locationStrArr.join(':');
          return "break";
        }();

        break;
      }
    }

    return locationStr;
  }

  var module_dupLocation_ = {};
  var guessDuplicate = (function (err, module, tag) {
    if (err.code === ERR.CC_MODULE_NAME_DUPLICATE && ccContext.isHotReloadMode()) {
      var dupLocation = getDupLocation(err.stack);
      var key = tag + "|--link--|" + module;
      var prevLocation = module_dupLocation_[key];

      if (!prevLocation) {
        // 没有记录过
        module_dupLocation_[key] = dupLocation;
      } else if (dupLocation !== prevLocation) {
        throw err;
      }
    } else {
      throw err;
    }
  });

  var key_findResult_ = {};
  function createModuleNode(moduleName) {
    key_findResult_[moduleName] = {};
  }
  function getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses) {
    if (renderKey === void 0) {
      renderKey = '';
    }

    if (renderKeyClasses === void 0) {
      renderKeyClasses = [];
    }

    var featureStr1 = sharedStateKeys.sort().join(',');
    var featureStr2 = renderKeyClasses === '*' ? '*' : renderKeyClasses.sort().join(',');
    return moduleName + "/" + featureStr1 + "/" + renderKey + "/" + featureStr2;
  }
  function getCache(moduleName, key) {
    return key_findResult_[moduleName][key];
  }
  function setCache(moduleName, key, result) {
    key_findResult_[moduleName][key] = result;
  }

  function initModuleState (module, mState, moduleMustNotExisted) {
    if (moduleMustNotExisted === void 0) {
      moduleMustNotExisted = true;
    }

    createModuleNode(module); //force MODULE_VOID state as {}

    var state = module === MODULE_VOID ? {} : mState;

    try {
      checkModuleNameAndState(module, state, moduleMustNotExisted);
    } catch (err) {
      guessDuplicate(err, module, 'state');
    }

    var ccStore = ccContext.store;
    var rootState = ccStore.getState();
    var rootStateVer = ccStore.getStateVer();
    var rootModuleVer = ccStore.getModuleVer();
    var prevRootState = ccStore.getPrevState();
    safeAssignToMap(rootState, module, state);
    safeAssignToMap(prevRootState, module, state);
    rootStateVer[module] = okeys(state).reduce(function (map, key) {
      map[key] = 1;
      return map;
    }, {});
    rootModuleVer[module] = 1; // 把_computedValueOri safeGet从init-module-computed调整到此处
    // 防止用户不定义任何computed，而只是定义watch时报错undefined

    var cu = ccContext.computed;
    safeGet(cu._computedDep, module, makeCuDepDesc());
    safeGet(cu._computedValue, module);
    safeGet(cu._computedValueOri, module);
    var stateKeys = Object.keys(state);
    ccContext.moduleName_stateKeys_[module] = stateKeys;

    if (module === MODULE_GLOBAL) {
      var globalStateKeys = ccContext.globalStateKeys;
      stateKeys.forEach(function (key) {
        if (!globalStateKeys.includes(key)) globalStateKeys.push(key);
      });
    }
  }

  /** @typedef {import('../../types').ICtxBase} ICtxBase */
  var ignoreIt = "if this message doesn't matter, you can ignore it";
  /****
   * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module, mustBelongToModule) {
    if (mustBelongToModule === void 0) {
      mustBelongToModule = false;
    }

    var ccUKey_ref_ = ccContext.ccUKey_ref_;
    var oneRef = null;

    if (module) {
      checkModuleName(module, false);
      var ukeys = okeys(ccUKey_ref_);
      var len = ukeys.length;

      for (var i = 0; i < len; i++) {
        /** @type {{ctx:ICtxBase}} */
        var ref = ccUKey_ref_[ukeys[i]];

        if (ref.ctx.module === module) {
          oneRef = ref;
          break;
        }
      }
    }

    if (!oneRef) {
      if (mustBelongToModule) {
        throw new Error("[[pickOneRef]]: no ref found for module[" + module + "]!," + ignoreIt);
      } else {
        oneRef = ccContext.permanentDispatcher;
      }
    }

    return oneRef;
  }

  var makeUniqueCcKey$1 = makeUniqueCcKey,
      justWarning$1 = justWarning;

  var resolve = function resolve() {
    return Promise.resolve();
  };

  function ccDispatch (action, payLoadWhenActionIsString, rkOrOptions, delay$$1, _temp) {
    if (rkOrOptions === void 0) {
      rkOrOptions = '';
    }

    var _ref = _temp === void 0 ? {} : _temp,
        ccClassKey = _ref.ccClassKey,
        ccKey = _ref.ccKey,
        throwError = _ref.throwError,
        _ref$refModule = _ref.refModule,
        refModule = _ref$refModule === void 0 ? '' : _ref$refModule;

    if (action === undefined && payLoadWhenActionIsString === undefined) {
      throw new Error("params type error");
    }

    var dispatchFn,
        module = '',
        fnName = '';

    try {
      if (ccClassKey && ccKey) {
        var uKey = makeUniqueCcKey$1(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          justWarning$1("no ref found for ccUniqueKey:" + uKey + "!");
          return resolve();
        } else {
          dispatchFn = targetRef.ctx.dispatch;
        }
      } else {
        if (typeof action == 'string') {
          if (action.includes('/')) {
            var _action$split = action.split('/'),
                m = _action$split[0],
                name = _action$split[1];

            module = m;
            fnName = name;
          } else {
            fnName = action;
          }
        }

        var ref;

        if (module && module !== '*') {
          ref = pickOneRef(module);
        } else if (refModule) {
          ref = pickOneRef(refModule);
        } else {
          ref = pickOneRef();
        }

        if (!ref) {
          justWarning$1("no ref found");
          return resolve();
        }

        dispatchFn = ref.ctx.dispatch;
      }

      if (module === '*') {
        var fullFnNames = ccContext.reducer._fnName_fullFnNames_[fnName];
        if (!fullFnNames) return;
        var tasks = [];
        fullFnNames.forEach(function (fullFnName) {
          tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, rkOrOptions, delay$$1));
        });
        return Promise.all(tasks);
      } else {
        return dispatchFn(action, payLoadWhenActionIsString, rkOrOptions, delay$$1);
      }
    } catch (err) {
      if (throwError) throw err;else {
        justWarning$1(err.message);
        return resolve();
      }
    }
  }

  function dispatch (action, payLoadWhenActionIsString, rkOrOptions, delay, extra) {
    return ccDispatch(action, payLoadWhenActionIsString, rkOrOptions, delay, extra);
  }

  function initModuleReducer (module, reducer) {
    if (reducer === void 0) {
      reducer = {};
    }

    var tip = "module[" + module + "] reducer";

    if (!isPJO(reducer)) {
      throw new Error(tip + " " + NOT_A_JSON);
    }

    checkModuleName(module, false, tip + " is invalid");
    var _ccContext$reducer = ccContext.reducer,
        _reducer = _ccContext$reducer._reducer,
        _caller = _ccContext$reducer._caller,
        _fnName_fullFnNames_ = _ccContext$reducer._fnName_fullFnNames_,
        _module_fnNames_ = _ccContext$reducer._module_fnNames_; // 防止同一个reducer被载入到不同模块时，setState附加逻辑不正确

    var newReducer = Object.assign({}, reducer);
    _reducer[module] = newReducer;
    var subReducerCaller = safeGet(_caller, module); // const subReducerRefCaller = util.safeGet(_reducerRefCaller, module);

    var fnNames = safeGetArray(_module_fnNames_, module); // 自动附加一个setState在reducer里

    if (!newReducer.setState) newReducer.setState = function (payload) {
      return payload;
    };
    var reducerFnNames = okeys(newReducer);
    reducerFnNames.forEach(function (name) {
      // avoid hot reload
      if (!fnNames.includes(name)) fnNames.push(name);
      var fullFnName = module + "/" + name;
      var list = safeGetArray(_fnName_fullFnNames_, name); // avoid hot reload

      if (!list.includes(fullFnName)) list.push(fullFnName);

      subReducerCaller[name] = function (payload, renderKeyOrOptions, delay$$1) {
        return dispatch(fullFnName, payload, renderKeyOrOptions, delay$$1);
      };

      var reducerFn = newReducer[name];

      if (typeof reducerFn !== 'function') {
        throw new Error("reducer key[" + name + "] 's value is not a function");
      } else {
        var targetFn = reducerFn;

        if (reducerFn.__fnName) {
          // 将某个已载入到模块a的reducer再次载入到模块b
          targetFn = function targetFn(payload, moduleState, actionCtx) {
            return reducerFn(payload, moduleState, actionCtx);
          };

          newReducer[name] = targetFn;
        }

        targetFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名

        targetFn.__stateModule = module; // AsyncFunction GeneratorFunction Function

        targetFn.__ctName = reducerFn.__ctName || reducerFn.constructor.name;
        targetFn.__isAsync = isAsyncFn(reducerFn);
      } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
      // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
      // reducerFn.stateModule = module;

    });
  }

  /** eslint-disable */
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

  var moduleName_stateKeys_$1 = ccContext.moduleName_stateKeys_,
      runtimeVar$1 = ccContext.runtimeVar;
  var sortFactor = 1;
  /**
  computed('foo/firstName', ()=>{});
  //or
  computed('firstName', ()=>{}, ['foo/firstName']);

  computed('foo/firstName', {
    fn: ()=>{},
    compare: false,
    depKeys: ['firstName'],
  });

  computed({
    'foo/firstName':()=>{},
    'foo/fullName':{
      fn:()=>{},
      depKeys:['firstName', 'lastName']
    }
  });
  // or 
  computed({
    'foo/firstName':()=>{},
    'fullName':{
      fn:()=>{},
      depKeys:['foo/firstName', 'foo/lastName']
    }
  });

  computed(ctx=>{ return cuDesc}
  */
  // cate: module | ref

  function configureDepFns (cate, confMeta, item, handler, depKeysOrOpt) {
    var ctx = confMeta.refCtx;
    var type = confMeta.type;

    if (cate === CATE_REF) {
      if (!ctx.__$$inBM) {
        justWarning(cate + " " + type + " must been called in setup block");
        return;
      }
    }

    if (!item) return;
    var itype = typeof item;

    var _descObj;

    if (itype === 'string') {
      var _descObj2, _descObj3;

      // retKey
      if (isPJO(handler)) _descObj = (_descObj2 = {}, _descObj2[item] = handler, _descObj2);else if (typeof handler === FUNCTION) _descObj = (_descObj3 = {}, _descObj3[item] = makeFnDesc(handler, depKeysOrOpt), _descObj3);
    } else if (isPJO(item)) {
      _descObj = item;
    } else if (itype === FUNCTION) {
      _descObj = item(ctx);
      if (!isPJO(_descObj)) throw new Error("type of " + type + " callback result must be an object");
    }

    if (!_descObj) {
      justWarning(cate + " " + type + " param type error");
      return;
    }

    _parseDescObj(cate, confMeta, _descObj);
  }

  function _parseDescObj(cate, confMeta, descObj) {
    var computedCompare = runtimeVar$1.computedCompare,
        watchCompare = runtimeVar$1.watchCompare,
        watchImmediate = runtimeVar$1.watchImmediate; //读全局的默认值

    var defaultCompare = confMeta.type === FN_CU ? computedCompare : watchCompare;
    var callerModule = confMeta.module;
    okeys(descObj).forEach(function (retKey) {
      var val = descObj[retKey];
      var vType = typeof val;
      var targetItem = val;

      if (vType === FUNCTION) {
        targetItem = {
          fn: val
        };
      }

      if (isPJO(targetItem)) {
        var _targetItem = targetItem,
            fn = _targetItem.fn,
            _targetItem$immediate = _targetItem.immediate,
            immediate = _targetItem$immediate === void 0 ? watchImmediate : _targetItem$immediate,
            _targetItem$compare = _targetItem.compare,
            compare = _targetItem$compare === void 0 ? defaultCompare : _targetItem$compare,
            lazy = _targetItem.lazy,
            _targetItem$retKeyDep = _targetItem.retKeyDep,
            retKeyDep = _targetItem$retKeyDep === void 0 ? true : _targetItem$retKeyDep; // 确保用户显示的传递null、undefined、0、都置为依赖收集状态

        var depKeys = targetItem.depKeys || '-'; // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor

        var sort = targetItem.sort || sortFactor++;
        var fnUid = uuid('mark');

        if (depKeys === '*' || depKeys === '-') {
          // 处于依赖收集，且用户没有显式的通过设置retKeyDep为false来关闭同名依赖规则时，会自动设置同名依赖
          var mapSameName = depKeys === '-' && retKeyDep;

          var _resolveKey2 = _resolveKey(confMeta, callerModule, retKey, mapSameName),
              pureKey = _resolveKey2.pureKey,
              module = _resolveKey2.module;

          _checkRetKeyDup(cate, confMeta, fnUid, pureKey); // when retKey is '/xxxx', here need pass xxxx as retKey


          _mapDepDesc(cate, confMeta, module, pureKey, fn, depKeys, immediate, compare, lazy, sort);
        } else {
          if (depKeys.length === 0) {
            var _resolveKey3 = _resolveKey(confMeta, callerModule, retKey),
                _pureKey = _resolveKey3.pureKey,
                _module2 = _resolveKey3.module; //consume retKey is stateKey
            // 这段逻辑对于将来的1.6版本有效，即没有指定depKeys，启用同名键规则
            // let targetDepKeys = [];
            // if (!depKeys && isStateKey) {
            //   targetDepKeys = [pureKey];// regenerate depKeys
            // }


            _checkRetKeyDup(cate, confMeta, fnUid, _pureKey);

            _mapDepDesc(cate, confMeta, _module2, _pureKey, fn, depKeys, immediate, compare, lazy, sort);
          } else {
            // ['foo/b1', 'bar/b1'] or ['b1', 'b2']
            var _resolveKey4 = _resolveKey(confMeta, callerModule, retKey),
                _pureKey2 = _resolveKey4.pureKey,
                moduleOfKey = _resolveKey4.moduleOfKey;

            var stateKeyModule = moduleOfKey;

            _checkRetKeyDup(cate, confMeta, fnUid, _pureKey2); // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn，但是会被分配ctx.computedDep或者watchDep的不同映射里


            var module_depKeys_ = {}; // ['foo/b1', 'bar/b1']

            depKeys.forEach(function (depKey) {
              // !!!这里只是单纯的解析depKey，不需要有映射同名依赖的行为
              // 映射同名依赖仅发生在传入retKey的时候
              var _resolveKey5 = _resolveKey(confMeta, callerModule, depKey),
                  isStateKey = _resolveKey5.isStateKey,
                  pureKey = _resolveKey5.pureKey,
                  module = _resolveKey5.module; //consume depKey is stateKey
              // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], some stateKey belong to foo, some belong to bar
              // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
              // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo
              // both left and right include module but they are not equal, this situation is not ok!
              // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']


              if (stateKeyModule && module !== stateKeyModule) {
                throw new Error("including slash both in retKey[" + retKey + "] and depKey[" + depKey + "] founded, but their module is different");
              }

              var depKeys = safeGetArray(module_depKeys_, module);

              if (!isStateKey) {
                throw new Error("depKey[" + depKey + "] invalid, module[" + module + "] doesn't include its stateKey[" + pureKey + "]");
              } else {
                // 当一个实例里 ctx.computed ctx.watch 的depKeys里显示的标记了依赖时
                // 在这里需要立即记录依赖了
                _mapIns$1(confMeta, module, pureKey);
              }

              depKeys.push(pureKey);
            });
            okeys(module_depKeys_).forEach(function (m) {
              // 指向同一个fn，允许重复
              _mapDepDesc(cate, confMeta, m, _pureKey2, fn, module_depKeys_[m], immediate, compare, lazy, sort);
            });
          }
        }
      } else {
        justWarning("retKey[" + retKey + "] item type error");
      }
    });
  }

  function _checkRetKeyDup(cate, confMeta, fnUid, retKey) {
    if (cate === CATE_REF) {
      var _confMeta$refCtx = confMeta.refCtx,
          ccUniqueKey = _confMeta$refCtx.ccUniqueKey,
          retKey_fnUid_ = _confMeta$refCtx.retKey_fnUid_;
      var type = confMeta.type;
      var typedRetKey = type + "_" + retKey;
      var mappedFn = retKey_fnUid_[typedRetKey];

      if (mappedFn) {
        throw new Error("ccUKey[" + ccUniqueKey + "], retKey[" + retKey + "] duplicate in ref " + type);
      } else {
        retKey_fnUid_[typedRetKey] = fnUid;
      }
    }
  } // !!!由实例调用computed或者watch，监听同名的retKey，更新stateKey与retKey的关系映射


  function _mapSameNameRetKey(confMeta, module, retKey, isModuleStateKey) {
    var dep = confMeta.dep;
    var moduleDepDesc = safeGet(dep, module, makeCuDepDesc());
    var stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
        retKey_stateKeys_ = moduleDepDesc.retKey_stateKeys_;
    safeGetThenNoDupPush(stateKey_retKeys_, retKey, retKey);
    safeGetThenNoDupPush(retKey_stateKeys_, retKey, retKey); // 记录依赖

    isModuleStateKey && _mapIns$1(confMeta, module, retKey);
  }

  function _mapIns$1(confMeta, module, retKey) {
    var ctx = confMeta.refCtx;

    if (ctx) {
      ctx.__$$staticWaKeys[makeWaKey(module, retKey)] = 1;
    }
  } // 映射依赖描述对象, module即是取的dep里的key


  function _mapDepDesc(cate, confMeta, module, retKey, fn, depKeys, immediate, compare, lazy, sort) {
    var dep = confMeta.dep;
    var moduleDepDesc = safeGet(dep, module, makeCuDepDesc());
    var retKey_fn_ = moduleDepDesc.retKey_fn_,
        stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
        retKey_lazy_ = moduleDepDesc.retKey_lazy_,
        retKey_stateKeys_ = moduleDepDesc.retKey_stateKeys_;
    var isStatic = Array.isArray(depKeys) && depKeys.length === 0; // 确保static computed优先优先执行

    var targetSort = sort;

    if (isStatic) {
      if (targetSort >= 0) targetSort = -1;
    } else {
      if (sort < 0) targetSort = 0;
    }

    var fnDesc = {
      fn: fn,
      immediate: immediate,
      compare: compare,
      depKeys: depKeys,
      sort: targetSort,
      isStatic: isStatic
    }; // retKey作为将计算结果映射到refComputed | moduleComputed 里的key

    if (retKey_fn_[retKey]) {
      if (cate !== CATE_REF) {
        // 因为热加载，对于module computed 定义总是赋值最新的，
        retKey_fn_[retKey] = fnDesc;
        retKey_lazy_[retKey] = lazy;
      } // do nothing

    } else {
      retKey_fn_[retKey] = fnDesc;
      retKey_lazy_[retKey] = lazy;
      moduleDepDesc.fnCount++;
    }

    if (cate === CATE_REF) {
      confMeta.retKeyFns[retKey] = retKey_fn_[retKey];
    }

    var refCtx = confMeta.refCtx;

    if (refCtx) {
      if (confMeta.type === 'computed') refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
    } //处于自动收集依赖状态，首次遍历完计算函数后之后再去写stateKey_retKeys_, retKey_stateKeys_
    // in find-dep-fns-to-execute.js setStateKeyRetKeysMap


    if (depKeys === '-') return;
    var allKeyDep = depKeys === '*';
    var targetDepKeys = allKeyDep ? ['*'] : depKeys;

    if (allKeyDep) {
      retKey_stateKeys_[retKey] = moduleName_stateKeys_$1[module];
    }

    targetDepKeys.forEach(function (sKey) {
      if (!allKeyDep) safeGetThenNoDupPush(retKey_stateKeys_, retKey, sKey); //一个依赖key列表里的stateKey会对应着多个结果key

      safeGetThenNoDupPush(stateKey_retKeys_, sKey, retKey);
    });
  } // 分析retKey或者depKey是不是stateKey,
  // 返回的是净化后的key


  function _resolveKey(confMeta, module, retKey, mapSameName) {
    if (mapSameName === void 0) {
      mapSameName = false;
    }

    var targetModule = module,
        targetRetKey = retKey,
        moduleOfKey = '';

    if (retKey.includes('/')) {
      var _retKey$split = retKey.split('/'),
          _module = _retKey$split[0],
          _stateKey = _retKey$split[1];

      if (_module) {
        moduleOfKey = _module;
        targetModule = _module; // '/name' 支持这种申明方式
      }

      targetRetKey = _stateKey;
    }

    var stateKeys;
    var moduleStateKeys = moduleName_stateKeys_$1[targetModule];

    if (targetModule === confMeta.module) {
      // 此时computed & watch观察的是对象的所有stateKeys
      stateKeys = confMeta.stateKeys;
    } else {
      // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
      stateKeys = moduleStateKeys;

      if (!stateKeys) {
        throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo("module[" + targetModule + "]"));
      }

      if (!confMeta.connect[targetModule]) {
        throw makeError(ERR.CC_MODULE_NOT_CONNECTED, verboseInfo("module[" + targetModule + "], retKey[" + targetRetKey + "]"));
      }
    }

    var isStateKey = stateKeys.includes(targetRetKey);

    if (mapSameName && isStateKey) {
      _mapSameNameRetKey(confMeta, targetModule, targetRetKey, moduleStateKeys.includes(targetRetKey));
    }

    return {
      isStateKey: isStateKey,
      pureKey: targetRetKey,
      module: targetModule,
      moduleOfKey: moduleOfKey
    };
  }

  /**
   * 提供给用户使用，从存储的打包计算结果里获取目标计算结果的容器
   * ------------------------------------------------------------------------------------
   * 触发get时，会从打包对象里获取目标计算结果，
   * 打包对象按 ${retKey} 放置在originalCuContainer里，
   * 对于refComputed，originalCuContainer 是 ctx.refComputedOri
   * 对于moduleComputed，originalCuContainer 是  concentContext.ccComputed._computedValueOri.{$module}
   */

  function makeCuRetContainer (computed, originalCuContainer) {
    var moduleComputedValue = {};
    okeys(computed).forEach(function (key) {
      // 用这个对象来存其他信息, 避免get无限递归，
      originalCuContainer[key] = makeCuPackedValue();
      Object.defineProperty(moduleComputedValue, key, {
        get: function get() {
          // 防止用户传入未定义的key
          var value = originalCuContainer[key] || {};
          var needCompute = value.needCompute,
              fn = value.fn,
              newState = value.newState,
              oldState = value.oldState,
              fnCtx = value.fnCtx,
              isLazy = value.isLazy,
              result = value.result;

          if (!isLazy) {
            return result;
          }

          if (isLazy && needCompute) {
            var ret = fn(newState, oldState, fnCtx);
            value.result = ret;
            value.needCompute = false;
          }

          return value.result;
        },
        set: function set(input) {
          var value = originalCuContainer[key];

          if (!input[CU_KEY]) {
            justWarning("computed value can not been changed manually");
            return;
          }

          if (input.isLazy) {
            value.isLazy = true;
            value.needCompute = true;
            value.newState = input.newState;
            value.oldState = input.oldState;
            value.fn = input.fn;
            value.fnCtx = input.fnCtx;
          } else {
            value.isLazy = false;
            value.result = input.result;
          }
        }
      });
    });
    return moduleComputedValue;
  }

  var isPJO$1 = isPJO;
  function initModuleComputed (module, computed) {
    if (!computed) return;
    var tip = "module[" + module + "] computed";

    if (!isPJO$1(computed)) {
      throw new Error(tip + " " + NOT_A_JSON);
    }

    checkModuleName(module, false, tip + " is invalid");
    var ccComputed = ccContext.computed;
    var rootState = ccContext.store.getState();
    var rootComputedValue = ccComputed.getRootComputedValue();
    var rootComputedDep = ccComputed.getRootComputedDep();
    var rootComputedRaw = ccComputed.getRootComputedRaw();
    rootComputedRaw[module] = computed;
    var moduleState = rootState[module];
    configureDepFns(CATE_MODULE, {
      type: FN_CU,
      module: module,
      stateKeys: okeys(moduleState),
      dep: rootComputedDep
    }, computed);
    var d = ccContext.getDispatcher();

    var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
      return pickDepFns(isBeforeMount, CATE_MODULE, FN_CU, rootComputedDep, module, moduleState, committedState);
    }; // 在init-module-state那里已safeGet, 这里可以安全的直接读取


    var cuOri = ccComputed._computedValueOri[module];
    rootComputedValue[module] = makeCuRetContainer(computed, cuOri);
    var moduleComputedValue = rootComputedValue[module];
    executeDepFns(d, module, d && d.ctx.module, moduleState, curDepComputedFns, moduleState, moduleState, moduleState, makeCallInfo(module), true, FN_CU, CATE_MODULE, moduleComputedValue);
  }

  var isPJO$2 = isPJO,
      safeGet$1 = safeGet,
      okeys$3 = okeys;
  /**
   * 设置watch值，过滤掉一些无效的key
   */

  function initModuleWatch (module, moduleWatch, append) {
    if (append === void 0) {
      append = false;
    }

    if (!moduleWatch) return;
    var tip = "module[" + module + "] watch";

    if (!isPJO$2(moduleWatch)) {
      throw new Error(tip + " " + NOT_A_JSON);
    }

    checkModuleName(module, false, tip + " is invalid");
    var rootWatchDep = ccContext.watch.getRootWatchDep();
    var rootWatchRaw = ccContext.watch.getRootWatchRaw();
    var rootComputedValue = ccContext.computed.getRootComputedValue();

    if (append) {
      var ori = rootWatchRaw[module];
      if (ori) Object.assign(ori, moduleWatch);else rootWatchRaw[module] = moduleWatch;
    } else {
      rootWatchRaw[module] = moduleWatch;
    }

    var getState = ccContext.store.getState;
    var moduleState = getState(module);
    configureDepFns(CATE_MODULE, {
      module: module,
      stateKeys: okeys$3(moduleState),
      dep: rootWatchDep
    }, moduleWatch);
    var d = ccContext.getDispatcher();

    var curDepWatchFns = function curDepWatchFns(committedState, isFirstCall) {
      return pickDepFns(isFirstCall, CATE_MODULE, FN_WATCH, rootWatchDep, module, moduleState, committedState);
    };

    var moduleComputedValue = safeGet$1(rootComputedValue, module);
    executeDepFns(d, module, d && d.ctx.module, moduleState, curDepWatchFns, moduleState, moduleState, moduleState, makeCallInfo(module), true, FN_WATCH, CATE_MODULE, moduleComputedValue);
  }

  var id = 0;
  /** 针对lazy的reducer调用链状态记录缓存map */

  var chainId_moduleStateMap_ = {};
  var chainId_isExited_ = {};
  var chainId_isLazy_ = {};
  /** 所有的reducer调用链状态记录缓存map */

  var normalChainId_moduleStateMap_ = {};
  function getChainId() {
    id++;
    return id;
  }

  function __setChainState(chainId, targetModule, partialState, targetId_msMap) {
    if (partialState) {
      var moduleStateMap = targetId_msMap[chainId];
      if (!moduleStateMap) moduleStateMap = targetId_msMap[chainId] = {};
      var state = moduleStateMap[targetModule];

      if (!state) {
        moduleStateMap[targetModule] = partialState;
      } else {
        Object.assign(state, partialState);
      }
    }
  }

  function setChainState(chainId, targetModule, partialState) {
    __setChainState(chainId, targetModule, partialState, chainId_moduleStateMap_);
  }
  function setAllChainState(chainId, targetModule, partialState) {
    __setChainState(chainId, targetModule, partialState, normalChainId_moduleStateMap_);
  }
  function setAndGetChainStateList(chainId, targetModule, partialState) {
    setChainState(chainId, targetModule, partialState);
    return getChainStateList(chainId);
  }
  function getChainStateMap(chainId) {
    return chainId_moduleStateMap_[chainId];
  }
  function getAllChainStateMap(chainId) {
    return normalChainId_moduleStateMap_[chainId];
  } // export function getChainModuleState(chainId, module) {
  //   const moduleStateMap = getChainStateMap(chainId);
  //   return moduleStateMap[module];
  // }

  function getChainStateList(chainId) {
    var moduleStateMap = getChainStateMap(chainId);
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
  function removeAllChainState(chainId) {
    delete normalChainId_moduleStateMap_[chainId];
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

  function watchKeyForRef (ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount, mergeToDelta) {
    if (isBeforeMount === void 0) {
      isBeforeMount = false;
    }

    var refCtx = ref.ctx;
    if (!refCtx.hasWatchFn) return {
      hasDelta: false,
      newCommittedState: {}
    };
    var newState = Object.assign({}, oldState, deltaCommittedState);
    var watchDep = refCtx.watchDep,
        refModule = refCtx.module,
        ccUniqueKey = refCtx.ccUniqueKey;
    var computedContainer = refCtx.refComputed;

    if (stateModule !== refModule) {
      // 由changeRefState/broadcastState触发的connectedRefs 触发的watch
      computedContainer = refCtx.connectedComputed[stateModule];
    }

    var curDepWatchFns = function curDepWatchFns(committedState, isBeforeMount) {
      return pickDepFns(isBeforeMount, CATE_REF, FN_WATCH, watchDep, stateModule, oldState, committedState, ccUniqueKey);
    }; // 触发有stateKey依赖列表相关的watch函数


    var _findDepFnsToExecute = executeDepFns(ref, stateModule, refModule, oldState, curDepWatchFns, deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount, FN_WATCH, CATE_REF, computedContainer, mergeToDelta),
        hasDelta = _findDepFnsToExecute.hasDelta;

    return {
      hasDelta: hasDelta
    };
  }

  function computeValueForRef (ref, stateModule, oldState, deltaCommittedState, callInfo, isBeforeMount, mergeToDelta) {
    if (isBeforeMount === void 0) {
      isBeforeMount = false;
    }

    var refCtx = ref.ctx;
    if (!refCtx.hasComputedFn) return {
      hasDelta: false,
      newCommittedState: {}
    };
    var computedDep = refCtx.computedDep,
        refModule = refCtx.module,
        ccUniqueKey = refCtx.ccUniqueKey;
    var computedContainer = refCtx.refComputed;

    if (stateModule !== refModule) {
      // 由changeRefState/broadcastState触发的connectedRefs 触发的计算
      computedContainer = refCtx.connectedComputed[stateModule];
    }

    var newState = Object.assign({}, oldState, deltaCommittedState);

    var curDepComputedFns = function curDepComputedFns(committedState, isBeforeMount) {
      return pickDepFns(isBeforeMount, CATE_REF, FN_CU, computedDep, stateModule, oldState, committedState, ccUniqueKey);
    }; // 触发依赖stateKeys相关的computed函数


    return executeDepFns(ref, stateModule, refModule, oldState, curDepComputedFns, deltaCommittedState, newState, deltaCommittedState, callInfo, isBeforeMount, FN_CU, CATE_REF, computedContainer, mergeToDelta);
  }

  var okeys$4 = okeys;
  var ccUKey_ref_ = ccContext.ccUKey_ref_,
      waKey_uKeyMap_$2 = ccContext.waKey_uKeyMap_,
      waKey_staticUKeyMap_$2 = ccContext.waKey_staticUKeyMap_;
  function findUpdateRefs (moduleName, partialSharedState, renderKey, renderKeyClasses) {
    var sharedStateKeys = okeys$4(partialSharedState);
    var cacheKey = getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses);
    var cachedResult = getCache(moduleName, cacheKey);

    if (cachedResult) {
      return {
        sharedStateKeys: sharedStateKeys,
        result: cachedResult
      };
    }

    var targetUKeyMap = {};
    var belongRefKeys = [];
    var connectRefKeys = [];
    sharedStateKeys.forEach(function (stateKey) {
      var waKey = moduleName + "/" + stateKey; // 利用assign不停的去重

      Object.assign(targetUKeyMap, waKey_uKeyMap_$2[waKey], waKey_staticUKeyMap_$2[waKey]);
    });
    var uKeys = okeys$4(targetUKeyMap);

    var putRef = function putRef(isBelong, ccUniqueKey) {
      isBelong ? belongRefKeys.push(ccUniqueKey) : connectRefKeys.push(ccUniqueKey);
    };

    var tryMatch = function tryMatch(ref, toBelong) {
      var _ref$ctx = ref.ctx,
          refRenderKey = _ref$ctx.renderKey,
          refCcClassKey = _ref$ctx.ccClassKey,
          ccUniqueKey = _ref$ctx.ccUniqueKey; // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新

      if (renderKey) {
        var isRenderKeyMatched = refRenderKey === renderKey; // 所有的类实例都受renderKey匹配机制影响

        if (renderKeyClasses === '*') {
          if (isRenderKeyMatched) {
            putRef(toBelong, ccUniqueKey);
          }
        } else {
          // 这些指定类实例受renderKey机制影响
          if (renderKeyClasses.includes(refCcClassKey)) {
            if (isRenderKeyMatched) {
              putRef(toBelong, ccUniqueKey);
            }
          } // 这些实例则不受renderKey机制影响
          else {
              putRef(toBelong, ccUniqueKey);
            }
        }
      } else {
        putRef(toBelong, ccUniqueKey);
      }
    };

    var missRef = false;
    uKeys.forEach(function (key) {
      var ref = ccUKey_ref_[key];

      if (!ref) {
        missRef = true;
        return;
      }

      var refCtx = ref.ctx;
      var refModule = refCtx.module,
          refConnect = refCtx.connect;
      var isBelong = refModule === moduleName;
      var isConnect = refConnect[moduleName] ? true : false;

      if (isBelong) {
        tryMatch(ref, true);
      } // 一个实例如果既属于模块x同时也连接了模块x，这是不推荐的，在buildCtx里面已给出警告
      // 会造成冗余的渲染


      if (isConnect) {
        tryMatch(ref, false);
      }
    });
    var result = {
      belong: belongRefKeys,
      connect: connectRefKeys
    }; // 没有miss的ref才存缓存，防止直接标记了watchedKeys的实例此时还没有记录ref，
    // 但是此时刚好有变更状态的命令的话，如果这里缓存了查询结果，这这个实例挂上后，没有机会响应状态变更了

    if (!missRef) {
      setCache(moduleName, cacheKey, result);
    }

    return {
      sharedStateKeys: sharedStateKeys,
      result: result
    };
  }

  /** @typedef {import('../../types').ICtxBase} ICtxBase */
  var isPJO$3 = isPJO,
      justWarning$2 = justWarning,
      isObjectNull$1 = isObjectNull,
      computeFeature$1 = computeFeature,
      okeys$5 = okeys;
  var FOR_ONE_INS_FIRSTLY$1 = FOR_ONE_INS_FIRSTLY,
      FOR_ALL_INS_OF_A_MOD$1 = FOR_ALL_INS_OF_A_MOD,
      FORCE_UPDATE$1 = FORCE_UPDATE,
      SET_STATE$1 = SET_STATE,
      SIG_STATE_CHANGED$1 = SIG_STATE_CHANGED,
      RENDER_NO_OP$1 = RENDER_NO_OP,
      RENDER_BY_KEY$1 = RENDER_BY_KEY,
      RENDER_BY_STATE$1 = RENDER_BY_STATE;
  var _ccContext$store = ccContext.store,
      storeSetState = _ccContext$store.setState,
      getPrevState = _ccContext$store.getPrevState,
      saveSharedState$1 = _ccContext$store.saveSharedState,
      middlewares = ccContext.middlewares,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      refStore = ccContext.refStore,
      moduleName_stateKeys_$2 = ccContext.moduleName_stateKeys_; //触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是FOR_ALL_INS_OF_A_MOD

  function getStateFor(targetModule, refModule) {
    return targetModule === refModule ? FOR_ONE_INS_FIRSTLY$1 : FOR_ALL_INS_OF_A_MOD$1;
  }

  function callMiddlewares(skipMiddleware, passToMiddleware, cb) {
    if (skipMiddleware !== true) {
      var len = middlewares.length;

      if (len > 0) {
        var index = 0;

        var next = function next() {
          if (index === len) {
            // all middlewares been executed
            cb();
          } else {
            var middlewareFn = middlewares[index];
            index++;
            if (typeof middlewareFn === 'function') middlewareFn(passToMiddleware, next);else {
              justWarning$2("found one middleware is not a function");
              next();
            }
          }
        };

        next();
      } else {
        cb();
      }
    } else {
      cb();
    }
  }
  /**
   * 修改状态入口函数
   */


  function changeRefState (state, _temp, targetRef) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.module,
        _ref$skipMiddleware = _ref.skipMiddleware,
        skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
        payload = _ref.payload,
        stateChangedCb = _ref.stateChangedCb,
        reactCallback = _ref.reactCallback,
        type = _ref.type,
        _ref$calledBy = _ref.calledBy,
        calledBy = _ref$calledBy === void 0 ? SET_STATE$1 : _ref$calledBy,
        _ref$fnName = _ref.fnName,
        fnName = _ref$fnName === void 0 ? '' : _ref$fnName,
        _ref$renderKey = _ref.renderKey,
        renderKey = _ref$renderKey === void 0 ? '' : _ref$renderKey,
        _ref$delay = _ref.delay,
        delay$$1 = _ref$delay === void 0 ? -1 : _ref$delay;

    if (state === undefined) return;

    if (!isPJO$3(state)) {
      justWarning$2("your committed state " + NOT_A_JSON);
      return;
    }

    var _targetRef$ctx = targetRef.ctx,
        refModule = _targetRef$ctx.module,
        ccUniqueKey = _targetRef$ctx.ccUniqueKey,
        ccKey = _targetRef$ctx.ccKey;
    var stateFor = getStateFor(module, refModule);
    var callInfo = {
      payload: payload,
      renderKey: renderKey,
      ccKey: ccKey,
      module: module,
      fnName: fnName
    }; // 在triggerReactSetState之前把状态存储到store，
    // 防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
    // const passedRef = stateFor === FOR_ONE_INS_FIRSTLY ? targetRef : null;
    // 标记noSave为true，延迟到后面可能存在的中间件执行结束后才save

    var _syncCommittedStateTo = syncCommittedStateToStore(module, state, {
      ref: targetRef,
      callInfo: callInfo,
      noSave: true
    }),
        sharedState = _syncCommittedStateTo.partialState,
        hasDelta = _syncCommittedStateTo.hasDelta,
        hasPrivState = _syncCommittedStateTo.hasPrivState;

    if (hasDelta) {
      Object.assign(state, sharedState);
    } // 不包含私有状态，仅包含模块状态，交给belongRefs那里去触发渲染，这样可以让已失去依赖的当前实例减少一次渲染
    // 因为belongRefs那里是根据有无依赖来确定要不要渲染，这样的话如果失去了依赖不把它查出来就不触发它渲染了


    var ignoreRender = !hasPrivState && !!sharedState; // source ref will receive the whole committed state 

    triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, ignoreRender, reactCallback, // committedState means final committedState
    function (renderType, committedState, updateRef) {
      var passToMiddleware = {
        calledBy: calledBy,
        type: type,
        payload: payload,
        renderKey: renderKey,
        delay: delay$$1,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        committedState: committedState,
        refModule: refModule,
        module: module,
        fnName: fnName,
        sharedState: sharedState || {} // 给一个空壳对象，防止用户直接用的时候报错null

      }; // 修改或新增状态值
      // 修改并不会再次触发compute&watch过程，请明确你要修改的目的

      passToMiddleware.modState = function (key, val) {
        passToMiddleware.committedState[key] = val;
        passToMiddleware.sharedState[key] = val;
      };

      callMiddlewares(skipMiddleware, passToMiddleware, function () {
        // 到这里才触发调用saveSharedState存储模块状态和updateRef更新调用实例，注这两者前后顺序不能调换
        // 因为updateRef里的beforeRender需要把最新的模块状态合进来
        // 允许在中间件过程中使用「modState」修改某些key的值，会影响到实例的更新结果，且不会再触发computed&watch
        // 调用此接口请明确知道后果,
        // 注不要直接修改sharedState或committedState，两个对象一起修改某个key才是正确的
        var realShare = saveSharedState$1(module, passToMiddleware.sharedState, true);
        updateRef && updateRef();

        if (renderType === RENDER_NO_OP$1 && !realShare) ; else {
          send(SIG_STATE_CHANGED$1, {
            calledBy: calledBy,
            type: type,
            committedState: committedState,
            sharedState: realShare || {},
            module: module,
            ccUniqueKey: ccUniqueKey,
            renderKey: renderKey
          });
        } // 无论是否真的有状态改变，此回调都会被触发


        if (stateChangedCb) stateChangedCb(); // ignoreRender 为true 等效于 allowOriInsRender 为true，允许查询出oriIns后触发它渲染

        if (realShare) triggerBroadcastState(callInfo, targetRef, realShare, ignoreRender, module, renderKey, delay$$1);
      });
    });
  }

  function triggerReactSetState(targetRef, callInfo, renderKey, calledBy, state, stateFor, ignoreRender, reactCallback, next) {
    var nextNoop = function nextNoop() {
      return next && next(RENDER_NO_OP$1, state);
    };

    var refCtx = targetRef.ctx;
    var refState = refCtx.unProxyState;

    if (ignoreRender) {
      return nextNoop();
    }

    if ( // 未挂载上不用判断，react自己会安排到更新队列里，等到挂载上时再去触发更新
    // targetRef.__$$isMounted === false || // 还未挂载上
    targetRef.__$$isUnmounted === true || // 已卸载
    stateFor !== FOR_ONE_INS_FIRSTLY$1 || //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
    calledBy !== FORCE_UPDATE$1 && isObjectNull$1(state)) {
      return nextNoop();
    }

    var stateModule = refCtx.module,
        storedKeys = refCtx.storedKeys,
        ccUniqueKey = refCtx.ccUniqueKey;
    var renderType = RENDER_BY_STATE$1;

    if (renderKey) {
      //if user specify renderKey
      renderType = RENDER_BY_KEY$1;

      if (refCtx.renderKey !== renderKey) {
        // current instance can been rendered only if current instance's ccKey equal renderKey
        return nextNoop();
      }
    }

    if (storedKeys.length > 0) {
      var _extractStateByKeys = extractStateByKeys(state, storedKeys),
          partialState = _extractStateByKeys.partialState,
          isStateEmpty = _extractStateByKeys.isStateEmpty;

      if (!isStateEmpty) {
        if (refCtx.persistStoredKeys === true) {
          var _extractStateByKeys2 = extractStateByKeys(refState, storedKeys),
              entireStoredState = _extractStateByKeys2.partialState;

          var currentStoredState = Object.assign({}, entireStoredState, partialState);

          if (ccContext.localStorage) {
            ccContext.localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
          }
        }

        refStore.setState(ccUniqueKey, partialState);
      }
    }

    var deltaCommittedState = Object.assign({}, state);
    computeValueForRef(targetRef, stateModule, refState, deltaCommittedState, callInfo);
    watchKeyForRef(targetRef, stateModule, refState, deltaCommittedState, callInfo);

    var ccSetState = function ccSetState() {
      // 使用 unProxyState ，避免触发get
      var changedState = extractChangedState(refCtx.unProxyState, deltaCommittedState);

      if (changedState) {
        // 记录stateKeys，方便triggerRefEffect之用
        refCtx.__$$settedList.push({
          module: stateModule,
          keys: okeys$5(changedState)
        });

        refCtx.__$$ccSetState(changedState, reactCallback);
      }
    };

    if (next) {
      next(renderType, deltaCommittedState, ccSetState);
    } else {
      ccSetState();
    }
  }

  function syncCommittedStateToStore(moduleName, committedState, options) {
    var stateKeys = moduleName_stateKeys_$2[moduleName]; // extract shared state

    var _extractStateByKeys3 = extractStateByKeys(committedState, stateKeys, true),
        partialState = _extractStateByKeys3.partialState,
        hasPrivState = _extractStateByKeys3.missKeyInState; // save state to store


    if (partialState) {
      var _storeSetState = storeSetState(moduleName, partialState, options),
          hasDelta = _storeSetState.hasDelta,
          deltaCommittedState = _storeSetState.deltaCommittedState;

      return {
        partialState: deltaCommittedState,
        hasDelta: hasDelta,
        hasPrivState: hasPrivState
      };
    }

    return {
      partialState: partialState,
      hasDelta: false,
      hasPrivState: hasPrivState
    };
  }

  function triggerBroadcastState(callInfo, targetRef, sharedState, allowOriInsRender, moduleName, renderKey, delay$$1) {
    var startBroadcastState = function startBroadcastState() {
      broadcastState(callInfo, targetRef, sharedState, allowOriInsRender, moduleName, renderKey);
    };

    if (delay$$1 > 0) {
      var feature = computeFeature$1(targetRef.ctx.ccUniqueKey, sharedState);
      runLater(startBroadcastState, feature, delay$$1);
    } else {
      startBroadcastState();
    }
  }

  function broadcastState(callInfo, targetRef, partialSharedState, allowOriInsRender, moduleName, renderKey) {
    if (!partialSharedState) {
      // null
      return;
    }

    var ccUKey_ref_ = ccContext.ccUKey_ref_;
    /** @type ICtxBase */

    var _targetRef$ctx2 = targetRef.ctx,
        currentCcUKey = _targetRef$ctx2.ccUniqueKey,
        ccClassKey = _targetRef$ctx2.ccClassKey;
    var renderKeyClasses = ccClassKey_ccClassContext_[ccClassKey].renderKeyClasses;

    var _findUpdateRefs = findUpdateRefs(moduleName, partialSharedState, renderKey, renderKeyClasses),
        sharedStateKeys = _findUpdateRefs.sharedStateKeys,
        _findUpdateRefs$resul = _findUpdateRefs.result,
        belongRefKeys = _findUpdateRefs$resul.belong,
        connectRefKeys = _findUpdateRefs$resul.connect;

    var renderedInBelong = {};
    belongRefKeys.forEach(function (refKey) {
      var ref = ccUKey_ref_[refKey];
      if (!ref) return;
      var refUKey = ref.ctx.ccUniqueKey;
      if (refUKey === currentCcUKey && !allowOriInsRender) return; // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用

      triggerReactSetState(ref, callInfo, null, 'broadcastState', partialSharedState, FOR_ONE_INS_FIRSTLY$1, false);
      renderedInBelong[refKey] = 1;
    });
    var prevModuleState = getPrevState(moduleName);
    connectRefKeys.forEach(function (refKey) {
      // 对于即属于又连接的实例，避免一次重复的渲染
      if (renderedInBelong[refKey]) {
        return;
      }

      var ref = ccUKey_ref_[refKey];
      if (!ref) return; // 对于挂载好了还未卸载的实例，才有必要触发重渲染

      if (ref.__$$isUnmounted === false) {
        var refCtx = ref.ctx;

        var _computeValueForRef = computeValueForRef(ref, moduleName, prevModuleState, partialSharedState, callInfo, false, false),
            hasDeltaInCu = _computeValueForRef.hasDelta,
            cuCommittedState = _computeValueForRef.newCommittedState;

        var _watchKeyForRef = watchKeyForRef(ref, moduleName, prevModuleState, partialSharedState, callInfo, false, false),
            hasDeltaInWa = _watchKeyForRef.hasDelta,
            waCommittedState = _watchKeyForRef.newCommittedState; // computed & watch 过程中提交了新的state，合并到unProxyState里，beforeRender时会利用unProxyState生成最新的obState
        // 注意这里，computeValueForRef watchKeyForRef 调用的 findDepFnsToExecute内部保证了实例里cu或者wa函数commit提交的
        // 状态只能是privateStateKey，所以合并到unProxyState是安全的


        if (hasDeltaInCu || hasDeltaInWa) {
          var changedRefPrivState = Object.assign(cuCommittedState, waCommittedState);
          var refModule = refCtx.module;
          var refState = refCtx.unProxyState;
          computeValueForRef(ref, refModule, refState, changedRefPrivState, callInfo);
          watchKeyForRef(ref, refModule, refState, changedRefPrivState, callInfo);
          Object.assign(refState, changedRefPrivState);

          refCtx.__$$settedList.push({
            module: refModule,
            keys: okeys$5(changedRefPrivState)
          });
        } // 记录sharedStateKeys，方便triggerRefEffect之用


        refCtx.__$$settedList.push({
          module: moduleName,
          keys: sharedStateKeys
        });

        refCtx.__$$ccForceUpdate();
      }
    });
  }

  function _setState(state, options) {
    try {
      var ref = pickOneRef(options.module);
      ref.ctx.changeState(state, options);
    } catch (err) {
      strictWarning(err);
    }
  }

  function innerSetState(module, state, stateChangedCb) {
    _setState(state, {
      module: module,
      stateChangedCb: stateChangedCb
    });
  }
  function setState (module, state, renderKey, delay$$1, skipMiddleware) {
    if (delay$$1 === void 0) {
      delay$$1 = -1;
    }

    _setState(state, {
      ccKey: '[[top api:setState]]',
      module: module,
      renderKey: renderKey,
      delay: delay$$1,
      skipMiddleware: skipMiddleware
    });
  }

  // import hoistNonReactStatic from 'hoist-non-react-statics';
  var verboseInfo$1 = verboseInfo,
      makeError$2 = makeError,
      justWarning$3 = justWarning,
      isPJO$4 = isPJO,
      okeys$6 = okeys;
  var _ccContext$store$1 = ccContext.store,
      getState = _ccContext$store$1.getState,
      storeSetState$1 = _ccContext$store$1.setState,
      _reducer$1 = ccContext.reducer._reducer,
      _computedValue$3 = ccContext.computed._computedValue;
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
    return "param module[" + module + "] must equal current ref's module[" + currentModule + "] when pass param reactCallback, or it will never been triggered! ";
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
  } // any error in this function will not been throw, cc just warning, 


  function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(inputModule, false)) {
      if (inputModule !== currentModule && reactCallback) {
        // ???strict
        justWarning$3(paramCallBackShouldNotSupply(inputModule, currentModule));
        targetCb = null; //let user's reactCallback has no chance to be triggered
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
    }
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$3(err);
        if (ccContext.runtimeHandler.errorHandler) ccContext.runtimeHandler.errorHandler(err);
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
    var callerRef = option.callerRef,
        delay$$1 = option.delay,
        renderKey = option.renderKey,
        calledBy = option.calledBy,
        module = option.module,
        chainId = option.chainId,
        oriChainId = option.oriChainId,
        chainId_depth_ = option.chainId_depth_,
        isSilent = option.isSilent;
    return __promisifiedInvokeWith(userLogicFn, {
      callerRef: callerRef,
      context: true,
      module: module,
      calledBy: calledBy,
      fnName: userLogicFn.name,
      delay: delay$$1,
      renderKey: renderKey,
      chainId: chainId,
      oriChainId: oriChainId,
      chainId_depth_: chainId_depth_,
      isSilent: isSilent
    }, payload);
  } // 后面会根据具体组件形态给reactSetState赋值
  // 直接写为 makeCcSetStateHandler = (ref)=> ref.ctx.reactSetState, 是错误的
  // ref.ctx.reactSetState是在后面的流程里被赋值的，所以此处多用一层函数包裹再调用


  function makeCcSetStateHandler(ref) {
    return function (state, cb) {
      ref.ctx.reactSetState(state, cb);
    };
  }
  function makeCcForceUpdateHandler(ref) {
    return function (cb) {
      ref.ctx.reactForceUpdate(cb);
    };
  } // last param: chainData

  function makeInvokeHandler(callerRef, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        chainId = _ref.chainId,
        oriChainId = _ref.oriChainId,
        isLazy = _ref.isLazy,
        _ref$delay = _ref.delay,
        delay$$1 = _ref$delay === void 0 ? -1 : _ref$delay,
        _ref$isSilent = _ref.isSilent,
        isSilent = _ref$isSilent === void 0 ? false : _ref$isSilent,
        _ref$chainId_depth_ = _ref.chainId_depth_,
        chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

    return function (firstParam, payload, inputRKey, inputDelay) {
      var _isLazy = isLazy,
          _isSilent = isSilent;

      var _renderKey = '',
          _delay = inputDelay != undefined ? inputDelay : delay$$1;

      if (isPJO$4(inputRKey)) {
        var lazy = inputRKey.lazy,
            silent = inputRKey.silent,
            renderKey = inputRKey.renderKey,
            _delay2 = inputRKey.delay;
        lazy !== undefined && (_isLazy = lazy);
        silent !== undefined && (_isSilent = silent);
        renderKey !== undefined && (_renderKey = renderKey);
        _delay2 !== undefined && (_delay = _delay2);
      } else {
        _renderKey = inputRKey;
      }

      var _getNewChainData = getNewChainData(_isLazy, chainId, oriChainId, chainId_depth_),
          _chainId = _getNewChainData._chainId,
          _oriChainId = _getNewChainData._oriChainId;

      var firstParamType = typeof firstParam;
      var option = {
        callerRef: callerRef,
        calledBy: INVOKE,
        module: callerRef.ctx.module,
        isSilent: _isSilent,
        chainId: _chainId,
        oriChainId: _oriChainId,
        chainId_depth_: chainId_depth_,
        delay: _delay,
        renderKey: _renderKey
      };
      var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])");

      if (firstParamType === 'function') {
        // 可能用户直接使用invoke调用了reducer函数
        if (firstParam.__fnName) firstParam.name = firstParam.__fnName; // 这里不修改option.module，concent明确定义了dispatch和invoke规则

        /**
          invoke调用函数引用时
          无论组件有无注册模块，一定走调用方模块
           dispatch调用函数引用时
          优先走函数引用的模块（此时函数是一个reducer函数），没有(此函数不是reducer函数)则走调用方的模块并降级为invoke调用
         */
        // if (firstParam.__stateModule) option.module = firstParam.__stateModule;

        return __invoke(firstParam, option, payload);
      } else if (firstParamType === 'object') {
        var _fn, _module;

        if (Array.isArray(firstParam)) {
          var module = firstParam[0],
              fn = firstParam[1];
          _fn = fn;
          _module = module;
        } else {
          var _module2 = firstParam.module,
              _fn2 = firstParam.fn;
          _fn = _fn2;
          _module = _module2;
        }

        if (typeof _fn != 'function') throw err;
        if (_module) option.module = _module; //某个模块的实例修改了另外模块的数据

        return __invoke(_fn, option, payload);
      } else {
        throw err;
      }
    };
  }
  function invokeWith(userLogicFn, executionContext, payload) {
    var callerRef = executionContext.callerRef;
    var callerModule = callerRef.ctx.module;
    var _executionContext$mod = executionContext.module,
        targetModule = _executionContext$mod === void 0 ? callerModule : _executionContext$mod,
        _executionContext$con = executionContext.context,
        context = _executionContext$con === void 0 ? false : _executionContext$con,
        cb = executionContext.cb,
        __innerCb = executionContext.__innerCb,
        type = executionContext.type,
        calledBy = executionContext.calledBy,
        _executionContext$fnN = executionContext.fnName,
        fnName = _executionContext$fnN === void 0 ? '' : _executionContext$fnN,
        _executionContext$del = executionContext.delay,
        delay$$1 = _executionContext$del === void 0 ? -1 : _executionContext$del,
        renderKey = executionContext.renderKey,
        chainId = executionContext.chainId,
        oriChainId = executionContext.oriChainId,
        chainId_depth_ = executionContext.chainId_depth_,
        isSilent = executionContext.isSilent;
    isStateModuleValid(targetModule, callerModule, cb, function (err, newCb) {
      if (err) return handleCcFnError(err, __innerCb);
      var moduleState = getState(targetModule);
      var actionContext = {};
      var isSourceCall = false;
      isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1;

      if (context) {
        //调用前先加1
        chainId_depth_[chainId] = chainId_depth_[chainId] + 1; // !!!makeDispatchHandler的dispatch lazyDispatch将源头的isSilent 一致透传下去

        var _dispatch = makeDispatchHandler(callerRef, false, isSilent, targetModule, renderKey, delay$$1, chainId, oriChainId, chainId_depth_);

        var silentDispatch = makeDispatchHandler(callerRef, false, true, targetModule, renderKey, delay$$1, chainId, oriChainId, chainId_depth_);
        var lazyDispatch = makeDispatchHandler(callerRef, true, isSilent, targetModule, renderKey, delay$$1, chainId, oriChainId, chainId_depth_); //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId

        var invoke = makeInvokeHandler(callerRef, {
          delay: delay$$1,
          chainId: chainId,
          oriChainId: oriChainId,
          chainId_depth_: chainId_depth_
        });
        var lazyInvoke = makeInvokeHandler(callerRef, {
          isLazy: true,
          delay: delay$$1,
          oriChainId: oriChainId,
          chainId_depth_: chainId_depth_
        });
        var silentInvoke = makeInvokeHandler(callerRef, {
          isLazy: false,
          delay: delay$$1,
          isSilent: true,
          oriChainId: oriChainId,
          chainId_depth_: chainId_depth_
        }); // 首次调用时是undefined，这里做个保护

        var committedStateMap = getAllChainStateMap(chainId) || {};
        var committedState = committedStateMap[targetModule] || {};
        actionContext = {
          callInfo: {
            renderKey: renderKey,
            delay: delay$$1,
            fnName: fnName,
            type: type,
            calledBy: calledBy
          },
          module: targetModule,
          callerModule: callerModule,
          committedStateMap: committedStateMap,
          //一次ref dispatch调用，所经过的所有reducer的返回结果收集
          committedState: committedState,
          invoke: invoke,
          lazyInvoke: lazyInvoke,
          silentInvoke: silentInvoke,
          invokeLazy: lazyInvoke,
          invokeSilent: silentInvoke,
          dispatch: _dispatch,
          lazyDispatch: lazyDispatch,
          silentDispatch: silentDispatch,
          dispatchLazy: lazyDispatch,
          dispatchSilent: silentDispatch,
          rootState: getState(),
          globalState: getState(MODULE_GLOBAL),
          //指的是目标模块的state
          moduleState: moduleState,
          //指的是目标模块的的moduleComputed
          moduleComputed: _computedValue$3[targetModule] || {},
          //利用dispatch调用自动生成的setState
          setState: function setState$$1(state) {
            return _dispatch('setState', state, {
              silent: isSilent,
              renderKey: renderKey,
              delay: delay$$1
            });
          },
          //透传上下文参数给IDispatchOptions,
          //!!!指的是调用源cc类实例的ctx
          refCtx: callerRef.ctx // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
          // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug

        };
      }

      if (isSilent === false) {
        send(SIG_FN_START, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        });
      }

      var handleReturnState = function handleReturnState(partialState) {
        chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

        var curDepth = chainId_depth_[chainId];
        var isFirstDepth = curDepth === 1; //调用结束就记录

        setAllChainState(chainId, targetModule, partialState);
        var commitStateList = [];

        if (isSilent === false) {
          send(SIG_FN_END, {
            isSourceCall: isSourceCall,
            calledBy: calledBy,
            module: targetModule,
            chainId: chainId,
            fn: userLogicFn
          }); // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

          if (isChainIdLazy(chainId)) {
            //来自于惰性派发的调用
            if (!isFirstDepth) {
              // 某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
              setChainState(chainId, targetModule, partialState);
            } else {
              // 合并状态一次性提交到store并派发到组件实例
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
        }

        commitStateList.forEach(function (v) {
          if (v.state) {
            changeRefState(v.state, {
              renderKey: renderKey,
              module: v.module,
              reactCallback: newCb,
              type: type,
              calledBy: calledBy,
              fnName: fnName,
              delay: delay$$1,
              payload: payload
            }, callerRef);
          }
        });

        if (isSourceCall) {
          //源头dispatch or invoke结束调用
          removeChainState(chainId);
          removeAllChainState(chainId);
        }

        if (__innerCb) __innerCb(null, partialState);
      };

      var handleFnError = function handleFnError(err) {
        send(SIG_FN_ERR, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        });
        handleCcFnError(err, __innerCb);
      };

      var stOrPromisedSt = userLogicFn(payload, moduleState, actionContext);

      if (userLogicFn.__isAsync) {
        Promise.resolve(stOrPromisedSt).then(handleReturnState)["catch"](handleFnError);
      } // 防止输入中文时，因为隔了一个Promise而出现抖动
      else {
          try {
            if (userLogicFn.__isReturnJudged) {
              handleReturnState(stOrPromisedSt);
              return;
            } // 再判断一次，有可能会被编译器再包一层，形如：
            //  function getServerStore(_x2) {
            //    return _getServerStore.apply(this, arguments);
            //  }


            if (isAsyncFn(stOrPromisedSt)) {
              userLogicFn.__isAsync = true;
              Promise.resolve(stOrPromisedSt).then(handleReturnState)["catch"](handleFnError);
              return;
            } else {
              userLogicFn.__isReturnJudged = true;
            }

            handleReturnState(stOrPromisedSt);
          } catch (err) {
            handleFnError(err);
          }
        }
    });
  }
  function dispatch$1(_temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        callerRef = _ref2.callerRef,
        inputModule = _ref2.module,
        renderKey = _ref2.renderKey,
        isSilent = _ref2.isSilent,
        type = _ref2.type,
        payload = _ref2.payload,
        reactCallback = _ref2.cb,
        __innerCb = _ref2.__innerCb,
        _ref2$delay = _ref2.delay,
        delay$$1 = _ref2$delay === void 0 ? -1 : _ref2$delay,
        chainId = _ref2.chainId,
        oriChainId = _ref2.oriChainId,
        chainId_depth_ = _ref2.chainId_depth_;

    var targetReducerMap = _reducer$1[inputModule];

    if (!targetReducerMap) {
      return __innerCb(new Error("no reducerMap found for module:[" + inputModule + "]"));
    }

    var reducerFn = targetReducerMap[type];

    if (!reducerFn) {
      var fns = Object.keys(targetReducerMap);
      return __innerCb(new Error("no reducer fn found for [" + inputModule + "/" + type + "], is these fn you want:" + fns));
    }

    var executionContext = {
      callerRef: callerRef,
      module: inputModule,
      type: type,
      cb: reactCallback,
      context: true,
      __innerCb: __innerCb,
      calledBy: DISPATCH,
      delay: delay$$1,
      renderKey: renderKey,
      isSilent: isSilent,
      chainId: chainId,
      oriChainId: oriChainId,
      chainId_depth_: chainId_depth_
    };
    invokeWith(reducerFn, executionContext, payload);
  }
  function makeDispatchHandler(callerRef, in_isLazy, in_isSilent, defaultModule, defaultRenderKey, delay$$1, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
  ) {
    if (defaultRenderKey === void 0) {
      defaultRenderKey = '';
    }

    if (delay$$1 === void 0) {
      delay$$1 = -1;
    }

    if (chainId_depth_ === void 0) {
      chainId_depth_ = {};
    }

    return function (paramObj, payload, userInputRKey, userInputDelay) {
      if (paramObj === void 0) {
        paramObj = {};
      }

      var isLazy = in_isLazy,
          isSilent = in_isSilent;
      var _renderKey = '';

      var _delay = userInputDelay || delay$$1;

      if (isPJO$4(userInputRKey)) {
        _renderKey = defaultRenderKey;
        var lazy = userInputRKey.lazy,
            silent = userInputRKey.silent,
            renderKey = userInputRKey.renderKey,
            _delay3 = userInputRKey.delay;
        lazy !== undefined && (isLazy = lazy);
        silent !== undefined && (isSilent = silent);
        renderKey !== undefined && (_renderKey = renderKey);
        _delay3 !== undefined && (_delay = _delay3);
      } else {
        _renderKey = userInputRKey || defaultRenderKey;
      }

      var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
          _chainId = _getNewChainData2._chainId,
          _oriChainId = _getNewChainData2._oriChainId;

      var paramObjType = typeof paramObj;

      var _type, _cb;

      var _module = defaultModule;

      var callInvoke = function callInvoke() {
        var iHandler = makeInvokeHandler(callerRef, {
          chainId: _chainId,
          oriChainId: _oriChainId,
          isLazy: isLazy,
          chainId_depth_: chainId_depth_
        });
        return iHandler(paramObj, payload, _renderKey, _delay);
      };

      if (paramObjType && paramObjType === 'object') {
        if (Array.isArray(paramObj)) {
          var _paramObj = paramObj,
              mInArr = _paramObj[0],
              rInArr = _paramObj[1];

          if (rInArr && rInArr.__fnName) {
            _module = mInArr;
            _type = rInArr.__fnName;
          } else {
            return callInvoke();
          }
        } else {
          var _paramObj2 = paramObj,
              module = _paramObj2.module,
              type = _paramObj2.type,
              cb = _paramObj2.cb;
          if (module) _module = module;
          _type = type;
          _cb = cb;
        }
      } else if (paramObjType === 'string' || paramObjType === 'function') {
        var targetFirstParam = paramObj;

        if (paramObjType === 'function') {
          var fnName = paramObj.__fnName;

          if (!fnName) {
            // 此函数是一个普通函数，没有配置到某个模块的reducer里，降级为invoke调用
            return callInvoke(); // throw new Error('you are calling a unnamed function!!!');
          }

          targetFirstParam = fnName; // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule参数
          // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对

          if (chainId_depth_[_oriChainId] == 1) {
            // let dispatch can apply reducer function directly!!!
            // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，但是确实想修改的是b模块的数据，只是想复用a模块的那个函数的逻辑
            // 那么千万要注意，写为{module:'b', fn:xxxFoo}的模式
            _module = paramObj.__stateModule;
          }
        }

        var slashCount = targetFirstParam.split('').filter(function (v) {
          return v === '/';
        }).length;

        if (slashCount === 0) {
          _type = targetFirstParam;
        } else if (slashCount === 1) {
          var _targetFirstParam$spl = targetFirstParam.split('/'),
              _module3 = _targetFirstParam$spl[0],
              _type2 = _targetFirstParam$spl[1];

          if (_module3) _module = _module3; //targetFirstParam may like: /foo/changeName

          _type = _type2;
        } else {
          return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi$1(targetFirstParam)));
        }
      } else {
        return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
      }

      if (_module === '*') {
        return ccDispatch("*/" + _type, payload, {
          silent: isSilent,
          lazy: isLazy,
          renderKey: _renderKey
        }, _delay, {
          refModule: callerRef.ctx.module
        } // in name of refModule to call dispatch handler
        );
      }

      var p = new Promise(function (resolve, reject) {
        dispatch$1({
          callerRef: callerRef,
          module: _module,
          type: _type,
          payload: payload,
          cb: _cb,
          __innerCb: _promiseErrorHandler(resolve, reject),
          delay: _delay,
          renderKey: _renderKey,
          isSilent: isSilent,
          chainId: _chainId,
          oriChainId: _oriChainId,
          chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

        });
      })["catch"](catchCcError);
      return p;
    };
  } // for module/init method

  function makeSetStateHandler(module, initPost) {
    return function (state) {
      var execInitPost = function execInitPost() {
        var moduleDispatch = function moduleDispatch(action) {
          var _action = typeof action === 'string' && !action.includes('/') ? module + "/" + action : action;

          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          ccDispatch.apply(void 0, [_action].concat(args));
        };

        initPost && initPost(moduleDispatch, getState(module));
      };

      try {
        innerSetState(module, state, execInitPost);
      } catch (err) {
        var moduleState = getState(module);

        if (!moduleState) {
          return justWarning$3("invalid module " + module);
        }

        var keys = okeys$6(moduleState);

        var _extractStateByKeys = extractStateByKeys(state, keys, false, true),
            partialState = _extractStateByKeys.partialState,
            isStateEmpty = _extractStateByKeys.isStateEmpty,
            ignoredStateKeys = _extractStateByKeys.ignoredStateKeys;

        if (!isStateEmpty) storeSetState$1(module, partialState); //store this valid state;

        if (ignoredStateKeys.length > 0) {
          justWarning$3("invalid keys:" + ignoredStateKeys.join(',') + ", their value is undefined or they are not declared in module" + module);
        }

        justTip("no ccInstance found for module[" + module + "] currently, cc will just store it, lately ccInstance will pick this state to render");
        execInitPost();
      }
    };
  }
  var makeRefSetState = function makeRefSetState(ref) {
    return function (partialState, cb) {
      var ctx = ref.ctx;
      var newState = Object.assign({}, ctx.unProxyState, partialState);
      ctx.unProxyState = newState; // 和class setState(partialState, cb); 保持一致

      var cbNewState = function cbNewState() {
        return cb && cb(newState);
      }; // 让ctx.state始终保持同一个引用，使setup里，可以安全的解构state反复使用


      ctx.state = Object.assign(ctx.state, partialState);

      if (ctx.type === CC_HOOK) {
        ctx.__boundSetState(newState);

        cbNewState();
      } else {
        // 此处注意原始的react class setSate [,callback] 不会提供latestState
        ctx.__boundSetState(partialState, cbNewState);
      }
    };
  };
  var makeRefForceUpdate = function makeRefForceUpdate(ref) {
    return function (cb) {
      var ctx = ref.ctx;
      var newState = Object.assign({}, ctx.unProxyState);

      var cbNewState = function cbNewState() {
        return cb && cb(newState);
      };

      if (ctx.type === CC_HOOK) {
        ctx.__boundSetState(newState);

        cbNewState();
      } else {
        ctx.__boundForceUpdate(cbNewState);
      }
    };
  };

  var isPJO$5 = isPJO,
      evalState$1 = evalState;
  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {string} module
   * @param {{state:object, reducer:object, watch:object, computed:object, init:object}} config
   */

  function configure (module, config) {
    if (!ccContext.isStartup) {
      pendingModules.push({
        module: module,
        config: config
      });
      return; // throw new Error('configure must be called after run!');
    }

    if (!isPJO$5(config)) {
      throw new Error("param config " + NOT_A_JSON);
    }

    if (module === MODULE_GLOBAL) {
      throw new Error('configuring global module is not allowed');
    }

    var state = config.state,
        reducer = config.reducer,
        computed = config.computed,
        watch = config.watch,
        init = config.init;
    var eState = evalState$1(state);
    if (typeof state === 'function') ccContext.moduleName_stateFn_[module] = state;

    if (reducer && !isPJO$5(reducer)) {
      throw new Error("config.reducer " + NOT_A_JSON);
    }

    initModuleState(module, eState, true);
    initModuleReducer(module, reducer);
    computed && initModuleComputed(module, computed);
    watch && initModuleWatch(module, watch);

    if (init) {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function!');
      }

      Promise.resolve().then(init).then(function (state) {
        makeSetStateHandler(module, config.initPost)(state);
      });
    }

    ccContext.moduleName_isConfigured_[module] = true;
    send(SIG_MODULE_CONFIGURED, module);
  }

  function tagReducerFn(reducerFns, moduleName) {
    var taggedReducer = {};
    okeys(reducerFns).forEach(function (fnName) {
      var oldFn = reducerFns[fnName];

      var fn = function fn() {
        return oldFn.apply(void 0, arguments);
      };

      fn.__fnName = fnName;
      fn.__stateModule = moduleName;
      taggedReducer[fnName] = fn;
    });
    return taggedReducer;
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

    if (!ccContext.isStartup) {
      throw new Error('cc is not startup yet');
    }

    checkModuleNameBasically(newModule);
    checkModuleName(existingModule, false);
    var stateFn = ccContext.moduleName_stateFn_[existingModule];

    if (!stateFn) {
      throw new Error("target module[" + existingModule + "] state must be a function when use cloneModule");
    }

    var stateCopy = stateFn();
    Object.assign(stateCopy, evalState(state));
    var reducerOriginal = ccContext.reducer._reducer[existingModule] || {}; // attach  __fnName  __stateModule, 不能污染原函数的dispatch逻辑里需要的__stateModule

    var taggedReducerOriginal = tagReducerFn(reducerOriginal, newModule);
    if (reducer) Object.assign(taggedReducerOriginal, tagReducerFn(reducer, newModule));
    var computedEx = ccContext.computed._computedRaw[existingModule] || {};
    if (computed) Object.assign(computedEx, computed);
    var watchEx = ccContext.watch._watchRaw[existingModule] || {};
    if (watch) Object.assign(watchEx, watch);
    var initEx = ccContext.init._init[existingModule];
    if (init) initEx = init;
    var confObj = {
      state: stateCopy,
      reducer: taggedReducerOriginal,
      computed: computedEx,
      watch: watchEx
    };
    if (initEx) confObj.init = initEx;
    configure(newModule, confObj);
  });

  var event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_ = ccContext.handlerKey_handler_,
      ccUKey_handlerKeys_ = ccContext.ccUKey_handlerKeys_,
      ccUKey_ref_$1 = ccContext.ccUKey_ref_;
  var makeHandlerKey$1 = makeHandlerKey,
      safeGetArray$1 = safeGetArray,
      justWarning$4 = justWarning;

  function _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity) {
    // 不用默认参数写法了
    // codesandbox lost default value
    var _identity = identity == undefined ? null : identity;

    var handlers = event_handlers_[event];

    if (handlers) {
      var filteredHandlers = handlers;
      if (ccUniqueKey) filteredHandlers = handlers.filter(function (v) {
        return v.ccUniqueKey === ccUniqueKey;
      });else if (ccClassKey) filteredHandlers = handlers.filter(function (v) {
        return v.ccClassKey === ccClassKey;
      });else if (module) filteredHandlers = handlers.filter(function (v) {
        return v.module === module;
      }); // identity is null means user call emit like emit('eventName')
      // identity is not null means user call emit like emit(['eventName', 'idtName'])

      if (_identity !== undefined) {
        filteredHandlers = filteredHandlers.filter(function (v) {
          return v.identity === _identity;
        });
      }

      return filteredHandlers;
    }

    return [];
  }

  function _deleteEventHandlers(handlers) {
    var toDeleteCcUniqueKeyMap = {};
    var toDeleteEventNames = [];
    handlers.forEach(function (item) {
      var handlerKey = item.handlerKey,
          ccUniqueKey = item.ccUniqueKey,
          event = item.event;
      delete handlerKey_handler_[handlerKey]; //delete mapping of handlerKey_handler_;
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
            delete ccUKey_handlerKeys_[ccUniqueKey]; //delete mapping of ccUKey_handlerKeys_;
          }
        });
        event_handlers_[event] = eHandlers.filter(function (v) {
          return v !== null;
        }); //delete eHandlers null element
      }
    });
  }

  function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
    var handlers = safeGetArray$1(event_handlers_, event);

    if (typeof handler !== 'function') {
      return justWarning$4("event " + event + "'s handler is not a function!");
    }

    var handlerKey = makeHandlerKey$1(ccUniqueKey, event, identity);
    var handlerKeys = safeGetArray$1(ccUKey_handlerKeys_, ccUniqueKey);
    var targetHandlerIndex = handlers.findIndex(function (v) {
      return v.handlerKey === handlerKey;
    }); // user call ctx.on for a same event in a same instance more than once

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
      // will alway use the latest handler
      handlers[targetHandlerIndex] = handlerItem;
    } else {
      handlers.push(handlerItem);
      handlerKeys.push(handlerKey);
    }

    handlerKey_handler_[handlerKey] = handlerItem;
  }
  function findEventHandlersToPerform(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _event,
        _identity = null,
        _module,
        _ccClassKey,
        _ccUniqueKey;

    var canPerform = null;

    if (typeof event === 'string') {
      _event = event;
    } else {
      _event = event.name;
      _identity = event.identity;
      _module = event.module;
      _ccClassKey = event.ccClassKey;
      _ccUniqueKey = event.ccUniqueKey;
      canPerform = event.canPerform;
    }

    var handlers = _findEventHandlers(_event, _module, _ccClassKey, _ccUniqueKey, _identity);

    handlers.forEach(function (_ref) {
      var ccUniqueKey = _ref.ccUniqueKey,
          handlerKey = _ref.handlerKey;
      var ref = ccUKey_ref_$1[ccUniqueKey];

      if (ref && handlerKey) {
        //  confirm the instance is mounted and handler is not been offed
        if (ref.__$$isUnmounted) return;
        var handler = handlerKey_handler_[handlerKey];

        if (handler) {
          if (canPerform && !canPerform(ref)) {
            return;
          }

          var fn = handler.fn;
          if (ref.__$$isMounted) fn.apply(void 0, args);else ref.ctx.__$$onEvents.push({
            fn: fn,
            args: args
          });
        }
      }
    });
  }
  function findEventHandlersToOff(event, _ref2) {
    var module = _ref2.module,
        ccClassKey = _ref2.ccClassKey,
        ccUniqueKey = _ref2.ccUniqueKey,
        identity = _ref2.identity;

    var handlers = _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity);

    _deleteEventHandlers(handlers);
  }
  function offEventHandlersByCcUniqueKey(ccUniqueKey) {
    var handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];

    if (handlerKeys) {
      var toDeleteHandlers = [];
      handlerKeys.forEach(function (k) {
        return toDeleteHandlers.push(handlerKey_handler_[k]);
      });

      _deleteEventHandlers(toDeleteHandlers);
    }
  }
  function getEventItem(event) {
    var outputEv;

    if (event && typeof event === 'object') {
      var _event;

      if (Array.isArray(event)) {
        var name = event[0],
            identity = event[1];
        _event = {
          name: name,
          identity: identity
        };
      } else {
        _event = Object.assign({}, event);
      }

      if (!_event.identity) _event.identity = null; //否则就允许用户传如自己定义的module, ccClassKey

      outputEv = _event;
    } else {
      outputEv = {
        name: event,
        identity: null
      };
    }

    return outputEv;
  }

  var ev = /*#__PURE__*/Object.freeze({
    bindEventHandlerToCcContext: bindEventHandlerToCcContext,
    findEventHandlersToPerform: findEventHandlersToPerform,
    findEventHandlersToOff: findEventHandlersToOff,
    offEventHandlersByCcUniqueKey: offEventHandlersByCcUniqueKey,
    getEventItem: getEventItem
  });

  var getModuleVer$1 = ccContext.store.getModuleVer;
  function makeObState (ref, state, module, isForModule) {
    return new Proxy(state, {
      get: function get(target, key) {
        // ensureStateNotExpired, 当实例失去模块数据依赖，回调方法直接使用ctx.state时，state里的模块数据可能已过期
        if (isForModule) {
          var modVer = getModuleVer$1(module);
          var ctx = ref.ctx;

          if (modVer !== ctx.__$$prevModuleVer) {
            ctx.__$$prevModuleVer = modVer;
            Object.assign(state, ctx.__$$mstate);
          }
        }

        updateDep(ref, module, key, isForModule);
        return target[key];
      },
      set: function set(target, key, value) {
        // 这个warning暂时关闭，因为buildRefCtx阶段就生成了obState, refComputed里可能会调用commit向obState写入新的state
        // justWarning(`warning: state key[${key}] can not been changed manually, use api setState or dispatch instead`);
        // 允许赋最新值，否则silentUpdate状态合并会失效
        target[key] = value; // avoid Uncaught TypeError: 'set' on proxy: trap returned falsish for property '***'

        return true;
      }
    });
  }

  function getDefineWatchHandler (refCtx) {
    return function (watchItem, watchHandler, depKeysOrOpt) {
      var confMeta = {
        type: FN_WATCH,
        refCtx: refCtx,
        stateKeys: refCtx.stateKeys,
        retKeyFns: refCtx.watchRetKeyFns,
        module: refCtx.module,
        connect: refCtx.connect,
        dep: refCtx.watchDep
      };
      refCtx.__$$cuOrWaCalled = true;
      configureDepFns(CATE_REF, confMeta, watchItem, watchHandler, depKeysOrOpt);
    };
  }

  function getDefineComputedHandler (refCtx) {
    return function (computedItem, computedHandler, depKeysOrOpt) {
      var confMeta = {
        type: FN_CU,
        refCtx: refCtx,
        stateKeys: refCtx.stateKeys,
        retKeyFns: refCtx.computedRetKeyFns,
        module: refCtx.module,
        connect: refCtx.connect,
        dep: refCtx.computedDep
      };
      refCtx.__$$cuOrWaCalled = true;
      configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeysOrOpt);
    };
  }

  var makeUniqueCcKey$2 = makeUniqueCcKey;
  function computeCcUniqueKey (ccClassKey, ccKey, tag) {
    var featureStr = ccKey || uuid(tag);
    return makeUniqueCcKey$2(ccClassKey, featureStr);
  }

  function getOutProps (props) {
    if (props) {
      return props.props || props; //把最外层的props传递给用户
    } else {
      return {};
    }
  }

  var getState$1 = ccContext.store.getState;

  function getValFromEvent(e) {
    var se = convertToStandardEvent(e);

    if (se) {
      return se.currentTarget.value;
    } else {
      return e;
    }
  }

  var buildMockEvent = (function (spec, e, refCtx) {
    var refModule = refCtx.module,
        refState = refCtx.state;
    var ccint = false,
        ccsync = '',
        ccrkey = '',
        value = '',
        extraState = null,
        ccdelay = -1,
        isToggleBool = false;
    var syncKey = spec[CCSYNC_KEY];
    var type = spec.type;
    var noAutoExtract = false;

    if (syncKey !== undefined) {
      //来自sync生成的setter函数调用 即 sync('xxxKey')
      ccsync = syncKey;
      ccdelay = spec.delay;
      ccrkey = spec.rkey; // type 'bool', 'val', 'int', 'as'

      ccint = type === 'int'; //convert to int

      isToggleBool = type === 'bool';
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

      var mState = getState$1(module); // 布尔值需要对原来的值取反

      var fullState = module !== refModule ? mState : refState;
      value = type === 'bool' ? !getValueByKeyPath(fullState, keyPath) : getValFromEvent(e); //优先从spec里取，取不到的话，从e里面分析并提取

      var val = spec.val;

      if (val === undefined) ; else {
        if (typeof val === 'function') {
          // moduleState指的是所修改的目标模块的state
          var syncRet = val(value, keyPath, {
            event: e,
            module: module,
            moduleState: mState,
            fullKeyPath: fullKeyPath,
            state: refState,
            refCtx: refCtx
          });

          if (syncRet != undefined) {
            if (type === 'as') value = syncRet; // value is what cb returns;
            else {
                var retType = typeof syncRet;

                if (retType === 'boolean') {
                  // if return true, let noAutoExtract = false, so this cb will not block state update, and cc will extract partial state automatically
                  // if return false, let noAutoExtract = true, but now extraState is still null, so this cb will block state update
                  noAutoExtract = !syncRet;
                } else if (retType === 'object') {
                  noAutoExtract = true;
                  extraState = syncRet;
                } else {
                  justWarning("syncKey[" + syncKey + "] cb result type error.");
                }
              }
          } else {
            if (type === 'as') noAutoExtract = true; // if syncAs return undefined, will block update
            // else continue update and value is just extracted above
          }
        } else {
          value = val;
        }
      }
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
        ccrkey = dataset.ccrkey;
        var dataSetDelay = dataset.ccdelay;

        if (dataSetDelay) {
          try {
            ccdelay = parseInt(dataSetDelay);
          } catch (err) {// do nothing
          }
        }
      } else {
        //<Input onChange={this.sync}/> is invalid
        return null;
      }
    }

    return {
      currentTarget: {
        value: value,
        extraState: extraState,
        noAutoExtract: noAutoExtract,
        dataset: {
          ccsync: ccsync,
          ccint: ccint,
          ccdelay: ccdelay,
          ccrkey: ccrkey
        }
      },
      isToggleBool: isToggleBool
    };
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

  var getState$2 = ccContext.store.getState;
  function __sync (spec, ref, e) {
    var refCtx = ref.ctx;
    var refModule = refCtx.module;
    var mockE = buildMockEvent(spec, e, refCtx);
    if (!mockE) return; //参数无效 例如 <input onChange={this.sync}/> 导致

    var currentTarget = mockE.currentTarget;
    var dataset = currentTarget.dataset,
        value = currentTarget.value,
        extraState = currentTarget.extraState,
        noAutoExtract = currentTarget.noAutoExtract;
    if (e && e.stopPropagation) e.stopPropagation();
    var ccint = dataset.ccint,
        ccdelay = dataset.ccdelay,
        ccrkey = dataset.ccrkey;
    var ccsync = dataset.ccsync;

    if (ccsync.startsWith('/')) {
      ccsync = "" + refModule + ccsync; //附加上默认模块值
    }

    if (ccsync.includes('/')) {
      // syncModuleState 同步模块的state状态
      var targetModule = ccsync.split('/')[0];
      checkModuleName(targetModule, false);
      var ccKey = refCtx.ccKey,
          ccUniqueKey = refCtx.ccUniqueKey;
      var options = {
        calledBy: SYNC,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: targetModule,
        renderKey: ccrkey,
        delay: ccdelay
      };

      if (noAutoExtract) {
        if (extraState) changeRefState(extraState, options, ref);
        return;
      }

      var fullState = targetModule !== refModule ? getState$2(targetModule) : ref.state;

      var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool),
          state = _extractStateByCcsync.state;

      changeRefState(state, options, ref);
    } else {
      //调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
      if (noAutoExtract) {
        if (extraState) ref.setState(extraState, null, ccrkey, ccdelay);
        return;
      }

      var _extractStateByCcsync2 = extractStateByCcsync(ccsync, value, ccint, ref.state, mockE.isToggleBool),
          _state = _extractStateByCcsync2.state;

      ref.setState(_state, null, ccrkey, ccdelay);
    }
  }

  var getModuleStateKeys$1 = ccContext.getModuleStateKeys;
  var verifyKeys$1 = verifyKeys,
      vbi$2 = verboseInfo;
  function getStoredKeys(belongMotule, refPrivState, ccOptionStoredKeys, regStoredKeys) {
    var targetStoredKeys = ccOptionStoredKeys || regStoredKeys;

    if (!targetStoredKeys) {
      return [];
    }

    var moduleStateKeys = getModuleStateKeys$1(belongMotule);

    if (targetStoredKeys === '*') {
      // refPrivState里可能含有moduleStateKey，需要进一步过滤
      return Object.keys(refPrivState).filter(function (k) {
        return !moduleStateKeys.includes(k);
      });
    } else {
      checkStoredKeys(belongMotule, targetStoredKeys);
      return targetStoredKeys;
    }
  }
  function getWatchedStateKeys(module, ccClassKey, regWatchedKeys) {
    if (ccClassKey === CC_DISPATCHER) return [];
    if (!regWatchedKeys) return [];

    if (regWatchedKeys === '*') {
      return getModuleStateKeys$1(module);
    }

    if (regWatchedKeys === '-') {
      return regWatchedKeys;
    }

    var _verifyKeys = verifyKeys$1(regWatchedKeys, []),
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray || keyElementNotString) {
      var vbiInfo = vbi$2("ccClassKey:" + ccClassKey);
      throw new Error("watchedKeys " + STR_ARR_OR_STAR + " " + vbiInfo);
    }

    return regWatchedKeys;
  }
  function getConnect(regConnect) {
    var targetConnect = regConnect || {}; // codesandbox lost default value

    if (!isPJO(targetConnect, true)) {
      throw new Error("param connect type error, it " + NOT_A_JSON + " or string array");
    }

    var isArr = Array.isArray(targetConnect);
    var finalConnect = {};

    if (isArr || typeof targetConnect === 'string') {
      var connectedModules = isArr ? targetConnect : targetConnect.split(',');
      connectedModules.forEach(function (m) {
        finalConnect[m] = '-';
      }); //标识自动收集观察依赖
    } else {
      finalConnect = regConnect;
    } // 未设定连接$$global模块的watchedKeys参数时，自动连接$$global模块，并默认采用依赖收集


    if (!finalConnect[MODULE_GLOBAL]) {
      finalConnect[MODULE_GLOBAL] = '-';
    }

    checkConnectSpec(finalConnect);
    return finalConnect;
  }

  var _ccContext$reducer = ccContext.reducer,
      _module_fnNames_ = _ccContext$reducer._module_fnNames_,
      _caller = _ccContext$reducer._caller,
      refStore$1 = ccContext.refStore,
      getModuleStateKeys$2 = ccContext.getModuleStateKeys,
      _ccContext$store$2 = ccContext.store,
      getState$3 = _ccContext$store$2.getState,
      getModuleVer$2 = _ccContext$store$2.getModuleVer;
  var okeys$7 = okeys,
      me$1 = makeError,
      vbi$3 = verboseInfo,
      safeGet$2 = safeGet,
      justWarning$5 = justWarning,
      isObjectNull$2 = isObjectNull,
      isValueNotNull$1 = isValueNotNull,
      noDupPush$1 = noDupPush;
  var idSeq = 0;

  function getEId() {
    idSeq++;
    return Symbol("__autoGen_" + idSeq + "__");
  }

  var noop$1 = function noop$$1() {};

  var eType = function eType(th) {
    return "type of defineEffect " + th + " param must be";
  };

  var getWatchedKeys = function getWatchedKeys(ctx) {
    if (ctx.watchedKeys === '-') {
      if (ctx.__$$renderStatus === START) return okeys$7(ctx.__$$compareWaKeys);else return okeys$7(ctx.__$$curWaKeys);
    } else return ctx.watchedKeys;
  };

  var getConnectWatchedKeys = function getConnectWatchedKeys(ctx, module) {
    var connect = ctx.connect,
        connectedModules = ctx.connectedModules;
    var isConnectArr = Array.isArray(connect);

    var getModuleWaKeys = function getModuleWaKeys(m) {
      if (ctx.__$$renderStatus === START) return okeys$7(ctx.__$$compareConnWaKeys[m]);else return okeys$7(ctx.__$$curConnWaKeys[m]);
    };

    var getWKeys = function getWKeys(module) {
      if (isConnectArr) {
        // auto observe connect modules
        return getModuleWaKeys(module);
      } else {
        var waKeys = connect[module];
        if (waKeys === '*') return getModuleStateKeys$2(module);else if (waKeys === '-') return getModuleWaKeys(module);else return waKeys;
      }
    };

    if (module) return getWKeys(module);else {
      var cKeys = {};
      connectedModules.forEach(function (m) {
        cKeys[m] = getWKeys(m);
      });
      return cKeys;
    }
  };

  function recordDep(ccUniqueKey, module, watchedKeys) {
    var waKeys = watchedKeys === '*' ? getModuleStateKeys$2(module) : watchedKeys;
    waKeys.forEach(function (stateKey) {
      return mapIns(module, stateKey, ccUniqueKey);
    });
  } //调用buildFragmentRefCtx 之前，props参数已被处理过

  /**
   * 构建refCtx，附加到ref上
   * liteLevel 越小，绑定的方法越少
   */


  function buildRefCtx (ref, params, liteLevel) {
    if (liteLevel === void 0) {
      liteLevel = 5;
    }

    // 能省赋默认值的就省，比如state，外层调用都保证赋值过了
    var ccClassKey = params.ccClassKey,
        _params$ccKey = params.ccKey,
        ccKey = _params$ccKey === void 0 ? '' : _params$ccKey,
        module = params.module,
        type = params.type,
        insType = params.insType,
        _params$extra = params.extra,
        extra = _params$extra === void 0 ? {} : _params$extra,
        id = params.id,
        state = params.state,
        _params$storedKeys = params.storedKeys,
        storedKeys = _params$storedKeys === void 0 ? [] : _params$storedKeys,
        _params$persistStored = params.persistStoredKeys,
        persistStoredKeys = _params$persistStored === void 0 ? false : _params$persistStored,
        _params$watchedKeys = params.watchedKeys,
        watchedKeys = _params$watchedKeys === void 0 ? '-' : _params$watchedKeys,
        _params$connect = params.connect,
        connect = _params$connect === void 0 ? {} : _params$connect,
        _params$tag = params.tag,
        tag = _params$tag === void 0 ? '' : _params$tag,
        _params$ccOption = params.ccOption,
        ccOption = _params$ccOption === void 0 ? {} : _params$ccOption;
    var stateModule = module;
    var existedCtx = ref.ctx;
    var isCtxNull = isObjectNull$2(existedCtx); // 做个保护判断，防止 ctx = {}

    var modStateKeys = getModuleStateKeys$2(stateModule);
    var __boundSetState = ref.setState,
        __boundForceUpdate = ref.forceUpdate; // 如果已存在ctx，则直接指向原来的__bound，否则会造成无限递归调用栈溢出
    // 做个保护判断，防止 ctx = {}

    if (!isCtxNull && existedCtx.ccUniqueKey) {
      __boundSetState = existedCtx.__boundSetState;
      __boundForceUpdate = existedCtx.__boundForceUpdate;
    } else if (type !== CC_HOOK) {
      __boundSetState = ref.setState.bind(ref);
      __boundForceUpdate = ref.forceUpdate.bind(ref);
    }

    var refOption = {};
    refOption.persistStoredKeys = ccOption.persistStoredKeys === undefined ? persistStoredKeys : ccOption.persistStoredKeys;
    refOption.tag = ccOption.tag || tag; // pick ccOption tag first, register tag second

    var ccUniqueKey = computeCcUniqueKey(ccClassKey, ccKey, refOption.tag); // 没有设定renderKey的话读id，最后才默认renderKey为ccUniqueKey

    refOption.renderKey = ccOption.renderKey || id || ccUniqueKey;
    refOption.storedKeys = getStoredKeys(stateModule, state, ccOption.storedKeys, storedKeys); //用户使用ccKey属性的话，必需显示的指定ccClassKey

    if (ccKey && !ccClassKey) {
      throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
    }

    if (refOption.storedKeys.length > 0) {
      if (!ccKey) throw me$1(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi$3("ccClassKey[" + ccClassKey + "]"));
    }

    var mstate = getState$3(module); // recover ref state

    var refStoredState = refStore$1._state[ccUniqueKey] || {};
    var mergedState = Object.assign({}, state, refStoredState, mstate);
    ref.state = mergedState;
    var stateKeys = okeys$7(mergedState);
    var connectedModules = okeys$7(connect);
    var connectedState = {};
    var connectedComputed = {};
    connectedModules.forEach(function (m) {
      connectedComputed[m] = makeCuRefObContainer(ref, m, false);
    });
    var moduleComputed = makeCuRefObContainer(ref, module); // 所有实例都自动连接上了global模块，这里可直接取connectedComputed已做好的结果

    var globalComputed = connectedComputed[MODULE_GLOBAL];
    var globalState = makeObState(ref, getState$3(MODULE_GLOBAL), MODULE_GLOBAL, false); // extract privStateKeys

    var privStateKeys = removeArrElements(okeys$7(state), modStateKeys);
    var moduleState = module === MODULE_GLOBAL ? globalState : makeObState(ref, mstate, module, true); // declare cc state series api

    var changeState = function changeState(state, option) {
      changeRefState(state, option, ref);
    };

    var _setState = function _setState(module, state, calledBy, reactCallback, renderKey, delay$$1) {
      changeState(state, {
        calledBy: calledBy,
        module: module,
        renderKey: renderKey,
        delay: delay$$1,
        reactCallback: reactCallback
      });
    };

    var setModuleState = function setModuleState(module, state, reactCallback, renderKey, delay$$1) {
      _setState(module, state, SET_MODULE_STATE, reactCallback, renderKey, delay$$1);
    };

    var setState = function setState(p1, p2, p3, p4, p5) {
      var p1Type = typeof p1;

      if (p1Type === 'string') {
        //p1: module, p2: state, p3: cb, p4: rkey, p5: delay
        setModuleState(p1, p2, p3, p4, p5);
      } else if (p1Type === 'function') {
        var newState = p1(Object.assign({}, ctx.unProxyState), ctx.props);

        _setState(stateModule, newState, SET_STATE, p2, p3, p4);
      } else {
        //p1: state, p2: cb, p3: rkey, p4: delay
        _setState(stateModule, p1, SET_STATE, p2, p3, p4);
      }
    };

    var forceUpdate = function forceUpdate(reactCallback, renderKey, delay$$1) {
      _setState(stateModule, ref.unProxyState, FORCE_UPDATE, reactCallback, renderKey, delay$$1);
    };

    var __$$onEvents = [];
    var effectItems = [],
        effectPropsItems = []; // {fn:function, status:0, eId:'', immediate:true}

    var eid_effectReturnCb_ = {},
        eid_effectPropsReturnCb_ = {}; // fn

    var effectMeta = {
      effectItems: effectItems,
      eid_effectReturnCb_: eid_effectReturnCb_,
      effectPropsItems: effectPropsItems,
      eid_effectPropsReturnCb_: eid_effectPropsReturnCb_
    };
    var refs = {}; // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
    // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }

    var computedDep = {},
        watchDep = {};
    var props = getOutProps(ref.props);
    var now = Date.now();
    var ctx = {
      // static params
      type: type,
      insType: insType,
      module: module,
      ccClassKey: ccClassKey,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      renderCount: 1,
      initTime: now,
      watchedKeys: watchedKeys,
      privStateKeys: privStateKeys,
      connect: connect,
      connectedModules: connectedModules,
      // dynamic meta, I don't want user know these props, so let field name start with __$$
      __$$onEvents: __$$onEvents,
      // 当组件还未挂载时，event中心会将事件存到__$$onEvents里，当组件挂载时检查的事件列表并执行，然后清空
      __$$hasModuleState: modStateKeys.length > 0,
      __$$renderStatus: UNSTART,
      __$$curWaKeys: {},
      __$$compareWaKeys: {},
      __$$compareWaKeyCount: 0,
      // write before render
      __$$nextCompareWaKeys: {},
      __$$nextCompareWaKeyCount: 0,
      __$$curConnWaKeys: {},
      __$$compareConnWaKeys: {},
      __$$compareConnWaKeyCount: {},
      __$$nextCompareConnWaKeys: {},
      __$$nextCompareConnWaKeyCount: {},
      __$$staticWaKeys: {},
      // 用于快速的去重记录
      __$$staticWaKeyList: [],
      // 在实例didMount时由__$$staticWaKeys计算得出，用于辅助清理依赖映射
      persistStoredKeys: refOption.persistStoredKeys,
      storedKeys: refOption.storedKeys,
      renderKey: refOption.renderKey,
      tag: refOption.tag,
      prevProps: props,
      props: props,
      // collected mapProps result
      mapped: {},
      prevState: mergedState,
      // state
      state: makeObState(ref, mergedState, stateModule, true),
      unProxyState: mergedState,
      // 没有proxy化的state
      moduleState: moduleState,
      __$$mstate: mstate,
      // 用于before-render里避免merge moduleState而导致的冗余触发get，此属性不暴露给用户使用，因其不具备依赖收集能力
      globalState: globalState,
      connectedState: connectedState,
      // for function: can pass value to extra in every render period
      // for class: can pass value to extra one time
      extra: extra,
      staticExtra: {},
      // computed result containers
      refComputed: {},
      // 有依赖收集行为的结果容器，此时还说一个普通对象，在beforeMount时会被替换
      refComputedValue: {},
      // 包裹了defineProperty后的结果容器
      // 原始的计算结果容器，在beforeMount阶段对refComputedValue包裹defineProperty时，会用refComputedOri来存储refComputedValue的值
      refComputedOri: {},
      moduleComputed: moduleComputed,
      globalComputed: globalComputed,
      connectedComputed: connectedComputed,
      moduleReducer: {},
      connectedReducer: {},
      reducer: {},
      // api meta data
      stateKeys: stateKeys,
      computedDep: computedDep,
      computedRetKeyFns: {},
      watchDep: watchDep,
      watchRetKeyFns: {},
      //不按模块分类，映射的watchRetKey_fn_
      execute: null,
      effectMeta: effectMeta,
      retKey_fnUid_: {},
      // api
      reactSetState: noop$1,
      //等待重写
      __boundSetState: __boundSetState,
      reactForceUpdate: noop$1,
      //等待重写
      __boundForceUpdate: __boundForceUpdate,
      setState: setState,
      setModuleState: setModuleState,
      forceUpdate: forceUpdate,
      changeState: changeState,
      // not expose in d.ts
      refs: refs,
      useRef: function useRef(refName) {
        return function (ref) {
          return refs[refName] = {
            current: ref
          };
        }; // keep the same shape with hook useRef
      },
      // below only can be called by cc or updated by cc in existed period, not expose in d.ts
      __$$ccSetState: makeCcSetStateHandler(ref),
      __$$ccForceUpdate: makeCcForceUpdateHandler(ref),
      __$$settedList: [],
      //[{module:string, keys:string[]}, ...]
      __$$prevMoStateVer: {},
      __$$prevModuleVer: getModuleVer$2(stateModule),
      __$$cuOrWaCalled: false
    };
    ref.setState = setState;
    ref.forceUpdate = forceUpdate; // allow user have a chance to define state in setup block;

    ctx.initState = function (initialState) {
      // 已挂载则不让用户在调用initState
      if (ref.__$$isMounted) {
        return justWarning$5("initState can only been called before first render period!");
      }

      if (!isPJO(state)) {
        return justWarning$5("state " + NOT_A_JSON);
      }

      if (ctx.__$$cuOrWaCalled) {
        return justWarning$5("initState must been called before computed or watch");
      }

      var newRefState = Object.assign({}, state, initialState, refStoredState, mstate); // 更新stateKeys，防止遗漏新的私有stateKey

      ctx.stateKeys = okeys$7(newRefState);
      ctx.privStateKeys = removeArrElements(okeys$7(newRefState), modStateKeys);
      ctx.unProxyState = ctx.prevState = newRefState;
      ref.state = ctx.state = Object.assign(ctx.state, newRefState);
    }; // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler


    var dispatch = makeDispatchHandler(ref, false, false, stateModule);
    ctx.dispatch = dispatch;

    if (liteLevel > 1) {
      // level 2, assign these mod data api
      ctx.lazyDispatch = makeDispatchHandler(ref, true, false, stateModule);
      ctx.silentDispatch = makeDispatchHandler(ref, false, true, stateModule);
      ctx.dispatchLazy = ctx.lazyDispatch; // alias of lazyDispatch

      ctx.dispatchSilent = ctx.silentDispatch; // alias of silentDispatch

      ctx.invoke = makeInvokeHandler(ref);
      ctx.lazyInvoke = makeInvokeHandler(ref, {
        isLazy: true
      });
      ctx.silentInvoke = makeInvokeHandler(ref, {
        isLazy: false,
        isSilent: true
      });
      ctx.invokeLazy = ctx.lazyInvoke; // alias of lazyInvoke

      ctx.invokeSilent = ctx.silentInvoke; // alias of silentInvoke

      ctx.setGlobalState = function (state, reactCallback, renderKey, delay$$1) {
        _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, renderKey, delay$$1);
      };
    }

    if (liteLevel > 2) {
      // level 3, assign async api
      var cachedBoundFns = {};

      var doSync = function doSync(e, val, rkey, delay$$1, type) {
        if (typeof e === 'string') {
          var valType = typeof val;

          if (isValueNotNull$1(val) && (valType === 'object' || valType === 'function')) {
            var _sync$bind;

            return __sync.bind(null, (_sync$bind = {}, _sync$bind[CCSYNC_KEY] = e, _sync$bind.type = type, _sync$bind.val = val, _sync$bind.delay = delay$$1, _sync$bind.rkey = rkey, _sync$bind), ref);
          } else {
            var key = e + "|" + val + "|" + rkey + "|" + delay$$1;
            var boundFn = cachedBoundFns[key];

            if (!boundFn) {
              var _sync$bind2;

              boundFn = cachedBoundFns[key] = __sync.bind(null, (_sync$bind2 = {}, _sync$bind2[CCSYNC_KEY] = e, _sync$bind2.type = type, _sync$bind2.val = val, _sync$bind2.delay = delay$$1, _sync$bind2.rkey = rkey, _sync$bind2), ref);
            }

            return boundFn;
          }
        } // case: <input data-ccsync="foo/f1" onChange={ctx.sync} />


        __sync({
          type: 'val'
        }, ref, e);
      };

      ctx.sync = function (e, val, rkey, delay$$1) {
        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        return doSync(e, val, rkey, delay$$1, 'val');
      };

      ctx.syncBool = function (e, val, rkey, delay$$1) {
        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        return doSync(e, val, rkey, delay$$1, 'bool');
      };

      ctx.syncInt = function (e, val, rkey, delay$$1) {
        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        return doSync(e, val, rkey, delay$$1, 'int');
      };

      ctx.syncAs = function (e, val, rkey, delay$$1) {
        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        return doSync(e, val, rkey, delay$$1, 'as');
      };

      ctx.set = function (ccsync, val, rkey, delay$$1) {
        var _sync;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        __sync((_sync = {}, _sync[CCSYNC_KEY] = ccsync, _sync.type = 'val', _sync.val = val, _sync.delay = delay$$1, _sync.rkey = rkey, _sync), ref);
      };

      ctx.setBool = function (ccsync, rkey, delay$$1) {
        var _sync2;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay$$1 === void 0) {
          delay$$1 = -1;
        }

        __sync((_sync2 = {}, _sync2[CCSYNC_KEY] = ccsync, _sync2.type = 'bool', _sync2.delay = delay$$1, _sync2.rkey = rkey, _sync2), ref);
      };
    }

    if (liteLevel > 3) {
      // level 4, assign event api
      ctx.emit = function (event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        findEventHandlersToPerform.apply(ev, [getEventItem(event)].concat(args));
      }; // 默认off掉当前实例对某个事件名的所有监听


      ctx.off = function (event, _temp) {
        var _ref = _temp === void 0 ? {} : _temp,
            module = _ref.module,
            ccClassKey = _ref.ccClassKey,
            _ref$ccUniqueKey = _ref.ccUniqueKey,
            inputCcUkey = _ref$ccUniqueKey === void 0 ? ccUniqueKey : _ref$ccUniqueKey;

        // 这里刻意不为identity赋默认值，如果是undefined，表示off掉所有监听
        var _ev$getEventItem = getEventItem(event),
            name = _ev$getEventItem.name,
            identity = _ev$getEventItem.identity;

        findEventHandlersToOff(name, {
          module: module,
          ccClassKey: ccClassKey,
          ccUniqueKey: inputCcUkey,
          identity: identity
        });
      };

      ctx.on = function (inputEvent, handler) {
        var _ev$getEventItem2 = getEventItem(inputEvent),
            event = _ev$getEventItem2.name,
            identity = _ev$getEventItem2.identity;

        bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
      };
    }

    if (liteLevel > 4) {
      // level 5, assign enhance api
      ctx.execute = function (handler) {
        return ctx.execute = handler;
      };

      ctx.watch = getDefineWatchHandler(ctx);
      ctx.computed = getDefineComputedHandler(ctx);

      var makeEffectHandler = function makeEffectHandler(targetEffectItems, isProp) {
        return function (fn, depKeys, compare, immediate) {
          if (compare === void 0) {
            compare = true;
          }

          if (immediate === void 0) {
            immediate = true;
          }

          if (typeof fn !== 'function') throw new Error(eType('first') + " function");
          var _depKeys = depKeys; //对于effectProps 第三位参数就是immediate

          var _immediate = isProp ? compare : immediate; // depKeys 为null 和 undefined 表示无任何依赖，每一轮都执行的副作用


          if (depKeys !== null && depKeys !== undefined) {
            if (!Array.isArray(depKeys)) throw new Error(eType('second') + " one of them(array, null, undefined)");
          }

          var modDepKeys = null;

          if (!isProp && _depKeys) {
            modDepKeys = [];

            _depKeys.forEach(function (depKey) {
              var modDepKey;

              if (depKey.includes('/')) {
                modDepKey = depKey;

                var _depKey$split = depKey.split('/'),
                    m = _depKey$split[0];

                if (!ctx.connect[m]) {
                  throw me$1(ERR.CC_MODULE_NOT_CONNECTED, vbi$3("depKey[" + depKey + "]"));
                }
              } else {
                // 这里要注意， 私有的key
                modDepKey = stateModule + "/" + depKey;
              }

              modDepKeys.push(modDepKey); // 先暂时保持起来，组件挂载时才映射依赖

              ctx.__$$staticWaKeys[modDepKey] = 1;
            });
          } // 对于effectProps来说是不会读取compare属性来用的


          var effectItem = {
            fn: fn,
            isProp: isProp,
            depKeys: _depKeys,
            modDepKeys: modDepKeys,
            eId: getEId(),
            compare: compare,
            immediate: _immediate
          };
          targetEffectItems.push(effectItem);
        };
      };

      ctx.effect = makeEffectHandler(effectItems, false);
      ctx.effectProps = makeEffectHandler(effectPropsItems, true);
    } // 构造完毕ctx后，开始创建reducer，和可观察connectedState


    var moduleReducer = ctx.moduleReducer,
        connectedReducer = ctx.connectedReducer,
        __$$curConnWaKeys = ctx.__$$curConnWaKeys,
        __$$compareConnWaKeys = ctx.__$$compareConnWaKeys,
        __$$compareConnWaKeyCount = ctx.__$$compareConnWaKeyCount,
        __$$nextCompareConnWaKeys = ctx.__$$nextCompareConnWaKeys,
        __$$nextCompareConnWaKeyCount = ctx.__$$nextCompareConnWaKeyCount;
    var allModules = connectedModules.slice(); // 已在change-ref-state里做优化，支持组件即属于又连接同一个模块，不会照成冗余渲染，
    // 所以此处allModules包含了module对渲染性能无影响，不过代码的语义上会照成重复的表达

    noDupPush$1(allModules, module);
    var __$$autoWatch = false; // 向实例的reducer里绑定方法，key:{module} value:{reducerFn}
    // 为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

    allModules.forEach(function (m) {
      var reducerObj;

      if (m === module) {
        reducerObj = moduleReducer;
        if (module === MODULE_GLOBAL) connectedReducer[MODULE_GLOBAL] = moduleReducer;
      } else {
        // todo: 如果connectedReducer不在意调用者是谁，该属性可以删掉或者不用直接指向reducer，节省初始化refCtx的开销
        reducerObj = safeGet$2(connectedReducer, m);
      }

      var connectDesc = connect[m];

      if (connectDesc) {
        var _moduleState = getState$3(m);

        if (connectDesc === '-') {
          // auto watch
          __$$autoWatch = true;
          __$$curConnWaKeys[m] = {};
          __$$compareConnWaKeys[m] = {};
          __$$compareConnWaKeyCount[m] = 0;
          __$$nextCompareConnWaKeys[m] = {};
          __$$nextCompareConnWaKeyCount[m] = 0;
          if (m === MODULE_GLOBAL) _moduleState = ctx.globalState;else _moduleState = makeObState(ref, _moduleState, m);
        } // 非自动收集，这里就需要写入waKey_uKeyMap_来记录依赖关系了
        else {
            recordDep(ccUniqueKey, m, connectDesc);
          }

        connectedState[m] = _moduleState;
      }

      var fnNames = _module_fnNames_[m] || [];
      fnNames.forEach(function (fnName) {
        reducerObj[fnName] = function (payload, rkeyOrOption, delay$$1) {
          return dispatch(m + "/" + fnName, payload, rkeyOrOption, delay$$1);
        };
      });
    });
    ctx.reducer = _caller; //alias

    ctx.mr = ctx.moduleReducer;
    ctx.cr = ctx.connectedReducer;
    ctx.r = ctx.reducer;

    if (watchedKeys === '-') {
      __$$autoWatch = true;
    } else {
      // 开始记录依赖
      recordDep(ccUniqueKey, module, watchedKeys);
    }

    ctx.__$$autoWatch = __$$autoWatch; // 始终优先取ref上指向的ctx，对于在热加载模式下的hook组件实例，那里面有的最近一次渲染收集的依赖信息才是正确的

    ctx.getWatchedKeys = function () {
      return getWatchedKeys(ref.ctx || ctx);
    };

    ctx.getConnectWatchedKeys = function (module) {
      return getConnectWatchedKeys(ref.ctx || ctx, module);
    };

    if (isCtxNull) ref.ctx = ctx; // 适配热加载或者异步渲染里, 需要清理ctx里运行时收集的相关数据，重新分配即可
    else {
        // 这里需要把第一次渲染期间已经收集好的依赖再次透传给ref.ctx
        var _ref$ctx = ref.ctx,
            __$$curWaKeys = _ref$ctx.__$$curWaKeys,
            __$$compareWaKeys = _ref$ctx.__$$compareWaKeys,
            __$$compareWaKeyCount = _ref$ctx.__$$compareWaKeyCount,
            __$$nextCompareWaKeys = _ref$ctx.__$$nextCompareWaKeys,
            __$$nextCompareWaKeyCount = _ref$ctx.__$$nextCompareWaKeyCount,
            _$$curConnWaKeys = _ref$ctx.__$$curConnWaKeys,
            _$$compareConnWaKeys = _ref$ctx.__$$compareConnWaKeys,
            _$$compareConnWaKeyCount = _ref$ctx.__$$compareConnWaKeyCount,
            _$$nextCompareConnWaKeys = _ref$ctx.__$$nextCompareConnWaKeys,
            _$$nextCompareConnWaKeyCount = _ref$ctx.__$$nextCompareConnWaKeyCount;
        Object.assign(ref.ctx, ctx, {
          __$$curWaKeys: __$$curWaKeys,
          __$$compareWaKeys: __$$compareWaKeys,
          __$$compareWaKeyCount: __$$compareWaKeyCount,
          __$$nextCompareWaKeys: __$$nextCompareWaKeys,
          __$$nextCompareWaKeyCount: __$$nextCompareWaKeyCount,
          __$$curConnWaKeys: _$$curConnWaKeys,
          __$$compareConnWaKeys: _$$compareConnWaKeys,
          __$$compareConnWaKeyCount: _$$compareConnWaKeyCount,
          __$$nextCompareConnWaKeys: _$$nextCompareConnWaKeys,
          __$$nextCompareConnWaKeyCount: _$$nextCompareConnWaKeyCount
        });
      }
  }

  var okeys$8 = okeys;
  /**
   * 根据connect,watchedKeys,以及用户提供的原始renderKeyClasses 计算 特征值
   */

  function getFeatureStr (belongModule, connectSpec, renderKeyClasses) {
    var moduleNames = okeys$8(connectSpec);
    moduleNames.sort();
    var classesStr;
    if (renderKeyClasses === '*') classesStr = '*';else classesStr = renderKeyClasses.slice().join(',');
    return belongModule + "/" + moduleNames.join(',') + "/" + classesStr;
  }

  var isObjectNull$3 = isObjectNull,
      me$2 = makeError;
  var featureStr_classKey_ = ccContext.featureStr_classKey_,
      userClassKey_featureStr_ = ccContext.userClassKey_featureStr_,
      ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_;
  var cursor = 0;
  function getCcClassKey (allowNamingDispatcher, module, connect, prefix, featureStr, classKey) {
    if (classKey === void 0) {
      classKey = '';
    }

    // 未指定classKey
    if (!classKey) {
      // 未指定所属模块，也未连接到其他模块
      if (module === MODULE_DEFAULT && isObjectNull$3(connect)) {
        return prefix + "0";
      }

      var prefixedFeatureStr = prefix + ":" + featureStr;
      var _classKey = featureStr_classKey_[prefixedFeatureStr];

      if (_classKey) {
        return _classKey;
      }

      cursor++;
      _classKey = "" + prefix + cursor;
      featureStr_classKey_[prefixedFeatureStr] = _classKey;
      return _classKey;
    } // verify user input classKey


    if (classKey.startsWith(CC_PREFIX)) {
      throw new Error("user can not specify a classKey[" + classKey + "] starts with $$Cc");
    }

    if (!allowNamingDispatcher) {
      if (classKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
        // throw new Error(`${CC_DISPATCHER} is cc built-in ccClassKey name, if you want to customize your dispatcher, 
        // you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.`)
        // currently createDispatcher is not allowed..
        throw new Error(CC_DISPATCHER + " is cc built-in ccClassKey name.");
      }
    }

    var clsCtx = ccClassKey_ccClassContext_$1[classKey];

    if (clsCtx) {
      var fStr = userClassKey_featureStr_[classKey];

      if (fStr !== featureStr) {
        //不允许，特征值不一样的class指定相同的ccClassKey
        throw me$2(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:[" + classKey + "] duplicate");
      }
    } else {
      userClassKey_featureStr_[classKey] = featureStr;
    }

    return classKey;
  }

  function getRenderKeyClasses(ccClassKey, regRenderKeyClasses) {
    var _renderKeyClasses;

    if (!regRenderKeyClasses) {
      _renderKeyClasses = [ccClassKey];
    } else {
      if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
        throw new Error("renderKeyClasses type err, it " + STR_ARR_OR_STAR);
      }

      _renderKeyClasses = regRenderKeyClasses;
    }

    return _renderKeyClasses;
  }

  var ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;

  function checkCcStartupOrNot() {
    if (ccContext.isStartup !== true) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  }
  /**
   * map registration info to ccContext
   */


  function mapRegistrationInfo (module, ccClassKey, regRenderKeyClasses, classKeyPrefix, regWatchedKeys, regConnect, __checkStartUp, __calledBy) {
    if (module === void 0) {
      module = MODULE_DEFAULT;
    }

    if (__checkStartUp === true) checkCcStartupOrNot();
    var allowNamingDispatcher = __calledBy === 'cc';
    var renderKeyClasses = regRenderKeyClasses || [];
    checkModuleName(module, false, "module[" + module + "] not configured");
    checkRenderKeyClasses(renderKeyClasses);

    var _connect = getConnect(regConnect);

    var _watchedKeys = getWatchedStateKeys(module, ccClassKey, regWatchedKeys); // 注意此处用户不指定renderKeyClasses时，算出来的特征值和renderKeyClasses无关


    var featureStr = getFeatureStr(module, _connect, renderKeyClasses);

    var _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey); // 此处再次获得真正的renderKeyClasses


    var _renderKeyClasses = getRenderKeyClasses(_ccClassKey, renderKeyClasses);

    var ccClassContext = ccClassKey_ccClassContext_$2[_ccClassKey]; //做一个判断，有可能是热加载调用

    if (!ccClassContext) {
      ccClassContext = makeCcClassContext(module, _ccClassKey, _renderKeyClasses);
      ccClassKey_ccClassContext_$2[_ccClassKey] = ccClassContext;
    }

    return {
      _module: module,
      _connect: _connect,
      _ccClassKey: _ccClassKey,
      _watchedKeys: _watchedKeys
    };
  }

  var noop$2 = function noop() {};

  function createDispatcher () {
    var ccClassKey = CC_DISPATCHER;
    mapRegistrationInfo(MODULE_DEFAULT, ccClassKey, '', CC_CLASS, [], [], false, 'cc');
    var mockRef = {
      setState: noop$2,
      forceUpdate: noop$2
    };
    buildRefCtx(mockRef, {
      module: MODULE_DEFAULT,
      ccClassKey: ccClassKey,
      state: {}
    });
    ccContext.permanentDispatcher = mockRef;
  }

  var isPJO$6 = isPJO,
      okeys$9 = okeys;

  function checkObj(rootObj, tag) {
    if (!isPJO$6(rootObj)) {
      throw new Error(tag + " " + NOT_A_JSON);
    }
  }
  /** 对已有的store.$$global状态追加新的state */
  // export function appendGlobalState(globalState) {
  //   // todo
  // }


  function configStoreState(storeState) {
    checkObj(storeState, 'state');
    delete storeState[MODULE_VOID];
    delete storeState[MODULE_CC];
    if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
    if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
    var moduleNames = okeys$9(storeState);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      var moduleState = storeState[moduleName];
      initModuleState(moduleName, moduleState);
    }
  }
  /**
   * 
   * @param {{[moduleName:string]:{[reducerFnType:string]:function}}} rootReducer 
   */

  function configRootReducer(rootReducer) {
    checkObj(rootReducer, 'reducer');
    if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
    if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
    okeys$9(rootReducer).forEach(function (m) {
      return initModuleReducer(m, rootReducer[m]);
    });
  }
  function configRootComputed(rootComputed) {
    checkObj(rootComputed, 'computed');
    okeys$9(rootComputed).forEach(function (m) {
      return initModuleComputed(m, rootComputed[m]);
    });
  }
  function configRootWatch(rootWatch) {
    checkObj(rootWatch, 'watch');
    Object.keys(rootWatch).forEach(function (m) {
      return initModuleWatch(m, rootWatch[m]);
    });
  }
  function executeRootInit(init, initPost) {
    if (!init) return;

    if (!isPJO$6(init)) {
      throw new Error("init " + NOT_A_JSON);
    }

    okeys$9(init).forEach(function (moduleName) {
      checkModuleName(moduleName, false);
      var initFn = init[moduleName];

      if (initFn) {
        Promise.resolve().then(initFn).then(function (state) {
          makeSetStateHandler(moduleName, initPost[moduleName])(state);
        });
      }
    });
    ccContext.init._init = init;
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
      ccContext.pluginNameMap = pluginNameMap;
    }
  }

  var justCalledByStartUp = false;

  function _clearInsAssociation(recomputed, otherExcludeKeys) {
    if (recomputed === void 0) {
      recomputed = false;
    }

    clearCuRefer();
    clearObject(ccContext.event_handlers_);
    clearObject(ccContext.ccUKey_handlerKeys_);
    var ccUKey_ref_ = ccContext.ccUKey_ref_;
    clearObject(ccContext.handlerKey_handler_);
    clearObject(ccUKey_ref_, otherExcludeKeys);

    if (recomputed) {
      var computed = ccContext.computed,
          watch = ccContext.watch;
      var computedValue = computed._computedValue;
      var watchDep = watch._watchDep;
      var modules = okeys(ccContext.store._state);
      modules.forEach(function (m) {
        if (m === MODULE_CC) return;

        if (computedValue[m]) {
          // !!!先清除之前建立好的依赖关系
          ccContext.computed._computedDep[m] = makeCuDepDesc();
          initModuleComputed(m, computed._computedRaw[m]);
        }

        if (watchDep[m]) {
          // !!!先清除之前建立好的依赖关系
          watchDep[m] = makeCuDepDesc();
          initModuleWatch(m, watch._watchRaw[m]);
        }
      });
    }
  }

  function _pickNonCustomizeIns() {
    var ccUKey_ref_ = ccContext.ccUKey_ref_;
    var ccFragKeys = [];
    var ccNonCusKeys = [];
    okeys(ccUKey_ref_).forEach(function (ccKey) {
      var ref = ccUKey_ref_[ccKey];

      if (ref && ref.__$$isMounted === true // 已挂载
      && ref.__$$isUnmounted === false // 未卸载
      ) {
          var insType = ref.ctx.insType; // insType判断实例是由用户直接使用<CcFragment>初始化化的组件实例

          if (insType === CC_FRAGMENT) {
            ccFragKeys.push(ccKey);
            ccNonCusKeys.push(ccKey);
          } else if (insType === CC_OB) {
            ccNonCusKeys.push(ccKey);
          }
        }
    });
    return {
      ccFragKeys: ccFragKeys,
      ccNonCusKeys: ccNonCusKeys
    };
  }

  function _clearAll() {
    clearObject(ccContext.globalStateKeys); // 在codesandbox里，按标准模式组织的代码，如果只是修改了runConcent里相关联的代码，pages目录下的configure调用不会被再次触发的
    // 所以是来自configure调用配置的模块则不参与清理，防止报错

    var toExcludedModules = okeys(ccContext.moduleName_isConfigured_).concat([MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER]);
    clearObject(ccContext.reducer._reducer, toExcludedModules);
    clearObject(ccContext.store._state, toExcludedModules, {}, true);
    clearObject(ccContext.computed._computedDep, toExcludedModules);
    clearObject(ccContext.computed._computedValue, toExcludedModules);
    clearObject(ccContext.watch._watchDep, toExcludedModules);
    clearObject(ccContext.middlewares);
    clearObject(ccContext.waKey_uKeyMap_);
    clearCachedData();

    var _pickNonCustomizeIns2 = _pickNonCustomizeIns(),
        ccFragKeys = _pickNonCustomizeIns2.ccFragKeys,
        ccNonCusKeys = _pickNonCustomizeIns2.ccNonCusKeys;

    _clearInsAssociation(false, ccNonCusKeys);

    return ccFragKeys;
  }

  function clearContextIfHot (clearAll) {
    if (clearAll === void 0) {
      clearAll = false;
    }

    ccContext.info.latestStartupTime = Date.now(); // 热加载模式下，这些CcFragIns随后需要被恢复

    var ccFragKeys = [];

    if (ccContext.isStartup) {
      if (ccContext.isHotReloadMode()) {
        if (clearAll) {
          console.warn("attention: make sure [[clearContextIfHot]] been called before app rendered!");
          justCalledByStartUp = true;
          ccFragKeys = _clearAll(clearAll);
          return ccFragKeys;
        } else {
          // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
          // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命令单独放置在一个脚本里，
          // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
          // runConcent调用清理把justCalledByStartUp置为true，则renderApp这里再次触发clear时就可以不用执行了(注意确保renderApp之前，调用了clearContextIfHot)
          // 而随后只是改了某个component文件时，则只会触发 renderApp，
          // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
          if (justCalledByStartUp) {
            justCalledByStartUp = false;
            return ccFragKeys;
          }

          var ret = _pickNonCustomizeIns(); // !!!重计算各个模块的computed结果


          _clearInsAssociation(ccContext.reComputed, ret.ccNonCusKeys);

          return ret.ccFragKeys;
        }
      } else {
        console.warn("clear failed because of not running under hot reload mode!");
        return ccFragKeys;
      }
    } else {
      //还没有启动过，泽只是标记justCalledByStartUp为true
      justCalledByStartUp = true;
      return ccFragKeys;
    }
  }

  var moduleName_stateKeys_$3 = ccContext.moduleName_stateKeys_,
      _ccContext$store$3 = ccContext.store,
      getPrevState$1 = _ccContext$store$3.getPrevState,
      getState$4 = _ccContext$store$3.getState,
      getStateVer$1 = _ccContext$store$3.getStateVer;

  var warn = function warn(key, frag) {
    return justWarning("effect: key[" + key + "] is invalid, its " + frag + " has not been declared in' store!");
  };

  function mapSettedList(settedList) {
    return settedList.reduce(function (map, _ref) {
      var module = _ref.module,
          keys = _ref.keys;
      keys.forEach(function (key) {
        return map[module + "/" + key] = 1;
      });
      return map;
    }, {});
  }

  function triggerSetupEffect (ref, callByDidMount) {
    var ctx = ref.ctx;
    var _ctx$effectMeta = ctx.effectMeta,
        effectItems = _ctx$effectMeta.effectItems,
        eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
        effectPropsItems = _ctx$effectMeta.effectPropsItems,
        eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;
    var __$$prevMoStateVer = ctx.__$$prevMoStateVer,
        __$$settedList = ctx.__$$settedList,
        refModule = ctx.module;

    var makeItemHandler = function makeItemHandler(eid_cleanCb_, isFirstCall, needJudgeImmediate) {
      return function (item) {
        var fn = item.fn,
            eId = item.eId,
            immediate = item.immediate;

        if (needJudgeImmediate) {
          if (immediate === false) return;
        }

        var prevCb = eid_cleanCb_[eId];
        if (prevCb) prevCb(ctx); // let ctx.effect have the totally same behavior with useEffect

        var cb = fn(ctx, isFirstCall);
        eid_cleanCb_[eId] = cb; //不管有没有返回，都要覆盖之前的结果
      };
    };

    if (callByDidMount) {
      // flag isFirstCall as true
      effectItems.forEach(makeItemHandler(eid_effectReturnCb_, true, true));
      effectPropsItems.forEach(makeItemHandler(eid_effectPropsReturnCb_, true, true));
    } else {
      // callByDidUpdate
      // start handle effect meta data of state keys
      var prevState = ctx.prevState;
      var curState = ctx.unProxyState;
      var toBeExecutedFns = [];
      effectItems.forEach(function (item) {
        // const { status, depKeys, fn, eId } = item;
        // if (status === EFFECT_STOPPED) return;
        // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
        var modDepKeys = item.modDepKeys,
            compare = item.compare,
            fn = item.fn,
            eId = item.eId;

        if (modDepKeys) {
          var keysLen = modDepKeys.length;
          if (keysLen === 0) return;
          var mappedSettedKey = mapSettedList(__$$settedList);
          var shouldEffectExecute = false;

          for (var i = 0; i < keysLen; i++) {
            var key = modDepKeys[i];

            if (!compare) {
              if (mappedSettedKey[key]) {
                shouldEffectExecute = true;
                break;
              } else {
                continue;
              }
            }

            var targetCurState = void 0,
                targetPrevState = void 0;

            var _key$split = key.split('/'),
                module = _key$split[0],
                unmoduledKey = _key$split[1];

            if (module !== refModule) {
              var _prevState = getPrevState$1(module);

              var moduleStateVer = getStateVer$1(module);

              if (__$$prevMoStateVer[unmoduledKey] === moduleStateVer[unmoduledKey]) {
                continue;
              } else {
                __$$prevMoStateVer[unmoduledKey] = moduleStateVer[unmoduledKey];
              }

              if (!_prevState) {
                warn(key, "module[" + module + "]");
                continue;
              }

              if (!moduleName_stateKeys_$3[module].includes(unmoduledKey)) {
                warn(key, "unmoduledKey[" + unmoduledKey + "]");
                continue;
              }

              targetCurState = getState$4(module);
              targetPrevState = _prevState;
            } else {
              targetCurState = curState;
              targetPrevState = prevState;
            }

            if (targetPrevState[unmoduledKey] !== targetCurState[unmoduledKey]) {
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
      }); // flag isFirstCall as false, start to run state effect fns

      toBeExecutedFns.forEach(makeItemHandler(eid_effectReturnCb_, false, false)); // start handle effect meta data of props keys

      var prevProps = ctx.prevProps;
      var curProps = ctx.props;
      var toBeExecutedPropFns = [];
      effectPropsItems.forEach(function (item) {
        var depKeys = item.depKeys,
            fn = item.fn,
            eId = item.eId;

        if (depKeys) {
          // prop dep key
          var keysLen = depKeys.length;
          if (keysLen === 0) return;
          var shouldEffectExecute = false;

          for (var i = 0; i < keysLen; i++) {
            var key = depKeys[i];

            if (prevProps[key] !== curProps[key]) {
              shouldEffectExecute = true;
              break;
            }
          }

          if (shouldEffectExecute) toBeExecutedPropFns.push({
            fn: fn,
            eId: eId
          });
        } else {
          toBeExecutedPropFns.push({
            fn: fn,
            eId: eId
          });
        }
      }); // flag isFirstCall as false, start to run prop effect fns

      toBeExecutedPropFns.forEach(makeItemHandler(eid_effectPropsReturnCb_, false, false)); // clear settedList

      __$$settedList.length = 0;
    }
  }

  var justWarning$6 = justWarning,
      me$3 = makeError,
      vbi$4 = verboseInfo,
      ss = styleStr,
      cl = color;
  var runtimeVar$2 = ccContext.runtimeVar,
      ccUKey_ref_$2 = ccContext.ccUKey_ref_;
  var ccUKey_insCount = {};

  function setCcInstanceRef(ccUniqueKey, ref, delayMs) {
    var setRef = function setRef() {
      ccUKey_ref_$2[ccUniqueKey] = ref;
    };

    if (ccContext.isHotReloadMode()) incCcKeyInsCount(ccUniqueKey);

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
  function setRef (ref) {
    if (runtimeVar$2.isDebug) {
      console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
    }

    var _ref$ctx = ref.ctx,
        ccClassKey = _ref$ctx.ccClassKey,
        ccKey = _ref$ctx.ccKey,
        ccUniqueKey = _ref$ctx.ccUniqueKey;
    var isHot = ccContext.isHotReloadMode();

    if (ccUKey_ref_$2[ccUniqueKey]) {
      var dupErr = function dupErr() {
        throw me$3(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$4("ccClass:" + ccClassKey + ",ccKey:" + ccKey));
      };

      if (isHot) {
        // get existed ins count
        var insCount = getCcKeyInsCount(ccUniqueKey);

        if (insCount > 1) {
          // now cc can make sure the ccKey duplicate
          dupErr();
        } // just warning


        justWarning$6("\n        found ccKey[" + ccKey + "] duplicated in hot reload mode, please make sure your ccKey is unique manually,\n        " + vbi$4("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
        // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now in unmount func, 
        // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
        // so cc set ref later

        setCcInstanceRef(ccUniqueKey, ref, 600);
      } else {
        dupErr();
      }
    } else {
      setCcInstanceRef(ccUniqueKey, ref);
    }
  }

  // cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
  //
  // rendering input
  // cur: {a:'val', c:'val', d:'val'}
  //
  // after render
  // cur: {a:1, c:1, c:1} compare: {a:1, b:2, c:1, d:1} nextCompare:{a:2, c:2, d:2}
  //
  // then concent will know b should delete dep because=0, 
  // compare key count=4>3 or compare include 2, so should let cache expire
  //
  // before next render
  // cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}

  /** 删除依赖 */

  function delDep(compareWaKeys, compareWaKeyCount, module, ccUniqueKey) {
    var shouldLetCacheExpire = false;
    var waKeys = okeys(compareWaKeys);
    waKeys.forEach(function (waKey) {
      // no module prefix
      if (compareWaKeys[waKey] === 2) {
        //这个key在这轮渲染结束后没有命中，说明视图不再对它有依赖
        shouldLetCacheExpire = true;
        delIns(module, waKey, ccUniqueKey);
      }
    });

    if (waKeys.length > compareWaKeyCount) {
      //大于最初记录的key数量，有新增
      shouldLetCacheExpire = true;
    } // let find result cache expire


    if (shouldLetCacheExpire) {
      createModuleNode(module);
    }
  }

  function afterRender (ref) {
    var ctx = ref.ctx;
    ctx.__$$renderStatus = END; // 不处于收集观察依赖

    if (!ctx.__$$autoWatch) {
      return;
    }

    var refModule = ctx.module,
        connectedModules = ctx.connectedModules,
        connect = ctx.connect,
        ccUniqueKey = ctx.ccUniqueKey,
        __$$compareWaKeys = ctx.__$$compareWaKeys,
        __$$compareWaKeyCount = ctx.__$$compareWaKeyCount,
        __$$compareConnWaKeys = ctx.__$$compareConnWaKeys,
        __$$compareConnWaKeyCount = ctx.__$$compareConnWaKeyCount;
    delDep(__$$compareWaKeys, __$$compareWaKeyCount, refModule, ccUniqueKey);
    connectedModules.forEach(function (m) {
      // 非自动收集，不用处理
      if (connect[m] !== '-') return;
      var __$$compareWaKeys = __$$compareConnWaKeys[m];
      var __$$compareWaKeyCount = __$$compareConnWaKeyCount[m];
      delDep(__$$compareWaKeys, __$$compareWaKeyCount, m, ccUniqueKey);
    });
  }

  function didMount (ref) {
    afterRender(ref);
    ref.__$$isMounted = true;
    ref.__$$isUnmounted = false;
    var _ref$ctx = ref.ctx,
        ccUniqueKey = _ref$ctx.ccUniqueKey,
        __$$onEvents = _ref$ctx.__$$onEvents,
        __$$staticWaKeys = _ref$ctx.__$$staticWaKeys;
    setRef(ref);

    var __$$staticWaKeyList = okeys(__$$staticWaKeys); // 用于辅助清理依赖映射


    ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList; // 记录静态依赖

    __$$staticWaKeyList.forEach(function (modStateKey) {
      return mapStaticInsM(modStateKey, ccUniqueKey);
    }); // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空


    if (__$$onEvents.length > 0) {
      __$$onEvents.forEach(function (_ref) {
        var fn = _ref.fn,
            args = _ref.args;
        return fn.apply(void 0, args);
      });

      __$$onEvents.length = 0;
    }

    triggerSetupEffect(ref, true);
  }

  var ccUKey_ref_$3 = ccContext.ccUKey_ref_,
      ccUKey_handlerKeys_$1 = ccContext.ccUKey_handlerKeys_,
      runtimeVar$3 = ccContext.runtimeVar,
      handlerKey_handler_$1 = ccContext.handlerKey_handler_;
  function unsetRef (ccUniqueKey) {
    if (runtimeVar$3.isDebug) {
      console.log(styleStr(ccUniqueKey + " unset ref"), color('purple'));
    }

    delete ccUKey_ref_$3[ccUniqueKey];
    if (ccContext.isHotReloadMode()) decCcKeyInsCount(ccUniqueKey);
    var handlerKeys = ccUKey_handlerKeys_$1[ccUniqueKey];

    if (handlerKeys) {
      handlerKeys.forEach(function (hKey) {
        delete handlerKey_handler_$1[hKey];
      });
    }
  }

  var okeys$a = okeys;

  function executeClearCb(cbMap, ctx) {
    var execute = function execute(key) {
      // symbolKey or normalKey
      var cb = cbMap[key];
      if (typeof cb === 'function') cb(ctx);
    };

    Object.getOwnPropertySymbols(cbMap).forEach(execute);
    okeys$a(cbMap).forEach(execute);
  }

  function beforeUnmount (ref) {
    //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
    //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
    ref.__$$isUnmounted = true;
    var ctx = ref.ctx;
    var ccUniqueKey = ctx.ccUniqueKey,
        module = ctx.module,
        __$$staticWaKeyList = ctx.__$$staticWaKeyList; // 正常情况下只有挂载了组件才会有effect等相关定义

    if (ref.__$$isMounted) {
      var _ctx$effectMeta = ctx.effectMeta,
          eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
          eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;
      executeClearCb(eid_effectReturnCb_, ctx);
      executeClearCb(eid_effectPropsReturnCb_, ctx);
      offEventHandlersByCcUniqueKey(ccUniqueKey);
    } // 删除记录的动态依赖


    var waKeys = ctx.getWatchedKeys(); // no module prefix

    waKeys.forEach(function (k) {
      return delIns(module, k, ccUniqueKey);
    });
    var connWaKeys = ctx.getConnectWatchedKeys();
    okeys(connWaKeys).map(function (m) {
      var waKeys = connWaKeys[m];
      waKeys.forEach(function (k) {
        return delIns(m, k, ccUniqueKey);
      });
    }); // 删除记录的静态依赖

    __$$staticWaKeyList.forEach(function (modStateKey) {
      return delStaticInsM(modStateKey, ccUniqueKey);
    });

    unsetRef(ccUniqueKey);
  }

  var getState$5 = ccContext.store.getState;
  /** 由首次render触发, 在beforeMount里调用 */

  function triggerComputedAndWatch (ref) {
    var ctx = ref.ctx; // 取原始对象，防止computeValueForRef里用Object.assign触发依赖收集

    var hasComputedFn = ctx.hasComputedFn,
        hasWatchFn = ctx.hasWatchFn,
        connectedModules = ctx.connectedModules,
        refModule = ctx.module,
        unProxyState = ctx.unProxyState;
    var callInfo = makeCallInfo(refModule);

    var cuOrWatch = function cuOrWatch(op) {
      op(ref, refModule, unProxyState, unProxyState, callInfo, true);
      connectedModules.forEach(function (m) {
        var mState = getState$5(m);
        var tmpCallInfo = makeCallInfo(m);
        op(ref, m, mState, mState, tmpCallInfo, true);
      });
    };

    if (hasComputedFn) cuOrWatch(computeValueForRef);
    if (hasWatchFn) cuOrWatch(watchKeyForRef);
  }

  var okeys$b = okeys,
      makeCuDepDesc$1 = makeCuDepDesc;
  var runtimeVar$4 = ccContext.runtimeVar;
  function beforeMount (ref, setup, bindCtxToMethod) {
    var ctx = ref.ctx;
    ref.__$$isUnmounted = false; // false表示未卸载（不代表已挂载），在willUnmount时机才置为true，表示已卸载

    ref.__$$isMounted = false; // 未挂载，在didMount时机才置为true，表示已挂载
    // flag is in before mount setup

    ctx.__$$inBM = true; //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后

    if (setup) {
      if (typeof setup !== 'function') throw new Error('type of setup must be function');
      var settingsObj = setup(ctx) || {};
      if (!isPJO(settingsObj)) throw new Error('type of setup return result must be an plain json object'); //优先读自己的，再读全局的

      if (bindCtxToMethod === true || runtimeVar$4.bindCtxToMethod === true && bindCtxToMethod !== false) {
        okeys$b(settingsObj).forEach(function (name) {
          var settingValue = settingsObj[name];
          if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
        });
      }

      ctx.settings = settingsObj;
    } //!!! 把拦截了setter getter的计算结果容器赋值给refComputed
    // 这一波必需在setup调用之后做，因为setup里会调用ctx.computed写入computedRetKeyFns等元数据


    ctx.refComputedValue = makeCuRetContainer(ctx.computedRetKeyFns, ctx.refComputedOri);
    ctx.refComputed = makeCuRefObContainer(ref, null, true, true); // 所有的组件都会自动连接到$$global模块，但是有可能没有使用$$global模块数据做过任何实例计算
    // 这里需要补齐computedDep.$$global 和 watchDep.$$global 的依赖描述数据
    // 防止后续逻辑里出错

    var computedDep = ctx.computedDep,
        watchDep = ctx.watchDep;

    if (!computedDep[MODULE_GLOBAL]) {
      computedDep[MODULE_GLOBAL] = makeCuDepDesc$1();
    }

    if (!watchDep[MODULE_GLOBAL]) {
      watchDep[MODULE_GLOBAL] = makeCuDepDesc$1();
    }

    triggerComputedAndWatch(ref);
    ctx.__$$inBM = false;
  }

  var getRegisterOptions$1 = getRegisterOptions,
      evalState$2 = evalState;
  function initCcFrag (ref) {
    var props = ref.props;
    var registerOptions = getRegisterOptions$1(props.register);
    var module = registerOptions.module,
        renderKeyClasses = registerOptions.renderKeyClasses,
        tag = registerOptions.tag,
        lite = registerOptions.lite,
        _registerOptions$comp = registerOptions.compareProps,
        compareProps = _registerOptions$comp === void 0 ? true : _registerOptions$comp,
        setup = registerOptions.setup,
        bindCtxToMethod = registerOptions.bindCtxToMethod,
        _registerOptions$watc = registerOptions.watchedKeys,
        watchedKeys = _registerOptions$watc === void 0 ? '-' : _registerOptions$watc,
        _registerOptions$conn = registerOptions.connect,
        connect = _registerOptions$conn === void 0 ? {} : _registerOptions$conn,
        _registerOptions$stor = registerOptions.storedKeys,
        storedKeys = _registerOptions$stor === void 0 ? [] : _registerOptions$stor;
    var state = evalState$2(registerOptions.state);
    var ccClassKey = props.ccClassKey,
        ccKey = props.ccKey,
        _props$ccOption = props.ccOption,
        ccOption = _props$ccOption === void 0 ? {} : _props$ccOption,
        id = props.id;
    var target_watchedKeys = watchedKeys;
    var target_ccClassKey = ccClassKey;
    var target_connect = connect;
    var insType = CC_CUSTOMIZE; //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb创建的组件已在外部调用过mapRegistrationInfo）

    if (props.__$$regDumb !== true) {
      insType = CC_FRAGMENT;

      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_CLASS, watchedKeys, connect, true),
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect,
          _watchedKeys = _mapRegistrationInfo._watchedKeys;

      target_watchedKeys = _watchedKeys;
      target_ccClassKey = _ccClassKey;
      target_connect = _connect;
    }

    buildRefCtx(ref, {
      ccKey: ccKey,
      connect: target_connect,
      state: state,
      module: module,
      type: CC_CLASS,
      insType: insType,
      storedKeys: storedKeys,
      watchedKeys: target_watchedKeys,
      tag: tag,
      ccClassKey: target_ccClassKey,
      ccOption: ccOption,
      id: id
    }, lite);
    ref.ctx.reactSetState = makeRefSetState(ref);
    ref.ctx.reactForceUpdate = makeRefForceUpdate(ref);
    ref.__$$compareProps = compareProps; //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
    //无需在将要给废弃的componentWillMount里调用beforeMount

    beforeMount(ref, setup, bindCtxToMethod);
  }

  var justTip$1 = justTip,
      bindToWindow$1 = bindToWindow,
      getErrStackKeywordLoc$1 = getErrStackKeywordLoc;
  var cachedLocation = '';

  function checkStartup(err) {
    var info = ccContext.info;
    var curLocation = getErrStackKeywordLoc$1(err, 'startup', 2); //向下2句找触发run的文件

    if (!curLocation) curLocation = getErrStackKeywordLoc$1(err, 'runConcent', 0);

    var letRunOk = function letRunOk() {
      ccContext.isHot = true;
      return clearContextIfHot(true);
    };

    var now = Date.now();
    var ccFragKeys = [],
        canStartup = true;

    if (!cachedLocation) {
      cachedLocation = curLocation;
      info.firstStartupTime = now;
      info.latestStartupTime = now;
    } else if (cachedLocation !== curLocation) {
      var tip = "invalid run api call!(it can only be called once, changing 'call run' line location in HMR will cause this error also, \n    try refresh browser to reload your app to avoid this tip)";

      if (now - info.latestStartupTime < 1000) {
        throw new Error(tip);
      } else {
        if (isOnlineEditor()) {
          ccFragKeys = letRunOk();
          cachedLocation = curLocation;
        } else {
          strictWarning(tip);
          canStartup = false;
        }
      }
    } else {
      ccFragKeys = letRunOk();
    }

    return {
      canStartup: canStartup,
      ccFragKeys: ccFragKeys
    };
  }

  function startup (_temp, _temp2) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$store = _ref.store,
        store = _ref$store === void 0 ? {} : _ref$store,
        _ref$reducer = _ref.reducer,
        reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
        _ref$init = _ref.init,
        init = _ref$init === void 0 ? null : _ref$init,
        _ref$initPost = _ref.initPost,
        initPost = _ref$initPost === void 0 ? {} : _ref$initPost,
        _ref$computed = _ref.computed,
        computed = _ref$computed === void 0 ? {} : _ref$computed,
        _ref$watch = _ref.watch,
        watch = _ref$watch === void 0 ? {} : _ref$watch;

    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$plugins = _ref2.plugins,
        plugins = _ref2$plugins === void 0 ? [] : _ref2$plugins,
        _ref2$middlewares = _ref2.middlewares,
        middlewares = _ref2$middlewares === void 0 ? [] : _ref2$middlewares,
        _ref2$isStrict = _ref2.isStrict,
        isStrict = _ref2$isStrict === void 0 ? false : _ref2$isStrict,
        _ref2$isDebug = _ref2.isDebug,
        isDebug = _ref2$isDebug === void 0 ? false : _ref2$isDebug,
        _ref2$errorHandler = _ref2.errorHandler,
        errorHandler = _ref2$errorHandler === void 0 ? null : _ref2$errorHandler,
        isHot = _ref2.isHot,
        _ref2$bindCtxToMethod = _ref2.bindCtxToMethod,
        bindCtxToMethod = _ref2$bindCtxToMethod === void 0 ? false : _ref2$bindCtxToMethod,
        _ref2$computedCompare = _ref2.computedCompare,
        computedCompare = _ref2$computedCompare === void 0 ? true : _ref2$computedCompare,
        _ref2$watchCompare = _ref2.watchCompare,
        watchCompare = _ref2$watchCompare === void 0 ? true : _ref2$watchCompare,
        _ref2$watchImmediate = _ref2.watchImmediate,
        watchImmediate = _ref2$watchImmediate === void 0 ? false : _ref2$watchImmediate,
        _ref2$reComputed = _ref2.reComputed,
        reComputed = _ref2$reComputed === void 0 ? true : _ref2$reComputed,
        _ref2$extractModuleCh = _ref2.extractModuleChangedState,
        extractModuleChangedState = _ref2$extractModuleCh === void 0 ? true : _ref2$extractModuleCh,
        _ref2$extractRefChang = _ref2.extractRefChangedState,
        extractRefChangedState = _ref2$extractRefChang === void 0 ? false : _ref2$extractRefChang,
        _ref2$objectValueComp = _ref2.objectValueCompare,
        objectValueCompare = _ref2$objectValueComp === void 0 ? false : _ref2$objectValueComp,
        _ref2$nonObjectValueC = _ref2.nonObjectValueCompare,
        nonObjectValueCompare = _ref2$nonObjectValueC === void 0 ? true : _ref2$nonObjectValueC,
        _ref2$localStorage = _ref2.localStorage,
        localStorage = _ref2$localStorage === void 0 ? null : _ref2$localStorage;

    try {
      throw new Error();
    } catch (err) {
      var _checkStartup = checkStartup(err),
          canStartup = _checkStartup.canStartup,
          ccFragKeys = _checkStartup.ccFragKeys;

      if (!canStartup) return;

      try {
        justTip$1("cc version " + ccContext.info.version);
        if (isHot !== undefined) ccContext.isHot = isHot;
        ccContext.reComputed = reComputed;
        ccContext.runtimeHandler.errorHandler = errorHandler;
        var rv = ccContext.runtimeVar;
        rv.isStrict = isStrict;
        rv.isDebug = isDebug;
        rv.computedCompare = computedCompare;
        rv.watchCompare = watchCompare;
        rv.watchImmediate = watchImmediate;
        rv.extractModuleChangedState = extractModuleChangedState;
        rv.extractRefChangedState = extractRefChangedState;
        rv.objectValueCompare = objectValueCompare;
        rv.nonObjectValueCompare = nonObjectValueCompare;
        rv.bindCtxToMethod = bindCtxToMethod;

        if (localStorage) {
          ccContext.localStorage = localStorage;
        } else if (window && window.localStorage) {
          ccContext.localStorage = window.localStorage;
        }

        ccContext.recoverRefState();
        createDispatcher();
        configStoreState(store);
        configRootReducer(reducer);
        configRootComputed(computed);
        configRootWatch(watch);
        executeRootInit(init, initPost);
        configMiddlewares(middlewares);

        var bindOthers = function bindOthers(bindTarget) {
          bindToWindow$1('CC_CONTEXT', ccContext, bindTarget);
          bindToWindow$1('ccc', ccContext, bindTarget);
          bindToWindow$1('cccc', ccContext.computed._computedValue, bindTarget);
          bindToWindow$1('sss', ccContext.store._state, bindTarget);
        };

        if (window && window.mcc) {
          setTimeout(function () {
            //延迟绑定，等待ccns的输入
            bindOthers(window.mcc[getCcNamespace()]);
          }, 1200);
        } else {
          bindOthers();
        }

        ccContext.isStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

        configPlugins(plugins); // 可以理解为类似useConcent里处理double-invoking 以及 async rendering的过程
        // 直接实例化的CcFragment需要在boot过程完毕后再次走卸载并挂载的过程，以便数据和store同步，register信息正确
        // 防止在线IDE热加载后，ui和store不同步的问题

        ccFragKeys.forEach(function (key) {
          var ref = ccContext.ccUKey_ref_[key];
          beforeUnmount(ref);
          initCcFrag(ref);
          didMount(ref);
        });
      } catch (err) {
        if (errorHandler) errorHandler(err);else throw err;
      }
    }
  }

  var isPJO$7 = isPJO,
      okeys$c = okeys,
      isObjectNull$4 = isObjectNull,
      evalState$3 = evalState;

  var pError = function pError(label) {
    throw new Error("[[run]]: param error, " + label + " " + NOT_A_JSON);
  }; // option:
  // middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
  // autoCreateDispatcher, bindCtxToMethod,
  // computedCompare, watchCompare, watchImmediate

  /**
   * run will call startup
   * @param {{ [moduleName:string]: config:{state:object|()=>object, reducer:object, watch:object, computed:object, init:object} }} store
   * @param {{isStrict:boolean}} options
   */


  function _run (store, options) {
    if (store === void 0) {
      store = {};
    }

    if (options === void 0) {
      options = {};
    }

    if (!isPJO$7(store)) pError('store');
    if (!isPJO$7(options)) pError('options');
    var storeConf = {
      store: {},
      reducer: {},
      watch: {},
      computed: {},
      init: {},
      initPost: {}
    };

    var buildStoreConf = function buildStoreConf(m, moduleConf) {
      var state = moduleConf.state,
          _moduleConf$reducer = moduleConf.reducer,
          reducer = _moduleConf$reducer === void 0 ? {} : _moduleConf$reducer,
          watch = moduleConf.watch,
          computed = moduleConf.computed,
          init = moduleConf.init,
          initPost = moduleConf.initPost;

      if (storeConf.store[m]) {
        throw new Error("run api error: module" + m + " duplicate");
      }

      storeConf.store[m] = evalState$3(state);
      if (typeof state === 'function') ccContext.moduleName_stateFn_[m] = state;
      storeConf.reducer[m] = reducer;
      if (watch) storeConf.watch[m] = watch;
      if (computed) storeConf.computed[m] = computed;
      if (init) storeConf.init[m] = init;
      if (initPost) storeConf.initPost[m] = initPost;
    }; // traversal moduleNames


    okeys$c(store).forEach(function (m) {
      return buildStoreConf(m, store[m]);
    }); // push by configure api

    pendingModules.forEach(function (_ref) {
      var module = _ref.module,
          config = _ref.config;
      justTip("configure pending module[" + module + "]");
      buildStoreConf(module, config);
    });
    pendingModules.length = 0; // clear pending modules

    if (isObjectNull$4(storeConf.init)) storeConf.init = null;
    startup(storeConf, options);
  }

  function _extends() {
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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function didUpdate (ref) {
    afterRender(ref);
    triggerSetupEffect(ref); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
    //注意一定是先调用triggerSetupEffect，再赋值

    ref.ctx.prevState = ref.ctx.unProxyState;
  }

  /** eslint-disable */
  function beforeRender (ref) {
    var ctx = ref.ctx;
    ctx.renderCount += 1; // 类组件this.reactSetState调用后生成的this.state是一个新的普通对象
    // 每次渲染前替换为ctx.state指向的Proxy对象，确保让类组件里使用this.state能够收集到依赖

    ref.state = ctx.state;
    if (ctx.childRef) ctx.childRef.state = ctx.state; // 不处于收集观察依赖 or 已经开始都要跳出此函数
    // strictMode模式下，会走两次beforeRender 一次afterRender，
    // 所以这里严格用ctx.__$$renderStatus === START 来控制只真正执行一次beforeRender

    if (!ctx.__$$autoWatch || ctx.__$$renderStatus === START) {
      return;
    }

    if (ctx.__$$renderStatus !== START) ctx.__$$renderStatus = START;

    if (ctx.__$$hasModuleState) {
      ctx.__$$curWaKeys = {};
      ctx.__$$compareWaKeys = ctx.__$$nextCompareWaKeys;
      ctx.__$$compareWaKeyCount = ctx.__$$nextCompareWaKeyCount; // 渲染期间再次收集

      ctx.__$$nextCompareWaKeys = {};
      ctx.__$$nextCompareWaKeyCount = 0;
    }

    var connectedModules = ctx.connectedModules,
        connect = ctx.connect;
    connectedModules.forEach(function (m) {
      // 非自动收集，在make-ob-state里不会触发get，这里直接跳出
      if (connect[m] !== '-') return;
      ctx.__$$curConnWaKeys[m] = {};
      ctx.__$$compareConnWaKeys[m] = ctx.__$$nextCompareConnWaKeys[m];
      ctx.__$$compareConnWaKeyCount[m] = ctx.__$$nextCompareConnWaKeyCount[m]; // 渲染期间再次收集

      ctx.__$$nextCompareConnWaKeys[m] = {};
      ctx.__$$nextCompareConnWaKeyCount[m] = 0;
    });
  }

  var ccClassDisplayName$1 = ccClassDisplayName,
      shallowDiffers$1 = shallowDiffers,
      evalState$4 = evalState;

  var setupErr = function setupErr(info) {
    return new Error('can not defined setup both in register options and class body ' + '--verbose:' + info);
  };

  function register(_temp, ccClassKey) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        _ref$state = _ref.state,
        state = _ref$state === void 0 ? {} : _ref$state,
        _ref$watchedKeys = _ref.watchedKeys,
        watchedKeys = _ref$watchedKeys === void 0 ? '-' : _ref$watchedKeys,
        _ref$storedKeys = _ref.storedKeys,
        storedKeys = _ref$storedKeys === void 0 ? [] : _ref$storedKeys,
        _ref$setup = _ref.setup,
        setup = _ref$setup === void 0 ? null : _ref$setup,
        persistStoredKeys = _ref.persistStoredKeys,
        _ref$connect = _ref.connect,
        connect = _ref$connect === void 0 ? {} : _ref$connect,
        _ref$extra = _ref.extra,
        extra = _ref$extra === void 0 ? {} : _ref$extra,
        tag = _ref.tag,
        lite = _ref.lite,
        _ref$isPropsProxy = _ref.isPropsProxy,
        isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
        renderKeyClasses = _ref.renderKeyClasses,
        _ref$__checkStartUp = _ref.__checkStartUp,
        __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
        _ref$compareProps = _ref.compareProps,
        compareProps = _ref$compareProps === void 0 ? true : _ref$compareProps,
        __calledBy = _ref.__calledBy;

    if (ccClassKey === void 0) {
      ccClassKey = '';
    }

    try {
      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_CLASS, watchedKeys, connect, __checkStartUp, __calledBy),
          _module = _mapRegistrationInfo._module,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect,
          _watchedKeys = _mapRegistrationInfo._watchedKeys;

      return function (ReactClass) {
        if (ReactClass.prototype && ReactClass.prototype.$$attach) {
          throw new Error("register a cc class is prohibited!");
        } // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;


        var ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;
        var staticSetup = ToBeExtendedClass.$$setup;

        var _CcClass =
        /*#__PURE__*/
        function (_ToBeExtendedClass) {
          _inheritsLoose(CcClass, _ToBeExtendedClass);

          function CcClass(props, context) {
            var _this;

            _this = _ToBeExtendedClass.call(this, props, context) || this;

            try {
              var optState = evalState$4(state);
              var thisState = _this.state || {};
              var privState = Object.assign(thisState, optState);
              _this.$$attach = _this.$$attach.bind(_assertThisInitialized(_this)); // props.ccOption

              var params = Object.assign({}, props, {
                module: _module,
                tag: tag,
                state: privState,
                type: CC_CLASS,
                insType: CC_CUSTOMIZE,
                watchedKeys: _watchedKeys,
                ccClassKey: _ccClassKey,
                connect: _connect,
                storedKeys: storedKeys,
                persistStoredKeys: persistStoredKeys,
                extra: extra
              });
              buildRefCtx(_assertThisInitialized(_this), params, lite);
              _this.ctx.reactSetState = makeRefSetState(_assertThisInitialized(_this));
              _this.ctx.reactForceUpdate = makeRefForceUpdate(_assertThisInitialized(_this));

              if (setup && (_this.$$setup || staticSetup)) {
                throw setupErr('ccUniqueKey ' + _this.ctx.ccUniqueKey);
              }

              if (!isPropsProxy) {
                if (_this.$$setup) _this.$$setup = _this.$$setup.bind(_assertThisInitialized(_this));
                beforeMount(_assertThisInitialized(_this), setup || _this.$$setup || staticSetup, false);
              } // isPropsProxy为true时，延迟到$$attach里执行beforeMount

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

            var isPropsChanged = compareProps ? shallowDiffers$1(this.props, nextProps) : false;
            return this.state !== nextState || isPropsChanged;
          } //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
          //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
          ;

          _proto.$$attach = function $$attach(childRef) {
            var ctx = this.ctx;
            ctx.childRef = childRef;
            childRef.ctx = ctx; // 让代理属性的目标组件即可从this.props 也可从 this 访问 ctx
            // 让孩子引用的setState forceUpdate 指向父容器事先构造好的setState forceUpdate

            childRef.setState = ctx.setState;
            childRef.forceUpdate = ctx.forceUpdate;

            if (isObjectNotNull(childRef.state)) {
              Object.assign(ctx.state, childRef.state, ctx.__$$mstate);
            }

            if (childRef.$$setup) childRef.$$setup = childRef.$$setup.bind(childRef);
            if (setup && (childRef.$$setup || staticSetup)) throw setupErr('ccUniqueKey ' + ctx.ccUniqueKey);
            beforeMount(this, setup || childRef.$$setup || staticSetup, false);
            beforeRender(this);
          };

          _proto.componentDidMount = function componentDidMount() {
            // 属性代理模式，必需在组件consturctor里调用 props.$$attach(this)
            // you must call it in next line of state assign expression 
            if (isPropsProxy && !this.ctx.childRef) {
              throw new Error("forget call props.$$attach(this) in consturctor when set isPropsProxy true");
            }

            if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);
            didMount(this);
          };

          _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState, snapshot) {
            if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot);
            didUpdate(this);
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
            beforeUnmount(this);
          } // 注：strict mode 模式下，class组件的双调用机制行为和function组件不一样
          // constructor x2 ---> render x2 ---> componentDidMount x1
          // 两次构造器里虽然生成了不同的refCtx，但是两次render里给的 this.ctx 始终是最新的那一个
          // 所以此处不需要像 useConcent 一样做ef标记
          ;

          _proto.render = function render() {
            var outProps = this.props;
            this.ctx.prevProps = this.ctx.props;
            this.ctx.props = outProps;
            beforeRender(this);

            if (isPropsProxy === false) {
              // now cc class extends ReactClass, call super.render()
              return _ToBeExtendedClass.prototype.render.call(this);
            } else {
              //将$$attach传递下去，用户需在构造器里最后一样调用props.$$attach()
              var passedProps = _extends({}, outProps, {
                ctx: this.ctx,
                $$attach: this.$$attach
              });

              return React.createElement(ReactClass, passedProps);
            }
          };

          return CcClass;
        }(ToBeExtendedClass);

        _CcClass.displayName = ccClassDisplayName$1(_ccClassKey);
        return _CcClass;
      };
    } catch (err) {
      catchCcError(err);
    }
  }

  /****
   * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
   * but you can not register multi react class with a same ccClassKey!
   * @param {object} registerOption
   * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
   * @param {Function} [registerOption.setup]
   * @param {Array<string>|string} [registerOption.watchedKeys] 
   * declare current cc class's any instance is concerned which state keys's state changing,
   * @param {{ [moduleName:string]: keys: string[] | '*' }} [registerOption.connect]
   * ```
   *    this.ctx.dispatch({type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.ctx.dispatch('doStaff', {foo:1, bar:2});
   *    // or
   *    this.ctx.dispatch('moduleName/doStaff', {foo:1, bar:2});
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
   *        const {regularFormSubmitting} = this.props.ctx.connectedState.from;
   *      }
   *    }
   * ```
   * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
   */

  function register$1 (registerOption, ccClassKey) {
    var _registerOption = getRegisterOptions(registerOption);

    delete _registerOption.__checkStartUp;
    delete _registerOption.__calledBy;
    return register(_registerOption, ccClassKey);
  }

  function _connect (connectSpec, ccClassKey) {
    return register$1({
      connect: connectSpec
    }, ccClassKey);
  }

  var shallowDiffers$2 = shallowDiffers;
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

      _this = _React$Component.call(this, props, context) || this;
      initCcFrag(_assertThisInitialized(_this));
      return _this;
    }

    var _proto = CcFragment.prototype;

    _proto.componentDidMount = function componentDidMount() {
      didMount(this);
    };

    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      var isPropsChanged = this.__$$compareProps ? shallowDiffers$2(getOutProps(nextProps), getOutProps(this.props)) : false;
      return this.state !== nextState || isPropsChanged;
    } // componentDidUpdate(prevProps, prevState) {
    ;

    _proto.componentDidUpdate = function componentDidUpdate() {
      didUpdate(this);
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      if (_React$Component.prototype.componentWillUnmount) _React$Component.prototype.componentWillUnmount.call(this);
      beforeUnmount(this);
    };

    _proto.render = function render() {
      //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
      var thisProps = this.props;
      this.ctx.prevProps = this.ctx.props;
      this.ctx.props = getOutProps(thisProps);
      var children = thisProps.children,
          render = thisProps.render;
      var view = render || children;

      if (typeof view === 'function') {
        beforeRender(this);
        var __$$regDumb = thisProps.__$$regDumb,
            _thisProps$register = thisProps.register,
            register = _thisProps$register === void 0 ? {} : _thisProps$register;
        var ctx = this.ctx;

        if (__$$regDumb !== true && register.mapProps) {
          //直接使用<CcFragment />实例化
          ctx.mapped = register.mapProps(ctx) || {};
          return view(ctx.mapped) || nullSpan;
        }

        return view(ctx) || nullSpan;
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

  function _registerDumb(Dumb, regOpt) {
    var ccClassKey = regOpt.ccClassKey,
        mapProps = regOpt.mapProps,
        _regOpt$props = regOpt.props,
        props = _regOpt$props === void 0 ? {} : _regOpt$props;

    var render = function render(ctx) {
      if (mapProps) {
        ctx.mapped = mapProps(ctx);
        return React.createElement(Dumb, ctx.mapped);
      } else {
        return React.createElement(Dumb, ctx);
      }
    }; //ccKey由实例化的Dumb组件props上透传下来


    var passProps = {
      __$$regDumb: true,
      props: props,
      ccOption: props.ccOption,
      ccClassKey: ccClassKey,
      render: render,
      ccKey: props.ccKey,
      register: regOpt
    };
    return React.createElement(CcFragment, passProps);
  } // renderKeyClasses, tag, mapProps, module = MODULE_DEFAULT,
  // watchedKeys = '*', storedKeys, persistStoredKeys, render: Dumb,
  // connect = {}, state = {}, setup, bindCtxToMethod, compareProps, lite,
  // bindCtxToMethod


  function registerDumb (registerOption, ccClassKey) {
    var _registerOption = getRegisterOptions(registerOption);

    var renderKeyClasses = _registerOption.renderKeyClasses,
        module = _registerOption.module,
        _registerOption$watch = _registerOption.watchedKeys,
        watchedKeys = _registerOption$watch === void 0 ? '-' : _registerOption$watch,
        storedKeys = _registerOption.storedKeys,
        Dumb = _registerOption.render,
        _registerOption$conne = _registerOption.connect,
        connect = _registerOption$conne === void 0 ? {} : _registerOption$conne;

    var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_FRAGMENT, watchedKeys, storedKeys, connect, true),
        _module = _mapRegistrationInfo._module,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect,
        _watchedKeys = _mapRegistrationInfo._watchedKeys;

    _registerOption.module = _module;
    _registerOption.watchedKeys = _watchedKeys;
    _registerOption.ccClassKey = _ccClassKey;
    _registerOption.connect = _connect;

    function buildCcFragComp(Dumb) {
      //避免react dev tool显示的dom为Unknown
      var ConnectedFragment = function ConnectedFragment(props) {
        _registerOption.props = props;
        return _registerDumb(Dumb, _registerOption);
      };

      return ConnectedFragment;
    }

    if (Dumb) {
      return buildCcFragComp(Dumb);
    } else {
      return function (Dumb) {
        return buildCcFragComp(Dumb);
      };
    }
  }

  function _connectDumb (connectSpec, ccClassKey) {
    return registerDumb({
      connect: connectSpec
    }, ccClassKey);
  }

  var connectToStr = function connectToStr(connect) {
    if (!connect) return '';else if (Array.isArray(connect)) return connect.join(',');else if (typeof connect === 'object') return JSON.stringify(connect);else return connect;
  };

  function isRegChanged(firstRegOpt, curRegOpt) {
    if (firstRegOpt.module !== curRegOpt.module) {
      return true;
    }

    if (connectToStr(firstRegOpt.connect) !== connectToStr(curRegOpt.connect)) {
      return true;
    } // if (firstRegOpt.tag !== curRegOpt.tag) {
    //   return true;
    // }


    return false;
  }

  /**
   * http://react.html.cn/docs/strict-mode.html
   * https://frontarm.com/daishi-kato/use-ref-in-concurrent-mode/
   */
  var ccUKey_ref_$4 = ccContext.ccUKey_ref_;
  var cursor_hookCtx_ = {};
  var refCursor = 1;

  function getUsableCursor() {
    var toReturn = refCursor;
    return toReturn;
  }

  function incCursor() {
    refCursor = refCursor + 1;
  }

  function CcHook(state, hookSetter, props, hookCtx) {
    //new CcHook时，这里锁定的hookSetter就是后面一直可以用的setter
    //如果存在期一直替换hookSetter，反倒会造成打开react-dev-tool，点击面板里的dom后，视图便不再更新的bug
    this.setState = hookSetter;
    this.forceUpdate = hookSetter;
    this.state = state;
    this.isFirstRendered = true;
    this.props = props;
    this.hookCtx = hookCtx;
  } // rState: resolvedState, iState: initialState


  function buildRef(ref, insType, hookCtx, rState, iState, regOpt, hookState, hookSetter, props, extra, ccClassKey) {
    incCursor();
    cursor_hookCtx_[hookCtx.cursor] = hookCtx; // when single file demo in hmr mode trigger buildRef, rState is 0 
    // so here call evalState again

    var state = rState || evalState(iState);
    var bindCtxToMethod = regOpt.bindCtxToMethod;
    var renderKeyClasses = regOpt.renderKeyClasses,
        module = regOpt.module,
        _regOpt$watchedKeys = regOpt.watchedKeys,
        watchedKeys = _regOpt$watchedKeys === void 0 ? '-' : _regOpt$watchedKeys,
        _regOpt$connect = regOpt.connect,
        connect = _regOpt$connect === void 0 ? {} : _regOpt$connect,
        setup = regOpt.setup,
        lite = regOpt.lite;

    var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_HOOK, watchedKeys, connect, true),
        _module = _mapRegistrationInfo._module,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect,
        _watchedKeys = _mapRegistrationInfo._watchedKeys;

    var hookRef = ref || new CcHook(hookState, hookSetter, props, hookCtx);
    hookCtx.hookRef = hookRef;
    var params = Object.assign({}, regOpt, {
      module: _module,
      watchedKeys: _watchedKeys,
      state: state,
      type: CC_HOOK,
      insType: insType,
      extra: extra,
      ccClassKey: _ccClassKey,
      connect: _connect,
      ccOption: props.ccOption,
      id: props.id,
      ccKey: props.ccKey
    });
    hookRef.props = props; // keep shape same as class

    buildRefCtx(hookRef, params, lite); // in buildRefCtx cc will assign hookRef.props to ctx.prevProps

    hookRef.ctx.reactSetState = makeRefSetState(hookRef);
    hookRef.ctx.reactForceUpdate = makeRefForceUpdate(hookRef);
    var refCtx = hookRef.ctx;
    refCtx.props = props; // attach props to ctx

    beforeMount(hookRef, setup, bindCtxToMethod); // cursor_refKey_[cursor] = hookRef.ctx.ccUniqueKey;

    hookCtx.prevCcUKey = hookCtx.ccUKey;
    hookCtx.ccUKey = hookRef.ctx.ccUniqueKey; // rewrite useRef for CcHook

    refCtx.useRef = function useR(refName) {
      //give named function to avoid eslint error
      var ref = React.useRef(null);
      refCtx.refs[refName] = ref;
      return ref;
    };

    return hookRef;
  }

  function replaceSetter(ctx, hookSetter) {
    ctx.__boundSetState = hookSetter;
    ctx.__boundForceUpdate = hookSetter;
  }

  var tip = 'react version is LTE 16.8';

  function _useConcent(registerOption, ccClassKey, insType) {
    if (registerOption === void 0) {
      registerOption = {};
    }

    var cursor = getUsableCursor();

    var _registerOption = getRegisterOptions(registerOption); // ef: effectFlag


    var hookCtxContainer = React.useRef({
      cursor: cursor,
      prevCcUKey: null,
      ccUKey: null,
      regOpt: _registerOption,
      ef: 0
    });
    var hookCtx = hookCtxContainer.current; // here not allow user pass extra as undefined, it will been given value {} implicitly if pass undefined!!!

    var _registerOption$state = _registerOption.state,
        iState = _registerOption$state === void 0 ? {} : _registerOption$state,
        _registerOption$props = _registerOption.props,
        props = _registerOption$props === void 0 ? {} : _registerOption$props,
        mapProps = _registerOption.mapProps,
        _registerOption$layou = _registerOption.layoutEffect,
        layoutEffect = _registerOption$layou === void 0 ? false : _registerOption$layou,
        _registerOption$extra = _registerOption.extra,
        extra = _registerOption$extra === void 0 ? {} : _registerOption$extra;
    var reactUseState = React.useState;

    if (!reactUseState) {
      throw new Error(tip);
    }

    var isFirstRendered = cursor === hookCtx.cursor;
    var state = isFirstRendered ? evalState(iState) : 0;

    var _reactUseState = reactUseState(state),
        hookState = _reactUseState[0],
        hookSetter = _reactUseState[1];

    var cref = function cref(ref) {
      return buildRef(ref, insType, hookCtx, state, iState, _registerOption, hookState, hookSetter, props, extra, ccClassKey);
    };

    var hookRef; // 组件刚挂载 or 渲染过程中变化module或者connect的值，触发创建新ref

    if (isFirstRendered || isRegChanged(hookCtx.regOpt, _registerOption, true)) {
      hookCtx.regOpt = _registerOption;
      hookRef = cref();
    } else {
      hookRef = ccUKey_ref_$4[hookCtx.ccUKey];

      if (!hookRef) {
        // single file demo in hot reload mode
        hookRef = cref();
      } else {
        var _refCtx = hookRef.ctx;
        _refCtx.prevProps = _refCtx.props;
        hookRef.props = _refCtx.props = props;
        _refCtx.extra = extra;
      }
    }

    var refCtx = hookRef.ctx;
    var effectHandler = layoutEffect ? React.useLayoutEffect : React.useEffect; // after first render of hookRef just created 

    effectHandler(function () {
      var hookCtx = hookRef.hookCtx;
      hookCtx.ef = 1; // mock componentWillUnmount

      return function () {
        var targetCcUKey = hookCtx.prevCcUKey || hookCtx.ccUKey;
        var toUnmountRef = ccUKey_ref_$4[targetCcUKey];

        if (toUnmountRef) {
          hookCtx.prevCcUKey = null;
          beforeUnmount(toUnmountRef);
        }

        delete cursor_hookCtx_[cursor];
      };
    }, [hookRef]); // 渲染过程中变化module或者connect的值，触发卸载前一刻的ref
    //after every render

    effectHandler(function () {
      replaceSetter(refCtx, hookSetter);

      if (!hookRef.isFirstRendered) {
        // mock componentDidUpdate
        didUpdate(hookRef);
      } else {
        // mock componentDidMount
        hookRef.isFirstRendered = false;
        didMount(hookRef);
      } // dobule-invoking 机制导致初始化阶段生成了一个多余的hookRef
      // 虽然未存储到refs上，但是收集到的依赖存储到了waKey_uKeyMap_上
      // 这里通过触发beforeUnmount来清理多余的依赖


      if (!hookCtx.clearPrev) {
        hookCtx.clearPrev = true;
        var _cursor = hookCtx.cursor;
        var prevCursor = _cursor - 1;
        var prevHookCtx = cursor_hookCtx_[prevCursor];

        if (prevHookCtx && prevHookCtx.ef === 0) {
          delete cursor_hookCtx_[prevCursor]; // 让来自于concent的渲染通知只触发一次, 注意prevHookRef没有被重复触发过diMount逻辑
          // 所以直接用prevHookCtx.hookRef来执行beforeUnmount

          beforeUnmount(prevHookCtx.hookRef);
        }
      }
    });
    beforeRender(hookRef); // before every render

    if (mapProps) {
      var mapped = mapProps(refCtx);

      if (!isPJO(mapped)) {
        throw new Error("mapProps ret " + NOT_A_JSON);
      }

      refCtx.mapped = mapped;
    }

    return refCtx;
  }
  /**
   * 仅供内部 component/Ob 调用
   */


  function useConcentForOb(registerOption, ccClassKey) {
    // 只针对Ob组件实例化检查时，reg参数是否已变化
    return _useConcent(registerOption, ccClassKey, CC_OB);
  } //写为具名函数，防止react-dev-tool里显示.default

  function useConcent(registerOption, ccClassKey) {
    return _useConcent(registerOption, ccClassKey, CC_CUSTOMIZE);
  }

  function registerHookComp(options, ccClassKey) {
    var _options = getRegisterOptions(options);

    if (typeof _options.state === 'function') {
      _options.state = _options.state();
    }

    function buildCcHookComp(Dumb) {
      var _options$memo = _options.memo,
          memo = _options$memo === void 0 ? true : _options$memo;
      delete _options.memo;

      var getComp = function getComp() {
        return function CcHookComp(props) {
          _options.props = props;
          var ctx = useConcent(_options, ccClassKey); // 和registerDumb保持一致，如果定义了mapProps，传递mapProps的结果给Dumb

          if (_options.mapProps) {
            return React.createElement(Dumb, ctx.mapped);
          } else {
            return React.createElement(Dumb, ctx);
          }
        };
      };

      if (memo && React.memo) {
        return React.memo(getComp());
      } else {
        return getComp();
      }
    }

    var Dumb = _options.render;

    if (Dumb) {
      return buildCcHookComp(Dumb);
    } else {
      return function (Dumb) {
        return buildCcHookComp(Dumb);
      };
    }
  }

  /****
   * if you are sure the input state is really belong to global state, call cc.setGlobalState,
   * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
   */

  function setGlobalState (state, cb, delay$$1, idt, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.ctx.setGlobalState(state, cb, delay$$1, idt);
    } catch (err) {
      if (throwError) throw err;else justWarning(err.message);
    }
  }

  function throwApiCallError() {
    throw new Error("api doc: cc.setState(module:string, state:object, renderKey:string, delayMs?:number, skipMiddleware?:boolean, throwError?:boolean)");
  }

  function _setState$1 (module, state, renderKey, delayMs, skipMiddleware, throwError) {
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

    setState(module, state, renderKey, delayMs, skipMiddleware, throwError);
  }

  function _set (moduledKeyPath, val, renderKey, delay) {
    var dispatcher = pickOneRef();
    dispatcher.ctx.set(moduledKeyPath, val, renderKey, delay);
  }

  var getState$6 = (function (module) {
    return ccContext.store.getState(module);
  });

  function _setValue (moduledKeyPath, val) {
    if (!moduledKeyPath.includes('/')) {
      throw new Error("keyPath must start with module");
    }

    var _moduledKeyPath$split = moduledKeyPath.split('/'),
        targetModule = _moduledKeyPath$split[0];

    var fullState = getState$6(targetModule);

    var _extractStateByCcsync = extractStateByCcsync(moduledKeyPath, val, false, fullState, false),
        state = _extractStateByCcsync.state;

    return state;
  }

  var getGlobalState = ccContext.store.getGlobalState;

  var _computedValue$4 = ccContext.computed._computedValue;
  var _getComputed = (function (module) {
    if (module) return _computedValue$4[module];else return _computedValue$4;
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
      justWarning(err);
    }
  }

  function _off (event, option) {
    try {
      var ref = pickOneRef();
      ref.ctx.off(event, option);
    } catch (err) {
      if (option.throwError) throw err;else justWarning(err.message);
    }
  }

  /** @typedef {import('../../types').ICtxBase} ICtxBase */
  var ccUKey_ref_$5 = ccContext.ccUKey_ref_;
  function getRefsByClassKey (ccClassKey) {
    var refs = [];
    var ukeys = okeys(ccUKey_ref_$5);
    var len = ukeys.length;

    for (var i = 0; i < len; i++) {
      /** @type {{ctx:ICtxBase}} */
      var ref = ccUKey_ref_$5[ukeys[i]];

      if (ref.ctx.ccClassKey === ccClassKey) {
        refs.push(ref);
      }
    }

    return refs;
  }

  var _execute = (function (ccClassKey) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var refs = getRefsByClassKey(ccClassKey);
    refs.forEach(function (ref) {
      var _ref$ctx;

      if (ref.__$$isUnmounted) return;
      if (ref.ctx.execute) (_ref$ctx = ref.ctx).execute.apply(_ref$ctx, args);
    });
  });

  function getRefs () {
    var refs = [];
    var ccUKey_ref_ = ccContext.ccUKey_ref_;
    var ccKeys = okeys(ccUKey_ref_);
    ccKeys.forEach(function (k) {
      var ref = ccUKey_ref_[k];
      if (ref && !ref.__$$isUnmounted) refs.push(ref);
    });
    return refs;
  }

  var _executeAll = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var refs = getRefs();
    refs.forEach(function (ref) {
      var _ref$ctx;

      if (ref.ctx.execute) (_ref$ctx = ref.ctx).execute.apply(_ref$ctx, args);
    });
  });

  var appendState = ccContext.store.appendState;

  var _caller$1 = ccContext.reducer._caller;

  /**
   * inspired by mobx's <Observer>{state=>state.name}</Observer>
   */

  var obView = function obView() {
    return 'Ob view';
  };

  var _Ob = React.memo(function (props) {
    var module = props.module,
        connect = props.connect,
        classKey = props.classKey,
        render = props.render,
        children = props.children;

    if (module && connect) {
      throw new Error("module, connect can not been supplied both");
    } else if (!module && !connect) {
      throw new Error("module or connect should been supplied");
    }

    var view = render || children || obView;
    var register = module ? {
      module: module
    } : {
      connect: connect
    }; // 设置为1，最小化ctx够造过程，仅附加状态数据，衍生数据、和reducer相关函数

    register.lite = 1;
    var ctx = useConcentForOb(register, classKey);
    var mr = ctx.mr,
        cr = ctx.cr,
        r = ctx.r;
    var state, computed;

    if (module) {
      state = ctx.moduleState;
      computed = ctx.moduleComputed;
    } else {
      state = ctx.connectedState;
      computed = ctx.connectedComputed;
    }

    return view([state, computed, {
      mr: mr,
      cr: cr,
      r: r
    }]);
  });

  if (typeof window === 'undefined') {
    // eslint-disable-next-line
    global && (global.window = {});
  }

  var cloneModule = _cloneModule;
  var run = _run;
  var connect = _connect;
  var connectDumb = _connectDumb;
  var register$2 = register$1;
  var registerDumb$1 = registerDumb;
  var registerHookComp$1 = registerHookComp;
  var configure$1 = configure;
  var setGlobalState$1 = setGlobalState;
  var setState$1 = _setState$1;
  var set = _set;
  var setValue$1 = _setValue;
  var getState$7 = getState$6;
  var getGlobalState$1 = getGlobalState;
  var getComputed = _getComputed;
  var emit = _emit;
  var off = _off;
  var dispatch$2 = dispatch;
  var ccContext$1 = ccContext;
  var execute = _execute;
  var executeAll = _executeAll;
  var getRefs$1 = getRefs;
  var reducer = _caller$1;
  var clearContextIfHot$1 = clearContextIfHot;
  var CcFragment$1 = CcFragment;
  var Ob = _Ob;
  var cst = _cst;
  var appendState$1 = appendState;
  var useConcent$1 = useConcent;
  var defComputed = function defComputed(fn, defOptions) {
    return makeFnDesc(fn, defOptions);
  };
  var defLazyComputed = function defLazyComputed(fn, defOptions) {
    var desc = makeFnDesc(fn, defOptions);
    desc.lazy = true;
    return desc;
  };
  var defComputedVal = function defComputedVal(val) {
    return {
      fn: function fn() {
        return val;
      },
      depKeys: []
    };
  };
  var defWatch = function defWatch(fn, defOptions) {
    return makeFnDesc(fn, defOptions);
  };
  var defaultExport = {
    cloneModule: cloneModule,
    emit: emit,
    off: off,
    connect: connect,
    connectDumb: connectDumb,
    register: register$2,
    registerDumb: registerDumb$1,
    registerHookComp: registerHookComp$1,
    configure: configure$1,
    dispatch: dispatch$2,
    run: run,
    setGlobalState: setGlobalState$1,
    setState: setState$1,
    set: set,
    setValue: setValue$1,
    getGlobalState: getGlobalState$1,
    getState: getState$7,
    getComputed: getComputed,
    ccContext: ccContext$1,
    execute: execute,
    executeAll: executeAll,
    getRefs: getRefs$1,
    reducer: reducer,
    clearContextIfHot: clearContextIfHot$1,
    CcFragment: CcFragment$1,
    Ob: Ob,
    cst: cst,
    appendState: appendState$1,
    useConcent: useConcent$1,
    bindCcToMcc: bindCcToMcc,
    defComputed: defComputed,
    defLazyComputed: defLazyComputed,
    defComputedVal: defComputedVal,
    defWatch: defWatch
  };
  var multiCcContainer = null;
  function bindCcToMcc(name) {
    if (!multiCcContainer) {
      throw new Error('current env is not multi concent ins mode');
    }

    if (multiCcContainer[name]) {
      throw new Error("ccNamespace[" + name + "] already existed in window.mcc");
    }

    setCcNamespace(name);
    bindToWindow(name, defaultExport, multiCcContainer);
  }

  function avoidMultiCcInSameScope() {
    var winCc = getWinCc();

    if (winCc) {
      if (winCc.ccContext && winCc.ccContext.info) {
        var existedVersion = winCc.ccContext.info.version;
        var nowVersion = ccContext$1.info.version; //webpack-dev-server模式下，有些引用了concent的插件或者中间件模块，如果和当前concent版本不一致的话，会保留另外一个concent在其包下
        //路径如 node_modules/concent-middleware-web-devtool/node_modules/concent（注，在版本一致时，不会出现此问题）
        //这样的就相当于隐形的实例化两个concent 上下文，这是不允许的

        if (existedVersion !== nowVersion) {
          throw new Error("a existed version concent " + existedVersion + " is different with current about to import concent " + nowVersion + ", \n        it may caused by some of your concent-eco-module with older version concent, please reinstall them (concent-*** module)");
        }
      }
    }
  } // 微前端机构里，每个子应用都有自己的cc实例，需要绑定到mcc下，防止相互覆盖


  if (window) {
    multiCcContainer = window.mcc;

    if (multiCcContainer) {
      // 1秒后concent会检查ccns，如果不存在，说明用户忘记调用bindCcToMcc了
      setTimeout(function () {
        var ccns = getCcNamespace();

        if (!ccns) {
          throw new Error('detect window.mcc, but user forget call bindCcToMcc in bundle entry');
        } else {
          avoidMultiCcInSameScope();
        }
      }, 1000);
    } else {
      avoidMultiCcInSameScope();
      bindToWindow('cc', defaultExport);
    }
  }

  exports.cloneModule = cloneModule;
  exports.run = run;
  exports.connect = connect;
  exports.connectDumb = connectDumb;
  exports.register = register$2;
  exports.registerDumb = registerDumb$1;
  exports.registerHookComp = registerHookComp$1;
  exports.configure = configure$1;
  exports.setGlobalState = setGlobalState$1;
  exports.setState = setState$1;
  exports.set = set;
  exports.setValue = setValue$1;
  exports.getState = getState$7;
  exports.getGlobalState = getGlobalState$1;
  exports.getComputed = getComputed;
  exports.emit = emit;
  exports.off = off;
  exports.dispatch = dispatch$2;
  exports.ccContext = ccContext$1;
  exports.execute = execute;
  exports.executeAll = executeAll;
  exports.getRefs = getRefs$1;
  exports.reducer = reducer;
  exports.clearContextIfHot = clearContextIfHot$1;
  exports.CcFragment = CcFragment$1;
  exports.Ob = Ob;
  exports.cst = cst;
  exports.appendState = appendState$1;
  exports.useConcent = useConcent$1;
  exports.defComputed = defComputed;
  exports.defLazyComputed = defLazyComputed;
  exports.defComputedVal = defComputedVal;
  exports.defWatch = defWatch;
  exports.bindCcToMcc = bindCcToMcc;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
