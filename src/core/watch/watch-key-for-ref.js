import pickDepFns from '../base/pick-dep-fns';

export default function (refCtx, stateModule, oldState, committedState, isBeforeMount) {
  if (!refCtx.hasWatchFn) return true;
  const { watchDep, module: refModule, ccUniqueKey } = refCtx;

  let shouldCurrentRefUpdate = true;
  // 触发有stateKey依赖列表相关的watch函数
  const { pickedFns, setted, changed } = pickDepFns(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey);

  if (pickedFns.length) {
    const newState = Object.assign({}, oldState, committedState);
    pickedFns.forEach(({ fn, retKey, depKeys }) => {
      const fnCtx = { retKey, isBeforeMount, setted, changed, stateModule, refModule, oldState, committedState, refCtx };
      const firstDepKey = depKeys[0];

      let ret;
      if (depKeys.length === 1 && firstDepKey !== '*') {
        if (firstDepKey !== retKey) {
          ret = fn(newState, oldState, fnCtx);
        } else {
          ret = fn(committedState[firstDepKey], oldState[firstDepKey], fnCtx, refCtx);
        }
      } else {
        ret = fn(newState, oldState, fnCtx);
      }

      //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
      if (ret === false) shouldCurrentRefUpdate = false;
    });
  }

  return shouldCurrentRefUpdate;
}