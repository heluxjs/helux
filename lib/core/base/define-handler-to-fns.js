"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

function _default(item, handler, fns, immediateKeys) {
  var itype = typeof item;

  if (itype === 'object') {
    (0, _util.okeys)(item).forEach(function (key) {
      return fns[key] = item[key];
    });
  } else if (itype === 'function') {
    var ret = item(this);

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