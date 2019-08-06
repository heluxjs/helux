"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _pickOneRef = _interopRequireDefault(require("../ref/pick-one-ref"));

function _default(module, state, delay, identity, skipMiddleware) {
  if (delay === void 0) {
    delay = -1;
  }

  try {
    var ref = (0, _pickOneRef["default"])(module);
    var option = {
      ccKey: '[[top api:cc.setState]]',
      module: module,
      delay: delay,
      identity: identity,
      skipMiddleware: skipMiddleware
    };
    ref.ctx.changeState(state, option);
  } catch (err) {
    (0, _util.strictWarning)(err);
  }
}