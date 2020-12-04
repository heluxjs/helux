import * as util from '../support/util';
import ccContext from '../cc-context';
import createDispatcher from '../core/base/create-dispatcher';
import * as boot from '../core/base/boot';
import clearContextIfHot from './clear-context-if-hot';

const { justTip, bindToWindow, getErrStackKeywordLoc } = util;
let cachedLocation = '';

function checkStartup(err) {
  const info = ccContext.info;

  let curLocation = getErrStackKeywordLoc(err, 'startup', 2);//向下2句找触发run的文件
  if (!curLocation) curLocation = getErrStackKeywordLoc(err, 'runConcent', 0);

  const letRunOk = () => {
    ccContext.isHot = true;
    return clearContextIfHot(true);
  }

  const now = Date.now();
  let resetClassInsUI = () => { }, canStartup = true;
  if (!cachedLocation) {
    cachedLocation = curLocation;
    info.firstStartupTime = now;
    info.latestStartupTime = now;
  } else if (cachedLocation !== curLocation) {
    const tip = `run can only been called one time, try refresh browser to avoid this error`
    if (now - info.latestStartupTime < 1000) {
      throw new Error(tip);
    }

    if (util.isOnlineEditor()) {
      resetClassInsUI = letRunOk();
      cachedLocation = curLocation;
    } else {
      util.strictWarning(tip);
      canStartup = false;
    }
  } else {
    resetClassInsUI = letRunOk();
  }

  return { canStartup, resetClassInsUI };
}

export default function (
  {
    store = {},
    reducer = {},
    computed = {},
    watch = {},
    lifecycle = {},
  } = {},
  {
    plugins = [],
    middlewares = [],
    // consider every error will be throwed by cc? be careful when app in prod mode
    isStrict = false,
    isDebug = false,
    logError = true,
    errorHandler = null,
    isHot,
    bindCtxToMethod = false,
    computedCompare = false,// 表示针对object值需不需要比较
    watchCompare = false,// 表示针对object值需不需要比较
    watchImmediate = false,
    reComputed = true,
    extractModuleChangedState  = true,
    extractRefChangedState  = false,
    objectValueCompare  = false,
    nonObjectValueCompare  = true,
    localStorage = null,
    act = null,
  } = {}) {
  try {
    throw new Error();
  } catch (err) {
    const { canStartup, resetClassInsUI } = checkStartup(err);
    if (!canStartup) {
      return;
    }

    try {
      justTip(`concent version ${ccContext.info.version}`);
      if (isHot !== undefined) ccContext.isHot = isHot;
      ccContext.reComputed = reComputed;
      if (errorHandler) ccContext.runtimeHandler.errorHandler = errorHandler;
      ccContext.runtimeHandler.act = act;
      const rv = ccContext.runtimeVar;
      rv.isStrict = isStrict;
      rv.isDebug = isDebug;
      rv.logError = logError;
      rv.computedCompare = computedCompare;
      rv.watchCompare = watchCompare;
      rv.watchImmediate = watchImmediate;
      rv.extractModuleChangedState = extractModuleChangedState;
      rv.extractRefChangedState = extractRefChangedState;
      rv.objectValueCompare = objectValueCompare;
      rv.nonObjectValueCompare = nonObjectValueCompare;
      rv.bindCtxToMethod = bindCtxToMethod;

      if (localStorage) {
        ccContext.localStorage = localStorage;
      } else if (window && window.localStorage) {
        ccContext.localStorage = window.localStorage;
      }
      ccContext.recoverRefState();
      createDispatcher();
      
      boot.configStoreState(store);
      boot.configRootReducer(reducer);
      boot.configRootComputed(computed);
      boot.configRootWatch(watch);
      boot.configRootLifecycle(lifecycle);
      boot.configMiddlewares(middlewares);

      const bindOthers = (bindTarget) => {
        bindToWindow('CC_CONTEXT', ccContext, bindTarget);
        bindToWindow('ccc', ccContext, bindTarget);
        bindToWindow('cccc', ccContext.computed._computedValue, bindTarget);
        bindToWindow('sss', ccContext.store._state, bindTarget);
      }
      if (window && window.mcc) {
        setTimeout(() => {//延迟绑定，等待ccns的输入
          bindOthers(window.mcc[util.getCcNamespace()]);
        }, 1200);
      } else {
        bindOthers();
      }

      ccContext.isStartup = true;
      //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册
      boot.configPlugins(plugins);

      resetClassInsUI();
    } catch (err) {
      if (errorHandler) errorHandler(err);
      else throw err;
    }
  }
}
