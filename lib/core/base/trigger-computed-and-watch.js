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
  var ctx = ref.ctx;
  var hasComputedFn = ctx.hasComputedFn,
      hasWatchFn = ctx.hasWatchFn,
      immediateWatchKeys = ctx.immediateWatchKeys,
      connect = ctx.connect,
      refModule = ctx.module;
  var refState = ctx.state;

  if (hasComputedFn) {
    (0, _computeValueForRef["default"])(ctx, refModule, refState, refState);
    (0, _util.okeys)(connect).forEach(function (m) {
      var mState = getState(m);
      (0, _computeValueForRef["default"])(ctx, m, mState, mState);
    });
  }

  if (hasWatchFn) {
    if (immediateWatchKeys.length > 0) {
      var module_state_ = {};
      immediateWatchKeys.forEach(function (key) {
        var targetModule;

        if (key.includes('/')) {
          var _key$split = key.split('/'),
              module = _key$split[0];

          targetModule = module || refModule; // key: 'foo/f1' or '/f1'
        } else {
          targetModule = refModule;
        }

        var state = targetModule === refModule ? refState : getState(targetModule);
        module_state_[targetModule] = state;
      });
      (0, _util.okeys)(module_state_).forEach(function (m) {
        var state = module_state_[m];
        (0, _watchKeyForRef["default"])(ctx, m, state, state, true);
      });
    }
  }
}