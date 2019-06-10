"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = register;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _react = _interopRequireDefault(require("react"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _util = _interopRequireWildcard(require("../../support/util"));

var _co = _interopRequireDefault(require("co"));

var _extractStateByKeys12 = _interopRequireDefault(require("../state/extract-state-by-keys"));

var _setConnectedState = _interopRequireDefault(require("../state/set-connected-state"));

var _buildCcClassContext = _interopRequireDefault(require("./build-cc-class-context"));

var _catchCcError = _interopRequireDefault(require("./catch-cc-error"));

var _mapModuleAndCcClassKeys = _interopRequireDefault(require("../mapper/map-module-and-cc-class-keys"));

var _unsetRef = _interopRequireDefault(require("../ref/unset-ref"));

var _setRef = _interopRequireDefault(require("../ref/set-ref"));

var _runLater = _interopRequireDefault(require("./run-later"));

var _getAndStoreValidGlobalState = _interopRequireDefault(require("../state/get-and-store-valid-global-state"));

var _computeCcUniqueKey2 = _interopRequireDefault(require("./compute-cc-unique-key"));

var _buildMockEvent = _interopRequireDefault(require("./build-mock-event"));

var _getFeatureStrAndStpmapping = _interopRequireDefault(require("./get-feature-str-and-stpmapping"));

var _extractStateByCcsync2 = _interopRequireDefault(require("../state/extract-state-by-ccsync"));

var _chain = require("../chain");

var _plugin = require("../plugin");

var checker = _interopRequireWildcard(require("../checker"));

var ev = _interopRequireWildcard(require("../event"));

// import hoistNonReactStatic from 'hoist-non-react-statics';
var verifyKeys = _util["default"].verifyKeys,
    ccClassDisplayName = _util["default"].ccClassDisplayName,
    styleStr = _util["default"].styleStr,
    color = _util["default"].color,
    verboseInfo = _util["default"].verboseInfo,
    makeError = _util["default"].makeError,
    justWarning = _util["default"].justWarning,
    throwCcHmrError = _util["default"].throwCcHmrError;
var _ccContext$store = _ccContext["default"].store,
    _state = _ccContext$store._state,
    getState = _ccContext$store.getState,
    ccStoreSetState = _ccContext$store.setState,
    setStateByModuleAndKey = _ccContext$store.setStateByModuleAndKey,
    _reducer = _ccContext["default"].reducer._reducer,
    refStore = _ccContext["default"].refStore,
    globalMappingKey_sharedKey_ = _ccContext["default"].globalMappingKey_sharedKey_,
    _computedValue = _ccContext["default"].computed._computedValue,
    moduleName_sharedStateKeys_ = _ccContext["default"].moduleName_sharedStateKeys_,
    moduleName_globalStateKeys_ = _ccContext["default"].moduleName_globalStateKeys_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    ccKey_ref_ = _ccContext["default"].ccKey_ref_,
    ccKey_option_ = _ccContext["default"].ccKey_option_,
    globalCcClassKeys = _ccContext["default"].globalCcClassKeys,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    globalMappingKey_toModules_ = _ccContext["default"].globalMappingKey_toModules_,
    globalMappingKey_fromModule_ = _ccContext["default"].globalMappingKey_fromModule_,
    globalKey_toModules_ = _ccContext["default"].globalKey_toModules_,
    sharedKey_globalMappingKeyDescriptor_ = _ccContext["default"].sharedKey_globalMappingKeyDescriptor_,
    middlewares = _ccContext["default"].middlewares;
var cl = color;
var ss = styleStr;
var me = makeError;
var vbi = verboseInfo;
var DISPATCH = 'dispatch';
var SET_STATE = 'setState';
var SET_GLOBAL_STATE = 'setGlobalState';
var FORCE_UPDATE = 'forceUpdate';

function paramCallBackShouldNotSupply(module, currentModule) {
  return "if you pass param reactCallback, param module must equal current CCInstance's module, module: " + module + ", CCInstance's module:" + currentModule + ", now the cb will never been triggered! ";
}

function handleError(err, throwError) {
  if (throwError === void 0) {
    throwError = true;
  }

  if (throwError) throw err;else {
    handleCcFnError(err);
  }
}

function checkStoreModule(module, checkGlobalModule, throwError) {
  if (checkGlobalModule === void 0) {
    checkGlobalModule = true;
  }

  if (throwError === void 0) {
    throwError = true;
  }

  if (checkGlobalModule && module === _constant.MODULE_GLOBAL) {
    handleError(me(_constant.ERR.CC_CLASS_MODULE_GLOBAL_DECLARE_NOT_ALLOWED), throwError);
    return false;
  }

  try {
    checker.checkModuleName(module, false, "module[" + module + "] is not configured in store");
    return true;
  } catch (err) {
    handleError(err, throwError);
    return false;
  }
} // any error in this function will not been throwed, cc just warning, 


function isStateModuleValid(inputModule, currentModule, reactCallback, cb) {
  var targetCb = reactCallback;

  if (checkStoreModule(inputModule, false, false)) {
    if (inputModule != currentModule) {
      if (reactCallback) {
        justWarning(me(_constant.ERR.CC_CLASS_INSTANCE_CALL_WITH_ARGS_INVALID, vbi(paramCallBackShouldNotSupply(inputModule, currentModule))));
        targetCb = null; //let user's reactCallback has no chance to be triggered
      }
    }

    cb(null, targetCb);
  } else {
    cb(new Error("inputModule:" + inputModule + " invalid"), null);
  }
}

function getSharedKeysAndGlobalKeys(module, ccClassKey, inputSharedStateKeys, inputGlobalStateKeys) {
  var sharedStateKeys = inputSharedStateKeys,
      globalStateKeys = inputGlobalStateKeys;

  if (inputSharedStateKeys === '*') {
    sharedStateKeys = Object.keys(getState(module));
  }

  if (inputGlobalStateKeys === '*') {
    globalStateKeys = Object.keys(getState(_constant.MODULE_GLOBAL));
  }

  var _verifyKeys = verifyKeys(sharedStateKeys, globalStateKeys),
      duplicate = _verifyKeys.duplicate,
      notArray = _verifyKeys.notArray,
      keyElementNotString = _verifyKeys.keyElementNotString;

  if (notArray) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey));
  }

  if (keyElementNotString) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_OR_SHARED_STATE_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey));
  }

  if (duplicate) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_SHARED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey + " globalStateKeys:" + globalStateKeys + " sharedStateKeys:" + sharedStateKeys));
  }

  var globalState = getState(_constant.MODULE_GLOBAL);
  var hasGlobalMappingKeyInSharedStateKeys = false;
  var matchedGlobalKey, matchedSharedKey;
  var len = globalStateKeys.length;

  for (var i = 0; i < len; i++) {
    var gKey = globalStateKeys[i];

    if (globalState[gKey] === undefined) {
      throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_KEY_NOT_DECLARED_IN_GLOBAL_STATE, vbi("ccClassKey:" + ccClassKey + ", invalid key in globalStateKeys is [" + gKey + "]"));
    }

    var sharedKey = globalMappingKey_sharedKey_[gKey];
    var fromModule = globalMappingKey_fromModule_[gKey]; //  if cc found one of the globalStateKeys of this module is just mapped from shared to global
    //  it is strictly prohibited here

    if (fromModule == module && sharedStateKeys.includes(sharedKey)) {
      hasGlobalMappingKeyInSharedStateKeys = true;
      matchedGlobalKey = gKey;
      matchedSharedKey = sharedKey;
      break;
    }
  } // maybe in the future, this is ok？ if user change sharedToGlobalMapping frequently, user don't have to change ccClass's globalStateKeys at the same time
  // but currently, this situation is strictly prohibited...... prevent from syncGlobalState and syncSharedState signal working badly


  if (hasGlobalMappingKeyInSharedStateKeys) {
    throw me(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_INCLUDE_SHARED_TO_GLOBAL_MAPPING_KEY, vbi("ccClassKey [" + ccClassKey + "], invalid global key [" + matchedGlobalKey + "], matched state key [" + matchedSharedKey + "]"));
  }

  return {
    sharedStateKeys: sharedStateKeys,
    globalStateKeys: globalStateKeys
  };
}

function checkCcStartupOrNot() {
  if (!window.cc || _ccContext["default"].isCcAlreadyStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}

function extractStateToBeBroadcasted(refModule, sourceState, sharedStateKeys, globalStateKeys) {
  var _extractStateByKeys = (0, _extractStateByKeys12["default"])(sourceState, sharedStateKeys),
      partialSharedState = _extractStateByKeys.partialState,
      isPartialSharedStateEmpty = _extractStateByKeys.isStateEmpty;

  var _extractStateByKeys2 = (0, _extractStateByKeys12["default"])(sourceState, globalStateKeys),
      partialGlobalState = _extractStateByKeys2.partialState,
      isPartialGlobalStateEmpty = _extractStateByKeys2.isStateEmpty; //  any stateValue's key if it is a global key (a normal global key , or a global key mapped from a state key)
  //  the stateValue will been collected to module_globalState_, 
  //  any stateValue's key if it is a shared key that mapped to global key,
  //  the stateValue will been collected to module_globalState_ also,
  //  key means module name, value means the state to been broadcasted to the module


  var module_globalState_ = {}; //  see if sourceState includes globalMappingKeys, extract the target state that will been broadcasted to other module by globalMappingKey_sharedKey_

  globalStateKeys.forEach(function (gKey) {
    var stateValue = sourceState[gKey];

    if (stateValue !== undefined) {
      var sharedKey = globalMappingKey_sharedKey_[gKey];
      var toModules, stateKey;

      if (sharedKey) {
        //  this global key is created from some other module's sharedToGlobalMapping setting
        toModules = globalMappingKey_toModules_[gKey];
        stateKey = sharedKey;
      } else {
        //  this is normal global key
        toModules = globalKey_toModules_[gKey];
        stateKey = gKey;
      }

      if (toModules) {
        toModules.forEach(function (m) {
          if (m != refModule) {
            // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
            var modulePartialGlobalState = _util["default"].safeGetObjectFromObject(module_globalState_, m);

            modulePartialGlobalState[stateKey] = stateValue;
          }
        });
      }
    }
  }); //  see if sourceState includes sharedStateKey which are mapped to globalStateKey

  sharedStateKeys.forEach(function (sKey) {
    var stateValue = sourceState[sKey];

    if (stateValue !== undefined) {
      var descriptor = sharedKey_globalMappingKeyDescriptor_[sKey];

      if (descriptor) {
        var globalMappingKey = descriptor.globalMappingKey;
        var toModules = globalMappingKey_toModules_[globalMappingKey]; //  !!!set this state to globalState, let other module that watching this globalMappingKey
        //  can recover it correctly while they are mounted again!

        setStateByModuleAndKey(_constant.MODULE_GLOBAL, globalMappingKey, stateValue);

        if (toModules) {
          toModules.forEach(function (m) {
            if (m != refModule) {
              // current ref's module global state has been extracted into partialGlobalState above, so here exclude it
              var modulePartialGlobalState = _util["default"].safeGetObjectFromObject(module_globalState_, m);

              modulePartialGlobalState[globalMappingKey] = stateValue;
            }
          });
        }
      }
    }
  }); // partialSharedState is prepared for input module 
  // partialGlobalState is prepared for input module 
  // module_globalState_ is prepared for other module 

  return {
    isPartialSharedStateEmpty: isPartialSharedStateEmpty,
    partialSharedState: partialSharedState,
    isPartialGlobalStateEmpty: isPartialGlobalStateEmpty,
    partialGlobalState: partialGlobalState,
    module_globalState_: module_globalState_
  };
} //to let cc know a specified module are watching what sharedStateKeys


function mapModuleAndSharedStateKeys(moduleName, partialSharedStateKeys) {
  var sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName];
  if (!sharedStateKeysOfModule) sharedStateKeysOfModule = moduleName_sharedStateKeys_[moduleName] = [];
  partialSharedStateKeys.forEach(function (sKey) {
    if (!sharedStateKeysOfModule.includes(sKey)) sharedStateKeysOfModule.push(sKey);
  });
}

function mapGlobalKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(function (gKey) {
    var toModules = _util["default"].safeGetArrayFromObject(globalKey_toModules_, gKey); // because cc allow multi class register to a same module, so here judge if toModules includes module or not


    if (!toModules.includes(_curStateModule)) {
      toModules.push(_curStateModule);
    }
  });
}

function mapGlobalMappingKeyAndToModules(_curStateModule, globalStateKeys) {
  globalStateKeys.forEach(function (gKey) {
    var toModules = _util["default"].safeGetArrayFromObject(globalMappingKey_toModules_, gKey);

    if (globalMappingKey_sharedKey_[gKey]) {
      //  if this gKey is globalMappingKey
      if (!toModules.includes(_curStateModule)) toModules.push(_curStateModule);
    }
  });
} //to let cc know a specified module are watching what globalStateKeys


function mapModuleAndGlobalStateKeys(moduleName, partialGlobalStateKeys) {
  var globalStateKeysOfModule = _util["default"].safeGetArrayFromObject(moduleName_globalStateKeys_, moduleName);

  partialGlobalStateKeys.forEach(function (gKey) {
    if (!globalStateKeysOfModule.includes(gKey)) globalStateKeysOfModule.push(gKey);
  });
} //tell cc this ccClass is watching some sharedStateKeys of a module state, some globalStateKeys of global state


function mapCcClassKeyAndCcClassContext(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, connectSpec) {
  var fragmentPrefixLen = _constant.CC_FRAGMENT_PREFIX.length;

  if (ccClassKey.toLowerCase().substring(0, fragmentPrefixLen) === _constant.CC_FRAGMENT_PREFIX) {
    throw me(_constant.ERR.CC_CLASS_KEY_FRAGMENT_NOT_ALLOWED);
  }

  var _getFeatureStrAndStpM = (0, _getFeatureStrAndStpmapping["default"])(connectSpec),
      stateToPropMapping = _getFeatureStrAndStpM.stateToPropMapping;

  var contextMap = _ccContext["default"].ccClassKey_ccClassContext_;
  var ctx = contextMap[ccClassKey];

  if (ctx !== undefined) {
    // analyze is ccClassKey really duplicated
    if (_util["default"].isHotReloadMode()) {
      var str1 = ctx.originalGlobalStateKeys.toString() + ctx.originalSharedStateKeys.toString() + JSON.stringify(ctx.stateToPropMapping);
      var str2 = originalGlobalStateKeys.toString() + originalSharedStateKeys.toString() + JSON.stringify(stateToPropMapping);

      if (str1 !== str2) {
        throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
      } else {
        throwCcHmrError(me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
      }
    } else {
      throw me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate");
    }
  }

  (0, _buildCcClassContext["default"])(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping);
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
  if (isDispatcher) {
    //dispatcher实例调用的话，本身是不携带任何***StateKeys信息的
    return {
      sharedStateKeys: moduleName_stateKeys_[moduleName] || [],
      globalStateKeys: []
    };
  }

  var globalStateKeys, sharedStateKeys;

  if (stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
    globalStateKeys = ccClassGlobalStateKeys;
    sharedStateKeys = ccClassSharedStateKeys;
  } else if (stateFor === _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE) {
    // user may declare module but no any class register to the module,
    // and a cc class define stateToPropMapping to watch this module's state change,
    // then moduleName_globalStateKeys_[moduleName] will be undefined
    globalStateKeys = moduleName_globalStateKeys_[moduleName] || [];
    sharedStateKeys = moduleName_sharedStateKeys_[moduleName] || [];
  } else {
    throw new Error("stateFor is not set correctly! "); // return justWarning(`stateFor is not set correctly, prepareBroadcastState failed!`)
  }

  return {
    globalStateKeys: globalStateKeys,
    sharedStateKeys: sharedStateKeys
  };
}

function _throwForExtendInputClassAsFalseCheck(ccClassKey) {
  throw me("cc found that you set sharedStateKeys\u3001globalStateKeys or storedStateKeys, but you set extendInputClass as false at the same time\n    while you register a ccClass:" + ccClassKey + ", this is not allowed, extendInputClass=false means cc will give you\n    a props proxy component, in this situation, cc is unable to take over your component state, so set sharedStateKeys or globalStateKeys\n    is strictly prohibited, but you can still set stateToPropMapping to let cc control your component render timing!\n  ");
}

function mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, stateModule, sharedStateKeys, globalStateKeys, connectSpec) {
  if (extendInputClass === false) {
    if (sharedStateKeys.length > 0 || globalStateKeys.length > 0) {
      //??? maybe can use this.props.state?
      _throwForExtendInputClassAsFalseCheck(ccClassKey);
    }
  }

  var _getSharedKeysAndGlob = getSharedKeysAndGlobalKeys(stateModule, ccClassKey, sharedStateKeys, globalStateKeys),
      targetSharedStateKeys = _getSharedKeysAndGlob.sharedStateKeys,
      targetGlobalStateKeys = _getSharedKeysAndGlob.globalStateKeys;

  mapCcClassKeyAndCcClassContext(ccClassKey, stateModule, sharedStateKeys, globalStateKeys, targetSharedStateKeys, targetGlobalStateKeys, connectSpec);
  mapModuleAndSharedStateKeys(stateModule, targetSharedStateKeys);
  mapModuleAndGlobalStateKeys(stateModule, targetGlobalStateKeys);
  mapGlobalKeyAndToModules(stateModule, targetGlobalStateKeys);
  mapGlobalMappingKeyAndToModules(stateModule, targetGlobalStateKeys);
  (0, _mapModuleAndCcClassKeys["default"])(stateModule, ccClassKey); //tell cc this ccClass is watching some globalStateKeys of global module

  if (targetGlobalStateKeys.length > 0) _ccContext["default"].globalCcClassKeys.push(ccClassKey);
  return {
    sharedStateKeys: targetSharedStateKeys,
    globalStateKeys: targetGlobalStateKeys
  };
}

function computeValueForRef(refComputedFn, refComputed, unchangedState, commitState) {
  if (refComputedFn) {
    var toBeComputed = refComputedFn();
    var toBeComputedKeys = Object.keys(toBeComputed);
    toBeComputedKeys.forEach(function (key) {
      var fn = toBeComputed[key];
      var newValue = commitState[key];

      if (newValue !== undefined) {
        var computedValue = fn(newValue, unchangedState[key], unchangedState);
        refComputed[key] = computedValue;
      }
    });
  }
}

function watchValueForRef(refWatchFn, refEntireState, userCommitState) {
  var shouldCurrentRefUpdate = true;

  if (refWatchFn) {
    var refWatch = refWatchFn();
    var watchStateKeys = Object.keys(refWatch);
    var len = watchStateKeys.length;
    var shouldNouUpdateLen = 0;
    watchStateKeys.forEach(function (key) {
      var commitValue = userCommitState[key];

      if (commitValue !== undefined) {
        var watchFn = refWatch[key];
        var ret = watchFn(commitValue, refEntireState[key]); // watchFn(newValue, oldValue);

        if (ret === false) shouldNouUpdateLen++;
      }
    }); //只有所有watch都返回false，才不触发当前实例更新

    if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}

function updateConnectedState(targetClassContext, commitModule, commitState, commitStateKeys) {
  var stateToPropMapping = targetClassContext.stateToPropMapping,
      connectedModule = targetClassContext.connectedModule;

  if (connectedModule[commitModule] === 1) {
    var connectedState = targetClassContext.connectedState,
        ccKeys = targetClassContext.ccKeys;
    var isSetConnectedStateTriggered = false;
    commitStateKeys.forEach(function (sKey) {
      var moduledStateKey = commitModule + "/" + sKey;

      if (stateToPropMapping[moduledStateKey]) {
        (0, _setConnectedState["default"])(connectedState, commitModule, sKey, commitState[sKey]);
        isSetConnectedStateTriggered = true;
      }
    }); //针对targetClassContext，遍历完提交的state key，触发了更新connectedState的行为，把targetClassContext对应的cc实例都强制刷新一遍

    if (isSetConnectedStateTriggered === true) {
      ccKeys.forEach(function (ccUniKey) {
        var ref = ccKey_ref_[ccUniKey];
        if (ref) ref.cc.reactForceUpdate();
      });
    }
  }
}

function broadcastConnectedState(commitModule, commitState) {
  // if there is no any react class registered to module, here will get undefined, so use safeGetArrayFromObject
  var commitStateKeys = Object.keys(commitState); //提前把commitStateKeys拿到，省去了在updateConnectedState内部的多次获取过程

  Object.keys(moduleName_ccClassKeys_).forEach(function (moduleName) {
    var ccClassKeys = _util["default"].safeGetArrayFromObject(moduleName_ccClassKeys_, moduleName);

    ccClassKeys.forEach(function (ccClassKey) {
      var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
      updateConnectedState(ccClassContext, commitModule, commitState, commitStateKeys);
    });
  });
}

function _promiseErrorHandler(resolve, reject) {
  return function (err) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return err ? reject(err) : resolve.apply(void 0, args);
  };
}

function _promisifyCcFn(ccFn, userLogicFn, executionContext) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  return new Promise(function (resolve, reject) {
    var _executionContext = Object.assign(executionContext, {
      __innerCb: _promiseErrorHandler(resolve, reject)
    });

    ccFn.apply(void 0, [userLogicFn, _executionContext].concat(args));
  })["catch"](_catchCcError["default"]);
}

function handleCcFnError(err, __innerCb) {
  if (err) {
    if (__innerCb) __innerCb(err);else {
      justWarning(err);
      if (_ccContext["default"].errorHandler) _ccContext["default"].errorHandler(err);
    }
  }
}

function getStateFor(inputModule, currentModule) {
  return inputModule === currentModule ? _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE;
}

function register(ccClassKey, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$module = _ref.module,
      module = _ref$module === void 0 ? _constant.MODULE_DEFAULT : _ref$module,
      _ref$sharedStateKeys = _ref.sharedStateKeys,
      inputSharedStateKeys = _ref$sharedStateKeys === void 0 ? [] : _ref$sharedStateKeys,
      _ref$globalStateKeys = _ref.globalStateKeys,
      inputGlobalStateKeys = _ref$globalStateKeys === void 0 ? [] : _ref$globalStateKeys,
      _ref$storedStateKeys = _ref.storedStateKeys,
      inputStoredStateKeys = _ref$storedStateKeys === void 0 ? [] : _ref$storedStateKeys,
      _ref$connect = _ref.connect,
      connect = _ref$connect === void 0 ? {} : _ref$connect,
      reducerModule = _ref.reducerModule,
      _ref$extendInputClass = _ref.extendInputClass,
      extendInputClass = _ref$extendInputClass === void 0 ? true : _ref$extendInputClass,
      _ref$isSingle = _ref.isSingle,
      isSingle = _ref$isSingle === void 0 ? false : _ref$isSingle,
      _ref$asyncLifecycleHo = _ref.asyncLifecycleHook,
      asyncLifecycleHook = _ref$asyncLifecycleHo === void 0 ? true : _ref$asyncLifecycleHo,
      _ref$__checkStartUp = _ref.__checkStartUp,
      __checkStartUp = _ref$__checkStartUp === void 0 ? true : _ref$__checkStartUp,
      __calledBy = _ref.__calledBy;

  try {
    if (!ccClassKey) throw new Error("[[register]]: ccClassKey is undefined!");
    if (__checkStartUp === true) checkCcStartupOrNot();

    if (__calledBy !== 'cc') {
      if (ccClassKey.toLowerCase() === _constant.CC_DISPATCHER.toLowerCase()) {
        throw new Error(_constant.CC_DISPATCHER + " is cc built-in ccClassKey name, if you want to customize your dispatcher, \n        you can set autoCreateDispatcher=false in StartupOption, and use createDispatcher then.");
      }
    }

    var _curStateModule = module;
    var _asyncLifecycleHook = asyncLifecycleHook;

    var _reducerModule = reducerModule || _curStateModule; //if reducerModule not defined, will be equal module;


    checkStoreModule(_curStateModule);

    var _mapModuleAssociateDa = mapModuleAssociateDataToCcContext(extendInputClass, ccClassKey, _curStateModule, inputSharedStateKeys, inputGlobalStateKeys, connect),
        sKeys = _mapModuleAssociateDa.sharedStateKeys,
        gKeys = _mapModuleAssociateDa.globalStateKeys;

    var sharedStateKeys = sKeys,
        globalStateKeys = gKeys;
    var isIssArr = Array.isArray(inputStoredStateKeys);

    if (!isIssArr && inputStoredStateKeys !== '*') {
      throw new Error("register.option.storedStateKeys type err, it is must be an array or string *");
    }

    if (isIssArr) {
      var allKeys = sKeys.concat(gKeys);
      inputStoredStateKeys.forEach(function (v) {
        if (allKeys.includes(v)) {
          throw new Error("register.option.storedStateKeys key err, the key[" + v + "] is already been declared in sharedStateKeys or globalStateKeys ");
        }
      });
    }

    return function (ReactClass) {
      if (ReactClass.prototype.$$changeState && ReactClass.prototype.__$$mapCcToInstance) {
        throw me(_constant.ERR.CC_REGISTER_A_CC_CLASS, vbi("if you want to register " + ccClassKey + " to cc successfully, the ReactClass can not be a CcClass!"));
      }

      var TargetClass = extendInputClass ? ReactClass : _react["default"].Component;

      var CcClass =
      /*#__PURE__*/
      function (_TargetClass) {
        (0, _inheritsLoose2["default"])(CcClass, _TargetClass);

        function CcClass(props, context) {
          var _this;

          try {
            _this = _TargetClass.call(this, props, context) || this;
            if (!_this.state) _this.state = {};
            var ccKey = props.ccKey,
                _props$ccOption = props.ccOption,
                ccOption = _props$ccOption === void 0 ? {} : _props$ccOption;
            var originalCcKey = ccKey; //这些方法是cc自己注入的

            _util["default"].bindThis((0, _assertThisInitialized2["default"])(_this), ['__$$mapCcToInstance', '$$changeState', '__$$recoverState', '$$domDispatch', '$$sync', '$$toggleBool', '__$$getEffectHandler', '__$$getXEffectHandler', '__$$makeEffectHandler', '__$$sync', '$$syncInt', '__$$getInvokeHandler', '__$$getXInvokeHandler', '__$$makeInvokeHandler', '__$$getChangeStateHandler', '__$$getDispatchHandler']); // if you flag syncSharedState false, that means this ccInstance's state changing will not effect other ccInstance and not effected by other ccInstance's state changing


            if (ccOption.syncSharedState === undefined) ccOption.syncSharedState = true; // if you flag syncGlobalState false, that means this ccInstance's globalState changing will not effect cc's globalState and not effected by cc's globalState changing

            if (ccOption.syncGlobalState === undefined) ccOption.syncGlobalState = true;
            if (ccOption.asyncLifecycleHook === undefined) ccOption.asyncLifecycleHook = _asyncLifecycleHook;
            var _asyncLifecycleHook2 = ccOption.asyncLifecycleHook;

            var _computeCcUniqueKey = (0, _computeCcUniqueKey2["default"])(isSingle, ccClassKey, ccKey),
                newCcKey = _computeCcUniqueKey.ccKey,
                ccUniqueKey = _computeCcUniqueKey.ccUniqueKey,
                isCcUniqueKeyAutoGenerated = _computeCcUniqueKey.isCcUniqueKeyAutoGenerated;

            var ccClassContext = ccClassKey_ccClassContext_[ccClassKey];
            (0, _setRef["default"])((0, _assertThisInitialized2["default"])(_this), isSingle, ccClassKey, newCcKey, ccUniqueKey, ccOption); // bind connectedState to $$connectedState

            _this.$$connectedState = ccClassContext.connectedState || {};

            if (!ccOption.storedStateKeys) {
              ccOption.storedStateKeys = inputStoredStateKeys;
            }

            if (ccOption.storedStateKeys === '*') {
              var toExcludeKeys = sharedStateKeys.concat(globalStateKeys);

              var _allKeys = Object.keys(_this.state);

              var storedStateKeys = _allKeys.filter(function (k) {
                return !toExcludeKeys.includes(k);
              });

              ccOption.storedStateKeys = storedStateKeys;
            }

            _this.__$$mapCcToInstance(isSingle, _asyncLifecycleHook2, ccClassKey, originalCcKey, newCcKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, ccOption.storedStateKeys, ccOption, ccClassContext, _curStateModule, _reducerModule, sharedStateKeys, globalStateKeys, connect);

            _this.$$refComputed = _this.cc.refComputed; //这些方法是cc交给用户定义的，放置到cc下统一管理，因为多重装饰器模式下，这里属性是从this上取不到的
            //放在__$$recoverState之前，优先设置this.cc.computed

            if (_this.$$computed) _this.cc.computed = _this.$$computed.bind((0, _assertThisInitialized2["default"])(_this));
            if (_this.$$onUrlChanged) _this.cc.onUrlChanged = _this.$$onUrlChanged.bind((0, _assertThisInitialized2["default"])(_this));
            if (_this.$$watch) _this.cc.watch = _this.$$watch.bind((0, _assertThisInitialized2["default"])(_this));
            if (_this.$$execute) _this.cc.execute = _this.$$execute.bind((0, _assertThisInitialized2["default"])(_this)); //$$cache要注意使用规范

            if (_this.$$cache) {
              _this.$$cache = _this.$$cache.bind((0, _assertThisInitialized2["default"])(_this));
              _this.$$refCache = _this.$$cache();
            } else {
              _this.$$refCache = {};
            }

            _this.__$$recoverState(_curStateModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey);
          } catch (err) {
            (0, _catchCcError["default"])(err);
          }

          return _this;
        } // never care nextProps, in cc mode, reduce unnecessary render which cause by receiving new props;


        var _proto = CcClass.prototype;

        _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
          return this.state !== nextState;
        };

        _proto.__$$recoverState = function __$$recoverState(currentModule, globalStateKeys, sharedStateKeys, ccOption, ccUniqueKey) {
          var refState = refStore._state[ccUniqueKey] || {};
          var sharedState = _state[currentModule];
          var globalState = _state[_constant.MODULE_GLOBAL];
          var syncSharedState = ccOption.syncSharedState,
              syncGlobalState = ccOption.syncGlobalState;
          var partialSharedState = {},
              partialGlobalState = {};

          if (syncSharedState) {
            var _extractStateByKeys3 = (0, _extractStateByKeys12["default"])(sharedState, sharedStateKeys),
                partialState = _extractStateByKeys3.partialState;

            partialSharedState = partialState;
          }

          if (syncGlobalState) {
            var _extractStateByKeys4 = (0, _extractStateByKeys12["default"])(globalState, globalStateKeys),
                _partialState = _extractStateByKeys4.partialState;

            partialGlobalState = _partialState;
          }

          var selfState = this.state;
          var entireState = Object.assign({}, selfState, refState, partialSharedState, partialGlobalState);
          this.state = entireState;
          computeValueForRef(this.cc.computed, this.cc.refComputed, entireState, entireState);
        } //!!! 存在多重装饰器时
        //!!! 必需在类的 【componentWillMount】 里调用 this.props.$$attach(this)
        ;

        _proto.$$attach = function $$attach(childRef) {
          var _this2 = this;

          var attachMethods = ['$$domDispatch', '$$dispatch', '$$dispatchIdentity', '$$d', '$$di', '$$on', '$$onIdentity', '$$emit', '$$emitIdentity', '$$emitWith', '$$off', '$$sync', '$$toggleBool', '$$syncInt', '$$invoke', '$$xinvoke', '$$effect', '$$xeffect', '$$forceSyncState', 'setState', 'setGlobalState', 'forceUpdate'];
          attachMethods.forEach(function (m) {
            childRef[m] = _this2[m].bind(_this2);
          }); //这些负责搜集结果的key，单独绑定

          childRef.$$refComputed = this.cc.refComputed;
          childRef.$$connectedComputed = this.cc.connectedComputed;
          childRef.$$moduleComputed = this.cc.moduleComputed;
          childRef.$$globalComputed = this.cc.globalComputed;

          var bindChildRefCcApi = function bindChildRefCcApi(cRef, method, ccMethod) {
            if (cRef[method]) {
              childRef[method] = childRef[method].bind(childRef);
              _this2.cc[ccMethod] = childRef[method];
            }
          }; //这些方法绑定的this指向childRef


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

          var childRefState = childRef.state;
          this.state = Object.assign(childRefState, this.state);
          this.cc.childRef = childRef;
        };

        _proto.__$$mapCcToInstance = function __$$mapCcToInstance(isSingle, asyncLifecycleHook, ccClassKey, originalCcKey, ccKey, ccUniqueKey, isCcUniqueKeyAutoGenerated, storedStateKeys, ccOption, ccClassContext, currentModule, currentReducerModule, sharedStateKeys, globalStateKeys, connect) {
          var _this3 = this;

          var reactSetStateRef = this.setState.bind(this);
          var reactForceUpdateRef = this.forceUpdate.bind(this);

          var isControlledByConcent = sharedStateKeys.length > 0 || globalStateKeys.length > 0 || _util["default"].isObjectNotNull(connect);

          var ccState = {
            renderCount: 1,
            isSingle: isSingle,
            asyncLifecycleHook: asyncLifecycleHook,
            ccClassKey: ccClassKey,
            ccKey: ccKey,
            originalCcKey: originalCcKey,
            ccUniqueKey: ccUniqueKey,
            isCcUniqueKeyAutoGenerated: isCcUniqueKeyAutoGenerated,
            storedStateKeys: storedStateKeys,
            ccOption: ccOption,
            ccClassContext: ccClassContext,
            module: currentModule,
            reducerModule: currentReducerModule,
            sharedStateKeys: sharedStateKeys,
            globalStateKeys: globalStateKeys,
            initTime: Date.now(),
            connect: connect,
            isControlledByConcent: isControlledByConcent
          };

          var _verifyKeys2 = verifyKeys(sharedStateKeys, storedStateKeys),
              duplicate = _verifyKeys2.duplicate,
              notArray = _verifyKeys2.notArray,
              keyElementNotString = _verifyKeys2.keyElementNotString;

          if (notArray) {
            throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_NOT_ARRAY, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (keyElementNotString) {
            throw me(_constant.ERR.CC_STORED_STATE_KEYS_OR_SHARED_KEYS_INCLUDE_NON_STRING_ELEMENT, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey));
          }

          if (duplicate) {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_STORED_STATE_KEYS_DUPLICATE_WITH_SHARED_KEYS, vbi("ccClassKey:" + ccClassKey + " ccKey:" + ccKey + " sharedStateKeys:" + sharedStateKeys + " storedStateKeys:" + storedStateKeys));
          }

          if (storedStateKeys.length > 0 && isCcUniqueKeyAutoGenerated) {
            throw me(_constant.ERR.CC_CLASS_INSTANCE_NO_CC_KEY_SPECIFIED_WHEN_USE_STORED_STATE_KEYS, vbi("ccClassKey:" + ccClassKey));
          }

          this.cc = {
            onUrlChanged: null,
            watch: null,
            computed: null,
            refComputed: {},
            connectedComputed: {},
            globalComputed: {},
            moduleComputed: {},
            execute: null,
            ccState: ccState,
            ccClassKey: ccClassKey,
            originalCcKey: originalCcKey,
            ccKey: ccKey,
            ccUniqueKey: ccUniqueKey,
            beforeSetState: this.$$beforeSetState,
            beforeBroadcastState: this.$$beforeBroadcastState,
            afterSetState: this.$$afterSetState,
            reactSetState: function reactSetState(state, cb) {
              ccState.renderCount += 1; //采用此种写法的话，dispatch.ctx不能暴露state了，只能暴露getState句柄，才能保证取到最新的state
              // this.state = Object.assign(this.state, state);
              //采用okeys写法，让dispatch.ctx里的state总是指向同一个引用

              (0, _util.okeys)(state).forEach(function (k) {
                return _this3.state[k] = state[k];
              });
              reactSetStateRef(state, cb);
            },
            reactForceUpdate: function reactForceUpdate(cb) {
              ccState.renderCount += 1;
              reactForceUpdateRef(cb);
            },
            setState: function setState(state, cb, delay, identity) {
              if (delay === void 0) {
                delay = -1;
              }

              _this3.$$changeState(state, {
                ccKey: ccKey,
                identity: identity,
                module: currentModule,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                cb: cb,
                calledBy: SET_STATE,
                delay: delay
              });
            },
            forceSyncState: function forceSyncState(state, cb, delay, identity) {
              if (delay === void 0) {
                delay = -1;
              }

              _this3.$$changeState(state, {
                forceSync: true,
                identity: identity,
                ccKey: ccKey,
                module: currentModule,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                cb: cb,
                calledBy: SET_STATE,
                delay: delay
              });
            },
            setGlobalState: function setGlobalState(partialGlobalState, delay, broadcastTriggeredBy) {
              if (delay === void 0) {
                delay = -1;
              }

              if (broadcastTriggeredBy === void 0) {
                broadcastTriggeredBy = _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_SET_GLOBAL_STATE;
              }

              _this3.$$changeState(partialGlobalState, {
                ccKey: ccKey,
                module: _constant.MODULE_GLOBAL,
                broadcastTriggeredBy: broadcastTriggeredBy,
                calledBy: SET_GLOBAL_STATE,
                delay: delay
              });
            },
            forceUpdate: function forceUpdate(cb, delay, identity) {
              _this3.$$changeState(_this3.state, {
                ccKey: ccKey,
                identity: identity,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                module: currentModule,
                cb: cb,
                calledBy: FORCE_UPDATE,
                delay: delay
              });
            },
            // change other module's state, the difference between effect and xeffect is:
            // xeffect will take your logicFn param list's first place to put ExecutionContext
            __effect: function __effect(targetModule, userLogicFn, option) {
              var _this3$cc;

              var ccKey = option.ccKey,
                  ccUniqueKey = option.ccUniqueKey,
                  identity = option.identity,
                  _option$delay = option.delay,
                  delay = _option$delay === void 0 ? -1 : _option$delay,
                  context = option.context,
                  methodName = option.methodName;

              for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
                args[_key3 - 3] = arguments[_key3];
              }

              return (_this3$cc = _this3.cc).__promisifiedInvokeWith.apply(_this3$cc, [userLogicFn, {
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                stateFor: getStateFor(targetModule, currentModule),
                context: context,
                module: targetModule,
                calledBy: methodName,
                fnName: userLogicFn.name,
                delay: delay,
                identity: identity
              }].concat(args));
            },
            __invoke: function __invoke(userLogicFn, option) {
              var _this3$cc2;

              var ccKey = option.ccKey,
                  ccUniqueKey = option.ccUniqueKey,
                  _option$context = option.context,
                  context = _option$context === void 0 ? false : _option$context,
                  _option$forceSync = option.forceSync,
                  forceSync = _option$forceSync === void 0 ? false : _option$forceSync,
                  delay = option.delay,
                  identity = option.identity,
                  methodName = option.methodName;

              for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                args[_key4 - 2] = arguments[_key4];
              }

              return (_this3$cc2 = _this3.cc).__promisifiedInvokeWith.apply(_this3$cc2, [userLogicFn, {
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                stateFor: _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY,
                context: context,
                module: currentModule,
                calledBy: methodName,
                fnName: userLogicFn.name,
                delay: delay,
                identity: identity,
                forceSync: forceSync
              }].concat(args));
            },
            __promisifiedInvokeWith: function __promisifiedInvokeWith(userLogicFn, executionContext) {
              for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                args[_key5 - 2] = arguments[_key5];
              }

              return _promisifyCcFn.apply(void 0, [_this3.cc.__invokeWith, userLogicFn, executionContext].concat(args));
            },
            __invokeWith: function __invokeWith(userLogicFn, executionContext) {
              for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                args[_key6 - 2] = arguments[_key6];
              }

              //ccKey ccClassKey 表示调用源头组件的ccKey和ccClassKey
              var ccKey = executionContext.ccKey,
                  ccUniqueKey = executionContext.ccUniqueKey,
                  ccClassKey = executionContext.ccClassKey,
                  stateFor = executionContext.stateFor,
                  _executionContext$mod = executionContext.module,
                  targetModule = _executionContext$mod === void 0 ? currentModule : _executionContext$mod,
                  _executionContext$con = executionContext.context,
                  context = _executionContext$con === void 0 ? false : _executionContext$con,
                  _executionContext$for = executionContext.forceSync,
                  forceSync = _executionContext$for === void 0 ? false : _executionContext$for,
                  cb = executionContext.cb,
                  __innerCb = executionContext.__innerCb,
                  type = executionContext.type,
                  reducerModule = executionContext.reducerModule,
                  calledBy = executionContext.calledBy,
                  fnName = executionContext.fnName,
                  _executionContext$del = executionContext.delay,
                  delay = _executionContext$del === void 0 ? -1 : _executionContext$del,
                  identity = executionContext.identity,
                  chainId = executionContext.chainId,
                  chainDepth = executionContext.chainDepth,
                  oriChainId = executionContext.oriChainId;
              isStateModuleValid(targetModule, currentModule, cb, function (err, newCb) {
                if (err) return handleCcFnError(err, __innerCb);

                if (context) {
                  var nextChainDepth = chainDepth + 1; //暂时不考虑在ctx提供lazyDispatch功能

                  var dispatch = _this3.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, identity, chainId, nextChainDepth, oriChainId);

                  var dispatchIdentity = _this3.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, targetModule, reducerModule, null, null, delay, identity, chainId, nextChainDepth, oriChainId);

                  var sourceClassContext = ccClassKey_ccClassContext_[ccClassKey]; //不能将state赋给executionContextForUser，给一个getState才能保证dispatch函数的state是最新的
                  //目前先保留state

                  var executionContextForUser = Object.assign(executionContext, {
                    effect: _this3.__$$getEffectHandler(ccKey, ccUniqueKey),
                    xeffect: _this3.__$$getXEffectHandler(ccKey, ccUniqueKey),
                    invoke: _this3.__$$getInvokeHandler(ccKey, ccUniqueKey),
                    xinvoke: _this3.__$$getXInvokeHandler(ccKey, ccUniqueKey),
                    //指的是目标模块的state
                    moduleState: getState(targetModule),
                    //指的是目标模块的的moduleComputed
                    moduleComputed: _computedValue[targetModule],
                    //!!!指是调用源cc类的connectedState
                    connectedState: sourceClassContext.connectedState,
                    //!!!指是调用源cc类的connectedComputed
                    connectedComputed: sourceClassContext.connectedComputed,
                    globalState: getState(_constant.MODULE_GLOBAL),
                    state: _this3.state,
                    getModuleState: getState,
                    store: getState(),
                    dispatch: dispatch,
                    dispatchIdentity: dispatchIdentity,
                    d: dispatch,
                    di: dispatchIdentity
                  });
                  args.unshift(executionContextForUser);
                }

                (0, _plugin.send)(_constant.SIG_FN_START, {
                  module: targetModule,
                  chainId: chainId,
                  fn: userLogicFn
                });

                _co["default"].wrap(userLogicFn).apply(void 0, args).then(function (partialState) {
                  var commitStateList = [];
                  (0, _plugin.send)(_constant.SIG_FN_END, {
                    module: targetModule,
                    chainId: chainId
                  }); // targetModule, sourceModule相等与否不用判断了，chainState里按模块为key去记录提交到不同模块的state

                  if ((0, _chain.isChainIdLazy)(chainId)) {
                    //来自于惰性派发的调用
                    if (chainDepth > 1) {
                      //暂存状态，最后才提交
                      (0, _chain.setChainState)(chainId, targetModule, partialState);
                    } else {
                      // chainDepth === 1, 合并状态一次性提交到store并派发到组件实例
                      if ((0, _chain.isChainExited)(chainId)) {//丢弃本次状态，不做任何处理
                      } else {
                        commitStateList = (0, _chain.setAndGetChainStateList)(chainId, targetModule, partialState);
                        (0, _chain.removeChainState)(chainId);
                      }
                    }
                  } else {
                    commitStateList = [{
                      module: targetModule,
                      state: partialState
                    }];
                  }

                  commitStateList.forEach(function (v) {
                    _this3.$$changeState(v.state, {
                      identity: identity,
                      ccKey: ccKey,
                      ccUniqueKey: ccUniqueKey,
                      stateFor: stateFor,
                      module: v.module,
                      forceSync: forceSync,
                      cb: newCb,
                      type: type,
                      reducerModule: reducerModule,
                      calledBy: calledBy,
                      fnName: fnName,
                      delay: delay
                    });
                  });
                  if (__innerCb) __innerCb(null, partialState);
                })["catch"](function (err) {
                  (0, _plugin.send)(_constant.SIG_FN_ERR, {
                    module: targetModule,
                    chainId: chainId
                  });
                  handleCcFnError(err, __innerCb);
                });
              });
            },
            dispatch: function dispatch(_temp2) {
              var _ref2 = _temp2 === void 0 ? {} : _temp2,
                  isLazy = _ref2.isLazy,
                  ccKey = _ref2.ccKey,
                  ccUniqueKey = _ref2.ccUniqueKey,
                  ccClassKey = _ref2.ccClassKey,
                  stateFor = _ref2.stateFor,
                  inputModule = _ref2.module,
                  inputReducerModule = _ref2.reducerModule,
                  identity = _ref2.identity,
                  _ref2$forceSync = _ref2.forceSync,
                  forceSync = _ref2$forceSync === void 0 ? false : _ref2$forceSync,
                  type = _ref2.type,
                  payload = _ref2.payload,
                  reactCallback = _ref2.cb,
                  __innerCb = _ref2.__innerCb,
                  _ref2$delay = _ref2.delay,
                  delay = _ref2$delay === void 0 ? -1 : _ref2$delay,
                  chainId = _ref2.chainId,
                  chainDepth = _ref2.chainDepth,
                  oriChainId = _ref2.oriChainId;

              //if module not defined, targetStateModule will be currentModule
              var targetStateModule = inputModule || currentModule; //if reducerModule not defined, cc will treat targetReducerModule as targetStateModule

              var targetReducerModule = inputReducerModule || targetStateModule;
              var targetReducerMap = _reducer[targetReducerModule];

              if (!targetReducerMap) {
                return __innerCb(new Error("no reducerMap found for reducer module:" + targetReducerModule));
              }

              var reducerFn = targetReducerMap[type];

              if (!reducerFn) {
                var fns = Object.keys(targetReducerMap);
                return __innerCb(new Error("no reducer defined in ccContext for reducer module:" + targetReducerModule + " type:" + type + ", maybe you want to invoke one of them:" + fns));
              } // const errMsg = util.isCcActionValid({ type, payload });
              // if (errMsg) return justWarning(errMsg);


              isStateModuleValid(targetStateModule, currentModule, reactCallback, function (err, newCb) {
                if (err) return __innerCb(err);
                var executionContext = {
                  ccKey: ccKey,
                  ccClassKey: ccClassKey,
                  stateFor: stateFor,
                  ccUniqueKey: ccUniqueKey,
                  ccOption: ccOption,
                  module: targetStateModule,
                  reducerModule: targetReducerModule,
                  type: type,
                  payload: payload,
                  forceSync: forceSync,
                  cb: newCb,
                  context: true,
                  __innerCb: __innerCb,
                  calledBy: DISPATCH,
                  delay: delay,
                  identity: identity,
                  chainId: chainId,
                  chainDepth: chainDepth,
                  isLazy: isLazy,
                  oriChainId: oriChainId
                };

                _this3.cc.__invokeWith(reducerFn, executionContext);
              });
            },
            prepareReactSetState: function prepareReactSetState(identity, calledBy, state, stateFor, next, reactCallback) {
              // 通过规范来约束用户，只要是可能变化的数据，都不要在$$cache里存
              // 要不然$$cache就没意义了
              // if(this.$$cache){
              //   this.$$refCache = this.$$cache();
              // }
              if (stateFor !== _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (next) next();
                return;
              }

              if (identity) {
                //if user specify identity
                if (_this3.cc.ccKey !== identity) {
                  // current instance would have been rendered only if current instance's ccKey equal identity
                  if (next) next();
                  return;
                }
              }

              if (storedStateKeys.length > 0) {
                var _extractStateByKeys5 = (0, _extractStateByKeys12["default"])(state, storedStateKeys),
                    partialState = _extractStateByKeys5.partialState,
                    isStateEmpty = _extractStateByKeys5.isStateEmpty;

                if (!isStateEmpty) {
                  if (ccOption.storeInLocalStorage === true) {
                    var _extractStateByKeys6 = (0, _extractStateByKeys12["default"])(_this3.state, storedStateKeys),
                        entireStoredState = _extractStateByKeys6.partialState;

                    var currentStoredState = Object.assign({}, entireStoredState, partialState);
                    localStorage.setItem('CCSS_' + ccUniqueKey, JSON.stringify(currentStoredState));
                  }

                  refStore.setState(ccUniqueKey, partialState);
                }
              } //确保forceUpdate能够刷新cc实例


              if (calledBy !== FORCE_UPDATE && !_util["default"].isObjectNotNull(state)) {
                if (next) next();
                return;
              }

              var thisState = _this3.state;
              computeValueForRef(_this3.cc.computed, _this3.cc.refComputed, thisState, state);
              var shouldCurrentRefUpdate = watchValueForRef(_this3.cc.watch, thisState, state);

              if (shouldCurrentRefUpdate === false) {
                if (next) next();
              }

              if (_this3.$$beforeSetState) {
                if (asyncLifecycleHook) {
                  _this3.$$beforeSetState({
                    state: state
                  });

                  _this3.cc.reactSetState(state, reactCallback);

                  if (next) next();
                } else {
                  // if user don't call next in ccIns's $$beforeSetState,reactSetState will never been invoked
                  // $$beforeSetState(context, next){}
                  _this3.$$beforeSetState({
                    state: state
                  }, function () {
                    _this3.cc.reactSetState(state, reactCallback);

                    if (next) next();
                  });
                }
              } else {
                _this3.cc.reactSetState(state, reactCallback);

                if (next) next();
              }
            },
            prepareBroadcastGlobalState: function prepareBroadcastGlobalState(identity, broadcastTriggeredBy, globalState, delay) {
              //!!! save global state to store
              var _getAndStoreValidGlob = (0, _getAndStoreValidGlobalState["default"])(globalState, currentModule, ccClassKey),
                  validGlobalState = _getAndStoreValidGlob.partialState,
                  isStateEmpty = _getAndStoreValidGlob.isStateEmpty;

              var startBroadcastGlobalState = function startBroadcastGlobalState() {
                if (!isStateEmpty) {
                  if (_this3.$$beforeBroadcastState) {
                    //check if user define a life cycle hook $$beforeBroadcastState
                    if (asyncLifecycleHook) {
                      _this3.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      });

                      _this3.cc.broadcastGlobalState(identity, validGlobalState);
                    } else {
                      _this3.$$beforeBroadcastState({
                        broadcastTriggeredBy: broadcastTriggeredBy
                      }, function () {
                        _this3.cc.broadcastGlobalState(identity, validGlobalState);
                      });
                    }
                  } else {
                    _this3.cc.broadcastGlobalState(identity, validGlobalState);
                  }
                }
              };

              if (delay > 0) {
                var feature = _util["default"].computeFeature(ccUniqueKey, globalState);

                (0, _runLater["default"])(startBroadcastGlobalState, feature, delay);
              } else {
                startBroadcastGlobalState();
              }
            },
            prepareBroadcastState: function prepareBroadcastState(stateFor, broadcastTriggeredBy, moduleName, committedState, needClone, delay, identity) {
              var targetSharedStateKeys, targetGlobalStateKeys;

              try {
                var isDispatcher = _this3.cc.ccClassKey === _constant.CC_DISPATCHER;
                var result = getSuitableGlobalStateKeysAndSharedStateKeys(isDispatcher, stateFor, moduleName, globalStateKeys, sharedStateKeys);
                targetSharedStateKeys = result.sharedStateKeys;
                targetGlobalStateKeys = result.globalStateKeys;
              } catch (err) {
                return justWarning(err.message + " prepareBroadcastState failed!");
              }

              var skipBroadcastRefState = false;

              if (stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY) {
                if (targetSharedStateKeys.length === 0 && targetGlobalStateKeys.length === 0) {
                  skipBroadcastRefState = true;
                }
              }

              var _extractStateToBeBroa = extractStateToBeBroadcasted(moduleName, committedState, targetSharedStateKeys, targetGlobalStateKeys),
                  isPartialSharedStateEmpty = _extractStateToBeBroa.isPartialSharedStateEmpty,
                  isPartialGlobalStateEmpty = _extractStateToBeBroa.isPartialGlobalStateEmpty,
                  partialSharedState = _extractStateToBeBroa.partialSharedState,
                  partialGlobalState = _extractStateToBeBroa.partialGlobalState,
                  module_globalState_ = _extractStateToBeBroa.module_globalState_; //!!! save state to store


              if (!isPartialSharedStateEmpty) ccStoreSetState(moduleName, partialSharedState);
              if (!isPartialGlobalStateEmpty) ccStoreSetState(_constant.MODULE_GLOBAL, partialGlobalState);

              var startBroadcastState = function startBroadcastState() {
                if (_this3.$$beforeBroadcastState) {
                  //check if user define a life cycle hook $$beforeBroadcastState
                  if (asyncLifecycleHook) {
                    _this3.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    }, function () {
                      _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                    });
                  } else {
                    _this3.$$beforeBroadcastState({
                      broadcastTriggeredBy: broadcastTriggeredBy
                    });

                    _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                  }
                } else {
                  _this3.cc.broadcastState(skipBroadcastRefState, committedState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity);
                }
              };

              if (delay > 0) {
                var feature = _util["default"].computeFeature(ccUniqueKey, committedState);

                (0, _runLater["default"])(startBroadcastState, feature, delay);
              } else {
                startBroadcastState();
              }
            },
            broadcastState: function broadcastState(skipBroadcastRefState, originalState, stateFor, moduleName, partialSharedState, partialGlobalState, module_globalState_, needClone, identity) {
              if (skipBroadcastRefState === false) {
                var _partialSharedState = partialSharedState;
                if (needClone) _partialSharedState = _util["default"].clone(partialSharedState); // this clone operation may cause performance issue, if partialSharedState is too big!!

                var currentCcKey = _this3.cc.ccState.ccUniqueKey;
                var ccClassKey_isHandled_ = {}; //record which ccClassKey has been handled
                // if stateFor === STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, it means currentCcInstance has triggered reactSetState
                // so flag ignoreCurrentCcKey as true;

                var ignoreCurrentCcKey = stateFor === _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
                var ccClassKeys = moduleName_ccClassKeys_[moduleName];

                if (ccClassKeys) {
                  //  these ccClass are watching the same module's state
                  ccClassKeys.forEach(function (ccClassKey) {
                    //  flag this ccClassKey been handled
                    ccClassKey_isHandled_[ccClassKey] = true;
                    var classContext = ccClassKey_ccClassContext_[ccClassKey];
                    var ccKeys = classContext.ccKeys,
                        sharedStateKeys = classContext.sharedStateKeys,
                        globalStateKeys = classContext.globalStateKeys;
                    if (ccKeys.length === 0) return;
                    if (sharedStateKeys.length === 0 && globalStateKeys.length === 0) return; //  extract _partialSharedState again! because different class with a same module may have different sharedStateKeys!!!

                    var _extractStateByKeys7 = (0, _extractStateByKeys12["default"])(_partialSharedState, sharedStateKeys, true),
                        sharedStateForCurrentCcClass = _extractStateByKeys7.partialState,
                        isSharedStateEmpty = _extractStateByKeys7.isStateEmpty; //  extract sourcePartialGlobalState again! because different class watch different globalStateKeys.
                    //  it is ok here if current ccClass's globalStateKeys include mappedGlobalKeys or not！
                    //  partialGlobalState is prepared for this module especially by method getSuitableGlobalStateKeysAndSharedStateKeys
                    //  just call extract state from partialGlobalState to get globalStateForCurrentCcClass


                    var _extractStateByKeys8 = (0, _extractStateByKeys12["default"])(partialGlobalState, globalStateKeys, true),
                        globalStateForCurrentCcClass = _extractStateByKeys8.partialState,
                        isPartialGlobalStateEmpty = _extractStateByKeys8.isStateEmpty;

                    if (isSharedStateEmpty && isPartialGlobalStateEmpty) return;
                    var mergedStateForCurrentCcClass = Object.assign({}, globalStateForCurrentCcClass, sharedStateForCurrentCcClass);
                    ccKeys.forEach(function (ccKey) {
                      if (ccKey === currentCcKey && ignoreCurrentCcKey) return;
                      var ref = ccKey_ref_[ccKey];

                      if (ref) {
                        var option = ccKey_option_[ccKey];
                        var toSet = null;

                        if (option.syncSharedState && option.syncGlobalState) {
                          toSet = mergedStateForCurrentCcClass;
                        } else if (option.syncSharedState) {
                          toSet = sharedStateForCurrentCcClass;
                        } else if (option.syncGlobalState) {
                          toSet = globalStateForCurrentCcClass;
                        }

                        if (toSet) {
                          if (_ccContext["default"].isDebug) {
                            console.log(ss("received state for ref " + ccKey + " is broadcasted from same module's other ref " + currentCcKey), cl());
                          }

                          ref.cc.prepareReactSetState(identity, 'broadcastState', toSet, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                        }

                        ;
                      }
                    });
                  });
                }

                if (_util["default"].isObjectNotNull(module_globalState_)) {
                  var moduleNames = Object.keys(module_globalState_);
                  moduleNames.forEach(function (mName) {
                    var partialGlobalState = module_globalState_[mName];
                    var ccClassKeys = moduleName_ccClassKeys_[mName];
                    ccClassKeys.forEach(function (ccClassKey) {
                      var classContext = ccClassKey_ccClassContext_[ccClassKey];
                      var ccKeys = classContext.ccKeys,
                          globalStateKeys = classContext.globalStateKeys;
                      if (ccKeys.length === 0) return;
                      if (globalStateKeys.length === 0) return;

                      var _extractStateByKeys9 = (0, _extractStateByKeys12["default"])(partialGlobalState, globalStateKeys),
                          globalStateForCurrentCcClass = _extractStateByKeys9.partialState,
                          isPartialGlobalStateEmpty = _extractStateByKeys9.isStateEmpty;

                      if (isPartialGlobalStateEmpty) return;
                      ccKeys.forEach(function (ccKey) {
                        var ref = ccKey_ref_[ccKey];

                        if (ref) {
                          var option = ccKey_option_[ccKey];

                          if (option.syncGlobalState) {
                            if (_ccContext["default"].isDebug) {
                              console.log(ss("ref " + ccKey + " to be rendered state(only global state) is broadcast from other module " + moduleName), cl());
                            }

                            ref.cc.prepareReactSetState(identity, 'broadcastState', globalStateForCurrentCcClass, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                          }
                        }
                      });
                    });
                  });
                }
              } //!!! 注意，这里要把global提出来播，例如一个属于$$default模块的实例提交得有$$global模块的数据，是需要被播出去的


              var _extractStateByKeys10 = (0, _extractStateByKeys12["default"])(originalState, _ccContext["default"].globalStateKeys),
                  toToBroadcastGlobalState = _extractStateByKeys10.partialState,
                  isEmptyG = _extractStateByKeys10.isStateEmpty;

              if (!isEmptyG) {
                broadcastConnectedState(_constant.MODULE_GLOBAL, toToBroadcastGlobalState);
              }

              broadcastConnectedState(moduleName, originalState);
            },
            broadcastGlobalState: function broadcastGlobalState(identity, globalSate) {
              globalCcClassKeys.forEach(function (ccClassKey) {
                var classContext = ccClassKey_ccClassContext_[ccClassKey];
                var globalStateKeys = classContext.globalStateKeys,
                    ccKeys = classContext.ccKeys;

                var _extractStateByKeys11 = (0, _extractStateByKeys12["default"])(globalSate, globalStateKeys),
                    partialState = _extractStateByKeys11.partialState,
                    isStateEmpty = _extractStateByKeys11.isStateEmpty;

                if (!isStateEmpty) {
                  ccKeys.forEach(function (ccKey) {
                    var ref = ccKey_ref_[ccKey];

                    if (ref) {
                      var option = ccKey_option_[ccKey];

                      if (option.syncGlobalState === true) {
                        ref.cc.prepareReactSetState(identity, 'broadcastGlobalState', partialState, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY);
                      }
                    }
                  });
                }
              });
              broadcastConnectedState(_constant.MODULE_GLOBAL, globalSate);
            },
            emit: function emit(event) {
              for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
                args[_key7 - 1] = arguments[_key7];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, {
                identity: null
              }].concat(args));
            },
            emitIdentity: function emitIdentity(event, identity) {
              for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                args[_key8 - 2] = arguments[_key8];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, {
                identity: identity
              }].concat(args));
            },
            emitWith: function emitWith(event, option) {
              for (var _len9 = arguments.length, args = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
                args[_key9 - 2] = arguments[_key9];
              }

              ev.findEventHandlersToPerform.apply(ev, [event, option].concat(args));
            },
            on: function on(event, handler) {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, null, handler);
            },
            onIdentity: function onIdentity(event, identity, handler) {
              ev.bindEventHandlerToCcContext(currentModule, ccClassKey, ccUniqueKey, event, identity, handler);
            },
            off: function off(event, _temp3) {
              var _ref3 = _temp3 === void 0 ? {} : _temp3,
                  module = _ref3.module,
                  ccClassKey = _ref3.ccClassKey,
                  identity = _ref3.identity;

              //  consider if module === currentModule, let off happened?
              ev.findEventHandlersToOff(event, {
                module: module,
                ccClassKey: ccClassKey,
                identity: identity
              });
            }
          };
          var thisCC = this.cc; // when call $$dispatch in a ccInstance, state extraction strategy will be STATE_FOR_ONE_CC_INSTANCE_FIRSTLY

          var d = this.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);

          var di = this.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1, ccKey); //ccKey is identity by default


          this.$$lazyDispatch = this.__$$getDispatchHandler(true, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, currentModule, null, null, null, -1);
          this.$$d = d;
          this.$$di = di;
          this.$$dispatch = d;
          this.$$dispatchIdentity = di;
          this.$$dispatchForModule = this.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, currentModule, null, null, null, -1);
          this.$$invoke = this.__$$getInvokeHandler(ccKey, ccUniqueKey);
          this.$$xinvoke = this.__$$getXInvokeHandler(ccKey, ccUniqueKey);
          this.$$effect = this.__$$getEffectHandler(ccKey, ccUniqueKey);
          this.$$xeffect = this.__$$getXEffectHandler(ccKey, ccUniqueKey);
          this.$$emit = thisCC.emit;
          this.$$emitIdentity = thisCC.emitIdentity;
          this.$$emitWith = thisCC.emitWith;
          this.$$on = thisCC.on;
          this.$$onIdentity = thisCC.onIdentity;
          this.$$off = thisCC.off;
          this.$$moduleComputed = thisCC.moduleComputed = _computedValue[currentModule] || {};
          this.$$globalComputed = thisCC.globalComputed = _computedValue[_constant.MODULE_GLOBAL] || {};
          this.$$connectedComputed = thisCC.connectedComputed = ccClassContext.connectedComputed;
          this.$$forceSyncState = thisCC.forceSyncState; // add$$ prefix, to let user it is cc api

          this.setState = thisCC.setState; //let setState call cc.setState

          this.setGlobalState = thisCC.setGlobalState; //let setState call cc.setState

          this.forceUpdate = thisCC.forceUpdate; //let forceUpdate call cc.forceUpdate
        } // this method is useful only if you want to change other ccInstance's sate one time in a ccInstance which its syncSharedState is false, 
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
        ;

        _proto.$$changeState = function $$changeState(state, _temp4) {
          var _this4 = this;

          var _ref4 = _temp4 === void 0 ? {} : _temp4,
              ccKey = _ref4.ccKey,
              ccUniqueKey = _ref4.ccUniqueKey,
              _ref4$stateFor = _ref4.stateFor,
              stateFor = _ref4$stateFor === void 0 ? _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY : _ref4$stateFor,
              module = _ref4.module,
              broadcastTriggeredBy = _ref4.broadcastTriggeredBy,
              forceSync = _ref4.forceSync,
              reactCallback = _ref4.cb,
              type = _ref4.type,
              reducerModule = _ref4.reducerModule,
              calledBy = _ref4.calledBy,
              fnName = _ref4.fnName,
              _ref4$delay = _ref4.delay,
              delay = _ref4$delay === void 0 ? -1 : _ref4$delay,
              identity = _ref4.identity;

          //executionContext
          if (state == undefined) return; //do nothing
          // const isControlledByConcent = this.cc.ccState.isControlledByConcent;

          if (!(0, _util.isPlainJsonObject)(state)) {
            justWarning("cc found your commit state is not a plain json object!");
            return;
          }

          var _doChangeState = function _doChangeState() {
            if (module == _constant.MODULE_GLOBAL) {
              _this4.cc.prepareBroadcastGlobalState(identity, broadcastTriggeredBy, state, delay);
            } else {
              var ccState = _this4.cc.ccState;
              var currentModule = ccState.module;
              var btb = broadcastTriggeredBy || _constant.BROADCAST_TRIGGERED_BY_CC_INSTANCE_METHOD;

              if (module === currentModule) {
                // who trigger $$changeState, who will change the whole received state 
                _this4.cc.prepareReactSetState(identity, calledBy, state, stateFor, function () {
                  //if forceSync=true, cc clone the input state
                  if (forceSync === true) {
                    _this4.cc.prepareBroadcastState(stateFor, btb, module, state, true, delay, identity);
                  } else if (ccState.ccOption.syncSharedState) {
                    _this4.cc.prepareBroadcastState(stateFor, btb, module, state, false, delay, identity);
                  } else {// stop broadcast state!
                  }
                }, reactCallback);
              } else {
                if (forceSync) justWarning("you are trying change another module's state, forceSync=true in not allowed, cc will ignore it!" + vbi("module:" + module + " currentModule" + currentModule));
                if (reactCallback) justWarning("callback for react.setState will be ignore"); //触发修改转态的实例所属模块和目标模块不一致的时候，这里的stateFor必须是是OF_ONE_MODULE

                _this4.cc.prepareBroadcastState(_constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, btb, module, state, true, delay, identity);
              }
            }
          };

          var middlewaresLen = middlewares.length;

          if (middlewaresLen > 0) {
            var passToMiddleware = {
              ccKey: ccKey,
              ccUniqueKey: ccUniqueKey,
              state: state,
              stateFor: stateFor,
              module: module,
              reducerModule: reducerModule,
              type: type,
              broadcastTriggeredBy: broadcastTriggeredBy,
              forceSync: forceSync,
              calledBy: calledBy,
              fnName: fnName
            };
            var index = 0;

            var next = function next() {
              if (index === middlewaresLen) {
                // all middlewares been executed
                _doChangeState();
              } else {
                var middlewareFn = middlewares[index];
                index++;
                middlewareFn(passToMiddleware, next);
              }
            };

            next();
          } else {
            _doChangeState();
          }
        } //executionContext: { module:string, forceSync:boolean, cb }
        ;

        _proto.__$$getChangeStateHandler = function __$$getChangeStateHandler(executionContext) {
          var _this5 = this;

          return function (state) {
            return _this5.$$changeState(state, executionContext);
          };
        };

        _proto.__$$getInvokeHandler = function __$$getInvokeHandler(ccKey, ccUniqueKey) {
          return this.__$$makeInvokeHandler(ccKey, ccUniqueKey, false, 'invoke');
        };

        _proto.__$$getXInvokeHandler = function __$$getXInvokeHandler(ccKey, ccUniqueKey) {
          return this.__$$makeInvokeHandler(ccKey, ccUniqueKey, true, 'xinvoke');
        };

        _proto.__$$makeInvokeHandler = function __$$makeInvokeHandler(ccKey, ccUniqueKey, giveContextToUserLoginFn, methodName) {
          var _this6 = this;

          if (giveContextToUserLoginFn === void 0) {
            giveContextToUserLoginFn = false;
          }

          return function (firstParam) {
            var firstParamType = typeof firstParam;
            var err = new Error("param type error, correct usage: " + methodName + "(userFn:function, ...args:any[]) or " + methodName + "(option:{fn:function, delay:number, identity:string}, ...args:any[])");

            for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
              args[_key10 - 1] = arguments[_key10];
            }

            if (firstParamType === 'function') {
              var _this6$cc;

              return (_this6$cc = _this6.cc).__invoke.apply(_this6$cc, [firstParam, {
                context: giveContextToUserLoginFn,
                methodName: methodName,
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey
              }].concat(args));
            } else if (firstParamType === 'object') {
              var _this6$cc2;

              //firstParam: {fn:function, delay:number, identity:string}
              // const { fn, ...option } = firstParam;//防止某些版本的create-react-app运行瓷出错，这里不采用对象延展符的写法
              var fn = firstParam.fn;
              delete firstParam.fn;
              var option = firstParam;

              if (typeof fn != 'function') {
                throw err;
              }

              option.context = giveContextToUserLoginFn;
              option.methodName = methodName;
              option.ccKey = ccKey;
              option.ccUniqueKey = ccUniqueKey;
              return (_this6$cc2 = _this6.cc).__invoke.apply(_this6$cc2, [fn, option].concat(args));
            } else {
              throw err;
            } // return ()=>{}

          };
        };

        _proto.__$$getEffectHandler = function __$$getEffectHandler(ccKey, ccUniqueKey) {
          return this.__$$makeEffectHandler(ccKey, ccUniqueKey, false, 'effect');
        };

        _proto.__$$getXEffectHandler = function __$$getXEffectHandler(ccKey, ccUniqueKey) {
          return this.__$$makeEffectHandler(ccKey, ccUniqueKey, true, 'xeffect');
        };

        _proto.__$$makeEffectHandler = function __$$makeEffectHandler(ccKey, ccUniqueKey, giveContextToUserLoginFn, methodName) {
          var _this7 = this;

          if (giveContextToUserLoginFn === void 0) {
            giveContextToUserLoginFn = false;
          }

          return function (firstParam, userLogicFn) {
            var firstParamType = typeof firstParam;

            for (var _len11 = arguments.length, args = new Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
              args[_key11 - 2] = arguments[_key11];
            }

            if (firstParamType === 'string') {
              var _this7$cc;

              return (_this7$cc = _this7.cc).__effect.apply(_this7$cc, [firstParam, userLogicFn, {
                context: giveContextToUserLoginFn,
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                methodName: methodName
              }].concat(args));
            } else if (firstParamType === 'object') {
              var _this7$cc2;

              var _module2 = firstParam.module,
                  _firstParam$delay = firstParam.delay,
                  delay = _firstParam$delay === void 0 ? -1 : _firstParam$delay,
                  identity = firstParam.identity;
              var option = {
                module: _module2,
                delay: delay,
                identity: identity,
                context: giveContextToUserLoginFn,
                methodName: methodName,
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey
              };
              return (_this7$cc2 = _this7.cc).__effect.apply(_this7$cc2, [_module2, userLogicFn, option].concat(args));
            } else {
              throw new Error("param type error, correct usage: " + methodName + "(module:string, ...args:any[]) or " + methodName + "(option:{module:string, delay:number, identity:string}, ...args:any[])");
            }
          };
        };

        _proto.__$$getDispatchHandler = function __$$getDispatchHandler(isLazy, ccKey, ccUniqueKey, ccClassKey, stateFor, targetModule, targetReducerModule, inputType, inputPayload, delay, defaultIdentity, chainId, chainDepth, oriChainId // sourceModule, oriChainId, oriChainDepth
        ) {
          var _this8 = this;

          if (delay === void 0) {
            delay = -1;
          }

          if (defaultIdentity === void 0) {
            defaultIdentity = '';
          }

          return function (paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) {
            if (paramObj === void 0) {
              paramObj = {};
            }

            var _chainId, _chainDepth, _oriChainId; // let  _oriChainId, _oriChainDepth;
            //忽略掉传递进来的chainId，chainDepth，重新生成它们，源头调用了lazyDispatch或者ctx里调用了lazyDispatch，就会触发此逻辑


            if (isLazy === true) {
              _chainId = (0, _chain.getChainId)();
              _chainDepth = 1;
              (0, _chain.setChainIdLazy)(_chainId);
            } else {
              _chainId = chainId || (0, _chain.getChainId)();
              _chainDepth = chainDepth || 1;
            } //因为$$dispatch是不传递oriChainId 和 oriChainDepth的，所以这里可以安全赋值为上面的_chainId 和 _chainDepth
            //而ctx.dispatch是一直要传递oriChainId 和 oriChainDepth的，这样就可以精确知道调用链的最初id了
            //注意，对于源头来说，chainId oriChainId是一样的，chainDepth和oriChainDepth 也是一样的，
            // 所以后面分发状态前始终用chainId来收集状态, 用chainDepth===1来判断一次性提交状态，是ok的


            _oriChainId = oriChainId || _chainId; // _oriChainDepth = oriChainDepth || _chainDepth;

            var paramObjType = typeof paramObj;

            var _module = targetModule,
                _reducerModule,
                _forceSync = false,
                _type,
                _payload = inputPayload,
                _cb,
                _delay = delay;

            var _identity = defaultIdentity;

            if (paramObjType === 'object') {
              var _paramObj = paramObj,
                  _paramObj$module = _paramObj.module,
                  _module3 = _paramObj$module === void 0 ? targetModule : _paramObj$module,
                  _reducerModule2 = _paramObj.reducerModule,
                  _paramObj$forceSync = _paramObj.forceSync,
                  forceSync = _paramObj$forceSync === void 0 ? false : _paramObj$forceSync,
                  _paramObj$type = _paramObj.type,
                  type = _paramObj$type === void 0 ? inputType : _paramObj$type,
                  _paramObj$payload = _paramObj.payload,
                  payload = _paramObj$payload === void 0 ? inputPayload : _paramObj$payload,
                  cb = _paramObj.cb,
                  _paramObj$delay = _paramObj.delay,
                  _delay2 = _paramObj$delay === void 0 ? -1 : _paramObj$delay,
                  identity = _paramObj.identity;

              _module = _module3;
              _reducerModule = _reducerModule2 || _module3;
              _forceSync = forceSync;
              _type = type;
              _payload = payload;
              _cb = cb;
              _delay = _delay2;
              if (identity) _identity = identity;
            } else if (paramObjType === 'string') {
              var slashCount = paramObj.split('').filter(function (v) {
                return v === '/';
              }).length;
              _payload = payloadWhenFirstParamIsString;
              if (userInputIdentity) _identity = userInputIdentity;
              if (userInputDelay !== undefined) _delay = userInputDelay;

              if (slashCount === 0) {
                _type = paramObj;
              } else if (slashCount === 1) {
                var _paramObj$split = paramObj.split('/'),
                    _module4 = _paramObj$split[0],
                    _type2 = _paramObj$split[1];

                _module = _module4;
                _reducerModule = _module;
                _type = _type2;
              } else if (slashCount === 2) {
                var _paramObj$split2 = paramObj.split('/'),
                    _module5 = _paramObj$split2[0],
                    _reducerModule3 = _paramObj$split2[1],
                    _type3 = _paramObj$split2[2];

                if (_module5 === '' || _module5 === ' ') _module = targetModule; //paramObj may like: /foo/changeName
                else _module = _module5;
                _module = _module5;
                _reducerModule = _reducerModule3;
                _type = _type3;
              } else {
                return Promise.reject(me(_constant.ERR.CC_DISPATCH_STRING_INVALID, vbi(paramObj)));
              }
            } else {
              return Promise.reject(me(_constant.ERR.CC_DISPATCH_PARAM_INVALID));
            }

            if (_module === '*') {
              return Promise.reject('cc instance api dispatch do not support multi dispatch, please use top api[cc.dispatch] instead!');
            } // pick user input reducerModule firstly


            var nowReducerModule = _reducerModule || targetReducerModule || module;
            var p = new Promise(function (resolve, reject) {
              _this8.cc.dispatch({
                stateFor: stateFor,
                module: _module,
                reducerModule: nowReducerModule,
                forceSync: _forceSync,
                type: _type,
                payload: _payload,
                cb: _cb,
                __innerCb: _promiseErrorHandler(resolve, reject),
                ccKey: ccKey,
                ccUniqueKey: ccUniqueKey,
                ccClassKey: ccClassKey,
                delay: _delay,
                identity: _identity,
                isLazy: isLazy,
                chainId: _chainId,
                chainDepth: _chainDepth,
                oriChainId: _oriChainId // oriChainId: _oriChainId, oriChainDepth: _oriChainDepth, sourceModule: _sourceModule,

              });
            })["catch"](_catchCcError["default"]);
            return p;
          };
        };

        _proto.$$domDispatch = function $$domDispatch(event) {
          var currentTarget = event.currentTarget;
          var value = currentTarget.value,
              dataset = currentTarget.dataset;
          var type = dataset.cct,
              module = dataset.ccm,
              reducerModule = dataset.ccrm,
              _dataset$ccdelay = dataset.ccdelay,
              ccdelay = _dataset$ccdelay === void 0 ? -1 : _dataset$ccdelay,
              _dataset$ccidt = dataset.ccidt,
              ccidt = _dataset$ccidt === void 0 ? '' : _dataset$ccidt;
          var payload = {
            event: event,
            dataset: dataset,
            value: value
          };
          var _this$cc = this.cc,
              ccKey = _this$cc.ccKey,
              ccUniqueKey = _this$cc.ccUniqueKey;

          var handler = this.__$$getDispatchHandler(false, ccKey, ccUniqueKey, ccClassKey, _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, module, reducerModule, type, payload, ccdelay, ccidt);

          handler()["catch"](handleCcFnError);
        };

        _proto.$$toggleBool = function $$toggleBool(e, delay, idt) {
          var _this$__$$sync$bind;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind = {}, _this$__$$sync$bind[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind.type = 'bool', _this$__$$sync$bind.delay = delay, _this$__$$sync$bind.idt = idt, _this$__$$sync$bind));

          this.__$$sync({
            type: 'bool'
          }, e);
        };

        _proto.$$syncInt = function $$syncInt(e, delay, idt) {
          var _this$__$$sync$bind2;

          if (delay === void 0) {
            delay = -1;
          }

          if (idt === void 0) {
            idt = '';
          }

          if (typeof e === 'string') return this.__$$sync.bind(this, (_this$__$$sync$bind2 = {}, _this$__$$sync$bind2[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind2.type = 'int', _this$__$$sync$bind2.delay = delay, _this$__$$sync$bind2.idt = idt, _this$__$$sync$bind2));

          this.__$$sync({
            type: 'int'
          }, e);
        } // when CCSYNC_KEY:   stateFor=ccint, seat1=ccdelay, seat2=ccidt, seat3=stateFor
        ;

        _proto.$$sync = function $$sync(e, val, delay, idt) {
          if (typeof e === 'string') {
            var _this$__$$sync$bind3;

            return this.__$$sync.bind(this, (_this$__$$sync$bind3 = {}, _this$__$$sync$bind3[_constant.CCSYNC_KEY] = e, _this$__$$sync$bind3.type = 'val', _this$__$$sync$bind3.val = val, _this$__$$sync$bind3.delay = delay, _this$__$$sync$bind3.idt = idt, _this$__$$sync$bind3));
          } else if (e && e[_constant.MOCKE_KEY]) {
            this.__$$sync(e);
          }

          this.__$$sync({
            type: 'val'
          }, e);
        };

        _proto.__$$sync = function __$$sync(spec, e) {
          var mockE = null;

          if (spec[_constant.MOCKE_KEY]) {
            mockE = spec;
          } else if (spec[_constant.CCSYNC_KEY] !== undefined) {
            //来自$$sync生成的setter调用
            mockE = (0, _buildMockEvent["default"])(spec, e);
          } else {
            if ((0, _util.isEvent)(e)) mockE = e;
          }

          if (!mockE) return; //参数无效

          if (e && e.stopPropagation) e.stopPropagation();
          var currentTarget = mockE.currentTarget;
          var dataset = currentTarget.dataset;
          var ccsync = dataset.ccsync,
              ccint = dataset.ccint,
              ccdelay = dataset.ccdelay,
              ccidt = dataset.ccidt;
          var value = currentTarget.value;
          var currentModule = this.cc.ccState.module;
          var _module = currentModule;

          if (ccsync.includes('/')) {
            _module = ccsync.split('/')[0];
          }

          var fullState = _module !== currentModule ? getState(_module) : this.state;

          var _extractStateByCcsync = (0, _extractStateByCcsync2["default"])(ccsync, value, ccint, fullState, mockE.isToggleBool),
              state = _extractStateByCcsync.state;

          var targetStateFor = mockE.stateFor;

          if (!targetStateFor) {
            targetStateFor = _module !== currentModule ? _constant.STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE : _constant.STATE_FOR_ONE_CC_INSTANCE_FIRSTLY;
          }

          this.$$changeState(state, {
            ccKey: this.cc.ccKey,
            stateFor: targetStateFor,
            module: _module,
            delay: ccdelay,
            identity: ccidt
          });
        };

        _proto.componentDidUpdate = function componentDidUpdate() {
          if (_TargetClass.prototype.componentDidUpdate) _TargetClass.prototype.componentDidUpdate.call(this);
          if (this.$$afterSetState) this.$$afterSetState();
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this$cc$ccState = this.cc.ccState,
              ccUniqueKey = _this$cc$ccState.ccUniqueKey,
              ccClassKey = _this$cc$ccState.ccClassKey;
          ev.offEventHandlersByCcUniqueKey(ccUniqueKey);
          (0, _unsetRef["default"])(ccClassKey, ccUniqueKey); //if father component implement componentWillUnmount，call it again

          if (_TargetClass.prototype.componentWillUnmount) _TargetClass.prototype.componentWillUnmount.call(this);
        };

        _proto.render = function render() {
          if (_ccContext["default"].isDebug) {
            console.log(ss("@@@ render " + ccClassDisplayName(ccClassKey)), cl());
          }

          if (extendInputClass) {
            //now cc class extends ReactClass, call super.render()
            return _TargetClass.prototype.render.call(this);
          } else {
            // now cc class extends ReactComponent, render user inputted ReactClass
            var props = Object.assign(this, this.props);

            if (!this.cc.childRef) {
              throw new Error('you forgot to call this.props.$$attach(this) in componentWillMount!');
            }

            this.cc.childRef.state = this.state;
            return _react["default"].createElement(ReactClass, props);
          }
        };

        return CcClass;
      }(TargetClass);

      if (ccClassKey === _constant.CC_DISPATCHER) CcClass.displayName = 'CcDispatcher';else CcClass.displayName = ccClassDisplayName(ccClassKey);
      return CcClass;
    };
  } catch (err) {
    (0, _catchCcError["default"])(err);
  }
}