"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

var _computeValueForRef = _interopRequireDefault(require("../computed/compute-value-for-ref"));

var _watchKeyForRef = _interopRequireDefault(require("../watch/watch-key-for-ref"));

var getState = _ccContext["default"].store.getState;
/** 由首次render触发 */

function _default(ref) {
  var ctx = ref.ctx; // 取原始对象，防止computeValueForRef里用Object.assign触发依赖收集
  // 首次挂载组件时，prevState是原始对象，state可能是代理过的对象

  var hasComputedFn = ctx.hasComputedFn,
      hasWatchFn = ctx.hasWatchFn,
      connectedModules = ctx.connectedModules,
      refModule = ctx.module,
      refState = ctx.state;
  var callInfo = (0, _util.makeCallInfo)(refModule);

  var cuOrWatch = function cuOrWatch(op) {
    op(ref, refModule, refState, refState, callInfo, true, true);
    connectedModules.forEach(function (m) {
      var mState = getState(m);
      var tmpCallInfo = (0, _util.makeCallInfo)(m);
      op(ref, m, mState, mState, tmpCallInfo, true, true);
    });
  };

  if (hasComputedFn) cuOrWatch(_computeValueForRef["default"]);
  if (hasWatchFn) cuOrWatch(_watchKeyForRef["default"]);
}