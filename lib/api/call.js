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
 * @param {string} keyDesc '{ccClassKey}' |  '{ccClassKey}/'  | '{ccClassKey}/{ccKey}'
 * @param {string} method
 * @param {any[]} args
 * @returns
 */

function _default(keyDesc, method) {
  var _ref$method;

  var ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
      ccKey_ref_ = _ccContext["default"].ccKey_ref_;
  var ccClassKey = '';
  var ccKey = '';

  if (keyDesc.includes('/')) {
    var _keyDesc$split = keyDesc.split('/'),
        key1 = _keyDesc$split[0],
        key2 = _keyDesc$split[1];

    ccClassKey = key1;
    ccKey = key2;
  } else {
    ccClassKey = keyDesc;
  }

  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext) {
    var err = _util["default"].makeError(_constant.ERR.CC_CLASS_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey));

    if (_ccContext["default"].isStrict) throw err;else return console.error(err);
  }

  var ref;

  if (ccKey) {
    var ccUniKey = _util["default"].makeUniqueCcKey(ccClassKey, ccKey);

    ref = ccKey_ref_[ccUniKey];
  } else {
    var ccKeys = classContext.ccKeys;
    ref = ccKey_ref_[ccKeys[0]]; // pick first one
  }

  if (!ref) {
    var _err = _util["default"].makeError(_constant.ERR.CC_CLASS_INSTANCE_NOT_FOUND, vbi(" ccClassKey:" + ccClassKey + " ccKey:" + ccKey)); // only error, the target instance may has been unmounted really!


    return console.error(_err.message);
  }

  var fn = ref[method];

  if (!fn) {
    var _err2 = _util["default"].makeError(_constant.ERR.CC_CLASS_INSTANCE_METHOD_NOT_FOUND, vbi(" method:" + method)); // only error


    return console.error(_err2.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (_ref$method = ref[method]).call.apply(_ref$method, [ref].concat(args));
}