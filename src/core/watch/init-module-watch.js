import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import { CATE_MODULE } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import pickDepFns from '../base/pick-dep-fns';

const { isPlainJsonObject } = util;


/**
 * 设置watch值，过滤掉一些无效的key
 */
export default function (module, moduleWatch, append = false) {
  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error(`StartUpOption.watch.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `watch.${module} is invalid`);

  const rootWatchDep = ccContext.watch.getRootWatchDep();
  const rootWatchRaw = ccContext.watch.getRootWatchRaw();

  if (append) {
    const ori = rootWatchRaw[module];
    if (ori) Object.assign(ori, moduleWatch);
    else rootWatchRaw[module] = moduleWatch;
  } else {
    rootWatchRaw[module] = moduleWatch;
  }

  const getState = ccContext.store.getState;
  const moduleState = getState(module);

  configureDepFns(CATE_MODULE, { module, state: moduleState, dep: rootWatchDep }, moduleWatch);

  const { pickedFns, setted, changed } = pickDepFns(true, CATE_MODULE, 'watch', rootWatchDep, module, moduleState, moduleState);
  pickedFns.forEach(({ retKey, fn, depKeys }) => {
    const fnCtx = { retKey, isBeforeMount:false, setted, changed, stateModule: module, refModule: null, oldState: moduleState, committedState: moduleState, refCtx: null };
    const fistDepKey = depKeys[0];

    if (depKeys.length === 1 && fistDepKey !== '*') {
      if (firstDepKey !== retKey) {
        fn(moduleState, moduleState, fnCtx);
      } else {
        fn(moduleState[fistDepKey], moduleState[fistDepKey], fnCtx);
      }
    }else{
      fn(moduleState, moduleState, fnCtx);
    }
  });

}