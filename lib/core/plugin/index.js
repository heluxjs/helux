"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.send = send;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

function send(sig, payload) {
  var plugins = _ccContext["default"].plugins;
  plugins.forEach(function (p) {
    if (p.subscribe) p.subscribe(sig, payload);
  });
}