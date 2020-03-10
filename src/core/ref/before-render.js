import { START } from '../../support/priv-constant';
import makeObState from '../state/make-ob-state';


export default function (ref) {
  const ctx = ref.ctx;
  ctx.__$$renderStatus = START;

  // 在buildRefCtx阶段已完成相关的obState注入，这里不再需要
  if (ctx.renderCount === 1) {
    return;
  }

  // 处于收集观察依赖
  if (ctx.__$$autoWatch) {

    if (ctx.__$$hasModuleState) {
      // 这里也不需要再次转换为obState，在buildRefCtx阶段阶段转换过一次就始终是可观察对象了
      // ref.state = makeObState(ref, ref.state);

      ctx.state = ref.state;
      ctx.moduleState = makeObState(ref, ctx.mstate);

      ctx.__$$curWaKeys = {};
      ctx.__$$compareWaKeys = ctx.__$$nextCompareWaKeys;
      ctx.__$$compareWaKeyCount = ctx.__$$nextCompareWaKeyCount;

      // 渲染期间再次收集
      ctx.__$$nextCompareWaKeys = {};
      ctx.__$$nextCompareWaKeyCount = 0;
    }

    const { connectedModules, connect } = ctx;
    connectedModules.forEach(m => {
      // 非自动收集，在make-ob-state里不会触发get，这里直接跳出
      if (connect[m] !== '-') return;

      ctx.__$$curConnWaKeys[m] = {};
      ctx.__$$compareConnWaKeys[m] = ctx.__$$nextCompareConnWaKeys[m];
      ctx.__$$compareConnWaKeyCount[m] = ctx.__$$nextCompareConnWaKeyCount[m];

      // 渲染期间再次收集
      ctx.__$$nextCompareConnWaKeys[m] = {};
      ctx.__$$nextCompareConnWaKeyCount[m] = 0;
    });
  }

}