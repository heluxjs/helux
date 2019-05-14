"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

function _default(moduleName, checkForReducer) {
  if (checkForReducer === void 0) {
    checkForReducer = false;
  }

  var _state = _ccContext["default"].store._state;
  var _reducer = _ccContext["default"].reducer._reducer;

  if (!(0, _util.isModuleNameValid)(moduleName)) {
    throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NAME_INVALID, (0, _util.verboseInfo)(" moduleName:" + moduleName + " is invalid!"));
  }

  if ((0, _util.isModuleNameCcLike)(moduleName)) {
    throw (0, _util.makeError)(_constant.ERR.CC_MODULE_KEY_CC_FOUND);
  }

  if (checkForReducer) {
    if (moduleName != _constant.MODULE_GLOBAL) {
      if (_reducer[moduleName]) {
        throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_MODULE_NAME_DUPLICATE, (0, _util.verboseInfo)("moduleName:" + moduleName));
      }
    }
  } else {
    if (_state[moduleName]) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NAME_DUPLICATE, (0, _util.verboseInfo)("moduleName:" + moduleName));
    }
  }
}