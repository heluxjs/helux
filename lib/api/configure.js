"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pendingModules = _interopRequireDefault(require("../cc-context/pending-modules"));

var _constant = require("../support/constant");

var _privConstant = require("../support/priv-constant");

var util = _interopRequireWildcard(require("../support/util"));

var _initModuleState = _interopRequireDefault(require("../core/state/init-module-state"));

var _initModuleReducer = _interopRequireDefault(require("../core/reducer/init-module-reducer"));

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

var _initModuleWatch = _interopRequireDefault(require("../core/watch/init-module-watch"));

var _plugin = require("../core/plugin");

var _handlerFactory = require("../core/state/handler-factory");

var isPJO = util.isPJO,
    evalState = util.evalState;
/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean}} config
 */

function _default(module, config) {
  if (!_ccContext["default"].isStartup) {
    _pendingModules["default"].push({
      module: module,
      config: config
    });

    return; // throw new Error('configure must be called after run!');
  }

  if (!isPJO(config)) {
    throw new Error("param config " + _privConstant.NOT_A_JSON);
  }

  if (module === _constant.MODULE_GLOBAL) {
    throw new Error('configuring global module is not allowed');
  }

  var state = config.state,
      reducer = config.reducer,
      computed = config.computed,
      watch = config.watch,
      init = config.init,
      isClassSingle = config.isClassSingle;
  var eState = evalState(state);

  if (reducer && !isPJO(reducer)) {
    throw new Error("config.reducer " + _privConstant.NOT_A_JSON);
  }

  (0, _initModuleState["default"])(module, eState, true);
  (0, _initModuleReducer["default"])(module, reducer);
  computed && (0, _initModuleComputed["default"])(module, computed);
  watch && (0, _initModuleWatch["default"])(module, watch);
  _ccContext["default"].moduleSingleClass[module] = isClassSingle === true;

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }

    Promise.resolve().then(init).then(function (state) {
      (0, _handlerFactory.makeSetStateHandler)(module)(state);
    });
  }

  _ccContext["default"].moduleName_isConfigured_[module] = true;
  (0, _plugin.send)(_constant.SIG_MODULE_CONFIGURED, module);
}