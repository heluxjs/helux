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
 * option.globalStateKeys is called g for short 
 * option.stateToPropMapping is called pm for short 
 * option.isPropStateModuleMode is called mm for short 
 * option.isSingle is called is for short 
 * option.asyncLifecycleHook is called as for short 
 * option.reducerModule is called re for short 
 * option.extendInputClass is called ex for short 
 */
function _default(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.m,
      sharedStateKeys = _ref.s,
      globalStateKeys = _ref.g,
      storedStateKeys = _ref.st,
      stateToPropMapping = _ref.pm,
      isPropStateModuleMode = _ref.mm,
      isSingle = _ref.is,
      asyncLifecycleHook = _ref.as,
      reducerModule = _ref.re,
      extendInputClass = _ref.ex;

  return (0, _register["default"])(ccClassKey, {
    extendInputClass: extendInputClass,
    module: module,
    sharedStateKeys: sharedStateKeys,
    globalStateKeys: globalStateKeys,
    storedStateKeys: storedStateKeys,
    stateToPropMapping: stateToPropMapping,
    isPropStateModuleMode: isPropStateModuleMode,
    isSingle: isSingle,
    asyncLifecycleHook: asyncLifecycleHook,
    reducerModule: reducerModule
  });
}