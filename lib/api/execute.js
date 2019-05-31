"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getRefsByClassKey = _interopRequireDefault(require("../core/ref/get-refs-by-class-key"));

var _default = function _default(ccClassKey) {
  var refs = (0, _getRefsByClassKey["default"])(ccClassKey);
  refs.forEach(function (ref) {
    if (ref.$$execute) ref.$$execute();
  });
};

exports["default"] = _default;