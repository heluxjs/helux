"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.checkModuleNameBasically = checkModuleNameBasically;
exports.checkModuleName = checkModuleName;
exports.checkModuleNameAndState = checkModuleNameAndState;
exports.checkStoredKeys = checkStoredKeys;

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var isModuleNameCcLike = util.isModuleNameCcLike,
    isModuleNameValid = util.isModuleNameValid,
    vbi = util.verboseInfo,
    makeError = util.makeError;
/** 检查模块名，名字合法，就算检查通过 */

function checkModuleNameBasically(moduleName) {
  if (!isModuleNameValid(moduleName)) {
    throw new Error("module[" + moduleName + "] writing is invalid!");
  }

  if (isModuleNameCcLike(moduleName)) {
    throw new Error("'$$cc' is a built-in module name for concent");
  }
}
/**
 * 检查模块名, moduleMustNotExisted 默认为true，表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
 * 如果设置为false，表示【module名字合法】且【对应的moduleState存在】，才算检查通过
 * @param {string} moduleName 
 * @param {boolean} moduleMustNotExisted  true 要求模块应该不存在 ,false 要求模块状态应该已存在
 */


function checkModuleName(moduleName, moduleMustNotExisted, vbiMsg) {
  if (moduleMustNotExisted === void 0) {
    moduleMustNotExisted = true;
  }

  if (vbiMsg === void 0) {
    vbiMsg = '';
  }

  var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

  var _state = _ccContext["default"].store._state;
  checkModuleNameBasically(moduleName);

  if (moduleName !== _constant.MODULE_GLOBAL) {
    if (moduleMustNotExisted) {
      if (util.isObjectNotNull(_state[moduleName])) {
        //但是却存在了
        throw makeError(_constant.ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
      }
    } else {
      if (!_state[moduleName]) {
        //实际上却不存在
        throw makeError(_constant.ERR.CC_MODULE_NOT_FOUND, vbi(_vbiMsg));
      }
    }
  }
}

function checkModuleNameAndState(moduleName, moduleState, moduleMustNotExisted) {
  checkModuleName(moduleName, moduleMustNotExisted);

  if (!util.isPJO(moduleState)) {
    throw new Error("module[" + moduleName + "]'s state " + _privConstant.NOT_A_JSON);
  }
}

function checkStoredKeys(moduleStateKeys, storedKeys) {
  var isSKeysArr = Array.isArray(storedKeys);

  if (!isSKeysArr && storedKeys !== '*') {
    throw new Error("storedKeys type err, " + _privConstant.STR_ARR_OR_STAR);
  }

  if (isSKeysArr) {
    storedKeys.forEach(function (sKey) {
      if (moduleStateKeys.includes(sKey)) {
        throw new Error("the item[" + sKey + "] of storedKeys is not a module state key!");
      }
    });
  }
}