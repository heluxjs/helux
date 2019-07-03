"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./register"));

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.watchedKeys is called s for short 
 * option.connect is called pm for c 
 * option.isSingle is called is for short 
 * option.reducerModule is called re for short 
 * option.isPropsProxy is called ip for short 
 */
function _default(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.m,
      watchedKeys = _ref.w,
      storedKeys = _ref.st,
      connect = _ref.c,
      isSingle = _ref.is,
      reducerModule = _ref.re,
      isPropsProxy = _ref.ip;

  return (0, _register["default"])(ccClassKey, {
    isPropsProxy: isPropsProxy,
    module: module,
    watchedKeys: watchedKeys,
    storedKeys: storedKeys,
    connect: connect,
    isSingle: isSingle,
    reducerModule: reducerModule
  });
}