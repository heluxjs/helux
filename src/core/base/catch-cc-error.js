import ccContext from '../../cc-context';

export default err=>{
  if(ccContext.errorHandler)ccContext.errorHandler(err);
  else throw err;
}