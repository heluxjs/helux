"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getRefs = _interopRequireDefault(require("../core/ref/get-refs"));

var _default = function _default() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var refs = (0, _getRefs["default"])();
  refs.forEach(function (ref) {
    var _ref$ctx;

    if (ref.ctx.execute) (_ref$ctx = ref.ctx).execute.apply(_ref$ctx, args);
  });
};

exports["default"] = _default;