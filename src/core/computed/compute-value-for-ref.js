import pickDepFns from '../base/pick-dep-fns';
import { executeCompOrWatch } from '../../support/util';
// import ccContext from '../../cc-context';

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState, isBeforeMount = false) {
  if (!refCtx.hasComputedFn) return;

  const { computedDep, module: refModule, refComputed, refConnectedComputed, ccUniqueKey } = refCtx;
  // const moduleState = ccContext.store.getState(stateModule);

  // 触发依赖stateKeys相关的computed函数
  const { pickedFns, setted, changed } = pickDepFns(isBeforeMount, 'ref', 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);

  if(pickedFns.length ){
    const newState = Object.assign({}, oldState, committedState);
    pickedFns.forEach(({ fn, retKey, depKeys }) => {
      const fnCtx = { retKey, isBeforeMount, setted, changed, stateModule, refModule, oldState, committedState, refCtx };
      const computedValue = executeCompOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx);
  
      if (refModule === stateModule) {
        refComputed[retKey] = computedValue;
      }
  
      // 意味着用户必须将组建connect到此模块，computed&watch里模块定义才有效果
      const targetComputed = refConnectedComputed[stateModule];
      if (targetComputed) {
        targetComputed[retKey] = computedValue;
      }
    });
  }

}