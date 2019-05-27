"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.unsetRef = exports.setRef = exports.pickOneRef = exports.getDispatcherRef = void 0;

var _getDispatcherRef = _interopRequireDefault(require("./get-dispatcher-ref"));

exports.getDispatcherRef = _getDispatcherRef["default"];

var _pickOneRef = _interopRequireDefault(require("./pick-one-ref"));

exports.pickOneRef = _pickOneRef["default"];

var _setRef = _interopRequireDefault(require("./set-ref"));

exports.setRef = _setRef["default"];

var _unsetRef = _interopRequireDefault(require("./unset-ref"));

exports.unsetRef = _unsetRef["default"];