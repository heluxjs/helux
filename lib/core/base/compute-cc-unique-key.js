"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _uuid = _interopRequireDefault(require("./uuid"));

var justWarning = util.justWarning,
    makeUniqueCcKey = util.makeUniqueCcKey;

function _default(isClassSingle, ccClassKey, ccKey, tag) {
  var ccUniqueKey;

  if (isClassSingle) {
    //??? need strict
    if (ccKey) justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[" + ccKey + "]");
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      var uuidStr = (0, _uuid["default"])(tag);
      ccUniqueKey = makeUniqueCcKey(ccClassKey, uuidStr);
    }
  }

  return ccUniqueKey;
}