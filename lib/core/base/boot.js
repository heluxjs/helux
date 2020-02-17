"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.configStoreState = configStoreState;
exports.configRootReducer = configRootReducer;
exports.configRootComputed = configRootComputed;
exports.configRootWatch = configRootWatch;
exports.executeRootInit = executeRootInit;
exports.configModuleSingleClass = configModuleSingleClass;
exports.configMiddlewares = configMiddlewares;
exports.configPlugins = configPlugins;
exports["default"] = void 0;

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var _initModuleState = _interopRequireDefault(require("../state/init-module-state"));

var _handlerFactory = require("../state/handler-factory");

var _initModuleReducer = _interopRequireDefault(require("../reducer/init-module-reducer"));

var _initModuleWatch = _interopRequireDefault(require("../watch/init-module-watch"));

var _initModuleComputed = _interopRequireDefault(require("../computed/init-module-computed"));

var _plugin = require("../plugin");

var isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys;
/** 对已有的store.$$global状态追加新的state */
// export function appendGlobalState(globalState) {
//   // todo
// }

function configStoreState(storeState) {
  storeState[_constant.MODULE_VOID] = {}; //force MODULE_VOID state as {}

  if (!isPlainJsonObject(storeState)) {
    throw new Error("the storeState is not a plain json object!");
  }

  var store = _ccContext["default"].store;
  store.initStateDangerously(_constant.MODULE_CC, {});
  if (storeState[_constant.MODULE_GLOBAL] === undefined) storeState[_constant.MODULE_GLOBAL] = {};
  if (storeState[_constant.MODULE_DEFAULT] === undefined) storeState[_constant.MODULE_DEFAULT] = {};
  var moduleNames = okeys(storeState);
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    var moduleState = storeState[moduleName];
    (0, _initModuleState["default"])(moduleName, moduleState);
  }
}
/**
 * 
 * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */


function configRootReducer(rootReducer) {
  if (rootReducer[_constant.MODULE_DEFAULT] === undefined) rootReducer[_constant.MODULE_DEFAULT] = {};
  if (rootReducer[_constant.MODULE_GLOBAL] === undefined) rootReducer[_constant.MODULE_GLOBAL] = {};
  var moduleNames = okeys(rootReducer);
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    (0, _initModuleReducer["default"])(moduleName, rootReducer[moduleName]);
  }
}

function configRootComputed(computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed is not a plain json object!");
  }

  var moduleNames = okeys(computed);
  moduleNames.forEach(function (m) {
    return (0, _initModuleComputed["default"])(m, computed[m]);
  });
}

function configRootWatch(watch) {
  if (!isPlainJsonObject(watch)) {
    throw new Error("StartUpOption.watch is not a plain json object!");
  }

  var moduleNames = Object.keys(watch);
  moduleNames.forEach(function (m) {
    return (0, _initModuleWatch["default"])(m, watch[m]);
  });
}

function executeRootInit(init) {
  if (!init) return;

  if (!isPlainJsonObject(init)) {
    throw new Error('StartupOption.init is valid, it must be a object like {[module:string]:Function}!');
  }

  var moduleNames = okeys(init);
  moduleNames.forEach(function (moduleName) {
    checker.checkModuleName(moduleName, false, "there is no module state defined in store for init." + moduleName);
    var initFn = init[moduleName];

    if (initFn) {
      Promise.resolve().then(initFn).then(function (state) {
        (0, _handlerFactory.makeSetStateHandler)(moduleName)(state);
      });
    }
  });
  _ccContext["default"].init._init = init;
}

function configModuleSingleClass(moduleSingleClass) {
  if (!isPlainJsonObject(moduleSingleClass)) {
    throw new Error("StartupOption.moduleSingleClass is not a plain json object!");
  }

  util.safeAssignObjectValue(_ccContext["default"].moduleSingleClass, moduleSingleClass);
}

function configMiddlewares(middlewares) {
  if (middlewares.length > 0) {
    var ccMiddlewares = _ccContext["default"].middlewares;
    ccMiddlewares.length = 0; //防止热加载重复多次载入middlewares

    middlewares.forEach(function (m) {
      return ccMiddlewares.push(m);
    });
  }
}

function configPlugins(plugins) {
  if (plugins.length > 0) {
    var ccPlugins = _ccContext["default"].plugins;
    ccPlugins.length = 0; //防止热加载重复多次载入plugins

    (0, _plugin.clearCbs)(); //清理掉已映射好的插件回调

    var pluginNameMap = {};
    plugins.forEach(function (p) {
      ccPlugins.push(p);

      if (p.install) {
        var pluginInfo = p.install(_plugin.on);
        var e = new Error('plugin.install must return result:{name:string, options?:object}');
        if (!pluginInfo) throw e;
        var pluginName = pluginInfo.name;
        if (!pluginName) throw e;
        if (pluginNameMap[pluginName]) throw new Error("pluginName[" + pluginName + "] duplicate");
        pluginNameMap[pluginName] = 1;
      } else {
        throw new Error('a plugin must export install handler!');
      }
    });
  }
}

var _default = {
  configStoreState: configStoreState,
  configRootReducer: configRootReducer,
  configRootComputed: configRootComputed,
  configRootWatch: configRootWatch,
  executeRootInit: executeRootInit,
  configModuleSingleClass: configModuleSingleClass,
  configMiddlewares: configMiddlewares,
  configPlugins: configPlugins
};
exports["default"] = _default;