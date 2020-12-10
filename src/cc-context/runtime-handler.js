import { justWarning } from '../support/util';

const defaultErrorHandler = (err) => {
  console.error('found uncaught err, suggest config an errorHandler in run options');
  console.error(err);
  throw err;
};

const rh = {
  act: null,
  errorHandler: null,
  warningHandler: null,
  tryHandleError: (err) => rh.errorHandler ? rh.errorHandler(err) : defaultErrorHandler(err),
  tryHandleWarning: (err) => {
    // this kind of error will not lead to app crash, but should let developer know it
    justWarning(err);
    rh.warningHandler && rh.warningHandler(err);
  },
};

export default rh;
