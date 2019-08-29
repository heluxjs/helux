"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _getRefsByClassKey = _interopRequireDefault(require("../core/ref/get-refs-by-class-key"));

var _default = function _default(ccClassKey) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var refs = (0, _getRefsByClassKey["default"])(ccClassKey);
  refs.forEach(function (ref) {
    var _ref$ctx;

    if (ref.__$$isUnmounted) return;
    if (ref.ctx.execute) (_ref$ctx = ref.ctx).execute.apply(_ref$ctx, args);
  });
};

exports["default"] = _default;