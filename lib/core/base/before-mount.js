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
var _ccContext$reducer = _ccContext["default"].reducer,
    _module_fnNames_ = _ccContext$reducer._module_fnNames_,
    _caller = _ccContext$reducer._caller,
    runtimeVar = _ccContext["default"].runtimeVar;

function _default(ref, setup, bindCtxToMethod) {
  ref.__$$isUnmounted = false;
  ref.__$$isBeforeFirstRender = true;
  var ctx = ref.ctx;
  var connectedReducer = ctx.connectedReducer,
      moduleReducer = ctx.moduleReducer,
      dispatch = ctx.dispatch,
      connect = ctx.connect,
      module = ctx.module;
  var connectedModules = okeys(connect);
  var allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);else {
    justWarning("module[" + module + "] is in belongTo and connect both, it will cause redundant render.");
  } //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

  allModules.forEach(function (m) {
    var reducerObj;

    if (m === module) {
      reducerObj = moduleReducer;
    } else {
      reducerObj = safeGetObjectFromObject(connectedReducer, m);
    }

    var fnNames = _module_fnNames_[m] || [];
    fnNames.forEach(function (fnName) {
      reducerObj[fnName] = function (payload, rkeyOrOption, delay) {
        return dispatch(m + "/" + fnName, payload, rkeyOrOption, delay);
      };
    });
  });
  ctx.reducer = _caller; //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后

  if (setup) {
    if (typeof setup !== 'function') throw new Error('type of setup must be function');
    var settingsObj = setup(ctx) || {};
    if (!util.isPJO(settingsObj)) throw new Error('type of setup return result must be an plain json object'); //优先读自己的，再读全局的

    if (bindCtxToMethod === true || runtimeVar.bindCtxToMethod === true && bindCtxToMethod !== false) {
      okeys(settingsObj).forEach(function (name) {
        var settingValue = settingsObj[name];
        if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
      });
    }

    ctx.settings = settingsObj;
  }

  (0, _triggerComputedAndWatch["default"])(ref);
}