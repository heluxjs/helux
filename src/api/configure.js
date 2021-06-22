/** @typedef {import('../types').ModuleConfig} ModuleConfig */
/** @typedef {import('../types').ConfOptions} ConfOptions */
import ccContext from '../cc-context';
import pendingModules from '../cc-context/pending-modules';
import { MODULE_GLOBAL, SIG_MODULE_CONFIGURED } from '../support/constant';
import { INAJ } from '../support/priv-constant';
import * as util from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import initModuleComputed from '../core/computed/init-module-computed';
import initModuleWatch from '../core/watch/init-module-watch';
import initModuleLifecycle from '../core/base/init-module-lifecycle';
import getLifecycle from '../core/param/get-lifecycle';
import { send } from '../core/plugin';

const { isPJO, evalState, okeys, isFn } = util;

/**
 * @description configure module associate params
 * @author zzk
 * @export
 * @param {string | {[module:string]: ModuleConfig}} moduleNameOrNamedModuleConf
 * @param {ModuleConfig | ConfOptions } config - when module type is string
 */
export default function (moduleNameOrNamedModuleConf, config = {}, innerParams) {
  const confOneModule = (module, /** @type ModuleConfig*/config, allowDup = false) => {
    if (!ccContext.isStartup) {
      pendingModules.push({ module, config });
      return;
    }
    if (!isPJO(config)) {
      throw new Error(`param config ${INAJ}`);
    }
    if (module === MODULE_GLOBAL) {
      throw new Error('configuring global module is not allowed');
    }
    if (allowDup && ccContext.store.getState(module)) {
      return;
    }
    const { state, reducer, computed, watch, ghosts = [] } = config;
    const eState = evalState(state);
    if (isFn(state)) ccContext.moduleName2stateFn[module] = state;

    // 运行重复且已存在，则直接忽略此模块

    initModuleState(module, eState, true, innerParams);
    initModuleReducer(module, reducer, ghosts);
    initModuleComputed(module, computed);
    initModuleWatch(module, watch);
    initModuleLifecycle(module, getLifecycle(config));

    ccContext.moduleName2isConfigured[module] = true;
    send(SIG_MODULE_CONFIGURED, module);
  }

  // now module is an object that includes partial store conf
  if (isPJO(moduleNameOrNamedModuleConf)) {
    let allowDup = false;
    if (isPJO(config)) allowDup = config.allowDup === true;
    okeys(moduleNameOrNamedModuleConf).forEach(moduleName =>
      confOneModule(moduleName, moduleNameOrNamedModuleConf[moduleName], allowDup)
    );
  } else {
    confOneModule(moduleNameOrNamedModuleConf, config);
  }
}
