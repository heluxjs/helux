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

function _default(module, state, moduleStateMustNotDefinedInStore, tag) {
  if (moduleStateMustNotDefinedInStore === void 0) {
    moduleStateMustNotDefinedInStore = true;
  }

  if (tag === void 0) {
    tag = '';
  }

  try {
    checker.checkModuleNameAndState(module, state, moduleStateMustNotDefinedInStore);
  } catch (err) {
    (0, _guessDuplicate["default"])(err, module, 'state');
  }

  var ccStore = _ccContext["default"].store;
  var rootState = ccStore.getState();
  var rootStateVer = ccStore.getStateVer();
  var prevRootState = ccStore.getPrevState();
  rootState[module] = state;
  prevRootState[module] = Object.assign({}, state);
  rootStateVer[module] = util.okeys(state).reduce(function (map, key) {
    map[key] = 1;
    return map;
  }, {});
  var statKeys = Object.keys(state);
  _ccContext["default"].moduleName_stateKeys_[module] = statKeys;

  if (module === _constant.MODULE_GLOBAL) {
    var globalStateKeys = _ccContext["default"].globalStateKeys;
    statKeys.forEach(function (key) {
      return globalStateKeys.push(key);
    });
  }
}