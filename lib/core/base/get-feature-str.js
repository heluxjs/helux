"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var okeys = util.okeys;
/**
 * 根据connect,watchedKeys,以及用户提供的原始renderKeyClasses 计算 特征值
 */

function _default(belongModule, connectSpec, renderKeyClasses) {
  var moduleNames = okeys(connectSpec);
  moduleNames.sort();
  var classesStr;
  if (renderKeyClasses === '*') classesStr = '*';else classesStr = renderKeyClasses.slice().join(',');
  return belongModule + "/" + moduleNames.join(',') + "/" + classesStr;
}