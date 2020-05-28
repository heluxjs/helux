/**
 * 为每一个实例单独建立了一个获取计算结果的观察容器，方便写入依赖
 */
import updateDep from '../ref/update-dep';
import computedMap from '../../cc-context/computed-map';
import { CATE_MODULE } from '../../support/constant';
import { justWarning } from '../../support/util';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const { _computedValueOri, _computedValue, _computedDep } = computedMap;

function writeRetKeyDep(moduleCuDep, ref, module, retKey, isForModule) {
  const retKey_stateKeys_ = moduleCuDep.retKey_stateKeys_;
  const stateKeys = retKey_stateKeys_[retKey] || [];

  stateKeys.forEach(stateKey => {
    updateDep(ref, module, stateKey, isForModule);
  })
}

/** 
 * 此函数被以下两种场景调用
 * 1 模块首次运行computed&watch时收集函数里读取其他cuRet结果的retKeys,
 * 2 实例首次运行computed&watch时收集函数里读取其他cuRet结果的retKeys,
 * 
 * module:
 * function fullName(n, o, f){
 *    return n.firstName + n.lastName;
 * }
 * 
 * // 此时funnyName依赖是 firstName lastName age
 * function funnyName(n, o, f){
 *    const { fullName } = f.cuVal;
 *    return fullName + n.age;
 * }
 * 
 * ref:
 * ctx.computed('fullName',(n, o, f)=>{
 *    return n.firstName + n.lastName;
 * })
 * 
 * // 此时funnyName依赖是 firstName lastName age
 * ctx.computed('funnyName',(n, o, f)=>{
 *    const { fullName } = f.cuVal;
 *    return fullName + n.age;
 * })
 */
export function getSimpleObContainer(retKey, sourceType, fnType, module, refCtx, retKeys) {
  let oriCuContainer, oriCuObContainer;
  if (CATE_MODULE === sourceType) {
    oriCuContainer = _computedValueOri[module];
    oriCuObContainer = _computedValue[module];
  } else {
    oriCuContainer = refCtx.refComputedOri;
    oriCuObContainer = refCtx.refComputedValue;
  }

  // 为普通的计算结果容器建立代理对象
  return new Proxy(oriCuContainer, {
    get: function (target, otherRetKey) {

      // 1 防止用户从 cuVal读取不存在的key
      // 2 首次按序执行所有的computed函数时，前面的计算函数取取不到后面的计算结果，收集不到依赖，强制用户要注意计算函数的书写顺序
      if (hasOwnProperty.call(oriCuContainer, otherRetKey)) {
        retKeys.push(otherRetKey);
      } else {
        justWarning(`${sourceType} ${fnType} retKey[${retKey}] get cuVal invalid retKey[${otherRetKey}]`)
      }

      // 从已定义defineProperty的计算结果容器里获取结果
      return oriCuObContainer[otherRetKey];
    },
    set: function () {
      return true;
    }
  });
}

// isForModule : true for module , false for connect
export default function (ref, module, isForModule = true, isRefCu = false) {
  // 注意isRefCu为true时，框架保证了读取ref.ctx下其他属性是安全的
  const oriCuContainer = isRefCu ? ref.ctx.refComputedOri : _computedValueOri[module];
  const oriCuObContainer = isRefCu ? ref.ctx.refComputedValue : _computedValue[module];
  if (!oriCuContainer) return {};

  // 为普通的计算结果容器建立代理对象
  return new Proxy(oriCuContainer, {
    get: function (target, retKey) {

      // 防止用户从 cuVal读取不存在的key
      if (hasOwnProperty.call(oriCuContainer, retKey)) {

        // 由refComputed.{keyName}取值触发
        if (isRefCu) {
          const computedDep = ref.ctx.computedDep;
          Object.keys(computedDep).forEach(m => {
            writeRetKeyDep(computedDep[m], ref, m, retKey, isForModule);
          })
        }
        // 由moduleComputed.{keyName} 或者 connectedComputed.{moduleName}.{keyName} 取值触发
        else {
          writeRetKeyDep(_computedDep[module], ref, module, retKey, isForModule);
        }

      }
      // 从已定义defineProperty的计算结果容器里获取结果
      return oriCuObContainer[retKey]
    },
    set: function (target, retKey, value) {
      target[retKey] = value;
      return true;
    }
  });
}