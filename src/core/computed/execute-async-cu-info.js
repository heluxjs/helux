
/* eslint-disable */
import { makeCuPackedValue, okeys, delay } from '../../support/util';
import * as waKeyMap from '../../cc-context/wakey-ukey-map';
import ccUKey_ref_ from '../../cc-context/refs';
import { CATE_REF } from '../../support/constant';
import catchCcError from '../base/catch-cc-error';

const { waKey_uKeyMap_, waKey_staticUKeyMap_ } = waKeyMap;

function triggerReRender(ref) {
  // 对于挂载好了还未卸载的实例，才有必要触发重渲染
  if (ref.__$$isUnmounted === false) {
    const refCtx = ref.ctx;
    refCtx.__$$ccForceUpdate();
  }
}

export default async function executeCuInfo(cuInfo) {
  try{
    await delay();
    const { sourceType, ref, module, fnAsync, fns, fnRetKeys, cuRetContainer, retKey_stateKeys_ } = cuInfo;
    const len = fns.length;
  
    let stateKeys = [];
    for (let i = 0; i < len; i++) {
      const fn = fns[i];
      const isAsync = fnAsync[i];
      const retKey = fnRetKeys[i];
      let ret;
  
      if (isAsync) {
        ret = await fn();
      } else {
        ret = fn();
      }
  
      cuRetContainer[retKey] = makeCuPackedValue(false, ret);
      if (sourceType !== CATE_REF) stateKeys = stateKeys.concat(retKey_stateKeys_[retKey]);
    }
  
    if (sourceType !== CATE_REF) {
      stateKeys = Array.from(new Set(stateKeys));
  
      const uKeyMap = {};
      stateKeys.forEach(stateKey => {
        const waKey = `${module}/${stateKey}`;
        // 利用assign不停的去重
        Object.assign(uKeyMap, waKey_uKeyMap_[waKey], waKey_staticUKeyMap_[waKey]);
      });
      const uKeys = okeys(uKeyMap);
  
      uKeys.forEach(refKey => {
        const ref = ccUKey_ref_[refKey];
        if (!ref) return;
        triggerReRender(ref);
      });
    } else {
      triggerReRender(ref);
    }
  }catch(err){
    catchCcError(err);
  }
}
