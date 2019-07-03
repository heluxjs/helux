import util from '../../support/util';
import { CC_FRAGMENT_PREFIX } from '../../support/constant';
import ccContext from '../../cc-context';
import pickOneRef from '../../core/ref/pick-one-ref';

export default function (isLazy, action, payLoadWhenActionIsString, delay, identity='', {ccClassKey, ccKey, throwError} = {}) {
  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error(`api doc: cc.dispatch(action:Action|String, payload?:any, delay?:number, idt?:string), when action is String, second param means payload`);
  }
  
  let dispatchFn;
  try {
    if (ccClassKey && ccKey) {
      const uKey = util.makeUniqueCcKey(ccClassKey, ccKey);
      const targetRef = ccContext.refs[uKey];
      if (!targetRef) {
        throw new Error(`no ref found for uniqueCcKey:${uKey}!`);
      } else {
        dispatchFn = isLazy ? targetRef.$$lazyDispatch : targetRef.$$dispatch;
      }
    } else {
      let module = '';
      if(typeof action == 'string' && action.includes('/')){
        module = action.split('/')[0];
      }

      let ref;
      if(module!=='*'){
        ref = pickOneRef(module);
      }else{
        ref = pickOneRef();
      }

      if (ref.cc.ccState.ccClassKey.startsWith(CC_FRAGMENT_PREFIX)) {
        dispatchFn = isLazy ? ref.__fragmentParams.lazyDispatch : ref.__fragmentParams.dispatch;
      } else {
        dispatchFn = isLazy ? ref.$$lazyDispatch : ref.$$dispatch;
      }
    }

    if(typeof action === 'string' && action.startsWith('*')){
        const reducerName = action.split('/').pop();
        const rnList_ = ccContext.reducer._reducerName_FullReducerNameList_[reducerName];
        rnList_.forEach(fullReducerName=>{
          dispatchFn(fullReducerName, payLoadWhenActionIsString, delay, identity);
        });
    }else{
      dispatchFn(action, payLoadWhenActionIsString, delay, identity)
    }
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}