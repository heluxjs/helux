"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _configure = _interopRequireDefault(require("./configure"));

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _util = require("../support/util");

var checker = _interopRequireWildcard(require("../core/param/checker"));

var _getLifecycle = _interopRequireDefault(require("../core/param/get-lifecycle"));

function tagReducerFn(reducerFns, moduleName) {
  var taggedReducer = {};

  if (reducerFns) {
    (0, _util.okeys)(reducerFns).forEach(function (fnName) {
      var oldFn = reducerFns[fnName];

      var fn = function fn() {
        return oldFn.apply(void 0, arguments);
      };

      fn.__fnName = fnName;
      fn.__stateModule = moduleName;
      taggedReducer[fnName] = fn;
    });
  }

  return taggedReducer;
}
/**
 * @param {string} newModule
 * @param {string} existingModule
 */


var _default = function _default(newModule, existingModule, moduleOverideConf) {
  if (moduleOverideConf === void 0) {
    moduleOverideConf = {};
  }

  var _moduleOverideConf = moduleOverideConf,
      state = _moduleOverideConf.state,
      reducer = _moduleOverideConf.reducer,
      computed = _moduleOverideConf.computed,
      watch = _moduleOverideConf.watch;

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
  var reducerOriginal = _ccContext["default"].reducer._reducer[existingModule]; // attach  __fnName  __stateModule, 不能污染原函数的dispatch逻辑里需要的__stateModule

  var taggedReducerCopy = Object.assign(tagReducerFn(reducerOriginal, newModule), tagReducerFn(reducer, newModule));
  var computedCopy = Object.assign({}, _ccContext["default"].computed._computedRaw[existingModule], computed);
  var watchCopy = Object.assign({}, _ccContext["default"].watch._watchRaw[existingModule], watch);
  var lifecycleCopy = Object.assign({}, _ccContext["default"].lifecycle._lifecycle[existingModule], (0, _getLifecycle["default"])(moduleOverideConf));
  var confObj = {
    state: stateCopy,
    reducer: taggedReducerCopy,
    computed: computedCopy,
    watch: watchCopy,
    lifecycle: lifecycleCopy
  };
  (0, _configure["default"])(newModule, confObj);
};

exports["default"] = _default;