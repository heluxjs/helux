/** @typedef {import('../types-inner').IRef} Ref */
import pickOneRef from '../core/ref/pick-one-ref';

export default function (event, offOptions) {
  /** @type {Ref} */
  const ref = pickOneRef();
  if (ref) ref.ctx.off(event, offOptions);
}
