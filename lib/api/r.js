"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./register"));

/****
 * short for register
 * the option's definition is also been changed
 * option.module is called m for short 
 * option.sharedStateKeys is called s for short 
 * option.connect is called pm for c 
 * option.isSingle is called is for short 
 * option.asyncLifecycleHook is called as for short 
 * option.reducerModule is called re for short 
 * option.isPropsProxy is called ip for short 
 */
function _default(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.m,
      sharedStateKeys = _ref.s,
      storedStateKeys = _ref.st,
      connect = _ref.c,
      isSingle = _ref.is,
      asyncLifecycleHook = _ref.as,
      reducerModule = _ref.re,
      isPropsProxy = _ref.ip;

  return (0, _register["default"])(ccClassKey, {
    isPropsProxy: isPropsProxy,
    module: module,
    sharedStateKeys: sharedStateKeys,
    storedStateKeys: storedStateKeys,
    connect: connect,
    isSingle: isSingle,
    asyncLifecycleHook: asyncLifecycleHook,
    reducerModule: reducerModule
  });
}