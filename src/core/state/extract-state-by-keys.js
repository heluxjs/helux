import { isPJO, okeys, removeArrElements } from '../../support/util';

// set成功则返回true
function setPartialState(partialState, state, key) {
  const value = state[key];
  if (value !== undefined) {
    partialState[key] = value;
    return true;
  }
  return false;
}

export default function (state, stateKeys = [], returnNullIfEmpty = false, needIgnored = false) {
  let partialState = {}, ignoredStateKeys = [], missKeyInState = false;
  if (!isPJO(state)) {
    return { partialState: returnNullIfEmpty ? null : partialState, isStateEmpty: true, ignoredStateKeys, missKeyInState };
  }
  let isStateEmpty = true;

  const committedStateKeys = okeys(state);
  if (committedStateKeys.length >= stateKeys.length) {
    missKeyInState = true;
    stateKeys.forEach(key => {
      if (setPartialState(partialState, state, key)) isStateEmpty = false;
    });
    if (needIgnored) ignoredStateKeys = removeArrElements(committedStateKeys, stateKeys);
  } else {
    committedStateKeys.forEach(key => {
      if (stateKeys.includes(key)) {
        if (setPartialState(partialState, state, key)) isStateEmpty = false;
      } else {
        missKeyInState = true;
        if (needIgnored) ignoredStateKeys.push(key);
      }
    });
  }

  if (isStateEmpty && returnNullIfEmpty) partialState = null;

  return { partialState, isStateEmpty, ignoredStateKeys, missKeyInState };
}
