import ccContext from '../../cc-context';
import * as checker from '../checker';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { CATE_MODULE, FN_CU } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import pickDepFns from '../base/pick-dep-fns';
import makeObCuContainer from '../computed/make-cu-ob-container';

const { safeGet, isPJO } = util;

export default function (module, computed) {
  if(!computed) return;

  const tip = `module[${module}] computed`;
  if (!isPJO(computed)) {
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
  configureDepFns(CATE_MODULE, { type: FN_CU, module, stateKeys: util.okeys(moduleState), dep: rootComputedDep }, computed);

  const d = ccContext.getDispatcher();
  const curDepComputedFns = (committedState, isBeforeMount) => pickDepFns(isBeforeMount, CATE_MODULE, 'computed', rootComputedDep, module, moduleState, committedState);
  const deltaCommittedState = Object.assign({}, moduleState);

  // 在init-module-state那里已safeGet, 这里可以安全的直接读取
  const cuOri = ccComputed._computedValueOri[module];
  rootComputedValue[module] = makeObCuContainer(computed, cuOri);
  const moduleComputedValue = rootComputedValue[module];

  findDepFnsToExecute(
    d, module, d && d.ctx.module, moduleState, curDepComputedFns,
    moduleState, moduleState, deltaCommittedState, util.makeCallInfo(module), true,
    'computed', CATE_MODULE, moduleComputedValue,
  );

}