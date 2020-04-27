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

var isPJO = util.isPJO,
    okeys = util.okeys,
    isObjectNull = util.isObjectNull,
    evalState = util.evalState;

var pError = function pError(label) {
  throw new Error("[[run]]: param error, " + label + " " + _privConstant.NOT_A_JSON);
}; // option:
// middlewares, plugins, isStrict, isDebug, errorHandler, isHot,
// autoCreateDispatcher, bindCtxToMethod,
// computedCompare, watchCompare, watchImmediate

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
    initPost: {},
    moduleSingleClass: {}
  };

  var buildStoreConf = function buildStoreConf(m, moduleConf) {
    var state = moduleConf.state,
        _moduleConf$reducer = moduleConf.reducer,
        reducer = _moduleConf$reducer === void 0 ? {} : _moduleConf$reducer,
        watch = moduleConf.watch,
        computed = moduleConf.computed,
        init = moduleConf.init,
        initPost = moduleConf.initPost,
        isClassSingle = moduleConf.isClassSingle;

    if (storeConf.store[m]) {
      throw new Error("run api error: module" + m + " duplicate");
    }

    storeConf.store[m] = evalState(state);
    if (typeof state === 'function') _ccContext["default"].moduleName_stateFn_[m] = state;
    storeConf.reducer[m] = reducer;
    if (watch) storeConf.watch[m] = watch;
    if (computed) storeConf.computed[m] = computed;
    if (init) storeConf.init[m] = init;
    if (initPost) storeConf.initPost[m] = initPost;
    storeConf.moduleSingleClass[m] = isClassSingle === true;
  }; // traversal moduleNames


  okeys(store).forEach(function (m) {
    return buildStoreConf(m, store[m]);
  }); // push by configure api

  _pendingModules["default"].forEach(function (_ref) {
    var module = _ref.module,
        config = _ref.config;
    util.justTip("configure pending module[" + module + "]");
    buildStoreConf(module, config);
  });

  _pendingModules["default"].length = 0; // clear pending modules

  if (isObjectNull(storeConf.init)) storeConf.init = null;
  (0, _startup["default"])(storeConf, options);
}