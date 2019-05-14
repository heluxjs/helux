"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var me = _util.default.makeError,
    vbi = _util.default.verboseInfo;

function _default(moduleName, ccClassKey) {
  var moduleName_ccClassKeys_ = _ccContext.default.moduleName_ccClassKeys_,
      moduleSingleClass = _ccContext.default.moduleSingleClass;

  var ccClassKeys = _util.default.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

  if (ccClassKeys.includes(ccClassKey)) {
    _util.default.throwCcHmrError(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
  }

  if (moduleSingleClass[moduleName] === true && ccClassKeys.length >= 1) {
    throw me(_constant.ERR.CC_CLASS_IS_NOT_ALLOWED_REGISTER_TO_A_SINGLE_CLASS_MODULE, vbi("module " + moduleName + ", ccClassKey " + ccClassKey));
  } // to avoid ccClassKeys include duplicate key in hmr mode


  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);
}