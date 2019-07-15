"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.send = send;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _constant = require("../../support/constant");

function send(sig, payload) {
  var plugins = _ccContext["default"].plugins;
  if (payload.calledBy === _constant.INVOKE) return;
  plugins.forEach(function (p) {
    if (p.receive) p.receive(sig, payload);
  });
}