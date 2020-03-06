import * as util from '../../support/util';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import ccContext from '../../cc-context';

const { safeGetObjectFromObject, okeys, justWarning } = util;
const { reducer: { _module_fnNames_, _caller }, runtimeVar } = ccContext;

export default function (ref, setup, bindCtxToMethod) {
  const ctx = ref.ctx;

  ref.__$$isUnmounted = false;// false表示未卸载（不代表已挂载），在willUnmount时机才置为true，表示已卸载
  ref.__$$isMounted = false;// 未挂载，在didMount时机才置为true，表示已挂载
  ref.__$$isBF = true;// isBeforeFirstRender

  ctx.__$$isBSe = true;// isBeforeSetup
  const { connectedReducer, moduleReducer, dispatch, connect, module } = ctx;
  const connectedModules = okeys(connect);

  const allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);
  else {
    justWarning(`module[${module}] is in belongTo and connect both, it will cause redundant render.`);
  }

  //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法
  allModules.forEach(m => {
    let reducerObj;
    if (m === module) {
      reducerObj = moduleReducer;
    } else {
      reducerObj = safeGetObjectFromObject(connectedReducer, m);
    }

    const fnNames = _module_fnNames_[m] || [];
    fnNames.forEach(fnName => {
      reducerObj[fnName] = (payload, rkeyOrOption, delay) => dispatch(`${m}/${fnName}`, payload, rkeyOrOption, delay);
    });
  });
  ctx.reducer = _caller;

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
  ctx.__$$isBSe = false;

  triggerComputedAndWatch(ref);
}