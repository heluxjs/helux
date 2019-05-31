import configure from './configure';
import getComputed from './get-computed';
import ccContext from '../cc-context';
import {clone} from '../support/util';
import * as checker from '../core/checker';
import initModuleComputed from '../core/computed/init-module-computed';

/**
 * @param {string} newModule
 * @param {string} existingModule
 */
export default (newModule, existingModule, { state } = {}) => {
  if(!ccContext.isCcAlreadyStartup){
    throw new Error('cc is not startup yet');
  }
  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);

  const mState = ccContext.store.getState(existingModule);
  let stateCopy = clone(mState);
  if(state)stateCopy = Object.assign(stateCopy, state);

  const reducer = ccContext.reducer._reducer[existingModule];
  const computed = ccContext.computed._computedFn[existingModule];
  const watch = ccContext.watch._watch[existingModule];
  const init = ccContext.init._init[existingModule];

  const confObj = {state: stateCopy};
  if(reducer)confObj.reducer = reducer;
  if(computed)confObj.computed = computed;
  if(watch)confObj.watch = watch;
  if(init)confObj.init = init;

  configure(newModule, confObj);
}