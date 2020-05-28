"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _util = require("../../support/util");

function _default(computed, originalCuContainer) {
  var moduleComputedValue = {};
  (0, _util.okeys)(computed).forEach(function (key) {
    // 避免get无限递归，用这个对象来存其他信息
    originalCuContainer[key] = (0, _util.makeCuObValue)();
    Object.defineProperty(moduleComputedValue, key, {
      get: function get() {
        var value = originalCuContainer[key] || {}; //防止用户传入未定义的key

        var needCompute = value.needCompute,
            fn = value.fn,
            newState = value.newState,
            oldState = value.oldState,
            fnCtx = value.fnCtx,
            isLazy = value.isLazy,
            result = value.result;

        if (!isLazy) {
          return result;
        }

        if (isLazy && needCompute) {
          var ret = fn(newState, oldState, fnCtx);
          value.result = ret;
          value.needCompute = false;
        }

        return value.result;
      },
      set: function set(input) {
        var value = originalCuContainer[key];

        if (!input[_privConstant.CU_KEY]) {
          (0, _util.justWarning)("computed value can not been changed manually");
          return;
        }

        if (input.isLazy) {
          value.isLazy = true;
          value.needCompute = true;
          value.newState = input.newState;
          value.oldState = input.oldState;
          value.fn = input.fn;
          value.fnCtx = input.fnCtx;
        } else {
          value.isLazy = false;
          value.result = input.result;
        }
      }
    });
  });
  return moduleComputedValue;
}