import ccContext from '../cc-context';
import * as base from '../core/base';
import { ERR, MODULE_GLOBAL } from '../support/constant';
import util, { makeError, verboseInfo, isPlainJsonObject } from '../support/util';
import initModuleState from '../core/state/init-module-state';
import initModuleReducer from '../core/reducer/init-module-reducer';
import * as checker from '../core/checker';
import makeSetStateHandler from '../core/state/make-set-state-handler';

const ccGlobalStateKeys = ccContext.globalStateKeys;

function setGlobalConfig(storedGlobalConf, inputGlobalConf, label) {
  const globalState = ccContext.store.getGlobalState();
  if (inputGlobalConf) {
    if (!util.isPlainJsonObject(inputGlobalConf)) {
      throw new Error(`option.global${label} is not a plain json object`);
    }

    const globalConfKeys = Object.keys(inputGlobalConf);
    globalConfKeys.forEach(gKey => {
      if (storedGlobalConf.hasOwnProperty(gKey)) {
        throw new Error(`key[${gKey}] duplicated in global.${label.toLowerCase()}`);
      }
      const confValue = inputGlobalConf[gKey];
      storedGlobalConf[gKey] = confValue;
      if (label === 'State') ccGlobalStateKeys.push(gKey);
      else if (label === 'Computed') {
        const val = globalState[gKey];
        const computedVal = confValue(val, val, globalState);
        ccContext.computed._computedValue[MODULE_GLOBAL][gKey] = computedVal;
      }
    });
  }
}

/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {string} module
 * @param {{state:object, reducer:object, watch:object, computed:object, init:object, sharedToGlobalMapping:object, isClassSingle:boolean}} config
 * @param {object} [option] reducer、init、sharedToGlobalMapping
 * @param {{[reducerModuleName:string]:{[fnName:string]:function}}} [option.reducer]
 * @param {object} [option.globalState] will been merged to $$global module state
 * @param {object} [option.globalWatch] will been merged to $$global module watch
 * @param {object} [option.globalComputed] will been merged to $$global module computed
 * @param {function[]} [option.middlewares]
 */
export default function (module, config, option = {}) {
  if (!ccContext.isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }
  if (!util.isPlainJsonObject(config)) {
    throw new Error('[[configure]] param type error, config is not plain json object!');
  }
  if (module === MODULE_GLOBAL) {
    throw new Error('cc do not allow configure global module');
  }

  const { state, reducer, computed, watch, init, sharedToGlobalMapping, isClassSingle } = config;
  const { reducer: optionReducer, globalState, globalWatch, globalComputed, middlewares } = option;


  initModuleState(module, state);
  initModuleReducer(module, reducer);

  checker.checkModuleName(module);
  checker.checkModuleState(state, module);

  const _state = ccContext.store._state;
  const _reducer = ccContext.reducer._reducer;
  _state[module] = state;

  if (computed) {
    ccContext.computed._computedFn[module] = computed;
    ccContext.computed._computedValue[module] = {};
  }
  if (watch) {
    ccContext.watch[module] = watch
  }

  if (isClassSingle === true) {
    ccContext.moduleSingleClass[module] = true;
  }

  if (optionReducer) {
    if (!isPlainJsonObject(optionReducer)) {
      throw makeError(ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`module[${module}] 's moduleReducer is invalid`));
    }
    const reducerModuleNames = Object.keys(optionReducer);
    reducerModuleNames.forEach(rmName => {
      checker.checkModuleName(rmName);
      const moduleReducer = optionReducer[rmName];
      if (!isPlainJsonObject(moduleReducer)) {
        throw makeError(ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`module[${module}] reducer 's value is invalid`));
      }

      if (rmName == MODULE_GLOBAL) {//merge input globalReducer to existed globalReducer
        const typesOfGlobal = Object.keys(moduleReducer);
        const globalReducer = _reducer[MODULE_GLOBAL];
        typesOfGlobal.forEach(type => {
          if (globalReducer[type]) {
            throw makeError(ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, verboseInfo(`type ${type}`));
          }
          var reducerFn = moduleReducer[type];
          if (typeof reducerFn !== 'function') {
            throw makeError(ERR.CC_REDUCER_NOT_A_FUNCTION);
          }
          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  if (reducer) {
    if (!isPlainJsonObject(reducer)) {
      throw makeError(ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, verboseInfo(`config.reducer is not a plain json object`));
    }
    _reducer[module] = reducer;
  }

  const storedGlobalState = _state[MODULE_GLOBAL];
  const storedGlobalComputedFn = ccContext.computed._computedFn[MODULE_GLOBAL];
  const storedGlobalWatch = ccContext.watch[MODULE_GLOBAL];
  //这里的设置顺序很重要，一定是先设置State，再设置Computed，因为Computed会触发计算
  setGlobalConfig(storedGlobalState, globalState, 'State');
  setGlobalConfig(storedGlobalComputedFn, globalComputed, 'Computed');
  setGlobalConfig(storedGlobalWatch, globalWatch, 'Watch');

  if (sharedToGlobalMapping) {
    base.handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
  }

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }
    init(makeSetStateHandler(module));
  }


  if (middlewares && middlewares.length > 0) {
    const ccMiddlewares = ccContext.middlewares;
    middlewares.forEach(m => {
      if (typeof m !== 'function') throw new Error('one item of option.middlewares is not a function');
      ccMiddlewares.push(m)
    });
  }
}