import * as checker from '../checker';

export default function (refPrivState, moduleStateKeys, ccOptionStoredKeys, registerStoredKeys) {
  const targetStoredKeys = ccOptionStoredKeys || registerStoredKeys;
  if (!targetStoredKeys) {
    return [];
  }

  if (targetStoredKeys === '*') {
    // refPrivState里可能含有moduleStateKey，需要进一步过滤
    return Object.keys(refPrivState).filter(k => !moduleStateKeys.includes(k));
  } else {
    checker.checkStoredKeys(moduleStateKeys, targetStoredKeys);
    return targetStoredKeys
  }
}