"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var cache = _interopRequireWildcard(require("./_cache"));

var okeys = util.okeys;
var ccUKey_ref_ = _ccContext["default"].ccUKey_ref_,
    module_ccUKeys_ = _ccContext["default"].module_ccUKeys_,
    moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;

var getBelongWatchedKeys = function getBelongWatchedKeys(ctx) {
  if (ctx.watchedKeys === '-') return ctx.__$$preparedWatchedKeys;else return ctx.watchedKeys;
};

var getConnectWatchedKeys = function getConnectWatchedKeys(ctx, module) {
  var connect = ctx.connect;

  if (Array.isArray(connect)) {
    // auto observe connect modules
    return ctx.__$$preparedModuleWatchedKeys_[module];
  } else {
    var waKeys = connect[module];
    if (waKeys === '*') return moduleName_stateKeys_[module];else if (waKeys === '-') return ctx.__$$preparedModuleWatchedKeys_[module];else return waKeys;
  }
};

function _default(moduleName, partialSharedState, renderKey, renderKeyClasses) {
  var _module_ccUKeys_$modu = module_ccUKeys_[moduleName],
      ver = _module_ccUKeys_$modu.ver,
      keys = _module_ccUKeys_$modu.keys;
  var sharedStateKeys = okeys(partialSharedState);
  var cacheKey = cache.getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses);
  var cachedResult = cache.getCache(moduleName, cacheKey);

  if (cachedResult) {
    if (cachedResult.ver === ver) {
      // console.log(`%c hit cache`, 'color:red');
      // console.log(cachedResult.result);
      return {
        sharedStateKeys: sharedStateKeys,
        result: cachedResult.result
      };
    } else {
      cache.setCache(moduleName, cacheKey, null);
    }
  }

  var sharedStateKeyMap = sharedStateKeys.reduce(function (map, curKey) {
    map[curKey] = 1;
    return map;
  }, {});
  var belongRefs = [];
  var connectRefs = [];

  var putRef = function putRef(isBelong, ref) {
    isBelong ? belongRefs.push(ref) : connectRefs.push(ref);
  };

  var tryMatch = function tryMatch(ref, preparedWatchedKeys, toBelong) {
    var len = preparedWatchedKeys.length;
    var _ref$ctx = ref.ctx,
        refRenderKey = _ref$ctx.renderKey,
        refCcClassKey = _ref$ctx.ccClassKey;

    for (var i = 0; i < len; i++) {
      var watchedKey = preparedWatchedKeys[i]; //命中一个观察Key即可跳出

      if (sharedStateKeyMap[watchedKey]) {
        // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新
        if (renderKey) {
          var isRenderKeyMatched = refRenderKey === renderKey; // 所有的类实例都受renderKey匹配机制影响

          if (renderKeyClasses === '*') {
            if (isRenderKeyMatched) {
              putRef(toBelong, ref);
              break;
            }
          } else {
            // 这些指定类实例受renderKey机制影响
            if (renderKeyClasses.includes(refCcClassKey)) {
              if (isRenderKeyMatched) {
                putRef(toBelong, ref);
                break;
              }
            } // 这些实例则不受renderKey机制影响
            else {
                putRef(toBelong, ref);
                break;
              }
          }
        } else {
          putRef(toBelong, ref);
          break;
        }
      }
    }
  };

  keys.forEach(function (key) {
    var ref = ccUKey_ref_[key];
    if (!ref) return;
    var refCtx = ref.ctx;
    var refModule = refCtx.module,
        refConnect = refCtx.connect;
    var isBelong = refModule === moduleName;
    var isConnect = refConnect[moduleName] ? true : false;

    if (isBelong) {
      tryMatch(ref, getBelongWatchedKeys(refCtx), true);
    } // 一个实例可能既属于也连接了某个某个模块，这是不推荐的，在buildCtx里面已给出警告
    // 会造成冗余的渲染


    if (isConnect) {
      tryMatch(ref, getConnectWatchedKeys(refCtx, moduleName), false);
    }
  });
  var result = {
    belong: belongRefs,
    connect: connectRefs
  };
  cache.setCache(moduleName, cacheKey, {
    ver: ver,
    result: result
  });
  return {
    sharedStateKeys: sharedStateKeys,
    result: result
  };
}