"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var getState = _ccContext["default"].store.getState;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_; //CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块

function _default(refCtx, stateModule, oldState, committedState) {
  var computedSpec = refCtx.computedSpec,
      refModule = refCtx.module,
      refComputed = refCtx.refComputed,
      refConnectedComputed = refCtx.refConnectedComputed;
  var computedFns = computedSpec.computedFns,
      hasFn = computedSpec.hasFn;
  if (hasFn !== true) return;
  var moduleStateKeys = moduleName_stateKeys_[stateModule];
  var toBeComputedKeys = util.okeys(computedFns);
  toBeComputedKeys.forEach(function (key) {
    var _shouldSkipKey = (0, _shouldSkipKey2["default"])(key, refModule, stateModule, refConnectedComputed, moduleStateKeys),
        stateKey = _shouldSkipKey.stateKey,
        skip = _shouldSkipKey.skip,
        keyModule = _shouldSkipKey.keyModule;

    if (skip) return;
    var newValue = committedState[stateKey];

    if (newValue !== undefined) {
      var fn = computedFns[key]; //用原始定义当然key去取fn

      var moduleState = getState(keyModule);
      var fnCtx = {
        key: stateKey,
        module: keyModule,
        moduleState: moduleState,
        committedState: committedState
      };
      var computedValue = fn(newValue, oldState[stateKey], fnCtx, refCtx);
      var targetComputed = refConnectedComputed[keyModule]; //foo模块的实例，定义的watchKey是 foo/f1, 此时skip是false，但是结果不会向refConnectedComputed里放的
      //因为refConnectedComputed放置的只是connect连接的模块的key结算结果

      if (targetComputed) {
        targetComputed[stateKey] = computedValue;
      } //foo模块的实例，定义的watchKey是 foo/f1, /f1, f1 都会放置到refComputed里


      if (!keyModule || keyModule === refModule) {
        refComputed[stateKey] = computedValue;
      }
    }
  });
}