import ccContext from '../../cc-context';
import { decCcKeyInsCount } from './set-ref';
import { styleStr, color, okeys } from '../../support/util';

const {
  ccUKey_ref_, ccUKey_handlerKeys_, runtimeVar, module_ccUKeys_,
  ccClassKey_ccClassContext_, handlerKey_handler_,
} = ccContext;

function updateModuleCcUKeys(module, ccUniqueKey) {
  const uKeys = module_ccUKeys_[module];
  uKeys.ver++;
  const idx = uKeys.keys.indexOf(ccUniqueKey);
  if (idx > 0) uKeys.keys.splice(idx, 1)
}

export default function (ccClassKey, ccUniqueKey) {

  if (runtimeVar.isDebug) {
    console.log(styleStr(`${ccUniqueKey} unset ref`), color('purple'));
  }
  const ref = ccUKey_ref_[ccUniqueKey];
  if (ref) {
    // start update module_ccUKeys_ mapping
    const { module, connect } = ref.ctx;
    updateModuleCcUKeys(module, ccUniqueKey);
    okeys(connect).forEach(m => updateModuleCcUKeys(m, ccUniqueKey));
  }


  delete ccUKey_ref_[ccUniqueKey];

  const classContext = ccClassKey_ccClassContext_[ccClassKey];
  const ccKeys = classContext.ccKeys;

  const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  decCcKeyInsCount(ccUniqueKey);

  const handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    handlerKeys.forEach(hKey => {
      delete handlerKey_handler_[hKey];
    });
  }
}