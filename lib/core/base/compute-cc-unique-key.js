"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _uuid = _interopRequireDefault(require("./uuid"));

var makeUniqueCcKey = util.makeUniqueCcKey;

function _default(ccClassKey, ccKey, tag) {
  var featureStr = ccKey || (0, _uuid["default"])(tag);
  return makeUniqueCcKey(ccClassKey, featureStr);
}