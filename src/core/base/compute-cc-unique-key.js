import * as util from '../../support/util'
import uuid from './uuid';

const { justWarning, makeUniqueCcKey } = util;

export default function (isClassSingle, ccClassKey, ccKey, tag) {
  let ccUniqueKey;

  if (isClassSingle) {
    //??? need strict
    if (ccKey) justWarning(`now the ccClass is singleton, you needn't supply ccKey to instance props, cc will ignore the ccKey[${ccKey}]`)
    ccUniqueKey = ccClassKey;
  } else {
    if (ccKey) {
      ccUniqueKey = makeUniqueCcKey(ccClassKey, ccKey);
    } else {
      const uuidStr = uuid(tag);
      ccUniqueKey = makeUniqueCcKey(ccClassKey, uuidStr);
    }
  }
  return ccUniqueKey;
}