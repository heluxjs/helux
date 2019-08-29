
import getRefsByClassKey from '../core/ref/get-refs-by-class-key';

export default (ccClassKey, ...args) => {
  const refs = getRefsByClassKey(ccClassKey);
  refs.forEach(ref => {
    if (ref.__$$isUnmounted) return;
    if (ref.ctx.execute) ref.ctx.execute(...args);
  });
}