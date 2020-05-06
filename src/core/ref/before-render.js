/** eslint-disable */
import { START } from '../../support/priv-constant';
import makeObState from '../state/make-ob-state';

export default function (ref) {
  const ctx = ref.ctx;
  ctx.__$$renderStatus = START;

  // 处于收集观察依赖
  if (ctx.__$$autoWatch) {
    if (ctx.__$$hasModuleState) {
      //每次渲染前都将最新的模块state合进来, 防止render期间读取已过期状态, 此处使用mstate，避免触发get
      Object.assign(ref.state, ctx.mstate);

      // 每次生成的state都是一个新对象，让effect逻辑里prevState curState对比能够成立
      ref.state = makeObState(ref, ref.state, ctx.module, true);
      ctx.state = ref.state;
      // ctx.moduleState = makeObState(ref, ctx.mstate, ctx.module, true);

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