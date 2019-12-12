"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _constant = require("../support/constant");

var util = _interopRequireWildcard(require("../support/util"));

var _initModuleState = _interopRequireDefault(require("../core/state/init-module-state"));

var _initModuleReducer = _interopRequireDefault(require("../core/reducer/init-module-reducer"));

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

var _initModuleWatch = _interopRequireDefault(require("../core/watch/init-module-watch"));

var checker = _interopRequireWildcard(require("../core/checker"));

var _plugin = require("../core/plugin");

var _handlerFactory = require("../core/state/handler-factory");

var ccGlobalStateKeys = _ccContext["default"].globalStateKeys;
var makeError = util.makeError,
    verboseInfo = util.verboseInfo,
    isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys;

function setGlobalState(storedGlobalState, inputGlobalState) {
  if (inputGlobalState) {
    if (!isPlainJsonObject(inputGlobalState)) {
      throw new Error("option.globalState is not a plain json object");
    }

    var gKeys = okeys(inputGlobalState);
    gKeys.forEach(function (gKey) {
      if (storedGlobalState.hasOwnProperty(gKey)) {
        throw new Error("key[" + gKey + "] duplicated in globalState");
      }

      ccGlobalStateKeys.push(gKey);
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


function _default(module, config, option) {
  if (option === void 0) {
    option = {};
  }

  if (!_ccContext["default"].isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }

  if (!isPlainJsonObject(config)) {
    throw new Error('[[configure]] param type error, config is not plain json object!');
  }

  if (module === _constant.MODULE_GLOBAL) {
    throw new Error('cc do not allow configure global module');
  }

  if (reducer && !isPlainJsonObject(reducer)) {
    throw makeError(_constant.ERR.CC_MODULE_REDUCER_INVALID, verboseInfo("module[" + module + "]"));
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
  (0, _initModuleState["default"])(module, state, true, 'configure');
  (0, _initModuleReducer["default"])(module, reducer, true, 'configure');
  var _state = _ccContext["default"].store._state;
  var _reducer = _ccContext["default"].reducer._reducer;
  _state[module] = state;
  computed && (0, _initModuleComputed["default"])(module, computed);
  watch && (0, _initModuleWatch["default"])(module, watch);
  _ccContext["default"].moduleSingleClass[module] = isClassSingle === true;

  if (optionReducer) {
    if (!isPlainJsonObject(optionReducer)) {
      throw makeError(_constant.ERR.CC_OPTION_REDUCER_INVALID, verboseInfo("configure module[" + module + "]"));
    }

    var reducerModuleNames = Object.keys(optionReducer);
    reducerModuleNames.forEach(function (rmName) {
      checker.checkModuleName(rmName);
      var moduleReducer = optionReducer[rmName];

      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(_constant.ERR.CC_OPTION_REDUCER_FVALUE_INVALID, verboseInfo("configure module[" + module + "], option.reducer." + rmName));
      }

      if (rmName === _constant.MODULE_GLOBAL) {
        //merge input globalReducer to existed globalReducer
        var fnNames = Object.keys(moduleReducer);
        var globalReducer = _reducer[_constant.MODULE_GLOBAL];
        fnNames.forEach(function (fnName) {
          if (globalReducer[fnName]) {
            throw makeError(_constant.ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo("type " + fnName));
          }

          var reducerFn = moduleReducer[fnName];

          if (typeof reducerFn !== 'function') {
            throw makeError(_constant.ERR.CC_REDUCER_NOT_A_FUNCTION);
          }

          globalReducer[fnName] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  var storedGlobalState = _state[_constant.MODULE_GLOBAL]; //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算

  setGlobalState(storedGlobalState, globalState, 'State');
  if (globalComputed) (0, _initModuleComputed["default"])(_constant.MODULE_GLOBAL, globalComputed, true);
  if (globalWatch) (0, _initModuleWatch["default"])(_constant.MODULE_GLOBAL, globalWatch, true);

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }

    init((0, _handlerFactory.makeSetStateHandler)(module));
  }

  if (middlewares && middlewares.length > 0) {
    var ccMiddlewares = _ccContext["default"].middlewares;
    middlewares.forEach(function (m) {
      if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
      ccMiddlewares.push(m);
    });
  }

  _ccContext["default"].moduleName_isConfigured_[module] = true;
  (0, _plugin.send)(_constant.SIG_MODULE_CONFIGURED, module);
}