
import * as util from '../../support/util';
import { INAJ } from '../../support/priv-constant';
import { MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC, MODULE_VOID } from '../../support/constant';
import ccContext from '../../cc-context';
import initModuleState from '../state/init-module-state';
import initModuleReducer from '../reducer/init-module-reducer';
import initModuleWatch from '../watch/init-module-watch';
import initModuleComputed from '../computed/init-module-computed';
import initModuleLifecycle from './init-module-lifecycle';
import { on, clearCbs } from '../plugin';

const { isPJO, okeys, isObject } = util;

function checkObj(rootObj, tag) {
  if (!isPJO(rootObj)) {
    throw new Error(`${tag} ${INAJ}`);
  }
}

export function configStoreState(storeState) {
  checkObj(storeState, 'state');
  delete storeState[MODULE_VOID];
  delete storeState[MODULE_CC];

  if (!isObject(storeState[MODULE_GLOBAL])) storeState[MODULE_GLOBAL] = {};
  if (!isObject(storeState[MODULE_DEFAULT])) storeState[MODULE_DEFAULT] = {};

  const moduleNames = okeys(storeState);
  const len = moduleNames.length;
  for (let i = 0; i < len; i++) {
    const moduleName = moduleNames[i];
    const moduleState = storeState[moduleName];
    initModuleState(moduleName, moduleState);
  }
}

/**
 * @param {{[moduleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */
export function configRootReducer(rootReducer) {
  checkObj(rootReducer, 'reducer');
  if (!isObject(rootReducer[MODULE_DEFAULT])) rootReducer[MODULE_DEFAULT] = {};
  if (!isObject(rootReducer[MODULE_GLOBAL])) rootReducer[MODULE_GLOBAL] = {};
  okeys(rootReducer).forEach(m => initModuleReducer(m, rootReducer[m]));
}

export function configRootComputed(rootComputed) {
  checkObj(rootComputed, 'computed');
  okeys(rootComputed).forEach(m => initModuleComputed(m, rootComputed[m]));
}

export function configRootWatch(rootWatch) {
  checkObj(rootWatch, 'watch');
  okeys(rootWatch).forEach(m => initModuleWatch(m, rootWatch[m]));
}

export function configRootLifecycle(rootLifecycle) {
  checkObj(rootLifecycle, 'lifecycle');
  okeys(rootLifecycle).forEach(m => initModuleLifecycle(m, rootLifecycle[m]));
}

export function configMiddlewares(middlewares) {
  if (middlewares.length > 0) {
    const ccMiddlewares = ccContext.middlewares;
    ccMiddlewares.length = 0; // 防止热加载重复多次载入middlewares
    middlewares.forEach(m => ccMiddlewares.push(m));
  }
}

export function configPlugins(plugins) {
  if (plugins.length > 0) {
    const ccPlugins = ccContext.plugins;
    ccPlugins.length = 0; // 防止热加载重复多次载入plugins
    clearCbs(); // 清理掉已映射好的插件回调

    const pluginNameMap = {};
    plugins.forEach(p => {
      ccPlugins.push(p);
      if (p.install) {
        const pluginInfo = p.install(on);
        const e = new Error('plugin.install must return result:{name:string, options?:object}');
        if (!pluginInfo) throw e;
        const pluginName = pluginInfo.name;
        if (!pluginName) throw e;
        if (pluginNameMap[pluginName]) throw new Error(`pluginName[${pluginName}] duplicate`);
        pluginNameMap[pluginName] = 1;
      } else {
        throw new Error('a plugin must export install handler!');
      }
    });
    ccContext.pluginNameMap = pluginNameMap;
  }
}

export default {
  configStoreState,
  configRootReducer,
  configRootComputed,
  configRootWatch,
  configRootLifecycle,
  configMiddlewares,
  configPlugins,
};
