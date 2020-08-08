"use strict";

exports.__esModule = true;
exports["default"] = getRenderKeyClasses;

var _privConstant = require("../../support/priv-constant");

function getRenderKeyClasses(ccClassKey, regRenderKeyClasses) {
  var _renderKeyClasses;

  if (!regRenderKeyClasses) {
    _renderKeyClasses = [ccClassKey];
  } else {
    if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
      throw new Error("renderKeyClasses type err, it " + _privConstant.STR_ARR_OR_STAR);
    }

    _renderKeyClasses = regRenderKeyClasses;
  }

  return _renderKeyClasses;
}