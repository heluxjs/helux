import ccContext from '../../cc-context';
export default (function (err) {
  if (ccContext.errorHandler) ccContext.errorHandler(err);else throw err;
});