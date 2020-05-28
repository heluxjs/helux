"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _statekeysMap = _interopRequireDefault(require("../../cc-context/statekeys-map"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

// before render
// cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
//
// rendering period input as below
// cur: {a:'val', c:'val', d:'val'}
//
// after render
// cur: {a:1, c:1, d:1} compare: {a:1, b:2, c:1, d:1} nextCompare:{a:2, c:2, d:2}
//
// then concent know 'b' should delete from dep because its value is 2, 
// compare key count become bigger than previous render(4>3) or compare key values include 2, so should let cache expire
//
// before next render, assign nextCompare to cur, assign {} to nextCompare
// cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}
function _default(ref, module, key, isForModule) {
  var refCtx = ref.ctx;

  if (refCtx.__$$inBM === true || // 还处于beforeMount步骤
  refCtx.__$$renderStatus === _privConstant.START) {
    var ccUniqueKey = refCtx.ccUniqueKey;

    if (!isForModule) {
      // for ref connect
      var waKey = (0, _wakeyUkeyMap.makeWaKey)(module, key); // 未挂载时，是refWatch 或者 refComputed 函数里读取了moduleComputed的值间接推导出来的依赖stateKey
      // 则写到static块里，防止依赖丢失

      if (refCtx.__$$inBM === true) {
        refCtx.__$$staticWaKeys[waKey] = 1;
        return;
      } // 处于非自动收集状态则忽略，依赖在buildRefCtx时已记录


      if (refCtx.connect[module] !== '-') return;
      var __$$curConnWaKeys = refCtx.__$$curConnWaKeys,
          __$$compareConnWaKeys = refCtx.__$$compareConnWaKeys,
          __$$nextCompareConnWaKeys = refCtx.__$$nextCompareConnWaKeys,
          __$$nextCompareConnWaKeyCount = refCtx.__$$nextCompareConnWaKeyCount;
      (0, _wakeyUkeyMap.mapInsM)(waKey, ccUniqueKey);
      __$$curConnWaKeys[module][key] = 1;
      __$$compareConnWaKeys[module][key] = 1;
      var tmpMap = __$$nextCompareConnWaKeys[module];

      if (!tmpMap[key]) {
        tmpMap[key] = 2;
        __$$nextCompareConnWaKeyCount[module]++;
      }
    } else {
      // for ref module
      var refModule = refCtx.module; // 这个stateKey不是模块的stateKey，则忽略依赖记录
      // 此处不能用privStateKeys来判断，用户有可能动态的写入新的key
      // if(!refCtx.privStateKeys.includes(key)){

      if (!_statekeysMap["default"][refModule].includes(key)) {
        return;
      }

      var _waKey = (0, _wakeyUkeyMap.makeWaKey)(refModule, key);

      if (refCtx.__$$inBM === true) {
        refCtx.__$$staticWaKeys[_waKey] = 1;
        return;
      } // 处于非自动收集状态则忽略


      if (refCtx.watchedKeys !== '-') return;
      var __$$curWaKeys = refCtx.__$$curWaKeys,
          __$$compareWaKeys = refCtx.__$$compareWaKeys,
          __$$nextCompareWaKeys = refCtx.__$$nextCompareWaKeys;
      (0, _wakeyUkeyMap.mapInsM)(_waKey, ccUniqueKey);
      __$$curWaKeys[key] = 1;
      __$$compareWaKeys[key] = 1;

      if (!__$$nextCompareWaKeys[key]) {
        __$$nextCompareWaKeys[key] = 2;
        refCtx.__$$nextCompareWaKeyCount++;
      }
    }
  }
}