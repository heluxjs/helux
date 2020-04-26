"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var ev = _interopRequireWildcard(require("../event"));

var hf = _interopRequireWildcard(require("../state/handler-factory"));

var _changeRefState = _interopRequireDefault(require("../state/change-ref-state"));

var _makeObState = _interopRequireDefault(require("../state/make-ob-state"));

var _getDefineWatchHandler = _interopRequireDefault(require("../watch/get-define-watch-handler"));

var _getDefineComputedHandler = _interopRequireDefault(require("../computed/get-define-computed-handler"));

var _makeCuRefObContainer = _interopRequireDefault(require("../computed/make-cu-ref-ob-container"));

var _computeCcUniqueKey = _interopRequireDefault(require("../base/compute-cc-unique-key"));

var _getOutProps = _interopRequireDefault(require("../base/get-out-props"));

var _getStoredKeys = _interopRequireDefault(require("../base/get-stored-keys"));

var _sync3 = _interopRequireDefault(require("../base/sync"));

var _ccContext$reducer = _ccContext["default"].reducer,
    _module_fnNames_ = _ccContext$reducer._module_fnNames_,
    _caller = _ccContext$reducer._caller,
    refStore = _ccContext["default"].refStore,
    ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    getState = _ccContext["default"].store.getState,
    moduleName_ccClassKeys_ = _ccContext["default"].moduleName_ccClassKeys_;
var okeys = util.okeys,
    me = util.makeError,
    vbi = util.verboseInfo,
    safeGetArray = util.safeGetArray,
    safeGet = util.safeGet,
    justWarning = util.justWarning,
    isObjectNull = util.isObjectNull;
var idSeq = 0;

function getEId() {
  idSeq++;
  return Symbol("__autoGen_" + idSeq + "__");
}

var noop = function noop() {};

var eType = function eType(th) {
  return "type of defineEffect " + th + " param must be";
};

var getWatchedKeys = function getWatchedKeys(ctx) {
  if (ctx.watchedKeys === '-') {
    if (ctx.__$$renderStatus === _privConstant.START) return okeys(ctx.__$$compareWaKeys);else return okeys(ctx.__$$curWaKeys);
  } else return ctx.watchedKeys;
};

var getConnectWatchedKeys = function getConnectWatchedKeys(ctx, module) {
  var connect = ctx.connect,
      connectedModules = ctx.connectedModules;
  var isConnectArr = Array.isArray(connect);

  var getModuleWaKeys = function getModuleWaKeys(m) {
    if (ctx.__$$renderStatus === _privConstant.START) return okeys(ctx.__$$compareConnWaKeys[m]);else return okeys(ctx.__$$curConnWaKeys[m]);
  };

  var getWKeys = function getWKeys(module) {
    if (isConnectArr) {
      // auto observe connect modules
      return getModuleWaKeys(module);
    } else {
      var waKeys = connect[module];
      if (waKeys === '*') return moduleName_stateKeys_[module];else if (waKeys === '-') return getModuleWaKeys(module);else return waKeys;
    }
  };

  if (module) return getWKeys(module);else {
    var cKeys = {};
    connectedModules.forEach(function (m) {
      return cKeys[m] = getWKeys(m);
    });
    return cKeys;
  }
};

function recordDep(ccUniqueKey, module, watchedKeys) {
  var waKeys = watchedKeys === '*' ? moduleName_stateKeys_[module] : watchedKeys;
  waKeys.forEach(function (stateKey) {
    return (0, _wakeyUkeyMap.mapIns)(module, stateKey, ccUniqueKey);
  });
} //调用buildFragmentRefCtx 之前，props参数已被处理过

/**
 * 构建refCtx，附加到ref上
 * liteLevel 越小，绑定的方法越少
 */


function _default(ref, params, liteLevel) {
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
      insType = params.insType,
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
  var existedCtx = ref.ctx;
  var isCtxNull = isObjectNull(existedCtx); // 做个保护判断，防止 ctx = {}

  var modStateKeys = moduleName_stateKeys_[stateModule];
  var __boundSetState = ref.setState,
      __boundForceUpdate = ref.forceUpdate; // 如果已存在ctx，则直接指向原来的__bound，否则会造成无限递归调用栈溢出
  // 做个保护判断，防止 ctx = {}

  if (!isCtxNull && existedCtx.ccUniqueKey) {
    __boundSetState = existedCtx.__boundSetState;
    __boundForceUpdate = existedCtx.__boundForceUpdate;
  } else if (type !== _constant.CC_HOOK) {
    __boundSetState = ref.setState.bind(ref);
    __boundForceUpdate = ref.forceUpdate.bind(ref);
  }

  var refOption = {};
  refOption.persistStoredKeys = ccOption.persistStoredKeys === undefined ? persistStoredKeys : ccOption.persistStoredKeys;
  refOption.tag = ccOption.tag || tag; // pick ref defined tag first, register tag second

  var ccUniqueKey = (0, _computeCcUniqueKey["default"])(isSingle, ccClassKey, ccKey, refOption.tag);
  refOption.renderKey = ccOption.renderKey || ccUniqueKey; // 没有设定renderKey的话，默认ccUniqueKey就是renderKey

  refOption.storedKeys = (0, _getStoredKeys["default"])(state, modStateKeys, ccOption.storedKeys, storedKeys); //用户使用ccKey属性的话，必需显示的指定ccClassKey

  if (ccKey && !ccClassKey) {
    throw new Error("missing ccClassKey while init a cc ins with ccKey[" + ccKey + "]");
  }

  if (refOption.storedKeys.length > 0) {
    if (!ccKey) throw me(_constant.ERR.CC_STORED_KEYS_NEED_CCKEY, vbi("ccClassKey[" + ccClassKey + "]"));
  }

  var mstate = getState(module); // recover ref state

  var refStoredState = refStore._state[ccUniqueKey] || {};
  var mergedState = Object.assign({}, state, refStoredState, mstate);
  ref.state = mergedState;
  var stateKeys = okeys(mergedState);
  var classCtx = ccClassKey_ccClassContext_[ccClassKey];
  var classConnectedState = classCtx.connectedState;
  var connectedModules = okeys(connect);
  var connectedState = {}; // const moduleState = getState(module);

  var connectedComputed = {};
  connectedModules.forEach(function (m) {
    return connectedComputed[m] = (0, _makeCuRefObContainer["default"])(ref, m, false);
  });
  var moduleComputed = (0, _makeCuRefObContainer["default"])(ref, module);
  var globalComputed = (0, _makeCuRefObContainer["default"])(ref, _constant.MODULE_GLOBAL); // const globalState = getState(MODULE_GLOBAL);

  var globalState = (0, _makeObState["default"])(ref, getState(_constant.MODULE_GLOBAL), _constant.MODULE_GLOBAL, false); // extract privStateKeys

  var privStateKeys = util.removeArrElements(okeys(state), modStateKeys);
  var moduleState;
  if (stateModule === _constant.MODULE_GLOBAL) moduleState = globalState;else moduleState = (0, _makeObState["default"])(ref, mstate, module, true); // record ccClassKey

  var ccClassKeys = safeGetArray(moduleName_ccClassKeys_, module);
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

  var __$$onEvents = [];
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
  var refs = {}; // depDesc = {stateKey_retKeys_: {}, retKey_fn_:{}}
  // computedDep or watchDep  : { [module:string] : { stateKey_retKeys_: {}, retKey_fn_: {}, immediateRetKeys: [] } }

  var computedDep = {},
      watchDep = {};
  var props = (0, _getOutProps["default"])(ref.props);
  var ctx = {
    // static params
    type: type,
    insType: insType,
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
    connectedModules: connectedModules,
    // dynamic meta, I don't want user know these props, so put them in ctx instead of ref
    __$$onEvents: __$$onEvents,
    // 当组件还未挂载时，event中心会将事件存到__$$onEvents里，当组件挂载时检查的事件列表并执行，然后清空
    __$$hasModuleState: modStateKeys.length > 0,
    __$$renderStatus: _privConstant.END,
    __$$curWaKeys: {},
    __$$compareWaKeys: {},
    __$$compareWaKeyCount: 0,
    //write before render
    __$$nextCompareWaKeys: {},
    __$$nextCompareWaKeyCount: 0,
    __$$curConnWaKeys: {},
    __$$compareConnWaKeys: {},
    __$$compareConnWaKeyCount: {},
    __$$nextCompareConnWaKeys: {},
    __$$nextCompareConnWaKeyCount: {},
    __$$staticWaKeys: {},
    // 用于快速的去重记录
    __$$staticWaKeyList: [],
    // 在实例didMount时由__$$staticWaKeys计算得出，用于辅助清理依赖映射
    persistStoredKeys: refOption.persistStoredKeys,
    storedKeys: refOption.storedKeys,
    renderKey: refOption.renderKey,
    tag: refOption.tag,
    prevProps: props,
    props: props,
    //collected mapProps result
    mapped: {},
    prevState: mergedState,
    // state
    state: mergedState,
    moduleState: moduleState,
    mstate: mstate,
    //用于before-render里避免merge moduleState而导致的冗余触发get
    globalState: globalState,
    connectedState: connectedState,
    extra: {},
    // can pass value to extra in every render period
    staticExtra: {},
    // only can be assign value in setup block
    // computed result containers
    refComputed: {},
    // 有依赖收集行为的结果容器，此时还说一个普通对象，在beforeMount时会被替换
    refComputedValue: {},
    // 包裹了defineProperty后的结果容器
    refComputedOri: {},
    // 原始的计算结果容器，在beforeMount时对refComputedValue包裹defineProperty时，会用refComputedOri来存储refComputedValue的值
    moduleComputed: moduleComputed,
    globalComputed: globalComputed,
    connectedComputed: connectedComputed,
    moduleReducer: {},
    connectedReducer: {},
    reducer: {},
    // api meta data
    stateKeys: stateKeys,
    computedDep: computedDep,
    computedRetKeyFns: {},
    //不按模块分类，映射的cuRetKey_fn_
    watchDep: watchDep,
    watchRetKeyFns: {},
    //不按模块分类，映射的watchRetKey_fn_
    execute: null,
    effectMeta: effectMeta,
    retKey_fnUid_: {},
    // api
    reactSetState: noop,
    //等待重写
    __boundSetState: __boundSetState,
    reactForceUpdate: noop,
    //等待重写
    __boundForceUpdate: __boundForceUpdate,
    setState: setState,
    setModuleState: setModuleState,
    forceUpdate: forceUpdate,
    changeState: changeState,
    // not expose in d.ts
    refs: refs,
    useRef: function useRef(refName) {
      return function (ref) {
        return refs[refName] = {
          current: ref
        };
      }; // keep the same shape with hook useRef
    },
    // below only can be called by cc or updated by cc in existed period, not expose in d.ts
    __$$ccSetState: hf.makeCcSetStateHandler(ref),
    __$$ccForceUpdate: hf.makeCcForceUpdateHandler(ref),
    __$$settedList: [],
    //[{module:string, keys:string[]}, ...]
    __$$prevMoStateVer: {}
  };
  ref.setState = setState;
  ref.forceUpdate = forceUpdate; // allow user have a chance to define state in setup block;

  ctx.initState = function (initState) {
    // 已挂载则不让用户在调用initState
    if (ref.__$$isMounted) {
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
    var doSync = function doSync(e, val, rkey, delay, type) {
      var _sync$bind;

      if (typeof e === 'string') return _sync3["default"].bind(null, (_sync$bind = {}, _sync$bind[_constant.CCSYNC_KEY] = e, _sync$bind.type = type, _sync$bind.val = val, _sync$bind.delay = delay, _sync$bind.rkey = rkey, _sync$bind), ref);
      (0, _sync3["default"])({
        type: 'val'
      }, ref, e); //allow <input data-ccsync="foo/f1" onChange={ctx.sync} />
    };

    ctx.sync = function (e, val, rkey, delay) {
      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      return doSync(e, val, rkey, delay, 'val');
    };

    ctx.syncBool = function (e, val, rkey, delay) {
      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      return doSync(e, val, rkey, delay, 'bool');
    };

    ctx.syncInt = function (e, val, rkey, delay) {
      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      return doSync(e, val, rkey, delay, 'int');
    };

    ctx.syncAs = function (e, val, rkey, delay) {
      if (rkey === void 0) {
        rkey = '';
      }

      if (delay === void 0) {
        delay = -1;
      }

      return doSync(e, val, rkey, delay, 'as');
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

    ctx.on = function (inputEvent, handler) {
      //这里刻意赋默认值identity = null，表示on的是不带id认证的监听
      var _ev$getEventItem2 = ev.getEventItem(inputEvent),
          event = _ev$getEventItem2.name,
          _ev$getEventItem2$ide = _ev$getEventItem2.identity,
          identity = _ev$getEventItem2$ide === void 0 ? null : _ev$getEventItem2$ide;

      ev.bindEventHandlerToCcContext(stateModule, ccClassKey, ccUniqueKey, event, identity, handler);
    };
  }

  if (liteLevel > 4) {
    // level 5, assign enhance api
    ctx.execute = function (handler) {
      return ctx.execute = handler;
    };

    ctx.watch = (0, _getDefineWatchHandler["default"])(ctx);
    ctx.computed = (0, _getDefineComputedHandler["default"])(ctx);

    var makeEffectHandler = function makeEffectHandler(targetEffectItems, isProp) {
      return function (fn, depKeys, compare, immediate) {
        if (compare === void 0) {
          compare = true;
        }

        if (immediate === void 0) {
          immediate = true;
        }

        if (typeof fn !== 'function') throw new Error(eType('first') + " function");
        var _depKeys = depKeys; //对于effectProps 第三位参数就是immediate

        var _immediate = isProp ? compare : immediate; // depKeys 为null 和 undefined 表示无任何依赖，每一轮都执行的副作用


        if (depKeys !== null && depKeys !== undefined) {
          if (!Array.isArray(depKeys)) throw new Error(eType('second') + " one of them(array, null, undefined)");
        }

        var modDepKeys = null;

        if (!isProp && _depKeys) {
          modDepKeys = [];

          _depKeys.forEach(function (depKey) {
            var modDepKey;

            if (depKey.includes('/')) {
              modDepKey = depKey;

              var _depKey$split = depKey.split('/'),
                  m = _depKey$split[0];

              if (!ctx.connect[m]) {
                throw me(_constant.ERR.CC_MODULE_NOT_CONNECTED, vbi("depKey[" + depKey + "]"));
              }
            } else {
              // 这里要注意， 私有的key
              modDepKey = stateModule + "/" + depKey;
            }

            modDepKeys.push(modDepKey); // 先暂时保持起来，组件挂载时才映射依赖

            ctx.__$$staticWaKeys[modDepKey] = 1;
          });
        } // 对于effectProps来说是不会读取compare属性来用的


        var effectItem = {
          fn: fn,
          isProp: isProp,
          depKeys: _depKeys,
          modDepKeys: modDepKeys,
          eId: getEId(),
          compare: compare,
          immediate: _immediate
        };
        targetEffectItems.push(effectItem);
      };
    };

    ctx.effect = makeEffectHandler(effectItems, false);
    ctx.effectProps = makeEffectHandler(effectPropsItems, true);
  } // 构造完毕ctx后，开始创建reducer，和可观察connectedState


  var moduleReducer = ctx.moduleReducer,
      connectedReducer = ctx.connectedReducer,
      __$$curConnWaKeys = ctx.__$$curConnWaKeys,
      __$$compareConnWaKeys = ctx.__$$compareConnWaKeys,
      __$$compareConnWaKeyCount = ctx.__$$compareConnWaKeyCount,
      __$$nextCompareConnWaKeys = ctx.__$$nextCompareConnWaKeys,
      __$$nextCompareConnWaKeyCount = ctx.__$$nextCompareConnWaKeyCount;
  var allModules = connectedModules.slice();
  if (!allModules.includes(module)) allModules.push(module);else {
    justWarning("[" + ccUniqueKey + "]'s module[" + module + "] is in belongTo and connect both, it will cause redundant render.");
  }
  var __$$autoWatch = false; //向实例的reducer里绑定方法，key:{module} value:{reducerFn}
  //为了性能考虑，只绑定所属的模块和已连接的模块的reducer方法

  allModules.forEach(function (m) {
    var reducerObj;

    if (m === module) {
      reducerObj = moduleReducer;
    } else {
      // todo: 如果connectedReducer不在意调用者是谁，该属性可以删掉或者不用直接指向reducer，节省初始化refCtx的开销
      reducerObj = safeGet(connectedReducer, m);
    }

    var connectDesc = connect[m];

    if (connectDesc) {
      var mConnectedState = classConnectedState[m];

      if (connectDesc === '-') {
        // auto watch
        __$$autoWatch = true;
        __$$curConnWaKeys[m] = {};
        __$$compareConnWaKeys[m] = {};
        __$$compareConnWaKeyCount[m] = 0;
        __$$nextCompareConnWaKeys[m] = {};
        __$$nextCompareConnWaKeyCount[m] = 0;
        if (m === _constant.MODULE_GLOBAL) mConnectedState = ctx.globalState;else mConnectedState = (0, _makeObState["default"])(ref, mConnectedState, m);
      } // 非自动收集，这里就需要写入waKey_uKeyMap_来记录依赖关系了
      else {
          recordDep(ccUniqueKey, m, connectDesc);
        }

      connectedState[m] = mConnectedState;
    }

    var fnNames = _module_fnNames_[m] || [];
    fnNames.forEach(function (fnName) {
      reducerObj[fnName] = function (payload, rkeyOrOption, delay) {
        return dispatch(m + "/" + fnName, payload, rkeyOrOption, delay);
      };
    });
  });
  ctx.reducer = _caller; //alias

  ctx.mr = ctx.moduleReducer;
  ctx.cr = ctx.connectedReducer;
  ctx.r = ctx.reducer;

  if (watchedKeys === '-') {
    __$$autoWatch = true;
  } else {
    // 开始记录依赖
    recordDep(ccUniqueKey, module, watchedKeys);
  }

  ctx.__$$autoWatch = __$$autoWatch; // 始终优先取ref上指向的ctx，对于在热加载模式下的hook组件实例，那里面有的最近一次渲染收集的依赖信息才是正确的

  ctx.getWatchedKeys = function () {
    return getWatchedKeys(ref.ctx || ctx);
  };

  ctx.getConnectWatchedKeys = function (module) {
    return getConnectWatchedKeys(ref.ctx || ctx, module);
  };

  if (isCtxNull) ref.ctx = ctx; // 适配热加载或者异步渲染里, 需要清理ctx里运行时收集的相关数据，重新分配即可
  else {
      // 这里需要把第一次渲染期间已经收集好的依赖再次透传给ref.ctx
      var _ref$ctx = ref.ctx,
          __$$curWaKeys = _ref$ctx.__$$curWaKeys,
          __$$compareWaKeys = _ref$ctx.__$$compareWaKeys,
          __$$compareWaKeyCount = _ref$ctx.__$$compareWaKeyCount,
          __$$nextCompareWaKeys = _ref$ctx.__$$nextCompareWaKeys,
          __$$nextCompareWaKeyCount = _ref$ctx.__$$nextCompareWaKeyCount,
          _$$curConnWaKeys = _ref$ctx.__$$curConnWaKeys,
          _$$compareConnWaKeys = _ref$ctx.__$$compareConnWaKeys,
          _$$compareConnWaKeyCount = _ref$ctx.__$$compareConnWaKeyCount,
          _$$nextCompareConnWaKeys = _ref$ctx.__$$nextCompareConnWaKeys,
          _$$nextCompareConnWaKeyCount = _ref$ctx.__$$nextCompareConnWaKeyCount;
      Object.assign(ref.ctx, ctx, {
        __$$curWaKeys: __$$curWaKeys,
        __$$compareWaKeys: __$$compareWaKeys,
        __$$compareWaKeyCount: __$$compareWaKeyCount,
        __$$nextCompareWaKeys: __$$nextCompareWaKeys,
        __$$nextCompareWaKeyCount: __$$nextCompareWaKeyCount,
        __$$curConnWaKeys: _$$curConnWaKeys,
        __$$compareConnWaKeys: _$$compareConnWaKeys,
        __$$compareConnWaKeyCount: _$$compareConnWaKeyCount,
        __$$nextCompareConnWaKeys: _$$nextCompareConnWaKeys,
        __$$nextCompareConnWaKeyCount: _$$nextCompareConnWaKeyCount
      });
    }
}