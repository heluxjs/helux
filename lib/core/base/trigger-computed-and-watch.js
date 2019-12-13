"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

var _computeValueForRef = _interopRequireDefault(require("../computed/compute-value-for-ref"));

var _watchKeyForRef = _interopRequireDefault(require("../watch/watch-key-for-ref"));

var getState = _ccContext["default"].store.getState;
var callInfo = {
  payload: null,
  renderKey: '',
  delay: -1
};
/** 由首次render触发 */

function _default(ref) {
  var ctx = ref.ctx;
  var hasComputedFn = ctx.hasComputedFn,
      hasWatchFn = ctx.hasWatchFn,
      connect = ctx.connect,
      refModule = ctx.module;
  var connectedModules = (0, _util.okeys)(connect);
  var refState = ctx.state;

  if (hasComputedFn) {
    (0, _computeValueForRef["default"])(ctx, refModule, refState, refState, callInfo, true);
    connectedModules.forEach(function (m) {
      var mState = getState(m);
      (0, _computeValueForRef["default"])(ctx, m, mState, mState, callInfo, true);
    });
  }

  if (hasWatchFn) {
    (0, _watchKeyForRef["default"])(ctx, refModule, refState, refState, callInfo, true);
    connectedModules.forEach(function (m) {
      var mState = getState(m);
      (0, _watchKeyForRef["default"])(ctx, m, mState, mState, callInfo, true);
    });
  }
}