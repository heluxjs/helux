"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.appendGlobalState = appendGlobalState;
exports.configStoreState = configStoreState;
exports.configRootReducer = configRootReducer;
exports.configRootComputed = configRootComputed;
exports.configRootWatch = configRootWatch;
exports.executeRootInit = executeRootInit;
exports.configSharedToGlobalMapping = configSharedToGlobalMapping;
exports.configModuleSingleClass = configModuleSingleClass;
exports.configMiddlewares = configMiddlewares;
exports.configPlugins = configPlugins;
exports["default"] = void 0;

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var _handleModuleSharedToGlobalMapping = _interopRequireDefault(require("./handle-module-shared-to-global-mapping"));

var _initModuleState = _interopRequireDefault(require("../state/init-module-state"));

var _makeSetStateHandler = _interopRequireDefault(require("../state/make-set-state-handler"));

var _initModuleReducer = _interopRequireDefault(require("../reducer/init-module-reducer"));

var _initModuleWatch = _interopRequireDefault(require("../watch/init-module-watch"));

var _initModuleComputed = _interopRequireDefault(require("../computed/init-module-computed"));

var _co = _interopRequireDefault(require("co"));

var _configure = _interopRequireDefault(require("../../api/configure"));

var isPlainJsonObject = util.isPlainJsonObject,
    okeys = util.okeys;
var getState = _ccContext["default"].store.getState;
/** 对已有的store.$$global状态追加新的state */

function appendGlobalState(globalState) {// todo
}

function configStoreState(storeState) {
  var sharedToGlobalMapping = _ccContext["default"].sharedToGlobalMapping;

  if (!isPlainJsonObject(storeState)) {
    throw new Error("the storeState is not a plain json object!");
  }

  var globalStateKeys = _ccContext["default"].globalStateKeys,
      pureGlobalStateKeys = _ccContext["default"].pureGlobalStateKeys,
      store = _ccContext["default"].store;
  store.initStateDangerously(_constant.MODULE_CC, {});
  if (storeState[_constant.MODULE_GLOBAL] === undefined) storeState[_constant.MODULE_GLOBAL] = {};
  if (storeState[_constant.MODULE_DEFAULT] === undefined) storeState[_constant.MODULE_DEFAULT] = {};
  var moduleNames = okeys(storeState);
  var len = moduleNames.length;

  for (var i = 0; i < len; i++) {
    var moduleName = moduleNames[i];
    var moduleState = storeState[moduleName];
    (0, _initModuleState["default"])(moduleName, moduleState);
    var sharedKey_globalKey_ = sharedToGlobalMapping[moduleName];

    if (sharedKey_globalKey_) {
      (0, _handleModuleSharedToGlobalMapping["default"])(moduleName, sharedKey_globalKey_);
    }
  }

  var globalMappingKey_sharedKey_ = _ccContext["default"].globalMappingKey_sharedKey_;
  globalStateKeys.reduce(function (pKeys, gKey) {
    if (!globalMappingKey_sharedKey_[gKey]) pKeys.push(gKey);
    return pKeys;
  }, pureGlobalStateKeys);
}
/**
 * 
 * @param {{[reducerModuleName:string]:{[reducerFnType:string]:function}}} rootReducer 
 */


function configRootReducer(rootReducer) {
  var moduleNames = okeys(rootReducer);
  if (rootReducer[_constant.MODULE_DEFAULT] === undefined) rootReducer[_constant.MODULE_DEFAULT] = {};
  if (rootReducer[_constant.MODULE_GLOBAL] === undefined) rootReducer[_constant.MODULE_GLOBAL] = {};
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
      (0, _co["default"])(initFn).then(function (state) {
        (0, _makeSetStateHandler["default"])(moduleName)(state);
      });
    }
  });
  _ccContext["default"].init._init = init;
}

function configSharedToGlobalMapping(sharedToGlobalMapping) {
  if (!isPlainJsonObject(sharedToGlobalMapping)) {
    throw new Error("StartupOption.sharedToGlobalMapping is not a plain json object!");
  }

  util.safeAssignObjectValue(_ccContext["default"].sharedToGlobalMapping, sharedToGlobalMapping);
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

    var moduleNames = okeys(_ccContext["default"].moduleName_stateKeys_);
    plugins.forEach(function (p) {
      ccPlugins.push(p);

      if (p.configure) {
        var conf = p.configure();
        p.name = conf.module;
        (0, _configure["default"])(conf.module, conf);
        moduleNames.forEach(function (m) {
          if (p.writeModuleState) {
            p.writeModuleState(conf.state, m);
          }
        });
      } else {
        throw new Error('a plugin must export configure handler!');
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
  configSharedToGlobalMapping: configSharedToGlobalMapping,
  configModuleSingleClass: configModuleSingleClass,
  configMiddlewares: configMiddlewares,
  configPlugins: configPlugins
};
exports["default"] = _default;