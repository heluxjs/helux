"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _util = _interopRequireWildcard(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _createDispatcher = _interopRequireDefault(require("./create-dispatcher"));

var boot = _interopRequireWildcard(require("../core/base/boot"));

var _clearContextIfUnderHotReloadMode = _interopRequireDefault(require("./clear-context-if-under-hot-reload-mode"));

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
      _ref$isReducerArgsOld = _ref.isReducerArgsOldMode,
      isReducerArgsOldMode = _ref$isReducerArgsOld === void 0 ? false : _ref$isReducerArgsOld,
      _ref$bindCtxToMethod = _ref.bindCtxToMethod,
      bindCtxToMethod = _ref$bindCtxToMethod === void 0 ? false : _ref$bindCtxToMethod;

  try {
    _util["default"].justTip("cc version " + _ccContext["default"].info.version);

    _ccContext["default"].isHot = isHot;
    _ccContext["default"].errorHandler = errorHandler;
    _ccContext["default"].isStrict = isStrict;
    _ccContext["default"].isDebug = isDebug;
    _ccContext["default"].isReducerArgsOldMode = isReducerArgsOldMode;
    _ccContext["default"].bindCtxToMethod = bindCtxToMethod;

    var err = _util["default"].makeError(_constant.ERR.CC_ALREADY_STARTUP);

    (0, _clearContextIfUnderHotReloadMode["default"])(true, err);
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
        var box = document.querySelector("#" + _constant.CC_DISPATCHER_BOX);

        if (!box) {
          box = document.createElement('div');
          box.id = _constant.CC_DISPATCHER_BOX;
          var boxSt = box.style;
          boxSt.position = 'fixed';
          boxSt.left = 0;
          boxSt.top = 0;
          boxSt.display = 'none';
          boxSt.zIndex = -888666;
          document.body.append(box);
        }

        _reactDom["default"].render(_react["default"].createElement(Dispatcher), box);

        _util["default"].justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        _util["default"].justTip("[[startUp]]: CcDispatcher existed already");
      }
    } else {
      throw new Error('customizing Dispatcher is not allowed in current version cc');
    }

    (0, _util.bindToWindow)('CC_CONTEXT', _ccContext["default"]);
    (0, _util.bindToWindow)('ccc', _ccContext["default"]);
    (0, _util.bindToWindow)('cccc', _ccContext["default"].computed._computedValue);
    (0, _util.bindToWindow)('sss', _ccContext["default"].store._state);
    _ccContext["default"].isCcAlreadyStartup = true; //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册

    boot.configPlugins(plugins);
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}