"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _makeObState = _interopRequireDefault(require("../state/make-ob-state"));

var _index = _interopRequireDefault(require("../../cc-context/index"));

/** eslint-disable */
var store = _index["default"].store;

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
    var moduleVer = store.getModuleVer(refModule);

    if (__$$prevModuleVer[refModule] !== moduleVer) {
      __$$prevModuleVer[refModule] = moduleVer;
      Object.assign(ctx.unProxyState, ctx.mstate);
    } // 一直使用ref.state生成新的ref.state，相当于一直使用proxy对象生成proxy对象，会触发Maximum call问题
    // ref.state = makeObState(ref, ref.state, refModule, true);
    // 每次生成的state都是一个新对象，让effect逻辑里prevState curState对比能够成立


    ref.state = (0, _makeObState["default"])(ref, ctx.unProxyState, refModule, true);
    ctx.state = ref.state;
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