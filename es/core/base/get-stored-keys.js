import * as checker from '../checker';

export default function (refDeclaredState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
  const targetStoredKeys = ccOptionStoredKeys || registerStoredKeys;

  if (targetStoredKeys === '*') {
    return Object.keys(refDeclaredState).filter(k => !moduleStateKeys.includes(k));
  } else {
    checker.checkStoredKeys(moduleStateKeys, targetStoredKeys);
    return targetStoredKeys
  }
}