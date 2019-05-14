"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _invoke = _interopRequireDefault(require("./invoke"));

var _util = _interopRequireDefault(require("../support/util"));

var _constant = require("../support/constant");

var vbi = _util["default"].verboseInfo;

function _default(ccClassKey, method) {
  if (ccClassKey === undefined) {
    throw new Error("api doc: cc.invokeSingle(ccClassKey:String, method:String, ...args)");
  }

  var ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;
  var classContext = ccClassKey_ccClassContext_[ccClassKey];

  if (!classContext.isSingle) {
    var err = _util["default"].makeError(_constant.ERR.CC_CLASS_IS_NOT_SINGLE_BUT_YOU_CALL_INVOKE_SINGLE, vbi("ccClassKey:" + ccClassKey)); // only error, the target instance may has been unmounted really!


    return console.error(err.message);
  }

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  _invoke["default"].apply(void 0, [ccClassKey, ccClassKey, method].concat(args));
}