"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _triggerSetupEffect = _interopRequireDefault(require("./trigger-setup-effect"));

var _setRef = _interopRequireDefault(require("../ref/set-ref"));

var _afterRender = _interopRequireDefault(require("../ref/after-render"));

var _util = require("../../support/util");

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

var _modueInsCountMap = _interopRequireDefault(require("../../cc-context/modue-ins-count-map"));

var _lifecycle2 = _interopRequireDefault(require("../../cc-context/lifecycle"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var ev = _interopRequireWildcard(require("../event"));

var _handlerFactory = require("../state/handler-factory");

var _constant = require("../../support/constant");

var _lifecycle = _lifecycle2["default"]._lifecycle,
    _mountedOnce = _lifecycle2["default"]._mountedOnce;
var getModuleVer = _ccContext["default"].store.getModuleVer;

function triggerLifecyleMounted(allModules, mstate) {
  var handleOneModule = function handleOneModule(m) {
    (0, _util.safeAdd)(_modueInsCountMap["default"], m, 1);
    var moduleLifecycle = _lifecycle[m];
    if (!moduleLifecycle) return;
    var mounted = moduleLifecycle.mounted;
    if (!mounted) return;
    if (_mountedOnce[m] === true) return;

    if (_modueInsCountMap["default"][m] == 1) {
      var once = mounted((0, _handlerFactory.makeModuleDispatcher)(m), mstate);
      _mountedOnce[m] = (0, _util.getVal)(once, true);
    }
  };

  allModules.forEach(handleOneModule);
}

function _default(ref) {
  (0, _afterRender["default"])(ref);
  ref.__$$ms = _constant.MOUNTED;
  var _ref$ctx = ref.ctx,
      ccUniqueKey = _ref$ctx.ccUniqueKey,
      __$$onEvents = _ref$ctx.__$$onEvents,
      __$$staticWaKeys = _ref$ctx.__$$staticWaKeys,
      module = _ref$ctx.module,
      allModules = _ref$ctx.allModules,
      __$$mstate = _ref$ctx.__$$mstate,
      __$$prevModuleVer = _ref$ctx.__$$prevModuleVer;
  (0, _setRef["default"])(ref); // 确保组件挂载时在绑定事件，以避免同一个组件(通常是function组件, 因为cursor问题)，
  // 走了 (1)mount ---> (2)mount ---> (1)unmount 时把2本来也要监听的事件清理掉
  // 同时本身来说，挂载好的组件监听事件才是安全的

  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(function (_ref) {
      var inputEvent = _ref.inputEvent,
          handler = _ref.handler;

      var _ev$getEventItem = ev.getEventItem(inputEvent),
          event = _ev$getEventItem.name,
          identity = _ev$getEventItem.identity;

      ev.bindEventHandlerToCcContext(module, ref.ctx.ccClassKey, ccUniqueKey, event, identity, handler);
    });

    __$$onEvents.length = 0;
  }

  var __$$staticWaKeyList = (0, _util.okeys)(__$$staticWaKeys); // 用于辅助记录依赖映射


  ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList; // 记录静态依赖

  __$$staticWaKeyList.forEach(function (modStateKey) {
    return (0, _wakeyUkeyMap.mapStaticInsM)(modStateKey, ccUniqueKey);
  });

  (0, _triggerSetupEffect["default"])(ref, true);
  triggerLifecyleMounted(allModules, __$$mstate); // 组件的didMount触发会在lifecycle.initState调用之后，此处版本可能已落后，需要自我刷新一下

  if (__$$prevModuleVer !== getModuleVer(module)) {
    ref.ctx.reactForceUpdate();
  }
}