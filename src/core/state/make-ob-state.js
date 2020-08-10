import updateDep from '../ref/update-dep';
import ccContext from '../../cc-context/index';

const { store: { getModuleVer } } = ccContext;

export default function (ref, state, module, isForModule) {
  return new Proxy(state, {
    get: function (target, key) {
      // ensureStateNotExpired, 当实例失去模块数据依赖，回调方法直接使用ctx.state时，state里的模块数据可能已过期
      if (isForModule) {
        const modVer = getModuleVer(module);
        const ctx = ref.ctx;
        if (modVer !== ctx.__$$prevModuleVer) {
          ctx.__$$prevModuleVer = modVer;
          Object.assign(state, ctx.__$$mstate);
        }
      }
      updateDep(ref, module, key, isForModule);
      return target[key];
    },
    set: function (target, key, value) {
      // 这个warning暂时关闭，因为buildRefCtx阶段就生成了obState, refComputed里可能会调用commit向obState写入新的state
      // justWarning(`warning: state key[${key}] can not been changed manually, use api setState or dispatch instead`);

      // 允许赋最新值，否则silentUpdate状态合并会失效
      target[key] = value;
      // avoid Uncaught TypeError: 'set' on proxy: trap returned falsish for property '***'
      return true;
    }
  });
}
