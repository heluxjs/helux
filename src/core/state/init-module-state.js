import ccContext from '../../cc-context';
import { MODULE_GLOBAL, ERR } from '../../support/constant';
import * as checker from '../checker';
import guessDuplicate from '../base/guess-duplicate';

export default function(module, state, moduleStateMustNotDefinedInStore = true, tag='') {
  try{
    checker.checkModuleNameAndState(module, state, moduleStateMustNotDefinedInStore);
  }catch(err){
    guessDuplicate(err, module, 'state');
  }

  // ccContext.store.setState(module, state);
  const rootState = ccContext.store.getState();
  const prevRootState = ccContext.store.getPrevState();
  rootState[module] = state;
  prevRootState[module] = Object.assign({}, state);

  const statKeys = Object.keys(state);
  ccContext.moduleName_stateKeys_[module] = statKeys;

  if (module === MODULE_GLOBAL) {
    const globalStateKeys = ccContext.globalStateKeys;
    statKeys.forEach(key => globalStateKeys.push(key));
  }
}