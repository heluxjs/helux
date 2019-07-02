import util, { clearObject} from '../support/util';
import ccContext from '../cc-context';
import { MODULE_DEFAULT, CC_DISPATCHER, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER } from '../support/constant';

export default function (warningErr) {
  if (ccContext.isCcAlreadyStartup) {
    if (util.isHotReloadMode()) {//只有处于
      clearObject(ccContext.globalStateKeys);
      clearObject(ccContext.reducer._reducer);
      clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER], {});
      clearObject(ccContext.computed._computedFn);
      clearObject(ccContext.computed._computedValue);
      clearObject(ccContext.event_handlers_);
      clearObject(ccContext.ccUniqueKey_handlerKeys_);
      const cct = ccContext.ccClassKey_ccClassContext_;
      Object.keys(cct).forEach(ccClassKey => {
        const ctx = cct[ccClassKey];
        clearObject(ctx.ccKeys);
      });
      clearObject(ccContext.handlerKey_handler_);
      clearObject(ccContext.ccKey_ref_, [CC_DISPATCHER]);
      clearObject(ccContext.refs, [CC_DISPATCHER]);
      clearObject(ccContext.fragmentCcKeys);
      clearObject(ccContext.ccKey_option_);
      let err = warningErr || new Error('attention: this method is only can been invoked before your app rendered!!');
      util.justTip(err);
    }else{
      util.justWarning(new Error('clear operation failed, current runtime is not running under hot reload mode!'));
    }
  }
}
