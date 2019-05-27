"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _mapSharedKeyToGlobal = _interopRequireDefault(require("../mapper/map-shared-key-to-global"));

var _util = _interopRequireDefault(require("../../support/util"));

function _default(moduleName, moduleSharedKeyToGlobalKeyConfig) {
  var sharedKeys = Object.keys(moduleSharedKeyToGlobalKeyConfig);
  var sLen = sharedKeys.length;

  for (var k = 0; k < sLen; k++) {
    var sharedKey = sharedKeys[k];
    var globalMappingKey = moduleSharedKeyToGlobalKeyConfig[sharedKey];

    if (typeof globalMappingKey !== 'string') {
      throw new Error("globalMappingKey type error, is must be string, check your sharedToGlobalMapping! " + _util["default"].verboseInfo("module:" + moduleName + ", sharedKey:" + sharedKey));
    }

    (0, _mapSharedKeyToGlobal["default"])(moduleName, sharedKey, globalMappingKey);
  }
}