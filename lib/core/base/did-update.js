"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _triggerSetupEffect = _interopRequireDefault(require("./trigger-setup-effect"));

var _afterRender = _interopRequireDefault(require("../ref/after-render"));

function _default(ref) {
  (0, _afterRender["default"])(ref);
  (0, _triggerSetupEffect["default"])(ref); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
  //注意一定是先调用triggerSetupEffect，再赋值

  ref.ctx.prevState = ref.ctx.unProxyState;
}