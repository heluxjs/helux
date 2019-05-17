"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var helper = _interopRequireWildcard(require("./helper"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _createDispatcher = _interopRequireDefault(require("./create-dispatcher"));

var vbi = _util.verboseInfo;
var ss = _util.styleStr;
var cl = _util.color;

function keysWarning(keyWord) {
  (0, _util.justWarning)("now cc is startup with non module mode, cc only allow you define " + keyWord + " like {\"$$default\":{}, \"$$global\":{}}, cc will ignore other module keys");
}

function bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(store)) {
    throw new Error("the store is not a plain json object!");
  }

  if (!(0, _util.isPlainJsonObject)(sharedToGlobalMapping)) {
    throw new Error("the sharedToGlobalMapping is not a plain json object!");
  }

  _ccContext["default"].sharedToGlobalMapping = sharedToGlobalMapping;
  var globalStateKeys = _ccContext["default"].globalStateKeys;
  var pureGlobalStateKeys = _ccContext["default"].pureGlobalStateKeys;
  var _state = _ccContext["default"].store._state;
  var globalState = store[_constant.MODULE_GLOBAL];
  _state[_constant.MODULE_CC] = {};

  if (isModuleMode) {
    var moduleNames = Object.keys(store);

    if (globalState) {
      if (!_util["default"].isModuleStateValid(globalState)) {
        throw _util["default"].makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi("moduleName:" + _constant.MODULE_GLOBAL + "'s state is invalid!"));
      } else {
        console.log(ss('$$global module state found while startup cc!'), cl());
        Object.keys(globalState).forEach(function (key) {
          globalStateKeys.push(key);
        });
      }
    } else {
      console.log(ss('$$global module state not found, cc will generate one for user automatically!'), cl());
      globalState = {};
    }

    _state[_constant.MODULE_GLOBAL] = globalState;
    var len = moduleNames.length;
    var isDefaultModuleExist = false;

    for (var i = 0; i < len; i++) {
      var moduleName = moduleNames[i];

      if (moduleName !== _constant.MODULE_GLOBAL) {
        helper.checkModuleName(moduleName);
        var moduleState = store[moduleName];
        helper.checkModuleState(moduleState, moduleName);

        if (moduleName === _constant.MODULE_DEFAULT) {
          isDefaultModuleExist = true;
          console.log(ss('$$default module state found while startup cc!'), cl());
        }

        _state[moduleName] = moduleState;
        var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

        if (sharedKey_globalKey_) {
          helper.handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
        }
      }
    }

    if (!isDefaultModuleExist) {
      _state[_constant.MODULE_DEFAULT] = {};
      console.log(ss('$$default module state not found,cc will generate one for user automatically!'), cl());
    }
  } else {
    // non module mode
    if (sharedToGlobalMapping && _util["default"].isObjectNotNull(sharedToGlobalMapping)) {
      throw _util["default"].makeError(_constant.ERR.CC_STORE_MAPPING_IS_NOT_ALLOWED_IN_NON_MODULE);
    }

    var includeDefaultModule = store.hasOwnProperty(_constant.MODULE_DEFAULT);
    var includeGlobalModule = store.hasOwnProperty(_constant.MODULE_GLOBAL);
    var invalidKeyCount = 0;

    if (includeDefaultModule || includeGlobalModule) {
      if (includeDefaultModule) {
        if (!_util["default"].isModuleStateValid(store[_constant.MODULE_DEFAULT])) {
          throw _util["default"].makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + _constant.MODULE_DEFAULT + "'s state is invalid!"));
        }

        _state[_constant.MODULE_DEFAULT] = store[_constant.MODULE_DEFAULT];
        invalidKeyCount += 1;
        console.log(ss('$$default module state found while startup cc with non module mode!'), cl());
      } else {
        _state[_constant.MODULE_DEFAULT] = {};
      }

      if (includeGlobalModule) {
        if (!_util["default"].isModuleStateValid(store[_constant.MODULE_GLOBAL])) {
          throw _util["default"].makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + _constant.MODULE_GLOBAL + "'s state is invalid!"));
        }

        globalState = store[_constant.MODULE_GLOBAL];
        Object.keys(globalState).forEach(function (key) {
          return globalStateKeys.push(key);
        });
        invalidKeyCount += 1;
        console.log(ss('$$global module state found while startup cc with non module mode!'), cl());
        _state[_constant.MODULE_GLOBAL] = globalState;
      } else {
        _state[_constant.MODULE_GLOBAL] = {};
      }

      if (Object.keys(store).length > invalidKeyCount) {
        keysWarning('store');
      }
    } else {
      // treat store as $$default module store
      if (!_util["default"].isModuleStateValid(store)) {
        throw _util["default"].makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi(" moduleName:" + _constant.MODULE_DEFAULT + "'s state  is invalid!"));
      }

      _state[_constant.MODULE_DEFAULT] = store;
    }
  }

  var globalMappingKey_sharedKey_ = _ccContext["default"].globalMappingKey_sharedKey_;
  globalStateKeys.reduce(function (pKeys, gKey) {
    if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
    return pKeys;
  }, pureGlobalStateKeys);
}
/**
 * @description
 * @author zzk
 * @param {*} reducer may like: {user:{getUser:()=>{}, setUser:()=>{}}, product:{...}}
 */


function bindReducerToCcContext(reducer) {
  var _reducer = _ccContext["default"].reducer._reducer;
  var moduleNames = Object.keys(reducer);
  var len = moduleNames.length;
  var isDefaultReducerExist = false,
      isGlobalReducerExist = false;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    helper.checkModuleName(moduleName, true);
    _reducer[moduleName] = reducer[moduleName];
    if (moduleName === _constant.MODULE_DEFAULT) isDefaultReducerExist = true;
    if (moduleName === _constant.MODULE_GLOBAL) isGlobalReducerExist = true;
  }

  if (!isDefaultReducerExist) _reducer[_constant.MODULE_DEFAULT] = {};
  if (!isGlobalReducerExist) _reducer[_constant.MODULE_GLOBAL] = {};
}

function bindComputedToCcContext(computed, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(computed)) {
    throw new Error("the computed value of StartUpOption is not a plain json object!");
  }

  function mapComputed(m, moduleComputed) {
    var moduleState = _state[m];

    if (!moduleState) {
      throw _util["default"].makeError(_constant.ERR.CC_COMPUTED_MODULE_INVALID_IN_STARTUP_OPTION, vbi(" moduleName in computed: " + m));
    }

    if (!(0, _util.isPlainJsonObject)(moduleComputed)) {
      throw new Error("the value of one key of the computed object is not a plain json object!");
    }

    var stateKeys = Object.keys(moduleComputed);
    stateKeys.forEach(function (key) {
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleComputedFn = _util["default"].safeGetObjectFromObject(_computedFn, m);

        var fn = moduleComputed[key];
        moduleComputedFn[key] = fn;
        var computedValue = fn(originalValue, originalValue, moduleState);

        var moduleComputedValue = _util["default"].safeGetObjectFromObject(_computedValue, m);

        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        (0, _util.justWarning)("key:" + key + " of module:" + m + " of computed object is not declared in module:" + m + " of store!");
      }
    });
  }

  var _ccContext$computed = _ccContext["default"].computed,
      _computedFn = _ccContext$computed._computedFn,
      _computedValue = _ccContext$computed._computedValue;
  var _state = _ccContext["default"].store._state;

  if (isModuleMode) {
    var moduleNames = Object.keys(computed);
    moduleNames.forEach(function (m) {
      mapComputed(m, computed[m]);
    });
  } else {
    mapToCcContextForNonModule(computed, mapComputed, 'computed');
  }
}

function mapToCcContextForNonModule(startOptionConfig, mapFn, configLabel) {
  var includeDefaultKey = startOptionConfig.hasOwnProperty(_constant.MODULE_DEFAULT);
  var includeGlobalKey = startOptionConfig.hasOwnProperty(_constant.MODULE_GLOBAL);

  if (includeDefaultKey || includeGlobalKey) {
    var invalidKeyCount = 0;

    if (includeDefaultKey) {
      invalidKeyCount++;
      mapFn(_constant.MODULE_DEFAULT, startOptionConfig[_constant.MODULE_DEFAULT]);
    }

    if (includeGlobalKey) {
      invalidKeyCount++;
      mapFn(_constant.MODULE_GLOBAL, startOptionConfig[_constant.MODULE_GLOBAL]);
    }

    if (Object.keys(startOptionConfig).length > invalidKeyCount) {
      keysWarning(configLabel);
    }
  } else {
    mapFn(_constant.MODULE_DEFAULT, startOptionConfig);
  }
}

function bindWatchToCcContext(inputWatch, isModuleMode) {
  if (!(0, _util.isPlainJsonObject)(inputWatch)) {
    throw new Error("StartUpOption.watch is not a plain json object!");
  }

  var ccWatch = _ccContext["default"].watch;
  var _state = _ccContext["default"].store._state;

  function mapWatch(moduleName, moduleWatch) {
    var stateKeys = Object.keys(moduleWatch);
    stateKeys.forEach(function (key) {
      var moduleState = _state[moduleName];
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleWatchFn = moduleWatch[key];

        if (typeof moduleWatchFn !== 'function') {
          throw new Error("watch." + m + "." + key + " 's value is not a function");
        }

        var ccModuleWatch = _util["default"].safeGetObjectFromObject(ccWatch, moduleName);

        ccModuleWatch[key] = moduleWatchFn;
      } else {
        //strict?
        (0, _util.justWarning)("key:" + key + " in watch." + moduleName + " is not declared in store." + moduleName + "!");
      }
    });
  }

  if (isModuleMode) {
    var moduleNames = Object.keys(inputWatch);
    moduleNames.forEach(function (m) {
      var moduleState = _state[m];

      if (!moduleState) {
        throw _util["default"].makeError(_constant.ERR.CC_WATCH_MODULE_INVALID_IN_STARTUP_OPTION, vbi(" moduleName in watch is " + m));
      }

      var moduleWatch = inputWatch[m];
      mapWatch(m, moduleWatch);
    });
  } else {
    mapToCcContextForNonModule(inputWatch, mapWatch, 'watch');
  }
}

function executeInitializer(isModuleMode, store, init) {
  var stateHandler = helper.getStateHandlerForInit;
  if (init === undefined) return;

  if (!isModuleMode) {
    if ((0, _util.isPlainJsonObject)(init)) {
      var includeDefaultModule = init.hasOwnProperty(_constant.MODULE_DEFAULT);
      var includeGlobalModule = init.hasOwnProperty(_constant.MODULE_GLOBAL);

      if (includeDefaultModule || includeGlobalModule) {
        if (includeDefaultModule) {
          var defaultInit = init[_constant.MODULE_DEFAULT];

          if (defaultInit) {
            if (typeof defaultInit !== 'function') {
              throw new Error('init.$$default value must be a function when cc startup in nonModuleMode!');
            } else {
              defaultInit(stateHandler(_constant.MODULE_DEFAULT));
            }
          }
        }

        if (includeGlobalModule) {
          var globalInit = init[_constant.MODULE_GLOBAL];

          if (globalInit) {
            if (typeof globalInit !== 'function') {
              throw new Error('init.$$global value must be a function when cc startup in nonModuleMode!');
            } else {
              globalInit(stateHandler(_constant.MODULE_GLOBAL));
            }
          }
        }
      } else {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }
    } else {
      if (typeof init !== 'function') {
        throw new Error('init value must be a function or a object like {$$default:Function, $$global:Function} when cc startup in nonModuleMode!');
      }

      init(stateHandler(_constant.MODULE_DEFAULT));
    }
  } else {
    if (!(0, _util.isPlainJsonObject)(init)) {
      throw new Error('init value must be a object like { ${moduleName}:Function } when cc startup in moduleMode!');
    }

    var moduleNames = Object.keys(init);
    moduleNames.forEach(function (moduleName) {
      if (!store[moduleName]) {
        throw new Error("module " + moduleName + " not found, check your ccStartupOption.init object keys");
      }

      var initFn = init[moduleName];

      if (initFn) {
        initFn(stateHandler(moduleName));
      }
    });
  }
}
/* 
store in CC_CONTEXT may like:
 {
  $$global:{
 
  },
  module1:{
    books:[],
    user:{},
    color:'red',
    readCount:5,
  },
  module2:{
    books:[],
    colors:[],
    followCount:15,
  }
}
reducer = {
  [moduleName1]:{
    [actionType1]:callback(setState, {type:'',payload:''})
    [actionType2]:callback(setState, {type:'',payload:''})
  },
  [moduleName2]:{
    [actionType1]:callback(setState, {type:'',payload:''})
  }
}
init = {
  global:(setState)=>{}
}
*/


function _default(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$isModuleMode = _ref.isModuleMode,
      isModuleMode = _ref$isModuleMode === void 0 ? false : _ref$isModuleMode,
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
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$errorHandler = _ref.errorHandler,
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
      _ref$isHot = _ref.isHot,
      isHot = _ref$isHot === void 0 ? false : _ref$isHot,
      _ref$autoCreateDispat = _ref.autoCreateDispatcher,
      autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat;

  try {
    _util["default"].justTip("cc version " + _ccContext["default"].info.version);

    _ccContext["default"].isCcAlreadyStartup = true;
    _ccContext["default"].isHot = isHot;
    _ccContext["default"].errorHandler = errorHandler;

    if (_ccContext["default"].isCcAlreadyStartup) {
      var err = _util["default"].makeError(_constant.ERR.CC_ALREADY_STARTUP);

      if (_util["default"].isHotReloadMode()) {
        (0, _util.clearObject)(_ccContext["default"].reducer._reducer);
        (0, _util.clearObject)(_ccContext["default"].store._state);
        (0, _util.clearObject)(_ccContext["default"].computed._computedFn);
        (0, _util.clearObject)(_ccContext["default"].computed._computedValue);
        (0, _util.clearObject)(_ccContext["default"].event_handlers_);
        (0, _util.clearObject)(_ccContext["default"].ccUniqueKey_handlerKeys_);
        var cct = _ccContext["default"].ccClassKey_ccClassContext_;
        Object.keys(cct).forEach(function (ccClassKey) {
          var ctx = cct[ccClassKey];
          (0, _util.clearObject)(ctx.ccKeys);
        });
        (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
        (0, _util.clearObject)(_ccContext["default"].ccKey_ref_, [_constant.CC_DISPATCHER]);
        (0, _util.clearObject)(_ccContext["default"].refs, [_constant.CC_DISPATCHER]);
        (0, _util.clearObject)(_ccContext["default"].fragmentCcKeys);
        (0, _util.clearObject)(_ccContext["default"].ccKey_option_);

        _util["default"].hotReloadWarning(err);
      } else throw err;
    }

    if (autoCreateDispatcher) {
      if (!_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
        var Dispatcher = (0, _createDispatcher["default"])();
        var box = document.querySelector("#" + _constant.CC_DISPATCHER_BOX);

        if (!box) {
          box = document.createElement('div');
          box.id = _constant.CC_DISPATCHER_BOX;
          box.style.position = 'fixed';
          box.style.left = 0;
          box.style.top = 0;
          box.style.display = 'none';
          box.style.zIndex = -888666;
          document.body.append(box);
        }

        _reactDom["default"].render(_react["default"].createElement(Dispatcher), box);

        _util["default"].justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        _util["default"].justTip("[[startUp]]: CcDispatcher existed already");
      }
    } else {
      throw 'customizing Dispatcher is not allowed in current version cc';
    }

    if (window) {
      window.CC_CONTEXT = _ccContext["default"];
      window.ccc = _ccContext["default"];
    }

    _ccContext["default"].isModuleMode = isModuleMode;
    _ccContext["default"].isStrict = isStrict;
    _ccContext["default"].isDebug = isDebug;

    _util["default"].safeAssignObjectValue(_ccContext["default"].sharedToGlobalMapping, sharedToGlobalMapping);

    _util["default"].safeAssignObjectValue(_ccContext["default"].moduleSingleClass, moduleSingleClass);

    bindStoreToCcContext(store, sharedToGlobalMapping, isModuleMode);
    bindReducerToCcContext(reducer);
    bindComputedToCcContext(computed, isModuleMode);
    bindWatchToCcContext(watch, isModuleMode);

    if (init) {
      var computedStore = _ccContext["default"].store._state;
      executeInitializer(isModuleMode, computedStore, init);
    }

    if (middlewares.length > 0) {
      var ccMiddlewares = _ccContext["default"].middlewares;
      middlewares.forEach(function (m) {
        return ccMiddlewares.push(m);
      });
    }
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}