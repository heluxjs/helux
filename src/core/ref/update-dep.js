import { START } from '../../support/priv-constant';
import moduleName_stateKeys_ from '../../cc-context/statekeys-map';
import { mapInsM, makeWaKey } from '../../cc-context/wakey-ukey-map';

// before render
// cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
//
// rendering input
// cur: {a:'val', c:'val', d:'val'}
//
// after render
// cur: {a:1, c:1, d:1} compare: {a:1, b:2, c:1, d:1} nextCompare:{a:2, c:2, d:2}
//
// then concent will know b should delete dep because its value is 2, 
// compare key count=4>3 or compare include 2, so should let cache expire
//
// before next render, assign nextCompare to cur, assign {} to nextCompare
// cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}

export default function (ref, module, key, isForModule) {
  const refCtx = ref.ctx;

  if (
    refCtx.__$$inBM === true || // 还处于beforeMount步骤
    refCtx.__$$renderStatus === START
  ) {

    const ccUniqueKey = refCtx.ccUniqueKey;
    if (!isForModule) {// for ref connect
      const waKey = makeWaKey(module, key);

      // 未挂载时，是refWatch 或者 refComputed 函数里读取了moduleComputed的值间接推导出来的依赖stateKey
      // 则写到static块里，防止依赖丢失
      if (refCtx.__$$inBM === true) {
        refCtx.__$$staticWaKeys[waKey] = 1;
        return;
      }

      // 处于非自动收集状态则忽略，依赖在buildRefCtx时已记录
      if (refCtx.connect[module] !== '-') return;

      const {
        __$$curConnWaKeys,
        __$$compareConnWaKeys,
        __$$nextCompareConnWaKeys,
        __$$nextCompareConnWaKeyCount,
      } = refCtx;

      mapInsM(waKey, ccUniqueKey);
      __$$curConnWaKeys[module][key] = 1;
      __$$compareConnWaKeys[module][key] = 1;
      const tmpMap = __$$nextCompareConnWaKeys[module];
      if (!tmpMap[key]) {
        tmpMap[key] = 2;
        __$$nextCompareConnWaKeyCount[module]++;
      }
    } else {// for ref module
      const refModule = refCtx.module;

      // 这个stateKey不是模块的stateKey，则忽略依赖记录
      // 此处不能用privStateKeys来判断，用户有可能动态的写入新的key
      // if(!refCtx.privStateKeys.includes(key)){
      if (!moduleName_stateKeys_[refModule].includes(key)) {
        return;
      }

      const waKey = makeWaKey(refModule, key);

      if (refCtx.__$$inBM === true) {
        refCtx.__$$staticWaKeys[waKey] = 1;
        return;
      }

      // 处于非自动收集状态则忽略
      if (refCtx.watchedKeys !== '-') return;

      const {
        __$$curWaKeys,
        __$$compareWaKeys,
        __$$nextCompareWaKeys,
      } = refCtx;

      mapInsM(waKey, ccUniqueKey);
      __$$curWaKeys[key] = 1;
      __$$compareWaKeys[key] = 1;
      if (!__$$nextCompareWaKeys[key]) {
        __$$nextCompareWaKeys[key] = 2;
        refCtx.__$$nextCompareWaKeyCount++;
      }
    }
  }
}