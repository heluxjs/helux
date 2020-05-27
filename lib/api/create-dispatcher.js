"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _buildRefCtx = _interopRequireDefault(require("../core/ref/build-ref-ctx"));

var _mapRegistrationInfo = _interopRequireDefault(require("../core/base/map-registration-info"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var noop = function noop() {};

function _default() {
  var ccClassKey = _constant.CC_DISPATCHER;
  (0, _mapRegistrationInfo["default"])(_constant.MODULE_DEFAULT, ccClassKey, '', _constant.CC_CLASS, [], [], [], false, 'cc');
  var mockRef = {
    setState: noop,
    forceUpdate: noop
  };
  (0, _buildRefCtx["default"])(mockRef, {
    module: _constant.MODULE_DEFAULT,
    connect: [],
    watchedKeys: [],
    ccClassKey: ccClassKey,
    state: {}
  });
  _ccContext["default"].permanentDispatcher = mockRef;
}