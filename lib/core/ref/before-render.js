"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _index = _interopRequireDefault(require("../../cc-context/index"));

/** eslint-disable */
var getModuleVer = _index["default"].store.getModuleVer;

function _default(ref) {
  var ctx = ref.ctx;
  ctx.renderCount += 1; // 不处于收集观察依赖 or 已经开始都要跳出此函数
  // strictMode模式下，会走两次beforeRender 一次afterRender，
  // 所以这里严格用ctx.__$$renderStatus === START 来控制只真正执行一次beforeRender

  if (!ctx.__$$autoWatch || ctx.__$$renderStatus === _privConstant.START) {
    return;
  }

  if (ctx.__$$renderStatus !== _privConstant.START) ctx.__$$renderStatus = _privConstant.START;

  if (ctx.__$$hasModuleState) {
    var __$$prevModuleVer = ctx.__$$prevModuleVer,
        refModule = ctx.module;
    var moduleVer = getModuleVer(refModule); // 当组件某一刻对模块状态无依赖后，ctx.state里的模块状态始终是旧值
    // 所以此处通过比较模板版本差异，主动合并最新模块状态
    // 这样在组件自己触发自己渲染后，如果那一刻ui里又通过ctx.state读取了模块状态
    // 那么这段逻辑通过比较模板版本差异，主动合并最新模块状态，能报保证ui里读到的模块状态是最新值
    // 但是此处需要注意的是如果ui始终没通过ctx.state读取了模块状态
    // 那么click回调里的ctx.state始终会是旧值，所以推荐用户在事件回调里始终读取moduleState,以确保读取最新模块值

    if (__$$prevModuleVer !== moduleVer) {
      ctx.__$$prevModuleVer = moduleVer;
      ctx.unProxyState = Object.assign({}, ctx.unProxyState, ctx.__$$mstate);
      Object.assign(ctx.state, ctx.__$$mstate);
    }

    ctx.__$$curWaKeys = {};
    ctx.__$$compareWaKeys = ctx.__$$nextCompareWaKeys;
    ctx.__$$compareWaKeyCount = ctx.__$$nextCompareWaKeyCount; // 渲染期间再次收集

    ctx.__$$nextCompareWaKeys = {};
    ctx.__$$nextCompareWaKeyCount = 0;
  } // 类组件this.reactSetState调用后生成的this.state是一个新的普通对象
  // 每次渲染前替换为ctx.state指向的Proxy对象，确保让类组件里使用this.state能够收集到依赖


  ref.state = ctx.state;
  var connectedModules = ctx.connectedModules,
      connect = ctx.connect;
  connectedModules.forEach(function (m) {
    // 非自动收集，在make-ob-state里不会触发get，这里直接跳出
    if (connect[m] !== '-') return;
    ctx.__$$curConnWaKeys[m] = {};
    ctx.__$$compareConnWaKeys[m] = ctx.__$$nextCompareConnWaKeys[m];
    ctx.__$$compareConnWaKeyCount[m] = ctx.__$$nextCompareConnWaKeyCount[m]; // 渲染期间再次收集

    ctx.__$$nextCompareConnWaKeys[m] = {};
    ctx.__$$nextCompareConnWaKeyCount[m] = 0;
  });
}