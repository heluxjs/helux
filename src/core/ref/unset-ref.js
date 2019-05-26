import ccContext from '../../cc-context';
import { decCcKeyInsCount } from './set-ref';
import { styleStr, color } from '../../support/util';

const { ccKey_ref_, ccKey_option_, ccUniqueKey_handlerKeys_, ccClassKey_ccClassContext_, handlerKey_handler_ } = ccContext;

export default function (ccClassKey, ccUniqueKey) {
  if (ccContext.isDebug) {
    console.log(styleStr(`${ccUniqueKey} unset ref`), color('purple'));
  }
  // ccContext.ccKey_ref_[ccUniqueKey] = null;
  delete ccKey_ref_[ccUniqueKey];
  delete ccKey_option_[ccUniqueKey];

  const classContext = ccClassKey_ccClassContext_[ccClassKey];
  const ccKeys = classContext.ccKeys;

  const ccKeyIdx = ccKeys.indexOf(ccUniqueKey);
  if (ccKeyIdx >= 0) ccKeys.splice(ccKeyIdx, 1);
  decCcKeyInsCount(ccUniqueKey);

  const handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    handlerKeys.forEach(hKey => {
      delete handlerKey_handler_[hKey];
      // ccUniqueKey maybe generated randomly, so delete the key instead of set null
      // handlerKey_handler_[hKey] = null;
    });
  }
}