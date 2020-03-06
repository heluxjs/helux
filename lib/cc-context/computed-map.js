"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _constant = require("../support/constant");

var _computedValue2;

var _computedValue = (_computedValue2 = {}, _computedValue2[_constant.MODULE_GLOBAL] = {}, _computedValue2[_constant.MODULE_DEFAULT] = {}, _computedValue2[_constant.MODULE_CC] = {}, _computedValue2);

var _computedDep = {};
var _computedRaw = {};
var _default = {
  _computedValue: _computedValue,
  _computedRaw: _computedRaw,
  _computedDep: _computedDep,
  getRootComputedValue: function getRootComputedValue() {
    return _computedValue;
  },
  getRootComputedDep: function getRootComputedDep() {
    return _computedDep;
  },
  getRootComputedRaw: function getRootComputedRaw() {
    return _computedRaw;
  }
};
exports["default"] = _default;