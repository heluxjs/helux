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

function _default(_temp) {
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
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
      _ref$plugins = _ref.plugins,
      plugins = _ref$plugins === void 0 ? [] : _ref$plugins,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$errorHandler = _ref.errorHandler,
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
      _ref$isHot = _ref.isHot,
      isHot = _ref$isHot === void 0 ? false : _ref$isHot,
      _ref$autoCreateDispat = _ref.autoCreateDispatcher,
      autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat,
      _ref$bindCtxToMethod = _ref.bindCtxToMethod,
      bindCtxToMethod = _ref$bindCtxToMethod === void 0 ? false : _ref$bindCtxToMethod,
      _ref$computedCompare = _ref.computedCompare,
      computedCompare = _ref$computedCompare === void 0 ? true : _ref$computedCompare,
      _ref$watchCompare = _ref.watchCompare,
      watchCompare = _ref$watchCompare === void 0 ? true : _ref$watchCompare,
      _ref$watchImmediate = _ref.watchImmediate,
      watchImmediate = _ref$watchImmediate === void 0 ? false : _ref$watchImmediate,
      _ref$generatorReducer = _ref.generatorReducer,
      generatorReducer = _ref$generatorReducer === void 0 ? false : _ref$generatorReducer;

  try {
    justTip("cc version " + _ccContext["default"].info.version);
    _ccContext["default"].isHot = isHot;
    _ccContext["default"].errorHandler = errorHandler;
    _ccContext["default"].isStrict = isStrict;
    _ccContext["default"].isDebug = isDebug;
    _ccContext["default"].bindCtxToMethod = bindCtxToMethod;
    _ccContext["default"].computedCompare = computedCompare;
    _ccContext["default"].watchCompare = watchCompare;
    _ccContext["default"].watchImmediate = watchImmediate;
    _ccContext["default"].generatorReducer = generatorReducer;
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
        justTip("[[startUp]]: CcDispatcher existed already");
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