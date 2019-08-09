"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

function _default(refCtx, item, handler, fns, immediateKeys) {
  var itype = typeof item;

  if (itype === 'object') {
    if (Array.isArray(item)) {
      // handler._fnName = getFnName();//给函数标记一个名词，方便后面触发trigger时使用
      throw new Error('not support multi keys currently');
    } else {
      (0, _util.okeys)(item).forEach(function (key) {
        return fns[key] = item[key];
      });
    }
  } else if (itype === 'function') {
    var ret = item(refCtx);

    if (typeof ret === 'object') {
      (0, _util.okeys)(ret).forEach(function (key) {
        return fns[key] = ret[key];
      });
    }
  } else if (itype === 'string') {
    var key = item;
    fns[key] = handler;
    if (immediateKeys) immediateKeys.push(key);
  }
}

;