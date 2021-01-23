import {
  SIG_FN_START,
  SIG_FN_END,
  SIG_FN_QUIT,
  SIG_FN_ERR,
  SIG_MODULE_CONFIGURED,
  SIG_STATE_CHANGED,
  SIG_ASYNC_COMPUTED_START,
  SIG_ASYNC_COMPUTED_END,
  SIG_ASYNC_COMPUTED_ERR,
  SIG_ASYNC_COMPUTED_BATCH_START,
  SIG_ASYNC_COMPUTED_BATCH_END,
} from '../../support/constant';
import ccContext from '../../cc-context';

const sigs = [
  SIG_FN_START,
  SIG_FN_END,
  SIG_FN_QUIT,
  SIG_FN_ERR,
  SIG_MODULE_CONFIGURED,
  SIG_STATE_CHANGED,
  SIG_ASYNC_COMPUTED_START,
  SIG_ASYNC_COMPUTED_END,
  SIG_ASYNC_COMPUTED_ERR,
  SIG_ASYNC_COMPUTED_BATCH_START,
  SIG_ASYNC_COMPUTED_BATCH_END,
];

const sig2cbs = {};

sigs.forEach(sig => sig2cbs[sig] = []);

function _pushSigCb(sigMap, sigOrSigs, cb) {
  function pushCb(sig, cb) {
    const cbs = sigMap[sig];
    if (cb) {
      cbs.push(cb);
    } else {
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
  sigs.forEach(sig => sig2cbs[sig].length = 0);
}

export function send(sig, payload) {
  try {
    const cbs = sig2cbs[sig];
    cbs.forEach(cb => cb({ sig, payload }));
  } catch (err) {
    // plugin error should not abort dispatch process
    ccContext.runtimeHandler.tryHandleError(err, true);
  }
}

export function on(sigOrSigs, cb) {
  _pushSigCb(sig2cbs, sigOrSigs, cb)
}
