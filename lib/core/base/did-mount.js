"use strict";

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

var _handlerFactory = require("../state/handler-factory");

var _lifecycle = _lifecycle2["default"]._lifecycle,
    _mountedOnce = _lifecycle2["default"]._mountedOnce;
var getModuleVer = _ccContext["default"].store.getModuleVer;

function _default(ref) {
  (0, _afterRender["default"])(ref);
  ref.__$$isMounted = true;
  ref.__$$isUnmounted = false;
  var _ref$ctx = ref.ctx,
      ccUniqueKey = _ref$ctx.ccUniqueKey,
      __$$onEvents = _ref$ctx.__$$onEvents,
      __$$staticWaKeys = _ref$ctx.__$$staticWaKeys,
      module = _ref$ctx.module,
      __$$mstate = _ref$ctx.__$$mstate,
      __$$prevModuleVer = _ref$ctx.__$$prevModuleVer;
  (0, _setRef["default"])(ref);

  var __$$staticWaKeyList = (0, _util.okeys)(__$$staticWaKeys); // 用于辅助记录依赖映射


  ref.ctx.__$$staticWaKeyList = __$$staticWaKeyList; // 记录静态依赖

  __$$staticWaKeyList.forEach(function (modStateKey) {
    return (0, _wakeyUkeyMap.mapStaticInsM)(modStateKey, ccUniqueKey);
  }); // 这些事件是组件还未挂载时，就派发过来的，延迟到此刻执行，同时清空


  if (__$$onEvents.length > 0) {
    __$$onEvents.forEach(function (_ref) {
      var fn = _ref.fn,
          args = _ref.args;
      return fn.apply(void 0, args);
    });

    __$$onEvents.length = 0;
  }

  (0, _triggerSetupEffect["default"])(ref, true);
  (0, _util.safeAdd)(_modueInsCountMap["default"], module, 1);

  if (_lifecycle[module].mounted) {
    // mounted可执行多次
    if (_mountedOnce[module] !== true && _modueInsCountMap["default"][module] == 1) {
      var once = _lifecycle[module].mounted((0, _handlerFactory.makeModuleDispatcher)(module), __$$mstate);

      _mountedOnce[module] = (0, _util.getVal)(once, true);
    }
  } // 组件的didMount触发会在lifecycle.initState调用之后，此处版本可能已落后，需要自我刷新一下


  if (__$$prevModuleVer !== getModuleVer(module)) {
    ref.ctx.reactForceUpdate();
  }
}