"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _pickOneRef = _interopRequireDefault(require("../core/ref/pick-one-ref"));

function _default(event) {
  if (event === undefined) {
    throw new Error("api doc: cc.emit(event:string|{name:string, identity?:string, ctx?:boolean}, ...args)");
  }

  try {
    var _ref$ctx;

    var ref = (0, _pickOneRef["default"])();

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_ref$ctx = ref.ctx).emit.apply(_ref$ctx, [event].concat(args));
  } catch (err) {
    _util["default"].justWarning(err);
  }
}