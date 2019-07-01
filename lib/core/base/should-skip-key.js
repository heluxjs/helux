"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

function _default(specModule, key, stateModule, connectSpecLike, moduleStateKeys, ctx) {
  var skip = false;
  var keyModule = '';
  var stateKey = key;

  if (key.includes('/')) {
    // moduledKey : 'foo/f1'
    var _key$split = key.split('/'),
        tmpKeyModule = _key$split[0],
        unmoduledKey = _key$split[1];

    if (tmpKeyModule === '') {
      // '/f1'，观察实例所属模块的key
      tmpKeyModule = specModule;
      stateKey = specModule + key;
    }

    keyModule = tmpKeyModule; //这个key的模块不是提交state所属的模块， 对应的watch就需要排除掉
    //因为setState只提交自己模块的数据，所以如果tmpKeyModule是其他模块，这里并不会被触发
    //dispatch调用如果指定了其他模块，是会触发这里的逻辑的

    if (keyModule !== stateModule) {
      skip = true;
    } else if (!connectSpecLike[stateModule]) {
      //key的模块没有在connect里定义过
      //??? need strict
      skip = true;
    } else if (!moduleStateKeys.includes(unmoduledKey)) {
      //??? need strict
      util.justWarning("moduled key[" + key + "] is invalid");
      skip = true;
    } else {
      stateKey = unmoduledKey;
    }
  }

  return {
    skip: skip,
    stateKey: stateKey,
    keyModule: keyModule
  };
}