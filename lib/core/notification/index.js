"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.send = send;
exports.subscribe = subscribe;

var util = _interopRequireWildcard(require("../../support/util"));

var type_cbs_ = {};

function send(type, payload) {
  var cbs = util.safeGetArrayFromObject(type_cbs_, type);
  cbs.forEach(function (cb) {
    cb(payload);
  });
}

function subscribe(type, cb) {
  var cbs = util.safeGetArrayFromObject(type_cbs_, type);
  cbs.push(cb);
}