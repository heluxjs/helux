import { END } from '../../support/priv-constant';
import { okeys } from '../../support/util';
import * as cache from './_cache';
import ccContext from '../../cc-context';

const { waKey_uKeyMap_ } = ccContext;

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
function delDep(compareWaKeys, compareWaKeyCount, module, ccUniqueKey ){
  let shouldLetCacheExpire = false;
  const waKeys = okeys(compareWaKeys);
  waKeys.forEach(waKey=>{// no module prefix
    if(compareWaKeys[waKey] === 2 ){//这个key在这轮渲染结束后没有命中，说明视图不再对它有依赖
      shouldLetCacheExpire = true;
      delete waKey_uKeyMap_[`${module}/${waKey}`][ccUniqueKey]
    }
  });
  if(waKeys.length > compareWaKeyCount){//大于最初记录的key数量，有新增
    shouldLetCacheExpire = true;
  }

  // let find result cache expire
  if(shouldLetCacheExpire){
    cache.createModuleNode(module);
  }
}

export default function (ref) {
  const ctx = ref.ctx;
  ctx.__$$renderStatus = END;
  
  // 不存在自动收集行为
  if (!ctx.__$$autoWatch) {
    return;
  }
  
  const {
    module: refModule, connectedModules, connect, ccUniqueKey,
    __$$compareWaKeys,
    __$$compareWaKeyCount,

    __$$compareConnWaKeys,
    __$$compareConnWaKeyCount,
  } = ctx;

  delDep(__$$compareWaKeys, __$$compareWaKeyCount, refModule, ccUniqueKey );

  connectedModules.forEach(m=>{
    // 非自动收集，不用处理
    if (connect[m] !== '-') return;

    const __$$compareWaKeys = __$$compareConnWaKeys[m];
    const __$$compareWaKeyCount = __$$compareConnWaKeyCount[m];
    delDep(__$$compareWaKeys, __$$compareWaKeyCount, m, ccUniqueKey );
  });

}