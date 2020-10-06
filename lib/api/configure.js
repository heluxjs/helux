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

var _initModuleLifecycle = _interopRequireDefault(require("../core/base/init-module-lifecycle"));

var _getLifecycle = _interopRequireDefault(require("../core/param/get-lifecycle"));

var _plugin = require("../core/plugin");

var isPJO = util.isPJO,
    evalState = util.evalState,
    okeys = util.okeys;
/**
 * @description configure module、state etc to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, lifecycle:object}} config - when module type is string
 */

function _default(module, config) {
  if (config === void 0) {
    config = {};
  }

  var confOneMoudle = function confOneMoudle(module, config) {
    if (!_ccContext["default"].isStartup) {
      _pendingModules["default"].push({
        module: module,
        config: config
      });

      return;
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
        watch = config.watch;
    var eState = evalState(state);
    if (typeof state === 'function') _ccContext["default"].moduleName_stateFn_[module] = state;
    (0, _initModuleState["default"])(module, eState, true);
    (0, _initModuleReducer["default"])(module, reducer);
    (0, _initModuleComputed["default"])(module, computed);
    (0, _initModuleWatch["default"])(module, watch);
    (0, _initModuleLifecycle["default"])(module, (0, _getLifecycle["default"])(config));
    _ccContext["default"].moduleName_isConfigured_[module] = true;
    (0, _plugin.send)(_constant.SIG_MODULE_CONFIGURED, module);
  }; // now module is part of store conf


  if (isPJO(module)) {
    okeys(module).forEach(function (moduleName) {
      return confOneMoudle(moduleName, module[moduleName]);
    });
  } else {
    confOneMoudle(module, config);
  }
}