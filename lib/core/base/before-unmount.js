"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var ev = _interopRequireWildcard(require("../event"));

var _unsetRef = _interopRequireDefault(require("../ref/unset-ref"));

var okeys = util.okeys;

function executeClearCb(cbMap, ctx) {
  var execute = function execute(key) {
    // symbolKey or normalKey
    var cb = cbMap[key];
    if (typeof cb === 'function') cb(ctx);
  };

  Object.getOwnPropertySymbols(cbMap).forEach(execute);
  okeys(cbMap).forEach(execute);
}

function _default(ref) {
  //标记一下已卸载，防止组件卸载后，某个地方有异步的任务拿到了该组件的引用，然后执行setState，导致
  //Warning: Can't perform a React state update on an unmounted component. This is a no-op ......
  ref.__$$isUnmounted = true;
  var ctx = ref.ctx;
  var _ctx$effectMeta = ctx.effectMeta,
      eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
      eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;
  executeClearCb(eid_effectReturnCb_, ctx);
  executeClearCb(eid_effectPropsReturnCb_, ctx);
  var ccUniqueKey = ctx.ccUniqueKey,
      ccClassKey = ctx.ccClassKey,
      renderKey = ctx.renderKey;
  ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  (0, _unsetRef["default"])(ccClassKey, ccUniqueKey, renderKey);
}