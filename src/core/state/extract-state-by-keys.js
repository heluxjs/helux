import { isPJO, okeys, removeArrElements } from '../../support/util';

// missKeyInState: true代表state含有stateKeys里不包含的key， false则不含
export default function (state, stateKeys = [], returnNullIfEmpty = false, needIgnored = false) {
  let partialState = {}, ignoredStateKeys = [], missKeyInState = false;
  if (!isPJO(state)) {
    return {
      partialState: returnNullIfEmpty ? null : partialState, isStateEmpty: true, ignoredStateKeys, missKeyInState,
    };
  }
  let isStateEmpty = true;

  const committedStateKeys = okeys(state);
  const cLen = committedStateKeys.length;
  const sLen = stateKeys.length;

  if (cLen > sLen) {
    missKeyInState = true;
    stateKeys.forEach(key => {
      partialState[key] = state[key];
      isStateEmpty = false;
    });
    if (needIgnored) ignoredStateKeys = removeArrElements(committedStateKeys, stateKeys);
  } else {
    committedStateKeys.forEach(key => {
      if (stateKeys.includes(key)) {
        partialState[key] = state[key];
        isStateEmpty = false;
      } else {
        missKeyInState = true;
        if (needIgnored) ignoredStateKeys.push(key);
      }
    });
  }

  if (isStateEmpty && returnNullIfEmpty) partialState = null;

  return { partialState, isStateEmpty, ignoredStateKeys, missKeyInState };
}
