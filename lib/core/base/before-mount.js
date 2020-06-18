"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _triggerComputedAndWatch = _interopRequireDefault(require("./trigger-computed-and-watch"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _makeCuRetContainer = _interopRequireDefault(require("../computed/make-cu-ret-container"));

var _makeCuRefObContainer = _interopRequireDefault(require("../computed/make-cu-ref-ob-container"));

var okeys = util.okeys,
    makeCuDepDesc = util.makeCuDepDesc;
var runtimeVar = _ccContext["default"].runtimeVar;

function _default(ref, setup, bindCtxToMethod) {
  var ctx = ref.ctx;
  ref.__$$isUnmounted = false; // false表示未卸载（不代表已挂载），在willUnmount时机才置为true，表示已卸载

  ref.__$$isMounted = false; // 未挂载，在didMount时机才置为true，表示已挂载
  // flag is in before mount setup

  ctx.__$$inBM = true; //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后

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
  } //!!! 把拦截了setter getter的计算结果容器赋值给refComputed
  // 这一波必需在setup调用之后做，因为setup里会调用ctx.computed写入computedRetKeyFns等元数据


  ctx.refComputedValue = (0, _makeCuRetContainer["default"])(ctx.computedRetKeyFns, ctx.refComputedOri);
  ctx.refComputed = (0, _makeCuRefObContainer["default"])(ref, null, true, true); // 所有的组件都会自动连接到$$global模块，但是有可能没有使用$$global模块数据做过任何实例计算
  // 这里需要补齐computedDep.$$global 和 watchDep.$$global 的依赖描述数据
  // 防止后续逻辑里出错

  var computedDep = ctx.computedDep,
      watchDep = ctx.watchDep;

  if (!computedDep[_constant.MODULE_GLOBAL]) {
    computedDep[_constant.MODULE_GLOBAL] = makeCuDepDesc();
  }

  if (!watchDep[_constant.MODULE_GLOBAL]) {
    watchDep[_constant.MODULE_GLOBAL] = makeCuDepDesc();
  }

  (0, _triggerComputedAndWatch["default"])(ref);
  ctx.__$$inBM = false;
}