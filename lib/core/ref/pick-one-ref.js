"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = require("../../support/util");

var _checker = require("../param/checker");

/** @typedef {import('../../types').ICtxBase} ICtxBase */
var ignoreIt = "if this message doesn't matter, you can ignore it";
/****
 * 尽可能优先找module的实例，找不到的话在根据mustBelongToModule值来决定要不要找其他模块的实例
 * pick one ccInstance ref randomly
 */

function _default(module, mustBelongToModule) {
  if (mustBelongToModule === void 0) {
    mustBelongToModule = false;
  }

  var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;
  var oneRef = null;

  if (module) {
    (0, _checker.checkModuleName)(module, false);
    var ukeys = (0, _util.okeys)(ccUKey_ref_);
    var len = ukeys.length;

    for (var i = 0; i < len; i++) {
      /** @type {{ctx:ICtxBase}} */
      var ref = ccUKey_ref_[ukeys[i]];

      if (ref.ctx.module === module) {
        oneRef = ref;
        break;
      }
    }
  }

  if (!oneRef) {
    if (mustBelongToModule) {
      throw new Error("[[pickOneRef]]: no ref found for module[" + module + "]!," + ignoreIt);
    } else {
      oneRef = _ccContext["default"].permanentDispatcher;
    }
  }

  return oneRef;
}