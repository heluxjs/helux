"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isValueNotNull = isValueNotNull;
exports.isObjectNotNull = isObjectNotNull;
exports.isObjectNull = isObjectNull;
exports.isPlainJsonObject = isPlainJsonObject;
exports.makeError = makeError;
exports.makeCcClassContext = makeCcClassContext;
exports.makeUniqueCcKey = makeUniqueCcKey;
exports.makeHandlerKey = makeHandlerKey;
exports.isModuleNameValid = isModuleNameValid;
exports.isModuleNameCcLike = isModuleNameCcLike;
exports.isModuleStateValid = isModuleStateValid;
exports.verboseInfo = verboseInfo;
exports.ccClassDisplayName = ccClassDisplayName;
exports.clone = clone;
exports.verifyKeys = verifyKeys;
exports.color = color;
exports.styleStr = styleStr;
exports.justWarning = justWarning;
exports.justTip = justTip;
exports.strictWarning = strictWarning;
exports.safeGetObjectFromObject = safeGetObjectFromObject;
exports.safeGetArrayFromObject = safeGetArrayFromObject;
exports.safeAssignObjectValue = safeAssignObjectValue;
exports.computeFeature = computeFeature;
exports.randomNumber = randomNumber;
exports.clearObject = clearObject;
exports.okeys = okeys;
exports.excludeArrStringItem = excludeArrStringItem;
exports.convertToStandardEvent = convertToStandardEvent;
exports.bindToWindow = bindToWindow;
exports.shallowDiffers = shallowDiffers;
exports.differStateKeys = differStateKeys;
exports.removeArrElements = removeArrElements;
exports.getRegisterOptions = getRegisterOptions;
exports.setCcNamespace = setCcNamespace;
exports.getCcNamespace = getCcNamespace;
exports.getWinCc = getWinCc;
exports.makeCommitHandler = makeCommitHandler;
exports.isOnlineEditor = isOnlineEditor;
exports.makeCallInfo = makeCallInfo;

var _constant = require("./constant");

var _runtimeVar = _interopRequireDefault(require("../cc-context/runtime-var"));

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
} // const _toString = Object.prototype.toString;
//_toString.call(obj) === '[object Object]'; //judge plain json object


function isPlainJsonObject(obj, canBeArray) {
  if (canBeArray === void 0) {
    canBeArray = false;
  }

  // null undefined 0 false ''
  if (!obj) return false;
  var isObj = typeof obj === 'object';

  if (isObj) {
    var isArr = Array.isArray(obj);
    return canBeArray ? isArr : isObj && !isArr;
  } else {
    return false;
  }
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
/** make ccClassContext */


function makeCcClassContext(module, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys) {
  return {
    module: module,
    ccClassKey: ccClassKey,
    renderKeyClasses: renderKeyClasses,
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
  return name === _constant.MODULE_CC;
}

function isModuleStateValid(state) {
  return isPlainJsonObject(state);
}

function verboseInfo(info) {
  return info ? " --verbose-info: " + info : '';
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

var tipStart = function tipStart(str) {
  return "------------ CC " + str + " ------------";
};

function justWarning(err) {
  console.error(tipStart('WARNING'));

  if (err instanceof Error) {
    console.error(err.message);
    console.error(err.stack);
  } else console.error(err);
}

function justTip(msg) {
  console.log(tipStart('TIP'));
  console.log("%c" + msg, 'color:green;border:1px solid green;');
}

function strictWarning(err) {
  console.error(tipStart('WARNING'));
  console.error(err);

  if (_runtimeVar["default"].isStrict) {
    throw err;
  }
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
    if (excludeKeys.includes(key)) {} else {
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


function bindToWindow(key, toBindObj, targetObj) {
  var attachToTarget = function attachToTarget(targetObj) {
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

  var getFnCommittedState = function getFnCommittedState() {
    return state;
  };

  return {
    commit: commit,
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

;