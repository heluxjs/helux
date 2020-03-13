"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _makeObState = _interopRequireDefault(require("../state/make-ob-state"));

function _default(ref) {
  var ctx = ref.ctx;
  ctx.__$$renderStatus = _privConstant.START; // 在buildRefCtx阶段已完成相关的obState注入，这里不再需要

  if (ctx.renderCount === 1) {
    return;
  } // 处于收集观察依赖


  if (ctx.__$$autoWatch) {
    if (ctx.__$$hasModuleState) {
      // 这里后期考虑结合handlerFactory.makeRefSetState优化，不用每次都生成代理对象
      ref.state = (0, _makeObState["default"])(ref, ref.state);
      ctx.state = ref.state;
      ctx.moduleState = (0, _makeObState["default"])(ref, ctx.mstate);
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
}