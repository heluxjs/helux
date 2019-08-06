import util from '../../support/util'
import uuid from './uuid';

export default function (isClassSingle, ccClassKey, ccKey, tag) {
  let ccUniqueKey;

  if (isClassSingle) {
    //??? need strict
    if (ccKey) util.justWarning(`now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[${ccKey}]`)
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      const uuidStr = uuid(tag);
      ccUniqueKey = util.makeUniqueCcKey(ccClassKey, uuidStr);
    }
  }
  return ccUniqueKey;
}