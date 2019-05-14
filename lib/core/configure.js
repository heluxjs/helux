"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var helper = _interopRequireWildcard(require("./helper"));

var _constant = require("../support/constant");

var _util = require("../support/util");

var ccGlobalStateKeys = _ccContext["default"].globalStateKeys;
/**
 * @description configure module、state、option to cc
 * @author zzk
 * @export
 * @param {String} module
 * @param {Object} state
 * @param {Object} [option] reducer、init、sharedToGlobalMapping
 * @param {Object} [option.reducer]  you can define multi reducer for a module by specify a reducer
 * @param {Object} [option.moduleReducer]  if you specify moduleReducer and reducer at the same time, the reducer will be ignored!
 * cc will give state module name as moduleReducer key
 * @param {Object} [option.init]
 * @param {Object} [option.globalState]  this globalState will been merged to $$global module state
 * @param {Object} [option.sharedToGlobalMapping]
 * @param {Object} [option.middlewares]
 */

function _default(module, state, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      singleClass = _ref.singleClass,
      moduleReducer = _ref.moduleReducer,
      reducer = _ref.reducer,
      init = _ref.init,
      globalState = _ref.globalState,
      sharedToGlobalMapping = _ref.sharedToGlobalMapping,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares;

  if (!_ccContext["default"].isCcAlreadyStartup) {
    throw new Error('cc is not startup yet, you can not call cc.configure!');
  }

  if (!_ccContext["default"].isModuleMode) {
    throw new Error('cc is running in non module node, can not call cc.configure');
  }

  helper.checkModuleName(module);
  helper.checkModuleState(state, module);
  var _state = _ccContext["default"].store._state;
  var _reducer = _ccContext["default"].reducer._reducer;

  if (_state[module]) {
    throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NAME_DUPLICATE, (0, _util.verboseInfo)("moduleName " + module));
  }

  _state[module] = state;

  if (singleClass === true) {
    _ccContext["default"].moduleSingleClass[module] = true;
  }

  if (moduleReducer) {
    if (!(0, _util.isPlainJsonObject)(moduleReducer)) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " 's moduleReducer is invalid"));
    }

    _reducer[module] = moduleReducer;
  } else if (reducer) {
    if (!(0, _util.isPlainJsonObject)(reducer)) {
      throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " 's moduleReducer is invalid"));
    }

    var reducerModuleNames = Object.keys(reducer);
    reducerModuleNames.forEach(function (rmName) {
      helper.checkModuleName(rmName);
      var moduleReducer = reducer[rmName];

      if (!(0, _util.isPlainJsonObject)(moduleReducer)) {
        throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_VALUE_IN_CC_CONFIGURE_OPTION_IS_INVALID, (0, _util.verboseInfo)("moduleName " + module + " reducer 's value  is invalid"));
      }

      if (rmName == _constant.MODULE_GLOBAL) {
        //merge input globalReducer to existed globalReducer
        var typesOfGlobal = Object.keys(moduleReducer);
        var globalReducer = _reducer[_constant.MODULE_GLOBAL];
        typesOfGlobal.forEach(function (type) {
          if (globalReducer[type]) {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_ACTION_TYPE_DUPLICATE, (0, _util.verboseInfo)("type " + type));
          }

          var reducerFn = moduleReducer[type];

          if (typeof reducerFn !== 'function') {
            throw (0, _util.makeError)(_constant.ERR.CC_REDUCER_NOT_A_FUNCTION);
          }

          globalReducer[type] = reducerFn;
        });
      } else {
        _reducer[rmName] = moduleReducer;
      }
    });
  }

  var storedGlobalState = _state[_constant.MODULE_GLOBAL];

  if (globalState) {
    helper.checkModuleState(globalState, _constant.MODULE_GLOBAL);
    var globalStateKeys = Object.keys(globalState);
    globalStateKeys.forEach(function (gKey) {
      if (storedGlobalState[gKey]) {
        throw (0, _util.makeError)(_constant.ERR.CC_CLASS_GLOBAL_STATE_KEYS_DUPLICATE_WITH_CONFIGURE_GLOBAL_STATE, (0, _util.verboseInfo)("duplicate globalKey: " + gKey));
      }

      var stateValue = globalState[gKey];
      storedGlobalState[gKey] = stateValue;
      ccGlobalStateKeys.push(gKey);
    });
  }

  if (sharedToGlobalMapping) {
    helper.handleModuleSharedToGlobalMapping(module, sharedToGlobalMapping);
  }

  if (init) {
    if (typeof init !== 'function') {
      throw new Error('init value must be a function!');
    }

    init(helper.getStateHandlerForInit(module));
  }

  if (middlewares.length > 0) {
    var ccMiddlewares = _ccContext["default"].middlewares;
    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }
}