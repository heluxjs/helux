import React from 'react';
import ReactDOM from 'react-dom';
import util, { clearObject } from '../support/util';
import { ERR, MODULE_DEFAULT, CC_DISPATCHER_BOX, CC_DISPATCHER, MODULE_CC, MODULE_GLOBAL } from '../support/constant';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
import * as boot from '../core/base/boot';

export default function ({
  store = {},
  reducer = {},
  init = null,
  computed = {},
  watch = {},
  sharedToGlobalMapping = {},
  moduleSingleClass = {},
  middlewares = [],
  isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
  isDebug = false,
  errorHandler = null,
  isHot = false,
  autoCreateDispatcher = true,
} = {}) {
  try {
    util.justTip(`cc version ${ccContext.info.version}`);
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
    ccContext.isStrict = isStrict;
    ccContext.isDebug = isDebug;

    if (ccContext.isCcAlreadyStartup) {
      const err = util.makeError(ERR.CC_ALREADY_STARTUP);
      if (util.isHotReloadMode()) {
        clearObject(ccContext.globalStateKeys);
        clearObject(ccContext.reducer._reducer);
        clearObject(ccContext.store._state, [MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL], {});
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
        util.hotReloadWarning(err);
      }
      else throw err;
    }

    boot.configSharedToGlobalMapping(sharedToGlobalMapping);
    boot.configModuleSingleClass(moduleSingleClass);

    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (autoCreateDispatcher) {
      if (!ccContext.refs[CC_DISPATCHER]) {
        const Dispatcher = createDispatcher();
        let box = document.querySelector(`#${CC_DISPATCHER_BOX}`);
        if (!box) {
          box = document.createElement('div');
          box.id = CC_DISPATCHER_BOX;
          const boxSt = box.style;
          boxSt.position = 'fixed';
          boxSt.left = 0;
          boxSt.top = 0;
          boxSt.display = 'none';
          boxSt.zIndex = -888666;
          document.body.append(box);
        }
        ReactDOM.render(React.createElement(Dispatcher), box);
        util.justTip(`[[startUp]]: cc create a CcDispatcher automatically`);
      } else {
        util.justTip(`[[startUp]]: CcDispatcher existed already`);
      }
    } else {
      throw 'customizing Dispatcher is not allowed in current version cc';
    }

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
      window.cccc = ccContext.computed._computedValue;
    }

    ccContext.isCcAlreadyStartup = true;
  } catch (err) {
    if (errorHandler) errorHandler(err);
    else throw err;
  }
}