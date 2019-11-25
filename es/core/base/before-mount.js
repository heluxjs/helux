import * as util from '../../support/util';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import ccContext from '../../cc-context';

const { safeGetObjectFromObject, okeys, justWarning } = util;
const { reducer: { _reducerModule_fnNames_, _reducerCaller, _lazyReducerCaller } } = ccContext;

export default function (ref, setup, bindCtxToMethod) {
  ref.__$$isUnmounted = false;

  const ctx = ref.ctx;
  const { connectedReducer, connectedLazyReducer, moduleReducer, moduleLazyReducer, dispatch, lazyDispatch, connect, module } = ctx;
  const connectedModules = okeys(connect);

  const allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);
  else{
    justWarning(`module[${module}] is in belongTo and connect both, it will cause redundant render.`);
  }

  //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法
  allModules.forEach(m => {
    let reducerObj, lazyReducerObj;
    if(m === module){
      reducerObj = moduleReducer;
      lazyReducerObj = moduleLazyReducer;
    }else{
      reducerObj = safeGetObjectFromObject(connectedReducer, m);
      lazyReducerObj = safeGetObjectFromObject(connectedLazyReducer, m);
    }

    const fnNames = _reducerModule_fnNames_[m] || [];
    fnNames.forEach(fnName => {
      reducerObj[fnName] = (payload, rkey, delay) => dispatch(`${m}/${fnName}`, payload, rkey, delay);
      lazyReducerObj[fnName] = (payload, rkey, delay) => lazyDispatch(`${m}/${fnName}`, payload, rkey, delay);
    });
  });
  ctx.reducer = _reducerCaller;
  ctx.lazyReducer = _lazyReducerCaller;

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