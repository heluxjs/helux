"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var okeys = util.okeys,
    isPlainJsonObject = util.isPlainJsonObject;
var _state = _ccContext["default"].store._state;
/**
 * 根据connect,watchedKeys算出ccClassKey值和connectedModuleKeyMapping值
 */

function _default(connectSpec, watchedKeys, belongModule, compTypePrefix) {
  if (!isPlainJsonObject(connectSpec)) {
    throw new Error("CcFragment or CcClass's prop connect type error, it is not a plain json object");
  }

  var invalidConnect = "CcFragment or CcClass's prop connect is invalid,";

  var invalidConnectItem = function invalidConnectItem(m) {
    return invalidConnect + " module[" + m + "]'s value must be * or array of string";
  };

  var moduleNames = okeys(connectSpec);
  moduleNames.sort();
  var featureStrs = [];
  var connectedModuleKeyMapping = {};
  moduleNames.forEach(function (m) {
    var moduleState = _state[m];
    var feature = compTypePrefix + "_" + m + "/";

    if (moduleState === undefined) {
      throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
    }

    var val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*') throw new Error(invalidConnectItem(m));else {
        featureStrs.push(feature + "*");
        okeys(moduleState).forEach(function (sKey) {
          return connectedModuleKeyMapping[m + "/" + sKey] = sKey;
        });
      }
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      val.forEach(function (sKey) {
        if (!moduleState.hasOwnProperty(sKey)) {
          throw new Error(invalidConnect + " module[" + m + "]'s key[" + sKey + "] not declared in cc store ");
        } else {
          feature += sKey + ",";
          connectedModuleKeyMapping[m + "/" + sKey] = sKey;
        }
      });
      featureStrs.push(feature);
    }
  });
  featureStrs.push('|'); // 之后是watchKeys相关的特征值参数

  if (watchedKeys === '*') featureStrs.push(compTypePrefix + "_$" + belongModule + "/*");else {
    watchedKeys.sort();
    var tmpStr = belongModule + "/" + watchedKeys.join(',');
    featureStrs.push(tmpStr);
  }
  return {
    featureStr: featureStrs.join('@'),
    connectedModuleKeyMapping: connectedModuleKeyMapping,
    connectedModuleNames: moduleNames
  };
}