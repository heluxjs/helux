"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _constant = require("../../support/constant");

var _pickOneRef = _interopRequireDefault(require("./pick-one-ref"));

function _default(module, state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  try {
    var ref = (0, _pickOneRef.default)(module);
    ref.$$changeState(state, {
      ccKey: '[[top api:cc.setState]]',
      module: module,
      stateFor: _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
      broadcastTriggeredBy: _constant.BROADCAST_TRIGGERED_BY_CC_API_SET_STATE,
      lazyMs: lazyMs
    });
  } catch (err) {
    if (throwError) throw err;else _util.default.justWarning(err.message);
  }
}