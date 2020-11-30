
import getRefs from '../core/ref/get-refs';

export default (...args) => {
  const refs = getRefs();
  refs.forEach(ref => {
    if (ref.ctx.execute) ref.ctx.execute(...args);
  });
}
