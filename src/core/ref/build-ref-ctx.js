/** @typedef {import('../../types-inner').IRefCtx} ICtx */
import {
  MODULE_GLOBAL, ERR, CCSYNC_KEY,
  SET_STATE, SET_MODULE_STATE, FORCE_UPDATE, CC_HOOK, AUTO_VAL,
} from '../../support/constant';
import ccContext from '../../cc-context';
import { mapIns } from '../../cc-context/wakey-ukey-map';
import * as util from '../../support/util';
import { INAJ, UNSTART, START, FN, OBJ } from '../../support/priv-constant';
import * as ev from '../event';
import * as hf from '../state/handler-factory';
import changeRefState from '../state/change-ref-state';
import makeObState from '../state/make-ob-state';
import getDefineWatchHandler from '../watch/get-define-watch-handler';
import getDefineComputedHandler from '../computed/get-define-computed-handler';
import makeCuRefObContainer from '../computed/make-cu-ref-ob-container';
import computeCcUniqueKey from '../base/compute-cc-unique-key';
import getOutProps from '../base/get-out-props';
import __sync from '../base/sync';
import { getStoredKeys } from '../param/extractor';

const {
  reducer: { _caller, _module2fnNames, _module2Ghosts },
  refStore, getModuleStateKeys,
  store: { getState, getModuleVer },
} = ccContext;
const { noop } = util;

const {
  okeys, makeError: me, verboseInfo: vbi, isObject, isBool,
  justWarning, isObjectNull, isValueNotNull, noDupPush,
} = util;

let idSeq = 0;
function getEId() {
  idSeq += 1;
  return Symbol(`__autoGen_${idSeq}__`);
}
let fnKey = 0;
function getFnKey() {
  fnKey += 1;
  return `${fnKey}`;
}

const eType = (th) => `type of defineEffect ${th} param must be`;

const getWatchedKeys = (ctx) => {
  if (ctx.watchedKeys === '-') {
    if (ctx.__$$renderStatus === START) return okeys(ctx.__$$compareWaKeys);
    return okeys(ctx.__$$curWaKeys);
  }
  return ctx.watchedKeys;
};

const getConnectWatchedKeys = (ctx, moduleName) => {
  const { connect, connectedModules } = ctx;
  const isConnectArr = Array.isArray(connect);

  const getModuleWaKeys = (m) => {
    if (ctx.__$$renderStatus === START) return okeys(ctx.__$$compareConnWaKeys[m]);
    return okeys(ctx.__$$curConnWaKeys[m]);
  };

  const getWKeys = (moduleName) => {
    if (isConnectArr) { // auto observe connect modules
      return getModuleWaKeys(moduleName);
    } else {
      const waKeys = connect[moduleName];
      if (waKeys === '*') return getModuleStateKeys(moduleName);
      else if (waKeys === '-') return getModuleWaKeys(moduleName);
      else return waKeys;
    }
  };

  if (moduleName) return getWKeys(moduleName);
  else {
    const cKeys = {};
    connectedModules.forEach((m) => {
      cKeys[m] = getWKeys(m);
    });
    return cKeys;
  }
};

function recordDep(ccUniqueKey, moduleName, watchedKeys) {
  const waKeys = watchedKeys === '*' ? getModuleStateKeys(moduleName) : watchedKeys;
  waKeys.forEach(stateKey => mapIns(moduleName, stateKey, ccUniqueKey));
}

function makeProxyReducer(m, dispatch, reducerFnType = 0, ghostFnName) {
  // 让绑定到组件上的mr.{xxx} 方法始终指向同一个，让 memo 优化可以生效
  const name2wrapFn = {};

  // 此处代理对象仅用于log时可以打印出目标模块reducer函数集合
  return new Proxy((_caller[m] || {}), {
    get: (target, fnName) => {
      const fnNames = _module2fnNames[m];
      if (fnNames.includes(fnName)) {
        const fnKey = `${m}/${fnName}`;
        let wrapFn = name2wrapFn[fnKey];
        if (!wrapFn) {
          wrapFn = (payload, renderKey, delay) => {
            const callerParams = { module: m, fnName, payload, renderKey, delay };
            if (reducerFnType === 0) return dispatch(fnKey, payload, renderKey, delay);
            if (reducerFnType === 1) return callerParams;
            if (reducerFnType === 2) {
              if (fnName === ghostFnName) return justWarning(`the target fn[${fnName}] can't be a ghost`);
              return dispatch(`${m}/${ghostFnName}`, callerParams, renderKey, delay);
            }
          };
          name2wrapFn[fnKey] = wrapFn;
        }

        return wrapFn;
      } else {
        // 可能是原型链上的其他方法或属性调用
        return target[fnName];
      }
    },
  });
}


function bindCtxToRef(isCtxNull, ref, ctx) {
  if (isCtxNull) return ref.ctx = ctx;
  // 适配热加载或者异步渲染里, 需要清理ctx里运行时收集的相关数据，重新分配即可
  // 这里需要把第一次渲染期间已经收集好的依赖再次透传给ref.ctx
  const {
    __$$curWaKeys,
    __$$compareWaKeys,
    __$$compareWaKeyCount,
    __$$nextCompareWaKeys,
    __$$nextCompareWaKeyCount,
    __$$curConnWaKeys,
    __$$compareConnWaKeys,
    __$$compareConnWaKeyCount,
    __$$nextCompareConnWaKeys,
    __$$nextCompareConnWaKeyCount,
  } = ref.ctx;
  Object.assign(ref.ctx, ctx, {
    __$$curWaKeys,
    __$$compareWaKeys,
    __$$compareWaKeyCount,
    __$$nextCompareWaKeys,
    __$$nextCompareWaKeyCount,
    __$$curConnWaKeys,
    __$$compareConnWaKeys,
    __$$compareConnWaKeyCount,
    __$$nextCompareConnWaKeys,
    __$$nextCompareConnWaKeyCount,
  });
}

function bindInitStateHandler(ref, ctx, registryState, refStoredState, mstate, modStateKeys) {
  // allow user have a chance to define state in setup block
  ctx.initState = (initialStateOrCb) => {
    let initialState = initialStateOrCb;
    if (util.isFn(initialStateOrCb)) {
      initialState = initialStateOrCb();
    }
    if (!ctx.__$$inBM) {
      return justWarning(`initState must been called in setup block!`);
    }
    if (!util.isPJO(registryState)) {
      return justWarning(`state ${INAJ}`);
    }
    if (ctx.__$$cuOrWaCalled) {
      return justWarning(`initState must been called before computed or watch`);
    }

    const newRefState = Object.assign({}, registryState, initialState, refStoredState, mstate);
    // 更新stateKeys，防止遗漏新的私有stateKey
    ctx.stateKeys = okeys(newRefState);
    ctx.privStateKeys = util.removeArrElements(okeys(newRefState), modStateKeys);

    ctx.prevState = Object.assign({}, newRefState);
    ctx.unProxyState = newRefState;
    ref.state = Object.assign(ctx.state, newRefState);
    // 扩展私有属性后，type.d.ts里会自动计算新的fullState，
    // 这里直接返回ctx, 但类型文件仅描述了可解构使用的有 state、setState、computed、watch 四个属性
    // 导出这四个属性可方便直接使用推导出的合并类型
    return ctx;
  };
}


function bindModApis(ref, ctx, stateModule, liteLevel, setState) {
  // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler
  const dispatch = hf.makeDispatchHandler(ref, false, false, stateModule);
  ctx.dispatch = dispatch;

  if (liteLevel > 1) { // level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, false, stateModule);
    ctx.silentDispatch = hf.makeDispatchHandler(ref, false, true, stateModule);
    ctx.dispatchLazy = ctx.lazyDispatch; // alias of lazyDispatch
    ctx.dispatchSilent = ctx.silentDispatch; // alias of silentDispatch

    ctx.invoke = hf.makeInvokeHandler(ref);
    ctx.lazyInvoke = hf.makeInvokeHandler(ref, { isLazy: true });
    ctx.silentInvoke = hf.makeInvokeHandler(ref, { isLazy: false, isSilent: true });
    ctx.invokeLazy = ctx.lazyInvoke; // alias of lazyInvoke
    ctx.invokeSilent = ctx.silentInvoke; // alias of silentInvoke

    ctx.setGlobalState = (state, reactCallback, renderKey, delay) => {
      setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, renderKey, delay);
    };
  }
  return dispatch;
}


function bindSyncApis(ref, ctx, liteLevel) {
  if (liteLevel > 2) { // level 3, assign sync api
    const cachedBoundFns = {};

    const doSync = (type, e, val, rkey, delay) => {
      if (typeof e === 'string') {
        const valType = typeof val;
        // now val is syncCb
        if (isValueNotNull(val) && (valType === OBJ || valType === FN || val === AUTO_VAL)) {
          return __sync.bind(null, { [CCSYNC_KEY]: e, type, val, delay, rkey }, ref);
        }

        const valStr = (val && val.toString) ? val.toString() : '';
        const key = `${e}|${valStr}|${rkey}|${delay}`;
        let boundFn = cachedBoundFns[key];
        if (!boundFn) {
          cachedBoundFns[key] = __sync.bind(null, { [CCSYNC_KEY]: e, type, val, delay, rkey }, ref);
          boundFn = cachedBoundFns[key];
        }
        return boundFn;
      }

      // case: <input data-ccsync="foo/f1" onChange={ctx.sync} />
      __sync({ type: 'val' }, ref, e);
    };

    // syncer series
    const makeTrap = (type) => ({
      get(target, key) {
        if (util.isKeyValid(target, key)) return doSync(type, key);
        return noop;
      },
    });
    ctx.syncer = new Proxy(ctx.state, makeTrap('val'));
    ctx.syncerOfBool = new Proxy(ctx.state, makeTrap('bool'));
    ctx.sybo = ctx.syncerOfBool; // alias of syncerOfBool

    // sync series
    ctx.sync = (e, val, rkey = '', delay = -1) => doSync('val', e, val, rkey, delay);
    ctx.syncBool = (e, val, rkey = '', delay = -1) => doSync('bool', e, val, rkey, delay);
    ctx.syncInt = (e, val, rkey = '', delay = -1) => doSync('int', e, val, rkey, delay);
    ctx.syncAs = (e, val, rkey = '', delay = -1) => doSync('as', e, val, rkey, delay);

    ctx.set = (ccsync, val, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, rkey }, ref);
    };
    ctx.setBool = (ccsync, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, rkey }, ref);
    };
  }
}


function bindEventApis(ctx, liteLevel, ccUniqueKey) {
  if (liteLevel > 3) { // level 4, assign event api
    ctx.emit = (event, ...args) => {
      ev.findEventHandlersToPerform(ev.getEventItem(event), ...args);
    };
    // 默认off掉当前实例对某个事件名的所有监听
    ctx.off = (event, { module, ccClassKey, ccUniqueKey: inputCcUkey = ccUniqueKey } = {}) => {
      let targetCcUkey = inputCcUkey;
      // 传递了 module 或者 ccClassKey的话，清理掉targetCcUkey，表示off的目标要扩大
      if (module || ccClassKey) targetCcUkey = '';
      // 这里刻意不为identity赋默认值，如果是undefined，表示off掉所有监听
      const { name, identity } = ev.getEventItem(event);
      ev.findEventHandlersToOff(name, { module, ccClassKey, ccUniqueKey: targetCcUkey, identity });
    };
    ctx.on = (inputEvent, handler) => {
      ctx.__$$onEvents.push({ inputEvent, handler });
    };
  }
}

function _makeCuWaDesc(moduleName, fnKeyOrDesc, cb, cbOptions) {
  const newDesc = {};
  const makeFnDesc = (fn, cbOptions) => {
    const fnDesc = util.isObject(fn) ? fn : { fn };
    // 因为加上 / 后，cb的state类型会和模块相关了，types文件目前不方便推导含 / 的cb参数类型
    // 所以types文件里不允许传递 allowSlash 标记，让用户定义的retKey包含 / 会报运行时错误
    // 同时额外提供的 watchModule方法和 computedModule 方法需要用到 / 携带模块的特性
    // 故需内部放过不允许key包含slash的校验，所以这里加上 allowSlash 标记
    let opts = {};
    if (cbOptions) opts = util.isObject(cbOptions) ? cbOptions : { depKeys: cbOptions };

    let depKeys = opts.depKeys || fnDesc.depKeys;
    if (Array.isArray(depKeys)) {
      // 让 watchModule 的 depKeys 不拼模块前缀也能生效
      depKeys = depKeys.map(key => (key.includes('/') ? key : `${moduleName}/${key}`));
    } else {
      depKeys = [];
    }

    return Object.assign({ allowSlash: true, depKeyModule: moduleName }, fnDesc, opts, { depKeys });
  };

  if (typeof fnKeyOrDesc === 'string') {
    newDesc[`${moduleName}/${fnKeyOrDesc}`] = makeFnDesc(cb, cbOptions);
  } else if (util.isObject(fnKeyOrDesc)) {
    util.okeys(fnKeyOrDesc).forEach(key => {
      newDesc[`${moduleName}/${key}`] = makeFnDesc(fnKeyOrDesc[key]);
    });
  }
  return newDesc;
}

function bindEnhanceApis(ctx, liteLevel, stateModule) {
  const effectItems = [], effectPropsItems = []; // {fn:function, status:0, eId:'', immediate:true}
  const eid2effectReturnCb = {}, eid2effectPropsReturnCb = {}; // fn
  ctx.effectMeta = { effectItems, eid2effectReturnCb, effectPropsItems, eid2effectPropsReturnCb };

  if (liteLevel > 4) { // level 5, assign enhance api
    ctx.execute = handler => ctx.execute = handler;
    ctx.watch = getDefineWatchHandler(ctx);
    ctx.computed = getDefineComputedHandler(ctx);
    // 方便type文件定义类型时能够推导出cb的参数类型为已连接的模块状态类型
    ctx.watchModule = (moduleName, cbOrMultiWatchDesc, cbOptions = {}) => {
      if (util.isFn(cbOrMultiWatchDesc)) {
        ctx.watch(_makeCuWaDesc(moduleName, getFnKey(), cbOrMultiWatchDesc, cbOptions));
      } else {
        ctx.watch(_makeCuWaDesc(moduleName, cbOrMultiWatchDesc));
      }
    };
    // 方便type文件定义类型时能够推导出cb的参数类型为已连接的模块状态类型
    ctx.computedModule = (moduleName, retKey, cb, cbOptions) => {
      return ctx.computed(_makeCuWaDesc(moduleName, retKey, cb, cbOptions));
    };

    const makeEffectHandler = (targetEffectItems, isProp) => (fn, depKeysOrOpt, compare, immediate = true) => {
      if (!util.isFn(fn)) throw new Error(`${eType('first')} function`);
      const compareForEf = compare === undefined ? false : compare;
      // 对于effectProps 第三位参数就是immediate, 不传的话，默认是true
      const immediateForEfProp = compare === undefined ? true : compare;

      // depKeys 为 null 和 undefined, 表示无任何依赖，每一轮都执行的副作用
      let _depKeys = depKeysOrOpt;
      let _compare = compareForEf;
      let _immediate = isProp ? immediateForEfProp : immediate;

      if (isObject(depKeysOrOpt)) {
        _depKeys = depKeysOrOpt.depKeys;
        _compare = isBool(depKeysOrOpt.compare) ? depKeysOrOpt.compare : compare;
        _immediate = isBool(depKeysOrOpt.immediate) ? depKeysOrOpt.immediate : immediate;
      }

      if (_depKeys !== undefined && _depKeys !== null && !Array.isArray(_depKeys)) {
        throw new Error(`${eType('second')} array, null, or undefined`);
      }

      const modDepKeys = [];
      if (!isProp && _depKeys) {
        _depKeys.forEach(depKey => {
          let modDepKey;
          if (depKey.includes('/')) {
            modDepKey = depKey;
            const [m] = depKey.split('/');
            if (!ctx.connect[m]) {
              throw me(ERR.CC_MODULE_NOT_CONNECTED, vbi(`depKey[${depKey}]`));
            }
          } else {
            // 这里要注意， 私有的key
            modDepKey = `${stateModule}/${depKey}`;
          }

          modDepKeys.push(modDepKey);
          // 先暂时保持起来，组件挂载时才映射依赖
          ctx.__$$staticWaKeys[modDepKey] = 1;
        });
      }
      // 对于effectProps来说是不会读取compare属性来用的
      const effectItem = {
        fn, isProp, depKeys: _depKeys, modDepKeys, eId: getEId(), compare: _compare, immediate: _immediate,
      };
      targetEffectItems.push(effectItem);
    };

    ctx.effect = makeEffectHandler(effectItems, false);
    ctx.effectProps = makeEffectHandler(effectPropsItems, true);
  }
}


function fillCtxOtherAttrs(ref, ctx, connect, watchedKeys, ccUniqueKey, stateModule, allModules, dispatch) {
  // 构造完毕ctx后，开始创建 reducer，和可观察 connectedState
  const {
    connectedReducer, connectedState,
    __$$curConnWaKeys, __$$compareConnWaKeys, __$$compareConnWaKeyCount,
    __$$nextCompareConnWaKeys, __$$nextCompareConnWaKeyCount,
  } = ctx;

  // 实例所属模块或连接模块是否处于自动观察状态
  let __$$autoWatch = false;
  // 向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  // 只绑定所属的模块和已连接的模块的reducer方法
  allModules.forEach(m => {
    const rd = makeProxyReducer(m, dispatch);
    if (m === stateModule) {
      ctx.moduleReducer = rd;
      ctx.mrc = makeProxyReducer(m, dispatch, 1);
      const ghosts = _module2Ghosts[m] || [];
      ghosts.forEach(ghostFnName => {
        ctx.mrg[ghostFnName] = makeProxyReducer(m, dispatch, 2, ghostFnName);
      });
      if (m === MODULE_GLOBAL) connectedReducer[m] = rd;
    } else {
      connectedReducer[m] = rd;
    }

    const connectDesc = connect[m];
    if (connectDesc) {
      let moduleState = getState(m);

      if (connectDesc === '-') {// auto watch
        __$$autoWatch = true;
        __$$curConnWaKeys[m] = {};
        __$$compareConnWaKeys[m] = {};
        __$$compareConnWaKeyCount[m] = 0;
        __$$nextCompareConnWaKeys[m] = {};
        __$$nextCompareConnWaKeyCount[m] = 0;

        if (m === MODULE_GLOBAL) moduleState = ctx.globalState;
        else moduleState = makeObState(ref, moduleState, m);
      } else {
        // 非自动收集，这里就需要写入waKey2uKeyMap来记录依赖关系了
        recordDep(ccUniqueKey, m, connectDesc);
      }

      connectedState[m] = moduleState;
    }
  });
  ctx.reducer = _caller;
  ctx.globalReducer = connectedReducer[MODULE_GLOBAL];

  // alias
  ctx.mr = ctx.moduleReducer;
  ctx.gr = ctx.globalReducer;
  ctx.cr = ctx.connectedReducer;
  ctx.r = ctx.reducer;

  if (watchedKeys === '-') {
    __$$autoWatch = true;
  } else {
    // 开始记录依赖
    recordDep(ccUniqueKey, stateModule, watchedKeys);
  }
  ctx.__$$autoWatch = __$$autoWatch;
}

/**
 * 构建refCtx，附加到ref上
 * liteLevel 越小，绑定的方法越少
 */
export default function (ref, params, liteLevel = 5) {
  // 能省赋默认值的就省，比如state，外层调用都保证赋值过了
  const {
    ccKey = '', state, id, ccOption = {}, module, ccClassKey, type, insType, tag = '',
    storedKeys = [], persistStoredKeys = false, watchedKeys = '-', connect = {}, staticExtra = {},
  } = params;

  const stateModule = module;
  const existedCtx = ref.ctx;
  const isCtxNull = isObjectNull(existedCtx); // 做个保护判断，防止 ctx = {}
  const modStateKeys = getModuleStateKeys(stateModule);

  let __boundSetState = ref.setState, __boundForceUpdate = ref.forceUpdate;

  // 如果已存在ctx，则直接指向原来的__bound，否则会造成无限递归调用栈溢出
  // 做个保护判断，防止 ctx = {}
  // const act = runtimeHandler.act;// for react-test-utils
  if (!isCtxNull && existedCtx.ccUniqueKey) {
    __boundSetState = existedCtx.__boundSetState;
    __boundForceUpdate = existedCtx.__boundForceUpdate;
  } else if (type !== CC_HOOK) {
    __boundSetState = ref.setState.bind(ref);
    __boundForceUpdate = ref.forceUpdate.bind(ref);
  }

  const refOption = {};
  refOption.persistStoredKeys = ccOption.persistStoredKeys === undefined
    ? persistStoredKeys : ccOption.persistStoredKeys;
  refOption.tag = ccOption.tag || tag;

  // pick ccOption tag first, register tag second
  const ccUniqueKey = computeCcUniqueKey(ccClassKey, ccKey, refOption.tag);
  // 没有设定renderKey的话读id，最后才默认renderKey为ccUniqueKey
  const tmpRenderKey = ccOption.renderKey || id;
  refOption.renderKey = tmpRenderKey !== undefined ? tmpRenderKey : ccUniqueKey;
  refOption.storedKeys = getStoredKeys(stateModule, state, ccOption.storedKeys, storedKeys);

  // 用户使用ccKey属性的话，必需显示的指定ccClassKey
  if (ccKey && !ccClassKey) {
    throw new Error(`missing ccClassKey while init a cc ins with ccKey[${ccKey}]`);
  }

  if (refOption.storedKeys.length > 0) {
    if (!ccKey) throw me(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi(`ccClassKey[${ccClassKey}]`));
  }
  const mstate = getState(module);

  // recover ref state
  const refStoredState = refStore._state[ccUniqueKey] || {};
  const mergedState = Object.assign({}, state, refStoredState, mstate);
  ref.state = mergedState;
  const stateKeys = okeys(mergedState);

  const connectedModules = okeys(connect);

  const connectedComputed = {};
  connectedModules.forEach((m) => {
    connectedComputed[m] = makeCuRefObContainer(ref, m, false);
  });
  const moduleComputed = makeCuRefObContainer(ref, module);
  // 所有实例都自动连接上了global模块，这里可直接取connectedComputed已做好的结果
  const globalComputed = connectedComputed[MODULE_GLOBAL];
  const globalState = makeObState(ref, getState(MODULE_GLOBAL), MODULE_GLOBAL, false);
  // extract privStateKeys
  const privStateKeys = util.removeArrElements(okeys(state), modStateKeys);
  const moduleState = module === MODULE_GLOBAL ? globalState : makeObState(ref, mstate, module, true);

  // declare cc state series api
  const changeState = (state, options) => {
    changeRefState(state, options, ref);
  };
  const _setState = (module, state, calledBy, reactCallback, renderKey, delay) => {
    const options = { calledBy, module, reactCallback };
    if (util.isObject(renderKey)) Object.assign(options, renderKey); // 丢弃delay，renderKeyAsOpt里的delay
    else Object.assign(options, { renderKey, delay });
    changeState(state, options);
  };
  const setModuleState = (module, state, reactCallback, renderKey, delay) => {
    _setState(module, state, SET_MODULE_STATE, reactCallback, renderKey, delay);
  };
  const setState = (p1, p2, p3, p4, p5) => {
    const p1Type = typeof p1;
    if (p1Type === 'string') {
      // p1: module, p2: state, p3: cb, p4: rkey, p5: delay
      setModuleState(p1, p2, p3, p4, p5);
    } else if (p1Type === 'function') {
      // p1: stateFn, p2: rkey, p3: delay
      const newState = p1(Object.assign({}, ctx.unProxyState), ctx.props);
      _setState(stateModule, newState, SET_STATE, p2, p3, p4);
    } else {
      // p1: state, p2: cb, p3: rkey, p4: delay
      _setState(stateModule, p1, SET_STATE, p2, p3, p4);
    }
  };
  const forceUpdate = (reactCallback, renderKey, delay) => {
    _setState(stateModule, ref.unProxyState, FORCE_UPDATE, reactCallback, renderKey, delay);
  };

  const refs = {};

  const allModules = connectedModules.slice();
  // 已在change-ref-state里做优化，支持组件即属于又连接同一个模块，不会照成冗余渲染，
  // 所以此处allModules包含了module对渲染性能无影响，不过代码的语义上会照成重复的表达
  noDupPush(allModules, module);

  const props = getOutProps(ref.props);
  const now = Date.now();
  const ctx = {
    // static params
    type,
    insType,
    module,
    ccClassKey,
    ccKey,
    ccUniqueKey,
    renderCount: 0,
    initTime: now,
    watchedKeys,
    privStateKeys,
    connect,
    connectedModules,
    allModules,

    // dynamic meta, I don't want user know these props, so let field name start with __$$
    __$$onEvents: [],// 当组件还未挂载时，将事件存到__$$onEvents里，当组件挂载时才开始真正监听事件

    __$$hasModuleState: modStateKeys.length > 0,
    __$$renderStatus: UNSTART,

    __$$curWaKeys: {},
    __$$compareWaKeys: {},
    __$$compareWaKeyCount: 0,// write before render
    __$$nextCompareWaKeys: {},
    __$$nextCompareWaKeyCount: 0,

    __$$curConnWaKeys: {},
    __$$compareConnWaKeys: {},
    __$$compareConnWaKeyCount: {},
    __$$nextCompareConnWaKeys: {},
    __$$nextCompareConnWaKeyCount: {},

    __$$staticWaKeys: {},// 用于快速的去重记录
    __$$staticWaKeyList: [],// 在实例didMount时由__$$staticWaKeys计算得出，用于辅助清理依赖映射

    persistStoredKeys: refOption.persistStoredKeys,
    storedKeys: refOption.storedKeys,
    renderKey: refOption.renderKey,
    tag: refOption.tag,

    prevProps: props,
    props,
    // collected mapProps result
    mapped: {},

    prevState: Object.assign({}, mergedState),
    // state
    state: makeObState(ref, mergedState, stateModule, true),
    unProxyState: mergedState,// 没有proxy化的state
    moduleState,
    // 用于before-render里避免merge moduleState而导致的冗余触发get，此属性不暴露给用户使用，因其不具备依赖收集能力
    __$$mstate: mstate,
    globalState,
    connectedState: {},
    // for function: pass value to extra in every render period
    // for class: pass value to extra one time
    extra: isObject(params.extra) ? params.extra : {},
    // pass value to staticExtra only one time for both function and class
    staticExtra,
    settings: {},

    /** @type ICtx['refComputedValues'] */
    refComputedValues: {},
    /** @type ICtx['refComputedRawValues'] */
    refComputedRawValues: {},
    moduleComputed,
    globalComputed,
    connectedComputed,

    moduleReducer: null,
    mrc: null, // 仅生成描述体，moduleReducerCaller
    /** ghost reducer map */
    mrg: {},
    globalReducer: null,
    connectedReducer: {},
    reducer: {},

    // api meta data
    stateKeys,
    /** @type ICtx['computedDep'] */
    computedDep: {},
    computedRetKeyFns: {},
    /** @type ICtx['watchDep'] */
    watchDep: {},
    watchRetKeyFns: {},// 不按模块分类，映射的 watchRetKey2fns
    execute: null,
    retKey2fnUid: {},

    // api
    reactSetState: noop, // 等待重写
    __boundSetState,
    reactForceUpdate: noop,// 等待重写
    __boundForceUpdate,
    setState,
    setModuleState,
    forceUpdate,
    changeState, // not expose in d.ts
    refs,
    getRef: refName => refs[refName] || null,
    useRef: refName => {
      return nodeRef => {
        // keep the same shape with hook useRef
        refs[refName] = { current: nodeRef };
      };
    },

    // below methods only can be called by cc or updated by cc in existed period, not expose in d.ts
    __$$ccSetState: hf.makeCcSetStateHandler(ref),
    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$settedList: [], // [{module:string, keys:string[]}, ...]
    __$$prevMoStateVer: {},
    __$$prevModuleVer: getModuleVer(stateModule),
    __$$cuOrWaCalled: false,
  };
  bindCtxToRef(isCtxNull, ref, ctx);
  ctx.refComputed = makeCuRefObContainer(ref, null, true, true);

  ref.setState = setState;
  ref.forceUpdate = forceUpdate;

  bindInitStateHandler(ref, ctx, state, refStoredState, mstate, modStateKeys);
  const dispatch = bindModApis(ref, ctx, stateModule, liteLevel, _setState);
  bindSyncApis(ref, ctx, liteLevel);
  bindEventApis(ctx, liteLevel, ccUniqueKey);
  bindEnhanceApis(ctx, liteLevel, stateModule);
  fillCtxOtherAttrs(ref, ctx, connect, watchedKeys, ccUniqueKey, stateModule, allModules, dispatch);

  // 始终优先取ref上指向的ctx，对于在热加载模式下的hook组件实例，那里面有的最近一次渲染收集的依赖信息才是正确的
  ctx.getWatchedKeys = () => getWatchedKeys(ref.ctx || ctx);
  ctx.getConnectWatchedKeys = (moduleName) => getConnectWatchedKeys(ref.ctx || ctx, moduleName);
}
