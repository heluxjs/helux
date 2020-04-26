/**
 * 用于传递给 computed 回调收集相关依赖
 * defComputed((newState, oldState)=>{
 *   //此处的newState oldState即cuObState
 * })
 * @param {*} state 
 * @param {*} depKeys 
 */
export default function (state, depKeys) {
  return new Proxy(state, {
    get: function (target, key) {
      if (!depKeys.includes(key)) depKeys.push(key);
      return target[key];
    },
    // set: function (target, key) {
    set: function () {
      // do nothing，拒绝用户在computed回调里修改state的值

      return true;
    }
  });
}