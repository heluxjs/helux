import pickOneRef from '../core/ref/pick-one-ref';

export default function (moduledKeyPath, val, renderKey, delay) {
  const dispatcher = pickOneRef();
  dispatcher.ctx.set(moduledKeyPath, val, renderKey, delay);
}