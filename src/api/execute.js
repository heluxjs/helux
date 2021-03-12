
import getRefs from '../core/ref/get-refs';

export default (ccClassKey, ...args) => {
  const refs = getRefs(ccClassKey);
  refs.forEach(ref => {
    if (ref.ctx.execute) ref.ctx.execute(...args);
  });
}
