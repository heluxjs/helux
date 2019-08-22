"use strict";

exports.__esModule = true;
exports.bindThis = bindThis;
exports.isValueNotNull = isValueNotNull;
exports.isObjectNotNull = isObjectNotNull;
exports.isObjectNull = isObjectNull;
exports.isPlainJsonObject = isPlainJsonObject;
exports.isPrefixedKeyValid = isPrefixedKeyValid;
exports.isActionTypeValid = isActionTypeValid;
exports.makeError = makeError;
exports.makeCcClassContext = makeCcClassContext;
exports.makeUniqueCcKey = makeUniqueCcKey;
exports.makeHandlerKey = makeHandlerKey;
exports.isModuleNameValid = isModuleNameValid;
exports.isModuleNameCcLike = isModuleNameCcLike;
exports.isModuleStateValid = isModuleStateValid;
exports.verifyNamespacedActionType = verifyNamespacedActionType;
exports.isCcOptionValid = isCcOptionValid;
exports.isCcActionValid = isCcActionValid;
exports.disassembleActionType = disassembleActionType;
exports.verboseInfo = verboseInfo;
exports.ccClassDisplayName = ccClassDisplayName;
exports.clone = clone;
exports.verifyKeys = verifyKeys;
exports.color = color;
exports.styleStr = styleStr;
exports.justWarning = justWarning;
exports.justTip = justTip;
exports.safeGetObjectFromObject = safeGetObjectFromObject;
exports.safeGetArrayFromObject = safeGetArrayFromObject;
exports.safeAssignObjectValue = safeAssignObjectValue;
exports.computeFeature = computeFeature;
exports.randomNumber = randomNumber;
exports.clearObject = clearObject;
exports.okeys = okeys;
exports.flatObject = flatObject;
exports.convertToStandardEvent = convertToStandardEvent;
exports.bindToWindow = bindToWindow;
exports.shallowDiffers = shallowDiffers;
exports["default"] = void 0;

var _constant = require("./constant");

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
} // const _toString = Object.prototype.toString;
//_toString.call(obj) === '[object Object]'; //judge plain json object


function isPlainJsonObject(obj, canBeArray) {
  if (canBeArray === void 0) {
    canBeArray = false;
  }

  if (obj === null) return false;

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

function verifyNamespacedActionType(actionType, allowSlashCountZero) {
  if (allowSlashCountZero === void 0) {
    allowSlashCountZero = true;
  }

  var isOk = /^[\$\#\/\&a-zA-Z0-9_-]+$/.test(actionType);

  if (isOk) {
    var charArr = actionType.split('');
    var slashCount = charArr.filter(function (_char) {
      return _char === '/';
    }).length;

    if (slashCount !== 1) {
      if (slashCount === 0) {
        if (allowSlashCountZero) return true;else return false;
      } else {
        return false;
      }
    } else {
      if (charArr[0] === '/' || charArr[charArr.length - 1] === '/') {
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
} // todo, modify verify rule


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
      moduleName: _constant.MODULE_GLOBAL,
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
    if (!excludeKeys.includes(key)) delete object[key];else {
      if (reset) object[key] = reset;
    }
  });
}

function okeys(obj) {
  return Object.keys(obj);
}

function flatObject(connectedState, alias, allowKeyDup) {
  if (allowKeyDup === void 0) {
    allowKeyDup = false;
  }

  var modules = okeys(connectedState);
  var fObj = {};
  modules.forEach(function (m) {
    var subObj = connectedState[m];
    var keys = okeys(subObj);
    keys.forEach(function (k) {
      var aliasKey = alias[m + "/" + k];

      if (fObj[k] != undefined) {
        //重复了，看看有没有别名
        if (aliasKey) {
          fObj[aliasKey] = subObj[k];
        } else {
          if (allowKeyDup === true) {
            fObj[k] = subObj[k]; //重写
          } else {
            throw "key[" + k + "] duplicate in module " + m;
          }
        }
      } else {
        if (aliasKey) {
          fObj[aliasKey] = subObj[k];
        } else {
          fObj[k] = subObj[k];
        }
      }
    });
  });
  return fObj;
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

var _default = {
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
exports["default"] = _default;