"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _triggerSetupEffect = _interopRequireDefault(require("./trigger-setup-effect"));

function _default(ref) {
  (0, _triggerSetupEffect["default"])(ref); //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
  //注意一定是先调用triggerSetupEffect，再赋值
  //这里刻意用assign，让prevState指向一个新引用
  // ref.ctx.prevState = Object.assign({}, ref.state);
  //不采用上面的写法了，因为makeCcSetStateHandler里放弃了okeys写法，总是直接赋值最新的state引用

  ref.ctx.prevState = ref.state;
}