
/* eslint-disable */
import { makeCuPackedValue, okeys, delay } from '../../support/util';
import * as cst from '../../support/constant';
import * as waKeyMap from '../../cc-context/wakey-ukey-map';
import ccUKey_ref_ from '../../cc-context/refs';
import { CATE_REF } from '../../support/constant';
import catchCcError from '../base/catch-cc-error';
import { send } from '../plugin/index';

const { waKey_uKeyMap_, waKey_staticUKeyMap_ } = waKeyMap;

function triggerReRender(ref) {
  if (!ref) return;

  // 对于挂载好了还未卸载的实例，才有必要触发重渲染
  if (ref.__$$isUnmounted === false) {
    const refCtx = ref.ctx;
    refCtx.__$$ccForceUpdate();
  }
}

export default async function executeCuInfo(cuInfo) {
  try {
    const len = fns.length;
    if (len === 0) return;

    await delay();
    const { sourceType, ref, module, fnAsync, fns, fnRetKeys, cuRetContainer, retKey_stateKeys_ } = cuInfo;
    const isModule = sourceType !== CATE_REF;

    let stateKeys = [];
    let curRetKey = '';
    try {
      send(cst.SIG_ASYNC_COMPUTED_BATCH_START, { module });
      for (let i = 0; i < len; i++) {
        const fn = fns[i];
        const isAsync = fnAsync[i];
        const retKey = fnRetKeys[i];
        curRetKey = retKey;
        let ret;

        send(cst.SIG_ASYNC_COMPUTED_START, { module, retKey });
        if (isAsync) {
          ret = await fn();
        } else {
          ret = fn();
        }
        cuRetContainer[retKey] = makeCuPackedValue(false, ret);
        send(cst.SIG_ASYNC_COMPUTED_END, { module, retKey });

        if (isModule) stateKeys = stateKeys.concat(retKey_stateKeys_[retKey]);
      }
      send(cst.SIG_ASYNC_COMPUTED_BATCH_END, { module });
    } catch (err) {
      if (isModule) {
        const toSend = { module, err, retKey: curRetKey };
        send(cst.SIG_ASYNC_COMPUTED_ERR, toSend);
        send(cst.SIG_ASYNC_COMPUTED_BATCH_END, toSend);
      }
      catchCcError(err);
    }

    if (isModule) {
      //  让所有正确执行完毕的计算函数关联到的实例能够被触发重渲染
      stateKeys = Array.from(new Set(stateKeys));

      const uKeyMap = {};
      stateKeys.forEach(stateKey => {
        const waKey = `${module}/${stateKey}`;
        // 利用assign不停的去重
        Object.assign(uKeyMap, waKey_uKeyMap_[waKey], waKey_staticUKeyMap_[waKey]);
      });
      const uKeys = okeys(uKeyMap);

      uKeys.forEach(refKey => {
        triggerReRender(ccUKey_ref_[refKey]);
      });
    } else {
      triggerReRender(ref);
    }
  } catch (err) {
    catchCcError(err);
  }
}
