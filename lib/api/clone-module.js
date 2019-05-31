"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _configure = _interopRequireDefault(require("./configure"));

var _getComputed = _interopRequireDefault(require("./get-computed"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = require("../support/util");

var checker = _interopRequireWildcard(require("../core/checker"));

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

/**
 * @param {string} newModule
 * @param {string} existingModule
 */
var _default = function _default(newModule, existingModule, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      state = _ref.state;

  if (!_ccContext["default"].isCcAlreadyStartup) {
    throw new Error('cc is not startup yet');
  }

  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);

  var mState = _ccContext["default"].store.getState(existingModule);

  var stateCopy = (0, _util.clone)(mState);
  if (state) stateCopy = Object.assign(stateCopy, state);
  var reducer = _ccContext["default"].reducer._reducer[existingModule];
  var computed = _ccContext["default"].computed._computedFn[existingModule];
  var watch = _ccContext["default"].watch._watch[existingModule];
  var init = _ccContext["default"].init._init[existingModule];
  var confObj = {
    state: stateCopy
  };
  if (reducer) confObj.reducer = reducer;
  if (computed) confObj.computed = computed;
  if (watch) confObj.watch = watch;
  if (init) confObj.init = init;
  (0, _configure["default"])(newModule, confObj);
};

exports["default"] = _default;