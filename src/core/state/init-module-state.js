import ccContext from '../../cc-context';
import { MODULE_GLOBAL, MODULE_VOID } from '../../support/constant';
import * as util from '../../support/util';
import * as checker from '../param/checker';
import guessDuplicate from '../base/guess-duplicate';
import * as refCache from '../ref/_cache';

export default function (module, mState, moduleMustNotExisted = true) {
  refCache.createModuleNode(module);
  //force MODULE_VOID state as {}
  let state = module === MODULE_VOID ? {} : mState;

  try {
    checker.checkModuleNameAndState(module, state, moduleMustNotExisted);
  } catch (err) {
    guessDuplicate(err, module, 'state');
  }

  const ccStore = ccContext.store;
  const rootState = ccStore.getState();
  const rootStateVer = ccStore.getStateVer();
  const rootModuleVer = ccStore.getModuleVer();
  const prevRootState = ccStore.getPrevState();
  util.safeAssignToMap(rootState, module, state);
  util.safeAssignToMap(prevRootState, module, state);
  rootStateVer[module] = util.okeys(state).reduce((map, key) => {
    map[key] = 1;
    return map;
  }, {});
  rootModuleVer[module] = 1;

  // 把_computedValueOri safeGet从init-module-computed调整到此处
  // 防止用户不定义任何computed，而只是定义watch时报错undefined
  const cu = ccContext.computed;
  util.safeGet(cu._computedDep, module, util.makeCuDepDesc());
  util.safeGet(cu._computedValue, module);
  util.safeGet(cu._computedValueOri, module);

  const stateKeys = Object.keys(state);
  ccContext.moduleName_stateKeys_[module] = stateKeys;

  if (module === MODULE_GLOBAL) {
    const globalStateKeys = ccContext.globalStateKeys;
    stateKeys.forEach(key => {
      if (!globalStateKeys.includes(key)) globalStateKeys.push(key)
    });
  }

  ccContext.module_insCount_[module] = 0;
}
