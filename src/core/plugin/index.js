import {
  SIG_FN_START,
  SIG_FN_END,
  SIG_FN_QUIT,
  SIG_FN_ERR,
  SIG_MODULE_CONFIGURED
} from '../../support/constant';

const sig_cbs_ = {
  [SIG_FN_START]: [],
  [SIG_FN_END]: [],
  [SIG_FN_QUIT]: [],
  [SIG_FN_ERR]: [],
  [SIG_MODULE_CONFIGURED]: [],
};

export function send(sig, payload) {
  const cbs = sig_cbs_[sig];
  cbs.forEach(cb => {
    cb({ sig, payload });
  });
}

export function on(sigOrSigs, cb) {
  function pushCb(sig, cb) {
    const cbs = sig_cbs_[sig];
    if (!cbs) {
      console.warn(`invalid sig[${sig}]`);
      return
    }
    cbs.push(cb);
  }

  if (Array.isArray(sigOrSigs)) {
    sigOrSigs.forEach(sig => {
      pushCb(sig, cb)
    })
  } else {
    pushCb(sigOrSigs, cb)
  }
}
