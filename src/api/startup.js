import * as util from '../support/util';
import { CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import createDispatcher from './create-dispatcher';
import * as boot from '../core/base/boot';
import beforeUnmount from '../core/base/before-unmount';
import appendDispatcher from '../core/base/append-dispatcher';
import clearContextIfHot from './clear-context-if-hot';

const { justTip, bindToWindow, okeys } = util;
let cachedLocation = '';
let clearShadowRefTimer = 0;
let shawRefExpireTime = 10000; // ms

/** 以防用户长时间打开debugger调试照成clearShadowRef误判，给用户已给重写shawRefExpireTime的机会 */
function setShawRefExpireTime(t) {
  shawRefExpireTime = t;
}

function tryClearShadowRef(clearShadowRef) {
  if (clearShadowRef && !clearShadowRefTimer) {
    // if (process && process.env && process.env.NODE_ENV === 'production') {
    //   // no need to run this timer in production mode
    // } else { }

    clearShadowRefTimer = setInterval(() => {
      const now = Date.now();
      const refs = ccContext.refs;
      okeys(refs).forEach(key => {
        const ref = refs[key];
        // 初始化后，大于10秒没有挂载的组件，当作是strict-mode下的双调用导致产生的一个多余的ref
        // https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
        // 利用double-invoking并不会触发didMount的特性，来做此检测
        if (!ref.__$$isMounted && now - ref.ctx.initTime > shawRefExpireTime) {
          beforeUnmount(ref);
          justTip(`shadow ref${ref.ctx.ccUniqueKey} was cleared`)
        }
      });
    }, 5000);
  }
}

function checkStartup(err) {
  const errStack = err.stack;
  const info = ccContext.info;
  const arr = errStack.split('\n');
  const len = arr.length;
  let curLocation = '';

  const tryGetLocation = (keyword, offset) => {
    for (let i = 0; i < len; i++) {
      if (arr[i].includes(keyword)) {
        curLocation = arr[i + offset];
        break;
      }
    }
  }

  tryGetLocation('startup', 2);//向下2句找触发run的文件
  if (!curLocation) tryGetLocation('runConcent', 0);

  const letRunOk = () => {
    ccContext.isHot = true;
    clearContextIfHot(true);
  }

  const now = Date.now();
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
        letRunOk();
        cachedLocation = curLocation;
      } else {
        util.strictWarning(tip);
        return false;
      }
    }
  } else {
    letRunOk();
  }
  return true;
}

export default function (
  {
    store = {},
    reducer = {},
    init = null,
    computed = {},
    watch = {},
    moduleSingleClass = {},
  } = {},
  {
    plugins = [],
    middlewares = [],
    isStrict = false,//consider every error will be throwed by cc? it is dangerous for a running react app
    isDebug = false,
    errorHandler = null,
    isHot,
    // autoCreateDispatcher = true,
    bindCtxToMethod = false,
    computedCompare = true,
    watchCompare = true,
    watchImmediate = false,
    alwaysGiveState = true,
    reComputed = true,
    clearShadowRef = true, // 默认开启，如果是非异步渲染模式或者非React.Strict模式，可以关闭此清理标记
    shawRefExpireTime = 10000,
  } = {}) {
  let canStartup = true;
  try {
    throw new Error();
  } catch (err) {
    canStartup = checkStartup(err);
  }
  if (!canStartup) return;

  try {
    console.log(`%c window.name:${window.name}`, 'color:green;border:1px solid green');
    justTip(`cc version ${ccContext.info.version}`);
    if (isHot !== undefined) ccContext.isHot = isHot;
    ccContext.reComputed = reComputed;
    ccContext.errorHandler = errorHandler;
    const rv = ccContext.runtimeVar;
    rv.alwaysGiveState = alwaysGiveState;
    rv.isStrict = isStrict;
    rv.isDebug = isDebug;
    rv.computedCompare = computedCompare;
    rv.watchCompare = watchCompare;
    rv.watchImmediate = watchImmediate;
    rv.bindCtxToMethod = bindCtxToMethod;

    boot.configModuleSingleClass(moduleSingleClass);
    boot.configStoreState(store);
    boot.configRootReducer(reducer);
    boot.configRootComputed(computed);
    boot.configRootWatch(watch);
    boot.executeRootInit(init);
    boot.configMiddlewares(middlewares);

    if (!ccContext.refs[CC_DISPATCHER]) {
      const Dispatcher = createDispatcher();
      appendDispatcher(Dispatcher);
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

    ccContext.isStartup = true;
    //置为已启动后，才开始配置plugins，因为plugins需要注册自己的模块，而注册模块又必需是启动后才能注册
    boot.configPlugins(plugins);

    setShawRefExpireTime(shawRefExpireTime);
    tryClearShadowRef(clearShadowRef);
  } catch (err) {
    if (errorHandler) errorHandler(err);
    else throw err;
  }
}