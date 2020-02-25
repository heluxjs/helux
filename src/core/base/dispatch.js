import * as util from '../../support/util';
import ccContext from '../../cc-context';
import pickOneRef from '../../core/ref/pick-one-ref';

const { makeUniqueCcKey, justWarning } = util;

export default function (action, payLoadWhenActionIsString, rkOrOptions = '', delay, { ccClassKey, ccKey, throwError, isSilent = false } = {}) {
  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error(`api doc: cc.dispatch(action:Action|String, payload?:any, delay?:number, idt?:string), when action is String, second param means payload`);
  }

  let dispatchFn;
  try {
    if (ccClassKey && ccKey) {
      const uKey = makeUniqueCcKey(ccClassKey, ccKey);
      const targetRef = ccContext.refs[uKey];
      if (!targetRef) {
        throw new Error(`no ref found for uniqueCcKey:${uKey}!`);
      } else {
        dispatchFn = targetRef.ctx.dispatch;
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

      dispatchFn = ref.ctx.dispatch;
    }

    if (typeof action === 'string' && action.startsWith('*')) {
      const reducerModName = action.split('/').pop();
      const fullFnNames = ccContext.reducer._fnName_fullFnNames_[reducerModName];
      if (!fullFnNames) return;
      const tasks = [];
      fullFnNames.forEach(fullFnName => {
        tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, rkOrOptions, delay));
      });
      return Promise.all(tasks);
    } else {
      return dispatchFn(action, payLoadWhenActionIsString, rkOrOptions, delay);
    }
  } catch (err) {
    if (throwError) throw err;
    else justWarning(err.message);
  }
}