"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var _privConstant = require("../../support/priv-constant");

var _util = require("../../support/util");

var cache = _interopRequireWildcard(require("./_cache"));

function _default(ref) {
  var ctx = ref.ctx;
  var refModule = ctx.module,
      connectedModules = ctx.connectedModules; // 不存在自动收集行为

  if (ctx.__$$noAutoWatch) {
    return;
  }

  ctx.__$$renderStatus = _privConstant.END;

  var oldWaKeysStr = ctx.__$$preparedWatchedKeys.sort().join(',');

  ctx.__$$preparedWatchedKeys = (0, _util.okeys)(ctx.__$$collectingWatchedKeys_); //比较变化，如果已经有变动则让find缓存结果失效

  var newWaKeysStr = ctx.__$$preparedWatchedKeys.sort().join(',');

  if (newWaKeysStr !== oldWaKeysStr) {
    cache.createModuleNode(refModule);
  } // cmwMap的值取出来逐个转为list


  var oldPrepared = ctx.__$$preparedConnectWatchedKeys_;
  var cmwMap = ctx.__$$collectingModuleWatchedKeys_;
  var newMap = {};
  connectedModules.forEach(function (m) {
    var newWaKeys = (0, _util.okeys)(cmwMap[m] || []);
    var oldWaKeys = oldPrepared[m] || [];

    if (oldWaKeys) {
      var _oldWaKeysStr = oldWaKeys.sort().join(',');

      var _newWaKeysStr = newWaKeys.sort().join(',');

      if (_oldWaKeysStr !== _newWaKeysStr) {
        cache.createModuleNode(m);
      }
    }

    newMap[m] = newWaKeys;
  });
  ctx.__$$preparedConnectWatchedKeys_ = newMap; //清空

  ctx.__$$collectingModuleWatchedKeys_ = ctx.__$$getEmptyCMWKeys();
  ctx.__$$collectingWatchedKeys_ = {};
}