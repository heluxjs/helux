
import getRefs from '../core/ref/get-refs';

export default ()=>{
  const refs = getRefs();
  refs.forEach(ref=>{
    if(ref.$$execute)ref.$$execute();
  });
}