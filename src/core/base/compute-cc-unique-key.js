import * as util from '../../support/util';
import uuid from './uuid';

const { makeUniqueCcKey } = util;

export default function (ccClassKey, ccKey, tag) {
  const featureStr = ccKey || uuid(tag);
  return  makeUniqueCcKey(ccClassKey, featureStr);
}
