import {
  MODULE_GLOBAL, ERR, CCSYNC_KEY,
  SET_STATE, SET_MODULE_STATE, FORCE_UPDATE, CC_HOOK,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import { NOT_A_JSON } from '../../support/priv-constant';
import * as ev from '../event';
import * as hf from '../state/handler-factory';
import changeRefState from '../state/change-ref-state';
import getDefineWatchHandler from '../watch/get-define-watch-handler';
import getDefineComputedHandler from '../computed/get-define-computed-handler';
import computeCcUniqueKey from '../base/compute-cc-unique-key';
import getOutProps from '../base/get-out-props';
import getStoredKeys from '../base/get-stored-keys';
import __sync from '../base/sync';

const {
  refStore,
  ccClassKey_ccClassContext_,
  moduleName_stateKeys_,
  store: { getState },
  moduleName_ccClassKeys_,
  computed: { _computedValue },
  renderKey_ccUkeys_,
} = ccContext;

const { okeys, makeError: me, verboseInfo: vbi, safeGetArrayFromObject, justWarning } = util;

let idSeq = 0;
function getEId() {
  idSeq++;
  return Symbol(`__autoGen_${idSeq}__`);
}

const noop = () => { };
const eType = (th) => `type of defineEffect ${th} param must be`;

//调用buildFragmentRefCtx 之前，props参数已被处理过

/**
 * 构建refCtx，附加到ref上
 * liteLevel 越小，绑定的方法越少
 */
export default function (ref, params, liteLevel = 5) {
  
  // 能省赋默认值的就省，比如state，外层调用都保证赋值过了
  let {
    isSingle, ccClassKey, ccKey = '', module, type,
    state, storedKeys = [], persistStoredKeys = false, watchedKeys, connect = {}, tag = '', ccOption = {},
  } = params;
  const stateModule = module;
  const existedCtx = ref.ctx;

  let __boundSetState = ref.setState, __boundForceUpdate = ref.forceUpdate;
  if (existedCtx) {//如果已存在ctx，则直接指向原来的__bound，否则会造成无限递归调用栈溢出
    __boundSetState = existedCtx.__boundSetState;
    __boundForceUpdate = existedCtx.__boundForceUpdate;
  } else if (type !== CC_HOOK) {
    __boundSetState = ref.setState.bind(ref);
    __boundForceUpdate = ref.forceUpdate.bind(ref);
  }

  const refOption = {};
  refOption.persistStoredKeys = ccOption.persistStoredKeys === undefined ? persistStoredKeys : ccOption.persistStoredKeys;
  refOption.tag = ccOption.tag || tag;

  // pick ref defined tag first, register tag second
  const ccUniqueKey = computeCcUniqueKey(isSingle, ccClassKey, ccKey, refOption.tag);
  refOption.renderKey = ccOption.renderKey || ccUniqueKey;// 没有设定renderKey的话，默认ccUniqueKey就是renderKey
  const ccUkeys = safeGetArrayFromObject(renderKey_ccUkeys_, refOption.renderKey);
  ccUkeys.push(ccUniqueKey);

  refOption.storedKeys = getStoredKeys(state, moduleName_stateKeys_[stateModule], ccOption.storedKeys, storedKeys);

  //用户使用ccKey属性的话，必需显示的指定ccClassKey
  if (ccKey && !ccClassKey) {
    throw new Error(`missing ccClassKey while init a cc ins with ccKey[${ccKey}]`);
  }

  if (refOption.storedKeys.length > 0) {
    if (!ccKey) throw me(ERR.CC_STORED_KEYS_NEED_CCKEY, vbi(`ccClassKey[${ccClassKey}]`));
  }

  const classCtx = ccClassKey_ccClassContext_[ccClassKey];
  const connectedComputed = classCtx.connectedComputed || {};
  const connectedState = classCtx.connectedState || {};
  const moduleState = getState(module);
  const moduleComputed = _computedValue[module] || {};
  const globalComputed = _computedValue[MODULE_GLOBAL] || {};
  const globalState = getState(MODULE_GLOBAL);

  // extract privStateKeys
  const privStateKeys = util.removeArrElements(okeys(state), moduleName_stateKeys_[stateModule]);

  // recover ref state
  let refStoredState = refStore._state[ccUniqueKey] || {};
  const mergedState = Object.assign({}, state, refStoredState, moduleState);
  ref.state = mergedState;
  const stateKeys = okeys(mergedState);

  // record ccClassKey
  const ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey);

  // declare cc state series api
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
  const refs = {};

  // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
  // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }
  const computedDep = {}, watchDep = {};
  
  const props = getOutProps(ref.props);
  const ctx = {
    // static params
    type,
    isSingle,
    module,
    ccClassKey,
    ccKey,
    ccUniqueKey,
    renderCount: 1,
    initTime: Date.now(),
    watchedKeys,
    privStateKeys,
    connect,
    
    persistStoredKeys: refOption.persistStoredKeys,
    storedKeys: refOption.storedKeys,
    renderKey: refOption.renderKey,
    tag: refOption.tag,

    prevProps: props,
    props,
    mapped:{},

    prevState: mergedState,
    // state
    state: mergedState,
    moduleState,
    globalState,
    connectedState,
    extra: {},// can pass value to extra in every render period
    staticExtra: {},// only can be assign value in setup block

    // computed result containers
    refComputed: {},
    refComputedOri: {},// 未代理的计算值容器
    moduleComputed,
    globalComputed,
    connectedComputed,

    moduleReducer: {},
    connectedReducer: {},
    reducer: {},

    //collect mapProps result
    mapped: {},

    // api meta data
    stateKeys,
    onEvents,
    computedDep,
    computedRetKeyFns: {},//不按模块分类，映射的cuRetKey_fn_
    watchDep,
    watchRetKeyFns: {},//不按模块分类，映射的watchRetKey_fn_
    execute: null,
    auxMap,// auxiliary method map
    effectMeta,
    retKey_fnUid_: {},
    
    // api
    reactSetState: noop,//等待重写
    __boundSetState,
    reactForceUpdate: noop,//等待重写
    __boundForceUpdate,
    setState,
    setModuleState,
    forceUpdate,
    changeState,// not expose in d.ts
    refs,
    useRef: (refName) => {
      return ref => refs[refName] = { current: ref };// keep the same shape with hook useRef
    },
    
    // below only can be called by cc or updated by cc in existed period, not expose in d.ts
    __$$ccSetState: hf.makeCcSetStateHandler(ref),
    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$settedList: [],//[{module:string, keys:string[]}, ...]
    __$$prevMoStateVer: {},
  };
  ref.setState = setState;
  ref.forceUpdate = forceUpdate;

  // allow user have a chance to define state in setup block;
  ctx.initState = (initState) => {
    if (!ref.__$$isBF) {
      return justWarning(`ctx.initState can only been called before first render period!`);
    }
    if (!util.isPJO(state)) {
      return justWarning(`state ${NOT_A_JSON}`);
    }
    ref.state = Object.assign({}, state, initState, refStoredState, moduleState);
    ctx.prevState = ctx.state = ref.state;
  }

  // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler
  const dispatch = hf.makeDispatchHandler(ref, false, false, stateModule);
  ctx.dispatch = dispatch;

  if (liteLevel > 1) {// level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, false, stateModule);
    ctx.silentDispatch = hf.makeDispatchHandler(ref, false, true, stateModule);
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
    const doSync = (e, val, rkey, delay, type)=>{
      if (typeof e === 'string') return __sync.bind(null, { [CCSYNC_KEY]: e, type, val, delay, rkey }, ref);
      __sync({ type: 'val' }, ref, e);//allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    }

    ctx.sync = (e, val, rkey = '', delay = -1) => doSync(e, val, rkey, delay, 'val');
    ctx.syncBool = (e, val, rkey = '', delay = -1) => doSync(e, val, rkey, delay, 'bool');
    ctx.syncInt = (e, val, rkey = '', delay = -1) => doSync(e, val, rkey, delay, 'int');
    ctx.syncAs = (e, val, rkey = '', delay = -1) => doSync(e, val, rkey, delay, 'as');

    ctx.set = (ccsync, val, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'val', val, delay, rkey }, ref);
    };
    ctx.setBool = (ccsync, rkey = '', delay = -1) => {
      __sync({ [CCSYNC_KEY]: ccsync, type: 'bool', delay, rkey }, ref);
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
    ctx.on = (inputEvent, handler) => {
      //这里刻意赋默认值identity = null，表示on的是不带id认证的监听
      const { name: event, identity = null } = ev.getEventItem(inputEvent);
      onEvents.push({ event, handler, identity });

      // 不再支持delayToDidMount参数，考虑异步渲染的安全性，一定是didMount阶段开始监听
      // if (delayToDidMount) {
      //   onEvents.push({ event, handler, identity });
      //   //cache to onEvents firstly, cc will bind them in didMount life cycle
      //   return;
      // }
      // ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };
  }

  if (liteLevel > 4) {// level 5, assign enhance api
    ctx.execute = handler => ctx.execute = handler;
    ctx.aux = (methodName, handler) => {
      if (auxMap[methodName]) throw new Error(`auxMethod[${methodName}] already defined!`);
      auxMap[methodName] = handler;
    }
    ctx.watch = getDefineWatchHandler(ctx);
    ctx.computed = getDefineComputedHandler(ctx);
    ctx.lazyComputed = getDefineComputedHandler(ctx, true);

    const makeEffectHandler = (targetEffectItems, isProp) => (fn, depKeys, compare = true, immediate = true) => {
      if (typeof fn !== 'function') throw new Error(`${eType('first')} function`);
      let _depKeys = depKeys;
      //对于effectProps 第三位参数就是immediate
      let _immediate = isProp ? compare : immediate;

      // depKeys 为null 和 undefined 表示无任何依赖，每一轮都执行的副作用
      if (depKeys !== null && depKeys !== undefined) {
        if (!Array.isArray(depKeys)) throw new Error(`${eType('second')} one of them(array, null, undefined)`);
      }

      let moDepKeys = null;
      if (!isProp && _depKeys) {
        moDepKeys = [];
        _depKeys.forEach(depKey => {
          if (depKey.includes('/')) moDepKeys.push(depKey);
          else moDepKeys.push(`${stateModule}/${depKey}`);
        });
      }
      // 对于effectProps来说是不会读取compare属性来用的
      const effectItem = { fn, isProp, depKeys: _depKeys, moDepKeys, eId: getEId(), compare, immediate: _immediate };
      targetEffectItems.push(effectItem);
    };

    ctx.effect = makeEffectHandler(effectItems, false);
    ctx.effectProps = makeEffectHandler(effectPropsItems, true);
  }

  if (!existedCtx) ref.ctx = ctx;
  // 适配热加载或者异步渲染里, 需要清理ctx里运行时收集的相关数据，重新分配即可
  else Object.assign(ref.ctx, ctx);

}
