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
  renderKey_ccUkeys_,
} = ccContext;

const { okeys, makeError: me, verboseInfo: vbi, safeGetArrayFromObject } = util;

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
    isSingle, ccClassKey, ccKey = '', module, reducerModule, type,
    state = {}, storedKeys, watchedKeys, connect = {}, tag, ccOption,
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

  // pick ref defined tag first, register tag second
  const ccUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey, ccOption.tag || tag);

  // 没有设定renderKey的话，默认ccUniqueKey就是renderKey
  let renderKey = ccOption.renderKey;
  if (!renderKey) renderKey = ccOption.renderKey = ccUniqueKey;
  const ccUkeys = safeGetArrayFromObject(renderKey_ccUkeys_, renderKey);
  ccUkeys.push(ccUniqueKey);

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
  const stateKeys = okeys(mergedState);

  // record ref
  setRef(ref, isSingle, ccClassKey, ccKey, ccUniqueKey);

  // record ccClassKey
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);

  // create cc api
  const changeState = (state, option) => {
    changeRefState(state, option, ref);
  }
  const _setState = (module, state, calledBy, reactCallback, renderKey, delay) => {
    changeState(state, { calledBy, module, renderKey, delay, reactCallback });
  };
  const setModuleState = (module, state, reactCallback, renderKey, delay) => {
    _setState(module, state, SET_MODULE_STATE, reactCallback, renderKey, delay);
  };
  // const setState = (state, reactCallback, renderKey, delay) => {
  const setState = (p1, p2, p3, p4, p5) => {
    if (typeof p1 === 'string') {
      //p1 module, p2 state, p3 cb, p4 rkey, p5 delay
      setModuleState(p1, p2, p3, p4, p5);
    } else {
      //p1 state, p2 cb, p3 rkey, p4 delay
      _setState(stateModule, p1, SET_STATE, p2, p3, p4);
    }
  };
  const forceUpdate = (reactCallback, renderKey, delay) => {
    _setState(stateModule, ref.state, FORCE_UPDATE, reactCallback, renderKey, delay);
  };


  const onEvents = [];
  const effectItems = [], effectPropsItems = [];// {fn:function, status:0, eId:'', immediate:true}
  const eid_effectReturnCb_ = {}, eid_effectPropsReturnCb_ = {};// fn
  const effectMeta = { effectItems, eid_effectReturnCb_, effectPropsItems, eid_effectPropsReturnCb_ };
  const auxMap = {};

  // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
  // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }
  const computedDep = {}, watchDep = {};

  const props = getOutProps(ref.props);
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

    prevProps: props,
    props,
    mapped:{},

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

    moduleReducer: {},
    connectedReducer: {},
    reducer: {},
    lazyReducer: {},

    //collect mapProps result
    mapped: {},

    // api meta data
    prevModuleStateVer: {},
    stateKeys,
    onEvents,
    computedDep,
    watchDep,
    execute: null,
    auxMap,// auxiliary method map
    effectMeta,

    // api
    reactSetState,
    reactForceUpdate,
    setState,
    setModuleState,
    forceUpdate,
    changeState,

    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$ccSetState: hf.makeCcSetStateHandler(ref),
  };
  ref.ctx = ctx;
  ref.setState = setState;
  ref.forceUpdate = forceUpdate;

  // allow user have a chance to define state in setup block;
  ctx.initState = (initState) => {
    if (!ref.__$$isBeforeFirstRender) throw new Error(`ctx.initState can only been called before first render period!`);
    if (!util.isPlainJsonObject(state)) throw new Error(`state must be a plain json object!`);
    ref.state = Object.assign({}, state, initState, refStoredState, moduleState);
    ctx.prevState = ctx.state = ref.state;
  }

  // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler
  const dispatch = hf.makeDispatchHandler(ref, false, false, stateModule, stateModule);
  ctx.dispatch = dispatch;

  if (liteLevel > 1) {// level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, false, stateModule, stateModule);
    ctx.silentDispatch = hf.makeDispatchHandler(ref, false, true, stateModule, stateModule);
    ctx.dispatchLazy = ctx.lazyDispatch;// alias of lazyDispatch
    ctx.dispatchSilent = ctx.silentDispatch;// alias of silentDispatch

    ctx.invoke = hf.makeInvokeHandler(ref);
    ctx.lazyInvoke = hf.makeInvokeHandler(ref, { isLazy: true });
    ctx.silentInvoke = hf.makeInvokeHandler(ref, { isLazy: false, isSilent: true });
    ctx.invokeLazy = ctx.lazyInvoke;// alias of lazyInvoke
    ctx.invokeSilent = ctx.silentInvoke;// alias of silentInvoke

    ctx.setGlobalState = (state, reactCallback, renderKey, delay) => {
      _setState(MODULE_GLOBAL, state, SET_STATE, reactCallback, renderKey, delay);
    };
  }

  if (liteLevel > 2) {// level 3, assign async api
    ctx.syncBool = (e, rkey = '', delay = -1) => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'bool', delay, rkey }, ref);
      __sync({ type: 'bool' }, e, ref);
    };
    ctx.sync = (e, val, rkey = '', delay = -1) => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'val', val, delay, rkey }, ref);
      __sync({ type: 'val' }, ref, e);//allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    };
    ctx.set = (ccsync, val, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, rkey }, ref);
    };
    ctx.setBool = (ccsync, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, rkey }, ref);
    };
    ctx.syncInt = (e, rkey = '', delay = -1) => {
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type: 'int', delay, rkey }, ref);
      __sync({ type: 'int' }, ref, e);
    };
  }

  if (liteLevel > 3) {// level 4, assign event api
    ctx.emit = (event, ...args) => {
      ev.findEventHandlersToPerform(ev.getEventItem(event), ...args);
    };
    // 默认off掉当前实例对某个事件名的所有监听
    ctx.off = (event, { module, ccClassKey, ccUniqueKey: inputCcUkey = ccUniqueKey } = {}) => {
      //这里刻意不为identity赋默认值，如果是undefined，表示off掉所有监听
      const { name, identity } = ev.getEventItem(event);
      ev.findEventHandlersToOff(name, { module, ccClassKey, ccUniqueKey: inputCcUkey, identity });
    }
    const on = (inputEvent, handler, delayToDidMount = true) => {
      //这里刻意赋默认值identity = null，表示on的是不带id认证的监听
      const { name: event, identity = null } = ev.getEventItem(inputEvent);
      if (delayToDidMount) {
        //cache to onEvents firstly, cc will bind them in didMount life cycle
        onEvents.push({ event, handler, identity });
        return;
      }
      ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };
    ctx.on = on;
    // on handler been effective in didMount by default, so user can call it in setup safely
    // but if user want [on-op] been effective immediately, user can call onDirectly, but it may be dangerous!
    // or on(ev, fn, rkey, false)
    ctx.onDirectly = (event, handler) => {
      on(event, handler, false);
    }
  }

  if (liteLevel > 4) {// level 5, assign enhance api
    ctx.execute = handler => ctx.execute = handler;
    ctx.aux = (methodName, handler) => {
      if (auxMap[methodName]) throw new Error(`auxMethod[${methodName}] already defined!`);
      auxMap[methodName] = handler;
    }
    ctx.watch = getDefineWatchHandler(ctx);
    ctx.computed = getDefineComputedHandler(ctx);

    const makeEffectHandler = targetEffectItems => (fn, depKeys, immediate = true, eId) => {
      if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');
      if (depKeys !== null && depKeys !== undefined) {
        if (!Array.isArray(depKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
      }
      const _eId = eId || getEId();
      // const effectItem = { fn: _fn, depKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };
      const effectItem = { fn, depKeys, eId: _eId, depKeys, immediate };
      targetEffectItems.push(effectItem);
    };

    ctx.effect = makeEffectHandler(effectItems);
    ctx.effectProps = makeEffectHandler(effectPropsItems);
  }

}
