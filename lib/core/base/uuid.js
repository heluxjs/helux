"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _currentIndex = 0;
var letters = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'];

function genNonceStr(length) {
  if (length === void 0) {
    length = 6;
  }

  var ret = '';

  for (var i = 0; i < length; i++) {
    ret += letters[(0, _util.randomNumber)()];
  }

  return ret;
}

function _default(forFragment, tag) {
  if (forFragment === void 0) {
    forFragment = false;
  }

  var prefix = forFragment === true ? 'CCF' : 'CC';
  _currentIndex++;
  var nonceStr = tag || genNonceStr(); // return `${prefix}_${Date.now()}_${nonceStr}_${_currentIndex}`;

  return prefix + "_" + nonceStr + "_" + _currentIndex;
}