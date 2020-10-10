"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.noop = noop;
exports.isValueNotNull = isValueNotNull;
exports.isObjectNotNull = isObjectNotNull;
exports.isObjectNull = isObjectNull;
exports.isBool = isBool;
exports.isObject = isObject;
exports.isPJO = isPJO;
exports.isAsyncFn = isAsyncFn;
exports.isEmptyVal = isEmptyVal;
exports.extractRenderKey = extractRenderKey;
exports.makeError = makeError;
exports.makeCuPackedValue = makeCuPackedValue;
exports.makeCuDepDesc = makeCuDepDesc;
exports.makeCcClassContext = makeCcClassContext;
exports.makeUniqueCcKey = makeUniqueCcKey;
exports.makeHandlerKey = makeHandlerKey;
exports.isModuleNameValid = isModuleNameValid;
exports.isModuleNameCcLike = isModuleNameCcLike;
exports.verboseInfo = verboseInfo;
exports.ccClassDisplayName = ccClassDisplayName;
exports.verifyKeys = verifyKeys;
exports.color = color;
exports.styleStr = styleStr;
exports.justWarning = justWarning;
exports.justTip = justTip;
exports.strictWarning = strictWarning;
exports.safeAdd = safeAdd;
exports.safeMinus = safeMinus;
exports.safeGet = safeGet;
exports.safeGetArray = safeGetArray;
exports.noDupPush = noDupPush;
exports.safeGetThenNoDupPush = safeGetThenNoDupPush;
exports.safeAssignObjectValue = safeAssignObjectValue;
exports.safeAssignToMap = safeAssignToMap;
exports.computeFeature = computeFeature;
exports.randomNumber = randomNumber;
exports.clearObject = clearObject;
exports.okeys = okeys;
exports.excludeArrStringItem = excludeArrStringItem;
exports.convertToStandardEvent = convertToStandardEvent;
exports.bindToWindow = bindToWindow;
exports.shallowDiffers = shallowDiffers;
exports.extractChangedState = extractChangedState;
exports.differStateKeys = differStateKeys;
exports.removeArrElements = removeArrElements;
exports.getRegisterOptions = getRegisterOptions;
exports.setCcNamespace = setCcNamespace;
exports.getCcNamespace = getCcNamespace;
exports.getWinCc = getWinCc;
exports.makeCommitHandler = makeCommitHandler;
exports.isOnlineEditor = isOnlineEditor;
exports.makeCallInfo = makeCallInfo;
exports.evalState = evalState;
exports.getValueByKeyPath = getValueByKeyPath;
exports.isDepKeysValid = isDepKeysValid;
exports.checkDepKeys = checkDepKeys;
exports.makeFnDesc = makeFnDesc;
exports.isSymbol = isSymbol;
exports.delay = delay;
exports.getErrStackKeywordLoc = getErrStackKeywordLoc;
exports.getVal = getVal;

var _constant = require("./constant");

var _privConstant = require("./priv-constant");

var _runtimeVar = _interopRequireDefault(require("../cc-context/runtime-var"));

/* eslint-disable */
var cer = console.error;
var protoToString = Object.prototype.toString;

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

function isBool(val) {
  return typeof val === 'boolean';
}

function isObject(obj) {
  var str = protoToString.call(obj); // !!!编译后的对象可能重写了toStringTag Symbol(Symbol.toStringTag): "Module"

  return str === '[object Object]' || str === '[object Module]';
} // isPJO is short of isPlainJsonObject


function isPJO(obj, canBeArray) {
  if (canBeArray === void 0) {
    canBeArray = false;
  }

  var isArr = Array.isArray(obj);
  var isObj = isObject(obj);
  return canBeArray ? isArr || isObj : isObj;
}

function isAsyncFn(fn) {
  if (!fn) return false; // @see https://github.com/tj/co/blob/master/index.js
  // obj.constructor.name === 'AsyncFunction'

  var isAsync = protoToString.call(fn) === '[object AsyncFunction]' || 'function' == typeof fn.then;

  if (isAsync === true) {
    return true;
  } //有可能成降级编译成 __awaiter格式的了 或者 _regenerator


  var fnStr = fn.toString();

  if (fnStr.indexOf('_awaiter') >= 0 || fnStr.indexOf('_regenerator') >= 0) {
    return true;
  }

  return false;
} // 0 算有效值, undefined null ''算空值


function isEmptyVal(val) {
  return !val && val !== 0;
} // renderKey 可能是 IDispatchOptions


function extractRenderKey(renderKey) {
  var getRkey = function getRkey(key) {
    if (!key && key !== 0) return [];
    if (Array.isArray(key)) return key;
    return null;
  };

  var targetRenderKey = getRkey(renderKey);
  if (targetRenderKey) return targetRenderKey;
  if (typeof renderKey === 'object') targetRenderKey = getRkey(renderKey.renderKey);
  if (targetRenderKey) return targetRenderKey;
  return [renderKey]; // 是一个具体的string 或 number
}

function makeError(code, extraMessage) {
  var message = '';
  if (typeof code === 'string') message = code;else {
    message = _constant.ERR_MESSAGE[code] || '';
  }
  if (extraMessage) message += extraMessage;
  if (!message) message = "undefined message for code:" + code;
  var error = new Error(message);
  error.code = code;
  return error;
}

function makeCuPackedValue(isLazy, result, needCompute, fn, newState, oldState, fnCtx) {
  var _ref;

  return _ref = {}, _ref[_privConstant.CU_KEY] = 1, _ref.needCompute = needCompute, _ref.fn = fn, _ref.newState = newState, _ref.oldState = oldState, _ref.fnCtx = fnCtx, _ref.isLazy = isLazy, _ref.result = result, _ref;
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
  return name === _constant.MODULE_CC;
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

function justTip(msg, tipColor) {
  if (tipColor === void 0) {
    tipColor = 'green';
  }

  console.log(tipStart('TIP'));
  console.log("%c" + msg, "color:" + tipColor + ";border:1px solid " + tipColor + ";");
}

function strictWarning(err) {
  cer(tipStart('WARNING'));
  cer(err);

  if (_runtimeVar["default"].isStrict) {
    throw err;
  }
}

function safeAdd(object, key, toAdd) {
  try {
    object[key] += toAdd;
  } catch (err) {
    object[key] = toAdd;
  }
}

function safeMinus(object, key, toMinus) {
  try {
    object[key] -= toMinus;
  } catch (err) {
    object[key] = 0;
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
  var stateKeys = okeys(state);
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
    return;
  }

  okeys(object).forEach(function (key) {
    if (excludeKeys.includes(key)) {
      // do nothing
      return;
    }

    var subMap = object[key];

    if (deepClear && subMap) {
      okeys(subMap).forEach(function (key) {
        return delete subMap[key];
      });
    } else {
      if (reset) object[key] = reset;else delete object[key];
    }
  });
}

function okeys(obj) {
  return Object.keys(obj);
}

function excludeArrStringItem(arr, toExcludeStr) {
  var idx = arr.indexOf(toExcludeStr);

  if (idx > -1) {
    var arrCopy = arr.slice();
    arrCopy.splice(idx, 1);
    return arrCopy;
  } else {
    return arr;
  }
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
  var extractRefChangedState = _runtimeVar["default"].extractRefChangedState,
      extractModuleChangedState = _runtimeVar["default"].extractModuleChangedState,
      nonObjectValueCompare = _runtimeVar["default"].nonObjectValueCompare,
      objectValueCompare = _runtimeVar["default"].objectValueCompare;
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
      module: _constant.MODULE_DEFAULT
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
    renderKey: [],
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
    throw new Error("state " + _privConstant.NOT_A_JSON);
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

var symbolTag = "[object Symbol]";

function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

function isSymbol(value) {
  return typeof value === "symbol" || isObjectLike(value) && Object.prototype.toString.call(value) === symbolTag;
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

function getVal(val, defaultVal) {
  if (val !== undefined) return val;
  return defaultVal;
}