"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var getState = _ccContext["default"].store.getState;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_; //CcFragment实例调用会提供ctx

function _default(stateModule, computedSpec, refComputed, refConnectedComputed, oldState, commitState, ctx) {
  if (computedSpec) {
    var moduleStateKeys = moduleName_stateKeys_[stateModule];
    var computedFns = computedSpec.computedFns,
        computedSpecModule = computedSpec.module;
    var toBeComputedKeys = util.okeys(computedFns);
    toBeComputedKeys.forEach(function (key) {
      var _shouldSkipKey = (0, _shouldSkipKey2["default"])(computedSpecModule, key, stateModule, refConnectedComputed, moduleStateKeys),
          stateKey = _shouldSkipKey.stateKey,
          skip = _shouldSkipKey.skip,
          keyModule = _shouldSkipKey.keyModule;

      if (skip) return;
      var newValue = commitState[stateKey];

      if (newValue !== undefined) {
        var fn = computedFns[key]; //用原始定义当然key去取fn

        var targetModule = keyModule || stateModule;
        var moduleState = getState(targetModule);
        var keyDesc = {
          key: stateKey,
          module: targetModule,
          moduleState: moduleState
        };
        var computedValue = fn(newValue, oldState[stateKey], keyDesc, ctx);

        if (keyModule) {
          refConnectedComputed[keyModule][stateKey] = computedValue; //计算的目标key的模块和实例所属模块值一样时，也向refComputed赋值

          if (keyModule === computedSpecModule) {
            refComputed[stateKey] = computedValue;
          }
        } else {
          refComputed[stateKey] = computedValue;
        }
      }
    });
  }
}