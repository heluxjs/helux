"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireWildcard(require("../support/util"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _constant = require("../support/constant");

var justCalledByStartUp = false;

function _clearInsAssociation() {
  (0, _util.clearObject)(_ccContext["default"].event_handlers_);
  (0, _util.clearObject)(_ccContext["default"].ccUKey_handlerKeys_);
  var cct = _ccContext["default"].ccClassKey_ccClassContext_;
  Object.keys(cct).forEach(function (ccClassKey) {
    var ctx = cct[ccClassKey];
    (0, _util.clearObject)(ctx.ccKeys);
  });
  (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
  (0, _util.clearObject)(_ccContext["default"].ccUkey_ref_, [_constant.CC_DISPATCHER]);
  (0, _util.clearObject)(_ccContext["default"].refs, [_constant.CC_DISPATCHER]);
  (0, _util.clearObject)(_ccContext["default"].ccUkey_option_);
}

function _clearAll() {
  (0, _util.clearObject)(_ccContext["default"].globalStateKeys);
  (0, _util.clearObject)(_ccContext["default"].reducer._reducer);
  (0, _util.clearObject)(_ccContext["default"].store._state, [_constant.MODULE_DEFAULT, _constant.MODULE_CC, _constant.MODULE_GLOBAL, _constant.MODULE_CC_ROUTER], {});
  (0, _util.clearObject)(_ccContext["default"].computed._computedFn);
  (0, _util.clearObject)(_ccContext["default"].computed._computedValue);

  _clearInsAssociation();
}

function _prepareClear(cb) {
  if (_ccContext["default"].isCcAlreadyStartup) {
    if (_ccContext["default"].isHotReloadMode()) {
      cb();
    } else {
      _util["default"].justWarning(new Error('clear failed because of not running under hot reload mode!'));
    }
  } else {
    //还没有启动过，泽只是标记justCalledByStartUp为true
    justCalledByStartUp = true;
  }
}

function _default(clearAll, warningErrForClearAll) {
  if (clearAll === void 0) {
    clearAll = false;
  }

  _prepareClear(function () {
    if (clearAll) {
      justCalledByStartUp = true;

      _clearAll();

      _util["default"].justWarning(warningErrForClearAll);
    } else {
      // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
      // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命名单独放置在一个脚本里，
      // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
      // runConcent调用清理把justCalledByStartUp置为true，则renderApp就可以不用执行了
      // 随后只是改了某个component文件时，则只会触发 renderApp，
      // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
      if (justCalledByStartUp) {
        justCalledByStartUp = false;
        return;
      }

      var err = new Error("attention: method[clearContextIfUnderHotReloadMode] need been invoked before your app rendered!");

      _util["default"].justWarning(err);

      _clearInsAssociation();
    }
  });
}