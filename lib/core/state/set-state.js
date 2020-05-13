"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.innerSetState = innerSetState;
exports["default"] = _default;

var _util = require("../../support/util");

var _pickOneRef = _interopRequireDefault(require("../ref/pick-one-ref"));

function _setState(state, options) {
  try {
    var ref = (0, _pickOneRef["default"])(options.module);
    ref.ctx.changeState(state, options);
  } catch (err) {
    (0, _util.strictWarning)(err);
  }
}

function innerSetState(module, state, stateChangedCb) {
  _setState(state, {
    module: module,
    stateChangedCb: stateChangedCb
  });
}

function _default(module, state, renderKey, delay, skipMiddleware) {
  if (delay === void 0) {
    delay = -1;
  }

  _setState(state, {
    ccKey: '[[top api:setState]]',
    module: module,
    renderKey: renderKey,
    delay: delay,
    skipMiddleware: skipMiddleware
  });
}