"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../support/util"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _createDispatcher = _interopRequireDefault(require("../core/base/create-dispatcher"));

var boot = _interopRequireWildcard(require("../core/base/boot"));

var _clearContextIfHot = _interopRequireDefault(require("./clear-context-if-hot"));

var justTip = util.justTip,
    bindToWindow = util.bindToWindow,
    getErrStackKeywordLoc = util.getErrStackKeywordLoc;
var cachedLocation = '';

function checkStartup(err) {
  var info = _ccContext["default"].info;
  var curLocation = getErrStackKeywordLoc(err, 'startup', 2); //向下2句找触发run的文件

  if (!curLocation) curLocation = getErrStackKeywordLoc(err, 'runConcent', 0);

  var letRunOk = function letRunOk() {
    _ccContext["default"].isHot = true;
    return (0, _clearContextIfHot["default"])(true);
  };

  var now = Date.now();

  var resetClassInsUI = function resetClassInsUI() {},
      canStartup = true;

  if (!cachedLocation) {
    cachedLocation = curLocation;
    info.firstStartupTime = now;
    info.latestStartupTime = now;
  } else if (cachedLocation !== curLocation) {
    var tip = "run can only beed called one time, try refresh browser to avoid this error";

    if (now - info.latestStartupTime < 1000) {
      throw new Error(tip);
    }

    if (util.isOnlineEditor()) {
      resetClassInsUI = letRunOk();
      cachedLocation = curLocation;
    } else {
      util.strictWarning(tip);
      canStartup = false;
    }
  } else {
    resetClassInsUI = letRunOk();
  }

  return {
    canStartup: canStartup,
    resetClassInsUI: resetClassInsUI
  };
}

function _default(_temp, _temp2) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$lifecycle = _ref.lifecycle,
      lifecycle = _ref$lifecycle === void 0 ? {} : _ref$lifecycle;

  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$plugins = _ref2.plugins,
      plugins = _ref2$plugins === void 0 ? [] : _ref2$plugins,
      _ref2$middlewares = _ref2.middlewares,
      middlewares = _ref2$middlewares === void 0 ? [] : _ref2$middlewares,
      _ref2$isStrict = _ref2.isStrict,
      isStrict = _ref2$isStrict === void 0 ? false : _ref2$isStrict,
      _ref2$isDebug = _ref2.isDebug,
      isDebug = _ref2$isDebug === void 0 ? false : _ref2$isDebug,
      _ref2$errorHandler = _ref2.errorHandler,
      errorHandler = _ref2$errorHandler === void 0 ? null : _ref2$errorHandler,
      isHot = _ref2.isHot,
      _ref2$bindCtxToMethod = _ref2.bindCtxToMethod,
      bindCtxToMethod = _ref2$bindCtxToMethod === void 0 ? false : _ref2$bindCtxToMethod,
      _ref2$computedCompare = _ref2.computedCompare,
      computedCompare = _ref2$computedCompare === void 0 ? false : _ref2$computedCompare,
      _ref2$watchCompare = _ref2.watchCompare,
      watchCompare = _ref2$watchCompare === void 0 ? false : _ref2$watchCompare,
      _ref2$watchImmediate = _ref2.watchImmediate,
      watchImmediate = _ref2$watchImmediate === void 0 ? false : _ref2$watchImmediate,
      _ref2$reComputed = _ref2.reComputed,
      reComputed = _ref2$reComputed === void 0 ? true : _ref2$reComputed,
      _ref2$extractModuleCh = _ref2.extractModuleChangedState,
      extractModuleChangedState = _ref2$extractModuleCh === void 0 ? true : _ref2$extractModuleCh,
      _ref2$extractRefChang = _ref2.extractRefChangedState,
      extractRefChangedState = _ref2$extractRefChang === void 0 ? false : _ref2$extractRefChang,
      _ref2$objectValueComp = _ref2.objectValueCompare,
      objectValueCompare = _ref2$objectValueComp === void 0 ? false : _ref2$objectValueComp,
      _ref2$nonObjectValueC = _ref2.nonObjectValueCompare,
      nonObjectValueCompare = _ref2$nonObjectValueC === void 0 ? true : _ref2$nonObjectValueC,
      _ref2$localStorage = _ref2.localStorage,
      localStorage = _ref2$localStorage === void 0 ? null : _ref2$localStorage;

  try {
    throw new Error();
  } catch (err) {
    var _checkStartup = checkStartup(err),
        canStartup = _checkStartup.canStartup,
        resetClassInsUI = _checkStartup.resetClassInsUI;

    if (!canStartup) return;

    try {
      justTip("concent version " + _ccContext["default"].info.version);
      if (isHot !== undefined) _ccContext["default"].isHot = isHot;
      _ccContext["default"].reComputed = reComputed;
      _ccContext["default"].runtimeHandler.errorHandler = errorHandler;
      var rv = _ccContext["default"].runtimeVar;
      rv.isStrict = isStrict;
      rv.isDebug = isDebug;
      rv.computedCompare = computedCompare;
      rv.watchCompare = watchCompare;
      rv.watchImmediate = watchImmediate;
      rv.extractModuleChangedState = extractModuleChangedState;
      rv.extractRefChangedState = extractRefChangedState;
      rv.objectValueCompare = objectValueCompare;
      rv.nonObjectValueCompare = nonObjectValueCompare;
      rv.bindCtxToMethod = bindCtxToMethod;

      if (localStorage) {
        _ccContext["default"].localStorage = localStorage;
      } else if (window && window.localStorage) {
        _ccContext["default"].localStorage = window.localStorage;
      }

      _ccContext["default"].recoverRefState();

      (0, _createDispatcher["default"])();
      boot.configStoreState(store);
      boot.configRootReducer(reducer);
      boot.configRootComputed(computed);
      boot.configRootWatch(watch);
      boot.configRootLifecycle(lifecycle);
      boot.configMiddlewares(middlewares);

      var bindOthers = function bindOthers(bindTarget) {
        bindToWindow('CC_CONTEXT', _ccContext["default"], bindTarget);
        bindToWindow('ccc', _ccContext["default"], bindTarget);
        bindToWindow('cccc', _ccContext["default"].computed._computedValue, bindTarget);
        bindToWindow('sss', _ccContext["default"].store._state, bindTarget);
      };

      if (window && window.mcc) {
        setTimeout(function () {
          //延迟绑定，等待ccns的输入
          bindOthers(window.mcc[util.getCcNamespace()]);
        }, 1200);
      } else {
        bindOthers();
      }

      _ccContext["default"].isStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

      boot.configPlugins(plugins);
      resetClassInsUI();
    } catch (err) {
      if (errorHandler) errorHandler(err);else throw err;
    }
  }
}