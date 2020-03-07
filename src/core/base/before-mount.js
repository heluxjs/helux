import * as util from '../../support/util';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import ccContext from '../../cc-context';
import makeObCuContainer from '../computed/make-cu-ob-container';

const { okeys } = util;
const { runtimeVar } = ccContext;

export default function (ref, setup, bindCtxToMethod) {
  const ctx = ref.ctx;

  ref.__$$isUnmounted = false;// false表示未卸载（不代表已挂载），在willUnmount时机才置为true，表示已卸载
  ref.__$$isMounted = false;// 未挂载，在didMount时机才置为true，表示已挂载
  ref.__$$isBF = true;// isBeforeFirstRender

  // flag before setup
  ctx.__$$isBSe = true;

  //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后
  if (setup) {
    if (typeof setup !== 'function') throw new Error('type of setup must be function');

    const settingsObj = setup(ctx) || {};
    if (!util.isPJO(settingsObj)) throw new Error('type of setup return result must be an plain json object');

    //优先读自己的，再读全局的
    if (bindCtxToMethod === true || (runtimeVar.bindCtxToMethod === true && bindCtxToMethod !== false)) {
      okeys(settingsObj).forEach(name => {
        const settingValue = settingsObj[name];
        if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
      });
    }
    ctx.settings = settingsObj;
  }

  // flag after setup
  ctx.__$$isBSe = false;

  //!!! 把拦截了setter getter的计算结果容器赋值给refComputed
  // 这一波必需在setup调用之后做，因为setup里会调用ctx.computed写入computedRetKeyFns等元数据
  ctx.refComputed = makeObCuContainer(ctx.computedRetKeyFns, ctx.refComputedOri);

  triggerComputedAndWatch(ref);
}