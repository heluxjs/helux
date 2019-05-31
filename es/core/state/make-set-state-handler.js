import ccContext from '../../cc-context';
import util from '../../support/util';
import { MODULE_GLOBAL } from '../../support/constant';
import setState from './set-state';
import getAndStoreValidGlobalState from './get-and-store-valid-global-state';
import extractStateByKeys from './extract-state-by-keys';

export default function(module) {
  return state => {
    try {
      setState(module, state, 0, true);
    } catch (err) {
      if (module == MODULE_GLOBAL) {
        getAndStoreValidGlobalState(state, module);
      } else {
        const moduleState = ccContext.store.getState(module);
        if (!moduleState) {
          return util.justWarning(`invalid module ${module}`);
        }

        const keys = Object.keys(moduleState);
        const { partialState: validModuleState, isStateEmpty } = extractStateByKeys(state, keys);
        if (!isStateEmpty) ccContext.store.setState(module, validModuleState);//store this state;
      }

      util.justTip(`no ccInstance found for module ${module} currently, cc will just store it, lately ccInstance will pick this state to render`);
    }
  }
}