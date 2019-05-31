"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getRefs = _interopRequireDefault(require("../core/ref/get-refs"));

var _default = function _default() {
  var refs = (0, _getRefs["default"])();
  refs.forEach(function (ref) {
    if (ref.$$execute) ref.$$execute();
  });
};

exports["default"] = _default;