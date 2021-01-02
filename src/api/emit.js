import pickOneRef from '../core/ref/pick-one-ref';

export default function (event, ...args) {
  if (!event) return;
  const ref = pickOneRef();
  if (ref) ref.ctx.emit(event, ...args);
}
