import { isPlainJsonObject, okeys, removeArrElements } from '../../support/util';

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
  let partialState = {}, ignoredStateKeys = [];
  if (!isPlainJsonObject(state)) {
    return { partialState: returnNullIfEmpty ? null : partialState, isStateEmpty: true, ignoredStateKeys };
  }
  let isStateEmpty = true;

  const committedStateKeys = okeys(state);
  if (committedStateKeys.length >= stateKeys.length) {
    stateKeys.forEach(key => {
      if (setPartialState(partialState, state, key)) isStateEmpty = false;
    });
    if (needIgnored) ignoredStateKeys = removeArrElements(committedStateKeys, stateKeys);
  } else {
    committedStateKeys.forEach(key => {
      if (stateKeys.includes(key)) {
        if (setPartialState(partialState, state, key)) isStateEmpty = false;
      } else {
        if (needIgnored) ignoredStateKeys.push(key);
      }
    });
  }

  if (isStateEmpty && returnNullIfEmpty) partialState = null;

  return { partialState, isStateEmpty, ignoredStateKeys };
}