"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getSimpleObContainer = getSimpleObContainer;
exports["default"] = _default;

var _updateDep = _interopRequireDefault(require("../ref/update-dep"));

var _computedMap = _interopRequireDefault(require("../../cc-context/computed-map"));

var _constant = require("../../support/constant");

var _util = require("../../support/util");

/**
 * 为每一个实例单独建立了一个获取计算结果的观察容器，方便写入依赖
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var _computedValueOri = _computedMap["default"]._computedValueOri,
    _computedValue = _computedMap["default"]._computedValue,
    _computedDep = _computedMap["default"]._computedDep;

function writeRetKeyDep(moduleCuDep, ref, module, retKey, isForModule) {
  var retKey_stateKeys_ = moduleCuDep.retKey_stateKeys_;
  var stateKeys = retKey_stateKeys_[retKey] || [];
  stateKeys.forEach(function (stateKey) {
    (0, _updateDep["default"])(ref, module, stateKey, isForModule);
  });
}
/** 
 * 仅用于模块首次运行computed&watch时收集函数里读取其他cuRet结果的retKeys,
 * 实例首次运行computed&watch时收集函数里读取其他cuRet结果的retKeys,
 * 
 * module:
 * function fullName(n, o, f){
 *    return n.firstName + n.lastName;
 * }
 * 
 * function funnyName(n, o, f){
 *    const { fullName } = f.cuVal;// 此时funnyName依赖是 firstName lastName age
 *    return fullName + n.age;
 * }
 * 
 * ref:
 * 
 * ctx.computed('fullName',(n, o, f)=>{
 *    return n.firstName + n.lastName;
 * })
 * 
 * ctx.computed('funnyName',(n, o, f)=>{
 *    const { fullName } = f.cuVal;// 此时funnyName依赖是 firstName lastName age
 *    return fullName + n.age;
 * })
 */


function getSimpleObContainer(retKey, sourceType, fnType, module, refCtx, retKeys) {
  var oriCuContainer, oriCuObContainer;

  if (_constant.CATE_MODULE === sourceType) {
    oriCuContainer = _computedValueOri[module];
    oriCuObContainer = _computedValue[module];
  } else {
    oriCuContainer = refCtx.refComputedOri;
    oriCuObContainer = refCtx.refComputedValue;
  } // 为普通的计算结果容器建立代理对象


  return new Proxy(oriCuContainer, {
    get: function get(target, otherRetKey) {
      // 1 防止用户从 cuVal读取不存在的key
      // 2 首次按序执行所有的computed函数时，前面的计算函数取取不到后面的计算结果，收集不到依赖，强制用户要注意计算函数的书写顺序
      if (hasOwnProperty.call(oriCuContainer, otherRetKey)) {
        retKeys.push(otherRetKey);
      } else {
        (0, _util.justWarning)(sourceType + " " + fnType + " retKey[" + retKey + "] get cuVal invalid retKey[" + otherRetKey + "]");
      } // 从已定义defineProperty的计算结果容器里获取结果


      return oriCuObContainer[otherRetKey];
    },
    set: function set() {
      return true;
    }
  });
} // isForModule : true for module , false for connect


function _default(ref, module, isForModule, isRefCu) {
  if (isForModule === void 0) {
    isForModule = true;
  }

  if (isRefCu === void 0) {
    isRefCu = false;
  }

  // 注意isRefCu为true是，获取ref.ctx是安全的
  var oriCuContainer = isRefCu ? ref.ctx.refComputedOri : _computedValueOri[module];
  var oriCuObContainer = isRefCu ? ref.ctx.refComputedValue : _computedValue[module];
  if (!oriCuContainer) return {}; // 为普通的计算结果容器建立代理对象

  return new Proxy(oriCuContainer, {
    get: function get(target, retKey) {
      // 防止用户从 cuVal读取不存在的key
      if (hasOwnProperty.call(oriCuContainer, retKey)) {
        // 由refComputed.{keyName}取值触发
        if (isRefCu) {
          var computedDep = ref.ctx.computedDep;
          Object.keys(computedDep).forEach(function (m) {
            writeRetKeyDep(computedDep[m], ref, m, retKey, isForModule);
          });
        } // 由moduleComputed.{keyName} 或者 connectedComputed.{moduleName}.{keyName} 取值触发
        else {
            writeRetKeyDep(_computedDep[module], ref, module, retKey, isForModule);
          }
      } // 从已定义defineProperty的计算结果容器里获取结果


      return oriCuObContainer[retKey];
    },
    set: function set(target, retKey, value) {
      target[retKey] = value;
      return true;
    }
  });
}