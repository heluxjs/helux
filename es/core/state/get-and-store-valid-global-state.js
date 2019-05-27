import ccContext from '../../cc-context';
import extractStateByKeys from './extract-state-by-keys';
import { MODULE_GLOBAL } from '../../support/constant';
import { justWarning } from '../../support/util';
var ccStoreSetState = ccContext.store.setState;
var ccGlobalStateKeys = ccContext.globalStateKeys;
var tip = "note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, \ncc will ignore them, but if this result is not as you expected, please check your committed global state!";
export default function (globalState) {
  var _extractStateByKeys = extractStateByKeys(globalState, ccGlobalStateKeys),
      validGlobalState = _extractStateByKeys.partialState,
      isStateEmpty = _extractStateByKeys.isStateEmpty;

  if (Object.keys(validGlobalState) < Object.keys(globalState)) {
    justWarning(tip);
  }

  ccStoreSetState(MODULE_GLOBAL, validGlobalState);
  return {
    partialState: validGlobalState,
    isStateEmpty: isStateEmpty
  };
}