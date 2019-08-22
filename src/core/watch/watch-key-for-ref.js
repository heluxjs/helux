import ccContext from '../../cc-context';
import { okeys } from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';
import pickDepFns from '../base/pick-dep-fns';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

export default function (refCtx, stateModule, oldState, committedState, checkImmediate) {
  const { watchFns, watchDep, hasWatchFn, connect, module: refModule, immediateWatchKeys } = refCtx;
  if (!hasWatchFn) return true;

  let shouldCurrentRefUpdate = true;
  const moduleStateKeys = moduleName_stateKeys_[refModule];

  // 触发直接对stateKey定义的相关watch函数
  okeys(watchFns).forEach(key => {
    if (checkImmediate) {
      if (!immediateWatchKeys.includes(key)) return;
    }

    const { stateKey, skip, keyModule } = shouldSkipKey(key, refModule, stateModule, connect, moduleStateKeys);
    if (skip) return;

    const commitValue = committedState[stateKey];
    if (commitValue !== undefined) {
      const watchFn = watchFns[key];
      const targetModule = keyModule || refModule;
      const moduleState = getState(targetModule);
      const fnCtx = { key: stateKey, module: targetModule, moduleState, committedState };

      const ret = watchFn(commitValue, oldState[stateKey], fnCtx, refCtx);// watchFn(newValue, oldValue);

      //实例里只要有一个watch函数返回false，就会阻碍当前实例的ui被更新
      if (ret === false) shouldCurrentRefUpdate = false;
    }
  });

  // 触发有stateKey依赖列表相关的watch函数
  const pickedFns = pickDepFns(watchDep, stateModule, committedState);
  pickedFns.forEach(({ fn }) => {
    const ret = fn(committedState, oldState, refCtx);
    if (ret === false) shouldCurrentRefUpdate = false;
  });

  return shouldCurrentRefUpdate;
}