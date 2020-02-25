import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { CATE_MODULE } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import pickDepFns from '../base/pick-dep-fns';

const { safeGetObjectFromObject, isPlainJsonObject } = util;
const callInfo = { payload: null, renderKey: '', delay: -1 };

export default function (module, computed) {
  if(!computed) return;

  const tip = `module[${module}] computed`;
  if (!isPlainJsonObject(computed)) {
    throw new Error(`${tip} ${NOT_A_JSON}`);
  }
  checker.checkModuleName(module, false, `${tip} is invalid`);

  const ccComputed = ccContext.computed;
  const rootState = ccContext.store.getState();
  const rootComputedValue = ccComputed.getRootComputedValue();
  const rootComputedDep = ccComputed.getRootComputedDep();
  const rootComputedRaw = ccComputed.getRootComputedRaw();

  rootComputedRaw[module] = computed;
  const moduleState = rootState[module];
  configureDepFns(CATE_MODULE, { module, stateKeys: util.okeys(moduleState), dep: rootComputedDep }, computed);

  const d = ccContext.getDispatcher();
  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(isBeforeMount, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);
  const deltaCommittedState = Object.assign({}, moduleState);
  const moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);

  findDepFnsToExecute(
    d && d.ctx, module, d && d.ctx.module, moduleState, curDepComputedFns,
    moduleState, moduleState, deltaCommittedState, callInfo, true,
    'computed', CATE_MODULE, moduleComputedValue,
  );

}