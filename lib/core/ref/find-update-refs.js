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
    waKey_uKeyMap_ = _ccContext["default"].waKey_uKeyMap_,
    waKey_staticUKeyMap_ = _ccContext["default"].waKey_staticUKeyMap_;

function _default(moduleName, partialSharedState, renderKeys, renderKeyClasses) {
  var sharedStateKeys = okeys(partialSharedState);
  var cacheKey = cache.getCacheKey(moduleName, sharedStateKeys, renderKeys, renderKeyClasses);
  var cachedResult = cache.getCache(moduleName, cacheKey);

  if (cachedResult) {
    return {
      sharedStateKeys: sharedStateKeys,
      result: cachedResult
    };
  }

  var targetUKeyMap = {};
  var belongRefKeys = [];
  var connectRefKeys = [];
  sharedStateKeys.forEach(function (stateKey) {
    var waKey = moduleName + "/" + stateKey; // 利用assign不停的去重

    Object.assign(targetUKeyMap, waKey_uKeyMap_[waKey], waKey_staticUKeyMap_[waKey]);
  });
  var uKeys = okeys(targetUKeyMap);

  var putRef = function putRef(isBelong, ccUniqueKey) {
    isBelong ? belongRefKeys.push(ccUniqueKey) : connectRefKeys.push(ccUniqueKey);
  };

  var tryMatch = function tryMatch(ref, toBelong) {
    var _ref$ctx = ref.ctx,
        refRenderKey = _ref$ctx.renderKey,
        refCcClassKey = _ref$ctx.ccClassKey,
        ccUniqueKey = _ref$ctx.ccUniqueKey; // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新

    if (renderKeys.length) {
      var isRenderKeyMatched = renderKeys.includes(refRenderKey); // 所有的类实例都受renderKey匹配机制影响

      if (renderKeyClasses === '*') {
        if (isRenderKeyMatched) {
          putRef(toBelong, ccUniqueKey);
        }
      } else {
        // 这些指定类实例受renderKey机制影响
        if (renderKeyClasses.includes(refCcClassKey)) {
          if (isRenderKeyMatched) {
            putRef(toBelong, ccUniqueKey);
          }
        } // 这些实例则不受renderKey机制影响
        else {
            putRef(toBelong, ccUniqueKey);
          }
      }
    } else {
      putRef(toBelong, ccUniqueKey);
    }
  };

  var missRef = false;
  uKeys.forEach(function (key) {
    var ref = ccUKey_ref_[key];

    if (!ref) {
      missRef = true;
      return;
    }

    var refCtx = ref.ctx;
    var refModule = refCtx.module,
        refConnect = refCtx.connect;
    var isBelong = refModule === moduleName;
    var isConnect = refConnect[moduleName] ? true : false;

    if (isBelong) {
      tryMatch(ref, true);
    } // 一个实例如果既属于模块x同时也连接了模块x，这是不推荐的，在buildCtx里面已给出警告
    // 会造成冗余的渲染


    if (isConnect) {
      tryMatch(ref, false);
    }
  });
  var result = {
    belong: belongRefKeys,
    connect: connectRefKeys
  }; // 没有miss的ref才存缓存，防止直接标记了watchedKeys的实例此时还没有记录ref，
  // 但是此时刚好有变更状态的命令的话，如果这里缓存了查询结果，这这个实例挂上后，没有机会响应状态变更了

  if (!missRef) {
    cache.setCache(moduleName, cacheKey, result);
  }

  return {
    sharedStateKeys: sharedStateKeys,
    result: result
  };
}