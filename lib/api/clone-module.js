"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _configure = _interopRequireDefault(require("./configure"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = require("../support/util");

var checker = _interopRequireWildcard(require("../core/checker"));

function tagReducerFn(reducerFns, moduleName) {
  var taggedReducer = {};
  (0, _util.okeys)(reducerFns).forEach(function (fnName) {
    var oldFn = reducerFns[fnName];

    var fn = function fn() {
      return oldFn.apply(void 0, arguments);
    };

    fn.__fnName = fnName;
    fn.__stateModule = moduleName;
    taggedReducer[fnName] = fn;
  });
  return taggedReducer;
}
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

  if (!_ccContext["default"].isStartup) {
    throw new Error('cc is not startup yet');
  }

  checker.checkModuleNameBasically(newModule);
  checker.checkModuleName(existingModule, false);
  var stateFn = _ccContext["default"].moduleName_stateFn_[existingModule];

  if (!stateFn) {
    throw new Error("target module[" + existingModule + "] state must be a function when use cloneModule");
  }

  var stateCopy = stateFn();
  Object.assign(stateCopy, (0, _util.evalState)(state));
  var reducerOriginal = _ccContext["default"].reducer._reducer[existingModule] || {}; // attach  __fnName  __stateModule, 不能污染原函数的dispatch逻辑里需要的__stateModule

  var taggedReducerOriginal = tagReducerFn(reducerOriginal, newModule);
  if (reducer) Object.assign(taggedReducerOriginal, tagReducerFn(reducer, newModule));
  var computedEx = _ccContext["default"].computed._computedRaw[existingModule] || {};
  if (computed) Object.assign(computedEx, computed);
  var watchEx = _ccContext["default"].watch._watchRaw[existingModule] || {};
  if (watch) Object.assign(watchEx, watch);
  var initEx = _ccContext["default"].init._init[existingModule];
  if (init) initEx = init;
  var confObj = {
    state: stateCopy,
    reducer: taggedReducerOriginal,
    computed: computedEx,
    watch: watchEx
  };
  if (initEx) confObj.init = initEx;
  (0, _configure["default"])(newModule, confObj);
};

exports["default"] = _default;