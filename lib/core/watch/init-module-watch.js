"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject,
    safeGetArrayFromObject = util.safeGetArrayFromObject,
    okeys = util.okeys;

var tipFn = function tipFn(watchKey) {
  return "watchKey[" + watchKey + "] is a stateKey, watchDesc must like: function | {fn:Function, immediate?:boolean}";
};

var tipDep = function tipDep(watchKey) {
  return "watchKey[" + watchKey + "] is not a stateKey, watchDesc must like: {fn:Function, depKeys:string[] | *, immediate?:boolean}";
};
/**
 * 设置watch值，过滤掉一些无效的key
 */


function _default(module, moduleWatch) {
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "watch." + module + " is invalid");

  var rootWatch = _ccContext["default"].watch.getRootWatch();

  var rootWatchDep = _ccContext["default"].watch.getRootWatchDep();

  var getState = _ccContext["default"].store.getState;
  var moduleState = getState(module);
  okeys(moduleWatch).forEach(function (key) {
    var desc = moduleWatch[key];

    if (moduleState.hasOwnProperty(key)) {
      if (!desc) throw new Error(tipFn(key));

      var _fn,
          _immediate = false;

      if (typeof desc !== 'function') {
        if (typeof desc !== 'object') throw new Error(tipFn(key));
        var _fn2 = desc.fn,
            immediate = desc.immediate;
        if (typeof _fn2 !== 'function') throw new Error(tipFn(key));
        _fn = _fn2;
        _immediate = immediate;
      } else {
        _fn = desc;
      }

      var ccModuleWatch = safeGetObjectFromObject(rootWatch, module);
      ccModuleWatch[key] = _fn;

      if (_immediate) {
        var val = moduleState[key]; // 和 ccContext里setStateByModule保持统一的fnCtx

        fn(val, val, {
          key: key,
          module: module,
          moduleState: moduleState,
          committedState: moduleState
        });
      }
    } else {
      // customized key for depKeys
      if (typeof desc !== 'object') throw new Error(tipDep(key));
      var _fn3 = desc.fn,
          depKeys = desc.depKeys,
          _immediate2 = desc.immediate;
      if (typeof _fn3 !== 'function') throw new Error(tipDep(key));

      var _depKeys;

      if (depKeys === '*') {
        _depKeys = ['*'];
      } else {
        if (!Array.isArray(depKeys)) throw new Error(tipDep(key));
        _depKeys = depKeys;
      }

      var moduleWatchDep = rootWatchDep[module] = {
        stateKey_retKeys_: {},
        retKey_fn_: {},
        fnCount: 0
      };
      var stateKey_retKeys_ = moduleWatchDep.stateKey_retKeys_,
          retKey_fn_ = moduleWatchDep.retKey_fn_;
      retKey_fn_[key] = _fn3;
      moduleWatchDep.fnCount++;

      _depKeys.forEach(function (sKey) {
        var retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
        retKeys.push(key);
      });

      if (_immediate2) {
        _fn3(moduleState, moduleState);
      }
    }
  });
}