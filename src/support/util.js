/* eslint-disable */
import { ERR_MESSAGE, MODULE_CC, MODULE_DEFAULT } from './constant';
import { NOT_A_JSON, CU_KEY } from './priv-constant';
import runtimeVar from '../cc-context/runtime-var';

const cer = console.error;

export function isValueNotNull(value) {
  return !(value === null || value === undefined);
}

export function isObjectNotNull(object) {
  if (object === null || object === undefined) {
    return false;
  }
  if (okeys(object).length > 0) {
    return true;
  }
  return false;
}

export function isObjectNull(object) {
  return !isObjectNotNull(object);
}

// const _toString = Object.prototype.toString;
//_toString.call(obj) === '[object Object]'; //judge plain json object
// isPJO is short of isPlainJsonObject
export function isPJO(obj, canBeArray = false) {
  // null undefined 0 false ''
  if (!obj) return false;

  const isObj = (typeof obj) === 'object';
  if (isObj) {
    const isArr = Array.isArray(obj);
    return canBeArray ? isArr : (isObj && !isArr);
  } else {
    return false;
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

export function makeCuObValue(isLazy, result, needCompute, fn, newState, oldState, fnCtx, ) {
  return { [CU_KEY]: 1, needCompute, fn, newState, oldState, fnCtx, isLazy, result };
}

export function makeCuDepDesc() {
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

export function verboseInfo(info) {
  return info ? ` --verbose-info: ${info}` : '';
}

export function ccClassDisplayName(className) {
  return `CC(${className})`
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

const tipStart = (str) => `------------ CC ${str} ------------`;
export function justWarning(err) {
  cer(tipStart('WARNING'));
  if (err instanceof Error) {
    cer(err.message);
    cer(err.stack);
  }
  else cer(err);
}

export function justTip(msg) {
  console.log(tipStart('TIP'));
  console.log(`%c${msg}`, 'color:green;border:1px solid green;');
}

export function strictWarning(err) {
  cer(tipStart('WARNING'));
  cer(err);
  if (runtimeVar.isStrict) {
    throw err;
  }
}

export function safeGet(object, key, defaultVal = {}) {
  let childrenObject = object[key];
  if (!childrenObject) {
    childrenObject = object[key] = defaultVal;
  }
  return childrenObject;
}

export function safeGetArray(object, key) {
  return safeGet(object, key, []);
}

export function noDupPush(arr, strItem) {
  if (!arr.includes(strItem)) arr.push(strItem);
}

export function safeGetThenNoDupPush(object, key, strItem) {
  const arr = safeGetArray(object, key);
  noDupPush(arr, strItem)
}

export function safeAssignObjectValue(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach(key => {
    assignTo[key] = assignFrom[key];
  });
}

/**
 * 把某个object赋值到container[key]的map下，map存在就直接赋值，map不存在则先创建再赋值，确保map引用无变化
 * @param {*} container 对象容器
 * @param {*} key 字段名
 * @param {*} objectToBeenAssign 等待赋值的object
 */
export function safeAssignToMap(container, key, objectToBeenAssign) {
  let map = container[key];
  if (!map) map = container[key] = {};
  safeAssignObjectValue(map, objectToBeenAssign);
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

// 在 object[key]存在且deepClear为true时，传入的reset会被忽略
// 传入deepClear是为了保持引用不变
export function clearObject(object, excludeKeys = [], reset, deepClear = false) {
  if (Array.isArray(object)) {
    const retainKeys = [];
    excludeKeys.forEach(key => {
      if (object.includes(key)) retainKeys.push(key);
    });
    object.length = 0;
    retainKeys.forEach(key => object.push(key));
  } else Object.keys(object).forEach(key => {
    if (excludeKeys.includes(key)) {
      // do nothing
    } else {
      const subMap = object[key];
      if (deepClear && subMap) {
        okeys(subMap).forEach(key => delete subMap[key]);
      } else {
        if (reset) object[key] = reset;
        else delete object[key];
      }
    }
  });
}

export function okeys(obj) {
  return Object.keys(obj);
}

export function excludeArrStringItem(arr, toExcludeStr) {
  const idx = arr.indexOf(toExcludeStr);
  if (idx > -1) {
    const arrCopy = arr.slice();
    arrCopy.splice(idx, 1);
    return arrCopy;
  } else {
    return arr
  }
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

export function extractChangedState(oldState, partialNewState, moduleOpt) {
  let changedState = {};

  let setted = false;
  const { extractRefChangedState, extractModuleChangedState, nonObjectValueCompare, objectValueCompare } = runtimeVar;
  const needExtractChangedState = moduleOpt ? extractModuleChangedState : extractRefChangedState;

  // 非模块调用
  if (!moduleOpt) {
    if (!needExtractChangedState) return partialNewState;
    if (!nonObjectValueCompare && !objectValueCompare) return partialNewState;
  }

  if (partialNewState) {
    okeys(partialNewState).forEach(key => {
      const oldVal = oldState[key];
      const newVal = partialNewState[key];
      const valType = typeof newVal;

      let isNotEqual = true;
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

export function makeCommitHandler() {
  let state = null;

  const commit = (partialState) => {
    if (!state) state = {};
    Object.assign(state, partialState);
  }

  const clear = () => state = null;

  const getFnCommittedState = () => state;
  return { commit, clear, getFnCommittedState }
}

export function isOnlineEditor() {
  let result = false;
  if (window) {
    if (
      window.name === 'previewFrame' //for stackblitz
      || window.__SANDBOX_DATA__ // for codesandbox
      || window.BrowserFS // for codesandbox
    ) {
      result = true;
    }
  }
  return result;
}

export function makeCallInfo(module) {
  return { payload: null, renderKey: '', delay: -1, module, fnName: '' }
}

export function evalState(state = {}) {
  const ret = typeof state === 'function' ? state() : state;
  if (!isPJO(ret)) {
    throw new Error(`state ${NOT_A_JSON}`);
  }
  return ret;
}

function _getValue(obj, keys, lastKeyIndex, keyIndex) {
  const key = keys[keyIndex];
  if (lastKeyIndex === keyIndex) {
    return obj[key];
  } else {
    return _getValue(obj[key], keys, lastKeyIndex, ++keyIndex);
  }
}
export function getValueByKeyPath(obj, keyPath) {
  const keys = keyPath.split('.');
  return _getValue(obj, keys, keys.length - 1, 0);
}

export function getPassToMapWaKeys(watchedKeys) {
  if (watchedKeys === '-') return '*';
  else return watchedKeys;
}

export function isDepKeysValid(depKeys) {
  return Array.isArray(depKeys) || depKeys === '-' || depKeys === '*';
}

export function checkDepKeys(depKeys) {
  if (depKeys && !isDepKeysValid(depKeys)) {
    throw new Error(`depKeys must an array , '*' or '-'`);
  }
}

export function makeFnDesc(fn, depKeysOrOpt, check = true) {
  // 防止显式的传递null
  const _depKeysOrOpt = depKeysOrOpt || {};
  const desc = { fn };
  const assignFrom = isDepKeysValid(_depKeysOrOpt) ? { depKeys: _depKeysOrOpt } : _depKeysOrOpt;
  check && checkDepKeys(assignFrom.depKeys)
  return Object.assign(desc, assignFrom);
}


const symbolTag = "[object Symbol]"

function isObjectLike(value) {
  return typeof value == "object" && value !== null
}

export function isSymbol(value) {
  return (
    typeof value === "symbol" ||
    (isObjectLike(value) && Object.prototype.toString.call(value) === symbolTag)
  )
}
