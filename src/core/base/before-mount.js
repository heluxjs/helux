import * as util from '../../support/util';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import ccContext from '../../cc-context';

const { safeGetObjectFromObject, okeys, justWarning } = util;
const { reducer: { _reducerModule_fnNames_ } } = ccContext;

export default function (ref, setup, bindCtxToMethod) {
  ref.__$$isUnmounted = false;

  const ctx = ref.ctx;
  const { reducer, lazyReducer, dispatch, lazyDispatch, connect, module } = ctx;
  const connectedModules = okeys(connect);

  const allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);
  else{
    justWarning(`module[${module}] are in belongTo and connect both, it will cause redundant render.`);
  }

  //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法
  allModules.forEach(m => {
    const refReducerFnObj = safeGetObjectFromObject(reducer, m);
    const refLazyReducerFnObj = safeGetObjectFromObject(lazyReducer, m);
    const fnNames = _reducerModule_fnNames_[m] || [];
    fnNames.forEach(fnName => {
      refReducerFnObj[fnName] = (payload, delay, rkey) => dispatch(`${m}/${fnName}`, payload, delay, rkey);
      refLazyReducerFnObj[fnName] = (payload, delay, rkey) => lazyDispatch(`${m}/${fnName}`, payload, delay, rkey);
    });
  });

  //先调用setup，setup可能会定义computed,watch，同时也可能调用ctx.reducer,所以setup放在fill reducer之后
  if (setup) {
    if (typeof setup !== 'function') throw new Error('type of setup must be function');

    const settingsObj = setup(ctx) || {};
    if (!util.isPlainJsonObject(settingsObj)) throw new Error('type of setup return result must be an plain json object');
    const globalBindCtx = ccContext.bindCtxToMethod;

    //优先读自己的，再读全局的
    if (bindCtxToMethod === true || (globalBindCtx === true && bindCtxToMethod !== false)) {
      okeys(settingsObj).forEach(name => {
        const settingValue = settingsObj[name];
        if (typeof settingValue === 'function') settingsObj[name] = settingValue.bind(ref, ctx);
      });
    }
    ctx.settings = settingsObj;
  }

  triggerComputedAndWatch(ref);
}