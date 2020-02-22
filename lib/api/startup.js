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

var _appendDispatcher = _interopRequireDefault(require("../core/base/append-dispatcher"));

var _clearContextIfHot = _interopRequireDefault(require("./clear-context-if-hot"));

var justTip = util.justTip,
    bindToWindow = util.bindToWindow,
    makeError = util.makeError;

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
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares;

  var _ref2 = _temp2 === void 0 ? {} : _temp2,
      _ref2$plugins = _ref2.plugins,
      plugins = _ref2$plugins === void 0 ? [] : _ref2$plugins,
      _ref2$isStrict = _ref2.isStrict,
      isStrict = _ref2$isStrict === void 0 ? false : _ref2$isStrict,
      _ref2$isDebug = _ref2.isDebug,
      isDebug = _ref2$isDebug === void 0 ? false : _ref2$isDebug,
      _ref2$errorHandler = _ref2.errorHandler,
      errorHandler = _ref2$errorHandler === void 0 ? null : _ref2$errorHandler,
      _ref2$isHot = _ref2.isHot,
      isHot = _ref2$isHot === void 0 ? false : _ref2$isHot,
      _ref2$autoCreateDispa = _ref2.autoCreateDispatcher,
      autoCreateDispatcher = _ref2$autoCreateDispa === void 0 ? true : _ref2$autoCreateDispa,
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
      optionReducer = _ref2.reducer;

  try {
    if (optionReducer) {
      if (!util.isPlainJsonObject(optionReducer)) throw new Error("option.reducer not a plain json object");
      util.okeys(optionReducer).forEach(function (reducerModule) {
        if (reducer[reducerModule]) throw new Error("reducerModule[" + reducerModule + "] has been declared in store");
        var reducerFns = optionReducer[reducerModule];
        util.okeys(reducerFns).forEach(function (k) {
          reducerFns[k].__reducerModule = reducerModule; // tag reducer fn
        });
        reducer[reducerModule] = reducerFns;
      });
    }

    console.log("%c window.name:" + window.name, 'color:green;border:1px solid green');
    justTip("cc version " + _ccContext["default"].info.version);
    _ccContext["default"].isHot = isHot;
    _ccContext["default"].errorHandler = errorHandler;
    var rv = _ccContext["default"].runtimeVar;
    rv.alwaysGiveState = alwaysGiveState;
    rv.isStrict = isStrict;
    rv.isDebug = isDebug;
    rv.computedCompare = computedCompare;
    rv.watchCompare = watchCompare;
    rv.watchImmediate = watchImmediate;
    rv.bindCtxToMethod = bindCtxToMethod;
    var err = makeError(_constant.ERR.CC_ALREADY_STARTUP);
    (0, _clearContextIfHot["default"])(true, err);
    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (autoCreateDispatcher) {
      if (!_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
        var Dispatcher = (0, _createDispatcher["default"])();
        (0, _appendDispatcher["default"])(Dispatcher);
        justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        justTip("[[startUp]]: CcDispatcher already existed");
      }
    } else {
      throw new Error('customizing Dispatcher is not allowed in current version Concent');
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

    _ccContext["default"].isCcAlreadyStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

    boot.configPlugins(plugins);
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}