"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

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
  var ccUniqueKey = ctx.ccUniqueKey,
      module = ctx.module,
      __$$staticWaKeyList = ctx.__$$staticWaKeyList; // 正常情况下只有挂载了组件才会有effect等相关定义

  if (ref.__$$isMounted) {
    var _ctx$effectMeta = ctx.effectMeta,
        eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
        eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;
    executeClearCb(eid_effectReturnCb_, ctx);
    executeClearCb(eid_effectPropsReturnCb_, ctx);
    ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
  } // 删除记录的动态依赖


  var waKeys = ctx.getWatchedKeys(); // no module prefix

  waKeys.forEach(function (k) {
    return (0, _wakeyUkeyMap.delIns)(module, k, ccUniqueKey);
  });
  var connWaKeys = ctx.getConnectWatchedKeys();
  util.okeys(connWaKeys).map(function (m) {
    var waKeys = connWaKeys[m];
    waKeys.forEach(function (k) {
      return (0, _wakeyUkeyMap.delIns)(m, k, ccUniqueKey);
    });
  }); // 删除记录的静态依赖

  __$$staticWaKeyList.forEach(function (modStateKey) {
    return (0, _wakeyUkeyMap.delStaticInsM)(modStateKey, ccUniqueKey);
  });

  (0, _unsetRef["default"])(ccUniqueKey);
}