import ccContext from '../cc-context';
import {  MODULE_GLOBAL, SIG_MODULE_CONFIGURED } from '../support/constant';
import { NOT_A_JSON } from '../support/priv-constant';
import * as util from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import initModuleComputed from '../core/computed/init-module-computed';
import initModuleWatch from '../core/watch/init-module-watch';
import { send } from '../core/plugin';
import { makeSetStateHandler } from '../core/state/handler-factory';

const { isPlainJsonObject } = util;

/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, init:object, isClassSingle:boolean}} config
 */
export default function(module, config) {
  if (!ccContext.isCcAlreadyStartup) {
    throw new Error('cc.configure must be called after cc.run!');
  }
  if (!isPlainJsonObject(config)) {
    throw new Error(`[[configure]] config ${NOT_A_JSON}`);
  }
  if (module === MODULE_GLOBAL) {
    throw new Error('configuring global module is not allowed');
  }

  const { state, reducer, computed, watch, init, isClassSingle } = config;

  if (reducer && !isPlainJsonObject(reducer)) {
    throw new Error(`[[configure]] config.reducer ${NOT_A_JSON}`);
  }

  initModuleState(module, state, true);
  initModuleReducer(module, reducer, true);

  computed && initModuleComputed(module, computed);
  watch && initModuleWatch(module, watch);
  ccContext.moduleSingleClass[module] = isClassSingle === true;

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }
    Promise.resolve().then(init).then(state => {
      makeSetStateHandler(module)(state)
    });
  }

  ccContext.moduleName_isConfigured_[module] = true;
  send(SIG_MODULE_CONFIGURED, module);
}
