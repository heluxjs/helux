"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _updateDep = _interopRequireDefault(require("../ref/update-dep"));

var _index = _interopRequireDefault(require("../../cc-context/index"));

var getModuleVer = _index["default"].store.getModuleVer;

function _default(ref, state, module, isForModule) {
  return new Proxy(state, {
    get: function get(target, key) {
      // ensureStateNotExpired, 当实例失去模块数据依赖，回调方法直接使用ctx.state时，state里的模块数据可能已过期
      if (isForModule) {
        var modVer = getModuleVer(module);
        var ctx = ref.ctx;

        if (modVer !== ctx.__$$prevModuleVer) {
          ctx.__$$prevModuleVer = modVer;
          Object.assign(state, ctx.__$$mstate);
        }
      }

      (0, _updateDep["default"])(ref, module, key, isForModule);
      return target[key];
    },
    set: function set(target, key, value) {
      // 这个warning暂时关闭，因为buildRefCtx阶段就生成了obState, refComputed里可能会调用commit向obState写入新的state
      // justWarning(`warning: state key[${key}] can not been changed manually, use api setState or dispatch instead`);
      // 允许赋最新值，否则silentUpdate状态合并会失效
      target[key] = value; // avoid Uncaught TypeError: 'set' on proxy: trap returned falsish for property '***'

      return true;
    }
  });
}