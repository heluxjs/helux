"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pickOneRef = _interopRequireDefault(require("../core/ref/pick-one-ref"));

function _default(action, payLoadWhenActionIsString, identity, _temp) {
  if (identity === void 0) {
    identity = '';
  }

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
      var module = '';

      if (typeof action == 'string' && action.includes('/')) {
        module = action.split('/')[0];
      }

      var ref = (0, _pickOneRef["default"])(module);

      if (ref.cc.ccState.ccClassKey.startsWith(_constant.CC_FRAGMENT_PREFIX)) {
        ref.__fragmentParams.dispatch(action, payLoadWhenActionIsString, identity);
      } else {
        ref.$$dispatchForModule(action, payLoadWhenActionIsString, identity);
      }
    }
  } catch (err) {
    if (throwError) throw err;else _util["default"].justWarning(err.message);
  }
}