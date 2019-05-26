import ccContext from '../../cc-context';
import { MODULE_GLOBAL } from '../../support/constant';
import * as checker from '../checker';


export default function(module, state, rootStateCanNotContainInputModule = true) {
  if (rootStateCanNotContainInputModule) checker.checkModuleNameAndState(module, state);
  else checker.checkModuleNameBasicallyAndState(module, state);

  const rootState = ccContext.store.getState();
  rootState[module] = state;
  ccContext.moduleName_stateKeys_[module] = Object.keys(state);

  if (module === MODULE_GLOBAL) {
    const globalStateKeys = ccContext.globalStateKeys;
    const keys = Object.keys();
    keys.forEach(key => globalStateKeys.push(key));
  }
}