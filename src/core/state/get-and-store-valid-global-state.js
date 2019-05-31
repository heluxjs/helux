
import ccContext from '../../cc-context';
import extractStateByKeys from './extract-state-by-keys';
import { MODULE_GLOBAL } from '../../support/constant';
import { justWarning, okeys } from '../../support/util';

const ccStoreSetState = ccContext.store.setState;
const ccGlobalStateKeys = ccContext.globalStateKeys;

const tip = `note! you are trying set state for global module, but the state you commit include some invalid keys which is not declared in cc's global state, 
cc will ignore them, but if this result is not as you expected, please check your committed global state!`

export default function (globalState, tipModule = '', tipCcClassKey='') {
  const { partialState: validGlobalState, isStateEmpty } = extractStateByKeys(globalState, ccGlobalStateKeys);
  const vKeys = okeys(validGlobalState);
  const allKeys = okeys(globalState);
  if (vKeys.length < allKeys.length) {
    //??? need strict?
    const invalidKeys =  allKeys.filter(k=> !vKeys.includes(k));
    justWarning(tip + ',invalid keys: ' + invalidKeys.join(',')+', make sure the keys is invalid and their values are not undefined');
    console.log(globalState);
    if(tipModule)justWarning('module is '+ tipModule);
    if(tipCcClassKey)justWarning('ccClassKey is '+ tipCcClassKey);
  }

  ccStoreSetState(MODULE_GLOBAL, validGlobalState);
  return { partialState: validGlobalState, isStateEmpty }
}