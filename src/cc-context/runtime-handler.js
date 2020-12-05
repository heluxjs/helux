
const defaultErrorHandler = (err) => {
  console.error('found uncaught err, suggest config an errorHandler in run options');
  console.error(err);
  throw err;
};

const rh = {
  errorHandler: null,
  tryHandleError: (err) => rh.errorHandler ? rh.errorHandler(err) : defaultErrorHandler(err),
};

export default rh;
