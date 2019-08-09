"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var getState = _ccContext["default"].store.getState;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

function _default(refCtx, stateModule, oldState, committedState) {
  var watchSpec = refCtx.watchSpec,
      connect = refCtx.connect,
      refModule = refCtx.module;
  if (watchSpec.hasFn !== true) return true;
  var shouldCurrentRefUpdate = true;
  var moduleStateKeys = moduleName_stateKeys_[refModule];
  var watchFns = watchSpec.watchFns;
  var watchStateKeys = util.okeys(watchFns);
  watchStateKeys.forEach(function (key) {
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
  });
  return shouldCurrentRefUpdate;
}