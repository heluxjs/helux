"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _getFeatureStr = _interopRequireDefault(require("./get-feature-str"));

var _getCcClasskey = _interopRequireDefault(require("../param/get-cc-classkey"));

var _getRdkeyClasses = _interopRequireDefault(require("../param/get-rdkey-classes"));

var checker = _interopRequireWildcard(require("../param/checker"));

var ex = _interopRequireWildcard(require("../param/extractor"));

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var ccClassKey_ccClassContext_ = _ccContext["default"].ccClassKey_ccClassContext_;

function checkCcStartupOrNot() {
  if (_ccContext["default"].isStartup !== true) {
    throw new Error('you must startup cc by call startup method before register ReactClass to cc!');
  }
}
/**
 * map registration info to ccContext
 */


function _default(module, ccClassKey, regRenderKeyClasses, classKeyPrefix, regWatchedKeys, regConnect, __checkStartUp, __calledBy) {
  if (module === void 0) {
    module = _constant.MODULE_DEFAULT;
  }

  if (__checkStartUp === true) checkCcStartupOrNot();
  var allowNamingDispatcher = __calledBy === 'cc';
  var renderKeyClasses = regRenderKeyClasses || [];
  checker.checkModuleName(module, false, "module[" + module + "] not configured");
  checker.checkRenderKeyClasses(renderKeyClasses);

  var _connect = ex.getConnect(regConnect);

  var _watchedKeys = ex.getWatchedStateKeys(module, ccClassKey, regWatchedKeys); // 注意此处用户不指定renderKeyClasses时，算出来的特征值和renderKeyClasses无关


  var featureStr = (0, _getFeatureStr["default"])(module, _connect, renderKeyClasses);

  var _ccClassKey = (0, _getCcClasskey["default"])(allowNamingDispatcher, module, _connect, classKeyPrefix, featureStr, ccClassKey); // 此处再次获得真正的renderKeyClasses


  var _renderKeyClasses = (0, _getRdkeyClasses["default"])(_ccClassKey, regRenderKeyClasses);

  var ccClassContext = ccClassKey_ccClassContext_[_ccClassKey]; //做一个判断，有可能是热加载调用

  if (!ccClassContext) {
    ccClassContext = util.makeCcClassContext(module, _ccClassKey, _renderKeyClasses);
    ccClassKey_ccClassContext_[_ccClassKey] = ccClassContext;
  }

  return {
    _module: module,
    _connect: _connect,
    _ccClassKey: _ccClassKey,
    _watchedKeys: _watchedKeys
  };
}