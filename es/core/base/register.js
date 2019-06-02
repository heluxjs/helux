
import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR, CC_FRAGMENT_PREFIX, CC_DISPATCHER,
  CHANGE_BY_SELF,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE,
  CHANGE_BY_BROADCASTED_SHARED_STATE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE,

  CURSOR_KEY, CCSYNC_KEY,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import util, { isPlainJsonObject, makeHandlerKey } from '../../support/util';
import co from 'co';
import extractStateByKeys from '../state/extract-state-by-keys';
import setConnectedState from '../state/set-connected-state';
import buildCcClassContext from './build-cc-class-context';
import catchCcError from './catch-cc-error';
import mapModuleAndCcClassKeys from '../mapper/map-module-and-cc-class-keys';
import unsetRef from '../ref/unset-ref';
import setRef from '../ref/set-ref';
import runLater from './run-later';
import getAndStoreValidGlobalState from '../state/get-and-store-valid-global-state';
import computeCcUniqueKey from './compute-cc-unique-key';
import getFeatureStrAndStpMapping from './get-feature-str-and-stpmapping';
import extractStateByCcsync from '../state/extract-state-by-ccsync';
import * as checker from '../checker';
import * as ev from '../event';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning, throwCcHmrError } = util;
const {
  store: { _state, getState, setState: ccStoreSetState, setStateByModuleAndKey },
  reducer: { _reducer }, refStore, globalMappingKey_sharedKey_,
  computed: { _computedValue },
  moduleName_sharedStateKeys_, moduleName_globalStateKeys_, moduleName_stateKeys_,
  ccKey_ref_, ccKey_option_, globalCcClassKeys, moduleName_ccClassKeys_, ccClassKey_ccClassContext_,
  globalMappingKey_toModules_, globalMappingKey_fromModule_, globalKey_toModules_, sharedKey_globalMappingKeyDescriptor_,
  middlewares
} = ccContext;
const cl = color;
const ss = styleStr;
const me = makeError;
const vbi = verboseInfo;

const DISPATCH = 'dispatch';
const SET_STATE = 'setState';
const SET_GLOBAL_STATE = 'setGlobalState';
const FORCE_UPDATE = 'forceUpdate';

function paramCallBackShouldNotSupply(module, currentModule) {
  return `if you pass param reactCallback, param module must equal current CCInstance's module, module: ${module}, CCInstance's module:${currentModule}, now the cb will never been triggered! `;
}

function handleError(err, throwError = true) {
  if (throwError) throw err;
  else {
    handleCcFnError(err);
  }
}

function checkStoreModule(module, checkGlobalModule = true, throwError = true) {
  if (checkGlobalModule && module === MODULE_GLOBAL) {
    handleError(me(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
    return false;
  }

  try {
    checker.checkModuleName(module, false, `module[${module}] is not configured in store`);
    return true;
  } catch (err) {
    handleError(err, throwError);
    return false;
  }
}

// any error in this function will not been throwed, cc just warning, 
function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  let targetCb = reactCallback;
  if (checkStoreModule(inputModule, false, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null;//let user's reactCallback has no change to be triggered
      }
    }
    cb(null, targetCb);
  } else {
    cb(new Error(`inputModule:${inputModule} invalid`), null);
  }
}

function getSharedKeysAndGlobalKeys(module, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
  let sharedStateKeys = inputSharedStateKeys, globalStateKeys = inputGlobalStateKeys;
  if (inputSharedStateKeys === '*') {
    sharedStateKeys = Object.keys(getState(module));
  }

  if (inputGlobalStateKeys === '*') {
    globalStateKeys = Object.keys(getState(MODULE_GLOBAL));
  }

  const { duplicate, notArray, keyElementNotString } = verifyKeys(sharedStateKeys, globalStateKeys);
  if (notArray) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (keyElementNotString) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey}`));
  }
  if (duplicate) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi(`ccClassKey:${ccClassKey} globalStateKeys:${globalStateKeys} sharedStateKeys:${sharedStateKeys}`));
  }

  const globalState = getState(MODULE_GLOBAL);

  let hasGlobalMappingKeyInSharedStateKeys = false;
  let matchedGlobalKey, matchedSharedKey;
  const len = globalStateKeys.length;
  for (let i = 0; i < len; i++) {
    const gKey = globalStateKeys[i];
    if (globalState[gKey] === undefined) {
      throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi(`ccClassKey:${ccClassKey}, invalid key in globalStateKeys is [${gKey}]`));
    }

    const sharedKey = globalMappingKey_sharedKey_[gKey];
    const fromModule = globalMappingKey_fromModule_[gKey];

    //  if cc found one of the globalStateKeys of this module is just mapped from shared to global
    //  it is strictly prohibited here
    if (fromModule == module && sharedStateKeys.includes(sharedKey)) {
      hasGlobalMappingKeyInSharedStateKeys = true;
      matchedGlobalKey = gKey;
      matchedSharedKey = sharedKey;
      break;
    }
  }

  // maybe in the future, this is ok？ if user change sharedToGlobalMapping frequently, user don't have to change ccClass's globalStateKeys at the same time
  // but currently, this situation is strictly prohibited...... prevent from syncGlobalState and syncSharedState signal working badly
  if (hasGlobalMappingKeyInSharedStateKeys) {
    throw me(ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi(`ccClassKey [${ccClassKey}], invalid global key [${matchedGlobalKey}], matched state key [${matchedSharedKey}]`));
  }

  return { sharedStateKeys, globalStateKeys };
}

function checkCcStartupOrNot() {
  if (!window.cc || ccContext.isCcAlreadyStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function extractStateToBeBroadcasted(refModule, sourceState, sharedStateKeys, globalStateKeys) {
  const { partialState: partialSharedState, isStateEmpty: isPartialSharedStateEmpty } = extractStateByKeys(sourceState, sharedStateKeys);
  const { partialState: partialGlobalState, isStateEmpty: isPartialGlobalStateEmpty } = extractStateByKeys(sourceState, globalStateKeys);

  //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
  //  the stateValue will been collected to module_globalState_, 
  //  any stateValue's key if it is a shared key that mapped to global key,
  //  the stateValue will been collected to module_globalState_ also,
  //  key means module name, value means the state to been broadcasted to the module
  const module_globalState_ = {};

  //  see if sourceState includes globalMappingKeys, extract the target state that will been broadcasted to other module by globalMappingKey_sharedKey_
  globalStateKeys.forEach(gKey => {
    const stateValue = sourceState[gKey];
    if (stateValue !== undefined) {
      const sharedKey = globalMappingKey_sharedKey_[gKey];
      let toModules, stateKey;
      if (sharedKey) {//  this global key is created from some other module's sharedToGlobalMapping setting
        toModules = globalMappingKey_toModules_[gKey];
        stateKey = sharedKey;
      } else {//  this is normal global key
        toModules = globalKey_toModules_[gKey];
        stateKey = gKey;
      }
      if (toModules) {
        toModules.forEach(m => {
          if (m != refModule) {// current ref's module global state has been extracted into partialGlobalState above, so here exclude it
            let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
            modulePartialGlobalState[stateKey] = stateValue;
          }
        });
      }
    }
  });

  //  see if sourceState includes sharedStateKey which are mapped to globalStateKey
  sharedStateKeys.forEach(sKey => {
    const stateValue = sourceState[sKey];
    if (stateValue !== undefined) {
      const descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];
      if (descriptor) {
        const { globalMappingKey } = descriptor;
        const toModules = globalMappingKey_toModules_[globalMappingKey];
        //  !!!set this state to globalState, let other module that watching this globalMappingKey
        //  can recover it correctly while they are mounted again!
        setStateByModuleAndKey(MODULE_GLOBAL, globalMappingKey, stateValue);

        if (toModules) {
          toModules.forEach(m => {
            if (m != refModule) {// current ref's module global state has been extracted into partialGlobalState above, so here exclude it
              let modulePartialGlobalState = util.safeGetObjectFromObject(module_globalState_, m);
              modulePartialGlobalState[globalMappingKey] = stateValue;
            }
          });
        }
      }
    }
  });

  // partialSharedState is prepared for input module 
  // partialGlobalState is prepared for input module 
  // module_globalState_ is prepared for other module 
  return { isPartialSharedStateEmpty, partialSharedState, isPartialGlobalStateEmpty, partialGlobalState, module_globalState_ };
}

//to let cc know a specified module are watching what sharedStateKeys
function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
  let sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
  if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
  partialSharedStateKeys.forEach(sKey => {
    if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
  });
}

function mapGlobalKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(gKey => {
    const toModules = util.safeGetArrayFromObject(globalKey_toModules_, gKey);
    // because cc allow multi class register to a same module, so here judge if toModules includes module or not
    if (!toModules.includes(_curStateModule)) {
      toModules.push(_curStateModule);
    }
  });
}

function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(gKey => {
    const toModules = util.safeGetArrayFromObject(globalMappingKey_toModules_, gKey);
    if (globalMappingKey_sharedKey_[gKey]) {//  if this gKey is globalMappingKey
      if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule)
    }
  });
}

//to let cc know a specified module are watching what globalStateKeys
function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
  const globalStateKeysOfModule = util.safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);
  partialGlobalStateKeys.forEach(gKey => {
    if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
  });
}

//tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state
function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys,
  sharedStateKeys, globalStateKeys, connectSpec) {
  let fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;
  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
    throw me(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }
  const { stateToPropMapping } = getFeatureStrAndStpMapping(connectSpec);

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  const ctx = contextMap[ccClassKey];
  if (ctx !== undefined) {// analyze is ccClassKey really duplicated
    if (util.isHotReloadMode()) {
      const str1 = ctx.originalGlobalStateKeys.toString() + ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
      const str2 = originalGlobalStateKeys.toString() + originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);
      if (str1 !== str2) {
        throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
      } else {
        throwCcHmrError(me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`));
      }
    } else {
      throw me(ERR.CC_CLASS_KEY_DUPLICATE, `ccClassKey:${ccClassKey} duplicate`);
    }
  }

  buildCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys,
    sharedStateKeys, globalStateKeys, stateToPropMapping);
}

/****
 * it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
 * 
 * if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
 * then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
 * usually ccInstance's $$invoke, $$dispatch method will trigger this extraction strategy
 * ------------------------------------------------------------------------------------------------------------------------
 * if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
 * then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
 * usually ccInstance's $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
 * will trigger this extraction strategy
 */
function getSuitableGlobalStateKeysAndSharedStateKeys(isDispatcher, stateFor, moduleName, ccClassGlobalStateKeys, ccClassSharedStateKeys) {
  if (isDispatcher) {//dispatcher实例调用的话，本身是不携带任何***StateKeys信息的
    return { sharedStateKeys: moduleName_stateKeys_[moduleName] || [], globalStateKeys: [] }
  }

  let globalStateKeys, sharedStateKeys;
  if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    globalStateKeys = ccClassGlobalStateKeys;
    sharedStateKeys = ccClassSharedStateKeys;
  } else if (stateFor === STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
    // user may declare module but no any class register to the module,
    // and a cc class define stateToPropMapping to watch this module's state change,
    // then moduleName_globalStateKeys_[moduleName] will be undefined
    globalStateKeys = moduleName_globalStateKeys_[moduleName] || [];
    sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
  } else {
    throw new Error(`stateFor is not set correctly! `)
    // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
  }
  return { globalStateKeys, sharedStateKeys };
}

function _throwForExtendInputClassAsFalseCheck(ccClassKey) {
  throw me(`cc found that you set sharedStateKeys、globalStateKeys or storedStateKeys, but you set extendInputClass as false at the same time
    while you register a ccClass:${ccClassKey}, this is not allowed, extendInputClass=false means cc will give you
    a props proxy component, in this situation, cc is unable to take over your component state, so set sharedStateKeys or globalStateKeys
    is strictly prohibited, but you can still set stateToPropMapping to let cc control your component render timing!
  `);
}
function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, connectSpec) {
  if (extendInputClass === false) {
    if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
      //??? maybe can use this.props.state?
      _throwForExtendInputClassAsFalseCheck(ccClassKey);
    }
  }

  const { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys } =
    getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys);

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, connectSpec)
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);

  mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
  mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapModuleAndCcClassKeys(stateModule, ccClassKey);

  //tell cc this ccClass is watching some globalStateKeys of global module
  if (targetGlobalStateKeys.length > 0) ccContext.globalCcClassKeys.push(ccClassKey);

  return { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys };
}

function computeValueForRef(refComputedFn, refComputed, unchangedState, commitState) {
  if (refComputedFn) {
    const toBeComputed = refComputedFn();
    const toBeComputedKeys = Object.keys(toBeComputed);
    toBeComputedKeys.forEach(key => {
      const fn = toBeComputed[key];
      const newValue = commitState[key];
      if (newValue !== undefined) {
        const computedValue = fn(newValue, unchangedState[key], unchangedState);
        refComputed[key] = computedValue;
      }
    })
  }
}

function watchValueForRef(refWatchFn, refEntireState, userCommitState) {
  let shouldCurrentRefUpdate = true;
  if (refWatchFn) {
    const refWatch = refWatchFn();
    const watchStateKeys = Object.keys(refWatch);
    const len = watchStateKeys.length;
    let shouldNouUpdateLen = 0;
    watchStateKeys.forEach(key => {
      const commitValue = userCommitState[key];
      if (commitValue !== undefined) {
        const watchFn = refWatch[key];
        const ret = watchFn(commitValue, refEntireState[key]);// watchFn(newValue, oldValue);
        if (ret === false) shouldNouUpdateLen++;
      }
    });

    //只有所有watch都返回false，才不触发当前实例更新
    if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}

function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
  const { stateToPropMapping, connectedModule } = targetClassContext;
  if (connectedModule[commitModule] === 1) {
    const { connectedState, ccKeys } = targetClassContext;

    let isSetConnectedStateTriggered = false;
    commitStateKeys.forEach(sKey => {
      const moduledStateKey = `${commitModule}/${sKey}`;
      if (stateToPropMapping[moduledStateKey]) {
        setConnectedState(connectedState, commitModule, sKey, commitState[sKey]);
        isSetConnectedStateTriggered = true;
      }
    });

    //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍
    if (isSetConnectedStateTriggered === true) {
      ccKeys.forEach(ccUniKey => {
        const ref = ccKey_ref_[ccUniKey];
        if (ref) ref.cc.reactForceUpdate();
      });
    }
  }
}

function broadcastConnectedState(commitModule, commitState) {
  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  const commitStateKeys = Object.keys(commitState);//提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程
  Object.keys(moduleName_ccClassKeys_).forEach(moduleName => {
    const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
    ccClassKeys.forEach(ccClassKey => {
      const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  });
}

function _promiseErrorHandler(resolve, reject) {
  return (err, ...args) => err ? reject(err) : resolve(...args);
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext, ...args) {
  return new Promise((resolve, reject) => {
    const _executionContext = Object.assign(executionContext, { __innerCb: _promiseErrorHandler(resolve, reject) });
    ccFn(userLogicFn, _executionContext, ...args);
  }).catch(catchCcError);
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);
    else {
      justWarning(err);
      if (ccContext.errorHandler) ccContext.errorHandler(err);
    }
  }
}

function getStateFor(inputModule, currentModule) {
  return inputModule === currentModule ? STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

export default function register(ccClassKey, {
  module = MODULE_DEFAULT,
  sharedStateKeys: inputSharedStateKeys = [],
  globalStateKeys: inputGlobalStateKeys = [],
  storedStateKeys: inputStoredStateKeys = [],
  connect = {},
  reducerModule,
  extendInputClass = true,
  isSingle = false,
  asyncLifecycleHook = true,// is asyncLifecycleHook = false, it may block cc broadcast state to other when it takes a long time to finish
  __checkStartUp = true,
  __calledBy,
} = {}) {
  try {
    if (!ccClassKey) throw new Error(`[[register]]: ccClassKey is undefined!`)

    if (__checkStartUp === true) checkCcStartupOrNot();
    if (__calledBy !== 'cc') {
      if (ccClassKey.toLowerCase() === CC_DISPATCHER.toLowerCase()) {
        throw new Error(`${CC_DISPATCHER} is cc built-in ccClassKey name, if you want to customize your dispatcher, 
        you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.`)
      }
    }

    const _curStateModule = module;
    const _asyncLifecycleHook = asyncLifecycleHook;
    const _reducerModule = reducerModule || _curStateModule;//if reducerModule not defined, will be equal module;

    checkStoreModule(_curStateModule);

    const { sharedStateKeys: sKeys, globalStateKeys: gKeys } =
      mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, connect);
    const sharedStateKeys = sKeys, globalStateKeys = gKeys;
    const isIssArr = Array.isArray(inputStoredStateKeys);
    if (!isIssArr && inputStoredStateKeys !== '*') {
      throw new Error(`register.option.storedStateKeys type err, it is must be an array or string *`)
    }
    if (isIssArr) {
      const allKeys = sKeys.concat(gKeys);
      inputStoredStateKeys.forEach(v => {
        if (allKeys.includes(v)) {
          throw new Error(`register.option.storedStateKeys key err, the key[${v}] is already been declared in sharedStateKeys or globalStateKeys `)
        }
      });
    }

    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`if you want to register ${ccClassKey} to cc successfully, the ReactClass can not be a CcClass!`));
      }

      const TargetClass = extendInputClass ? ReactClass : React.Component;
      const CcClass = class CcClass extends TargetClass {

        constructor(props, context) {
          try {
            super(props, context);
            if (!this.state) this.state = {};
            const { ccKey, ccOption = {} } = props;
            const originalCcKey = ccKey;

            //这些方法是cc自己注入的
            util.bindThis(this, [
              '__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync',
              '__$$getEffectHandler', '__$$getXEffectHandler', '__$$makeEffectHandler',
              '__$$getInvokeHandler', '__$$getXInvokeHandler', '__$$makeInvokeHandler',
              '__$$getChangeStateHandler', '__$$getDispatchHandler', '__$$getSyncHandler',
            ]);

            // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing
            if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true;
            // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing
            if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;

            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            const { asyncLifecycleHook } = ccOption;

            const { ccKey: newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey);
            const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            setRef(this, isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);

            // bind connectedState to $$connectedState
            this.$$connectedState = ccClassContext.connectedState || {};

            if (!ccOption.storedStateKeys) {
              ccOption.storedStateKeys = inputStoredStateKeys;
            }
            if (ccOption.storedStateKeys === '*') {
              const toExcludeKeys = sharedStateKeys.concat(globalStateKeys);
              const allKeys = Object.keys(this.state);
              const storedStateKeys = allKeys.filter(k => !toExcludeKeys.includes(k));
              ccOption.storedStateKeys = storedStateKeys;
            }

            this.__$$mapCcToInstance(
              isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys,
              ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys
            );

            this.$$refComputed = this.cc.refComputed;
            //这些方法是cc交给用户定义的，放置到cc下统一管理，因为多重装饰器模式下，这里属性是从this上取不到的
            //放在__$$recoverState之前，优先设置this.cc.computed
            if (this.$$computed) this.cc.computed = this.$$computed.bind(this);
            if (this.$$onUrlChanged) this.cc.$$onUrlChanged = this.$$onUrlChanged.bind(this);
            if (this.$$watch) this.cc.watch = this.$$watch.bind(this);
            if (this.$$execute) this.cc.execute = this.$$execute.bind(this);
            //$$cache要注意使用规范
            if (this.$$cache) {
              this.$$cache = this.$$cache.bind(this);
              this.$$refCache = this.$$cache();
            } else {
              this.$$refCache = {};
            }
            
            this.__$$recoverState(_curStateModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey);
          } catch (err) {
            catchCcError(err);
          }
        }

        // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
        shouldComponentUpdate(nextProps, nextState) {
          return this.state !== nextState;
        }

        __$$recoverState(currentModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey) {
          let refState = refStore._state[ccUniqueKey] || {};

          const sharedState = _state[currentModule];
          const globalState = _state[MODULE_GLOBAL];
          const { syncSharedState, syncGlobalState } = ccOption;

          let partialSharedState = {}, partialGlobalState = {};
          if (syncSharedState) {
            const { partialState } = extractStateByKeys(sharedState, sharedStateKeys);
            partialSharedState = partialState;
          }
          if (syncGlobalState) {
            const { partialState } = extractStateByKeys(globalState, globalStateKeys);
            partialGlobalState = partialState;
          }

          const selfState = this.state;
          const entireState = Object.assign({}, selfState, refState, partialSharedState, partialGlobalState);
          this.state = entireState;
          computeValueForRef(this.cc.computed, this.cc.refComputed, entireState, entireState);
        }

        //!!! 存在多重装饰器时
        //!!! 必需在类的 【componentWillMount】 里调用 this.props.$$attach(this)
        $$attach(childRef) {
          const attachMethods = [
            '$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di',
            '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off',
            '$$sync', '$$invoke', '$$xinvoke', '$$effect', '$$xeffect',
            '$$forceSyncState', 'setState', 'setGlobalState', 'forceUpdate',
          ];
          attachMethods.forEach(m => {
            childRef[m] = this[m].bind(this);
          });

          //这些负责搜集结果的key，单独绑定
          childRef.$$refComputed = this.cc.refComputed;
          childRef.$$connectedComputed = this.cc.connectedComputed;
          childRef.$$moduleComputed = this.cc.moduleComputed;
          childRef.$$globalComputed = this.cc.globalComputed;

          const bindChildRefCcApi = (cRef, method, ccMethod) => {
            if (cRef[method]) {
              childRef[method] = childRef[method].bind(childRef);
              this.cc[ccMethod] = childRef[method];
            }
          }
          
          //这些方法绑定的this指向childRef
          bindChildRefCcApi(childRef, '$$watch', 'watch');
          bindChildRefCcApi(childRef, '$$computed', 'computed');
          bindChildRefCcApi(childRef, '$$onUrlChanged', 'onUrlChanged');

          if (childRef.$$cache) {
            childRef.$$cache = childRef.$$cache.bind(childRef);
            this.cc.cache = childRef.$$cache;
            childRef.$$refCache = childRef.$$cache();
          } else {
            childRef.$$refCache = {};
          }
        }

        __$$mapCcToInstance(
          isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys
        ) {
          const reactSetStateRef = this.setState.bind(this);
          const reactForceUpdateRef = this.forceUpdate.bind(this);
          const ccState = {
            renderCount: 1, isSingle, asyncLifecycleHook, ccClassKey, ccKey, originalCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
            ccOption, ccClassContext, module: currentModule, reducerModule: currentReducerModule, sharedStateKeys, globalStateKeys, initTime: Date.now()
          };

          const { duplicate, notArray, keyElementNotString } = verifyKeys(sharedStateKeys, storedStateKeys);
          if (notArray) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
          }
          if (keyElementNotString) {
            throw me(ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey}`));
          }
          if (duplicate) {
            throw me(ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi(`ccClassKey:${ccClassKey} ccKey:${ccKey} sharedStateKeys:${sharedStateKeys} storedStateKeys:${storedStateKeys}`));
          }
          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi(`ccClassKey:${ccClassKey}`));
          }

          this.cc = {
            watch: null,
            computed: null,
            refComputed: {},
            connectedComputed:{},
            globalComputed: {},
            moduleComputed: {},
            execute: null,
            ccState,
            ccClassKey,
            originalCcKey,
            ccKey,
            ccUniqueKey,
            beforeSetState: this.$$beforeSetState,
            beforeBroadcastState: this.$$beforeBroadcastState,
            afterSetState: this.$$afterSetState,
            reactSetState: (state, cb) => {
              ccState.renderCount += 1;
              //让dispatch里取的state最新的
              this.state = Object.assign(this.state, state);
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: (cb) => {
              ccState.renderCount += 1;
              reactForceUpdateRef(cb);
            },
            setState: (state, cb, delay = -1) => {
              this.$$changeState(state, { ccKey, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, delay });
            },
            forceSyncState: (state, cb, delay = -1) => {
              this.$$changeState(state, { forceSync: true, ccKey, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, delay });
            },
            setGlobalState: (partialGlobalState, delay = -1, broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE) => {
              this.$$changeState(partialGlobalState, { ccKey, module: MODULE_GLOBAL, broadcastTriggeredBy, calledBy: SET_GLOBAL_STATE, delay });
            },
            forceUpdate: (cb, delay) => {
              this.$$changeState(this.state, { ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb, calledBy: FORCE_UPDATE, delay });
            },

            // change other module's state, the difference between effect and xeffect is:
            // xeffect will take your logicFn param list's first place to put ExecutionContext
            __effect: (targetModule, userLogicFn, option, ...args) => {
              const { ccKey, identity, delay = -1, context, methodName } = option;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: getStateFor(targetModule, currentModule), context, module: targetModule,
                calledBy: methodName, fnName: userLogicFn.name, delay, identity
              }, ...args);
            },
            __invoke: (userLogicFn, option, ...args) => {
              const { context = false, forceSync = false, cb, delay, identity, methodName } = option;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, context, module: currentModule,
                calledBy: methodName, fnName: userLogicFn.name, delay, identity, forceSync, cb,
              }, ...args);
            },

            __promisifiedInvokeWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__invokeWith, userLogicFn, executionContext, ...args);
            },
            __invokeWith: (userLogicFn, executionContext, ...args) => {
              const {
                ccKey, stateFor, module: targetModule = currentModule, context = false, forceSync = false,
                cb, __innerCb, type, reducerModule, calledBy, fnName, delay = -1, identity
              } = executionContext;
              isStateModuleValid(targetModule, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                if (context) {
                  const dispatch = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, ccKey);
                  const dispatchIdentity = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, ccKey, identity);

                  //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                  //目前先保留state
                  const executionContextForUser = Object.assign(
                    executionContext, {
                      effect: this.__$$getEffectHandler(ccKey), xeffect: this.__$$getXEffectHandler(ccKey),
                      invoke: this.__$$getInvokeHandler(), xinvoke: this.__$$getXInvokeHandler(),
                      moduleState: getState(targetModule), connectedState: ccClassContext[currentModule],
                      moduleComputed: _computedValue[currentModule],
                      state: this.state, getState: () => this.state, getModuleState: () => getState(MODULE_GLOBAL),
                      store: getState(), globalState: getState(MODULE_GLOBAL),
                      dispatch, dispatchIdentity, d: dispatch, di: dispatchIdentity,
                    });
                  args.unshift(executionContextForUser);
                }

                let _partialState = null;
                co.wrap(userLogicFn)(...args).then(partialState => {
                  _partialState = partialState;
                  this.$$changeState(partialState, {
                    identity, ccKey, stateFor, module: targetModule, forceSync, cb: newCb, type,
                    reducerModule, changedBy: CHANGE_BY_SELF, calledBy, fnName, delay
                  });
                }).then(() => {
                  if (__innerCb) __innerCb(null, _partialState);
                }).catch(err => {
                  handleCcFnError(err, __innerCb);
                });
              });
            },

            dispatch: ({
              ccKey, stateFor, module: inputModule, reducerModule: inputReducerModule, identity,
              forceSync = false, type, payload, cb: reactCallback, __innerCb, delay = -1 } = {}
            ) => {
              //if module not defined, targetStateModule will be currentModule
              const targetStateModule = inputModule || currentModule;

              //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule
              const targetReducerModule = inputReducerModule || targetStateModule;

              const targetReducerMap = _reducer[targetReducerModule];
              if (!targetReducerMap) {
                return __innerCb(new Error(`no reducerMap found for reducer module:${targetReducerModule}`));
              }
              const reducerFn = targetReducerMap[type];
              if (!reducerFn) {
                const fns = Object.keys(targetReducerMap);
                return __innerCb(new Error(`no reducer defined in ccContext for reducer module:${targetReducerModule} type:${type}, maybe you want to invoke one of them:${fns}`));
              }
              // const errMsg = util.isCcActionValid({ type, payload });
              // if (errMsg) return justWarning(errMsg);

              isStateModuleValid(targetStateModule, currentModule, reactCallback, (err, newCb) => {
                if (err) return __innerCb(err);
                const executionContext = {
                  ccKey, stateFor, ccUniqueKey, ccOption, module: targetStateModule, reducerModule: targetReducerModule, type,
                  payload, forceSync, cb: newCb, context: true, __innerCb, calledBy: DISPATCH, delay, identity
                };
                this.cc.__invokeWith(reducerFn, executionContext);
              });
            },
            prepareReactSetState: (identity, changedBy, state, stateFor, next, reactCallback) => {
              // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
              // 要不然$$cache就没意义了
              // if(this.$$cache){
              //   this.$$refCache = this.$$cache();
              // }
              if (stateFor !== STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (next) next();
                return;
              }
              if (identity) {//if user specify identity
                if (this.cc.ccKey !== identity) {// current instance would have been rendered only if current instance's ccKey equal identity
                  if (next) next();
                  return;
                }
              }

              if (storedStateKeys.length > 0) {
                const { partialState, isStateEmpty } = extractStateByKeys(state, storedStateKeys);
                if (!isStateEmpty) {
                  if (ccOption.storeInLocalStorage === true) {
                    const { partialState: entireStoredState } = extractStateByKeys(this.state, storedStateKeys);
                    const currentStoredState = Object.assign({}, entireStoredState, partialState);
                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }
                  refStore.setState(ccUniqueKey, partialState);
                }
              }

              let shouldCurrentRefUpdate = true;
              if (!util.isObjectNotNull(state)) {
                if (next) next();
                return;
              } else {
                const thisState = this.state;
                computeValueForRef(this.cc.computed, this.cc.refComputed, thisState, state);
                shouldCurrentRefUpdate = watchValueForRef(this.cc.watch, thisState, state);
              }

              if (shouldCurrentRefUpdate === false) {
                if (next) next();
              }

              if (this.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  this.$$beforeSetState({ changedBy });
                  this.cc.reactSetState(state, reactCallback);
                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  this.$$beforeSetState({ changedBy }, () => {
                    this.cc.reactSetState(state, reactCallback);
                    if (next) next();
                  });
                }
              } else {
                this.cc.reactSetState(state, reactCallback);
                if (next) next();
              }
            },
            prepareBroadcastGlobalState: (identity, broadcastTriggeredBy, globalState, delay) => {
              //!!! save global state to store
              const { partialState: validGlobalState, isStateEmpty } = getAndStoreValidGlobalState(globalState, currentModule, ccClassKey);
              const startBroadcastGlobalState = () => {
                if (!isStateEmpty) {
                  if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                    if (asyncLifecycleHook) {
                      this.$$beforeBroadcastState({ broadcastTriggeredBy });
                      this.cc.broadcastGlobalState(identity, validGlobalState);
                    } else {
                      this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                        this.cc.broadcastGlobalState(identity, validGlobalState);
                      });
                    }
                  } else {
                    this.cc.broadcastGlobalState(identity, validGlobalState);
                  }
                }
              }

              if (delay > 0) {
                const feature = util.computeFeature(ccUniqueKey, globalState);
                runLater(startBroadcastGlobalState, feature, delay);
              } else {
                startBroadcastGlobalState();
              }
            },
            prepareBroadcastState: (stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, delay, identity) => {
              let targetSharedStateKeys, targetGlobalStateKeys;
              try {
                const isDispatcher = this.cc.ccClassKey === CC_DISPATCHER;
                const result = getSuitableGlobalStateKeysAndSharedStateKeys(isDispatcher, stateFor, moduleName, globalStateKeys, sharedStateKeys);
                targetSharedStateKeys = result.sharedStateKeys;
                targetGlobalStateKeys = result.globalStateKeys;
              } catch (err) {
                return justWarning(`${err.message} prepareBroadcastState failed!`)
              }

              let skipBroadcastRefState = false;
              if (stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (targetSharedStateKeys.length === 0 && targetGlobalStateKeys.length === 0) {
                  skipBroadcastRefState = true;
                }
              }

              const { isPartialSharedStateEmpty, isPartialGlobalStateEmpty, partialSharedState, partialGlobalState, module_globalState_ }
                = extractStateToBeBroadcasted(moduleName, committedState, targetSharedStateKeys, targetGlobalStateKeys);

              //!!! save state to store
              if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
              if (!isPartialGlobalStateEmpty) ccStoreSetState(MODULE_GLOBAL, partialGlobalState);

              const startBroadcastState = () => {
                if (this.$$beforeBroadcastState) {//check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    this.$$beforeBroadcastState({ broadcastTriggeredBy }, () => {
                      this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                    });
                  } else {
                    this.$$beforeBroadcastState({ broadcastTriggeredBy });
                    this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                  }
                } else {
                  this.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                }
              };

              if (delay > 0) {
                const feature = util.computeFeature(ccUniqueKey, committedState);
                runLater(startBroadcastState, feature, delay);
              } else {
                startBroadcastState();
              }
            },
            broadcastState: (skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity) => {
              if (skipBroadcastRefState === false) {
                let _partialSharedState = partialSharedState;
                if (needClone) _partialSharedState = util.clone(partialSharedState);// this clone operation may cause performance issue, if partialSharedState is too big!!

                const { ccUniqueKey: currentCcKey } = this.cc.ccState;
                const ccClassKey_isHandled_ = {};//record which ccClassKey has been handled

                // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
                // so flag ignoreCurrentCcKey as true;
                const ignoreCurrentCcKey = stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;

                const ccClassKeys = moduleName_ccClassKeys_[moduleName];
                if (ccClassKeys) {
                  //  these ccClass are watching the same module's state
                  ccClassKeys.forEach(ccClassKey => {
                    //  flag this ccClassKey been handled
                    ccClassKey_isHandled_[ccClassKey] = true;

                    const classContext = ccClassKey_ccClassContext_[ccClassKey];
                    const { ccKeys, sharedStateKeys, globalStateKeys } = classContext;
                    if (ccKeys.length === 0) return;
                    if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return;

                    //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!
                    const {
                      partialState: sharedStateForCurrentCcClass, isStateEmpty: isSharedStateEmpty
                    } = extractStateByKeys(_partialSharedState, sharedStateKeys, true);

                    //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                    //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                    //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                    //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass
                    const {
                      partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                    } = extractStateByKeys(partialGlobalState, globalStateKeys, true);
                    if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;

                    let mergedStateForCurrentCcClass = Object.assign({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);
                    ccKeys.forEach(ccKey => {
                      if (ccKey === currentCcKey && ignoreCurrentCcKey) return;

                      const ref = ccKey_ref_[ccKey];
                      if (ref) {
                        const option = ccKey_option_[ccKey];
                        let toSet = null, changedBy = -1;
                        if (option.syncSharedState && option.syncGlobalState) {
                          changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE;
                          toSet = mergedStateForCurrentCcClass;
                        } else if (option.syncSharedState) {
                          changedBy = CHANGE_BY_BROADCASTED_SHARED_STATE;
                          toSet = sharedStateForCurrentCcClass;
                        } else if (option.syncGlobalState) {
                          changedBy = CHANGE_BY_BROADCASTED_GLOBAL_STATE;
                          toSet = globalStateForCurrentCcClass;
                        }

                        if (toSet) {
                          if (ccContext.isDebug) {
                            console.log(ss(`ref ${ccKey} to be rendered state(changedBy ${changedBy}) is broadcast from same module's other ref ${currentCcKey}`), cl());
                          }
                          ref.cc.prepareReactSetState(identity, changedBy, toSet, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY)
                        };
                      }
                    });

                  });
                }

                if (util.isObjectNotNull(module_globalState_)) {
                  const moduleNames = Object.keys(module_globalState_);
                  moduleNames.forEach(mName => {
                    const partialGlobalState = module_globalState_[mName];
                    const ccClassKeys = moduleName_ccClassKeys_[mName];
                    ccClassKeys.forEach(ccClassKey => {
                      const classContext = ccClassKey_ccClassContext_[ccClassKey];
                      const { ccKeys, globalStateKeys } = classContext;

                      if (ccKeys.length === 0) return;
                      if (globalStateKeys.length === 0) return;
                      const {
                        partialState: globalStateForCurrentCcClass, isStateEmpty: isPartialGlobalStateEmpty
                      } = extractStateByKeys(partialGlobalState, globalStateKeys);

                      if (isPartialGlobalStateEmpty) return;

                      ccKeys.forEach(ccKey => {
                        const ref = ccKey_ref_[ccKey];
                        if (ref) {
                          const option = ccKey_option_[ccKey];
                          if (option.syncGlobalState) {
                            if (ccContext.isDebug) {
                              console.log(ss(`ref ${ccKey} to be rendered state(only global state) is broadcast from other module ${moduleName}`), cl());
                            }
                            ref.cc.prepareReactSetState(identity, CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE, globalStateForCurrentCcClass, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY)
                          }
                        }
                      });

                    });
                  });
                }
              }

              //!!! 注意，这里要把global提出来播，例如一个属于$$default模块的实例提交得有$$global模块的数据，是需要被播出去的
              const {
                partialState: toToBroadcastGlobalState, isStateEmpty: isEmptyG
              } = extractStateByKeys(originalState, ccContext.globalStateKeys);
              if (!isEmptyG) {
                broadcastConnectedState(MODULE_GLOBAL, toToBroadcastGlobalState);
              }

              broadcastConnectedState(moduleName, originalState);
            },
            broadcastGlobalState: (identity, globalSate) => {
              globalCcClassKeys.forEach(ccClassKey => {
                const classContext = ccClassKey_ccClassContext_[ccClassKey];
                const { globalStateKeys, ccKeys } = classContext;
                const { partialState, isStateEmpty } = extractStateByKeys(globalSate, globalStateKeys);
                if (!isStateEmpty) {
                  ccKeys.forEach(ccKey => {
                    const ref = ccKey_ref_[ccKey];
                    if (ref) {
                      const option = ccKey_option_[ccKey];
                      if (option.syncGlobalState === true) {
                        ref.cc.prepareReactSetState(identity, CHANGE_BY_BROADCASTED_GLOBAL_STATE, partialState, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                      }
                    }
                  });
                }
              });
              broadcastConnectedState(MODULE_GLOBAL, globalSate);
            },

            emit: (event, ...args) => {
              ev.findEventHandlersToPerform(event, { identity: null }, ...args);
            },
            emitIdentity: (event, identity, ...args) => {
              ev.findEventHandlersToPerform(event, { identity }, ...args);
            },
            emitWith: (event, option, ...args) => {
              ev.findEventHandlersToPerform(event, option, ...args);
            },
            on: (event, handler) => {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler)
            },
            onIdentity: (event, identity, handler) => {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler)
            },
            off: (event, { module, ccClassKey, identity } = {}) => {
              //  consider if module === currentModule, let off happened?
              ev.findEventHandlersToOff(event, { module, ccClassKey, identity })
            },
          }

          const thisCC = this.cc;
          // when call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY
          const d = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey);
          const di = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey, ccKey);//ccKey is identity by default
          this.$$d = d;
          this.$$di = di;
          this.$$dispatch = d;
          this.$$dispatchIdentity = di;
          this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1, ccKey);

          this.$$invoke = this.__$$getInvokeHandler();
          this.$$xinvoke = this.__$$getXInvokeHandler();
          this.$$effect = this.__$$getEffectHandler(ccKey);
          this.$$xeffect = this.__$$getXEffectHandler(ccKey);

          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;

          this.$$moduleComputed = thisCC.moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = thisCC.globalComputed = _computedValue[MODULE_GLOBAL] || {};
          this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;

          this.$$forceSyncState = thisCC.forceSyncState;// add$$ prefix, to let user it is cc api
          this.setState = thisCC.setState;//let setState call cc.setState
          this.setGlobalState = thisCC.setGlobalState;//let setState call cc.setState
          this.forceUpdate = thisCC.forceUpdate;//let forceUpdate call cc.forceUpdate
        }

        // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
        // so make sure you know what you want, and you don't need call this method most of the time,
        // -------------------------------------------------------------------------------------------------------------------------
        // note!!! changeState do two thing, decide if it will change self's state or not, if it will broadcast state or not;
        // when ccIns's module != target module,
        //        cc will only broadcast the state to target module, and be careful: it will overwrite the target module's state!!
        // when ccIns's module == target module,
        //        if ccIns option.syncSharedState is false, cc only change it's own state, no broadcast operation happen.
        //           but if you pass forceSync=true, cc will also broadcast the state to target module, 
        //           and be careful: cc will clone this piece of state before broadcasting, so it will overwrite the target module's state !!!
        //        if ccIns option.syncSharedState is true, change it's own state and broadcast the state to target module
        $$changeState(state, {
          ccKey, stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, broadcastTriggeredBy, changedBy,
          forceSync, cb: reactCallback, type, reducerModule, calledBy, fnName, delay = -1, identity } = {}
        ) {//executionContext
          if (state == undefined) return;//do nothing

          if (!isPlainJsonObject(state)) {
            justWarning(`cc found your commit state is not a plain json object!`);
          }

          const _doChangeState = () => {
            if (module == MODULE_GLOBAL) {
              this.cc.prepareBroadcastGlobalState(identity, broadcastTriggeredBy, state, delay);
            } else {
              const ccState = this.cc.ccState;
              const currentModule = ccState.module;
              const btb = broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;
              if (module === currentModule) {
                // who trigger $$changeState, who will change the whole received state 
                this.cc.prepareReactSetState(identity, changedBy || CHANGE_BY_SELF, state, stateFor, () => {
                  //if forceSync=true, cc clone the input state
                  if (forceSync === true) {
                    this.cc.prepareBroadcastState(stateFor, btb, module, state, true, delay, identity);
                  } else if (ccState.ccOption.syncSharedState) {
                    this.cc.prepareBroadcastState(stateFor, btb, module, state, false, delay, identity);
                  } else {
                    // stop broadcast state!
                  }
                }, reactCallback);
              } else {
                if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
                if (reactCallback) justWarning(`callback for react.setState will be ignore`);
                //触发修改转态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是是OF_ONE_MODULE
                this.cc.prepareBroadcastState(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, btb, module, state, true, delay, identity);
              }
            }
          }

          const middlewaresLen = middlewares.length;
          if (middlewaresLen > 0) {
            const passToMiddleware = { ccKey, state, stateFor, module, type, reducerModule, broadcastTriggeredBy, changedBy, forceSync, calledBy, fnName };
            let index = 0;
            const next = () => {
              if (index === middlewaresLen) {// all middlewares been executed
                _doChangeState();
              } else {
                const middlewareFn = middlewares[index];
                index++;
                middlewareFn(passToMiddleware, next);
              }
            }
            next();
          } else {
            _doChangeState();
          }
        }
        //executionContext: { module:string, forceSync:boolean, cb }
        __$$getChangeStateHandler(executionContext) {
          return (state) => this.$$changeState(state, executionContext)
        }

        __$$getInvokeHandler() {
          return this.__$$makeInvokeHandler(false, 'invoke');
        }
        __$$getXInvokeHandler() {
          return this.__$$makeInvokeHandler(true, 'xinvoke');
        }
        __$$makeInvokeHandler(giveContextToUserLoginFn = false, methodName) {
          return (firstParam, ...args) => {
            const firstParamType = typeof firstParam;
            const err = new Error(`param type error, correct usage: ${methodName}(userFn:function, ...args:any[]) or ${methodName}(option:{fn:function, delay:number, identity:string}, ...args:any[])`);
            if (firstParamType === 'function') {
              return this.cc.__invoke(firstParam, { context: giveContextToUserLoginFn, methodName }, ...args);
            } else if (firstParamType === 'object') {
              // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
              const fn = firstParam.fn;
              delete firstParam.fn;
              const option = firstParam;
              if (typeof fn != 'function') {
                throw err;
              }
              option.context = giveContextToUserLoginFn;
              option.methodName = methodName;
              return this.cc.__invoke(fn, option, ...args)
            } else {
              throw err;
            }
            // return ()=>{}
          }
        }
        __$$getEffectHandler(ccKey) {
          return this.__$$makeEffectHandler(ccKey, false, 'effect');
        }
        __$$getXEffectHandler(ccKey) {
          return this.__$$makeEffectHandler(ccKey, true, 'xeffect');
        }
        __$$makeEffectHandler(ccKey, giveContextToUserLoginFn = false, methodName) {
          return (firstParam, userLogicFn, ...args) => {
            const firstParamType = typeof firstParam;
            if (firstParamType === 'string') {
              return this.cc.__effect(firstParam, userLogicFn, { context: giveContextToUserLoginFn, ccKey, methodName }, ...args)
            } else if (firstParamType === 'object') {
              const { module, delay = -1, identity } = firstParam;
              const option = { module, delay, identity, context: giveContextToUserLoginFn, methodName }
              return this.cc.__effect(module, userLogicFn, option, ...args)
            } else {
              throw new Error(`param type error, correct usage: ${methodName}(module:string, ...args:any[]) or ${methodName}(option:{module:string, delay:number, identity:string}, ...args:any[])`);
            }
          }
        }
        __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload, delay = -1, ccKey, defaultIdentity = '') {
          return (paramObj = {}, payloadWhenFirstParamIsString, userInputIdentity) => {
            const paramObjType = typeof paramObj;
            let _module = originalComputedStateModule, _reducerModule, _forceSync = false, _type, _payload = inputPayload, _cb, _delay = delay;
            let _identity = defaultIdentity;
            if (paramObjType === 'object') {
              const { module = originalComputedStateModule, reducerModule, forceSync = false,
                type = inputType, payload = inputPayload, cb, delay = -1, identity
              } = paramObj;
              _module = module;
              _reducerModule = reducerModule || module;
              _forceSync = forceSync;
              _type = type;
              _payload = payload;
              _cb = cb;
              _delay = delay;

              if (identity) _identity = identity;

            } else if (paramObjType === 'string') {
              const slashCount = paramObj.split('').filter(v => v === '/').length;
              _payload = payloadWhenFirstParamIsString;
              if (userInputIdentity) _identity = userInputIdentity;

              if (slashCount === 0) {
                _type = paramObj;
              } else if (slashCount === 1) {
                const [module, type] = paramObj.split('/');
                _module = module;
                _reducerModule = _module;
                _type = type;
              } else if (slashCount === 2) {
                const [module, reducerModule, type] = paramObj.split('/');
                if (module === '' || module === ' ') _module = originalComputedStateModule;//paramObj may like: /foo/changeName
                else _module = module;
                _module = module;
                _reducerModule = reducerModule;
                _type = type;
              } else {
                return Promise.reject(me(ERR.CC_DISPATCH_STRING_INVALID, vbi(paramObj)));
              }
            } else {
              return Promise.reject(me(ERR.CC_DISPATCH_PARAM_INVALID));
            }

            if (_module === '*') {
              return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
            }

            // pick user input reducerModule firstly
            let targetReducerModule = _reducerModule || (originalComputedReducerModule || module);
            return new Promise((resolve, reject) => {
              this.cc.dispatch(
                {
                  stateFor, module: _module, reducerModule: targetReducerModule, forceSync: _forceSync, type: _type, payload: _payload,
                  cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject), delay: _delay, ccKey, identity: _identity
                });
            }).catch(catchCcError);
          }
        }
        __$$getSyncHandler(stateFor) {
          return (e) => this.$$sync(e, stateFor);
        }

        $$domDispatch(event) {
          const currentTarget = event.currentTarget;
          const { value, dataset } = currentTarget;
          const { cct: type, ccm: module, ccrm: reducerModule, ccdelay = -1, ccidt = '' } = dataset;
          const payload = { event, dataset, value };
          const ccKey = this.cc.ccKey;
          const handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccKey, ccidt);
          handler().catch(handleCcFnError);
        }

        // when CCSYNC_KEY:   stateFor=ccint, seat1=ccdelay, seat2=ccidt, seat3=stateFor
        $$sync(event, stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, seat1, seat2, seat3, seat4) {
          if (typeof event === 'string') {
            const ccint = stateFor === true || stateFor === 'true';
            const syncFn = this.$$sync.bind(this, { [CCSYNC_KEY]: event }, ccint, seat1, seat2, STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
            return syncFn;
          }

          let targetE = event, targetStateFor = stateFor;
          if (event[CCSYNC_KEY] != undefined) {
            const ccsync = event[CCSYNC_KEY];
            const ccint = stateFor;
            const ccdelay = seat1;
            const ccidt = seat2;
            targetStateFor = seat3;
            let value = seat4;
            //此时的value就是event
            if (typeof value === 'object' && value.currentTarget !== undefined) {
              //a real event
              value = value.currentTarget.value;
            }
            targetE = { currentTarget: { value, dataset: { ccsync, ccint, ccdelay, ccidt } } };
          }
          if (event.stopPropagation) event.stopPropagation();

          const currentModule = this.cc.ccState.module;
          let _module = currentModule, _delay = -1, _identity = '';
          const currentTarget = targetE.currentTarget;
          let { value, dataset } = currentTarget;
          const { ccdelay, ccidt = '', ccint, ccsync } = dataset;

          if (!ccsync) {
            return justWarning(`data-ccsync attr no found, you must define it while using this.$$sync`);
          }

          if (ccsync.includes('/')) {
            _module = ccsync.split('/')[0];
          }

          const fullState = _module !== currentModule ? getState(_module) : this.state;
          const { state } = extractStateByCcsync(ccsync, value, ccint, fullState);

          if (ccdelay) {
            try { _delay = parseInt(ccdelay); } catch (err) { }
          }
          if (ccidt) _identity = ccidt;

          this.$$changeState(state, { ccKey: this.cc.ccKey, stateFor: targetStateFor, module: _module, delay: _delay, identity: _identity });
        }

        componentDidUpdate() {
          if (super.componentDidUpdate) super.componentDidUpdate()
          if (this.$$afterSetState) this.$$afterSetState();
        }

        componentWillUnmount() {
          const { ccUniqueKey, ccClassKey } = this.cc.ccState;
          ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
          unsetRef(ccClassKey, ccUniqueKey);
          //if father component implement componentWillUnmount，call it again
          if (super.componentWillUnmount) super.componentWillUnmount();
        }

        render() {
          if (ccContext.isDebug) {
            console.log(ss(`@@@ render ${ccClassDisplayName(ccClassKey)}`), cl());
          }
          if (extendInputClass) {
            //now cc class extends ReactClass, call super.render()
            return super.render();
          } else {
            // now cc class extends ReactComponent, render user inputted ReactClass
            const props = Object.assign(this, this.props);
            return React.createElement(ReactClass, props);
          }
        }
      }

      if (ccClassKey === CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';
      else CcClass.displayName = ccClassDisplayName(ccClassKey);
      return CcClass;
    }
  } catch (err) {
    catchCcError(err);
  }
}
