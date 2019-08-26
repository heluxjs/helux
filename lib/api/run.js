"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _startup = _interopRequireDefault(require("./startup"));

var util = _interopRequireWildcard(require("../support/util"));

var isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys,
    isObjectNotNull = util.isObjectNotNull;

var pError = function pError(label) {
  throw new Error("[[run]]: param error, " + label + " is not a plain json object");
};
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
  var _store = {};
  var _reducer = {};
  var _watch = {};
  var _computed = {};
  var _init = {};
  var _moduleSingleClass = {}; // traversal moduleNames

  okeys(store).forEach(function (m) {
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
  if (!isObjectNotNull(_init)) _init = null;
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
    if (!isPlainJsonObject(reducer)) pError('option.reducer');
    okeys(reducer).forEach(function (reducerModule) {
      if (_reducer[reducerModule]) throw new Error("reducerModule[" + reducerModule + "] has been declared in store");
      _reducer[reducerModule] = reducer[reducerModule];
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
  (0, _startup["default"])(startupOption);
}