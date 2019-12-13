
import { ERR_MESSAGE, MODULE_GLOBAL, MODULE_CC, MODULE_DEFAULT } from './constant';

export function bindThis(_this, methods) {
  methods.forEach(method => _this[method] = _this[method].bind(_this));
}

export function isValueNotNull(value) {
  return !(value === null || value === undefined);
}

export function isObjectNotNull(object) {
  if (object === null || object === undefined) {
    return false;
  }
  if (Object.keys(object).length > 0) {
    return true;
  }
  return false;
}

export function isObjectNull(object) {
  return !isObjectNotNull(object);
}

// const _toString = Object.prototype.toString;
//_toString.call(obj) === '[object Object]'; //judge plain json object
export function isPlainJsonObject(obj, canBeArray = false) {
  if (obj === null) return false;
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      if (canBeArray) return true;
      else return false;
    }
    return true;
  } else {
    return false;
  }
}

export function isPrefixedKeyValid(key) {
  const slashCount = key.split('').filter(v => v === '/').length;
  if (slashCount === 1) {
    return true;
  } else {
    return false;
  }
}

export function isActionTypeValid(type) {
  if (typeof type !== 'string') {
    return false
  } else {
    if (type.length === 0) return false;
    else return true;
  }
}

export function makeError(code, extraMessage) {
  let message = '';
  if (typeof code === 'string') message = code;
  else {
    message = ERR_MESSAGE[code] || '';
  }
  if (extraMessage) message += extraMessage;
  if (!message) message = `undefined message for code:${code}`;
  const error = new Error(message);
  error.code = code;
  return error;
}

/** make ccClassContext */
export function makeCcClassContext(module, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys) {
  return {
    module,
    ccClassKey,
    renderKeyClasses,
    originalWatchedKeys,
    watchedKeys,
    ccKeys: [],
    connectedState: {},
    connectedModuleKeyMapping: null,
    connectedModule: {},//记录当前cc类连接到了其他哪些模块
  }
}

// !!! different ccClass enable own a same key
export function makeUniqueCcKey(ccClassKey, ccKey) {
  // return `${ccClassKey}/${ccKey}`;
  return `${ccClassKey}$${ccKey}`;
}

export function makeHandlerKey(ccUniqueKey, eventName, identity) {
  return `${ccUniqueKey}$${eventName}$${identity}`;
}

export function isModuleNameValid(moduleName) {
  return /^[\$\#\&a-zA-Z0-9_-]+$/.test(moduleName);
}

export function isModuleNameCcLike(moduleName) {
  const name = moduleName.toLowerCase();
  return name === MODULE_CC;
}

export function isModuleStateValid(state) {
  return isPlainJsonObject(state);
}

export function verifyNamespacedActionType(actionType, allowSlashCountZero = true) {
  const isOk = /^[\$\#\/\&a-zA-Z0-9_-]+$/.test(actionType);
  if (isOk) {
    const charArr = actionType.split('');
    let slashCount = charArr.filter(char => char === '/').length;
    if (slashCount !== 1) {
      if (slashCount === 0) {
        if (allowSlashCountZero) return true;
        else return false;
      } else {
        return false
      }
    } else {
      if (charArr[0] === '/' || charArr[charArr.length - 1] === '/') {
        return false
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
}

// todo, modify verify rule
export function isCcOptionValid(ccOption) {
  return isPlainJsonObject(ccOption);
}

export function isCcActionValid(action) {
  let errMessage = '';
  if (!action) {
    errMessage = 'trying to dispatch an null action is meaningless!';
  } else {
    // const { type, payload } = action;
    const { type } = action;
    if (!isActionTypeValid(type)) {
      errMessage += 'action type must be string and length must LTE 1! ';
    }
    // if (!isPlainJsonObject(payload, true)) {
    //   errMessage += 'payload must be a plain json object! ';
    // }
  }
  return errMessage;
}

export function disassembleActionType(namespacedActionType) {
  if (namespacedActionType.includes('/')) {
    const [moduleName, actionType] = namespacedActionType.split('/');
    return { moduleName, actionType };
  } else {
    return { moduleName: MODULE_GLOBAL, actionType: namespacedActionType }
  }
}

export function verboseInfo(info) {
  return ` --verbose-info: ${info}`;
}

export function ccClassDisplayName(className) {
  return `CC(${className})`
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function verifyKeys(keys1, keys2) {
  let duplicate = false, notArray = false, keyElementNotString = false;
  if (!Array.isArray(keys1)) return { duplicate, notArray: true, keyElementNotString };
  if (!Array.isArray(keys2)) return { duplicate, notArray: true, keyElementNotString };
  const len1 = keys1.length;
  const len2 = keys2.length;
  outLoop: for (let i = 0; i < len1; i++) {
    const tmpKey = keys1[i];
    if (typeof tmpKey !== 'string') {
      keyElementNotString = true;
      break outLoop;
    }
    for (let j = 0; j < len2; j++) {
      const tmpKey2 = keys2[j];
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
  return { duplicate, notArray, keyElementNotString };
}

export function color(color = 'green') {
  return `color:${color};border:1px solid ${color}`;
}

export function styleStr(str) {
  return `%c${str}`;
}

export function justWarning(err) {
  console.error(' ------------ CC WARNING ------------');
  if (err instanceof Error) {
    console.error(err.message);
    console.error(err.stack);
  }
  else console.error(err);
}

export function justTip(msg) {
  console.log(' ------------ CC TIP ------------');
  console.log(`%c${msg}`, 'color:green;border:1px solid green;');
}

export function safeGetObjectFromObject(object, key, defaultVal = {}) {
  let childrenObject = object[key];
  if (!childrenObject) {
    childrenObject = object[key] = defaultVal;
  }
  return childrenObject;
}

export function safeGetArrayFromObject(object, key) {
  let childrenArray = object[key];
  if (!childrenArray) {
    childrenArray = object[key] = [];
  }
  return childrenArray;
}

export function safeAssignObjectValue(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach(key => {
    assignTo[key] = assignFrom[key];
  });
}

export function computeFeature(ccUniqueKey, state) {
  const stateKeys = Object.keys(state);
  const stateKeysStr = stateKeys.sort().join('|');
  return `${ccUniqueKey}/${stateKeysStr}`;
}

export function randomNumber(lessThan = 52) {
  const seed = Math.random();
  return parseInt(seed * lessThan);
}

export function clearObject(object, excludeKeys = [], reset) {
  if (Array.isArray(object)) object.length = 0;
  else Object.keys(object).forEach(key => {
    if (excludeKeys.includes(key)) {
    } else {
      if (reset) object[key] = reset;
      else delete object[key];
    }
  });
}

export function okeys(obj) {
  return Object.keys(obj);
}

export function flatObject(connectedState, alias, allowKeyDup = false) {
  const modules = okeys(connectedState);
  const fObj = {};
  modules.forEach(m => {
    const subObj = connectedState[m];
    const keys = okeys(subObj);
    keys.forEach(k => {
      const aliasKey = alias[`${m}/${k}`];
      if (fObj[k] != undefined) {//重复了，看看有没有别名
        if (aliasKey) {
          fObj[aliasKey] = subObj[k];
        } else {
          if (allowKeyDup === true) {
            fObj[k] = subObj[k];//重写
          } else {
            throw `key[${k}] duplicate in module ${m}`;
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

export function convertToStandardEvent(e) {
  let ret = null;
  if (e) {
    if (e.currentTarget && e.type) {
      ret = e;
    } else if (e.nativeEvent && e.target) {
      e.currentTarget = e.target;
      ret = e;
    }
  }
  return ret;
}

//防止有些在线IDE，绑定失败
export function bindToWindow(key, toBindObj, targetObj) {
  const attachToTarget = targetObj => {
    if (targetObj) targetObj[key] = toBindObj;
    else window[key] = toBindObj;
  }

  if (window) {
    attachToTarget(targetObj);
  } else {
    setTimeout(() => {
      attachToTarget(targetObj);
    }, 3000);
  }
}

/**
 * 浅比较两个对象
 * come from : https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
 */

export function shallowDiffers(a, b) {
  for (let i in a) if (!(i in b)) return true;
  for (let i in b) if (a[i] !== b[i]) return true;
  return false;
}

export function differStateKeys(oldState, newState) {
  const changed = [], setted = [];
  // const unchanged=[];
  okeys(newState).forEach(k => {
    const newVal = newState[k];
    if (newVal !== undefined) {
      setted.push(k);
      if (newVal !== oldState[k]) changed.push(k);
      // else unchanged.push(k);
    }
  });
  return { changed, setted };
}

export function removeArrElements(arr, toRemoveArr) {
  const newArr = [];
  arr.forEach((item) => {
    if (!toRemoveArr.includes(item)) newArr.push(item);
  });
  return newArr;
}

export function getRegisterOptions(options = {}) {
  if (typeof options === 'string') {
    return { module: options };
  } else {
    return Object.assign({ module: MODULE_DEFAULT }, options);
  }
}

let ccns = '';
export function setCcNamespace(name) {
  ccns = name;
}
export function getCcNamespace() {
  return ccns;
}
export function getWinCc() {
  if (ccns) return window.mcc[ccns];
  return window.cc;
}

export function executeCompOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx) {
  const firstDepKey = depKeys[0];
  let computedValue;

  if (depKeys.length === 1 && firstDepKey !== '*') {
    if (firstDepKey !== retKey) {
      computedValue = fn(newState, oldState, fnCtx);
    } else {
      computedValue = fn(newState[firstDepKey], oldState[firstDepKey], fnCtx);
    }
  } else {
    computedValue = fn(newState, oldState, fnCtx);
  }

  return computedValue;
}

