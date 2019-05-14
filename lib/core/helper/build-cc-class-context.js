"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var _util = _interopRequireDefault(require("../../support/util"));

var _setPropState2 = _interopRequireDefault(require("./set-prop-state"));

var me = _util["default"].makeError,
    vbi = _util["default"].verboseInfo,
    throwCcHmrError = _util["default"].throwCcHmrError;

function _throwPropDuplicateError(prefixedKey, module) {
  throw me("cc found different module has same key, you need give the key a alias explicitly! or you can set isPropStateModuleMode=true to avoid this error", vbi("the prefixedKey is " + prefixedKey + ", module is:" + module));
}

function _getPropKeyPair(isPropStateModuleMode, module, propKey) {
  if (isPropStateModuleMode === true) {
    return {
      moduledPropKey: module + "/" + propKey,
      originalPropKey: propKey
    };
  } else {
    return {
      moduledPropKey: propKey,
      originalPropKey: propKey
    };
  }
}

function _default(ccClassKey, moduleName, originalSharedStateKeys, originalGlobalStateKeys, sharedStateKeys, globalStateKeys, stateToPropMapping, isPropStateModuleMode, forCcFragment) {
  if (forCcFragment === void 0) {
    forCcFragment = false;
  }

  var contextMap = _ccContext["default"].ccClassKey_ccClassContext_;
  var ccClassContext = contextMap[ccClassKey];

  if (forCcFragment === true) {
    //if this is called fro CcFragment, just reuse  ccClassContext;
    if (ccClassContext === undefined) {
      ccClassContext = _util["default"].makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
    }
  } else {
    if (ccClassContext !== undefined) {
      throwCcHmrError(me(_constant.ERR.CC_CLASS_KEY_DUPLICATE, "ccClassKey:" + ccClassKey + " duplicate"));
    }

    ccClassContext = _util["default"].makeCcClassContext(moduleName, sharedStateKeys, globalStateKeys, originalSharedStateKeys, originalGlobalStateKeys);
  }

  var _state = _ccContext["default"].store._state;
  var propModuleName_ccClassKeys_ = _ccContext["default"].propModuleName_ccClassKeys_;

  if (stateToPropMapping != undefined) {
    var propKey_stateKeyDescriptor_ = ccClassContext.propKey_stateKeyDescriptor_;
    var stateKey_propKeyDescriptor_ = ccClassContext.stateKey_propKeyDescriptor_;
    var propState = ccClassContext.propState;

    if (typeof stateToPropMapping !== 'object') {
      throw me(_constant.ERR.CC_CLASS_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey);
    }

    var module_mapAllStateToProp_ = {};
    var module_sharedKey_ = {};
    var module_prefixedKeys_ = {};
    var prefixedKeys = Object.keys(stateToPropMapping);
    var len = prefixedKeys.length;

    for (var i = 0; i < len; i++) {
      var prefixedKey = prefixedKeys[i];

      if (!_util["default"].isPrefixedKeyValid(prefixedKey)) {
        throw me(_constant.ERR.CC_CLASS_KEY_OF_STATE_TO_PROP_MAPPING_INVALID, "ccClassKey:" + ccClassKey + ", key:" + prefixedKey);
      }

      var _prefixedKey$split = prefixedKey.split('/'),
          targetModule = _prefixedKey$split[0],
          targetKey = _prefixedKey$split[1];

      if (module_mapAllStateToProp_[targetModule] === true) {// ignore other keys...
      } else {
        if (targetKey === '*') {
          module_mapAllStateToProp_[targetModule] = true;
          module_sharedKey_[targetModule] = prefixedKey;
        } else {
          var modulePrefixedKeys = _util["default"].safeGetArrayFromObject(module_prefixedKeys_, targetModule);

          modulePrefixedKeys.push(prefixedKey);
          module_mapAllStateToProp_[targetModule] = false;
        }
      }
    }

    var targetModules = Object.keys(module_mapAllStateToProp_);
    var propKey_appeared_ = {}; //help cc to judge propKey is duplicated or not

    targetModules.forEach(function (module) {
      var moduleState = _state[module];

      if (moduleState === undefined) {
        throw me(_constant.ERR.CC_MODULE_NOT_FOUND, vbi("module:" + module + ", check your stateToPropMapping config!"));
      }

      var isPropStateSet = false;

      if (module_mapAllStateToProp_[module] === true) {
        var moduleStateKeys = Object.keys(moduleState);
        moduleStateKeys.forEach(function (msKey) {
          // now prop key equal state key if user declare key like m1/* in stateToPropMapping;
          var _getPropKeyPair2 = _getPropKeyPair(isPropStateModuleMode, module, msKey),
              moduledPropKey = _getPropKeyPair2.moduledPropKey,
              originalPropKey = _getPropKeyPair2.originalPropKey;

          var appeared = propKey_appeared_[moduledPropKey];

          if (appeared === true) {
            _throwPropDuplicateError(module_sharedKey_[module], module);
          } else {
            propKey_appeared_[moduledPropKey] = true; // moduledPropKey and moduledStateKey is equal

            propKey_stateKeyDescriptor_[moduledPropKey] = {
              module: module,
              originalStateKey: msKey,
              moduledStateKey: moduledPropKey
            };
            stateKey_propKeyDescriptor_[moduledPropKey] = {
              module: module,
              moduledPropKey: moduledPropKey,
              originalPropKey: originalPropKey
            };
            (0, _setPropState2["default"])(propState, msKey, moduleState[msKey], isPropStateModuleMode, module);
            isPropStateSet = true;
          }
        });
      } else {
        var _prefixedKeys = module_prefixedKeys_[module];

        _prefixedKeys.forEach(function (prefixedKey) {
          var _prefixedKey$split2 = prefixedKey.split('/'),
              stateModule = _prefixedKey$split2[0],
              stateKey = _prefixedKey$split2[1];

          var propKey = stateToPropMapping[prefixedKey];

          var _getPropKeyPair3 = _getPropKeyPair(isPropStateModuleMode, module, propKey),
              moduledPropKey = _getPropKeyPair3.moduledPropKey,
              originalPropKey = _getPropKeyPair3.originalPropKey;

          var appeared = propKey_appeared_[moduledPropKey];

          if (appeared === true) {
            _throwPropDuplicateError(prefixedKey, module);
          } else {
            propKey_appeared_[moduledPropKey] = true;
            var moduledStateKey = module + "/" + stateKey; // stateKey_propKeyDescriptor_ map's key must be moduledStateKey like 'foo/key', cause different module may include the same state key

            propKey_stateKeyDescriptor_[moduledPropKey] = {
              module: stateModule,
              originalStateKey: stateKey,
              moduledStateKey: moduledStateKey
            };
            stateKey_propKeyDescriptor_[moduledStateKey] = {
              module: stateModule,
              moduledPropKey: moduledPropKey,
              originalPropKey: originalPropKey,
              originalStateKey: stateKey
            };
            (0, _setPropState2["default"])(propState, propKey, moduleState[stateKey], isPropStateModuleMode, module);
            isPropStateSet = true;
          }
        });
      }

      if (isPropStateSet === true) {
        var pCcClassKeys = _util["default"].safeGetArrayFromObject(propModuleName_ccClassKeys_, module);

        if (!pCcClassKeys.includes(ccClassKey)) pCcClassKeys.push(ccClassKey);
      }
    });
    ccClassContext.stateToPropMapping = stateToPropMapping;
    ccClassContext.isPropStateModuleMode = isPropStateModuleMode;
  }

  contextMap[ccClassKey] = ccClassContext;
}