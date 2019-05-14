"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pickOneRef = _interopRequireDefault(require("./helper/pick-one-ref"));

function _default(action, payLoadWhenActionIsString, _temp) {
  var _ref = _temp === void 0 ? [] : _temp,
      ccClassKey = _ref[0],
      ccKey = _ref[1],
      throwError = _ref[2];

  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any), when action is String, second param means payload");
  }

  try {
    if (ccClassKey && ccKey) {
      var uKey = _util["default"].makeUniqueCcKey(ccClassKey, ccKey);

      var targetRef = _ccContext["default"].refs[uKey];

      if (!targetRef) {
        throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
      } else {
        targetRef.$$dispatch(action, payLoadWhenActionIsString);
      }
    } else {
      var ref = (0, _pickOneRef["default"])();
      ref.$$dispatchForModule(action, payLoadWhenActionIsString);
    }
  } catch (err) {
    if (throwError) throw err;else _util["default"].justWarning(err.message);
  }
}