"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _createDispatcher = _interopRequireDefault(require("./create-dispatcher"));

var boot = _interopRequireWildcard(require("../core/base/boot"));

var _beforeUnmount = _interopRequireDefault(require("../core/base/before-unmount"));

var _appendDispatcher = _interopRequireDefault(require("../core/base/append-dispatcher"));

var _clearContextIfHot = _interopRequireDefault(require("./clear-context-if-hot"));

var justTip = util.justTip,
    bindToWindow = util.bindToWindow,
    okeys = util.okeys;
var cachedLocation = '';
var clearShadowRefTimer = 0;
var shawRefExpireTime = 10000; // ms

/** 以防用户长时间打开debugger调试照成clearShadowRef误判，给用户已给重写shawRefExpireTime的机会 */

function setShawRefExpireTime(t) {
  shawRefExpireTime = t;
}

function tryClearShadowRef(clearShadowRef) {
  if (clearShadowRef && !clearShadowRefTimer) {
    // if (process && process.env && process.env.NODE_ENV === 'production') {
    //   // no need to run this timer in production mode
    // } else { }
    clearShadowRefTimer = setInterval(function () {
      var now = Date.now();
      var refs = _ccContext["default"].refs;
      okeys(refs).forEach(function (key) {
        var ref = refs[key]; // 初始化后，大于10秒没有挂载的组件，当作是strict-mode下的双调用导致产生的一个多余的ref
        // https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
        // 利用double-invoking并不会触发didMount的特性，来做此检测

        if (!ref.__$$isMounted && now - ref.ctx.initTime > shawRefExpireTime) {
          (0, _beforeUnmount["default"])(ref);
          justTip("shadow ref" + ref.ctx.ccUniqueKey + " was cleared");
        }
      });
    }, 5000);
  }
}

function checkStartup(err) {
  var errStack = err.stack;
  var info = _ccContext["default"].info;
  var arr = errStack.split('\n');
  var len = arr.length;
  var curLocation = '';

  var tryGetLocation = function tryGetLocation(keyword, offset) {
    for (var i = 0; i < len; i++) {
      if (arr[i].includes(keyword)) {
        curLocation = arr[i + offset];
        break;
      }
    }
  };

  tryGetLocation('startup', 2); //向下2句找触发run的文件

  if (!curLocation) tryGetLocation('runConcent', 0);

  var letRunOk = function letRunOk() {
    _ccContext["default"].isHot = true;
    (0, _clearContextIfHot["default"])(true);
  };

  var now = Date.now();

  if (!cachedLocation) {
    cachedLocation = curLocation;
    info.firstStartupTime = now;
    info.latestStartupTime = now;
  } else if (cachedLocation !== curLocation) {
    var tip = "invalid run api call!(it can only be called once, changing 'call run' line location in HMR will cause this error also, \n    try refresh browser to reload your app to avoid this tip)";

    if (now - info.latestStartupTime < 1000) {
      throw new Error(tip);
    } else {
      if (util.isOnlineEditor()) {
        letRunOk();
        cachedLocation = curLocation;
      } else {
        util.strictWarning(tip);
        return false;
      }
    }
  } else {
    letRunOk();
  }

  return true;
}

function _default(_temp, _temp2) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? null : _ref$init,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas;

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
      computedCompare = _ref2$computedCompare === void 0 ? true : _ref2$computedCompare,
      _ref2$watchCompare = _ref2.watchCompare,
      watchCompare = _ref2$watchCompare === void 0 ? true : _ref2$watchCompare,
      _ref2$watchImmediate = _ref2.watchImmediate,
      watchImmediate = _ref2$watchImmediate === void 0 ? false : _ref2$watchImmediate,
      _ref2$alwaysGiveState = _ref2.alwaysGiveState,
      alwaysGiveState = _ref2$alwaysGiveState === void 0 ? true : _ref2$alwaysGiveState,
      _ref2$reComputed = _ref2.reComputed,
      reComputed = _ref2$reComputed === void 0 ? true : _ref2$reComputed,
      _ref2$clearShadowRef = _ref2.clearShadowRef,
      clearShadowRef = _ref2$clearShadowRef === void 0 ? true : _ref2$clearShadowRef,
      _ref2$shawRefExpireTi = _ref2.shawRefExpireTime,
      shawRefExpireTime = _ref2$shawRefExpireTi === void 0 ? 10000 : _ref2$shawRefExpireTi;

  var canStartup = true;

  try {
    throw new Error();
  } catch (err) {
    canStartup = checkStartup(err);
  }

  if (!canStartup) return;

  try {
    console.log("%c window.name:" + window.name, 'color:green;border:1px solid green');
    justTip("cc version " + _ccContext["default"].info.version);
    if (isHot !== undefined) _ccContext["default"].isHot = isHot;
    _ccContext["default"].reComputed = reComputed;
    _ccContext["default"].errorHandler = errorHandler;
    var rv = _ccContext["default"].runtimeVar;
    rv.alwaysGiveState = alwaysGiveState;
    rv.isStrict = isStrict;
    rv.isDebug = isDebug;
    rv.computedCompare = computedCompare;
    rv.watchCompare = watchCompare;
    rv.watchImmediate = watchImmediate;
    rv.bindCtxToMethod = bindCtxToMethod;
    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (!_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
      var Dispatcher = (0, _createDispatcher["default"])();
      (0, _appendDispatcher["default"])(Dispatcher);
    }

    var bindOthers = function bindOthers(bindTarget) {
      bindToWindow('CC_CONTEXT', _ccContext["default"], bindTarget);
      bindToWindow('ccc', _ccContext["default"], bindTarget);
      bindToWindow('cccc', _ccContext["default"].computed._computedValue, bindTarget);
      bindToWindow('sss', _ccContext["default"].store._state, bindTarget);
    };

    if (window.mcc) {
      setTimeout(function () {
        //延迟绑定，等待ccns的输入
        bindOthers(window.mcc[util.getCcNamespace()]);
      }, 1200);
    } else {
      bindOthers();
    }

    _ccContext["default"].isStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

    boot.configPlugins(plugins);
    setShawRefExpireTime(shawRefExpireTime);
    tryClearShadowRef(clearShadowRef);
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}