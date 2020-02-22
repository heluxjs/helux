import * as util from '../support/util';
import { ERR, CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
import * as boot from '../core/base/boot';
import appendDispatcher from '../core/base/append-dispatcher';
import clearContextIfHot from './clear-context-if-hot';

const { justTip, bindToWindow, makeError } = util;

export default function (
  {
    store = {},
    reducer = {},
    init = null,
    computed = {},
    watch = {},
    moduleSingleClass = {},
    middlewares = [],
  } = {},
  {
    plugins = [],
    isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
    isDebug = false,
    errorHandler = null,
    isHot = false,
    autoCreateDispatcher = true,
    bindCtxToMethod = false,
    computedCompare = true,
    watchCompare = true,
    watchImmediate = false,
    alwaysGiveState = true,
    reducer: optionReducer,
  } = {}) {
  try {

    if (optionReducer) {
      if (!util.isPlainJsonObject(optionReducer)) throw new Error(`option.reducer not a plain json object`);
      util.okeys(optionReducer).forEach(reducerModule => {
        if (reducer[reducerModule]) throw new Error(`reducerModule[${reducerModule}] has been declared in store`);
        const reducerFns = optionReducer[reducerModule];
        util.okeys(reducerFns).forEach(k => {
          reducerFns[k].__reducerModule = reducerModule;// tag reducer fn
        });
        reducer[reducerModule] = reducerFns;
      });
    }

    console.log(`%c window.name:${window.name}`, 'color:green;border:1px solid green');
    justTip(`cc version ${ccContext.info.version}`);
    ccContext.isHot = isHot;
    ccContext.errorHandler = errorHandler;
    const rv = ccContext.runtimeVar;
    rv.alwaysGiveState = alwaysGiveState;
    rv.isStrict = isStrict;
    rv.isDebug = isDebug;
    rv.computedCompare = computedCompare;
    rv.watchCompare = watchCompare;
    rv.watchImmediate = watchImmediate;
    rv.bindCtxToMethod = bindCtxToMethod;

    const err = makeError(ERR.CC_ALREADY_STARTUP);
    clearContextIfHot(true, err);

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
        appendDispatcher(Dispatcher);
        justTip(`[[startUp]]: cc create a CcDispatcher automatically`);
      } else {
        justTip(`[[startUp]]: CcDispatcher already existed`);
      }
    } else {
      throw new Error('customizing Dispatcher is not allowed in current version Concent');
    }

    const bindOthers = (bindTarget) => {
      bindToWindow('CC_CONTEXT', ccContext, bindTarget);
      bindToWindow('ccc', ccContext, bindTarget);
      bindToWindow('cccc', ccContext.computed._computedValue, bindTarget);
      bindToWindow('sss', ccContext.store._state, bindTarget);
    }
    if (window.mcc) {
      setTimeout(() => {//延迟绑定，等待ccns的输入
        bindOthers(window.mcc[util.getCcNamespace()]);
      }, 1200);
    } else {
      bindOthers();
    }

    ccContext.isCcAlreadyStartup = true;
    //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册
    boot.configPlugins(plugins);
  } catch (err) {
    if (errorHandler) errorHandler(err);
    else throw err;
  }
}