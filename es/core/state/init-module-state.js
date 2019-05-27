import ccContext from '../../cc-context';
import { MODULE_GLOBAL } from '../../support/constant';
import * as checker from '../checker';
export default function (module, state, rootStateCanNotContainInputModule) {
  if (rootStateCanNotContainInputModule === void 0) {
    rootStateCanNotContainInputModule = true;
  }

  if (rootStateCanNotContainInputModule) checker.checkModuleNameAndState(module, state);else checker.checkModuleNameBasicallyAndState(module, state);
  var rootState = ccContext.store.getState();
  rootState[module] = state;
  ccContext.moduleName_stateKeys_[module] = Object.keys(state);

  if (module === MODULE_GLOBAL) {
    var globalStateKeys = ccContext.globalStateKeys;
    var keys = Object.keys();
    keys.forEach(function (key) {
      return globalStateKeys.push(key);
    });
  }
}