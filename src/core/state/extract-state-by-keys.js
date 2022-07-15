import { isPJO, okeys, removeArrElements } from '../../support/util';
import runtimeVar from '../../cc-context/runtime-var';

// set成功则返回true
function setPartialState(partialState, state, key) {
  const value = state[key];
  if (runtimeVar.ignoreUndefined || value !== undefined) {
    partialState[key] = value;
    return true;
  }
  return false;
}

// missKeyInState: true 代表 state 含有 stateKeys 里不包含的 key， false 则不含
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
