"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

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
  } // ccContext.store.setState(module, state);


  var rootState = _ccContext["default"].store.getState();

  var prevRootState = _ccContext["default"].store.getPrevState();

  rootState[module] = state;
  prevRootState[module] = Object.assign({}, state);
  var statKeys = Object.keys(state);
  _ccContext["default"].moduleName_stateKeys_[module] = statKeys;

  if (module === _constant.MODULE_GLOBAL) {
    var globalStateKeys = _ccContext["default"].globalStateKeys;
    statKeys.forEach(function (key) {
      return globalStateKeys.push(key);
    });
  }
}