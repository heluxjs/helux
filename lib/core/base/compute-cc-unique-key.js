"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _default(isClassSingle, ccClassKey, ccKey, tag) {
  var ccUniqueKey;

  if (isClassSingle) {
    //??? need strict
    if (ccKey) _util["default"].justWarning("now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[" + ccKey + "]");
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = _util["default"].makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      var uuidStr = (0, _uuid["default"])(tag);
      ccUniqueKey = _util["default"].makeUniqueCcKey(ccClassKey, uuidStr);
    }
  }

  return ccUniqueKey;
}