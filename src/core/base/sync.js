
import ccContext from '../../cc-context';
import { MOCKE_KEY, SYNC } from '../../support/constant';
import buildMockEvent from './build-mock-event';
import extractStateByCcsync from '../state/extract-state-by-ccsync';
import changeRefState from '../state/change-ref-state';
import * as checker from '../checker';

const { store: { getState } } = ccContext;

export default function (spec, ref, e) {
  const refCtx = ref.ctx;
  const refModule = refCtx.module;

  let mockE = null;
  if (spec[MOCKE_KEY]) {
    mockE = spec;
  } else {//可能是来自$$sync生成的setter调用
    mockE = buildMockEvent(spec, e, refCtx);
  }

  if (!mockE) return;//参数无效

  const currentTarget = mockE.currentTarget;
  const { dataset, value, extraState} = currentTarget;

  if (e && e.stopPropagation) e.stopPropagation();

  const { ccsync, ccint, ccdelay, ccrkey } = dataset;

  if (ccsync.startsWith('/')) {
    dataset.ccsync = `${refModule}${ccsync}`;//附加上默认模块值
  }

  if (ccsync.includes('/')) {// syncModuleState 同步模块的state状态
    const targetModule = ccsync.split('/')[0];
    checker.checkModuleName(targetModule, false);

    const { ccKey, ccUniqueKey } = refCtx;
    if (extraState) {
      return changeRefState(extraState, { calledBy: SYNC, ccKey, ccUniqueKey, module: targetModule, renderKey: ccrkey, delay: ccdelay }, ref);
    }

    const fullState = targetModule !== refModule ? getState(targetModule) : ref.state;

    const { state } = extractStateByCcsync(ccsync, value, ccint, fullState, mockE.isToggleBool);
    return changeRefState(state, { calledBy: SYNC, ccKey, ccUniqueKey: ccUniqueKey, module: targetModule, renderKey: ccrkey, delay: ccdelay }, ref);
  } else {//调用自己的setState句柄触发更新，key可能属于local的，也可能属于module的
    if (extraState) {
      return ref.setState(extraState, null, ccrkey, ccdelay);
    }

    const { state } = extractStateByCcsync(ccsync, value, ccint, ref.state, mockE.isToggleBool);
    return ref.setState(state, null, ccrkey, ccdelay);
  }
};