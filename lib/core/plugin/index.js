"use strict";

exports.__esModule = true;
exports.send = send;
exports.on = on;

var _constant = require("../../support/constant");

var _sig_cbs_;

var sig_cbs_ = (_sig_cbs_ = {}, _sig_cbs_[_constant.SIG_FN_START] = [], _sig_cbs_[_constant.SIG_FN_END] = [], _sig_cbs_[_constant.SIG_FN_QUIT] = [], _sig_cbs_[_constant.SIG_FN_ERR] = [], _sig_cbs_[_constant.SIG_MODULE_CONFIGURED] = [], _sig_cbs_);

function send(sig, payload) {
  var cbs = sig_cbs_[sig];
  cbs.forEach(function (cb) {
    cb({
      sig: sig,
      payload: payload
    });
  });
}

function on(sigOrSigs, cb) {
  function pushCb(sig, cb) {
    var cbs = sig_cbs_[sig];

    if (!cbs) {
      console.warn("invalid sig[" + sig + "]");
      return;
    }

    cbs.push(cb);
  }

  if (Array.isArray(sigOrSigs)) {
    sigOrSigs.forEach(function (sig) {
      pushCb(sig, cb);
    });
  } else {
    pushCb(sigOrSigs, cb);
  }
}