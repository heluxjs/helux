"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var ev = _interopRequireWildcard(require("../event"));

var _triggerSetupEffect = _interopRequireDefault(require("./trigger-setup-effect"));

var _setRef = _interopRequireDefault(require("../ref/set-ref"));

var _afterRender = _interopRequireDefault(require("../ref/after-render"));

function _default(ref) {
  (0, _afterRender["default"])(ref);
  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  var _ref$ctx = ref.ctx,
      isSingle = _ref$ctx.isSingle,
      ccClassKey = _ref$ctx.ccClassKey,
      ccKey = _ref$ctx.ccKey,
      ccUniqueKey = _ref$ctx.ccUniqueKey,
      __$$onEvents = _ref$ctx.__$$onEvents;
  (0, _setRef["default"])(ref, isSingle, ccClassKey, ccKey, ccUniqueKey); // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空

  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(function (_ref) {
      var fn = _ref.fn,
          args = _ref.args;
      return fn.apply(void 0, args);
    });

    __$$onEvents.length = 0;
  }

  (0, _triggerSetupEffect["default"])(ref, true);
}