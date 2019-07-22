"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _shouldSkipKey2 = _interopRequireDefault(require("../base/should-skip-key"));

var getState = _ccContext["default"].store.getState;
var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

function _default(stateModule, watchSpec, connect, refEntireState, committedState, callerCtx) {
  var shouldCurrentRefUpdate = true;

  if (watchSpec) {
    var globalStateKeys = moduleName_stateKeys_[_constant.MODULE_GLOBAL];
    var moduleStateKeys = moduleName_stateKeys_[stateModule];
    var watchFns = watchSpec.watchFns,
        watchSpecModule = watchSpec.module;
    var watchStateKeys = util.okeys(watchFns);
    var len = watchStateKeys.length;
    var shouldNotUpdateLen = 0;
    watchStateKeys.forEach(function (key) {
      var _shouldSkipKey = (0, _shouldSkipKey2["default"])(watchSpecModule, key, stateModule, connect, moduleStateKeys, globalStateKeys),
          stateKey = _shouldSkipKey.stateKey,
          skip = _shouldSkipKey.skip,
          keyModule = _shouldSkipKey.keyModule;

      if (skip) return;
      var commitValue = committedState[stateKey];

      if (commitValue !== undefined) {
        var watchFn = watchFns[key];
        var targetModule = keyModule || stateModule;
        var moduleState = getState(targetModule);
        var fnCtx = {
          key: stateKey,
          module: targetModule,
          moduleState: moduleState,
          committedState: committedState
        };
        var ret = watchFn(commitValue, refEntireState[stateKey], fnCtx, callerCtx); // watchFn(newValue, oldValue);

        if (ret === false) shouldNotUpdateLen++;
      }
    }); //只有所有watch都返回false，才不触发当前实例更新

    if (shouldNotUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}