(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('co'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'co', 'react', 'react-dom'], factory) :
  (factory((global.concent = {}),global.co,global.React,global.ReactDOM));
}(this, (function (exports,co,React,ReactDOM) { 'use strict';

  co = co && co.hasOwnProperty('default') ? co['default'] : co;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

  var _ERR_MESSAGE;

  var MODULE_GLOBAL = '$$global';
  var MODULE_DEFAULT = '$$default';
  var MODULE_CC = '$$cc';
  var MODULE_CC_ROUTER = '$$CONCENT_ROUTER';
  var CC_CLASS_PREFIX = '$$CcClass';
  var CC_FRAGMENT_PREFIX = '$$CcFrag';
  var CC_HOOK_PREFIX = '$$CcHook';
  var CC_PREFIX = '$$Cc';
  var CC_DISPATCHER = '$$Dispatcher';
  var CC_DISPATCHER_BOX = '__cc_dispatcher_container_designed_by_zzk_qq_is_624313307__';
  var CCSYNC_KEY = Symbol('__for_sync_param_ccsync__');
  var MOCKE_KEY = Symbol('__for_mock_event__');
  var LAZY_KEY = Symbol('__lazy_handle_state__');
  var SIG_FN_START = 10;
  var SIG_FN_END = 11;
  var SIG_FN_QUIT = 12;
  var SIG_FN_ERR = 13;
  var SIG_MODULE_CONFIGURED = 14;
  var SIG_STATE_CHANGED = 15;
  var RENDER_NO_OP = 1;
  var RENDER_BY_KEY = 2;
  var RENDER_BY_STATE = 3;
  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY = 1;
  var STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE = 2;
  var EFFECT_AVAILABLE = 1;
  var EFFECT_STOPPED = 0;
  var DISPATCH = 'dispatch';
  var SET_STATE = 'setState';
  var SET_MODULE_STATE = 'setModuleState';
  var FORCE_UPDATE = 'forceUpdate';
  var INVOKE = 'invoke';
  var SYNC = 'sync';
  var CATE_MODULE = 'module';
  var CATE_REF = 'ref';
  var ERR = {
    CC_ALREADY_STARTUP: 1000,
    CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE: 1001,
    CC_MODULE_NAME_DUPLICATE: 1002,
    CC_REGISTER_A_CC_CLASS: 1003,
    CC_MODULE_KEY_CC_FOUND: 1004,
    CC_MODULE_NAME_INVALID: 1005,
    CC_STORE_STATE_INVALID: 1006,
    CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID: 1008,
    CC_OPTION_REDUCER_INVALID: 1009,
    CC_OPTION_REDUCER_FVALUE_INVALID: 1010,
    CC_MODULE_NOT_FOUND: 1012,
    CC_DISPATCH_STRING_INVALID: 1013,
    CC_DISPATCH_PARAM_INVALID: 1014,
    CC_NO_DISPATCHER_FOUND: 1015,
    CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION: 1016,
    CC_MODULE_NAME_HAS_NO_STATE: 1017,
    CC_CLASS_KEY_DUPLICATE: 1100,
    CC_CLASS_NOT_FOUND: 1101,
    CC_CLASS_STORE_MODULE_INVALID: 1102,
    CC_CLASS_REDUCER_MODULE_INVALID: 1103,
    CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED: 1104,
    CC_CLASS_INSTANCE_KEY_DUPLICATE: 1200,
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
    CC_REDUCER_MODULE_NAME_DUPLICATE: 1511 // REDUCER_KEY_NOT_EXIST_IN_STORE_MODULE: 1203,

  };
  var ERR_MESSAGE = (_ERR_MESSAGE = {}, _ERR_MESSAGE[ERR.CC_ALREADY_STARTUP] = 'concent startup method con only be invoked one time by user, if cc is under hot reload mode, you can ignore this message ', _ERR_MESSAGE[ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE] = 'you are trying register a module class but cc startup with non module mode! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_DUPLICATE] = 'module name duplicate!', _ERR_MESSAGE[ERR.CC_REGISTER_A_CC_CLASS] = 'registering a cc class is prohibited! ', _ERR_MESSAGE[ERR.CC_MODULE_KEY_CC_FOUND] = 'key:"$$cc" is a built-in module name for concent,you can not configure it or the name like it in you store or reducer! ', _ERR_MESSAGE[ERR.CC_MODULE_NAME_INVALID] = "module name is invalid, /^[$#&a-zA-Z0-9_-]+$/.test() is false. ", _ERR_MESSAGE[ERR.CC_STORE_STATE_INVALID] = "module state of store must be a plain json object! ", _ERR_MESSAGE[ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID] = "argument moduleReducer is invalid, must be a function!", _ERR_MESSAGE[ERR.CC_OPTION_REDUCER_INVALID] = "option.reducer is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_OPTION_REDUCER_FVALUE_INVALID] = "option.reducer's field-value is invalid, must be a plain json object(not an array also)!", _ERR_MESSAGE[ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION] = "one of the watch keys is not a valid module name in store!", _ERR_MESSAGE[ERR.CC_MODULE_NOT_FOUND] = "module not found!", _ERR_MESSAGE[ERR.CC_DISPATCH_STRING_INVALID] = "dispatch param writing is invalid when its type is string, only these 3 is valid: (functionName)\u3001(moduleName)/(functionName)\u3001(moduleName)/(reducerModuleName)/(functionName)", _ERR_MESSAGE[ERR.CC_DISPATCH_PARAM_INVALID] = "dispatch param type is invalid, it must be string or object", _ERR_MESSAGE[ERR.CC_NO_DISPATCHER_FOUND] = "\n    cc guess you may set autoCreateDispatcher as false in StartupOption,\n    if you want CcFragment works well anywhere and anytime, you must initialize only one Dispatcher, \n    ant put it to a place that the Dispatcher will never been mount, so I suggest write it like:\n    import {createDispatcher} from 'concent';\n    const CcDispatcher = createDispatcher();\n    <App>\n      <CcDispatcher />\n      {/* another jsx */}\n    </App>\n    or\n    <CcDispatcher>\n      <App />\n    </CcDispatcher>\n  ", _ERR_MESSAGE[ERR.CC_MODULE_NAME_HAS_NO_STATE] = "there is no module state in the store for your input module name", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE] = "ccKey duplicate while new a CcComponent, try rename it or delete the ccKey prop, cc will generate one automatically for the CcComponent! if you are sure the key is different, maybe the CcComponent's father Component is also a CcComponent, then you can prefix your ccKey with the father Component's ccKey!   ", _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_NOT_FOUND] = 'ccClass instance not found, it may has been unmounted or the ccKey is incorrect! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND] = 'ccClass instance method not found, make sure the instance include the method! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID] = 'ccClass instance invoke callWith method with invalid args! ', _ERR_MESSAGE[ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE] = 'ccClass is declared as singleton, now cc found you are trying new another one instance! ', _ERR_MESSAGE[ERR.CC_ARG_STORED_KEYS_DUPLICATE_WITH_WATCHED_KEYS] = 'some of your storedKeys has been declared in CcClass watchedKeys!', _ERR_MESSAGE[ERR.CC_STORED_KEYS_NEED_CCKEY] = 'you must explicitly specify a ccKey for ccInstance if you want to use storedKeys!', _ERR_MESSAGE[ERR.CC_CLASS_KEY_DUPLICATE] = 'ccClassKey duplicate while you register a react class!  ', _ERR_MESSAGE[ERR.CC_CLASS_NOT_FOUND] = 'ccClass not found, make sure the supplied ccClassKey been registered to concent!  ', _ERR_MESSAGE[ERR.CC_CLASS_STORE_MODULE_INVALID] = 'ccClass ccOption module value is invalid, can not match it in store! ', _ERR_MESSAGE[ERR.CC_CLASS_REDUCER_MODULE_INVALID] = 'ccClass ccOption reducerModule value is invalid, can not match it in reducer! ', _ERR_MESSAGE[ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED] = '$$fragment is cc built-in class key prefix, your class key can not start with it!', _ERR_MESSAGE[ERR.CC_ARG_KEYS_NOT_AN_ARRAY] = "watchedKeys is not an Array! if you want to watch all state keys of a module, you can set watchedKeys='*' ", _ERR_MESSAGE[ERR.CC_ARG_KEYS_INCLUDE_NON_STRING_ELEMENT] = 'watchedKeys include non string element!', _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NAMING_INVALID] = "action type's naming is invalid, correct one may like: fooModule/fooType. ", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_NO_MODULE] = "action type's module name is invalid, cause cc may not under module mode when you startup, or the store don't include the module name you defined in action type!", _ERR_MESSAGE[ERR.CC_REDUCER_MODULE_NAME_DUPLICATE] = "reducer module name duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE] = "reducer action type duplicate!", _ERR_MESSAGE[ERR.CC_REDUCER_NOT_A_FUNCTION] = "reducer must be a function!", _ERR_MESSAGE);
  var constant = {
    MODULE_GLOBAL: MODULE_GLOBAL,
    MODULE_DEFAULT: MODULE_DEFAULT,
    MODULE_CC: MODULE_CC,
    ERR: ERR,
    ERR_MESSAGE: ERR_MESSAGE,
    STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
    STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE
  };

  var _cst = /*#__PURE__*/Object.freeze({
    MODULE_GLOBAL: MODULE_GLOBAL,
    MODULE_DEFAULT: MODULE_DEFAULT,
    MODULE_CC: MODULE_CC,
    MODULE_CC_ROUTER: MODULE_CC_ROUTER,
    CC_CLASS_PREFIX: CC_CLASS_PREFIX,
    CC_FRAGMENT_PREFIX: CC_FRAGMENT_PREFIX,
    CC_HOOK_PREFIX: CC_HOOK_PREFIX,
    CC_PREFIX: CC_PREFIX,
    CC_DISPATCHER: CC_DISPATCHER,
    CC_DISPATCHER_BOX: CC_DISPATCHER_BOX,
    CCSYNC_KEY: CCSYNC_KEY,
    MOCKE_KEY: MOCKE_KEY,
    LAZY_KEY: LAZY_KEY,
    SIG_FN_START: SIG_FN_START,
    SIG_FN_END: SIG_FN_END,
    SIG_FN_QUIT: SIG_FN_QUIT,
    SIG_FN_ERR: SIG_FN_ERR,
    SIG_MODULE_CONFIGURED: SIG_MODULE_CONFIGURED,
    SIG_STATE_CHANGED: SIG_STATE_CHANGED,
    RENDER_NO_OP: RENDER_NO_OP,
    RENDER_BY_KEY: RENDER_BY_KEY,
    RENDER_BY_STATE: RENDER_BY_STATE,
    STATE_FOR_ONE_CC_INSTANCE_FIRSTLY: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
    STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
    EFFECT_AVAILABLE: EFFECT_AVAILABLE,
    EFFECT_STOPPED: EFFECT_STOPPED,
    DISPATCH: DISPATCH,
    SET_STATE: SET_STATE,
    SET_MODULE_STATE: SET_MODULE_STATE,
    FORCE_UPDATE: FORCE_UPDATE,
    INVOKE: INVOKE,
    SYNC: SYNC,
    CATE_MODULE: CATE_MODULE,
    CATE_REF: CATE_REF,
    ERR: ERR,
    ERR_MESSAGE: ERR_MESSAGE,
    default: constant
  });

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
    return name === MODULE_CC;
  }
  function isModuleStateValid(state) {
    return isPlainJsonObject(state);
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

    if (err instanceof Error) {
      console.error(err.message);
      console.error(err.stack);
    } else console.error(err);
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
      if (!excludeKeys.includes(key)) {
        delete object[key];
      } else {
        if (reset) object[key] = reset;
      }
    });
  }
  function okeys(obj) {
    return Object.keys(obj);
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
        unchanged = [],
        setted = [];
    okeys(newState).forEach(function (k) {
      var newVal = newState[k];

      if (newVal !== undefined) {
        setted.push(k);
        if (newVal !== oldState[k]) changed.push(k);else unchanged.push(k);
      }
    });
    return {
      changed: changed,
      unchanged: unchanged,
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

  function _wrapFn(retKey, retKey_fn_) {
    var _retKey_fn_$retKey = retKey_fn_[retKey],
        fn = _retKey_fn_$retKey.fn,
        depKeys = _retKey_fn_$retKey.depKeys;
    return {
      retKey: retKey,
      fn: fn,
      depKeys: depKeys
    };
  }

  function clearCachedData() {
    cacheArea_pickedRetKeys_ = getCacheDataContainer();
  } // cate module | ref
  // type computed | watch

  function pickDepFns (isBeforeMount, cate, type, depDesc, stateModule, oldState, committedState, cUkey) {
    var moduleDep = depDesc[stateModule];
    var pickedFns = [];
    if (!moduleDep) return {
      pickedFns: pickedFns,
      setted: [],
      changed: []
    }; // NC noCompare

    var retKey_fn_ = moduleDep.retKey_fn_,
        stateKey_retKeys_ = moduleDep.stateKey_retKeys_,
        fnCount = moduleDep.fnCount;
    /** 在首次渲染前调用 */

    if (isBeforeMount) {
      var retKeys = okeys(retKey_fn_);

      var _setted = okeys(committedState);

      var _changed = _setted;

      if (type === 'computed') {
        return {
          pickedFns: retKeys.map(function (retKey) {
            return _wrapFn(retKey, retKey_fn_);
          }),
          setted: _setted,
          changed: _changed
        };
      }

      retKeys.forEach(function (retKey) {
        var _retKey_fn_$retKey2 = retKey_fn_[retKey],
            fn = _retKey_fn_$retKey2.fn,
            immediate = _retKey_fn_$retKey2.immediate,
            depKeys = _retKey_fn_$retKey2.depKeys;
        if (immediate) pickedFns.push({
          retKey: retKey,
          fn: fn,
          depKeys: depKeys
        });
      });
      return {
        pickedFns: pickedFns,
        setted: _setted,
        changed: _changed
      };
    } // 这些目标stateKey的值发生了变化


    var _differStateKeys = differStateKeys(oldState, committedState),
        setted = _differStateKeys.setted,
        changed = _differStateKeys.changed;

    if (setted.length === 0) {
      return {
        pickedFns: pickedFns
      };
    } //用setted + changed + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns


    var cacheKey = setted.join(',') + '|' + changed.join(',') + '|' + stateModule; // 要求用户必须在setup里静态的定义完computed & watch，动态的调用computed & watch的回调因为缓存原因不会被触发

    var tmpNode = cacheArea_pickedRetKeys_[cate][type];
    var cachePool = cUkey ? safeGetObjectFromObject(tmpNode, cUkey) : tmpNode;
    var cachedPickedRetKeys = cachePool[cacheKey];

    if (cachedPickedRetKeys) {
      return {
        pickedFns: cachedPickedRetKeys.map(function (retKey) {
          return _wrapFn(retKey, retKey_fn_);
        }),
        setted: setted,
        changed: changed
      };
    }

    _pickFn(pickedFns, setted, changed, retKey_fn_, stateKey_retKeys_, fnCount);

    cachePool[cacheKey] = pickedFns.map(function (v) {
      return v.retKey;
    });
    return {
      pickedFns: pickedFns,
      setted: setted,
      changed: changed
    };
  }

  function _pickFn(pickedFns, settedStateKeys, changedStateKeys, retKey_fn_, stateKey_retKeys_, fnCount) {
    if (settedStateKeys.length === 0) return; // 把*的函数先全部挑出来, 有key的值发生变化了或者有设值行为

    var starRetKeys = stateKey_retKeys_['*'];

    if (starRetKeys) {
      var isKeyValChanged = changedStateKeys.length > 0;
      starRetKeys.forEach(function (retKey) {
        var _retKey_fn_$retKey3 = retKey_fn_[retKey],
            fn = _retKey_fn_$retKey3.fn,
            compare = _retKey_fn_$retKey3.compare,
            depKeys = _retKey_fn_$retKey3.depKeys;
        var toPush = {
          retKey: retKey,
          fn: fn,
          depKeys: depKeys
        };

        if (compare) {
          if (isKeyValChanged) pickedFns.push(toPush);
          return;
        }

        pickedFns.push(toPush);
      });
    } // 还没有挑完，再遍历settedStateKeys, 挑选出剩余的目标fn


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
                  depKeys = _retKey_fn_$retKey4.depKeys;
              var canPick = true;

              if (compare && !changedStateKeys.includes(stateKey)) {
                canPick = false;
              }

              if (canPick) {
                retKey_picked_[retKey] = true;
                pickedFns.push({
                  retKey: retKey,
                  fn: fn,
                  depKeys: depKeys
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
  }

  var _computedValue2, _reducer;
  var refs = {};

  var setStateByModule = function setStateByModule(module, committedState, refCtx) {
    var moduleState = _getState(module);

    var prevModuleState = _getPrevState(module);

    var moduleComputedValue = _computedValue[module];
    var rootComputedDep = computed.getRootComputedDep();

    var _pickDepFns = pickDepFns(false, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState),
        cFns = _pickDepFns.pickedFns,
        setted = _pickDepFns.setted,
        changed = _pickDepFns.changed;

    var refModule = refCtx ? refCtx.module : null;
    var newState = Object.assign({}, moduleState, committedState);
    cFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        setted: setted,
        changed: changed,
        stateModule: module,
        refModule: refModule,
        oldState: moduleState,
        committedState: committedState,
        refCtx: refCtx
      };
      var fistDepKey = depKeys[0];
      var computedValue;

      if (depKeys.length === 1 && fistDepKey !== '*') {
        computedValue = fn(committedState[fistDepKey], moduleState[fistDepKey], fnCtx);
      } else {
        computedValue = fn(newState, moduleState, fnCtx);
      }

      moduleComputedValue[retKey] = computedValue;
    });
    var rootWatchDep = watch.getRootWatchDep();

    var _pickDepFns2 = pickDepFns(false, CATE_MODULE, 'watch', rootWatchDep, module, moduleState, committedState),
        wFns = _pickDepFns2.pickedFns,
        ws = _pickDepFns2.setted,
        wc = _pickDepFns2.changed;

    wFns.forEach(function (_ref2) {
      var retKey = _ref2.retKey,
          fn = _ref2.fn,
          depKeys = _ref2.depKeys;
      var fnCtx = {
        retKey: retKey,
        setted: ws,
        changed: wc,
        stateModule: module,
        refModule: refModule,
        oldState: moduleState,
        committedState: committedState,
        refCtx: refCtx
      };
      var firstDepKey = depKeys[0];

      if (depKeys.length === 1 && firstDepKey !== '*') {
        fn(committedState[firstDepKey], moduleState[firstDepKey], fnCtx);
      } else {
        fn(newState, moduleState, fnCtx);
      }
    });
    Object.keys(committedState).forEach(function (key) {
      /** setStateByModuleAndKey */
      prevModuleState[key] = moduleState[key]; // const fnCtx = { key, module, moduleState, committedState };

      moduleState[key] = committedState[key];
    });
  };

  var _getState = function getState(module) {
    return _state[module];
  };

  var _getPrevState = function getPrevState(module) {
    return _prevState[module];
  };

  var _computedValue = (_computedValue2 = {}, _computedValue2[MODULE_GLOBAL] = {}, _computedValue2[MODULE_DEFAULT] = {}, _computedValue2[MODULE_CC] = {}, _computedValue2);

  var _computedDep = {};
  var _computedRaw = {};
  var computed = {
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

  function hotReloadWarning(err) {
    var message = err.message || err;
    var st = 'color:green;border:1px solid green';
    console.log("%c error detected " + message + ", cc found app is maybe running in hot reload mode, so cc will silent this error...", st);
    console.log("%c but if this is not as your expectation ,maybe you can reload your whole app to avoid this error message", st);
  }
  /** ccContext section */


  var _state = {};
  var _prevState = {};
  var ccContext = {
    isHotReloadMode: function isHotReloadMode() {
      if (ccContext.isHot) return true;
      var result = false;

      if (window) {
        console.log("%c[[isHotReloadMode]] window.name:" + window.name, 'color:green;border:1px solid green');

        if (window.webpackHotUpdate || window.name === 'previewFrame' //for stackblitz
        || window.__SANDBOX_DATA__ // for codesandbox
        || window.BrowserFS // for codesandbox
        ) {
            result = true;
          }
      }

      return result;
    },
    throwCcHmrError: function throwCcHmrError(err) {
      if (ccContext.isHotReloadMode()) {
        hotReloadWarning(err);
      } else throw err;
    },
    computedCompare: true,
    watchCompare: true,
    watchImmediate: false,
    isDebug: false,
    // if isStrict is true, every error will be throw out instead of console.error, 
    // but this may crash your app, make sure you have a nice error handling way,
    // like componentDidCatch in react 16.*
    isStrict: false,
    returnRootState: false,
    isCcAlreadyStartup: false,
    //  cc allow multi react class register to a module by default, but if want to control some module 
    //  to only allow register one react class, flag the module name as true in this option object
    //  example:  {fooModule: true, barModule:true}
    moduleSingleClass: {},
    moduleName_ccClassKeys_: {},
    // 映射好模块的状态所有key并缓存住，用于提高性能
    moduleName_stateKeys_: {},
    // 记录某个模块作为其他被哪些ccClass连接
    connectedModuleName_ccClassKeys_: {},

    /**
      ccClassContext:{
        module,
        ccClassKey,
        // renderKey机制影响的类范围，默认只影响调用者所属的类，如果有别的类观察了同一个模块的某个key，这个类的实例是否触发渲染不受renderKey影响
        // 为 * 表示影响所有的类，即其他类实例都受renderKey机制影响。
        renderKeyClasses, 
        originalWatchedKeys,
        watchedKeys,
        ccKeys: [],
        connectedState: {},
        connectedModuleKeyMapping: null,
        connectedModule:{},//记录当前cc类连接到了其他哪些模块
      }
    */
    ccClassKey_ccClassContext_: {},
    // globalStateKeys is maintained by cc automatically,
    // when user call cc.setGlobalState, or ccInstance.setGlobalState,
    // commit state will be checked strictly by cc with globalStateKeys,
    // all the keys of commit state must been included in globalStateKeys
    globalStateKeys: [],
    //store里的setState行为会自动触发模块级别的computed、watch函数
    store: {
      appendState: function appendState(module, state) {
        var moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;
        var stateKeys = safeGetArrayFromObject(moduleName_stateKeys_, module);
        okeys(state).forEach(function (k) {
          if (!stateKeys.includes(k)) {
            stateKeys.push(k);
          }
        });
        ccContext.store.setState(module, state);
      },
      _state: _state,
      _prevState: _prevState,
      //辅助CcFragment defineEffect之用
      getState: function getState(module) {
        if (module) return _getState(module);else return _state;
      },
      getPrevState: function getPrevState(module) {
        if (module) return _getPrevState(module);else return _prevState;
      },
      setState: function setState(module, partialSharedState, refCtx) {
        setStateByModule(module, partialSharedState, refCtx);
      },
      setGlobalState: function setGlobalState(partialGlobalState) {
        setStateByModule(MODULE_GLOBAL, partialGlobalState);
      },
      getGlobalState: function getGlobalState() {
        return _state[MODULE_GLOBAL];
      },
      //对state直接赋值，cc启动的时候某些场景需要调用此函数
      initStateDangerously: function initStateDangerously(module, state) {
        _state[module] = state;
      }
    },
    reducer: {
      _reducer: (_reducer = {}, _reducer[MODULE_GLOBAL] = {}, _reducer[MODULE_CC] = {}, _reducer),
      _reducerCaller: {},
      _lazyReducerCaller: {},
      // _reducerRefCaller: {},//为实例准备的reducer caller
      // _lazyReducerRefCaller: {},//为实例准备的lazy reducer caller
      _reducerFnName_fullFnNames_: {},
      _reducerModule_fnNames_: {}
    },
    computed: computed,
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
    ccUkey_ref_: refs,
    //  key:eventName,  value: Array<{ccKey, identity,  handlerKey}>
    event_handlers_: {},
    ccUKey_handlerKeys_: {},
    // to avoid memory leak, the handlerItem of event_handlers_ just store handlerKey, 
    // it is a ref that towards ccUniqueKeyEvent_handler_'s key
    // when component unmounted, it's handler will been removed
    handlerKey_handler_: {},
    renderKey_ccUkeys_: {},
    refs: refs,
    info: {
      startupTime: Date.now(),
      version: '1.5.39',
      author: 'fantasticsoul',
      emails: ['624313307@qq.com', 'zhongzhengkai@gmail.com'],
      tag: 'destiny'
    },
    // fragment association
    fragmentNameCount: 0,
    featureStr_classKey_: {},
    userClassKey_featureStr_: {},
    errorHandler: null,
    middlewares: [],
    plugins: []
  };
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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var catchCcError = (function (err) {
    if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
  });

  var id = 0;
  var chainId_moduleStateMap_ = {};
  var chainId_isExited_ = {};
  var chainId_isLazy_ = {};
  function getChainId() {
    id++;
    return id;
  }
  function setChainState(chainId, targetModule, partialState) {
    if (partialState) {
      var moduleStateMap = chainId_moduleStateMap_[chainId];
      if (!moduleStateMap) moduleStateMap = chainId_moduleStateMap_[chainId] = {};
      var state = moduleStateMap[targetModule];

      if (!state) {
        moduleStateMap[targetModule] = partialState;
      } else {
        var mergedState = Object.assign(state, partialState);
        moduleStateMap[targetModule] = mergedState;
      }
    }
  }
  function setAndGetChainStateList(chainId, targetModule, partialState) {
    setChainState(chainId, targetModule, partialState);
    return getChainStateList(chainId);
  }
  function getChainStateList(chainId) {
    var moduleStateMap = chainId_moduleStateMap_[chainId];
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
  function isChainExited(chainId) {
    return chainId_isExited_[chainId] === true;
  }
  function setChainIdLazy(chainId) {
    chainId_isLazy_[chainId] = true;
  }
  function isChainIdLazy(chainId) {
    return chainId_isLazy_[chainId] === true;
  }

  var sigs = [SIG_FN_START, SIG_FN_END, SIG_FN_QUIT, SIG_FN_ERR, SIG_MODULE_CONFIGURED, SIG_STATE_CHANGED];
  var sig_cbs_ = {};
  sigs.forEach(function (sig) {
    return sig_cbs_[sig] = [];
  });
  function clearCbs() {
    sigs.forEach(function (sig) {
      return sig_cbs_[sig].length = 0;
    });
  }
  function send(sig, payload) {
    var cbs = sig_cbs_[sig];
    cbs.forEach(function (cb) {
      cb({
        sig: sig,
        payload: payload
      });
    });
  }
  function on(sigOrSigs, cb) {
    function pushCb(sig, cb) {
      var cbs = sig_cbs_[sig];

      if (!cbs) {
        console.warn("invalid sig[" + sig + "]");
        return;
      }

      cbs.push(cb);
    }

    if (Array.isArray(sigOrSigs)) {
      sigOrSigs.forEach(function (sig) {
        pushCb(sig, cb);
      });
    } else {
      pushCb(sigOrSigs, cb);
    }
  }

  var isModuleNameCcLike$1 = isModuleNameCcLike,
      isModuleNameValid$1 = isModuleNameValid,
      vbi = verboseInfo,
      makeError$1 = makeError;
  /** 检查模块名，名字合法，就算检查通过 */

  function checkModuleNameBasically(moduleName) {
    if (!isModuleNameValid$1(moduleName)) {
      throw makeError$1(ERR.CC_MODULE_NAME_INVALID, vbi(" module[" + moduleName + "] is invalid!"));
    }

    if (isModuleNameCcLike$1(moduleName)) {
      throw makeError$1(ERR.CC_MODULE_KEY_CC_FOUND);
    }
  }
  function checkReducerModuleName(moduleName) {
    var _reducer = ccContext.reducer._reducer;
    checkModuleNameBasically(moduleName);

    if (moduleName !== MODULE_GLOBAL) {
      if (_reducer[moduleName]) {
        throw makeError$1(ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, vbi("module[" + moduleName + "]"));
      }
    }
  }
  /**
   * 检查模块名, moduleStateMustNotDefinedInStore 默认为true，表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
   * 如果设置为false，表示【module名字合法】且【对应的moduleState存在】，才算检查通过
   * @param {string} moduleName 
   * @param {boolean} moduleStateMustNotDefinedInStore 
   */

  function checkModuleName(moduleName, moduleStateMustNotDefinedInStore, vbiMsg) {
    if (moduleStateMustNotDefinedInStore === void 0) {
      moduleStateMustNotDefinedInStore = true;
    }

    if (vbiMsg === void 0) {
      vbiMsg = '';
    }

    var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

    var _state = ccContext.store._state;
    checkModuleNameBasically(moduleName);

    if (moduleName !== MODULE_GLOBAL) {
      if (moduleStateMustNotDefinedInStore === true) {
        //要求模块状态应该不存在
        if (isObjectNotNull(_state[moduleName])) {
          //但是却存在了
          throw makeError$1(ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
        }
      } else {
        //要求模块状态应该存在
        if (!_state[moduleName]) {
          //实际上却不存在
          throw makeError$1(ERR.CC_MODULE_NAME_HAS_NO_STATE, vbi(_vbiMsg));
        }
      }
    }
  }
  function checkModuleState(moduleState, moduleName) {
    if (!isModuleStateValid(moduleState)) {
      throw makeError(ERR.CC_STORE_STATE_INVALID, vbi("module[" + moduleName + "]'s state is invalid!"));
    }
  }
  function checkModuleNameAndState(moduleName, moduleState, moduleStateMustNotDefinedInStore) {
    checkModuleName(moduleName, moduleStateMustNotDefinedInStore);
    checkModuleState(moduleState, moduleName);
  }
  function checkStoredKeys(moduleStateKeys, storedKeys) {
    var isSKeysArr = Array.isArray(storedKeys);

    if (!isSKeysArr && storedKeys !== '*') {
      throw new Error("storedKeys type err, it is must be an array or string *");
    }

    if (isSKeysArr) {
      storedKeys.forEach(function (sKey) {
        if (moduleStateKeys.includes(sKey)) {
          throw new Error("storedKeys key err, the key[" + sKey + "] can not be a module state key!");
        }
      });
    }
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

  function extractStateByKeys (state, stateKeys, returnNullIfEmpty) {
    if (returnNullIfEmpty === void 0) {
      returnNullIfEmpty = false;
    }

    var partialState = {};

    if (!isPlainJsonObject(state)) {
      return {
        partialState: returnNullIfEmpty ? null : partialState,
        isStateEmpty: true
      };
    }

    var isStateEmpty = true;
    stateKeys.forEach(function (key) {
      var value = state[key];

      if (value !== undefined) {
        partialState[key] = value;
        isStateEmpty = false;
      }
    });
    return {
      partialState: partialState,
      isStateEmpty: isStateEmpty
    };
  }

  function watchKeyForRef (refCtx, stateModule, oldState, committedState, isBeforeMount) {
    if (!refCtx.hasWatchFn) return true;
    var watchDep = refCtx.watchDep,
        refModule = refCtx.module,
        ccUniqueKey = refCtx.ccUniqueKey;
    var shouldCurrentRefUpdate = true; // 触发有stateKey依赖列表相关的watch函数

    var _pickDepFns = pickDepFns(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey),
        pickedFns = _pickDepFns.pickedFns,
        setted = _pickDepFns.setted,
        changed = _pickDepFns.changed;

    if (pickedFns.length) {
      var newState = Object.assign({}, oldState, committedState);
      pickedFns.forEach(function (_ref) {
        var fn = _ref.fn,
            retKey = _ref.retKey,
            depKeys = _ref.depKeys;
        var fnCtx = {
          retKey: retKey,
          setted: setted,
          changed: changed,
          stateModule: stateModule,
          refModule: refModule,
          oldState: oldState,
          committedState: committedState,
          refCtx: refCtx
        };
        var firstDepKey = depKeys[0];
        var ret;

        if (depKeys.length === 1 && firstDepKey !== '*') {
          ret = fn(committedState[firstDepKey], oldState[firstDepKey], fnCtx, refCtx);
        } else {
          ret = fn(newState, oldState, fnCtx);
        } //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新


        if (ret === false) shouldCurrentRefUpdate = false;
      });
    }

    return shouldCurrentRefUpdate;
  }

  //CcFragment实例调用会提供callerCtx
  // stateModule表示状态所属的模块

  function computeValueForRef (refCtx, stateModule, oldState, committedState, isBeforeMount) {
    if (isBeforeMount === void 0) {
      isBeforeMount = false;
    }

    if (!refCtx.hasComputedFn) return;
    var computedDep = refCtx.computedDep,
        refModule = refCtx.module,
        refComputed = refCtx.refComputed,
        refConnectedComputed = refCtx.refConnectedComputed,
        ccUniqueKey = refCtx.ccUniqueKey; // const moduleState = ccContext.store.getState(stateModule);
    // 触发依赖stateKeys相关的computed函数

    var _pickDepFns = pickDepFns(isBeforeMount, 'ref', 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey),
        pickedFns = _pickDepFns.pickedFns,
        setted = _pickDepFns.setted,
        changed = _pickDepFns.changed;

    if (pickedFns.length) {
      var newState = Object.assign({}, oldState, committedState);
      pickedFns.forEach(function (_ref) {
        var fn = _ref.fn,
            retKey = _ref.retKey,
            depKeys = _ref.depKeys;
        var fnCtx = {
          retKey: retKey,
          setted: setted,
          changed: changed,
          stateModule: stateModule,
          refModule: refModule,
          oldState: oldState,
          committedState: committedState,
          refCtx: refCtx
        };
        var firstDepKey = depKeys[0];
        var computedValue;

        if (depKeys.length === 1 && firstDepKey !== '*') {
          computedValue = fn(committedState[firstDepKey], oldState[firstDepKey], fnCtx, refCtx);
        } else {
          computedValue = fn(newState, oldState, fnCtx);
        }

        if (refModule === stateModule) {
          refComputed[retKey] = computedValue;
        } // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果


        var targetComputed = refConnectedComputed[stateModule];

        if (targetComputed) {
          targetComputed[retKey] = computedValue;
        }
      });
    }
  }

  var isPlainJsonObject$1 = isPlainJsonObject,
      justWarning$1 = justWarning,
      isObjectNotNull$1 = isObjectNotNull,
      computeFeature$1 = computeFeature,
      okeys$1 = okeys,
      removeArrElements$1 = removeArrElements;
  var STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
      STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1 = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      FORCE_UPDATE$1 = FORCE_UPDATE,
      SET_STATE$1 = SET_STATE,
      SET_MODULE_STATE$1 = SET_MODULE_STATE,
      INVOKE$1 = INVOKE,
      SYNC$1 = SYNC,
      SIG_STATE_CHANGED$1 = SIG_STATE_CHANGED,
      RENDER_NO_OP$1 = RENDER_NO_OP,
      RENDER_BY_KEY$1 = RENDER_BY_KEY,
      RENDER_BY_STATE$1 = RENDER_BY_STATE;
  var _ccContext$store = ccContext.store,
      setState = _ccContext$store.setState,
      getPrevState = _ccContext$store.getPrevState,
      middlewares = ccContext.middlewares,
      moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
      ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
      connectedModuleName_ccClassKeys_ = ccContext.connectedModuleName_ccClassKeys_,
      refStore = ccContext.refStore,
      moduleName_stateKeys_ = ccContext.moduleName_stateKeys_,
      ccUkey_ref_ = ccContext.ccUkey_ref_,
      renderKey_ccUkeys_ = ccContext.renderKey_ccUkeys_; //触发修改状态的实例所属模块和目标模块不一致的时候，stateFor是STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE

  function getStateFor(targetModule, refModule) {
    return targetModule === refModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE$1;
  }

  function getActionType(calledBy, type) {
    if ([FORCE_UPDATE$1, SET_STATE$1, SET_MODULE_STATE$1, INVOKE$1, SYNC$1].includes(calledBy)) {
      return "ccApi/" + calledBy;
    } else {
      return "dispatch/" + type;
    }
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
            middlewareFn(passToMiddleware, next);
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

  function changeRefState (state, _temp, targetRef) {
    var _ref = _temp === void 0 ? {} : _temp,
        module = _ref.module,
        _ref$skipMiddleware = _ref.skipMiddleware,
        skipMiddleware = _ref$skipMiddleware === void 0 ? false : _ref$skipMiddleware,
        reactCallback = _ref.reactCallback,
        type = _ref.type,
        reducerModule = _ref.reducerModule,
        _ref$calledBy = _ref.calledBy,
        calledBy = _ref$calledBy === void 0 ? SET_STATE$1 : _ref$calledBy,
        _ref$fnName = _ref.fnName,
        fnName = _ref$fnName === void 0 ? '' : _ref$fnName,
        _ref$renderKey = _ref.renderKey,
        renderKey = _ref$renderKey === void 0 ? '' : _ref$renderKey,
        _ref$delay = _ref.delay,
        delay = _ref$delay === void 0 ? -1 : _ref$delay;

    if (!isPlainJsonObject$1(state)) {
      justWarning$1("your committed state is not a plain json object!");
      return;
    }

    var _targetRef$ctx = targetRef.ctx,
        refModule = _targetRef$ctx.module,
        ccUniqueKey = _targetRef$ctx.ccUniqueKey,
        ccKey = _targetRef$ctx.ccKey;
    var stateFor = getStateFor(module, refModule);
    var passToMiddleware = {
      calledBy: calledBy,
      type: type,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      state: state,
      refModule: refModule,
      module: module,
      reducerModule: reducerModule,
      fnName: fnName
    };
    callMiddlewares(skipMiddleware, passToMiddleware, function () {
      //在triggerReactSetState之前把状态存储到store，
      //防止属于同一个模块的父组件套子组件渲染时，父组件修改了state，子组件初次挂载是不能第一时间拿到state
      var passedCtx = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 ? targetRef.ctx : null;
      var sharedState = syncCommittedStateToStore(module, state, passedCtx);
      send(SIG_STATE_CHANGED$1, {
        committedState: state,
        sharedState: sharedState,
        module: module,
        type: getActionType(calledBy, type),
        ccUniqueKey: ccUniqueKey,
        renderKey: renderKey
      }); // source ref will receive the whole committed state 

      var renderType = triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback);
      triggerBroadcastState(renderType, targetRef, sharedState, stateFor, module, renderKey, delay);
    });
  }

  function triggerReactSetState(targetRef, renderKey, calledBy, state, stateFor, reactCallback) {
    var refState = targetRef.state,
        refCtx = targetRef.ctx;

    if (targetRef.__$$isUnmounted === true || stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1 || //确保forceUpdate能够刷新cc实例，因为state可能是{}，此时用户调用forceUpdate也要触发render
    calledBy !== FORCE_UPDATE$1 && !isObjectNotNull$1(state)) {
      if (reactCallback) reactCallback(refState);
      return RENDER_NO_OP$1;
    }

    var stateModule = refCtx.module,
        storedKeys = refCtx.storedKeys,
        ccOption = refCtx.ccOption,
        ccUniqueKey = refCtx.ccUniqueKey;
    var renderType = RENDER_BY_STATE$1;

    if (renderKey) {
      //if user specify renderKey
      renderType = RENDER_BY_KEY$1;

      if (ccOption.renderKey !== renderKey) {
        // current instance can been rendered only if current instance's ccKey equal renderKey
        return RENDER_NO_OP$1;
      }
    }

    if (storedKeys.length > 0) {
      var _extractStateByKeys = extractStateByKeys(state, storedKeys),
          partialState = _extractStateByKeys.partialState,
          isStateEmpty = _extractStateByKeys.isStateEmpty;

      if (!isStateEmpty) {
        if (ccOption.persistStoredKeys === true) {
          var _extractStateByKeys2 = extractStateByKeys(refState, storedKeys),
              entireStoredState = _extractStateByKeys2.partialState;

          var currentStoredState = Object.assign({}, entireStoredState, partialState);
          localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
        }

        refStore.setState(ccUniqueKey, partialState);
      }
    }

    computeValueForRef(refCtx, stateModule, refState, state);
    var shouldCurrentRefUpdate = watchKeyForRef(refCtx, stateModule, refState, state);

    refCtx.__$$ccSetState(state, reactCallback, shouldCurrentRefUpdate);

    return renderType;
  }

  function syncCommittedStateToStore(moduleName, committedState, refCtx) {
    var stateKeys = moduleName_stateKeys_[moduleName];

    var _extractStateByKeys3 = extractStateByKeys(committedState, stateKeys),
        isPartialSharedStateEmpty = _extractStateByKeys3.isStateEmpty,
        partialState = _extractStateByKeys3.partialState; //!!! save state to store


    if (!isPartialSharedStateEmpty) {
      setState(moduleName, partialState, refCtx);
      return partialState;
    }

    return null;
  }

  function triggerBroadcastState(renderType, targetRef, sharedState, stateFor, moduleName, renderKey, delay) {
    var startBroadcastState = function startBroadcastState() {
      broadcastState(renderType, targetRef, sharedState, stateFor, moduleName, renderKey);
    };

    if (delay > 0) {
      var feature = computeFeature$1(targetRef.ctx.ccUniqueKey, sharedState);
      runLater(startBroadcastState, feature, delay);
    } else {
      startBroadcastState();
    }
  }

  function updateRefs(ccUkeys, moduleName, partialSharedState) {
    ccUkeys.forEach(function (ukey) {
      var ref = ccUkey_ref_[ukey];

      if (ref.ctx.module === moduleName) {
        //这里不对各个ukey对应的class查其watchedKeys然后提取partialSharedState了，此时renderKey优先级高于watchedKeys
        triggerReactSetState(ref, null, 'broadcastState', partialSharedState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1);
      }
    });
  }

  function broadcastState(renderType, targetRef, partialSharedState, stateFor, moduleName, renderKey) {
    if (!partialSharedState) {
      // null
      return;
    }

    var _targetRef$ctx2 = targetRef.ctx,
        currentCcUkey = _targetRef$ctx2.ccUniqueKey,
        ccClassKey = _targetRef$ctx2.ccClassKey;
    var targetClassContext = ccClassKey_ccClassContext_[ccClassKey];
    var renderKeyClasses = targetClassContext.renderKeyClasses;

    if (renderKey) {
      // 如果renderKey是ukey（此时renderType是RENDER_BY_KEY）, 则不会进入updateRefs逻辑
      if (renderType === RENDER_BY_KEY$1 && !ccUkey_ref_[renderKey] || renderType === RENDER_NO_OP$1) {
        // targetRef刚刚已被触发过渲染，这里排除掉currentCcUkey
        var ccUkeys = renderKey_ccUkeys_[renderKey].slice();
        var ukeyIndex = ccUkeys.indexOf(currentCcUkey);
        if (ukeyIndex > -1) ccUkeys.splice(ukeyIndex, 1);
        updateRefs(ccUkeys, moduleName, partialSharedState);
      }
    } // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered __$$ccSetState
    // so flag ignoreCurrentCcUkey as true;


    var ignoreCurrentCcUkey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1; // these ccClass are watching the same module's state

    var ccClassKeys = moduleName_ccClassKeys_[moduleName] || [];

    if (renderType === RENDER_BY_KEY$1) {
      //基于renderKey触发渲染
      if (renderKeyClasses === '*') {
        //要影响所属模块的所有类
        ccClassKeys = []; //这里设置为空数据
      } else {
        ccClassKeys = removeArrElements$1(ccClassKeys, renderKeyClasses); //移除掉指定的类
      }
    }

    var keysLen = ccClassKeys.length;

    var _loop = function _loop(i) {
      var ccClassKey = ccClassKeys[i];
      var classContext = ccClassKey_ccClassContext_[ccClassKey];
      var ccKeys = classContext.ccKeys,
          watchedKeys = classContext.watchedKeys,
          originalWatchedKeys = classContext.originalWatchedKeys;
      if (ccKeys.length === 0) return "continue";
      if (watchedKeys.length === 0) return "continue";
      var sharedStateForCurrentCcClass = void 0;

      if (originalWatchedKeys === '*') {
        sharedStateForCurrentCcClass = partialSharedState;
      } else {
        var _extractStateByKeys4 = extractStateByKeys(partialSharedState, watchedKeys, true),
            partialState = _extractStateByKeys4.partialState,
            isStateEmpty = _extractStateByKeys4.isStateEmpty;

        if (isStateEmpty) return "continue";
        sharedStateForCurrentCcClass = partialState;
      }

      ccKeys.forEach(function (ccKey) {
        if (ccKey === currentCcUkey && ignoreCurrentCcUkey) return;
        var ref = ccUkey_ref_[ccKey];

        if (ref) {
          // 这里的calledBy直接用'broadcastState'，仅供concent内部运行时用，同时这ignoreCurrentCcUkey里也不会发送信号给插件
          triggerReactSetState(ref, null, 'broadcastState', sharedStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY$1);
        }
      });
    };

    for (var i = 0; i < keysLen; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    }

    broadcastConnectedState(moduleName, partialSharedState);
  }

  function broadcastConnectedState(commitModule, sharedState) {
    var sharedStateKeys = okeys$1(sharedState); //提前把sharedStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

    var ccClassKeys = connectedModuleName_ccClassKeys_[commitModule] || [];
    ccClassKeys.forEach(function (ccClassKey) {
      var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, sharedState, sharedStateKeys);
    });
  }

  function updateConnectedState(targetClassContext, targetModule, sharedState, sharedStateKeys) {
    var connectedModuleKeyMapping = targetClassContext.connectedModuleKeyMapping,
        connectedModule = targetClassContext.connectedModule;

    if (connectedModule[targetModule] === 1) {
      var ccKeys = targetClassContext.ccKeys;
      var isSetConnectedStateTriggered = false;
      var len = sharedStateKeys.length;

      for (var i = 0; i < len; i++) {
        var moduledStateKey = targetModule + "/" + sharedStateKeys[i];

        if (connectedModuleKeyMapping[moduledStateKey]) {
          isSetConnectedStateTriggered = true;
          break; //只要感知到有一个key发生变化，就可以跳出循环了，
          //因为connectedState指向的是store里state的引用，更新动作在store里修改时就已完成
        }
      } //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍


      if (isSetConnectedStateTriggered === true) {
        var prevModuleState = getPrevState(targetModule);
        ccKeys.forEach(function (ccUniKey) {
          var ref = ccUkey_ref_[ccUniKey];

          if (ref && ref.__$$isUnmounted !== true) {
            var refCtx = ref.ctx;
            computeValueForRef(refCtx, targetModule, prevModuleState, sharedState);
            var shouldCurrentRefUpdate = watchKeyForRef(refCtx, targetModule, prevModuleState, sharedState);
            if (shouldCurrentRefUpdate) refCtx.__$$ccForceUpdate();
          }
        });
      }
    }
  }

  function strictWarning(err) {
    if (ccContext.isStrict) {
      throw err;
    }

    console.error(' ------------ CC WARNING ------------');
    console.error(err);
  }

  /****
   * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
   * pick one ccInstance ref randomly
   */

  function pickOneRef (module, mustBelongToModule) {
    if (mustBelongToModule === void 0) {
      mustBelongToModule = false;
    }

    var ccUkey_ref_ = ccContext.ccUkey_ref_,
        moduleName_ccClassKeys_ = ccContext.moduleName_ccClassKeys_,
        ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_;
    var ccKeys = [];

    if (module) {
      if (ccContext.store._state[module]) {
        var ccClassKeys = moduleName_ccClassKeys_[module];

        if (ccClassKeys && ccClassKeys.length !== 0) {
          var oneCcClassKey = ccClassKeys[0];
          var ccClassContext = ccClassKey_ccClassContext_[oneCcClassKey];

          if (!ccClassContext) {
            throw new Error("no ccClassContext found for ccClassKey " + oneCcClassKey + "!");
          }

          ccKeys = ccClassContext.ccKeys;
        }
      } else {
        throw new Error("module[" + module + "] is not declared in store");
      }

      if (module === MODULE_DEFAULT) {
        ccKeys = ccKeys.filter(function (key) {
          return !key.startsWith(CC_FRAGMENT_PREFIX);
        });
      }

      if (ccKeys.length === 0) {
        if (mustBelongToModule === false) ccKeys = [CC_DISPATCHER];else {
          var ignoreIt = "if this message doesn't matter, you can ignore it";
          throw new Error("[[pickOneRef]]: no ref found for module[" + module + "]!," + ignoreIt);
        }
      }
    } else {
      ccKeys = [CC_DISPATCHER];
    }

    var oneRef = ccUkey_ref_[ccKeys[0]];

    if (!oneRef) {
      throw new Error('cc found no ref!');
    }

    return oneRef;
  }

  function setState$1 (module, state, renderKey, delay, skipMiddleware) {
    if (delay === void 0) {
      delay = -1;
    }

    try {
      var ref = pickOneRef(module);
      var option = {
        ccKey: '[[top api:setState]]',
        module: module,
        renderKey: renderKey,
        delay: delay,
        skipMiddleware: skipMiddleware
      };
      ref.ctx.changeState(state, option);
    } catch (err) {
      strictWarning(err);
    }
  }

  var ccStoreSetState = ccContext.store.setState;
  var ccGlobalStateKeys = ccContext.globalStateKeys;
  var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";
  function getAndStoreValidGlobalState (globalState, tipModule, tipCcClassKey) {
    if (tipModule === void 0) {
      tipModule = '';
    }

    if (tipCcClassKey === void 0) {
      tipCcClassKey = '';
    }

    var _extractStateByKeys = extractStateByKeys(globalState, ccGlobalStateKeys),
        validGlobalState = _extractStateByKeys.partialState,
        isStateEmpty = _extractStateByKeys.isStateEmpty;

    var vKeys = okeys(validGlobalState);
    var allKeys = okeys(globalState);

    if (vKeys.length < allKeys.length) {
      //??? need strict?
      var invalidKeys = allKeys.filter(function (k) {
        return !vKeys.includes(k);
      });
      justWarning(tip + ',invalid keys: ' + invalidKeys.join(',') + ', make sure the keys is invalid and their values are not undefined');
      console.log(globalState);
      if (tipModule) justWarning('module is ' + tipModule);
      if (tipCcClassKey) justWarning('ccClassKey is ' + tipCcClassKey);
    }

    ccStoreSetState(MODULE_GLOBAL, validGlobalState);
    return {
      partialState: validGlobalState,
      isStateEmpty: isStateEmpty
    };
  }

  // import hoistNonReactStatic from 'hoist-non-react-statics';
  var verboseInfo$1 = verboseInfo,
      makeError$2 = makeError,
      justWarning$2 = justWarning;
  var _ccContext$store$1 = ccContext.store,
      getState = _ccContext$store$1.getState,
      storeSetState = _ccContext$store$1.setState,
      _reducer$1 = ccContext.reducer._reducer,
      _computedValue$1 = ccContext.computed._computedValue,
      ccClassKey_ccClassContext_$1 = ccContext.ccClassKey_ccClassContext_;
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
    return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
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
  } // any error in this function will not been throwed, cc just warning, 


  function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
    var targetCb = reactCallback;

    if (checkStoreModule(inputModule, false)) {
      if (inputModule !== currentModule) {
        if (reactCallback) {
          justWarning$2(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi$1(paramCallBackShouldNotSupply(inputModule, currentModule))));
          targetCb = null; //let user's reactCallback has no chance to be triggered
        }
      }

      cb(null, targetCb);
    } else {
      cb(new Error("inputModule:" + inputModule + " invalid"), null);
    }
  }

  function handleCcFnError(err, __innerCb) {
    if (err) {
      if (__innerCb) __innerCb(err);else {
        justWarning$2(err);
        if (ccContext.errorHandler) ccContext.errorHandler(err);
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
    var targetRef = option.targetRef,
        delay = option.delay,
        renderKey = option.renderKey,
        calledBy = option.calledBy,
        module = option.module,
        chainId = option.chainId,
        oriChainId = option.oriChainId,
        chainId_depth_ = option.chainId_depth_;
    return __promisifiedInvokeWith(userLogicFn, {
      targetRef: targetRef,
      context: true,
      module: module,
      calledBy: calledBy,
      fnName: userLogicFn.name,
      delay: delay,
      renderKey: renderKey,
      chainId: chainId,
      oriChainId: oriChainId,
      chainId_depth_: chainId_depth_
    }, payload);
  }

  function makeCcSetStateHandler(ref, containerRef) {
    return function (state, cb, shouldCurrentRefUpdate) {
      var refCtx = ref.ctx;
      /** start update state */
      // let containerRefState = containerRef ? containerRef.state : null;
      // const refState = ref.state;
      // const refCtxState = refCtx.state;
      // //采用okeys写法，让用户结构出来的state总是指向同一个引用
      // okeys(state).forEach(k => {
      //   const val = state[k];
      //   refState[k] = val;
      //   refCtxState[k] = val;
      //   if (containerRefState) containerRefState[k] = val;//让代理模式下的容器组件state也总是保持最新的
      // });

      /** start update state */
      // 和react保持immutable的思路一致，强迫用户养成习惯，总是从ctx取最新的state,
      // 注意这里赋值也是取refCtx.state取做合并，因为频繁进入此函数时，ref.state可能还不是最新的

      var newFullState = Object.assign({}, refCtx.state, state);
      refCtx.state = newFullState;
      if (containerRef) containerRef.state = newFullState; // 只有Hook实例，才能直接更新ref.state

      if (refCtx.type === CC_HOOK_PREFIX) {
        ref.state = newFullState;
      }
      /** start update ui */


      if (shouldCurrentRefUpdate) {
        refCtx.renderCount += 1;
        refCtx.reactSetState(state, cb);
      } else {
        //对与class实例来说，视图虽然没有更新，但是state要合并进来，让下一次即将到来的更新里能拿到之前的状态
        //否则watch启用的return false优化会造成状态丢失
        if (refCtx.type !== CC_HOOK_PREFIX) {
          Object.assign(ref.state, state);
        }
      }
    };
  }
  function makeCcForceUpdateHandler(ref) {
    return function (cb) {
      var refCtx = ref.ctx;
      refCtx.renderCount += 1;
      refCtx.reactForceUpdate(cb);
    };
  } // last param: chainData

  function makeInvokeHandler(targetRef, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        chainId = _ref.chainId,
        oriChainId = _ref.oriChainId,
        isLazy = _ref.isLazy,
        _ref$chainId_depth_ = _ref.chainId_depth_,
        chainId_depth_ = _ref$chainId_depth_ === void 0 ? {} : _ref$chainId_depth_;

    return function (firstParam, payload, renderKey, delay) {
      var _getNewChainData = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
          _chainId = _getNewChainData._chainId,
          _oriChainId = _getNewChainData._oriChainId;

      var firstParamType = typeof firstParam;
      var option = {
        targetRef: targetRef,
        calledBy: INVOKE,
        module: targetRef.ctx.module,
        chainId: _chainId,
        oriChainId: _oriChainId,
        chainId_depth_: chainId_depth_,
        delay: delay,
        renderKey: renderKey
      };
      var err = new Error("param type error, correct usage: invoke(userFn:function, ...args:any[]) or invoke(option:[module:string, fn:function], ...args:any[])");

      if (firstParamType === 'function') {
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
    var targetRef = executionContext.targetRef;
    var _curStateModule = targetRef.ctx.module;
    var _executionContext$mod = executionContext.module,
        targetModule = _executionContext$mod === void 0 ? _curStateModule : _executionContext$mod,
        _executionContext$con = executionContext.context,
        context = _executionContext$con === void 0 ? false : _executionContext$con,
        cb = executionContext.cb,
        __innerCb = executionContext.__innerCb,
        type = executionContext.type,
        reducerModule = executionContext.reducerModule,
        calledBy = executionContext.calledBy,
        fnName = executionContext.fnName,
        _executionContext$del = executionContext.delay,
        delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
        renderKey = executionContext.renderKey,
        chainId = executionContext.chainId,
        oriChainId = executionContext.oriChainId,
        chainId_depth_ = executionContext.chainId_depth_;
    isStateModuleValid(targetModule, _curStateModule, cb, function (err, newCb) {
      if (err) return handleCcFnError(err, __innerCb);
      var moduleState = getState(targetModule);
      var reducerContext = {};
      var isSourceCall = false;

      if (context) {
        isSourceCall = chainId === oriChainId && chainId_depth_[chainId] === 1; //调用前先加1

        chainId_depth_[chainId] = chainId_depth_[chainId] + 1;

        var _dispatch = makeDispatchHandler(targetRef, false, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_);

        var lazyDispatch = makeDispatchHandler(targetRef, true, targetModule, reducerModule, renderKey, -1, chainId, oriChainId, chainId_depth_);
        var sourceClassContext = ccClassKey_ccClassContext_$1[targetRef.ctx.ccClassKey];
        reducerContext = {
          targetModule: targetModule,
          invoke: makeInvokeHandler(targetRef, {
            chainId: chainId,
            oriChainId: oriChainId,
            chainId_depth_: chainId_depth_
          }),
          //oriChainId, chainId_depth_ 一直携带下去，设置isLazy，会重新生成chainId
          lazyInvoke: makeInvokeHandler(targetRef, {
            isLazy: true,
            oriChainId: oriChainId,
            chainId_depth_: chainId_depth_
          }),
          dispatch: _dispatch,
          lazyDispatch: lazyDispatch,
          rootState: getState(),
          globalState: getState(MODULE_GLOBAL),
          //指的是目标模块的state
          moduleState: moduleState,
          //指的是目标模块的的moduleComputed
          moduleComputed: _computedValue$1[targetModule] || {},
          //!!!指的是调用源cc类的connectedState
          connectedState: sourceClassContext.connectedState,
          //!!!指的是调用源cc类的connectedComputed
          connectedComputed: sourceClassContext.connectedComputed,
          //利用dispatch调用自动生成的setState
          setState: function setState(state) {
            return _dispatch('setState', state);
          },
          //!!!指的是调用源cc类实例的ctx
          refCtx: targetRef.ctx // concent不鼓励用户在reducer使用ref相关数据书写业务逻辑，除非用户确保是同一个模块的实例触发调用该函数，
          // 因为不同调用方传递不同的refCtx值，会引起用户不注意的bug

        };
      }

      send(SIG_FN_START, {
        isSourceCall: isSourceCall,
        calledBy: calledBy,
        module: targetModule,
        chainId: chainId,
        fn: userLogicFn
      });
      co.wrap(userLogicFn)(payload, moduleState, reducerContext).then(function (partialState) {
        chainId_depth_[chainId] = chainId_depth_[chainId] - 1; //调用结束减1

        var curDepth = chainId_depth_[chainId];
        var commitStateList = [];
        send(SIG_FN_END, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        }); // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

        if (isChainIdLazy(chainId)) {
          //来自于惰性派发的调用
          if (curDepth > 1) {
            //某条链还在往下调用中，没有回到第一层，暂存状态，直到回到第一层才提交
            setChainState(chainId, targetModule, partialState);
          } else {
            // chainDepth === 1, 合并状态一次性提交到store并派发到组件实例
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

        commitStateList.forEach(function (v) {
          if (v.state) {
            changeRefState(v.state, {
              renderKey: renderKey,
              module: v.module,
              cb: newCb,
              type: type,
              reducerModule: reducerModule,
              calledBy: calledBy,
              fnName: fnName,
              delay: delay
            }, targetRef);
          }
        });
        if (__innerCb) __innerCb(null, partialState);
      })["catch"](function (err) {
        send(SIG_FN_ERR, {
          isSourceCall: isSourceCall,
          calledBy: calledBy,
          module: targetModule,
          chainId: chainId,
          fn: userLogicFn
        });
        handleCcFnError(err, __innerCb);
      });
    });
  }
  function dispatch(_temp2) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        targetRef = _ref2.targetRef,
        inputModule = _ref2.module,
        inputReducerModule = _ref2.reducerModule,
        renderKey = _ref2.renderKey,
        type = _ref2.type,
        payload = _ref2.payload,
        reactCallback = _ref2.cb,
        __innerCb = _ref2.__innerCb,
        _ref2$delay = _ref2.delay,
        delay = _ref2$delay === void 0 ? -1 : _ref2$delay,
        chainId = _ref2.chainId,
        oriChainId = _ref2.oriChainId,
        chainId_depth_ = _ref2.chainId_depth_;

    var targetReducerMap = _reducer$1[inputReducerModule];

    if (!targetReducerMap) {
      return __innerCb(new Error("no reducerMap found for reducer module:" + inputReducerModule));
    }

    var reducerFn = targetReducerMap[type];

    if (!reducerFn) {
      var fns = Object.keys(targetReducerMap);
      return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + inputReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
    } // const errMsg = util.isCcActionValid({ type, payload });
    // if (errMsg) return justWarning(errMsg);


    isStateModuleValid(inputModule, targetRef.ctx.module, reactCallback, function (err, newCb) {
      if (err) return __innerCb(err);
      var executionContext = {
        targetRef: targetRef,
        module: inputModule,
        reducerModule: inputReducerModule,
        type: type,
        cb: newCb,
        context: true,
        __innerCb: __innerCb,
        calledBy: DISPATCH,
        delay: delay,
        renderKey: renderKey,
        chainId: chainId,
        oriChainId: oriChainId,
        chainId_depth_: chainId_depth_
      };
      invokeWith(reducerFn, executionContext, payload);
    });
  }
  function makeDispatchHandler(targetRef, isLazy, defaultModule, defaultReducerModule, defaultRenderKey, delay, chainId, oriChainId, chainId_depth_ // sourceModule, oriChainId, oriChainDepth
  ) {
    if (defaultRenderKey === void 0) {
      defaultRenderKey = '';
    }

    if (delay === void 0) {
      delay = -1;
    }

    if (chainId_depth_ === void 0) {
      chainId_depth_ = {};
    }

    return function (paramObj, payload, userInputRKey, userInputDelay) {
      if (paramObj === void 0) {
        paramObj = {};
      }

      var _getNewChainData2 = getNewChainData(isLazy, chainId, oriChainId, chainId_depth_),
          _chainId = _getNewChainData2._chainId,
          _oriChainId = _getNewChainData2._oriChainId;

      var paramObjType = typeof paramObj;

      var _type, _cb;

      var _module = defaultModule;
      var _reducerModule = defaultReducerModule;

      var _delay = userInputDelay || delay;

      var _renderKey = userInputRKey || defaultRenderKey;

      var callInvoke = function callInvoke() {
        var iHandler = makeInvokeHandler(targetRef, {
          chainId: _chainId,
          oriChainId: _oriChainId,
          isLazy: isLazy,
          chainId_depth_: chainId_depth_
        });
        return iHandler(paramObj, payload, _renderKey, _delay);
      };

      if (paramObjType === 'object') {
        if (Array.isArray(paramObjType)) {
          return callInvoke();
        }

        var _paramObj = paramObj,
            module = _paramObj.module,
            reducerModule = _paramObj.reducerModule,
            type = _paramObj.type,
            cb = _paramObj.cb;
        if (module) _module = module;
        _reducerModule = reducerModule || module || defaultReducerModule;
        _type = type;
        _cb = cb;
      } else if (paramObjType === 'string' || paramObjType === 'function') {
        var targetFirstParam = paramObj;

        if (paramObjType === 'function') {
          var fnName = paramObj.__fnName;

          if (!fnName) {
            return callInvoke(); // throw new Error('you are calling a unnamed function!!!');
          }

          targetFirstParam = fnName; // 这里非常重要，只有处于第一层的调用时，才获取函数对象上的__stateModule __reducerModule参数
          // 防止克隆自模块a的模块b在reducer文件里基于函数引用直接调用时，取的是a的模块相关参数了，但是源头由b发起，应该是b才对

          if (chainId_depth_[oriChainId] == 1) {
            // let dispatch can apply reducer function directly!!!
            // !!! 如果用户在b模块的组件里dispatch直接调用a模块的函数，千万要注意，写为{module:'b', fn:xxxFoo}的模式
            _module = paramObj.__stateModule;
            _reducerModule = paramObj.__reducerModule;
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

          _module = _module3;
          _reducerModule = _module;
          _type = _type2;
        } else if (slashCount === 2) {
          var _targetFirstParam$spl2 = targetFirstParam.split('/'),
              _module4 = _targetFirstParam$spl2[0],
              _reducerModule2 = _targetFirstParam$spl2[1],
              _type3 = _targetFirstParam$spl2[2];

          if (_module4) _module = _module4; //targetFirstParam may like: /foo/changeName

          _reducerModule = _reducerModule2;
          _type = _type3;
        } else {
          return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi$1(targetFirstParam)));
        }
      } else {
        return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
      }

      if (_module === '*') {
        return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
      }

      var p = new Promise(function (resolve, reject) {
        dispatch({
          targetRef: targetRef,
          module: _module,
          reducerModule: _reducerModule,
          type: _type,
          payload: payload,
          cb: _cb,
          __innerCb: _promiseErrorHandler(resolve, reject),
          delay: _delay,
          renderKey: _renderKey,
          chainId: _chainId,
          oriChainId: _oriChainId,
          chainId_depth_: chainId_depth_ // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

        });
      })["catch"](catchCcError);
      return p;
    };
  } // for module/init method

  function makeSetStateHandler(module) {
    return function (state) {
      try {
        setState$1(module, state);
      } catch (err) {
        if (module === MODULE_GLOBAL) {
          getAndStoreValidGlobalState(state, module);
        } else {
          var moduleState = getState(module);

          if (!moduleState) {
            return justWarning("invalid module " + module);
          }

          var keys = okeys(moduleState);

          var _extractStateByKeys = extractStateByKeys(state, keys),
              partialState = _extractStateByKeys.partialState,
              isStateEmpty = _extractStateByKeys.isStateEmpty;

          if (!isStateEmpty) storeSetState(module, partialState); //store this valid state;
        }

        justTip("no ccInstance found for module[" + module + "] currently, cc will just store it, lately ccInstance will pick this state to render");
      }
    };
  }

  var okeys$3 = okeys,
      isPlainJsonObject$2 = isPlainJsonObject;
  var _state$1 = ccContext.store._state;
  /**
   * 根据connect,watchedKeys算出ccClassKey值和connectedModuleKeyMapping值
   */

  function getFeatureStrAndCmkMapping (connectSpec, watchedKeys, belongModule, compTypePrefix) {
    if (!isPlainJsonObject$2(connectSpec)) {
      throw new Error("CcFragment or CcClass's prop connect type error, it is not a plain json object");
    }

    var invalidConnect = "CcFragment or CcClass's prop connect is invalid,";

    var invalidConnectItem = function invalidConnectItem(m) {
      return invalidConnect + " module[" + m + "]'s value must be * or array of string";
    };

    var moduleNames = okeys$3(connectSpec);
    moduleNames.sort();
    var featureStrs = [];
    var connectedModuleKeyMapping = {};
    moduleNames.forEach(function (m) {
      var moduleState = _state$1[m];
      var feature = compTypePrefix + "_" + m + "/";

      if (moduleState === undefined) {
        throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
      }

      var val = connectSpec[m];

      if (typeof val === 'string') {
        if (val !== '*') throw new Error(invalidConnectItem(m));else {
          featureStrs.push(feature + "*");
          okeys$3(moduleState).forEach(function (sKey) {
            return connectedModuleKeyMapping[m + "/" + sKey] = sKey;
          });
        }
      } else if (!Array.isArray(val)) {
        throw new Error(invalidConnectItem(m));
      } else {
        val.forEach(function (sKey) {
          if (!moduleState.hasOwnProperty(sKey)) {
            throw new Error(invalidConnect + " module[" + m + "]'s key[" + sKey + "] not declared in cc store ");
          } else {
            feature += sKey + ",";
            connectedModuleKeyMapping[m + "/" + sKey] = sKey;
          }
        });
        featureStrs.push(feature);
      }
    });
    featureStrs.push('|'); // 之后是watchKeys相关的特征值参数

    if (watchedKeys === '*') featureStrs.push(compTypePrefix + "_$" + belongModule + "/*");else {
      watchedKeys.sort();
      var tmpStr = belongModule + "/" + watchedKeys.join(',');
      featureStrs.push(tmpStr);
    }
    return {
      featureStr: featureStrs.join('@'),
      connectedModuleKeyMapping: connectedModuleKeyMapping,
      connectedModuleNames: moduleNames
    };
  }

  var isObjectNull$1 = isObjectNull,
      me$1 = makeError;
  var featureStr_classKey_ = ccContext.featureStr_classKey_,
      userClassKey_featureStr_ = ccContext.userClassKey_featureStr_,
      ccClassKey_ccClassContext_$2 = ccContext.ccClassKey_ccClassContext_;
  var cursor = 0;
  function getCcClassKey (allowNamingDispatcher, module, connect, watchedKeys, prefix, featureStr, classKey) {
    if (classKey === void 0) {
      classKey = '';
    }

    // 未指定classKey
    if (!classKey) {
      // 未指定所属模块，也未连接到其他模块，且无watchedKeys
      if (module === MODULE_DEFAULT && isObjectNull$1(connect) && watchedKeys.length === 0) {
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
        throw new Error(CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n      you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
      }
    }

    var ctx = ccClassKey_ccClassContext_$2[classKey];

    if (ctx) {
      var fStr = userClassKey_featureStr_[classKey];

      if (fStr !== featureStr) {
        //不允许，特征值不一样的class指定相同的ccClassKey
        throw me$1(ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:[" + classKey + "] duplicate");
      }
    } else {
      userClassKey_featureStr_[classKey] = featureStr;
    }

    return classKey;
  }

  var moduleName_stateKeys_$1 = ccContext.moduleName_stateKeys_,
      moduleName_ccClassKeys_$1 = ccContext.moduleName_ccClassKeys_,
      moduleSingleClass = ccContext.moduleSingleClass,
      ccClassKey_ccClassContext_$3 = ccContext.ccClassKey_ccClassContext_,
      connectedModuleName_ccClassKeys_$1 = ccContext.connectedModuleName_ccClassKeys_,
      _computedValue$2 = ccContext.computed._computedValue;
  var verifyKeys$1 = verifyKeys,
      me$2 = makeError,
      vbi$2 = verboseInfo;

  function checkCcStartupOrNot() {
    if (ccContext.isCcAlreadyStartup !== true) {
      throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
    }
  }

  function getWatchedStateKeys(module, ccClassKey, inputWatchedKeys) {
    var watchedKeys = inputWatchedKeys;

    if (inputWatchedKeys === '*') {
      watchedKeys = moduleName_stateKeys_$1[module];
    }

    var _verifyKeys = verifyKeys$1(watchedKeys, []),
        notArray = _verifyKeys.notArray,
        keyElementNotString = _verifyKeys.keyElementNotString;

    if (notArray) {
      throw me$2(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi$2("ccClassKey:" + ccClassKey));
    }

    if (keyElementNotString) {
      throw me$2(ERR.CC_ARG_KEYS_NOT_AN_ARRAY, vbi$2("ccClassKey:" + ccClassKey));
    }

    return watchedKeys || [];
  }

  function mapModuleToCcClassKeys(moduleName, ccClassKey) {
    var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_$1, moduleName);

    if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
      throw new Error("module[" + moduleName + "] is declared as single, only on ccClassKey can been registered to it, and now a ccClassKey[" + ccClassKeys[0] + "] has been registered!");
    } // 做一个判断，防止热加载时，传入重复的ccClassKey


    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
  }

  function mapCcClassKeyToCcClassContext(ccClassKey, renderKeyClasses, moduleName, originalWatchedKeys, watchedKeys, connectedModuleKeyMapping, connectedModuleNames) {
    var ccClassContext = ccClassKey_ccClassContext_$3[ccClassKey]; //做一个判断，有可能是热加载调用

    if (!ccClassContext) {
      ccClassContext = makeCcClassContext(moduleName, ccClassKey, renderKeyClasses, watchedKeys, originalWatchedKeys);
      ccClassKey_ccClassContext_$3[ccClassKey] = ccClassContext;
    }

    var connectedModule = {};
    var connectedComputed = {};

    if (connectedModuleKeyMapping) {
      var _state = ccContext.store._state;
      var connectedState = ccClassContext.connectedState; //直接赋值引用

      connectedModuleNames.forEach(function (m) {
        connectedState[m] = _state[m];
        connectedComputed[m] = _computedValue$2[m];
        connectedModule[m] = 1; //记录连接的模块
        //记录这个模块被某个ccClassKey连接

        var ccClassKeys = safeGetArrayFromObject(connectedModuleName_ccClassKeys_$1, m);
        ccClassKeys.push(ccClassKey);
      });
      ccClassContext.connectedModuleKeyMapping = connectedModuleKeyMapping;
      ccClassContext.connectedModule = connectedModule;
      ccClassContext.connectedComputed = connectedComputed;
    }
  }
  /**
   * map registration info to ccContext
   */


  function mapRegistrationInfo (module, ccClassKey, renderKeyClasses, classKeyPrefix, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy) {
    if (module === void 0) {
      module = MODULE_DEFAULT;
    }

    if (inputStoredKeys === void 0) {
      inputStoredKeys = [];
    }

    if (__checkStartUp === true) checkCcStartupOrNot();
    var allowNamingDispatcher = __calledBy === 'cc';

    var _reducerModule = reducerModule || module; //if reducerModule not defined, will be equal module;


    checkModuleName(module, false, "module[" + module + "] is not configured in store");
    checkStoredKeys(moduleName_stateKeys_$1[module], inputStoredKeys);
    var _connect = connect;

    if (Array.isArray(connect)) {
      _connect = {};
      connect.forEach(function (m) {
        return _connect[m] = '*';
      });
    }

    var _watchedKeys = getWatchedStateKeys(module, ccClassKey, inputWatchedKeys);

    var _getFeatureStrAndCmkM = getFeatureStrAndCmkMapping(_connect, _watchedKeys),
        featureStr = _getFeatureStrAndCmkM.featureStr,
        connectedModuleKeyMapping = _getFeatureStrAndCmkM.connectedModuleKeyMapping,
        connectedModuleNames = _getFeatureStrAndCmkM.connectedModuleNames;

    var _ccClassKey = getCcClassKey(allowNamingDispatcher, module, _connect, _watchedKeys, classKeyPrefix, featureStr, ccClassKey);

    var _renderKeyClasses;

    if (!renderKeyClasses) {
      _renderKeyClasses = [_ccClassKey];
    } else {
      if (!Array.isArray(renderKeyClasses) && renderKeyClasses !== '*') {
        throw new Error("renderKeyClasses type err, it is must be an array or string *");
      }

      _renderKeyClasses = renderKeyClasses;
    }

    mapCcClassKeyToCcClassContext(_ccClassKey, _renderKeyClasses, module, inputWatchedKeys, _watchedKeys, connectedModuleKeyMapping, connectedModuleNames);
    mapModuleToCcClassKeys(module, _ccClassKey);
    var isSKeysArr = Array.isArray(inputStoredKeys);

    if (!isSKeysArr && inputStoredKeys !== '*') {
      throw new Error("storedKeys type err, it is must be an array or string *");
    }

    if (isSKeysArr) {
      inputStoredKeys.forEach(function (v) {
        if (_watchedKeys.includes(v)) {
          throw new Error("storedKeys key err, the key[" + v + "] is already been declared in watchedKeys");
        }
      });
    }

    return {
      _module: module,
      _reducerModule: _reducerModule,
      _connect: _connect,
      _watchedKeys: _watchedKeys,
      _ccClassKey: _ccClassKey
    };
  }

  var justWarning$3 = justWarning,
      me$3 = makeError,
      vbi$3 = verboseInfo,
      ss = styleStr,
      cl = color;
  var ccUKey_insCount = {};

  function setCcInstanceRef(ccUniqueKey, ref, ccKeys, delayMs) {
    function setRef() {
      ccContext.ccUkey_ref_[ccUniqueKey] = ref;
      ccKeys.push(ccUniqueKey);
    }

    incCcKeyInsCount(ccUniqueKey);

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
  function setRef (ref, isSingle, ccClassKey, ccKey, ccUniqueKey) {
    var classContext = ccContext.ccClassKey_ccClassContext_[ccClassKey];
    var ccKeys = classContext.ccKeys;

    if (ccContext.isDebug) {
      console.log(ss("register ccKey " + ccUniqueKey + " to CC_CONTEXT"), cl());
    }

    var isHot = ccContext.isHotReloadMode();

    if (ccKeys.includes(ccUniqueKey)) {
      if (isHot) {
        // get existed ins count
        var insCount = getCcKeyInsCount(ccUniqueKey);
        if (isSingle && insCount > 0) throw me$3(ERR.CC_CLASS_INSTANCE_MORE_THAN_ONE, vbi$3("ccClass:" + ccClassKey));

        if (insCount > 1) {
          // now cc can make sure the ccKey duplicate
          throw me$3(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$3("ccClass:" + ccClassKey + ",ccKey:" + ccUniqueKey));
        } // just warning


        justWarning$3("\n        found ccKey " + ccKey + " may duplicate, but now is in hot reload mode, cc can't throw the error, please make sure your ccKey is unique manually,\n        " + vbi$3("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " ccUniqueKey:" + ccUniqueKey) + "\n      "); // in webpack hot reload mode, cc works not very well,
        // cc can't set ref immediately, because the ccInstance of ccKey will ummount right now, in unmount func, 
        // cc call unsetCcInstanceRef will lost the right ref in CC_CONTEXT.refs
        // so cc set ref later

        setCcInstanceRef(ccUniqueKey, ref, ccKeys, 600);
      } else {
        throw me$3(ERR.CC_CLASS_INSTANCE_KEY_DUPLICATE, vbi$3("ccClass:[" + ccClassKey + "],ccKey:[" + ccUniqueKey + "]"));
      }
    } else {
      setCcInstanceRef(ccUniqueKey, ref, ccKeys);
    }

    return classContext;
  }

  var event_handlers_ = ccContext.event_handlers_,
      handlerKey_handler_ = ccContext.handlerKey_handler_,
      ccUKey_handlerKeys_ = ccContext.ccUKey_handlerKeys_,
      ccUkey_ref_$1 = ccContext.ccUkey_ref_;
  var makeHandlerKey$1 = makeHandlerKey,
      safeGetArrayFromObject$1 = safeGetArrayFromObject,
      justWarning$4 = justWarning;

  function _findEventHandlers(event, module, ccClassKey, ccUniqueKey, identity) {
    if (identity === void 0) {
      identity = null;
    }

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

      if (identity !== undefined) {
        filteredHandlers = filteredHandlers.filter(function (v) {
          return v.identity === identity;
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
    var handlers = safeGetArrayFromObject$1(event_handlers_, event);

    if (typeof handler !== 'function') {
      return justWarning$4("event " + event + "'s handler is not a function!");
    }

    var handlerKey = makeHandlerKey$1(ccUniqueKey, event, identity);
    var handlerKeys = safeGetArrayFromObject$1(ccUKey_handlerKeys_, ccUniqueKey);
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

    if (typeof event === 'string') {
      _event = event;
    } else {
      _event = event.name;
      _identity = event.identity;
      _module = event.module;
      _ccClassKey = event.ccClassKey;
      _ccUniqueKey = event.ccUniqueKey;
    }

    var handlers = _findEventHandlers(_event, _module, _ccClassKey, _ccUniqueKey, _identity);

    handlers.forEach(function (_ref) {
      var ccUniqueKey = _ref.ccUniqueKey,
          handlerKey = _ref.handlerKey;

      if (ccUkey_ref_$1[ccUniqueKey] && handlerKey) {
        //  confirm the instance is mounted and handler is not been offed
        var handler = handlerKey_handler_[handlerKey];
        if (handler) handler.fn.apply(handler, args);
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
    if (typeof event === 'object') {
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
      } //否则就允许用户传如自己定义的module, ccClassKey


      return _event;
    } else {
      return {
        name: event
      };
    }
  }

  var ev = /*#__PURE__*/Object.freeze({
    bindEventHandlerToCcContext: bindEventHandlerToCcContext,
    findEventHandlersToPerform: findEventHandlersToPerform,
    findEventHandlersToOff: findEventHandlersToOff,
    offEventHandlersByCcUniqueKey: offEventHandlersByCcUniqueKey,
    getEventItem: getEventItem
  });

  var moduleName_stateKeys_$2 = ccContext.moduleName_stateKeys_;
  /**
  computed('foo/firstName', ()=>{});

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

  computed(ctx=>({
    'foo/firstName':()=>{},
    'foo/fullName':{
      fn:()=>{},
      depKeys:['firstName', 'lastName']
    }
  }))
  */
  // cate: module | ref

  function configureDepFns (cate, confMeta, item, handler, depKeys, compare, immediate) {
    if (!item) return;
    var itype = typeof item;

    var _descObj;

    if (itype === 'string') {
      var _descObj2, _descObj3;

      if (typeof handler === 'object') _descObj = (_descObj2 = {}, _descObj2[item] = handler, _descObj2);else _descObj = (_descObj3 = {}, _descObj3[item] = {
        fn: handler,
        depKeys: depKeys,
        compare: compare,
        immediate: immediate
      }, _descObj3);
    } else if (itype === 'object') {
      _descObj = item;
    } else if (itype === 'function') {
      _descObj = item(confMeta.refCtx);
      if (!isPlainJsonObject(_descObj)) throw new Error("type of " + confMeta.type + " callback result must be an object");
    }

    if (!_descObj) return;

    _parseDescObj(cate, confMeta, _descObj);
  }

  function _parseDescObj(cate, confMeta, descObj) {
    var computedCompare = ccContext.computedCompare,
        watchCompare = ccContext.watchCompare,
        watchImmediate = ccContext.watchImmediate; //读全局的默认值

    var defaultCompare = confMeta.type === 'computed' ? computedCompare : watchCompare;
    okeys(descObj).forEach(function (key) {
      var val = descObj[key];
      var vType = typeof val; // 解释key，提取相关信息

      var _resolveKey2 = _resolveKey(cate, confMeta, key),
          isStateKey = _resolveKey2.isStateKey,
          module = _resolveKey2.module,
          retKey = _resolveKey2.retKey;

      if (vType === 'function') {
        _checkIsStateKeyTrue(key, isStateKey);

        _mapDepDesc(confMeta, key, module, retKey, val, [retKey], watchImmediate, defaultCompare);

        return;
      }

      if (vType === 'object') {
        var fn = val.fn,
            depKeys = val.depKeys,
            _val$immediate = val.immediate,
            immediate = _val$immediate === void 0 ? watchImmediate : _val$immediate,
            _val$compare = val.compare,
            compare = _val$compare === void 0 ? defaultCompare : _val$compare;
        var _depKeys = depKeys;

        if (!_depKeys) {
          _checkIsStateKeyTrue(key, isStateKey);

          _depKeys = [retKey];
        }

        _mapDepDesc(confMeta, key, module, retKey, fn, _depKeys, immediate, compare);
      }
    });
  } // 映射依赖描述对象


  function _mapDepDesc(confMeta, key, module, retKey, fn, depKeys, immediate, compare) {
    var dep = confMeta.dep;
    var moduleDepDesc = safeGetObjectFromObject(dep, module, {
      retKey_fn_: {},
      stateKey_retKeys_: {},
      fnCount: 0
    });
    var retKey_fn_ = moduleDepDesc.retKey_fn_,
        stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_;

    if (retKey_fn_[retKey]) {
      throw new Error("key[" + retKey + "] already declared!");
    }

    var _depKeys = depKeys;

    if (depKeys === '*') {
      _depKeys = ['*'];
    }

    if (!Array.isArray(_depKeys)) {
      throw new Error("depKeys can only be an Array<string> or string *, --verbose-info: key[" + key + "]");
    }

    retKey_fn_[retKey] = {
      fn: fn,
      immediate: immediate,
      compare: compare,
      depKeys: depKeys
    };
    moduleDepDesc.fnCount++;
    var refCtx = confMeta.refCtx;

    if (refCtx) {
      if (confMeta.type === 'computed') refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
    }

    _depKeys.forEach(function (sKey) {
      //一个依赖key列表里的stateKey会对应着多个结果key
      var retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
      retKeys.push(retKey);
    });
  }

  function _checkIsStateKeyTrue(key, isStateKey) {
    // concent can't deduce it's dependencyStateKeys
    if (!isStateKey) throw new Error("key[" + key + "] is not a stateKey, please specify depKeys explicitly"); // if (!isStateKey) throw new Error(`key[${key}] is not a stateKey`);
  }

  function _resolveKey(cate, confMeta, key) {
    var _module = confMeta.module,
        _retKey = key,
        _stateKeys;

    if (key.includes('/')) {
      if (cate === CATE_MODULE) throw new Error("key[" + key + "] is invalid, can not include slash");

      var _key$split = key.split('/'),
          module = _key$split[0],
          retKey = _key$split[1];

      if (module) _module = module; // '/name' 支持这种申明方式

      _retKey = retKey;
    }

    if (_module === confMeta.module) {
      // 此时computed & watch可能观察的是私有的stateKey
      _stateKeys = okeys(confMeta.state);
    } else {
      // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
      _stateKeys = moduleName_stateKeys_$2[_module];

      if (!_stateKeys) {
        throw makeError(ERR.CC_MODULE_NOT_FOUND, verboseInfo("module[" + _module + "]"));
      }

      if (!confMeta.connect[_module]) {
        throw new Error("key[" + key + "] is invalid, module[" + _module + "] not been registered or connected");
      }
    } // retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key


    return {
      isStateKey: _stateKeys.includes(_retKey),
      module: _module,
      retKey: _retKey
    };
  }

  function getDefineWatchHandler (refCtx) {
    return function (watchItem, watchHandler, depKeys, compare, immediate) {
      var confMeta = {
        type: 'watch',
        refCtx: refCtx,
        state: refCtx.state,
        module: refCtx.module,
        connect: refCtx.connect,
        dep: refCtx.watchDep
      };
      configureDepFns(CATE_REF, confMeta, watchItem, watchHandler, depKeys, compare, immediate);
    };
  }

  function getDefineComputedHandler (refCtx) {
    return function (computedItem, computedHandler, depKeys, compare) {
      var confMeta = {
        type: 'computed',
        refCtx: refCtx,
        state: refCtx.state,
        module: refCtx.module,
        connect: refCtx.connect,
        dep: refCtx.computedDep
      };
      configureDepFns(CATE_REF, confMeta, computedItem, computedHandler, depKeys, compare);
    };
  }

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

  var justWarning$5 = justWarning,
      makeUniqueCcKey$1 = makeUniqueCcKey;
  function computeCcUniqueKey (isClassSingle, ccClassKey, ccKey, tag) {
    var ccUniqueKey;

    if (isClassSingle) {
      //??? need strict
      if (ccKey) justWarning$5("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[" + ccKey + "]");
      ccUniqueKey = ccClassKey;
    } else {
      if (ccKey) {
        ccUniqueKey = makeUniqueCcKey$1(ccClassKey, ccKey);
      } else {
        var uuidStr = uuid(tag);
        ccUniqueKey = makeUniqueCcKey$1(ccClassKey, uuidStr);
      }
    }

    return ccUniqueKey;
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

  var buildMockEvent = (function (spec, e, refModule, refState) {
    var _ref;

    var ccint = false,
        ccsync = '',
        ccrkey = '',
        value = '',
        extraState = undefined,
        ccdelay = -1,
        isToggleBool = false;
    var syncKey = spec[CCSYNC_KEY];
    var type = spec.type;

    if (syncKey !== undefined) {
      //来自sync生成的setter函数调用
      ccsync = syncKey;
      ccdelay = spec.delay;
      ccrkey = spec.rkey;

      if (type === 'val' || type === 'int') {
        //set value
        ccint = type === 'int'; //convert to int
        //优先从spec里取，取不到的话，从e里面分析并提取

        var val = spec.val;

        if (val === undefined) {
          value = getValFromEvent(e);
        } else {
          if (typeof val === 'function') {
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

            extraState = val(getValFromEvent(e), keyPath, {
              moduleState: getState$1(module),
              fullKeyPath: fullKeyPath,
              state: refState
            });
          } else {
            value = val;
          }
        }
      } else if (type === 'bool') {
        //toggle bool
        isToggleBool = true;
      } else return null;
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
          } catch (err) {}
        }
      } else {
        //<Input onChange={this.sync}/> is invalid
        return null;
      }
    }

    return _ref = {}, _ref[MOCKE_KEY] = 1, _ref.currentTarget = {
      value: value,
      extraState: extraState,
      dataset: {
        ccsync: ccsync,
        ccint: ccint,
        ccdelay: ccdelay,
        ccrkey: ccrkey
      }
    }, _ref.isToggleBool = isToggleBool, _ref;
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
    var mockE = null;

    if (spec[MOCKE_KEY]) {
      mockE = spec;
    } else {
      //可能是来自$$sync生成的setter调用
      mockE = buildMockEvent(spec, e, refModule, refCtx.state);
    }

    if (!mockE) return; //参数无效

    var currentTarget = mockE.currentTarget;
    var dataset = currentTarget.dataset,
        value = currentTarget.value,
        extraState = currentTarget.extraState;
    if (e && e.stopPropagation) e.stopPropagation();
    var ccsync = dataset.ccsync,
        ccint = dataset.ccint,
        ccdelay = dataset.ccdelay,
        ccrkey = dataset.ccrkey;

    if (ccsync.startsWith('/')) {
      dataset.ccsync = "" + refModule + ccsync; //附加上默认模块值
    }

    if (ccsync.includes('/')) {
      // syncModuleState 同步模块的state状态
      var targetModule = ccsync.split('/')[0];
      checkModuleName(targetModule, false);
      var ccKey = refCtx.ccKey,
          ccUniqueKey = refCtx.ccUniqueKey;

      if (extraState) {
        return changeRefState(extraState, {
          calledBy: SYNC,
          ccKey: ccKey,
          ccUniqueKey: ccUniqueKey,
          module: targetModule,
          renderKey: ccrkey,
          delay: ccdelay
        }, ref);
      }

      var fullState = targetModule !== refModule ? getState$2(targetModule) : ref.state;

      var _extractStateByCcsync = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool),
          state = _extractStateByCcsync.state;

      return changeRefState(state, {
        calledBy: SYNC,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: targetModule,
        renderKey: ccrkey,
        delay: ccdelay
      }, ref);
    } else {
      //调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
      if (extraState) {
        return ref.setState(extraState, null, ccrkey, ccdelay);
      }

      var _extractStateByCcsync2 = extractStateByCcsync(ccsync, value, ccint, ref.state, mockE.isToggleBool),
          _state = _extractStateByCcsync2.state;

      return ref.setState(_state, null, ccrkey, ccdelay);
    }
  }

  var refStore$1 = ccContext.refStore,
      ccClassKey_ccClassContext_$4 = ccContext.ccClassKey_ccClassContext_,
      getState$3 = ccContext.store.getState,
      moduleName_ccClassKeys_$2 = ccContext.moduleName_ccClassKeys_,
      _computedValue$3 = ccContext.computed._computedValue,
      renderKey_ccUkeys_$1 = ccContext.renderKey_ccUkeys_;
  var okeys$4 = okeys,
      me$4 = makeError,
      vbi$4 = verboseInfo,
      safeGetArrayFromObject$2 = safeGetArrayFromObject;
  var idSeq = 0;

  function getEId() {
    idSeq++;
    return Symbol("__autoGen_" + idSeq + "__");
  } //调用buildFragmentRefCtx 之前，props参数已被处理过

  /**
   * 构建refCtx，附加到ref.cc上
   * liteLevel 越小，绑定的方法越少
   */


  function buildRefCtx (ref, params, liteLevel) {
    var _ctx;

    if (liteLevel === void 0) {
      liteLevel = 5;
    }

    var reactSetState = ref.setState.bind(ref);
    var reactForceUpdate = ref.forceUpdate.bind(ref);
    var isSingle = params.isSingle,
        ccClassKey = params.ccClassKey,
        _params$ccKey = params.ccKey,
        ccKey = _params$ccKey === void 0 ? '' : _params$ccKey,
        module = params.module,
        reducerModule = params.reducerModule,
        type = params.type,
        _params$state = params.state,
        state = _params$state === void 0 ? {} : _params$state,
        storedKeys = params.storedKeys,
        watchedKeys = params.watchedKeys,
        _params$connect = params.connect,
        connect = _params$connect === void 0 ? {} : _params$connect,
        tag = params.tag,
        ccOption = params.ccOption;
    reducerModule = reducerModule || module;
    var stateModule = module; //用户使用ccKey属性的话，必需显示的指定ccClassKey

    if (ccKey && !ccClassKey) {
      throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
    }

    var _storedKeys = [];

    if (storedKeys !== undefined && storedKeys.length > 0) {
      if (!ccKey) throw me$4(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi$4("ccClassKey[" + ccClassKey + "]"));
      _storedKeys = storedKeys;
    } // pic ref defined tag first, register tag second


    var ccUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey, ccOption.tag || tag); // 没有设定renderKey的话，默认ccUniqueKey就是renderKey

    var renderKey = ccOption.renderKey;
    if (!renderKey) renderKey = ccOption.renderKey = ccUniqueKey;
    var ccUkeys = safeGetArrayFromObject$2(renderKey_ccUkeys_$1, renderKey);
    ccUkeys.push(ccUniqueKey);
    var classCtx = ccClassKey_ccClassContext_$4[ccClassKey];
    var connectedComputed = classCtx.connectedComputed || {};
    var connectedState = classCtx.connectedState || {};
    var moduleState = getState$3(module);
    var moduleComputed = _computedValue$3[module] || {};
    var globalComputed = _computedValue$3[MODULE_GLOBAL] || {};
    var globalState = getState$3(MODULE_GLOBAL);
    var refConnectedComputed = {};
    okeys$4(connect).forEach(function (moduleName) {
      refConnectedComputed[moduleName] = {};
    }); // recover ref state

    var refStoredState = refStore$1._state[ccUniqueKey] || {};
    var mergedState = Object.assign({}, state, refStoredState, moduleState);
    ref.state = mergedState;
    var stateKeys = okeys$4(mergedState); // record ref

    setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey); // record ccClassKey

    var ccClassKeys = safeGetArrayFromObject(moduleName_ccClassKeys_$2, module);
    if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey); // create cc api

    var _setState = function _setState(module, state, calledBy, reactCallback, renderKey, delay) {
      changeRefState(state, {
        calledBy: calledBy,
        ccKey: ccKey,
        ccUniqueKey: ccUniqueKey,
        module: module,
        renderKey: renderKey,
        delay: delay,
        reactCallback: reactCallback
      }, ref);
    };

    var setModuleState = function setModuleState(module, state, reactCallback, renderKey, delay) {
      _setState(module, state, SET_MODULE_STATE, reactCallback, renderKey, delay);
    }; // const setState = (state, reactCallback, renderKey, delay) => {


    var setState = function setState(p1, p2, p3, p4, p5) {
      if (typeof p1 === 'string') {
        //p1 module, p2 state, p3 cb, p4 rkey, p5 delay
        setModuleState(p1, p2, p3, p4, p5);
      } else {
        //p1 state, p2 cb, p3 rkey, p4 delay
        _setState(stateModule, p1, SET_STATE, p2, p3, p4);
      }
    };

    var forceUpdate = function forceUpdate(reactCallback, renderKey, delay) {
      _setState(stateModule, ref.state, FORCE_UPDATE, reactCallback, renderKey, delay);
    };

    var changeState = function changeState(state, option) {
      changeRefState(state, option, ref);
    };

    var onEvents = [];
    var effectItems = []; // {fn:function, status:0, eId:'', immediate:true}

    var eid_effectReturnCb_ = {}; // fn

    var effectMeta = {
      effectItems: effectItems,
      eid_effectReturnCb_: eid_effectReturnCb_
    };
    var auxMap = {}; // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
    // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }

    var computedDep = {},
        watchDep = {};
    var ctx = (_ctx = {
      // static params
      type: type,
      module: module,
      reducerModule: reducerModule,
      ccClassKey: ccClassKey,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      renderCount: 1,
      initTime: Date.now(),
      storedKeys: _storedKeys,
      watchedKeys: watchedKeys,
      connect: connect,
      ccOption: ccOption,
      props: getOutProps(ref.props),
      mapped: {},
      prevState: mergedState,
      // state
      state: mergedState,
      moduleState: moduleState,
      globalState: globalState,
      connectedState: connectedState,
      // computed
      refComputed: {},
      refConnectedComputed: refConnectedComputed,
      moduleComputed: moduleComputed,
      globalComputed: globalComputed,
      connectedComputed: connectedComputed
    }, _ctx["mapped"] = {}, _ctx.stateKeys = stateKeys, _ctx.onEvents = onEvents, _ctx.computedDep = computedDep, _ctx.watchDep = watchDep, _ctx.execute = null, _ctx.reducer = {}, _ctx.lazyReducer = {}, _ctx.auxMap = auxMap, _ctx.effectMeta = effectMeta, _ctx.reactSetState = reactSetState, _ctx.reactForceUpdate = reactForceUpdate, _ctx.setState = setState, _ctx.setModuleState = setModuleState, _ctx.forceUpdate = forceUpdate, _ctx.changeState = changeState, _ctx.__$$ccForceUpdate = makeCcForceUpdateHandler(ref), _ctx.__$$ccSetState = makeCcSetStateHandler(ref), _ctx);
    ref.ctx = ctx;
    ref.setState = setState;
    ref.forceUpdate = forceUpdate; // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler

    var dispatch$$1 = makeDispatchHandler(ref, false, stateModule, stateModule);
    ctx.dispatch = dispatch$$1;

    if (liteLevel > 1) {
      // level 2, assign these mod data api
      ctx.lazyDispatch = makeDispatchHandler(ref, true, stateModule, stateModule);
      ctx.invoke = makeInvokeHandler(ref);
      ctx.lazyInvoke = makeInvokeHandler(ref, {
        isLazy: true
      });

      ctx.setGlobalState = function (state, reactCallback, renderKey, delay) {
        _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, renderKey, delay);
      };
    }

    if (liteLevel > 2) {
      // level 3, assign async api
      ctx.syncBool = function (e, rkey, delay) {
        var _sync$bind;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay === void 0) {
          delay = -1;
        }

        if (typeof e === 'string') return __sync.bind(null, (_sync$bind = {}, _sync$bind[CCSYNC_KEY] = e, _sync$bind.type = 'bool', _sync$bind.delay = delay, _sync$bind.rkey = rkey, _sync$bind), ref);

        __sync({
          type: 'bool'
        }, e, ref);
      };

      ctx.sync = function (e, val, rkey, delay) {
        var _sync$bind2;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay === void 0) {
          delay = -1;
        }

        if (typeof e === 'string') return __sync.bind(null, (_sync$bind2 = {}, _sync$bind2[CCSYNC_KEY] = e, _sync$bind2.type = 'val', _sync$bind2.val = val, _sync$bind2.delay = delay, _sync$bind2.rkey = rkey, _sync$bind2), ref);

        __sync({
          type: 'val'
        }, ref, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />

      };

      ctx.set = function (ccsync, val, rkey, delay) {
        var _sync;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay === void 0) {
          delay = -1;
        }

        __sync((_sync = {}, _sync[CCSYNC_KEY] = ccsync, _sync.type = 'val', _sync.val = val, _sync.delay = delay, _sync.rkey = rkey, _sync), ref);
      };

      ctx.setBool = function (ccsync, rkey, delay) {
        var _sync2;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay === void 0) {
          delay = -1;
        }

        __sync((_sync2 = {}, _sync2[CCSYNC_KEY] = ccsync, _sync2.type = 'bool', _sync2.delay = delay, _sync2.rkey = rkey, _sync2), ref);
      };

      ctx.syncInt = function (e, rkey, delay) {
        var _sync$bind3;

        if (rkey === void 0) {
          rkey = '';
        }

        if (delay === void 0) {
          delay = -1;
        }

        if (typeof e === 'string') return __sync.bind(null, (_sync$bind3 = {}, _sync$bind3[CCSYNC_KEY] = e, _sync$bind3.type = 'int', _sync$bind3.delay = delay, _sync$bind3.rkey = rkey, _sync$bind3), ref);

        __sync({
          type: 'int'
        }, ref, e);
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

        //这里刻意不为identity赋默认值，如果是undefined，表示off掉所有监听
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

      var on = function on(inputEvent, handler, delayToDidMount) {
        if (delayToDidMount === void 0) {
          delayToDidMount = true;
        }

        //这里刻意赋默认值identity = null，表示on的是不带id认证的监听
        var _ev$getEventItem2 = getEventItem(inputEvent),
            event = _ev$getEventItem2.name,
            _ev$getEventItem2$ide = _ev$getEventItem2.identity,
            identity = _ev$getEventItem2$ide === void 0 ? null : _ev$getEventItem2$ide;

        if (delayToDidMount) {
          //cache to onEvents firstly, cc will bind them in didMount life cycle
          onEvents.push({
            event: event,
            handler: handler,
            identity: identity
          });
          return;
        }

        bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
      };

      ctx.on = on; // on handler been effective in didMount by default, so user can call it in setup safely
      // but if user want on been effective immediately, user can call onDirectly
      // or on(ev, fn, rkey, false)

      ctx.onDirectly = function (event, handler) {
        on(event, handler, false);
      };
    }

    if (liteLevel > 4) {
      // level 5, assign enhance api
      ctx.execute = function (handler) {
        return ctx.execute = handler;
      };

      ctx.aux = function (methodName, handler) {
        if (auxMap[methodName]) throw new Error("auxMethod[" + methodName + "] already defined!");
        auxMap[methodName] = handler;
      };

      ctx.watch = getDefineWatchHandler(ctx);
      ctx.computed = getDefineComputedHandler(ctx);

      ctx.effect = function (fn, depKeys, immediate, eId) {
        var _effectItem;

        if (immediate === void 0) {
          immediate = true;
        }

        if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');

        if (depKeys !== null && depKeys !== undefined) {
          if (!Array.isArray(depKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
        }

        var _eId = eId || getEId(); // const effectItem = { fn: _fn, depKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };


        var effectItem = (_effectItem = {
          fn: fn,
          depKeys: depKeys,
          eId: _eId
        }, _effectItem["depKeys"] = depKeys, _effectItem.immediate = immediate, _effectItem);
        effectItems.push(effectItem);
      };
    }
  }

  var getState$4 = ccContext.store.getState;
  /** 由首次render触发 */

  function triggerComputedAndWatch (ref) {
    var ctx = ref.ctx;
    var hasComputedFn = ctx.hasComputedFn,
        hasWatchFn = ctx.hasWatchFn,
        connect = ctx.connect,
        refModule = ctx.module;
    var connectedModules = okeys(connect);
    var refState = ctx.state;

    if (hasComputedFn) {
      computeValueForRef(ctx, refModule, refState, refState, true);
      connectedModules.forEach(function (m) {
        var mState = getState$4(m);
        computeValueForRef(ctx, m, mState, mState, true);
      });
    }

    if (hasWatchFn) {
      watchKeyForRef(ctx, refModule, refState, refState, true);
      connectedModules.forEach(function (m) {
        var mState = getState$4(m);
        watchKeyForRef(ctx, m, mState, mState, true);
      });
    }
  }

  var safeGetObjectFromObject$1 = safeGetObjectFromObject,
      okeys$5 = okeys,
      justWarning$6 = justWarning;
  var _reducerModule_fnNames_ = ccContext.reducer._reducerModule_fnNames_;
  function beforeMount (ref, setup, bindCtxToMethod) {
    ref.__$$isUnmounted = false;
    var ctx = ref.ctx;
    var reducer = ctx.reducer,
        lazyReducer = ctx.lazyReducer,
        dispatch = ctx.dispatch,
        lazyDispatch = ctx.lazyDispatch,
        connect = ctx.connect,
        module = ctx.module;
    var connectedModules = okeys$5(connect);
    var allModules = connectedModules.slice();
    if (!allModules.includes(module)) allModules.push(module);else {
      justWarning$6("module[" + module + "] are in belongTo and connect both, it will cause redundant render.");
    } //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
    //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

    allModules.forEach(function (m) {
      var refReducerFnObj = safeGetObjectFromObject$1(reducer, m);
      var refLazyReducerFnObj = safeGetObjectFromObject$1(lazyReducer, m);
      var fnNames = _reducerModule_fnNames_[m] || [];
      fnNames.forEach(function (fnName) {
        refReducerFnObj[fnName] = function (payload, delay, rkey) {
          return dispatch(m + "/" + fnName, payload, delay, rkey);
        };

        refLazyReducerFnObj[fnName] = function (payload, delay, rkey) {
          return lazyDispatch(m + "/" + fnName, payload, delay, rkey);
        };
      });
    }); // ctx.reducer = ccContext.reducer._reducerRefCaller;
    // ctx.lazyReducer = ccContext.reducer._lazyReducerRefCaller;
    //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后

    if (setup) {
      if (typeof setup !== 'function') throw new Error('type of setup must be function');
      var settingsObj = setup(ctx) || {};
      if (!isPlainJsonObject(settingsObj)) throw new Error('type of setup return result must be an plain json object');
      var globalBindCtx = ccContext.bindCtxToMethod; //优先读自己的，再读全局的

      if (bindCtxToMethod === true || globalBindCtx === true && bindCtxToMethod !== false) {
        okeys$5(settingsObj).forEach(function (name) {
          var settingValue = settingsObj[name];
          if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
        });
      }

      ctx.settings = settingsObj;
    }

    triggerComputedAndWatch(ref);
  }

  var moduleName_stateKeys_$3 = ccContext.moduleName_stateKeys_,
      _ccContext$store$2 = ccContext.store,
      getPrevState$1 = _ccContext$store$2.getPrevState,
      getState$5 = _ccContext$store$2.getState;
  var frag1 = 'has not been declared in';
  function triggerSetupEffect (ref, callByDidMount) {
    var ctx = ref.ctx;
    var _ctx$effectMeta = ctx.effectMeta,
        effectItems = _ctx$effectMeta.effectItems,
        eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_;

    if (callByDidMount) {
      effectItems.forEach(function (item) {
        if (item.immediate === false) return;
        var cb = item.fn(ctx, true); // set true flag isDidMount = true

        if (cb) eid_effectReturnCb_[item.eId] = cb;
      });
    } else {
      //callByDidUpdate
      var prevState = ctx.prevState;
      var curState = ref.state;
      var toBeExecutedFns = [];
      effectItems.forEach(function (item) {
        // const { status, depKeys, fn, eId } = item;
        // if (status === EFFECT_STOPPED) return;
        // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
        var depKeys = item.depKeys,
            fn = item.fn,
            eId = item.eId;

        if (depKeys) {
          var keysLen = depKeys.length;
          if (keysLen === 0) return;
          var shouldEffectExecute = false;

          for (var i = 0; i < keysLen; i++) {
            var key = depKeys[i];
            var targetCurState = void 0,
                targetPrevState = void 0,
                targetKey = void 0;

            if (key.includes('/')) {
              var _key$split = key.split('/'),
                  module = _key$split[0],
                  unmoduledKey = _key$split[1];

              var _prevState = getPrevState$1(module);

              if (!_prevState) {
                justWarning("effect: key[" + key + "] is invalid, its module[" + module + "] " + frag1 + " store!");
                continue;
              }

              if (!moduleName_stateKeys_$3[module].includes(unmoduledKey)) {
                justWarning("effect: key[" + key + "] is invalid, its unmoduledKey[" + unmoduledKey + "] " + frag1 + " state!");
                continue;
              }

              targetCurState = getState$5(module);
              targetPrevState = _prevState;
              targetKey = unmoduledKey;
            } else {
              targetCurState = curState;
              targetPrevState = prevState;
              targetKey = key;
            }

            if (targetPrevState[targetKey] !== targetCurState[targetKey]) {
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
      });
      toBeExecutedFns.forEach(function (item) {
        var fn = item.fn,
            eId = item.eId;
        var cb = fn(ctx, false); // set false flag isDidMount = false, means effect triggered in didUpdate period

        if (cb) eid_effectReturnCb_[eId] = cb;
      });
    }
  }

  function didMount (ref) {
    var _ref$ctx = ref.ctx,
        module = _ref$ctx.module,
        ccClassKey = _ref$ctx.ccClassKey,
        ccUniqueKey = _ref$ctx.ccUniqueKey,
        onEvents = _ref$ctx.onEvents;
    onEvents.forEach(function (_ref) {
      var event = _ref.event,
          identity = _ref.identity,
          handler = _ref.handler;
      bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler);
    });
    triggerSetupEffect(ref, true);
  }

  function didUpdate (ref) {
    triggerSetupEffect(ref); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
    //注意一定是先调用triggerSetupEffect，再赋值
    //这里刻意用assign，让prevState指向一个新引用
    // ref.ctx.prevState = Object.assign({}, ref.state);
    //不采用上面的写法了，因为makeCcSetStateHandler里放弃了okeys写法，总是直接赋值最新的state引用

    ref.ctx.prevState = ref.state;
  }

  var ccUkey_ref_$2 = ccContext.ccUkey_ref_,
      ccUKey_handlerKeys_$1 = ccContext.ccUKey_handlerKeys_,
      ccClassKey_ccClassContext_$5 = ccContext.ccClassKey_ccClassContext_,
      handlerKey_handler_$1 = ccContext.handlerKey_handler_,
      renderKey_ccUkeys_$2 = ccContext.renderKey_ccUkeys_;
  function unsetRef (ccClassKey, ccUniqueKey, renderKey) {
    if (ccContext.isDebug) {
      console.log(styleStr(ccUniqueKey + " unset ref"), color('purple'));
    }

    delete ccUkey_ref_$2[ccUniqueKey];
    var ccUkeys = renderKey_ccUkeys_$2[renderKey];

    if (renderKey === ccUniqueKey) {
      delete renderKey_ccUkeys_$2[renderKey];
    } else {
      ccUkeys.splice(ccUkeys.indexOf(ccUniqueKey), 1);
    }

    var classContext = ccClassKey_ccClassContext_$5[ccClassKey];
    var ccKeys = classContext.ccKeys;
    var ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
    if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
    decCcKeyInsCount(ccUniqueKey);
    var handlerKeys = ccUKey_handlerKeys_$1[ccUniqueKey];

    if (handlerKeys) {
      handlerKeys.forEach(function (hKey) {
        delete handlerKey_handler_$1[hKey];
      });
    }
  }

  function beforeUnmount (ref) {
    //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
    //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
    ref.__$$isUnmounted = true;
    var ctx = ref.ctx;
    var eid_effectReturnCb_ = ctx.effectMeta.eid_effectReturnCb_;
    Object.getOwnPropertySymbols(eid_effectReturnCb_).forEach(function (symbolKey) {
      var cb = eid_effectReturnCb_[symbolKey];
      if (typeof cb === 'function') cb(ctx);
    });
    okeys(eid_effectReturnCb_).forEach(function (eId) {
      var cb = eid_effectReturnCb_[eId];
      if (typeof cb === 'function') cb(ctx);
    });
    var ccUniqueKey = ctx.ccUniqueKey,
        ccClassKey = ctx.ccClassKey,
        ccOption = ctx.ccOption;
    offEventHandlersByCcUniqueKey(ccUniqueKey);
    unsetRef(ccClassKey, ccUniqueKey, ccOption.renderKey);
  }

  function getStoredKeys (refDeclaredState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
    var targetStoredKeys = ccOptionStoredKeys || registerStoredKeys;

    if (!targetStoredKeys) {
      return [];
    }

    if (targetStoredKeys === '*') {
      return Object.keys(refDeclaredState).filter(function (k) {
        return !moduleStateKeys.includes(k);
      });
    } else {
      checkStoredKeys(moduleStateKeys, targetStoredKeys);
      return targetStoredKeys;
    }
  }

  var moduleName_stateKeys_$4 = ccContext.moduleName_stateKeys_;
  var ccClassDisplayName$1 = ccClassDisplayName,
      styleStr$1 = styleStr,
      color$1 = color,
      verboseInfo$2 = verboseInfo,
      makeError$3 = makeError,
      okeys$6 = okeys,
      shallowDiffers$1 = shallowDiffers;
  var cl$1 = color$1;
  var ss$1 = styleStr$1;
  var me$5 = makeError$3;
  var vbi$5 = verboseInfo$2;
  function register(_temp, ccClassKey) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$module = _ref.module,
        module = _ref$module === void 0 ? MODULE_DEFAULT : _ref$module,
        _ref$watchedKeys = _ref.watchedKeys,
        inputWatchedKeys = _ref$watchedKeys === void 0 ? '*' : _ref$watchedKeys,
        _ref$storedKeys = _ref.storedKeys,
        inputStoredKeys = _ref$storedKeys === void 0 ? [] : _ref$storedKeys,
        persistStoredKeys = _ref.persistStoredKeys,
        _ref$connect = _ref.connect,
        connect = _ref$connect === void 0 ? {} : _ref$connect,
        _ref$tag = _ref.tag,
        tag = _ref$tag === void 0 ? '' : _ref$tag,
        lite = _ref.lite,
        reducerModule = _ref.reducerModule,
        _ref$isPropsProxy = _ref.isPropsProxy,
        isPropsProxy = _ref$isPropsProxy === void 0 ? false : _ref$isPropsProxy,
        _ref$isSingle = _ref.isSingle,
        isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
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
      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_CLASS_PREFIX, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy),
          _module = _mapRegistrationInfo._module,
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      return function (ReactClass) {
        if (ReactClass.prototype && ReactClass.prototype.$$attach) {
          throw me$5(ERR.CC_REGISTER_A_CC_CLASS, vbi$5("CcClass can not been registered!"));
        } // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;


        var ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;

        var _CcClass =
        /*#__PURE__*/
        function (_ToBeExtendedClass) {
          _inheritsLoose(CcClass, _ToBeExtendedClass);

          function CcClass(props, context) {
            var _this;

            try {
              _this = _ToBeExtendedClass.call(this, props, context) || this;
              _this.state = _this.state || {};
              _this.$$attach = _this.$$attach.bind(_assertThisInitialized(_this));
              var ccOption = props.ccOption || {
                persistStoredKeys: persistStoredKeys
              };
              var declaredState = _this.state;

              var _storedKeys = getStoredKeys(declaredState, moduleName_stateKeys_$4[_module], ccOption.storedKeys, inputStoredKeys);

              var params = Object.assign({}, props, {
                isSingle: isSingle,
                module: _module,
                reducerModule: _reducerModule,
                tag: tag,
                state: declaredState,
                type: CC_CLASS_PREFIX,
                watchedKeys: _watchedKeys,
                ccClassKey: _ccClassKey,
                connect: _connect,
                storedKeys: _storedKeys,
                ccOption: ccOption
              });
              buildRefCtx(_assertThisInitialized(_this), params, lite);
              if (_this.$$setup) _this.$$setup = _this.$$setup.bind(_assertThisInitialized(_this));
              beforeMount(_assertThisInitialized(_this), _this.$$setup, false);
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
            childRef.ctx = ctx;
            ctx.reactSetState = childRef.setState.bind(childRef);
            ctx.reactForceUpdate = childRef.forceUpdate.bind(childRef); // 让孩子引用的setState forceUpdate 指向父容器事先构造好的setState forceUpdate

            childRef.setState = ctx.setState;
            childRef.forceUpdate = ctx.forceUpdate; //替换掉ctx.__$$ccSetState ctx.__$$ccForceUpdate, 让changeRefState正确的更新目标实例

            ctx.__$$ccSetState = makeCcSetStateHandler(childRef, this);
            ctx.__$$ccForceUpdate = makeCcForceUpdateHandler(childRef);
            var childRefState = childRef.state;
            var thisState = this.state;
            if (!childRefState) childRefState = childRef.state = {};
            var newState = Object.assign({}, childRefState, thisState);
            childRef.state = newState; //在childRef进入首次render流程前，提前赋值

            ctx.state = newState; //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
            // this.state = newState; // bad writing

            okeys$6(newState).forEach(function (key) {
              return thisState[key] = newState[key];
            });
            beforeMount(childRef, childRef.$$setup);
          };

          _proto.componentDidMount = function componentDidMount() {
            if (_ToBeExtendedClass.prototype.componentDidMount) _ToBeExtendedClass.prototype.componentDidMount.call(this);
            didMount(this); // 代理模式不再强制检查$$attach是否给调用
            // if (isPropsProxy === true && !this.ctx.childRef) {
            //   throw new Error('you forgot to call this.props.$$attach(this) in constructor, you must call it after state assign expression next line!');
            // }
          };

          _proto.componentDidUpdate = function componentDidUpdate() {
            if (_ToBeExtendedClass.prototype.componentDidUpdate) _ToBeExtendedClass.prototype.componentDidUpdate.call(this);
            didUpdate(this);
          };

          _proto.componentWillUnmount = function componentWillUnmount() {
            if (_ToBeExtendedClass.prototype.componentWillUnmount) _ToBeExtendedClass.prototype.componentWillUnmount.call(this);
            beforeUnmount(this);
          };

          _proto.render = function render() {
            this.ctx.props = this.props;

            if (ccContext.isDebug) {
              console.log(ss$1("@@@ render " + ccClassDisplayName$1(_ccClassKey)), cl$1());
            }

            if (isPropsProxy === false) {
              //now cc class extends ReactClass, call super.render()
              return _ToBeExtendedClass.prototype.render.call(this);
            } else {
              //将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
              return React.createElement(ReactClass, {
                ctx: this.ctx,
                $$attach: this.$$attach
              });
            }
          };

          return CcClass;
        }(ToBeExtendedClass);

        if (_ccClassKey === CC_DISPATCHER) _CcClass.displayName = 'CcDispatcher';else _CcClass.displayName = ccClassDisplayName$1(_ccClassKey);
        return _CcClass;
      };
    } catch (err) {
      catchCcError(err);
    }
  }

  function createDispatcher (CustomizedComponent) {
    var DefaultComponent =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(DefaultComponent, _React$Component);

      function DefaultComponent() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = DefaultComponent.prototype;

      _proto.render = function render() {
        return this.props.children || React.createElement('span', {
          style: {
            display: 'none'
          }
        });
      };

      return DefaultComponent;
    }(React.Component);

    if (ccContext.refs[CC_DISPATCHER]) {
      if (ccContext.isHotReloadMode()) {
        justTip("hot reload mode, CC_DISPATCHER existed");
      } else {
        throw new Error("CcDispatcher can only be initialize one time");
      }
    }

    var TargetComponent = CustomizedComponent || DefaultComponent;
    return register({
      isSingle: true,
      __checkStartUp: false,
      __calledBy: 'cc'
    }, CC_DISPATCHER)(TargetComponent);
  }

  function initModuleState (module, state, moduleStateMustNotDefinedInStore, tag) {
    if (moduleStateMustNotDefinedInStore === void 0) {
      moduleStateMustNotDefinedInStore = true;
    }

    if (tag === void 0) {
      tag = '';
    }

    try {
      checkModuleNameAndState(module, state, moduleStateMustNotDefinedInStore);
    } catch (err) {
      if (err.code === ERR.CC_MODULE_NAME_DUPLICATE && ccContext.isHotReloadMode()) {
        justTip("module[" + module + "] duplicated while you call " + tag + " under hot reload mode, cc will ignore this error");
      }
    } // ccContext.store.setState(module, state);


    var rootState = ccContext.store.getState();
    var prevRootState = ccContext.store.getPrevState();
    rootState[module] = state;
    prevRootState[module] = Object.assign({}, state);
    var statKeys = Object.keys(state);
    ccContext.moduleName_stateKeys_[module] = statKeys;

    if (module === MODULE_GLOBAL) {
      var globalStateKeys = ccContext.globalStateKeys;
      statKeys.forEach(function (key) {
        return globalStateKeys.push(key);
      });
    }
  }

  var makeUniqueCcKey$2 = makeUniqueCcKey,
      justWarning$7 = justWarning;
  function dispatch$1 (isLazy, action, payLoadWhenActionIsString, renderKey, delay, _temp) {
    if (renderKey === void 0) {
      renderKey = '';
    }

    var _ref = _temp === void 0 ? {} : _temp,
        ccClassKey = _ref.ccClassKey,
        ccKey = _ref.ccKey,
        throwError = _ref.throwError;

    if (action === undefined && payLoadWhenActionIsString === undefined) {
      throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any, delay?:number, idt?:string), when action is String, second param means payload");
    }

    var dispatchFn;

    try {
      if (ccClassKey && ccKey) {
        var uKey = makeUniqueCcKey$2(ccClassKey, ccKey);
        var targetRef = ccContext.refs[uKey];

        if (!targetRef) {
          throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
        } else {
          dispatchFn = isLazy ? targetRef.ctx.lazyDispatch : targetRef.ctx.dispatch;
        }
      } else {
        var module = '';

        if (typeof action == 'string' && action.includes('/')) {
          module = action.split('/')[0];
        }

        var ref;

        if (module !== '*') {
          ref = pickOneRef(module);
        } else {
          ref = pickOneRef();
        }

        dispatchFn = isLazy ? ref.ctx.lazyDispatch : ref.ctx.dispatch;
      }

      if (typeof action === 'string' && action.startsWith('*')) {
        var reducerModName = action.split('/').pop();
        var fullFnNames = ccContext.reducer._reducerFnName_fullFnNames_[reducerModName];
        if (!fullFnNames) return;
        var tasks = [];
        fullFnNames.forEach(function (fullFnName) {
          tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, renderKey, delay));
        });
        return Promise.all(tasks);
      } else {
        return dispatchFn(action, payLoadWhenActionIsString, renderKey, delay);
      }
    } catch (err) {
      if (throwError) throw err;else justWarning$7(err.message);
    }
  }

  function dispatch$2 (action, payLoadWhenActionIsString, renderKey, delay, option) {
    return dispatch$1(false, action, payLoadWhenActionIsString, renderKey, delay, option);
  }

  function lazyDispatch (action, payLoadWhenActionIsString, renderKey, delay, option) {
    dispatch$1(true, action, payLoadWhenActionIsString, renderKey, delay, option);
  }

  function initModuleReducer (module, reducer, rootReducerCanNotContainInputModule, tag) {
    if (rootReducerCanNotContainInputModule === void 0) {
      rootReducerCanNotContainInputModule = true;
    }

    if (!reducer) return;

    try {
      if (rootReducerCanNotContainInputModule) checkReducerModuleName(module);else checkModuleNameBasically(module);
    } catch (err) {
      if (err.code === ERR.CC_MODULE_NAME_DUPLICATE && ccContext.isHotReloadMode()) {
        justTip("module[" + module + "] duplicated while you call " + tag + " under hot reload mode, cc will ignore this error");
      }
    }

    var _ccContext$reducer = ccContext.reducer,
        _reducer = _ccContext$reducer._reducer,
        _reducerCaller = _ccContext$reducer._reducerCaller,
        _lazyReducerCaller = _ccContext$reducer._lazyReducerCaller,
        _reducerFnName_fullFnNames_ = _ccContext$reducer._reducerFnName_fullFnNames_,
        _reducerModule_fnNames_ = _ccContext$reducer._reducerModule_fnNames_;
    _reducer[module] = reducer;
    var subReducerCaller = safeGetObjectFromObject(_reducerCaller, module);
    var subLazyReducerCaller = safeGetObjectFromObject(_lazyReducerCaller, module); // const subReducerRefCaller = util.safeGetObjectFromObject(_reducerRefCaller, module);
    // const subLazyReducerRefCaller = util.safeGetObjectFromObject(_lazyReducerRefCaller, module);

    var fnNames = safeGetArrayFromObject(_reducerModule_fnNames_, module); // 自动附加一个setState在reducer里

    if (!reducer.setState) reducer.setState = function (payload) {
      return payload;
    };
    var reducerNames = okeys(reducer);
    reducerNames.forEach(function (name) {
      // avoid hot reload
      if (!fnNames.includes(name)) fnNames.push(name);
      var fullFnName = module + "/" + name;

      subReducerCaller[name] = function (payload, delay, idt) {
        return dispatch$2(fullFnName, payload, delay, idt);
      };

      subLazyReducerCaller[name] = function (payload, delay, idt) {
        return lazyDispatch(fullFnName, payload, delay, idt);
      }; // function wrappedReducerFn(payload, delay, idt){
      // }
      // subReducerRefCaller[name] = wrappedReducerFn;
      // function wrappedLazyReducerFn(payload, delay, idt) {
      // }
      // subLazyReducerRefCaller[name] = wrappedLazyReducerFn;


      var reducerFn = reducer[name];

      if (typeof reducerFn !== 'function') {
        throw new Error("reducer key[" + name + "] 's value is not a function");
      } else {
        reducerFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名

        reducerFn.__stateModule = module;
        reducerFn.__reducerModule = module;
      } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
      // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
      // reducerFn.stateModule = module;


      var list = safeGetArrayFromObject(_reducerFnName_fullFnNames_, name); // avoid hot reload

      if (!list.includes(fullFnName)) list.push(fullFnName);
    });
  }

  var isPlainJsonObject$3 = isPlainJsonObject;
  /**
   * 设置watch值，过滤掉一些无效的key
   */

  function initModuleWatch (module, moduleWatch, append) {
    if (append === void 0) {
      append = false;
    }

    if (!isPlainJsonObject$3(moduleWatch)) {
      throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
    }

    checkModuleName(module, false, "watch." + module + " is invalid");
    var rootWatchDep = ccContext.watch.getRootWatchDep();
    var rootWatchRaw = ccContext.watch.getRootWatchRaw();

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
      state: moduleState,
      dep: rootWatchDep
    }, moduleWatch);

    var _pickDepFns = pickDepFns(true, CATE_MODULE, 'watch', rootWatchDep, module, moduleState, moduleState),
        pickedFns = _pickDepFns.pickedFns,
        setted = _pickDepFns.setted,
        changed = _pickDepFns.changed;

    pickedFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        setted: setted,
        changed: changed,
        stateModule: module,
        refModule: null,
        oldState: moduleState,
        committedState: moduleState,
        refCtx: null
      };
      var fistDepKey = depKeys[0];

      if (depKeys.length === 1 && fistDepKey !== '*') {
        fn(moduleState[fistDepKey], moduleState[fistDepKey], fnCtx);
      } else {
        fn(moduleState, moduleState, fnCtx);
      }
    });
  }

  var safeGetObjectFromObject$2 = safeGetObjectFromObject,
      isPlainJsonObject$4 = isPlainJsonObject;
  function initModuleComputed (module, computed, append, configureDep) {
    if (append === void 0) {
      append = false;
    }

    if (configureDep === void 0) {
      configureDep = true;
    }

    if (!isPlainJsonObject$4(computed)) {
      throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
    }

    checkModuleName(module, false, "computed." + module + " is invalid");
    var ccComputed = ccContext.computed;
    var rootState = ccContext.store.getState();
    var rootComputedValue = ccComputed.getRootComputedValue();
    var rootComputedDep = ccComputed.getRootComputedDep();
    var rootComputedRaw = ccComputed.getRootComputedRaw();

    if (append) {
      var ori = rootComputedRaw[module];
      if (ori) Object.assign(ori, computed);else rootComputedRaw[module] = computed;
    } else {
      rootComputedRaw[module] = computed;
    }

    var moduleState = rootState[module];

    if (configureDep === true) {
      configureDepFns(CATE_MODULE, {
        module: module,
        state: moduleState,
        dep: rootComputedDep
      }, computed);
    }

    var _pickDepFns = pickDepFns(true, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, moduleState),
        pickedFns = _pickDepFns.pickedFns,
        setted = _pickDepFns.setted,
        changed = _pickDepFns.changed;

    pickedFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        setted: setted,
        changed: changed,
        stateModule: module,
        refModule: null,
        oldState: moduleState,
        committedState: moduleState,
        refCtx: null
      };
      var fistDepKey = depKeys[0];
      var computedValue;

      if (depKeys.length === 1 && fistDepKey !== '*') {
        computedValue = fn(moduleState[fistDepKey], moduleState[fistDepKey], fnCtx);
      } else {
        computedValue = fn(moduleState, moduleState, fnCtx);
      }

      var moduleComputedValue = safeGetObjectFromObject$2(rootComputedValue, module);
      moduleComputedValue[retKey] = computedValue;
    });
  }

  var isPlainJsonObject$5 = isPlainJsonObject,
      okeys$7 = okeys;
  /** 对已有的store.$$global状态追加新的state */
  // export function appendGlobalState(globalState) {
  //   // todo
  // }

  function configStoreState(storeState) {
    if (!isPlainJsonObject$5(storeState)) {
      throw new Error("the storeState is not a plain json object!");
    }

    var store = ccContext.store;
    store.initStateDangerously(MODULE_CC, {});
    if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
    if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
    var moduleNames = okeys$7(storeState);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      var moduleState = storeState[moduleName];
      initModuleState(moduleName, moduleState);
    }
  }
  /**
   * 
   * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
   */

  function configRootReducer(rootReducer) {
    if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
    if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
    var moduleNames = okeys$7(rootReducer);
    var len = moduleNames.length;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];
      initModuleReducer(moduleName, rootReducer[moduleName]);
    }
  }
  function configRootComputed(computed) {
    if (!isPlainJsonObject$5(computed)) {
      throw new Error("StartUpOption.computed is not a plain json object!");
    }

    var moduleNames = okeys$7(computed);
    moduleNames.forEach(function (m) {
      return initModuleComputed(m, computed[m]);
    });
  }
  function configRootWatch(watch) {
    if (!isPlainJsonObject$5(watch)) {
      throw new Error("StartUpOption.watch is not a plain json object!");
    }

    var moduleNames = Object.keys(watch);
    moduleNames.forEach(function (m) {
      return initModuleWatch(m, watch[m]);
    });
  }
  function executeRootInit(init) {
    if (!init) return;

    if (!isPlainJsonObject$5(init)) {
      throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
    }

    var moduleNames = okeys$7(init);
    moduleNames.forEach(function (moduleName) {
      checkModuleName(moduleName, false, "there is no module state defined in store for init." + moduleName);
      var initFn = init[moduleName];

      if (initFn) {
        co(initFn).then(function (state) {
          makeSetStateHandler(moduleName)(state);
        });
      }
    });
    ccContext.init._init = init;
  }
  function configModuleSingleClass(moduleSingleClass) {
    if (!isPlainJsonObject$5(moduleSingleClass)) {
      throw new Error("StartupOption.moduleSingleClass is not a plain json object!");
    }

    safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
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
    }
  }

  var appendDispatcher = (function (Dispatcher) {
    var box = document.querySelector("#" + CC_DISPATCHER_BOX);

    if (!box) {
      box = document.createElement('div');
      box.id = CC_DISPATCHER_BOX;
      var boxSt = box.style;
      boxSt.position = 'fixed';
      boxSt.left = 0;
      boxSt.top = 0;
      boxSt.display = 'none';
      boxSt.zIndex = -888666;
      document.body.append(box);
    }

    ReactDOM.render(React.createElement(Dispatcher), box);
  });

  var justCalledByStartUp = false;
  /**
    CodeSandbox ide里，当runConcent.js单独放置时，代码结构如下
      import React, { Component } from "react";
      import ReactDom from "react-dom";
      import "./runConcent";
      import App from "./App";
      import { clearContextIfHot } from "concent";

      clearContextIfHot();
      ReactDom.render(<App />, document.getElementById("root"));
   * 
   * 如果只修改了其他地方的代码属于App相关依赖的代码，查看dom结构返现热加载直接将dispatcher div标签丢弃，
   * 同时refs里也没有dispatcher引用了，这里做一次额外检查
   */

  function _checkDispatcher() {
    if (!ccContext.refs[CC_DISPATCHER]) {
      var Dispatcher = createDispatcher();
      appendDispatcher(Dispatcher);
    }
  }

  function _clearInsAssociation(recomputed) {
    clearObject(ccContext.event_handlers_);
    clearObject(ccContext.ccUKey_handlerKeys_);
    clearObject(ccContext.renderKey_ccUkeys_);
    var cct = ccContext.ccClassKey_ccClassContext_;
    Object.keys(cct).forEach(function (ccClassKey) {
      var ctx = cct[ccClassKey];
      clearObject(ctx.ccKeys);
    });
    clearObject(ccContext.handlerKey_handler_);
    clearObject(ccContext.ccUkey_ref_, [CC_DISPATCHER]);
    clearObject(ccContext.refs, [CC_DISPATCHER]);

    if (recomputed) {
      var rootState = ccContext.store._state;
      var computedValue = ccContext.computed._computedValue;
      var modules = okeys(rootState);
      modules.forEach(function (m) {
        if (m === MODULE_CC) return; //进入recomputed逻辑，不需要配置dep依赖了

        if (computedValue[m]) initModuleComputed(m, computedValue[m], false, false);
      });
    }
  }

  function _clearAll(recomputed) {
    if (recomputed === void 0) {
      recomputed = false;
    }

    clearObject(ccContext.globalStateKeys);
    clearObject(ccContext.reducer._reducer);
    clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER], {});
    clearObject(ccContext.computed._computedDep);
    clearObject(ccContext.computed._computedValue);
    clearObject(ccContext.watch._watchDep);
    clearObject(ccContext.middlewares);
    clearCachedData();

    _clearInsAssociation(recomputed);
  }

  function _prepareClear(cb) {
    if (ccContext.isCcAlreadyStartup) {
      if (ccContext.isHotReloadMode()) {
        cb();
      } else {
        console.warn("clear failed because of not running under hot reload mode!");
      }
    } else {
      //还没有启动过，泽只是标记justCalledByStartUp为true
      justCalledByStartUp = true;
    }
  }

  function clearContextIfHot (clearAll, warningErrForClearAll) {
    if (clearAll === void 0) {
      clearAll = false;
    }

    _prepareClear(function () {
      if (clearAll) {
        justCalledByStartUp = true;

        _clearAll();

        console.warn(warningErrForClearAll);
      } else {
        // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
        // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命名单独放置在一个脚本里，
        // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
        // runConcent调用清理把justCalledByStartUp置为true，则renderApp就可以不用执行了
        // 随后只是改了某个component文件时，则只会触发 renderApp，
        // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
        if (justCalledByStartUp) {
          justCalledByStartUp = false;
          return;
        }

        console.warn("attention: method[clearContextIfHot] need been invoked before your app rendered!");

        _checkDispatcher(); // !!!重计算各个模块的computed结果


        _clearInsAssociation(true);
      }
    });
  }

  var justTip$1 = justTip,
      bindToWindow$1 = bindToWindow,
      makeError$4 = makeError;
  function startup (_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$store = _ref.store,
        store = _ref$store === void 0 ? {} : _ref$store,
        _ref$reducer = _ref.reducer,
        reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
        _ref$init = _ref.init,
        init = _ref$init === void 0 ? null : _ref$init,
        _ref$computed = _ref.computed,
        computed = _ref$computed === void 0 ? {} : _ref$computed,
        _ref$watch = _ref.watch,
        watch = _ref$watch === void 0 ? {} : _ref$watch,
        _ref$moduleSingleClas = _ref.moduleSingleClass,
        moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
        _ref$middlewares = _ref.middlewares,
        middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
        _ref$plugins = _ref.plugins,
        plugins = _ref$plugins === void 0 ? [] : _ref$plugins,
        _ref$isStrict = _ref.isStrict,
        isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
        _ref$isDebug = _ref.isDebug,
        isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
        _ref$errorHandler = _ref.errorHandler,
        errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
        _ref$isHot = _ref.isHot,
        isHot = _ref$isHot === void 0 ? false : _ref$isHot,
        _ref$autoCreateDispat = _ref.autoCreateDispatcher,
        autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat,
        _ref$bindCtxToMethod = _ref.bindCtxToMethod,
        bindCtxToMethod = _ref$bindCtxToMethod === void 0 ? false : _ref$bindCtxToMethod,
        _ref$computedCompare = _ref.computedCompare,
        computedCompare = _ref$computedCompare === void 0 ? true : _ref$computedCompare,
        _ref$watchCompare = _ref.watchCompare,
        watchCompare = _ref$watchCompare === void 0 ? true : _ref$watchCompare,
        _ref$watchImmediate = _ref.watchImmediate,
        watchImmediate = _ref$watchImmediate === void 0 ? false : _ref$watchImmediate;

    try {
      justTip$1("cc version " + ccContext.info.version);
      ccContext.isHot = isHot;
      ccContext.errorHandler = errorHandler;
      ccContext.isStrict = isStrict;
      ccContext.isDebug = isDebug;
      ccContext.bindCtxToMethod = bindCtxToMethod;
      ccContext.computedCompare = computedCompare;
      ccContext.watchCompare = watchCompare;
      ccContext.watchImmediate = watchImmediate;
      var err = makeError$4(ERR.CC_ALREADY_STARTUP);
      clearContextIfHot(true, err);
      configModuleSingleClass(moduleSingleClass);
      configStoreState(store);
      configRootReducer(reducer);
      configRootComputed(computed);
      configRootWatch(watch);
      executeRootInit(init);
      configMiddlewares(middlewares);

      if (autoCreateDispatcher) {
        if (!ccContext.refs[CC_DISPATCHER]) {
          var Dispatcher = createDispatcher();
          appendDispatcher(Dispatcher);
          justTip$1("[[startUp]]: cc create a CcDispatcher automatically");
        } else {
          justTip$1("[[startUp]]: CcDispatcher existed already");
        }
      } else {
        throw new Error('customizing Dispatcher is not allowed in current version Concent');
      }

      var bindOthers = function bindOthers(bindTarget) {
        bindToWindow$1('CC_CONTEXT', ccContext, bindTarget);
        bindToWindow$1('ccc', ccContext, bindTarget);
        bindToWindow$1('cccc', ccContext.computed._computedValue, bindTarget);
        bindToWindow$1('sss', ccContext.store._state, bindTarget);
      };

      if (window.mcc) {
        setTimeout(function () {
          //延迟绑定，等待ccns的输入
          bindOthers(window.mcc[getCcNamespace()]);
        }, 1200);
      } else {
        bindOthers();
      }

      ccContext.isCcAlreadyStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

      configPlugins(plugins);
    } catch (err) {
      if (errorHandler) errorHandler(err);else throw err;
    }
  }

  var ccGlobalStateKeys$1 = ccContext.globalStateKeys;
  var makeError$5 = makeError,
      verboseInfo$3 = verboseInfo,
      isPlainJsonObject$6 = isPlainJsonObject,
      okeys$8 = okeys;

  function setGlobalState(storedGlobalState, inputGlobalState) {
    if (inputGlobalState) {
      if (!isPlainJsonObject$6(inputGlobalState)) {
        throw new Error("option.globalState is not a plain json object");
      }

      var gKeys = okeys$8(inputGlobalState);
      gKeys.forEach(function (gKey) {
        if (storedGlobalState.hasOwnProperty(gKey)) {
          throw new Error("key[" + gKey + "] duplicated in globalState");
        }

        ccGlobalStateKeys$1.push(gKey);
        storedGlobalState[gKey] = inputGlobalState[gKey];
      });
    }
  }
  /**
   * @description configure module、state、option to cc
   * @author zzk
   * @export
   * @param {string} module
   * @param {{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean}} config
   * @param {object} [option] reducer、init
   * @param {{[reducerModuleName:string]:{[fnName:string]:function}}} [option.reducer]
   * @param {object} [option.globalState] will been merged to $$global module state
   * @param {object} [option.globalWatch] will been merged to $$global module watch
   * @param {object} [option.globalComputed] will been merged to $$global module computed
   * @param {function[]} [option.middlewares]
   */


  function configure (module, config, option) {
    if (option === void 0) {
      option = {};
    }

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet, you can not call cc.configure!');
    }

    if (!isPlainJsonObject$6(config)) {
      throw new Error('[[configure]] param type error, config is not plain json object!');
    }

    if (module === MODULE_GLOBAL) {
      throw new Error('cc do not allow configure global module');
    }

    var state = config.state,
        reducer = config.reducer,
        computed = config.computed,
        watch = config.watch,
        init = config.init,
        isClassSingle = config.isClassSingle;
    var _option = option,
        optionReducer = _option.reducer,
        globalState = _option.globalState,
        globalWatch = _option.globalWatch,
        globalComputed = _option.globalComputed,
        middlewares = _option.middlewares;
    initModuleState(module, state, true, 'configure');
    initModuleReducer(module, reducer, true, 'configure');
    var _state = ccContext.store._state;
    var _reducer = ccContext.reducer._reducer;
    _state[module] = state;
    computed && initModuleComputed(module, computed);
    watch && initModuleWatch(module, watch);
    ccContext.moduleSingleClass[module] = isClassSingle === true;

    if (optionReducer) {
      if (!isPlainJsonObject$6(optionReducer)) {
        throw makeError$5(ERR.CC_OPTION_REDUCER_INVALID, verboseInfo$3("configure module[" + module + "]"));
      }

      var reducerModuleNames = Object.keys(optionReducer);
      reducerModuleNames.forEach(function (rmName) {
        checkModuleName(rmName);
        var moduleReducer = optionReducer[rmName];

        if (!isPlainJsonObject$6(moduleReducer)) {
          throw makeError$5(ERR.CC_OPTION_REDUCER_FVALUE_INVALID, verboseInfo$3("configure module[" + module + "], option.reducer." + rmName));
        }

        if (rmName === MODULE_GLOBAL) {
          //merge input globalReducer to existed globalReducer
          var fnNames = Object.keys(moduleReducer);
          var globalReducer = _reducer[MODULE_GLOBAL];
          fnNames.forEach(function (fnName) {
            if (globalReducer[fnName]) {
              throw makeError$5(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo$3("type " + fnName));
            }

            var reducerFn = moduleReducer[fnName];

            if (typeof reducerFn !== 'function') {
              throw makeError$5(ERR.CC_REDUCER_NOT_A_FUNCTION);
            }

            globalReducer[fnName] = reducerFn;
          });
        } else {
          _reducer[rmName] = moduleReducer;
        }
      });
    }

    if (reducer) {
      if (!isPlainJsonObject$6(reducer)) {
        throw makeError$5(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo$3("config.reducer is not a plain json object"));
      }

      _reducer[module] = reducer;
    }

    var storedGlobalState = _state[MODULE_GLOBAL]; //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算

    setGlobalState(storedGlobalState, globalState, 'State');
    if (globalComputed) initModuleComputed(MODULE_GLOBAL, globalComputed, true);
    if (globalWatch) initModuleWatch(MODULE_GLOBAL, globalWatch, true);

    if (init) {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function!');
      }

      init(makeSetStateHandler(module));
    }

    if (middlewares && middlewares.length > 0) {
      var ccMiddlewares = ccContext.middlewares;
      middlewares.forEach(function (m) {
        if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
        ccMiddlewares.push(m);
      });
    }

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
      fn.__reducerModule = moduleName;
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

    if (!ccContext.isCcAlreadyStartup) {
      throw new Error('cc is not startup yet');
    }

    checkModuleNameBasically(newModule);
    checkModuleName(existingModule, false);
    var mState = ccContext.store.getState(existingModule);
    var stateCopy = clone(mState);
    if (state) Object.assign(stateCopy, state);
    var reducerOriginal = ccContext.reducer._reducer[existingModule] || {}; // attach  __fnName  __stateModule __reducerModule, 不能污染原函数的dispatch逻辑里需要的__stateModule __reducerModule

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

  var isPlainJsonObject$7 = isPlainJsonObject,
      okeys$9 = okeys,
      isObjectNotNull$2 = isObjectNotNull;

  var pError = function pError(label) {
    throw new Error("[[run]]: param error, " + label + " is not a plain json object");
  };
  /**
   * run will call startup
   * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
   * @param {{isStrict:boolean}} option
   */


  function _run (store, option) {
    if (store === void 0) {
      store = {};
    }

    if (option === void 0) {
      option = {};
    }

    if (!isPlainJsonObject$7(store)) pError('store');
    if (!isPlainJsonObject$7(option)) pError('option');
    var _store = {};
    var _reducer = {};
    var _watch = {};
    var _computed = {};
    var _init = {};
    var _moduleSingleClass = {}; // traversal moduleNames

    okeys$9(store).forEach(function (m) {
      var config = store[m];
      var state = config.state,
          reducer = config.reducer,
          watch = config.watch,
          computed = config.computed,
          init = config.init,
          isClassSingle = config.isClassSingle;
      if (state) _store[m] = state;
      if (reducer) _reducer[m] = reducer;
      if (watch) _watch[m] = watch;
      if (computed) _computed[m] = computed;
      if (init) _init[m] = init;
      _moduleSingleClass[m] = isClassSingle === true;
    });
    if (!isObjectNotNull$2(_init)) _init = null;
    var startupOption = {
      store: _store,
      reducer: _reducer,
      watch: _watch,
      computed: _computed,
      init: _init,
      moduleSingleClass: _moduleSingleClass
    };
    var _option = option,
        middlewares = _option.middlewares,
        plugins = _option.plugins,
        isStrict = _option.isStrict,
        isDebug = _option.isDebug,
        errorHandler = _option.errorHandler,
        isHot = _option.isHot,
        autoCreateDispatcher = _option.autoCreateDispatcher,
        reducer = _option.reducer,
        bindCtxToMethod = _option.bindCtxToMethod,
        computedCompare = _option.computedCompare,
        watchCompare = _option.watchCompare,
        watchImmediate = _option.watchImmediate;

    if (reducer) {
      if (!isPlainJsonObject$7(reducer)) pError('option.reducer');
      okeys$9(reducer).forEach(function (reducerModule) {
        if (_reducer[reducerModule]) throw new Error("reducerModule[" + reducerModule + "] has been declared in store");
        var reducerFns = reducer[reducerModule];
        _reducer[reducerModule] = reducerFns;
      });
    } // merge startupOption


    Object.assign(startupOption, {
      middlewares: middlewares,
      plugins: plugins,
      isStrict: isStrict,
      isDebug: isDebug,
      errorHandler: errorHandler,
      isHot: isHot,
      autoCreateDispatcher: autoCreateDispatcher,
      bindCtxToMethod: bindCtxToMethod,
      computedCompare: computedCompare,
      watchCompare: watchCompare,
      watchImmediate: watchImmediate
    });
    startup(startupOption);
  }

  /****
   * @param {string} ccClassKey a cc class's name, you can register a same react class to cc with different ccClassKey,
   * but you can not register multi react class with a same ccClassKey!
   * @param {object} registerOption
   * @param {string} [registerOption.module] declare which module current cc class belong to, default is '$$default'
   * @param {Array<string>|string} [registerOption.watchedKeys] 
   * declare current cc class's any instance is concerned which state keys's state changing,
   * @param {{ [moduleName:string]: keys: string[] | '*' }} [registerOption.connect]
   * @param {string} [registerOption.reducerModule] default is equal as module if you don't declare it
   * if you call cc instance api $$dispatch without module and reducerMoudle like below
   * ```
   *    this.$$dispatch({type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('doStaff', {foo:1, bar:2});
   * ```
   * cc will find current cc class's reducerModule function named doStaff to execute 
   * and will change current cc class's moudle state,
   * so you don't have to write code like below if current cc class module is M1 
   * and if you always want to use R1 reducer function to generate new state, you can write like below
   * ```
   *    this.$$dispatch({module:'M1', reducerModule:'R1', type:'doStaff', payload:{foo:1, bar:2}});
   *    // or 
   *    this.$$dispatch('M1/R1/doStaff', {foo:1, bar:2});
   * ```
   * 
   * ============   !!!!!!  ============
   * note if you really want to change other module's state and use other reducer function, you must input module and reducerModule
   * in your $$dispatch method, or they will been replaced by current cc class's default module and default reducerModule
   * ```
   *    this.$$dispatch({module:'M2', reducerModule:'R2', type:'doStaff', payload:{foo:1, bar:2}});
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
   *        const {regularFormSubmitting} = this.props.$$connectedState.from;
   *      }
   *    }
   * ```
   * more details you can see https://github.com/fantasticsoul/rcc-antd-pro/blob/master/src/routes/Forms/BasicForm.js
   * @param {string} [registerOption.isSingle] default is false
   * if you only allow current cc class only initialize one time, 
   * that means there is only one cc instance can be existed for current cc class at most,
   * you can define registerOption.isSingle as true, it just like singleton mode in java coding^_^
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

  var shallowDiffers$2 = shallowDiffers,
      getRegisterOptions$1 = getRegisterOptions;
  var moduleName_stateKeys_$5 = ccContext.moduleName_stateKeys_;
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
          watchedKeys = _registerOptions$watc === void 0 ? '*' : _registerOptions$watc,
          _registerOptions$conn = registerOptions.connect,
          connect = _registerOptions$conn === void 0 ? {} : _registerOptions$conn,
          reducerModule = registerOptions.reducerModule,
          _registerOptions$stat = registerOptions.state,
          state = _registerOptions$stat === void 0 ? {} : _registerOptions$stat,
          isSingle = registerOptions.isSingle,
          storedKeys = registerOptions.storedKeys;
      var ccClassKey = props.ccClassKey,
          ccKey = props.ccKey,
          _props$ccOption = props.ccOption,
          ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
      var target_storedKeys = storedKeys;
      var target_reducerModule = reducerModule;
      var target_watchedKeys = watchedKeys;
      var target_ccClassKey = ccClassKey;
      var target_connect = connect; //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb已在外部注册过）

      if (props.__$$regDumb !== true) {
        var _storedKeys = getStoredKeys(state, moduleName_stateKeys_$5[module], ccOption.storedKeys, registerOptions.storedKeys);

        var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_FRAGMENT_PREFIX, watchedKeys, _storedKeys, connect, reducerModule, true),
            _reducerModule = _mapRegistrationInfo._reducerModule,
            _watchedKeys = _mapRegistrationInfo._watchedKeys,
            _ccClassKey = _mapRegistrationInfo._ccClassKey,
            _connect = _mapRegistrationInfo._connect;

        target_storedKeys = _storedKeys;
        target_reducerModule = _reducerModule;
        target_watchedKeys = _watchedKeys;
        target_ccClassKey = _ccClassKey;
        target_connect = _connect;
      } //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys


      buildRefCtx(_assertThisInitialized(_this), {
        isSingle: isSingle,
        ccKey: ccKey,
        connect: target_connect,
        state: state,
        module: module,
        reducerModule: target_reducerModule,
        storedKeys: target_storedKeys,
        watchedKeys: target_watchedKeys,
        tag: tag,
        ccClassKey: target_ccClassKey,
        ccOption: ccOption,
        type: CC_FRAGMENT_PREFIX
      }, lite);
      _this.__$$compareProps = compareProps; //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
      //无需在将要给废弃的componentWillMount里调用beforeMount

      beforeMount(_assertThisInitialized(_this), setup, bindCtxToMethod);
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
      this.ctx.props = getOutProps(thisProps);
      var children = thisProps.children,
          render = thisProps.render;
      var view = render || children;

      if (typeof view === 'function') {
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

  function _registerDumb(Dumb, isSingle, module, reducerModule, watchedKeys, storedKeys, persistStoredKeys, connect, state, setup, bindCtxToMethod, ccClassKey, tag, mapProps, props, compareProps, lite) {
    //对state做克隆,防止用同一个connectDumb结果包不同的fn组件,共享了同一份state
    //const c = registerDumb({state:{info:{a:1}}});
    // const UI1_ = c(UI1); const UI2_ = c(UI2);
    // 让UI1_和UI2_各自拥有自己的localState
    var stateType = typeof state;
    var clonedState = null;
    if (stateType === 'function') clonedState = state();else if (stateType !== 'object') {
      throw new Error('state must be a plain json object');
    } else {
      clonedState = clone(state);
    }

    var render = function render(ctx) {
      if (mapProps) {
        ctx.mapped = mapProps(ctx);
        return React.createElement(Dumb, ctx.mapped);
      } else {
        return React.createElement(Dumb, ctx);
      }
    }; //优先读取实例化的时候传入的，再读connectDumb配置的


    var ccOption = props.ccOption || {
      persistStoredKeys: persistStoredKeys
    };
    var passProps = {
      __$$regDumb: true,
      props: props,
      ccOption: ccOption,
      ccClassKey: ccClassKey,
      render: render,
      ccKey: props.ccKey,
      register: {
        isSingle: isSingle,
        tag: tag,
        module: module,
        reducerModule: reducerModule,
        lite: lite,
        watchedKeys: watchedKeys,
        storedKeys: storedKeys,
        connect: connect,
        state: clonedState,
        setup: setup,
        bindCtxToMethod: bindCtxToMethod,
        compareProps: compareProps
      }
    }; //ccKey由实例化的Dumb组件props上透传下来

    return React.createElement(CcFragment, passProps);
  }

  function registerDumb (registerOption, ccClassKey) {
    var _registerOption = getRegisterOptions(registerOption);

    var renderKeyClasses = _registerOption.renderKeyClasses,
        isSingle = _registerOption.isSingle,
        tag = _registerOption.tag,
        mapProps = _registerOption.mapProps,
        _registerOption$modul = _registerOption.module,
        module = _registerOption$modul === void 0 ? MODULE_DEFAULT : _registerOption$modul,
        reducerModule = _registerOption.reducerModule,
        _registerOption$watch = _registerOption.watchedKeys,
        watchedKeys = _registerOption$watch === void 0 ? '*' : _registerOption$watch,
        storedKeys = _registerOption.storedKeys,
        persistStoredKeys = _registerOption.persistStoredKeys,
        Dumb = _registerOption.render,
        _registerOption$conne = _registerOption.connect,
        connect = _registerOption$conne === void 0 ? {} : _registerOption$conne,
        _registerOption$state = _registerOption.state,
        state = _registerOption$state === void 0 ? {} : _registerOption$state,
        setup = _registerOption.setup,
        bindCtxToMethod = _registerOption.bindCtxToMethod,
        compareProps = _registerOption.compareProps,
        lite = _registerOption.lite;

    var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
        _module = _mapRegistrationInfo._module,
        _reducerModule = _mapRegistrationInfo._reducerModule,
        _watchedKeys = _mapRegistrationInfo._watchedKeys,
        _ccClassKey = _mapRegistrationInfo._ccClassKey,
        _connect = _mapRegistrationInfo._connect;

    function buildCcFragComp(Dumb) {
      //避免react dev tool显示的dom为Unknown
      var ConnectedFragment = function ConnectedFragment(props) {
        return _registerDumb(Dumb, isSingle, _module, _reducerModule, _watchedKeys, storedKeys, persistStoredKeys, _connect, state, setup, bindCtxToMethod, _ccClassKey, tag, mapProps, props, compareProps, lite);
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

  var ccUkey_ref_$3 = ccContext.ccUkey_ref_,
      moduleName_stateKeys_$6 = ccContext.moduleName_stateKeys_;
  var refCursor = 1;
  var cursor_refKey_ = {};

  function getUsableCursor() {
    return refCursor;
  }

  function incCursor() {
    refCursor = refCursor + 1;
  }

  var makeSetState = function makeSetState(ccHookState, hookSetState) {
    return function (partialState, cb) {
      ccHookState.state = Object.assign({}, ccHookState.state, partialState);
      var newHookState = Object.assign({}, ccHookState);
      hookSetState(newHookState); // 和class setState(partialState, cb); 保持一致

      if (cb) cb(newHookState);
    };
  };

  var makeForceUpdate = function makeForceUpdate(ccHookState, hookSetState) {
    return function (cb) {
      var newHookState = Object.assign({}, ccHookState);
      hookSetState(newHookState);
      if (cb) cb(newHookState);
    };
  };

  function CcHook(ccHookState, hookSetState, props) {
    this.setState = makeSetState(ccHookState, hookSetState);
    this.forceUpdate = makeForceUpdate(ccHookState, hookSetState);
    this.state = ccHookState.state;
    this.isFirstRendered = true;
    this.props = props;
  } //写为具名函数，防止react devtoo里显示.default


  function useConcent(registerOption, ccClassKey) {
    var _registerOption = getRegisterOptions(registerOption);

    var _registerOption$state = _registerOption.state,
        state = _registerOption$state === void 0 ? {} : _registerOption$state,
        _registerOption$props = _registerOption.props,
        props = _registerOption$props === void 0 ? {} : _registerOption$props,
        mapProps = _registerOption.mapProps;
    var reactUseState = React.useState;

    if (!reactUseState) {
      throw new Error('make sure your react version is LTE 16.8');
    }

    var cursor = getUsableCursor();

    var _reactUseState = reactUseState({
      cursor: cursor,
      state: state
    }),
        ccHookState = _reactUseState[0],
        hookSetState = _reactUseState[1];

    var nowCursor = ccHookState.cursor;
    var isFirstRendered = nowCursor === cursor;
    var hookRef;

    if (isFirstRendered) {
      var renderKeyClasses = _registerOption.renderKeyClasses,
          module = _registerOption.module,
          reducerModule = _registerOption.reducerModule,
          _registerOption$watch = _registerOption.watchedKeys,
          watchedKeys = _registerOption$watch === void 0 ? '*' : _registerOption$watch,
          _registerOption$store = _registerOption.storedKeys,
          storedKeys = _registerOption$store === void 0 ? [] : _registerOption$store,
          persistStoredKeys = _registerOption.persistStoredKeys,
          _registerOption$conne = _registerOption.connect,
          connect = _registerOption$conne === void 0 ? {} : _registerOption$conne,
          setup = _registerOption.setup,
          bindCtxToMethod = _registerOption.bindCtxToMethod,
          lite = _registerOption.lite;
      incCursor();

      var _mapRegistrationInfo = mapRegistrationInfo(module, ccClassKey, renderKeyClasses, CC_HOOK_PREFIX, watchedKeys, storedKeys, connect, reducerModule, true),
          _module = _mapRegistrationInfo._module,
          _reducerModule = _mapRegistrationInfo._reducerModule,
          _watchedKeys = _mapRegistrationInfo._watchedKeys,
          _ccClassKey = _mapRegistrationInfo._ccClassKey,
          _connect = _mapRegistrationInfo._connect;

      hookRef = new CcHook(ccHookState, hookSetState, props);
      var ccOption = props.ccOption || {
        persistStoredKeys: persistStoredKeys
      };

      var _storedKeys = getStoredKeys(state, moduleName_stateKeys_$6[_module], ccOption.storedKeys, storedKeys);

      var params = Object.assign({}, _registerOption, {
        module: _module,
        reducerModule: _reducerModule,
        watchedKeys: _watchedKeys,
        type: CC_HOOK_PREFIX,
        ccClassKey: _ccClassKey,
        connect: _connect,
        ccOption: ccOption,
        storedKeys: _storedKeys
      });
      buildRefCtx(hookRef, params, lite);
      beforeMount(hookRef, setup, bindCtxToMethod);
      cursor_refKey_[nowCursor] = hookRef.ctx.ccUniqueKey;
    } else {
      var refKey = cursor_refKey_[nowCursor];
      hookRef = ccUkey_ref_$3[refKey];
      var _refCtx = hookRef.ctx; //existing period, replace reactSetState and reactForceUpdate

      _refCtx.reactSetState = makeSetState(ccHookState, hookSetState);
      _refCtx.reactForceUpdate = makeForceUpdate(ccHookState, hookSetState);
    }

    var refCtx = hookRef.ctx;
    refCtx.props = props; // ???does user really need beforeMount,mounted,beforeUpdate,updated,beforeUnmount in setup???
    //after every render

    React.useEffect(function () {
      if (!hookRef.isFirstRendered) {
        // mock componentDidUpdate
        didUpdate(hookRef);
      }
    }); //after first render

    React.useEffect(function () {
      // mock componentDidMount
      hookRef.isFirstRendered = false;
      didMount(hookRef);
      return function () {
        // mock componentWillUnmount
        beforeUnmount(hookRef);
      };
    }, []); // before every render

    if (mapProps) {
      var mapped = mapProps(refCtx);

      if (!isPlainJsonObject(mapped)) {
        throw new Error('mapProps must return an plain json object');
      }

      refCtx.mapped = mapped;
    }

    return refCtx;
  }

  function registerHookComp(options, ccClassKey) {
    var _options = getRegisterOptions(options);

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

  var vbi$6 = verboseInfo;
  /**
   * @description
   * @author zzk
   * @export
   * @param {string} keyDesc '{ccClassKey}' |  '{ccClassKey}/'  | '{ccClassKey}/{ccKey}'
   * @param {string} method
   * @param {any[]} args
   * @returns
   */

  function _call (keyDesc, method) {
    var _ref$method;

    var ccClassKey_ccClassContext_ = ccContext.ccClassKey_ccClassContext_,
        ccUkey_ref_ = ccContext.ccUkey_ref_;
    var ccClassKey = '';
    var ccKey = '';

    if (keyDesc.includes('/')) {
      var _keyDesc$split = keyDesc.split('/'),
          key1 = _keyDesc$split[0],
          key2 = _keyDesc$split[1];

      ccClassKey = key1;
      ccKey = key2;
    } else {
      ccClassKey = keyDesc;
    }

    var classContext = ccClassKey_ccClassContext_[ccClassKey];

    if (!classContext) {
      var err = makeError(ERR.CC_CLASS_NOT_FOUND, vbi$6("ccClassKey:" + ccClassKey));
      if (ccContext.isStrict) throw err;else return console.error(err);
    }

    var ref;

    if (ccKey) {
      var ccUniKey = makeUniqueCcKey(ccClassKey, ccKey);
      ref = ccUkey_ref_[ccUniKey];
    } else {
      var ccKeys = classContext.ccKeys;
      ref = ccUkey_ref_[ccKeys[0]]; // pick first one
    }

    if (!ref) {
      var _err = makeError(ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi$6("ccClassKey:" + ccClassKey + " ccKey:" + ccKey)); // only error, the target instance may has been unmounted really!


      return console.error(_err.message);
    }

    var fn = ref[method];

    if (!fn) {
      var _err2 = makeError(ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi$6("method:" + method)); // only error


      return console.error(_err2.message);
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
  }

  /****
   * if you are sure the input state is really belong to global state, call cc.setGlobalState,
   * note! cc will filter the input state to meet global state shape and only pass the filtered state to global module
   */

  function setGlobalState$1 (state, cb, delay, idt, throwError) {
    if (throwError === void 0) {
      throwError = false;
    }

    try {
      var ref = pickOneRef();
      ref.ctx.setGlobalState(state, cb, delay, idt);
    } catch (err) {
      if (throwError) throw err;else justWarning(err.message);
    }
  }

  function throwApiCallError() {
    throw new Error("api doc: cc.setState(module:string, state:object, renderKey:string, delayMs?:number, skipMiddleware?:boolean, throwError?:boolean)");
  }

  function _setState (module, state, renderKey, delayMs, skipMiddleware, throwError) {
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

    setState$1(module, state, renderKey, delayMs, skipMiddleware, throwError);
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

  var ccUkey_ref_$4 = ccContext.ccUkey_ref_,
      ccClassKey_ccClassContext_$6 = ccContext.ccClassKey_ccClassContext_;
  function getRefsByClassKey (ccClassKey) {
    var refs = [];
    var ccClassContext = ccClassKey_ccClassContext_$6[ccClassKey];

    if (!ccClassContext) {
      return refs;
    }

    var ccKeys = ccClassContext.ccKeys;
    ccKeys.forEach(function (k) {
      var ref = ccUkey_ref_$4[k];
      if (ref) refs.push(ref);
    });
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
    var ccUkey_ref_ = ccContext.ccUkey_ref_;
    var ccKeys = okeys(ccUkey_ref_);
    ccKeys.forEach(function (k) {
      var ref = ccUkey_ref_[k];
      if (ref) refs.push(ref);
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

      if (ref.__$$isUnmounted) return;
      if (ref.ctx.execute) (_ref$ctx = ref.ctx).execute.apply(_ref$ctx, args);
    });
  });

  var ccClassKey_ccClassContext_$7 = ccContext.ccClassKey_ccClassContext_;
  var _getConnectedState = (function (ccClassKey) {
    var ctx = ccClassKey_ccClassContext_$7[ccClassKey];
    return ctx.connectedState || {};
  });

  var appendState = ccContext.store.appendState;

  var _reducerCaller = ccContext.reducer._reducerCaller;

  var _lazyReducerCaller = ccContext.reducer._lazyReducerCaller;

  var startup$1 = startup;
  var cloneModule = _cloneModule;
  var run = _run;
  var connect = _connect;
  var connectDumb = _connectDumb;
  var register$2 = register$1;
  var registerDumb$1 = registerDumb;
  var registerHookComp$1 = registerHookComp;
  var configure$1 = configure;
  var call = _call;
  var setGlobalState$2 = setGlobalState$1;
  var setState$2 = _setState;
  var set = _set;
  var setValue$1 = _setValue;
  var getState$7 = getState$6;
  var getGlobalState$1 = getGlobalState;
  var getConnectedState = _getConnectedState;
  var getComputed = _getComputed;
  var emit = _emit;
  var off = _off;
  var dispatch$3 = dispatch$2;
  var lazyDispatch$1 = lazyDispatch;
  var ccContext$1 = ccContext;
  var createDispatcher$1 = createDispatcher;
  var execute = _execute;
  var executeAll = _executeAll;
  var getRefs$1 = getRefs;
  var reducer = _reducerCaller;
  var lazyReducer = _lazyReducerCaller;
  var clearContextIfHot$1 = clearContextIfHot;
  var CcFragment$1 = CcFragment;
  var cst = _cst;
  var appendState$1 = appendState;
  var useConcent$1 = useConcent;
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
    dispatch: dispatch$3,
    lazyDispatch: lazyDispatch$1,
    startup: startup$1,
    run: run,
    call: call,
    setGlobalState: setGlobalState$2,
    setState: setState$2,
    set: set,
    setValue: setValue$1,
    getGlobalState: getGlobalState$1,
    getState: getState$7,
    getComputed: getComputed,
    getConnectedState: getConnectedState,
    ccContext: ccContext$1,
    createDispatcher: createDispatcher$1,
    execute: execute,
    executeAll: executeAll,
    getRefs: getRefs$1,
    reducer: reducer,
    lazyReducer: lazyReducer,
    clearContextIfHot: clearContextIfHot$1,
    CcFragment: CcFragment$1,
    cst: cst,
    appendState: appendState$1,
    useConcent: useConcent$1,
    bindCcToMcc: bindCcToMcc
  };
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


  var multiCcContainer = window.mcc;

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

  exports.startup = startup$1;
  exports.cloneModule = cloneModule;
  exports.run = run;
  exports.connect = connect;
  exports.connectDumb = connectDumb;
  exports.register = register$2;
  exports.registerDumb = registerDumb$1;
  exports.registerHookComp = registerHookComp$1;
  exports.configure = configure$1;
  exports.call = call;
  exports.setGlobalState = setGlobalState$2;
  exports.setState = setState$2;
  exports.set = set;
  exports.setValue = setValue$1;
  exports.getState = getState$7;
  exports.getGlobalState = getGlobalState$1;
  exports.getConnectedState = getConnectedState;
  exports.getComputed = getComputed;
  exports.emit = emit;
  exports.off = off;
  exports.dispatch = dispatch$3;
  exports.lazyDispatch = lazyDispatch$1;
  exports.ccContext = ccContext$1;
  exports.createDispatcher = createDispatcher$1;
  exports.execute = execute;
  exports.executeAll = executeAll;
  exports.getRefs = getRefs$1;
  exports.reducer = reducer;
  exports.lazyReducer = lazyReducer;
  exports.clearContextIfHot = clearContextIfHot$1;
  exports.CcFragment = CcFragment$1;
  exports.cst = cst;
  exports.appendState = appendState$1;
  exports.useConcent = useConcent$1;
  exports.bindCcToMcc = bindCcToMcc;
  exports.default = defaultExport;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
