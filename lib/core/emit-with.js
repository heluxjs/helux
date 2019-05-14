"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _pickOneRef = _interopRequireDefault(require("./helper/pick-one-ref"));

function _default(event, option) {
  if (event === undefined) {
    throw new Error("api doc: cc.emitWith(event:string, option:{module?:string, ccClassKey?:string, identity?:string} ...args)");
  }

  try {
    var ref = (0, _pickOneRef.default)();

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    ref.$$emitWith.apply(ref, [event, option].concat(args));
  } catch (err) {
    if (option.throwError) throw err;else _util.default.justWarning(err.message);
  }
}