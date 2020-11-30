import ccContext from '../../cc-context';
import { decCcKeyInsCount } from './set-ref';
import { styleStr, color } from '../../support/util';

const {
  ccUKey_ref_, ccUKey_handlerKeys_, runtimeVar,
  handlerKey_handler_,
} = ccContext;

export default function (ccUniqueKey) {
  if (runtimeVar.isDebug) {
    console.log(styleStr(`${ccUniqueKey} unset ref`), color('purple'));
  }

  delete ccUKey_ref_[ccUniqueKey];
  if (ccContext.isHotReloadMode()) decCcKeyInsCount(ccUniqueKey);

  const handlerKeys = ccUKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    handlerKeys.forEach(hKey => {
      delete handlerKey_handler_[hKey];
    });
  }
}
