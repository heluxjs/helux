"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

function _default(key, stateModule, connectSpecLike, moduleStateKeys, globalStateKeys, ctx, writeRefComputedWhenRefIsCfrag) {
  if (writeRefComputedWhenRefIsCfrag === void 0) {
    writeRefComputedWhenRefIsCfrag = false;
  }

  var skip = false;
  var keyModule = '';
  var stateKey = key;

  if (key.includes('/')) {
    // moduledKey : 'foo/f1'
    var _key$split = key.split('/'),
        tmpKeyModule = _key$split[0],
        unmoduledKey = _key$split[1];

    keyModule = tmpKeyModule; //这个key的模块不是提交state所属的模块，也不属于global模块, 对应的watch就需要排除掉
    //因为setState只提交自己模块的数据，所以如果tmpKeyModule是其他模块，这里并不会被触发
    //dispatch调用如果指定了其他模块，是会触发这里的逻辑的

    if (keyModule !== _constant.MODULE_GLOBAL && keyModule !== stateModule) {
      skip = true;
    } else if (!connectSpecLike[stateModule]) {
      //key的模块没有在connect里定义过
      //??? need strict
      skip = true;
    } else if (!moduleStateKeys.includes(unmoduledKey) && !globalStateKeys.includes(unmoduledKey)) {
      //??? need strict
      util.justWarning("moduled key[" + key + "] is invalid");
      skip = true;
    } else {
      stateKey = unmoduledKey;
    }
  } else {
    //如果是CcFragment实例调用watch，写无模块的key
    if (ctx && ctx.isCcFragment) {
      //必需强制为true，才会写state;
      if (writeRefComputedWhenRefIsCfrag !== true) skip = true;
    }
  }

  return {
    skip: skip,
    stateKey: stateKey,
    keyModule: keyModule
  };
}