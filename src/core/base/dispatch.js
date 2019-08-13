import util from '../../support/util';
import ccContext from '../../cc-context';
import pickOneRef from '../../core/ref/pick-one-ref';

export default function (isLazy, action, payLoadWhenActionIsString, delay, renderKey = '', { ccClassKey, ccKey, throwError } = {}) {
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
        dispatchFn = isLazy ? targetRef.ctx.lazyDispatch : targetRef.ctx.dispatch;
      }
    } else {
      let module = '';
      if (typeof action == 'string' && action.includes('/')) {
        module = action.split('/')[0];
      }

      let ref;
      if (module !== '*') {
        ref = pickOneRef(module);
      } else {
        ref = pickOneRef();
      }

      dispatchFn = isLazy ? ref.ctx.lazyDispatch : ref.ctx.dispatch;
    }

    if (typeof action === 'string' && action.startsWith('*')) {
      const reducerModName = action.split('/').pop();
      const fullFnNames = ccContext.reducer._reducerFnName_fullFnNames_[reducerModName];
      if(!fullFnNames) return;
      const tasks = [];
      fullFnNames.forEach(fullFnName => {
        tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, delay, renderKey));
      });
      return Promise.all(tasks);
    } else {
      return dispatchFn(action, payLoadWhenActionIsString, delay, renderKey);
    }
  } catch (err) {
    if (throwError) throw err;
    else util.justWarning(err.message);
  }
}