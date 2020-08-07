"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

/** eslint-disable */
function _default(ref) {
  var ctx = ref.ctx;
  ctx.renderCount += 1; // 类组件this.reactSetState调用后生成的this.state是一个新的普通对象
  // 每次渲染前替换为ctx.state指向的Proxy对象，确保让类组件里使用this.state能够收集到依赖

  ref.state = ctx.state;
  if (ctx.childRef) ctx.childRef.state = ctx.state; // 不处于收集观察依赖 or 已经开始都要跳出此函数
  // strictMode模式下，会走两次beforeRender 一次afterRender，
  // 所以这里严格用ctx.__$$renderStatus === START 来控制只真正执行一次beforeRender

  if (!ctx.__$$autoWatch || ctx.__$$renderStatus === _privConstant.START) {
    return;
  }

  if (ctx.__$$renderStatus !== _privConstant.START) ctx.__$$renderStatus = _privConstant.START;

  if (ctx.__$$hasModuleState) {
    ctx.__$$curWaKeys = {};
    ctx.__$$compareWaKeys = ctx.__$$nextCompareWaKeys;
    ctx.__$$compareWaKeyCount = ctx.__$$nextCompareWaKeyCount; // 渲染期间再次收集

    ctx.__$$nextCompareWaKeys = {};
    ctx.__$$nextCompareWaKeyCount = 0;
  }

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