import { justWarning, logWarn, logErr } from '../support/util';
import rv from './runtime-var';

const defaultErrorHandler = (err, silent = false) => {
  const logFn = rv.isDebug ? logWarn : logErr;
  // 避免travis 发现 error打印就导致test用例不通过
  logFn('found uncaught err, suggest configure an errorHandler in run options');
  logFn(err);
  if (!silent) throw err;
};

const rh = {
  act: null,
  errorHandler: null,
  warningHandler: null,
  tryHandleError: (err, silent) => {
    rh.errorHandler ? rh.errorHandler(err) : defaultErrorHandler(err, silent)
  },
  tryHandleWarning: (err) => {
    // this kind of error will not lead to app crash, but should let developer know
    justWarning(err);
    rh.warningHandler && rh.warningHandler(err);
  },
};

export default rh;
