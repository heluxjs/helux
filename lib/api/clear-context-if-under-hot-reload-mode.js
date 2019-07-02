"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireWildcard(require("../support/util"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _constant = require("../support/constant");

function _default(warningErr) {
  if (_ccContext["default"].isCcAlreadyStartup) {
    if (_util["default"].isHotReloadMode()) {
      //只有处于
      (0, _util.clearObject)(_ccContext["default"].globalStateKeys);
      (0, _util.clearObject)(_ccContext["default"].reducer._reducer);
      (0, _util.clearObject)(_ccContext["default"].store._state, [_constant.MODULE_DEFAULT, _constant.MODULE_CC, _constant.MODULE_GLOBAL, _constant.MODULE_CC_ROUTER], {});
      (0, _util.clearObject)(_ccContext["default"].computed._computedFn);
      (0, _util.clearObject)(_ccContext["default"].computed._computedValue);
      (0, _util.clearObject)(_ccContext["default"].event_handlers_);
      (0, _util.clearObject)(_ccContext["default"].ccUniqueKey_handlerKeys_);
      var cct = _ccContext["default"].ccClassKey_ccClassContext_;
      Object.keys(cct).forEach(function (ccClassKey) {
        var ctx = cct[ccClassKey];
        (0, _util.clearObject)(ctx.ccKeys);
      });
      (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
      (0, _util.clearObject)(_ccContext["default"].ccKey_ref_, [_constant.CC_DISPATCHER]);
      (0, _util.clearObject)(_ccContext["default"].refs, [_constant.CC_DISPATCHER]);
      (0, _util.clearObject)(_ccContext["default"].fragmentCcKeys);
      (0, _util.clearObject)(_ccContext["default"].ccKey_option_);
      var err = warningErr || new Error('attention: this method is only can been invoked before your app rendered!!');

      _util["default"].justTip(err);
    } else {
      _util["default"].justWarning(new Error('clear operation failed, current runtime is not running under hot reload mode!'));
    }
  }
}