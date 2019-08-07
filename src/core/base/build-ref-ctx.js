import {
  MODULE_GLOBAL, ERR, CCSYNC_KEY,
  SET_STATE, SET_MODULE_STATE, FORCE_UPDATE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import * as ccRef from '../ref';
import * as hf from '../state/handler-factory';
import * as ev from '../event';
import computeCcUniqueKey from './compute-cc-unique-key';
import __sync from './sync';
import changeRefState from '../state/change-ref-state';
import getDefineWatchHandler from '../watch/get-define-watch-handler';
import getDefineComputedHandler from '../computed/get-define-computed-handler';
import getOutProps from './get-out-props';

const {
  refStore,
  ccClassKey_ccClassContext_,
  store: { getState },
  moduleName_ccClassKeys_,
  computed: { _computedValue },
} = ccContext;

const { okeys, makeError: me, verboseInfo:vbi } = util;

let idSeq = 0;
function getEId() {
  idSeq++;
  return Symbol(`__autoGen_${idSeq}__`);
}

//调用buildFragmentRefCtx 之前，props参数已被处理过

/**
 * 构建refCtx，附加到ref.cc上
 * liteLevel 越小，绑定的方法越少
 */
export default function (ref, params, liteLevel = 1) {
  const reactSetState = ref.setState.bind(ref);
  const reactForceUpdate = ref.forceUpdate.bind(ref);

  let {
    isSingle, ccClassKey, ccKey, module, reducerModule, type,
    state = {}, storedKeys, watchedKeys, connect, tag, ccOption,
  } = params;
  reducerModule = reducerModule || module;
  const stateModule = module;

  //用户使用ccKey属性的话，必需显示的指定ccClassKey
  if (ccKey && !ccClassKey) {
    throw new Error(`missing ccClassKey while init a cc ins with ccKey[${ccKey}]`);
  }

  let _storedKeys = [];
  if (storedKeys !== undefined && storedKeys.length > 0) {
    if (!ccKey) throw me(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi(`ccClassKey[${ccClassKey}]`));
    _storedKeys = storedKeys;
  }

  const ccUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey, tag);

  const classCtx = ccClassKey_ccClassContext_[ccClassKey];
  const connectedComputed = classCtx.connectedComputed || {};
  const connectedState = classCtx.connectedState || {};
  const moduleState = getState(module);
  const moduleComputed = _computedValue[module] || {};
  const globalComputed = _computedValue[MODULE_GLOBAL] || {};
  const globalState = getState(MODULE_GLOBAL);
  const refConnectedComputed = {};
  okeys(connect).forEach(moduleName => {
    refConnectedComputed[moduleName] = {};
  });

  // recover ref state
  let refStoredState = refStore._state[ccUniqueKey] || {};
  const mergedState = Object.assign({}, state, refStoredState, moduleState);
  ref.state = mergedState;

  // record ref
  ccRef.setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey, {});

  // record ccClassKey
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);

  // create cc api
  const _setState = (module, state, calledBy, reactCallback, delay, identity) => {
    changeRefState(state, {
      calledBy, ccKey, ccUniqueKey, module, delay, identity, reactCallback
    }, ref);
  };
  // const setState = (state, reactCallback, delay, identity) => {
  const setState = (p1, p2, p3, identity) => {
    _setState(stateModule, state, SET_STATE, reactCallback, delay, identity);
  };
  const setGlobalState = (state, reactCallback, delay, identity) => {
    _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, delay, identity);
  };
  const setModuleState = (module, state, reactCallback, delay, identity) => {
    _setState(module, state, SET_MODULE_STATE, reactCallback, delay, identity);
  };
  const forceUpdate = (reactCallback, delay, identity) => {
    _setState(stateModule, ref.state, FORCE_UPDATE, reactCallback, delay, identity);
  };
  const changeState = (state, option) => {
    changeRefState(state, option, ref);
  }
  const _dispatch = (isLazy, paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity) => {
    const d = hf.makeDispatchHandler(ref, isLazy, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule, null, null, -1)
    return d(paramObj, payloadWhenFirstParamIsString, userInputDelay, userInputIdentity);
  };
  const dispatch = (...args) => _dispatch(false, ...args);
  const lazyDispatch = (...args) => _dispatch(true, ...args);
  const invoke = hf.makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey);
  const lazyInvoke =  hf.makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey, { isLazy: true });

  const syncBool = (e, delay = -1, idt = '') => {
    if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'bool', delay, idt }, ref);
    __sync({ type: 'bool' }, e, ref);
  };
  const sync = (e, val, delay = -1, idt = '') => {
    if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'val', val, delay, idt }, ref);
    __sync({ type: 'val' }, ref, e);//allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
  };
  const set = (ccsync, val, delay, idt) => {
    __sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, idt }, ref);
  };
  const  setBool = (ccsync, delay = -1, idt = '') => {
    __sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, idt }, ref);
  };
  const syncInt = (e, delay = -1, idt = '') => {
    if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'int', delay, idt }, ref);
    __sync({ type: 'int' }, ref, e);
  };
  const emit = (event, ...args) => {
    const _event = ev.getEventItem(event, stateModule, ccClassKey);
    ev.findEventHandlersToPerform(_event, ...args);
  };
  const off = (event, { module, ccClassKey, identity } = {}) => {
    ev.findEventHandlersToOff(event, { module, ccClassKey, identity });
  }
  const on = (event, handler, identity = null) => {
    ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
  }; 

  const aux = {}, watchFns = {}, computedFns = {}, immediateWatchKeys = [];
  const executer = { fn: null };
  const defineWatch = getDefineWatchHandler(watchFns, immediateWatchKeys);
  const defineComputed = getDefineComputedHandler(computedFns);
  const defineAuxMethod = (methodName, handler) => cc.aux[methodName] = handler;

  const effectItems = [];// {fn:function, status:0, eId:'', immediate:true}
  const eid_effectReturnCb_ = {};// fn
  const effectMeta = { effectItems, eid_effectReturnCb_ };
  const defineEffect = (fn, stateKeys, eId, immediate = true) => {
    if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');
    if (stateKeys !== null && stateKeys !== undefined) {
      if (!Array.isArray(stateKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
    }

    const _eId = eId || getEId();
    // const effectItem = { fn: _fn, stateKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };
    const effectItem = { fn, stateKeys, eId: _eId, immediate };
    effectItems.push(effectItem);
  };

  const cc = {
    // static params
    type,
    module,
    reducerModule,
    ccClassKey,
    ccKey,
    ccUniqueKey,
    renderCount: 1,
    initTime: Date.now(),
    storedKeys: _storedKeys,
    watchedKeys,
    connect,
    ccOption,

    props: getOutProps(ref.props),
    prevState: mergedState,
    // state
    state: mergedState,
    moduleState,
    globalState,
    connectedState,

    // computed
    refComputed: {},
    refConnectedComputed,
    moduleComputed,
    globalComputed,
    connectedComputed,

    //for HookRef
    mappedProps: {},
    
    // api meta data
    watchFns,
    computedFns,
    immediateWatchKeys,
    watchSpec: {},
    computedSpec: {},
    execute: executer.fn,
    reducer:{},
    lazyReducer:{},
    aux,// auxiliary method map
    effectMeta,

    // api
    reactSetState,
    reactForceUpdate,
    setState,
    setGlobalState,
    setModuleState,
    forceUpdate,
    changeState,
    dispatch,
    lazyDispatch,
    invoke,
    lazyInvoke,
    syncBool,
    sync,
    set,
    setBool,
    syncInt,
    emit,
    on,
    off,
    defineWatch,
    defineComputed,
    defineEffect,
    defineAuxMethod,

    // alias
    watch: defineWatch,
    computed: defineComputed,
    effect: defineEffect,

    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$ccSetState: hf.makeCcSetStateHandler(ref),

  };

  cc.defineExecute = handler => cc.execute = handler;

  ref.ctx = cc;
  ref.setState = setState;
  ref.forceUpdate = forceUpdate;
}