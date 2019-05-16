
import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, MODULE_GLOBAL, ERR, CC_FRAGMENT_PREFIX, CC_DISPATCHER,
  CHANGE_BY_SELF,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_FROM_OTHER_MODULE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE,
  CHANGE_BY_BROADCASTED_SHARED_STATE,
  CHANGE_BY_BROADCASTED_GLOBAL_STATE_AND_SHARED_STATE,

  BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE,
  BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD,
  STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
  STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import util, { isPlainJsonObject, makeHandlerKey } from '../../support/util';
import co from 'co';
import extractStateByKeys from './extract-state-by-keys';
import setPropState from './set-prop-state';
import buildCcClassContext from './build-cc-class-context';
import catchCcError from './catch-cc-error';
import mapModuleAndCcClassKeys from './map-module-and-cc-class-keys';
import unsetRef from './unset-ref';
import setRef from './set-ref';
import runLater from './run-later';
import getAndStoreValidGlobalState from './get-and-store-valid-global-state';
import computeCcUniqueKey from './compute-cc-unique-key';

const { verifyKeys, ccClassDisplayName, styleStr, color, verboseInfo, makeError, justWarning, throwCcHmrError } = util;
const {
  store: { _state, getState, setState: ccStoreSetState, setStateByModuleAndKey },
  reducer: { _reducer }, refStore, globalMappingKey_sharedKey_,
  computed: { _computedValue }, event_handlers_, handlerKey_handler_, ccUniqueKey_handlerKeys_,
  propModuleName_ccClassKeys_, moduleName_sharedStateKeys_, moduleName_globalStateKeys_,
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
const EFFECT = 'effect';
const XEFFECT = 'xeffect';
const INVOKE = 'invoke';
const INVOKE_WITH = 'invokeWith';
const CALL = 'call';
const CALL_WITH = 'callWith';
const CALL_THUNK = 'callThunk';
const CALL_THUNK_WITH = 'callThunkWith';
const COMMIT = 'commit';
const COMMIT_WITH = 'commitWith';

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
  if (!ccContext.isModuleMode) {
    if (module !== MODULE_DEFAULT) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, vbi(`module:${module}`)), throwError);
      return false;
    } else return true;
  } else {
    if (checkGlobalModule && module === MODULE_GLOBAL) {
      handleError(me(ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
      return false;
    }

    if (!_state[module]) {
      handleError(me(ERR.CC_CLASS_STORE_MODULE_INVALID, vbi(`module:${module} is not configured in cc's store`)), throwError);
      return false;
    } else return true;
  }
}

function checkReducerModule(reducerModule, throwError = true) {
  if (!ccContext.isModuleMode) {
    if (reducerModule != MODULE_DEFAULT) {
      handleError(me(ERR.CC_REGISTER_A_MODULE_CLASS_IN_NONE_MODULE_MODE, `reducerModule:${reducerModule}`), throwError);
    }
  } else {
    //this check can be optional?? if user don't configure a reducer for a module, may be he really don't want to use dispatch
    // if (!_reducer[reducerModule]) {
    //   handleError(me(ERR.CC_CLASS_REDUCER_MODULE_INVALID, `reducerModule:${reducerModule}`), throwError);
    // }
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
  sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
  let fragmentPrefixLen = CC_FRAGMENT_PREFIX.length;
  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === CC_FRAGMENT_PREFIX) {
    throw me(ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }

  const contextMap = ccContext.ccClassKey_ccClassContext_;
  const ct = contextMap[ccClassKey];
  if (ct !== undefined) {// analyze is ccClassKey really duplicated
    if (util.isHotReloadMode()) {
      const str1 = ct.originalGlobalStateKeys.toString() + ct.originalSharedStateKeys.toString() + JSON.stringify(ct.stateToPropMapping);
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
    sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode);
}

/****
 * it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
 * 
 * if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
 * then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
 * usually ccInstance's $$commit, $$call, $$callThunk, $$invoke, $$dispatch method will trigger this extraction strategy
 * ------------------------------------------------------------------------------------------------------------------------
 * if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
 * then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
 * usually ccInstance's $$commitWith, $$callWith, $$callThunkWith, $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
 * will trigger this extraction strategy
 */
function getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, ccClassGlobalStateKeys, ccClassSharedStateKeys) {
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
function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode) {
  if (extendInputClass === false) {
    if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
      //??? maybe can use this.props.state?
      _throwForExtendInputClassAsFalseCheck(ccClassKey);
    }
  }

  const { sharedStateKeys: targetSharedStateKeys, globalStateKeys: targetGlobalStateKeys } =
    getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys);

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, stateToPropMapping, isPropStateModuleMode)
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
  if (refWatchFn) {
    const refWatch = refWatchFn();
    const watchStateKeys = Object.keys(refWatch);
    watchStateKeys.forEach(key => {
      const commitValue = userCommitState[key];
      if (commitValue !== undefined) {
        const watchFn = refWatch[key];
        watchFn(commitValue, refEntireState[key]);// watchFn(newValue, oldValue);
      }
    });
  }
}

function bindEventHandlerToCcContext(module, ccClassKey, ccUniqueKey, event, identity, handler) {
  const handlers = util.safeGetArrayFromObject(event_handlers_, event);
  if (typeof handler !== 'function') {
    return justWarning(`event ${event}'s handler is not a function!`);
  }
  const targetHandlerIndex = handlers.findIndex(v => v.ccUniqueKey === ccUniqueKey && v.identity === identity);
  const handlerKeys = util.safeGetArrayFromObject(ccUniqueKey_handlerKeys_, ccUniqueKey);
  const handlerKey = makeHandlerKey(ccUniqueKey, event, identity);
  //  that means the component of ccUniqueKey mounted again 
  //  or user call $$on for a same event in a same instance more than once
  const handlerItem = { event, module, ccClassKey, ccUniqueKey, identity, handlerKey, fn: handler };
  if (targetHandlerIndex > -1) {
    //  cc will alway use the latest handler
    handlers[targetHandlerIndex] = handlerItem;
  } else {
    handlers.push(handlerItem);
    handlerKeys.push(handlerKey);
  }
  handlerKey_handler_[handlerKey] = handlerItem;
}

function _findEventHandlers(event, module, ccClassKey, identity = null) {
  const handlers = event_handlers_[event];
  if (handlers) {
    let filteredHandlers;

    if (ccClassKey) filteredHandlers = handlers.filter(v => v.ccClassKey === ccClassKey);
    else if (module) filteredHandlers = handlers.filter(v => v.module === module);
    else filteredHandlers = handlers;

    // identity is null means user call emit or emitIdentity which set identity as null
    // identity is not null means user call emitIdentity
    filteredHandlers = filteredHandlers.filter(v => v.identity === identity);
    return filteredHandlers;
  } else {
    return [];
  }
}

function findEventHandlersToPerform(event, { module, ccClassKey, identity }, ...args) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
  handlers.forEach(({ ccUniqueKey, handlerKey }) => {
    if (ccKey_ref_[ccUniqueKey] && handlerKey) {//  confirm the instance is mounted and handler is not been offed
      const handler = handlerKey_handler_[handlerKey];
      if (handler) handler.fn(...args);
    }
  });
}

function findEventHandlersToOff(event, { module, ccClassKey, identity }) {
  const handlers = _findEventHandlers(event, module, ccClassKey, identity);
  deleteHandlers(handlers);
}

function deleteHandlers(handlers) {
  const toDeleteHandlerKeyMap = {};
  const toDeleteCcUniqueKeyMap = {};
  const toDeleteEventNames = [];
  handlers.forEach(item => {
    const { handlerKey, ccUniqueKey, event } = item;
    delete handlerKey_handler_[handlerKey];//delete mapping of handlerKey_handler_;
    toDeleteHandlerKeyMap[handlerKey] = 1;
    toDeleteCcUniqueKeyMap[ccUniqueKey] = 1;
    if (!toDeleteEventNames.includes(event)) toDeleteEventNames.push(event);
  });

  toDeleteEventNames.forEach(event => {
    const eHandlers = event_handlers_[event];
    if (eHandlers) {
      eHandlers.forEach((h, idx) => {
        const { ccUniqueKey } = h;
        if (toDeleteCcUniqueKeyMap[ccUniqueKey] === 1) {
          eHandlers[idx] = null;
          delete ccUniqueKey_handlerKeys_[ccUniqueKey];//delete mapping of ccUniqueKey_handlerKeys_;
        }
      });
      event_handlers_[event] = eHandlers.filter(v => v !== null);//delete event_handlers_
    }
  });
}

function offEventHandlersByCcUniqueKey(ccUniqueKey) {
  const handlerKeys = ccUniqueKey_handlerKeys_[ccUniqueKey];
  if (handlerKeys) {
    const toDeleteHandlers = [];
    handlerKeys.forEach(k => toDeleteHandlers.push(handlerKey_handler_[k]));
    deleteHandlers(toDeleteHandlers);
  }
}

function updateModulePropState(module_isPropStateChanged, noRenderCcUniKeyMap, changedPropStateList, targetClassContext, state, stateModuleName) {
  const { stateToPropMapping, stateKey_propKeyDescriptor_, propState, isPropStateModuleMode, ccClassKey, ccKeys } = targetClassContext;
  if (stateToPropMapping) {
    Object.keys(state).forEach(sKey => {// sKey mean user commit state's key, it equal propKey, so it may be an alias
      // use input stateModuleName to compute moduledStateKey for current stateKey
      // to see if the propState should be updated
      const moduledStateKey = `${stateModuleName}/${sKey}`;
      const moduledPropKeyDescriptor = stateKey_propKeyDescriptor_[moduledStateKey];
      if (moduledPropKeyDescriptor) {
        const { derivedPropKey } = moduledPropKeyDescriptor;

        if (module_isPropStateChanged[stateModuleName] !== true) {//mark propState changed
          module_isPropStateChanged[stateModuleName] = true;
          changedPropStateList.push(propState);// push this ref to changedPropStateList
        }

        const stateValue = state[sKey];
        setPropState(propState, derivedPropKey, stateValue, isPropStateModuleMode, stateModuleName);

        // setStateByModuleAndKey(stateModuleName, sKey, stateValue);//!!! this is unnecessary operation, and also will call redundant compute fn call
      } else {
        if (ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
          noRenderCcUniKeyMap[ccKeys[0]] = 1;// every ccFragment class only have one ins
        } else {
          //todo
        }
      }
    });
  }
}

function broadcastPropState(module, commitState) {
  const changedPropStateList = [];
  const module_isPropStateChanged = {};// record which module's propState has been changed
  const noRenderCcUniKeyMap = {};//these ccUniKeys ins will not been trigger to render

  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  Object.keys(moduleName_ccClassKeys_).forEach(moduleName => {
    const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);
    ccClassKeys.forEach(ccClassKey => {
      const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateModulePropState(module_isPropStateChanged, noRenderCcUniKeyMap, changedPropStateList, ccClassContext, commitState, module);
    });
  });

  Object.keys(module_isPropStateChanged).forEach(module => {
    //  this module has stateToPropMapping and propState has been changed!!!
    const ccClassKeys = util.safeGetArrayFromObject(propModuleName_ccClassKeys_, module);
    ccClassKeys.forEach(ccClassKey => {
      const classContext = ccClassKey_ccClassContext_[ccClassKey];
      const { ccKeys } = classContext;
      ccKeys.forEach(ccKey => {
        if (noRenderCcUniKeyMap[ccKey] === 1) return;
        const ref = ccKey_ref_[ccKey];
        if (ref) {
          ref.cc.reactForceUpdate();
        }
      });
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

export default function register(ccClassKey, {
  module = MODULE_DEFAULT,
  sharedStateKeys: inputSharedStateKeys = [],
  globalStateKeys: inputGlobalStateKeys = [],
  stateToPropMapping = null,
  isPropStateModuleMode = false,
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
    checkReducerModule(_reducerModule);

    const { sharedStateKeys: sKeys, globalStateKeys: gKeys } =
      mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, stateToPropMapping, isPropStateModuleMode);
    const sharedStateKeys = sKeys, globalStateKeys = gKeys;

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

            util.bindThis(this, [
              '__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync',
              '__$$getChangeStateHandler', '__$$getEffectHandler', '__$$getLazyEffectHandler', '__$$getXEffectHandler',
              '__$$getLazyXEffectHandler', '__$$getDispatchHandler',
              '__$$getEffectIdentityHandler', '__$$getXEffectIdentityHandler',
            ]);
            if (!ccOption.storedStateKeys) ccOption.storedStateKeys = [];

            // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing
            if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true;
            // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing
            if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;

            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            const { asyncLifecycleHook, storedStateKeys } = ccOption;

            const { ccKey: newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated } = computeCcUniqueKey(isSingle, ccClassKey, ccKey);
            const ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            setRef(this, isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption);
            this.__$$mapCcToInstance(
              isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
              ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys
            );
            // bind propState to $$propState
            this.$$propState = ccClassContext.propState || {};

            this.__$$recoverState(ccClassKey);
          } catch (err) {
            catchCcError(err);
          }
        }

        // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;
        shouldComponentUpdate(nextProps, nextState) {
          return this.state !== nextState;
        }

        __$$recoverState() {
          const { module: currentModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey } = this.cc.ccState;
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
          computeValueForRef(this.$$computed, this.$$refComputed, entireState, entireState);
        }

        __$$mapCcToInstance(
          isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
          ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys
        ) {
          const reactSetStateRef = this.setState.bind(this);
          const reactForceUpdateRef = this.forceUpdate.bind(this);
          const ccState = {
            renderCount: 1, isSingle, asyncLifecycleHook, ccClassKey, ccKey, originalCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys,
            ccOption, ccClassContext, module: currentModule, reducerModule: currentReducerModule, sharedStateKeys, globalStateKeys
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
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: (state, cb) => {
              ccState.renderCount += 1;
              reactForceUpdateRef(state, cb);
            },
            setState: (state, cb, lazyMs = -1) => {
              this.$$changeState(state, { ccKey, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, lazyMs });
            },
            forceSyncState: (state, cb, lazyMs = -1) => {
              this.$$changeState(state, { forceSync: true, ccKey, module: currentModule, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cb, calledBy: SET_STATE, lazyMs });
            },
            setGlobalState: (partialGlobalState, lazyMs = -1, broadcastTriggeredBy = BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE) => {
              this.$$changeState(partialGlobalState, { ccKey, module: MODULE_GLOBAL, broadcastTriggeredBy, calledBy: SET_GLOBAL_STATE, lazyMs });
            },
            forceUpdate: (cb, lazyMs) => {
              this.$$changeState(this.state, { ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, cb, calledBy: FORCE_UPDATE, lazyMs });
            },
            effect: (targetModule, userLogicFn, ...args) => {
              return this.cc.__effect(targetModule, userLogicFn, { ccKey }, -1, ...args);
            },
            lazyEffect: (targetModule, userLogicFn, lazyMs, ...args) => {
              return this.cc.__effect(targetModule, userLogicFn, { ccKey }, lazyMs, ...args);
            },
            // change other module's state, mostly you should use this method to generate new state instead of xeffect,
            // because xeffect will force your logicFn to put your first param as ExecutionContext
            __effect: (targetModule, userLogicFn, extra, lazyMs, ...args) => {
              const { ccKey, identity } = extra;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, context: false, module: targetModule,
                calledBy: EFFECT, fnName: userLogicFn.name, lazyMs, identity
              }, ...args);
            },
            // change other module's state, cc will give userLogicFn EffectContext object as first param
            xeffect: (targetModule, userLogicFn, ...args) => {
              this.cc.__xeffect(targetModule, userLogicFn, { ccKey }, -1, ...args);
            },
            lazyXeffect: (targetModule, userLogicFn, lazyMs, ...args) => {
              this.cc.__xeffect(targetModule, userLogicFn, { ccKey }, lazyMs, ...args);
            },
            // change other module's state, cc will give userLogicFn EffectContext object as first param
            __xeffect: (targetModule, userLogicFn, extra, lazyMs, ...args) => {
              const { ccKey } = extra;
              const thisCC = this.cc;
              return thisCC.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, lazyMs,
                context: true, module: targetModule, calledBy: XEFFECT, fnName: userLogicFn.name
              }, ...args);
            },
            __promisifiedInvokeWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__invokeWith, userLogicFn, executionContext, ...args);
            },
            // always change self module's state
            invoke: (userLogicFn, ...args) => {
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, calledBy: INVOKE, fnName: userLogicFn.name
              }, ...args);
            },
            xinvoke: (userLogicFn, ...args) => {
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                context: true, ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, calledBy: INVOKE, fnName: userLogicFn.name
              }, ...args);
            },
            // advanced invoke, can change other module state, but user should put module to option
            // and user can decide userLogicFn's first param is ExecutionContext if set context as true
            invokeWith: (userLogicFn, option, ...args) => {
              const { module = currentModule, context = false, forceSync = false, cb, lazyMs } = option;
              return this.cc.__promisifiedInvokeWith(userLogicFn, {
                ccKey, stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module,
                context, forceSync, cb, calledBy: INVOKE_WITH, fnName: userLogicFn.name, lazyMs
              }, ...args);
            },
            __invokeWith: (userLogicFn, executionContext, ...args) => {
              const {
                ccKey, stateFor, module: targetModule = currentModule, context = false, forceSync = false,
                cb, __innerCb, type, reducerModule, calledBy, fnName, lazyMs = -1, identity
              } = executionContext;
              isStateModuleValid(targetModule, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                if (context) {
                  const executionContextForUser = Object.assign(
                    executionContext, {
                      effectIdentity: this.__$$getEffectIdentityHandler(ccKey), xeffectIdentity: this.__$$getXEffectIdentityHandler(ccKey),
                      effect: this.__$$getEffectHandler(ccKey), lazyEffect: this.__$$getLazyEffectHandler(ccKey),
                      xeffect: this.__$$getXEffectHandler(ccKey), lazyXeffect: this.__$$getLazyXEffectHandler(ccKey),
                      moduleState: getState(targetModule), state: this.state, entireState: getState(), globalState: getState(MODULE_GLOBAL),
                      dispatch: this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, lazyMs, ccKey),
                      dispatchIdentity: this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, lazyMs, ccKey, identity)
                    });
                  args.unshift(executionContextForUser);
                }

                let _partialState = null;
                co.wrap(userLogicFn)(...args).then(partialState => {
                  _partialState = partialState;
                  this.$$changeState(partialState, {
                    identity, ccKey, stateFor, module: targetModule, forceSync, cb: newCb, type,
                    reducerModule, changedBy: CHANGE_BY_SELF, calledBy, fnName, lazyMs
                  });
                }).then(() => {
                  if (__innerCb) __innerCb(null, _partialState);
                }).catch(err => {
                  handleCcFnError(err, __innerCb);
                });
              });
            },

            call: (userLogicFn, ...args) => {
              return this.cc.__promisifiedCallWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, calledBy: CALL, fnName: userLogicFn.name }, ...args);
            },
            callWith: (userLogicFn, { module = currentModule, forceSync = false, cb, lazyMs = -1 } = {}, ...args) => {
              return this.cc.__promisifiedCallWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb, calledBy: CALL_WITH, fnName: userLogicFn.name, lazyMs }, ...args);
            },
            __promisifiedCallWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__callWith, userLogicFn, executionContext, ...args);
            },
            __callWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
              isStateModuleValid(module, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                try {
                  userLogicFn.call(this, this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }), ...args);
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            },
            callThunk: (userLogicFn, ...args) => {
              this.cc.__promisifiedCallThunkWith(userLogicFn, {
                stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, calledBy: CALL_THUNK,
                fnName: userLogicFn.name
              }, ...args);
            },
            callThunkWith: (userLogicFn, { module = currentModule, forceSync = false, cb, lazyMs = -1 } = {}, ...args) => {
              this.cc.__promisifiedCallThunkWith(userLogicFn, {
                stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb, calledBy: CALL_THUNK_WITH,
                fnName: userLogicFn.name, lazyMs
              }, ...args);
            },
            __promisifiedCallThunkWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__callThunkWith, userLogicFn, executionContext, ...args);
            },
            __callThunkWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
              isStateModuleValid(module, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                try {
                  userLogicFn.call(this, ...args)(this.__$$getChangeStateHandler({ stateFor, module, forceSync, cb: newCb }));
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            },

            commit: (userLogicFn, ...args) => {
              this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: currentModule, calledBy: COMMIT, fnName: userLogicFn.name }, ...args);
            },
            commitWith: (userLogicFn, { module = currentModule, forceSync = false, cb, lazyMs } = {}, ...args) => {
              this.cc.__commitWith(userLogicFn, { stateFor: STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, module, forceSync, cb, calledBy: COMMIT_WITH, fnName: userLogicFn.name, lazyMs }, ...args);
            },
            __promisifiedCallWith: (userLogicFn, executionContext, ...args) => {
              return _promisifyCcFn(this.cc.__commitWith, userLogicFn, executionContext, ...args);
            },
            __commitWith: (userLogicFn, { stateFor, module = currentModule, forceSync = false, cb, __innerCb } = {}, ...args) => {
              isStateModuleValid(module, currentModule, cb, (err, newCb) => {
                if (err) return handleCcFnError(err, __innerCb);
                try {
                  const state = userLogicFn.call(this, ...args);
                  this.$$changeState(state, { stateFor, module, forceSync, cb: newCb });
                } catch (err) {
                  handleCcFnError(err, __innerCb);
                }
              });
            },

            dispatch: ({
              ccKey, stateFor, module: inputModule, reducerModule: inputReducerModule, identity,
              forceSync = false, type, payload, cb: reactCallback, __innerCb, lazyMs = -1 } = {}
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
                  payload, forceSync, cb: newCb, context: true, __innerCb, calledBy: DISPATCH, lazyMs, identity
                };
                this.cc.__invokeWith(reducerFn, executionContext);
              });
            },
            prepareReactSetState: (identity, changedBy, state, stateFor, next, reactCallback) => {
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

              if (!util.isObjectNotNull(state)) {
                if (next) next();
                return;
              } else {
                const thisState = this.state;
                computeValueForRef(this.$$computed, this.$$refComputed, thisState, state);
                watchValueForRef(this.$$watch, thisState, state);
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
            prepareBroadcastGlobalState: (identity, broadcastTriggeredBy, globalState, lazyMs) => {
              //!!! save global state to store
              const { partialState: validGlobalState, isStateEmpty } = getAndStoreValidGlobalState(globalState);
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

              if (lazyMs > 0) {
                const feature = util.computeFeature(ccUniqueKey, globalState);
                runLater(startBroadcastGlobalState, feature, lazyMs);
              } else {
                startBroadcastGlobalState();
              }
            },
            prepareBroadcastState: (stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, lazyMs, identity) => {
              let targetSharedStateKeys, targetGlobalStateKeys;
              try {
                const result = getSuitableGlobalStateKeysAndSharedStateKeys(stateFor, moduleName, globalStateKeys, sharedStateKeys);
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

              if (lazyMs > 0) {
                const feature = util.computeFeature(ccUniqueKey, committedState);
                runLater(startBroadcastState, feature, lazyMs);
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

              broadcastPropState(moduleName, originalState);
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
              broadcastPropState(MODULE_GLOBAL, globalSate);
            },

            emit: (event, ...args) => {
              findEventHandlersToPerform(event, { identity: null }, ...args);
            },
            emitIdentity: (event, identity, ...args) => {
              findEventHandlersToPerform(event, { identity }, ...args);
            },
            emitWith: (event, option, ...args) => {
              findEventHandlersToPerform(event, option, ...args);
            },
            on: (event, handler) => {
              bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler)
            },
            onIdentity: (event, identity, handler) => {
              bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler)
            },
            off: (event, { module, ccClassKey, identity } = {}) => {
              //  consider if module === currentModule, let off happened?
              findEventHandlersToOff(event, { module, ccClassKey, identity })
            },
          }

          const thisCC = this.cc;
          // let CcComponent instance can call dispatch directly
          // if you call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY
          const d = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey);
          const di = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey, ccKey);//ccKey is identity by default
          this.$$d = d;
          this.$$di = di;
          this.$$dispatch = d;
          this.$$dispatchIdentity = di;
          this.$$dispatchForModule = this.__$$getDispatchHandler(STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1, ccKey);

          this.$$invoke = thisCC.invoke;// commit state to cc directly, but userFn can be promise or generator both!
          this.$$xinvoke = thisCC.xinvoke;// commit state to cc directly, but userFn can be promise or generator both!
          this.$$invokeWith = thisCC.invokeWith;
          this.$$call = thisCC.call;// commit state by setState handler
          this.$$callWith = thisCC.callWith;
          this.$$callThunk = thisCC.callThunk;// commit state by setState handler
          this.$$callThunkWith = thisCC.callThunkWith;
          this.$$commit = thisCC.commit;// commit state to cc directly, userFn can only be normal function
          this.$$commitWith = thisCC.commitWith;
          this.$$effect = thisCC.effect;// commit state to cc directly, userFn can be normal 、 generator or async function
          this.$$lazyEffect = thisCC.lazyEffect;// commit state to cc directly, userFn can be normal 、 generator or async function
          this.$$xeffect = thisCC.xeffect;
          this.$$lazyXeffect = thisCC.lazyXeffect;

          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;

          this.$$refComputed = {};
          this.$$moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = _computedValue[MODULE_GLOBAL] || {};

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
          forceSync, cb: reactCallback, type, reducerModule, calledBy, fnName, lazyMs = -1, identity } = {}
        ) {//executionContext
          if (state == undefined) return;//do nothing

          if (!isPlainJsonObject(state)) {
            justWarning(`cc found your commit state is not a plain json object!`);
          }

          const _doChangeState = () => {
            if (module == MODULE_GLOBAL) {
              this.cc.prepareBroadcastGlobalState(identity, broadcastTriggeredBy, state, lazyMs);
            } else {
              const ccState = this.cc.ccState;
              const currentModule = ccState.module;
              const btb = broadcastTriggeredBy || BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;
              if (module === currentModule) {
                // who trigger $$changeState, who will change the whole received state 
                this.cc.prepareReactSetState(identity, changedBy || CHANGE_BY_SELF, state, stateFor, () => {
                  //if forceSync=true, cc clone the input state
                  if (forceSync === true) {
                    this.cc.prepareBroadcastState(stateFor, btb, module, state, true, lazyMs, identity);
                  } else if (ccState.ccOption.syncSharedState) {
                    this.cc.prepareBroadcastState(stateFor, btb, module, state, false, lazyMs, identity);
                  } else {
                    // stop broadcast state!
                  }
                }, reactCallback);
              } else {
                if (forceSync) justWarning(`you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!` + vbi(`module:${module} currentModule${currentModule}`));
                if (reactCallback) justWarning(`callback for react.setState will be ignore`);
                this.cc.prepareBroadcastState(stateFor, btb, module, state, true, lazyMs, identity);
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

        //{ module, forceSync, cb }
        __$$getChangeStateHandler(executionContext) {
          return (state) => this.$$changeState(state, executionContext)
        }
        __$$getEffectHandler(ccKey) {
          return (targetModule, userLogicFn, ...args) => this.cc.__effect(targetModule, userLogicFn, { ccKey }, -1, ...args)
        }
        __$$getEffectIdentityHandler(ccKey) {
          return (targetModule, identity, userLogicFn, ...args) => this.cc.__effect(targetModule, userLogicFn, { ccKey, identity }, -1, ...args)
        }
        __$$getLazyEffectHandler(ccKey) {
          return (targetModule, userLogicFn, lazyMs, ...args) => this.cc.__effect(targetModule, userLogicFn, { ccKey }, lazyMs, ...args)
        }
        __$$getXEffectHandler(ccKey) {
          return (targetModule, userLogicFn, ...args) => this.cc.__xeffect(targetModule, userLogicFn, { ccKey }, -1, ...args)
        }
        __$$getXEffectIdentityHandler(ccKey) {
          return (targetModule, identity, userLogicFn, ...args) => this.cc.__xeffect(targetModule, userLogicFn, { ccKey, identity }, -1, ...args)
        }
        __$$getLazyXEffectHandler(ccKey) {
          return (targetModule, userLogicFn, lazyMs, ...args) => this.cc.__xeffect(targetModule, userLogicFn, { ccKey }, lazyMs, ...args)
        }

        __$$getDispatchHandler(stateFor, originalComputedStateModule, originalComputedReducerModule, inputType, inputPayload, lazyMs = -1, ccKey, defaultIdentity = '') {
          return (paramObj = {}, payloadWhenFirstParamIsString, userInputIdentity) => {
            const paramObjType = typeof paramObj;
            let _module = originalComputedStateModule, _reducerModule, _forceSync = false, _type, _payload = inputPayload, _cb, _lazyMs = lazyMs;
            let _identity = defaultIdentity;
            if (paramObjType === 'object') {
              const { module = originalComputedStateModule, reducerModule, forceSync = false,
                type = inputType, payload = inputPayload, cb, lazyMs = -1, identity
              } = paramObj;
              _module = module;
              _reducerModule = reducerModule || module;
              _forceSync = forceSync;
              _type = type;
              _payload = payload;
              _cb = cb;
              _lazyMs = lazyMs;

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

            // pick user input reducerModule firstly
            let targetReducerModule = _reducerModule || (originalComputedReducerModule || module);
            return new Promise((resolve, reject) => {
              this.cc.dispatch(
                {
                  stateFor, module: _module, reducerModule: targetReducerModule, forceSync: _forceSync, type: _type, payload: _payload,
                  cb: _cb, __innerCb: _promiseErrorHandler(resolve, reject), lazyMs: _lazyMs, ccKey, identity: _identity
                });
            }).catch(catchCcError);
          }
        }

        $$domDispatch(event) {
          const currentTarget = event.currentTarget;
          const { value, dataset } = currentTarget;
          const { cct: type, ccm: module, ccrm: reducerModule, ccdelay = -1, ccidt = '' } = dataset;
          const payload = { event, dataset, value };
          const ccKey = this.cc.ccKey;
          const handler = this.__$$getDispatchHandler(STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccKey, ccidt);
          handler();
        }

        $$sync(event) {
          let _module = this.cc.ccState.module, _lazyMs = -1, _identity = '';
          const currentTarget = event.currentTarget;
          let { value, dataset } = currentTarget;
          const { ccm, ccdelay, ccidt = '', ccint, ccsync: stateKey } = dataset;
          if (!stateKey) {
            return justWarning(`data-ccsync attr no found, you must define it while using this.$$sync`);
          }
          if (ccm) _module = ccm;
          if (ccdelay) {
            try {
              _lazyMs = parseInt(ccdelay);
            } catch (err) { }
          }
          if (ccidt) _identity = ccidt;
          if (ccint !== undefined) {
            try {
              value = parseInt(value);
            } catch (err) { }
          }

          this.$$changeState({ [stateKey]: value }, { ccKey: this.cc.ccKey, stateFor: STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module: _module, lazyMs: _lazyMs, identity: _identity });
        }

        componentDidUpdate() {
          if (super.componentDidUpdate) super.componentDidUpdate()
          if (this.$$afterSetState) this.$$afterSetState();
        }

        componentWillUnmount() {
          const { ccUniqueKey, ccClassKey } = this.cc.ccState;
          offEventHandlersByCcUniqueKey(ccUniqueKey);
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
