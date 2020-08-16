import * as util from '../../support/util';
import { MODULE_GLOBAL, NOT_MOUNT } from '../../support/constant';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import ccContext from '../../cc-context';
import makeCuRetContainer from '../computed/make-cu-ret-container';
import makeCuRefObContainer from '../computed/make-cu-ref-ob-container';

const { okeys, makeCuDepDesc } = util;
const { runtimeVar } = ccContext;

export default function (ref, setup, bindCtxToMethod) {
  const ctx = ref.ctx;
  ref.__$$ms = NOT_MOUNT;
  // flag is in before mount setup
  ctx.__$$inBM = true;

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

  //!!! 把拦截了setter getter的计算结果容器赋值给refComputed
  // 这一波必需在setup调用之后做，因为setup里会调用ctx.computed写入computedRetKeyFns等元数据
  ctx.refComputedValue = makeCuRetContainer(ctx.computedRetKeyFns, ctx.refComputedOri);
  ctx.refComputed = makeCuRefObContainer(ref, null, true, true);
  
  // 所有的组件都会自动连接到$$global模块，但是有可能没有使用$$global模块数据做过任何实例计算
  // 这里需要补齐computedDep.$$global 和 watchDep.$$global 的依赖描述数据
  // 防止后续逻辑里出错
  const { computedDep, watchDep } = ctx;
  if (!computedDep[MODULE_GLOBAL]) {
    computedDep[MODULE_GLOBAL] = makeCuDepDesc();
  }
  if (!watchDep[MODULE_GLOBAL]) {
    watchDep[MODULE_GLOBAL] = makeCuDepDesc();
  }

  triggerComputedAndWatch(ref);
  ctx.__$$inBM = false;
}
