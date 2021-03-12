
import getRefs from '../core/ref/get-refs';

export default (filters, ...args) => {
  const refs = getRefs(filters);
  refs.forEach(ref => {
    if (ref.ctx.execute) ref.ctx.execute(...args);
  });
}
