"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _triggerComputedAndWatch = _interopRequireDefault(require("./trigger-computed-and-watch"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    okeys = util.okeys,
    justWarning = util.justWarning;
var _reducerModule_fnNames_ = _ccContext["default"].reducer._reducerModule_fnNames_;

function _default(ref, setup, bindCtxToMethod) {
  ref.__$$isUnmounted = false;
  var ctx = ref.ctx;
  var reducer = ctx.reducer,
      lazyReducer = ctx.lazyReducer,
      dispatch = ctx.dispatch,
      lazyDispatch = ctx.lazyDispatch,
      connect = ctx.connect,
      module = ctx.module;
  var connectedModules = okeys(connect);
  var allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);else {
    justWarning("module[" + module + "] are in belongTo and connect both, it will cause redundant render.");
  } //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

  allModules.forEach(function (m) {
    var refReducerFnObj = safeGetObjectFromObject(reducer, m);
    var refLazyReducerFnObj = safeGetObjectFromObject(lazyReducer, m);
    var fnNames = _reducerModule_fnNames_[m] || [];
    fnNames.forEach(function (fnName) {
      refReducerFnObj[fnName] = function (payload, delay, rkey) {
        return dispatch(m + "/" + fnName, payload, delay, rkey);
      };

      refLazyReducerFnObj[fnName] = function (payload, delay, rkey) {
        return lazyDispatch(m + "/" + fnName, payload, delay, rkey);
      };
    });
  }); //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后

  if (setup) {
    var watchFns = ctx.watchFns,
        computedFns = ctx.computedFns,
        immediateWatchKeys = ctx.immediateWatchKeys;
    if (typeof setup !== 'function') throw new Error('type of setup must be function');
    var settingsObj = setup(ctx) || {};
    if (!util.isPlainJsonObject(settingsObj)) throw new Error('type of setup return result must be an plain json object');
    var globalBindCtx = _ccContext["default"].bindCtxToMethod; //优先读自己的，再读全局的

    if (bindCtxToMethod === true || globalBindCtx === true && bindCtxToMethod !== false) {
      okeys(settingsObj).forEach(function (name) {
        var settingValue = settingsObj[name];
        if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
      });
    }

    ctx.settings = settingsObj;
  }

  (0, _triggerComputedAndWatch["default"])(ref);
}