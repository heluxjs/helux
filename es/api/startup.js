import React from 'react';
import ReactDOM from 'react-dom';
import util, { clearObject } from '../support/util';
import { ERR, MODULE_DEFAULT, CC_DISPATCHER_BOX, CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
import * as boot from '../core/base/boot';
export default function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$store = _ref.store,
      store = _ref$store === void 0 ? {} : _ref$store,
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? {} : _ref$reducer,
      _ref$init = _ref.init,
      init = _ref$init === void 0 ? null : _ref$init,
      _ref$computed = _ref.computed,
      computed = _ref$computed === void 0 ? {} : _ref$computed,
      _ref$watch = _ref.watch,
      watch = _ref$watch === void 0 ? {} : _ref$watch,
      _ref$sharedToGlobalMa = _ref.sharedToGlobalMapping,
      sharedToGlobalMapping = _ref$sharedToGlobalMa === void 0 ? {} : _ref$sharedToGlobalMa,
      _ref$moduleSingleClas = _ref.moduleSingleClass,
      moduleSingleClass = _ref$moduleSingleClas === void 0 ? {} : _ref$moduleSingleClas,
      _ref$middlewares = _ref.middlewares,
      middlewares = _ref$middlewares === void 0 ? [] : _ref$middlewares,
      _ref$isStrict = _ref.isStrict,
      isStrict = _ref$isStrict === void 0 ? false : _ref$isStrict,
      _ref$isDebug = _ref.isDebug,
      isDebug = _ref$isDebug === void 0 ? false : _ref$isDebug,
      _ref$errorHandler = _ref.errorHandler,
      errorHandler = _ref$errorHandler === void 0 ? null : _ref$errorHandler,
      _ref$isHot = _ref.isHot,
      isHot = _ref$isHot === void 0 ? false : _ref$isHot,
      _ref$autoCreateDispat = _ref.autoCreateDispatcher,
      autoCreateDispatcher = _ref$autoCreateDispat === void 0 ? true : _ref$autoCreateDispat;

  try {
    util.justTip("cc version " + ccContext.info.version);
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
    ccContext.isStrict = isStrict;
    ccContext.isDebug = isDebug;
    boot.configSharedToGlobalMapping(sharedToGlobalMapping);
    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (ccContext.isCcAlreadyStartup) {
      var err = util.makeError(ERR.CC_ALREADY_STARTUP);

      if (util.isHotReloadMode()) {
        clearObject(ccContext.globalStateKeys);
        clearObject(ccContext.reducer._reducer);
        clearObject(ccContext.store._state, [MODULE_DEFAULT]); //MODULE_DEFAULT cannot be cleared, cause in hot reload mode, createDispatcher() will trigger register again

        clearObject(ccContext.computed._computedFn);
        clearObject(ccContext.computed._computedValue);
        clearObject(ccContext.event_handlers_);
        clearObject(ccContext.ccUniqueKey_handlerKeys_);
        var cct = ccContext.ccClassKey_ccClassContext_;
        Object.keys(cct).forEach(function (ccClassKey) {
          var ctx = cct[ccClassKey];
          clearObject(ctx.ccKeys);
        });
        clearObject(ccContext.handlerKey_handler_);
        clearObject(ccContext.ccKey_ref_, [CC_DISPATCHER]);
        clearObject(ccContext.refs, [CC_DISPATCHER]);
        clearObject(ccContext.fragmentCcKeys);
        clearObject(ccContext.ccKey_option_);
        util.hotReloadWarning(err);
      } else throw err;
    }

    if (autoCreateDispatcher) {
      if (!ccContext.refs[CC_DISPATCHER]) {
        var Dispatcher = createDispatcher();
        var box = document.querySelector("#" + CC_DISPATCHER_BOX);

        if (!box) {
          box = document.createElement('div');
          box.id = CC_DISPATCHER_BOX;
          var boxSt = box.style;
          boxSt.position = 'fixed';
          boxSt.left = 0;
          boxSt.top = 0;
          boxSt.display = 'none';
          boxSt.zIndex = -888666;
          document.body.append(box);
        }

        ReactDOM.render(React.createElement(Dispatcher), box);
        util.justTip("[[startUp]]: cc create a CcDispatcher automatically");
      } else {
        util.justTip("[[startUp]]: CcDispatcher existed already");
      }
    } else {
      throw 'customizing Dispatcher is not allowed in current version cc';
    }

    if (window) {
      window.CC_CONTEXT = ccContext;
      window.ccc = ccContext;
    }

    ccContext.isCcAlreadyStartup = true;
  } catch (err) {
    if (errorHandler) errorHandler(err);else throw err;
  }
}