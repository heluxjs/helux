"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _runtimeHandler = _interopRequireDefault(require("../../cc-context/runtime-handler"));

var _util = require("../../support/util");

var _default = function _default(err) {
  var errorHandler = _runtimeHandler["default"].errorHandler;
  if (errorHandler) errorHandler(err);else {
    (0, _util.justTip)('found uncaught err from cc core, suggest config an errorHandler in run options');
    console.log(err);
    throw err;
  }
};

exports["default"] = _default;