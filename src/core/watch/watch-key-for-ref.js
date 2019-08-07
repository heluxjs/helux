import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

export default function (refCtx, stateModule, oldState, committedState) {
  const { watchSpec, connect, module: refModule } = refCtx;
  if (watchSpec.hasFn !== true) return true;

  let shouldCurrentRefUpdate = true;
  const moduleStateKeys = moduleName_stateKeys_[refModule];

  const { watchFns } = watchSpec;
  const watchStateKeys = util.okeys(watchFns);
  const len = watchStateKeys.length;
  let shouldNotUpdateLen = 0;

  watchStateKeys.forEach(key => {
    const { stateKey, skip, keyModule } = shouldSkipKey(key, refModule, stateModule, connect, moduleStateKeys);
    if (skip) return;

    const commitValue = committedState[stateKey];
    if (commitValue !== undefined) {
      const watchFn = watchFns[key];
      const targetModule = keyModule || refModule;
      const moduleState = getState(targetModule);
      const fnCtx = { key: stateKey, module: targetModule, moduleState, committedState };

      const ret = watchFn(commitValue, oldState[stateKey], fnCtx, refCtx);// watchFn(newValue, oldValue);
      if (ret === false) shouldNotUpdateLen++;
    }
  });

  //只有所有watch都返回false，才不触发当前实例更新
  if (shouldNotUpdateLen === len) shouldCurrentRefUpdate = false;

  return shouldCurrentRefUpdate;
}