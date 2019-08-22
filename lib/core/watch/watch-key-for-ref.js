"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var _pickDepFns = _interopRequireDefault(require("../base/pick-dep-fns"));

var getState = _ccContext["default"].store.getState;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

function _default(refCtx, stateModule, oldState, committedState, checkImmediate) {
  var watchFns = refCtx.watchFns,
      watchDep = refCtx.watchDep,
      hasWatchFn = refCtx.hasWatchFn,
      connect = refCtx.connect,
      refModule = refCtx.module,
      immediateWatchKeys = refCtx.immediateWatchKeys;
  if (!hasWatchFn) return true;
  var shouldCurrentRefUpdate = true;
  var moduleStateKeys = moduleName_stateKeys_[refModule]; // 触发直接对stateKey定义的相关watch函数

  (0, _util.okeys)(watchFns).forEach(function (key) {
    if (checkImmediate) {
      if (!immediateWatchKeys.includes(key)) return;
    }

    var _shouldSkipKey = (0, _shouldSkipKey2["default"])(key, refModule, stateModule, connect, moduleStateKeys),
        stateKey = _shouldSkipKey.stateKey,
        skip = _shouldSkipKey.skip,
        keyModule = _shouldSkipKey.keyModule;

    if (skip) return;
    var commitValue = committedState[stateKey];

    if (commitValue !== undefined) {
      var watchFn = watchFns[key];
      var targetModule = keyModule || refModule;
      var moduleState = getState(targetModule);
      var fnCtx = {
        key: stateKey,
        module: targetModule,
        moduleState: moduleState,
        committedState: committedState
      };
      var ret = watchFn(commitValue, oldState[stateKey], fnCtx, refCtx); // watchFn(newValue, oldValue);
      //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新

      if (ret === false) shouldCurrentRefUpdate = false;
    }
  }); // 触发有stateKey依赖列表相关的watch函数

  var pickedFns = (0, _pickDepFns["default"])(watchDep, stateModule, committedState);
  pickedFns.forEach(function (_ref) {
    var fn = _ref.fn;
    var ret = fn(committedState, oldState, refCtx);
    if (ret === false) shouldCurrentRefUpdate = false;
  });
  return shouldCurrentRefUpdate;
}