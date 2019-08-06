"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _constant = require("../support/constant");

var _util = _interopRequireWildcard(require("../support/util"));

var _initModuleState = _interopRequireDefault(require("../core/state/init-module-state"));

var _initModuleReducer = _interopRequireDefault(require("../core/reducer/init-module-reducer"));

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

var _initModuleWatch = _interopRequireDefault(require("../core/watch/init-module-watch"));

var checker = _interopRequireWildcard(require("../core/checker"));

var _plugin = require("../core/plugin");

var _makeSetStateHandler = _interopRequireDefault(require("../core/state/make-set-state-handler"));

var ccGlobalStateKeys = _ccContext["default"].globalStateKeys;

function setGlobalConfig(storedGlobalConf, inputGlobalConf, label) {
  var globalState = _ccContext["default"].store.getGlobalState();

  if (inputGlobalConf) {
    if (!_util["default"].isPlainJsonObject(inputGlobalConf)) {
      throw new Error("option.global" + label + " is not a plain json object");
    }

    var globalConfKeys = Object.keys(inputGlobalConf);
    globalConfKeys.forEach(function (gKey) {
      if (storedGlobalConf.hasOwnProperty(gKey)) {
        throw new Error("key[" + gKey + "] duplicated in global." + label.toLowerCase());
      }

      var confValue = inputGlobalConf[gKey];
      storedGlobalConf[gKey] = confValue;
      if (label === 'State') ccGlobalStateKeys.push(gKey);else if (label === 'Computed') {
        var val = globalState[gKey];
        var computedVal = confValue(val, val, globalState);
        _ccContext["default"].computed._computedValue[_constant.MODULE_GLOBAL][gKey] = computedVal;
      }
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

  if (!_util["default"].isPlainJsonObject(config)) {
    throw new Error('[[configure]] param type error, config is not plain json object!');
  }

  if (module === _constant.MODULE_GLOBAL) {
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
  (0, _initModuleState["default"])(module, state);
  (0, _initModuleReducer["default"])(module, reducer);
  var _state = _ccContext["default"].store._state;
  var _reducer = _ccContext["default"].reducer._reducer;
  _state[module] = state;

  if (computed) {
    (0, _initModuleComputed["default"])(module, computed);
  }

  if (watch) {
    (0, _initModuleWatch["default"])(module, watch);
  }

  if (isClassSingle === true) {
    _ccContext["default"].moduleSingleClass[module] = true;
  }

  if (optionReducer) {
    if (!(0, _util.isPlainJsonObject)(optionReducer)) {
      throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("module[" + module + "] 's moduleReducer is invalid"));
    }

    var reducerModuleNames = Object.keys(optionReducer);
    reducerModuleNames.forEach(function (rmName) {
      checker.checkModuleName(rmName);
      var moduleReducer = optionReducer[rmName];

      if (!(0, _util.isPlainJsonObject)(moduleReducer)) {
        throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("module[" + module + "] reducer 's value is invalid"));
      }

      if (rmName === _constant.MODULE_GLOBAL) {
        //merge input globalReducer to existed globalReducer
        var typesOfGlobal = Object.keys(moduleReducer);
        var globalReducer = _reducer[_constant.MODULE_GLOBAL];
        typesOfGlobal.forEach(function (type) {
          if (globalReducer[type]) {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, (0, _util.verboseInfo)("type " + type));
          }

          var reducerFn = moduleReducer[type];

          if (typeof reducerFn !== 'function') {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_NOT_A_FUNCTION);
          }

          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  if (reducer) {
    if (!(0, _util.isPlainJsonObject)(reducer)) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("config.reducer is not a plain json object"));
    }

    _reducer[module] = reducer;
  }

  var storedGlobalState = _state[_constant.MODULE_GLOBAL];
  var storedGlobalComputedFn = _ccContext["default"].computed._computedFn[_constant.MODULE_GLOBAL];
  var storedGlobalWatch = _ccContext["default"].watch[_constant.MODULE_GLOBAL]; //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算

  setGlobalConfig(storedGlobalState, globalState, 'State');
  setGlobalConfig(storedGlobalComputedFn, globalComputed, 'Computed');
  setGlobalConfig(storedGlobalWatch, globalWatch, 'Watch');

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }

    init((0, _makeSetStateHandler["default"])(module));
  }

  if (middlewares && middlewares.length > 0) {
    var ccMiddlewares = _ccContext["default"].middlewares;
    middlewares.forEach(function (m) {
      if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
      ccMiddlewares.push(m);
    });
  }

  (0, _plugin.send)(_constant.SIG_MODULE_CONFIGURED, module);
}