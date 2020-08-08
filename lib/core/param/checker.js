"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.checkModuleNameBasically = checkModuleNameBasically;
exports.checkModuleName = checkModuleName;
exports.checkModuleNameAndState = checkModuleNameAndState;
exports.checkStoredKeys = checkStoredKeys;
exports.checkKeys = checkKeys;
exports.checkConnectSpec = checkConnectSpec;
exports.checkRenderKeyClasses = checkRenderKeyClasses;

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var isModuleNameCcLike = util.isModuleNameCcLike,
    isModuleNameValid = util.isModuleNameValid,
    vbi = util.verboseInfo,
    makeError = util.makeError,
    okeys = util.okeys;
var store = _ccContext["default"].store,
    getModuleStateKeys = _ccContext["default"].getModuleStateKeys;
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
 * 检查模块名, moduleMustNotExisted 默认为true，
 * true表示【module名字合法】且【对应的moduleState不存在】，才算检查通过  
 * false表示【module名字合法】且【对应的moduleState存在】，才算检查通过
 * @param {string} moduleName 
 * @param {boolean} [moduleMustNotExisted=true] - true 要求模块应该不存在 ,false 要求模块状态应该已存在
 */


function checkModuleName(moduleName, moduleMustNotExisted, vbiMsg) {
  if (moduleMustNotExisted === void 0) {
    moduleMustNotExisted = true;
  }

  if (vbiMsg === void 0) {
    vbiMsg = '';
  }

  var _vbiMsg = vbiMsg || "module[" + moduleName + "]";

  var _state = store._state;
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

function checkStoredKeys(belongModule, storedKeys) {
  if (storedKeys === '*') {
    return;
  }

  if (Array.isArray(storedKeys)) {
    checkKeys(belongModule, storedKeys, false, 'storedKeys invalid ');
    return;
  }

  throw new Error("storedKeys type err, " + _privConstant.STR_ARR_OR_STAR);
}

function checkKeys(module, keys, keyShouldBeModuleStateKey, extraInfo) {
  if (keyShouldBeModuleStateKey === void 0) {
    keyShouldBeModuleStateKey = true;
  }

  if (extraInfo === void 0) {
    extraInfo = '';
  }

  var keyword = keyShouldBeModuleStateKey ? '' : 'not ';

  var keyTip = function keyTip(name, keyword) {
    return extraInfo + "key[" + name + "] must " + keyword + "be a module state key";
  };

  var moduleStateKeys = getModuleStateKeys(module);
  keys.forEach(function (sKey) {
    var keyInModuleState = moduleStateKeys.includes(sKey);

    var throwErr = function throwErr() {
      throw new Error(keyTip(sKey, keyword));
    };

    if (keyShouldBeModuleStateKey) {
      !keyInModuleState && throwErr();
    } else {
      keyInModuleState && throwErr();
    }
  });
}

function checkConnectSpec(connectSpec) {
  var invalidConnect = "param connect is invalid,";

  var invalidConnectItem = function invalidConnectItem(m) {
    return invalidConnect + " module[" + m + "]'s value " + _privConstant.STR_ARR_OR_STAR;
  };

  okeys(connectSpec).forEach(function (m) {
    checkModuleName(m, false);
    var val = connectSpec[m];

    if (typeof val === 'string') {
      if (val !== '*' && val !== '-') throw new Error(invalidConnectItem(m));
    } else if (!Array.isArray(val)) {
      throw new Error(invalidConnectItem(m));
    } else {
      checkKeys(m, val, true, "connect module[" + m + "] invalid,");
    }
  });
}

function checkRenderKeyClasses(regRenderKeyClasses) {
  if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
    throw new Error("renderKeyClasses type err, it " + _privConstant.STR_ARR_OR_STAR);
  }
}