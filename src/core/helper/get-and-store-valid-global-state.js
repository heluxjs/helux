
import ccContext from '../../cc-context';
import extractStateByKeys from './extract-state-by-keys';
import { MODULE_GLOBAL } from '../../support/constant';
import { justWarning } from '../../support/util';

const ccStoreSetState = ccContext.store.setState;
const ccGlobalStateKeys = ccContext.globalStateKeys;

const tip = `note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, 
cc will ignore them, but if this result is not as you expected, please check your committed global state!`

export default function (globalState) {
  const { partialState: validGlobalState, isStateEmpty } = extractStateByKeys(globalState, ccGlobalStateKeys);
  if (Object.keys(validGlobalState) < Object.keys(globalState)) {
    justWarning(tip);
  }

  ccStoreSetState(MODULE_GLOBAL, validGlobalState);
  return { partialState: validGlobalState, isStateEmpty }
}