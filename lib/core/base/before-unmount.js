"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var ev = _interopRequireWildcard(require("../event"));

var _unsetRef = _interopRequireDefault(require("../ref/unset-ref"));

function _default(ref) {
  //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
  //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
  ref.__$$isUnmounted = true;
  var ctx = ref.ctx;
  var eid_effectReturnCb_ = ctx.effectMeta.eid_effectReturnCb_;
  Object.getOwnPropertySymbols(eid_effectReturnCb_).forEach(function (symbolKey) {
    var cb = eid_effectReturnCb_[symbolKey];
    if (typeof cb === 'function') cb(ctx);
  });
  util.okeys(eid_effectReturnCb_).forEach(function (eId) {
    var cb = eid_effectReturnCb_[eId];
    if (typeof cb === 'function') cb(ctx);
  });
  var ccUniqueKey = ctx.ccUniqueKey,
      ccClassKey = ctx.ccClassKey;
  ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  (0, _unsetRef["default"])(ccClassKey, ccUniqueKey);
}