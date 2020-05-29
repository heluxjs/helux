"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _runtimeVar = _interopRequireDefault(require("../../cc-context/runtime-var"));

var isKeyValid = function isKeyValid(obj, key) {
  return typeof key !== "symbol" && Object.prototype.hasOwnProperty.call(obj, key);
};
/**
 * 用于传递给 computed 回调收集相关依赖
 * defComputed((newState, oldState)=>{
 *   // 此处的newState oldState即cuObState
 * })
 * @param {{[key:string]:any}} state 
 * @param {string[]} depKeys 
 */


function _default(state, depKeys) {
  return new Proxy(state, {
    get: function get(target, key) {
      if (_runtimeVar["default"].isDebug) {
        console.log("key:" + key);
      }
      /**
       * 第一个isKeyValid判断，是为了防止误使用state算computed value，而触发了其他的key收集
       *   ctx.computed('count', n => {
       *     return n * 2;// 正确写法本应该是 return n.count * 2
       *    })
       *   // 本应该是 n.count * 2, 写为 n * 2 后，触发的key分别为
       *   // valueOf, toString, Symbol(...)
       */


      if (isKeyValid(target, key) && !depKeys.includes(key)) depKeys.push(key);
      return target[key];
    },
    // set: function (target, key) {
    set: function set() {
      // do nothing，拒绝用户在computed回调里修改state的值
      return true;
    }
  });
}