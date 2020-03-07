"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _makeObState = _interopRequireDefault(require("../state/make-ob-state"));

function _default(ref) {
  var ctx = ref.ctx;
  ctx.__$$renderStatus = _privConstant.START;

  if (ctx.watchedKeys === '-' && ctx.__$$hasModuleState) {
    ref.state = (0, _makeObState["default"])(ref, ref.state);
    ctx.state = ref.state;
  }
}