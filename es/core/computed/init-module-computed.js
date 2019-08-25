import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import { CATE_MODULE } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import pickDepFns from '../base/pick-dep-fns';

const { safeGetObjectFromObject, isPlainJsonObject } = util;

export default function (module, computed, append = false) {
  if (!isPlainJsonObject(computed)) {
    throw new Error(`StartUpOption.computed.${module}'s value is not a plain json object!`);
  }
  checker.checkModuleName(module, false, `computed.${module} is invalid`);
  const ccComputed = ccContext.computed;
  const rootState = ccContext.store.getState();
  const rootComputedValue = ccComputed.getRootComputedValue();
  const rootComputedDep = ccComputed.getRootComputedDep();
  const rootComputedRaw = ccComputed.getRootComputedRaw();

  if (append) {
    const ori = rootComputedRaw[module];
    if (ori) Object.assign(ori, computed);
    else rootComputedRaw[module] = computed;
  } else {
    rootComputedRaw[module] = computed;
  }

  const moduleState = rootState[module];

  configureDepFns(CATE_MODULE, { module, state: moduleState, dep: rootComputedDep }, computed);

  const { pickedFns, setted, changed } = pickDepFns(true, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, moduleState);
  pickedFns.forEach(({ retKey, fn, depKeys }) => {
    const fnCtx = { retKey, setted, changed, stateModule: module, refModule: null, oldState: moduleState, committedState: moduleState, refCtx: null };

    const fistDepKey = depKeys[0];
    let computedValue;

    if (depKeys.length === 1 && fistDepKey !== '*') {
      computedValue = fn(moduleState[fistDepKey], moduleState[fistDepKey], fnCtx);
    } else {
      computedValue = fn(moduleState, moduleState, fnCtx);
    }

    const moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);;
    moduleComputedValue[retKey] = computedValue;
  });

}