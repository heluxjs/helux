"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _pickDepFns2 = _interopRequireDefault(require("../base/pick-dep-fns"));

var isPlainJsonObject = util.isPlainJsonObject,
    executeCompOrWatch = util.executeCompOrWatch,
    makeCommitHandler = util.makeCommitHandler;
var callInfo = {
  payload: null,
  renderKey: '',
  delay: -1
};
/**
 * 设置watch值，过滤掉一些无效的key
 */

function _default(module, moduleWatch, append) {
  if (append === void 0) {
    append = false;
  }

  if (!isPlainJsonObject(moduleWatch)) {
    throw new Error("StartUpOption.watch." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "watch." + module + " is invalid");

  var rootWatchDep = _ccContext["default"].watch.getRootWatchDep();

  var rootWatchRaw = _ccContext["default"].watch.getRootWatchRaw();

  if (append) {
    var ori = rootWatchRaw[module];
    if (ori) Object.assign(ori, moduleWatch);else rootWatchRaw[module] = moduleWatch;
  } else {
    rootWatchRaw[module] = moduleWatch;
  }

  var getState = _ccContext["default"].store.getState;
  var moduleState = getState(module);
  (0, _configureDepFns["default"])(_constant.CATE_MODULE, {
    module: module,
    state: moduleState,
    dep: rootWatchDep
  }, moduleWatch);

  var _pickDepFns = (0, _pickDepFns2["default"])(true, _constant.CATE_MODULE, 'watch', rootWatchDep, module, moduleState, moduleState),
      pickedFns = _pickDepFns.pickedFns,
      setted = _pickDepFns.setted,
      changed = _pickDepFns.changed;

  if (_pickDepFns2["default"].length) {
    var d = _ccContext["default"].getDispatcher();

    var _makeCommitHandler = makeCommitHandler(module, d && d.ctx.changeState, callInfo),
        commit = _makeCommitHandler.commit,
        flush = _makeCommitHandler.flush;

    pickedFns.forEach(function (_ref) {
      var retKey = _ref.retKey,
          fn = _ref.fn,
          depKeys = _ref.depKeys;
      var fnCtx = {
        retKey: retKey,
        payload: null,
        isFirstCall: true,
        commit: commit,
        setted: setted,
        changed: changed,
        stateModule: module,
        refModule: null,
        oldState: moduleState,
        committedState: moduleState,
        refCtx: null
      };
      executeCompOrWatch(retKey, depKeys, fn, moduleState, moduleState, fnCtx);
    });
    flush();
  }
}