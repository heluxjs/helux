"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _register = _interopRequireDefault(require("./register"));

/**
 * 
 * @param {*} ccClassKey 
 * @param {object} stateToPropMapping { (moduleAndStateKey): (mappedStateKeyInPropState) }
 * @param {object} option 
 * @param {boolean} [option.extendInputClass] default is true
 * @param {boolean} [option.isSingle] default is false
 * @param {boolean} [option.isPropStateModuleMode] 
 * @param {boolean} [option.asyncLifecycleHook] 
 * @param {string} [option.module]
 * @param {Array<string>} [option.sharedStateKeys]
 * @param {Array<string>} [option.globalStateKeys]
 */
function _default(ccClassKey, stateToPropMapping, option) {
  if (option === void 0) {
    option = {};
  }

  var mergedOption = Object.assign({
    isPropStateModuleMode: true
  }, option, {
    stateToPropMapping: stateToPropMapping
  });
  return (0, _register.default)(ccClassKey, mergedOption);
}