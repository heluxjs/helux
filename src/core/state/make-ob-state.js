import { START } from '../../support/priv-constant';
import { justWarning } from '../../support/util';
import ccContext from '../../cc-context';

const { waKey_uKeyMap_ } = ccContext;

// before render
// cur: {} compare: {a:2, b:2, c:2} compareCount=3 nextCompare:{}
//
// rendering input
// cur: {a:'val', c:'val', d:'val'}
//
// after render
// cur: {a:1, c:1, c:1} compare: {a:1, b:2, c:1, d:1} nextCompare:{a:2, c:2, d:2}
//
// then concent will know b should delete dep because=0, 
// compare key count=4>3 or compare include 2, so should let cache expire
//
// before next render
// cur: {} compare: {a:2, c:2, d:2} compareCount=3 nextCompare:{}

export default function (ref, state, module) {
  return new Proxy(state, {
    get: function (target, key) {
      const refCtx = ref.ctx;
      if (refCtx.__$$renderStatus === START) {
        
        const ccUniqueKey = refCtx.ccUniqueKey;
        if(module){
          const waKey = `${module}/${key}`;
          const {
            __$$curConnWaKeys,
            __$$compareConnWaKeys,
            __$$nextCompareConnWaKeys,
            __$$nextCompareConnWaKeyCount,
          } = refCtx;

          waKey_uKeyMap_[waKey][ccUniqueKey] = 1;
          __$$curConnWaKeys[module][key] = 1;
          __$$compareConnWaKeys[module][key] = 1;
          const tmpMap = __$$nextCompareConnWaKeys[module];
          if (!tmpMap[key]) {
            tmpMap[key] = 2;
            __$$nextCompareConnWaKeyCount[module]++;
          }
        }else{
          if(!refCtx.privStateKeys.includes(key)){
            const waKey = `${refCtx.module}/${key}`;
            const {
              __$$curWaKeys,
              __$$compareWaKeys,
              __$$nextCompareWaKeys,
            } = refCtx;

            waKey_uKeyMap_[waKey][ccUniqueKey] = 1;
            __$$curWaKeys[key] = 1;
            __$$compareWaKeys[key] = 1;
            if (!__$$nextCompareWaKeys[key]) {
              __$$nextCompareWaKeys[key] = 2;
              refCtx.__$$nextCompareWaKeyCount++;
            }
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