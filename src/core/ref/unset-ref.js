import ccContext from '../../cc-context';
import { decCcKeyInsCount } from './set-ref';
import { styleStr, color, logNormal } from '../../support/util';

const {
  ccUKey2ref, ccUKey2handlerKeys, runtimeVar, handlerKey2handler,
} = ccContext;

export default function (ccUniqueKey) {
  if (runtimeVar.isDebug) {
    logNormal(styleStr(`${ccUniqueKey} unset ref`), color('purple'));
  }

  delete ccUKey2ref[ccUniqueKey];
  if (ccContext.isHotReloadMode()) decCcKeyInsCount(ccUniqueKey);

  const handlerKeys = ccUKey2handlerKeys[ccUniqueKey];
  if (handlerKeys) {
    handlerKeys.forEach(hKey => {
      delete handlerKey2handler[hKey];
    });
  }
}
