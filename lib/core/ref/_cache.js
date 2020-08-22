"use strict";

exports.__esModule = true;
exports.createModuleNode = createModuleNode;
exports.getCacheKey = getCacheKey;
exports.getCache = getCache;
exports.setCache = setCache;
var key_findResult_ = {};

function createModuleNode(moduleName) {
  key_findResult_[moduleName] = {};
}

function getCacheKey(moduleName, sharedStateKeys, renderKeys, renderKeyClasses) {
  if (renderKeyClasses === void 0) {
    renderKeyClasses = [];
  }

  var renderKeyStr = renderKeys ? renderKeys.join(',') : '';
  var featureStr1 = sharedStateKeys.sort().join(',');
  var featureStr2 = renderKeyClasses === '*' ? '*' : renderKeyClasses.sort().join(',');
  return moduleName + "/" + featureStr1 + "/" + renderKeyStr + "/" + featureStr2;
}

function getCache(moduleName, key) {
  return key_findResult_[moduleName][key];
}

function setCache(moduleName, key, result) {
  key_findResult_[moduleName][key] = result;
}