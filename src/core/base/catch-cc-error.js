import runtimeHandler from '../../cc-context/runtime-handler';
import { justTip } from '../../support/util';

export default err => {
  const errorHandler = runtimeHandler.errorHandler;
  if (errorHandler) errorHandler(err);
  else {
    justTip('found uncaught err from cc core, suggest config an errorHandler in run options');
    console.log(err);
    throw err;
  }
}
