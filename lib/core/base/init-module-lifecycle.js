"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _handlerFactory = require("../state/handler-factory");

var _catchCcError = _interopRequireDefault(require("./catch-cc-error"));

var getState = _ccContext["default"].store.getState;

function _default(moduleName, lifecycle) {
  if (lifecycle === void 0) {
    lifecycle = {};
  }

  var _lifecycle = lifecycle,
      initState = _lifecycle.initState,
      initStateDone = _lifecycle.initStateDone,
      moduleLoaded = _lifecycle.moduleLoaded; // 对接原来的 moduleConf.init initPost

  _ccContext["default"].lifecycle._lifecycle[moduleName] = lifecycle;
  var moduleState = getState(moduleName);

  if (initState) {
    Promise.resolve().then(function () {
      return initState(moduleState);
    }).then(function (state) {
      (0, _handlerFactory.makeSetStateHandler)(moduleName, initStateDone)(state);
    })["catch"](_catchCcError["default"]);
  }

  if (moduleLoaded) {
    moduleLoaded((0, _handlerFactory.makeModuleDispatcher)(moduleName), moduleState);
  }
}