import { isStateValid, isObjectNotNull } from '../../support/util';
export default function (state, stateKeys, returnNullIfEmpty) {
  if (returnNullIfEmpty === void 0) {
    returnNullIfEmpty = false;
  }

  var partialState = {};

  if (!isStateValid(state) || !isObjectNotNull(state)) {
    return {
      partialState: returnNullIfEmpty ? null : partialState,
      isStateEmpty: true
    };
  }

  var isStateEmpty = true;
  stateKeys.forEach(function (key) {
    var value = state[key];

    if (value !== undefined) {
      partialState[key] = value;
      isStateEmpty = false;
    }
  });
  return {
    partialState: partialState,
    isStateEmpty: isStateEmpty
  };
}