"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.checkModuleNameBasically = checkModuleNameBasically;
exports.checkReducerModuleName = checkReducerModuleName;
exports.checkModuleName = checkModuleName;
exports.checkModuleState = checkModuleState;
exports.checkModuleNameAndState = checkModuleNameAndState;
exports.checkModuleNameBasicallyAndState = checkModuleNameBasicallyAndState;

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var isModuleNameCcLike = util.isModuleNameCcLike,
    isModuleNameValid = util.isModuleNameValid,
    vbi = util.verboseInfo,
    makeError = util.makeError;
/** 检查模块名，名字合法，就算检查通过 */

function checkModuleNameBasically(moduleName) {
  if (!isModuleNameValid(moduleName)) {
    throw makeError(_constant.ERR.CC_MODULE_NAME_INVALID, vbi(" module[" + moduleName + "] is invalid!"));
  }

  if (isModuleNameCcLike(moduleName)) {
    throw makeError(_constant.ERR.CC_MODULE_KEY_CC_FOUND);
  }
}

function checkReducerModuleName(moduleName) {
  var _reducer = _ccContext["default"].reducer._reducer;
  checkModuleNameBasically(moduleName);

  if (moduleName !== _constant.MODULE_GLOBAL) {
    if (_reducer[moduleName]) {
      throw makeError(_constant.ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, vbi("module[" + moduleName + "]"));
    }
  }
}
/**
 * 检查模块名, moduleStateMustNotDefinedInStore 默认为true，表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
 * 如果设置为false，表示【module名字合法】且【对应的moduleState存在】，才算检查通过
 * @param {string} moduleName 
 * @param {boolean} moduleStateMustNotDefinedInStore 
 */


function checkModuleName(moduleName, moduleStateMustNotDefinedInStore, vbiMsg) {
  if (moduleStateMustNotDefinedInStore === void 0) {
    moduleStateMustNotDefinedInStore = true;
  }

  if (vbiMsg === void 0) {
    vbiMsg = '';
  }

  var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

  var _state = _ccContext["default"].store._state;
  checkModuleNameBasically(moduleName);

  if (moduleName !== _constant.MODULE_GLOBAL) {
    if (moduleStateMustNotDefinedInStore === true) {
      //要求模块状态应该不存在
      if (util.isObjectNotNull(_state[moduleName])) {
        //但是却存在了
        throw makeError(_constant.ERR.CC_MODULE_NAME_DUPLICATE, vbi(_vbiMsg));
      }
    } else {
      //要求模块状态应该存在
      if (!_state[moduleName]) {
        //实际上却不存在
        throw makeError(_constant.ERR.CC_MODULE_NAME_HAS_NO_STATE, vbi(_vbiMsg));
      }
    }
  }
}

function checkModuleState(moduleState, moduleName) {
  if (!util.isModuleStateValid(moduleState)) {
    throw util.makeError(_constant.ERR.CC_STORE_STATE_INVALID, vbi("module[" + moduleName + "]'s state is invalid!"));
  }
}

function checkModuleNameAndState(moduleName, moduleState) {
  checkModuleName(moduleName);
  checkModuleState(moduleState, moduleName);
}

function checkModuleNameBasicallyAndState(moduleName, moduleState) {
  checkModuleName(moduleName);
  checkModuleState(moduleState, moduleName);
}