import { START } from '../../support/priv-constant';
import { justWarning } from '../../support/util';

export default function (ref, state, module) {
  return new Proxy(state, {
    get: function (target, key) {
      const refCtx = ref.ctx;
      if (refCtx.__$$renderStatus === START) {
        if(module){
          refCtx.__$$collectingModuleWatchedKeys_[module][key] = 1;
        }else{
          if(!refCtx.privStateKeys.includes(key)){
            refCtx.__$$collectingWatchedKeys_[key] = 1;
          }
        }
      }
      return target[key];
    },
    set: function (target, key) {
      justWarning(`warnning: state can not been changed manually, use api setState or dispatch instead`);
      target[key] = target[key];
      // avoid Uncaught TypeError: 'set' on proxy: trap returned falsish for property '***'
      return true;
    }
  });
}