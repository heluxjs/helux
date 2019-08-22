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
  var computedFns = refCtx.computedFns,
      computedDep = refCtx.computedDep,
      hasComputedFn = refCtx.hasComputedFn,
      refModule = refCtx.module,
      refComputed = refCtx.refComputed,
      refConnectedComputed = refCtx.refConnectedComputed;
  if (!hasComputedFn) return;
  var moduleStateKeys = moduleName_stateKeys_[stateModule];
  var toBeComputedKeys = util.okeys(computedFns); // 对于computedFns, 采用先遍历toBeComputedKeys的方式

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
  }); // { stateKey_retKeys_: {}, retKey_fn_: {} }

  var moduleComputedDep = computedDep[stateModule];

  if (moduleComputedDep) {
    var stateKey_retKeys_ = moduleComputedDep.stateKey_retKeys_,
        retKey_fn_ = moduleComputedDep.retKey_fn_;
    var pickedFns = [];
    var retKey_picked_ = {};
    okeys(stateKey_retKeys_).forEach(function (stateKey) {
      var newValue = committedState[stateKey];

      if (newValue !== undefined || sKey === '*') {
        var retKeys = stateKey_retKeys_[stateKey];
        retKeys.forEach(function (retKey) {
          //没有挑过的方法才挑出来
          if (!retKey_picked_[retKey]) {
            retKey_picked_[retKey] = true;
            pickedFns.push({
              retKey: retKey,
              fn: retKey_fn_[k]
            });
          }
        });
      }
    });
    pickedFns.forEach(function (_ref) {
      var fn = _ref.fn,
          retKey = _ref.retKey;
      var computedValue = fn(committedState, oldState, refCtx);

      if (refModule === stateModule) {
        refComputed[retKey] = computedValue;
      } // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果


      var targetComputed = refConnectedComputed[keyModule];

      if (targetComputed) {
        targetComputed[retKey] = computedValue;
      }
    });
  }
}