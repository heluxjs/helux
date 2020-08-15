import ccContext from '../../cc-context';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { CATE_MODULE, FN_WATCH } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import pickDepFns from '../base/pick-dep-fns';

const { isPJO, safeGet, okeys } = util;

/**
 * 设置watch值，过滤掉一些无效的key
 */
export default function (module, moduleWatch = {}, append = false) {
  if (!isPJO(moduleWatch)) {
    throw new Error(`module[${module}] watch ${NOT_A_JSON}`);
  }

  const rootWatchDep = ccContext.watch.getRootWatchDep();
  const rootWatchRaw = ccContext.watch.getRootWatchRaw();
  const rootComputedValue = ccContext.computed.getRootComputedValue();

  if (append) {
    const ori = rootWatchRaw[module];
    if (ori) Object.assign(ori, moduleWatch);
    else rootWatchRaw[module] = moduleWatch;
  } else {
    rootWatchRaw[module] = moduleWatch;
  }

  const getState = ccContext.store.getState;
  const moduleState = getState(module);
  configureDepFns(CATE_MODULE, { module, stateKeys: okeys(moduleState), dep: rootWatchDep }, moduleWatch);

  const d = ccContext.getDispatcher();
  const curDepWatchFns = (committedState, isFirstCall) =>
    pickDepFns(isFirstCall, CATE_MODULE, FN_WATCH, rootWatchDep, module, moduleState, committedState);
  const moduleComputedValue = safeGet(rootComputedValue, module);

  findDepFnsToExecute(
    d, module, d && d.ctx.module, moduleState, curDepWatchFns,
    moduleState, moduleState, moduleState, util.makeCallInfo(module), true,
    FN_WATCH, CATE_MODULE, moduleComputedValue,
  );
}
