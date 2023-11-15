function _typeof(o) {
  '@babel/helpers - typeof';

  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o && 'function' == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? 'symbol' : typeof o;
          }),
    _typeof(o)
  );
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = (typeof Symbol !== 'undefined' && o[Symbol.iterator]) || o['@@iterator'];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || (allowArrayLike && o && typeof o.length === 'number')) {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length)
            return {
              done: true,
            };
          return {
            done: false,
            value: o[i++],
          };
        },
        e: function (e) {
          throw e;
        },
        f: F,
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function nodupPush(list, toPush) {
  if (!list.includes(toPush)) list.push(toPush);
}
function delListItem(list, toDel) {
  var idx = list.indexOf(toDel);
  if (idx >= 0) {
    list.splice(idx, 1);
  }
}
function dedupList(list) {
  return Array.from(new Set(list));
}
function includeOne(loopList, judgeList) {
  var ret = false;
  var _iterator = _createForOfIteratorHelper(loopList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var item = _step.value;
      if (judgeList.includes(item)) {
        // 包含有外层list的一项，就结束循环
        ret = true;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return ret;
}
function matchListItem(list, fullStr) {
  var matchKey = '';
  var len = list.length;
  for (var i = 0; i < len; i++) {
    var item = list[i];
    if (fullStr.startsWith(item)) {
      matchKey = item;
      break;
    }
  }
  return matchKey;
}
function enureReturnArr(fn, arg) {
  if (!fn) return [];
  var result = fn(arg);
  return Array.isArray(result) ? result : [result];
}

// @ts-ignore
var GLOBAL_REF = window || global;
var DEV_FLAG = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// @ts-nocheck
function noop() {}
function noopArgs() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args;
}
function noopArr() {
  return [];
}

function isMax(input) {
  return input === Number.MAX_SAFE_INTEGER;
}
function isDebug() {
  if (
    DEV_FLAG
    || GLOBAL_REF.name === 'previewFrame' // for stackblitz
    || GLOBAL_REF.BrowserFS // for codesandbox
  ) {
    return true;
  }
  return false;
}
function isObj(mayObj) {
  return mayObj && _typeof(mayObj) === 'object' && !Array.isArray(mayObj);
}
function isFn(mayFn) {
  return typeof mayFn === 'function';
}
function isAsyncFn(mayFn) {
  // 仅开发模式的包做检查
  if (!DEV_FLAG) return true;
  var str = Object.prototype.toString.call(mayFn);
  return str === '[object AsyncFunction]';
}
function isSymbol(maySymbol) {
  return _typeof(maySymbol) === 'symbol';
}
function isPromise(mayObj) {
  if (!mayObj) {
    return false;
  }
  var objType = _typeof(mayObj);
  return (objType === 'object' || objType === 'function') && isFn(mayObj.then);
}
function isProxyRevoked(proxy) {
  try {
    noop(proxy['test']);
    return false;
  } catch (err) {
    return true;
  }
}
function isProxyAvailable() {
  return typeof Proxy === 'function';
}

function tryAlert(err) {
  var throwErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var customLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var label = err;
  var isErr = false;
  if (isDebug()) {
    var _GLOBAL_REF$alert;
    if (err instanceof Error) {
      isErr = true;
      label = err.message;
    }
    err
      && ((_GLOBAL_REF$alert = GLOBAL_REF.alert) === null || _GLOBAL_REF$alert === void 0
        ? void 0
        : _GLOBAL_REF$alert.call(GLOBAL_REF, ''.concat(customLabel || label, ', see details in console.')));
  }
  if (isErr && customLabel) {
    err.message = ''.concat(customLabel);
  }
  console.error(err);
  if (throwErr) {
    throw isErr ? err : new Error(label);
  }
}
function tryWarn(err) {
  console.error(err);
}
function warn(msg) {
  var _console$warn, _console;
  (_console$warn = (_console = console).warn) === null || _console$warn === void 0 || _console$warn.call(_console, msg);
}

function getSafeNext(input) {
  var num = isMax(input) ? 1 : input + 1;
  return num;
}

// @ts-ignore
var canUseReflect = !!Reflect;
var hasProp = Object.prototype.hasOwnProperty;
function has(obj, key) {
  if (canUseReflect) {
    return Reflect.has(obj, key);
  }
  return hasProp.call(obj, key);
}
/** safe obj get */
function safeObjGet(obj, key, defaultValue) {
  var item = obj[key];
  if (!item) {
    item = obj[key] = defaultValue;
  }
  return item;
}
/** safe map get */
function safeMapGet(map, key, defaultValue) {
  var item = map.get(key);
  if (!item) {
    map.set(key, defaultValue);
    item = defaultValue;
  }
  return item;
}
function matchDictKey(dict, fullStr) {
  var matchKey = '';
  for (var key in dict) {
    // test if calling matchListItem(fullStr, Object.keys(dict)) is faster
    if (fullStr.startsWith(key)) {
      matchKey = key;
      break;
    }
  }
  return matchKey;
}
function getVal(obj, keyPath) {
  var val;
  var parent = obj;
  keyPath.forEach(function (key) {
    val = parent[key];
    parent = val;
  });
  return val;
}
function setVal(obj, keyPath, val) {
  var parent = obj;
  var lastIdx = keyPath.length - 1;
  keyPath.forEach(function (key, idx) {
    if (idx === lastIdx) {
      parent[key] = val;
      return;
    }
    parent = parent[key]; // for next cb
  });
}

function setNoop() {
  warn('changing shared state is invalid');
  return true;
}
function asType(val) {
  // return val as unknown as T;
  var typedVal = val;
  return typedVal;
}
function prefixValKey(valKey, sharedKey) {
  return ''.concat(sharedKey, '/').concat(valKey);
}
function canUseDeep(isDeep) {
  return isDeep && isProxyAvailable();
}

export {
  DEV_FLAG,
  GLOBAL_REF,
  asType,
  canUseDeep,
  dedupList,
  delListItem,
  enureReturnArr,
  getSafeNext,
  getVal,
  has,
  includeOne,
  isAsyncFn,
  isDebug,
  isFn,
  isMax,
  isObj,
  isPromise,
  isProxyAvailable,
  isProxyRevoked,
  isSymbol,
  matchDictKey,
  matchListItem,
  nodupPush,
  noop,
  noopArgs,
  noopArr,
  prefixValKey,
  safeMapGet,
  safeObjGet,
  setNoop,
  setVal,
  tryAlert,
  tryWarn,
  warn,
};
