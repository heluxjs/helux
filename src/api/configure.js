import ccContext from '../cc-context';
import pendingModules from '../cc-context/pending-modules';
import { MODULE_GLOBAL, SIG_MODULE_CONFIGURED } from '../support/constant';
import { NOT_A_JSON } from '../support/priv-constant';
import * as util from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import initModuleComputed from '../core/computed/init-module-computed';
import initModuleWatch from '../core/watch/init-module-watch';
import initModuleLifecycle from '../core/base/init-module-lifecycle';
import getLifecycle from '../core/param/get-lifecycle';
import { send } from '../core/plugin';

const { isPJO, evalState } = util;

/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, init:object}} config
 */
export default function (module, config = {}) {
  if (!ccContext.isStartup) {
    pendingModules.push({ module, config });
    return;
  }
  if (!isPJO(config)) {
    throw new Error(`param config ${NOT_A_JSON}`);
  }
  if (module === MODULE_GLOBAL) {
    throw new Error('configuring global module is not allowed');
  }

  const { state, reducer, computed, watch } = config;
  const eState = evalState(state);
  if (typeof state === 'function') ccContext.moduleName_stateFn_[module] = state;

  initModuleState(module, eState, true);
  initModuleReducer(module, reducer);
  initModuleComputed(module, computed);
  initModuleWatch(module, watch);
  initModuleLifecycle(module, getLifecycle(config));

  ccContext.moduleName_isConfigured_[module] = true;
  send(SIG_MODULE_CONFIGURED, module);
}
