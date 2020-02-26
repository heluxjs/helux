"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _startup = _interopRequireDefault(require("./startup"));

var util = _interopRequireWildcard(require("../support/util"));

var _privConstant = require("../support/priv-constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var isPJO = util.isPJO,
    okeys = util.okeys,
    isObjectNull = util.isObjectNull,
    evalState = util.evalState;

var pError = function pError(label) {
  throw new Error("[[run]]: param error, " + label + " " + _privConstant.NOT_A_JSON);
}; // option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate, alwaysGiveState

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object|()=>object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
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
    init: {},
    moduleSingleClass: {} // traversal moduleNames

  };
  okeys(store).forEach(function (m) {
    var moduleConf = store[m];
    var state = moduleConf.state,
        reducer = moduleConf.reducer,
        watch = moduleConf.watch,
        computed = moduleConf.computed,
        init = moduleConf.init,
        isClassSingle = moduleConf.isClassSingle;
    storeConf.store[m] = evalState(state);
    if (typeof state === 'function') _ccContext["default"].moduleName_stateFn_[m] = state;
    if (reducer) storeConf.reducer[m] = reducer;
    if (watch) storeConf.watch[m] = watch;
    if (computed) storeConf.computed[m] = computed;
    if (init) storeConf.init[m] = init;
    storeConf.moduleSingleClass[m] = isClassSingle === true;
  });
  if (isObjectNull(storeConf.init)) storeConf.init = null;
  (0, _startup["default"])(storeConf, options);
}