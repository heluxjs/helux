"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _setRef = _interopRequireDefault(require("./set-ref"));

var ev = _interopRequireWildcard(require("../event"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _changeRefState = _interopRequireDefault(require("../state/change-ref-state"));

var _getDefineWatchHandler = _interopRequireDefault(require("../watch/get-define-watch-handler"));

var _getDefineComputedHandler = _interopRequireDefault(require("../computed/get-define-computed-handler"));

var _computeCcUniqueKey = _interopRequireDefault(require("../base/compute-cc-unique-key"));

var _getOutProps = _interopRequireDefault(require("../base/get-out-props"));

var _getStoredKeys = _interopRequireDefault(require("../base/get-stored-keys"));

var _sync3 = _interopRequireDefault(require("../base/sync"));

var refStore = _ccContext["default"].refStore,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    getState = _ccContext["default"].store.getState,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    _computedValue = _ccContext["default"].computed._computedValue,
    renderKey_ccUkeys_ = _ccContext["default"].renderKey_ccUkeys_;
var okeys = util.okeys,
    me = util.makeError,
    vbi = util.verboseInfo,
    safeGetArrayFromObject = util.safeGetArrayFromObject,
    justWarning = util.justWarning;
var idSeq = 0;

function getEId() {
  idSeq++;
  return Symbol("__autoGen_" + idSeq + "__");
}

var noop = function noop() {};

var eType = function eType(th) {
  return "type of defineEffect " + th + " param must be";
}; //调用buildFragmentRefCtx 之前，props参数已被处理过

/**
 * 构建refCtx，附加到ref上
 * liteLevel 越小，绑定的方法越少
 */


function _default(ref, params, liteLevel) {
  var _ctx;

  if (liteLevel === void 0) {
    liteLevel = 5;
  }

  // 能省赋默认值的就省，比如state，外层调用都保证赋值过了
  var isSingle = params.isSingle,
      ccClassKey = params.ccClassKey,
      _params$ccKey = params.ccKey,
      ccKey = _params$ccKey === void 0 ? '' : _params$ccKey,
      module = params.module,
      type = params.type,
      state = params.state,
      _params$storedKeys = params.storedKeys,
      storedKeys = _params$storedKeys === void 0 ? [] : _params$storedKeys,
      _params$persistStored = params.persistStoredKeys,
      persistStoredKeys = _params$persistStored === void 0 ? false : _params$persistStored,
      watchedKeys = params.watchedKeys,
      _params$connect = params.connect,
      connect = _params$connect === void 0 ? {} : _params$connect,
      _params$tag = params.tag,
      tag = _params$tag === void 0 ? '' : _params$tag,
      _params$ccOption = params.ccOption,
      ccOption = _params$ccOption === void 0 ? {} : _params$ccOption;
  var stateModule = module;
  var __boundSetState = ref.setState,
      __boundForceUpdate = ref.forceUpdate;

  if (type !== _constant.CC_HOOK) {
    __boundSetState = ref.setState.bind(ref);
    __boundForceUpdate = ref.forceUpdate.bind(ref);
  }

  var refOption = {};
  refOption.persistStoredKeys = ccOption.persistStoredKeys === undefined ? persistStoredKeys : ccOption.persistStoredKeys;
  refOption.tag = ccOption.tag || tag; // pick ref defined tag first, register tag second

  var ccUniqueKey = (0, _computeCcUniqueKey["default"])(isSingle, ccClassKey, ccKey, refOption.tag);
  refOption.renderKey = ccOption.renderKey || ccUniqueKey; // 没有设定renderKey的话，默认ccUniqueKey就是renderKey

  var ccUkeys = safeGetArrayFromObject(renderKey_ccUkeys_, refOption.renderKey);
  ccUkeys.push(ccUniqueKey);
  refOption.storedKeys = (0, _getStoredKeys["default"])(state, moduleName_stateKeys_[stateModule], ccOption.storedKeys, storedKeys); //用户使用ccKey属性的话，必需显示的指定ccClassKey

  if (ccKey && !ccClassKey) {
    throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
  }

  if (refOption.storedKeys.length > 0) {
    if (!ccKey) throw me(_constant.ERR.CC_STORED_KEYS_NEED_CCKEY, vbi("ccClassKey[" + ccClassKey + "]"));
  }

  var classCtx = ccClassKey_ccClassContext_[ccClassKey];
  var connectedComputed = classCtx.connectedComputed || {};
  var connectedState = classCtx.connectedState || {};
  var moduleState = getState(module);
  var moduleComputed = _computedValue[module] || {};
  var globalComputed = _computedValue[_constant.MODULE_GLOBAL] || {};
  var globalState = getState(_constant.MODULE_GLOBAL); // extract privStateKeys

  var privStateKeys = util.removeArrElements(okeys(state), moduleName_stateKeys_[stateModule]); // recover ref state

  var refStoredState = refStore._state[ccUniqueKey] || {};
  var mergedState = Object.assign({}, state, refStoredState, moduleState);
  ref.state = mergedState;
  var stateKeys = okeys(mergedState); // record ref

  (0, _setRef["default"])(ref, isSingle, ccClassKey, ccKey, ccUniqueKey); // record ccClassKey

  var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey); // declare cc state series api

  var changeState = function changeState(state, option) {
    (0, _changeRefState["default"])(state, option, ref);
  };

  var _setState = function _setState(module, state, calledBy, reactCallback, renderKey, delay) {
    changeState(state, {
      calledBy: calledBy,
      module: module,
      renderKey: renderKey,
      delay: delay,
      reactCallback: reactCallback
    });
  };

  var setModuleState = function setModuleState(module, state, reactCallback, renderKey, delay) {
    _setState(module, state, _constant.SET_MODULE_STATE, reactCallback, renderKey, delay);
  }; // const setState = (state, reactCallback, renderKey, delay) => {


  var setState = function setState(p1, p2, p3, p4, p5) {
    if (typeof p1 === 'string') {
      //p1 module, p2 state, p3 cb, p4 rkey, p5 delay
      setModuleState(p1, p2, p3, p4, p5);
    } else {
      //p1 state, p2 cb, p3 rkey, p4 delay
      _setState(stateModule, p1, _constant.SET_STATE, p2, p3, p4);
    }
  };

  var forceUpdate = function forceUpdate(reactCallback, renderKey, delay) {
    _setState(stateModule, ref.state, _constant.FORCE_UPDATE, reactCallback, renderKey, delay);
  };

  var onEvents = [];
  var effectItems = [],
      effectPropsItems = []; // {fn:function, status:0, eId:'', immediate:true}

  var eid_effectReturnCb_ = {},
      eid_effectPropsReturnCb_ = {}; // fn

  var effectMeta = {
    effectItems: effectItems,
    eid_effectReturnCb_: eid_effectReturnCb_,
    effectPropsItems: effectPropsItems,
    eid_effectPropsReturnCb_: eid_effectPropsReturnCb_
  };
  var auxMap = {};
  var refs = {}; // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
  // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }

  var computedDep = {},
      watchDep = {};
  var props = (0, _getOutProps["default"])(ref.props);
  var ctx = (_ctx = {
    // static params
    type: type,
    isSingle: isSingle,
    module: module,
    ccClassKey: ccClassKey,
    ccKey: ccKey,
    ccUniqueKey: ccUniqueKey,
    renderCount: 1,
    initTime: Date.now(),
    watchedKeys: watchedKeys,
    privStateKeys: privStateKeys,
    connect: connect,
    persistStoredKeys: refOption.persistStoredKeys,
    storedKeys: refOption.storedKeys,
    renderKey: refOption.renderKey,
    tag: refOption.tag,
    prevProps: props,
    props: props,
    mapped: {},
    prevState: mergedState,
    // state
    state: mergedState,
    moduleState: moduleState,
    globalState: globalState,
    connectedState: connectedState,
    extra: {},
    // can pass value to extra in every render period
    staticExtra: {},
    // only can be assign value in setup block
    // computed
    refComputed: {},
    moduleComputed: moduleComputed,
    globalComputed: globalComputed,
    connectedComputed: connectedComputed,
    moduleReducer: {},
    connectedReducer: {},
    reducer: {}
  }, _ctx["mapped"] = {}, _ctx.prevModuleStateVer = {}, _ctx.stateKeys = stateKeys, _ctx.onEvents = onEvents, _ctx.computedDep = computedDep, _ctx.computedRetKeyFns = {}, _ctx.watchDep = watchDep, _ctx.watchRetKeyFns = {}, _ctx.execute = null, _ctx.auxMap = auxMap, _ctx.effectMeta = effectMeta, _ctx.retKey_fnUid_ = {}, _ctx.reactSetState = noop, _ctx.__boundSetState = __boundSetState, _ctx.reactForceUpdate = noop, _ctx.__boundForceUpdate = __boundForceUpdate, _ctx.setState = setState, _ctx.setModuleState = setModuleState, _ctx.forceUpdate = forceUpdate, _ctx.changeState = changeState, _ctx.refs = refs, _ctx.useRef = function useRef(refName) {
    return function (ref) {
      return refs[refName] = {
        current: ref
      };
    }; // keep the same shape with hook useRef
  }, _ctx.__$$ccSetState = hf.makeCcSetStateHandler(ref), _ctx.__$$ccForceUpdate = hf.makeCcForceUpdateHandler(ref), _ctx);
  ref.ctx = ctx;
  ref.setState = setState;
  ref.forceUpdate = forceUpdate; // allow user have a chance to define state in setup block;

  ctx.initState = function (initState) {
    if (!ref.__$$isBF) {
      return justWarning("ctx.initState can only been called before first render period!");
    }

    if (!util.isPJO(state)) {
      return justWarning("state " + _privConstant.NOT_A_JSON);
    }

    ref.state = Object.assign({}, state, initState, refStoredState, moduleState);
    ctx.prevState = ctx.state = ref.state;
  }; // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler


  var dispatch = hf.makeDispatchHandler(ref, false, false, stateModule);
  ctx.dispatch = dispatch;

  if (liteLevel > 1) {
    // level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, false, stateModule);
    ctx.silentDispatch = hf.makeDispatchHandler(ref, false, true, stateModule);
    ctx.dispatchLazy = ctx.lazyDispatch; // alias of lazyDispatch

    ctx.dispatchSilent = ctx.silentDispatch; // alias of silentDispatch

    ctx.invoke = hf.makeInvokeHandler(ref);
    ctx.lazyInvoke = hf.makeInvokeHandler(ref, {
      isLazy: true
    });
    ctx.silentInvoke = hf.makeInvokeHandler(ref, {
      isLazy: false,
      isSilent: true
    });
    ctx.invokeLazy = ctx.lazyInvoke; // alias of lazyInvoke

    ctx.invokeSilent = ctx.silentInvoke; // alias of silentInvoke

    ctx.setGlobalState = function (state, reactCallback, renderKey, delay) {
      _setState(_constant.MODULE_GLOBAL, state, _constant.SET_STATE, reactCallback, renderKey, delay);
    };
  }

  if (liteLevel > 2) {
    // level 3, assign async api
    ctx.syncBool = function (e, rkey, delay) {
      var _sync$bind;

      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind = {}, _sync$bind[_constant.CCSYNC_KEY] = e, _sync$bind.type = 'bool', _sync$bind.delay = delay, _sync$bind.rkey = rkey, _sync$bind), ref);
      (0, _sync3["default"])({
        type: 'bool'
      }, e, ref);
    };

    ctx.sync = function (e, val, rkey, delay) {
      var _sync$bind2;

      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind2 = {}, _sync$bind2[_constant.CCSYNC_KEY] = e, _sync$bind2.type = 'val', _sync$bind2.val = val, _sync$bind2.delay = delay, _sync$bind2.rkey = rkey, _sync$bind2), ref);
      (0, _sync3["default"])({
        type: 'val'
      }, ref, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    };

    ctx.set = function (ccsync, val, rkey, delay) {
      var _sync;

      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      (0, _sync3["default"])((_sync = {}, _sync[_constant.CCSYNC_KEY] = ccsync, _sync.type = 'val', _sync.val = val, _sync.delay = delay, _sync.rkey = rkey, _sync), ref);
    };

    ctx.setBool = function (ccsync, rkey, delay) {
      var _sync2;

      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      (0, _sync3["default"])((_sync2 = {}, _sync2[_constant.CCSYNC_KEY] = ccsync, _sync2.type = 'bool', _sync2.delay = delay, _sync2.rkey = rkey, _sync2), ref);
    };

    ctx.syncInt = function (e, rkey, delay) {
      var _sync$bind3;

      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind3 = {}, _sync$bind3[_constant.CCSYNC_KEY] = e, _sync$bind3.type = 'int', _sync$bind3.delay = delay, _sync$bind3.rkey = rkey, _sync$bind3), ref);
      (0, _sync3["default"])({
        type: 'int'
      }, ref, e);
    };
  }

  if (liteLevel > 3) {
    // level 4, assign event api
    ctx.emit = function (event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      ev.findEventHandlersToPerform.apply(ev, [ev.getEventItem(event)].concat(args));
    }; // 默认off掉当前实例对某个事件名的所有监听


    ctx.off = function (event, _temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          module = _ref.module,
          ccClassKey = _ref.ccClassKey,
          _ref$ccUniqueKey = _ref.ccUniqueKey,
          inputCcUkey = _ref$ccUniqueKey === void 0 ? ccUniqueKey : _ref$ccUniqueKey;

      //这里刻意不为identity赋默认值，如果是undefined，表示off掉所有监听
      var _ev$getEventItem = ev.getEventItem(event),
          name = _ev$getEventItem.name,
          identity = _ev$getEventItem.identity;

      ev.findEventHandlersToOff(name, {
        module: module,
        ccClassKey: ccClassKey,
        ccUniqueKey: inputCcUkey,
        identity: identity
      });
    };

    var on = function on(inputEvent, handler, delayToDidMount) {
      if (delayToDidMount === void 0) {
        delayToDidMount = true;
      }

      //这里刻意赋默认值identity = null，表示on的是不带id认证的监听
      var _ev$getEventItem2 = ev.getEventItem(inputEvent),
          event = _ev$getEventItem2.name,
          _ev$getEventItem2$ide = _ev$getEventItem2.identity,
          identity = _ev$getEventItem2$ide === void 0 ? null : _ev$getEventItem2$ide;

      if (delayToDidMount) {
        //cache to onEvents firstly, cc will bind them in didMount life cycle
        onEvents.push({
          event: event,
          handler: handler,
          identity: identity
        });
        return;
      }

      ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };

    ctx.on = on; // on handler been effective in didMount by default, so user can call it in setup safely
    // but if user want [on-op] been effective immediately, user can call onDirectly, but it may be dangerous!
    // or on(ev, fn, rkey, false)

    ctx.onDirectly = function (event, handler) {
      on(event, handler, false);
    };
  }

  if (liteLevel > 4) {
    // level 5, assign enhance api
    ctx.execute = function (handler) {
      return ctx.execute = handler;
    };

    ctx.aux = function (methodName, handler) {
      if (auxMap[methodName]) throw new Error("auxMethod[" + methodName + "] already defined!");
      auxMap[methodName] = handler;
    };

    ctx.watch = (0, _getDefineWatchHandler["default"])(ctx);
    ctx.computed = (0, _getDefineComputedHandler["default"])(ctx);
    ctx.lazyComputed = (0, _getDefineComputedHandler["default"])(ctx, true);

    var makeEffectHandler = function makeEffectHandler(targetEffectItems) {
      return function (fn, depKeys, immediate, eId) {
        var _effectItem;

        if (immediate === void 0) {
          immediate = true;
        }

        if (typeof fn !== 'function') throw new Error(eType('first') + " function");

        if (depKeys !== null && depKeys !== undefined) {
          if (!Array.isArray(depKeys)) throw new Error(eType('second') + " one of them(array, null, undefined)");
        }

        var _eId = eId || getEId(); // const effectItem = { fn: _fn, depKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };


        var effectItem = (_effectItem = {
          fn: fn,
          depKeys: depKeys,
          eId: _eId
        }, _effectItem["depKeys"] = depKeys, _effectItem.immediate = immediate, _effectItem);
        targetEffectItems.push(effectItem);
      };
    };

    ctx.effect = makeEffectHandler(effectItems);
    ctx.effectProps = makeEffectHandler(effectPropsItems);
  }
}