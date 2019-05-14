"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var vbi = _util["default"].verboseInfo;
/**
 * @description
 * @author zzk
 * @export
 * @param {*} ccClassKey must pass to invoke!
 * @param {*} ccInstanceKey must pass to invoke but you can pass null or undefined or '', cc will pick one instance of this CcClass
 * @param {*} method
 * @param {*} args
 * @returns
 */

function _default(ccClassKey, ccInstanceKey, method) {
  var _ref$method;

  var ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
      ccKey_ref_ = _ccContext["default"].ccKey_ref_;
  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = _util["default"].makeError(_constant.ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));

    if (_ccContext["default"].isStrict) throw err;else return console.error(err);
  }

  var ref;

  if (ccInstanceKey) {
    var ccKey = _util["default"].makeUniqueCcKey(ccClassKey, ccInstanceKey);

    ref = ccKey_ref_[ccKey];
  } else {
    var ccKeys = classContext.ccKeys;
    ref = ccKey_ref_[ccKeys[0]]; // pick first one
  }

  if (!ref) {
    var _err = _util["default"].makeError(_constant.ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + " ccKey:" + ccInstanceKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  var fn = ref[method];

  if (!fn) {
    var _err2 = _util["default"].makeError(_constant.ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(" method:" + method)); // only error


    return console.error(_err2.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}