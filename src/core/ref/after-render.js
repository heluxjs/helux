import { END } from '../../support/priv-constant';
import { okeys } from '../../support/util';
import * as cache from './_cache';
import { delIns } from '../../cc-context/wakey-ukey-map';

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
  const waKeys = okeys(compareWaKeys);
  const waKeyKen = waKeys.length;
  if (waKeyKen === 0) return;

  let shouldLetCacheExpire = false;
  waKeys.forEach(waKey => {// no module prefix
    if (compareWaKeys[waKey] === 2) {//这个key在这轮渲染结束后没有命中，说明视图不再对它有依赖
      shouldLetCacheExpire = true;
      delIns(module, waKey, ccUniqueKey);
    }
  });
  if (waKeys.length > compareWaKeyCount) {//大于最初记录的key数量，有新增
    shouldLetCacheExpire = true;
  }

  // let find result cache expire
  if (shouldLetCacheExpire) {
    cache.createModuleNode(module);
  }
}

export default function (ref) {
  const ctx = ref.ctx;
  ctx.__$$renderStatus = END;

  const {
    module: refModule, connectedModules, connect, ccUniqueKey,
    __$$compareWaKeys, __$$compareWaKeyCount,
    __$$compareConnWaKeys, __$$compareConnWaKeyCount,
  } = ctx;

  // if ref is autoWatch status, should del belong module dep dynamically after every render period
  if (ctx.__$$autoWatch) {
    delDep(__$$compareWaKeys, __$$compareWaKeyCount, refModule, ccUniqueKey);
  }

  connectedModules.forEach(m => {
    // if ref is autoWatch status, should del connected module dep dynamically after every render period
    if (connect[m] === '-') {
      const __$$compareWaKeys = __$$compareConnWaKeys[m];
      const __$$compareWaKeyCount = __$$compareConnWaKeyCount[m];
      delDep(__$$compareWaKeys, __$$compareWaKeyCount, m, ccUniqueKey);
    }
  });
}
