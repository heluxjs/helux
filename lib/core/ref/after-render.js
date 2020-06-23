"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _util = require("../../support/util");

var cache = _interopRequireWildcard(require("./_cache"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

// before render
// cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
//
// rendering input
// cur: {a:'val', c:'val', d:'val'}
//
// after render
// cur: {a:1, c:1, c:1} compare: {a:1, b:2, c:1, d:1} nextCompare:{a:2, c:2, d:2}
//
// then concent will know b should delete dep because=0, 
// compare key count=4>3 or compare include 2, so should let cache expire
//
// before next render
// cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}

/** 删除依赖 */
function delDep(compareWaKeys, compareWaKeyCount, module, ccUniqueKey) {
  var shouldLetCacheExpire = false;
  var waKeys = (0, _util.okeys)(compareWaKeys);
  waKeys.forEach(function (waKey) {
    // no module prefix
    if (compareWaKeys[waKey] === 2) {
      //这个key在这轮渲染结束后没有命中，说明视图不再对它有依赖
      shouldLetCacheExpire = true;
      (0, _wakeyUkeyMap.delIns)(module, waKey, ccUniqueKey);
    }
  });

  if (waKeys.length > compareWaKeyCount) {
    //大于最初记录的key数量，有新增
    shouldLetCacheExpire = true;
  } // let find result cache expire


  if (shouldLetCacheExpire) {
    cache.createModuleNode(module);
  }
}

function _default(ref) {
  var ctx = ref.ctx;
  ctx.__$$renderStatus = _privConstant.END; // 不处于收集观察依赖

  if (!ctx.__$$autoWatch) {
    return;
  }

  var refModule = ctx.module,
      connectedModules = ctx.connectedModules,
      connect = ctx.connect,
      ccUniqueKey = ctx.ccUniqueKey,
      __$$compareWaKeys = ctx.__$$compareWaKeys,
      __$$compareWaKeyCount = ctx.__$$compareWaKeyCount,
      __$$compareConnWaKeys = ctx.__$$compareConnWaKeys,
      __$$compareConnWaKeyCount = ctx.__$$compareConnWaKeyCount;
  delDep(__$$compareWaKeys, __$$compareWaKeyCount, refModule, ccUniqueKey);
  connectedModules.forEach(function (m) {
    // 非自动收集，不用处理
    if (connect[m] !== '-') return;
    var __$$compareWaKeys = __$$compareConnWaKeys[m];
    var __$$compareWaKeyCount = __$$compareConnWaKeyCount[m];
    delDep(__$$compareWaKeys, __$$compareWaKeyCount, m, ccUniqueKey);
  });
}