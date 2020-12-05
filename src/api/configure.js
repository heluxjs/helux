/** @typedef {import('../types').ModuleConfig} ModuleConfig */
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

const { isPJO, evalState, okeys } = util;

/**
 * @description configure module associate params
 * @author zzk
 * @export
 * @param {string | {[module:string]: ModuleConfig}} module
 * @param {ModuleConfig} config - when module type is string
 */
export default function (module, config = {}) {
  const confOneMoudle = (module, /** @type ModuleConfig*/config) => {
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
    if (typeof state === 'function') ccContext.moduleName2stateFn[module] = state;

    initModuleState(module, eState, true);
    initModuleReducer(module, reducer);
    initModuleComputed(module, computed);
    initModuleWatch(module, watch);
    initModuleLifecycle(module, getLifecycle(config));

    ccContext.moduleName2isConfigured[module] = true;
    send(SIG_MODULE_CONFIGURED, module);
  }

  // now module is an object that includes partial store conf
  if (isPJO(module)) {
    okeys(module).forEach(moduleName => confOneMoudle(moduleName, module[moduleName]));
  } else {
    confOneMoudle(module, config);
  }
}
