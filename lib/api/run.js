"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _startup = _interopRequireDefault(require("./startup"));

var util = _interopRequireWildcard(require("../support/util"));

var _privConstant = require("../support/priv-constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pendingModules = _interopRequireDefault(require("../cc-context/pending-modules"));

var _getLifecycle = _interopRequireDefault(require("../core/param/get-lifecycle"));

var isPJO = util.isPJO,
    okeys = util.okeys,
    evalState = util.evalState;

var pError = function pError(label) {
  throw new Error("[[run]]: param error, " + label + " " + _privConstant.NOT_A_JSON);
}; // option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object|()=>object, reducer:object, watch:object, computed:object, init:object} }} store
 * @param {{isStrict:boolean}} options
 */


function _default(store, options) {
  if (store === void 0) {
    store = {};
  }

  if (options === void 0) {
    options = {};
  }

  if (!isPJO(store)) pError('store');
  if (!isPJO(options)) pError('options');
  var storeConf = {
    store: {},
    reducer: {},
    watch: {},
    computed: {},
    lifecycle: {}
  };

  var buildStoreConf = function buildStoreConf(m, moduleConf) {
    var state = moduleConf.state,
        reducer = moduleConf.reducer,
        watch = moduleConf.watch,
        computed = moduleConf.computed;

    if (storeConf.store[m]) {
      throw new Error("run api error: module" + m + " duplicate");
    }

    storeConf.store[m] = evalState(state);
    if (typeof state === 'function') _ccContext["default"].moduleName_stateFn_[m] = state;
    storeConf.reducer[m] = reducer;
    storeConf.watch[m] = watch;
    storeConf.computed[m] = computed;
    storeConf.lifecycle[m] = (0, _getLifecycle["default"])(moduleConf);
  }; // traversal moduleNames


  okeys(store).forEach(function (m) {
    return buildStoreConf(m, store[m]);
  }); // these modules pushed by configure api

  _pendingModules["default"].forEach(function (_ref) {
    var module = _ref.module,
        config = _ref.config;
    util.justTip("configure pending module[" + module + "]");
    buildStoreConf(module, config);
  });

  _pendingModules["default"].length = 0; // clear pending modules

  (0, _startup["default"])(storeConf, options);
}