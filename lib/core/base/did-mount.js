"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var ev = _interopRequireWildcard(require("../event"));

var _triggerSetupEffect = _interopRequireDefault(require("./trigger-setup-effect"));

function _default(ref) {
  ref.__$$isBF = false;
  ref.__$$isMounted = true;
  var _ref$ctx = ref.ctx,
      module = _ref$ctx.module,
      ccClassKey = _ref$ctx.ccClassKey,
      ccUniqueKey = _ref$ctx.ccUniqueKey,
      onEvents = _ref$ctx.onEvents;
  onEvents.forEach(function (_ref) {
    var event = _ref.event,
        identity = _ref.identity,
        handler = _ref.handler;
    ev.bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler);
  });
  (0, _triggerSetupEffect["default"])(ref, true);
}