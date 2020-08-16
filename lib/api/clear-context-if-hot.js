"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../support/util");

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _pickDepFns = require("../core/base/pick-dep-fns");

var _setRef = require("../core/ref/set-ref");

var _constant = require("../support/constant");

var _initModuleComputed = _interopRequireDefault(require("../core/computed/init-module-computed"));

var _findDepFnsToExecute = require("../core/base/find-dep-fns-to-execute");

var _initModuleWatch = _interopRequireDefault(require("../core/watch/init-module-watch"));

var justCalledByStartUp = false;

function _clearInsAssociation(recomputed, otherExcludeKeys) {
  if (recomputed === void 0) {
    recomputed = false;
  }

  (0, _findDepFnsToExecute.clearCuRefer)();
  (0, _setRef.clearCount)();
  (0, _util.clearObject)(_ccContext["default"].event_handlers_);
  (0, _util.clearObject)(_ccContext["default"].ccUKey_handlerKeys_);
  var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;
  (0, _util.clearObject)(_ccContext["default"].handlerKey_handler_);
  (0, _util.clearObject)(ccUKey_ref_, otherExcludeKeys); // 此处故意设置和原来的版本相差几位的数字，
  // 防止resetClassInsUI调用时类组件实例的版本和模块是相同的
  // 导致ui更新未同步到store最新数据

  var _ccContext$store = _ccContext["default"].store,
      getModuleVer = _ccContext$store.getModuleVer,
      incModuleVer = _ccContext$store.incModuleVer,
      replaceMV = _ccContext$store.replaceMV;
  var moduleVer = getModuleVer();
  (0, _util.okeys)(moduleVer).forEach(function (m) {
    var curVer = moduleVer[m];
    incModuleVer(m, curVer > 5 ? 1 : 6);
  }); // 用于还原_moduleVer，在resetClassInsUI回调里_moduleVer又变为了 所有的模块版本值为1的奇怪现象.
  // 全局有没有找到重置_moduleVer的地方.

  var lockedMV = JSON.parse(JSON.stringify(moduleVer));

  if (recomputed) {
    var computed = _ccContext["default"].computed,
        watch = _ccContext["default"].watch;
    var computedValue = computed._computedValue;
    var watchDep = watch._watchDep;
    var modules = (0, _util.okeys)(_ccContext["default"].store._state);
    modules.forEach(function (m) {
      if (m === _constant.MODULE_CC) return;

      if (computedValue[m]) {
        // !!!先清除之前建立好的依赖关系
        _ccContext["default"].computed._computedDep[m] = (0, _util.makeCuDepDesc)();
        (0, _initModuleComputed["default"])(m, computed._computedRaw[m]);
      }

      if (watchDep[m]) {
        // !!!先清除之前建立好的依赖关系
        watchDep[m] = (0, _util.makeCuDepDesc)();
        (0, _initModuleWatch["default"])(m, watch._watchRaw[m]);
      }
    });
  } // resetClassInsUI


  return function () {
    // 安排在下一个循环自我刷新
    setTimeout(function () {
      replaceMV(lockedMV);
      otherExcludeKeys.forEach(function (key) {
        var ref = ccUKey_ref_[key];
        ref && ref.ctx.reactForceUpdate();
      });
    }, 0);
  };
}

function _pickNonCustomizeIns() {
  var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_;
  var ccFragKeys = [];
  var ccClassInsKeys = [];
  (0, _util.okeys)(ccUKey_ref_).forEach(function (refKey) {
    var ref = ccUKey_ref_[refKey];

    if (ref && ref.__$$ms === _constant.MOUNTED) {
      var type = ref.ctx.type;
      if (type === _constant.CC_CLASS) ccClassInsKeys.push(refKey);
    }
  });
  return {
    ccFragKeys: ccFragKeys,
    ccClassInsKeys: ccClassInsKeys
  };
}

function _clearAll() {
  (0, _util.clearObject)(_ccContext["default"].globalStateKeys); // 在codesandbox里，按标准模式组织的代码，如果只是修改了runConcent里相关联的代码，pages目录下的configure调用不会被再次触发的
  // 所以是来自configure调用配置的模块则不参与清理，防止报错

  var toExcludedModules = (0, _util.okeys)(_ccContext["default"].moduleName_isConfigured_).concat([_constant.MODULE_DEFAULT, _constant.MODULE_CC, _constant.MODULE_GLOBAL, _constant.MODULE_CC_ROUTER]);
  (0, _util.clearObject)(_ccContext["default"].reducer._reducer, toExcludedModules);
  (0, _util.clearObject)(_ccContext["default"].store._state, toExcludedModules, {}, true);
  (0, _util.clearObject)(_ccContext["default"].computed._computedDep, toExcludedModules);
  (0, _util.clearObject)(_ccContext["default"].computed._computedValue, toExcludedModules);
  (0, _util.clearObject)(_ccContext["default"].watch._watchDep, toExcludedModules);
  (0, _util.clearObject)(_ccContext["default"].middlewares); // class组件实例的依赖要保留，因为它的ref不再被清除（不像function组件那样能在热重载期间能够再次触发unmount和mount）

  var waKey_uKeyMap_ = _ccContext["default"].waKey_uKeyMap_;
  (0, _util.okeys)(waKey_uKeyMap_).forEach(function (waKey) {
    var uKeyMap = waKey_uKeyMap_[waKey];
    var newUKeyMap = {};
    (0, _util.okeys)(uKeyMap).forEach(function (uKey) {
      if (uKey.startsWith(_constant.CC_CLASS)) {
        newUKeyMap[uKey] = uKeyMap[uKey];
      }
    });
    waKey_uKeyMap_[waKey] = newUKeyMap;
  });
  (0, _util.clearObject)(_ccContext["default"].lifecycle._mountedOnce);
  (0, _util.clearObject)(_ccContext["default"].lifecycle._willUnmountOnce);
  (0, _util.clearObject)(_ccContext["default"].module_insCount_, [], 0);
  (0, _pickDepFns.clearCachedData)();

  var _pickNonCustomizeIns2 = _pickNonCustomizeIns(),
      ccClassInsKeys = _pickNonCustomizeIns2.ccClassInsKeys;

  return _clearInsAssociation(false, ccClassInsKeys);
}

function _default(clearAll) {
  if (clearAll === void 0) {
    clearAll = false;
  }

  _ccContext["default"].info.latestStartupTime = Date.now(); // 热加载模式下，这些CcFragIns随后需要被恢复
  // let ccFragKeys = [];

  var noop = function noop() {};

  if (_ccContext["default"].isStartup) {
    if (_ccContext["default"].isHotReloadMode()) {
      if (clearAll) {
        console.warn("attention: make sure [[clearContextIfHot]] been called before app rendered!");
        justCalledByStartUp = true;
        return _clearAll(clearAll); // return ccFragKeys;
      } else {
        // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
        // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命令单独放置在一个脚本里，
        // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
        // runConcent调用清理把justCalledByStartUp置为true，则renderApp这里再次触发clear时就可以不用执行了(注意确保renderApp之前，调用了clearContextIfHot)
        // 而随后只是改了某个component文件时，则只会触发 renderApp，
        // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
        if (justCalledByStartUp) {
          justCalledByStartUp = false;
          return noop;
        }

        var ret = _pickNonCustomizeIns(); // !!!重计算各个模块的computed结果


        return _clearInsAssociation(_ccContext["default"].reComputed, ret.ccClassInsKeys);
      }
    } else {
      console.warn("clear failed because of not running under hot reload mode!");
      return noop;
    }
  } else {
    //还没有启动过，泽只是标记justCalledByStartUp为true
    justCalledByStartUp = true;
    return noop;
  }
}