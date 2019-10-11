"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _pickDepFns2 = _interopRequireDefault(require("../base/pick-dep-fns"));

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
function _default(refCtx, stateModule, oldState, committedState, isBeforeMount) {
  if (isBeforeMount === void 0) {
    isBeforeMount = false;
  }

  if (!refCtx.hasComputedFn) return;
  var computedDep = refCtx.computedDep,
      refModule = refCtx.module,
      refComputed = refCtx.refComputed,
      refConnectedComputed = refCtx.refConnectedComputed,
      ccUniqueKey = refCtx.ccUniqueKey; // 触发依赖stateKeys相关的computed函数

  var _pickDepFns = (0, _pickDepFns2["default"])(isBeforeMount, 'ref', 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey),
      pickedFns = _pickDepFns.pickedFns,
      setted = _pickDepFns.setted,
      changed = _pickDepFns.changed;

  if (pickedFns.length) {
    var newState = Object.assign({}, oldState, committedState);
    pickedFns.forEach(function (_ref) {
      var fn = _ref.fn,
          retKey = _ref.retKey,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        setted: setted,
        changed: changed,
        stateModule: stateModule,
        refModule: refModule,
        oldState: oldState,
        committedState: committedState,
        refCtx: refCtx
      };
      var firstDepKey = depKeys[0];
      var computedValue;

      if (depKeys.length === 1 && firstDepKey !== '*') {
        computedValue = fn(committedState[firstDepKey], oldState[firstDepKey], fnCtx, refCtx);
      } else {
        computedValue = fn(newState, oldState, fnCtx);
      }

      if (refModule === stateModule) {
        refComputed[retKey] = computedValue;
      } // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果


      var targetComputed = refConnectedComputed[stateModule];

      if (targetComputed) {
        targetComputed[retKey] = computedValue;
      }
    });
  }
}