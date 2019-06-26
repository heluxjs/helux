import { MODULE_GLOBAL } from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import shouldSkipKey from '../base/should-skip-key';

const getState = ccContext.store.getState;
const moduleName_stateKeys_ = ccContext.moduleName_stateKeys_;

export default function(stateModule, watchSpec, connect, refEntireState, userCommitState, ctx) {
  let shouldCurrentRefUpdate = true;
  if (watchSpec) {
    const globalStateKeys = moduleName_stateKeys_[MODULE_GLOBAL];
    const moduleStateKeys = moduleName_stateKeys_[stateModule];

    const { watchFns, module:watchSpecModule } = watchSpec;
    const watchStateKeys = util.okeys(watchFns);
    const len = watchStateKeys.length;
    let shouldNouUpdateLen = 0;

    watchStateKeys.forEach(key => {
      const { stateKey, skip, keyModule } = shouldSkipKey(watchSpecModule, key, stateModule, connect, moduleStateKeys, globalStateKeys);
      if (skip) return;

      const commitValue = userCommitState[stateKey];
      if (commitValue !== undefined) {
        const watchFn = watchFns[key];
        const targetModule = keyModule || stateModule;
        const moduleState = getState(targetModule);
        const keyDesc = { key: stateKey, module: targetModule, moduleState };

        const ret = watchFn(commitValue, refEntireState[stateKey], keyDesc, ctx);// watchFn(newValue, oldValue);
        if (ret === false) shouldNouUpdateLen++;
      }
    });

    //只有所有watch都返回false，才不触发当前实例更新
    if (shouldNouUpdateLen === len) shouldCurrentRefUpdate = false;
  }

  return shouldCurrentRefUpdate;
}