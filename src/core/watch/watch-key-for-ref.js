import pickDepFns from '../base/pick-dep-fns';
import { executeCompOrWatch } from '../../support/util';
import { makeCommitHandler } from '../state/handler-factory';

export default function (refCtx, stateModule, oldState, committedState, isBeforeMount) {
  if (!refCtx.hasWatchFn) return true;
  const { watchDep, module: refModule, ccUniqueKey } = refCtx;

  let shouldCurrentRefUpdate = true;
  // 触发有stateKey依赖列表相关的watch函数
  const { pickedFns, setted, changed } = pickDepFns(isBeforeMount, 'ref', 'watch', watchDep, stateModule, oldState, committedState, ccUniqueKey);

  if (pickedFns.length) {
    const newState = Object.assign({}, oldState, committedState);
    const { commit, flush } = makeCommitHandler(stateModule, refCtx);

    pickedFns.forEach(({ fn, retKey, depKeys }) => {
      const fnCtx = { retKey, isFirstCall: isBeforeMount, commit, setted, changed, stateModule, refModule, oldState, committedState, refCtx };
      const ret = executeCompOrWatch(retKey, depKeys, fn, newState, oldState, fnCtx);

      //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
      if (ret === false) shouldCurrentRefUpdate = false;
    });

    flush();
  }

  return shouldCurrentRefUpdate;
}