"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _startup = _interopRequireDefault(require("./startup"));

var _util = _interopRequireDefault(require("../support/util"));

/**
 * load will call startup
 * @param {{ [moduleName:string]: config:{state:object, reducer:object, watch:object, computed:object, init:object, sharedToGlobalMapping:object, isClassSingle:boolean} }} store
 * @param option
 */
function _default(store, option) {
  if (store === void 0) {
    store = {};
  }

  if (option === void 0) {
    option = {};
  }

  if (!_util["default"].isPlainJsonObject(store)) {
    throw new Error('[[load]]: param error, store is not a plain json object');
  }

  if (!_util["default"].isPlainJsonObject(option)) {
    throw new Error('[[load]]: param error, option is not a plain json object');
  }

  var _store = {};
  var _reducer = {};
  var _watch = {};
  var _computed = {};
  var _init = {};
  var _sharedToGlobalMapping = {};
  var _moduleSingleClass = {};
  var moduleNames = Object.keys(store);
  moduleNames.forEach(function (m) {
    var config = store[m];
    var state = config.state,
        reducer = config.reducer,
        watch = config.watch,
        computed = config.computed,
        init = config.init,
        sharedToGlobalMapping = config.sharedToGlobalMapping,
        isClassSingle = config.isClassSingle;
    if (state) _store[m] = state;
    if (reducer) _reducer[m] = reducer;
    if (watch) _watch[m] = watch;
    if (computed) _computed[m] = computed;
    if (init) _init[m] = init;
    if (sharedToGlobalMapping) _sharedToGlobalMapping[m] = sharedToGlobalMapping;
    if (typeof isClassSingle === 'boolean') _moduleSingleClass[m] = isClassSingle;
  });
  if (!_util["default"].isObjectNotNull(_init)) _init = null;
  var startupOption = {
    store: _store,
    reducer: _reducer,
    watch: _watch,
    computed: _computed,
    init: _init,
    sharedToGlobalMapping: _sharedToGlobalMapping,
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
      reducer = _option.reducer;

  if (reducer) {
    if (!_util["default"].isPlainJsonObject(reducer)) {
      throw new Error('[[load]]: param option.reducer error, it is not a plain json object');
    }

    Object.keys(reducer).forEach(function (reducerModule) {
      _reducer[reducerModule] = reducer[reducerModule];
    });
  }

  var mergedOption = Object.assign(startupOption, {
    middlewares: middlewares,
    plugins: plugins,
    isStrict: isStrict,
    isDebug: isDebug,
    errorHandler: errorHandler,
    isHot: isHot,
    autoCreateDispatcher: autoCreateDispatcher
  });
  (0, _startup["default"])(mergedOption);
}