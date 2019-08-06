"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _getFeatureStrAndCmkmapping = _interopRequireDefault(require("./get-feature-str-and-cmkmapping"));

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var featureStr_classKey_ = _ccContext["default"].featureStr_classKey_;

var errCcClassKey = function errCcClassKey(classKey) {
  return new Error("classKey[" + classKey + "] is already declared before");
};

var NO_OTHER_SPEC = 'nos';

function checkClassKey(classKey, featureStr, connectedModuleNames, connectedModuleKeyMapping) {
  var ccClassKey = featureStr_classKey_[featureStr];

  if (ccClassKey) {
    // 如果显式的指定了classKey，相同的connect对象，必需指定相同的classKey
    if (ccClassKey !== classKey) {
      throw errCcClassKey(classKey);
    }
  } else {
    ccClassKey = featureStr_classKey_[featureStr] = classKey;
  }

  return {
    ccClassKey: ccClassKey,
    connectedModuleNames: connectedModuleNames,
    connectedModuleKeyMapping: connectedModuleKeyMapping
  };
}
/**
 * 根据connect参数动态的把CcFragment、CcHookFragment 划为某个ccClassKey的实例，同时计算出stateToPropMapping值
 * 
 * 允许，相同connect，相同module的registerDumb调用指定同样的classKey
 * 
 * @param connectSpec 形如: {foo:'*', bar:['b1', 'b2']}
 */


function _default(connectSpec, fragmentModule, fragmentPrefix, watchedKeys, classKey) {
  if (classKey === void 0) {
    classKey = '';
  }

  var _getFeatureStrAndCmkM = (0, _getFeatureStrAndCmkmapping["default"])(connectSpec, fragmentModule, fragmentPrefix, watchedKeys),
      featureStr = _getFeatureStrAndCmkM.featureStr,
      connectedModuleKeyMapping = _getFeatureStrAndCmkM.connectedModuleKeyMapping,
      connectedModuleNames = _getFeatureStrAndCmkM.connectedModuleNames;

  if (classKey.startsWith(_constant.CC_PREFIX)) {
    //严格校验用户传入了classKey
    throw new Error("user can not specify a classKey[" + ccClassKey + "] starts with $$Cc");
  } //代表没有connect到store任何模块的CcFragment，也没有指定具体属于哪个模块


  if (!util.isObjectNotNull(connectSpec) && fragmentModule === _constant.MODULE_DEFAULT) {
    if (classKey) {
      return checkClassKey(classKey, NO_OTHER_SPEC, connectedModuleNames, connectedModuleKeyMapping);
    }

    return {
      ccClassKey: fragmentPrefix + "_0",
      connectedModuleKeyMapping: null
    };
  }

  var ccClassKey = featureStr_classKey_[featureStr];

  if (ccClassKey) {
    return {
      ccClassKey: ccClassKey,
      connectedModuleKeyMapping: connectedModuleKeyMapping,
      connectedModuleNames: connectedModuleNames
    };
  } else {
    var oldFragmentNameCount = _ccContext["default"].fragmentNameCount;
    var fragmentNameCount = oldFragmentNameCount + 1;
    _ccContext["default"].fragmentNameCount = fragmentNameCount;
    ccClassKey = fragmentPrefix + "_" + fragmentNameCount;
    featureStr_classKey_[featureStr] = ccClassKey;
    return {
      ccClassKey: ccClassKey,
      connectedModuleKeyMapping: connectedModuleKeyMapping,
      connectedModuleNames: connectedModuleNames
    };
  }
}