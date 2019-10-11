import pickDepFns from '../base/pick-dep-fns';

//CcFragment实例调用会提供callerCtx
// stateModule表示状态所属的模块
export default function (refCtx, stateModule, oldState, committedState, isBeforeMount = false) {
  if (!refCtx.hasComputedFn) return;

  const { computedDep, module: refModule, refComputed, refConnectedComputed, ccUniqueKey } = refCtx;

  // 触发依赖stateKeys相关的computed函数
  const { pickedFns, setted, changed } = pickDepFns(isBeforeMount, 'ref', 'computed', computedDep, stateModule, oldState, committedState, ccUniqueKey);

  if(pickedFns.length ){
    const newState = Object.assign({}, oldState, committedState);
    pickedFns.forEach(({ fn, retKey, depKeys }) => {
      const fnCtx = { retKey, setted, changed, stateModule, refModule, oldState, committedState, refCtx };
      const firstDepKey = depKeys[0];
      let computedValue;
  
      if (depKeys.length === 1 && firstDepKey !== '*') {
        computedValue = fn(committedState[firstDepKey], oldState[firstDepKey], fnCtx, refCtx);
      } else {
        computedValue = fn(newState, oldState, fnCtx);
      }
  
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