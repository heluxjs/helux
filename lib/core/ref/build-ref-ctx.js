"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var _setRef = _interopRequireDefault(require("./set-ref"));

var ev = _interopRequireWildcard(require("../event"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _changeRefState = _interopRequireDefault(require("../state/change-ref-state"));

var _getDefineWatchHandler = _interopRequireDefault(require("../watch/get-define-watch-handler"));

var _getDefineComputedHandler = _interopRequireDefault(require("../computed/get-define-computed-handler"));

var _computeCcUniqueKey = _interopRequireDefault(require("../base/compute-cc-unique-key"));

var _getOutProps = _interopRequireDefault(require("../base/get-out-props"));

var _sync3 = _interopRequireDefault(require("../base/sync"));

var refStore = _ccContext["default"].refStore,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    getState = _ccContext["default"].store.getState,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_,
    _computedValue = _ccContext["default"].computed._computedValue,
    renderKey_ccUkeys_ = _ccContext["default"].renderKey_ccUkeys_;
var okeys = util.okeys,
    me = util.makeError,
    vbi = util.verboseInfo,
    safeGetArrayFromObject = util.safeGetArrayFromObject;
var idSeq = 0;

function getEId() {
  idSeq++;
  return Symbol("__autoGen_" + idSeq + "__");
} //调用buildFragmentRefCtx 之前，props参数已被处理过

/**
 * 构建refCtx，附加到ref.cc上
 * liteLevel 越小，绑定的方法越少
 */


function _default(ref, params, liteLevel) {
  var _ctx;

  if (liteLevel === void 0) {
    liteLevel = 5;
  }

  var reactSetState = ref.setState.bind(ref);
  var reactForceUpdate = ref.forceUpdate.bind(ref);
  var isSingle = params.isSingle,
      ccClassKey = params.ccClassKey,
      ccKey = params.ccKey,
      module = params.module,
      reducerModule = params.reducerModule,
      type = params.type,
      _params$state = params.state,
      state = _params$state === void 0 ? {} : _params$state,
      storedKeys = params.storedKeys,
      watchedKeys = params.watchedKeys,
      connect = params.connect,
      tag = params.tag,
      ccOption = params.ccOption;
  reducerModule = reducerModule || module;
  var stateModule = module; //用户使用ccKey属性的话，必需显示的指定ccClassKey

  if (ccKey && !ccClassKey) {
    throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
  }

  var _storedKeys = [];

  if (storedKeys !== undefined && storedKeys.length > 0) {
    if (!ccKey) throw me(_constant.ERR.CC_STORED_KEYS_NEED_CCKEY, vbi("ccClassKey[" + ccClassKey + "]"));
    _storedKeys = storedKeys;
  }

  var ccUniqueKey = (0, _computeCcUniqueKey["default"])(isSingle, ccClassKey, ccKey, tag); // 没有设定renderKey的话，默认ccUniqueKey就是renderKey

  var renderKey = ccOption.renderKey;
  if (!renderKey) renderKey = ccOption.renderKey = ccUniqueKey;
  var ccUkeys = safeGetArrayFromObject(renderKey_ccUkeys_, renderKey);
  ccUkeys.push(ccUniqueKey);
  var classCtx = ccClassKey_ccClassContext_[ccClassKey];
  var connectedComputed = classCtx.connectedComputed || {};
  var connectedState = classCtx.connectedState || {};
  var moduleState = getState(module);
  var moduleComputed = _computedValue[module] || {};
  var globalComputed = _computedValue[_constant.MODULE_GLOBAL] || {};
  var globalState = getState(_constant.MODULE_GLOBAL);
  var refConnectedComputed = {};
  okeys(connect).forEach(function (moduleName) {
    refConnectedComputed[moduleName] = {};
  }); // recover ref state

  var refStoredState = refStore._state[ccUniqueKey] || {};
  var mergedState = Object.assign({}, state, refStoredState, moduleState);
  ref.state = mergedState; // record ref

  (0, _setRef["default"])(ref, isSingle, ccClassKey, ccKey, ccUniqueKey); // record ccClassKey

  var ccClassKeys = util.safeGetArrayFromObject(moduleName_ccClassKeys_, module);
  if (!ccClassKeys.includes(ccClassKey)) ccClassKeys.push(ccClassKey); // create cc api

  var _setState = function _setState(module, state, calledBy, reactCallback, renderKey, delay) {
    (0, _changeRefState["default"])(state, {
      calledBy: calledBy,
      ccKey: ccKey,
      ccUniqueKey: ccUniqueKey,
      module: module,
      renderKey: renderKey,
      delay: delay,
      reactCallback: reactCallback
    }, ref);
  };

  var setModuleState = function setModuleState(module, state, reactCallback, renderKey, delay) {
    _setState(module, state, _constant.SET_MODULE_STATE, reactCallback, renderKey, delay);
  }; // const setState = (state, reactCallback, renderKey, delay) => {


  var setState = function setState(p1, p2, p3, p4, p5) {
    if (typeof p1 === 'string') {
      //p1 module, p2 state, p3 cb, p4 delay, p5 idt
      setModuleState(p1, p2, p3, p4, p5);
    } else {
      //p1 state, p2 cb, p3 delay, p4 idt
      _setState(stateModule, p1, _constant.SET_STATE, p2, p3, p4);
    }
  };

  var forceUpdate = function forceUpdate(reactCallback, renderKey, delay) {
    _setState(stateModule, ref.state, _constant.FORCE_UPDATE, reactCallback, renderKey, delay);
  };

  var changeState = function changeState(state, option) {
    (0, _changeRefState["default"])(state, option, ref);
  };

  var onEvents = [];
  var effectItems = []; // {fn:function, status:0, eId:'', immediate:true}

  var eid_effectReturnCb_ = {}; // fn

  var effectMeta = {
    effectItems: effectItems,
    eid_effectReturnCb_: eid_effectReturnCb_
  };
  var aux = {},
      computedFns = {},
      watchFns = {},
      immediateWatchKeys = []; // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
  // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }

  var computedDep = {},
      watchDep = {};
  var ctx = (_ctx = {
    // static params
    type: type,
    module: module,
    reducerModule: reducerModule,
    ccClassKey: ccClassKey,
    ccKey: ccKey,
    ccUniqueKey: ccUniqueKey,
    renderCount: 1,
    initTime: Date.now(),
    storedKeys: _storedKeys,
    watchedKeys: watchedKeys,
    connect: connect,
    ccOption: ccOption,
    props: (0, _getOutProps["default"])(ref.props),
    mapped: {},
    prevState: mergedState,
    // state
    state: mergedState,
    moduleState: moduleState,
    globalState: globalState,
    connectedState: connectedState,
    // computed
    refComputed: {},
    refConnectedComputed: refConnectedComputed,
    moduleComputed: moduleComputed,
    globalComputed: globalComputed,
    connectedComputed: connectedComputed
  }, _ctx["mapped"] = {}, _ctx.onEvents = onEvents, _ctx.computedFns = computedFns, _ctx.computedDep = computedDep, _ctx.watchFns = watchFns, _ctx.watchDep = watchDep, _ctx.immediateWatchKeys = immediateWatchKeys, _ctx.execute = null, _ctx.reducer = {}, _ctx.lazyReducer = {}, _ctx.aux = aux, _ctx.effectMeta = effectMeta, _ctx.reactSetState = reactSetState, _ctx.reactForceUpdate = reactForceUpdate, _ctx.setState = setState, _ctx.setModuleState = setModuleState, _ctx.forceUpdate = forceUpdate, _ctx.changeState = changeState, _ctx.__$$ccForceUpdate = hf.makeCcForceUpdateHandler(ref), _ctx.__$$ccSetState = hf.makeCcSetStateHandler(ref), _ctx);
  ref.ctx = ctx;
  ref.setState = setState;
  ref.forceUpdate = forceUpdate; // 创建dispatch需要ref.ctx里的ccClassKey相关信息, 所以这里放在ref.ctx赋值之后在调用makeDispatchHandler

  var dispatch = hf.makeDispatchHandler(ref, false, stateModule, stateModule);
  ctx.dispatch = dispatch;

  if (liteLevel > 1) {
    // level 2, assign these mod data api
    ctx.lazyDispatch = hf.makeDispatchHandler(ref, true, stateModule, stateModule);
    ctx.invoke = hf.makeInvokeHandler(ref);
    ctx.lazyInvoke = hf.makeInvokeHandler(ref, {
      isLazy: true
    });

    ctx.setGlobalState = function (state, reactCallback, renderKey, delay) {
      _setState(_constant.MODULE_GLOBAL, state, _constant.SET_STATE, reactCallback, renderKey, delay);
    };
  }

  if (liteLevel > 2) {
    // level 3, assign async api
    ctx.syncBool = function (e, delay, idt) {
      var _sync$bind;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind = {}, _sync$bind[_constant.CCSYNC_KEY] = e, _sync$bind.type = 'bool', _sync$bind.delay = delay, _sync$bind.idt = idt, _sync$bind), ref);
      (0, _sync3["default"])({
        type: 'bool'
      }, e, ref);
    };

    ctx.sync = function (e, val, delay, idt) {
      var _sync$bind2;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind2 = {}, _sync$bind2[_constant.CCSYNC_KEY] = e, _sync$bind2.type = 'val', _sync$bind2.val = val, _sync$bind2.delay = delay, _sync$bind2.idt = idt, _sync$bind2), ref);
      (0, _sync3["default"])({
        type: 'val'
      }, ref, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    };

    ctx.set = function (ccsync, val, delay, idt) {
      var _sync;

      (0, _sync3["default"])((_sync = {}, _sync[_constant.CCSYNC_KEY] = ccsync, _sync.type = 'val', _sync.val = val, _sync.delay = delay, _sync.idt = idt, _sync), ref);
    };

    ctx.setBool = function (ccsync, delay, idt) {
      var _sync2;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      (0, _sync3["default"])((_sync2 = {}, _sync2[_constant.CCSYNC_KEY] = ccsync, _sync2.type = 'bool', _sync2.delay = delay, _sync2.idt = idt, _sync2), ref);
    };

    ctx.syncInt = function (e, delay, idt) {
      var _sync$bind3;

      if (delay === void 0) {
        delay = -1;
      }

      if (idt === void 0) {
        idt = '';
      }

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind3 = {}, _sync$bind3[_constant.CCSYNC_KEY] = e, _sync$bind3.type = 'int', _sync$bind3.delay = delay, _sync$bind3.idt = idt, _sync$bind3), ref);
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
    // but if user want on been effective immediately, user can call onDirectly
    // or on(ev, fn, idt, false)

    ctx.onDirectly = function (event, handler) {
      on(event, handler, false);
    };
  }

  if (liteLevel > 4) {
    // level 5, assign enhance api
    ctx.defineExecute = function (handler) {
      return ctx.execute = handler;
    };

    ctx.defineAuxMethod = function (methodName, handler) {
      return ctx.aux[methodName] = handler;
    };

    var defineEffect = function defineEffect(fn, stateKeys, immediate, eId) {
      if (immediate === void 0) {
        immediate = true;
      }

      if (typeof fn !== 'function') throw new Error('type of defineEffect first param must be function');

      if (stateKeys !== null && stateKeys !== undefined) {
        if (!Array.isArray(stateKeys)) throw new Error('type of defineEffect second param must be one of them(array, null, undefined)');
      }

      var _eId = eId || getEId(); // const effectItem = { fn: _fn, stateKeys, status: EFFECT_AVAILABLE, eId: _eId, immediate };


      var effectItem = {
        fn: fn,
        stateKeys: stateKeys,
        eId: _eId,
        immediate: immediate
      };
      effectItems.push(effectItem);
    };

    var defineWatch = (0, _getDefineWatchHandler["default"])(ctx, watchFns, immediateWatchKeys, watchDep);
    var defineComputed = (0, _getDefineComputedHandler["default"])(ctx, computedFns, computedDep);
    ctx.defineWatch = defineWatch;
    ctx.defineComputed = defineComputed;
    ctx.defineEffect = defineEffect; // alias

    ctx.watch = defineWatch;
    ctx.computed = defineComputed;
    ctx.effect = defineEffect;
  }
}