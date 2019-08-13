import {
  MODULE_GLOBAL, ERR, CCSYNC_KEY,
  SET_STATE, SET_MODULE_STATE, FORCE_UPDATE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import setRef from './set-ref';
import * as ev from '../event';
import * as hf from '../state/handler-factory';
import changeRefState from '../state/change-ref-state';
import getDefineWatchHandler from '../watch/get-define-watch-handler';
import getDefineComputedHandler from '../computed/get-define-computed-handler';
import computeCcUniqueKey from '../base/compute-cc-unique-key';
import getOutProps from '../base/get-out-props';
import __sync from '../base/sync';

const {
  refStore,
  ccClassKey_ccClassContext_,
  store: { getState },
  moduleName_ccClassKeys_,
  computed: { _computedValue },
} = ccContext;

const { okeys, makeError: me, verboseInfo: vbi } = util;

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
export default function (ref, params, liteLevel = 5) {
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
  if (!ccOption.renderKey) ccOption.renderKey = ccUniqueKey;

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
  setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey, {});

  // record ccClassKey
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);

  // create cc api
  const _setState = (module, state, calledBy, reactCallback, delay, renderKey) => {
    changeRefState(state, {
      calledBy, ccKey, ccUniqueKey, module, delay, renderKey, reactCallback
    }, ref);
  };
  const setModuleState = (module, state, reactCallback, delay, renderKey) => {
    _setState(module, state, SET_MODULE_STATE, reactCallback, delay, renderKey);
  };
  // const setState = (state, reactCallback, delay, renderKey) => {
  const setState = (p1, p2, p3, p4, p5) => {
    if (typeof p1 === 'string') {
      //p1 module, p2 state, p3 cb, p4 delay, p5 idt
      setModuleState(p1, p2, p3, p4, p5);
    } else {
      //p1 state, p2 cb, p3 delay, p4 idt
      _setState(stateModule, p1, SET_STATE, p2, p3, p4);
    }
  };
  const forceUpdate = (reactCallback, delay, renderKey) => {
    _setState(stateModule, ref.state, FORCE_UPDATE, reactCallback, delay, renderKey);
  };
  const changeState = (state, option) => {
    changeRefState(state, option, ref);
  }
  const dispatch = hf.makeDispatchHandler(ref, false, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule);

  const onEvents = [];

  const effectItems = [];// {fn:function, status:0, eId:'', immediate:true}
  const eid_effectReturnCb_ = {};// fn
  const effectMeta = { effectItems, eid_effectReturnCb_ };

  const aux = {}, watchFns = {}, computedFns = {};
  const immediateWatchKeys = [];
  const ctx = {
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

    //collect CcHook mapProps result
    mapped: {},

    // api meta data
    onEvents,
    watchFns,
    computedFns,
    immediateWatchKeys,
    watchSpec: {},
    computedSpec: {},
    execute: null,
    reducer: {},
    lazyReducer: {},
    aux,// auxiliary method map
    effectMeta,

    // api
    reactSetState,
    reactForceUpdate,
    setState,
    setModuleState,
    forceUpdate,
    changeState,
    dispatch,

    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$ccSetState: hf.makeCcSetStateHandler(ref),

  };

  if (liteLevel > 1) {// level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, ccKey, ccUniqueKey, ccClassKey, stateModule, stateModule);
    ctx.invoke = hf.makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey);
    ctx.lazyInvoke = hf.makeInvokeHandler(ref, ccKey, ccUniqueKey, ccClassKey, { isLazy: true });

    ctx.setGlobalState = (state, reactCallback, delay, renderKey) => {
      _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, delay, renderKey);
    };
  }

  if (liteLevel > 2) {// level 3, assign async api
    ctx.syncBool = (e, delay = -1, idt = '') => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'bool', delay, idt }, ref);
      __sync({ type: 'bool' }, e, ref);
    };
    ctx.sync = (e, val, delay = -1, idt = '') => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'val', val, delay, idt }, ref);
      __sync({ type: 'val' }, ref, e);//allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    };
    ctx.set = (ccsync, val, delay, idt) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, idt }, ref);
    };
    ctx.setBool = (ccsync, delay = -1, idt = '') => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, idt }, ref);
    };
    ctx.syncInt = (e, delay = -1, idt = '') => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'int', delay, idt }, ref);
      __sync({ type: 'int' }, ref, e);
    };
  }

  if (liteLevel > 3) {// level 4, assign event api
    ctx.emit = (event, ...args) => {
      const _event = ev.getEventItem(event, stateModule, ccClassKey);
      ev.findEventHandlersToPerform(_event, ...args);
    };
    ctx.off = (event, { module, ccClassKey, identity } = {}) => {
      ev.findEventHandlersToOff(event, { module, ccClassKey, identity });
    }
    const on = (event, handler, identity = null, delayToDidMount = true) => {
      if (delayToDidMount) {
        //cache to onEvents firstly, cc will bind them in didMount life cycle
        onEvents.push({ event, handler, identity });
        return;
      }
      ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };
    ctx.on = on;
    // on handler been effective in didMount by default, so user can call it in setup safely
    // but if user want on been effective immediately, user can call onDirectly
    // or on(ev, fn, idt, false)
    ctx.onDirectly = (event, handler, identity = null) => {
      on(event, handler, identity, false);
    }
  }

  if(liteLevel > 4){// level 5, assign enhance api
    ctx.defineExecute = handler => ctx.execute = handler;
    ctx.defineAuxMethod = (methodName, handler) => ctx.aux[methodName] = handler;

    const defineEffect = (fn, stateKeys, immediate = true, eId) => {
      if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');
      if (stateKeys !== null && stateKeys !== undefined) {
        if (!Array.isArray(stateKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
      }
      const _eId = eId || getEId();
      // const effectItem = { fn: _fn, stateKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };
      const effectItem = { fn, stateKeys, eId: _eId, immediate };
      effectItems.push(effectItem);
    };
    const defineWatch = getDefineWatchHandler(ctx, watchFns, immediateWatchKeys);
    const defineComputed = getDefineComputedHandler(ctx, computedFns);

    ctx.defineWatch = defineWatch;
    ctx.defineComputed = defineComputed;
    ctx.defineEffect = defineEffect;
    // alias
    ctx.watch = defineWatch;
    ctx.computed = defineComputed;
    ctx.effect = defineEffect;
  }

  ref.ctx = ctx;
  ref.setState = setState;
  ref.forceUpdate = forceUpdate;
}

