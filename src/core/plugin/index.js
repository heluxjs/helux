import {
  SIG_FN_START,
  SIG_FN_END,
  SIG_FN_QUIT,
  SIG_FN_ERR,
  SIG_MODULE_CONFIGURED,
  SIG_STATE_CHANGED
} from '../../support/constant';

const sigs = [
  SIG_FN_START, 
  SIG_FN_END, 
  SIG_FN_QUIT, 
  SIG_FN_ERR, 
  SIG_MODULE_CONFIGURED,
  SIG_STATE_CHANGED,
];

const sig_cbs_ = {};

sigs.forEach(sig => sig_cbs_[sig] = []);

function _pushSigCb(sigMap, sigOrSigs, cb){
  function pushCb(sig, cb) {
    const cbs = sigMap[sig];
    if(cb){
      cbs.push(cb);
    }else{
      console.warn(`invalid sig[${sig}]`);
    }
  }

  if (Array.isArray(sigOrSigs)) {
    sigOrSigs.forEach(sig => {
      pushCb(sig, cb);
    })
  } else {
    pushCb(sigOrSigs, cb);
  }
}

export function clearCbs() {
  sigs.forEach(sig => sig_cbs_[sig].length = 0);
}

export function send(sig, payload) {
  const cbs = sig_cbs_[sig];
  cbs.forEach(cb => cb({ sig, payload }));
}

export function on(sigOrSigs, cb) {
  _pushSigCb(sig_cbs_, sigOrSigs, cb)
}
