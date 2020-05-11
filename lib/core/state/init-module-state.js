"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

var checker = _interopRequireWildcard(require("../checker"));

var _guessDuplicate = _interopRequireDefault(require("../base/guess-duplicate"));

var refCache = _interopRequireWildcard(require("../ref/_cache"));

function _default(module, mState, moduleMustNotExisted) {
  if (moduleMustNotExisted === void 0) {
    moduleMustNotExisted = true;
  }

  refCache.createModuleNode(module); //force MODULE_VOID state as {}

  var state = module === _constant.MODULE_VOID ? {} : mState;

  try {
    checker.checkModuleNameAndState(module, state, moduleMustNotExisted);
  } catch (err) {
    (0, _guessDuplicate["default"])(err, module, 'state');
  }

  var ccStore = _ccContext["default"].store;
  var rootState = ccStore.getState();
  var rootStateVer = ccStore.getStateVer();
  var rootModuleVer = ccStore.getModuleVer();
  var prevRootState = ccStore.getPrevState();
  util.safeAssignToMap(rootState, module, state);
  util.safeAssignToMap(prevRootState, module, state);
  rootStateVer[module] = util.okeys(state).reduce(function (map, key) {
    map[key] = 1;
    return map;
  }, {});
  rootModuleVer[module] = 1; // 把_computedValueOri safeGet从init-module-computed调整到此处
  // 防止用户不定义任何computed，而只是定义watch时报错undefined

  var cu = _ccContext["default"].computed;
  util.safeGet(cu._computedDep, module, util.makeCuDepDesc());
  util.safeGet(cu._computedValue, module);
  util.safeGet(cu._computedValueOri, module);
  var stateKeys = Object.keys(state);
  _ccContext["default"].moduleName_stateKeys_[module] = stateKeys;

  if (module === _constant.MODULE_GLOBAL) {
    var globalStateKeys = _ccContext["default"].globalStateKeys;
    stateKeys.forEach(function (key) {
      if (!globalStateKeys.includes(key)) globalStateKeys.push(key);
    });
  }
}