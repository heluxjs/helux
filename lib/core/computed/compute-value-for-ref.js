"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

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
  var moduleStateKeys = moduleName_stateKeys_[refModule]; //todo 优化computedFns {m:{[moduleA]: {} }, self: {} }
  // 调用differStateKeys, 然后直接取命中这些函数
  // 触发直接对stateKey定义的相管computed函数

  (0, _util.okeys)(computedFns).forEach(function (key) {
    // key: 'foo/a' 'a' '/a'
    var _shouldSkipKey = (0, _shouldSkipKey2["default"])(key, refModule, stateModule, refConnectedComputed, moduleStateKeys),
        stateKey = _shouldSkipKey.stateKey,
        skip = _shouldSkipKey.skip,
        keyModule = _shouldSkipKey.keyModule;

    if (skip) return;
    var newValue = committedState[stateKey];
    var oldValue = oldState[stateKey];

    if (newValue !== oldValue) {
      var fn = computedFns[key]; //用原始定义当然key去取fn

      var moduleState = getState(keyModule);
      var fnCtx = {
        key: stateKey,
        module: keyModule,
        moduleState: moduleState,
        committedState: committedState
      };
      var computedValue = fn(newValue, oldValue, fnCtx, refCtx);
      var targetComputed = refConnectedComputed[keyModule]; //foo模块的实例，定义的watchKey是 foo/f1, 此时skip是false，但是结果不会向refConnectedComputed里放的
      //因为refConnectedComputed放置的只是connect连接的模块的key结算结果

      if (targetComputed) {
        targetComputed[stateKey] = computedValue;
      } //foo模块的实例，定义的watchKey是 foo/f1, /f1, f1 都会放置到refComputed里


      if (!keyModule || keyModule === refModule) {
        refComputed[stateKey] = computedValue;
      }
    }
  }); // 触发依赖stateKeys相关的computed函数

  var pickedFns = (0, _pickDepFns["default"])(computedDep, stateModule, oldState, committedState);
  pickedFns.forEach(function (_ref) {
    var fn = _ref.fn,
        retKey = _ref.retKey;
    var computedValue = fn(committedState, oldState, refCtx);

    if (refModule === stateModule) {
      refComputed[retKey] = computedValue;
    } // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果


    var targetComputed = refConnectedComputed[stateModule];

    if (targetComputed) {
      targetComputed[retKey] = computedValue;
    }
  });
}