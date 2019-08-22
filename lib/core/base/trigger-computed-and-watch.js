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
      watchSpec = ctx.watchSpec,
      connect = ctx.connect,
      refModule = ctx.module;

  if (hasComputedFn) {
    var refState = ref.state;
    (0, _computeValueForRef["default"])(ctx, refModule, refState, refState);
    (0, _util.okeys)(connect).forEach(function (m) {
      var mState = getState(m);
      (0, _computeValueForRef["default"])(ctx, m, mState, mState);
    });
  }

  if (hasWatchFn) {
    var immediateWatchKeys = watchSpec.immediateWatchKeys;

    if (immediateWatchKeys.length > 0) {
      var module_stateSpec_ = {};
      immediateWatchKeys.forEach(function (key) {
        var targetModule, targetStateKey;

        if (key.includes('/')) {
          var _key$split = key.split('/'),
              module = _key$split[0],
              stateKey = _key$split[1];

          targetModule = module || refModule; // key: 'foo/f1' or '/f1'

          targetStateKey = stateKey;
        } else {
          targetModule = refModule;
          targetStateKey = key;
        }

        var stateSpec = (0, _util.safeGetObjectFromObject)(module_stateSpec_, targetModule, {
          state: {},
          module: targetModule
        });
        stateSpec.state[targetStateKey] = getState(targetModule)[targetStateKey];
      });
      Object.values(module_stateSpec_).forEach(function (stateSpec) {
        var module = stateSpec.module,
            state = stateSpec.state;
        (0, _watchKeyForRef["default"])(ctx, module, getState(module), state);
      });
    }
  }
}