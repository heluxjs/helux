"use strict";

exports.__esModule = true;
exports.clearCbs = clearCbs;
exports.send = send;
exports.on = on;
exports.onOnce = onOnce;
exports.offOnce = offOnce;

var _constant = require("../../support/constant");

var sigs = [_constant.SIG_FN_START, _constant.SIG_FN_END, _constant.SIG_FN_QUIT, _constant.SIG_FN_ERR, _constant.SIG_MODULE_CONFIGURED, _constant.SIG_STATE_CHANGED];
var sig_cbs_ = {};
var sig_OnceCbs_ = {};
var seq = 1;
sigs.forEach(function (sig) {
  return sig_cbs_[sig] = [];
});
sigs.forEach(function (sig) {
  return sig_OnceCbs_[sig] = [];
});

function _getOnceCbs(sig) {
  var cbs = sig_OnceCbs_[sig].slice();
  sig_OnceCbs_[sig].length = 0;
  return cbs;
}

function _pushSigCb(sigMap, sigOrSigs, cb) {
  function pushCb(sig, cb) {
    var cbs = sigMap[sig];

    if (cb) {
      cbs.push(cb);
    } else {
      console.warn("invalid sig[" + sig + "]");
    }
  }

  if (Array.isArray(sigOrSigs)) {
    sigOrSigs.forEach(function (sig) {
      pushCb(sig, cb);
    });
  } else {
    pushCb(sigOrSigs, cb);
  }
}

function clearCbs() {
  sigs.forEach(function (sig) {
    return sig_cbs_[sig].length = 0;
  });
}

function send(sig, payload) {
  var cbs = sig_cbs_[sig];
  cbs.forEach(function (cb) {
    return cb({
      sig: sig,
      payload: payload
    });
  });

  var onceCbs = _getOnceCbs(sig);

  onceCbs.forEach(function (cb) {
    return cb({
      sig: sig,
      payload: payload
    });
  });
}

function on(sigOrSigs, cb) {
  _pushSigCb(sig_cbs_, sigOrSigs, cb);
}

function onOnce(sig, cb) {
  if (cb) {
    cb.__seq = seq++;

    _pushSigCb(sig_OnceCbs_, sig, cb);
  }
}

function offOnce(sig, cb) {
  var cbSeq = cb && cb.__seq;

  if (cbSeq) {
    var cbs = sig_OnceCbs_[sig];
    var cbIdx = cbs.findIndex(function (v) {
      return v.__seq === cbSeq;
    });
    cbs.splice(cbIdx, 1);
  }
}