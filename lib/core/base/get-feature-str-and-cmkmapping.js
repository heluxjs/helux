"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireWildcard(require("../../support/util"));

var _state = _ccContext["default"].store._state;
/**
 * 根据connect参数算出ccClassKey值和connectedModuleKeyMapping值
 */

function _default(connectSpec, fragmentModule, fragmentPrefix, watchedKeys) {
  if (!_util["default"].isPlainJsonObject(connectSpec)) {
    throw new Error("CcFragment or CcClass's prop connect type error, it is not a plain json object");
  }

  var invalidConnect = "CcFragment or CcClass's prop connect is invalid,";

  var invalidConnectItem = function invalidConnectItem(m) {
    return invalidConnect + " module[" + m + "]'s value must be * or array of string";
  };

  var moduleNames = Object.keys(connectSpec);
  moduleNames.sort();
  var featureStrs = [];
  var connectedModuleKeyMapping = {};
  moduleNames.forEach(function (m) {
    var moduleState = _state[m];
    var feature = fragmentPrefix + "_" + m + "/";

    if (moduleState === undefined) {
      throw new Error(invalidConnect + " module[" + m + "] not found in cc store ");
    }

    var val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*') throw new Error(invalidConnectItem(m));else {
        featureStrs.push(feature + "*");
        (0, _util.okeys)(moduleState).forEach(function (sKey) {
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

  if (fragmentModule) {
    if (watchedKeys === '*') featureStrs.unshift(fragmentPrefix + "_$" + fragmentModule + "/*");else {
      watchedKeys.sort();
      var tmpStr = fragmentModule + "/" + watchedKeys.join(',');
      featureStrs.unshift(tmpStr);
    }
  }

  return {
    featureStr: featureStrs.join('|'),
    connectedModuleKeyMapping: connectedModuleKeyMapping,
    connectedModuleNames: moduleNames
  };
}