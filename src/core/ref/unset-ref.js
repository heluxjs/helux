import ccContext from '../../cc-context';
import { decCcKeyInsCount } from './set-ref';
import { styleStr, color } from '../../support/util';

const {
  ccUkey_ref_, ccUKey_handlerKeys_, runtimeVar,
  ccClassKey_ccClassContext_, handlerKey_handler_, renderKey_ccUkeys_,
} = ccContext;

export default function (ccClassKey, ccUniqueKey, renderKey) {

  if (runtimeVar.isDebug) {
    console.log(styleStr(`${ccUniqueKey} unset ref`), color('purple'));
  }

  delete ccUkey_ref_[ccUniqueKey];
  const ccUkeys = renderKey_ccUkeys_[renderKey];
  if (renderKey === ccUniqueKey) {
    delete renderKey_ccUkeys_[renderKey];
  } else {
    ccUkeys.splice(ccUkeys.indexOf(ccUniqueKey), 1);
  }

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