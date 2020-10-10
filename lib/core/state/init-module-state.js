"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

var util = _interopRequireWildcard(require("../../support/util"));

var checker = _interopRequireWildcard(require("../param/checker"));

var _guessDuplicate = _interopRequireDefault(require("../base/guess-duplicate"));

var refCache = _interopRequireWildcard(require("../ref/_cache"));

var safeAssignToMap = util.safeAssignToMap,
    okeys = util.okeys,
    safeGet = util.safeGet;

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
  safeAssignToMap(rootState, module, state);
  safeAssignToMap(prevRootState, module, state);
  rootStateVer[module] = okeys(state).reduce(function (map, key) {
    map[key] = 1;
    return map;
  }, {});
  rootModuleVer[module] = 1; // 把_computedValueOri safeGet从init-module-computed调整到此处
  // 防止用户不定义任何computed，而只是定义watch时报错undefined

  var cu = _ccContext["default"].computed;
  safeGet(cu._computedDep, module, util.makeCuDepDesc());
  safeGet(cu._computedValue, module);
  safeGet(cu._computedValueOri, module);
  var stateKeys = okeys(state);
  _ccContext["default"].moduleName_stateKeys_[module] = stateKeys;

  if (module === _constant.MODULE_GLOBAL) {
    var globalStateKeys = _ccContext["default"].globalStateKeys;
    stateKeys.forEach(function (key) {
      if (!globalStateKeys.includes(key)) globalStateKeys.push(key);
    });
  }

  _ccContext["default"].module_insCount_[module] = 0;
}