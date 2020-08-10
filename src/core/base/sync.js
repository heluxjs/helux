
import ccContext from '../../cc-context';
import { SYNC } from '../../support/constant';
import buildMockEvent from './build-mock-event';
import extractStateByCcsync from '../state/extract-state-by-ccsync';
import changeRefState from '../state/change-ref-state';
import * as checker from '../param/checker';

const { store: { getState } } = ccContext;

export default function (spec, ref, e) {
  const refCtx = ref.ctx;
  const refModule = refCtx.module;

  let mockE = buildMockEvent(spec, e, refCtx);
  if (!mockE) return;//参数无效 例如 <input onChange={this.sync}/> 导致

  const currentTarget = mockE.currentTarget;
  const { dataset, value, extraState, noAutoExtract } = currentTarget;

  if (e && e.stopPropagation) e.stopPropagation();

  const { ccint, ccdelay, ccrkey } = dataset;
  let ccsync = dataset.ccsync;

  if (ccsync.startsWith('/')) {
    ccsync = `${refModule}${ccsync}`;//附加上默认模块值
  }

  if (ccsync.includes('/')) {// syncModuleState 同步模块的state状态
    const targetModule = ccsync.split('/')[0];
    checker.checkModuleName(targetModule, false);

    const { ccKey, ccUniqueKey } = refCtx;
    const options = { calledBy: SYNC, ccKey, ccUniqueKey, module: targetModule, renderKey: ccrkey, delay: ccdelay };

    if (noAutoExtract) {
      if (extraState) changeRefState(extraState, options, ref);
      return;
    }

    const fullState = targetModule !== refModule ? getState(targetModule) : ref.state;

    const { state } = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool);
    changeRefState(state, options, ref);
  } else {//调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
    if (noAutoExtract) {
      if (extraState) ref.setState(extraState, null, ccrkey, ccdelay);
      return;
    }

    const { state } = extractStateByCcsync(ccsync, value, ccint, ref.state, mockE.isToggleBool);
    ref.setState(state, null, ccrkey, ccdelay);
  }
}
