"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../support/util");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pickDepFns = require("../core/base/pick-dep-fns");

var _constant = require("../support/constant");

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

var _createDispatcher = _interopRequireDefault(require("./create-dispatcher"));

var _appendDispatcher = _interopRequireDefault(require("../core/base/append-dispatcher"));

var justCalledByStartUp = false;
/**
  CodeSandbox ide里，当runConcent.js单独放置时，代码结构如下
    import React, { Component } from "react";
    import ReactDom from "react-dom";
    import "./runConcent";
    import App from "./App";
    import { clearContextIfHot } from "concent";

    clearContextIfHot();
    ReactDom.render(<App />, document.getElementById("root"));
 * 
 * 如果只修改了其他地方的代码属于App相关依赖的代码，查看dom结构返现热加载直接将dispatcher div标签丢弃，
 * 同时refs里也没有dispatcher引用了，这里做一次额外检查
 */

function _checkDispatcher() {
  if (!_ccContext["default"].refs[_constant.CC_DISPATCHER]) {
    var Dispatcher = (0, _createDispatcher["default"])();
    (0, _appendDispatcher["default"])(Dispatcher);
  }
}

function _clearInsAssociation(recomputed) {
  (0, _util.clearObject)(_ccContext["default"].event_handlers_);
  (0, _util.clearObject)(_ccContext["default"].ccUKey_handlerKeys_);
  (0, _util.clearObject)(_ccContext["default"].renderKey_ccUkeys_);
  var cct = _ccContext["default"].ccClassKey_ccClassContext_;
  Object.keys(cct).forEach(function (ccClassKey) {
    var ctx = cct[ccClassKey];
    (0, _util.clearObject)(ctx.ccKeys);
  });
  (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
  (0, _util.clearObject)(_ccContext["default"].ccUkey_ref_, [_constant.CC_DISPATCHER]);
  (0, _util.clearObject)(_ccContext["default"].refs, [_constant.CC_DISPATCHER]);

  if (recomputed) {
    var rootState = _ccContext["default"].store._state;
    var computedValue = _ccContext["default"].computed._computedValue;
    var modules = (0, _util.okeys)(rootState);
    modules.forEach(function (m) {
      if (m === _constant.MODULE_CC) return; //进入recomputed逻辑，不需要配置dep依赖了

      if (computedValue[m]) (0, _initModuleComputed["default"])(m, computedValue[m], false, false);
    });
  }
}

function _clearAll(recomputed) {
  if (recomputed === void 0) {
    recomputed = false;
  }

  (0, _util.clearObject)(_ccContext["default"].globalStateKeys);
  (0, _util.clearObject)(_ccContext["default"].reducer._reducer);
  (0, _util.clearObject)(_ccContext["default"].store._state, [_constant.MODULE_DEFAULT, _constant.MODULE_CC, _constant.MODULE_GLOBAL, _constant.MODULE_CC_ROUTER], {});
  (0, _util.clearObject)(_ccContext["default"].computed._computedDep);
  (0, _util.clearObject)(_ccContext["default"].computed._computedValue);
  (0, _util.clearObject)(_ccContext["default"].watch._watchDep);
  (0, _util.clearObject)(_ccContext["default"].middlewares);
  (0, _pickDepFns.clearCachedData)();

  _clearInsAssociation(recomputed);
}

function _prepareClear(cb) {
  if (_ccContext["default"].isCcAlreadyStartup) {
    if (_ccContext["default"].isHotReloadMode()) {
      cb();
    } else {
      console.warn("clear failed because of not running under hot reload mode!");
    }
  } else {
    //还没有启动过，泽只是标记justCalledByStartUp为true
    justCalledByStartUp = true;
  }
}

function _default(clearAll, warningErrForClearAll) {
  if (clearAll === void 0) {
    clearAll = false;
  }

  _prepareClear(function () {
    if (clearAll) {
      justCalledByStartUp = true;

      _clearAll();

      console.warn(warningErrForClearAll);
    } else {
      // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
      // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命名单独放置在一个脚本里，
      // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
      // runConcent调用清理把justCalledByStartUp置为true，则renderApp就可以不用执行了
      // 随后只是改了某个component文件时，则只会触发 renderApp，
      // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
      if (justCalledByStartUp) {
        justCalledByStartUp = false;
        return;
      }

      console.warn("attention: method[clearContextIfHot] need been invoked before your app rendered!");

      _checkDispatcher(); // !!!重计算各个模块的computed结果


      _clearInsAssociation(true);
    }
  });
}