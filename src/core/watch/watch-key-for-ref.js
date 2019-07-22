import { MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

export default function(stateModule, watchSpec, connect, refEntireState, committedState, callerCtx) {
  let shouldCurrentRefUpdate = true;
  if (watchSpec) {
    const globalStateKeys = moduleName_stateKeys_[MODULE_GLOBAL];
    const moduleStateKeys = moduleName_stateKeys_[stateModule];

    const { watchFns, module:watchSpecModule } = watchSpec;
    const watchStateKeys = util.okeys(watchFns);
    const len = watchStateKeys.length;
    let shouldNotUpdateLen = 0;

    watchStateKeys.forEach(key => {
      const { stateKey, skip, keyModule } = shouldSkipKey(watchSpecModule, key, stateModule, connect, moduleStateKeys, globalStateKeys);
      if (skip) return;

      const commitValue = committedState[stateKey];
      if (commitValue !== undefined) {
        const watchFn = watchFns[key];
        const targetModule = keyModule || stateModule;
        const moduleState = getState(targetModule);
        const fnCtx = { key: stateKey, module: targetModule, moduleState, committedState };

        const ret = watchFn(commitValue, refEntireState[stateKey], fnCtx, callerCtx);// watchFn(newValue, oldValue);
        if (ret === false) shouldNotUpdateLen++;
      }
    });

    //只有所有watch都返回false，才不触发当前实例更新
    if (shouldNotUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}