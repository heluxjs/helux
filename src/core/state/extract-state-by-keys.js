import { isPlainJsonObject } from '../../support/util';

export default function (state, stateKeys, returnNullIfEmpty = false) {
  let partialState = {};
  if (!isPlainJsonObject(state)) {
    return { partialState: returnNullIfEmpty ? null : partialState, isStateEmpty: true };
  }
  let isStateEmpty = true;
  stateKeys.forEach(key => {
    const value = state[key];
    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });

  if (isStateEmpty && returnNullIfEmpty) partialState = null;

  return { partialState, isStateEmpty };
}