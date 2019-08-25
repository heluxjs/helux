"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _configure = _interopRequireDefault(require("./configure"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = require("../support/util");

var checker = _interopRequireWildcard(require("../core/checker"));

/**
 * @param {string} newModule
 * @param {string} existingModule
 */
var _default = function _default(newModule, existingModule, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      state = _ref.state,
      reducer = _ref.reducer,
      computed = _ref.computed,
      watch = _ref.watch,
      init = _ref.init;

  if (!_ccContext["default"].isCcAlreadyStartup) {
    throw new Error('cc is not startup yet');
  }

  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);

  var mState = _ccContext["default"].store.getState(existingModule);

  var stateCopy = (0, _util.clone)(mState);
  if (state) Object.assign(stateCopy, state);
  var reducerEx = _ccContext["default"].reducer._reducer[existingModule] || {};
  if (reducer) Object.assign(reducerEx, reducer);
  var computedEx = _ccContext["default"].computed._computedRaw[existingModule] || {};
  if (computed) Object.assign(computedEx, computed);
  var watchEx = _ccContext["default"].watch._watchRaw[existingModule] || {};
  if (watch) Object.assign(watchEx, watch);
  var initEx = _ccContext["default"].init._init[existingModule];
  if (init) initEx = init;
  var confObj = {
    state: stateCopy,
    reducer: reducerEx,
    computed: computedEx,
    watch: watchEx
  };
  if (initEx) confObj.init = initEx;
  (0, _configure["default"])(newModule, confObj);
};

exports["default"] = _default;