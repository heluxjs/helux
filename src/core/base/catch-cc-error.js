import runtimeHandler from '../../cc-context/runtime-handler';

export default err => {
  const errorHandler = runtimeHandler.errorHandler;
  if (errorHandler) errorHandler(err);
  else throw err;
}