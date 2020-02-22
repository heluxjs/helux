"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _startup = _interopRequireDefault(require("./startup"));

var util = _interopRequireWildcard(require("../support/util"));

var _privConstant = require("../support/priv-constant");

var isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys,
    isObjectNull = util.isObjectNull;

var pError = function pError(label) {
  throw new Error("[[run]]: param error, " + label + " " + _privConstant.NOT_A_JSON);
}; // option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, reducer, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate, alwaysGiveState

/**
 * run will call startup
 * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean} }} store
 * @param {{isStrict:boolean}} option
 */


function _default(store, option) {
  if (store === void 0) {
    store = {};
  }

  if (option === void 0) {
    option = {};
  }

  if (!isPlainJsonObject(store)) pError('store');
  if (!isPlainJsonObject(option)) pError('option');
  var storeConf = {
    store: {},
    reducer: {},
    watch: {},
    computed: {},
    init: {},
    moduleSingleClass: {} // traversal moduleNames

  };
  okeys(store).forEach(function (m) {
    var config = store[m];
    var state = config.state,
        reducer = config.reducer,
        watch = config.watch,
        computed = config.computed,
        init = config.init,
        isClassSingle = config.isClassSingle;
    if (state) storeConf.store[m] = state;
    if (reducer) storeConf.reducer[m] = reducer;
    if (watch) storeConf.watch[m] = watch;
    if (computed) storeConf.computed[m] = computed;
    if (init) storeConf.init[m] = init;
    storeConf.moduleSingleClass[m] = isClassSingle === true;
  });
  if (isObjectNull(storeConf.init)) storeConf.init = null;
  (0, _startup["default"])(storeConf, option);
}