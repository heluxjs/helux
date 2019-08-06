
import * as checker from '../checker';

export default function (refDeclaredState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
  if (!ccOptionStoredKeys) {
    return registerStoredKeys;
  }

  if (ccOptionStoredKeys === '*') {
    return Object.keys(refDeclaredState).filter(k => !moduleStateKeys.includes(k));
  } else {
    checker.checkStoredKeys(moduleStateKeys, ccOptionStoredKeys);
    return ccOptionStoredKeys
  }
}