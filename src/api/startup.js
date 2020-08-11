import * as util from '../support/util';
import ccContext from '../cc-context';
import createDispatcher from '../core/base/create-dispatcher';
import * as boot from '../core/base/boot';
import clearContextIfHot from './clear-context-if-hot';
import didMount from '../core/base/did-mount';
import beforeUnmount from '../core/base/before-unmount';
import initCcFrag from '../core/ref/init-cc-frag';

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
  let ccFragKeys = [], canStartup = true;
  if (!cachedLocation) {
    cachedLocation = curLocation;
    info.firstStartupTime = now;
    info.latestStartupTime = now;
  } else if (cachedLocation !== curLocation) {
    const tip = `invalid run api call!(it can only be called once, changing 'call run' line location in HMR will cause this error also, 
    try refresh browser to reload your app to avoid this tip)`
    if (now - info.latestStartupTime < 1000) {
      throw new Error(tip);
    } else {
      if (util.isOnlineEditor()) {
        ccFragKeys = letRunOk();
        cachedLocation = curLocation;
      } else {
        util.strictWarning(tip);
        canStartup = false;
      }
    }
  } else {
    ccFragKeys = letRunOk();
  }
  return { canStartup, ccFragKeys };
}

export default function (
  {
    store = {},
    reducer = {},
    init = null,
    initPost = {},
    computed = {},
    watch = {},
  } = {},
  {
    plugins = [],
    middlewares = [],
    isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
    isDebug = false,
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
  } = {}) {
  try {
    throw new Error();
  } catch (err) {
    const { canStartup, ccFragKeys } = checkStartup(err);
    if (!canStartup) return;

    try {
      justTip(`cc version ${ccContext.info.version}`);
      if (isHot !== undefined) ccContext.isHot = isHot;
      ccContext.reComputed = reComputed;
      ccContext.runtimeHandler.errorHandler = errorHandler;
      const rv = ccContext.runtimeVar;
      rv.isStrict = isStrict;
      rv.isDebug = isDebug;
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
      boot.executeRootInit(init, initPost);
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

      // 可以理解为类似useConcent里处理double-invoking 以及 async rendering的过程
      // 直接实例化的CcFragment需要在boot过程完毕后再次走卸载并挂载的过程，以便数据和store同步，register信息正确
      // 防止在线IDE热加载后，ui和store不同步的问题
      ccFragKeys.forEach(key => {
        const ref = ccContext.ccUKey_ref_[key];
        beforeUnmount(ref);
        initCcFrag(ref);
        didMount(ref);
      });
    } catch (err) {
      if (errorHandler) errorHandler(err);
      else throw err;
    }
  }
}