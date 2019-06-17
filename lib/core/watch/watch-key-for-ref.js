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

function _default(stateModule, watchSpec, connect, refEntireState, userCommitState, ctx) {
  var shouldCurrentRefUpdate = true;

  if (watchSpec) {
    var globalStateKeys = moduleName_stateKeys_[_constant.MODULE_GLOBAL];
    var moduleStateKeys = moduleName_stateKeys_[stateModule];
    var refWatch = watchSpec;
    var watchStateKeys = util.okeys(refWatch);
    var len = watchStateKeys.length;
    var shouldNouUpdateLen = 0;
    watchStateKeys.forEach(function (key) {
      var _shouldSkipKey = (0, _shouldSkipKey2["default"])(key, stateModule, connect, moduleStateKeys, globalStateKeys),
          stateKey = _shouldSkipKey.stateKey,
          skip = _shouldSkipKey.skip,
          keyModule = _shouldSkipKey.keyModule;

      if (skip) return;
      var commitValue = userCommitState[stateKey];

      if (commitValue !== undefined) {
        var watchFn = refWatch[key];
        var targetModule = keyModule || stateModule;
        var moduleState = getState(targetModule);
        var keyDesc = {
          key: stateKey,
          module: targetModule,
          moduleState: moduleState
        };
        var ret = watchFn(commitValue, refEntireState[stateKey], keyDesc, ctx); // watchFn(newValue, oldValue);

        if (ret === false) shouldNouUpdateLen++;
      }
    }); //只有所有watch都返回false，才不触发当前实例更新

    if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}