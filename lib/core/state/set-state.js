"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _share = require("../../support/share");

var _pickOneRef = _interopRequireDefault(require("../ref/pick-one-ref"));

function _default(module, state, renderKey, delay, skipMiddleware) {
  if (delay === void 0) {
    delay = -1;
  }

  try {
    var ref = (0, _pickOneRef["default"])(module);
    var option = {
      ccKey: '[[top api:setState]]',
      module: module,
      renderKey: renderKey,
      delay: delay,
      skipMiddleware: skipMiddleware
    };
    ref.ctx.changeState(state, option);
  } catch (err) {
    (0, _share.strictWarning)(err);
  }
}