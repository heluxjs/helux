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
    waKey_uKeyMap_ = _ccContext["default"].waKey_uKeyMap_;

function _default(moduleName, partialSharedState, renderKey, renderKeyClasses) {
  var sharedStateKeys = okeys(partialSharedState);
  var cacheKey = cache.getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses);
  var cachedResult = cache.getCache(moduleName, cacheKey);

  if (cachedResult) {
    return {
      sharedStateKeys: sharedStateKeys,
      result: cachedResult
    };
  }

  var targetUKeyMap = {};
  sharedStateKeys.forEach(function (stateKey) {
    var waKey = moduleName + "/" + stateKey; //利用assign不停的去重

    Object.assign(targetUKeyMap, waKey_uKeyMap_[waKey]);
  });
  var uKeys = okeys(targetUKeyMap);
  var belongRefs = [];
  var connectRefs = [];

  var putRef = function putRef(isBelong, ref) {
    isBelong ? belongRefs.push(ref) : connectRefs.push(ref);
  };

  var tryMatch = function tryMatch(ref, toBelong) {
    var _ref$ctx = ref.ctx,
        refRenderKey = _ref$ctx.renderKey,
        refCcClassKey = _ref$ctx.ccClassKey; // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新

    if (renderKey) {
      var isRenderKeyMatched = refRenderKey === renderKey; // 所有的类实例都受renderKey匹配机制影响

      if (renderKeyClasses === '*') {
        if (isRenderKeyMatched) {
          putRef(toBelong, ref);
        }
      } else {
        // 这些指定类实例受renderKey机制影响
        if (renderKeyClasses.includes(refCcClassKey)) {
          if (isRenderKeyMatched) {
            putRef(toBelong, ref);
          }
        } // 这些实例则不受renderKey机制影响
        else {
            putRef(toBelong, ref);
          }
      }
    } else {
      putRef(toBelong, ref);
    }
  };

  uKeys.forEach(function (key) {
    var ref = ccUKey_ref_[key];
    if (!ref) return;
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
    belong: belongRefs,
    connect: connectRefs
  };
  cache.setCache(moduleName, cacheKey, result);
  return {
    sharedStateKeys: sharedStateKeys,
    result: result
  };
}