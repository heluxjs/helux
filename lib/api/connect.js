"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./register"));

/**
 * 
 * @param {*} ccClassKey 
 * @param {object} connectSpec { [module:string]: value: string[] | '*' }
 * @param {object} option 
 * @param {boolean} [option.isPropsProxy] default is false
 * @param {boolean} [option.isSingle] default is false
 * @param {string} [option.module]
 * @param {Array<string>} [option.watchedKeys]
 */
function _default(ccClassKey, connectSpec, option) {
  if (option === void 0) {
    option = {};
  }

  var mergedOption = Object.assign({
    connect: connectSpec
  }, option);
  return (0, _register["default"])(ccClassKey, mergedOption);
}