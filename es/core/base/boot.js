import * as util from '../../support/util';
import { MODULE_GLOBAL, MODULE_DEFAULT, MODULE_CC } from '../../support/constant';
import ccContext from '../../cc-context';
import * as checker from '../checker';
import handleModuleSharedToGlobalMapping from './handle-module-shared-to-global-mapping';
import initModuleState from '../state/init-module-state';
import makeSetStateHandler from '../state/make-set-state-handler';
import initModuleReducer from '../reducer/init-module-reducer';
import initModuleWatch from '../watch/init-module-watch';
import initModuleComputed from '../computed/init-module-computed';
var isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys;
/** 对已有的store.$$global状态追加新的state */

export function appendGlobalState(globalState) {// todo
}
export function configStoreState(storeState) {
  var sharedToGlobalMapping = ccContext.sharedToGlobalMapping;

  if (!isPlainJsonObject(storeState)) {
    throw new Error("the storeState is not a plain json object!");
  }

  var globalStateKeys = ccContext.globalStateKeys,
      pureGlobalStateKeys = ccContext.pureGlobalStateKeys,
      store = ccContext.store;
  store.initStateDangerously(MODULE_CC, {});
  if (storeState[MODULE_GLOBAL] === undefined) storeState[MODULE_GLOBAL] = {};
  if (storeState[MODULE_DEFAULT] === undefined) storeState[MODULE_DEFAULT] = {};
  var moduleNames = okeys(storeState);
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    var moduleState = storeState[moduleName];
    initModuleState(moduleName, moduleState);
    var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

    if (sharedKey_globalKey_) {
      handleModuleSharedToGlobalMapping(moduleName, sharedKey_globalKey_);
    }
  }

  var globalMappingKey_sharedKey_ = ccContext.globalMappingKey_sharedKey_;
  globalStateKeys.reduce(function (pKeys, gKey) {
    if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
    return pKeys;
  }, pureGlobalStateKeys);
}
/**
 * 
 * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */

export function configRootReducer(rootReducer) {
  var moduleNames = okeys(rootReducer);
  if (rootReducer[MODULE_DEFAULT] === undefined) rootReducer[MODULE_DEFAULT] = {};
  if (rootReducer[MODULE_GLOBAL] === undefined) rootReducer[MODULE_GLOBAL] = {};
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    initModuleReducer(moduleName, rootReducer[moduleName]);
  }
}
export function configRootComputed(computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed is not a plain json object!");
  }

  var moduleNames = okeys(computed);
  moduleNames.forEach(function (m) {
    return initModuleComputed(m, computed[m]);
  });
}
export function configRootWatch(watch) {
  if (!isPlainJsonObject(watch)) {
    throw new Error("StartUpOption.watch is not a plain json object!");
  }

  var moduleNames = Object.keys(watch);
  moduleNames.forEach(function (m) {
    return initModuleWatch(m, watch[m]);
  });
}
export function executeRootInit(init) {
  if (!init) return;

  if (!isPlainJsonObject(init)) {
    throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
  }

  var moduleNames = okeys(init);
  moduleNames.forEach(function (moduleName) {
    checker.checkModuleName(moduleName, false, "there is no module state defined in store for init." + moduleName);
    var initFn = init[moduleName];

    if (initFn) {
      initFn(makeSetStateHandler(moduleName));
    }
  });
}
export function configSharedToGlobalMapping(sharedToGlobalMapping) {
  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error("StartupOption.sharedToGlobalMapping is not a plain json object!");
  }

  util.safeAssignObjectValue(ccContext.sharedToGlobalMapping, sharedToGlobalMapping);
}
export function configModuleSingleClass(moduleSingleClass) {
  if (!isPlainJsonObject(moduleSingleClass)) {
    throw new Error("StartupOption.moduleSingleClass is not a plain json object!");
  }

  util.safeAssignObjectValue(ccContext.moduleSingleClass, moduleSingleClass);
}
export function configMiddlewares(middlewares) {
  if (middlewares.length > 0) {
    var ccMiddlewares = ccContext.middlewares;
    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }
}
export default {
  configStoreState: configStoreState,
  configRootReducer: configRootReducer,
  configRootComputed: configRootComputed,
  configRootWatch: configRootWatch,
  executeRootInit: executeRootInit,
  configSharedToGlobalMapping: configSharedToGlobalMapping,
  configModuleSingleClass: configModuleSingleClass,
  configMiddlewares: configMiddlewares
};