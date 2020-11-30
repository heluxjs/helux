import ccContext from '../../cc-context';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import { CATE_MODULE, FN_CU } from '../../support/constant';
import configureDepFns from '../base/configure-dep-fns';
import findDepFnsToExecute from '../base/find-dep-fns-to-execute';
import pickDepFns from '../base/pick-dep-fns';
import makeCuRetContainer from '../computed/make-cu-ret-container';

const { isPJO } = util;

export default function (module, computed = {}) {
  if (!isPJO(computed)) {
    throw new Error(`module[${module}] computed ${NOT_A_JSON}`);
  }

  const ccComputed = ccContext.computed;
  const rootState = ccContext.store.getState();
  const rootComputedValue = ccComputed.getRootComputedValue();
  const rootComputedDep = ccComputed.getRootComputedDep();
  const rootComputedRaw = ccComputed.getRootComputedRaw();

  rootComputedRaw[module] = computed;
  const moduleState = rootState[module];
  configureDepFns(
    CATE_MODULE, { type: FN_CU, module, stateKeys: util.okeys(moduleState), dep: rootComputedDep }, computed
  );

  const d = ccContext.getDispatcher();
  const curDepComputedFns = (committedState, isBeforeMount) =>
    pickDepFns(isBeforeMount, CATE_MODULE, FN_CU, rootComputedDep, module, moduleState, committedState);

  // 在init-module-state那里已safeGet, 这里可以安全的直接读取
  const cuOri = ccComputed._computedValueOri[module];
  rootComputedValue[module] = makeCuRetContainer(computed, cuOri);
  const moduleComputedValue = rootComputedValue[module];

  findDepFnsToExecute(
    d, module, d && d.ctx.module, moduleState, curDepComputedFns,
    moduleState, moduleState, moduleState, util.makeCallInfo(module), true,
    FN_CU, CATE_MODULE, moduleComputedValue,
  );
}
